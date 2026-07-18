import { CalendarClock, CheckCircle2, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ProfessionalCard({
  id,
  name,
  specialty,
  rating,
  reviews,
  services,
  price,
  availability,
  initials
}: {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
  services: string;
  price: string;
  availability: string;
  initials: string;
}) {
  return (
    <Card className="grid gap-5 p-5 transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:-translate-y-1 hover:border-brand-500 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-bold text-neutral-950">{name}</h3>
            <Badge tone="success">Verificado</Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{specialty}</p>
        </div>
      </div>
      <div className="grid gap-3 text-sm text-neutral-700">
        <span className="flex items-center gap-2">
          <Star aria-hidden="true" className="h-4 w-4 fill-warning-600 text-warning-600" />
          {rating} · {reviews}
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success-600" />
          {services}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock aria-hidden="true" className="h-4 w-4 text-brand-600" />
          {availability}
        </span>
      </div>
      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-neutral-950">{price}</span>
        <ButtonLink href={`/profesionales/${id}`} variant="secondary">
          Ver perfil
        </ButtonLink>
      </div>
    </Card>
  );
}
