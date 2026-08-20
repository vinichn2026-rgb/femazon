import React from 'react';

export const metadata = {
  title: "Privacy Policy | Femazon",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-8">Last Updated: August 20, 2026</p>

      <p>
        At Femazon, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data when you visit or make a purchase from our website, or use our specialized services like the AI Wardrobe.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        When you visit Femazon, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
      </p>
      <ul>
        <li><strong>Device Information:</strong> Version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the site.</li>
        <li><strong>Order Information:</strong> Name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.</li>
        <li><strong>AI Wardrobe Data:</strong> Images of clothing you upload, styling preferences, sizes, and past purchases used to generate outfit recommendations.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the personal information we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
      </p>
      <p>Additionally, we use this information to:</p>
      <ul>
        <li>Communicate with you.</li>
        <li>Screen our orders for potential risk or fraud.</li>
        <li>Provide personalized styling recommendations via our AI Wardrobe.</li>
        <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
      </ul>

      <h2>3. Sharing Your Personal Information</h2>
      <p>
        We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we share necessary order and shipping details with Vendors on our marketplace to fulfill your orders, and with Service Providers for any salon or styling services you book.
      </p>
      <p>
        We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
      </p>

      <h2>4. Your Rights</h2>
      <p>
        If you are a resident of certain territories, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
      </p>

      <h2>5. Changes</h2>
      <p>
        We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at <strong>privacy@femazon.com</strong>.
      </p>
    </>
  );
}
