import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { getApiAuthPayload } from '@/lib/auth';
import { sendVendorApprovalEmail } from '@/lib/email';
import { generateVendorPasswordSetupToken } from '@/lib/vendorPasswordSetup';
import { getVendorPasswordSetupUrl, getVendorLoginUrl, getVendorDashboardUrl } from '@/lib/appUrl';
import { invalidateCatalogCache } from '@/lib/catalog';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: Request) {
  try {
    let email: string | undefined;

    const session = await getServerSession(authOptions).catch(() => null);
    if (session?.user?.email) {
      email = session.user.email;
    } else {
      const authPayload = await getApiAuthPayload(request).catch(() => null);
      if (authPayload?.email) {
        email = authPayload.email;
      }
    }

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true }
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, ...payloadData } = body;
    const payload = body.payload || payloadData;

    switch (action) {
      // ==========================================
      // 1. PRODUCT VENDORS MANAGEMENT
      // ==========================================
      case 'APPROVE_VENDOR': {
        const vendorId = Number(payload?.vendorId || body?.vendorId);
        if (!vendorId || isNaN(vendorId)) {
          return NextResponse.json({ error: 'Valid vendorId is required' }, { status: 400 });
        }

        // 1. Fetch vendor and verified user credentials directly from PostgreSQL (Never trust frontend-supplied email)
        const existingProfile = await prisma.vendorProfile.findUnique({
          where: { id: vendorId },
          include: { user: true }
        });

        if (!existingProfile) {
          return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 });
        }

        // 2. Generate clean URL slug for public shop page if not present
        const generatedSlug = existingProfile.slug || 
          slugify(existingProfile.businessName || `vendor-${existingProfile.id}`);

        // 3. Update Vendor Status to APPROVED in database & promote User role to VENDOR
        const vp = await prisma.vendorProfile.update({
          where: { id: existingProfile.id },
          data: { 
            status: 'APPROVED',
            slug: generatedSlug
          }
        });

        await prisma.user.update({
          where: { id: vp.userId },
          data: { role: 'VENDOR' }
        });

        // 4. Determine verified registered email address
        const recipientEmail = existingProfile.user?.email || existingProfile.email;
        let emailDispatched = false;
        let emailErrorMsg: string | null = null;
        let passwordSetupUrl: string | undefined;

        // 5. Duplicate Prevention & Automatic Email Dispatch
        const shouldSendEmail = Boolean(recipientEmail) && (!existingProfile.approvalEmailSent || payload.retryEmail === true);

        if (shouldSendEmail && recipientEmail && existingProfile.user) {
          try {
            // Generate unique, time-limited, single-use password setup token
            const setupToken = generateVendorPasswordSetupToken({
              userId: existingProfile.user.id,
              vendorId: existingProfile.id,
              email: recipientEmail,
              currentPasswordHash: existingProfile.user.password,
              vendorStatus: 'APPROVED',
            });
            passwordSetupUrl = getVendorPasswordSetupUrl(setupToken, request);
            const loginUrl = getVendorLoginUrl(request);
            const dashboardUrl = getVendorDashboardUrl(request);

            const emailResult = await sendVendorApprovalEmail({
              to: recipientEmail,
              vendorName: existingProfile.ownerName || existingProfile.user?.name || undefined,
              shopName: existingProfile.businessName || 'Femazon Partner Boutique',
              vendorId: existingProfile.id,
              passwordSetupUrl,
              loginUrl,
              dashboardUrl,
              supportEmail: process.env.SUPPORT_EMAIL || 'support@femazon.com'
            });

            if (emailResult.success) {
              emailDispatched = true;
              await prisma.vendorProfile.update({
                where: { id: existingProfile.id },
                data: {
                  approvalEmailSent: true,
                  approvalEmailSentAt: new Date(),
                  approvalEmailError: null
                }
              });
            } else {
              emailErrorMsg = emailResult.error || 'Email dispatch failed';
              await prisma.vendorProfile.update({
                where: { id: existingProfile.id },
                data: {
                  approvalEmailError: emailErrorMsg
                }
              });
            }
          } catch (err: any) {
            console.error('[Vendor Approval Email Dispatch Exception]:', err);
            emailErrorMsg = err?.message || 'Unexpected exception during email dispatch';
            await prisma.vendorProfile.update({
              where: { id: existingProfile.id },
              data: {
                approvalEmailError: emailErrorMsg
              }
            }).catch(() => {});
          }
        } else if (!recipientEmail) {
          console.warn(`[Vendor Approval Warning] Vendor #${existingProfile.id} has no registered email.`);
          await prisma.vendorProfile.update({
            where: { id: existingProfile.id },
            data: {
              approvalEmailError: 'No registered email found on account'
            }
          }).catch(() => {});
        }

        return NextResponse.json({ 
          success: true,
          message: 'Vendor approved successfully. Approval email and password setup link dispatched.',
          passwordSetupUrl,
          vendor: {
            id: vp.id,
            businessName: vp.businessName,
            status: vp.status,
            slug: vp.slug,
            email: recipientEmail,
            approvalEmailSent: emailDispatched || existingProfile.approvalEmailSent,
            emailError: emailErrorMsg
          }
        });
      }

      case 'RESEND_APPROVAL_EMAIL': {
        const vendorId = Number(payload?.vendorId || body?.vendorId);
        if (!vendorId || isNaN(vendorId)) {
          return NextResponse.json({ error: 'Valid vendorId is required' }, { status: 400 });
        }

        const vendor = await prisma.vendorProfile.findUnique({
          where: { id: vendorId },
          include: { user: true }
        });

        if (!vendor) {
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        const recipientEmail = vendor.user?.email || vendor.email;
        if (!recipientEmail || !vendor.user) {
          return NextResponse.json({ error: 'Vendor has no registered user/email address' }, { status: 400 });
        }

        // Generate a fresh setup token
        const setupToken = generateVendorPasswordSetupToken({
          userId: vendor.user.id,
          vendorId: vendor.id,
          email: recipientEmail,
          currentPasswordHash: vendor.user.password,
          vendorStatus: vendor.status || 'APPROVED',
        });
        const passwordSetupUrl = getVendorPasswordSetupUrl(setupToken, request);
        const loginUrl = getVendorLoginUrl(request);
        const dashboardUrl = getVendorDashboardUrl(request);

        const result = await sendVendorApprovalEmail({
          to: recipientEmail,
          vendorName: vendor.ownerName || vendor.user?.name || undefined,
          shopName: vendor.businessName || 'Femazon Partner Boutique',
          vendorId: vendor.id,
          passwordSetupUrl,
          loginUrl,
          dashboardUrl,
          supportEmail: process.env.SUPPORT_EMAIL || 'support@femazon.com'
        });

        if (result.success) {
          await prisma.vendorProfile.update({
            where: { id: vendor.id },
            data: {
              approvalEmailSent: true,
              approvalEmailSentAt: new Date(),
              approvalEmailError: null
            }
          });
          return NextResponse.json({ 
            success: true, 
            message: 'Approval email dispatched successfully with password setup link',
            passwordSetupUrl
          });
        } else {
          await prisma.vendorProfile.update({
            where: { id: vendor.id },
            data: { approvalEmailError: result.error || 'Failed to dispatch email' }
          });
          return NextResponse.json({ success: false, error: result.error || 'Failed to send email' }, { status: 500 });
        }
      }

      case 'GET_VENDOR_SETUP_LINK': {
        const vendorId = Number(payload?.vendorId || body?.vendorId);
        if (!vendorId || isNaN(vendorId)) {
          return NextResponse.json({ error: 'Valid vendorId is required' }, { status: 400 });
        }

        const vendor = await prisma.vendorProfile.findUnique({
          where: { id: vendorId },
          include: { user: true }
        });

        if (!vendor || !vendor.user) {
          return NextResponse.json({ error: 'Vendor profile or user account not found' }, { status: 404 });
        }

        const setupToken = generateVendorPasswordSetupToken({
          userId: vendor.user.id,
          vendorId: vendor.id,
          email: vendor.user.email,
          currentPasswordHash: vendor.user.password,
          vendorStatus: vendor.status,
        });
        const setupUrl = getVendorPasswordSetupUrl(setupToken, request);

        return NextResponse.json({
          success: true,
          setupUrl,
          email: vendor.user.email,
          status: vendor.status,
        });
      }

      case 'REJECT_VENDOR': {
        await prisma.vendorProfile.update({
          where: { id: Number(payload.vendorId) },
          data: { status: 'REJECTED' }
        });
        return NextResponse.json({ success: true, message: 'Vendor rejected' });
      }

      case 'SUSPEND_VENDOR': {
        await prisma.vendorProfile.update({
          where: { id: Number(payload.vendorId) },
          data: { status: 'SUSPENDED' }
        });
        return NextResponse.json({ success: true, message: 'Vendor suspended' });
      }

      case 'ACTIVATE_VENDOR': {
        await prisma.vendorProfile.update({
          where: { id: Number(payload.vendorId) },
          data: { status: 'APPROVED' }
        });
        return NextResponse.json({ success: true, message: 'Vendor activated' });
      }

      case 'UPDATE_VENDOR': {
        const updated = await prisma.vendorProfile.update({
          where: { id: Number(payload.vendorId) },
          data: {
            businessName: payload.businessName,
            ownerName: payload.ownerName,
            phone: payload.phone,
            address: payload.address,
            businessCategory: payload.businessCategory,
            gstNumber: payload.gstNumber,
            description: payload.description
          }
        });
        return NextResponse.json({ success: true, vendor: updated });
      }

      // ==========================================
      // 2. PERSONAL STYLISTS (SERVICE PROVIDERS)
      // ==========================================
      case 'APPROVE_STYLIST': {
        await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: {
            status: 'APPROVED',
            verified: true,
            isActive: true,
            rejectionReason: null
          }
        });
        return NextResponse.json({ success: true, message: 'Stylist approved and verified' });
      }

      case 'REJECT_STYLIST': {
        await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: {
            status: 'REJECTED',
            verified: false,
            rejectionReason: payload.rejectionReason || 'Application does not meet platform requirements'
          }
        });
        return NextResponse.json({ success: true, message: 'Stylist application rejected' });
      }

      case 'SUSPEND_STYLIST': {
        await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: {
            isActive: false,
            status: 'SUSPENDED'
          }
        });
        return NextResponse.json({ success: true, message: 'Stylist profile suspended' });
      }

      case 'ACTIVATE_STYLIST': {
        await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: {
            isActive: true,
            status: 'APPROVED'
          }
        });
        return NextResponse.json({ success: true, message: 'Stylist profile activated' });
      }

      case 'TOGGLE_STYLIST_FEATURED': {
        const current = await prisma.stylistProfile.findUnique({
          where: { id: Number(payload.stylistId) },
          select: { featured: true }
        });
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: { featured: !current?.featured }
        });
        return NextResponse.json({ success: true, featured: updated.featured });
      }

      case 'UPDATE_STYLIST': {
        const updated = await prisma.stylistProfile.update({
          where: { id: Number(payload.stylistId) },
          data: {
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            city: payload.city,
            location: payload.location,
            experience: payload.experience,
            experienceYears: Number(payload.experienceYears) || 0,
            bio: payload.bio,
            specializations: typeof payload.specializations === 'string' ? payload.specializations : JSON.stringify(payload.specializations || []),
            availabilitySchedule: payload.availabilitySchedule,
            commissionRate: payload.commissionRate !== undefined ? Number(payload.commissionRate) : undefined,
          }
        });
        return NextResponse.json({ success: true, stylist: updated });
      }

      // ==========================================
      // 3. VENDOR PRODUCTS (MONITORING & APPROVAL)
      // ==========================================
      case 'APPROVE_PRODUCT': {
        await prisma.product.update({
          where: { id: Number(payload.productId) },
          data: { approvalStatus: 'APPROVED' }
        });
        invalidateCatalogCache();
        return NextResponse.json({ success: true, message: 'Vendor product approved' });
      }

      case 'REJECT_PRODUCT': {
        await prisma.product.update({
          where: { id: Number(payload.productId) },
          data: { approvalStatus: 'REJECTED' }
        });
        invalidateCatalogCache();
        return NextResponse.json({ success: true, message: 'Vendor product rejected' });
      }

      case 'TOGGLE_PRODUCT_ACTIVE': {
        const current = await prisma.product.findUnique({
          where: { id: Number(payload.productId) },
          select: { approvalStatus: true }
        });
        const newStatus = current?.approvalStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
        const updated = await prisma.product.update({
          where: { id: Number(payload.productId) },
          data: { approvalStatus: newStatus }
        });
        invalidateCatalogCache();
        return NextResponse.json({ success: true, approvalStatus: updated.approvalStatus });
      }

      case 'CREATE_PRODUCT': {
        const slug = (payload.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const mainImage = payload.image || (payload.images && payload.images.length > 0 ? payload.images[0] : "");
        const imagesJson = payload.images ? JSON.stringify(payload.images) : JSON.stringify(mainImage ? [mainImage] : []);
        const sizesJson = Array.isArray(payload.sizes) ? JSON.stringify(payload.sizes) : payload.sizes ? JSON.stringify([payload.sizes]) : JSON.stringify(["M", "L", "XL"]);
        const colorsJson = Array.isArray(payload.colors) ? JSON.stringify(payload.colors) : payload.color ? JSON.stringify([payload.color]) : JSON.stringify(["Green"]);

        const nativeProduct = await prisma.product.create({
          data: {
            name: payload.name,
            slug: slug,
            description: payload.description || "",
            price: Math.round(Number(payload.price)),
            discountPrice: payload.discountPrice ? Math.round(Number(payload.discountPrice)) : null,
            stock: Math.round(Number(payload.stock || 25)),
            category: payload.category || "Chudithar",
            subcategory: payload.pattern || payload.subcategory || "A-Line Pattern",
            dressType: payload.pattern || "A-Line Pattern",
            image: mainImage,
            images: imagesJson,
            sizes: sizesJson,
            colors: colorsJson,
            approvalStatus: 'APPROVED'
          }
        });
        return NextResponse.json(nativeProduct);
      }

      case 'UPDATE_PRODUCT': {
        const mainImage = payload.image || (payload.images && payload.images.length > 0 ? payload.images[0] : undefined);
        const imagesJson = payload.images ? JSON.stringify(payload.images) : undefined;
        const sizesJson = Array.isArray(payload.sizes) ? JSON.stringify(payload.sizes) : undefined;
        const colorsJson = Array.isArray(payload.colors) ? JSON.stringify(payload.colors) : payload.color ? JSON.stringify([payload.color]) : undefined;

        const updatedProduct = await prisma.product.update({
          where: { id: Number(payload.productId || payload.id) },
          data: {
            name: payload.name,
            description: payload.description,
            price: payload.price !== undefined ? Math.round(Number(payload.price)) : undefined,
            discountPrice: payload.discountPrice !== undefined ? (payload.discountPrice ? Math.round(Number(payload.discountPrice)) : null) : undefined,
            stock: payload.stock !== undefined ? Math.round(Number(payload.stock)) : undefined,
            category: payload.category,
            subcategory: payload.pattern || payload.subcategory,
            dressType: payload.pattern,
            image: mainImage,
            images: imagesJson,
            sizes: sizesJson,
            colors: colorsJson,
            approvalStatus: payload.approvalStatus || 'APPROVED'
          }
        });
        return NextResponse.json(updatedProduct);
      }

      case 'DELETE_PRODUCT': {
        await prisma.product.delete({
          where: { id: Number(payload.productId || payload.id) }
        });
        return NextResponse.json({ success: true, message: 'Product removed' });
      }

      // ==========================================
      // 4. ORDERS MANAGEMENT
      // ==========================================
      case 'UPDATE_ORDER_STATUS': {
        const orderId = Number(payload.orderId);
        const updateData: any = {};
        if (payload.status) updateData.status = payload.status;
        if (payload.remarks !== undefined) updateData.remarks = payload.remarks;
        if (payload.dueDate !== undefined) updateData.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
        if (payload.deliveredOn !== undefined) updateData.deliveredOn = payload.deliveredOn ? new Date(payload.deliveredOn) : null;
        if (payload.status === 'DELIVERED' && !payload.deliveredOn) updateData.deliveredOn = new Date();

        const updated = await prisma.order.update({
          where: { id: orderId },
          data: updateData
        });
        return NextResponse.json({ success: true, order: updated });
      }

      // ==========================================
      // 5. BOOKINGS MANAGEMENT (STYLIST BOOKINGS)
      // ==========================================
      case 'UPDATE_STYLIST_BOOKING_STATUS': {
        const bookingId = Number(payload.bookingId);
        const updated = await prisma.stylistBooking.update({
          where: { id: bookingId },
          data: { status: payload.status }
        });
        return NextResponse.json({ success: true, booking: updated });
      }

      case 'UPDATE_BOOKING_STATUS': {
        await prisma.serviceBooking.update({
          where: { id: Number(payload.bookingId) },
          data: { status: payload.status }
        });
        return NextResponse.json({ success: true });
      }

      // ==========================================
      // 6. CUSTOMERS & SYSTEM
      // ==========================================
      case 'DELETE_USER': {
        const targetUserId = Number(payload.userId);
        if (targetUserId === admin.id) {
          return NextResponse.json({ error: 'Cannot delete the current active administrator' }, { status: 400 });
        }
        await prisma.user.delete({
          where: { id: targetUserId }
        });
        return NextResponse.json({ success: true, message: 'User deleted' });
      }

      case 'CREATE_CATEGORY': {
        const slug = (payload.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const cat = await prisma.category.create({
          data: {
            name: payload.name,
            slug,
            description: payload.description
          }
        });
        return NextResponse.json({ success: true, category: cat });
      }

      case 'DELETE_CATEGORY': {
        await prisma.category.delete({
          where: { id: Number(payload.categoryId) }
        });
        return NextResponse.json({ success: true });
      }

      case 'CREATE_SERVICE': {
        const newService = await prisma.service.create({
          data: {
            name: payload.name,
            slug: payload.name.toLowerCase().replace(/ /g, '-'),
            description: payload.description || "",
            basePrice: Number(payload.price) || 0,
            image: payload.image || "",
          }
        });
        return NextResponse.json(newService);
      }

      case 'DELETE_SERVICE': {
        await prisma.service.delete({
          where: { id: Number(payload.serviceId) }
        });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin action error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to perform administrative action' }, { status: 500 });
  }
}
