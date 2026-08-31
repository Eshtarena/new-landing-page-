import React from 'react';

interface DesktopMarqueeSectionLabelProps {
  label: string;
  /** Apply uppercase styling (English desktop labels). */
  uppercase?: boolean;
}

export default function DesktopMarqueeSectionLabel({
  label,
  uppercase = true,
}: DesktopMarqueeSectionLabelProps) {
  const labelClassName = [
    'text-[11px] font-semibold text-primary-500/35',
    uppercase ? 'uppercase tracking-[0.32em]' : 'tracking-wide',
  ].join(' ');

  return (
    <div className="hidden md:flex justify-center mb-2.5 lg:mb-3">
      <h2 className={labelClassName}>{label}</h2>
    </div>
  );
}
