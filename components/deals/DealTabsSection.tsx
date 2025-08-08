import React, { useState } from 'react';
import { Deal } from '../../types/deals';
import { COLORS } from '../../utils/colors';

interface DealTabsSectionProps {
  deal: Deal;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function DealTabsSection({ deal }: DealTabsSectionProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs: TabConfig[] = [
    {
      id: 'description',
      label: 'Description',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
    {
      id: 'details',
      label: 'Details',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <DescriptionTab deal={deal} />;
      case 'details':
        return <DetailsTab deal={deal} />;
      case 'terms':
        return <TermsTab deal={deal} />;
      case 'reviews':
        return <ReviewsTab deal={deal} />;
      default:
        return <DescriptionTab deal={deal} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                borderBottomColor: activeTab === tab.id ? COLORS.darkViolet : 'transparent',
                backgroundColor: activeTab === tab.id ? COLORS.darkViolet : 'transparent'
              }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

// Description Tab Component
const DescriptionTab = ({ deal }: { deal: Deal }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold" style={{ color: COLORS.darkViolet }}>
      About This Deal
    </h3>
    <div className="prose max-w-none">
      <p className="text-gray-700 leading-relaxed">
        {deal.description}
      </p>
      <p className="text-gray-700 leading-relaxed mt-4">
        This exclusive deal offers you the opportunity to save significantly on premium products. 
        Our carefully curated selection ensures you get the best value for your money while 
        experiencing top-quality items.
      </p>
      <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
        <li>Premium quality guaranteed</li>
        <li>Fast delivery within 2-3 business days</li>
        <li>30-day return policy</li>
        <li>Customer support available 24/7</li>
      </ul>
    </div>
  </div>
);

// Details Tab Component
const DetailsTab = ({ deal }: { deal: Deal }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold" style={{ color: COLORS.darkViolet }}>
      Deal Details
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Category:</span>
          <span className="text-gray-900">{deal.category || 'General'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Supplier:</span>
          <span className="text-gray-900">{deal.supplier || 'Eshtarena Partner'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Deal Type:</span>
          <span className="text-gray-900 capitalize">{deal.dealType}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Location:</span>
          <span className="text-gray-900">{deal.location.text}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Total Quantity:</span>
          <span className="text-gray-900">{deal.quantity.sold + deal.quantity.available}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Sold:</span>
          <span className="text-gray-900">{deal.quantity.sold}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Available:</span>
          <span className="text-gray-900">{deal.quantity.available}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="font-medium text-gray-600">Status:</span>
          <span className={`font-medium ${deal.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {deal.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Terms Tab Component
const TermsTab = ({ deal }: { deal: Deal }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold" style={{ color: COLORS.darkViolet }}>
      Terms & Conditions
    </h3>
    <div className="prose max-w-none text-gray-700">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900">1. Deal Validity</h4>
          <p>This deal is valid until the timer expires or all quantities are sold, whichever comes first.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">2. Payment Terms</h4>
          <p>Payment must be completed within 24 hours of joining the deal to secure your spot.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">3. Delivery</h4>
          <p>Delivery will commence once the deal reaches minimum participation requirements.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">4. Cancellation Policy</h4>
          <p>Cancellations are allowed up to 2 hours after joining the deal, subject to availability.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">5. Returns & Refunds</h4>
          <p>Standard return policy applies. Items must be in original condition within 30 days of delivery.</p>
        </div>
      </div>
    </div>
  </div>
);

// Reviews Tab Component
const ReviewsTab = ({ deal }: { deal: Deal }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold" style={{ color: COLORS.darkViolet }}>
      Customer Reviews
    </h3>
    
    {/* Rating Summary */}
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold" style={{ color: COLORS.darkViolet }}>
          4.8
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600">Based on 127 reviews</p>
        </div>
      </div>
    </div>

    {/* Sample Reviews */}
    <div className="space-y-4">
      {[
        { name: 'Ahmed S.', rating: 5, comment: 'Excellent deal! Fast delivery and great quality products.' },
        { name: 'Fatima M.', rating: 5, comment: 'Very satisfied with my purchase. Will definitely buy again.' },
        { name: 'Omar K.', rating: 4, comment: 'Good value for money. Delivery was a bit slow but overall happy.' }
      ].map((review, index) => (
        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{review.name}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  </div>
);