import { describe, expect, it } from "vitest";
import { generateMessages } from "@/lib/messages/generator";
import { messageGenerateSchema } from "@/lib/validation";

describe("message generation", () => {
  it("returns exactly three options", () => {
    const messages = generateMessages({
      receivedText: "আজ কথা বলতে পারব না",
      intention: "আমি শান্তভাবে কথা বলতে চাই",
      tone: "mature",
    });

    expect(messages).toHaveLength(3);
    expect(new Set(messages).size).toBe(3);
  });

  it("rejects invalid tone values", () => {
    const parsed = messageGenerateSchema.safeParse({
      receivedText: "হ্যালো",
      intention: "কথা বলতে চাই",
      tone: "angry",
    });

    expect(parsed.success).toBe(false);
  });
});
