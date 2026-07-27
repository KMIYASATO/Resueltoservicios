export type ServiceItem = {
  name: string;
  slug: string;
  description: string;
  price: string;
  icon: string;
  category: string;
};

export const services: ServiceItem[] = [
  {
    name: "Colegio",
    slug: "colegio",
    description: "Apoyo escolar y refuerzo por materias.",
    price: "Desde S/ 45",
    icon: "School",
    category: "Clases"
  },
  {
    name: "Universidad",
    slug: "universidad",
    description: "Tutorías para cursos universitarios.",
    price: "Desde S/ 60",
    icon: "BriefcaseBusiness",
    category: "Clases"
  },
  {
    name: "Idiomas",
    slug: "idiomas",
    description: "Clases particulares de idiomas.",
    price: "Desde S/ 50",
    icon: "Languages",
    category: "Clases"
  },
  {
    name: "Música",
    slug: "musica",
    description: "Clases de instrumento y teoría musical.",
    price: "Desde S/ 55",
    icon: "Music2",
    category: "Clases"
  },
  {
    name: "Casa",
    slug: "casa",
    description: "Limpieza para casas y departamentos.",
    price: "Desde S/ 60",
    icon: "Sparkles",
    category: "Limpieza"
  },
  {
    name: "Oficinas",
    slug: "oficinas",
    description: "Limpieza para espacios de trabajo.",
    price: "Desde S/ 90",
    icon: "Building2",
    category: "Limpieza"
  },
  {
    name: "Ventanas",
    slug: "ventanas",
    description: "Limpieza puntual de ventanas y mamparas.",
    price: "Desde S/ 50",
    icon: "PanelsTopLeft",
    category: "Limpieza"
  },
  {
    name: "Tapicería",
    slug: "tapiceria",
    description: "Limpieza de muebles y tapizados.",
    price: "Desde S/ 70",
    icon: "Armchair",
    category: "Limpieza"
  },
  {
    name: "Auto",
    slug: "auto",
    description: "Limpieza interior y exterior de autos.",
    price: "Desde S/ 55",
    icon: "Car",
    category: "Limpieza"
  },
  {
    name: "Electricidad",
    slug: "electricidad",
    description: "Tomacorrientes, luminarias y revisiones.",
    price: "Desde S/ 50",
    icon: "Zap",
    category: "Hogar"
  },
  {
    name: "Electrodomésticos",
    slug: "electrodomesticos",
    description: "Revisión e instalación de equipos del hogar.",
    price: "Desde S/ 60",
    icon: "WashingMachine",
    category: "Hogar"
  },
  {
    name: "Cerrajería",
    slug: "cerrajeria",
    description: "Aperturas, chapas y cerraduras.",
    price: "Desde S/ 45",
    icon: "KeyRound",
    category: "Hogar"
  },
  {
    name: "Jardinería",
    slug: "jardineria",
    description: "Macetas, patios, terrazas y áreas verdes.",
    price: "Desde S/ 50",
    icon: "Sprout",
    category: "Hogar"
  }
];

export const categoryGroups = [
  {
    title: "Clases",
    items: ["Colegio", "Universidad", "Idiomas", "Música"]
  },
  {
    title: "Limpieza",
    items: ["Casa", "Oficinas", "Ventanas", "Tapicería", "Auto"]
  },
  {
    title: "Hogar",
    items: ["Electricidad", "Electrodomésticos", "Cerrajería", "Jardinería"]
  }
] as const;

export const districts = [
  { name: "Miraflores", slug: "miraflores", enabled: true },
  { name: "San Isidro", slug: "san-isidro", enabled: true },
  { name: "Santiago de Surco", slug: "surco", enabled: false },
  { name: "La Molina", slug: "la-molina", enabled: false },
  { name: "Barranco", slug: "barranco", enabled: false },
  { name: "Jesús María", slug: "jesus-maria", enabled: false },
  { name: "Magdalena", slug: "magdalena", enabled: false },
  { name: "San Borja", slug: "san-borja", enabled: true }
] as const;

export const enabledDistrictSlugs = districts.filter((district) => district.enabled).map((district) => district.slug);

