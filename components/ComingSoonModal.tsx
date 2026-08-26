import React, { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next/pages";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
  const dialogRef = useRef<HTMLDivElement>(null);

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft-lg text-center"
        onClick={(event) => event.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
          aria-label={t("appStore.close")}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500/10">
          <svg className="h-7 w-7 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 id="coming-soon-title" className="text-xl font-bold tracking-tight text-primary-500">
          {t("appStore.comingSoonTitle")}
        </h2>
        <p className="mt-2 text-gray-600">{t("appStore.comingSoonMessage")}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          {t("appStore.close")}
        </button>
      </div>
    </div>
  );
}
