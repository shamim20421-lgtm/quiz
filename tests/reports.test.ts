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
      expect(template.fullSummary.length).toBeGreaterThan(20);
      expect(template.sampleMessage).not.toContain("সে আর ভালোবাসে না");
    }
  });
});
