import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import DealCard from "../deals/DealCard";
import SupplierMobileAbout from "./SupplierMobileAbout";
import SupplierMobileTabs from "./SupplierMobileTabs";
import SupplierMobileBranchCard from "./SupplierMobileBranchCard";
import type { Deal } from "../../types/deals";
import type { Supplier, SupplierBranch, SupplierCityCoverage } from "../../types/supplier";
import { handleDealClick } from "../../utils/navigation";

interface SupplierTabsSectionProps {
  supplier: Supplier;
  originalDeals: Deal[];
  coldDeals: Deal[];
  voucherDeals: Deal[];
  variant?: "default" | "mobile";
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  hideMobileNav?: boolean;
}

interface TabConfig {
  id: string;
  label: string;
}

type TxFn = (key: string, en: string, ar: string) => string;

export default function SupplierTabsSection({
  supplier,
  originalDeals,
  coldDeals,
  voucherDeals,
  variant = "default",
  activeTab: controlledTab,
  onTabChange,
  hideMobileNav = false,
}: SupplierTabsSectionProps) {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const queryLang = Array.isArray(router.query.lang) ? router.query.lang[0] : router.query.lang;
  const resolvedLang = queryLang || i18n.language || router.locale || "en";
  const isRTL = resolvedLang === "ar";
  const tx = (key: string, en: string, ar: string) => t(key, { defaultValue: isRTL ? ar : en });
  const [internalTab, setInternalTab] = useState("about");
  const activeTab = controlledTab ?? internalTab;

  const setActiveTab = (tabId: string) => {
    onTabChange?.(tabId);
    if (controlledTab === undefined) {
      setInternalTab(tabId);
    }
  };

  const desktopTabs: TabConfig[] = [
    { id: "about", label: tx("supplierDetails.tabs.about", "About", "نبذة") },
    { id: "branches", label: tx("supplierDetails.tabs.branches", "Branches", "الفروع") },
    {
      id: "productDeals",
      label: tx("supplierDetails.tabs.productDeals", "Product Deals", "عروض المنتجات"),
    },
    { id: "coldDeals", label: tx("supplierDetails.tabs.coldDeals", "Cold Deals", "العروض الباردة") },
    { id: "vouchers", label: tx("supplierDetails.tabs.vouchers", "Vouchers", "الكوبونات") },
  ];

  const mobileTabs: TabConfig[] = [
    { id: "about", label: tx("supplierDetails.tabs.about", "About", "نبذة") },
    { id: "branches", label: tx("supplierDetails.tabs.branches", "Branches", "الفروع") },
    {
      id: "productDeals",
      label: tx("supplierDetails.tabs.originalDeals", "Original deals", "العروض الأصلية"),
    },
    { id: "coldDeals", label: tx("supplierDetails.tabs.coldDealsShort", "Cold deals", "العروض الباردة") },
    { id: "vouchers", label: tx("supplierDetails.tabs.vouchers", "Vouchers", "الكوبونات") },
  ];

  const tabs = variant === "mobile" ? mobileTabs : desktopTabs;

  const renderTabContent = (mobileLayout = false) => {
    switch (activeTab) {
      case "about":
        return mobileLayout ? (
          <SupplierMobileAbout supplier={supplier} tx={tx} isRTL={isRTL} />
        ) : (
          <AboutTab supplier={supplier} tx={tx} isRTL={isRTL} />
        );
      case "branches":
        return (
          <BranchesTab branches={supplier.branches || []} tx={tx} isRTL={isRTL} mobileLayout={mobileLayout} />
        );
      case "productDeals":
        return (
          <DealsTab
            deals={originalDeals}
            emptyMessage={tx(
              "supplierDetails.noProductDeals",
              "No product deals available from this supplier yet.",
              "لا توجد عروض منتجات متاحة من هذا المورد حتى الآن."
            )}
            tx={tx}
          />
        );
      case "coldDeals":
        return (
          <DealsTab
            deals={coldDeals}
            emptyMessage={tx(
              "supplierDetails.noColdDeals",
              "No cold deals available from this supplier yet.",
              "لا توجد عروض باردة متاحة من هذا المورد حتى الآن."
            )}
            tx={tx}
          />
        );
      case "vouchers":
        return (
          <DealsTab
            deals={voucherDeals}
            emptyMessage={tx(
              "supplierDetails.noVouchers",
              "No voucher deals available from this supplier yet.",
              "لا توجد كوبونات متاحة من هذا المورد حتى الآن."
            )}
            tx={tx}
          />
        );
      default:
        return mobileLayout ? (
          <SupplierMobileAbout supplier={supplier} tx={tx} isRTL={isRTL} />
        ) : (
          <AboutTab supplier={supplier} tx={tx} isRTL={isRTL} />
        );
    }
  };

  if (variant === "mobile") {
    return (
      <div>
        {!hideMobileNav ? (
          <SupplierMobileTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel={tx("supplierDetails.pageTitle", "Supplier Profile", "ملف المورد")}
          />
        ) : null}

        <div className="pb-10">{renderTabContent(true)}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-soft border border-black/5 overflow-hidden">
      <div className="border-b border-black/5 px-4 pt-4 sm:px-6">
        <nav
          className="flex gap-2 overflow-x-auto pb-4"
          role="tablist"
          aria-label={tx("supplierDetails.pageTitle", "Supplier Profile", "ملف المورد")}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-spring min-h-11 ${
                  isActive
                    ? "bg-primary-500 text-white shadow-soft"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6 sm:p-8">{renderTabContent()}</div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
);

function AboutTab({
  supplier,
  tx,
  isRTL,
}: {
  supplier: Supplier;
  tx: TxFn;
  isRTL: boolean;
}) {
  const overview = isRTL ? supplier.overview_ar : supplier.overview_en;
  const textAlign = isRTL ? "text-right" : "text-left";

  const socialLinks = [
    supplier.website
      ? { label: tx("supplierDetails.website", "Website", "الموقع الإلكتروني"), href: supplier.website }
      : null,
    supplier.facebook ? { label: "Facebook", href: supplier.facebook } : null,
    supplier.twitter ? { label: "Twitter", href: supplier.twitter } : null,
    supplier.linkedIn ? { label: "LinkedIn", href: supplier.linkedIn } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-3">
        <SectionTitle title={tx("supplierDetails.aboutTitle", "About", "نبذة عن المورد")} />
        {overview ? (
          <p className={`text-[15px] leading-7 text-gray-600 whitespace-pre-line ${textAlign}`}>
            {overview}
          </p>
        ) : (
          <p className="text-gray-500">
            {tx(
              "supplierDetails.noOverview",
              "No overview is available for this supplier yet.",
              "لا توجد نبذة متاحة عن هذا المورد حتى الآن."
            )}
          </p>
        )}
      </div>

      <CoverageSection supplier={supplier} tx={tx} isRTL={isRTL} />

      {supplier.categories && supplier.categories.length > 0 ? (
        <div className="space-y-3">
          <SectionTitle
            title={tx("supplierDetails.categories", "Categories", "التصنيفات")}
          />
          <div className="flex flex-wrap gap-2">
            {supplier.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-500 border border-primary-500/10"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {supplier.phone && supplier.phone.length > 0 ? (
        <div className="space-y-3">
          <SectionTitle title={tx("supplierDetails.phone", "Phone", "الهاتف")} />
          <ul className="space-y-2">
            {supplier.phone.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone}`}
                  className="text-sm font-medium text-primary-500 hover:text-primary-500/80"
                  dir="ltr"
                >
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {socialLinks.length > 0 ? (
        <div className="space-y-3">
          <SectionTitle title={tx("supplierDetails.links", "Links", "الروابط")} />
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={/^https?:\/\//i.test(link.href) ? link.href : `https://${link.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary-500 hover:text-primary-500/80 underline underline-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CoverageSection({
  supplier,
  tx,
  isRTL,
}: {
  supplier: Supplier;
  tx: TxFn;
  isRTL: boolean;
}) {
  const cities = supplier.cities || [];
  const hasCoverage = supplier.allKsa || cities.length > 0;
  if (!hasCoverage) return null;

  return (
    <div className="space-y-3">
      <SectionTitle title={tx("supplierDetails.coverage", "Coverage", "التغطية")} />
      {supplier.allKsa ? (
        <p className={`text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {tx("supplierDetails.allKsa", "All KSA", "جميع أنحاء المملكة")}
        </p>
      ) : (
        <CoverageList cities={cities} tx={tx} isRTL={isRTL} />
      )}
    </div>
  );
}

function CoverageList({
  cities,
  tx,
  isRTL,
}: {
  cities: SupplierCityCoverage[];
  tx: TxFn;
  isRTL: boolean;
}) {
  return (
    <ul className={`space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
      {cities.map((entry) => (
        <li
          key={entry.city}
          className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3.5"
        >
          <p className="text-sm font-semibold text-gray-900">{entry.city}</p>
          {entry.districts.length > 0 ? (
            <p className="mt-1 text-xs text-gray-500">
              {tx("supplierDetails.districts", "Districts", "الأحياء")}: {entry.districts.join(", ")}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function BranchesTab({
  branches,
  tx,
  isRTL,
  mobileLayout = false,
}: {
  branches: SupplierBranch[];
  tx: TxFn;
  isRTL: boolean;
  mobileLayout?: boolean;
}) {
  if (branches.length === 0) {
    return (
      <p className={`text-sm ${mobileLayout ? "text-[#808080]" : "text-gray-500"}`}>
        {tx(
          "supplierDetails.noBranches",
          "No branches are listed for this supplier yet.",
          "لا توجد فروع مدرجة لهذا المورد حتى الآن."
        )}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${mobileLayout ? "gap-3" : "md:grid-cols-2 gap-4"}`}>
      {branches.map((branch) =>
        mobileLayout ? (
          <SupplierMobileBranchCard key={branch.id} branch={branch} tx={tx} isRTL={isRTL} />
        ) : (
          <BranchCard key={branch.id} branch={branch} tx={tx} isRTL={isRTL} />
        )
      )}
    </div>
  );
}

function BranchCard({
  branch,
  tx,
  isRTL,
}: {
  branch: SupplierBranch;
  tx: TxFn;
  isRTL: boolean;
}) {
  const hasHours = branch.openAt && branch.closeAt;
  const hasCoords = branch.lat && branch.lng;
  const mapUrl = hasCoords ? `https://www.google.com/maps?q=${branch.lat},${branch.lng}` : null;

  return (
    <article className="rounded-xl border border-gray-100 bg-gray-50/80 p-5 space-y-3">
      <h3 className={`text-base font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
        {branch.title}
      </h3>

      {branch.location ? (
        <p className={`text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {branch.location}
        </p>
      ) : null}

      {branch.city ? (
        <p className={`text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
          {tx("supplierDetails.branchCity", "City", "المدينة")}: {branch.city}
        </p>
      ) : null}

      {branch.districts.length > 0 ? (
        <p className={`text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
          {tx("supplierDetails.districts", "Districts", "الأحياء")}: {branch.districts.join(", ")}
        </p>
      ) : null}

      {hasHours ? (
        <p className={`text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`} dir="ltr">
          {tx("supplierDetails.hours", "Hours", "ساعات العمل")}: {branch.openAt} – {branch.closeAt}
        </p>
      ) : null}

      {mapUrl ? (
        <Link
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-medium text-primary-500 hover:text-primary-500/80"
        >
          {tx("supplierDetails.viewOnMap", "View on map", "عرض على الخريطة")}
        </Link>
      ) : null}
    </article>
  );
}

function DealsTab({
  deals,
  emptyMessage,
  tx,
}: {
  deals: Deal[];
  emptyMessage: string;
  tx: TxFn;
}) {
  const router = useRouter();

  if (deals.length === 0) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {tx("supplierDetails.dealsCount", "{{count}} deals", "{{count}} عرض").replace(
          "{{count}}",
          String(deals.length)
        )}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onCardClick={(selectedDeal) => handleDealClick(router, selectedDeal, "SupplierProfile")}
          />
        ))}
      </div>
    </div>
  );
}
