import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import AdviceCard from "./AdviceCard";
import type { AdviceArticle } from "../../types/advice";
import { resolveAdviceLabel } from "../../utils/adviceText";

interface AdviceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: AdviceArticle;
  isArabic: boolean;
  categoryLabel: string;
  readTimeLabel: string;
  cardTitle: string;
}

export default function AdviceDetailModal({
  isOpen,
  onClose,
  article,
  isArabic,
  categoryLabel,
  readTimeLabel,
  cardTitle,
}: AdviceDetailModalProps) {
  const { t } = useTranslation("common");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeLabel = resolveAdviceLabel(
    t("advice.close", { defaultValue: isArabic ? "إغلاق" : "Close" }),
    "advice.close",
    isArabic,
    "إغلاق",
    "Close"
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 animate-[fadeIn_0.2s_ease-out]"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`advice-modal-${article.id}`}
        className="relative flex w-full max-w-lg max-h-[90vh] flex-col animate-[modalIn_0.35s_var(--ease-spring)_forwards] sm:max-h-[85vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/30 sm:top-4 sm:end-4 sm:h-10 sm:w-10"
          aria-label={closeLabel}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-3xl">
          <AdviceCard
            article={article}
            isArabic={isArabic}
            categoryLabel={categoryLabel}
            readTimeLabel={readTimeLabel}
            cardTitle={cardTitle}
            variant="full"
            className="rounded-t-3xl sm:rounded-3xl hover:translate-y-0"
          />
        </div>
      </div>
    </div>
  );
}
