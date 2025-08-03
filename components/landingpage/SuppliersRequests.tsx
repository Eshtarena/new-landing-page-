import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SuppliersRequests() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const isArabic = router.locale === "ar";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#340040] mb-6">
              {t("suppliers.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t("suppliers.description")}
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#340040] mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">
                  {t("suppliers.benefits.reach")}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#340040] mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">
                  {t("suppliers.benefits.tools")}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#340040] mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">
                  {t("suppliers.benefits.support")}
                </span>
              </li>
            </ul>
            <Link
              href="/join-suppliers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#340040] hover:bg-[#340040]/90"
            >
              {t("suppliers.joinButton")}
            </Link>
          </div>

          <div className="relative h-96">
            <Image
              src={
                isArabic
                  ? "/landing_page/arabic/your_needs_easily.png"
                  : "/landing_page/english/your_needs_easily.png"
              }
              alt={t("suppliers.imageAlt")}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 