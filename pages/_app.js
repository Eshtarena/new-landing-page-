import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Eshtarena - Group Purchasing Power</title>
        <meta name="description" content="Eshtarena is a group purchasing management application for individuals and businesses, offering the best prices and biggest discounts through group offers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp); 