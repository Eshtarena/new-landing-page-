import React from "react";
import Link from "next/link";
import type { SupplierBranch } from "../../types/supplier";

type TxFn = (key: string, en: string, ar: string) => string;

function buildMapImageUrl(lat: string, lng: string): string {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=640x280&markers=${lat},${lng},red`;
}

function MapPinIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BranchMapPreview({
  lat,
  lng,
  title,
  mapUrl,
}: {
  lat?: string;
  lng?: string;
  title: string;
  mapUrl: string | null;
}) {
  const hasCoords = Boolean(lat && lng);
  const content = hasCoords ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={buildMapImageUrl(lat!, lng!)}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg className="h-8 w-8 text-[#E9335F] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
        </svg>
      </div>
    </>
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-[#ECECF0]">
      <MapPinIcon />
    </div>
  );

  const className = "relative block h-[140px] w-full overflow-hidden rounded-t-2xl bg-[#ECECF0]";

  if (mapUrl) {
    return (
      <Link href={mapUrl} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${title} map`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function SupplierMobileBranchCard({
  branch,
  tx,
  isRTL,
}: {
  branch: SupplierBranch;
  tx: TxFn;
  isRTL: boolean;
}) {
  const hasHours = branch.openAt && branch.closeAt;
  const hasCoords = branch.lat && branch.lng;
  const mapUrl = hasCoords ? `https://www.google.com/maps?q=${branch.lat},${branch.lng}` : null;
  const textAlign = isRTL ? "text-right" : "text-left";
  const locationLine =
    branch.location ||
    [branch.city, branch.districts.join(", ")].filter(Boolean).join(" · ");

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <BranchMapPreview
        lat={branch.lat}
        lng={branch.lng}
        title={branch.title}
        mapUrl={mapUrl}
      />

      <div className="space-y-2.5 p-4">
        <h3 className={`text-base font-bold text-primary-500 leading-tight ${textAlign}`}>
          {branch.title}
        </h3>

        {locationLine ? (
          <div className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <MapPinIcon />
            <p className={`text-sm font-normal text-[#808080] leading-snug ${textAlign}`}>
              {locationLine}
            </p>
          </div>
        ) : null}

        {hasHours ? (
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <ClockIcon />
            <p className="text-sm font-normal text-[#808080]" dir="ltr">
              {branch.openAt} – {branch.closeAt}
            </p>
          </div>
        ) : null}

        {branch.employees != null && branch.employees > 0 ? (
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <UsersIcon />
            <p className="text-sm font-normal text-[#808080]">
              {branch.employees.toLocaleString()}{" "}
              {tx("supplierDetails.employees", "Employees", "موظف")}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
