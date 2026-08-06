import type { Tone } from "@/lib/types";

export const toneLabels: Record<Tone, string> = {
  soft: "কোমল",
  mature: "পরিণত",
  romantic: "রোমান্টিক",
  confident: "আত্মবিশ্বাসী",
};

export function generateMessages(input: {
  receivedText: string;
  intention: string;
  tone: Tone;
}): [string, string, string] {
  const intention = input.intention.trim();

  const templates: Record<Tone, [string, string, string]> = {
    soft: [
      `তোমার কথাটা বুঝতে চেষ্টা করছি। ${intention} বিষয়টা নিয়ে তুমি স্বচ্ছন্দ হলে আমরা শান্তভাবে কথা বলতে পারি?`,
      `আমি কোনো চাপ দিতে চাই না। শুধু চাই, ${intention} নিয়ে আমাদের কথাটা সহজভাবে হোক।`,
      `তোমার অনুভূতিটাও আমার কাছে গুরুত্বপূর্ণ। সময় পেলে ${intention} নিয়ে একটু খোলামেলা বলো।`,
    ],
    mature: [
      `আমি বিষয়টা পরিষ্কারভাবে বুঝতে চাই। ${intention} নিয়ে আমরা কি দুজন শান্তভাবে কথা বলতে পারি?`,
      `অনুমান করে সিদ্ধান্ত নিতে চাই না। ${intention} বিষয়ে তোমার দিকটা শুনলে ভালো লাগবে।`,
      `আমার মনে হয় কথাটা সম্মান রেখে বলা দরকার। ${intention} নিয়ে তোমার সুবিধামতো কথা বলি।`,
    ],
    romantic: [
      `তোমার সঙ্গে সম্পর্কটা আমার কাছে মূল্যবান। ${intention} নিয়ে আমরা একটু মন খুলে কথা বললে ভালো লাগবে।`,
      `আমি চাই আমাদের কথায় দূরত্ব না বাড়ুক। ${intention} নিয়ে তোমার পাশে থেকেই বুঝতে চাই।`,
      `তোমাকে দোষ দিতে নয়, কাছে আসতেই বলছি। ${intention} নিয়ে একটু সময় দেবে?`,
    ],
    confident: [
      `আমি নিজের অনুভূতি স্পষ্টভাবে বলতে চাই। ${intention} নিয়ে কথা বলা আমার জন্য গুরুত্বপূর্ণ।`,
      `আমি সম্মান রেখে পরিষ্কার থাকতে চাই। ${intention} বিষয়ে তোমার অবস্থান জানালে ভালো হয়।`,
      `অস্পষ্টতায় থাকতে চাই না। ${intention} নিয়ে আমরা শান্তভাবে কথা বলি।`,
    ],
  };

  return templates[input.tone];
}
