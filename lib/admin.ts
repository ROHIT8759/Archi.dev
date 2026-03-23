/**
 * Admin access control.
 * Users matching these rules get unlimited credits and bypass all DB credit checks.
 */

const ADMIN_EMAILS = new Set([
  "sohomchatterjee07@oxifylabs.app",
]);

const ADMIN_DOMAINS = [
  "@oxifylabs.app",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  if (ADMIN_EMAILS.has(lower)) return true;
  return ADMIN_DOMAINS.some((domain) => lower.endsWith(domain));
}

/** A synthetic balance object returned to admins — effectively unlimited credits. */
export const ADMIN_BALANCE = {
  id: "admin",
  userId: "admin",
  availableCredits: 999_999_999,
  monthlyFreeCredits: 999_999_999,
  freeResetDayOfMonth: 1,
  lastResetAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
