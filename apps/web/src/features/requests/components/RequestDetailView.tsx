"use client";

import { CheckCircle2, Clock3, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RequestChat } from "../chat/RequestChat";
import { ContactActions } from "../contact/ContactActions";
import { ReviewForm } from "../rating/ReviewForm";
import { mockOfferService } from "../services/mock-offer.service";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import { canRevealContact } from "../state/request-machine";
import type { Offer, ServiceRequest } from "../types/request.types";
import { formatDateLabel, formatShortDate } from "../utils/format";
import { AttachmentPreview } from "./AttachmentPreview";
import { MatchingStatus } from "./MatchingStatus";
import { OfferCard } from "./OfferCard";
import { OfferComparison } from "./OfferComparison";
import { ProfessionalMiniHeader } from "./ProfessionalMiniHeader";
import { RequestSecondaryActions } from "./RequestSecondaryActions";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestTimeline } from "./RequestTimeline";
import { ScheduleProposalCard } from "./ScheduleProposalCard";

export function RequestDetailView({ initialRequest, onChange }: { initialRequest: ServiceRequest; onChange?: (request: ServiceRequest) => void }) {
  const [request, setRequest] = useState(initialRequest);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [offerToConfirm, setOfferToConfirm] = useState<Offer | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const revealed = canRevealContact(request.status, request.acceptedOfferId);
  const latestProposal = [...request.proposals].reverse().find((proposal) => proposal.status === "pending");
  const selectedOffer = request.offers.find((offer) => offer.id === request.acceptedOfferId);
  const comparisonOffers = useMemo(() => request.offers.filter((offer) => comparisonIds.includes(offer.id)), [comparisonIds, request.offers]);

  useEffect(() => {
    setRequest(initialRequest);
    setComparisonIds([]);
  }, [initialRequest]);

  function update(next: ServiceRequest) {
    setRequest(next);
    onChange?.(next);
  }

  function toggleComparison(offerId: string) {
    setComparisonIds((current) => current.includes(offerId) ? current.filter((id) => id !== offerId) : current.length < 3 ? [...current, offerId] : current);
  }

  function chooseOffer() {
    if (!offerToConfirm) return;
    const next = mockRequestService.selectOffer(request.id, offerToConfirm.id);
    if (next) update(next);
    trackRequestEvent("offer_selected", { requestId: request.id, offerId: offerToConfirm.id });
    setOfferToConfirm(null);
  }

  function schedule() {
    const next = mockRequestService.scheduleSelectedRequest(request.id);
    if (next) update(next);
  }

  function complete() {
    const next = mockRequestService.completeRequest(request.id);
    if (next) update(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid h-fit gap-5">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3"><ProfessionalMiniHeader professional={selectedOffer?.professional ?? request.professional} /><RequestStatusBadge status={request.status} /></div>
          {request.status === "selected" || request.status === "scheduled" || request.status === "in_service" ? <div className="mt-5 rounded-2xl bg-success-100 p-4"><CheckCircle2 className="h-6 w-6 text-success-600" /><h2 className="mt-2 font-display text-2xl font-bold text-neutral-950">Propuesta elegida</h2><p className="mt-1 text-sm leading-6 text-neutral-700">{selectedOffer?.professional.name ?? request.professional.name} quedó seleccionado para coordinar por Queda.</p>{request.status === "selected" ? <Button className="mt-4" type="button" onClick={schedule}>Confirmar programación</Button> : null}</div> : null}
          {request.status === "cancelled" ? <div className="mt-5 rounded-2xl bg-neutral-100 p-4"><h2 className="font-display text-2xl font-bold text-neutral-950">Solicitud cancelada</h2><p className="mt-1 text-sm text-neutral-600">Puedes reabrir la búsqueda sin empezar desde cero.</p><Button className="mt-4" type="button" variant="secondary" onClick={() => { const next = mockRequestService.reopenMarketplace(request.id); if (next) update(next); trackRequestEvent("request_reopened", { requestId: request.id }); }}><RotateCcw className="h-4 w-4" /> Reabrir a otros profesionales</Button></div> : null}
        {request.status === "expired" ? <div className="mt-5 rounded-2xl bg-neutral-100 p-4"><h2 className="font-display text-2xl font-bold text-neutral-950">No llegaron propuestas vigentes</h2><p className="mt-1 text-sm text-neutral-600">Puedes reabrir la búsqueda o volver a resultados conservando servicio y distrito.</p><div className="mt-4 flex flex-wrap gap-2"><Button type="button" variant="secondary" onClick={() => { const next = mockRequestService.reopenMarketplace(request.id); if (next) update(next); }}>Reabrir solicitud</Button><a className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-brand-600 bg-white px-5 py-3 text-sm font-semibold text-brand-600" href={`${basePath}/resultados/?categoria=${request.categorySlug}&servicio=${request.serviceSlug}&distrito=${request.districtSlug}`}><Search className="h-4 w-4" /> Ver otros profesionales</a></div></div> : null}
        </Card>

        <MatchingStatus request={request} onChange={update} />

        <Card className="p-5">
          <h2 className="font-display text-2xl font-bold text-neutral-950">Resumen</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl bg-neutral-50 p-3"><p className="font-semibold text-neutral-950">{request.serviceLabel}</p><p className="mt-1 text-neutral-600">{formatDateLabel(request.agreedDate ?? request.preferredDate)} · {request.agreedTime ?? request.preferredTime}</p><p className="mt-1 text-neutral-600">{request.districtLabel}</p></div>
            <div className="rounded-xl bg-neutral-50 p-3"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">Necesidad</p><p className="mt-1 font-semibold text-neutral-950">{request.need}</p><p className="mt-2 leading-6 text-neutral-600">{request.description}</p></div>
            <div className="rounded-xl border border-brand-200 bg-brand-100 p-3"><p className="text-sm font-semibold text-brand-700">Estimado Queda</p><p className="mt-1 font-display text-xl font-bold text-neutral-950">{request.estimatedPrice.label}</p><p className="mt-1 text-neutral-700">No es precio final; cada oferta define alcance y condiciones.</p></div>
            {request.attachments.length ? <div className="rounded-xl bg-neutral-50 p-3"><p className="mb-2 text-sm font-semibold text-neutral-950">Adjuntos</p><AttachmentPreview attachments={request.attachments} /></div> : null}
            {revealed ? <div className="rounded-xl border border-success-100 bg-success-100/60 p-3"><p className="text-sm font-semibold text-neutral-950">Dirección exacta autorizada</p><p className="mt-1 text-neutral-700">{request.address.formatted || request.address.query}</p><p className="mt-1 text-neutral-700">{request.address.propertyType} {request.address.unit ? `· ${request.address.unit}` : ""}</p><p className="mt-1 text-neutral-700">Referencia: {request.address.reference || "Sin referencia"}</p><p className="mt-1 text-neutral-700">Teléfono: {request.phone || "Por confirmar"}</p></div> : <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"><p className="text-sm font-semibold text-neutral-950">Datos privados protegidos</p><p className="mt-1 text-neutral-600">Solo se renderizan distrito y zona aproximada: {request.address.approximateZone}.</p></div>}
          </div>
        </Card>

        {request.status === "scheduled" || request.status === "in_service" ? <Card className="p-5"><div className="flex items-start gap-3"><Clock3 className="h-6 w-6 text-brand-600" /><div><p className="text-sm font-semibold text-brand-700">Próxima atención</p><h2 className="mt-1 font-display text-2xl font-bold text-neutral-950">{selectedOffer?.professional.name ?? request.professional.name}</h2><p className="mt-1 text-sm text-neutral-700">{formatShortDate(request.agreedDate ?? request.preferredDate)} · {request.agreedTime ?? request.preferredTime}</p><p className="text-sm text-neutral-700">{request.districtLabel}</p></div></div><div className="mt-4 rounded-xl bg-brand-100 p-3 text-sm font-semibold text-brand-700">Tu atención está programada para la franja acordada.</div><Button className="mt-4 w-full" type="button" onClick={complete}>Marcar como completado</Button></Card> : null}

        <ContactActions request={request} />
        <RequestSecondaryActions request={request} onChange={update} />
        <ReviewForm request={request} onChange={update} />
        <Card className="p-5"><h2 className="font-display text-2xl font-bold text-neutral-950">Actividad</h2><div className="mt-4"><RequestTimeline events={request.timeline} /></div></Card>
      </div>

      <div id="request-chat" className="grid gap-4">
        {request.status === "proposals_received" ? <div className="grid gap-4"><div><h2 className="font-display text-2xl font-bold text-neutral-950">Propuestas recibidas ({request.offers.filter((offer) => offer.status === "sent" || offer.status === "viewed" || offer.status === "negotiating").length})</h2><p className="mt-1 text-sm text-neutral-600">Elige con criterio: precio, rating, disponibilidad, alcance, zona/ETA y respuesta.</p><Button className="mt-3" type="button" variant="secondary" onClick={() => { const next = mockRequestService.expireOffers(request.id); if (next) update(next); }}>Simular ofertas expiradas</Button></div>{request.offers.map((offer) => <OfferCard key={offer.id} offer={offer} selectedForComparison={comparisonIds.includes(offer.id)} onToggleComparison={() => toggleComparison(offer.id)} onChat={() => document.getElementById("request-chat-main")?.scrollIntoView({ behavior: "smooth" })} onChoose={() => setOfferToConfirm(offer)} />)}<OfferComparison offers={comparisonOffers} /></div> : null}
        {latestProposal ? <ScheduleProposalCard request={request} proposal={latestProposal} onChange={update} /> : null}
        <div id="request-chat-main"><RequestChat request={request} onChange={update} /></div>
      </div>

      {offerToConfirm ? <div className="fixed inset-0 z-[95] grid place-items-center bg-brand-700/30 p-4"><Card className="max-w-md p-5"><h2 className="font-display text-2xl font-bold text-neutral-950">Elegir propuesta</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Vas a elegir a {offerToConfirm.professional.name} por {mockOfferService.formatPrice(offerToConfirm)}. Las demás propuestas quedarán cerradas como no seleccionadas y seguirán en historial.</p><div className="mt-5 grid gap-2 sm:grid-cols-2"><Button type="button" variant="secondary" onClick={() => setOfferToConfirm(null)}>Volver</Button><Button type="button" onClick={chooseOffer}>Confirmar elección</Button></div></Card></div> : null}
    </div>
  );
}
