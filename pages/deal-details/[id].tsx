import React, { useState } from "react";
import { useRouter } from "next/router";
import { Deal, DealImage, OriginalDeal } from "../../types/deals";
import DealInfoSection from "../../components/deals/DealInfoSection";
import DealTabsSection from "../../components/deals/DealTabsSection";
import { COLORS } from "../../utils/colors";
import MainNavbar from "../../components/ecommerce/MainNavbar";

// Mock data - replace with actual data fetching
const mockDeal: OriginalDeal = {
  id: "1",
  title: "Premium Electronics Bundle",
  description:
    "Get amazing discounts on high-quality electronics including smartphones, tablets, and accessories.",
  images: [
    {
      src: "/landing_page/english/original_deal.png",
      alt: "Original Deal",
    } as DealImage,
    {
      src: "/landing_page/english/voucher_deal.png",
      alt: "Voucher Deal",
    } as DealImage,
    {
      src: "/landing_page/english/cold_deal.png",
      alt: "Cold Deal",
    } as DealImage,
  ],
  dealType: "original",
  dealPrice: 850,
  saveAmount: 150,
  marketPrice: 1000, // Original price before discount
  currency: "SAR",
  quantity: {
    sold: 50,
    available: 300,
  },
  timer: {
    days: 2,
    hours: 14,
    minutes: 30,
    seconds: 45,
  },
  location: {
    text: "All KSA",
    icon: "🇸🇦",
  },
  isActive: true,
  category: "Electronics",
  supplier: "TechStore KSA",
};

export default function DealDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  // In a real app, you'd fetch deal data based on the ID
  const deal = mockDeal;

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Deal Not Found
          </h2>
          <p className="text-gray-600">
            The deal you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.mainBackground }}
    >
        <MainNavbar countryCode={"egy"} lang={"en"} />
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
