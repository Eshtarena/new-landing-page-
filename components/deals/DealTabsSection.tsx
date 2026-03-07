import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Deal, VoucherDeal } from '../../types/deals';
import { COLORS } from '../../utils/colors';
import { DEAL_DETAILS_LABELS } from '../../utils/dealDetailsLabels';
import type { DealDetailsLang } from '../../utils/dealDetailsLabels';

type Lang = 'en' | 'ar';

interface DealTabsSectionProps {
  deal: Deal;
  /** Selected language so tab content (e.g. terms) can show Arabic when lang is ar */
  lang?: Lang;
  /** When 'payment-and-terms', only show Payment and Deal terms tabs (for deal details page). */
  variant?: 'full' | 'payment-and-terms';
}

interface TabConfig {
  id: string;
  labelKey: string;
  /** Fallback when i18n isn't loaded (e.g. on /v1/deal/... pages) */
  defaultLabel: string;
  icon: React.ReactNode;
}

const PAYMENT_TAB: TabConfig = {
  id: 'payment',
  labelKey: 'deals.detailsPage.payment',
  defaultLabel: 'Payment',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
};

const TERMS_TAB: TabConfig = {
  id: 'terms',
  labelKey: 'deals.detailsPage.termsAndConditions',
  defaultLabel: 'Deal terms',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const ABOUT_DEAL_TAB: TabConfig = {
  id: 'about',
  labelKey: 'deals.detailsPage.aboutDeal',
  defaultLabel: 'About deal',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function DealTabsSection({ deal, lang = 'en', variant = 'payment-and-terms' }: DealTabsSectionProps) {
  const { t } = useTranslation('common');
  const isPaymentAndTermsOnly = variant === 'payment-and-terms';
  const [activeTab, setActiveTab] = useState(isPaymentAndTermsOnly ? 'about' : 'description');
  const dealLabels = DEAL_DETAILS_LABELS[lang as DealDetailsLang];

  const fullTabs: TabConfig[] = [
    {
      id: 'description',
      labelKey: 'deals.detailsPage.description',
      defaultLabel: 'Description',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
    {
      id: 'details',
      labelKey: 'deals.detailsPage.details',
      defaultLabel: 'Details',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    TERMS_TAB,
  ];

  const tabs = isPaymentAndTermsOnly ? [ABOUT_DEAL_TAB, PAYMENT_TAB, TERMS_TAB] : fullTabs;

  const renderTabContent = () => {
    if (activeTab === 'about') return <AboutDealTab deal={deal} lang={lang} />;
    if (activeTab === 'payment') return <PaymentTab deal={deal} lang={lang} />;
    if (activeTab === 'terms') return <TermsTab deal={deal} lang={lang} />;
    switch (activeTab) {
      case 'description':
        return <DescriptionTab deal={deal} />;
      case 'details':
        return <DetailsTab deal={deal} />;
      default:
        return <DescriptionTab deal={deal} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                borderBottomColor: activeTab === tab.id ? COLORS.darkViolet : 'transparent',
                backgroundColor: activeTab === tab.id ? COLORS.darkViolet : 'transparent'
              }}
            >
              {isPaymentAndTermsOnly && tab.id === 'about'
                ? dealLabels.tabAboutDeal
                : isPaymentAndTermsOnly && tab.id === 'payment'
                  ? dealLabels.tabPayment
                  : isPaymentAndTermsOnly && tab.id === 'terms'
                    ? dealLabels.tabDealTerms
                    : t(tab.labelKey, tab.defaultLabel)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

// Description Tab Component (no heading – tab label is enough)
const DescriptionTab = ({ deal }: { deal: Deal }) => (
  <div className="space-y-4">
    <div className="prose max-w-none">
      {deal.description ? (
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {deal.description}
        </p>
      ) : (
        <>
          <p className="text-gray-700 leading-relaxed">
            This exclusive deal offers you the opportunity to save significantly on premium products.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
            <li>Premium quality guaranteed</li>
            <li>Fast delivery within 2-3 business days</li>
            <li>30-day return policy</li>
            <li>Customer support available 24/7</li>
          </ul>
        </>
      )}
    </div>
  </div>
);

// Details Tab Component (no heading – tab label is enough)
const DetailsTab = ({ deal }: { deal: Deal }) => {
  const { t } = useTranslation('common');
  return (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.category', 'Category')}:</span>
          <span className="text-gray-900">{deal.category || 'General'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.supplier', 'Supplier')}:</span>
          <span className="text-gray-900">{deal.supplier || 'Eshtarena Partner'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.dealType', 'Deal Type')}:</span>
          <span className="text-gray-900 capitalize">{deal.dealType}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.location', 'Location')}:</span>
          <span className="text-gray-900">{deal.location.text}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.totalQuantity', 'Total Quantity')}:</span>
          <span className="text-gray-900">{deal.quantity.sold + deal.quantity.available}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.sold', 'Sold')}:</span>
          <span className="text-gray-900">{deal.quantity.sold}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.available', 'Available')}:</span>
          <span className="text-gray-900">{deal.quantity.available}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">{t('deals.detailsPage.status', 'Status')}:</span>
          <span className={`font-medium ${deal.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {deal.statusLabel ?? (deal.isActive ? 'Active' : 'Inactive')}
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

// About deal tab – description, voucher expiry, supplier, purchasing expert advice (all from deal data)
const AboutDealTab = ({ deal, lang }: { deal: Deal; lang: Lang }) => {
  const labels = DEAL_DETAILS_LABELS[lang as DealDetailsLang];
  const whatIsTitle =
    deal.dealType === 'voucher'
      ? labels.whatIsVoucherDeal
      : deal.dealType === 'cold'
        ? labels.whatIsColdDeal
        : labels.whatIsOriginalDeal;
  const fallback = lang === 'ar' ? 'عرض شراء جماعي من اشترينا.' : 'Group purchase deal from Eshtarena.';
  const content = deal.description || fallback;
  const isVoucher = deal.dealType === 'voucher';
  const expireDate = isVoucher && 'expireDate' in deal ? (deal as VoucherDeal).expireDate : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{whatIsTitle}</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>

      {/* Voucher expiry date (voucher only) */}
      {expireDate && (
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-600">{labels.voucherExpiryDate}</p>
            <p className="text-base font-semibold" style={{ color: COLORS.darkViolet }}>
              {expireDate}
            </p>
          </div>
        </div>
      )}

      {/* Supplier – logo and name */}
      {deal.supplier && (
        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: COLORS.darkViolet }}>
            {labels.supplier}
          </h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {deal.supplierPic ? (
              <img
                src={deal.supplierPic}
                alt={deal.supplier}
                className="w-12 h-12 rounded-lg object-cover bg-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-bold" style={{ color: COLORS.darkViolet }}>
                {deal.supplier.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{deal.supplier}</p>
            </div>
          </div>
        </div>
      )}

      {/* Purchasing expert advice */}
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold" style={{ color: COLORS.darkViolet }}>
          {labels.purchasingExpertAdvice}
        </span>
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Payment tab – payment terms (voucher: from API; others: default message)
const PaymentTab = ({ deal, lang }: { deal: Deal; lang: Lang }) => {
  const voucherDeal = deal.dealType === 'voucher' ? (deal as VoucherDeal) : null;
  const paymentTerms = voucherDeal?.paymentTerms;
  const isEn = lang === 'en';
  if (paymentTerms?.length) {
    return (
      <div className="space-y-4">
        <div className="prose max-w-none text-gray-700">
          <div className="space-y-6">
            {paymentTerms.map((term, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900">{term.title}</h4>
                <p className="mt-1 leading-relaxed">{term.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="text-gray-600">
      <p>{isEn ? 'Payment terms are provided when you join the deal in the app.' : 'تُقدّم شروط الدفع عند الانضمام للعرض في التطبيق.'}</p>
    </div>
  );
};

// Default terms when API doesn't provide payment terms – show in selected language
const DEFAULT_TERMS: Record<Lang, Array<{ title: string; description: string }>> = {
  en: [
    { title: '1. Deal Validity', description: 'This deal is valid until the timer expires or all quantities are sold, whichever comes first.' },
    { title: '2. Payment Terms', description: 'Payment must be completed within 24 hours of joining the deal to secure your spot.' },
    { title: '3. Delivery', description: 'Delivery will commence once the deal reaches minimum participation requirements.' },
    { title: '4. Cancellation Policy', description: 'Cancellations are allowed up to 2 hours after joining the deal, subject to availability.' },
    { title: '5. Returns & Refunds', description: 'Standard return policy applies. Items must be in original condition within 30 days of delivery.' },
  ],
  ar: [
    { title: '١. صلاحية العرض', description: 'هذا العرض ساري حتى انتهاء المؤقت أو بيع الكمية المحددة، أيهما يأتي أولاً.' },
    { title: '٢. شروط الدفع', description: 'يجب إتمام الدفع خلال 24 ساعة من الانضمام للعرض لضمان مكانك.' },
    { title: '٣. التوصيل', description: 'يبدأ التوصيل بعد وصول العرض إلى الحد الأدنى لمتطلبات المشاركة.' },
    { title: '٤. سياسة الإلغاء', description: 'يُسمح بالإلغاء حتى ساعتين بعد الانضمام للعرض، وفقاً للتوفر.' },
    { title: '٥. المرتجعات والاسترداد', description: 'تنطبق سياسة الإرجاع المعتادة. يجب أن تكون المنتجات بحالتها الأصلية خلال 30 يوماً من الاستلام.' },
  ],
};

// Terms Tab – API payment terms (already in deal language) or default terms by lang
const TermsTab = ({ deal, lang = 'en' }: { deal: Deal; lang?: Lang }) => {
  const voucherDeal = deal.dealType === 'voucher' ? (deal as VoucherDeal) : null;
  const paymentTerms = voucherDeal?.paymentTerms;
  const termsToShow = paymentTerms?.length ? paymentTerms : DEFAULT_TERMS[lang];

  return (
    <div className="space-y-4">
      <div className="prose max-w-none text-gray-700">
        <div className="space-y-6">
          {termsToShow.map((term, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900">{term.title}</h4>
              <p className="mt-1 leading-relaxed">{term.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
