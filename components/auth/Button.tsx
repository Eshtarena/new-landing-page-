import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-200 ease-spring focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-[#340040] text-white hover:bg-[#340040]/90 focus:ring-[#340040]',
    secondary: 'bg-gray-200/70 text-[#1d1d1f] hover:bg-gray-200 focus:ring-gray-400',
    outline: 'border border-[#340040]/30 text-[#340040] hover:bg-[#340040] hover:border-[#340040] hover:text-white focus:ring-[#340040]'
  };

  const sizeClasses = {
    sm: 'min-h-11 px-4 py-2 text-sm',
    md: 'min-h-11 px-5 py-2.5 text-base',
    lg: 'min-h-12 px-6 py-3 text-base'
  };
  
  const disabledClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
} 