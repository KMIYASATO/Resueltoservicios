import type { RequestStatus } from "../types/request.types";

export const requestStatusLabels: Record<RequestStatus, string> = {
  draft: "Borrador",
  submitted: "Enviada",
  matching: "Buscando propuestas",
  awaiting_response: "Esperando respuesta",
  proposals_received: "Propuestas recibidas",
  selected: "Profesional elegido",
  scheduled: "Servicio programado",
  in_service: "En atención",
  completed: "Completada",
  cancelled: "Cancelada",
  expired: "Expirada"
};

export const offerStatusLabels = {
  draft: "Borrador",
  sent: "Enviada",
  viewed: "Vista",
  negotiating: "En negociación",
  accepted: "Aceptada",
  not_selected: "No seleccionada",
  withdrawn: "Retirada",
  expired: "Expirada"
} as const;

const transitions: Record<RequestStatus, RequestStatus[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["matching", "awaiting_response", "proposals_received", "cancelled", "expired"],
  matching: ["proposals_received", "awaiting_response", "cancelled", "expired"],
  awaiting_response: ["proposals_received", "selected", "cancelled", "expired"],
  proposals_received: ["proposals_received", "selected", "cancelled", "expired"],
  selected: ["scheduled", "cancelled"],
  scheduled: ["in_service", "completed", "cancelled"],
  in_service: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  expired: []
};

export function canTransition(from: RequestStatus, to: RequestStatus) {
  return transitions[from].includes(to);
}

export function isTerminalStatus(status: RequestStatus) {
  return status === "cancelled" || status === "expired" || status === "completed";
}

export function canRevealContact(status: RequestStatus, acceptedOfferId?: string) {
  return Boolean(acceptedOfferId && (status === "selected" || status === "scheduled" || status === "in_service" || status === "completed"));
}
