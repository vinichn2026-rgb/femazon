import { LuxuryServicesClient } from '@/components/services/LuxuryServicesClient';

export const metadata = {
  title: 'Femazon Services & Smart Booking | Luxury Beauty, Styling & Concierge',
  description: 'Book verified celebrity bridal makeup artists, AI personal stylists, organic henna artists, and luxury trousseau planners with instant slot hold.',
};

export default function ServicesPage() {
  return (
    <main>
      <LuxuryServicesClient />
    </main>
  );
}
