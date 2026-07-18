"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type CategoryGroup = {
  title: string;
  items: readonly string[];
};

const tones = [
  "bg-brand-100 text-brand-700 border-brand-200",
  "bg-action-100 text-neutral-950 border-action-500/30",
  "bg-pink-100 text-neutral-950 border-pink-500/30",
  "bg-white text-brand-700 border-brand-500/40"
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryExplorer({ groups }: { groups: readonly CategoryGroup[] }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [active, setActive] = useState(0);
  const activeGroup = groups[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
        {groups.map((group, index) => (
          <button
            key={group.title}
            type="button"
            className={cn(
              "flex min-h-[48px] min-w-fit items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left font-semibold transition-[background-color,border-color,color,transform] duration-fast ease-standard hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-brand-600/30 lg:w-full",
              active === index ? "border-brand-600 bg-brand-100 text-brand-700" : tones[index % tones.length]
            )}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>{group.title}</span>
            <ChevronRight aria-hidden="true" className={cn("h-4 w-4 transition-transform duration-fast", active === index ? "rotate-90" : "")} />
          </button>
        ))}
      </div>
      <Card className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-600">Categoria seleccionada</p>
            <h3 className="mt-1 font-display text-3xl font-bold text-neutral-950">{activeGroup.title}</h3>
          </div>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">{activeGroup.items.length} servicios</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeGroup.items.map((item) => (
            <a
              key={item}
              href={`${basePath}/resultados/?servicio=${slugify(item)}&distrito=miraflores`}
              className="group flex min-h-[52px] items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition-[border-color,background-color,color,transform] duration-fast ease-standard hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-100 hover:text-brand-700"
            >
              {item}
              <ChevronRight aria-hidden="true" className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
