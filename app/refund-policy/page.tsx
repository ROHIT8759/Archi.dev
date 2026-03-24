import PolicyPage from "@/components/legal/PolicyPage";

const sections = [
  {
    iconName: "CreditCard",
    title: "Eligible Refund Scenarios",
    accent: "#00F0FF",
    content: [
      {
        subtitle: "Duplicate payments",
        body: "If you are charged more than once for the same order, subscription cycle, or approved top-up transaction, the duplicate amount is eligible for refund after verification.",
      },
      {
        subtitle: "Technical payment failures",
        body: "If Razorpay captures funds but Archi.dev does not provision the purchased plan or credits within a reasonable period, you may request a refund or service fulfillment after we validate the payment reference.",
      },
      {
        subtitle: "Mandatory legal refunds",
        body: "Where consumer protection law requires a refund, we will honor the applicable legal requirement regardless of any other clause in this policy.",
      },
    ],
  },
  {
    iconName: "FileWarning",
    title: "Non-Refundable Items",
    accent: "#8A2BE2",
    content: [
      {
        subtitle: "Used subscription periods",
        body: "Subscription fees for billing periods that have already started are generally non-refundable once the service has been accessed, unless required by law.",
      },
      {
        subtitle: "Consumed credits",
        body: "Credits that have already been used for generation, export, or runtime actions are not refundable.",
      },
      {
        subtitle: "Custom or enterprise work",
        body: "Implementation services, onboarding, advisory packages, or custom enterprise work are non-refundable unless otherwise agreed in writing.",
      },
    ],
  },
  {
    iconName: "RotateCcw",
    title: "Refund Request Process",
    accent: "#28C840",
    content: [
      {
        subtitle: "How to request",
        body: "Email billing@archi.dev with your registered email address, Razorpay payment ID, order ID, invoice details, and a short description of the issue. We may ask for additional evidence to validate the request.",
      },
      {
        subtitle: "Review timeline",
        body: "Refund requests are reviewed within 5 to 7 business days. If approved, the refund is initiated to the original payment method through Razorpay or our payment processor.",
      },
      {
        subtitle: "Settlement timelines",
        body: "After approval, banks and payment providers may take an additional 5 to 10 business days to reflect the refunded amount in your account.",
      },
    ],
  },
  {
    iconName: "ShieldCheck",
    title: "Chargebacks & Abuse Prevention",
    accent: "#F5A623",
    content: [
      {
        subtitle: "Contact us first",
        body: "Please contact us before initiating a chargeback so we can try to resolve the issue quickly and preserve your access history, invoices, and project continuity.",
      },
      {
        subtitle: "Fraud review",
        body: "We reserve the right to deny refund requests that involve suspected fraud, abuse of free credits, policy violations, or deliberate use of the service followed by a payment dispute.",
      },
      {
        subtitle: "Account impact",
        body: "Accounts associated with unresolved chargebacks may be restricted until the dispute is settled.",
      },
    ],
  },
] as const;

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      badgeLabel="Billing Policy"
      badgeAccent="#00F0FF"
      title="Refund Policy"
      description="This policy explains when payments may be refunded, how refund requests are handled, and what timelines you can expect."
      lastUpdated="March 25, 2026"
      sections={sections}
      closingText={
        <>
          For billing support or refund requests, contact <span className="text-[#00F0FF]/70">billing@archi.dev</span> with your Razorpay payment reference and registered email address.
        </>
      }
    />
  );
}
