import { CheckCircle2, Clock3, HeartHandshake, MapPin, ShieldCheck, Sparkles, Star, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryExplorer } from "@/components/resuelto/CategoryExplorer";
import { FaqAccordion } from "@/components/resuelto/FaqAccordion";
import { MainSearch } from "@/components/resuelto/MainSearch";
import { PrimaryCategoryNav } from "@/components/resuelto/PrimaryCategoryNav";
import { ProfessionalCard } from "@/components/resuelto/ProfessionalCard";
import { ResueltoLogo } from "@/components/resuelto/ResueltoLogo";
import { ServiceCard } from "@/components/resuelto/ServiceCard";
import { SiteHeader } from "@/components/resuelto/SiteHeader";
import { assignmentPolicy, benefits, categoryGroups, districts, faqs, notificationSteps, operatingRules, professionals, services, steps, trustItems } from "@/data/home";

export default function HomePage() {
  return (
    <main id="contenido" className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-brand-100 text-neutral-950">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_10%,rgba(152,219,198,0.95),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(241,141,158,0.32),transparent_28%),linear-gradient(180deg,#E4F5EF_0%,#F7FBFA_100%)]" />
        <div className="absolute left-[-10%] top-[-18%] -z-10 h-80 w-80 rounded-full bg-brand-200/45 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-8%] -z-10 h-[520px] w-[520px] rounded-full bg-pink-500/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid content-center gap-7 text-center lg:text-left">
            <Badge tone="action">Servicios a domicilio en Lima</Badge>
            <div className="grid gap-4">
              <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Lo necesitas. Queda Resuelto.
              </h1>
              <p className="mx-auto max-w-xl text-lg leading-8 text-neutral-600 lg:mx-0">
                Encuentra profesionales para tu hogar, compara opciones y reserva el horario que más te conviene.
              </p>
            </div>
            <div className="mx-auto w-full max-w-3xl lg:mx-0">
              <MainSearch />
            </div>
            <PrimaryCategoryNav className="mx-auto w-full max-w-3xl lg:mx-0" listClassName="justify-start lg:justify-start" />
          </div>

          <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
            <div className="relative min-h-[500px] rounded-[38px] bg-white/70 p-4 shadow-lg ring-1 ring-white backdrop-blur">
              <div className="absolute left-7 top-8 hidden rounded-2xl bg-white px-4 py-3 text-neutral-950 shadow-md sm:block">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  Miraflores
                </div>
              </div>
              <div className="absolute right-5 top-5 w-52 rounded-[24px] bg-white p-4 text-neutral-950 shadow-lg sm:right-8 sm:top-14">
                <p className="text-xs font-semibold text-neutral-600">Disponible hoy</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold">3:00 p. m.</p>
                    <p className="text-xs text-neutral-600">Horario sugerido</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-[30px] bg-white p-4 text-neutral-950 shadow-lg sm:left-10 sm:right-auto sm:w-[380px]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-600">Profesionales cerca</p>
                    <h2 className="font-display text-2xl font-bold">Elige con calma</h2>
                  </div>
                  <Star className="h-6 w-6 fill-warning-600 text-warning-600" />
                </div>
                <div className="grid gap-3">
                  {professionals.slice(0, 2).map((professional) => (
                    <div key={professional.name} className="flex items-center justify-between rounded-2xl bg-neutral-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{professional.initials}</div>
                        <div>
                          <p className="font-semibold">{professional.name}</p>
                          <p className="text-xs text-neutral-600">{professional.specialty}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-brand-600">{professional.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-12 top-28 h-64 w-64 rounded-full bg-action-500/25 blur-2xl" />
              <div className="absolute right-16 bottom-32 h-44 w-44 rounded-full bg-pink-500/20 blur-2xl" />
              <div className="grid h-full min-h-[470px] place-items-center">
                <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-white/16 ring-1 ring-white/20">
                  <div className="absolute h-52 w-52 rounded-full bg-white/18" />
                  <div className="relative grid h-36 w-36 place-items-center rounded-[34px] bg-white text-brand-600 shadow-lg">
                    <HeartHandshake className="h-16 w-16" />
                    <span className="mt-2 text-sm font-bold text-neutral-950">Resuelto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="populares" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-sm font-semibold text-brand-600">Lo más popular en tu zona</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Servicios que la gente busca primero</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => <ServiceCard key={service.slug} {...service} />)}
        </div>
      </section>

      <section className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold text-brand-600">Confianza</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Decide con información clara</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {trustItems.map((item, index) => {
              const Icon = [ShieldCheck, Clock3, UserRoundCheck][index];
              return (
                <Card key={item.title} className="p-6">
                  <Icon className="h-8 w-8 text-brand-600" />
                  <h3 className="mt-5 font-display text-2xl font-bold text-neutral-950">{item.title}</h3>
                  <p className="mt-2 leading-7 text-neutral-600">{item.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-brand-600">Operación segura</p>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Reglas claras antes de asignar un servicio</h2>
            </div>
            <p className="text-lg leading-8 text-neutral-600">El cliente puede elegir manualmente o pedir el más rápido. El orden combina cercanía, disponibilidad, verificación, reputación y carga de trabajo.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <Badge tone="brand">{assignmentPolicy.title}</Badge>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-neutral-950">El más rápido no es solo el más cercano</h3>
              <p className="mt-3 leading-7 text-neutral-600">{assignmentPolicy.rule}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Cercanía", "Disponibilidad", "Menor carga"].map((item) => (
                  <div key={item} className="rounded-lg bg-brand-100 p-4 text-sm font-semibold text-brand-700">{item}</div>
                ))}
              </div>
              <ButtonLink href="/operacion" variant="secondary" className="mt-5 w-fit">Ver panel operativo</ButtonLink>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-semibold text-brand-600">Estados y alertas</p>
              <div className="mt-4 grid gap-3">
                {notificationSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{index + 1}</span>
                    <span className="font-semibold text-neutral-800">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {operatingRules.slice(0, 5).map((rule) => (
              <Card key={rule.title} className="p-4">
                <h3 className="font-display text-lg font-bold text-neutral-950">{rule.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{rule.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">Cómo funciona</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="grid gap-5 text-center">
                <div className="mx-auto grid h-44 w-full max-w-[280px] place-items-center rounded-[34px] bg-gradient-to-br from-brand-100 via-white to-pink-100 shadow-sm ring-1 ring-neutral-200">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-brand-600 text-3xl font-bold text-white shadow-md">{index + 1}</div>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-neutral-950">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-sm leading-7 text-neutral-600">{step.text}</p>
                </div>
              </div>
            ))}
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

      <section id="catalogo" className="bg-neutral-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold text-brand-600">Catálogo</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.04em] text-neutral-950 lg:text-5xl">El servicio a domicilio que necesites</h2>
          </div>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {districts.map((district) => (
              <span key={district.slug} className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 shadow-xs ring-1 ring-neutral-200">{district.name}</span>
            ))}
          </div>
          <CategoryExplorer groups={categoryGroups} />
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
