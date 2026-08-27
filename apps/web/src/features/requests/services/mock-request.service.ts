import type { AttachmentDraft, ChatMessage, Offer, RequestDraft, RequestMode, RequestStatus, ScheduleProposal, ServiceRequest, TimelineEvent } from "../types/request.types";
import { canTransition } from "../state/request-machine";
import { mockChatService } from "./mock-chat.service";
import { mockOfferService } from "./mock-offer.service";

const storageKey = "queda:mock-requests";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readAll(): ServiceRequest[] {
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return [];
  try {
    return (JSON.parse(stored) as ServiceRequest[]).filter((request) => request.status in {
      draft: true,
      submitted: true,
      matching: true,
      awaiting_response: true,
      proposals_received: true,
      selected: true,
      scheduled: true,
      in_service: true,
      completed: true,
      cancelled: true,
      expired: true
    });
  } catch {
    return [];
  }
}

function writeAll(requests: ServiceRequest[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(requests));
  window.dispatchEvent(new CustomEvent("queda:requests-changed"));
}

function timeline(title: string, text?: string): TimelineEvent {
  return { id: id("event"), at: now(), title, text };
}

function update(idValue: string, updater: (request: ServiceRequest) => ServiceRequest) {
  const requests = readAll();
  let nextRequest: ServiceRequest | null = null;
  const next = requests.map((request) => {
    if (request.id !== idValue) return request;
    nextRequest = updater(request);
    return nextRequest;
  });
  writeAll(next);
  return nextRequest;
}

