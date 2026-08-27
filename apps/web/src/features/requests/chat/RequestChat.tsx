"use client";

import { ArrowDown, FileText, Image as ImageIcon, Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { AttachmentDraft, ChatMessage, ServiceRequest } from "../types/request.types";
import { formatEventTime } from "../utils/format";
import { AttachmentPreview } from "../components/AttachmentPreview";

function mockAttachment(type: AttachmentDraft["type"]): AttachmentDraft {
  const count = Math.floor(Math.random() * 90) + 10;
  return { id: `att-${Date.now()}-${count}`, name: `${type}-${count}`, type, previewLabel: type === "photo" ? `Foto ${count}` : `Archivo ${count}` };
}

function MessageBubble({ message, professionalName }: { message: ChatMessage; professionalName: string }) {
  if (message.sender === "system") {
    return <div className="mx-auto max-w-[85%] rounded-full bg-neutral-100 px-3 py-1.5 text-center text-xs font-semibold text-neutral-600">{message.text}</div>;
  }

  const isCustomer = message.sender === "customer";
  return (
    <div className={cn("flex gap-2", isCustomer ? "justify-end" : "justify-start")}>
      {!isCustomer ? <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{professionalName.charAt(0)}</div> : null}
      <div className={cn("max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-6", isCustomer ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md bg-neutral-100 text-neutral-950")}>
        <p className="mb-1 text-[11px] font-semibold opacity-75">{isCustomer ? "Tú" : professionalName.split(" ")[0]} · {formatEventTime(message.at)}</p>
        <p>{message.text}</p>
        {message.attachments?.length ? <div className="mt-2"><AttachmentPreview attachments={message.attachments} /></div> : null}
        <p className={cn("mt-1 text-[11px]", isCustomer ? "text-white/75" : "text-neutral-500")}>{message.status === "error" ? "Error. No se pudo enviar. Reintentar" : message.status === "read" ? "Leído" : message.status === "sending" ? "Enviando" : "Enviado"}</p>
      </div>
    </div>
  );
}

export function RequestChat({ request, actor = "customer", onChange }: { request: ServiceRequest; actor?: "customer" | "professional"; onChange: (request: ServiceRequest) => void }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([]);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasNearBottomRef = useRef(true);
  const sender = actor === "professional" ? "professional" : "customer";
  const canSend = request.status !== "completed" && request.status !== "cancelled" && request.status !== "expired";

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || !wasNearBottomRef.current) return;
    node.scrollTop = node.scrollHeight;
  }, [request.messages.length]);

  function handleScroll() {
    const node = scrollRef.current;
    if (!node) return;
    const nearBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 90;
    wasNearBottomRef.current = nearBottom;
    setShowJump(!nearBottom);
  }

  function addAttachment(type: AttachmentDraft["type"]) {
    setAttachments((current) => [...current, mockAttachment(type)]);
    setAttachmentMenuOpen(false);
  }

  function send(fail = false) {
    const body = text.trim();
    if (!body && attachments.length === 0) return;
    const next = mockRequestService.addMessage(request.id, sender, body || "Adjunto enviado", attachments, fail);
    if (next) onChange(next);
    trackRequestEvent("chat_message_sent", { requestId: request.id, actor, fail });
    if (!fail) {
      setText("");
      setAttachments([]);
    }
  }

  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white" aria-label="Chat Queda">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <div>
          <h2 className="font-display text-xl font-bold text-neutral-950">Chat Queda</h2>
          <p className="text-xs text-neutral-600">Canal principal de coordinación</p>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Esperando respuesta</span>
      </div>

      <div ref={scrollRef} className="relative grid flex-1 content-start gap-3 overflow-y-auto bg-neutral-50 p-4" onScroll={handleScroll} aria-live="polite">
        {request.messages.length === 0 ? (
          <div className="m-auto max-w-sm rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-neutral-200">
            <p className="font-semibold text-neutral-950">Aún no hay mensajes.</p>
            <p className="mt-1 text-sm leading-6 text-neutral-600">Puedes escribirle al profesional para agregar información sobre tu solicitud.</p>
          </div>
        ) : request.messages.map((message) => <MessageBubble key={message.id} message={message} professionalName={request.professional.name} />)}
        {typing ? <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500"><span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs text-brand-700">{request.professional.name.charAt(0)}</span>{request.professional.name.split(" ")[0]} está escribiendo...</div> : null}
        {showJump ? (
          <button type="button" className="sticky bottom-2 mx-auto inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-neutral-200" onClick={() => {
            const node = scrollRef.current;
            if (node) node.scrollTop = node.scrollHeight;
          }}>
            Nuevos mensajes <ArrowDown className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <div className="border-t border-neutral-200 bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <AttachmentPreview attachments={attachments} onRemove={(id) => setAttachments((current) => current.filter((item) => item.id !== id))} />
        {attachmentMenuOpen ? (
          <div className="mb-2 flex gap-2 rounded-xl bg-neutral-50 p-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-white" onClick={() => addAttachment("photo")}><ImageIcon className="h-4 w-4" /> Agregar foto</button>
            {request.serviceKind === "education" ? <button type="button" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-white" onClick={() => addAttachment("file")}><FileText className="h-4 w-4" /> Agregar archivo</button> : null}
          </div>
        ) : null}
        <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2">
          <button type="button" className="grid min-h-11 min-w-11 place-items-center rounded-md border border-neutral-200 text-brand-700 hover:bg-brand-100" aria-label="Adjuntar" disabled={!canSend} onClick={() => setAttachmentMenuOpen((open) => !open)}><Paperclip className="h-5 w-5" /></button>
          <textarea className="max-h-32 min-h-11 resize-none rounded-md border border-neutral-200 px-3 py-2 text-base text-neutral-950 outline-none focus:border-brand-600" placeholder={canSend ? "Escribe un mensaje..." : "Chat en modo historial"} value={text} disabled={!canSend} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }} />
          <Button type="button" disabled={!canSend || (!text.trim() && attachments.length === 0)} onClick={() => send()}><Send className="h-4 w-4" /> Enviar</Button>
        </div>
        {canSend ? <button type="button" className="mt-2 text-xs font-semibold text-neutral-500 hover:text-error-600" onClick={() => send(true)}>Simular error al enviar mensaje</button> : null}
        {canSend && actor === "customer" ? <button type="button" className="ml-3 mt-2 text-xs font-semibold text-neutral-500 hover:text-brand-700" onClick={() => setTyping((current) => !current)}>Simular profesional escribiendo</button> : null}
      </div>
    </section>
  );
}
