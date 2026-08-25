"use client";

import { useSearchParams } from "next/navigation";
import { RequestsContent } from "@/features/requests/components/RequestsContent";

export function RequestsRouteContent() {
  const searchParams = useSearchParams();
  return <RequestsContent selectedId={searchParams.get("id")} />;
}
