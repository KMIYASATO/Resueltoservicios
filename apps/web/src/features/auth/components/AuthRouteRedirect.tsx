"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { AuthModalMode } from "../types/auth.types";

export function AuthRouteRedirect({ mode }: { mode: AuthModalMode }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", mode);
    if (params.get("accountIntent") === "professional") {
      params.set("intent", "professional");
      params.delete("accountIntent");
    }
    window.location.replace(`${basePath}/?${params.toString()}`);
  }, [mode, searchParams]);

  return null;
}
