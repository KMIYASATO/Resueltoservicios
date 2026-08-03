import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { AlertCircle } from "lucide-react";
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
      <label className="block text-sm font-semibold text-brand-700" htmlFor={id}>{label}</label>
      <div className="relative mt-2">
        <input
          ref={inputRef}
          id={id}
          className={cn(
            "min-h-[48px] w-full rounded-md border bg-white px-4 py-2 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15",
            rightSlot ? "pr-12" : undefined,
            error ? "border-error-600 focus:border-error-600 focus:ring-error-100" : "border-neutral-200",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {rightSlot ? <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightSlot}</div> : null}
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-error-600" id={errorId}>
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
