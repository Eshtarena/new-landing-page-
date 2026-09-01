import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import AppStoreBadges from "../AppStoreBadges";
import { resolvePageLang } from "../../utils/resolvePageLang";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const isRTL = resolvePageLang(router, i18n.language) === "ar";
  const dialogRef = useRef<HTMLDivElement>(null);
  const tx = (key: string, en: string, ar: string) =>
    t(key, { defaultValue: isRTL ? ar : en });

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
        aria-labelledby="download-app-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-soft-lg"
        onClick={(event) => event.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
          aria-label={tx("dealDetails.downloadApp.close", "Close", "إغلاق")}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h2 id="download-app-title" className="text-2xl font-bold tracking-tight text-primary-500">
            {tx("dealDetails.downloadApp.title", "Get the Sharena App", "حمّل تطبيق شرينا")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {tx(
              "dealDetails.downloadApp.description",
              "Download the app to join this deal and complete your purchase securely.",
              "حمّل التطبيق للانضمام لهذا العرض وإتمام عملية الشراء بأمان."
            )}
          </p>
        </div>

        <AppStoreBadges
          containerClassName="mt-8 flex flex-wrap items-center justify-center gap-4"
          badgeClassName="w-[160px] h-[48px] relative block rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        />
      </div>
    </div>
  );
}
