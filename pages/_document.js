import Document, { Html, Head, Main, NextScript } from 'next/document';
import { i18n } from '../next-i18next.config';

export default class MyDocument extends Document {
  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale || i18n.defaultLocale;
    return (
      <Html lang={currentLocale} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
        <Head>
          <link rel="icon" type="image/png" href="/Eshtarena_icon.png" />
          <link rel="apple-touch-icon" href="/Eshtarena_icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
} 