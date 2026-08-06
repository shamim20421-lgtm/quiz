import { describe, expect, it } from "vitest";
import { getResultType } from "@/lib/assessment/scoring";

describe("score ranges", () => {
  it("maps all boundaries to the correct result types", () => {
    expect(getResultType(0)).toBe("stable");
    expect(getResultType(7)).toBe("stable");
    expect(getResultType(8)).toBe("temporary_distance");
    expect(getResultType(15)).toBe("temporary_distance");
    expect(getResultType(16)).toBe("communication_imbalance");
    expect(getResultType(23)).toBe("communication_imbalance");
    expect(getResultType(24)).toBe("emotional_distance");
    expect(getResultType(30)).toBe("emotional_distance");
  });
});
