import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { Deal } from "../../types/deals";
import DealAccordion, { DealAccordionItem } from "./DealAccordion";
import DealAdviceSection from "./DealAdviceSection";
import PricingDisplay from "./PricingDisplay";
import ProgressBar from "./ProgressBar";

interface DealTabsSectionProps {
  deal: Deal;
  variant?: "default" | "mobile";
}

interface TabConfig {
  id: string;
  label: string;
}

export default function DealTabsSection({ deal, variant = "default" }: DealTabsSectionProps) {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const queryLang = Array.isArray(router.query.lang)
    ? router.query.lang[0]
    : router.query.lang;
  const resolvedLang = queryLang || i18n.language || router.locale || "en";
  const isRTL = resolvedLang === "ar";
  const locale = isRTL ? "ar-SA" : "en-US";
  const tx = (key: string, en: string, ar: string) =>
    t(key, { defaultValue: isRTL ? ar : en });
  const [activeTab, setActiveTab] = useState(variant === "mobile" ? "deal" : "description");

  const desktopTabs: TabConfig[] = [
    {
      id: "description",
      label: tx("dealDetails.tabs.description", "Description", "الوصف"),
    },
    {
      id: "details",
      label: tx("dealDetails.tabs.details", "Details", "التفاصيل"),
    },
    {
      id: "terms",
      label: tx("dealDetails.tabs.terms", "Terms & Conditions", "الشروط والأحكام"),
    },
    {
      id: "branches",
      label: tx("dealDetails.tabs.branches", "Branches", "الفروع"),
    },
  ];

  const mobileTabs: TabConfig[] = [
    { id: "deal", label: tx("dealDetails.tabs.deal", "Deal", "العرض") },
    { id: "product", label: tx("dealDetails.tabs.product", "Product", "المنتج") },
    { id: "delivery", label: tx("dealDetails.tabs.delivery", "Delivery", "التوصيل") },
    { id: "payment", label: tx("dealDetails.tabs.payment", "Payment", "الدفع") },
  ];

  const tabs = variant === "mobile" ? mobileTabs : desktopTabs;

  const renderDesktopTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <DescriptionTab
            deal={deal}
            tx={tx}
            isRTL={isRTL}
            readTimeLabel={t("advice.readTime", { minutes: deal.advice?.readTimeMinutes ?? 1 })}
            adviceCardTitle={t("advice.cardTitle")}
          />
        );
      case "details":
        return <DetailsTab deal={deal} tx={tx} locale={locale} />;
      case "terms":
        return <TermsTab deal={deal} tx={tx} isRTL={isRTL} />;
      case "branches":
        return <BranchesTab deal={deal} tx={tx} isRTL={isRTL} />;
      default:
        return (
          <DescriptionTab
            deal={deal}
            tx={tx}
            isRTL={isRTL}
            readTimeLabel={t("advice.readTime", { minutes: deal.advice?.readTimeMinutes ?? 1 })}
            adviceCardTitle={t("advice.cardTitle")}
          />
        );
    }
  };

  const renderMobileTabContent = () => {
    switch (activeTab) {
      case "deal":
        return (
          <MobileDealTab
            deal={deal}
            tx={tx}
            locale={locale}
            isRTL={isRTL}
            readTimeLabel={t("advice.readTime", { minutes: deal.advice?.readTimeMinutes ?? 1 })}
            adviceCardTitle={t("advice.cardTitle")}
          />
        );
      case "product":
        return <MobileProductTab deal={deal} tx={tx} locale={locale} />;
      case "delivery":
        return <MobileDeliveryTab deal={deal} tx={tx} isRTL={isRTL} />;
      case "payment":
        return <MobilePaymentTab deal={deal} tx={tx} isRTL={isRTL} />;
      default:
        return (
          <MobileDealTab
            deal={deal}
            tx={tx}
            locale={locale}
            isRTL={isRTL}
            readTimeLabel={t("advice.readTime", { minutes: deal.advice?.readTimeMinutes ?? 1 })}
            adviceCardTitle={t("advice.cardTitle")}
          />
        );
    }
  };

  if (variant === "mobile") {
    return (
      <div>
        <nav
          className="flex border-b border-gray-200 bg-white"
          role="tablist"
          aria-label={tx("dealDetails.pageTitle", "Deal Details", "تفاصيل العرض")}
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
                className={`flex-1 py-3.5 text-sm transition-colors min-h-11 ${
                  isActive
                    ? "font-medium text-primary-500 border-b-2 border-primary-500"
                    : "font-normal text-[#808080] border-b-2 border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-5 pb-28">{renderMobileTabContent()}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-soft border border-black/5 overflow-hidden">
      <div className="border-b border-black/5 px-4 pt-4 sm:px-6">
        <nav
          className="flex gap-2 overflow-x-auto pb-4"
          role="tablist"
          aria-label={tx("dealDetails.pageTitle", "Deal Details", "تفاصيل العرض")}
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

      <div className="p-6 sm:p-8">{renderDesktopTabContent()}</div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
);

const MobileInfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-[#F5F5F7] px-3 py-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-normal text-[#808080] leading-tight">{label}</p>
      <p className="text-sm font-bold text-primary-500 truncate leading-tight">{value}</p>
    </div>
  </div>
);

const MobileSupplierCard = ({
  deal,
}: {
  deal: Deal;
}) => {
  const cardInner = (
    <>
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {deal.supplierLogo ? (
          <Image
            src={deal.supplierLogo}
            alt={deal.supplier || "Supplier"}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-50 text-xs font-bold text-primary-500">
            {(deal.supplier || "S").slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <p className="min-w-0 flex-1 text-sm font-bold text-primary-500 truncate">{deal.supplier}</p>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5";

  if (!deal.supplierId) {
    return <div className={className}>{cardInner}</div>;
  }

  return (
    <Link
      href={`/supplier-details/${deal.supplierId}`}
      className={`${className} transition-colors hover:bg-gray-50 active:bg-gray-100`}
    >
      {cardInner}
    </Link>
  );
};

const MobileDealTab = ({
  deal,
  tx,
  locale,
  isRTL,
  readTimeLabel,
  adviceCardTitle,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  locale: string;
  isRTL: boolean;
  readTimeLabel: string;
  adviceCardTitle: string;
}) => {
  const content = deal.detailContent;
  const specialSpecs = content?.specialSpecification?.trim() || "";
  const specialSpecsPreview = specialSpecs.split("\n")[0]?.trim() || "";
  const originalDealAbout = content?.about?.trim() || "";
  const expertAdvice = content?.purchasingExpertAdvice?.trim() || "";

  const accordionItems: DealAccordionItem[] = [];

  if (specialSpecs) {
    accordionItems.push({
      id: "special-specs",
      title: tx(
        "dealDetails.accordions.specialSpecs",
        "Special specifications",
        "مواصفات خاصة"
      ),
      subtitle: specialSpecsPreview || undefined,
      content: specialSpecs,
    });
  }

  if (originalDealAbout) {
    accordionItems.push({
      id: "original-deal",
      title: tx(
        "dealDetails.accordions.originalDeal",
        "What is Original deal?",
        "ما هو العرض الأصلي؟"
      ),
      content: originalDealAbout,
    });
  }

  if (expertAdvice && !deal.advice) {
    accordionItems.push({
      id: "expert-advice",
      title: tx(
        "dealDetails.accordions.expertAdvice",
        "Purchasing expert advice",
        "نصائح خبير المشتريات"
      ),
      content: expertAdvice,
    });
  }

  return (
    <div className="space-y-4">
      {deal.supplier ? <MobileSupplierCard deal={deal} /> : null}

      {deal.advice ? (
        <DealAdviceSection
          advice={deal.advice}
          isArabic={isRTL}
          cardTitle={adviceCardTitle}
          readTimeLabel={readTimeLabel}
        />
      ) : null}

      <PricingDisplay
        deal={deal}
        showSavings={true}
        layout="horizontal"
        className="border-gray-200"
        locale={locale}
        labels={{
          voucherValue: tx("deals.voucherValue", "Voucher value", "قيمة الكوبون"),
          marketPrice: tx("deals.marketPrice", "Market price", "السعر في السوق"),
          dealPrice: tx("deals.dealPrice", "Deal Price", "سعر العرض"),
          save: tx("deals.save", "Save", "وفر"),
        }}
      />

      <ProgressBar
        quantity={deal.quantity}
        dealType={deal.dealType}
        showLabels={true}
        height="xl"
        locale={locale}
        labels={{
          progress: tx("dealDetails.stats.progress", "Progress", "التقدم"),
          total: tx("dealDetails.stats.total", "Total", "الإجمالي"),
          sold: tx("dealDetails.sold", "Sold", "تم البيع"),
          available: tx("dealDetails.available", "Available", "المتاح"),
        }}
        className="[&>div:first-child>span:first-child]:font-normal [&>div:first-child>span:first-child]:text-[#808080] [&>div:last-child]:font-normal [&>div:last-child]:text-[#808080]"
      />

      <DealAccordion items={accordionItems} />
    </div>
  );
};

const MobileProductTab = ({
  deal,
  tx,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  locale: string;
}) => {
  const productDescription = deal.description?.trim() || "";
  const factoryName =
    deal.productFactory?.trim() ||
    tx("dealDetails.product.factoryFallback", "Not specified", "غير محدد");
  const madeIn =
    deal.productMadeIn?.trim() ||
    tx("dealDetails.product.madeInFallback", "Not specified", "غير محدد");

  return (
    <div className="space-y-4">
      {productDescription ? (
        <p className="text-sm font-normal leading-relaxed text-[#808080] whitespace-pre-line">
          {productDescription}
        </p>
      ) : (
        <p className="text-sm text-[#808080]">
          {tx(
            "dealDetails.noDescription",
            "No description is available for this deal yet.",
            "لا يوجد وصف متاح لهذا العرض حتى الآن."
          )}
        </p>
      )}

      <div className="flex gap-3">
        <MobileInfoCard
          icon={
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.84L18 12h-2v6h-2v-6H8v6H6v-6H4l8-6.16z" />
            </svg>
          }
          label={tx("dealDetails.product.factoryName", "Factory name", "اسم المصنع")}
          value={factoryName}
        />
        <MobileInfoCard
          icon={
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
            </svg>
          }
          label={tx("dealDetails.product.madeIn", "Made in", "صنع في")}
          value={madeIn}
        />
      </div>
    </div>
  );
};

const MobileDeliveryTab = ({
  deal,
  tx,
  isRTL,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  isRTL: boolean;
}) => {
  const deliveryTerms = deal.detailContent?.deliveryTerms || [];
  const textAlign = isRTL ? "text-right" : "text-left";

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-primary-500">
        {tx("dealDetails.delivery.title", "Sharena delivery terms", "شروط توصيل اشترينا")}
      </h2>

      {deliveryTerms.length > 0 ? (
        deliveryTerms.map((term, index) => (
          <p key={`delivery-${index}`} className={`text-sm leading-relaxed text-gray-500 ${textAlign}`}>
            {term}
          </p>
        ))
      ) : (
        <>
          <p className={`text-sm leading-relaxed text-gray-500 ${textAlign}`}>
            {tx(
              "dealDetails.delivery.default1",
              "Delivery typically takes 2-5 business days after the deal closes and payment is confirmed.",
              "يستغرق التوصيل عادةً من 2 إلى 5 أيام عمل بعد إغلاق العرض وتأكيد الدفع."
            )}
          </p>
          <p className={`text-sm leading-relaxed text-gray-500 ${textAlign}`}>
            {tx(
              "dealDetails.delivery.default2",
              "Coverage depends on your selected city. Sharena partners deliver across supported regions in KSA.",
              "تعتمد التغطية على مدينتك المختارة. يقوم شركاء اشترينا بالتوصيل في المناطق المدعومة داخل المملكة."
            )}
          </p>
        </>
      )}
    </div>
  );
};

const MobilePaymentTab = ({
  deal,
  tx,
  isRTL,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  isRTL: boolean;
}) => {
  const content = deal.detailContent;
  const textAlign = isRTL ? "text-right" : "text-left";

  return (
    <div className="space-y-5">
      {content?.paymentTerms ? (
        <p className={`text-sm leading-relaxed text-[#808080] whitespace-pre-line ${textAlign}`}>
          {content.paymentTerms}
        </p>
      ) : null}

      {content?.customerPaymentTerms?.map((term, index) => (
        <div key={`payment-${index}`} className="space-y-1.5">
          {term.title ? (
            <h3 className="text-sm font-normal text-[#808080]">{term.title}</h3>
          ) : null}
          <p className={`text-sm leading-relaxed text-[#808080] whitespace-pre-line ${textAlign}`}>
            {term.content}
          </p>
        </div>
      ))}

      {!content?.paymentTerms && !content?.customerPaymentTerms?.length ? (
        <p className={`text-sm leading-relaxed text-[#808080] ${textAlign}`}>
          {tx(
            "dealDetails.payment.default",
            "Payment must be completed within 24 hours of joining the deal to secure your spot.",
            "يجب إتمام الدفع خلال 24 ساعة من الانضمام للعرض لتأكيد الحجز."
          )}
        </p>
      ) : null}
    </div>
  );
};

