"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackMetaPageView } from "@/lib/meta-pixel";

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    trackMetaPageView(pathname);
  }, [pathname]);

  return null;
}
