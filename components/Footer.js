import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { STORES_IMAGES_LINKS } from '../utils/consts';

export default function Footer({ socialData }) {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  return (
    <footer className="bg-[#340040] text-white py-12">
      <div className={`container-width ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* First Column - Logo and Social Links */}
          <div className={`flex flex-col items-center md:items-${isRTL ? 'end' : 'start'} space-y-6`}>
            <Link href="/" className="w-[180px] h-[45px] relative">
              <Image
                src="/app_icon.svg"
                alt="Eshtarena"
                fill
                priority
                className="object-contain brightness-0 invert"
              />
            </Link>
            <div className={`flex flex-wrap gap-4 justify-center md:justify-${isRTL ? 'end' : 'start'}`}>
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
          <div className={`flex flex-col items-center md:items-${isRTL ? 'end' : 'start'} space-y-4`}>
            <h3 className="text-lg font-semibold mb-2">{t('footer.links')}</h3>
            <Link 
              href="https://eshtarena.com/terms-conditions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors text-center md:text-inherit"
            >
              {t('footer.terms')}
            </Link>
            <Link 
              href="https://eshtarena.com/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100 hover:text-white hover:underline transition-colors text-center md:text-inherit"
            >
              {t('footer.privacy')}
            </Link>
          </div>

          {/* Third Column - Download App */}
          <div className={`flex flex-col items-center md:items-${isRTL ? 'end' : 'start'} space-y-6`}>
            <p className="text-lg font-semibold">
              {t('footer.downloadApp')}
            </p>
            <div className={`flex gap-4 justify-center md:justify-${isRTL ? 'end' : 'start'}`}>
              {socialData.apple && (
                <Link 
                  href={socialData.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[120px] h-[36px] relative"
                >
                  <Image
                    src={STORES_IMAGES_LINKS.apple}
                    alt="Download on App Store"
                    fill
                    className="object-contain"
                  />
                </Link>
              )}
              {socialData.google && (
                <Link 
                  href={socialData.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[120px] h-[36px] relative"
                >
                  <Image
                    src={STORES_IMAGES_LINKS.google}
                    alt="Get it on Google Play"
                    fill
                    className="object-contain"
                  />
                </Link>
              )}
            </div>
            <p className={`text-sm opacity-80 text-center md:text-${isRTL ? 'right' : 'left'}`}>
              © 2024 : All rights reserved by ESHTARENA LTD IBC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 