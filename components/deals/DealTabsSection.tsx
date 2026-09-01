import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { Deal } from "../../types/deals";
import DealAccordion, { DealAccordionItem } from "./DealAccordion";
import PricingDisplay from "./PricingDisplay";
import ProgressBar from "./ProgressBar";
import { resolvePageLang } from "../../utils/resolvePageLang";

interface DealTabsSectionProps {
  deal: Deal;
  variant?: "default" | "mobile";
}

interface TabConfig {
  id: string;
  label: string;
}

type TranslateFn = (key: string, en: string, ar: string) => string;

function previewLine(text: string): string | undefined {
  const line = text.split("\n")[0]?.trim();
  return line || undefined;
}

function buildDealAccordionItems(deal: Deal, tx: TranslateFn): DealAccordionItem[] {
  const content = deal.detailContent;
  const items: DealAccordionItem[] = [];

  if (deal.dealType === "original") {
    const specs = content?.specialSpecification?.trim() || "";
    items.push({
      id: "special-specs",
      title: tx("dealDetails.accordions.specialSpecs", "Special specifications", "مواصفات خاصة"),
      subtitle: previewLine(specs),
      content: specs || tx(
        "dealDetails.accordions.noSpecialSpecs",
        "No special specifications available for this deal.",
        "لا توجد مواصفات خاصة متاحة لهذا العرض."
      ),
    });
  } else if (deal.dealType === "voucher") {
    const terms = content?.terms?.trim() || content?.specialSpecification?.trim() || "";
    items.push({
      id: "special-specs",
      title: tx("dealDetails.accordions.terms", "Terms & conditions", "الشروط والأحكام"),
      subtitle: previewLine(terms),
      content: terms || tx(
        "dealDetails.accordions.noSpecialSpecs",
        "No special specifications available for this deal.",
        "لا توجد مواصفات خاصة متاحة لهذا العرض."
      ),
    });
  } else if (content?.specialSpecification?.trim()) {
    const specs = content.specialSpecification.trim();
    items.push({
      id: "special-specs",
      title: tx("dealDetails.accordions.specialSpecs", "Special specifications", "مواصفات خاصة"),
      subtitle: previewLine(specs),
      content: specs,
    });
  }

  const about = content?.about?.trim();
  if (about) {
    const aboutTitle =
      deal.dealType === "original"
        ? tx("dealDetails.accordions.originalDeal", "What is product deal?", "ما هو عرض المنتج؟")
        : deal.dealType === "cold"
          ? tx("dealDetails.accordions.coldDeal", "What is Cold deal?", "ما هو العرض البارد؟")
          : tx("dealDetails.accordions.voucherDeal", "What is Voucher deal?", "ما هو عرض الكوبونات؟");

    items.push({
      id: "about-deal",
      title: aboutTitle,
      content: about,
    });
  }

  return items;
}

const CSS_NAMED_COLORS = new Set([
  "black", "white", "red", "blue", "green", "yellow", "orange", "purple", "pink",
  "gray", "grey", "brown", "navy", "gold", "silver", "beige", "cream", "ivory",
  "maroon", "teal", "cyan", "magenta", "lime", "olive", "coral", "salmon",
  "turquoise", "violet", "indigo", "khaki", "lavender", "tan", "aqua", "crimson",
]);

function isRenderableColor(token: string): boolean {
  const value = token.trim().toLowerCase();
  if (!value) return false;
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) return true;
  if (/^(rgb|hsl)a?\(/i.test(value)) return true;
  return CSS_NAMED_COLORS.has(value);
}

