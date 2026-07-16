"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Faq = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid gap-3">
      {items.map((faq, index) => {
        const open = openIndex === index;
        const contentId = `faq-panel-${index}`;
        return (
          <div key={faq.question} className="rounded-lg border border-neutral-200 bg-white shadow-xs">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg font-bold text-neutral-950 transition-colors duration-fast hover:bg-brand-100"
              aria-expanded={open}
              aria-controls={contentId}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              {faq.question}
              <ChevronDown aria-hidden="true" className={cn("h-5 w-5 shrink-0 text-brand-600 transition-transform duration-normal ease-standard", open ? "rotate-180" : "")} />
            </button>
            <div id={contentId} className={cn("grid overflow-hidden transition-[grid-template-rows] duration-normal ease-standard", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}> 
              <div className="min-h-0">
                <p className="px-5 pb-5 leading-7 text-neutral-600">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
