import React from 'react';
import Image from 'next/image';

interface MobileNavbarProps {
  onFilterClick: () => void;
}

export default function MobileNavbar({ onFilterClick }: MobileNavbarProps) {
  return (
    <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-4 py-6">
      {/* Top row with time and status icons */}
      <div className="flex justify-between items-center text-white text-sm mb-6">
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <svg className="w-4 h-4 ml-2" fill="white" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
          </svg>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-full h-full bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Logo and notification */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="text-white">
            <div className="text-lg font-bold mb-1">اشتريها!</div>
            <div className="text-2xl font-bold">eshtarena</div>
          </div>
        </div>
        <button className="p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5l-5-5h5v-5a7.5 7.5 0 117.5 7.5z" />
          </svg>
        </button>
      </div>

      {/* Search bar and filter button */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <div className="flex items-center bg-white rounded-xl px-4 py-3">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search or scan barcode"
              className="flex-1 text-gray-600 placeholder-gray-400 bg-transparent outline-none"
            />
            <button className="ml-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filter button */}
        <button
          onClick={onFilterClick}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
