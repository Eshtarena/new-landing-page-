import { appWithTranslation } from 'next-i18next/pages';
import { useRouter } from 'next/router';
import { GoogleTagManager } from '@next/third-parties/google';
import localFont from 'next/font/local';
import ScrollRestoration from '../components/ScrollRestoration';
import LocaleTransition from '../components/LocaleTransition';
import LocaleDirectionSync from '../components/LocaleDirectionSync';
import ErrorBoundary from '../components/ErrorBoundary';
import SiteHead from '../components/SiteHead';
import '../styles/globals.css';

// Self-hosted variable fonts — avoids build-time fetches from Google Fonts.
// Inter drives the LTR (English) layout, Cairo the RTL (Arabic) layout —
// globals.css switches between them via the html[dir] attribute.
const inter = localFont({
  src: '../assets/fonts/inter-latin-wght-normal.woff2',
  display: 'swap',
  weight: '100 900',
});

const cairo = localFont({
  src: [
    {
      path: '../assets/fonts/cairo-arabic-wght-normal.woff2',
      weight: '200 1000',
      style: 'normal',
    },
    {
      path: '../assets/fonts/cairo-latin-wght-normal.woff2',
      weight: '200 1000',
      style: 'normal',
    },
  ],
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <SiteHead />
      <style jsx global>{`
        html {
          --font-inter: ${inter.style.fontFamily};
          --font-cairo: ${cairo.style.fontFamily};
        }
      `}</style>
      <GoogleTagManager gtmId="GTM-K83JQDPF" />
      <LocaleDirectionSync />
      <ScrollRestoration />
      <ErrorBoundary router={router}>
        <LocaleTransition>
          <Component {...pageProps} />
        </LocaleTransition>
      </ErrorBoundary>
    </>
  );
}

export default appWithTranslation(MyApp);
