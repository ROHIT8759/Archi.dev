import PolicyPage from "@/components/legal/PolicyPage";

const sections = [
  {
    iconName: "Cloud",
    title: "Digital Delivery Model",
    accent: "#00F0FF",
    content: [
      {
        subtitle: "No physical shipping",
        body: "Archi.dev is a software platform delivered entirely online. We do not sell or ship physical goods, hardware, or printed materials as part of the standard service.",
      },
      {
        subtitle: "Access delivery",
        body: "After successful payment, plan upgrades, account access, credits, and related software features are provisioned digitally to your account.",
      },
      {
        subtitle: "Delivery channel",
        body: "Service fulfillment occurs through the Archi.dev web application, associated APIs, and account-linked workspace access.",
      },
    ],
  },
  {
    iconName: "FileStack",
    title: "Fulfillment Timelines",
    accent: "#8A2BE2",
    content: [
      {
        subtitle: "Instant activation",
        body: "Most purchases are activated immediately after successful payment confirmation from Razorpay or the relevant payment processor.",
      },
      {
        subtitle: "Delayed provisioning",
        body: "In rare cases involving payment verification, fraud screening, or temporary processing issues, activation may be delayed. If that happens, contact support with your payment reference.",
      },
      {
        subtitle: "Service notifications",
        body: "Where available, confirmation emails, invoices, or in-app notices may be sent to confirm successful delivery of the purchased service.",
      },
    ],
  },
  {
    iconName: "Globe2",
    title: "Geographic Availability",
    accent: "#28C840",
    content: [
      {
        subtitle: "Online availability",
        body: "Archi.dev is offered as an internet-based software service and may be accessed from supported regions subject to local law, sanctions restrictions, and payment provider availability.",
      },
      {
        subtitle: "Processor limitations",
        body: "Certain payment methods, currencies, or checkout experiences may vary depending on your country, bank, or processor support.",
      },
      {
        subtitle: "Compliance limitations",
        body: "We may restrict purchases or service access in jurisdictions where offering the service would violate applicable law or payment compliance obligations.",
      },
    ],
  },
  {
    iconName: "Box",
    title: "Issues With Delivery",
    accent: "#F5A623",
    content: [
      {
        subtitle: "If access is not granted",
        body: "If you complete payment but your account is not upgraded or credited, contact us with your payment ID and registered email so we can manually verify and complete the fulfillment.",
      },
      {
        subtitle: "Order mismatch",
        body: "If the wrong plan, amount, or entitlement appears after checkout, we will review the transaction and either correct the fulfillment or handle the issue under the Refund Policy.",
      },
      {
        subtitle: "Support channel",
        body: "For fulfillment issues, contact support as soon as possible so we can resolve the issue before you initiate a payment dispute.",
      },
    ],
  },
] as const;

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      badgeLabel="Fulfillment Policy"
      badgeAccent="#28C840"
      title="Shipping & Delivery Policy"
      description="This page explains how Archi.dev fulfills purchases, what digital delivery means for the platform, and what to do if an order is not provisioned correctly."
      lastUpdated="March 25, 2026"
      sections={sections}
      closingText={
        <>
          Archi.dev is a digital software service. For delivery or provisioning issues, contact <span className="text-[#00F0FF]/70">support@archi.dev</span> with your payment details and account email.
        </>
      }
    />
  );
}
