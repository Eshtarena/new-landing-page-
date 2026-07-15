import type { AdviceArticle } from "../types/advice";

/**
 * Static advice content. Replace with API responses via AdviceService
 * without changing component contracts.
 */
export const MOCK_ADVICE_ARTICLES: AdviceArticle[] = [
  {
    id: "1",
    slug: "group-buying-basics",
    category: "deals",
    title_en: "How Group Buying Works on Eshtarena",
    title_ar: "كيف يعمل الشراء الجماعي على اشترينا",
    excerpt_en:
      "Learn how joining a group deal unlocks bulk pricing and bigger discounts for everyone.",
    excerpt_ar:
      "تعرف على كيفية انضمامك لعرض جماعي يفتح أسعار الجملة وخصومات أكبر للجميع.",
    content_en:
      "Group buying on Eshtarena lets you purchase alongside other shoppers to reach quantity thresholds that suppliers reserve for bulk orders.\n\nWhen enough participants join before the deal ends, everyone pays the lower group price automatically — no coupon codes or extra steps required.",
    content_ar:
      "الشراء الجماعي على اشترينا يتيح لك الشراء مع متسوقين آخرين للوصول إلى حدود الكميات التي يخصصها الموردون لطلبات الجملة.\n\nعندما ينضم عدد كافٍ من المشاركين قبل انتهاء العرض، يدفع الجميع سعر المجموعة المنخفض تلقائياً — دون أكواد خصم أو خطوات إضافية.",
    readTimeMinutes: 4,
    publishedAt: "2026-03-01T10:00:00.000Z",
    author_en: "Mohamed II",
    author_ar: "محمد II",
    advisorTitle_en: "SW Engineer",
    advisorTitle_ar: "مهندس برمجيات",
    likesCount: 1,
    sharesCount: 5,
  },
  {
    id: "2",
    slug: "maximize-voucher-savings",
    category: "vouchers",
    title_en: "5 Tips to Maximize Your Voucher Savings",
    title_ar: "٥ نصائح لتعظيم توفيرك من الكوبونات",
    excerpt_en:
      "Stack voucher deals with planned purchases to stretch your budget further.",
    excerpt_ar:
      "ادمج عروض الكوبونات مع مشترياتك المخططة لتمديد ميزانيتك أكثر.",
    content_en:
      "Buy vouchers during group offers when discounts are deepest, then spend them gradually at your favourite brands.\n\nTrack remaining balances in your Eshtarena wallet and enable notifications so you never miss an expiry or balance update.",
    content_ar:
      "اشترِ الكوبونات أثناء العروض الجماعية عندما تكون الخصومات في أعلى مستوياتها، ثم أنفقها تدريجياً لدى العلامات التجارية المفضلة لديك.\n\nتابع الأرصدة المتبقية في محفظة اشترينا وفعّل الإشعارات حتى لا تفوتك أي تواريخ انتهاء أو تحديثات للرصيد.",
    readTimeMinutes: 3,
    publishedAt: "2026-02-18T09:00:00.000Z",
    author_en: "Eshtarena Team",
    author_ar: "فريق اشترينا",
    advisorTitle_en: "Shopping Expert",
    advisorTitle_ar: "خبير تسوق",
    likesCount: 12,
    sharesCount: 8,
  },
  {
    id: "3",
    slug: "cold-deal-strategy",
    category: "deals",
    title_en: "When to Join a Cold Deal",
    title_ar: "متى تنضم لعرض بارد",
    excerpt_en:
      "Cold deals reward early buyers with automatic refunds if a better supplier price emerges.",
    excerpt_ar:
      "العروض الباردة تكافئ المشترين الأوائل باسترداد تلقائي إذا ظهر سعر أفضل من مورد آخر.",
    content_en:
      "Cold deals run longer so suppliers can compete in an open tender. Join when you need the product soon but still want upside if pricing improves.\n\nEshtarena refunds any price difference to your original payment method — you keep the product at the best final price.",
    content_ar:
      "العروض الباردة تمتد لفترة أطول ليتنافس الموردون في مناقصة مفتاحية. انضم عندما تحتاج المنتج قريباً مع رغبتك في الاستفادة إذا تحسّن السعر.\n\nاشترينا يسترد أي فرق في السعر إلى وسيلة الدفع الأصلية — تحصل على المنتج بأفضل سعر نهائي.",
    readTimeMinutes: 5,
    publishedAt: "2026-02-05T14:00:00.000Z",
    author_en: "Eshtarena Team",
    author_ar: "فريق اشترينا",
    advisorTitle_en: "Deal Analyst",
    advisorTitle_ar: "محلل عروض",
    likesCount: 7,
    sharesCount: 3,
  },
  {
    id: "4",
    slug: "smart-shopping-checklist",
    category: "shopping",
    title_en: "A Smart Shopping Checklist Before You Buy",
    title_ar: "قائمة تسوق ذكية قبل الشراء",
    excerpt_en:
      "Compare market price, supplier policies, and deal timers before committing.",
    excerpt_ar:
      "قارن سعر السوق وسياسات المورد ومواعيد العرض قبل اتخاذ قرار الشراء.",
    content_en:
      "Review the supplier profile, return policy, and deal progress bar on every product page.\n\nSet a personal budget cap and check how much time remains — urgency is useful, but informed decisions save more in the long run.",
    content_ar:
      "راجع ملف المورد وسياسة الإرجاع وشريط تقدم العرض في كل صفحة منتج.\n\nحدد سقفاً لميزانيتك وتحقق من الوقت المتبقي — الإلحاح مفيد، لكن القرارات المدروسة توفر أكثر على المدى الطويل.",
    readTimeMinutes: 4,
    publishedAt: "2026-01-22T11:00:00.000Z",
    author_en: "Eshtarena Team",
    author_ar: "فريق اشترينا",
    advisorTitle_en: "Consumer Advisor",
    advisorTitle_ar: "مستشار استهلاك",
    likesCount: 4,
    sharesCount: 2,
  },
  {
    id: "5",
    slug: "monthly-savings-plan",
    category: "savings",
    title_en: "Build a Monthly Savings Plan with Group Deals",
    title_ar: "ابنِ خطة توفير شهرية عبر العروض الجماعية",
    excerpt_en:
      "Plan recurring purchases around active deals to cut household costs consistently.",
    excerpt_ar:
      "خطط للمشتريات المتكررة حول العروض النشطة لتقليل تكاليف الأسرة باستمرار.",
    content_en:
      "List essentials you buy every month — groceries, personal care, electronics — then watch Eshtarena for matching group offers.\n\nBuying ahead during a strong deal often beats waiting for ad-hoc sales, especially on vouchers with no usage restrictions.",
    content_ar:
      "اكتب احتياجاتك الشهرية — البقالة، العناية الشخصية، الإلكترونيات — ثم راقب اشترينا للعروض الجماعية المناسبة.\n\nالشراء مسبقاً أثناء عرض قوي غالباً أفضل من انتظار تخفيضات عشوائية، خاصة على الكوبونات بدون قيود استخدام.",
    readTimeMinutes: 6,
    publishedAt: "2026-01-10T08:00:00.000Z",
    author_en: "Eshtarena Team",
    author_ar: "فريق اشترينا",
    advisorTitle_en: "Savings Coach",
    advisorTitle_ar: "مدرب توفير",
    likesCount: 9,
    sharesCount: 6,
  },
  {
    id: "6",
    slug: "verify-supplier-trust",
    category: "shopping",
    title_en: "How to Verify a Supplier Before You Order",
    title_ar: "كيف تتحقق من المورد قبل الطلب",
    excerpt_en:
      "Use verified badges, reviews, and return policies to shop with confidence.",
    excerpt_ar:
      "استخدم شارات التحقق والتقييمات وسياسات الإرجاع للتسوق بثقة.",
    content_en:
      "Every deal on Eshtarena links to a supplier profile with verification status and after-sales policies.\n\nRead recent buyer feedback when available and confirm delivery regions match your location before checkout.",
    content_ar:
      "كل عرض على اشترينا يرتبط بملف مورد يتضمن حالة التحقق وسياسات ما بعد البيع.\n\nاقرأ آراء المشترين الأخيرة عند توفرها وتأكد أن مناطق التوصيل تشمل موقعك قبل إتمام الشراء.",
    readTimeMinutes: 3,
    publishedAt: "2025-12-28T16:00:00.000Z",
    author_en: "Eshtarena Team",
    author_ar: "فريق اشترينا",
    advisorTitle_en: "Trust & Safety",
    advisorTitle_ar: "الثقة والأمان",
    likesCount: 2,
    sharesCount: 1,
  },
];

export const ADVICE_CATEGORIES = [
  "all",
  "savings",
  "deals",
  "shopping",
  "vouchers",
] as const;
