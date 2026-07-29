import React, { useState } from "react";

export interface DealAccordionItem {
  id: string;
  title: string;
  content: string;
  subtitle?: string;
}

interface DealAccordionProps {
  items: DealAccordionItem[];
  className?: string;
  defaultOpenIds?: string[];
}

export default function DealAccordion({
  items,
  className = "",
  defaultOpenIds = [],
}: DealAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-start justify-between gap-3 py-4 text-start min-h-11"
              aria-expanded={isOpen}
            >
              <div className="min-w-0 flex-1">
                <span className="block text-base font-bold text-primary-500 leading-tight">
                  {item.title}
                </span>
                {isOpen && item.subtitle ? (
                  <span className="mt-1 block text-sm font-normal text-[#808080] leading-snug">
                    {item.subtitle}
                  </span>
                ) : null}
              </div>
              <svg
                className={`mt-1 h-4 w-4 shrink-0 text-primary-500 transition-transform duration-200 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {isOpen && item.content && item.content !== item.subtitle ? (
              <div className="pb-4 text-sm leading-relaxed text-[#808080] whitespace-pre-line">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
