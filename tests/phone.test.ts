import { describe, expect, it } from "vitest";
import { isValidPhone } from "@/lib/phone";

describe("validation du téléphone", () => {
  it("accepte les formats français et internationaux usuels", () => {
    expect(isValidPhone("06 12 34 56 78")).toBe(true);
    expect(isValidPhone("+33 6 12 34 56 78")).toBe(true);
    expect(isValidPhone("+1 (202) 555-0123")).toBe(true);
  });

  it("accepte les limites de 7 et 15 chiffres", () => {
    expect(isValidPhone("1234567")).toBe(true);
    expect(isValidPhone("+123456789012345")).toBe(true);
  });

  it("refuse les numéros trop courts ou trop longs", () => {
    expect(isValidPhone("123456")).toBe(false);
    expect(isValidPhone("1234567890123456")).toBe(false);
    expect(isValidPhone(`1${" ".repeat(30)}`)).toBe(false);
  });

  it("refuse les caractères et positions de signe invalides", () => {
    for (const phone of ["", "abcdefg", "123+4567", "++33123456789", " 0612345678"]) {
      expect(isValidPhone(phone)).toBe(false);
    }
  });
});
