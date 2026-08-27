"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mockRequestService } from "../services/mock-request.service";
import type { ServiceRequest } from "../types/request.types";

export function MatchingStatus({ request, onChange }: { request: ServiceRequest; onChange: (request: ServiceRequest) => void }) {
  if (request.status !== "matching" && request.status !== "awaiting_response") return null;
  const isMulti = request.requestMode === "multi";
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-100 p-4">
      <Search className="h-6 w-6 text-brand-700" />
      <h2 className="mt-3 font-display text-2xl font-bold text-neutral-950">{isMulti ? "Esperando propuestas" : `Esperando respuesta de ${request.professional.name.split(" ")[0]}`}</h2>
      <p className="mt-1 text-sm leading-6 text-neutral-700">{isMulti ? `${request.offers.length} propuestas recibidas. Los profesionales solo ven distrito, zona aproximada, fotos y detalle.` : "Puedes chatear por Queda mientras responde. El contacto externo aún está bloqueado."}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {isMulti ? <Button type="button" onClick={() => { const next = mockRequestService.receiveMockOffers(request.id); if (next) onChange(next); }}>Simular 3 propuestas</Button> : <Button type="button" onClick={() => { const next = mockRequestService.receiveMockOffers(request.id); if (next) onChange(next); }}>Simular propuesta de {request.professional.name.split(" ")[0]}</Button>}
        <Button type="button" variant="secondary" onClick={() => { const next = mockRequestService.expireOffers(request.id); if (next) onChange(next); }}>Simular 0 propuestas</Button>
      </div>
    </div>
  );
}