export const mockRequestService = {
  createRequest(draft: RequestDraft, requestMode: RequestMode = "direct") {
    const createdAt = now();
    const isMulti = requestMode === "multi";
    const request: ServiceRequest = {
      ...draft,
      requestMode,
      id: id("req"),
      status: isMulti ? "matching" : "awaiting_response",
      createdAt,
      updatedAt: createdAt,
      acceptedOfferId: undefined,
      timeline: [timeline(isMulti ? "Solicitud publicada" : "Solicitud enviada", isMulti ? "Queda empezó a buscar propuestas de profesionales compatibles." : `${draft.professional.name} recibió el detalle para revisarlo.`)],
      messages: [mockChatService.createSystemMessage(isMulti ? "Esperando propuestas de profesionales compatibles." : `${draft.professional.name.split(" ")[0]} puede revisar la solicitud y responder por Chat Queda.`)],
      offers: [],
      proposals: []
    };
    writeAll([request, ...readAll()]);
    return request;
  },
  listRequests() {
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  getRequest(idValue: string | null) {
    if (!idValue) return null;
    return readAll().find((request) => request.id === idValue) ?? null;
  },
  updateStatus(idValue: string, status: RequestStatus, title: string, text?: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, status)) return request;
      return { ...request, status, updatedAt: now(), timeline: [...request.timeline, timeline(title, text)] };
    });
  },
  addMessage(idValue: string, sender: ChatMessage["sender"], text: string, attachments: AttachmentDraft[] = [], fail = false) {
    return update(idValue, (request) => ({
      ...request,
      updatedAt: now(),
      messages: [...request.messages, mockChatService.createMessage(sender, text, attachments, fail)]
    }));
  },
  receiveMockOffers(idValue: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "proposals_received")) return request;
      const offers = mockOfferService.generateOffers(request);
      return {
        ...request,
        status: "proposals_received",
        offers,
        updatedAt: now(),
        timeline: [...request.timeline, timeline("3 propuestas recibidas", "Compara precio, disponibilidad, alcance, rating y respuesta antes de elegir.")],
        messages: [...request.messages, mockChatService.createSystemMessage("Recibiste 3 propuestas. Puedes chatear antes de elegir.")]
      };
    });
  },
  expireOffers(idValue: string) {
    return update(idValue, (request) => ({
      ...request,
      status: canTransition(request.status, "expired") ? "expired" : request.status,
      offers: request.offers.map((offer) => ({ ...offer, status: offer.status === "accepted" ? offer.status : "expired" })),
      updatedAt: now(),
      timeline: [...request.timeline, timeline("Ofertas expiradas", "Las propuestas dejaron de estar disponibles.")]
    }));
  },
  withdrawOffer(idValue: string, offerId: string) {
    return update(idValue, (request) => ({
      ...request,
      offers: request.offers.map((offer) => offer.id === offerId ? { ...offer, status: "withdrawn" } : offer),
      updatedAt: now(),
      timeline: [...request.timeline, timeline("Oferta retirada", "Un profesional retiró su propuesta.")]
    }));
  },
  selectOffer(idValue: string, offerId: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "selected")) return request;
      const selectedOffer = request.offers.find((offer) => offer.id === offerId);
      if (!selectedOffer || selectedOffer.status === "expired" || selectedOffer.status === "withdrawn") return request;
      return {
        ...request,
        status: "selected",
        acceptedOfferId: offerId,
        agreedDate: selectedOffer.proposedDate,
        agreedTime: selectedOffer.proposedTimeWindow,
        offers: request.offers.map((offer): Offer => offer.id === offerId ? { ...offer, status: "accepted" } : { ...offer, status: offer.status === "withdrawn" || offer.status === "expired" ? offer.status : "not_selected" }),
        updatedAt: now(),
        timeline: [...request.timeline, timeline("Propuesta elegida", `${selectedOffer.professional.name} fue seleccionado para coordinar el servicio.`)],
        messages: [...request.messages, mockChatService.createSystemMessage(`Elegiste la propuesta de ${selectedOffer.professional.name}. El contacto ya está habilitado.`)]
      };
    });
  },
  reopenMarketplace(idValue: string) {
    return update(idValue, (request) => ({
      ...request,
      status: "matching",
      acceptedOfferId: undefined,
      offers: request.offers.map((offer) => ({ ...offer, status: offer.status === "accepted" ? "not_selected" : offer.status })),
      updatedAt: now(),
      timeline: [...request.timeline, timeline("Solicitud reabierta", "Queda volverá a buscar propuestas sin pedirte llenar todo de nuevo.")]
    }));
  },
  requestInformation(idValue: string, question: string) {
    return update(idValue, (request) => {
      return {
        ...request,
        status: request.status === "proposals_received" ? "proposals_received" : request.status,
        updatedAt: now(),
        timeline: [...request.timeline, timeline(`${request.professional.name.split(" ")[0]} pidió más información`, question)],
        messages: [...request.messages, mockChatService.createSystemMessage(`${request.professional.name.split(" ")[0]} necesita más información`), mockChatService.createMessage("professional", question)]
      };
    });
  },
  proposeSchedule(idValue: string, proposal: Omit<ScheduleProposal, "id" | "createdAt" | "status">) {
    return update(idValue, (request) => {
      const nextProposal: ScheduleProposal = { ...proposal, id: id("proposal"), status: "pending", createdAt: now() };
      const actor = proposal.by === "professional" ? request.professional.name.split(" ")[0] : "Tú";
      return {
        ...request,
        updatedAt: now(),
        proposals: [...request.proposals, nextProposal],
        timeline: [...request.timeline, timeline(`${actor} propuso un nuevo horario`, `${proposal.date}, ${proposal.startTime} - ${proposal.endTime}`)],
        messages: [...request.messages, mockChatService.createSystemMessage(`${actor} propuso otro horario: ${proposal.date}, ${proposal.startTime} - ${proposal.endTime}. ${proposal.comment ?? ""}`.trim())]
      };
    });
  },
  acceptSchedule(idValue: string, proposalId: string) {
    return update(idValue, (request) => {
      const accepted = request.proposals.find((proposal) => proposal.id === proposalId);
      if (!accepted) return request;
      return {
        ...request,
        updatedAt: now(),
        agreedDate: accepted.date,
        agreedTime: `${accepted.startTime} - ${accepted.endTime}`,
        proposals: request.proposals.map((proposal) => ({ ...proposal, status: proposal.id === proposalId ? "accepted" : proposal.status === "pending" ? "declined" : proposal.status })),
        timeline: [...request.timeline, timeline("Horario acordado", `${accepted.date}, ${accepted.startTime} - ${accepted.endTime}`)],
        messages: [...request.messages, mockChatService.createSystemMessage(`Horario acordado: ${accepted.date}, ${accepted.startTime} - ${accepted.endTime}.`)]
      };
    });
  },
  scheduleSelectedRequest(idValue: string) {
    return this.updateStatus(idValue, "scheduled", "Servicio programado", "El horario quedó acordado con el profesional elegido.");
  },
  rejectRequest(idValue: string, reason: string) {
    return update(idValue, (request) => {
      const nextStatus = canTransition(request.status, "cancelled") ? "cancelled" : request.status;
      return { ...request, status: nextStatus, cancellationReason: reason, updatedAt: now(), timeline: [...request.timeline, timeline(`${request.professional.name.split(" ")[0]} no podrá atender`, reason)], messages: [...request.messages, mockChatService.createSystemMessage(`${request.professional.name.split(" ")[0]} no podrá atender esta solicitud.`)] };
    });
  },
  cancelByCustomer(idValue: string, reason: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "cancelled")) return request;
      return { ...request, status: "cancelled", cancellationReason: reason, updatedAt: now(), timeline: [...request.timeline, timeline("Solicitud cancelada", reason)] };
    });
  },
  cancelByProfessional(idValue: string, reason: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "cancelled")) return request;
      return { ...request, status: "cancelled", cancellationReason: reason, updatedAt: now(), timeline: [...request.timeline, timeline("Solicitud cancelada por el profesional", reason)] };
    });
  },
  completeRequest(idValue: string) {
    return this.updateStatus(idValue, "completed", "Servicio completado", "El cliente marcó la atención como completada.");
  },
  saveReview(idValue: string, rating: number, comment: string) {
    return update(idValue, (request) => ({ ...request, updatedAt: now(), review: { rating, comment, createdAt: now() }, timeline: [...request.timeline, timeline("Opinión enviada", `${rating} estrellas`)] }));
  },
  reportIssue(idValue: string, reason: string) {
    return update(idValue, (request) => ({ ...request, updatedAt: now(), reportReason: reason, timeline: [...request.timeline, timeline("Problema reportado", reason)] }));
  }
};
