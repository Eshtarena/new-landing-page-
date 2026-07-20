import { GetServerSideProps } from "next";

export default function EggyAliasPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const localePrefix = locale ? `/${locale}` : "";

  return {
    redirect: {
      destination: `${localePrefix}/egy`,
      permanent: false,
    },
  };
};
