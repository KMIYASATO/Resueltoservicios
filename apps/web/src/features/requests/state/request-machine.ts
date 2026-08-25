import type { RequestStatus } from "../types/request.types";

export const requestStatusLabels: Record<RequestStatus, string> = {
  draft: "Borrador",
  review: "Revisión",
  sent: "Enviada",
  viewed: "Vista",
  information_requested: "Información solicitada",
  reschedule_proposed: "Nuevo horario propuesto",
  accepted: "Aceptada",
  rejected: "Rechazada",
  cancelled_by_customer: "Cancelada",
  cancelled_by_professional: "Cancelada por el profesional",
  completed: "Completada"
};

const transitions: Record<RequestStatus, RequestStatus[]> = {
  draft: ["review", "sent", "cancelled_by_customer"],
  review: ["draft", "sent", "cancelled_by_customer"],
  sent: ["viewed", "information_requested", "reschedule_proposed", "accepted", "rejected", "cancelled_by_customer"],
  viewed: ["information_requested", "reschedule_proposed", "accepted", "rejected", "cancelled_by_customer"],
  information_requested: ["information_requested", "reschedule_proposed", "accepted", "rejected", "cancelled_by_customer"],
  reschedule_proposed: ["information_requested", "reschedule_proposed", "accepted", "rejected", "cancelled_by_customer"],
  accepted: ["completed", "cancelled_by_customer", "cancelled_by_professional"],
  rejected: [],
  cancelled_by_customer: [],
  cancelled_by_professional: [],
  completed: []
};

export function canTransition(from: RequestStatus, to: RequestStatus) {
  return transitions[from].includes(to);
}

export function isTerminalStatus(status: RequestStatus) {
  return status === "rejected" || status === "cancelled_by_customer" || status === "cancelled_by_professional" || status === "completed";
}

export function canRevealContact(status: RequestStatus) {
  return status === "accepted" || status === "completed";
}
