import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SessionProvider } from "@/lib/session-context";

const banglaFont = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "আজকের সম্পর্ক",
  description: "Bangla relationship assessment prototype",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
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
