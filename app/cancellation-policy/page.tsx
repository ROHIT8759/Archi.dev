import PolicyPage from "@/components/legal/PolicyPage";

const sections = [
  {
    iconName: "CalendarX2",
    title: "Subscription Cancellation",
    accent: "#00F0FF",
    content: [
      {
        subtitle: "Cancel anytime",
        body: "You may cancel your recurring subscription at any time before the next billing date. Cancellation stops future renewals but does not retroactively cancel the current active period.",
      },
      {
        subtitle: "End of billing access",
        body: "After cancellation, your paid features remain available until the current billing cycle ends unless your plan is terminated for fraud, abuse, or legal reasons.",
      },
      {
        subtitle: "No automatic backdating",
        body: "Cancellation requests are effective from the time they are processed and are not backdated to a prior billing period.",
      },
    ],
  },
  {
    iconName: "CreditCard",
    title: "Credits, Top-Ups & Plan Changes",
    accent: "#8A2BE2",
    content: [
      {
        subtitle: "Unused subscription benefits",
        body: "Cancelling a subscription prevents future billing but does not automatically trigger a refund for the current cycle. Unused subscription entitlements generally expire at the end of the active plan period.",
      },
      {
        subtitle: "Top-up credits",
        body: "Purchased top-up credits remain in your account subject to the Terms of Service and any abuse-prevention review. Monthly promotional credits may expire according to your plan rules.",
      },
      {
        subtitle: "Downgrades and upgrades",
        body: "If you change plans, revised pricing and limits take effect according to the new billing schedule or upgrade flow shown during checkout.",
      },
    ],
  },
  {
    iconName: "Users",
    title: "Team & Workspace Implications",
    accent: "#28C840",
    content: [
      {
        subtitle: "Owner responsibility",
        body: "Workspace owners are responsible for cancelling team plans and managing member access before the next billing cycle begins.",
      },
      {
        subtitle: "Member access after downgrade",
        body: "If a team workspace is downgraded to a lower plan, some team features, seat counts, or collaboration capabilities may be limited after the current billing period ends.",
      },
      {
        subtitle: "Export before closure",
        body: "We recommend exporting important architecture documents, generated specs, and deployment assets before requesting full workspace closure.",
      },
    ],
  },
  {
    iconName: "Ban",
    title: "Termination by Archi.dev",
    accent: "#F5A623",
    content: [
      {
        subtitle: "Policy violations",
        body: "We may suspend or terminate accounts involved in fraud, abuse, unlawful use, chargeback manipulation, or repeated violations of our Terms of Service.",
      },
      {
        subtitle: "Immediate restrictions",
        body: "In high-risk cases, access may be restricted immediately while we investigate the issue. We will provide notice where appropriate and legally permissible.",
      },
      {
        subtitle: "Surviving obligations",
        body: "Outstanding invoices, payment disputes, indemnity obligations, and compliance duties survive account termination where applicable.",
      },
    ],
  },
] as const;

export default function CancellationPolicyPage() {
  return (
    <PolicyPage
      badgeLabel="Account Policy"
      badgeAccent="#8A2BE2"
      title="Cancellation Policy"
      description="This policy explains how subscriptions can be cancelled, what happens to access and credits, and how workspace changes are handled after cancellation."
      lastUpdated="March 25, 2026"
      sections={sections}
      closingText={
        <>
          For cancellation help, account closure, or plan downgrade questions, contact <span className="text-[#00F0FF]/70">support@archi.dev</span> from your registered account email.
        </>
      }
    />
  );
}
