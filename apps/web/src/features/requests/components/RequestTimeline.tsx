import { CheckCircle2 } from "lucide-react";
import type { TimelineEvent } from "../types/request.types";
import { formatEventTime } from "../utils/format";

export function RequestTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="grid gap-3">
      {events.map((event) => (
        <div key={event.id} className="grid grid-cols-[auto_1fr] gap-3">
          <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-brand-700"><CheckCircle2 className="h-4 w-4" /></div>
          <div>
            <p className="text-xs font-semibold text-neutral-500">{formatEventTime(event.at)}</p>
            <p className="text-sm font-semibold text-neutral-950">{event.title}</p>
            {event.text ? <p className="text-sm leading-6 text-neutral-600">{event.text}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
