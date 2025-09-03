import { formatDate, addMinutes, diffInMinutes } from "../../src/formatting/date";

describe("date formatting utilities", () => {
  describe("formatDate", () => {
    it("formats a date to 'YYYY-MM-DD HH:mm:ss'", () => {
      const date = new Date(2023, 0, 5, 9, 7, 3); // Jan 5, 2023, 09:07:03
      expect(formatDate(date)).toBe("2023-01-05 09:07:03");
    });

    it("pads single digit values with zero", () => {
      const date = new Date(2023, 8, 9, 4, 5, 6); // Sep 9, 2023, 04:05:06
      expect(formatDate(date)).toBe("2023-09-09 04:05:06");
    });

    it("handles end of year", () => {
      const date = new Date(2022, 11, 31, 23, 59, 59); // Dec 31, 2022, 23:59:59
      expect(formatDate(date)).toBe("2022-12-31 23:59:59");
    });
  });

  describe("addMinutes", () => {
    it("adds minutes to a date", () => {
      const date = new Date("2023-01-01T00:00:00Z");
      const result = addMinutes(date, 30);
      expect(result.getTime()).toBe(date.getTime() + 30 * 60000);
    });

    it("adds negative minutes to a date", () => {
      const date = new Date("2023-01-01T00:30:00Z");
      const result = addMinutes(date, -15);
      expect(result.getTime()).toBe(date.getTime() - 15 * 60000);
    });
  });

  describe("diffInMinutes", () => {
    it("returns positive difference in minutes", () => {
      const date1 = new Date("2023-01-01T01:00:00Z");
      const date2 = new Date("2023-01-01T00:00:00Z");
      expect(diffInMinutes(date1, date2)).toBe(60);
    });

    it("returns negative difference in minutes", () => {
      const date1 = new Date("2023-01-01T00:00:00Z");
      const date2 = new Date("2023-01-01T01:00:00Z");
      expect(diffInMinutes(date1, date2)).toBe(-60);
    });

    it("returns zero when dates are equal", () => {
      const date1 = new Date("2023-01-01T00:00:00Z");
      const date2 = new Date("2023-01-01T00:00:00Z");
      expect(diffInMinutes(date1, date2)).toBe(0);
    });

    it("rounds down to nearest minute", () => {
      const date1 = new Date("2023-01-01T00:01:59Z");
      const date2 = new Date("2023-01-01T00:00:00Z");
      expect(diffInMinutes(date1, date2)).toBe(1);
    });
  });
});
