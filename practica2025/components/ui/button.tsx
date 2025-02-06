// components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getVariantClasses = (variant?: string) => {
  switch (variant) {
    case 'outline':
      return 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700';
    case 'ghost':
      return 'hover:bg-gray-100 text-gray-700';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent';
  }
};

const getSizeClasses = (size?: string) => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export function Button({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}