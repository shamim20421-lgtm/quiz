import { generateMessages, toneLabels } from "@/lib/messages/generator";
import { errorResponse, jsonResponse } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { messageGenerateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = messageGenerateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse("বার্তা তৈরির তথ্য সঠিক নয়।", 400);

  const messages = generateMessages(parsed.data);
  let quizSessionId: string | null = null;
  const supabaseAdmin = getSupabaseAdmin();

  if (parsed.data.sessionToken) {
    const { data: session } = await supabaseAdmin.from("quiz_sessions").select("id").eq("session_token", parsed.data.sessionToken).maybeSingle();
    quizSessionId = session?.id ?? null;
  }

  await supabaseAdmin.from("generated_messages").insert({
    quiz_session_id: quizSessionId,
    session_token: parsed.data.sessionToken ?? null,
    received_text: parsed.data.receivedText,
    intention: parsed.data.intention,
    tone: parsed.data.tone,
    tone_label: toneLabels[parsed.data.tone],
    generated_options: messages,
  });

  return jsonResponse({ tone: parsed.data.tone, toneLabel: toneLabels[parsed.data.tone], messages });
}
