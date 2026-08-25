import { serviceCategories } from "@/data/serviceCatalog";
import type { ServiceKind } from "../types/request.types";

export function getServiceKind(categorySlug: string): ServiceKind {
  if (categorySlug === "clases") return "education";
  if (categorySlug === "limpieza") return "cleaning";
  return "home";
}

export function getCategoryLabel(categorySlug: string) {
  return serviceCategories.find((category) => category.slug === categorySlug)?.label ?? "Hogar";
}

export function getRequestCopy(kind: ServiceKind) {
  if (kind === "education") {
    return {
      cta: "Solicitar clase",
      needPlaceholder: "Ej. Reforzar cálculo diferencial",
      descriptionPlaceholder: "Cuéntale qué tema deseas reforzar y cuál es tu objetivo.",
      attachmentLabel: "+ Agregar archivo",
      urgencyOptions: [],
      quickDates: ["Hoy", "Mañana", "Elegir fecha"],
      modalities: ["presencial", "virtual"] as const
    };
  }
  if (kind === "cleaning") {
    return {
      cta: "Solicitar atención",
      needPlaceholder: "Ej. Limpieza profunda de departamento",
      descriptionPlaceholder: "Cuéntale qué espacios necesitas limpiar y cualquier indicación importante.",
      attachmentLabel: "+ Agregar fotos",
      urgencyOptions: ["Hoy", "Mañana", "Esta semana", "Elegir fecha"],
      quickDates: ["Hoy", "Mañana", "Elegir fecha"],
      modalities: ["presencial"] as const
    };
  }
  return {
    cta: "Solicitar atención",
    needPlaceholder: "Ej. Reparar dos tomacorrientes",
    descriptionPlaceholder: "Cuéntale qué está ocurriendo, desde cuándo y cualquier detalle que pueda ayudar.",
    attachmentLabel: "+ Agregar fotos",
    urgencyOptions: ["Lo antes posible", "Hoy", "Esta semana", "Sin apuro"],
    quickDates: ["Hoy", "Mañana", "Elegir fecha"],
    modalities: ["presencial"] as const
  };
}
