import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DASHBOARD_LOGIN_URL } from '../../utils/routes';

interface MobileBottomNavProps {
  activeTab?: string;
}

const goToDashboardLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  window.location.assign(DASHBOARD_LOGIN_URL);
};

export default function MobileBottomNav({ activeTab = 'home' }: MobileBottomNavProps) {
  const router = useRouter();
  const countryCode = Array.isArray(router.query.countryCode)
    ? router.query.countryCode[0]
    : router.query.countryCode || 'saudi';

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home', href: `/${countryCode}` },
    { id: 'vouchers', label: 'Vouchers', icon: 'vouchers', href: `/${countryCode}#deals` },
    { id: 'deals', label: 'My deals', icon: 'deals', href: DASHBOARD_LOGIN_URL },
    { id: 'profile', label: 'Profile', icon: 'profile', href: DASHBOARD_LOGIN_URL }
  ];

  const getIcon = (iconType: string, isActive: boolean) => {
    const colorClass = isActive ? 'text-primary-500' : 'text-gray-400';
    
    switch (iconType) {
      case 'home':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'vouchers':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'deals':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'profile':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl backdrop-saturate-150 border-t border-black/10 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isExternal = item.href.startsWith('http');
          const className = "flex flex-col items-center justify-center min-h-11 py-2 px-3 min-w-0 flex-1 rounded-xl transition-colors duration-200 ease-spring";
          const content = (
            <>
              {getIcon(item.icon, isActive)}
              <span className={`text-xs mt-1 ${isActive ? 'text-primary-500 font-medium' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-primary-500 rounded-full mt-1"></div>
              )}
            </>
          );

          return isExternal ? (
            <a
              key={item.id}
              href={DASHBOARD_LOGIN_URL}
              onClick={goToDashboardLogin}
              className={className}
            >
              {content}
            </a>
          ) : (
            <Link key={item.id} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
