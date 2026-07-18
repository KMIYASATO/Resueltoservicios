import { CalendarClock, CheckCircle2, CreditCard, Home, MapPin, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { professionals, services } from "@/data/home";

const bookingSteps = [
  {
    title: "Detalle",
    description: "Describe qué necesitas resolver y elige el tipo de servicio.",
    icon: Home
  },
  {
    title: "Dirección, fecha y hora",
    description: "Indica dónde quieres la atención y el horario que más te conviene.",
    icon: MapPin
  },
  {
    title: "Profesional",
    description: "Elige una opción recomendada si todavía no seleccionaste a alguien.",
    icon: UserRoundCheck
  },
  {
    title: "Resumen",
    description: "Revisa servicio, zona, horario y precio estimado antes de avanzar.",
    icon: CheckCircle2
  },
  {
    title: "Pago y confirmación",
    description: "Confirma la reserva cuando todos los datos estén correctos.",
    icon: CreditCard
  }
] as const;

export default function BookingPage() {
  const service = services[0];
  const professional = professionals[0];

  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/" variant="secondary">Salir</ButtonLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-6">
          <div>
            <Badge tone="brand">Reserva</Badge>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-neutral-950">Confirma tu servicio paso a paso</h1>
            <p className="mt-3 max-w-2xl leading-7 text-neutral-600">Completa los datos esenciales para que el profesional pueda revisar tu solicitud con claridad.</p>
          </div>

          <Card className="p-5">
            <ol className="grid gap-3 sm:grid-cols-5" aria-label="Etapas de la reserva">
              {bookingSteps.map((step, index) => {
                const Icon = step.icon;
                const active = index === 0;
                return (
                  <li key={step.title} className={active ? "rounded-lg border border-brand-600 bg-brand-100 p-4" : "rounded-lg border border-neutral-200 bg-white p-4"}>
                    <span className="text-xs font-semibold text-brand-600">Paso {index + 1}</span>
                    <Icon className="mt-3 h-5 w-5 text-brand-600" aria-hidden="true" />
                    <p className="mt-3 font-semibold text-neutral-950">{step.title}</p>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card className="p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="text-sm font-semibold text-brand-600">Paso actual: Detalle</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-neutral-950">Cuéntanos qué necesitas</h2>
                <p className="mt-3 leading-7 text-neutral-600">Mientras completas el flujo, mantendremos visible el resumen para que puedas revisar cada decisión antes de confirmar.</p>
              </div>
              <div className="rounded-xl bg-brand-100 p-4">
                <CalendarClock className="h-6 w-6 text-brand-600" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-neutral-950">Sugerencia</p>
                <p className="mt-1 text-sm leading-6 text-neutral-700">Incluye fotos, medidas o detalles del problema para recibir una mejor atención.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                Servicio
                <select className="min-h-[48px] rounded-md border border-neutral-200 bg-white px-3 text-neutral-950">
                  {services.map((item) => <option key={item.slug}>{item.name}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-neutral-700">
                Tamaño aproximado
                <select className="min-h-[48px] rounded-md border border-neutral-200 bg-white px-3 text-neutral-950">
                  <option>Pequeño</option>
                  <option>Mediano</option>
                  <option>Grande</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-neutral-700 sm:col-span-2">
                Detalle del servicio
                <textarea className="min-h-32 rounded-md border border-neutral-200 bg-white px-3 py-3 text-neutral-950" placeholder="Ej. necesito limpieza profunda de sala y cocina este fin de semana" />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#" className="w-full sm:w-fit">Continuar</ButtonLink>
              <ButtonLink href="/resultados/?servicio=limpieza-hogar&distrito=miraflores" variant="secondary" className="w-full sm:w-fit">Ver profesionales</ButtonLink>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {bookingSteps.slice(1).map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-600">Siguiente paso {index + 2}</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-neutral-950">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">{step.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="h-fit p-6 lg:sticky lg:top-8">
          <h2 className="font-display text-2xl font-bold text-neutral-950">Resumen</h2>
          <div className="mt-5 grid gap-4 text-sm text-neutral-700">
            <div className="rounded-lg bg-neutral-50 p-4">
              <p className="font-semibold text-neutral-950">Servicio</p>
              <p className="mt-1">{service.name}</p>
              <p className="mt-1 text-brand-600">{service.price}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4">
              <p className="font-semibold text-neutral-950">Profesional sugerido</p>
              <p className="mt-1">{professional.name}</p>
              <p className="mt-1">{professional.availability}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4">
              <p className="font-semibold text-neutral-950">Zona</p>
              <p className="mt-1">Miraflores, Lima</p>
            </div>
            <span className="flex items-center gap-2 text-success-600"><CheckCircle2 className="h-4 w-4" />Datos listos para revisar</span>
          </div>
        </Card>
      </section>
    </main>
  );
}
