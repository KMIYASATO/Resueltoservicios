import { FileText, Image, X } from "lucide-react";
import type { AttachmentDraft } from "../types/request.types";

export function AttachmentPreview({ attachments, onRemove }: { attachments: AttachmentDraft[]; onRemove?: (id: string) => void }) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment) => {
        const Icon = attachment.type === "photo" ? Image : FileText;
        return (
          <div key={attachment.id} className="group relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-center text-[11px] font-semibold text-neutral-700">
            <Icon className="h-5 w-5 text-brand-600" />
            <span className="line-clamp-2">{attachment.previewLabel}</span>
            {onRemove ? (
              <button type="button" className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-200 hover:text-error-600" aria-label={`Eliminar ${attachment.name}`} onClick={() => onRemove(attachment.id)}>
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
