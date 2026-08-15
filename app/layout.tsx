import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
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
  title: "আজকের সম্পর্ক",
  description: "Bangla relationship assessment prototype",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${banglaFont.variable} ${banglaNumberFont.variable}`}>
      <body className={banglaFont.className}>
        <SessionProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
      <GoogleAnalytics gaId="G-PRC3694XMR" />
    </html>
  );
}
