import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';

interface NotFoundPageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export default function NotFoundPage({ 
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true 
}: NotFoundPageProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>{title} - Eshtarena</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <Logo width={150} height={60} href="/" className="drop-shadow-lg" />
            </div>
          </div>

          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-primary-500 mb-4 animate-pulse">
              404
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full mb-6"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {message}
            </p>
            <p className="text-base text-gray-500">
              Don't worry, it happens to the best of us!
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Home Button */}
            <Link href="/">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </span>
              </button>
            </Link>

            {/* Go Back Button */}
            {showBackButton && (
              <button 
                onClick={handleGoBack}
                className="group px-8 py-4 border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-500 hover:text-white transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </button>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 relative">
            {/* Floating shapes */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary-300 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute -bottom-4 left-1/4 w-12 h-12 bg-primary-400 rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
            
            {/* Helpful links */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-500 mb-4">Maybe you're looking for:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors duration-200">
                  Homepage
                </Link>
                <Link href="/mega-deals-demo" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors duration-200">
                  Deals
                </Link>
                <Link href="/landingpage" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors duration-200">
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
