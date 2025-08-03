import React, { ReactNode } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialData {
  social: SocialLink[];
  apple: string;
  google: string;
}

interface AboutSectionProps {
  socialData: SocialData;
}

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function AboutSection({ socialData }: AboutSectionProps) {
  const { t } = useTranslation("common");

  const features: Feature[] = [
    {
      icon: (
        <svg
          className="w-full h-full text-[#340040]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: t("about.features.savings"),
      description: t("about.features.savingsDescription"),
    },
    {
      icon: (
        <svg
          className="w-full h-full text-[#340040]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: t("about.features.security"),
      description: t("about.features.securityDescription"),
    },
    {
      icon: (
        <svg
          className="w-full h-full text-[#340040]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: t("about.features.speed"),
      description: t("about.features.speedDescription"),
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#340040] mb-4">
            {t("about.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("about.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-[#340040]/10 rounded-full p-6 w-20 h-20 mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#340040] mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* App Download */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-[#340040] mb-8">
            {t("about.downloadApp")}
          </h3>
          <div className="flex justify-center space-x-4">
            {socialData.apple && (
              <Link href={socialData.apple} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/apple_store.svg"
                  alt="Download on App Store"
                  width={180}
                  height={60}
                  className="cursor-pointer"
                />
              </Link>
            )}
            {socialData.google && (
              <Link href={socialData.google} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/google_play.svg"
                  alt="Get it on Google Play"
                  width={180}
                  height={60}
                  className="cursor-pointer"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 