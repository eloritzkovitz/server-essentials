import { capitalize, titleCase, slugify, truncate } from "../../src/formatting/string";
import { DEFAULT_MINOR_WORDS } from "../../src/formatting/constants";

describe("string formatters", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  it("title cases with smart minor words", () => {
    expect(titleCase("the lord of the rings and the hobbit")).toBe("The Lord of the Rings and the Hobbit");
    expect(titleCase("a tale of two cities")).toBe("A Tale of Two Cities");
    expect(titleCase("")).toBe("");
    // Custom minor words
    expect(titleCase("the quick brown fox", ["quick", "brown"])).toBe("The quick brown Fox");
  });

  it("slugifies strings", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  Spaces  and---symbols ")).toBe("spaces-and-symbols");
    expect(slugify("UPPER_case")).toBe("upper-case");
  });

  it("truncates strings", () => {
    expect(truncate("abcdef", 4)).toBe("abcd...");
    expect(truncate("short", 10)).toBe("short");
    expect(truncate("abcdef", 3, "..")).toBe("abc..");
    expect(truncate("abcdef", -1)).toBe("");
  });
});