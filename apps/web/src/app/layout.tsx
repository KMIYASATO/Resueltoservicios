import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaRegistration } from "@/components/resuelto/PwaRegistration";
import { AuthModalProvider } from "@/features/auth/components/AuthModalProvider";
import { RequestFlowProvider } from "@/features/requests/components/RequestFlowProvider";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Queda | Servicios de confianza, cuando los necesitas",
  description: "Busca por servicio y distrito, revisa opciones y envía tu solicitud en Lima.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    title: "Queda",
    statusBarStyle: "default"
  },
  icons: {
    icon: [
      { url: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png" }
    ],
    apple: `${basePath}/icons/apple-touch-icon.png`
  }
};

export const viewport: Viewport = {
  themeColor: "#236A5B"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-PE">
      <body>
        <AuthModalProvider>
          <RequestFlowProvider>
            <a className="skip-link" href="#contenido">Saltar al contenido</a>
            {children}
            <PwaRegistration />
          </RequestFlowProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
