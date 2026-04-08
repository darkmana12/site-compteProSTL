/** E-mail comparable en base (minuscules, sans espaces bords). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
