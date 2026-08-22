import Image from "next/image";

interface OverlappingDealImagesProps {
  backSrc: string;
  frontSrc: string;
  alt: string;
  isRTL: boolean;
}

export default function OverlappingDealImages({
  backSrc,
  frontSrc,
  alt,
  isRTL,
}: OverlappingDealImagesProps) {
  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[480px] mx-auto min-h-[480px] sm:min-h-[540px] md:min-h-[580px] pb-4 sm:pb-6">
      {/* Back layer — phone mockup, offset toward the top outer edge */}
      <div
        className={`absolute top-0 w-[72%] sm:w-[68%] z-0 ${
          isRTL ? "left-0 sm:left-2" : "right-0 sm:right-2"
        }`}
      >
        <Image
          src={backSrc}
          alt={`${alt} app screen`}
          width={454}
          height={928}
          className="w-full h-auto drop-shadow-lg"
          priority
        />
      </div>

      {/* Front layer — deal card, anchored toward the bottom inner edge */}
      <div
        className={`absolute bottom-4 sm:bottom-6 w-[78%] sm:w-[72%] z-10 ${
          isRTL ? "right-0 sm:right-4" : "left-0 sm:left-4"
        }`}
      >
        <Image
          src={frontSrc}
          alt={alt}
          width={358}
          height={596}
          className="w-full h-auto drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  );
}
