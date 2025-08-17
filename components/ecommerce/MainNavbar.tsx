import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../Logo";
import LanguageSwitcher from "../landingpage/LanguageSwitcher";
import { buildLoginRoute } from "../../utils/routes";
import MobileNavbar from "./MobileNavbar";

interface SearchState {
  query: string;
}

interface MainNavbarProps {
  countryCode?: string;
  lang?: string;
}

export default function MainNavbar({
  countryCode = "egy",
  lang = "en",
}: MainNavbarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Get the login route based on current country and language
  const loginRoute = buildLoginRoute(countryCode, lang);

  return (
    <nav className="bg-[#340040] shadow-md ">
      <div className="md:px-40 py-4">
        <div className="flex md:flex-row flex-col justify-between items-center md:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo width={120} height={40} className="cursor-pointer" href="/" />
          </div>

          {/* Search Bar */}
          <div className="md:flex-1 md:max-w-lg w-[90%] md:mx-8">
            <div className="flex items-center flex-row ">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="w-full px-4 mr-4 py-2 pl-4 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="md:hidden">
              {/* Filter button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </button>
            </div>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {/* Mobile Navbar */}

          {/* Right Side Icons */}
          <div className=" items-center space-x-4 hidden md:flex ">
            {/* Account - Connected to Login Page */}
            <Link href={loginRoute} className="text-white ">
              <div className="flex flex-col items-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-xs mt-1">Account</span>
              </div>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
