"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { trackMetaPageView } from "@/lib/meta-pixel";

const metaPixelId = "1416756400306798";

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.__metaPixelLastPageViewPath === pathname) {
      return;
    }

    window.__metaPixelLastPageViewPath = pathname;
    trackMetaPageView();
  }, [pathname]);

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        if (!window.__metaPixelInitialized) {
          window.__metaPixelInitialized = true;
          fbq('init', '${metaPixelId}');
          fbq('track', 'PageView');
          window.__metaPixelLastPageViewPath = window.location.pathname;
        }
      `}
    </Script>
  );
}
