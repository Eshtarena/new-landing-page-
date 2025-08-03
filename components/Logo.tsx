import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string;
  priority?: boolean;
}

export default function Logo({ 
  width = 120, 
  height = 40, 
  className = "", 
  href = "/",
  priority = false 
}: LogoProps) {
  const logoElement = (
    <Image
      src="/eshtarena_logo.svg"
      alt="Eshtarena"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
} 