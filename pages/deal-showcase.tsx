import React from 'react';
import Head from 'next/head';
import DealCardShowcase from '../components/deals/DealCardShowcase';
import { Deal } from '../types/deals';

export default function DealShowcasePage() {
  const handleDealClick = (deal: Deal) => {
    console.log('Deal clicked from page:', deal);
    // You can add navigation logic here
    // For example: router.push(`/deals/${deal.id}`);
  };

  return (
    <>
      <Head>
        <title>Deal Card Components Showcase - Eshtarena</title>
        <meta name="description" content="Showcase of reusable deal card components" />
      </Head>
      
      <DealCardShowcase onDealClick={handleDealClick} />
    </>
  );
} 