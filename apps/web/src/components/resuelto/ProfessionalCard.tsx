import { CalendarClock, ShieldCheck, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AuthTriggerButton } from "@/features/auth/components/AuthTriggerButton";

export function ProfessionalCard({
  id,
  name,
  specialty,
  rating,
  reviews,
  price,
  availability,
  initials,
  matchScore,
  etaLabel,
  distanceLabel
}: {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
  services?: string;
  price: string;
  availability: string;
  initials: string;
  availabilityStatus?: "available" | "busy" | "offline";
  matchScore?: number;
  etaLabel?: string;
  distanceLabel?: string;
}) {
  return (
    <Card className="grid gap-5 p-5 transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:-translate-y-1 hover:border-brand-500 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white" role="img" aria-label={`Foto de ${name}`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-bold text-neutral-950">{name}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-600" title="Queda confirmó la identidad y los datos de contacto del profesional.">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Identidad verificada
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{specialty}</p>
        </div>
      </div>
      {typeof matchScore === "number" ? (
        <div className="grid gap-2 rounded-lg bg-brand-100 p-3 text-sm text-neutral-700 sm:grid-cols-3">
          <span><strong className="text-brand-700">{matchScore}%</strong> afinidad</span>
          <span>{etaLabel}</span>
          <span>{distanceLabel}</span>
        </div>
      ) : null}
      <div className="grid gap-3 text-sm text-neutral-700">
        <span className="flex items-center gap-2">
          <Star aria-hidden="true" className="h-4 w-4 fill-warning-600 text-warning-600" />
          {rating} · {reviews}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock aria-hidden="true" className="h-4 w-4 text-brand-600" />
          {availability}
        </span>
      </div>
      <div className="grid gap-3 border-t border-neutral-200 pt-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <span className="font-semibold text-neutral-950">{price}</span>
        <ButtonLink href={`/profesionales/${id}`} variant="secondary">
          Ver perfil
        </ButtonLink>
        <AuthTriggerButton auth={{ mode: "login", returnTo: `/reserva?profesional=${id}`, accountIntent: "customer", pendingAction: `request-service:${id}` }}>
          Solicitar atención
        </AuthTriggerButton>
      </div>
    </Card>
  );
}
