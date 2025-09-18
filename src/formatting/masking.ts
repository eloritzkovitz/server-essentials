/**
 * Masks an email address, e.g., "john.doe@example.com" -> "j***@example.com"
 */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const maskedUser = user[0] + "***";
  return `${maskedUser}@${domain}`;
}

/**
 * Masks a phone number, e.g., "+1 555 123 4567" -> "+1 555 *** 4567"
 */
export function maskPhone(phone: string): string {
  // Simple example: mask the middle digits
  return phone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2");
}

/**
 * Pads a number with leading zeros, e.g., padNumber(5, 4) -> "0005"
 */
export function padNumber(num: number, length: number): string {
  return num.toString().padStart(length, "0");
}

/**
 * Formats a code in groups, e.g., formatCode("ABCDEF123456", 3) -> "ABC-DEF-123-456"
 */
export function formatCode(code: string, groupSize: number = 3, separator = "-"): string {
  return code
    .replace(new RegExp(`(.{${groupSize}})`, "g"), `$1${separator}`)
    .replace(new RegExp(`${separator}+$`), "");
}