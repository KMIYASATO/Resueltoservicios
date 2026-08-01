"use client";

import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

export function AppInstallActions({ compact = false }: { compact?: boolean }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
      setShowHelp(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (installed) return;
    if (!installPrompt) {
      setShowHelp(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === "dismissed") setShowHelp(true);
  }

  return (
    <div className={compact ? "grid gap-2 sm:grid-cols-[1fr_auto]" : "grid gap-3 sm:grid-cols-[1fr_auto]"}>
      <button
        type="button"
        className="group flex min-h-14 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm transition-[border-color,transform,box-shadow] duration-fast hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        onClick={handleInstall}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white">
          <Smartphone aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="grid leading-tight">
          <span className="text-xs font-semibold text-neutral-500">Android y web mobile</span>
          <span className="text-base font-bold text-neutral-950">{installed ? "App instalada" : "Instalar app"}</span>
        </span>
      </button>

      <button
        type="button"
        className="min-h-14 rounded-2xl border border-brand-600 bg-white px-4 py-3 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        onClick={() => setShowHelp((value) => !value)}
      >
        Cómo instalar
      </button>

      {showHelp ? (
        <p className={cn("rounded-2xl bg-brand-100 px-4 py-3 text-sm leading-6 text-neutral-700", compact ? "sm:col-span-2" : "sm:col-span-2")}>
          En Android abre esta página en Chrome, toca el menú de tres puntos y elige Instalar app o Agregar a pantalla principal.
        </p>
      ) : null}
    </div>
  );
}
