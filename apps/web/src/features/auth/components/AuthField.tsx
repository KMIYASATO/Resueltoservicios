import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  rightSlot?: ReactNode;
};

export function AuthField({ id, label, error, className, inputRef, rightSlot, ...props }: AuthFieldProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-800" htmlFor={id}>{label}</label>
      <div className="relative mt-2">
        <input
          ref={inputRef}
          id={id}
          className={cn(
            "min-h-[46px] w-full rounded-md border bg-white px-3 py-2 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100",
            rightSlot ? "pr-12" : undefined,
            error ? "border-red-500 focus:border-red-600 focus:ring-red-100" : "border-neutral-300",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {rightSlot ? <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightSlot}</div> : null}
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-red-700" id={errorId}>{error}</p> : null}
    </div>
  );
}
