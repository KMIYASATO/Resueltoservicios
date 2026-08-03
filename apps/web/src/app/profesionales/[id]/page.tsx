import { CalendarClock, CheckCircle2, Gauge, MapPin, ShieldCheck, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { AuthTriggerButton } from "@/features/auth/components/AuthTriggerButton";
import { commissionLevels, findProfessional, professionals } from "@/data/home";

export function generateStaticParams() {
  return professionals.map((professional) => ({ id: professional.id }));
}

const serviceRows = [
  ["Visita y diagnóstico", "Desde S/ 45"],
  ["Instalación o reparación puntual", "Desde S/ 60"],
  ["Trabajo por horas", "Desde S/ 80"]
];

const reviews = [
  ["Atención puntual", "Llegó en el horario acordado y explicó las opciones antes de empezar."],
  ["Buen resultado", "Dejó el espacio ordenado y el trabajo quedó listo en una sola visita."]
];

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const professional = findProfessional(id);
  const level = commissionLevels.find((item) => item.level === professional.level);

  return (
    <main id="contenido" className="min-h-screen bg-neutral-50 pb-24 lg:pb-0">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/resultados" variant="secondary">Ver resultados</ButtonLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6">
          <Card className="overflow-hidden p-0">
            <div className="h-40 bg-[radial-gradient(circle_at_20%_20%,rgba(152,219,198,0.85),transparent_32%),linear-gradient(135deg,#E4F5EF,#FFFFFF)]" />
            <div className="p-6 pt-0">
              <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-600 text-2xl font-bold text-white shadow-sm">{professional.initials}</div>
                <div className="pb-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-600" title="Queda confirmó la identidad y los datos de contacto del profesional.">
                    <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Identidad verificada
                  </span>
                  <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">{professional.name}</h1>
                  <p className="mt-2 text-lg text-neutral-600">{professional.specialty} · Lima Metropolitana</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2 lg:grid-cols-4">
                <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-warning-600 text-warning-600" />{professional.rating} · {professional.reviews}</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success-600" />{professional.services}</span>
                <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand-600" />{professional.availability}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" />{professional.zone}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Identidad y datos del perfil</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Identidad y contacto confirmados", "Cobertura declarada", "Opiniones visibles"].map((item) => (
                <div key={item} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-brand-600" />
                  <p className="mt-3 text-sm font-semibold text-neutral-950">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Reglas operativas del perfil</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              <div className="rounded-lg border border-neutral-200 p-4">
                <Gauge className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Afinidad operativa</p>
                <p className="mt-1 text-sm text-neutral-600">ETA {professional.etaMinutes} min, {professional.activeJobs} servicio activo.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <ShieldCheck className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Nivel {professional.level}</p>
                <p className="mt-1 text-sm text-neutral-600">Comisión aplicable: {level?.commission ?? "por definir"}.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <Star className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Reputación mínima</p>
                <p className="mt-1 text-sm text-neutral-600">Pausa automática si cae bajo 3.5 sostenido.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <CheckCircle2 className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Prueba de cierre</p>
                <p className="mt-1 text-sm text-neutral-600">Evidencia de atención para cerrar la solicitud.</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Servicios y precios estimados</h2>
            <div className="mt-5 grid gap-3">
              {serviceRows.map(([service, price]) => (
                <div key={service} className="flex items-center justify-between rounded-md border border-neutral-200 p-4">
                  <span className="font-medium text-neutral-950">{service}</span>
                  <span className="font-semibold text-brand-600">{price}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Galería de trabajos</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Antes", "Durante", "Resultado"].map((label) => (
                <div key={label} className="grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-brand-100 via-white to-pink-100 text-sm font-semibold text-brand-700 ring-1 ring-neutral-200">{label}</div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Opiniones recientes</h2>
            <div className="mt-5 grid gap-3">
              {reviews.map(([title, text]) => (
                <div key={title} className="rounded-lg border border-neutral-200 p-4">
                  <div className="flex items-center gap-1 text-warning-600">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
                  <h3 className="mt-3 font-semibold text-neutral-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-6 lg:sticky lg:top-8">
          <h2 className="font-display text-2xl font-bold text-neutral-950">Solicita atención con {professional.name.split(" ")[0]}</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">Envía el detalle para que el profesional revise tu solicitud y responda.</p>
          <div className="mt-5 grid gap-3 text-sm text-neutral-700">
            <span>{professional.availability}</span>
            <span>{professional.zone}</span>
            <span>{professional.price}</span>
          </div>
          <AuthTriggerButton auth={{ mode: "login", returnTo: `/reserva?profesional=${professional.id}`, accountIntent: "customer", pendingAction: `request-service:${professional.id}` }} className="mt-6 w-full">Solicitar atención</AuthTriggerButton>
        </Card>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white p-3 shadow-lg lg:hidden">
        <AuthTriggerButton auth={{ mode: "login", returnTo: `/reserva?profesional=${professional.id}`, accountIntent: "customer", pendingAction: `request-service:${professional.id}` }} className="w-full">Solicitar atención</AuthTriggerButton>
      </div>
    </main>
  );
}
