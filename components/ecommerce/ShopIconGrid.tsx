import React from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollingLabel from "./ScrollingLabel";

export interface ShopIconGridItem {
  id: string;
  href: string;
  label: string;
  imageSrc: string;
  imageFit?: "contain" | "cover";
}

interface ShopIconGridProps {
  items: ShopIconGridItem[];
  imageFit?: "contain" | "cover";
}

export default function ShopIconGrid({ items, imageFit = "contain" }: ShopIconGridProps) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="flex min-w-0 flex-col items-center gap-y-2"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
            <Image
              src={item.imageSrc}
              alt={item.label}
              fill
              sizes="(max-width: 768px) 33vw, 160px"
              className={(item.imageFit ?? imageFit) === "cover" ? "object-cover" : "object-contain"}
            />
          </div>
          <ScrollingLabel
            text={item.label}
            className="w-full text-center text-xs font-normal leading-tight text-primary-500"
          />
        </Link>
      ))}
    </div>
  );
}

export function ShopIconGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-y-2">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
