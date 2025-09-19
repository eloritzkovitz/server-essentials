import { formatCurrency, formatPercentage } from "../../src/formatting/number";

describe("number formatters", () => {
  it("formats currency with defaults", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats currency with custom options", () => {
    expect(formatCurrency(1234.5, { currency: "EUR", locale: "de-DE" })).toBe("1.234,50 €");
    expect(formatCurrency(1234, { minimumFractionDigits: 0 })).toBe("$1,234");
  });

  it("formats percentage with defaults", () => {
    expect(formatPercentage(0.1234)).toBe("12.34%");
  });

  it("formats percentage with custom decimals and no multiply", () => {
    expect(formatPercentage(12.3456, { decimals: 1, multiply: false })).toBe("12.3%");
  });
});