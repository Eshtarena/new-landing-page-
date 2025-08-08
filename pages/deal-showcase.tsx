import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DealCardShowcase from '../components/deals/DealCardShowcase';
import { Deal } from '../types/deals';
import { handleDealClick } from '../utils/navigation';

export default function DealShowcasePage() {
  const router = useRouter();
  
  const onDealClick = (deal: Deal) => {
    handleDealClick(router, deal, "DealShowcasePage");
  };

  return (
    <>
      <Head>
        <title>Deal Card Components Showcase - Eshtarena</title>
        <meta name="description" content="Showcase of reusable deal card components" />
      </Head>
      
      <DealCardShowcase onDealClick={onDealClick} />
    </>
  );
} 