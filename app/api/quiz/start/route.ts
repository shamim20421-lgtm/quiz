import { randomUUID } from "crypto";
import { errorResponse, jsonResponse } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { startQuizSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = startQuizSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("অনুরোধটি সঠিক নয়।", 400);

  const supabaseAdmin = getSupabaseAdmin();
  const sessionToken = randomUUID();
  const { error } = await supabaseAdmin.from("quiz_sessions").insert({
    session_token: sessionToken,
    problem_type: parsed.data.problemType,
    status: "started",
  });

  if (error) return errorResponse("যাচাই শুরু করা যায়নি। আবার চেষ্টা করুন।", 500);

  return jsonResponse({ sessionToken, problemType: parsed.data.problemType });
}
