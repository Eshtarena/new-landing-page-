import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import React, { useState, useEffect, useCallback, useRef } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useRouter } from "next/router";

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobileMenuOpenRef = useRef(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    isMobileMenuOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback(() => {
    if (isMobileMenuOpenRef.current) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 300);
    }
  }, []);

  useEffect(() => {
    const updateActiveSection = (currentScrollY: number) => {
      const sections = ["about", "deals", "contact"];
      const scrollPosition = currentScrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            return;
          }
        }
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      closeMenu();
      updateActiveSection(currentScrollY);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closeMenu]);

  const handleNavClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // If not on the landing page, navigate to it first
    if (router.pathname !== "/") {
      await router.push("/");
      // Wait for navigation to complete
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 90;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          setActiveSection(sectionId);
          closeMenu();
        }
      }, 100);
    } else {
      // If already on landing page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        setActiveSection(sectionId);
        closeMenu();
      }
    }
  };

  const getLinkClassName = (sectionId: string, isMobile = false) => {
    const baseClasses = isMobile
      ? "flex items-center min-h-11 px-4 py-2.5 rounded-xl text-base font-medium transition-colors duration-200 ease-spring"
      : "inline-flex items-center min-h-11 transition-colors duration-200 ease-spring px-1 text-sm font-medium";

    const activeClasses = isMobile
      ? "bg-white text-[#340040]"
      : "text-white font-semibold";

    const inactiveClasses = isMobile
      ? "text-white/90 hover:bg-white/10 hover:text-white"
      : "text-white/70 hover:text-white";

    return `${baseClasses} ${
      activeSection === sectionId ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-spring ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } bg-[#340040]/70 backdrop-blur-xl`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20 gap-x-6">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative block h-12 w-32 md:h-14 md:w-36">
              <Image
                src="/Group.svg"
                alt="Eshtarena Logo"
                fill
                sizes="128px"
                className="navbar-logo object-contain object-left"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1 gap-x-8">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className={getLinkClassName("about")}
            >
              {t("navbar.about")}
            </a>
            <a
              href="#deals"
              onClick={(e) => handleNavClick(e, "deals")}
              className={getLinkClassName("deals")}
            >
              {t("navbar.deals")}
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={getLinkClassName("contact")}
            >
              {t("navbar.contact")}
            </a>
            <a
              href="https://eshtarena.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-11 text-sm font-medium text-white/80 px-4 rounded-full hover:text-white hover:bg-white/10 transition-colors duration-200 ease-spring"
            >
              {t("navbar.login")}
            </a>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 text-white rounded-full hover:bg-white/10 focus:outline-none transition-colors duration-200 ease-spring"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-spring ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } ${
            isClosing ? "animate-slideUp" : ""
          } overflow-hidden border-t border-white/10`}
        >
          <div className="px-3 pt-3 pb-4 space-y-1">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className={getLinkClassName("about", true)}
            >
              {t("navbar.about")}
            </a>
            <a
              href="#deals"
              onClick={(e) => handleNavClick(e, "deals")}
              className={getLinkClassName("deals", true)}
            >
              {t("navbar.deals")}
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={getLinkClassName("contact", true)}
            >
              {t("navbar.contact")}
            </a>
            <a
              href="https://eshtarena.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center min-h-11 px-4 py-2.5 rounded-xl text-base font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-200 ease-spring"
            >
              {t("navbar.login")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
