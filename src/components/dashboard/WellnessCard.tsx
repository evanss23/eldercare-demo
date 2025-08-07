import React from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaChartLine, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { AnimatedCounter, HoverLift } from '@/components/MicroInteractions';

interface WellnessCardProps {
  wellnessScore: number;
  activities: { completed: boolean }[];
  hasPendingMedication: boolean;
  mood: string;
}

export const WellnessCard = React.memo<WellnessCardProps>(({
  wellnessScore,
  activities,
  hasPendingMedication,
  mood
}) => {
  const getWellnessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getWellnessEmoji = (score: number) => {
    if (score >= 80) return <FaSmile className="text-green-500" size={32} />;
    if (score >= 60) return <FaMeh className="text-yellow-500" size={32} />;
    return <FaFrown className="text-red-500" size={32} />;
  };

  const getWellnessDescription = (score: number) => {
    if (score >= 80) return "Great Health & Happy!";
    if (score >= 60) return "Good Health, Some Concerns";
    return "Needs Attention";
  };

  const activeActivities = activities.filter(a => a.completed).length;

  return (
    <HoverLift>
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaHeartbeat className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Wellness Score</h3>
          </div>
          <FaChartLine className="text-purple-400" size={20} />
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <motion.div
              key={wellnessScore}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`text-5xl font-bold ${getWellnessColor(wellnessScore)}`}
            >
              <AnimatedCounter value={wellnessScore} />
            </motion.div>
            {getWellnessEmoji(wellnessScore)}
          </div>
          <p className="text-gray-600">
            {getWellnessDescription(wellnessScore)}
          </p>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Activity</span>
            <span className={activeActivities > 0 ? "text-green-600 font-medium" : "text-gray-600 font-medium"}>
              {activeActivities > 0 ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Medication</span>
            <span className={hasPendingMedication ? "text-yellow-600 font-medium" : "text-green-600 font-medium"}>
              {hasPendingMedication ? "1 Pending" : "All Taken"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mood</span>
            <span className="text-green-600 font-medium">{mood}</span>
          </div>
        </div>
      </motion.div>
    </HoverLift>
  );
});

WellnessCard.displayName = 'WellnessCard';