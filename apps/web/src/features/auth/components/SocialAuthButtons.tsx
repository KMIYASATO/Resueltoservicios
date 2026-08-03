"use client";

import type { AuthProvider } from "../types/auth.types";

type SocialAuthButtonsProps = {
  loadingProvider: AuthProvider | null;
  onProvider: (provider: AuthProvider) => void;
};

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.24 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
      <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      <path fill="#FFFFFF" d="m16.671 15.563.532-3.49h-3.328V9.806c0-.956.465-1.887 1.956-1.887h1.513v-2.97s-1.374-.236-2.686-.236c-2.741 0-4.533 1.672-4.533 4.697v2.663H7.078v3.49h3.047V24a12.13 12.13 0 0 0 3.75 0v-8.437h2.796z" />
    </svg>
  );
}

export function SocialAuthButtons({ loadingProvider, onProvider }: SocialAuthButtonsProps) {
  return (
    <div className="grid gap-3">
      {(["google", "facebook"] as const).map((provider) => (
        <button
          key={provider}
          type="button"
          className="relative inline-flex h-[50px] w-full items-center justify-center rounded-md border border-neutral-200 bg-white px-4 text-sm font-semibold text-brand-700 transition-colors duration-fast hover:border-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:text-neutral-400"
          aria-busy={loadingProvider === provider || undefined}
          disabled={loadingProvider !== null && loadingProvider !== provider}
          data-auth-initial={provider === "google" ? true : undefined}
          onClick={() => onProvider(provider)}
        >
          <span className="absolute left-4 inline-flex h-5 w-5 items-center justify-center">
            {loadingProvider === provider ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
            {loadingProvider !== provider && provider === "google" ? <GoogleIcon /> : null}
            {loadingProvider !== provider && provider === "facebook" ? <FacebookIcon /> : null}
          </span>
          <span>{provider === "google" ? "Continuar con Google" : "Continuar con Facebook"}</span>
        </button>
      ))}
    </div>
  );
}
