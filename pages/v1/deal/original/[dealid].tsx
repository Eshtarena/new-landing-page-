import React from "react";
import { useRouter } from "next/router";
import DealDetailsView from "../../../../components/deals/DealDetailsView";

export default function OriginalDealDetailsPage() {
  const router = useRouter();
  const dealid = router.query.dealid as string | undefined;
  return <DealDetailsView id={dealid} dealType="original" />;
}
