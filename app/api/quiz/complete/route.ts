import { IncompleteAssessmentError, completeQuizWithClient } from "@/lib/assessment/complete";
import { errorResponse, jsonResponse } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { completeQuizSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = completeQuizSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("সেশনটি সঠিক নয়।", 400);

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const result = await completeQuizWithClient(supabaseAdmin, parsed.data.sessionToken);
    return jsonResponse(result);
  } catch (error) {
    if (error instanceof IncompleteAssessmentError) {
      return errorResponse("দশটি প্রশ্নের সবগুলোর উত্তর প্রয়োজন।", 409);
    }
    return errorResponse("ফলাফল তৈরি করা যায়নি। আবার চেষ্টা করুন।", 500);
  }
}
