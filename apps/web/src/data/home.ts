export type ServiceItem = {
  name: string;
  slug: string;
  description: string;
  price: string;
  icon: "Sparkles" | "Droplets" | "Zap" | "Wrench" | "Paintbrush" | "Leaf" | "KeyRound" | "Truck";
  category: string;
};

export const services: ServiceItem[] = [
  {
    name: "Limpieza del hogar",
    slug: "limpieza-hogar",
    description: "Casa, departamentos y limpiezas profundas.",
    price: "Desde S/ 60",
    icon: "Sparkles",
    category: "Limpieza"
  },
  {
    name: "Gasfitería",
    slug: "gasfiteria",
    description: "Fugas, griferías e instalaciones simples.",
    price: "Desde S/ 45",
    icon: "Droplets",
    category: "Hogar"
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
    name: "Armado e instalación",
    slug: "armado-instalacion",
    description: "Muebles, repisas, soportes y cortinas.",
    price: "Desde S/ 40",
    icon: "Wrench",
    category: "Hogar"
  },
  {
    name: "Pintura",
    slug: "pintura",
    description: "Retoques, habitaciones y paredes interiores.",
    price: "Desde S/ 90",
    icon: "Paintbrush",
    category: "Mantenimiento"
  },
  {
    name: "Jardinería",
    slug: "jardineria",
    description: "Macetas, patios, terrazas y áreas verdes.",
    price: "Desde S/ 50",
    icon: "Leaf",
    category: "Mantenimiento"
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
    name: "Mudanzas pequeñas",
    slug: "mudanzas-pequenas",
    description: "Traslados puntuales, muebles y cajas.",
    price: "Desde S/ 80",
    icon: "Truck",
    category: "Mudanza y apoyo"
  }
];

export const categoryGroups = [
  {
    title: "Limpieza",
    items: ["Limpieza de casa", "Limpieza profunda", "Limpieza post obra", "Plancha", "Oficinas pequeñas", "Ventanas", "Tapicería", "Alquiler temporal"]
  },
  {
    title: "Hogar",
    items: ["Gasfitería", "Electricidad", "Pintura", "Cerrajería", "Armado de muebles", "Instalaciones", "Reparaciones", "Técnico para el hogar"]
  },
  {
    title: "Mantenimiento",
    items: ["Jardinería", "Aire acondicionado", "Electrodomésticos", "Reparaciones menores", "Piscinas", "Sellados", "Impermeabilización", "Fumigación"]
  },
  {
    title: "Mudanza y apoyo",
    items: ["Mudanzas pequeñas", "Carga por horas", "Retiro de muebles", "Embalaje", "Traslado puntual", "Ayuda en casa", "Traslado de muebles", "Desarme"]
  },
  {
    title: "Cuidado",
    items: ["Cuidado de adultos", "Acompañamiento", "Cuidado de niños", "Apoyo por horas", "Mascotas", "Paseos", "Baño de mascotas", "Visitas"]
  },
  {
    title: "Bienestar",
    items: ["Fisioterapia", "Entrenamiento", "Clases particulares", "Yoga", "Belleza a domicilio", "Masajes", "Manicure", "Peluquería"]
  }
] as const;

export const districts = [
  { name: "Miraflores", slug: "miraflores" },
  { name: "San Isidro", slug: "san-isidro" },
  { name: "Santiago de Surco", slug: "surco" },
  { name: "La Molina", slug: "la-molina" },
  { name: "Barranco", slug: "barranco" },
  { name: "Jesús María", slug: "jesus-maria" },
  { name: "Magdalena", slug: "magdalena" },
  { name: "San Borja", slug: "san-borja" }
] as const;

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
    verified: "Identidad y experiencia verificadas"
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
    verified: "Identidad verificada"
  },
  {
    id: "jorge-a",
    name: "Jorge Álvarez",
    specialty: "Gasfitería e instalaciones",
    rating: "4.7",
    reviews: "24 opiniones",
    services: "58 servicios realizados",
    responseTime: "Responde en menos de 2 horas",
    price: "Desde S/ 45",
    availability: "Disponible hoy desde las 6:00 p. m.",
    zone: "San Borja, Surco y La Molina",
    initials: "JA",
    verified: "Identidad y oficio verificados"
  }
] as const;

export const steps = [
  {
    title: "Busca el servicio",
    text: "Elige qué necesitas resolver y en qué distrito quieres atenderlo."
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
