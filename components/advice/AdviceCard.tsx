import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { AdviceArticle } from "../../types/advice";
import {
  getAdvicePreview,
  isAdviceTruncated,
  resolveAdviceLabel,
} from "../../utils/adviceText";
import AdviceDetailModal from "./AdviceDetailModal";

interface AdviceCardProps {
  article: AdviceArticle;
  isArabic: boolean;
  categoryLabel: string;
  readTimeLabel: string;
  cardTitle?: string;
  className?: string;
  preferFullContent?: boolean;
  compact?: boolean;
  variant?: "preview" | "full";
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z" />
    </svg>
  );
}

function AdvisorAvatar({
  avatarUrl,
  name,
}: {
  avatarUrl?: string;
  name: string;
}) {
  const safeName = name.trim() || "?";
  const initials = safeName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-11 h-11 rounded-full overflow-hidden bg-white/20 shrink-0 flex items-center justify-center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={safeName}
          width={44}
          height={44}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-white">{initials}</span>
      )}
    </div>
  );
}

function CategoryAvatar({
  imageUrl,
  label,
  overlap = false,
}: {
  imageUrl?: string;
  label: string;
  overlap?: boolean;
}) {
  return (
    <div
      className={`relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white/20 ring-2 ring-primary-500${
        overlap ? " -ms-2" : ""
      }`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          width={24}
          height={24}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function CategoryIndicators({
  categories,
}: {
  categories: Array<{ label: string; imageUrl?: string }>;
}) {
  if (categories.length === 0) return null;

  if (categories.length === 1) {
    const category = categories[0];

    return (
      <div className="inline-flex min-w-0 shrink-0 items-center gap-1.5">
        <CategoryAvatar imageUrl={category.imageUrl} label={category.label} />
        <span className="max-w-28 truncate text-xs font-medium text-white/90 sm:max-w-32">
          {category.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex shrink-0 items-center"
      aria-label={categories.map((category) => category.label).join(", ")}
    >
      {categories.map((category, index) => (
        <CategoryAvatar
          key={`${category.label}-${index}`}
          imageUrl={category.imageUrl}
          label={category.label}
          overlap={index > 0}
        />
      ))}
    </div>
  );
}

export default function AdviceCard({
  article,
  isArabic,
  categoryLabel,
  readTimeLabel,
  cardTitle = "Purchasing expert advice",
  className = "",
  preferFullContent = false,
  compact = false,
  variant = "preview",
}: AdviceCardProps) {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFullVariant = variant === "full";
  const useUniformPreview = !isFullVariant && !preferFullContent;

  const fullAdviceText = isArabic ? article.content_ar : article.content_en;
  const excerptText = isArabic ? article.excerpt_ar : article.excerpt_en;
  const adviceText = preferFullContent || isFullVariant
    ? fullAdviceText
    : excerptText;
  const title = (isArabic ? article.title_ar : article.title_en)?.trim() || "";
  const author = (isArabic ? article.author_ar : article.author_en)?.trim() || "";
  const advisorTitle = (isArabic ? article.advisorTitle_ar : article.advisorTitle_en)?.trim() || "";
  const resolvedCategoryLabel =
    categoryLabel.trim() ||
    (isArabic ? article.categoryName_ar : article.categoryName_en)?.trim() ||
    "";
  const categoryImageUrl = article.categoryImageUrl;
  const resolvedCategories = (article.categories?.length
    ? article.categories
        .map((category) => ({
          label: ((isArabic ? category.name_ar : category.name_en) || "").trim(),
          imageUrl: category.imageUrl,
        }))
        .filter((category) => category.label)
    : resolvedCategoryLabel
      ? [{ label: resolvedCategoryLabel, imageUrl: categoryImageUrl }]
      : []) as Array<{ label: string; imageUrl?: string }>;
  const displayName = author || title || "—";
  const subtitle = author ? advisorTitle || undefined : undefined;
  const showAdviceTitle = Boolean(author && title);
  const productImage = article.productImageUrl || article.imageUrl;
  const hasAdvisor = Boolean(author);
  const avatarUrl = article.advisorAvatarUrl || (!hasAdvisor ? productImage : undefined);
  const sideProductImage = hasAdvisor ? productImage : undefined;
  const likesCount = article.likesCount ?? 0;
  const sharesCount = article.sharesCount ?? 0;

  const resolvedShowMoreLabel = resolveAdviceLabel(
    t("advice.showMore", { defaultValue: isArabic ? "عرض المزيد" : "Show more" }),
    "advice.showMore",
    isArabic,
    "عرض المزيد",
    "Show more"
  );

  const shouldTruncate = useUniformPreview && isAdviceTruncated(fullAdviceText);
  const previewText = useUniformPreview
    ? getAdvicePreview(fullAdviceText)
    : adviceText;

  return (
    <>
      <article
        id={isFullVariant ? `advice-modal-${article.id}` : undefined}
        className={`${
          compact
            ? "rounded-2xl p-4 shadow-soft"
            : "rounded-3xl p-4 shadow-soft-lg transition-transform duration-300 ease-spring hover:-translate-y-0.5 sm:p-5"
        } bg-primary-500 overflow-hidden text-white ${
          useUniformPreview ? "flex h-full min-h-[17.5rem] flex-col sm:min-h-[18.5rem]" : ""
        } ${className}`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <p className={`font-medium text-white/90 ${compact ? "text-xs mb-3" : "text-sm mb-4"}`}>
          {cardTitle}
        </p>

        <div className={`flex items-start justify-between gap-3 ${compact ? "mb-2" : "mb-3"}`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <AdvisorAvatar avatarUrl={avatarUrl} name={displayName} />
            <div className="min-w-0 flex-1 text-center">
              <h2 className={`${compact ? "text-sm" : "text-base"} font-bold truncate`}>{displayName}</h2>
              {subtitle ? (
                <p className="text-xs text-white/60 truncate">{subtitle}</p>
              ) : null}
            </div>
          </div>

          {sideProductImage ? (
            <div className={`${compact ? "w-11 h-11" : "w-14 h-14 sm:w-16 sm:h-16"} rounded-xl overflow-hidden bg-white shrink-0`}>
              <Image
                src={sideProductImage}
                alt={title || displayName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className={`${useUniformPreview ? "flex min-h-0 flex-1 flex-col" : ""}`}>
          {showAdviceTitle && !compact ? (
            <h3 className={`text-sm font-semibold text-white/95 ${useUniformPreview ? "mb-2 line-clamp-1" : "mb-3"}`}>
              {title}
            </h3>
          ) : null}

          <div className={useUniformPreview ? "min-h-[4.5rem] flex-1 flex flex-col" : ""}>
            {useUniformPreview ? (
              <p className="text-sm leading-relaxed text-white/90 line-clamp-3">
                {previewText}
              </p>
            ) : (
              <p
                className={`${compact ? "text-xs mb-3 line-clamp-3" : `text-sm mb-5 ${preferFullContent || isFullVariant ? "whitespace-pre-line" : "line-clamp-2"}`} text-white/90 leading-relaxed`}
                dangerouslySetInnerHTML={{ __html: adviceText }}
              />
            )}

            {shouldTruncate ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-2 self-start text-sm font-medium text-white underline decoration-white/40 underline-offset-2 transition-colors hover:text-white/90 hover:decoration-white/70"
              >
                {resolvedShowMoreLabel}
              </button>
            ) : null}
          </div>
        </div>

        <footer className={`mt-auto flex items-center justify-between gap-x-4 gap-y-2 text-white/80 ${compact ? "text-xs pt-3" : "text-sm pt-5"}`}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <HeartIcon />
              {likesCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShareIcon />
              {sharesCount}
            </span>
            {!compact && (preferFullContent || isFullVariant) && readTimeLabel ? (
              <span className="text-xs text-white/60">{readTimeLabel}</span>
            ) : null}
          </div>

          <CategoryIndicators categories={resolvedCategories} />
        </footer>
      </article>

      {shouldTruncate ? (
        <AdviceDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          article={article}
          isArabic={isArabic}
          categoryLabel={categoryLabel}
          readTimeLabel={readTimeLabel}
          cardTitle={cardTitle}
        />
      ) : null}
    </>
  );
}
