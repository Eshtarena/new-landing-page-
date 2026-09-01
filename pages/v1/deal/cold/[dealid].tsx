import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import DealDetailsView from "../../../../components/deals/DealDetailsView";
import { getDealPageServerSideProps } from "../../../../utils/dealPageServerSideProps";

export default function ColdDealDetailsPage() {
  const router = useRouter();
  const dealid = router.query.dealid as string | undefined;
  return <DealDetailsView id={dealid} dealType="cold" />;
}

export const getServerSideProps: GetServerSideProps = async (context) =>
  getDealPageServerSideProps(context);
