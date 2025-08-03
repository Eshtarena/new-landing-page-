import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";

interface Deal {
  id: number;
  image: {
    ar: string;
    en: string;
  };
  title: string;
  description: string;
}

export default function DealsSection() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isArabic = router.locale === "ar";

  const deals: Deal[] = [
    {
      id: 1,
      image: {
        ar: "/landing_page/arabic/cold_deal.png",
        en: "/landing_page/english/cold_deal.png"
      },
      title: t("deals.coldDeal"),
      description: t("deals.coldDealDescription"),
    },
    {
      id: 2,
      image: {
        ar: "/landing_page/arabic/original_deal.png",
        en: "/landing_page/english/original_deal.png"
      },
      title: t("deals.originalDeal"),
      description: t("deals.originalDealDescription"),
    },
    {
      id: 3,
      image: {
        ar: "/landing_page/arabic/voucher_deal.png",
        en: "/landing_page/english/voucher_deal.png"
      },
      title: t("deals.voucherDeal"),
      description: t("deals.voucherDealDescription"),
    },
  ];

  return (
    <section id="deals" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#340040] mb-4">
            {t("deals.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("deals.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={isArabic ? deal.image.ar : deal.image.en}
                  alt={deal.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#340040] mb-2">
                  {deal.title}
                </h3>
                <p className="text-gray-600">{deal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 