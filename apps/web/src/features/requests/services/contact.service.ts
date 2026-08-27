import type { PrivateProfessionalContact, RequestStatus } from "../types/request.types";
import { canRevealContact } from "../state/request-machine";

const privateProfessionalContacts: Record<string, PrivateProfessionalContact> = {
  "carlos-r": { phone: "+51010000001", whatsapp: "51010000001" },
  "mariela-p": { phone: "+51010000002", whatsapp: "51010000002" },
  "jorge-a": { phone: "+51010000003", whatsapp: "51010000003" }
};

export function getProfessionalContact(professionalId: string, status: RequestStatus) {
  if (!canRevealContact(status)) return null;
  return privateProfessionalContacts[professionalId] ?? { phone: "+51010000000", whatsapp: "51010000000" };
}

export function getWhatsAppMessage(professionalName: string) {
  return `Hola ${professionalName.split(" ")[0]}, soy el cliente de tu solicitud en Queda.`;
}
