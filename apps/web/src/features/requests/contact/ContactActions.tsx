"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getProfessionalContact, getWhatsAppMessage } from "../services/contact.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { ServiceRequest } from "../types/request.types";

export function ContactActions({ request }: { request: ServiceRequest }) {
  const [mockContact, setMockContact] = useState<"call" | "whatsapp" | null>(null);
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
        <Button type="button" variant="secondary" onClick={() => { setMockContact("call"); trackRequestEvent("contact_call_clicked", { requestId: request.id }); }}><Phone className="h-4 w-4" /> Llamar</Button>
        <Button type="button" variant="secondary" onClick={() => { setMockContact("whatsapp"); trackRequestEvent("contact_whatsapp_clicked", { requestId: request.id }); }}><Send className="h-4 w-4" /> WhatsApp</Button>
      </div>
      {mockContact === "call" ? <div className="rounded-xl bg-white p-3 text-sm leading-6 text-neutral-700"><p className="font-semibold text-neutral-950">Llamada simulada iniciada</p><p>Mock seguro preparado para usar `tel:` cuando exista backend.</p><p className="text-xs text-neutral-500">Número ficticio interno: {contact.phone}</p></div> : null}
      {mockContact === "whatsapp" ? <div className="rounded-xl bg-white p-3 text-sm leading-6 text-neutral-700"><p className="font-semibold text-neutral-950">WhatsApp simulado abierto</p><p>{getWhatsAppMessage(request.professional.name)}</p><p className="text-xs text-neutral-500">No se abre `wa.me` con números falsos para evitar errores.</p></div> : null}
    </div>
  );
}
