import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return {
    name: "Resuelto",
    short_name: "Resuelto",
    description: "Encuentra y reserva profesionales confiables para servicios a domicilio.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#F7FBFA",
    theme_color: "#236A5B",
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
