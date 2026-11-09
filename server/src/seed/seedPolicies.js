import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Settings from "../models/Settings.js";

const policies = {
  shipping: `We deliver across Hyderabad and surrounding areas in Telangana. Orders are typically dispatched within 24 hours of confirmation.

Delivery areas
We currently deliver to pincodes starting with 500, 501, and 502 (Hyderabad, Secunderabad, and surrounding metro areas).

Delivery time
Estimated delivery is 1-3 business days from the date of order confirmation. Delivery timelines may vary during festivals, sales, or unforeseen circumstances.

Delivery charges
- Free delivery on orders above Rs.999
- Flat delivery fee of Rs.49 on orders below this amount

Order tracking
After your order is dispatched, you can track it anytime from our Track Order page using your order number and registered mobile number.

Contact for delivery issues
If your order is delayed beyond the estimated delivery time, please message us on WhatsApp at the number in the footer with your order number.`,

  returns: `We want you to be completely satisfied with your purchase. If something isn't right, we're here to help.

Return window
You can request a return within 7 days of receiving your order.

Eligible for return
- Products in original, unused condition with all original packaging
- Products that arrived damaged or defective
- Wrong item delivered

Not eligible for return
- Opened or used consumables (diapers, wipes, baby food, shampoos)
- Products marked "non-returnable" on the product page
- Items without original packaging or tags

How to request a return
Message us on WhatsApp with:
1. Your order number
2. A photo of the item
3. Reason for return

Our team will respond within 24 hours with return instructions.

Refund process
Once we receive and verify the returned item:
- Refunds to the original payment method within 5-7 business days
- For Cash on Delivery orders, we transfer the amount to your bank account or UPI
- Delivery charges are non-refundable unless the return is due to our error

Exchanges
Exchanges are subject to stock availability. If the item you want is out of stock, we'll process a refund instead.`,

  privacy: `This Privacy Policy explains how CareBabyStore collects, uses, and protects your personal information when you use our website.

Information we collect
- Name, mobile number, email address
- Delivery address and pincode
- Order history and preferences
- Device and browser information (for site performance only)

How we use your information
- To process and deliver your orders
- To contact you about order status, delivery, or returns
- To send promotional offers (only if you opt in)
- To improve our website and product selection

We do NOT
- Sell or rent your personal information to third parties
- Store your payment card details on our servers (payments are processed by secure payment gateways)
- Share your data except with our delivery partners and payment processors as needed to fulfil your order

Your rights
- You can request a copy of your data anytime
- You can request deletion of your account and data
- You can opt out of marketing messages

Security
We use industry-standard encryption (HTTPS) and secure authentication to protect your data. Payment information is never stored on our servers.

Contact
For privacy-related questions, message us on WhatsApp at the number in the footer.`,

  terms: `By using the CareBabyStore website and placing an order, you agree to the following terms.

1. Product information
We make every effort to display accurate product descriptions, prices, and images. Minor variations in colour or packaging may occur due to photography and manufacturing differences.

2. Pricing
All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes. Prices are subject to change without notice.

3. Orders and acceptance
- All orders are subject to product availability and payment verification
- We reserve the right to cancel any order that we cannot fulfil, with a full refund
- You will receive an order confirmation with a unique order number

4. Payment
We accept Cash on Delivery and online payments. Online payments are processed through PCI-DSS compliant gateways.

5. Delivery
- We deliver to pincodes starting with 500, 501, and 502 only
- Delivery timelines are estimates and not guaranteed
- Someone must be available at the delivery address to receive the order

6. Returns and refunds
See our Return & Refund Policy for details.

7. Account and password
If you create an account, you are responsible for keeping your login credentials secure.

8. Intellectual property
All content on this website (text, images, logos) belongs to CareBabyStore and may not be reproduced without permission.

9. Limitation of liability
We are not liable for any indirect or consequential loss arising from the use of our website or products, beyond the amount paid for the order.

10. Changes to terms
We may update these terms occasionally. Continued use of the site means you accept the latest version.

11. Contact
For questions about these terms, message us on WhatsApp at the number in the footer.`,
};

async function run() {
  await connectDB();
  console.log("🌱 Seeding default policies…");

  const existing = await Settings.findOne({ key: "site" });
  if (existing && existing.policies && existing.policies.shipping?.trim()) {
    console.log("⚠️  Policies already exist — skipping (won't overwrite your edits).");
    console.log("   To force-reset, delete the Settings document first or use admin → Settings → Policies.");
    await mongoose.disconnect();
    process.exit(0);
  }

  await Settings.findOneAndUpdate(
    { key: "site" },
    {
      policies,
      policiesLastUpdated: new Date(),
    },
    { upsert: true, new: true }
  );

  console.log("✅ Policies seeded. Open /admin/settings to edit them.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});