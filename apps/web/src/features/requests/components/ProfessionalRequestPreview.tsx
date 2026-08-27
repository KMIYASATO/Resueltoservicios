"use client";

import { Eye, Send, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RequestChat } from "../chat/RequestChat";
import { getProfessionalContact } from "../services/contact.service";
import { mockOfferService } from "../services/mock-offer.service";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import { canRevealContact } from "../state/request-machine";
import type { ServiceRequest } from "../types/request.types";
import { RequestStatusBadge } from "./RequestStatusBadge";

const rejectReasons = ["No tengo disponibilidad", "Está fuera de mi zona", "No realizo ese trabajo", "Otro"];

export function ProfessionalRequestPreview() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [question, setQuestion] = useState("¿Puedes enviarme una foto del tablero eléctrico?");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("18:00");
  const [comment, setComment] = useState("Puedo atenderte en ese horario.");
  const [reason, setReason] = useState(rejectReasons[0]);

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
  const selectedOffer = active?.offers.find((offer) => offer.id === active.acceptedOfferId);
  const contact = active && selectedOffer ? getProfessionalContact(selectedOffer.professional.id, active.status, active.acceptedOfferId) : null;
  const showPrivate = active ? canRevealContact(active.status, active.acceptedOfferId) : false;

  function update(next: ServiceRequest | null) {
    if (!next) return;
    setRequests((current) => current.map((request) => request.id === next.id ? next : request));
    setActiveId(next.id);
  }

  if (requests.length === 0) return <Card className="p-8 text-center"><h1 className="font-display text-3xl font-bold text-neutral-950">No hay solicitudes mock</h1><p className="mt-2 text-neutral-600">Crea una solicitud desde resultados para probar el panel profesional.</p></Card>;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="grid h-fit gap-3">{requests.map((request) => <button key={request.id} type="button" className="text-left" onClick={() => setActiveId(request.id)}><Card className={`p-4 ${request.id === active?.id ? "border-brand-600 bg-brand-100" : ""}`}><div className="flex items-start justify-between gap-2"><h2 className="font-display text-xl font-bold text-neutral-950">{request.requestMode === "multi" ? "Oportunidad abierta" : request.professional.name}</h2><RequestStatusBadge status={request.status} /></div><p className="mt-1 text-sm text-neutral-600">{request.serviceLabel} · {request.districtLabel}</p></Card></button>)}</aside>
      {active ? <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><Card className="h-fit p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-brand-600">Panel mock profesional</p><h1 className="mt-1 font-display text-3xl font-bold text-neutral-950">{active.requestMode === "multi" ? "Nueva oportunidad" : `Solicitud para ${active.professional.name}`}</h1><p className="mt-2 text-neutral-600">{active.need}</p></div><RequestStatusBadge status={active.status} /></div><div className="mt-5 grid gap-3 text-sm text-neutral-700"><p><strong>Servicio:</strong> {active.serviceLabel}</p><p><strong>Fecha/franja:</strong> {active.preferredDate} · {active.preferredTime}</p><p><strong>Zona pública:</strong> {active.districtLabel} · {active.address.approximateZone}</p><p><strong>Estimado Queda:</strong> {active.estimatedPrice.label}</p><p><strong>Detalle:</strong> {active.description}</p></div>{showPrivate ? <div className="mt-4 rounded-xl bg-success-100 p-3 text-sm text-neutral-700"><p className="font-semibold text-neutral-950">Contacto y dirección autorizados</p><p>{active.address.formatted || active.address.query}</p><p>{active.address.propertyType} {active.address.unit}</p><p>Teléfono cliente: {active.phone || "Por confirmar"}</p><p>Contacto profesional mock: {contact?.phone}</p></div> : <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-sm font-semibold text-neutral-600">Dirección exacta, teléfono, WhatsApp y pin exacto no están disponibles hasta que el cliente elija una propuesta.</div>}<div className="mt-5 grid gap-2 sm:grid-cols-2"><Button type="button" variant="secondary" onClick={() => { const next = mockRequestService.updateStatus(active.id, active.status === "matching" ? "proposals_received" : active.status, "Profesional revisó la solicitud"); update(next); trackRequestEvent("offer_viewed", { requestId: active.id }); }}><Eye className="h-4 w-4" /> Marcar vista</Button><Button type="button" onClick={() => { const next = mockRequestService.receiveMockOffers(active.id); update(next); trackRequestEvent("offer_received", { requestId: active.id }); }}>Enviar propuesta mock</Button><Button type="button" variant="secondary" onClick={() => setInfoOpen((open) => !open)}>Pedir información</Button><Button type="button" variant="secondary" onClick={() => setScheduleOpen((open) => !open)}>Proponer horario</Button><Button type="button" variant="tertiary" onClick={() => { if (active.offers[0]) update(mockRequestService.withdrawOffer(active.id, active.offers[0].id)); }}>Retirar oferta</Button><Button type="button" variant="tertiary" onClick={() => setRejectOpen((open) => !open)}><XCircle className="h-4 w-4" /> Rechazar</Button></div>{active.offers.length ? <div className="mt-4 grid gap-2 rounded-xl bg-neutral-50 p-3"><p className="text-sm font-semibold text-neutral-950">Propuestas existentes</p>{active.offers.map((offer) => <div key={offer.id} className="rounded-lg bg-white p-3 text-sm"><strong>{offer.professional.name}</strong> · {mockOfferService.formatPrice(offer)} · {offer.status}</div>)}</div> : null}{infoOpen ? <div className="mt-4 rounded-xl bg-neutral-50 p-4"><label className="grid gap-2 text-sm font-semibold text-neutral-700">¿Qué necesitas saber?<textarea className="min-h-24 rounded-md border border-neutral-200 px-3 py-3 text-base" value={question} onChange={(event) => setQuestion(event.target.value)} /></label><Button className="mt-3" type="button" onClick={() => { update(mockRequestService.requestInformation(active.id, question)); setInfoOpen(false); }}><Send className="h-4 w-4" /> Enviar pregunta</Button></div> : null}{scheduleOpen ? <div className="mt-4 grid gap-3 rounded-xl bg-neutral-50 p-4"><input className="min-h-11 rounded-md border border-neutral-200 px-3 text-base" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><div className="grid grid-cols-2 gap-2"><input className="min-h-11 rounded-md border border-neutral-200 px-3 text-base" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /><input className="min-h-11 rounded-md border border-neutral-200 px-3 text-base" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></div><textarea className="min-h-20 rounded-md border border-neutral-200 px-3 py-3 text-base" value={comment} onChange={(event) => setComment(event.target.value)} /><Button type="button" onClick={() => { update(mockRequestService.proposeSchedule(active.id, { by: "professional", date: date || "Miércoles 26 de agosto", startTime, endTime, comment })); setScheduleOpen(false); }}>Enviar propuesta</Button></div> : null}{rejectOpen ? <div className="mt-4 rounded-xl bg-neutral-50 p-4"><p className="font-semibold text-neutral-950">Motivo opcional</p><div className="mt-3 grid gap-2">{rejectReasons.map((item) => <label key={item} className="flex items-center gap-2 text-sm font-semibold text-neutral-700"><input type="radio" checked={reason === item} onChange={() => setReason(item)} /> {item}</label>)}</div><Button className="mt-4" type="button" onClick={() => { update(mockRequestService.rejectRequest(active.id, reason)); setRejectOpen(false); }}>Confirmar rechazo</Button></div> : null}</Card><RequestChat request={active} actor="professional" onChange={update} /></div> : null}
    </div>
  );
}
