export function isValidEmail(email?: string): boolean {
  if (!email) {
    return false;
  }

  return email.includes("@") && email.includes(".");
}
