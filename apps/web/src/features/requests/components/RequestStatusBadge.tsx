import { Badge } from "@/components/ui/Badge";
import { requestStatusLabels } from "../state/request-machine";
import type { RequestStatus } from "../types/request.types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const tone = status === "selected" || status === "scheduled" || status === "in_service" || status === "completed" ? "success" : status === "cancelled" || status === "expired" ? "neutral" : "brand";
  return <Badge tone={tone}>{requestStatusLabels[status]}</Badge>;
}
