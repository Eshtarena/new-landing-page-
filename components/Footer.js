import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { STORES_IMAGES_LINKS } from '../utils/consts';

export default function Footer({ socialData }) {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-[#340040] text-white py-12">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* First Column - Logo and Social Links */}
          <div className="flex flex-col space-y-6">
            <div className="w-40">
              <Image
                src="/Eshtarena_icon.svg"
                alt="Eshtarena"
                width={160}
                height={40}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {Array.isArray(socialData?.social) && socialData.social.map((social) => (
                <a
                  key={social._id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 relative hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={social.logo}
                    alt={social.title}
                    fill
                    className="object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Second Column - Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold mb-2">{t('footer.links')}</h3>
            <Link 
              href="https://eshtarena.com/terms-conditions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors"
            >
              {t('footer.terms')}
            </Link>
            <Link 
              href="https://eshtarena.com/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors"
            >
              {t('footer.privacy')}
            </Link>
          </div>

          {/* Third Column - Download App */}
          <div className="flex flex-col space-y-6">
            <p className="text-lg font-semibold">
              {t('footer.downloadApp')}
            </p>
            <div className="flex gap-4">
              {socialData.apple && (
                <Link 
                  href={socialData.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] max-w-[120px]"
                >
                  <Image
                    src={STORES_IMAGES_LINKS.apple}
                    alt="Download on App Store"
                    width={120}
                    height={36}
                    className="w-full h-auto"
                  />
                </Link>
              )}
              {socialData.google && (
                <Link 
                  href={socialData.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] max-w-[120px]"
                >
                  <Image
                    src={STORES_IMAGES_LINKS.google}
                    alt="Get it on Google Play"
                    width={120}
                    height={36}
                    className="w-full h-auto"
                  />
                </Link>
              )}
            </div>
            <p className="text-sm opacity-80">
              © 2024 : All rights reserved by ESHTARENA LTD IBC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 