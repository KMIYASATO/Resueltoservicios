"use client";

import { mockOfferService } from "../services/mock-offer.service";
import type { Offer } from "../types/request.types";

export function OfferComparison({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3"><h2 className="font-display text-xl font-bold text-neutral-950">Comparación</h2><p className="text-sm text-neutral-600">Compara hasta 3 propuestas. No se rankea solo por precio.</p></div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-[0.08em] text-neutral-500"><tr>{["Profesional", "Precio", "Rating", "Disponibilidad", "Alcance", "Zona/ETA", "Respuesta"].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead>
          <tbody className="divide-y divide-neutral-200">
            {offers.map((offer) => <tr key={offer.id}><td className="px-4 py-3 font-semibold text-neutral-950">{offer.professional.name}</td><td className="px-4 py-3 text-brand-700">{mockOfferService.formatPrice(offer)}</td><td className="px-4 py-3">{offer.professional.rating} · {offer.professional.reviews}</td><td className="px-4 py-3">{offer.availability}</td><td className="px-4 py-3">{offer.scopeIncluded}</td><td className="px-4 py-3">{offer.etaLabel}</td><td className="px-4 py-3">{offer.responseLabel}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
