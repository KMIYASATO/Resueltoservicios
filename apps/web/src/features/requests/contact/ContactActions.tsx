"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getProfessionalContact, getWhatsAppUrl } from "../services/contact.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { ServiceRequest } from "../types/request.types";

export function ContactActions({ request }: { request: ServiceRequest }) {
  const contact = getProfessionalContact(request.professional.id, request.status);
  if (!contact) {
    return <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">El chat está disponible. La llamada, WhatsApp, dirección completa y teléfonos se habilitan solo cuando el profesional acepta la solicitud.</div>;
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-success-100 bg-success-100/60 p-4">
      <div>
        <h2 className="font-display text-xl font-bold text-neutral-950">Coordina con {request.professional.name.split(" ")[0]}</h2>
        <p className="text-sm text-neutral-600">Contacto habilitado después de la aceptación.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" variant="secondary" onClick={() => document.getElementById("request-chat")?.scrollIntoView({ behavior: "smooth" })}><MessageCircle className="h-4 w-4" /> Chat Queda</Button>
        <a className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-brand-600 bg-white px-5 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-100" href={`tel:${contact.phone}`} onClick={() => trackRequestEvent("contact_call_clicked", { requestId: request.id })}><Phone className="h-4 w-4" /> Llamar</a>
        <a className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-brand-600 bg-white px-5 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-100" href={getWhatsAppUrl(request.professional.name, contact.whatsapp)} target="_blank" rel="noreferrer" onClick={() => trackRequestEvent("contact_whatsapp_clicked", { requestId: request.id })}><Send className="h-4 w-4" /> WhatsApp</a>
      </div>
    </div>
  );
}
