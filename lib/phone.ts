export function isValidPhone(phone: string): boolean {
  if (phone.length > 30 || !/^\+?[0-9][0-9 .()/\-]*$/.test(phone)) {
    return false;
  }

  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
