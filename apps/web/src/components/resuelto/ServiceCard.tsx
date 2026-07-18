import Link from "next/link";
import { Droplets, KeyRound, Leaf, Paintbrush, Sparkles, Truck, Wrench, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";

const icons = {
  Droplets,
  KeyRound,
  Leaf,
  Paintbrush,
  Sparkles,
  Truck,
  Wrench,
  Zap
};

type ServiceIcon = keyof typeof icons;

export function ServiceCard({
  name,
  slug,
  description,
  price,
  icon
}: {
  name: string;
  slug: string;
  description: string;
  price: string;
  icon: ServiceIcon;
}) {
  const Icon = icons[icon];

  return (
    <Link href={`/resultados/?servicio=${slug}&distrito=miraflores`} className="group block rounded-lg focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-600/35">
      <Card className="overflow-hidden p-0 transition-[border-color,box-shadow,transform] duration-normal ease-standard group-hover:-translate-y-0.5 group-hover:border-brand-500 group-hover:shadow-md group-active:scale-[0.98]">
      <div className="relative h-32 bg-gradient-to-br from-brand-100 via-white to-pink-100 p-5">
        <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
          <Icon aria-hidden="true" className="h-7 w-7" />
        </div>
        <div className="absolute bottom-4 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-xs">
          {price}
        </div>
      </div>
      <div className="grid gap-3 p-5">
        <h3 className="font-display text-xl font-bold text-neutral-950">{name}</h3>
        <p className="text-sm leading-6 text-neutral-600">{description}</p>
        <span className="text-sm font-semibold text-brand-600 group-hover:text-brand-700">Ver profesionales</span>
      </div>
      </Card>
    </Link>
  );
}
