/**
 * Deal detail page labels by language (used when i18n may not be loaded on /v1/deal/... routes).
 */
export type DealDetailsLang = "en" | "ar";

export const DEAL_DETAILS_LABELS: Record<
  DealDetailsLang,
  {
    voucherValue: string;
    marketPrice: string;
    dealPrice: string;
    save: string;
    sold: string;
    available: string;
    voucherExpiryDate: string;
    supplier: string;
    whatIsVoucherDeal: string;
    whatIsColdDeal: string;
    whatIsOriginalDeal: string;
    purchasingExpertAdvice: string;
    downloadTheApp: string;
    timerDays: string;
    timerHrs: string;
    timerMins: string;
    timerSecs: string;
    statusEnded: string;
    statusOnGoing: string;
    tabAboutDeal: string;
    tabPayment: string;
    tabDealTerms: string;
    loading: string;
    goBack: string;
    dealNotFound: string;
    dealNotFoundMessage: string;
    pageTitle: string;
  }
> = {
  en: {
    voucherValue: "Voucher value",
    marketPrice: "Market price",
    dealPrice: "Deal Price",
    save: "Save",
    sold: "Sold",
    available: "Available",
    voucherExpiryDate: "Voucher expiry date",
    supplier: "Supplier",
    whatIsVoucherDeal: "What is Voucher deal?",
    whatIsColdDeal: "What is Cold deal?",
    whatIsOriginalDeal: "What is Original deal?",
    purchasingExpertAdvice: "Purchasing expert advice",
    downloadTheApp: "Download the app",
    timerDays: "Days",
    timerHrs: "Hrs",
    timerMins: "Mins",
    timerSecs: "Secs",
    statusEnded: "Ended",
    statusOnGoing: "On going",
    tabAboutDeal: "About deal",
    tabPayment: "Payment",
    tabDealTerms: "Deal terms",
    loading: "Loading deal details...",
    goBack: "Go Back",
    dealNotFound: "Deal Not Found",
    dealNotFoundMessage: "This deal does not exist.",
    pageTitle: "Deal details",
  },
  ar: {
    voucherValue: "قيمة القسيمة",
    marketPrice: "سعر السوق",
    dealPrice: "سعر العرض",
    save: "وفر",
    sold: "تم البيع",
    available: "متوفر",
    voucherExpiryDate: "تاريخ انتهاء القسيمة",
    supplier: "المورد",
    whatIsVoucherDeal: "ما هو عرض القسائم؟",
    whatIsColdDeal: "ما هو العرض البارد؟",
    whatIsOriginalDeal: "ما هو العرض الأصلي؟",
    purchasingExpertAdvice: "نصائح خبراء الشراء",
    downloadTheApp: "حمّل التطبيق",
    timerDays: "أيام",
    timerHrs: "ساعات",
    timerMins: "دقائق",
    timerSecs: "ثوانٍ",
    statusEnded: "منتهي",
    statusOnGoing: "جاري",
    tabAboutDeal: "حول العرض",
    tabPayment: "الدفع",
    tabDealTerms: "شروط العرض",
    loading: "جاري تحميل تفاصيل العرض...",
    goBack: "رجوع",
    dealNotFound: "العرض غير موجود",
    dealNotFoundMessage: "هذا العرض غير موجود.",
    pageTitle: "تفاصيل العرض",
  },
};
