import { BellRing, FileCheck2, Gauge, Route, ShieldAlert, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { adminMetrics, adminQueues, assignmentPolicy, commissionLevels, notificationSteps, onboardingSteps, operatingRules } from "@/data/home";

const engineCards = [
  { title: "Matching", icon: Route, text: "Ordena profesionales por zona, disponibilidad, valoración y carga actual." },
  { title: "Disponibilidad", icon: Gauge, text: "Muestra disponibilidad positiva sin exponer estados internos." },
  { title: "Coordinación", icon: BellRing, text: "Registra solicitud, respuesta, fecha, horario y contacto." },
  { title: "Calidad", icon: ShieldAlert, text: "Pausa perfiles con baja reputación para revisión interna." },
  { title: "Notificaciones", icon: BellRing, text: "Alertas para cliente, profesional y equipo operativo en cada hito." },
  { title: "Onboarding", icon: FileCheck2, text: "Registro, documentos, antecedentes, entrevista, aprobación y activación." }
] as const;

export default function OperationsPage() {
  return (
    <main id="contenido" className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <ResueltoLogo />
          <ButtonLink href="/" variant="secondary">Volver al inicio</ButtonLink>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Badge tone="brand">Panel operativo</Badge>
              <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.05em] text-neutral-950">Control del marketplace desde el primer día</h1>
            </div>
            <p className="text-lg leading-8 text-neutral-600">Vista central para solicitudes, calidad, profesionales pendientes, disputas y alertas críticas sin exponer información sensible.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {adminMetrics.map((metric) => (
              <Card key={metric.label} className="p-5">
                <p className="text-sm font-semibold text-neutral-600">{metric.label}</p>
                <p className="mt-3 font-display text-4xl font-bold text-neutral-950">{metric.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <p className="text-sm font-semibold text-brand-600">Cola de operación</p>
              <div className="mt-5 grid gap-3">
                {adminQueues.map((item) => (
                  <div key={item.title} className="grid gap-3 rounded-lg border border-neutral-200 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h2 className="font-display text-xl font-bold text-neutral-950">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">{item.detail}</p>
                    </div>
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">{item.status}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-semibold text-brand-600">Regla de asignación</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-neutral-950">{assignmentPolicy.title}</h2>
              <p className="mt-3 leading-7 text-neutral-600">{assignmentPolicy.rule}</p>
              <p className="mt-3 rounded-lg bg-brand-100 p-3 text-sm font-semibold text-brand-700">{assignmentPolicy.timeout}</p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engineCards.map((engine) => {
              const Icon = engine.icon;
              return (
                <Card key={engine.title} className="p-5">
                  <Icon className="h-6 w-6 text-brand-600" />
                  <h2 className="mt-4 font-display text-2xl font-bold text-neutral-950">{engine.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{engine.text}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <UsersRound className="h-6 w-6 text-brand-600" />
                <h2 className="font-display text-2xl font-bold text-neutral-950">Niveles y comisión variable</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {commissionLevels.map((level) => (
                  <div key={level.level} className="grid gap-2 rounded-lg border border-neutral-200 p-4 sm:grid-cols-[120px_80px_1fr]">
                    <strong className="text-neutral-950">{level.level}</strong>
                    <span className="font-semibold text-brand-600">{level.commission}</span>
                    <span className="text-sm text-neutral-600">{level.condition}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-2xl font-bold text-neutral-950">Onboarding de profesionales</h2>
              <div className="mt-5 grid gap-2">
                {onboardingSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{index + 1}</span>
                    <span className="font-semibold text-neutral-800">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Reglas trazables</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {operatingRules.map((rule) => (
                <div key={rule.title} className="rounded-lg border border-neutral-200 p-4">
                  <h3 className="font-semibold text-neutral-950">{rule.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{rule.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-bold text-neutral-950">Notificaciones del flujo</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {notificationSteps.map((step) => <span key={step} className="rounded-full bg-brand-100 px-3 py-2 text-sm font-semibold text-brand-700">{step}</span>)}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
