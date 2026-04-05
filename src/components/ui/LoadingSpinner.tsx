import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-primary-600',
  className = '',
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <div className="relative">
        {/* Main spinner ring */}
        <div
          className={`
            ${sizeMap[size]} 
            animate-spin 
            rounded-full 
            border-4 
            border-gray-200 
            border-t-${color}
            border-r-${color}
            ${color}
          `}
        />
        {/* Optional: inner pulse ring */}
        <div
          className={`
            absolute 
            inset-0 
            ${sizeMap[size]} 
            animate-pulse 
            rounded-full 
            border-2 
            border-transparent
          `}
        />
      </div>
    </div>
  );
};
