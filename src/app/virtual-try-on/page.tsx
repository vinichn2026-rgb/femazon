import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Shop Luxury Collections | Femazon',
  description: 'Explore curated Indian couture and designer wear.',
};

export default function VirtualTryOnPage() {
  redirect('/shop');
}
