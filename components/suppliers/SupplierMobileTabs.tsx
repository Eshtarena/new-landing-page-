import React from "react";

export interface SupplierMobileTab {
  id: string;
  label: string;
}

interface SupplierMobileTabsProps {
  tabs: SupplierMobileTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  ariaLabel: string;
  className?: string;
}

export default function SupplierMobileTabs({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className = "",
}: SupplierMobileTabsProps) {
  return (
    <nav
      className={`flex overflow-x-auto -mx-1 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className="flex shrink-0 flex-col items-center px-4 pt-3 pb-2 min-h-11"
          >
            <span
              className={`text-sm whitespace-nowrap transition-colors ${
                isActive ? "font-medium text-white" : "font-normal text-white/60"
              }`}
            >
              {tab.label}
            </span>
            <span
              className={`mt-2 h-[3px] rounded-full bg-white transition-all duration-200 ${
                isActive ? "w-5 opacity-100" : "w-0 opacity-0"
              }`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </nav>
  );
}
