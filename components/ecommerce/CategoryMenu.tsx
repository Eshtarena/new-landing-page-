import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCategories } from "../../hooks/useCategories";

// Used only while categories are loading or if /v1/user/categories is unreachable.
const FALLBACK_CATEGORIES = [
  { id: "electronics", name: "Electronics", href: "/electronics" },
  { id: "womens-fashion", name: "Women's Fashion", href: "/womens-fashion" },
  { id: "mens-fashion", name: "Men's Fashion", href: "/mens-fashion" },
  { id: "kids-fashion", name: "Kids' Fashion", href: "/kids-fashion" },
  { id: "beauty", name: "Beauty & Fragrance", href: "/beauty" },
  { id: "home", name: "Home & Appliances", href: "/home" },
  { id: "baby", name: "Baby", href: "/baby" },
  { id: "toys", name: "Toys & Games", href: "/toys" },
  { id: "supermarket", name: "Supermarket", href: "/supermarket" },
  { id: "automotive", name: "Automotive", href: "/automotive" },
];

export default function CategoryMenu() {
  const { asPath } = useRouter();
  const isRtl = /\/ar(\/|$)/.test(asPath);
  const { categories, isLoading, error } = useCategories();

  const items =
    !isLoading && (error || categories.length === 0)
      ? FALLBACK_CATEGORIES
      : categories.map((category) => ({
          id: category.id,
          name: isRtl ? category.name_ar : category.name_en,
          href: category.link,
        }));

  if (isLoading) {
    return <div className="bg-[#340040] border-b h-11 animate-pulse" />;
  }

  return (
    <div className="bg-[#340040] border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden text-left" dir="ltr">
        <div className="flex w-max animate-[marquee_20s_linear_infinite] gap-x-8 py-4">
          {[...items, ...items].map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={category.href}
              className="text-white hover:text-white text-sm font-medium "
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
