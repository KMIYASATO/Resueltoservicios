import { professionals } from "@/data/home";
import type { Offer, PublicProfessionalData, ServiceRequest } from "../types/request.types";

function isoAfter(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function publicProfessional(index: number): PublicProfessionalData {
  const professional = professionals[index % professionals.length];
  return {
    id: professional.id,
    name: professional.name,
    initials: professional.initials,
    specialty: professional.specialty,
    rating: professional.rating,
    reviews: professional.reviews
  };
}

export const mockOfferService = {
  generateOffers(request: ServiceRequest): Offer[] {
    const selected = request.professional;
    const base = request.estimatedPrice.min;
    const directOffer: Offer =
      {
        id: `offer-${request.id}-fixed`,
        requestId: request.id,
        professional: selected,
        pricingType: "fixed_price",
        amount: base + 25,
        availability: "Hoy por la tarde",
        proposedDate: request.preferredDate,
        proposedTimeWindow: request.preferredTime,
        scopeIncluded: "Diagnóstico, revisión y reparación puntual si no requiere repuesto mayor.",
        note: "Puedo revisar el problema y resolverlo en la misma visita si el alcance coincide.",
        etaLabel: "18 min aprox.",
        responseLabel: "Respondió en 8 min",
        status: "sent",
        createdAt: isoAfter(-8),
        expiresAt: isoAfter(180)
      };
    if (request.requestMode === "direct") return [directOffer];

    return [
      directOffer,
      {
        id: `offer-${request.id}-range`,
        requestId: request.id,
        professional: publicProfessional(1),
        pricingType: "price_range",
        minAmount: base + 10,
        maxAmount: base + 65,
        availability: "Mañana temprano",
        proposedDate: "Mañana",
        proposedTimeWindow: "8 a. m. - 12 p. m.",
        scopeIncluded: "Limpieza/revisión del punto, ajuste menor y recomendación de repuestos si aplica.",
        note: "El rango depende de si hay que cambiar accesorios.",
        etaLabel: "Zona cercana",
        responseLabel: "Respondió en 14 min",
        status: "sent",
        createdAt: isoAfter(-4),
        expiresAt: isoAfter(240)
      },
      {
        id: `offer-${request.id}-diagnostic`,
        requestId: request.id,
        professional: publicProfessional(2),
        pricingType: "diagnostic_visit",
        diagnosticFee: 40,
        availability: "Esta semana",
        proposedDate: request.preferredDate,
        proposedTimeWindow: "6 p. m. - 9 p. m.",
        scopeIncluded: "Visita diagnóstica y cotización final después de revisar en sitio.",
        note: "Recomendado si el problema puede estar en el tablero o cableado interno.",
        etaLabel: "35 min aprox.",
        responseLabel: "Respondió en 21 min",
        status: "sent",
        createdAt: isoAfter(-2),
        expiresAt: isoAfter(300)
      }
    ];
  },
  formatPrice(offer: Offer) {
    if (offer.pricingType === "fixed_price") return `S/ ${offer.amount}`;
    if (offer.pricingType === "price_range") return `S/ ${offer.minAmount} - S/ ${offer.maxAmount}`;
    return `Visita S/ ${offer.diagnosticFee}`;
  },
  pricingTypeLabel(offer: Offer) {
    if (offer.pricingType === "fixed_price") return "Precio fijo";
    if (offer.pricingType === "price_range") return "Rango de precio";
    return "Visita diagnóstica";
  }
};
