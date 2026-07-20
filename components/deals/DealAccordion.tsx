import React, { useState } from "react";

export interface DealAccordionItem {
  id: string;
  title: string;
  content: string;
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
    <div className={`space-y-0 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="border-b border-gray-200 last:border-b-0">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-3 py-4 text-start min-h-11"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-primary-500">{item.title}</span>
              <svg
                className={`h-4 w-4 shrink-0 text-primary-500 transition-transform duration-200 ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && item.content ? (
              <div className="pb-4 text-sm leading-relaxed text-gray-500 whitespace-pre-line">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
