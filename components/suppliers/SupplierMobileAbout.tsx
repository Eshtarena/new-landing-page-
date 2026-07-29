import React from "react";
import type { Supplier } from "../../types/supplier";

type TxFn = (key: string, en: string, ar: string) => string;

function MobileCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <h2 className="text-base font-bold text-primary-500 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function ChatIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECECF0] text-[#666666] transition-colors hover:bg-[#E0E0E5]"
    >
      {children}
    </a>
  );
}

export default function SupplierMobileAbout({
  supplier,
  tx,
  isRTL,
}: {
  supplier: Supplier;
  tx: TxFn;
  isRTL: boolean;
}) {
  const overview = isRTL ? supplier.overview_ar : supplier.overview_en;
  const textAlign = isRTL ? "text-right" : "text-left";

  const contactEntries = [
    supplier.website
      ? { type: "web" as const, value: supplier.website.replace(/^https?:\/\//i, "") }
      : null,
    ...(supplier.phone || []).map((phone) => ({ type: "phone" as const, value: phone })),
  ].filter((entry): entry is { type: "web" | "phone"; value: string } => entry !== null);

  const socialLinks = [
    supplier.facebook ? { href: supplier.facebook, label: "Facebook" } : null,
    supplier.linkedIn ? { href: supplier.linkedIn, label: "LinkedIn" } : null,
    supplier.twitter ? { href: supplier.twitter, label: "Twitter" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <div className="space-y-3">
      <MobileCard title={tx("supplierDetails.aboutTitle", "About", "نبذة عن المورد")}>
        {overview ? (
          <p className={`text-sm font-normal leading-relaxed text-[#808080] whitespace-pre-line ${textAlign}`}>
            {overview}
          </p>
        ) : (
          <p className="text-sm text-[#808080]">
            {tx(
              "supplierDetails.noOverview",
              "No overview is available for this supplier yet.",
              "لا توجد نبذة متاحة عن هذا المورد حتى الآن."
            )}
          </p>
        )}
      </MobileCard>

      {supplier.categories && supplier.categories.length > 0 ? (
        <MobileCard title={tx("supplierDetails.categories", "Categories", "التصنيفات")}>
          <div className="flex flex-wrap gap-2">
            {supplier.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full bg-[#F2E0F5] px-3 py-1.5 text-xs font-normal text-primary-500"
              >
                {category}
              </span>
            ))}
          </div>
        </MobileCard>
      ) : null}

      {contactEntries.length > 0 ? (
        <MobileCard title={tx("supplierDetails.contactNumber", "Contact number", "رقم التواصل")}>
          <ul className="space-y-3">
            {contactEntries.map((entry) => (
              <li key={`${entry.type}-${entry.value}`} className="flex items-center gap-2.5">
                {entry.type === "web" ? <ChatIcon /> : <PhoneIcon />}
                {entry.type === "phone" ? (
                  <a href={`tel:${entry.value}`} className="text-sm font-normal text-[#808080]" dir="ltr">
                    {entry.value}
                  </a>
                ) : (
                  <a
                    href={/^https?:\/\//i.test(entry.value) ? entry.value : `https://${entry.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal text-[#808080] break-all"
                  >
                    {entry.value}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </MobileCard>
      ) : null}

      {socialLinks.length > 0 ? (
        <MobileCard title={tx("supplierDetails.socialLinks", "Social media links", "روابط التواصل الاجتماعي")}>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <SocialIconLink
                key={link.label}
                href={/^https?:\/\//i.test(link.href) ? link.href : `https://${link.href}`}
                label={link.label}
              >
                {link.label === "Facebook" ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ) : link.label === "LinkedIn" ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.062 2.062 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </SocialIconLink>
            ))}
          </div>
        </MobileCard>
      ) : null}
    </div>
  );
}
