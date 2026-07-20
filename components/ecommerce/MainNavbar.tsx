import React from "react";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";
import LanguageSwitcher from "../landingpage/LanguageSwitcher";
import { DASHBOARD_LOGIN_URL } from "../../utils/routes";

const goToDashboardLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  window.location.assign(DASHBOARD_LOGIN_URL);
};

interface MainNavbarProps {
  countryCode?: string;
  lang?: string;
  onMobileFilterOpen?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const LOGO_PROPS = {
  width: 100,
  height: 32,
  className: "w-[88px] sm:w-[100px] h-auto",
} as const;

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
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
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
        <SearchIcon className="w-[18px] h-[18px] text-gray-400" />
      </div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full min-h-11 ps-10 pe-11 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-black/10 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all duration-200 ease-spring shadow-sm"
      />
      <button
        type="button"
        className="absolute inset-y-0 inset-e-0 flex items-center pe-3.5 text-gray-400 hover:text-gray-600 transition-colors"
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
    <div className="relative flex-1 min-w-0">
      <div className="pointer-events-none absolute inset-y-0 inset-s-0 flex items-center ps-3.5 sm:ps-4">
        <SearchIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-400" />
      </div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full min-h-10 sm:min-h-11 ps-9 sm:ps-11 pe-3 sm:pe-4 py-2 text-sm sm:text-[15px] text-gray-900 placeholder:text-gray-400 bg-white border border-black/10 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all duration-200 ease-spring shadow-sm"
      />
    </div>
  );
}

export default function MainNavbar({
  countryCode = "egy",
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

  const accountLink = (
    <a
      href={DASHBOARD_LOGIN_URL}
      onClick={goToDashboardLogin}
      className="inline-flex items-center gap-2 min-h-10 px-3 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 ease-spring"
      aria-label="Account"
    >
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="hidden lg:inline text-sm font-medium">Account</span>
    </a>
  );

  const mobileFilterButton = onMobileFilterOpen ? (
    <button
      onClick={onMobileFilterOpen}
      className="md:hidden flex items-center justify-center w-11 h-11 shrink-0 bg-white rounded-xl border border-black/5 shadow-sm hover:bg-gray-50 transition-colors duration-200 ease-spring"
      aria-label="Open filters"
    >
      <FilterIcon className="w-5 h-5 text-gray-500" />
    </button>
  ) : null;

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-br from-primary-900 via-primary-600 to-primary-500 md:bg-primary-500/85 md:backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 shadow-soft">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Mobile layout */}
        <div className="flex flex-col gap-2.5 py-2.5 md:hidden">
          <div className="relative flex items-center justify-between gap-3 min-h-10">
            <div className="flex items-center shrink-0 z-10">{accountLink}</div>
            <div className="absolute inset-x-0 flex justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <Logo {...LOGO_PROPS} href="/" />
              </div>
            </div>
            <div className="flex items-center shrink-0 z-10">
              <LanguageSwitcher variant="compact" />
            </div>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6 lg:gap-8 h-16">
          <div className="shrink-0">
            <Logo {...LOGO_PROPS} href="/" />
          </div>

          <div className="flex justify-center min-w-0 px-2 lg:px-6">
            <div className="w-full max-w-xl">
              <DesktopSearchField
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                placeholder={searchPlaceholder}
                ariaLabel={searchAriaLabel}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 shrink-0">
            {accountLink}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
