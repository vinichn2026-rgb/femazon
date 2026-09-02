/**
 * Smart WhatsApp Business Direct Chat Integration Helper
 */

export const FEMAZON_WHATSAPP_NUMBER = "919876543210"; // Official Femazon Concierge Number

export interface WhatsAppContextParams {
  type: 'general' | 'product' | 'service' | 'booking' | 'order' | 'styling';
  itemName?: string;
  itemId?: string | number;
  selectedDate?: string;
  selectedSize?: string;
  orderId?: string;
  bookingId?: string;
  customMessage?: string;
}

export function generateWhatsAppLink({
  type,
  itemName,
  itemId,
  selectedDate,
  selectedSize,
  orderId,
  bookingId,
  customMessage
}: WhatsAppContextParams): string {
  let message = "";

  switch (type) {
    case 'product':
      message = `Hello Femazon Stylist, I need styling details regarding ${itemName || 'this outfit'} (ID: ${itemId || 'N/A'}${selectedSize ? `, Size: ${selectedSize}` : ''}). Is this available for priority delivery?`;
      break;

    case 'service':
      message = `Hello Femazon Concierge, I would like to inquire about booking the "${itemName || 'Beauty Service'}" (ID: ${itemId || 'N/A'})${selectedDate ? ` for ${selectedDate}` : ''}. Are celebrity slots available?`;
      break;

    case 'booking':
      message = `Hi Femazon Support, I need assistance with my Service Booking #${bookingId || 'N/A'} for ${itemName || 'Concierge Service'}.`;
      break;

    case 'order':
      message = `Hi Femazon Support, I would like an update on my Couture Order #${orderId || 'N/A'}.`;
      break;

    case 'styling':
      message = `Hello Femazon Personal Stylist, I'd like a personalized luxury outfit recommendation for an upcoming wedding event.`;
      break;

    case 'general':
    default:
      message = customMessage || `Hello Femazon Concierge, I would like assistance with luxury designer outfits & beauty services.`;
      break;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${FEMAZON_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsAppDirect(customText: string) {
  const encoded = encodeURIComponent(customText);
  if (typeof window !== 'undefined') {
    window.open(`https://wa.me/${FEMAZON_WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  }
}
