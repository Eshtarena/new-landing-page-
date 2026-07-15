import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DealType } from '../../types/deals';
import { useCategories } from '../../hooks/useCategories';

export interface FilterState {
  dealType: DealType | 'all';
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  locations: string[];
}

export interface FilterComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  isMobile?: boolean;
}

export default function FilterComponent({
  isOpen = true,
  onClose,
  onFilterChange,
  initialFilters = {},
  isMobile = false
}: FilterComponentProps) {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  const [filters, setFilters] = useState<FilterState>({
    dealType: 'all',
    priceRange: { min: 0, max: 10000 },
    categories: [],
    locations: [],
    ...initialFilters
  });

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter('categories', newCategories);
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    updateFilter('locations', newLocations);
  };

  const removeCategory = (category: string) => {
    updateFilter('categories', filters.categories.filter(c => c !== category));
  };

  const removeLocation = (location: string) => {
    updateFilter('locations', filters.locations.filter(l => l !== location));
  };

  const clearAllFilters = () => {
    setFilters({
      dealType: 'all',
      priceRange: { min: 0, max: 10000 },
      categories: [],
      locations: []
    });
  };

  // Available options for dropdowns
  const DEAL_TYPES = [
    { value: 'all', label: t('navbar.deals') },
    { value: 'cold', label: t('deals.coldDeal.badge') },
    { value: 'original', label: t('deals.productDeal.badge') },
    { value: 'voucher', label: t('deals.voucherDeal.badge') }
  ];

  const FALLBACK_CATEGORIES = [
    'Fashion',
    'Electronics',
    'Home & Kitchen',
    'Health & Beauty',
    'Sports & Outdoors',
    'Automotive',
    'Grocery'
  ];

  const { categories: liveCategories, isLoading: categoriesLoading, error: categoriesError } =
    useCategories();

  const CATEGORIES =
    !categoriesLoading && (categoriesError || liveCategories.length === 0)
      ? FALLBACK_CATEGORIES
      : liveCategories.map((category) => (isRTL ? category.name_ar : category.name_en));

  const LOCATIONS = [
    'All KSA',
    'Riyadh',
    'Jeddah',
    'Dammam',
    'Mecca',
    'Medina',
    'Khobar',
    'Major Cities'
  ];

  const renderPriceRangeSlider = () => (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">{t('deals.priceRange')}</label>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                min: Math.max(0, parseInt(e.target.value) || 0)
              })}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder={t('deals.priceRangeMin')}
            />
          </div>
          <span className="text-gray-400 text-xs">{t('deals.priceRangeTo')}</span>
          <div className="flex-1">
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                max: Math.max(filters.priceRange.min, parseInt(e.target.value) || 0)
              })}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder={t('deals.priceRangeMax')}
            />
          </div>
        </div>
        
        {/* Range Slider */}
        <div className="relative h-6 flex items-center">
          {/* Background Track */}
          <div className="absolute w-full h-1.5 bg-gray-200 rounded-lg" />
          
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={filters.priceRange.min}
            onChange={(e) => updateFilter('priceRange', {
              ...filters.priceRange,
              min: Math.min(parseInt(e.target.value), filters.priceRange.max - 50)
            })}
            className={`absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb-min z-30 ${isRTL ? 'scale-x-[-1]' : ''}`}
          />
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={filters.priceRange.max}
            onChange={(e) => updateFilter('priceRange', {
              ...filters.priceRange,
              max: Math.max(parseInt(e.target.value), filters.priceRange.min + 50)
            })}
            className={`absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb-max z-40 ${isRTL ? 'scale-x-[-1]' : ''}`}
          />
        </div>
        
        <div className="flex justify-between text-xs font-medium text-gray-500">
          <span>SAR {filters.priceRange.min}</span>
          <span>SAR {filters.priceRange.max}</span>
        </div>
      </div>
    </div>
  );

  const renderDropdown = (
    title: string,
    items: string[],
    selectedItems: string[],
    isOpen: boolean,
    onToggle: () => void,
    onItemToggle: (item: string) => void,
    onRemove: (item: string) => void
  ) => (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 block">{title}</label>
      
      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full min-h-11 px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all flex items-center justify-between"
        >
          <span className="block truncate">
            {selectedItems.length > 0 
              ? `${selectedItems.length} ${isRTL ? 'مختار' : 'selected'}`
              : `${isRTL ? 'اختر' : 'Select'} ${title.toLowerCase()}`
            }
          </span>
          <span className="flex items-center pointer-events-none">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-black/5 rounded-xl shadow-soft-lg max-h-60 overflow-auto">
            {items.map((item) => (
              <label
                key={item}
                className="flex items-center min-h-11 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 me-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={() => onItemToggle(item)}
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 rounded-md border-2 border-gray-300 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-colors duration-200 ease-spring" />
                  <svg
                    className="relative w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-gray-900">{item}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">{isRTL ? 'المختارة:' : 'Selected:'}</div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2.5 py-1 bg-primary-500 text-white text-xs font-medium rounded-full"
              >
                {item}
                <button
                  onClick={() => onRemove(item)}
                  className="ms-1 -me-1 flex items-center justify-center w-5 h-5 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const filterContent = (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-primary-500">{isRTL ? 'الفلاتر' : 'Filters'}</h3>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="flex items-center justify-center w-11 h-11 hover:bg-gray-100 rounded-full transition-colors duration-200 ease-spring"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Deal Type Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 block">{t('deals.title') || 'Deal Type'}</label>
        <div className="space-y-2">
          {DEAL_TYPES.map((type) => (
            <label key={type.value} className="flex items-center min-h-11 cursor-pointer group">
              <span className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 me-3">
                <input
                  type="radio"
                  value={type.value}
                  checked={filters.dealType === type.value}
                  onChange={(e) => updateFilter('dealType', e.target.value as FilterState['dealType'])}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full border-2 border-gray-300 peer-checked:border-primary-500 transition-colors duration-200 ease-spring" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 scale-0 peer-checked:scale-100 transition-transform duration-200 ease-spring" />
              </span>
              <span className="text-sm text-gray-900 group-has-checked:text-primary-500 group-has-checked:font-medium transition-colors duration-200">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      {renderPriceRangeSlider()}

      {/* Categories */}
      {renderDropdown(
        isRTL ? 'الفئات' : 'Categories',
        CATEGORIES,
        filters.categories,
        categoryDropdownOpen,
        () => setCategoryDropdownOpen(!categoryDropdownOpen),
        handleCategoryToggle,
        removeCategory
      )}

      {/* Locations */}
      {renderDropdown(
        isRTL ? 'المواقع' : 'Locations',
        LOCATIONS,
        filters.locations,
        locationDropdownOpen,
        () => setLocationDropdownOpen(!locationDropdownOpen),
        handleLocationToggle,
        removeLocation
      )}

      {/* Clear All Button */}
      <button
        onClick={clearAllFilters}
        className="w-full min-h-11 px-4 py-2 text-sm font-medium text-primary-500 border border-primary-500/30 rounded-full hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-colors duration-200 ease-spring"
      >
        {isRTL ? 'مسح الكل' : 'Clear All Filters'}
      </button>
    </div>
  );

  // Mobile view - drawer/overlay
  if (isMobile) {
    return (
      <>
        {/* Full Screen Drawer */}
        <div 
          className={`fixed inset-0 z-[100] w-full h-full bg-white transform transition-transform duration-300 ease-spring ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="h-full overflow-y-auto p-6 pb-24">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop view - side menu
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft-lg" dir={isRTL ? 'rtl' : 'ltr'}>
      {filterContent}
    </div>
  );
}
