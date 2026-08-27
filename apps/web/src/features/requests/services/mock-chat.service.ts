import type { AttachmentDraft, ChatMessage } from "../types/request.types";

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const mockChatService = {
  createMessage(sender: ChatMessage["sender"], text: string, attachments: AttachmentDraft[] = [], fail = false): ChatMessage {
    return { id: id("msg"), sender, text, attachments, at: new Date().toISOString(), status: fail ? "error" : sender === "professional" ? "read" : "sent" };
  },
  createSystemMessage(text: string): ChatMessage {
    return { id: id("msg"), sender: "system", text, at: new Date().toISOString(), status: "read" };
  }
};
