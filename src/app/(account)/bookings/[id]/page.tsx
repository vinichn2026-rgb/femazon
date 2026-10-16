import { getServerAuthEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookingDetailsClient from "./BookingDetailsClient";

export const dynamic = "force-dynamic";

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const userEmail = await getServerAuthEmail();
  const resolvedParams = await params;

  if (!userEmail) {
    redirect(`/login?callbackUrl=/bookings/${resolvedParams.id}`);
  }

  return <BookingDetailsClient bookingId={resolvedParams.id} />;
}
