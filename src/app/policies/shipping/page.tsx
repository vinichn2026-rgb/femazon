import React from 'react';

export const metadata = {
  title: "Shipping Policy | Femazon",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <h1>Shipping Policy</h1>
      <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-8">Last Updated: August 20, 2026</p>

      <p>
        Thank you for shopping at Femazon. The following are the terms and conditions that constitute our Shipping Policy.
      </p>

      <h2>1. Domestic Shipping Processing Time</h2>
      <p>
        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
      </p>
      <p>
        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
      </p>

      <h2>2. Shipping Rates & Delivery Estimates</h2>
      <p>
        Shipping charges for your order will be calculated and displayed at checkout.
      </p>
      <ul>
        <li><strong>Standard Shipping:</strong> ₹50 (Free for orders over ₹999). Estimated delivery: 3-5 business days.</li>
        <li><strong>Express Shipping:</strong> ₹150. Estimated delivery: 1-2 business days.</li>
        <li><strong>Same Day Delivery:</strong> Available in select metro cities for ₹250 on orders placed before 12 PM.</li>
      </ul>
      <p>
        <em>Delivery delays can occasionally occur due to unforeseen circumstances like extreme weather or courier network disruptions.</em>
      </p>

      <h2>3. Shipment Confirmation & Order Tracking</h2>
      <p>
        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours. You can also track your order directly from the "My Orders" section in your account.
      </p>

      <h2>4. Customs, Duties and Taxes</h2>
      <p>
        Femazon is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.). Currently, we only ship within India.
      </p>

      <h2>5. Damages</h2>
      <p>
        If your order arrives damaged, please refuse the delivery if possible. If you have already accepted the package, please contact our support team within 48 hours with photographic evidence of the damaged packaging and product to initiate a replacement or refund.
      </p>
    </>
  );
}
