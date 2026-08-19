import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import BookingDetailsClient from "./BookingDetailsClient";

export const dynamic = "force-dynamic";

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  return <BookingDetailsClient bookingId={params.id} />;
}
