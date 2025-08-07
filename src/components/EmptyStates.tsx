// components/EmptyStates.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaImage, 
  FaMusic, 
  FaComments, 
  FaHeart,
  FaCalendarAlt,
  FaBell,
  FaUsers,
  FaClipboardList,
  FaPlus
} from 'react-icons/fa';
import { Float, RippleButton } from './MicroInteractions';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'minimal' | 'illustrated';
  className?: string;
}

const EmptyStateBase: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  variant = 'default',
  className = ''
}) => {
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-12 ${className}`}
      >
        {Icon && (
          <Icon className="mx-auto text-gray-300 mb-4" size={32} />
        )}
        <p className="text-gray-500 text-sm">{title}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex flex-col items-center justify-center py-16 px-8 ${className}`}
    >
      {Icon && (
        <Float>
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 
                        rounded-full flex items-center justify-center mb-6">
            <Icon className="text-purple-600" size={40} />
          </div>
        </Float>
      )}
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-800 mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 text-center max-w-sm mb-8"
      >
        {description}
      </motion.p>
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RippleButton onClick={onAction} size="md">
            <span className="flex items-center space-x-2">
              <FaPlus />
              <span>{actionLabel}</span>
            </span>
          </RippleButton>
        </motion.div>
      )}
    </motion.div>
  );
};

// Specialized empty states
export const MemoriesEmpty: React.FC<{ onUpload?: () => void }> = ({ onUpload }) => (
  <EmptyStateBase
    icon={FaImage}
    title="No memories yet"
    description="Start sharing special moments with your loved one. Photos and music help spark joy and conversation."
    actionLabel="Upload First Memory"
    onAction={onUpload}
  />
);

export const MusicEmpty: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyStateBase
    icon={FaMusic}
    title="No music added"
    description="Add favorite songs that bring back happy memories and lift spirits."
    actionLabel="Add Music"
    onAction={onAdd}
  />
);

export const ConversationsEmpty: React.FC<{}> = () => (
  <div className="relative">
    <EmptyStateBase
      icon={FaComments}
      title="No conversations yet"
      description="Start chatting with Vera to get personalized support and companionship."
      variant="default"
    />
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.2, 0.1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <div className="w-64 h-64 bg-purple-200 rounded-full filter blur-3xl" />
    </motion.div>
  </div>
);

export const ActivitiesEmpty: React.FC<{}> = () => (
  <EmptyStateBase
    icon={FaClipboardList}
    title="No activities today"
    description="Activities will appear here as your loved one goes about their day."
    variant="default"
  />
);

export const NotificationsEmpty: React.FC<{}> = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <Float delay={0}>
      <FaBell className="mx-auto text-gray-200 mb-6" size={48} />
    </Float>
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      You're all caught up!
    </h3>
    <p className="text-gray-500">
      No new notifications
    </p>
  </motion.div>
);

// Illustrated empty state
export const IllustratedEmpty: React.FC<{
  illustration: 'calendar' | 'wellness' | 'social';
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}> = ({ illustration, title, description, onAction, actionLabel }) => {
  const illustrations = {
    calendar: (
      <svg className="w-64 h-48" viewBox="0 0 400 300">
        <motion.rect
          x="100" y="80" width="200" height="140" rx="10"
          fill="#E9D5FF" stroke="#A78BFA" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.rect
          x="100" y="80" width="200" height="40" rx="10"
          fill="#A78BFA"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5 }}
        />
        {[0, 1, 2].map((row) => (
          [0, 1, 2, 3, 4].map((col) => (
            <motion.circle
              key={`${row}-${col}`}
              cx={130 + col * 35} cy={145 + row * 35}
              r="12"
              fill="#F3E8FF"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + (row * 5 + col) * 0.05 }}
            />
          ))
        ))}
      </svg>
    ),
    wellness: (
      <svg className="w-64 h-48" viewBox="0 0 400 300">
        <motion.path
          d="M200 250 L200 50"
          stroke="#E9D5FF" strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M100 150 L300 150"
          stroke="#E9D5FF" strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M120 200 L150 120 L200 160 L250 80 L280 140"
          stroke="#A78BFA" strokeWidth="4" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
        {[120, 150, 200, 250, 280].map((x, i) => (
          <motion.circle
            key={i}
            cx={x} cy={[200, 120, 160, 80, 140][i]}
            r="6"
            fill="#7C3AED"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 + i * 0.1 }}
          />
        ))}
      </svg>
    ),
    social: (
      <svg className="w-64 h-48" viewBox="0 0 400 300">
        <motion.circle
          cx="200" cy="100" r="40"
          fill="#E9D5FF" stroke="#A78BFA" strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.circle
          cx="120" cy="180" r="35"
          fill="#FDE7F3" stroke="#F472B6" strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        />
        <motion.circle
          cx="280" cy="180" r="35"
          fill="#DBEAFE" stroke="#60A5FA" strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
        />
        <motion.path
          d="M180 120 L140 160 M220 120 L260 160"
          stroke="#A78BFA" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8 }}
        />
      </svg>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      <div className="mb-8">
        {illustrations[illustration]}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <RippleButton onClick={onAction} variant="primary">
          {actionLabel}
        </RippleButton>
      )}
    </motion.div>
  );
};

export default EmptyStateBase;