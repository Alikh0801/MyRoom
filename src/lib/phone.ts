/** Telefonu müqayisə və saxlama üçün +994XXXXXXXXX formatına gətirir */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (normalized.startsWith("994")) {
    // 994XXXXXXXXX
  } else if (normalized.startsWith("0") && normalized.length === 10) {
    normalized = `994${normalized.slice(1)}`;
  } else if (normalized.length === 9) {
    normalized = `994${normalized}`;
  } else {
    return null;
  }

  if (normalized.length !== 12) return null;
  return `+${normalized}`;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

export function formatPhoneDisplay(normalized: string): string {
  const digits = normalized.replace(/\D/g, "");
  if (digits.length !== 12 || !digits.startsWith("994")) return normalized;
  const local = digits.slice(3);
  return `+994 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`;
}
