import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { Deal } from "../../types/deals";

interface DealTabsSectionProps {
  deal: Deal;
}

interface TabConfig {
  id: string;
  label: string;
}

export default function DealTabsSection({ deal }: DealTabsSectionProps) {
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
  const [activeTab, setActiveTab] = useState("description");

  const tabs: TabConfig[] = [
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
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <DescriptionTab deal={deal} tx={tx} />;
      case "details":
        return <DetailsTab deal={deal} tx={tx} locale={locale} />;
      case "terms":
        return <TermsTab deal={deal} tx={tx} isRTL={isRTL} />;
      default:
        return <DescriptionTab deal={deal} tx={tx} />;
    }
  };

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

      <div className="p-6 sm:p-8">{renderTabContent()}</div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
);

const DescriptionTab = ({
  deal,
  tx,
}: {
  deal: Deal;
  tx: (key: string, en: string, ar: string) => string;
}) => {
  const aboutText = deal.detailContent?.about || deal.description;

  return (
    <div className="max-w-3xl space-y-5">
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
      value: deal.supplier || tx("dealDetails.details.partner", "Eshtarena Partner", "شريك اشترينا"),
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
