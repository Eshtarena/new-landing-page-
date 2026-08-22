import Image from "next/image";

interface TriplePhoneShowcaseProps {
  isRTL: boolean;
}

const PHONES = [
  { src: "/voucher-details.png", alt: "Voucher deal details", width: 454, height: 927 },
  { src: "/vouchers-1.png", alt: "Voucher categories", width: 450, height: 920 },
  { src: "/vouchers-list.png", alt: "Vouchers list", width: 454, height: 928 },
] as const;

export default function TriplePhoneShowcase({ isRTL }: TriplePhoneShowcaseProps) {
  const [center, sideA, sideB] = PHONES;

  const leftPhone = isRTL ? sideB : sideA;
  const rightPhone = isRTL ? sideA : sideB;

  return (
    <div className="relative w-full max-w-[560px] sm:max-w-[620px] mx-auto h-[340px] sm:h-[420px] md:h-[480px] pb-4 sm:pb-6">
      {/* Side phone — left in LTR, right in RTL */}
      <div
        className={`absolute bottom-4 sm:bottom-6 w-[38%] sm:w-[36%] z-10 ${
          isRTL ? "right-0 sm:right-2" : "left-0 sm:left-2"
        } motion-safe:rotate-[-8deg] sm:motion-safe:rotate-[-6deg]`}
      >
        <Image
          src={leftPhone.src}
          alt={leftPhone.alt}
          width={leftPhone.width}
          height={leftPhone.height}
          className="w-full h-auto drop-shadow-xl opacity-95"
          priority
        />
      </div>

      {/* Center phone — focal point */}
      <div className="absolute left-1/2 bottom-4 sm:bottom-6 -translate-x-1/2 w-[44%] sm:w-[42%] z-20">
        <Image
          src={center.src}
          alt={center.alt}
          width={center.width}
          height={center.height}
          className="w-full h-auto drop-shadow-2xl"
          priority
        />
      </div>

      {/* Side phone — right in LTR, left in RTL */}
      <div
        className={`absolute bottom-4 sm:bottom-6 w-[38%] sm:w-[36%] z-10 ${
          isRTL ? "left-0 sm:left-2" : "right-0 sm:right-2"
        } motion-safe:rotate-[8deg] sm:motion-safe:rotate-[6deg]`}
      >
        <Image
          src={rightPhone.src}
          alt={rightPhone.alt}
          width={rightPhone.width}
          height={rightPhone.height}
          className="w-full h-auto drop-shadow-xl opacity-95"
          priority
        />
      </div>
    </div>
  );
}
