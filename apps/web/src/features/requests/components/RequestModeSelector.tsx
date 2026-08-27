"use client";

import { UsersRound, UserRoundCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PublicProfessionalData, RequestMode } from "../types/request.types";

export function RequestModeSelector({ mode, professional, onChange }: { mode: RequestMode; professional: PublicProfessionalData; onChange: (mode: RequestMode) => void }) {
  return (
    <div className="grid gap-3">
      <button type="button" className={cn("rounded-2xl border p-4 text-left transition-colors", mode === "direct" ? "border-brand-600 bg-brand-100" : "border-neutral-200 hover:border-brand-500")} onClick={() => onChange("direct")}>
        <UserRoundCheck className="h-5 w-5 text-brand-700" /><p className="mt-3 font-display text-xl font-bold text-neutral-950">Solo a {professional.name.split(" ")[0]}</p><p className="mt-1 text-sm leading-6 text-neutral-600">Flujo directo con el profesional seleccionado.</p>
      </button>
      <button type="button" className={cn("rounded-2xl border p-4 text-left transition-colors", mode === "multi" ? "border-brand-600 bg-brand-100" : "border-neutral-200 hover:border-brand-500")} onClick={() => onChange("multi")}>
        <UsersRound className="h-5 w-5 text-brand-700" /><p className="mt-3 font-display text-xl font-bold text-neutral-950">{professional.name.split(" ")[0]} + otros profesionales</p><p className="mt-1 text-sm leading-6 text-neutral-600">Recibe propuestas comparables sin volver a llenar los datos.</p>
      </button>
    </div>
  );
}
