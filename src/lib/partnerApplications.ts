import { prisma } from './prisma';

export async function getPartnerApplications(filter?: { status?: string; applicantType?: string; category?: string }) {
  try {
    const dbApps = await prisma.partnerApplication.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        ...(filter?.status && filter.status !== 'ALL' ? { status: filter.status } : {}),
        ...(filter?.applicantType && filter.applicantType !== 'ALL' ? { applicantType: filter.applicantType } : {}),
      }
    });

    if (!filter?.category || filter.category === 'ALL') return dbApps;
    return dbApps.filter((application) =>
      application.categories.toLowerCase().includes(filter.category!.toLowerCase())
    );
  } catch (error) {
    console.error('[PartnerApplications] Failed to list applications:', error);
    throw new Error('Unable to load partner applications right now.');
  }
}

export async function createPartnerApplication(data: {
  userId?: number;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  applicantType: string;
  categories: string;
  description?: string;
  experience?: string;
  location?: string;
  serviceInfo?: string;
  pricingInfo?: string;
  portfolio?: string;
  documents?: string;
}) {
  try {
    const created = await prisma.partnerApplication.create({
      data: {
        userId: data.userId || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName || null,
        applicantType: data.applicantType,
        categories: data.categories,
        description: data.description || null,
        experience: data.experience || null,
        location: data.location || null,
        serviceInfo: data.serviceInfo || null,
        pricingInfo: data.pricingInfo || null,
        portfolio: data.portfolio || null,
        documents: data.documents || null,
        status: 'PENDING'
      }
    });
    return created;
  } catch (error) {
    console.error('[PartnerApplications] Database save failed:', error);
    throw new Error('Unable to save your application right now. Please try again later.');
  }
}

export async function updatePartnerApplicationStatus(id: number, status: string, notes?: string, rejectionReason?: string) {
  try {
    const updated = await prisma.partnerApplication.update({
      where: { id },
      data: {
        status,
        ...(notes ? { notes } : {}),
        ...(rejectionReason ? { rejectionReason } : {})
      }
    });
    return updated;
  } catch (error) {
    console.error('[PartnerApplications] Failed to update application:', error);
    throw new Error('Unable to update the partner application right now.');
  }
}
