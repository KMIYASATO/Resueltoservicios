import { ReceiptText } from "lucide-react";
import type { EstimatedPriceBand as EstimatedPriceBandType } from "../types/request.types";

export function EstimatedPriceBand({ estimate }: { estimate: EstimatedPriceBandType }) {
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-100 p-4">
      <ReceiptText className="h-5 w-5 text-brand-700" />
      <p className="mt-3 text-sm font-semibold text-brand-700">Estimado referencial de Queda</p>
      <h3 className="mt-1 font-display text-3xl font-bold text-neutral-950">{estimate.label}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{estimate.explanation}</p>
    </div>
  );
}
