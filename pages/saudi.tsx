import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import CountryHomePage from "./[countryCode]";

export default CountryHomePage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      countryCode: "saudi",
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
