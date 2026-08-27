"use client";

import { CheckCircle2, Clock3, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RequestChat } from "../chat/RequestChat";
import { ContactActions } from "../contact/ContactActions";
import { ReviewForm } from "../rating/ReviewForm";
import { mockRequestService } from "../services/mock-request.service";
import { canRevealContact } from "../state/request-machine";
import type { ServiceRequest } from "../types/request.types";
import { formatDateLabel, formatShortDate } from "../utils/format";
import { AttachmentPreview } from "./AttachmentPreview";
import { ProfessionalMiniHeader } from "./ProfessionalMiniHeader";
import { RequestSecondaryActions } from "./RequestSecondaryActions";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { RequestTimeline } from "./RequestTimeline";
import { ScheduleProposalCard } from "./ScheduleProposalCard";

export function RequestDetailView({ initialRequest, onChange }: { initialRequest: ServiceRequest; onChange?: (request: ServiceRequest) => void }) {
  const [request, setRequest] = useState(initialRequest);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const revealed = canRevealContact(request.status);
  const latestProposal = [...request.proposals].reverse().find((proposal) => proposal.status === "pending");

  useEffect(() => {
    setRequest(initialRequest);
  }, [initialRequest]);

  function update(next: ServiceRequest) {
    setRequest(next);
    onChange?.(next);
  }

  function complete() {
    const next = mockRequestService.completeRequest(request.id);
    if (next) update(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid h-fit gap-5">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <ProfessionalMiniHeader professional={request.professional} />
            <RequestStatusBadge status={request.status} />
          </div>
          {request.assignmentMode === "open" && request.status === "sent" ? <div className="mt-5 rounded-2xl bg-brand-100 p-4"><h2 className="font-display text-2xl font-bold text-neutral-950">Esperando postulación de técnicos</h2><p className="mt-1 text-sm leading-6 text-neutral-700">En unos momentos te aparecerán ofertas. Mientras tanto puedes editar información o escribir en Chat Queda.</p></div> : null}
          {request.status === "accepted" ? <div className="mt-5 rounded-2xl bg-success-100 p-4"><CheckCircle2 className="h-6 w-6 text-success-600" /><h2 className="mt-2 font-display text-2xl font-bold text-neutral-950">Solicitud aceptada</h2><p className="mt-1 text-sm leading-6 text-neutral-700">{request.professional.name.split(" ")[0]} confirmó que puede atenderte.</p></div> : null}
          {request.status === "rejected" ? <div className="mt-5 rounded-2xl bg-neutral-100 p-4"><h2 className="font-display text-2xl font-bold text-neutral-950">{request.professional.name.split(" ")[0]} no podrá atender esta solicitud.</h2><p className="mt-1 text-sm text-neutral-600">Puedes revisar otros profesionales conservando servicio y distrito.</p><a className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-brand-600 bg-white px-5 py-3 text-sm font-semibold text-brand-600" href={`${basePath}/resultados/?categoria=${request.categorySlug}&servicio=${request.serviceSlug}&distrito=${request.districtSlug}`}><Search className="h-4 w-4" /> Ver otros profesionales</a></div> : null}
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-2xl font-bold text-neutral-950">Resumen</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl bg-neutral-50 p-3"><p className="font-semibold text-neutral-950">{request.serviceLabel}</p><p className="mt-1 text-neutral-600">{formatDateLabel(request.agreedDate ?? request.preferredDate)} · {request.agreedTime ?? request.preferredTime}</p><p className="mt-1 text-neutral-600">{request.districtLabel}</p></div>
            <div className="rounded-xl bg-neutral-50 p-3"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">Necesidad</p><p className="mt-1 font-semibold text-neutral-950">{request.need}</p><p className="mt-2 leading-6 text-neutral-600">{request.description}</p></div>
            {request.attachments.length ? <div className="rounded-xl bg-neutral-50 p-3"><p className="mb-2 text-sm font-semibold text-neutral-950">Adjuntos</p><AttachmentPreview attachments={request.attachments} /></div> : null}
            {revealed ? <div className="rounded-xl border border-success-100 bg-success-100/60 p-3"><p className="text-sm font-semibold text-neutral-950">Información privada autorizada</p><p className="mt-1 text-neutral-700">Dirección: {request.address || "Por confirmar"}</p><p className="mt-1 text-neutral-700">Teléfono: {request.phone || "Por confirmar"}</p></div> : <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"><p className="text-sm font-semibold text-neutral-950">Datos privados protegidos</p><p className="mt-1 text-neutral-600">Dirección y teléfono no se renderizan antes de aceptación.</p></div>}
          </div>
        </Card>

        {request.status === "accepted" ? <Card className="p-5"><div className="flex items-start gap-3"><Clock3 className="h-6 w-6 text-brand-600" /><div><p className="text-sm font-semibold text-brand-700">Próxima atención</p><h2 className="mt-1 font-display text-2xl font-bold text-neutral-950">{request.professional.name}</h2><p className="mt-1 text-sm text-neutral-700">{formatShortDate(request.agreedDate ?? request.preferredDate)} · {request.agreedTime ?? request.preferredTime}</p><p className="text-sm text-neutral-700">{request.districtLabel}</p></div></div><div className="mt-4 rounded-xl bg-brand-100 p-3 text-sm font-semibold text-brand-700">Tu atención es mañana a las 4:00 p. m.</div><Button className="mt-4 w-full" type="button" onClick={complete}>Marcar como completado</Button></Card> : null}

        <ContactActions request={request} />
        <RequestSecondaryActions request={request} onChange={update} />
        <ReviewForm request={request} onChange={update} />
        <Card className="p-5"><h2 className="font-display text-2xl font-bold text-neutral-950">Actividad</h2><div className="mt-4"><RequestTimeline events={request.timeline} /></div></Card>
      </div>

      <div id="request-chat" className="grid gap-4">
        {latestProposal ? <ScheduleProposalCard request={request} proposal={latestProposal} onChange={update} /> : null}
        <RequestChat request={request} onChange={update} />
      </div>
    </div>
  );
}
