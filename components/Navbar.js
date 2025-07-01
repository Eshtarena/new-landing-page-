import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useState, useEffect, useCallback } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useRouter } from "next/router";

export default function Navbar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const closeMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 300);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Close mobile menu on scroll
      closeMenu();

      // Update active section
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
            break;
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closeMenu, lastScrollY]);

  const handleNavClick = async (e, sectionId) => {
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

  const getLinkClassName = (sectionId, isMobile = false) => {
    const baseClasses = isMobile
      ? "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
      : "transition-colors duration-200 px-3";

    const activeClasses = isMobile
      ? "bg-white text-[#340040]"
      : "text-white font-bold";

    const inactiveClasses = isMobile
      ? "text-white hover:bg-white hover:text-[#340040]"
      : "text-gray-300 hover:text-white";

    return `${baseClasses} ${
      activeSection === sectionId ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 bg-[#340040] shadow-lg" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/eshtarena_logo.svg"
                alt="Eshtarena Logo"
                width={250}
                height={250}
                style={{ width: "300px", height: "auto" }}
                className="navbar-logo"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1 space-x-8">
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
              className="text-white  px-3 py-1 rounded hover:bg-white hover:text-[#340040] transition-colors duration-200"
            >
              {t("navbar.login")}
            </a>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 ml-4 rounded-md hover:bg-white/10 focus:outline-none"
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
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } ${isClosing ? "animate-slideUp" : ""} overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
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
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-[#340040] transition-colors duration-200"
            >
              {t("navbar.login")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
