import { Camera, CheckCircle2, Clock3, FileText, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FaqAccordion } from "@/components/resuelto/FaqAccordion";
import { PrimaryCategoryNav } from "@/components/resuelto/PrimaryCategoryNav";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { SiteHeader } from "@/components/resuelto/SiteHeader";
import { faqs } from "@/data/home";
import { AuthTriggerButton } from "@/features/auth/components/AuthTriggerButton";

const requestDetails = [
  "Solicitud registrada",
  "Detalle del servicio",
  "Archivos y fotografías",
  "Fecha y horario",
  "Historial de coordinación"
] as const;

const trustItems = [
  {
    title: "Identidad verificada",
    text: "Queda confirmó la identidad y los datos de contacto del profesional.",
    icon: ShieldCheck
  },
  {
    title: "Solicitud con contexto",
    text: "El profesional recibe servicio, distrito, detalle y horario antes de responder.",
    icon: FileText
  },
  {
    title: "Coordinación clara",
    text: "El contacto se comparte cuando corresponde avanzar con la atención.",
    icon: Clock3
  }
] as const;

const howItWorksSteps = [
  {
    title: "Cuéntanos qué necesitas",
    text: "Selecciona el servicio y tu distrito."
  },
  {
    title: "Revisa opciones",
    text: "Compara profesionales disponibles."
  },
  {
    title: "Coordina la atención",
    text: "Envía tu solicitud y acuerda fecha y hora."
  }
] as const;

export default function HomePage() {
  return (
    <main id="contenido" className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative isolate bg-neutral-50 pt-5 sm:pt-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(152,219,198,0.38),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(241,141,158,0.14),transparent_24%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <PrimaryCategoryNav compact listClassName="justify-center" />
          <div className="mx-auto max-w-4xl py-7 sm:py-9 lg:py-10">
            <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-[-0.045em] text-neutral-950 sm:text-5xl lg:text-[52px] lg:leading-[1.02]">Encuentra al profesional que necesitas</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">Busca por servicio y distrito, revisa opciones y envía tu solicitud.</p>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl">Cómo funciona</h2>
            <p className="mt-3 text-base leading-7 text-neutral-600 sm:text-lg">Busca, elige y coordina tu servicio en pocos pasos.</p>
          </div>
          <ol className="mt-8 grid gap-0 overflow-hidden rounded-[20px] border border-neutral-200 bg-white md:grid-cols-3" aria-label="Pasos para usar Queda">
            {howItWorksSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4 border-b border-neutral-200 p-5 last:border-b-0 md:block md:border-b-0 md:border-r md:p-6 md:last:border-r-0 lg:p-7">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 md:h-10 md:w-10">{index + 1}</span>
                <div className="min-w-0 md:mt-4">
                  <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-neutral-950">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-neutral-600 sm:text-base">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-neutral-50 py-12 sm:py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold text-brand-600">Solicitud detallada</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl">No solo te damos un contacto</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">Envía el detalle, fotografías y horario para que el profesional revise tu solicitud antes de responder.</p>
          </div>
          <Card className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {requestDetails.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-brand-100 px-4 py-3 text-sm font-semibold text-neutral-950">
                  {item === "Archivos y fotografías" ? <Camera className="h-5 w-5 text-brand-600" aria-hidden="true" /> : <CheckCircle2 className="h-5 w-5 text-brand-600" aria-hidden="true" />}
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-brand-600">Confianza</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl">Información clara antes de coordinar</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-6">
                  <Icon className="h-7 w-7 text-brand-600" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-neutral-950">{item.title}</h3>
                  <p className="mt-2 leading-7 text-neutral-600">{item.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="profesionales" className="bg-neutral-50 py-12 sm:py-14 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold text-brand-600">Para profesionales</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl">¿Ofreces servicios?</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-neutral-600">Crea tu perfil, indica tu disponibilidad y recibe solicitudes con información más completa.</p>
          </div>
          <AuthTriggerButton auth={{ mode: "register", accountIntent: "professional", returnTo: "/profesionales/onboarding/", pendingAction: "professional-onboarding" }} className="w-full sm:w-fit">Ofrecer mis servicios</AuthTriggerButton>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-14 lg:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-brand-600">Preguntas frecuentes</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl">Antes de enviar tu solicitud</h2>
          <div className="mt-8"><FaqAccordion items={faqs} /></div>
        </div>
      </section>

      <footer className="bg-brand-700 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
          <div className="grid gap-4">
            <ResueltoLogo inverted />
            <p className="max-w-sm text-sm leading-6 text-brand-100">Servicios de confianza, cuando los necesitas. Pensado para Lima Metropolitana.</p>
            <div className="grid gap-1 text-sm text-brand-100">
              <p>© 2026 Queda</p>
              <p>Fundado por Kenji Miyasato & David Chavez</p>
            </div>
          </div>
          <div className="grid gap-6 text-sm sm:grid-cols-4">
            {[
              ["Clientes", "Buscar", "Solicitudes", "Ayuda"],
              ["Profesionales", "Registrarme", "Tarifas", "Agenda"],
              ["Legal", "Términos", "Privacidad", "Cookies"],
              ["Soporte", "Centro de ayuda", "Reclamos", "Contacto"]
            ].map((column) => (
              <div key={column[0]}>
                <h3 className="font-semibold text-white">{column[0]}</h3>
                <div className="mt-3 grid gap-2 text-brand-100">
                  {column.slice(1).map((item) => <a key={item} href="#" className="hover:text-white">{item}</a>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
