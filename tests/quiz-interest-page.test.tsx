/**
 * @vitest-environment jsdom
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import QuizInterestPage from "@/app/quiz/interest/page";

const push = vi.fn();
const replace = vi.fn();
const setAnswer = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

vi.mock("@/lib/session-context", () => ({
  useSessionState: () => ({
    sessionToken: "session-token-123",
    setAnswer,
    answers: {},
  }),
}));

describe("quiz interest page", () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    setAnswer.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows Bangla percentage progress and hides question count visually", () => {
    render(<QuizInterestPage />);
    fireEvent.click(screen.getByRole("button", { name: "শুরু করুন" }));

    expect(screen.getByText("১০% সম্পন্ন")).toBeTruthy();
    expect(screen.getByText("প্রশ্ন ১, মোট ১০টি প্রশ্ন").className).toContain("sr-only");
    expect(screen.queryByText("প্রশ্ন ১ / ১০")).toBeNull();
  });

  it("lets users close the active quiz and return to start", () => {
    render(<QuizInterestPage />);
    fireEvent.click(screen.getByRole("button", { name: "শুরু করুন" }));
    fireEvent.click(screen.getByRole("button", { name: "যাচাই বন্ধ করুন" }));

    expect(push).toHaveBeenCalledWith("/start");
  });

  it("lets users leave the introduction screen", () => {
    render(<QuizInterestPage />);

    fireEvent.click(screen.getByRole("button", { name: "ফিরে যান" }));
    expect(push).toHaveBeenCalledWith("/start");

    fireEvent.click(screen.getByRole("button", { name: "বন্ধ করুন" }));
    expect(push).toHaveBeenCalledWith("/start");
  });

  it("automatically progresses after a successful save", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ completionCount: 1, totalCount: 10 }),
    } as Response);

    render(<QuizInterestPage />);
    fireEvent.click(screen.getByRole("button", { name: "শুরু করুন" }));
    fireEvent.click(screen.getByRole("button", { name: "একবারও না" }));

    await waitFor(() => expect(setAnswer).toHaveBeenCalledWith("q1", "not_once"));
    expect(await screen.findByText("উত্তর সংরক্ষণ করা হয়েছে")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /প্রায় প্রতিদিন|৩–৫ দিন|১–২ দিন|একবারও না/ }).every((button) => button.hasAttribute("disabled"))).toBe(true);

    await waitFor(() => expect(screen.getByText("২০% সম্পন্ন")).toBeTruthy());
    expect(screen.getByRole("heading", { name: "শেষ কয়েকটি বার্তার উত্তর সাধারণত কত সময় পরে এসেছে?" })).toBeTruthy();
  });

  it("does not progress after a failed save and re-enables options", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "failed" }),
    } as Response);

    render(<QuizInterestPage />);
    fireEvent.click(screen.getByRole("button", { name: "শুরু করুন" }));
    fireEvent.click(screen.getByRole("button", { name: "একবারও না" }));

    expect(await screen.findByText("উত্তরটি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।")).toBeTruthy();
    expect(screen.getByText("১০% সম্পন্ন")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "গত ৭ দিনে সে নিজে থেকে কতদিন বার্তা পাঠিয়েছে?" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /প্রায় প্রতিদিন|৩–৫ দিন|১–২ দিন|একবারও না/ }).every((button) => button.hasAttribute("disabled"))).toBe(false);
  });
});
