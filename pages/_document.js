import Document, { Html, Head, Main, NextScript } from "next/document";
import { i18n } from "../next-i18next.config";

export default class MyDocument extends Document {
  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale || i18n.defaultLocale;
    return (
      <Html lang={currentLocale} dir={currentLocale === "ar" ? "rtl" : "ltr"}>
        <Head>
          {/* Explicit UTF-8 so Arabic diacritics (حركات) render correctly */}
          <meta charSet="utf-8" />
          {/* Tab Icon (Favicon) - This icon appears in browser tab and bookmarks */}
          <link rel="icon" type="image/png" href="/logo%20best.png" />
          <link rel="apple-touch-icon" href="/logo%20best.png" />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-K83JQDPF"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
