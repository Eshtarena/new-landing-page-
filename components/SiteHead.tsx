import Head from "next/head";
import { useRouter } from "next/router";
import { getSiteMetadata } from "../utils/siteMetadata";

/**
 * Default HTML <head> metadata for the app.
 * Page-level next/head titles still win for inner routes.
 */
export default function SiteHead() {
  const { locale } = useRouter();
  const meta = getSiteMetadata(locale);

  return (
    <Head>
      <title>{meta.title}</title>
      <meta
        key="description"
        name="description"
        content={meta.description}
      />
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content={meta.siteName} />
      <meta key="og:title" property="og:title" content={meta.title} />
      <meta
        key="og:description"
        property="og:description"
        content={meta.description}
      />
      <meta key="og:locale" property="og:locale" content={meta.ogLocale} />
      <meta
        key="og:locale:alternate"
        property="og:locale:alternate"
        content={meta.ogLocaleAlternate}
      />

      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:title" name="twitter:title" content={meta.title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={meta.description}
      />
    </Head>
  );
}
