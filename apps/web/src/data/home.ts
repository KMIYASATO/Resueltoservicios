export const services = [
  {
    name: "Limpieza del hogar",
    slug: "limpieza-hogar",
    description: "Casa, departamentos y limpiezas profundas.",
    price: "Desde S/ 60",
    icon: "Sparkles"
  },
  {
    name: "Gasfiteria",
    slug: "gasfiteria",
    description: "Fugas, griferias e instalaciones simples.",
    price: "Desde S/ 45",
    icon: "Droplets"
  },
  {
    name: "Electricidad",
    slug: "electricidad",
    description: "Tomacorrientes, luminarias y revisiones.",
    price: "Desde S/ 50",
    icon: "Zap"
  },
  {
    name: "Armado e instalacion",
    slug: "armado-instalacion",
    description: "Muebles, repisas, soportes y cortinas.",
    price: "Desde S/ 40",
    icon: "Wrench"
  },
  {
    name: "Pintura",
    slug: "pintura",
    description: "Retoques, habitaciones y paredes interiores.",
    price: "Desde S/ 90",
    icon: "Paintbrush"
  },
  {
    name: "Jardineria",
    slug: "jardineria",
    description: "Macetas, patios, terrazas y areas verdes.",
    price: "Desde S/ 50",
    icon: "Leaf"
  },
  {
    name: "Cerrajeria",
    slug: "cerrajeria",
    description: "Aperturas, chapas y cerraduras.",
    price: "Desde S/ 45",
    icon: "KeyRound"
  },
  {
    name: "Mudanzas pequenas",
    slug: "mudanzas-pequenas",
    description: "Traslados puntuales, muebles y cajas.",
    price: "Desde S/ 80",
    icon: "Truck"
  }
] as const;

export const professionals = [
  {
    name: "Carlos R.",
    specialty: "Electricista domiciliario",
    rating: "4.8",
    reviews: "36 resenas demostrativas",
    services: "82 servicios demostrativos",
    price: "Desde S/ 55",
    availability: "Disponible hoy desde 3:00 p. m.",
    initials: "CR"
  },
  {
    name: "Mariela P.",
    specialty: "Limpieza de hogar",
    rating: "4.9",
    reviews: "51 resenas demostrativas",
    services: "110 servicios demostrativos",
    price: "Desde S/ 65",
    availability: "Manana desde 9:00 a. m.",
    initials: "MP"
  },
  {
    name: "Jorge A.",
    specialty: "Gasfiteria e instalaciones",
    rating: "4.7",
    reviews: "24 resenas demostrativas",
    services: "58 servicios demostrativos",
    price: "Desde S/ 45",
    availability: "Disponible hoy desde 6:00 p. m.",
    initials: "JA"
  }
] as const;

export const steps = [
  {
    title: "Busca el servicio",
    text: "Elige que necesitas resolver y en que distrito de Lima quieres atenderlo."
  },
  {
    title: "Elige profesional",
    text: "Compara disponibilidad, precio estimado, experiencia y reputacion antes de decidir."
  },
  {
    title: "Reserva en minutos",
    text: "Confirma el horario y sigue el estado del servicio desde la plataforma."
  }
] as const;

export const categoryGroups = [
  {
    title: "Limpieza",
    items: ["Limpieza de casa", "Limpieza profunda", "Limpieza post obra", "Plancha", "Oficinas pequenas", "Ventanas", "Tapiceria", "Alquiler temporal"]
  },
  {
    title: "Hogar",
    items: ["Gasfiteria", "Electricidad", "Pintura", "Cerrajeria", "Armado de muebles", "Instalaciones", "Reparaciones", "Taladro"]
  },
  {
    title: "Mantenimiento",
    items: ["Jardineria", "Aire acondicionado", "Electrodomesticos", "Reparaciones menores", "Piscinas", "Sellados", "Impermeabilizacion", "Fumigacion"]
  },
  {
    title: "Mudanza y apoyo",
    items: ["Mudanzas pequenas", "Carga por horas", "Retiro de muebles", "Embalaje", "Traslado puntual", "Ayuda en casa", "Delivery grande", "Desarme"]
  },
  {
    title: "Cuidado",
    items: ["Cuidado de adultos", "Acompanamiento", "Cuidado de ninos", "Apoyo por horas", "Mascotas", "Paseos", "Bano de mascotas", "Visitas"]
  },
  {
    title: "Bienestar",
    items: ["Fisioterapia", "Entrenamiento", "Clases particulares", "Yoga", "Belleza a domicilio", "Masajes", "Manicure", "Peluqueria"]
  }
] as const;

export const heroServices = ["Limpieza", "Gasfiteria", "Electricidad", "Manitas", "Pintura", "Jardineria", "Mudanzas", "Mascotas"] as const;

export const districts = ["Miraflores", "San Isidro", "Surco", "La Molina", "Barranco", "Jesus Maria", "Magdalena", "San Borja"] as const;

export const faqs = [
  {
    question: "¿Resuelto envia trabajadores propios?",
    answer: "No. Resuelto conecta clientes con profesionales independientes verificados y gestiona la reserva."
  },
  {
    question: "¿Los precios son finales?",
    answer: "En el MVP mostramos precios estimados. El precio final se calcula en backend antes de confirmar."
  },
  {
    question: "¿Ya hay pagos reales?",
    answer: "No. El flujo queda preparado, pero los pagos reales requieren aprobacion del proveedor y validacion legal."
  }
] as const;
