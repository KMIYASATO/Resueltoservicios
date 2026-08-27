"use client";

import { AlertTriangle, CheckCircle2, FileText, Image as ImageIcon, MapPin, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { findDistrict, findProfessional } from "@/data/home";
import { serviceOptions } from "@/data/serviceCatalog";
import { useAuthModal } from "@/features/auth/hooks/useAuthModal";
import { cn } from "@/lib/cn";
import { AddressMapPicker } from "./AddressMapPicker";
import { AttachmentPreview } from "./AttachmentPreview";
import { EstimatedPriceBand } from "./EstimatedPriceBand";
import { ProfessionalMiniHeader } from "./ProfessionalMiniHeader";
import { RequestModeSelector } from "./RequestModeSelector";
import { getCategoryLabel, getRequestCopy, getServiceKind } from "../services/request-copy";
import { mockAddressService } from "../services/mock-address.service";
import { mockPricingService } from "../services/mock-pricing.service";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { AttachmentDraft, RequestDraft, ServiceRequest } from "../types/request.types";
import { formatDateLabel, todayInputValue } from "../utils/format";

type Step = "details" | "schedule" | "address" | "estimate" | "mode" | "review" | "sent";

const stepOrder: Step[] = ["details", "schedule", "address", "estimate", "mode", "review", "sent"];
const timeSlots = ["8 a. m. - 12 p. m.", "12 p. m. - 3 p. m.", "3 p. m. - 6 p. m.", "6 p. m. - 9 p. m."];

function mockAttachment(kind: AttachmentDraft["type"]): AttachmentDraft {
  const index = Math.floor(Math.random() * 80) + 10;
  return { id: `draft-${Date.now()}-${index}`, name: `${kind}-${index}`, type: kind, previewLabel: kind === "photo" ? `Foto ${index}` : `Archivo ${index}` };
}

function buildDraft(professionalId: string): RequestDraft {
  const params = new URLSearchParams(window.location.search);
  const serviceSlug = params.get("servicio") ?? "electricidad";
  const service = serviceOptions.find((item) => item.slug === serviceSlug) ?? serviceOptions.find((item) => item.slug === "electricidad") ?? serviceOptions[0];
  const categorySlug = params.get("categoria") ?? service.categorySlug;
  const district = findDistrict(params.get("distrito"));
  const professional = findProfessional(professionalId);
  const kind = getServiceKind(categorySlug);
  const address = mockAddressService.createDefault(district.slug, district.name);
  const urgency = kind === "home" ? "Hoy" : kind === "cleaning" ? "Mañana" : "";

  return {
    professional: { id: professional.id, name: professional.name, initials: professional.initials, specialty: professional.specialty, rating: professional.rating, reviews: professional.reviews },
    requestMode: "direct",
    categorySlug,
    categoryLabel: getCategoryLabel(categorySlug),
    serviceSlug: service.slug,
    serviceLabel: service.label,
    districtSlug: district.slug,
    districtLabel: district.name,
    returnTo: `${window.location.pathname}${window.location.search}`,
    scrollPosition: window.scrollY,
    serviceKind: kind,
    need: "",
    description: "",
    urgency,
    preferredDate: "Mañana",
    preferredTime: "3 p. m. - 6 p. m.",
    modality: "presencial",
    address,
    phone: "",
    estimatedPrice: mockPricingService.estimate(service.slug, kind, urgency),
    attachments: []
  };
}

function ReviewRows({ draft, onEdit }: { draft: RequestDraft; onEdit: (step: Step) => void }) {
  const rows = [
    ["Profesional invitado", draft.professional.name, "mode"],
    ["Modo", draft.requestMode === "direct" ? `Solo a ${draft.professional.name.split(" ")[0]}` : `${draft.professional.name.split(" ")[0]} + otros profesionales`, "mode"],
    ["Servicio", draft.serviceLabel, "details"],
    ["Necesidad", draft.need || "Por completar", "details"],
    ["Detalle", draft.description || "Por completar", "details"],
    ["Fotos", `${draft.attachments.length} adjuntos`, "details"],
    ["Fecha", formatDateLabel(draft.preferredDate), "schedule"],
    ["Horario", draft.preferredTime, "schedule"],
    ["Distrito visible", draft.districtLabel, "address"],
    ["Zona visible a oferentes", draft.address.approximateZone, "address"],
    ["Modalidad", draft.modality === "virtual" ? "Virtual" : "Presencial", "schedule"],
    ["Estimado Queda", draft.estimatedPrice.label, "estimate"]
  ] as const;

  return <div className="grid gap-3 text-sm">{rows.map(([label, value, step]) => <div key={label} className="rounded-xl bg-neutral-50 p-3"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">{label}</p><button type="button" className="text-xs font-semibold text-brand-700" onClick={() => onEdit(step)}>Editar</button></div><p className="mt-1 font-semibold text-neutral-950">{value}</p></div>)}<div className="rounded-xl border border-brand-200 bg-brand-100 p-3"><p className="text-xs font-semibold text-brand-700">Dirección exacta privada</p><p className="mt-1 text-neutral-700">{draft.address.formatted || "Por confirmar"}. Unidad, referencia y pin exacto solo se muestran al profesional elegido.</p></div>{draft.phone ? <div className="rounded-xl border border-brand-200 bg-brand-100 p-3"><p className="text-xs font-semibold text-brand-700">Teléfono privado</p><p className="mt-1 text-neutral-700">Solo se compartirá después de elegir una propuesta.</p></div> : null}</div>;
}

export function RequestFlowDrawer({ draft, step, lastRequest, confirmClose, onPatch, onStep, onSubmit, onClose, onCancelClose, closeButtonRef }: {
  draft: RequestDraft;
  step: Step;
  lastRequest: ServiceRequest | null;
  confirmClose: boolean;
  onPatch: (values: Partial<RequestDraft>) => void;
  onStep: (step: Step) => void;
  onSubmit: () => void;
  onClose: () => void;
  onCancelClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const copy = getRequestCopy(draft.serviceKind);
  const stepIndex = stepOrder.indexOf(step) + 1;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const addressReady = draft.modality === "virtual" || Boolean(draft.address.formatted || draft.address.query);

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-labelledby="request-flow-title">
      <button className="absolute inset-0 bg-brand-700/30 backdrop-blur-[2px]" type="button" aria-label="Cerrar solicitud" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[96dvh] overflow-hidden rounded-t-[28px] bg-white shadow-lg sm:inset-y-4 sm:left-auto sm:right-4 sm:w-[min(600px,calc(100vw-32px))] sm:rounded-[28px]">
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-brand-600">Paso {stepIndex} de {stepOrder.length}</p><h1 id="request-flow-title" className="font-display text-2xl font-bold text-neutral-950">{step === "sent" ? "Solicitud publicada" : copy.cta}</h1></div><button ref={closeButtonRef} type="button" className="grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-brand-100" aria-label="Cerrar" onClick={onClose}><X className="h-5 w-5" /></button></div>
          <div className="mt-4 grid grid-cols-7 gap-2" aria-hidden="true">{stepOrder.map((item) => <div key={item} className={cn("h-1.5 rounded-full", stepOrder.indexOf(step) >= stepOrder.indexOf(item) ? "bg-brand-600" : "bg-neutral-200")} />)}</div>
        </div>

        <div className="max-h-[calc(96dvh-92px)] overflow-y-auto px-4 py-5 sm:px-6">
          <ProfessionalMiniHeader professional={draft.professional} />
          {step === "details" ? <div className="mt-5 grid gap-5"><div><h2 className="font-display text-2xl font-bold text-neutral-950">Cuéntale qué necesitas</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Mientras más contexto compartas, mejores propuestas podrás recibir.</p></div><label className="grid gap-2 text-sm font-semibold text-neutral-700">¿Qué necesitas?<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" placeholder={copy.needPlaceholder} value={draft.need} onChange={(event) => onPatch({ need: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold text-neutral-700">Describe tu solicitud<textarea className="min-h-32 rounded-md border border-neutral-200 px-3 py-3 text-base text-neutral-950" maxLength={1000} placeholder={copy.descriptionPlaceholder} value={draft.description} onChange={(event) => onPatch({ description: event.target.value })} /><span className="text-right text-xs font-medium text-neutral-500">{draft.description.length}/1000</span></label><div className="grid gap-3"><p className="text-sm font-semibold text-neutral-700">Fotos</p><AttachmentPreview attachments={draft.attachments} onRemove={(id) => onPatch({ attachments: draft.attachments.filter((item) => item.id !== id) })} /><div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" onClick={() => onPatch({ attachments: [...draft.attachments, mockAttachment("photo")] })}><ImageIcon className="h-4 w-4" /> + Agregar fotos</Button>{draft.serviceKind === "education" ? <Button type="button" variant="secondary" onClick={() => onPatch({ attachments: [...draft.attachments, mockAttachment("file")] })}><FileText className="h-4 w-4" /> + Agregar archivo</Button> : null}</div></div>{copy.urgencyOptions.length ? <div className="grid gap-2"><p className="text-sm font-semibold text-neutral-700">¿Qué tan pronto lo necesitas?</p><div className="grid gap-2 sm:grid-cols-2">{copy.urgencyOptions.map((option) => <button key={option} type="button" className={cn("rounded-md border px-3 py-3 text-sm font-semibold", draft.urgency === option ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700 hover:border-brand-500")} onClick={() => onPatch({ urgency: option, estimatedPrice: mockPricingService.estimate(draft.serviceSlug, draft.serviceKind, option) })}>{option}</button>)}</div></div> : null}<div className="sticky bottom-0 -mx-4 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button className="w-full" type="button" disabled={!draft.need.trim() || !draft.description.trim()} onClick={() => { onStep("schedule"); trackRequestEvent("request_details_completed", { service: draft.serviceSlug }); }}>Continuar</Button></div></div> : null}

          {step === "schedule" ? <div className="mt-5 grid gap-5"><div><h2 className="font-display text-2xl font-bold text-neutral-950">¿Cuándo necesitas atención?</h2><p className="mt-1 text-sm leading-6 text-neutral-600">La fecha y franja son una preferencia; el profesional podrá confirmar o proponer otro horario.</p></div><div className="grid gap-2"><p className="text-sm font-semibold text-neutral-700">Fecha</p><div className="flex flex-wrap gap-2">{copy.quickDates.map((option) => <button key={option} type="button" className={cn("rounded-md border px-3 py-2 text-sm font-semibold", draft.preferredDate === option ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700")} onClick={() => onPatch({ preferredDate: option === "Elegir fecha" ? todayInputValue(2) : option })}>{option}</button>)}</div><input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" type="date" value={draft.preferredDate.includes("-") ? draft.preferredDate : ""} onChange={(event) => onPatch({ preferredDate: event.target.value })} /></div><div className="grid gap-2"><p className="text-sm font-semibold text-neutral-700">Franja horaria</p><div className="grid gap-2 sm:grid-cols-2">{timeSlots.map((slot) => <button key={slot} type="button" className={cn("rounded-md border px-3 py-3 text-sm font-semibold", draft.preferredTime === slot ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700 hover:border-brand-500")} onClick={() => onPatch({ preferredTime: slot })}>{slot}</button>)}</div></div><div className="rounded-xl bg-neutral-50 p-4"><p className="text-sm font-semibold text-neutral-950">Modalidad</p>{copy.modalities.length === 1 ? <p className="mt-1 text-sm text-neutral-600">Presencial</p> : <div className="mt-3 flex gap-2">{copy.modalities.map((modality) => <button key={modality} type="button" className={cn("rounded-md border px-3 py-2 text-sm font-semibold capitalize", draft.modality === modality ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700")} onClick={() => onPatch({ modality })}>{modality}</button>)}</div>}</div><div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => onStep("details")}>Atrás</Button><Button type="button" disabled={!draft.preferredDate || !draft.preferredTime} onClick={() => onStep(draft.modality === "virtual" ? "estimate" : "address")}>Continuar</Button></div></div> : null}

          {step === "address" ? <div className="mt-5 grid gap-5"><div><h2 className="font-display text-2xl font-bold text-neutral-950">Confirma la dirección</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Capturamos ubicación exacta para coordinar mejor, pero los oferentes solo verán distrito y zona aproximada.</p></div><div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><MapPin className="h-4 w-4 text-brand-600" /> Distrito precargado</p><p className="mt-1 text-sm text-neutral-600">{draft.districtLabel}</p></div><AddressMapPicker address={draft.address} districtLabel={draft.districtLabel} onChange={(address) => onPatch({ address })} /><label className="grid gap-2 text-sm font-semibold text-neutral-700">Teléfono de contacto<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" placeholder="999 999 999" value={draft.phone} onChange={(event) => onPatch({ phone: event.target.value })} /><span className="text-xs font-medium text-neutral-500">Solo se compartirá cuando elijas una propuesta.</span></label><div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => onStep("schedule")}>Atrás</Button><Button type="button" disabled={!addressReady} onClick={() => { onStep("estimate"); trackRequestEvent("address_confirmed", { district: draft.districtSlug }); }}>Continuar</Button></div></div> : null}

          {step === "estimate" ? <div className="mt-5 grid gap-5"><div><h2 className="font-display text-2xl font-bold text-neutral-950">Precio estimado</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Este rango orienta tu decisión antes de publicar. No es una promesa de precio final.</p></div><EstimatedPriceBand estimate={draft.estimatedPrice} /><label className="grid gap-2 text-sm font-semibold text-neutral-700">Presupuesto máximo opcional<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base" placeholder="Ej. S/ 120" value={draft.estimatedPrice.budgetCap ?? ""} onChange={(event) => onPatch({ estimatedPrice: { ...draft.estimatedPrice, budgetCap: event.target.value } })} /></label><div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => onStep(draft.modality === "virtual" ? "schedule" : "address")}>Atrás</Button><Button type="button" onClick={() => { onStep("mode"); trackRequestEvent("estimate_viewed", { service: draft.serviceSlug }); }}>Continuar</Button></div></div> : null}

          {step === "mode" ? <div className="mt-5 grid gap-5"><div><h2 className="font-display text-2xl font-bold text-neutral-950">¿Cómo quieres solicitar?</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Puedes mantener el flujo directo o comparar propuestas sin volver a llenar tu solicitud.</p></div><RequestModeSelector mode={draft.requestMode} professional={draft.professional} onChange={(requestMode) => { onPatch({ requestMode }); trackRequestEvent("request_mode_selected", { mode: requestMode }); }} /><div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => onStep("estimate")}>Atrás</Button><Button type="button" onClick={() => onStep("review")}>Revisar</Button></div></div> : null}

          {step === "review" ? <div className="mt-5 grid gap-5"><div><h2 className="font-display text-2xl font-bold text-neutral-950">Revisa tu solicitud</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Solicitud primero. Contacto después de elegir una propuesta.</p></div><ReviewRows draft={draft} onEdit={onStep} /><div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => onStep("mode")}>Atrás</Button><Button type="button" onClick={onSubmit}>{draft.requestMode === "multi" ? "Publicar solicitud" : "Enviar solicitud"}</Button></div></div> : null}

          {step === "sent" && lastRequest ? <div className="mt-5 grid gap-5 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-100 text-success-600"><CheckCircle2 className="h-8 w-8" /></div><div><h2 className="font-display text-3xl font-bold text-neutral-950">{lastRequest.requestMode === "multi" ? "Solicitud publicada" : "Solicitud enviada"}</h2><p className="mt-2 leading-7 text-neutral-600">{lastRequest.requestMode === "multi" ? "Queda está buscando propuestas de profesionales compatibles." : `${lastRequest.professional.name.split(" ")[0]} recibió tu solicitud. Te avisaremos cuando responda.`}</p></div><div className="grid gap-3 sm:grid-cols-2"><a className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800" href={`${basePath}/solicitudes/?id=${lastRequest.id}`}>Ver mi solicitud</a><Button type="button" variant="secondary" onClick={onClose}>Volver a resultados</Button></div></div> : null}
        </div>
      </div>

      {confirmClose ? <div className="absolute inset-0 z-20 grid place-items-center bg-brand-700/20 p-4"><Card className="max-w-sm p-5"><AlertTriangle className="h-6 w-6 text-warning-600" /><h2 className="mt-3 font-display text-2xl font-bold text-neutral-950">¿Salir de la solicitud?</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Los cambios que no hayas guardado se perderán.</p><div className="mt-5 grid gap-2 sm:grid-cols-2"><Button type="button" variant="secondary" onClick={onCancelClose}>Seguir editando</Button><Button type="button" onClick={onClose}>Salir</Button></div></Card></div> : null}
    </div>
  );
}

export function RequestFlowProvider({ children }: { children: ReactNode }) {
  const { openAuthModal, session } = useAuthModal();
  const [draft, setDraft] = useState<RequestDraft | null>(null);
  const [step, setStep] = useState<Step>("details");
  const [lastRequest, setLastRequest] = useState<ServiceRequest | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasChanges = useMemo(() => Boolean(draft?.need || draft?.description || draft?.address.query || draft?.address.formatted || draft?.phone || draft?.attachments.length), [draft]);

  useEffect(() => {
    function open(event: Event) {
      const detail = (event as CustomEvent<{ professionalId: string }>).detail;
      if (!detail?.professionalId) return;
      setDraft(buildDraft(detail.professionalId));
      setStep("details");
      setLastRequest(null);
      trackRequestEvent("request_started", { professionalId: detail.professionalId });
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    }
    window.addEventListener("queda:request-flow-open", open);
    return () => window.removeEventListener("queda:request-flow-open", open);
  }, []);

  useEffect(() => {
    if (!draft) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        attemptClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  function patch(values: Partial<RequestDraft>) {
    setDraft((current) => current ? { ...current, ...values } : current);
  }

  function attemptClose() {
    if (step !== "sent" && hasChanges) {
      setConfirmClose(true);
      return;
    }
    close();
  }

  function close() {
    const scroll = draft?.scrollPosition ?? window.scrollY;
    setDraft(null);
    setConfirmClose(false);
    requestAnimationFrame(() => window.scrollTo({ top: scroll }));
  }

  function submitRequest() {
    if (!draft) return;
    if (!session) {
      openAuthModal({ mode: "login", returnTo: draft.returnTo, accountIntent: "customer", pendingAction: "submit-request" });
      return;
    }
    const request = mockRequestService.createRequest(draft, draft.requestMode);
    setLastRequest(request);
    setStep("sent");
    trackRequestEvent("request_submitted", { requestId: request.id, mode: request.requestMode });
  }

  return <>{children}{draft ? <RequestFlowDrawer draft={draft} step={step} lastRequest={lastRequest} confirmClose={confirmClose} onPatch={patch} onStep={setStep} onSubmit={submitRequest} onClose={confirmClose ? close : attemptClose} onCancelClose={() => setConfirmClose(false)} closeButtonRef={closeButtonRef} /> : null}</>;
}
