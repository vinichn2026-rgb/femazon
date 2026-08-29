import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import BookingDetailsClient from "./BookingDetailsClient";

export const dynamic = "force-dynamic";

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const resolvedParams = await params;
  return <BookingDetailsClient bookingId={resolvedParams.id} />;
}
