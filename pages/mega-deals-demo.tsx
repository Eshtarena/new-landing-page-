import React from 'react';
import Head from 'next/head';
import MegaDeals from '../components/ecommerce/MegaDeals';

export default function MegaDealsDemo() {
  return (
    <>
      <Head>
        <title>Mega Deals Demo - Eshtarena</title>
        <meta name="description" content="Demo of the new mega deals section with deal cards" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-gray-900 text-center">
              🎯 Mega Deals Demo
            </h1>
            <p className="text-gray-600 text-center mt-2">
              Showcasing the new deal card system in the ecommerce mega deals section
            </p>
          </div>
        </div>

        {/* Mega Deals Section */}
        <MegaDeals />

        {/* Footer Info */}
        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🔧 Demo Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">✅ Real Data</h4>
                  <p>Comprehensive dummy data with 12+ realistic deals across 7 categories</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">🎨 Modern Cards</h4>
                  <p>Compact deal cards with live timers, progress bars, and color-coded themes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">📱 Responsive</h4>
                  <p>Optimized for all screen sizes with hover effects and smooth animations</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  🚀 This is now integrated into the main ecommerce page at 
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded ml-1">
                    /egy or /saudi
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 