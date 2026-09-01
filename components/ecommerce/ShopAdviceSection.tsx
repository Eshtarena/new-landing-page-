import React from "react";
import { useTranslation } from "react-i18next";
import AdviceCard from "../advice/AdviceCard";
import { useAdviceArticles } from "../../hooks/useAdviceArticles";

export default function ShopAdviceSection() {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const { articles, isLoading } = useAdviceArticles(10);

  return (
    <section
      className="w-full pt-6 pb-2 lg:pt-2 lg:pb-12"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t("advice.pageTitle")}
    >
      {isLoading ? (
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="w-full h-52 rounded-3xl bg-gray-100 animate-pulse lg:h-48" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-black/5">
          <p className="text-gray-600">{t("advice.noArticles")}</p>
        </div>
      ) : (
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {articles.map((article) => (
            <div key={article.id} className="w-full min-w-0">
              <AdviceCard
                article={article}
                isArabic={isRTL}
                categoryLabel={t(`advice.categories.${article.category}`)}
                readTimeLabel={t("advice.readTime", { minutes: article.readTimeMinutes })}
                cardTitle={t("advice.cardTitle")}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
