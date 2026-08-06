/**
 * @vitest-environment jsdom
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StartPage from "@/app/start/page";

const push = vi.fn();
const setSession = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/session-context", () => ({
  useSessionState: () => ({ setSession }),
}));

describe("start page", () => {
  beforeEach(() => {
    push.mockReset();
    setSession.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders all six situation cards", () => {
    render(<StartPage />);

    expect(screen.getByRole("heading", { name: "আজ আপনার মনে কোন প্রশ্নটা ঘুরছে?" })).toBeTruthy();
    expect(screen.getByText("যেটা এখন সবচেয়ে বেশি ভাবাচ্ছে, সেটি বেছে নিন।")).toBeTruthy();
    expect(screen.getByRole("button", { name: /আগে নিজেই মেসেজ করত/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /সে ৮ ঘণ্টা পর রিপ্লাই দেয়/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /সে বদলে গেছে/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /সে আমাকে এড়িয়ে চলছে/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /আমরা ঝগড়া করেছি/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /আমি কী লিখব/ })).toBeTruthy();
  });

  it("starts an assessment with the selected problem type and routes to quiz intro", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessionToken: "session-token-123", problemType: "not_texting" }),
    } as Response);

    render(<StartPage />);
    fireEvent.click(screen.getByRole("button", { name: /আগে নিজেই মেসেজ করত/ }));

    expect(await screen.findByText("শুরু হচ্ছে...")).toBeTruthy();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/quiz/start",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ problemType: "not_texting" }),
      }),
    );
    await waitFor(() => expect(setSession).toHaveBeenCalledWith("session-token-123", "not_texting"));
    expect(push).toHaveBeenCalledWith("/quiz/interest");
  });

  it("shows a dismissible retry dialog when assessment start fails", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "failed" }),
    } as Response);

    render(<StartPage />);
    fireEvent.click(screen.getByRole("button", { name: /সে ৮ ঘণ্টা পর রিপ্লাই দেয়/ }));

    expect(await screen.findByRole("dialog", { name: "যাচাই শুরু হয়নি" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "বন্ধ করুন" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "ফিরে যান" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "আবার চেষ্টা করুন" })).toBeTruthy();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sessionToken: "session-token-456", problemType: "late_reply" }),
    } as Response);
    fireEvent.click(screen.getByRole("button", { name: "আবার চেষ্টা করুন" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/quiz/start",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ problemType: "late_reply" }),
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith("/quiz/interest"));
  });

  it("routes the message card directly without starting a quiz session", () => {
    const fetchMock = vi.mocked(fetch);

    render(<StartPage />);
    fireEvent.click(screen.getByRole("button", { name: /আমি কী লিখব/ }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/message");
  });
});
