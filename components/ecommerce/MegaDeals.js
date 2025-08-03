import Image from 'next/image';
import Link from 'next/link';

export default function MegaDeals() {
  const deals = {
    fashion: {
      title: 'Fashion deals',
      items: [
        {
          id: 1,
          title: 'Ballerinas, sandals & more',
          image: '/landing_page/english/cold_deal.png',
          discount: 'Up to 60% off',
          link: '/fashion/footwear'
        }
      ]
    },
    appliances: {
      title: 'Appliances deals',
      items: [
        {
          id: 1,
          title: 'Hand Blender Vitesse',
          image: '/landing_page/english/original_deal.png',
          price: '1049 EGP',
          originalPrice: '1199 EGP',
          link: '/appliances/blenders'
        }
      ]
    },
    supermarket: {
      title: 'Supermarket deals',
      items: [
        {
          id: 1,
          title: 'Fine Kitchen Tissue Paper',
          image: '/landing_page/english/voucher_deal.png',
          price: '124.95 EGP',
          originalPrice: '200 EGP',
          link: '/supermarket/paper-products'
        }
      ]
    },
    sports: {
      title: 'Sports deals',
      items: [
        {
          id: 1,
          title: 'Sports essentials',
          image: '/landing_page/english/voucher_deal2.png',
          discount: 'Up to 30% off',
          link: '/sports/essentials'
        }
      ]
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mega deals</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(deals).map(([category, categoryDeals]) => (
          <div key={category} className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-primary-600">
                {categoryDeals.title}
              </h3>
            </div>
            
            <div className="p-4">
              {categoryDeals.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="group block"
                >
                  <div className="relative h-48 mb-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-primary-600">
                    {item.title}
                  </h4>
                  
                  {item.discount && (
                    <p className="text-sm font-bold text-green-600 mt-1">
                      {item.discount}
                    </p>
                  )}
                  
                  {item.price && (
                    <div className="mt-1">
                      <span className="text-sm font-bold text-gray-800">
                        {item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 