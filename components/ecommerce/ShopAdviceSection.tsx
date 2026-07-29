import React from "react";
import { useTranslation } from "react-i18next";
import AdviceCard from "../advice/AdviceCard";
import { useAdviceArticles } from "../../hooks/useAdviceArticles";

export default function ShopAdviceSection() {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const { articles, isLoading } = useAdviceArticles(10);

  if (!isLoading && articles.length === 0) return null;

  return (
    <section
      className="w-full pt-6 pb-2 lg:pt-2 lg:pb-12"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t("advice.pageTitle")}
    >
      {isLoading ? (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="w-full h-52 rounded-3xl bg-gray-100 animate-pulse lg:h-48" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {articles.map((article) => (
            <div key={article.id} className="w-full min-w-0">
              <AdviceCard
                article={article}
                isArabic={isRTL}
                categoryLabel={t(`advice.categories.${article.category}`)}
                readTimeLabel={t("advice.readTime", { minutes: article.readTimeMinutes })}
                cardTitle={t("advice.cardTitle")}
                className="lg:h-full"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