export const professionals = [
  {
    id: "carlos-r",
    name: "Carlos Rojas",
    specialty: "Electricista domiciliario",
    rating: "4.8",
    reviews: "36 opiniones",
    services: "82 servicios realizados",
    responseTime: "Responde en menos de 1 hora",
    price: "Desde S/ 55",
    availability: "Disponible hoy desde las 3:00 p. m.",
    zone: "Miraflores, San Isidro y Surco",
    initials: "CR",
    verified: "Identidad y experiencia verificadas",
    availabilityStatus: "available",
    verificationStatus: "approved",
    coverageDistricts: ["miraflores", "san-isidro", "surco"],
    etaMinutes: 18,
    activeJobs: 1,
    level: "Oro",
    commissionRate: 0.14,
    completionRate: 0.97,
    repeatRisk: "Bajo"
  },
  {
    id: "mariela-p",
    name: "Mariela Pérez",
    specialty: "Limpieza de hogar",
    rating: "4.9",
    reviews: "51 opiniones",
    services: "110 servicios realizados",
    responseTime: "Responde en el día",
    price: "Desde S/ 65",
    availability: "Mañana desde las 9:00 a. m.",
    zone: "Barranco, Miraflores y Magdalena",
    initials: "MP",
    verified: "Identidad verificada",
    availabilityStatus: "busy",
    verificationStatus: "approved",
    coverageDistricts: ["barranco", "miraflores", "magdalena"],
    etaMinutes: 42,
    activeJobs: 2,
    level: "Plata",
    commissionRate: 0.16,
    completionRate: 0.95,
    repeatRisk: "Medio"
  },
  {
    id: "jorge-a",
    name: "Jorge Álvarez",
    specialty: "Electrodomésticos y hogar",
    rating: "4.7",
    reviews: "24 opiniones",
    services: "58 servicios realizados",
    responseTime: "Responde en menos de 2 horas",
    price: "Desde S/ 45",
    availability: "Disponible hoy desde las 6:00 p. m.",
    zone: "San Borja, Surco y La Molina",
    initials: "JA",
    verified: "Identidad y oficio verificados",
    availabilityStatus: "offline",
    verificationStatus: "approved",
    coverageDistricts: ["san-borja", "surco", "la-molina"],
    etaMinutes: 35,
    activeJobs: 0,
    level: "Bronce",
    commissionRate: 0.18,
    completionRate: 0.93,
    repeatRisk: "Bajo"
  }
] as const;

export type Professional = (typeof professionals)[number];

export const servicePricing = [
  { category: "Clases", baseRange: "S/ 45 - S/ 90", urgentRange: "S/ 65 - S/ 130", onsiteAdjustmentLimit: "20% o S/ 35", guaranteeReserve: "3%" },
  { category: "Limpieza", baseRange: "S/ 60 - S/ 120", urgentRange: "S/ 85 - S/ 160", onsiteAdjustmentLimit: "20% o S/ 35", guaranteeReserve: "3%" },
  { category: "Hogar", baseRange: "S/ 45 - S/ 140", urgentRange: "S/ 70 - S/ 190", onsiteAdjustmentLimit: "25% o S/ 45", guaranteeReserve: "4%" }
] as const;

export const assignmentPolicy = {
  title: "Asignación por aceptación rápida",
  rule: "Cuando el cliente elige el más rápido, Resuelto notifica hasta 3 técnicos verificados, disponibles y cercanos. Gana quien acepta primero dentro de 90 segundos.",
  manualRule: "Si el cliente elige un profesional específico, la solicitud se reserva para esa persona y se muestra alternativa si no responde.",
  timeout: "Sin respuesta en 90 segundos, la solicitud escala al siguiente grupo disponible."
} as const;

export const paymentPolicy = {
  preAuthorization: "Se solicita una retención por el rango estimado antes de confirmar.",
  capture: "El cobro se libera cuando el cliente confirma la finalización con código o fotos.",
  retry: "Si la tarjeta falla, se muestra reintento y se mantiene la solicitud sin asignar hasta resolver el pago.",
  split: "Comisión de plataforma, reserva de garantía y pago al técnico se calculan por transacción.",
  disputeWindow: "El cliente puede reportar un problema dentro de las primeras 24 horas."
} as const;

export const commissionLevels = [
  { level: "Bronce", commission: "18%", condition: "Ingreso inicial o menos de 30 servicios" },
  { level: "Plata", commission: "16%", condition: "30+ servicios y rating sostenido sobre 4.5" },
  { level: "Oro", commission: "14%", condition: "80+ servicios, baja cancelación y buena respuesta" },
  { level: "Diamante", commission: "12%", condition: "150+ servicios, rating alto y cero alertas recientes" }
] as const;

export const operatingRules = [
  { title: "Verificación", text: "Solo aparecen técnicos con estado aprobado. Pendientes o rechazados quedan bloqueados para clientes." },
  { title: "Reputación", text: "Si el rating baja de 3.5 de forma sostenida, el perfil se pausa y pasa a revisión." },
  { title: "Finalización", text: "Cada servicio requiere código único o fotos antes de marcarlo como completado." },
  { title: "Cancelaciones", text: "Cliente: posible costo mínimo si cancela tarde. Técnico: penalidad si no llega o abandona." },
  { title: "Geofencing", text: "En la fase inicial solo se activan solicitudes en Miraflores, San Isidro y San Borja." },
  { title: "Disputas", text: "Reclamos por daño, mal servicio o cobro excesivo pasan a revisión con acciones trazables." },
  { title: "Balanceo", text: "El ranking reduce prioridad a técnicos saturados para repartir demanda." },
  { title: "Referidos", text: "Cada invitación queda asociada a cliente o técnico para aplicar bono o descuento." },
  { title: "Fuga fuera de plataforma", text: "Se monitorean patrones de contacto repetido sin nuevas reservas para revisión preventiva." },
  { title: "Auditoría", text: "Se registra solicitud, aceptación, precio, cambios, confirmaciones y resolución." }
] as const;

