import { appWithTranslation } from 'next-i18next/pages';
import Head from 'next/head';
import { GoogleTagManager } from '@next/third-parties/google';
import { Inter, Cairo } from 'next/font/google';
import ScrollRestoration from '../components/ScrollRestoration';
import LocaleDirectionSync from '../components/LocaleDirectionSync';
import '../styles/globals.css';

// Variable fonts: all weights (light -> extrabold) come from a single file.
// Inter drives the LTR (English) layout, Cairo the RTL (Arabic) layout —
// globals.css switches between them via the html[dir] attribute.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sharena</title>
        <meta name="description" content="The Group Shopping App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx global>{`
        html {
          --font-inter: ${inter.style.fontFamily};
          --font-cairo: ${cairo.style.fontFamily};
        }
      `}</style>
      <GoogleTagManager gtmId="GTM-K83JQDPF" />
      <LocaleDirectionSync />
      <ScrollRestoration />
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
