import { Armchair, BriefcaseBusiness, Building2, Car, GraduationCap, House, KeyRound, Languages, Music2, PanelsTopLeft, School, Sparkles, Sprout, WashingMachine, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceCategory = {
  label: string;
  slug: string;
  sheetTitle: string;
  color: string;
  icon: LucideIcon;
  services: Array<{
    label: string;
    slug: string;
    icon: LucideIcon;
  }>;
};

export const serviceCategories: ServiceCategory[] = [
  {
    label: "Clases",
    slug: "clases",
    sheetTitle: "Clases",
    color: "#F18D9E",
    icon: GraduationCap,
    services: [
      { label: "Colegio", slug: "colegio", icon: School },
      { label: "Universidad", slug: "universidad", icon: BriefcaseBusiness },
      { label: "Idiomas", slug: "idiomas", icon: Languages },
      { label: "Música", slug: "musica", icon: Music2 }
    ]
  },
  {
    label: "Limpieza",
    slug: "limpieza",
    sheetTitle: "Servicios de Limpieza",
    color: "#98DBC6",
    icon: Sparkles,
    services: [
      { label: "Casa", slug: "casa", icon: House },
      { label: "Oficinas", slug: "oficinas", icon: Building2 },
      { label: "Ventanas", slug: "ventanas", icon: PanelsTopLeft },
      { label: "Tapicería", slug: "tapiceria", icon: Armchair },
      { label: "Auto", slug: "auto", icon: Car }
    ]
  },
  {
    label: "Hogar",
    slug: "hogar",
    sheetTitle: "Servicios de Hogar",
    color: "#5BC8AC",
    icon: House,
    services: [
      { label: "Electricidad", slug: "electricidad", icon: Zap },
      { label: "Electrodomésticos", slug: "electrodomesticos", icon: WashingMachine },
      { label: "Cerrajería", slug: "cerrajeria", icon: KeyRound },
      { label: "Jardinería", slug: "jardineria", icon: Sprout }
    ]
  }
];

export const enabledDistricts = [
  { label: "Miraflores", slug: "miraflores" },
  { label: "San Isidro", slug: "san-isidro" },
  { label: "San Borja", slug: "san-borja" }
];

export const serviceOptions = serviceCategories.flatMap((category) =>
  category.services.map((service) => ({
    label: service.label,
    slug: service.slug,
    categoryLabel: category.label,
    categorySlug: category.slug,
    icon: service.icon
  }))
);

export const SERVICE_SELECTED_EVENT = "resuelto:service-selected";

export type ServiceSelectedDetail = {
  categorySlug: string;
  categoryLabel: string;
  serviceSlug: string;
  serviceLabel: string;
};
