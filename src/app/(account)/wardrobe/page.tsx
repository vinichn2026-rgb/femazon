import { getServerAuthEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import WardrobeClient from "./WardrobeClient";

export const dynamic = "force-dynamic";

export default async function WardrobePage() {
  const userEmail = await getServerAuthEmail();

  if (!userEmail) {
    redirect("/login?callbackUrl=/wardrobe");
  }

  return <WardrobeClient />;
}
