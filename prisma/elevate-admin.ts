import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Elevating the first user to ADMIN...");

  const firstUser = await prisma.user.findFirst({
    orderBy: { id: 'asc' }
  });

  if (!firstUser) {
    console.log("No users found. Please register a user first.");
    return;
  }

  await prisma.user.update({
    where: { id: firstUser.id },
    data: { role: 'ADMIN' }
  });

  console.log(`Successfully elevated ${firstUser.email} to ADMIN.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
