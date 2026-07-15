import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import DealCard from "../deals/DealCard";
import { Deal } from "../../types/deals";
import { handleDealClick } from "../../utils/navigation";
import FilterComponent, { FilterState } from "./FilterComponent";
import MobileBottomNav from "./MobileBottomNav";
import { useHomeDeals } from "../../hooks/useHomeDeals";
import { useCategories } from "../../hooks/useCategories";
import { useIsMobile } from "../../hooks/useMediaQuery";

interface MegaDealsProps {
  onRegisterMobileFilter?: (openFilter: () => void) => void;
  /** When set, deals are scoped to this category (also reads `?category=` from the URL). */
  initialCategoryId?: string;
  search?: string;
}

const INITIAL_FILTERS: FilterState = {
  dealType: "all",
  priceRange: { min: 0, max: 10000 },
  categories: [],
  locations: [],
};

const SEARCH_SCROLL_DEBOUNCE_MS = 450;

export default function MegaDeals({
  onRegisterMobileFilter,
  initialCategoryId,
  search,
}: MegaDealsProps) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const dealsSectionRef = React.useRef<HTMLDivElement>(null);
  const trimmedSearch = search?.trim() ?? "";

  const categoryParam =
    initialCategoryId ||
    (typeof router.query.category === "string" ? router.query.category : undefined);

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const { categories } = useCategories();
  const activeCategory = categoryParam
    ? categories.find((category) => category.id === categoryParam)
    : undefined;
  const categoryTitle = activeCategory
    ? isRTL
      ? activeCategory.name_ar
      : activeCategory.name_en
    : undefined;

  const { deals: filteredDeals, isLoading, error, total: totalDeals } = useHomeDeals({
    filters,
    categories,
    categoryId: categoryParam,
    size: 24,
    search,
  });
  const filteredCount = filteredDeals.length;

  React.useEffect(() => {
    if (!categoryParam || categories.length === 0) return;

    const match = categories.find((category) => category.id === categoryParam);
    if (!match) return;

    const name = isRTL ? match.name_ar : match.name_en;
    setFilters((prev) => {
      if (prev.categories[0] === name) return prev;
      return { ...prev, categories: [name] };
    });
  }, [categoryParam, categories, isRTL]);

  React.useEffect(() => {
    onRegisterMobileFilter?.(() => setIsMobileFilterOpen(true));
  }, [onRegisterMobileFilter]);

  React.useEffect(() => {
    if (!trimmedSearch) return;

    const timeout = setTimeout(() => {
      dealsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, SEARCH_SCROLL_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [trimmedSearch]);

  const onDealClick = (deal: Deal) => {
    handleDealClick(router, deal, "MegaDeals");
  };

  const sectionTitle = trimmedSearch
    ? t("store.searchResults", { query: trimmedSearch })
    : categoryParam && categoryTitle
      ? categoryTitle
      : t("navbar.deals");
  const filterKey = categoryParam || "all";

  return (
    <div
      ref={dealsSectionRef}
      id="deals"
      className="bg-white min-h-0 lg:min-h-screen lg:py-8 mobile-bottom-nav-padding scroll-mt-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-3 sm:pt-4 lg:pt-0">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Filter Sidebar — desktop */}
          <div className="hidden lg:block w-80 shrink-0">
            <FilterComponent
              key={filterKey}
              onFilterChange={setFilters}
              initialFilters={filters}
              isMobile={false}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile header with filter trigger */}
            <div className="lg:hidden flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary-500 truncate">
                  {sectionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {isRTL
                    ? `عرض ${filteredCount} من ${totalDeals} عرض`
                    : `Showing ${filteredCount} of ${totalDeals} deals`}
                </p>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="inline-flex items-center gap-2 min-h-11 px-4 py-2 text-sm font-medium text-primary-500 bg-primary-50 border border-primary-500/10 rounded-full hover:bg-primary-100 transition-colors duration-200 ease-spring shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                {isRTL ? "تصفية" : "Filter"}
              </button>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-primary-500">
                {sectionTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {isRTL
                  ? `عرض ${filteredCount} من ${totalDeals} عرض`
                  : `Showing ${filteredCount} of ${totalDeals} deals`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-black/5 overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-3.5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {isRTL ? "تعذر تحميل العروض" : "Couldn't load deals"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {error.message ||
                    (isRTL
                      ? "حدث خطأ أثناء جلب العروض. حاول مرة أخرى لاحقًا."
                      : "Something went wrong while fetching deals. Please try again later.")}
                </p>
              </div>
            ) : filteredDeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onCardClick={onDealClick}
                    className="hover:-translate-y-1 transition-transform duration-300 ease-spring"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {isRTL ? "لم يتم العثور على عروض" : "No deals found"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isRTL
                    ? "حاول تعديل الفلاتر لرؤية المزيد من النتائج."
                    : "Try adjusting your filters to see more results."}
                </p>
              </div>
            )}

            {!isLoading && !error && filteredDeals.length > 0 && (
              <div className="hidden lg:block mt-8 text-center">
                <button className="inline-flex items-center justify-center min-h-12 px-8 py-3 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-500/90 transition-colors duration-200 ease-spring">
                  {t("navbar.shopNow")}
                  <svg
                    className={`ml-2 w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileBottomNav activeTab="home" />
      </div>

      {isMobile && (
        <FilterComponent
          key={`mobile-${filterKey}`}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          onFilterChange={setFilters}
          initialFilters={filters}
          isMobile={true}
        />
      )}
    </div>
  );
}
