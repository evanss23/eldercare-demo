import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';
import { HoverLift } from '@/components/MicroInteractions';
import { SafetyStatus } from '@/mockData';

interface SafetyStatusCardProps {
  safetyStatus: SafetyStatus;
}

export const SafetyStatusCard = React.memo<SafetyStatusCardProps>(({
  safetyStatus
}) => {
  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <HoverLift>
      <motion.div
        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Safety Status</h3>
          </div>
        </div>
        
        <div className="text-center">
          <motion.div
            key={safetyStatus.level}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`inline-flex px-6 py-3 rounded-full text-lg font-semibold border-2 ${getSafetyColor(safetyStatus.level)}`}
          >
            {safetyStatus.message}
          </motion.div>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Fall Detection</span>
            <span className="text-green-600">✓ Active</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Location</span>
            <span className="text-green-600">✓ At Home</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Emergency Button</span>
            <span className="text-green-600">✓ Ready</span>
          </div>
        </div>
      </motion.div>
    </HoverLift>
  );
});

SafetyStatusCard.displayName = 'SafetyStatusCard';