import type { ExactAddress } from "../types/request.types";

const coordinatesByDistrict: Record<string, { lat: number; lng: number; zone: string }> = {
  miraflores: { lat: -12.1211, lng: -77.0297, zone: "Zona aproximada: Miraflores centro" },
  "san-isidro": { lat: -12.0978, lng: -77.0365, zone: "Zona aproximada: San Isidro empresarial" },
  "san-borja": { lat: -12.1088, lng: -76.9975, zone: "Zona aproximada: San Borja norte" }
};

export const mockAddressService = {
  createDefault(districtSlug: string, districtLabel: string): ExactAddress {
    const coords = coordinatesByDistrict[districtSlug] ?? { lat: -12.0464, lng: -77.0428, zone: `Zona aproximada: ${districtLabel}` };
    return {
      query: "",
      formatted: "",
      approximateZone: coords.zone,
      lat: coords.lat,
      lng: coords.lng,
      propertyType: "Departamento",
      unit: "",
      reference: "",
      pinAdjusted: false
    };
  },
  suggestions(query: string, districtLabel: string) {
    const value = query.trim();
    if (!value) return [];
    return [`${value}, ${districtLabel}`, `Jr. ${value}, ${districtLabel}`, `Av. ${value}, ${districtLabel}`].slice(0, 3);
  },
  useCurrentLocation(address: ExactAddress, districtLabel: string): ExactAddress {
    return { ...address, query: `Ubicación actual en ${districtLabel}`, formatted: `Ubicación actual aproximada, ${districtLabel}`, pinAdjusted: true };
  },
  adjustPin(address: ExactAddress, direction: "north" | "south" | "east" | "west"): ExactAddress {
    const delta = 0.001;
    return {
      ...address,
      lat: address.lat + (direction === "north" ? delta : direction === "south" ? -delta : 0),
      lng: address.lng + (direction === "east" ? delta : direction === "west" ? -delta : 0),
      pinAdjusted: true
    };
  }
};
