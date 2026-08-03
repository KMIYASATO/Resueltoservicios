"use client";

import { Facebook } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { providerLabel } from "../services/auth.service";
import type { AuthProvider } from "../types/auth.types";

type SocialAuthButtonsProps = {
  loadingProvider: AuthProvider | null;
  onProvider: (provider: AuthProvider) => void;
};

function GoogleMark() {
  return <span className="font-display text-base font-bold" aria-hidden="true">G</span>;
}

export function SocialAuthButtons({ loadingProvider, onProvider }: SocialAuthButtonsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(["google", "facebook"] as const).map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="secondary"
          className="w-full"
          loading={loadingProvider === provider}
          disabled={loadingProvider !== null && loadingProvider !== provider}
          onClick={() => onProvider(provider)}
        >
          {provider === "google" ? <GoogleMark /> : <Facebook className="h-4 w-4" aria-hidden="true" />}
          Continuar con {providerLabel(provider)}
        </Button>
      ))}
    </div>
  );
}
