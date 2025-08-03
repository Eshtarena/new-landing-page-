import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedDeals() {
  const deals = [
    {
      id: 1,
      title: 'Special Offer',
      description: 'Up to 50% off',
      image: '/landing_page/english/cold_deal.png',
      link: '/deals/special-offer'
    },
    {
      id: 2,
      title: 'Flash Sale',
      description: '24 Hours Only',
      image: '/landing_page/english/original_deal.png',
      link: '/deals/flash-sale'
    },
    {
      id: 3,
      title: 'Clearance',
      description: 'Final Reduction',
      image: '/landing_page/english/voucher_deal.png',
      link: '/deals/clearance'
    },
    {
      id: 4,
      title: 'Bundle Deals',
      description: 'Buy More Save More',
      image: '/landing_page/english/voucher_deal2.png',
      link: '/deals/bundles'
    }
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Deals</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            href={deal.link}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {deal.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 