import Image from "next/image";
import Link from "next/link";

export function ResueltoLogo({ inverted = false }: { inverted?: boolean }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const logoSrc = `${basePath}/${inverted ? "queda-logo.png" : "queda-logo-transparent.png"}`;

  return (
    <Link className="flex shrink-0 items-center border-0 bg-transparent p-0 shadow-none" href={`${basePath}/`} aria-label="queda, inicio">
      <Image
        src={logoSrc}
        alt="queda"
        width={430}
        height={155}
        className={inverted ? "block h-16 w-auto rounded-xl bg-white px-3 py-2 sm:h-20" : "block h-auto max-h-14 w-[150px] bg-transparent object-contain p-0 shadow-none sm:max-h-16 sm:w-[190px] lg:w-[205px]"}
      />
    </Link>
  );
}
