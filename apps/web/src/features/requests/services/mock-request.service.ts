import type { AttachmentDraft, ChatMessage, RequestDraft, RequestStatus, ScheduleProposal, ServiceRequest, TimelineEvent } from "../types/request.types";
import { canTransition } from "../state/request-machine";

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
    return JSON.parse(stored) as ServiceRequest[];
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

function systemMessage(text: string): ChatMessage {
  return { id: id("msg"), sender: "system", text, at: now(), status: "read" };
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
  createRequest(draft: RequestDraft, assignmentMode: RequestDraft["assignmentMode"] = "invited") {
    const createdAt = now();
    const isOpen = assignmentMode === "open";
    const request: ServiceRequest = {
      ...draft,
      assignmentMode,
      id: id("req"),
      status: "sent",
      createdAt,
      updatedAt: createdAt,
      timeline: [timeline(isOpen ? "Solicitud publicada" : "Solicitud enviada", isOpen ? "Queda empezó a buscar técnicos compatibles para tu solicitud." : `${draft.professional.name} recibió el detalle para revisarlo.`)],
      messages: isOpen ? [systemMessage("Esperando postulación de técnicos compatibles.")] : [],
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
      messages: [
        ...request.messages,
        { id: id("msg"), sender, text, attachments, at: now(), status: fail ? "error" : sender === "professional" ? "read" : "sent" }
      ]
    }));
  },
  requestInformation(idValue: string, question: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "information_requested")) return request;
      return {
        ...request,
        status: "information_requested",
        updatedAt: now(),
        timeline: [...request.timeline, timeline(`${request.professional.name.split(" ")[0]} pidió más información`, question)],
        messages: [...request.messages, systemMessage(`${request.professional.name.split(" ")[0]} necesita más información`), { id: id("msg"), sender: "professional", text: question, at: now(), status: "read" }]
      };
    });
  },
  proposeSchedule(idValue: string, proposal: Omit<ScheduleProposal, "id" | "createdAt" | "status">) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "reschedule_proposed")) return request;
      const nextProposal: ScheduleProposal = { ...proposal, id: id("proposal"), status: "pending", createdAt: now() };
      const actor = proposal.by === "professional" ? request.professional.name.split(" ")[0] : "Tú";
      return {
        ...request,
        status: "reschedule_proposed",
        updatedAt: now(),
        proposals: [...request.proposals, nextProposal],
        timeline: [...request.timeline, timeline(`${actor} propuso un nuevo horario`, `${proposal.date}, ${proposal.startTime} - ${proposal.endTime}`)],
        messages: [...request.messages, systemMessage(`${actor} propuso otro horario: ${proposal.date}, ${proposal.startTime} - ${proposal.endTime}. ${proposal.comment ?? ""}`.trim())]
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
        messages: [...request.messages, systemMessage(`Horario acordado: ${accepted.date}, ${accepted.startTime} - ${accepted.endTime}.`)]
      };
    });
  },
  acceptRequest(idValue: string) {
    return this.updateStatus(idValue, "accepted", "Solicitud aceptada", "El profesional confirmó que puede atenderte.");
  },
  rejectRequest(idValue: string, reason: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "rejected")) return request;
      return { ...request, status: "rejected", cancellationReason: reason, updatedAt: now(), timeline: [...request.timeline, timeline(`${request.professional.name.split(" ")[0]} no podrá atender`, reason)], messages: [...request.messages, systemMessage(`${request.professional.name.split(" ")[0]} no podrá atender esta solicitud.`)] };
    });
  },
  cancelByCustomer(idValue: string, reason: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "cancelled_by_customer")) return request;
      return { ...request, status: "cancelled_by_customer", cancellationReason: reason, updatedAt: now(), timeline: [...request.timeline, timeline("Solicitud cancelada", reason)] };
    });
  },
  cancelByProfessional(idValue: string, reason: string) {
    return update(idValue, (request) => {
      if (!canTransition(request.status, "cancelled_by_professional")) return request;
      return { ...request, status: "cancelled_by_professional", cancellationReason: reason, updatedAt: now(), timeline: [...request.timeline, timeline("Solicitud cancelada por el profesional", reason)] };
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
