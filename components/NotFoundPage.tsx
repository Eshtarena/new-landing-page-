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
        <title>{`${title} - Eshtarena`}</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <Logo width={150} height={60} href="/" />
          </div>

          {/* 404 */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold tracking-tight text-primary-500">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f] mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {message}
            </p>
            <p className="text-base text-gray-500">
              Don&apos;t worry, it happens to the best of us!
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Home Button */}
            <Link href="/">
              <button className="group inline-flex items-center justify-center gap-2 min-h-12 px-8 py-3 bg-primary-500 text-white font-semibold rounded-full shadow-soft hover:bg-primary-600 transition-colors duration-300 ease-spring">
                <svg
                  className="w-5 h-5 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
            </Link>

            {/* Go Back Button */}
            {showBackButton && (
              <button
                onClick={handleGoBack}
                className="group inline-flex items-center justify-center gap-2 min-h-12 px-8 py-3 bg-gray-200/70 text-[#1d1d1f] font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300 ease-spring"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
            )}
          </div>

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-black/10">
            <p className="text-gray-500 mb-2">Maybe you&apos;re looking for:</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Link href="/" className="inline-flex items-center min-h-11 px-3 rounded-full text-primary-600 hover:text-primary-700 hover:bg-primary-500/5 transition-colors duration-200 ease-spring">
                Homepage
              </Link>
              <Link href="/mega-deals-demo" className="inline-flex items-center min-h-11 px-3 rounded-full text-primary-600 hover:text-primary-700 hover:bg-primary-500/5 transition-colors duration-200 ease-spring">
                Deals
              </Link>
              <Link href="/landingpage" className="inline-flex items-center min-h-11 px-3 rounded-full text-primary-600 hover:text-primary-700 hover:bg-primary-500/5 transition-colors duration-200 ease-spring">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
