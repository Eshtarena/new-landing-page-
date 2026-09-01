import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next/pages";
import type { AdviceArticle, AdviceCategory } from "../../types/advice";
import AdviceCard from "./AdviceCard";
import AdviceCategoryFilter, {
  type AdviceCategoryFilter as CategoryFilter,
} from "./AdviceCategoryFilter";

interface AdviceListProps {
  articles: AdviceArticle[];
}

export default function AdviceList({ articles }: AdviceListProps) {
  const { t, i18n } = useTranslation("common");
  const isArabic = i18n.language === "ar";
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const categoryLabels: Record<CategoryFilter, string> = {
    all: t("advice.categories.all"),
    savings: t("advice.categories.savings"),
    deals: t("advice.categories.deals"),
    shopping: t("advice.categories.shopping"),
    vouchers: t("advice.categories.vouchers"),
  };

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter(
      (article) => article.category === (activeCategory as AdviceCategory)
    );
  }, [articles, activeCategory]);

  return (
    <div className={isArabic ? "rtl" : "ltr"}>
      <AdviceCategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        labels={categoryLabels}
      />

      {filteredArticles.length > 0 ? (
        <div className="mt-6 grid max-w-4xl grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
          {filteredArticles.map((article) => (
            <AdviceCard
              key={article.id}
              article={article}
              isArabic={isArabic}
              categoryLabel={categoryLabels[article.category]}
              readTimeLabel={t("advice.readTime")}
              cardTitle={t("advice.cardTitle")}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center py-12 px-4 bg-white rounded-2xl border border-black/5">
          <p className="text-gray-600">
            {articles.length === 0 ? t("advice.noArticles") : t("advice.emptyState")}
          </p>
        </div>
      )}
    </div>
  );
}
