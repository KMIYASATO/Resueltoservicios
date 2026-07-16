import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resuelto | Servicios de confianza, cuando los necesitas",
  description: "Encuentra, compara y reserva profesionales confiables para servicios a domicilio en Lima.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-PE">
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}
