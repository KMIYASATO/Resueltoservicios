import { getPricingForService } from "@/data/home";
import type { EstimatedPriceBand, ServiceKind } from "../types/request.types";

function parseRange(label: string) {
  const values = label.match(/\d+/g)?.map(Number) ?? [60, 120];
  return { min: values[0] ?? 60, max: values[1] ?? values[0] + 60 };
}

export const mockPricingService = {
  estimate(serviceSlug: string, serviceKind: ServiceKind, urgency: string): EstimatedPriceBand {
    const base = parseRange(getPricingForService(serviceSlug).baseRange);
    const urgencyLift = urgency === "Lo antes posible" || urgency === "Hoy" ? 15 : 0;
    const min = base.min + urgencyLift;
    const max = base.max + urgencyLift + (serviceKind === "home" ? 20 : 0);
    return {
      min,
      max,
      currency: "PEN",
      label: `S/ ${min} - S/ ${max}`,
      explanation: "Estimado referencial de Queda. El precio final dependerá del alcance, urgencia, zona y propuesta del profesional."
    };
  }
};
