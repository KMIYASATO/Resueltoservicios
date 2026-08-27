"use client";

import { Crosshair, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mockAddressService } from "../services/mock-address.service";
import type { ExactAddress } from "../types/request.types";

export function AddressMapPicker({ address, districtLabel, onChange }: { address: ExactAddress; districtLabel: string; onChange: (address: ExactAddress) => void }) {
  const suggestions = mockAddressService.suggestions(address.query, districtLabel);
  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm font-semibold text-neutral-700">Dirección exacta<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base text-neutral-950" placeholder="Busca calle, avenida o referencia" value={address.query} onChange={(event) => onChange({ ...address, query: event.target.value })} /></label>
      {suggestions.length ? <div className="grid gap-2 rounded-xl border border-neutral-200 bg-white p-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-neutral-700 hover:bg-brand-100" onClick={() => onChange({ ...address, query: suggestion, formatted: suggestion })}>{suggestion}</button>)}</div> : null}
      <Button type="button" variant="secondary" onClick={() => onChange(mockAddressService.useCurrentLocation(address, districtLabel))}><Crosshair className="h-4 w-4" /> Usar ubicación actual</Button>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-[linear-gradient(135deg,#E4F5EF_25%,transparent_25%),linear-gradient(225deg,#E4F5EF_25%,transparent_25%),linear-gradient(45deg,#F7FBFA_25%,transparent_25%),linear-gradient(315deg,#F7FBFA_25%,#fff_25%)] bg-[length:32px_32px] p-5">
        <div className="mx-auto grid h-44 max-w-sm place-items-center rounded-2xl bg-white/75 shadow-sm ring-1 ring-neutral-200">
          <div className="grid place-items-center text-center"><MapPin className="h-9 w-9 text-brand-700" /><p className="mt-2 text-sm font-semibold text-neutral-950">Pin ajustable mock</p><p className="text-xs text-neutral-600">{address.approximateZone}</p></div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">{(["north", "south", "west", "east"] as const).map((direction) => <button key={direction} type="button" className="rounded-md bg-white px-2 py-2 text-xs font-semibold text-brand-700 ring-1 ring-neutral-200" onClick={() => onChange(mockAddressService.adjustPin(address, direction))}>{direction}</button>)}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">{(["Casa", "Departamento", "Local"] as const).map((type) => <button key={type} type="button" className={cn("rounded-md border px-3 py-3 text-sm font-semibold", address.propertyType === type ? "border-brand-600 bg-brand-100 text-brand-700" : "border-neutral-200 text-neutral-700")} onClick={() => onChange({ ...address, propertyType: type })}>{type}</button>)}</div>
      <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-neutral-700">Unidad / piso<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base" value={address.unit} onChange={(event) => onChange({ ...address, unit: event.target.value })} /></label><label className="grid gap-2 text-sm font-semibold text-neutral-700">Referencia<input className="min-h-12 rounded-md border border-neutral-200 px-3 text-base" value={address.reference} onChange={(event) => onChange({ ...address, reference: event.target.value })} /></label></div>
      <p className="rounded-xl bg-neutral-50 p-3 text-sm font-semibold text-neutral-600">Tu dirección exacta, unidad, referencia y pin no se renderizan para oferentes antes de elegir una propuesta.</p>
    </div>
  );
}
