"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sanitizeIntent, sanitizeReturnTo } from "../validation/auth.validation";
import type { AuthIntent, AuthModalMode, OpenAuthModalOptions } from "../types/auth.types";
import type { AuthSession } from "../services/auth.service";
import { demoAuthService } from "../services/demo-auth.service";
import { AuthModalContext } from "../hooks/useAuthModal";
import { AuthModal } from "./AuthModal";

type AuthModalState = {
  isOpen: boolean;
  mode: AuthModalMode;
  returnTo: string;
  accountIntent: AuthIntent;
  pendingAction?: string;
  initialEmail: string;
};

const defaultState: AuthModalState = {
  isOpen: false,
  mode: "login",
  returnTo: "/",
  accountIntent: "customer",
  initialEmail: ""
};

function normalizeMode(value: string | null | undefined): AuthModalMode {
  if (value === "register" || value === "forgot-password") return value;
  return "login";
}

function removeAuthParams(url: URL) {
  url.searchParams.delete("auth");
  url.searchParams.delete("intent");
  url.searchParams.delete("returnTo");
  url.searchParams.delete("pendingAction");
  url.searchParams.delete("email");
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthModalState>(defaultState);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const syncUrl = useCallback((mode: AuthModalMode, options: OpenAuthModalOptions = {}, method: "push" | "replace" = "push") => {
    const url = new URL(window.location.href);
    removeAuthParams(url);
    url.searchParams.set("auth", mode);
    if (options.accountIntent === "professional") url.searchParams.set("intent", "professional");
    if (options.returnTo && sanitizeReturnTo(options.returnTo) !== "/") url.searchParams.set("returnTo", sanitizeReturnTo(options.returnTo));
    if (options.pendingAction) url.searchParams.set("pendingAction", options.pendingAction);
    if (options.email?.trim()) url.searchParams.set("email", options.email.trim());
    window.history[method === "push" ? "pushState" : "replaceState"]({}, "", url);
  }, []);

  const openAuthModal = useCallback((options: OpenAuthModalOptions = {}) => {
    const mode = normalizeMode(options.mode);
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) triggerRef.current = activeElement;
    window.dispatchEvent(new Event("queda:auth-modal-open"));
    setState({
      isOpen: true,
      mode,
      returnTo: sanitizeReturnTo(options.returnTo ?? "/"),
      accountIntent: sanitizeIntent(options.accountIntent ?? "customer"),
      pendingAction: options.pendingAction,
      initialEmail: options.email ?? ""
    });
    syncUrl(mode, options, "push");
  }, [syncUrl]);

  const closeAuthModal = useCallback(() => {
    if (isBusy) return;
    setState((current) => ({ ...current, isOpen: false }));
    const url = new URL(window.location.href);
    removeAuthParams(url);
    window.history.replaceState({}, "", url);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, [isBusy]);

  const completeAuth = useCallback((nextSession: AuthSession) => {
    setSession(nextSession);
    setIsBusy(false);
    setState((current) => ({ ...current, isOpen: false }));

    const url = new URL(window.location.href);
    removeAuthParams(url);
    window.history.replaceState({}, "", url);

    const target = sanitizeReturnTo(state.returnTo);
    if (target !== "/") window.location.assign(target);
  }, [state.returnTo]);

  const signOut = useCallback(async () => {
    setIsBusy(true);
    await demoAuthService.signOut();
    setSession(null);
    setIsBusy(false);
  }, []);

  const setAuthMode = useCallback((mode: AuthModalMode) => {
    setState((current) => {
      const next = { ...current, mode, isOpen: true };
      syncUrl(mode, { accountIntent: next.accountIntent, returnTo: next.returnTo, pendingAction: next.pendingAction, email: next.initialEmail }, "replace");
      return next;
    });
  }, [syncUrl]);

  useEffect(() => {
    function openFromCurrentUrl() {
      const url = new URL(window.location.href);
      const authParam = url.searchParams.get("auth");
      if (!authParam) {
        setState((current) => ({ ...current, isOpen: false }));
        return;
      }

      setState({
        isOpen: true,
        mode: normalizeMode(authParam),
        returnTo: sanitizeReturnTo(url.searchParams.get("returnTo")),
        accountIntent: sanitizeIntent(url.searchParams.get("intent")),
        pendingAction: url.searchParams.get("pendingAction") ?? undefined,
        initialEmail: url.searchParams.get("email") ?? ""
      });
    }

    openFromCurrentUrl();
    window.addEventListener("popstate", openFromCurrentUrl);
    return () => window.removeEventListener("popstate", openFromCurrentUrl);
  }, []);

  useEffect(() => {
    let mounted = true;
    demoAuthService.getSession().then((currentSession) => {
      if (mounted) setSession(currentSession);
    });

    function handleSessionChange(event: Event) {
      setSession((event as CustomEvent<AuthSession | null>).detail ?? null);
    }

    window.addEventListener("queda:auth-session-changed", handleSessionChange);
    return () => {
      mounted = false;
      window.removeEventListener("queda:auth-session-changed", handleSessionChange);
    };
  }, []);

  useEffect(() => {
    if (!state.isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [state.isOpen]);

  const value = useMemo(() => ({
    ...state,
    session,
    isBusy,
    openAuthModal,
    closeAuthModal,
    setAuthMode,
    setAuthModalBusy: setIsBusy,
    completeAuth,
    signOut
  }), [closeAuthModal, completeAuth, isBusy, openAuthModal, session, setAuthMode, signOut, state]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}
