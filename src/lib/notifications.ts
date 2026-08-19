import { prisma } from "@/lib/prisma";

type NotificationType = "ORDER" | "BOOKING" | "VENDOR" | "SYSTEM";

export async function createNotification(
  userId: number,
  title: string,
  message: string,
  type: NotificationType,
  link?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}
