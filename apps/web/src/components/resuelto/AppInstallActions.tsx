"use client";

import { Smartphone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function AppInstallActions({ compact = false }: { compact?: boolean }) {
  const [showHelp, setShowHelp] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const apkUrl = `${basePath}/downloads/resuelto-android.apk`;

  return (
    <div className={compact ? "grid gap-2 sm:grid-cols-[1fr_auto]" : "grid gap-3 sm:grid-cols-[1fr_auto]"}>
      <a
        href={apkUrl}
        download="resuelto-android.apk"
        className="group flex min-h-14 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm transition-[border-color,transform,box-shadow] duration-fast hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 group-hover:bg-brand-600 group-hover:text-white">
          <Smartphone aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="grid leading-tight">
          <span className="text-xs font-semibold text-neutral-500">APK Android</span>
          <span className="text-base font-bold text-neutral-950">Descargar app</span>
        </span>
      </a>

      <button
        type="button"
        className="min-h-14 rounded-2xl border border-brand-600 bg-white px-4 py-3 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        onClick={() => setShowHelp((value) => !value)}
      >
        Cómo instalar
      </button>

      {showHelp ? (
        <p className={cn("rounded-2xl bg-brand-100 px-4 py-3 text-sm leading-6 text-neutral-700", compact ? "sm:col-span-2" : "sm:col-span-2")}>
          Descarga el APK, ábrelo desde Descargas y acepta instalar desde Chrome si Android lo solicita. La app usa el mismo logo y abre Resuelto en pantalla de app.
        </p>
      ) : null}
    </div>
  );
}
