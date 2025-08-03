import Image from 'next/image';

export default function PromoBanner() {
  return (
    <div className="bg-primary-500 text-white py-4 px-6 rounded-lg my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">BUY NOW, PAY LATER</div>
          <div className="bg-white text-primary-500 px-3 py-1 rounded-full text-sm font-semibold">
            up to 3 months
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold">0%</div>
            <div className="text-xs uppercase">INTEREST</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">0%</div>
            <div className="text-xs uppercase">PURCHASE FEES</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">0%</div>
            <div className="text-xs uppercase">DOWN PAYMENT</div>
          </div>
        </div>

        <div className="text-xs">
          *T&Cs apply
        </div>
      </div>
    </div>
  );
} 