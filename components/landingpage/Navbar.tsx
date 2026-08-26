import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import { useState, useEffect, useCallback, useRef } from "react";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useRouter } from "next/router";
import { DASHBOARD_LOGIN_URL } from "../../utils/routes";

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobileMenuOpenRef = useRef(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  // false on the server render so hydration matches; synced in useEffect
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Prevent background scroll while the mobile menu is open (avoids layout jumps)
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";

    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateActiveSection = (currentScrollY: number) => {
      const sections = ["home", "about", "deals", "contact"];
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

      if (currentScrollY < 100) {
        setActiveSection("home");
      }
    };

    const syncScrollState = (currentScrollY: number) => {
      setIsScrolled(currentScrollY >= 50);
      updateActiveSection(currentScrollY);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY >= 50);
      updateActiveSection(currentScrollY);
    };

    // Sync state on mount without closing an open menu
    syncScrollState(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closeMenu]);

  const handleNavClick = async (e, sectionId) => {
    e.preventDefault();

    // If not on the landing page, navigate to it first
    if (router.pathname !== "/landingpage") {
      await router.push("/landingpage");
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

  const getLinkClassName = (sectionId, isMobile = false) => {
    const isActive =
      sectionId === "advice"
        ? router.pathname === "/advice"
        : activeSection === sectionId;

    const baseClasses = isMobile
      ? "flex items-center min-h-11 px-4 py-2.5 rounded-xl text-base font-medium transition-colors duration-200 ease-spring"
      : "inline-flex items-center min-h-11 transition-colors duration-200 ease-spring px-1 text-sm font-medium";

    const activeClasses = isMobile
      ? "bg-white text-primary-500"
      : "text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]";

    const inactiveClasses = isMobile
      ? "text-white/90 hover:bg-white/10 hover:text-white"
      : "text-white/70 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]";

    return `${baseClasses} ${
      isActive ? activeClasses : inactiveClasses
    }`;
  };

  // Glass is needed whenever the nav floats as a pill, or the mobile menu
  // is open over the transparent top state (keeps the menu legible)
  const hasGlass = isScrolled || isMobileMenuOpen;

  return (
    <nav
      className={`fixed inset-x-0 z-50 transition-all duration-300 ease-spring ${
        isScrolled ? "top-3 px-4 sm:px-6 lg:px-10" : "top-0 px-0"
      }`}
    >
      <div
        className={`mx-auto overflow-hidden duration-300 ease-spring ${
          isScrolled
            ? "w-full max-w-7xl rounded-[1.75rem]"
            : "w-full max-w-[100vw] rounded-none"
        } ${
          hasGlass
            ? `bg-primary-500/85 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-black/20 transition-[background-color,backdrop-filter,box-shadow,border-color] ${
                isScrolled ? "border border-white/10" : "border-none"
              }`
            : "bg-linear-to-b from-primary-800/60 via-primary-800/25 to-transparent backdrop-blur-[0px] shadow-none border-none transition-[background-color,backdrop-filter,box-shadow,border-color]"
        } transition-[width,max-width]`}
      >
        <div
          className={`flex items-center justify-between gap-x-3 sm:gap-x-6 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-spring ${
            isScrolled ? "h-14 sm:h-16 md:h-18" : "h-16 sm:h-18 md:h-20"
          }`}
        >
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "home")}
              className={`relative block transition-all duration-300 ease-spring ${
                isScrolled
                  ? "h-9 w-24 sm:h-10 sm:w-28 md:h-11 md:w-32"
                  : "h-10 w-28 sm:h-11 sm:w-32 md:h-14 md:w-36"
              }`}
            >
              <Image
                src="/Group.svg"
                alt="Sharena Logo"
                fill
                sizes="128px"
                className="object-contain object-left"
                priority
              />
            </a>
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
            <Link
              href="/advice"
              className={getLinkClassName("advice")}
            >
              {t("navbar.advice")}
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={getLinkClassName("contact")}
            >
              {t("navbar.contact")}
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center gap-x-4">
            <a
              href={DASHBOARD_LOGIN_URL}
              className="inline-flex items-center min-h-11 text-sm font-medium text-white/80 px-4 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200 ease-spring drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
            >
              {t("navbar.login")}
            </a>
            <Link
              href="/saudi"
              className="inline-flex items-center min-h-11 bg-white text-primary-500 text-sm font-semibold px-5 rounded-full shadow-soft hover:bg-white/90 transition-all duration-200 ease-spring"
            >
              {t("navbar.shopNow")}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                if (isMobileMenuOpen) {
                  closeMenu();
                } else {
                  setIsMobileMenuOpen(true);
                }
              }}
              className="flex items-center justify-center w-11 h-11 text-white rounded-full hover:bg-white/10 focus:outline-none transition-colors duration-200 ease-spring"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
          className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-spring ${
            isMobileMenuOpen && !isClosing
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`px-4 pt-3 pb-5 space-y-1 border-t border-white/10 transition-opacity duration-300 ease-spring ${
                isMobileMenuOpen && !isClosing ? "opacity-100" : "opacity-0"
              }`}
            >
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
            <Link
              href="/advice"
              onClick={closeMenu}
              className={getLinkClassName("advice", true)}
            >
              {t("navbar.advice")}
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className={getLinkClassName("contact", true)}
            >
              {t("navbar.contact")}
            </a>
            <a
              href={DASHBOARD_LOGIN_URL}
              onClick={closeMenu}
              className="flex items-center min-h-11 px-4 py-2.5 rounded-xl text-base font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-200 ease-spring"
            >
              {t("navbar.login")}
            </a>
            <Link
              href="/saudi"
              onClick={closeMenu}
              className="flex items-center justify-center min-h-11 mt-2 px-4 py-2.5 rounded-full text-base font-semibold bg-white text-primary-500 hover:bg-white/90 transition-all duration-200 ease-spring"
            >
              {t("navbar.shopNow")}
            </Link>
            <div className="flex items-center justify-center pt-4 mt-3 border-t border-white/10">
              <LanguageSwitcher />
            </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
