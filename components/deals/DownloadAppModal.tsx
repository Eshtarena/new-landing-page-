import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import { APP_STORE_URLS } from "../../utils/appStore";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function buildQrCodeUrl(targetUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(targetUrl)}`;
}

export default function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";
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
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft-lg"
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
            {tx("dealDetails.downloadApp.title", "Get the Eshtarena App", "حمّل تطبيق اشترينا")}
          </h2>
          <p className="mt-2 text-gray-600">
            {tx(
              "dealDetails.downloadApp.description",
              "Scan a QR code with your phone to download the app and join this deal.",
              "امسح رمز QR بهاتفك لتحميل التطبيق والانضمام لهذا العرض."
            )}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href={APP_STORE_URLS.apple}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center transition-colors hover:border-primary-500/30"
          >
            <Image
              src={buildQrCodeUrl(APP_STORE_URLS.apple)}
              alt={tx("dealDetails.downloadApp.appleQrAlt", "App Store QR code", "رمز App Store")}
              width={160}
              height={160}
              unoptimized
              className="mx-auto rounded-lg"
            />
            <div className="mt-3 flex justify-center">
              <Image
                src={isRTL ? "/app-store-ar.svg" : "/app-store-en.svg"}
                alt={tx("dealDetails.downloadApp.appStore", "Download on the App Store", "تنزيل من App Store")}
                width={140}
                height={42}
              />
            </div>
          </a>

          <a
            href={APP_STORE_URLS.google}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center transition-colors hover:border-primary-500/30"
          >
            <Image
              src={buildQrCodeUrl(APP_STORE_URLS.google)}
              alt={tx("dealDetails.downloadApp.googleQrAlt", "Google Play QR code", "رمز Google Play")}
              width={160}
              height={160}
              unoptimized
              className="mx-auto rounded-lg"
            />
            <div className="mt-3 flex justify-center">
              <Image
                src={isRTL ? "/google-play-ar.svg" : "/google-play-en.svg"}
                alt={tx("dealDetails.downloadApp.googlePlay", "Get it on Google Play", "احصل عليه من Google Play")}
                width={140}
                height={42}
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
