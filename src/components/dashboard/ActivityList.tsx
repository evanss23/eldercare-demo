import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { StaggerChildren } from '@/components/MicroInteractions';
import { ActivitiesEmpty } from '@/components/EmptyStates';
import { Activity } from '@/mockData';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList = React.memo<ActivityListProps>(({
  activities
}) => {
  if (activities.length === 0) {
    return <ActivitiesEmpty />;
  }

  return (
    <StaggerChildren className="space-y-3">
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          layout
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{activity.icon}</span>
            <div>
              <p className="font-medium text-gray-800">{activity.activity}</p>
              <p className="text-sm text-gray-600">{activity.time}</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activity.completed ? 'completed' : 'pending'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activity.completed 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {activity.completed ? (
                <span className="flex items-center space-x-1">
                  <FaCheckCircle size={14} />
                  <span>Completed</span>
                </span>
              ) : (
                'Pending'
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ))}
    </StaggerChildren>
  );
});

ActivityList.displayName = 'ActivityList';