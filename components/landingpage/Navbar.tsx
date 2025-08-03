import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../Logo";
import LanguageSwitcher from "../landingpage/LanguageSwitcher";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#340040] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo width={150} height={40} className="cursor-pointer" href="/" priority />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#about"
              className={`text-white hover:text-white/80 ${
                router.asPath === "/#about" ? "text-white/80" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="#deals"
              className={`text-white hover:text-white/80 ${
                router.asPath === "/#deals" ? "text-white/80" : ""
              }`}
            >
              Deals
            </Link>
            <Link
              href="#contact"
              className={`text-white hover:text-white/80 ${
                router.asPath === "/#contact" ? "text-white/80" : ""
              }`}
            >
              Contact
            </Link>
            <Link
              href="/join-suppliers"
              className={`text-white hover:text-white/80 ${
                router.pathname === "/join-suppliers" ? "text-white/80" : ""
              }`}
            >
              Join as Supplier
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
} 