import { redirect } from 'next/navigation';

export default function BecomeASellerRedirectPage() {
  redirect('/seller/register');
}
