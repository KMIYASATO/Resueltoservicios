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
import { AttachmentPreview } from "./AttachmentPreview";
import { ProfessionalMiniHeader } from "./ProfessionalMiniHeader";
import { getCategoryLabel, getRequestCopy, getServiceKind } from "../services/request-copy";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { AttachmentDraft, RequestDraft, ServiceRequest } from "../types/request.types";
import { formatDateLabel, todayInputValue } from "../utils/format";

type Step = "details" | "schedule" | "review" | "technician" | "sent";

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

  return {
    professional: {
      id: professional.id,
      name: professional.name,
      initials: professional.initials,
      specialty: professional.specialty,
      rating: professional.rating,
      reviews: professional.reviews
    },
    assignmentMode: "invited",
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
    urgency: kind === "home" ? "Hoy" : kind === "cleaning" ? "Mañana" : "",
    preferredDate: "Mañana",
    preferredTime: "3 p. m. - 6 p. m.",
    modality: "presencial",
    address: "",
    phone: "",
    attachments: []
  };
}

function ReviewRows({ draft }: { draft: RequestDraft }) {
  return (
    <div className="grid gap-3 text-sm">
      {[
        ["Servicio", draft.serviceLabel],
        ["Necesidad", draft.need || "Por completar"],
        ["Detalle", draft.description || "Por completar"],
        ["Fotos", `${draft.attachments.length} adjuntos`],
        ["Fecha", formatDateLabel(draft.preferredDate)],
        ["Horario", draft.preferredTime],
        ["Distrito", draft.districtLabel],
        ["Modalidad", draft.modality === "virtual" ? "Virtual" : "Presencial"]
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-neutral-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">{label}</p>
          <p className="mt-1 font-semibold text-neutral-950">{value}</p>
        </div>
      ))}
      {draft.address && draft.modality === "presencial" ? <div className="rounded-xl border border-brand-200 bg-brand-100 p-3"><p className="text-xs font-semibold text-brand-700">Dirección privada</p><p className="mt-1 text-neutral-700">Se compartirá solo si la solicitud es aceptada.</p></div> : null}
      {draft.phone ? <div className="rounded-xl border border-brand-200 bg-brand-100 p-3"><p className="text-xs font-semibold text-brand-700">Teléfono privado</p><p className="mt-1 text-neutral-700">Se compartirá solo si la solicitud es aceptada.</p></div> : null}
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
  const isOpen = Boolean(draft);
  const copy = useMemo(() => draft ? getRequestCopy(draft.serviceKind) : null, [draft]);
  const hasChanges = Boolean(draft?.need || draft?.description || draft?.address || draft?.phone || draft?.attachments.length);

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
    if (!isOpen) return;
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
    const request = mockRequestService.createRequest(draft, draft.assignmentMode);
    setLastRequest(request);
    setStep("sent");
    trackRequestEvent("request_submitted", { requestId: request.id });
  }

  return (
    <>
      {children}
      {draft && copy ? (
        <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-labelledby="request-flow-title">
          <button className="absolute inset-0 bg-brand-700/30 backdrop-blur-[2px]" type="button" aria-label="Cerrar solicitud" onClick={attemptClose} />
          <div className="absolute inset-x-0 bottom-0 max-h-[96dvh] overflow-hidden rounded-t-[28px] bg-white shadow-lg transition-transform duration-normal ease-standard sm:inset-y-4 sm:left-auto sm:right-4 sm:w-[min(600px,calc(100vw-32px))] sm:rounded-[28px]">
            <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-brand-600">Paso {step === "details" ? 1 : step === "schedule" ? 2 : step === "review" ? 3 : step === "technician" ? 4 : 5} de 5</p>
                  <h1 id="request-flow-title" className="font-display text-2xl font-bold text-neutral-950">{step === "sent" ? "Solicitud enviada" : copy.cta}</h1>
                </div>
                <button ref={closeButtonRef} type="button" className="grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-700 hover:bg-brand-100" aria-label="Cerrar" onClick={attemptClose}><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
                {["details", "schedule", "review", "technician", "sent"].map((item) => {
                  const order = ["details", "schedule", "review", "technician", "sent"];
                  return <div key={item} className={cn("h-1.5 rounded-full", order.indexOf(step) >= order.indexOf(item) ? "bg-brand-600" : "bg-neutral-200")} />;
                })}
              </div>
            </div>

            <div className="max-h-[calc(96dvh-92px)] overflow-y-auto px-4 py-5 sm:px-6">
              <ProfessionalMiniHeader professional={draft.professional} />

              {step === "details" ? (
                <div className="mt-5 grid gap-5">
                  <div><h2 className="font-display text-2xl font-bold text-neutral-950">Cuéntale qué necesitas</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Mientras más contexto compartas, mejor podrá evaluar tu solicitud.</p></div>
                  <label className="grid gap-2 text-sm font-semibold text-neutral-700">¿Qué necesitas?<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" placeholder={copy.needPlaceholder} value={draft.need} onChange={(event) => patch({ need: event.target.value })} /></label>
                  <label className="grid gap-2 text-sm font-semibold text-neutral-700">Describe tu solicitud<textarea className="min-h-32 rounded-md border border-neutral-200 px-3 py-3 text-base text-neutral-950" maxLength={900} placeholder={copy.descriptionPlaceholder} value={draft.description} onChange={(event) => patch({ description: event.target.value })} /><span className="text-right text-xs font-medium text-neutral-500">{draft.description.length}/900</span></label>
                  <div className="grid gap-3"><p className="text-sm font-semibold text-neutral-700">Fotos</p><AttachmentPreview attachments={draft.attachments} onRemove={(id) => patch({ attachments: draft.attachments.filter((item) => item.id !== id) })} /><div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" onClick={() => patch({ attachments: [...draft.attachments, mockAttachment("photo")] })}><ImageIcon className="h-4 w-4" /> + Agregar fotos</Button>{draft.serviceKind === "education" ? <Button type="button" variant="secondary" onClick={() => patch({ attachments: [...draft.attachments, mockAttachment("file")] })}><FileText className="h-4 w-4" /> {copy.attachmentLabel}</Button> : null}</div><p className="text-xs text-neutral-500">Mock visual. Preparado para JPG, PNG, WEBP y archivos cuando corresponda.</p></div>
                  {copy.urgencyOptions.length ? <div className="grid gap-2"><p className="text-sm font-semibold text-neutral-700">¿Qué tan pronto lo necesitas?</p><div className="grid gap-2 sm:grid-cols-2">{copy.urgencyOptions.map((option) => <button key={option} type="button" className={cn("rounded-md border px-3 py-3 text-sm font-semibold", draft.urgency === option ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700 hover:border-brand-500")} onClick={() => patch({ urgency: option })}>{option}</button>)}</div></div> : null}
                  <div className="sticky bottom-0 -mx-4 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button className="w-full" type="button" disabled={!draft.need.trim() || !draft.description.trim()} onClick={() => { setStep("schedule"); trackRequestEvent("request_step_completed", { step: "details" }); }}>Continuar</Button></div>
                </div>
              ) : null}

              {step === "schedule" ? (
                <div className="mt-5 grid gap-5">
                  <div><h2 className="font-display text-2xl font-bold text-neutral-950">¿Cuándo necesitas atención?</h2><p className="mt-1 text-sm leading-6 text-neutral-600">El profesional podrá confirmar el horario o proponerte otro.</p></div>
                  <div className="grid gap-2"><p className="text-sm font-semibold text-neutral-700">Fecha</p><div className="flex flex-wrap gap-2">{copy.quickDates.map((option) => <button key={option} type="button" className={cn("rounded-md border px-3 py-2 text-sm font-semibold", draft.preferredDate === option ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700")} onClick={() => patch({ preferredDate: option === "Elegir fecha" ? todayInputValue(2) : option })}>{option}</button>)}</div><input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" type="date" value={draft.preferredDate.includes("-") ? draft.preferredDate : ""} onChange={(event) => patch({ preferredDate: event.target.value })} /></div>
                  <div className="grid gap-2"><p className="text-sm font-semibold text-neutral-700">Franja horaria</p><div className="grid gap-2 sm:grid-cols-2">{timeSlots.map((slot) => <button key={slot} type="button" className={cn("rounded-md border px-3 py-3 text-sm font-semibold", draft.preferredTime === slot ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700 hover:border-brand-500")} onClick={() => patch({ preferredTime: slot })}>{slot}</button>)}</div></div>
                  <div className="rounded-xl bg-neutral-50 p-4"><p className="text-sm font-semibold text-neutral-950">Modalidad</p>{copy.modalities.length === 1 ? <p className="mt-1 text-sm text-neutral-600">Presencial</p> : <div className="mt-3 flex gap-2">{copy.modalities.map((modality) => <button key={modality} type="button" className={cn("rounded-md border px-3 py-2 text-sm font-semibold capitalize", draft.modality === modality ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700")} onClick={() => patch({ modality })}>{modality}</button>)}</div>}</div>
                  {draft.modality === "presencial" ? <><div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"><p className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><MapPin className="h-4 w-4 text-brand-600" /> Distrito</p><p className="mt-1 text-sm text-neutral-600">{draft.districtLabel}</p></div><label className="grid gap-2 text-sm font-semibold text-neutral-700">Dirección<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" placeholder="Calle, número y referencia" value={draft.address} onChange={(event) => patch({ address: event.target.value })} /><span className="text-xs font-medium text-neutral-500">Información privada. No se mostrará antes de aceptación.</span></label></> : null}
                  <label className="grid gap-2 text-sm font-semibold text-neutral-700">Teléfono de contacto<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" placeholder="999 999 999" value={draft.phone} onChange={(event) => patch({ phone: event.target.value })} /><span className="text-xs font-medium text-neutral-500">Solo se compartirá con el profesional cuando la solicitud sea aceptada.</span></label>
                  <div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => setStep("details")}>Atrás</Button><Button type="button" disabled={!draft.preferredDate || !draft.preferredTime || (draft.modality === "presencial" && !draft.address.trim())} onClick={() => { setStep("review"); trackRequestEvent("request_step_completed", { step: "schedule" }); }}>Revisar</Button></div>
                </div>
              ) : null}

              {step === "review" ? (
                <div className="mt-5 grid gap-5">
                  <div><h2 className="font-display text-2xl font-bold text-neutral-950">Revisa tu solicitud</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Aún no es una reserva confirmada. Primero el profesional debe responder.</p></div>
                  <ReviewRows draft={draft} />
                  <div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => setStep("details")}>Editar</Button><Button type="button" onClick={() => setStep("technician")}>Continuar</Button></div>
                </div>
              ) : null}

              {step === "technician" ? (
                <div className="mt-5 grid gap-5">
                  <div><h2 className="font-display text-2xl font-bold text-neutral-950">¿Quieres invitar a un técnico?</h2><p className="mt-1 text-sm leading-6 text-neutral-600">Puedes darle prioridad a {draft.professional.name.split(" ")[0]} o publicar la solicitud para esperar postulaciones de técnicos compatibles.</p></div>
                  <button type="button" className={cn("rounded-2xl border p-4 text-left transition-colors", draft.assignmentMode === "invited" ? "border-brand-600 bg-brand-100" : "border-neutral-200 bg-white hover:border-brand-500")} onClick={() => patch({ assignmentMode: "invited" })}>
                    <p className="text-sm font-semibold text-brand-700">Invitar técnico seleccionado</p>
                    <p className="mt-1 font-display text-xl font-bold text-neutral-950">{draft.professional.name}</p>
                    <p className="text-sm text-neutral-600">{draft.professional.specialty} · prioridad para responder.</p>
                  </button>
                  <button type="button" className={cn("rounded-2xl border p-4 text-left transition-colors", draft.assignmentMode === "open" ? "border-brand-600 bg-brand-100" : "border-neutral-200 bg-white hover:border-brand-500")} onClick={() => patch({ assignmentMode: "open" })}>
                    <p className="text-sm font-semibold text-brand-700">Omitir y publicar</p>
                    <p className="mt-1 font-display text-xl font-bold text-neutral-950">Esperar postulación de técnicos</p>
                    <p className="text-sm text-neutral-600">Queda mostrará la solicitud como publicada mientras aparecen ofertas.</p>
                  </button>
                  <div className="sticky bottom-0 -mx-4 grid grid-cols-2 gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6"><Button type="button" variant="secondary" onClick={() => setStep("review")}>Atrás</Button><Button type="button" onClick={submitRequest}>{draft.assignmentMode === "open" ? "Omitir y publicar" : "Invitar y publicar"}</Button></div>
                </div>
              ) : null}

              {step === "sent" && lastRequest ? (
                <div className="mt-5 grid gap-5 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-100 text-success-600"><CheckCircle2 className="h-8 w-8" /></div>
                  <div><h2 className="font-display text-3xl font-bold text-neutral-950">{lastRequest.assignmentMode === "open" ? "Solicitud publicada" : "Solicitud enviada"}</h2><p className="mt-2 leading-7 text-neutral-600">{lastRequest.assignmentMode === "open" ? "En unos momentos te aparecerán ofertas de técnicos compatibles." : `${lastRequest.professional.name.split(" ")[0]} recibió tu solicitud. Te avisaremos cuando responda.`}</p></div>
                  <div className="grid gap-3 sm:grid-cols-2"><a className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/solicitudes/?id=${lastRequest.id}`}>Ver mi solicitud</a><Button type="button" variant="secondary" onClick={close}>Volver a resultados</Button></div>
                </div>
              ) : null}
            </div>
          </div>

          {confirmClose ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-brand-700/20 p-4">
              <Card className="max-w-sm p-5">
                <AlertTriangle className="h-6 w-6 text-warning-600" />
                <h2 className="mt-3 font-display text-2xl font-bold text-neutral-950">¿Salir de la solicitud?</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">Los cambios que no hayas guardado se perderán.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2"><Button type="button" variant="secondary" onClick={() => setConfirmClose(false)}>Seguir editando</Button><Button type="button" onClick={close}>Salir</Button></div>
              </Card>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
