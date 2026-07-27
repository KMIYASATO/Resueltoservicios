import { CheckCircle2, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FaqAccordion } from "@/components/resuelto/FaqAccordion";
import { MainSearch } from "@/components/resuelto/MainSearch";
import { ProfessionalCard } from "@/components/resuelto/ProfessionalCard";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { SiteHeader } from "@/components/resuelto/SiteHeader";
import { benefits, faqs, professionals } from "@/data/home";

export default function HomePage() {
  return (
    <main id="contenido" className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative isolate overflow-visible bg-neutral-50 text-neutral-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(152,219,198,0.38),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(241,141,158,0.14),transparent_24%)]" />
        <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8 lg:py-12">
          <p className="text-sm font-semibold text-brand-600">Encuentra al profesional que necesitas</p>
          <div className="mt-5">
            <MainSearch />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Cómo funciona</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Resuelto conecta a personas que necesitan un servicio con profesionales disponibles en su zona. Busca, elige cómo quieres ser atendido y coordina todo desde un solo lugar.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">1</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Cuéntanos qué necesitas</h3>
              <p className="mt-3 leading-7 text-neutral-600">Selecciona el tipo de servicio, indica tu distrito y describe brevemente el problema.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Electricidad", "Casa", "Idiomas", "Colegio", "Jardinería"].map((item) => (
                  <span key={item} className="rounded-full bg-brand-100 px-3 py-1.5 text-sm font-semibold text-brand-700">{item}</span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600">Podrás agregar fotografías para ayudar al profesional a entender mejor la solicitud.</p>
            </Card>

            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">2</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Elige cómo quieres resolverlo</h3>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-950">Encontrar al más rápido</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">Resuelto busca un profesional disponible para atender la solicitud lo antes posible.</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="font-semibold text-neutral-950">Elegir un profesional</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">Revisa perfiles, especialidades, precios referenciales, disponibilidad y valoraciones antes de elegir.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">3</span>
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Confirma y coordina el servicio</h3>
              <p className="mt-3 leading-7 text-neutral-600">El profesional recibe la solicitud y confirma si puede atenderla.</p>
              <div className="mt-5 grid gap-2 text-sm font-semibold text-neutral-700">
                {["Profesional asignado", "Fecha y hora", "Precio cerrado o rango estimado", "Condiciones del servicio", "Información necesaria"].map((item) => (
                  <span key={item} className="rounded-full bg-neutral-50 px-3 py-2 ring-1 ring-neutral-200">{item}</span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600">Después del trabajo, el cliente confirma la finalización y puede dejar una valoración.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="profesionales" className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold text-brand-600">Profesionales recomendados</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Compara antes de reservar</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {professionals.map((professional) => <ProfessionalCard key={professional.id} {...professional} />)}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="grid content-center gap-5">
            <p className="text-sm font-semibold text-brand-600">Beneficios</p>
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Una forma más ordenada de resolver tareas del hogar</h2>
            <p className="max-w-2xl text-lg leading-8 text-neutral-600">Encuentra opciones, revisa detalles y reserva sin depender de recomendaciones sueltas o chats desordenados.</p>
          </div>
          <Card className="relative min-h-[360px] overflow-hidden border-0 bg-brand-700 p-6 text-white shadow-lg">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-action-500/40 blur-2xl" />
            <div className="relative grid gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-100" />
                  <p className="text-sm leading-6 text-brand-100">{benefit}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="grid content-center gap-4">
            <p className="text-sm font-semibold text-brand-600">Para profesionales</p>
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Ofrece tus servicios con una agenda más ordenada.</h2>
            <p className="max-w-2xl text-lg leading-8 text-neutral-600">Crea tu perfil, define zonas, horarios y servicios para recibir solicitudes con mejor contexto desde el primer contacto.</p>
            <ButtonLink href="#" className="w-fit">Ofrecer mis servicios</ButtonLink>
          </div>
          <Card className="p-5">
            <div className="rounded-[26px] bg-brand-100 p-5">
              <Sparkles className="h-8 w-8 text-brand-600" />
              <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">Tu perfil profesional</h3>
              <p className="mt-2 leading-7 text-neutral-700">Servicios, tarifas, cobertura y disponibilidad en un solo lugar.</p>
              <div className="mt-5 grid gap-2 text-sm font-semibold text-neutral-700">
                <span className="rounded-full bg-white px-3 py-2">Agenda</span>
                <span className="rounded-full bg-white px-3 py-2">Solicitudes</span>
                <span className="rounded-full bg-white px-3 py-2">Reputación</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-brand-600">Preguntas frecuentes</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950">Antes de reservar</h2>
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
              ["Clientes", "Buscar", "Reservas", "Ayuda"],
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
