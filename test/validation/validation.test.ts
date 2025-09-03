import {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
} from "../../src/validation/validation";

describe("validation utilities", () => {
  it("isValidEmail returns true for valid emails", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name+tag@domain.co.uk")).toBe(true);
  });

  it("isValidEmail returns false for invalid emails", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("user@.com")).toBe(false);
  });

  it("isValidPhone returns true for valid phone numbers", () => {
    expect(isValidPhone("+1234567890")).toBe(true);
    expect(isValidPhone("1234567890")).toBe(true);
  });

  it("isValidPhone returns false for invalid phone numbers", () => {
    expect(isValidPhone("abc123")).toBe(false);
    expect(isValidPhone("123")).toBe(false);
  });

  it("isStrongPassword returns true for strong passwords", () => {
    expect(isStrongPassword("Abcdef12")).toBe(true);
    expect(isStrongPassword("StrongPass123")).toBe(true);
  });

  it("isStrongPassword returns false for weak passwords", () => {
    expect(isStrongPassword("abc")).toBe(false);
    expect(isStrongPassword("password")).toBe(false);
    expect(isStrongPassword("12345678")).toBe(false);
  });
});
