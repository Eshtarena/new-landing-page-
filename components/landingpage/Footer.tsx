import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

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
            <Image
              src="/eshtarena_logo.svg"
              alt="Eshtarena Logo"
              width={150}
              height={40}
              className="mb-4"
            />
            <p className="text-gray-300 text-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Download Apps */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.downloadApp")}</h3>
            <div className="space-y-3">
              {socialData.apple && (
                <Link href={socialData.apple} target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/apple_store.svg"
                    alt="Download on App Store"
                    width={140}
                    height={40}
                    className="cursor-pointer"
                  />
                </Link>
              )}
              {socialData.google && (
                <Link href={socialData.google} target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/google_play.svg"
                    alt="Get it on Google Play"
                    width={140}
                    height={40}
                    className="cursor-pointer"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.followUs")}</h3>
            <div className="flex space-x-4">
              {socialData.social.map((link) => (
                <Link
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <span className="sr-only">{link.platform}</span>
                  <i className={`fab fa-${link.platform.toLowerCase()} text-2xl`}></i>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Eshtarena. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
} 