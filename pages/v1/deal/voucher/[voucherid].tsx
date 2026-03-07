import React from "react";
import { useRouter } from "next/router";
import DealDetailsView from "../../../../components/deals/DealDetailsView";

export default function VoucherDealDetailsPage() {
  const router = useRouter();
  const voucherid = router.query.voucherid as string | undefined;
  return <DealDetailsView id={voucherid} dealType="voucher" />;
}
