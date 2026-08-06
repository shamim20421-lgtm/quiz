import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const resultPage = readFileSync(join(root, "app/result/page.tsx"), "utf8");
const premiumPage = readFileSync(join(root, "app/premium/page.tsx"), "utf8");

describe("result page UI copy", () => {
  it("does not render numeric score copy", () => {
    expect(resultPage).not.toContain("স্কোর");
    expect(resultPage).not.toContain("/ ৩০");
  });

  it("renders free result sections in the required order", () => {
    const orderedCopy = [
      "report.title",
      "আপনার পরিস্থিতি",
      "আজ কী করবেন",
      "আজ কী করবেন না",
      "এই বার্তাটি পাঠাতে পারেন",
      "আপনার জন্য বিস্তারিত করণীয় দেখুন",
      "আমার বিস্তারিত করণীয় দেখুন",
    ];

    const positions = orderedCopy.map((text) => resultPage.indexOf(text));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

describe("premium page UI copy", () => {
  it("uses the updated heading, supporting copy, feature list, and CTA", () => {
    expect(premiumPage).toContain("আপনার ব্যক্তিগত করণীয় পরিকল্পনা");
    expect(premiumPage).toContain("আপনার উত্তরের ভিত্তিতে তৈরি বিস্তারিত দিকনির্দেশনা");
    expect(premiumPage).toContain("আমার করণীয় আনলক করুন");

    for (const item of [
      "আপনার পরিস্থিতির বিস্তারিত ব্যাখ্যা",
      "আজ কী করবেন",
      "আজ কী করবেন না",
      "আগামী তিন দিনের পরিকল্পনা",
      "সম্ভাব্য কারণগুলো",
      "তিনটি প্রস্তুত বাংলা বার্তা",
      "পরবর্তী কথোপকথনের দিকনির্দেশনা",
    ]) {
      expect(premiumPage).toContain(item);
    }
  });
});
