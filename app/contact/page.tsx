import PolicyPage from "@/components/legal/PolicyPage";

const sections = [
  {
    iconName: "Mail",
    title: "General Contact Channels",
    accent: "#00F0FF",
    content: [
      {
        subtitle: "Customer support",
        body: "For product usage, login, workspace, or access issues, email support@archi.dev from your registered account email for faster verification.",
      },
      {
        subtitle: "Billing support",
        body: "For invoices, failed payments, refunds, duplicate charges, or Razorpay transaction issues, contact billing@archi.dev and include the payment reference if available.",
      },
      {
        subtitle: "Privacy and legal",
        body: "For privacy requests, data rights, policy clarifications, or legal notices, contact privacy@archi.dev or legal@archi.dev as appropriate.",
      },
    ],
  },
  {
    iconName: "LifeBuoy",
    title: "What to Include in Your Request",
    accent: "#8A2BE2",
    content: [
      {
        subtitle: "Account identity",
        body: "Include the email address associated with your Archi.dev account so we can verify ownership and locate the relevant workspace or billing record.",
      },
      {
        subtitle: "Transaction details",
        body: "For payment-related requests, include the Razorpay payment ID, order ID, invoice number, or screenshot of the confirmation page where possible.",
      },
      {
        subtitle: "Issue summary",
        body: "Describe the issue clearly, including the date, expected outcome, and any steps already taken. This helps us resolve requests faster.",
      },
    ],
  },
  {
    iconName: "Clock3",
    title: "Support Timelines",
    accent: "#28C840",
    content: [
      {
        subtitle: "General response time",
        body: "We aim to respond to standard support requests within 2 to 5 business days, depending on request volume and issue complexity.",
      },
      {
        subtitle: "Billing and policy requests",
        body: "Billing disputes, refunds, and policy-related inquiries are usually reviewed within 5 to 7 business days.",
      },
      {
        subtitle: "Critical service issues",
        body: "Security incidents, account compromise reports, and critical access failures are prioritized and handled as quickly as possible.",
      },
    ],
  },
  {
    iconName: "ShieldCheck",
    title: "Escalation & Notices",
    accent: "#F5A623",
    content: [
      {
        subtitle: "Policy escalations",
        body: "If your concern relates to privacy rights, takedown requests, or legal compliance, note that clearly in the subject line so we can route it appropriately.",
      },
      {
        subtitle: "Security disclosures",
        body: "If you believe you discovered a security vulnerability, contact security@archi.dev with a responsible disclosure summary and reproduction details.",
      },
      {
        subtitle: "Formal notices",
        body: "Formal legal notices should be sent to legal@archi.dev with all relevant identifying information and supporting documents.",
      },
    ],
  },
] as const;

export default function ContactPage() {
  return (
    <PolicyPage
      badgeLabel="Support"
      badgeAccent="#F5A623"
      title="Contact Us"
      description="Use the correct support channel for billing, privacy, product help, and legal notices so we can resolve your request efficiently."
      lastUpdated="March 25, 2026"
      sections={sections}
      closingText={
        <>
          Primary support contact: <span className="text-[#00F0FF]/70">support@archi.dev</span>. For payment issues, use <span className="text-[#00F0FF]/70">billing@archi.dev</span> and include your payment reference.
        </>
      }
    />
  );
}
