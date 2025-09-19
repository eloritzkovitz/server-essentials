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
  // Extract all digits
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone; // not enough digits to mask

  // For 10+ digits: keep first 3, mask next 3, keep last 4
  const maskedDigits = digits.replace(
    /^(\d{3})(\d{3})(\d{4,})$/,
    (_: string, p1: string, _p2: string, p3: string) => `${p1}***${p3}`
  );

  // Replace only the digit groups in the original string that correspond to the groups in the mask
  let match = phone.match(/(\d{1,3})[^\d]*?(\d{1,3})[^\d]*?(\d{1,4})$/);
  if (match) {
    // e.g., "+1 555 123 4567" => ["+1 555 123 4567", "555", "123", "4567"]
    const [_, g1, g2, g3] = match;
    return phone.replace(g1, g1.length === 3 ? g1 : "***")
                .replace(g2, "***")
                .replace(g3, g3);
  }

  // If no match, return the original phone string unmasked
  return phone;
}

/**
 * Pads a number with leading zeros, e.g., padNumber(5, 4) -> "0005"
 */
export function padNumber(num: number, length: number): string {
  const isNegative = num < 0;
  const absStr = Math.abs(num).toString().padStart(isNegative ? length - 1 : length, "0");
  return isNegative ? `-${absStr}` : absStr;
}

/**
 * Formats a code in groups, e.g., formatCode("ABCDEF123456", 3) -> "ABC-DEF-123-456"
 */
export function formatCode(code: string, groupSize: number = 3, separator = "-"): string {
  if (!code) return "";
  if (groupSize < 1) return code;

  // Insert separator every groupSize characters
  const grouped = code.replace(new RegExp(`(.{${groupSize}})`, "g"), `$1${separator}`);
  // Escape separator for regex if it's a special character
  const escapedSeparator = separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return grouped.replace(new RegExp(`${escapedSeparator}+$`), "");
}