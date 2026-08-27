"use client";

import { Clock3, MapPin, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockOfferService } from "../services/mock-offer.service";
import { offerStatusLabels } from "../state/request-machine";
import type { Offer } from "../types/request.types";

export function OfferCard({ offer, selectedForComparison, onToggleComparison, onChat, onChoose }: { offer: Offer; selectedForComparison: boolean; onToggleComparison: () => void; onChat: () => void; onChoose: () => void }) {
  const unavailable = offer.status === "expired" || offer.status === "withdrawn" || offer.status === "not_selected";
  return (
    <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{offer.professional.initials}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl font-bold text-neutral-950">{offer.professional.name}</h3><Badge tone={offer.status === "accepted" ? "success" : "neutral"}>{offerStatusLabels[offer.status]}</Badge></div><p className="text-sm text-neutral-600">{offer.professional.specialty}</p><p className="mt-1 flex items-center gap-1 text-xs font-semibold text-neutral-700"><Star className="h-3.5 w-3.5 fill-warning-600 text-warning-600" /> {offer.professional.rating} · {offer.professional.reviews}</p></div>
      </div>
      <div className="grid gap-3 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-700 sm:grid-cols-3"><span className="font-semibold text-brand-700">{mockOfferService.formatPrice(offer)}</span><span><Clock3 className="mr-1 inline h-4 w-4 text-brand-600" />{offer.availability}</span><span><MapPin className="mr-1 inline h-4 w-4 text-brand-600" />{offer.etaLabel}</span></div>
      <div className="text-sm leading-6 text-neutral-600"><p><strong className="text-neutral-950">Tipo:</strong> {mockOfferService.pricingTypeLabel(offer)}</p><p><strong className="text-neutral-950">Alcance:</strong> {offer.scopeIncluded}</p><p><strong className="text-neutral-950">Nota:</strong> {offer.note}</p><p className="text-xs font-semibold text-neutral-500">{offer.responseLabel}</p></div>
      <div className="grid gap-2 sm:grid-cols-3"><Button type="button" variant="secondary" onClick={onChat}><MessageCircle className="h-4 w-4" /> Chat</Button><Button type="button" variant="secondary" disabled={offer.status !== "sent" && offer.status !== "viewed" && offer.status !== "negotiating"} onClick={onToggleComparison}>{selectedForComparison ? "Quitar" : "Comparar"}</Button><Button type="button" disabled={unavailable || offer.status === "accepted"} onClick={onChoose}>Elegir</Button></div>
    </div>
  );
}
