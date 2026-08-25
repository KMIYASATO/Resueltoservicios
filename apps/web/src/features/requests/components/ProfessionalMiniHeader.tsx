import { Star } from "lucide-react";
import type { PublicProfessionalData } from "../types/request.types";

export function ProfessionalMiniHeader({ professional }: { professional: PublicProfessionalData }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden="true">{professional.initials}</div>
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-bold text-neutral-950">{professional.name}</p>
        <p className="truncate text-sm text-neutral-600">{professional.specialty}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-neutral-700"><Star className="h-3.5 w-3.5 fill-warning-600 text-warning-600" /> {professional.rating} · {professional.reviews}</p>
      </div>
    </div>
  );
}
