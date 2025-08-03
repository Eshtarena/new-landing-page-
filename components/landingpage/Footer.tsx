import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Logo from "../Logo";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialData {
  social: SocialLink[];
  apple: string;
  google: string;
}

interface FooterProps {
  socialData: SocialData;
}

export default function Footer({ socialData }: FooterProps) {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-[#340040] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Logo
              width={150}
              height={40}
              className="mb-4"
              href="/"
            />
            <p className="text-gray-300 text-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="#deals" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.deals")}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.support")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.help")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Download Apps */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.downloadApp")}
            </h3>
            <div className="space-y-3">
              <a
                href={socialData.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/app_store.png"
                  alt="Download on App Store"
                  width={150}
                  height={50}
                  className="rounded"
                />
              </a>
              <a
                href={socialData.google}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/google_store.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={50}
                  className="rounded"
                />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-600" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 Eshtarena. {t("footer.allRightsReserved")}
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialData.social.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <span className="sr-only">{link.platform}</span>
                {/* You can add specific icons for each platform here */}
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 