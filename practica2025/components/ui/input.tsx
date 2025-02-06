import React from 'react';

// Omitimos la propiedad size del InputHTMLAttributes
type InputPropsWithoutSize = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

interface InputProps extends InputPropsWithoutSize {
  variant?: 'default' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const getVariantClasses = (variant?: 'default' | 'error') => {
  switch (variant) {
    case 'error':
      return 'border-red-300 focus:border-red-500 focus:ring-red-500 placeholder-red-300';
    default:
      return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400';
  }
};

const getSizeClasses = (size?: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export function Input({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  const baseClasses = 'block rounded-md border bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClasses = fullWidth ? 'w-full' : 'w-auto';

  return (
    <input
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      {...props}
    />
  );
}

interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// InputGroup para añadir iconos o elementos adicionales
export function InputGroup({
  children,
  className = '',
  ...props
}: GroupProps) {
  return (
    <div
      className={`relative flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// InputLeftElement y InputRightElement para iconos
export function InputLeftElement({
  children,
  className = '',
  ...props
}: GroupProps) {
  return (
    <div
      className={`absolute left-3 flex h-full items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function InputRightElement({
  children,
  className = '',
  ...props
}: GroupProps) {
  return (
    <div
      className={`absolute right-3 flex h-full items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}