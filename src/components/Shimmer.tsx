// components/Shimmer.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'text' | 'avatar' | 'card';
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className = '',
  width = '100%',
  height = 20,
  rounded = 'md',
  variant = 'default'
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const baseClasses = `relative overflow-hidden bg-gray-200 ${roundedClasses[rounded]} ${className}`;

  return (
    <div
      className={baseClasses}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          translateX: ['100%', '-100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear'
        }}
      />
    </div>
  );
};

// Specialized shimmer components
export const TextShimmer: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

export const AvatarShimmer: React.FC<{ size?: number; className?: string }> = ({ 
  size = 48, 
  className = '' 
}) => {
  return (
    <Shimmer
      width={size}
      height={size}
      rounded="full"
      className={className}
    />
  );
};

export const CardShimmer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <div className="flex items-start space-x-4">
        <AvatarShimmer size={56} />
        <div className="flex-1">
          <Shimmer height={24} width="40%" className="mb-2" />
          <TextShimmer lines={2} />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <Shimmer height={40} rounded="lg" />
        <div className="grid grid-cols-2 gap-3">
          <Shimmer height={32} rounded="lg" />
          <Shimmer height={32} rounded="lg" />
        </div>
      </div>
    </div>
  );
};

export const MemoryCardShimmer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm ${className}`}>
      <Shimmer height={200} rounded="none" />
      <div className="p-4">
        <TextShimmer lines={2} />
        <div className="flex items-center justify-between mt-4">
          <Shimmer height={16} width="30%" />
          <Shimmer height={24} width={24} rounded="full" />
        </div>
      </div>
    </div>
  );
};

export const DashboardShimmer: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <AvatarShimmer size={80} />
          <div className="flex-1">
            <Shimmer height={32} width="60%" className="mb-3" />
            <Shimmer height={20} width="40%" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <CardShimmer />
        <CardShimmer />
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Shimmer height={28} width="30%" className="mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <Shimmer width={32} height={32} rounded="lg" />
                <div>
                  <Shimmer height={18} width={150} className="mb-2" />
                  <Shimmer height={14} width={100} />
                </div>
              </div>
              <Shimmer height={24} width={80} rounded="full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};