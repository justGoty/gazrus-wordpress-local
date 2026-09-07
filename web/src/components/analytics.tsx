"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isAnalyticsEnabled, trackGoal, trackPageView } from "@/lib/analytics";

export function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    if (pathname) trackPageView(`${pathname}${search ? `?${search}` : ""}`);
  }, [pathname, search]);

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return;
      if (event.target.closest('a[href^="tel:"]')) trackGoal("phone_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
