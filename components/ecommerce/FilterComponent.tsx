import React, { useState, useEffect } from 'react';
import { DealType } from '../../types/deals';

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

// Available options for dropdowns
const DEAL_TYPES = [
  { value: 'all', label: 'All Deals' },
  { value: 'cold', label: 'Cold Deals' },
  { value: 'original', label: 'Original Deals' },
  { value: 'voucher', label: 'Voucher Deals' }
];

const CATEGORIES = [
  'Fashion',
  'Electronics',
  'Home & Kitchen',
  'Health & Beauty',
  'Sports & Outdoors',
  'Automotive',
  'Grocery'
];

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

const DEFAULT_FILTERS: FilterState = {
  dealType: 'all',
  priceRange: { min: 0, max: 10000 },
  categories: [],
  locations: []
};

export default function FilterComponent({
  isOpen = true,
  onClose,
  onFilterChange,
  initialFilters = {},
  isMobile = false
}: FilterComponentProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters
  });

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
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
    setFilters(DEFAULT_FILTERS);
  };

  const renderPriceRangeSlider = () => (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">Price Range</label>
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                min: Math.max(0, parseInt(e.target.value) || 0)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => updateFilter('priceRange', {
                ...filters.priceRange,
                max: Math.max(filters.priceRange.min, parseInt(e.target.value) || 0)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="10000"
            />
          </div>
        </div>
        
        {/* Range Slider */}
        <div className="relative">
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
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-min"
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
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-max"
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
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
      <label className="text-sm font-medium text-gray-700">{title}</label>
      
      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={onToggle}
          className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#340040] focus:border-[#340040] text-sm"
        >
          <span className="block truncate">
            {selectedItems.length > 0 
              ? `${selectedItems.length} selected`
              : `Select ${title.toLowerCase()}`
            }
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {items.map((item) => (
              <label
                key={item}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => onItemToggle(item)}
                  className="mr-3 h-4 w-4 text-[#340040] focus:ring-[#340040] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">{item}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">Selected:</div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2 py-1 bg-[#340040] text-white text-xs rounded-full"
              >
                {item}
                <button
                  onClick={() => onRemove(item)}
                  className="ml-1 text-white hover:text-gray-300"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Deal Type Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Deal Type</label>
        <div className="space-y-2">
          {DEAL_TYPES.map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                value={type.value}
                checked={filters.dealType === type.value}
                onChange={(e) => updateFilter('dealType', e.target.value)}
                className="mr-3 h-4 w-4 text-[#340040] focus:ring-[#340040] border-gray-300"
              />
              <span className="text-sm text-gray-900">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      {renderPriceRangeSlider()}

      {/* Categories */}
      {renderDropdown(
        'Categories',
        CATEGORIES,
        filters.categories,
        categoryDropdownOpen,
        () => setCategoryDropdownOpen(!categoryDropdownOpen),
        handleCategoryToggle,
        removeCategory
      )}

      {/* Locations */}
      {renderDropdown(
        'Locations',
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
        className="w-full px-4 py-2 text-sm text-[#340040] border border-[#340040] rounded-md hover:bg-[#340040] hover:text-white transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  // Mobile view - drawer/overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
        )}
        
        {/* Drawer */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full overflow-y-auto p-6">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop view - side menu
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {filterContent}
    </div>
  );
}
