import { useRef, useState } from "react";
import type { FieldErrors } from "../types/auth.types";

export function useAuthForm<T extends object>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const fieldRefs = useRef<Partial<Record<keyof T, HTMLElement | null>>>({});

  function update<K extends keyof T>(key: K, value: T[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function markTouched<K extends keyof T>(key: K) {
    setTouched((current) => ({ ...current, [key]: true }));
  }

  function registerField<K extends keyof T>(key: K) {
    return (node: HTMLElement | null) => {
      fieldRefs.current[key] = node;
    };
  }

  function focusFirstError(nextErrors: FieldErrors<T>) {
    const firstKey = Object.keys(nextErrors).find((key) => nextErrors[key as keyof T]) as keyof T | undefined;
    if (firstKey) fieldRefs.current[firstKey]?.focus();
  }

  return { values, setValues, errors, setErrors, touched, update, markTouched, registerField, focusFirstError };
}
