import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { MetaPixel } from "@/components/meta-pixel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SessionProvider } from "@/lib/session-context";

const banglaFont = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  preload: true,
  variable: "--font-bangla",
});

const banglaNumberFont = Noto_Sans_Bengali({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  preload: true,
  variable: "--font-bangla-number",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://relationship.creatives71.com"),
  title: "আজকের সম্পর্ক | আপনার সম্পর্ককে একটু পরিষ্কারভাবে দেখুন",
  description: "মাত্র ১০টি ছোট প্রশ্নের মাধ্যমে আপনার সম্পর্কের বর্তমান পরিস্থিতি বুঝুন এবং পরবর্তী করণীয় সম্পর্কে ব্যক্তিগত দিকনির্দেশনা পান।",
  alternates: {
    canonical: "https://relationship.creatives71.com",
  },
  openGraph: {
    title: "আজকের সম্পর্ক ❤️",
    description: "সে কি আগের মতো কথা বলছে না? মাত্র ১০টি প্রশ্নের উত্তর দিয়ে আপনার সম্পর্কের পরিস্থিতি একটু পরিষ্কারভাবে বুঝুন।",
    url: "https://relationship.creatives71.com",
    siteName: "আজকের সম্পর্ক",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://relationship.creatives71.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "আজকের সম্পর্ক",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "আজকের সম্পর্ক ❤️",
    description: "সে কি আগের মতো কথা বলছে না? মাত্র ১০টি প্রশ্নের উত্তর দিয়ে আপনার সম্পর্কের পরিস্থিতি একটু পরিষ্কারভাবে বুঝুন।",
    images: ["https://relationship.creatives71.com/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn-BD" className={`${banglaFont.variable} ${banglaNumberFont.variable}`}>
      <body className={banglaFont.className}>
        <SessionProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
      <MetaPixel />
      <GoogleAnalytics gaId="G-PRC3694XMR" />
    </html>
  );
}
