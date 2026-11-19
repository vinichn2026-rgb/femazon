import { PartnerRegistrationClient } from "@/components/partner/PartnerRegistrationClient";

export const metadata = {
  title: "Become a Femazon Partner",
  description: "Apply to join Femazon as a boutique owner, fashion seller, beauty seller, beauty professional, gift shop, or independent gift creator.",
};

export default async function PartnerRegistrationPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; partnerType?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const applicantType = resolved.type === "SERVICE_PROVIDER" ? "SERVICE_PROVIDER" : "SELLER";
  return (
    <PartnerRegistrationClient
      initialApplicantType={applicantType}
      initialPartnerType={resolved.partnerType}
    />
  );
}
