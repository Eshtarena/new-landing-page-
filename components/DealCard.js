import Image from 'next/image';

export default function DealCard({ 
  title, 
  description, 
  points, 
  imageSrc, 
  imageAlt,
  imageIsPhone, // special case for phone image with different dimensions
  isReversed, // if true, image will be on the left (or right in RTL)
  hasBgColor = false // if true, card will have light purple background
}) {
  const ContentSection = () => (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#340040] mb-6">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 mb-6">
          {description}
        </p>
      )}
      {points && points.length > 0 && (
        <ul className={`space-y-${points.length > 4 ? '6' : '4'}`}>
          {points.map((point, index) => (
            <li key={index} className={points.length > 4 ? 'text-lg text-gray-600' : 'flex items-start'}>
              {points.length <= 4 && (
                <span className="w-2 h-2 mt-2 rounded-full bg-[#340040] mr-3"></span>
              )}
              <p>{point}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const ImageSection = () => (
    <div className="flex items-center justify-center">
      <div className={imageIsPhone ? "w-[300px] h-[600px] relative" : "w-full max-w-2xl"}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          {...(imageIsPhone 
            ? { fill: true, className: "object-contain" }
            : { width: 800, height: 600, className: "w-full h-auto rounded-lg" }
          )}
        />
      </div>
    </div>
  );

  return (
    <div className={`w-full ${hasBgColor ? 'bg-[#F0F0F5]' : ''}`}>
      <div className="py-16">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {isReversed ? (
              <>
                <ImageSection />
                <ContentSection />
              </>
            ) : (
              <>
                <ContentSection />
                <ImageSection />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 