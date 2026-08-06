import { describe, expect, it } from "vitest";
import { getFirstAssessmentDatabaseProblemType } from "@/lib/assessment/problem-type";

describe("first assessment database problem type", () => {
  it("uses the DB-safe first funnel value for all assessment starts", () => {
    expect(getFirstAssessmentDatabaseProblemType()).toBe("losing_interest");
  });
});
