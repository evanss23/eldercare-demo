import React from 'react';
import { HoverLift, TapScale, Float } from '@/components/MicroInteractions';

interface QuickActionCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
  gradient?: string;
  isGradient?: boolean;
}

export const QuickActionCard = React.memo<QuickActionCardProps>(({
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  onClick,
  gradient,
  isGradient = false
}) => {
  const cardClass = isGradient
    ? `${gradient} text-white`
    : "bg-white";

  return (
    <HoverLift>
      <TapScale>
        <div
          onClick={onClick}
          className={`${cardClass} rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all`}
        >
          <div className="flex flex-col items-center space-y-3">
            {isGradient ? (
              <Float>
                <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center`}>
                  {icon}
                </div>
              </Float>
            ) : (
              <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center`}>
                {icon}
              </div>
            )}
            <div className="text-center">
              <h3 className={`font-semibold ${isGradient ? 'text-white' : 'text-gray-800'}`}>
                {title}
              </h3>
              <p className={`text-sm ${isGradient ? 'opacity-90' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </TapScale>
    </HoverLift>
  );
});

QuickActionCard.displayName = 'QuickActionCard';