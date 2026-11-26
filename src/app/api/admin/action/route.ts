import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { getApiAuthPayload } from '@/lib/auth';
import { sendVendorApprovalEmail } from '@/lib/email';
import { generateVendorPasswordSetupToken } from '@/lib/vendorPasswordSetup';
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
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
            
            // Generate unique, time-limited, single-use password setup token
            const setupToken = generateVendorPasswordSetupToken({
              userId: existingProfile.user.id,
              vendorId: existingProfile.id,
              email: recipientEmail,
              currentPasswordHash: existingProfile.user.password,
              vendorStatus: 'APPROVED',
            });
            passwordSetupUrl = `${baseUrl}/vendor/set-password?token=${encodeURIComponent(setupToken)}`;

            const emailResult = await sendVendorApprovalEmail({
              to: recipientEmail,
              vendorName: existingProfile.ownerName || existingProfile.user?.name || undefined,
              shopName: existingProfile.businessName || 'Femazon Partner Boutique',
              vendorId: existingProfile.id,
              passwordSetupUrl,
              loginUrl: `${baseUrl}/vendor/login`,
              dashboardUrl: `${baseUrl}/vendor/dashboard`,
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

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        
        // Generate a fresh setup token
        const setupToken = generateVendorPasswordSetupToken({
          userId: vendor.user.id,
          vendorId: vendor.id,
          email: recipientEmail,
          currentPasswordHash: vendor.user.password,
          vendorStatus: vendor.status || 'APPROVED',
        });
        const passwordSetupUrl = `${baseUrl}/vendor/set-password?token=${encodeURIComponent(setupToken)}`;

        const result = await sendVendorApprovalEmail({
          to: recipientEmail,
          vendorName: vendor.ownerName || vendor.user?.name || undefined,
          shopName: vendor.businessName || 'Femazon Partner Boutique',
          vendorId: vendor.id,
          passwordSetupUrl,
          loginUrl: `${baseUrl}/vendor/login`,
          dashboardUrl: `${baseUrl}/vendor/dashboard`,
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

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const setupToken = generateVendorPasswordSetupToken({
          userId: vendor.user.id,
          vendorId: vendor.id,
          email: vendor.user.email,
          currentPasswordHash: vendor.user.password,
          vendorStatus: vendor.status,
        });
        const setupUrl = `${baseUrl}/vendor/set-password?token=${encodeURIComponent(setupToken)}`;

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
        const prodId = Number(payload.productId || body.productId);
        if (!prodId || isNaN(prodId)) {
          return NextResponse.json({ error: 'Valid productId is required' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
          where: { id: prodId },
          select: { id: true, name: true, vendorId: true }
        });
        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await prisma.product.update({
          where: { id: product.id },
          data: {
            approvalStatus: 'APPROVED',
            rejectionReason: null
          }
        });

        invalidateCatalogCache();

        if (product.vendorId) {
          await prisma.notification.create({
            data: {
              userId: product.vendorId,
              title: `Product Approved: ${product.name}`,
              message: `Congratulations! Your product "${product.name}" has been approved by admin and is now live on the Femazon storefront.`,
              type: 'VENDOR',
              link: '/vendor/products'
            }
          }).catch((err) => console.warn('[Notification Error]:', err));
        }

        return NextResponse.json({ success: true, message: 'Vendor product approved and published to website' });
      }

      case 'REJECT_PRODUCT': {
        const prodId = Number(payload.productId || body.productId);
        if (!prodId || isNaN(prodId)) {
          return NextResponse.json({ error: 'Valid productId is required' }, { status: 400 });
        }

        const rejectionReason = (payload.rejectionReason || payload.reason || body.rejectionReason || body.reason || '').trim();
        if (!rejectionReason) {
          return NextResponse.json({ error: 'Rejection reason is mandatory when rejecting a product.' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
          where: { id: prodId },
          select: { id: true, name: true, vendorId: true }
        });
        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await prisma.product.update({
          where: { id: product.id },
          data: {
            approvalStatus: 'REJECTED',
            rejectionReason: rejectionReason
          }
        });

        invalidateCatalogCache();

        if (product.vendorId) {
          await prisma.notification.create({
            data: {
              userId: product.vendorId,
              title: `Product Rejected: ${product.name}`,
              message: `Your product "${product.name}" was rejected by admin. Reason: ${rejectionReason}. You can edit and resubmit it from your dashboard.`,
              type: 'VENDOR',
              link: '/vendor/products'
            }
          }).catch((err) => console.warn('[Notification Error]:', err));
        }

        return NextResponse.json({ success: true, message: 'Vendor product rejected with feedback' });
      }

      case 'TOGGLE_PRODUCT_ACTIVE': {
        const prodId = Number(payload.productId || body.productId);
        const current = await prisma.product.findUnique({
          where: { id: prodId },
          select: { approvalStatus: true }
        });
        const newStatus = current?.approvalStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
        const updated = await prisma.product.update({
          where: { id: prodId },
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
        invalidateCatalogCache();
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

      // ==========================================
      // 5. CATEGORY & SUBCATEGORY MANAGEMENT
      // ==========================================
      case 'CREATE_CATEGORY': {
        const name = (payload.name || '').trim();
        if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 });

        const baseSlug = slugify(name);
        const existing = await prisma.category.findUnique({ where: { slug: baseSlug } });
        const finalSlug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

        const cat = await prisma.category.create({
          data: {
            name,
            slug: finalSlug,
            description: payload.description?.trim() || null,
            image: payload.image?.trim() || null,
            displayOrder: Number(payload.displayOrder) || 0,
            isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true
          }
        });
        return NextResponse.json({ success: true, message: `Category "${name}" created`, category: cat });
      }

      case 'UPDATE_CATEGORY': {
        const id = Number(payload.categoryId || payload.id);
        if (!id) return NextResponse.json({ error: 'Valid categoryId is required' }, { status: 400 });

        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const newName = payload.name !== undefined ? payload.name.trim() : existing.name;
        const updateData: any = {
          name: newName,
          description: payload.description !== undefined ? payload.description?.trim() || null : existing.description,
          image: payload.image !== undefined ? payload.image?.trim() || null : existing.image,
          displayOrder: payload.displayOrder !== undefined ? Number(payload.displayOrder) : existing.displayOrder,
          isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : existing.isActive
        };

        const updated = await prisma.category.update({
          where: { id },
          data: updateData
        });

        // Sync product category string name if name was updated
        if (newName !== existing.name) {
          await prisma.product.updateMany({
            where: { categoryId: id },
            data: { category: newName }
          });
        }

        return NextResponse.json({ success: true, message: 'Category updated successfully', category: updated });
      }

      case 'TOGGLE_CATEGORY_ACTIVE': {
        const id = Number(payload.categoryId || payload.id);
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const updated = await prisma.category.update({
          where: { id },
          data: { isActive: !existing.isActive }
        });
        return NextResponse.json({ success: true, isActive: updated.isActive });
      }

      case 'DELETE_CATEGORY': {
        const id = Number(payload.categoryId || payload.id);
        if (!id) return NextResponse.json({ error: 'Valid categoryId is required' }, { status: 400 });

        const productsCount = await prisma.product.count({
          where: { categoryId: id }
        });

        if (productsCount > 0) {
          return NextResponse.json({
            error: `Cannot permanently delete category containing ${productsCount} associated products. Please deactivate the category instead to preserve catalog stability.`
          }, { status: 400 });
        }

        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Category removed successfully' });
      }

      case 'CREATE_SUBCATEGORY': {
        const name = (payload.name || '').trim();
        const catId = Number(payload.categoryId);
        if (!name) return NextResponse.json({ error: 'Subcategory name is required' }, { status: 400 });
        if (!catId) return NextResponse.json({ error: 'Parent categoryId is required' }, { status: 400 });

        const parent = await prisma.category.findUnique({ where: { id: catId } });
        if (!parent) return NextResponse.json({ error: 'Parent Category not found' }, { status: 404 });

        const slug = slugify(`${parent.slug}-${name}`);
        const sub = await prisma.subcategory.create({
          data: {
            name,
            slug,
            categoryId: catId,
            description: payload.description?.trim() || null,
            image: payload.image?.trim() || null,
            displayOrder: Number(payload.displayOrder) || 0,
            isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true
          }
        });
        return NextResponse.json({ success: true, message: `Subcategory "${name}" created`, subcategory: sub });
      }

      case 'UPDATE_SUBCATEGORY': {
        const id = Number(payload.subcategoryId || payload.id);
        if (!id) return NextResponse.json({ error: 'Valid subcategoryId is required' }, { status: 400 });

        const existing = await prisma.subcategory.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        const newName = payload.name !== undefined ? payload.name.trim() : existing.name;
        const updateData: any = {
          name: newName,
          description: payload.description !== undefined ? payload.description?.trim() || null : existing.description,
          image: payload.image !== undefined ? payload.image?.trim() || null : existing.image,
          displayOrder: payload.displayOrder !== undefined ? Number(payload.displayOrder) : existing.displayOrder,
          isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : existing.isActive
        };

        if (payload.categoryId && Number(payload.categoryId) !== existing.categoryId) {
          updateData.categoryId = Number(payload.categoryId);
        }

        const updated = await prisma.subcategory.update({
          where: { id },
          data: updateData
        });

        // Sync product subcategory string name if name was updated
        if (newName !== existing.name) {
          await prisma.product.updateMany({
            where: { subcategoryId: id },
            data: { subcategory: newName }
          });
        }

        return NextResponse.json({ success: true, message: 'Subcategory updated successfully', subcategory: updated });
      }

      case 'TOGGLE_SUBCATEGORY_ACTIVE': {
        const id = Number(payload.subcategoryId || payload.id);
        const existing = await prisma.subcategory.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        const updated = await prisma.subcategory.update({
          where: { id },
          data: { isActive: !existing.isActive }
        });
        return NextResponse.json({ success: true, isActive: updated.isActive });
      }

      case 'DELETE_SUBCATEGORY': {
        const id = Number(payload.subcategoryId || payload.id);
        if (!id) return NextResponse.json({ error: 'Valid subcategoryId is required' }, { status: 400 });

        const productsCount = await prisma.product.count({
          where: { subcategoryId: id }
        });

        if (productsCount > 0) {
          return NextResponse.json({
            error: `Cannot permanently delete subcategory containing ${productsCount} products. Please deactivate it instead.`
          }, { status: 400 });
        }

        await prisma.subcategory.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Subcategory removed successfully' });
      }

      case 'REORDER_CATEGORIES': {
        const orderedIds: number[] = Array.isArray(payload.orderedIds) ? payload.orderedIds : [];
        for (let i = 0; i < orderedIds.length; i++) {
          await prisma.category.update({
            where: { id: Number(orderedIds[i]) },
            data: { displayOrder: i + 1 }
          });
        }
        return NextResponse.json({ success: true, message: 'Categories reordered' });
      }

      case 'REORDER_SUBCATEGORIES': {
        const orderedIds: number[] = Array.isArray(payload.orderedIds) ? payload.orderedIds : [];
        for (let i = 0; i < orderedIds.length; i++) {
          await prisma.subcategory.update({
            where: { id: Number(orderedIds[i]) },
            data: { displayOrder: i + 1 }
          });
        }
        return NextResponse.json({ success: true, message: 'Subcategories reordered' });
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
