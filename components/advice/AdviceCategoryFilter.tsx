import type { AdviceCategory } from "../../types/advice";

export type AdviceCategoryFilter = AdviceCategory | "all";

interface AdviceCategoryFilterProps {
  activeCategory: AdviceCategoryFilter;
  onCategoryChange: (category: AdviceCategoryFilter) => void;
  labels: Record<AdviceCategoryFilter, string>;
}

const CATEGORY_ORDER: AdviceCategoryFilter[] = [
  "all",
  "savings",
  "deals",
  "shopping",
  "vouchers",
];

export default function AdviceCategoryFilter({
  activeCategory,
  onCategoryChange,
  labels,
}: AdviceCategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
      role="tablist"
      aria-label="Advice categories"
    >
      {CATEGORY_ORDER.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(category)}
            className={`shrink-0 min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-spring ${
              isActive
                ? "bg-primary-500 text-white shadow-soft"
                : "bg-white text-gray-600 border border-black/10 hover:border-primary-500/30 hover:text-primary-500"
            }`}
          >
            {labels[category]}
          </button>
        );
      })}
    </div>
  );
}