export const notificationSteps = ["Solicitud creada", "Técnico asignado", "En camino", "Trabajo confirmado", "Pago liberado"] as const;

export const onboardingSteps = ["Registro", "Documentos", "Antecedentes", "Entrevista", "Aprobación", "Activación"] as const;

export const adminMetrics = [
  { label: "Pedidos activos", value: "14", tone: "brand" },
  { label: "Técnicos disponibles", value: "8", tone: "success" },
  { label: "Pendientes de aprobar", value: "5", tone: "action" },
  { label: "Disputas abiertas", value: "2", tone: "neutral" }
] as const;

export const adminQueues = [
  { title: "Solicitud urgente", detail: "Electricidad en Miraflores, 2 técnicos notificados, 42 s restantes", status: "Escalamiento activo" },
  { title: "Verificación pendiente", detail: "Documento de identidad y antecedentes por revisar", status: "Revisión requerida" },
  { title: "Disputa abierta", detail: "Cliente reporta ajuste de precio mayor al límite permitido", status: "Mediación" },
  { title: "Balanceo de carga", detail: "Un técnico concentra 38% de pedidos de la categoría Hogar", status: "Redistribuir prioridad" }
] as const;

export function getPricingForService(slug?: string | null) {
  const service = findService(slug);
  return servicePricing.find((pricing) => pricing.category === service.category) ?? servicePricing[0];
}

export function matchProfessionals(districtSlug?: string | null) {
  const selectedDistrict = findDistrict(districtSlug);
  const districtEnabled = Boolean(selectedDistrict.enabled);

  return professionals
    .filter((professional) => professional.verificationStatus === "approved")
    .map((professional) => {
      const coversDistrict = (professional.coverageDistricts as readonly string[]).includes(selectedDistrict.slug);
      const availabilityScore = professional.availabilityStatus === "available" ? 34 : professional.availabilityStatus === "busy" ? 12 : 0;
      const coverageScore = districtEnabled && coversDistrict ? 32 : coversDistrict ? 16 : 0;
      const ratingScore = Math.round(Number(professional.rating) * 5);
      const loadPenalty = professional.activeJobs * 4;
      const etaPenalty = Math.round(professional.etaMinutes / 6);
      const score = Math.max(0, coverageScore + availabilityScore + ratingScore - loadPenalty - etaPenalty);

      return {
        ...professional,
        coversDistrict,
        districtEnabled,
        matchScore: score,
        distanceLabel: coversDistrict ? "Dentro de zona" : "Fuera de zona prioritaria",
        etaLabel: professional.availabilityStatus === "available" ? `${professional.etaMinutes} min aprox.` : professional.availabilityStatus === "busy" ? "Tras liberar agenda" : "No disponible ahora"
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.etaMinutes - b.etaMinutes);
}

export const steps = [
  {
    title: "Busca el servicio",
    text: "Selecciona el servicio, indica el distrito y confirma la búsqueda."
  },
  {
    title: "Compara opciones",
    text: "Revisa disponibilidad, precio estimado, experiencia y opiniones."
  },
  {
    title: "Reserva el horario",
    text: "Confirma los datos y sigue tu reserva desde la plataforma."
  }
] as const;

export const trustItems = [
  { title: "Profesionales identificables", text: "Conoce a quién vas a recibir antes de reservar." },
  { title: "Precios claros", text: "Revisa precios referenciales y condiciones antes de avanzar." },
  { title: "Seguimiento de la reserva", text: "Mantén el control del horario, dirección y profesional elegido." }
] as const;

export const benefits = [
  "Menos llamadas y mensajes sueltos.",
  "Comparación ordenada antes de decidir.",
  "Servicios para hogar, mantenimiento y cuidado.",
  "Experiencia pensada para Lima Metropolitana."
] as const;

export const faqs = [
  {
    question: "¿Resuelto envía trabajadores propios?",
    answer: "No. Resuelto conecta clientes con profesionales independientes y organiza la reserva para que puedas comparar antes de decidir."
  },
  {
    question: "¿Los precios son finales?",
    answer: "Mostramos precios referenciales. El total puede ajustarse según el detalle del servicio, horario y condiciones del trabajo."
  },
  {
    question: "¿Puedo elegir profesional?",
    answer: "Sí. Puedes comparar profesionales, revisar disponibilidad y elegir la opción que mejor se ajuste a lo que necesitas."
  }
] as const;

export function findService(slug?: string | null) {
  return services.find((service) => service.slug === slug) ?? services[0];
}

export function findDistrict(slug?: string | null) {
  return districts.find((district) => district.slug === slug) ?? districts[0];
}

export function findProfessional(id?: string | null) {
  return professionals.find((professional) => professional.id === id) ?? professionals[0];
}
