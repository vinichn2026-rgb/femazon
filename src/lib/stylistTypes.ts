export const STYLIST_SPECIALIZATIONS = [
  "Personal Styling",
  "Wardrobe Makeover",
  "Bridal & Festive Trousseau",
  "Corporate & Office Styling",
  "Personal Shopping",
  "Occasion & Red Carpet",
  "Body-Type & Color Analysis",
  "Fusion & Indo-Western",
] as const;

export const STYLIST_PACKAGE_TYPES = [
  "Basic Styling Consultation",
  "Personal Styling Session",
  "Complete Wardrobe Styling",
  "Personal Shopping Assistance",
  "Office & Professional Styling",
  "Occasion Styling",
] as const;

export const STYLIST_APPLICATION_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
] as const;

export interface StylistAddOn {
  name: string;
  price: number;
}

export interface StylistPackageItem {
  id: number;
  stylistId: number;
  title: string;
  packageType: string;
  description: string;
  price: number;
  duration: string;
  includedServices: string[];
  sessionsCount: number;
  deliveryMode: string;
  location: string;
  addOns: StylistAddOn[];
  availability: string;
  images: string[];
  isActive: boolean;
}

export interface StylistReviewItem {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  isComplaint: boolean;
  complaintStatus: string;
  createdAt: string;
}

export interface PublicStylist {
  id: number;
  slug: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  city: string;
  location: string;
  preferredLocations: string[];
  experience: string;
  experienceYears: number;
  bio: string;
  specializations: string[];
  portfolioImages: string[];
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  consultationModes: string[];
  qualifications: string;
  availabilitySchedule: string;
  status: string;
  verified: boolean;
  featured: boolean;
  commissionRate: number;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  packages: StylistPackageItem[];
  reviews: StylistReviewItem[];
}
