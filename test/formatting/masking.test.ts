import {
  maskEmail,
  maskPhone,
  padNumber,
  formatCode,
} from "../../src/formatting/masking";

describe("masking formatters", () => {
  describe("maskEmail", () => {
    it("masks email addresses", () => {
      expect(maskEmail("john.doe@example.com")).toBe("j***@example.com");
      expect(maskEmail("a@b.com")).toBe("a***@b.com");
      expect(maskEmail("invalidemail")).toBe("invalidemail");
    });
  });

  describe("maskPhone", () => {
    it("masks phone numbers in standard formats", () => {
      expect(maskPhone("+1 555 123 4567")).toBe("+1 555 *** 4567");
      expect(maskPhone("1234567890")).toBe("123***7890");
    });

    it("returns original phone if not enough digits to mask", () => {
      expect(maskPhone("555-1234")).toBe("555-1234");
    });

    it("returns original phone if it has 10+ digits but does not match the masking regex", () => {
      expect(maskPhone("1a2b3c4d5e6f7g8h9i0j")).toBe("1a2b3c4d5e6f7g8h9i0j");
    });
  });

  describe("padNumber", () => {
    it("pads numbers with leading zeros", () => {
      expect(padNumber(5, 4)).toBe("0005");
      expect(padNumber(123, 6)).toBe("000123");
      expect(padNumber(0, 2)).toBe("00");
    });

    it("does not pad if number is already long enough", () => {
      expect(padNumber(12345, 3)).toBe("12345");
    });

    it("pads negative numbers correctly", () => {
      expect(padNumber(-5, 4)).toBe("-005");
    });
  });

  describe("formatCode", () => {
    it("formats codes in groups", () => {
      expect(formatCode("ABCDEF123456", 3)).toBe("ABC-DEF-123-456");
      expect(formatCode("12345678", 4, ":")).toBe("1234:5678");
      expect(formatCode("XYZ", 2)).toBe("XY-Z");
    });

    it("formats code shorter than groupSize", () => {
      expect(formatCode("AB", 3)).toBe("AB");
    });

    it("formats code with length not a multiple of groupSize", () => {
      expect(formatCode("ABCDE", 2)).toBe("AB-CD-E");
    });

    it("formats code with custom separator and trailing group", () => {
      expect(formatCode("1234567", 3, ":")).toBe("123:456:7");
    });

    it("formats code with groupSize 1", () => {
      expect(formatCode("ABCD", 1)).toBe("A-B-C-D");
    });

    it("formats code with groupSize equal to code length", () => {
      expect(formatCode("ABCD", 4)).toBe("ABCD");
    });

    it("formats code with separator as a special regex character", () => {
      expect(formatCode("ABCD", 2, ".")).toBe("AB.CD");
    });

    it("returns code unchanged if groupSize < 1", () => {
      expect(formatCode("ABCDEF", 0)).toBe("ABCDEF");
      expect(formatCode("ABCDEF", -2)).toBe("ABCDEF");
    });

    it("returns empty string if code is empty", () => {
      expect(formatCode("", 3)).toBe("");
    });
  });
});