const DescriptionTab = ({
  deal,
  tx,
  isRTL,
  readTimeLabel,
  adviceCardTitle,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  isRTL: boolean;
  readTimeLabel: string;
  adviceCardTitle: string;
}) => {
  const aboutText = deal.detailContent?.about || deal.description;

  return (
    <div className="max-w-3xl space-y-5">
      {deal.advice ? (
        <DealAdviceSection
          advice={deal.advice}
          isArabic={isRTL}
          cardTitle={adviceCardTitle}
          readTimeLabel={readTimeLabel}
        />
      ) : null}

      <SectionTitle title={tx("dealDetails.aboutTitle", "About This Deal", "نبذة عن العرض")} />
      {aboutText ? (
        <p className="text-[15px] leading-7 text-gray-600 whitespace-pre-line">{aboutText}</p>
      ) : (
        <p className="text-gray-500">
          {tx(
            "dealDetails.noDescription",
            "No description is available for this deal yet.",
            "لا يوجد وصف متاح لهذا العرض حتى الآن."
          )}
        </p>
      )}
    </div>
  );
};

const DetailsTab = ({
  deal,
  tx,
  locale,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  locale: string;
}) => {
  const details = [
    {
      label: tx("dealDetails.details.supplier", "Supplier", "المورد"),
      value: deal.supplier || tx("dealDetails.details.partner", "Sharena Partner", "شريك اشترينا"),
    },
    {
      label: tx("dealDetails.details.dealType", "Deal type", "نوع العرض"),
      value:
        deal.dealType === "original"
          ? tx("dealDetails.dealType.original", "Product deal", "عرض منتج")
          : deal.dealType === "cold"
          ? tx("dealDetails.dealType.cold", "Cold deal", "عرض بارد")
          : tx("dealDetails.dealType.voucher", "Voucher deal", "عرض كوبونات"),
    },
    { label: tx("dealDetails.details.location", "Location", "الموقع"), value: deal.location.text },
    {
      label: tx("dealDetails.details.totalQuantity", "Total quantity", "إجمالي الكمية"),
      value: (deal.quantity.sold + deal.quantity.available).toLocaleString(locale),
    },
    {
      label: tx("dealDetails.sold", "Sold", "تم البيع"),
      value: deal.quantity.sold.toLocaleString(locale),
    },
    {
      label: tx("dealDetails.available", "Available", "المتاح"),
      value: deal.quantity.available.toLocaleString(locale),
    },
    {
      label: tx("dealDetails.details.status", "Status", "الحالة"),
      value: deal.isActive
        ? tx("dealDetails.status.active", "Active", "نشط")
        : tx("dealDetails.status.inactive", "Inactive", "غير نشط"),
    },
  ];

  if (deal.productName) {
    details.unshift({
      label: tx("dealDetails.details.product", "Product", "المنتج"),
      value: deal.productName,
    });
  }

  return (
    <div className="space-y-5">
      <SectionTitle title={tx("dealDetails.details.title", "Deal Details", "تفاصيل العرض")} />
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {details.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3.5"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
              {item.label}
            </dt>
            <dd className="text-sm font-semibold text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const TermsTab = ({
  deal,
  tx,
  isRTL,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  isRTL: boolean;
}) => {
  const content = deal.detailContent;
  const hasStructuredTerms = Boolean(
    content?.terms ||
      content?.paymentTerms ||
      content?.deliveryTerms?.length ||
      content?.customerPaymentTerms?.length
  );

  return (
    <div className="max-w-3xl space-y-5">
      <SectionTitle
        title={tx("dealDetails.tabs.terms", "Terms & Conditions", "الشروط والأحكام")}
      />

      {!hasStructuredTerms ? (
        <p className="text-gray-500">
          {tx(
            "dealDetails.noTerms",
            "No terms and conditions are available for this deal yet.",
            "لا توجد شروط وأحكام متاحة لهذا العرض حتى الآن."
          )}
        </p>
      ) : (
        <div className="space-y-4 text-gray-600">
          {content?.terms ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
              <p className={`text-[15px] leading-7 whitespace-pre-line ${isRTL ? "text-right" : "text-left"}`}>
                {content.terms}
              </p>
            </div>
          ) : null}

          {content?.paymentTerms ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {tx("dealDetails.terms.payment", "Payment Terms", "شروط الدفع")}
              </h3>
              <p className={`text-[15px] leading-7 whitespace-pre-line ${isRTL ? "text-right" : "text-left"}`}>
                {content.paymentTerms}
              </p>
            </div>
          ) : null}

          {content?.deliveryTerms?.map((term, index) => (
            <div key={`delivery-${index}`} className="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {tx("dealDetails.terms.delivery", "Delivery Terms", "شروط التوصيل")}
                {content.deliveryTerms && content.deliveryTerms.length > 1 ? ` ${index + 1}` : ""}
              </h3>
              <p className={`text-[15px] leading-7 whitespace-pre-line ${isRTL ? "text-right" : "text-left"}`}>
                {term}
              </p>
            </div>
          ))}

          {content?.customerPaymentTerms?.map((term, index) => (
            <div key={`payment-term-${index}`} className="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
              {term.title ? (
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{term.title}</h3>
              ) : null}
              <p className={`text-[15px] leading-7 whitespace-pre-line ${isRTL ? "text-right" : "text-left"}`}>
                {term.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BranchesTab = ({
  deal,
  tx,
  isRTL,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
  isRTL: boolean;
}) => {
  const cities = deal.cities || [];
  const textAlign = isRTL ? "text-right" : "text-left";

  return (
    <div className="max-w-3xl space-y-5">
      <SectionTitle title={tx("dealDetails.branches.title", "Available Branches", "الفروع المتاحة")} />

      {deal.allKsa ? (
        <p className={`text-[15px] leading-7 text-gray-600 ${textAlign}`}>
          {tx("dealDetails.branches.allKsa", "All KSA", "جميع أنحاء المملكة")}
        </p>
      ) : cities.length > 0 ? (
        <ul className={`space-y-3 ${textAlign}`}>
          {cities.map((entry) => (
            <li
              key={entry.city}
              className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3.5"
            >
              <p className="text-sm font-semibold text-gray-900">{entry.city}</p>
              {entry.districts.length > 0 ? (
                <p className="mt-1 text-xs text-gray-500">
                  {tx("dealDetails.branches.districts", "Districts", "الأحياء")}:{" "}
                  {entry.districts.join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`text-gray-500 ${textAlign}`}>
          {tx(
            "dealDetails.branches.noBranches",
            "No branch availability information for this deal yet.",
            "لا تتوفر معلومات عن الفروع المتاحة لهذا العرض حتى الآن."
          )}
        </p>
      )}
    </div>
  );
};
