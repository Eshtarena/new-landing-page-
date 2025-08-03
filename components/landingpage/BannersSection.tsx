import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";

interface Banner {
  id: number;
  image: {
    ar: string;
    en: string;
  };
  title: string;
}

export default function BannersSection() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isArabic = router.locale === "ar";

  const banners: Banner[] = [
    {
      id: 1,
      image: {
        ar: "/banners/arabic/best_price_ar.png",
        en: "/banners/english/best_price_en.png"
      },
      title: t("banners.bestPrice"),
    },
    {
      id: 2,
      image: {
        ar: "/banners/arabic/buy_together_ar.png",
        en: "/banners/english/togther_en.png"
      },
      title: t("banners.buyTogether"),
    },
    {
      id: 3,
      image: {
        ar: "/banners/arabic/group_phones_ar.png",
        en: "/banners/english/phones_en.png"
      },
      title: t("banners.phones"),
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-[#340040] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative h-80 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={isArabic ? banner.image.ar : banner.image.en}
                alt={banner.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold text-center px-4">
                  {banner.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 