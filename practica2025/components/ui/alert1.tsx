import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
}

const getVariantClasses = (variant?: string) => {
  switch (variant) {
    case 'destructive':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'success':
      return 'bg-green-50 text-green-700 border-green-200';
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

export function Alert({
  children,
  variant = 'default',
  className = '',
  ...props
}: AlertProps) {
  const baseClasses = 'relative w-full rounded-lg border p-4 mb-4';
  const variantClasses = getVariantClasses(variant);

  return (
    <div
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
}

export function AlertDescription({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}