import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Deal } from "../../types/deals";
import DealInfoSection from "../../components/deals/DealInfoSection";
import DealTabsSection from "../../components/deals/DealTabsSection";
import { COLORS } from "../../utils/colors";
import MainNavbar from "../../components/ecommerce/MainNavbar";
import { ALL_MOCK_DEALS } from "../../data/mockDeals";

export default function DealDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract countryCode and lang from router if available, or use defaults
  const countryCode = Array.isArray(router.query.countryCode)
    ? router.query.countryCode[0]
    : router.query.countryCode || "egy";
  const lang =
    router.locale ||
    (Array.isArray(router.query.lang)
      ? router.query.lang[0]
      : router.query.lang) ||
    "en";

  // Fetch deal data based on ID
  useEffect(() => {
    if (!id || typeof id !== "string") {
      setIsLoading(false);
      return;
    }

    // Find the deal from mock data
    const foundDeal = ALL_MOCK_DEALS.find((d) => d.id === id);

    if (foundDeal) {
      setDeal(foundDeal);
    }

    setIsLoading(false);
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  // Deal not found state
  if (!deal) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: COLORS.mainBackground }}
      >
        <MainNavbar countryCode={countryCode} lang={lang} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Deal Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The deal you're looking for doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.mainBackground }}
    >
      <MainNavbar countryCode={countryCode} lang={lang} />
      <div className="container mx-auto px-4 py-8">
        {/* Main Content - Two Sections Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Deal Information */}
          <DealInfoSection deal={deal} />

          {/* Section 2: Tabbed Content */}
          <DealTabsSection deal={deal} />
        </div>
      </div>
    </div>
  );
}
