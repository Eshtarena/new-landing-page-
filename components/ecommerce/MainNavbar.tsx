import React from "react";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";
import LanguageSwitcher from "../landingpage/LanguageSwitcher";
import { SHOP_HEADER_STYLE } from "../../utils/shopHeaderStyle";

interface MainNavbarProps {
  countryCode?: string;
  lang?: string;
  onMobileFilterOpen?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const MOBILE_LOGO_PROPS = {
  width: 72,
  height: 24,
  className: "w-[68px] h-auto",
} as const;

const DESKTOP_LOGO_PROPS = {
  width: 96,
  height: 30,
  className: "w-[76px] lg:w-[84px] xl:w-[96px] h-auto",
} as const;

const HEADER_STYLE = SHOP_HEADER_STYLE;

function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ScanIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
    </svg>
  );
}

function FilterIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8h11"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx="18" cy="8" r="2" fill="currentColor" />
      <path
        d="M4 16h7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx="14" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

function MobileSearchField({
  searchQuery,
  onSearchChange,
  placeholder,
  ariaLabel,
  scanAriaLabel,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  ariaLabel: string;
  scanAriaLabel: string;
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <div className="pointer-events-none absolute inset-y-0 inset-s-0 flex items-center ps-3.5">
        <SearchIcon className="w-[18px] h-[18px] text-[#666666]" />
      </div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full min-h-12 ps-10 pe-11 py-3 text-sm text-[#333333] placeholder:text-[#8e8e93] bg-white border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200 ease-spring shadow-sm"
      />
      <button
        type="button"
        className="absolute inset-y-0 inset-e-0 flex items-center pe-3.5 text-[#666666] hover:text-[#333333] transition-colors"
        aria-label={scanAriaLabel}
      >
        <ScanIcon />
      </button>
    </div>
  );
}

function DesktopSearchField({
  searchQuery,
  onSearchChange,
  placeholder,
  ariaLabel,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative w-full min-w-0">
      <div className="pointer-events-none absolute inset-y-0 inset-s-0 flex items-center ps-4">
        <SearchIcon className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full h-10 ps-10 pe-4 text-sm text-gray-900 placeholder:text-gray-400 bg-white/95 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-200 ease-spring"
      />
    </div>
  );
}

export default function MainNavbar({
  countryCode = "saudi",
  lang = "en",
  onMobileFilterOpen,
  searchQuery = "",
  onSearchChange,
}: MainNavbarProps) {
  const { t } = useTranslation("common");
  const handleSearchChange = (query: string): void => {
    onSearchChange?.(query);
  };

  const searchPlaceholder = t("store.searchPlaceholder");
  const mobileSearchPlaceholder = t("store.mobileSearchPlaceholder");
  const searchAriaLabel = t("store.searchAriaLabel");
  const scanAriaLabel = t("store.scanAriaLabel");

  const mobileFilterButton = onMobileFilterOpen ? (
    <button
      onClick={onMobileFilterOpen}
      className="md:hidden flex items-center justify-center w-11 h-11 shrink-0 bg-white rounded-2xl border-0 shadow-sm hover:bg-gray-50 transition-colors duration-200 ease-spring"
      aria-label="Open filters"
    >
      <FilterIcon className="w-5 h-5 text-[#666666]" />
    </button>
  ) : null;

  return (
    <nav
      className="sticky top-0 z-50 rounded-b-[28px] md:rounded-none md:shadow-[0_1px_0_rgba(255,255,255,0.08)]"
      style={HEADER_STYLE}
    >
      <div className="relative w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12">
        {/* Mobile layout */}
        <div className="flex flex-col gap-6 pt-6 pb-7 md:hidden">
          <div className="flex items-center justify-center min-h-[44px]">
            <Logo {...MOBILE_LOGO_PROPS} href="/" />
          </div>
          <div className="flex items-center gap-2.5">
            <MobileSearchField
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              placeholder={mobileSearchPlaceholder}
              ariaLabel={searchAriaLabel}
              scanAriaLabel={scanAriaLabel}
            />
            {mobileFilterButton}
          </div>
        </div>

        {/* Desktop layout — logo | centered search | language */}
        <div className="hidden md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-x-6 lg:gap-x-8 h-20">
          <div className="shrink-0">
            <Logo {...DESKTOP_LOGO_PROPS} href="/" />
          </div>

          <div className="flex justify-center min-w-0 px-2 lg:px-8">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <DesktopSearchField
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                placeholder={searchPlaceholder}
                ariaLabel={searchAriaLabel}
              />
            </div>
          </div>

          <div className="flex items-center justify-end shrink-0">
            <LanguageSwitcher variant="segmented" />
          </div>
        </div>
      </div>
    </nav>
  );
}