export default function DealTabsSection({ deal, variant = "default" }: DealTabsSectionProps) {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const resolvedLang = resolvePageLang(router, i18n.language);
  const isRTL = resolvedLang === "ar";
  const locale = isRTL ? "ar-SA" : "en-US";
  const tx: TranslateFn = (key, en, ar) => t(key, { defaultValue: isRTL ? ar : en });
  const showProductTab = deal.dealType !== "voucher";
  const [activeTab, setActiveTab] = useState("deal");

  const tabs: TabConfig[] = [
    { id: "deal", label: tx("dealDetails.tabs.deal", "Deal", "العرض") },
    ...(showProductTab
      ? [{ id: "product", label: tx("dealDetails.tabs.product", "Product", "المنتج") }]
      : []),
    { id: "delivery", label: tx("dealDetails.tabs.delivery", "Delivery", "التوصيل") },
    { id: "payment", label: tx("dealDetails.tabs.payment", "Payment", "الدفع") },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "product":
        return showProductTab ? <ProductTab deal={deal} tx={tx} /> : null;
      case "delivery":
        return <DeliveryTab deal={deal} tx={tx} isRTL={isRTL} />;
      case "payment":
        return <PaymentTab deal={deal} tx={tx} isRTL={isRTL} />;
      case "deal":
      default:
        return (
          <DealTab
            deal={deal}
            tx={tx}
            locale={locale}
            showCommerce={variant === "mobile"}
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

        <div className="px-4 py-5">{renderTabContent()}</div>
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

      <div className="p-6 sm:p-8">{renderTabContent()}</div>
    </div>
  );
}

const ProductSpecCard = ({
  icon,
  label,
  value,
  swatches,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  swatches?: string[];
}) => (
  <div className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-[#F5F5F7] px-3 py-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-normal text-[#808080] leading-tight">{label}</p>
      {swatches && swatches.length > 0 ? (
        <div className="mt-1 flex items-center gap-1.5">
          {swatches.map((color) => (
            <span
              key={color}
              className="inline-block h-4 w-4 rounded-md border border-black/10"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm font-bold text-primary-500 truncate leading-tight">{value}</p>
      )}
    </div>
  </div>
);

const SupplierCard = ({ deal }: { deal: Deal }) => {
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

const DealTab = ({
  deal,
  tx,
  locale,
  showCommerce,
}: {
  deal: Deal;
  tx: TranslateFn;
  locale: string;
  showCommerce: boolean;
}) => {
  const accordionItems = buildDealAccordionItems(deal, tx);

  return (
    <div className="space-y-4">
      {showCommerce && deal.supplier ? <SupplierCard deal={deal} /> : null}

      {showCommerce ? (
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
      ) : null}

      {showCommerce ? (
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
      ) : null}

      <DealAccordion items={accordionItems} />
    </div>
  );
};

const ProductTab = ({
  deal,
  tx,
}: {
  deal: Deal;
  tx: TranslateFn;
}) => {
  const productDescription = deal.description?.trim() || "";
  const notSpecified = tx("dealDetails.product.notSpecified", "Not specified", "غير محدد");
  const factoryName = deal.productFactory?.trim() || notSpecified;
  const madeIn = deal.productMadeIn?.trim() || notSpecified;
  const size = deal.productSize?.trim() || notSpecified;
  const colorValue = deal.productColor?.trim() || notSpecified;
  const colorTokens = (deal.productColor || "")
    .split(/[,/|]/)
    .map((token) => token.trim())
    .filter(Boolean);
  const colorSwatches = colorTokens.length > 0 && colorTokens.every(isRenderableColor)
    ? colorTokens
    : undefined;

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

      <div className="grid grid-cols-2 gap-3">
        <ProductSpecCard
          icon={
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
            </svg>
          }
          label={tx("dealDetails.product.madeIn", "Made in", "صنع في")}
          value={madeIn}
        />
        <ProductSpecCard
          icon={
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20V8l8-5 8 5v12h-5v-7H9v7H4zm7 0v-5h2v5h-2zM2 22h20v2H2v-2z" />
            </svg>
          }
          label={tx("dealDetails.product.factoryName", "Factory name", "اسم المصنع")}
          value={factoryName}
        />
        <ProductSpecCard
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 16v4h-4M4 4l6 6M20 20l-6-6" />
            </svg>
          }
          label={tx("dealDetails.product.size", "Size", "المقاس")}
          value={size}
        />
        <ProductSpecCard
          icon={
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3a9 9 0 00-9 9c0 3.3 3 6 6 6h1.5a1.5 1.5 0 010 3H12a9 9 0 000-18zm-4.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-3.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm2.5 3.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
            </svg>
          }
          label={tx("dealDetails.product.color", "Color", "اللون")}
          value={colorValue}
          swatches={colorSwatches}
        />
      </div>
    </div>
  );
};

const DeliveryTab = ({
  deal,
  tx,
  isRTL,
}: {
  deal: Deal;
  tx: TranslateFn;
  isRTL: boolean;
}) => {
  const deliveryTerms = deal.detailContent?.deliveryTerms || [];
  const textAlign = isRTL ? "text-right" : "text-left";

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-primary-500">
        {tx("dealDetails.delivery.title", "Sharena delivery terms", "شروط توصيل شرينا")}
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
              "تعتمد التغطية على مدينتك المختارة. يقوم شركاء شرينا بالتوصيل في المناطق المدعومة داخل المملكة."
            )}
          </p>
        </>
      )}
    </div>
  );
};

const PaymentTab = ({
  deal,
  tx,
  isRTL,
}: {
  deal: Deal;
  tx: TranslateFn;
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
