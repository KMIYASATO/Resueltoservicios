"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: `${basePath}/` }).then((registration) => registration.update()).catch(() => {
      // The site still works normally if registration is blocked by the browser.
    });
  }, []);

  return null;
}
