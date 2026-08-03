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

export default function HomePage() {
  return (
    <main id="contenido" className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative isolate bg-neutral-50 pt-5 sm:pt-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(152,219,198,0.38),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(241,141,158,0.14),transparent_24%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <PrimaryCategoryNav compact listClassName="justify-center" />
          <div className="mx-auto max-w-4xl py-8 sm:py-10 lg:py-12">
            <p className="text-base font-semibold text-brand-600 sm:text-[17px]">Clases, limpieza y hogar</p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold tracking-[-0.045em] text-neutral-950 sm:text-5xl lg:text-[52px] lg:leading-[1.02]">Encuentra al profesional que necesitas</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">Busca por servicio y distrito, revisa opciones y envía tu solicitud.</p>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-12 sm:py-14 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-neutral-950 sm:text-4xl lg:text-5xl">Cómo funciona</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Queda conecta a personas que necesitan un servicio con profesionales disponibles en su zona.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">1</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Cuéntanos qué necesitas</h3>
              <p className="mt-3 leading-7 text-neutral-600">Elige el servicio, indica tu distrito y describe tu solicitud.</p>
            </Card>

            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">2</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Elige una opción</h3>
              <p className="mt-3 leading-7 text-neutral-600">Compara profesionales según disponibilidad y valoración.</p>
            </Card>

            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">3</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Coordina la atención</h3>
              <p className="mt-3 leading-7 text-neutral-600">Envía la solicitud y acuerda fecha, horario y contacto.</p>
            </Card>
          </div>
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
