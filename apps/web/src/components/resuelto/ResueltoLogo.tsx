import Link from "next/link";

export function ResueltoLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className="inline-flex items-center gap-3" href="/" aria-label="Resuelto, inicio">
      <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-hidden="true" className="shrink-0">
        <rect width="40" height="40" rx="14" fill={inverted ? "#FFFFFF" : "#236A5B"} />
        <path
          d="M12.2 20.6 17.4 25.8 28.4 14.8"
          fill="none"
          stroke={inverted ? "#236A5B" : "#FFFFFF"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.2"
        />
        <path
          d="M29.5 24.6c-2.3 4.5-7.4 6.8-12.2 5.4"
          fill="none"
          stroke={inverted ? "#E6D72A" : "#98DBC6"}
          strokeLinecap="round"
          strokeWidth="2.3"
        />
      </svg>
      <span className={inverted ? "text-white" : "text-neutral-950"}>
        <span className="block font-display text-xl font-bold leading-none">Resuelto</span>
        <span className="hidden text-xs font-medium text-current opacity-80 sm:block">Servicios de confianza</span>
      </span>
    </Link>
  );
}
