import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DealType } from "../../types/deals";
import { useCategories } from "../../hooks/useCategories";
import { SHOP_HEADER_STYLE } from "../../utils/shopHeaderStyle";

export interface FilterState {
  dealType: DealType | "all";
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  locations: string[];
}

export interface FilterComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  isMobile?: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  dealType: "all",
  priceRange: { min: 0, max: 10000 },
  categories: [],
  locations: [],
};

const FALLBACK_CATEGORIES = [
  "Fashion",
  "Electronics",
  "Home & Kitchen",
  "Health & Beauty",
  "Sports & Outdoors",
  "Automotive",
  "Grocery",
];

const LOCATIONS = [
  "All KSA",
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Mecca",
  "Medina",
  "Khobar",
  "Major Cities",
];

function mergeFilters(partial: Partial<FilterState> = {}): FilterState {
  return {
    ...DEFAULT_FILTERS,
    ...partial,
    priceRange: {
      ...DEFAULT_FILTERS.priceRange,
      ...partial.priceRange,
    },
  };
}

export default function FilterComponent({
  isOpen = true,
  onClose,
  onFilterChange,
  initialFilters = {},
  isMobile = false,
}: FilterComponentProps) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";

  const [filters, setFilters] = useState<FilterState>(() => mergeFilters(initialFilters));
  const [draftFilters, setDraftFilters] = useState<FilterState>(() => mergeFilters(initialFilters));
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const wasMobileFilterOpen = useRef(false);

  const { categories: liveCategories, isLoading: categoriesLoading, error: categoriesError } =
    useCategories();

  const CATEGORIES =
    !categoriesLoading && (categoriesError || liveCategories.length === 0)
      ? FALLBACK_CATEGORIES
      : liveCategories.map((category) => (isRTL ? category.name_ar : category.name_en));

  const DEAL_TYPES: { value: FilterState["dealType"]; label: string }[] = [
    { value: "all", label: t("filters.all", { defaultValue: "All" }) },
    { value: "cold", label: t("filters.coldDeals", { defaultValue: "Cold deals" }) },
    { value: "original", label: t("filters.originalDeals", { defaultValue: "Original deals" }) },
    { value: "voucher", label: t("filters.vouchers", { defaultValue: "Vouchers" }) },
  ];

  useEffect(() => {
    if (isMobile && isOpen && !wasMobileFilterOpen.current) {
      setDraftFilters(mergeFilters(initialFilters));
      setCategoryDropdownOpen(false);
      setLocationDropdownOpen(false);
    }
    wasMobileFilterOpen.current = Boolean(isMobile && isOpen);
  }, [isMobile, isOpen, initialFilters]);

  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        categoryDropdownOpen &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setCategoryDropdownOpen(false);
      }

      if (
        locationDropdownOpen &&
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(target)
      ) {
        setLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, categoryDropdownOpen, locationDropdownOpen]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange, isMobile]);

  const updateDesktopFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateDraftFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (
    category: string,
    target: FilterState,
    update: (next: FilterState) => void
  ) => {
    const newCategories = target.categories.includes(category)
      ? target.categories.filter((c) => c !== category)
      : [...target.categories, category];
    update({ ...target, categories: newCategories });
  };

  const handleLocationToggle = (
    location: string,
    target: FilterState,
    update: (next: FilterState) => void
  ) => {
    const newLocations = target.locations.includes(location)
      ? target.locations.filter((l) => l !== location)
      : [...target.locations, location];
    update({ ...target, locations: newLocations });
  };

  const clearAllFilters = () => {
    const cleared = mergeFilters();
    if (isMobile) {
      setDraftFilters(cleared);
    } else {
      setFilters(cleared);
    }
  };

  const applyMobileFilters = () => {
    onFilterChange(draftFilters);
    onClose?.();
  };

  const renderPriceRangeSlider = (
    target: FilterState,
    updateRange: (range: FilterState["priceRange"]) => void
  ) => (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-primary-500 block">
        {t("deals.priceRange")}
      </label>
      <div className="relative h-6 flex items-center pt-1">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={target.priceRange.min}
          onChange={(e) =>
            updateRange({
              ...target.priceRange,
              min: Math.min(parseInt(e.target.value, 10), target.priceRange.max - 50),
            })
          }
          className={`absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb-min z-30 ${
            isRTL ? "scale-x-[-1]" : ""
          }`}
        />
        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={target.priceRange.max}
          onChange={(e) =>
            updateRange({
              ...target.priceRange,
              max: Math.max(parseInt(e.target.value, 10), target.priceRange.min + 50),
            })
          }
          className={`absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb-max z-40 ${
            isRTL ? "scale-x-[-1]" : ""
          }`}
        />
      </div>
      <div className="flex justify-between text-sm text-[#808080]">
        <span>
          {t("filters.from", { defaultValue: "From" })}: {target.priceRange.min}
        </span>
        <span>
          {t("filters.to", { defaultValue: "To" })}: {target.priceRange.max}
        </span>
      </div>
    </div>
  );

  const renderDropdown = (
    title: string,
    placeholder: string,
    items: string[],
    selectedItems: string[],
    isDropdownOpen: boolean,
    onToggle: () => void,
    onItemToggle: (item: string) => void,
    options: {
      compact?: boolean;
      dropdownRef?: React.RefObject<HTMLDivElement | null>;
    } = {}
  ) => {
    const { compact = false, dropdownRef } = options;
    const listPanel = isDropdownOpen ? (
      <div
        className={
          compact
            ? "mt-2 bg-white border border-gray-100 rounded-2xl shadow-soft-lg max-h-60 overflow-auto"
            : "absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-soft-lg max-h-60 overflow-auto"
        }
      >
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center min-h-11 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 me-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => onItemToggle(item)}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-md border-2 border-gray-300 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-colors duration-200 ease-spring" />
              <svg
                className="relative w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm text-gray-900">{item}</span>
          </label>
        ))}
      </div>
    ) : null;

    return (
      <div className="space-y-3">
        <label className="text-sm font-semibold text-primary-500 block">{title}</label>
        <div className={`relative ${compact ? "" : ""}`} ref={dropdownRef}>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isDropdownOpen}
            className={`w-full min-h-12 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-sm transition-all flex items-center justify-between ${
              compact ? "text-[#808080]" : ""
            }`}
          >
            <span className={`block truncate ${selectedItems.length > 0 ? "text-gray-900" : "text-[#808080]"}`}>
              {selectedItems.length > 0 ? selectedItems.join(", ") : placeholder}
            </span>
            <svg
              className={`w-5 h-5 text-[#808080] shrink-0 ms-2 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {listPanel}
        </div>
      </div>
    );
  };

  const renderTypePills = (
    target: FilterState,
    onTypeChange: (dealType: FilterState["dealType"]) => void
  ) => (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-primary-500 block">
        {t("filters.type", { defaultValue: "Type" })}
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DEAL_TYPES.map((type) => {
          const isActive = target.dealType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onTypeChange(type.value)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors min-h-11 ${
                isActive
                  ? "bg-primary-500 text-white"
                  : "bg-white text-primary-500 border border-primary-500/20"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDesktopDealTypes = () => (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 block">{t("filters.type", { defaultValue: "Type" })}</label>
      <div className="space-y-2">
        {DEAL_TYPES.map((type) => (
          <label key={type.value} className="flex items-center min-h-11 cursor-pointer group">
            <span className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 me-3">
              <input
                type="radio"
                value={type.value}
                checked={filters.dealType === type.value}
                onChange={(e) =>
                  updateDesktopFilter("dealType", e.target.value as FilterState["dealType"])
                }
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full border-2 border-gray-300 peer-checked:border-primary-500 transition-colors duration-200 ease-spring" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500 scale-0 peer-checked:scale-100 transition-transform duration-200 ease-spring" />
            </span>
            <span className="text-sm text-gray-900 group-has-checked:text-primary-500 group-has-checked:font-medium transition-colors duration-200">
              {type.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const desktopContent = (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-primary-500">
          {t("filters.title", { defaultValue: "Filters" })}
        </h3>
      </div>

      {renderDesktopDealTypes()}
      {renderPriceRangeSlider(filters, (priceRange) => updateDesktopFilter("priceRange", priceRange))}
      {renderDropdown(
        isRTL ? "الفئات" : "Categories",
        isRTL ? "اختر الفئات" : "Choose Categories",
        CATEGORIES,
        filters.categories,
        categoryDropdownOpen,
        () => {
          setLocationDropdownOpen(false);
          setCategoryDropdownOpen((open) => !open);
        },
        (item) =>
          handleCategoryToggle(item, filters, (next) => setFilters(next)),
        { dropdownRef: categoryDropdownRef }
      )}
      {renderDropdown(
        isRTL ? "المواقع" : "Locations",
        isRTL ? "اختر المدينة" : "Choose City",
        LOCATIONS,
        filters.locations,
        locationDropdownOpen,
        () => {
          setCategoryDropdownOpen(false);
          setLocationDropdownOpen((open) => !open);
        },
        (item) =>
          handleLocationToggle(item, filters, (next) => setFilters(next)),
        { dropdownRef: locationDropdownRef }
      )}

      <button
        type="button"
        onClick={clearAllFilters}
        className="w-full min-h-11 px-4 py-2 text-sm font-medium text-primary-500 border border-primary-500/30 rounded-full hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-colors duration-200 ease-spring"
      >
        {t("filters.clearAll", { defaultValue: "Clear All" })}
      </button>
    </div>
  );

  const mobileContent = (
    <div className="flex flex-col h-full" dir={isRTL ? "rtl" : "ltr"}>
      <header
        className="relative shrink-0 rounded-b-[28px] px-4 pt-8 pb-7"
        style={SHOP_HEADER_STYLE}
      >
        <div className="flex items-center justify-between min-h-14">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("filters.back", { defaultValue: "Back" })}
            className="flex items-center justify-center w-11 h-11 -ms-2 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-white">
            {t("filters.title", { defaultValue: "Filter" })}
          </h1>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-white/95 hover:text-white px-2 min-h-11"
          >
            {t("filters.clearAll", { defaultValue: "Clear All" })}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {renderTypePills(draftFilters, (dealType) => updateDraftFilter("dealType", dealType))}
        {renderPriceRangeSlider(draftFilters, (priceRange) =>
          updateDraftFilter("priceRange", priceRange)
        )}
        {renderDropdown(
          t("filters.categories", { defaultValue: "Categories" }),
          t("filters.chooseCategories", { defaultValue: "Choose Categories" }),
          CATEGORIES,
          draftFilters.categories,
          categoryDropdownOpen,
          () => {
            setLocationDropdownOpen(false);
            setCategoryDropdownOpen((open) => !open);
          },
          (item) =>
            handleCategoryToggle(item, draftFilters, (next) => setDraftFilters(next)),
          { compact: true }
        )}
        {renderDropdown(
          t("filters.locations", { defaultValue: "Locations" }),
          t("filters.chooseCity", { defaultValue: "Choose City" }),
          LOCATIONS,
          draftFilters.locations,
          locationDropdownOpen,
          () => {
            setCategoryDropdownOpen(false);
            setLocationDropdownOpen((open) => !open);
          },
          (item) =>
            handleLocationToggle(item, draftFilters, (next) => setDraftFilters(next)),
          { compact: true }
        )}
      </div>

      <div className="shrink-0 px-4 pb-6 pt-2 bg-white">
        <button
          type="button"
          onClick={applyMobileFilters}
          className="w-full min-h-14 rounded-full bg-primary-500 text-white text-base font-semibold hover:bg-primary-500/90 transition-colors"
        >
          {t("filters.apply", { defaultValue: "Apply" })}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-[100] bg-white transform transition-transform duration-300 ease-spring ${
          isOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
      >
        {mobileContent}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft-lg" dir={isRTL ? "rtl" : "ltr"}>
      {desktopContent}
    </div>
  );
}
