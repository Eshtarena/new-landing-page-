import React from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  href: string;
}

export default function CategoryMenu() {
  const categories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      href: "/electronics",
    },
    {
      id: 2,
      name: "Women's Fashion",
      href: "/womens-fashion",
    },
    {
      id: 3,
      name: "Men's Fashion",
      href: "/mens-fashion",
    },
    {
      id: 4,
      name: "Kids' Fashion",
      href: "/kids-fashion",
    },
    {
      id: 5,
      name: "Beauty & Fragrance",
      href: "/beauty",
    },
    {
      id: 6,
      name: "Home & Appliances",
      href: "/home",
    },
    {
      id: 7,
      name: "Baby",
      href: "/baby",
    },
    {
      id: 8,
      name: "Toys & Games",
      href: "/toys",
    },
    {
      id: 9,
      name: "Supermarket",
      href: "/supermarket",
    },
    {
      id: 10,
      name: "Automotive",
      href: "/automotive",
    },
  ];

  return (
    <div className="bg-[#340040] border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.id}
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
