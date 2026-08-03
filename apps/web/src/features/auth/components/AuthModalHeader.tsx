import Image from "next/image";
import type { AuthModalMode } from "../types/auth.types";

const copy: Record<AuthModalMode, { title: string; description: string }> = {
  login: {
    title: "Ingresa a Queda",
    description: "Accede a tus solicitudes y servicios."
  },
  register: {
    title: "Crea tu cuenta",
    description: "Regístrate para solicitar o brindar servicios."
  },
  "forgot-password": {
    title: "Recupera tu contraseña",
    description: "Ingresa tu correo y te enviaremos instrucciones."
  }
};

export function AuthModalHeader({ mode }: { mode: AuthModalMode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const content = copy[mode];

  return (
    <div>
      <Image src={`${basePath}/queda-logo-transparent.png`} alt="Queda" width={122} height={44} className="h-8 w-auto object-contain" priority />
      <h2 className="mt-5 font-display text-2xl font-bold tracking-[-0.03em] text-brand-700" id="auth-modal-title">{content.title}</h2>
      <p className="mt-1 text-sm leading-6 text-neutral-600" id="auth-modal-description">{content.description}</p>
    </div>
  );
}
