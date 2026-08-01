"use client";

import Image from "next/image";
import { Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISSED_KEY = "resuelto-mobile-app-banner-dismissed-at";
const DISMISSED_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim();
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL?.trim();

function isMobileTouchViewport() {
  return window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches;
}

function isDismissed() {
  const dismissedAt = window.localStorage.getItem(DISMISSED_KEY);
  if (!dismissedAt) return false;
  const elapsed = Date.now() - Number(dismissedAt);
  return Number.isFinite(elapsed) && elapsed < DISMISSED_TTL_MS;
}

function getMobileOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();
  const hasTouch = window.navigator.maxTouchPoints > 1;

  if (/iphone|ipad|ipod/.test(userAgent) || (platform === "macintel" && hasTouch)) return "ios";
  if (/android/.test(userAgent)) return "android";
  return "unknown";
}

export function MobileAppBanner() {
  const [visible, setVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    function updateVisibility() {
      setVisible(isMobileTouchViewport() && !isDismissed());
    }

    updateVisibility();
    const media = window.matchMedia("(max-width: 767px) and (pointer: coarse)");
    media.addEventListener("change", updateVisibility);
    return () => media.removeEventListener("change", updateVisibility);
  }, []);

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  function openStore(url: string | undefined) {
    if (!url) return false;
    window.location.assign(url);
    return true;
  }

  function handleDownload() {
    const os = getMobileOS();
    if (os === "ios" && openStore(APP_STORE_URL)) return;
    if (os === "android" && openStore(GOOGLE_PLAY_URL)) return;
    setShowOptions(true);
  }

  if (!visible) return null;

  return (
    <div className="mx-auto mt-4 block max-w-2xl text-left md:hidden">
      <div className="rounded-2xl border border-brand-100 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex min-h-[84px] items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-100">
            <Image src={`${basePath}/queda-logo.png`} alt="" width={86} height={31} className="h-7 w-auto max-w-none" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold leading-5 text-neutral-950">Usa Resuelto desde tu celular</p>
                <p className="mt-0.5 text-xs leading-5 text-neutral-600">Accede más rápido a tus solicitudes y profesionales.</p>
              </div>
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" aria-label="Cerrar descarga de app" onClick={dismiss}>
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-brand-600 px-3 text-xs font-bold text-white transition-colors hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" onClick={handleDownload}>
                <Smartphone aria-hidden="true" className="h-3.5 w-3.5" />
                Descargar app
              </button>
              <button className="min-h-9 rounded-full px-3 text-xs font-bold text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" type="button" onClick={dismiss}>
                Ahora no
              </button>
            </div>
          </div>
        </div>

        {showOptions ? (
          <div className="mt-3 grid gap-2 border-t border-neutral-100 pt-3 text-xs sm:grid-cols-2">
            <button className="rounded-xl border border-neutral-200 px-3 py-2 font-bold text-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-400" type="button" disabled={!APP_STORE_URL} onClick={() => openStore(APP_STORE_URL)}>
              App Store
            </button>
            <button className="rounded-xl border border-neutral-200 px-3 py-2 font-bold text-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-400" type="button" disabled={!GOOGLE_PLAY_URL} onClick={() => openStore(GOOGLE_PLAY_URL)}>
              Google Play
            </button>
            {!APP_STORE_URL || !GOOGLE_PLAY_URL ? <p className="text-neutral-500 sm:col-span-2">Configurar `NEXT_PUBLIC_APP_STORE_URL` y `NEXT_PUBLIC_GOOGLE_PLAY_URL` para activar las tiendas.</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
