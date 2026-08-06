export const disclaimer =
  "এই সেবা শিক্ষামূলক ও আত্ম-পর্যালোচনার উদ্দেশ্যে তৈরি। এটি কাউন্সেলিং, চিকিৎসা বা কোনো ব্যক্তির অনুভূতি সম্পর্কে নিশ্চিত সিদ্ধান্ত নয়।";

export const safetyMessage =
  "সম্পর্কে ভয়, হুমকি, জোরজবরদস্তি বা সহিংসতা থাকলে নিরাপদ জায়গায় যান এবং বিশ্বস্ত ব্যক্তি বা স্থানীয় সহায়তা সেবার সঙ্গে যোগাযোগ করুন।";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-sm leading-6 text-slate-300">
      <div className="mx-auto max-w-[920px] space-y-3">
        <p>{disclaimer}</p>
        <p>{safetyMessage}</p>
        <p className="text-slate-400">© আজকের সম্পর্ক</p>
      </div>
    </footer>
  );
}
