"use client";

import { createContext, useContext } from "react";
import type { AuthIntent, AuthModalMode, OpenAuthModalOptions } from "../types/auth.types";
import type { AuthSession } from "../services/auth.service";

export type AuthModalContextValue = {
  isOpen: boolean;
  mode: AuthModalMode;
  returnTo: string;
  accountIntent: AuthIntent;
  pendingAction?: string;
  initialEmail: string;
  session: AuthSession | null;
  isBusy: boolean;
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthModalMode) => void;
  setAuthModalBusy: (busy: boolean) => void;
  completeAuth: (session: AuthSession, returnTo?: string) => void;
  signOut: () => Promise<void>;
};

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return context;
}
