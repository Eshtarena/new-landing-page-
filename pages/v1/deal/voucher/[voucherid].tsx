import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import DealDetailsView from "../../../../components/deals/DealDetailsView";
import { getDealPageServerSideProps } from "../../../../utils/dealPageServerSideProps";

export default function VoucherDealDetailsPage() {
  const router = useRouter();
  const voucherid = router.query.voucherid as string | undefined;
  return <DealDetailsView id={voucherid} dealType="voucher" />;
}

export const getServerSideProps: GetServerSideProps = async (context) =>
  getDealPageServerSideProps(context);
