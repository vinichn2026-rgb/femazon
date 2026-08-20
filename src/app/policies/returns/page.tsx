import React from 'react';

export const metadata = {
  title: "Return & Refund Policy | Femazon",
};

export default function ReturnsPolicyPage() {
  return (
    <>
      <h1>Return & Refund Policy</h1>
      <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-8">Last Updated: August 20, 2026</p>

      <p>
        We want you to love what you ordered! If you are not completely satisfied with your purchase, we're here to help.
      </p>

      <h2>1. Returns</h2>
      <p>
        You have <strong>14 calendar days</strong> to return an item from the date you received it.
      </p>
      <p>
        To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging, unwashed, and with all tags attached.
      </p>
      <p>
        <strong>Non-returnable items:</strong>
      </p>
      <ul>
        <li>Intimates, lingerie, and swimwear (for hygiene reasons)</li>
        <li>Customized or personalized products</li>
        <li>Beauty and cosmetic products that have been unsealed</li>
        <li>Clearance or final sale items</li>
      </ul>

      <h2>2. How to Initiate a Return</h2>
      <ol>
        <li>Log into your Femazon account and go to <strong>My Orders</strong>.</li>
        <li>Select the order containing the item you wish to return.</li>
        <li>Click on "Initiate Return" and select the reason for returning.</li>
        <li>Pack the item securely in its original packaging.</li>
        <li>Our delivery partner will pick up the item within 2-3 business days.</li>
      </ol>

      <h2>3. Refunds</h2>
      <p>
        Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
      </p>
      <p>
        If your return is approved, we will initiate a refund to your original method of payment (or store credit, if preferred). You will receive the credit within a certain amount of days, depending on your card issuer's policies (typically 5-7 business days).
      </p>
      <p>
        For Cash on Delivery (COD) orders, we will send a link to your registered email/phone to collect your bank account details for the refund transfer.
      </p>

      <h2>4. Exchanges</h2>
      <p>
        We only replace items if they are defective, damaged, or if you received the wrong size. If you need to exchange an item for the exact same product in a different size, please initiate an exchange from your "My Orders" page. Exchanges are subject to inventory availability.
      </p>

      <h2>5. Shipping Costs for Returns</h2>
      <p>
        For defective or incorrect items, Femazon covers all return shipping costs. For returns due to change of mind or sizing issues, a nominal return shipping fee of ₹50 may be deducted from your refund amount.
      </p>
    </>
  );
}
