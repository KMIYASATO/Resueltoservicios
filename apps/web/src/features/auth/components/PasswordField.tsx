"use client";

import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes, Ref } from "react";
import { useState } from "react";
import { AuthField } from "./AuthField";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export function PasswordField({ label, error, inputRef, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <AuthField
      label={label}
      error={error}
      inputRef={inputRef}
      type={visible ? "text" : "password"}
      rightSlot={(
        <button
          className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-brand-100 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          type="button"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setVisible((value) => !value)}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      {...props}
    />
  );
}
