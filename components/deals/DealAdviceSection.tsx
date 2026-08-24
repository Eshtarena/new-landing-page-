import AdviceCard from "../advice/AdviceCard";
import type { AdviceArticle } from "../../types/advice";

interface DealAdviceSectionProps {
  advice: AdviceArticle;
  isArabic: boolean;
  cardTitle: string;
  readTimeLabel: string;
  className?: string;
}

export default function DealAdviceSection({
  advice,
  isArabic,
  cardTitle,
  readTimeLabel,
  className = "",
}: DealAdviceSectionProps) {
  const categoryLabel = isArabic ? advice.categoryName_ar : advice.categoryName_en;

  return (
    <AdviceCard
      article={advice}
      isArabic={isArabic}
      categoryLabel={categoryLabel || ""}
      readTimeLabel={readTimeLabel}
      cardTitle={cardTitle}
      className={className}
      preferFullContent
    />
  );
}
