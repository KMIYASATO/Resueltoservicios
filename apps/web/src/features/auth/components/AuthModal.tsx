"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { AuthMode } from "../types/auth.types";
import { useAuthModal } from "../hooks/useAuthModal";
import { AuthModalHeader } from "./AuthModalHeader";
import { AuthModeSwitcher } from "./AuthModeSwitcher";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export function AuthModal() {
  const { isOpen, mode, closeAuthModal, setAuthMode, isBusy, initialEmail } = useAuthModal();
  const [present, setPresent] = useState(isOpen);
  const [email, setEmail] = useState(initialEmail);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPresent(true);
      setEmail(initialEmail);
      window.setTimeout(() => {
        const initial = dialogRef.current?.querySelector<HTMLElement>("[data-auth-initial]");
        initial?.focus();
      }, 0);
      return;
    }

    const timeout = window.setTimeout(() => setPresent(false), 180);
    return () => window.clearTimeout(timeout);
  }, [initialEmail, isOpen, mode]);

  useEffect(() => {
    if (!present || !isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!isBusy) closeAuthModal();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAuthModal, isBusy, isOpen, present]);

  function changeMode(nextMode: AuthMode) {
    setAuthMode(nextMode);
  }

  if (!present) return null;

  const stateClass = isOpen ? "opacity-100" : "opacity-0";
  const panelClass = isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0";

  return (
    <div
      className={cn("fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-brand-700/35 p-3 backdrop-blur-[3px] transition-opacity duration-normal ease-standard sm:p-4", stateClass)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) closeAuthModal();
      }}
    >
      <div
        ref={dialogRef}
        className={cn("relative max-h-[calc(100dvh-24px)] w-[min(420px,calc(100vw-24px))] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-5 shadow-lg transition-[opacity,transform] duration-normal ease-standard sm:w-[min(420px,calc(100vw-32px))] sm:p-8", panelClass)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        tabIndex={-1}
      >
        <button
          className="absolute right-3 top-3 grid min-h-[44px] min-w-[44px] place-items-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          type="button"
          aria-label="Cerrar"
          disabled={isBusy}
          onClick={closeAuthModal}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <AuthModalHeader mode={mode} />

        {mode === "forgot-password" ? null : (
          <div className="mt-5">
            <AuthModeSwitcher mode={mode} onModeChange={changeMode} />
          </div>
        )}

        {mode === "login" ? <LoginForm key="login" email={email} onEmailChange={setEmail} /> : null}
        {mode === "register" ? <RegisterForm key="register" email={email} onEmailChange={setEmail} /> : null}
        {mode === "forgot-password" ? <ForgotPasswordForm key="forgot-password" email={email} onEmailChange={setEmail} /> : null}
      </div>
    </div>
  );
}
