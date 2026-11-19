import { getApiAuthEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getVendorUser(request: Request) {
  const email = await getApiAuthEmail(request);
  if (!email) return null;

  return prisma.user.findFirst({
    where: { email, role: "VENDOR" },
  });
}
