import { describe, expect, it } from "vitest";
import { reportTemplates } from "@/lib/assessment/reports";
import type { ResultType } from "@/lib/types";

const resultTypes: ResultType[] = ["stable", "temporary_distance", "communication_imbalance", "emotional_distance"];

describe("report templates", () => {
  it("contains complete deterministic content for all result types", () => {
    for (const type of resultTypes) {
      const template = reportTemplates[type];
      expect(template.freeSummary).toHaveLength(2);
      expect(template.possibleReasons).toHaveLength(3);
      expect(template.actionPlan).toHaveLength(3);
      expect(template.mistakesToAvoid).toHaveLength(5);
      expect(template.suggestedMessages).toHaveLength(3);
      expect(template.avoidToday.length).toBeGreaterThan(20);
      expect(template.fullSummary.length).toBeGreaterThan(20);
      expect(template.sampleMessage).not.toContain("সে আর ভালোবাসে না");
    }
  });

  it("contains the required avoidToday guidance for every free result", () => {
    expect(reportTemplates.stable.avoidToday).toBe("একটি দেরিতে আসা উত্তর বা ছোট পরিবর্তন থেকে তাকে পরীক্ষা করা, অভিযোগ করা বা অপ্রয়োজনীয় ঝগড়া শুরু করবেন না।");
    expect(reportTemplates.temporary_distance.avoidToday).toBe("অল্প সময়ের মধ্যে একাধিক বার্তা, কল বা চাপ সৃষ্টি করে এমন প্রশ্ন পাঠাবেন না।");
    expect(reportTemplates.communication_imbalance.avoidToday).toBe("উত্তর পাওয়ার আশায় বারবার যোগাযোগ করে একপক্ষীয় চেষ্টাটি চালিয়ে যাবেন না।");
    expect(reportTemplates.emotional_distance.avoidToday).toBe("হুমকি, প্রতারণার অভিযোগ, আবেগপূর্ণ আল্টিমেটাম বা অপমানজনক বার্তা পাঠাবেন না।");
  });

  it("uses the updated temporary distance sample message", () => {
    expect(reportTemplates.temporary_distance.sampleMessage).toBe(
      "কয়েকদিন ধরে আমাদের কথা একটু কম হচ্ছে বলে মনে হচ্ছে। তুমি ব্যস্ত থাকলে আমি বুঝতে পারি। সময় হলে জানিও—সবকিছু ঠিক আছে কি না জানতে চাই।",
    );
  });
});
