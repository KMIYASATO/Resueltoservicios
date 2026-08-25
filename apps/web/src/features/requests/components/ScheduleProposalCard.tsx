"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { ScheduleProposal, ServiceRequest } from "../types/request.types";
import { formatDateLabel } from "../utils/format";

export function ScheduleProposalCard({ request, proposal, onChange }: { request: ServiceRequest; proposal: ScheduleProposal; onChange: (request: ServiceRequest) => void }) {
  const [counterOpen, setCounterOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("18:00");

  function accept() {
    const next = mockRequestService.acceptSchedule(request.id, proposal.id);
    if (next) onChange(next);
    trackRequestEvent("schedule_accepted", { requestId: request.id });
  }

  function counter() {
    const next = mockRequestService.proposeSchedule(request.id, { by: "customer", date: date || "Mañana", startTime, endTime, comment: "Prefiero este horario." });
    if (next) onChange(next);
    setCounterOpen(false);
    trackRequestEvent("schedule_proposed", { requestId: request.id, actor: "customer" });
  }

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-100 p-4">
      <p className="text-sm font-semibold text-brand-700">{proposal.by === "professional" ? `${request.professional.name.split(" ")[0]} propone otro horario` : "Tú propusiste otro horario"}</p>
      <h3 className="mt-2 font-display text-xl font-bold text-neutral-950">{formatDateLabel(proposal.date)}</h3>
      <p className="text-sm font-semibold text-neutral-700">{proposal.startTime} - {proposal.endTime}</p>
      {proposal.comment ? <p className="mt-2 text-sm leading-6 text-neutral-600">“{proposal.comment}”</p> : null}
      {proposal.status === "pending" && proposal.by === "professional" ? <div className="mt-4 grid gap-2 sm:grid-cols-2"><Button type="button" onClick={accept}>Aceptar horario</Button><Button type="button" variant="secondary" onClick={() => setCounterOpen((open) => !open)}>Proponer otro</Button></div> : null}
      {proposal.status !== "pending" ? <p className="mt-3 text-sm font-semibold text-neutral-600">Estado: {proposal.status === "accepted" ? "Aceptado" : "Reemplazado"}</p> : null}
      {counterOpen ? <div className="mt-4 grid gap-3 rounded-xl bg-white p-3"><input className="min-h-11 rounded-md border border-neutral-200 px-3 text-base" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><div className="grid grid-cols-2 gap-2"><input className="min-h-11 rounded-md border border-neutral-200 px-3 text-base" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /><input className="min-h-11 rounded-md border border-neutral-200 px-3 text-base" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></div><Button type="button" onClick={counter}>Enviar propuesta</Button></div> : null}
    </div>
  );
}
