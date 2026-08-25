"use client";

import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockRequestService } from "../services/mock-request.service";
import type { ServiceRequest } from "../types/request.types";
import { formatShortDate } from "../utils/format";
import { RequestDetailView } from "./RequestDetailView";
import { RequestStatusBadge } from "./RequestStatusBadge";

export function RequestsContent({ selectedId }: { selectedId?: string | null }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeId, setActiveId] = useState(selectedId ?? null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    function load() {
      const list = mockRequestService.listRequests();
      setRequests(list);
      if (!activeId && list[0]) setActiveId(list[0].id);
    }
    load();
    window.addEventListener("queda:requests-changed", load);
    return () => window.removeEventListener("queda:requests-changed", load);
  }, [activeId]);

  const active = requests.find((request) => request.id === activeId) ?? null;

  if (requests.length === 0) {
    return (
      <Card className="grid gap-3 p-8 text-center">
        <SearchX className="mx-auto h-10 w-10 text-brand-600" />
        <h1 className="font-display text-3xl font-bold text-neutral-950">Aún no tienes solicitudes</h1>
        <p className="text-neutral-600">Busca un profesional y presiona Solicitar atención para empezar.</p>
        <ButtonLink className="mx-auto" href="/resultados/?categoria=hogar&servicio=electricidad&distrito=miraflores" variant="secondary">Ver profesionales</ButtonLink>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">Mis solicitudes</h1>
        <p className="mt-2 text-neutral-600">Revisa coordinación, chat, horarios y estado de cada solicitud.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="grid h-fit gap-3">
          {requests.map((request) => (
            <a key={request.id} href={`${basePath}/solicitudes/?id=${request.id}`} className="block" onClick={(event) => { event.preventDefault(); setActiveId(request.id); window.history.replaceState({}, "", `${basePath}/solicitudes/?id=${request.id}`); }}>
              <Card className={`p-4 transition-colors hover:border-brand-500 ${request.id === active?.id ? "border-brand-600 bg-brand-100" : ""}`}>
                <div className="flex items-start justify-between gap-2"><h2 className="font-display text-xl font-bold text-neutral-950">{request.professional.name}</h2><RequestStatusBadge status={request.status} /></div>
                <p className="mt-1 text-sm text-neutral-600">{request.serviceLabel} · {request.districtLabel}</p>
                <p className="mt-2 text-xs font-semibold text-neutral-500">{formatShortDate(request.agreedDate ?? request.preferredDate)} · {request.agreedTime ?? request.preferredTime}</p>
              </Card>
            </a>
          ))}
        </aside>
        {active ? <RequestDetailView initialRequest={active} onChange={(next) => setRequests((current) => current.map((item) => item.id === next.id ? next : item))} /> : <Card className="p-8">No pudimos cargar esta solicitud.</Card>}
      </div>
    </div>
  );
}
