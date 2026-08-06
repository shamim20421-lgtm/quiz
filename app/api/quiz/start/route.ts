import { randomUUID } from "crypto";
import { errorResponse, jsonResponse } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { startQuizSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = startQuizSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("অনুরোধটি সঠিক নয়।", 400);

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const sessionToken = randomUUID();
    const { error } = await supabaseAdmin.from("quiz_sessions").insert({
      session_token: sessionToken,
      problem_type: parsed.data.problemType,
      status: "started",
    });

    if (error) {
      console.error("quiz_sessions insert failed", error);
      return errorResponse("যাচাই শুরু করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।", 500);
    }

    return jsonResponse({ sessionToken, problemType: parsed.data.problemType });
  } catch (error) {
    console.error("quiz start failed", error);
    return errorResponse("যাচাই শুরু করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।", 500);
  }
}
