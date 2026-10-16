import { getServerAuthEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrderDetailsClient from "./OrderDetailsClient";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const userEmail = await getServerAuthEmail();
  const resolvedParams = await params;
  
  if (!userEmail) {
    redirect(`/login?callbackUrl=/orders/${resolvedParams.id}`);
  }

  return <OrderDetailsClient orderId={resolvedParams.id} />;
}
