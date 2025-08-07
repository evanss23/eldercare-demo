import { useState, useEffect, useRef, useCallback } from 'react';
import { usePolling } from '@/../../hooks/usePolling';
import { useToast } from '@/../../hooks/useToast';
import { mockProfile, mockActivities } from '@/mockData';

export const useDashboardState = () => {
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(mockProfile.wellnessScore);
  const [safetyStatus, setSafetyStatus] = useState(mockProfile.safetyStatus);
  const [activities, setActivities] = useState(mockActivities);
  const [emergencyAlert, setEmergencyAlert] = useState<{type: string; message: string} | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const previousWellnessScore = useRef(wellnessScore);
  const { toasts, removeToast, notification, warning, error, success } = useToast();

  // Simulate fetching updates from API
  const fetchStatusUpdates = useCallback(async () => {
    // Randomly update wellness score
    if (Math.random() > 0.8) {
      const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
      const newScore = Math.max(0, Math.min(100, wellnessScore + change));
      
      if (newScore !== wellnessScore) {
        setWellnessScore(newScore);
        
        if (newScore < previousWellnessScore.current && newScore < 60) {
          warning(`Wellness score decreased to ${newScore}. Check on ${mockProfile.name}.`);
        } else if (newScore > previousWellnessScore.current && newScore >= 80) {
          success(`${mockProfile.name}'s wellness improved to ${newScore}! 🎉`);
        }
        
        previousWellnessScore.current = newScore;
      }
    }
    
    // Simulate safety status changes
    if (Math.random() > 0.9) {
      const statuses = [
        { level: 'green' as const, message: 'All Clear' },
        { level: 'yellow' as const, message: 'Minor Concern' },
        { level: 'red' as const, message: 'Needs Attention' }
      ];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      if (newStatus.level !== safetyStatus.level) {
        setSafetyStatus(newStatus);
        
        if (newStatus.level === 'red') {
          setEmergencyAlert({ type: 'danger', message: 'Safety alert! Check on ' + mockProfile.name + ' immediately!' });
          error('⚠️ SAFETY ALERT: ' + newStatus.message, 10000);
        } else if (newStatus.level === 'yellow') {
          warning('Safety status changed: ' + newStatus.message);
        }
      }
    }
    
    // Simulate activity updates
    if (Math.random() > 0.7) {
      const activityIndex = Math.floor(Math.random() * activities.length);
      const updatedActivities = [...activities];
      if (!updatedActivities[activityIndex].completed) {
        updatedActivities[activityIndex].completed = true;
        setActivities(updatedActivities);
        notification(`${mockProfile.name} completed: ${updatedActivities[activityIndex].activity}`);
      }
    }
    
    // Simulate new notifications
    if (Math.random() > 0.85) {
      setNotificationCount(prev => prev + 1);
    }
  }, [wellnessScore, safetyStatus, activities, warning, success, error, notification]);

  // Poll for updates
  usePolling(fetchStatusUpdates, {
    enabled: true,
    interval: 15000, // 15 seconds
    immediate: true
  });

  // Clear emergency alert after viewing
  useEffect(() => {
    if (emergencyAlert) {
      const timer = setTimeout(() => {
        setEmergencyAlert(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [emergencyAlert]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return {
    // State
    showMedicationModal,
    showWellnessModal,
    wellnessScore,
    safetyStatus,
    activities,
    emergencyAlert,
    notificationCount,
    isLoading,
    toasts,
    
    // Actions
    setShowMedicationModal,
    setShowWellnessModal,
    setEmergencyAlert,
    setNotificationCount,
    removeToast,
    notification,
    success
  };
};