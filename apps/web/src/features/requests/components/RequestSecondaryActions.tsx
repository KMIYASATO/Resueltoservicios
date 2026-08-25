"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import { isTerminalStatus } from "../state/request-machine";
import type { ServiceRequest } from "../types/request.types";

const cancelReasons = ["Ya no necesito el servicio", "Encontré otra opción", "No me sirve el horario", "No recibí respuesta", "Otro"];
const reportReasons = ["No se presentó", "Conducta inapropiada", "Información engañosa", "Problema con el servicio", "Otro"];

export function RequestSecondaryActions({ request, onChange }: { request: ServiceRequest; onChange: (request: ServiceRequest) => void }) {
  const [mode, setMode] = useState<"cancel" | "report" | null>(null);
  const [reason, setReason] = useState(cancelReasons[0]);
  const canCancel = !isTerminalStatus(request.status);

  function submitCancel() {
    const next = mockRequestService.cancelByCustomer(request.id, reason);
    if (next) onChange(next);
    trackRequestEvent("request_cancelled", { requestId: request.id, by: "customer" });
    setMode(null);
  }

  function submitReport() {
    const next = mockRequestService.reportIssue(request.id, reason);
    if (next) onChange(next);
    setMode(null);
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {canCancel ? <Button type="button" variant="tertiary" onClick={() => { setMode("cancel"); setReason(cancelReasons[0]); }}>Cancelar solicitud</Button> : null}
        <Button type="button" variant="tertiary" onClick={() => { setMode("report"); setReason(reportReasons[0]); }}><AlertTriangle className="h-4 w-4" /> Reportar un problema</Button>
      </div>
      {mode ? (
        <div className="mt-4 rounded-xl bg-neutral-50 p-4">
          <h3 className="font-display text-xl font-bold text-neutral-950">{mode === "cancel" ? "¿Quieres cancelar esta solicitud?" : "Reportar un problema"}</h3>
          {mode === "cancel" ? <p className="mt-1 text-sm text-neutral-600">No se cancelará con un clic accidental.</p> : null}
          <div className="mt-3 grid gap-2">{(mode === "cancel" ? cancelReasons : reportReasons).map((item) => <label key={item} className="flex items-center gap-2 text-sm font-semibold text-neutral-700"><input type="radio" checked={reason === item} onChange={() => setReason(item)} /> {item}</label>)}</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2"><Button type="button" variant="secondary" onClick={() => setMode(null)}>{mode === "cancel" ? "Mantener solicitud" : "Cerrar"}</Button><Button type="button" onClick={mode === "cancel" ? submitCancel : submitReport}>{mode === "cancel" ? "Cancelar solicitud" : "Guardar reporte"}</Button></div>
        </div>
      ) : null}
    </div>
  );
}
