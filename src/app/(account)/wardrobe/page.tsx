import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import WardrobeClient from "./WardrobeClient";

export const dynamic = "force-dynamic";

export default async function WardrobePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return <WardrobeClient />;
}
