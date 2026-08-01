import Image from "next/image";
import Link from "next/link";

export function ResueltoLogo({ inverted = false }: { inverted?: boolean }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const logoSrc = `${basePath}/queda-logo.png`;

  return (
    <Link className="inline-flex shrink-0 items-center" href={`${basePath}/`} aria-label="Queda, inicio">
      <Image
        src={logoSrc}
        alt="Queda"
        width={430}
        height={155}
        className={inverted ? "h-16 w-auto rounded-xl bg-white px-3 py-2 sm:h-20" : "h-14 w-auto sm:h-16 lg:h-[72px]"}
      />
    </Link>
  );
}
