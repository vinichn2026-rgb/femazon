import { NextResponse } from 'next/server';
import { createPartnerApplication } from '@/lib/partnerApplications';
import { getServerAuthPayload } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Please submit a valid application.' }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      businessName,
      applicantType,
      categories,
      description,
      experience,
      location,
      serviceInfo,
      pricingInfo,
      portfolio,
      documents
    } = body;

    const categoryList = Array.isArray(categories)
      ? categories.filter((category): category is string => typeof category === 'string').map((category) => category.trim()).filter(Boolean)
      : typeof categories === 'string' ? [categories.trim()].filter(Boolean) : [];
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const validApplicantTypes = ['SELLER', 'SERVICE_PROVIDER'];

    if (!cleanName || !cleanEmail || !cleanPhone || !validApplicantTypes.includes(applicantType) || categoryList.length === 0) {
      return NextResponse.json(
        { error: 'Name, a valid email and phone, applicant type, and at least one category are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanPhone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Please provide a valid email address and phone number.' }, { status: 400 });
    }

    const optionalFields = [businessName, description, experience, location, serviceInfo, pricingInfo, portfolio, documents];
    if (optionalFields.some((value) => value !== undefined && value !== null && typeof value !== 'string')) {
      return NextResponse.json({ error: 'Optional application details must be text.' }, { status: 400 });
    }

    const fields = [cleanName, cleanEmail, cleanPhone, ...optionalFields];
    if (fields.some((value) => typeof value === 'string' && value.length > 2000)) {
      return NextResponse.json({ error: 'One or more fields exceed the 2,000 character limit.' }, { status: 400 });
    }

    const authPayload = await getServerAuthPayload();
    const userId = authPayload?.id ? Number(authPayload.id) : undefined;

    const application = await createPartnerApplication({
      userId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      businessName,
      applicantType,
      categories: categoryList.join(', '),
      description,
      experience,
      location,
      serviceInfo,
      pricingInfo,
      portfolio,
      documents
    });

    return NextResponse.json({
      success: true,
      message: 'Your partner application has been submitted successfully and is currently under review.',
      application
    });
  } catch (err) {
    console.error('[API partner/apply] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to submit partner application' },
      { status: 503 }
    );
  }
}
