import { VendorServicesClient } from "@/components/vendor/VendorServicesClient";

export const metadata = {
  title: "Professional Services Dashboard | Femazon Partner Portal",
  description: "Manage your beauty and styling professional profile, upload portfolios, create packages, update pricing and review bookings on Femazon.",
};

export default function VendorServicesPage() {
  return (
    <main>
      <VendorServicesClient />
    </main>
  );
}
