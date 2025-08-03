import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export default function TestimonialsSection() {
  const { t } = useTranslation('common');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: t('testimonials.1.name'),
      role: t('testimonials.1.role'),
      image: '/testimonials/user1.jpg',
      content: t('testimonials.1.content'),
      rating: 5
    },
    {
      id: 2,
      name: t('testimonials.2.name'),
      role: t('testimonials.2.role'),
      image: '/testimonials/user2.jpg',
      content: t('testimonials.2.content'),
      rating: 5
    },
    {
      id: 3,
      name: t('testimonials.3.name'),
      role: t('testimonials.3.role'),
      image: '/testimonials/user3.jpg',
      content: t('testimonials.3.content'),
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[#340040]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#340040]">
                  {testimonials[activeIndex].name}
                </h3>
                <p className="text-gray-600">
                  {testimonials[activeIndex].role}
                </p>
              </div>
              <div className="ml-auto flex">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <blockquote className="text-gray-600 text-lg italic">
              "{testimonials[activeIndex].content}"
            </blockquote>
          </div>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 