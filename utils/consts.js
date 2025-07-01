export const SLIDER_IMAGES = {
  en: [
    "/banners/english/1.webp",
    "/banners/english/2.webp",
    "/banners/english/3.webp",
    "/banners/english/4.webp",
    "/banners/english/5.webp",
    "/banners/english/6.webp",
    "/banners/english/7.webp",
    "/banners/english/8.webp",
    "/banners/english/9.webp",
    "/banners/english/10.webp",
  ],
  ar: [
    "/banners/arabic/1.webp",
    "/banners/arabic/2.webp",
    "/banners/arabic/3.webp",
    "/banners/arabic/4.webp",
    "/banners/arabic/5.webp",
    "/banners/arabic/6.webp",
    "/banners/arabic/7.webp",
    "/banners/arabic/8.webp",
    "/banners/arabic/9.webp",
    "/banners/arabic/10.webp",
  ],
};
export const LANDING_IMAGES = {
  en: {
    coldDeal: "/landing_page/english/cold_deal.webp",
    originalDeal: "/landing_page/english/original_deal.webp",
    voucherDeal: "/landing_page/english/voucher_deal.webp",
    voucherDeal2: "/landing_page/english/voucher_deal2.webp",
    yourNeedsEasily: "/landing_page/english/your_needs_easily.webp",
  },
  ar: {
    coldDeal: "/landing_page/arabic/cold_deal.webp",
    originalDeal: "/landing_page/arabic/original_deal.webp",
    voucherDeal: "/landing_page/arabic/voucher_deal.webp",
    voucherDeal2: "/landing_page/arabic/voucher_deal2.webp",
    yourNeedsEasily: "/landing_page/arabic/your_needs_easily.webp",
  },
};

export const DEALS_DATA = [
  {
    id: "original",
    translationKey: "deals.originalDeal",
    imageSrc: {
      ar: LANDING_IMAGES.ar.originalDeal,
      en: LANDING_IMAGES.en.originalDeal,
    },
    imageAlt: "Original Deal",
    hasBgColor: true,
    isReversed: false,
  },
  {
    id: "voucher",
    translationKey: "deals.voucherDeal",
    imageSrc: {
      ar: LANDING_IMAGES.ar.voucherDeal2,
      en: LANDING_IMAGES.en.voucherDeal2,
    },
    imageAlt: "Voucher Deal",
    hasBgColor: false,
    isReversed: false,
  },
  {
    id: "howToUse",
    translationKey: "deals.vouchers.howToUse",
    imageSrc: {
      ar: LANDING_IMAGES.ar.voucherDeal,
      en: LANDING_IMAGES.en.voucherDeal,
    },
    imageAlt: "Voucher App Screen",
    imageIsPhone: true,
    hasBgColor: false,
    isReversed: false,
  },
  {
    id: "cold",
    translationKey: "deals.coldDeal",
    imageSrc: {
      ar: LANDING_IMAGES.ar.coldDeal,
      en: LANDING_IMAGES.en.coldDeal,
    },
    imageAlt: "Cold Deal",
    hasBgColor: true,
    isReversed: false,
  },
];

export const STORES_IMAGES_LINKS = {
  google: "/google_store.png",
  apple: "/app_store.png",
};

// {
//   "about": {
//       "social": [
//           {
//               "_id": "65e5c494da0b36dd03385480",
//               "title": "youtube",
//               "logo": "a91d399e-c2bf-4d34-ac0b-992c14644be9.webp",
//               "link": "https://youtube.com/@eshtarena?si=xknZdX29hgCWhS-Q",
//               "createdAt": "2024-03-04T12:54:44.143Z",
//               "__v": 0
//           },
//           {
//               "_id": "67850c42b5cc63aec28ecb0c",
//               "title": "facebook",
//               "logo": "1f793b41-a837-4147-8fdb-0d4b05957fd7.webp",
//               "link": "https://www.facebook.com/eshtarena",
//               "createdAt": "2025-01-13T12:51:14.087Z",
//               "__v": 0
//           },
//           {
//               "_id": "67850cc3b5cc63aec28ecb15",
//               "title": "x",
//               "logo": "ddca29c6-9f55-49f9-9fa9-8fa4785fa157.webp",
//               "link": "https://x.com/eshtarena",
//               "createdAt": "2025-01-13T12:53:23.723Z",
//               "__v": 0
//           },
//           {
//               "_id": "67858efc58d7a29022c0d6d0",
//               "title": "instagram",
//               "logo": "5c991b38-cab7-431c-a953-179f354665cb.webp",
//               "link": "https://www.instagram.com/eshtarenaeg/",
//               "createdAt": "2025-01-13T22:09:00.037Z",
//               "__v": 0
//           },
//           {
//               "_id": "6785913458d7a29022c0d6f6",
//               "title": "snapchat",
//               "logo": "d55ec2f5-08c2-4990-9bb5-cfe8b678b1f8.webp",
//               "link": "https://www.snapchat.com/add/eshtarena.eg",
//               "createdAt": "2025-01-13T22:18:28.193Z",
//               "__v": 0
//           },
//           {
//               "_id": "678591f658d7a29022c0d6fd",
//               "title": "tiktok",
//               "logo": "d50c43e5-9170-4d4b-9e93-bb5012a84fc3.webp",
//               "link": "https://www.tiktok.com/@eshtarena",
//               "createdAt": "2025-01-13T22:21:42.962Z",
//               "__v": 0
//           },
//           {
//               "_id": "6785924758d7a29022c0d704",
//               "title": "linkedin",
//               "logo": "6308caf9-d67f-45f5-b8cc-5f46125003b9.webp",
//               "link": "https://www.linkedin.com/company/eshtarena",
//               "createdAt": "2025-01-13T22:23:03.753Z",
//               "__v": 0
//           }
//       ],
//       "google": "https://play.google.com/store/apps/details?id=haai.manifestodev",
//       "apple": "https://apps.apple.com/eg/app/haai/id6475014639"
//   }
// }
