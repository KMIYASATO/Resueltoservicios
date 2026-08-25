"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { mockRequestService } from "../services/mock-request.service";
import { trackRequestEvent } from "../services/request-analytics";
import type { ServiceRequest } from "../types/request.types";

export function ReviewForm({ request, onChange }: { request: ServiceRequest; onChange: (request: ServiceRequest) => void }) {
  const [rating, setRating] = useState(request.review?.rating ?? 0);
  const [comment, setComment] = useState(request.review?.comment ?? "");
  if (request.status !== "completed") return null;
  if (request.review) return <div className="rounded-2xl border border-success-100 bg-success-100 p-4"><p className="font-semibold text-success-600">Gracias por tu opinión</p><p className="mt-1 text-sm text-neutral-700">{request.review.rating} estrellas registradas.</p></div>;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 className="font-display text-2xl font-bold text-neutral-950">¿Cómo fue tu experiencia con {request.professional.name.split(" ")[0]}?</h2>
      <div className="mt-4 flex gap-1" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" role="radio" aria-checked={rating === value} className="p-1 text-warning-600" onClick={() => setRating(value)}><Star className={rating >= value ? "h-8 w-8 fill-current" : "h-8 w-8"} /></button>)}
      </div>
      <label className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700">Cuéntanos más<textarea className="min-h-24 rounded-md border border-neutral-200 px-3 py-3 text-base" placeholder="¿Qué destacarías de la atención?" value={comment} onChange={(event) => setComment(event.target.value)} /></label>
      <Button className="mt-4" type="button" disabled={!rating} onClick={() => { const next = mockRequestService.saveReview(request.id, rating, comment); if (next) onChange(next); trackRequestEvent("review_submitted", { requestId: request.id, rating }); }}>Enviar opinión</Button>
    </div>
  );
}
