import { NextResponse } from 'next/server';
import { getPartnerApplications, updatePartnerApplicationStatus } from '@/lib/partnerApplications';
import { getApiAuthEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin(request: Request) {
  const email = await getApiAuthEmail(request);
  if (!email) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  if (!user || user.role !== 'ADMIN') {
    return { response: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }

  return { response: null };
}

export async function GET(req: Request) {
  try {
    const access = await requireAdmin(req);
    if (access.response) return access.response;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const applicantType = searchParams.get('applicantType') || undefined;
    const category = searchParams.get('category') || undefined;

    const applications = await getPartnerApplications({ status, applicantType, category });
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('[AdminPartnerApplications] Failed to list applications:', error);
    return NextResponse.json({ error: 'Failed to fetch partner applications.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const access = await requireAdmin(req);
    if (access.response) return access.response;

    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const { id, status, notes, rejectionReason } = body;

    const applicationId = Number(id);
    if (!Number.isInteger(applicationId) || applicationId <= 0 || typeof status !== 'string') {
      return NextResponse.json({ error: 'Application ID and target status are required.' }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CORRECTION_REQUESTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    if (
      (notes !== undefined && typeof notes !== 'string') ||
      (rejectionReason !== undefined && typeof rejectionReason !== 'string') ||
      (typeof notes === 'string' && notes.length > 2000) ||
      (typeof rejectionReason === 'string' && rejectionReason.length > 2000)
    ) {
      return NextResponse.json({ error: 'Notes and rejection reason must be text no longer than 2,000 characters.' }, { status: 400 });
    }

    const updated = await updatePartnerApplicationStatus(applicationId, status, notes, rejectionReason);
    if (!updated) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Partner application status updated to ${status}.`,
      application: updated
    });
  } catch (error) {
    console.error('[AdminPartnerApplications] Failed to update application:', error);
    return NextResponse.json({ error: 'Failed to update partner application.' }, { status: 500 });
  }
}
