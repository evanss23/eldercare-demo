"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaHeartbeat, FaShieldAlt, FaCamera, FaComments, FaBell, FaChartLine, FaPhone, FaPills, FaClock, FaCalendarAlt, FaSmile, FaMeh, FaFrown, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { mockProfile, mockActivities, mockEmergencyContacts } from "../mockData";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePolling } from "@/../../hooks/usePolling";
import { useToast } from "@/../../hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { DashboardShimmer } from "@/components/Shimmer";
import { HoverLift, TapScale, StaggerChildren, Pulse, Float, RippleButton, AnimatedCounter } from "@/components/MicroInteractions";
import { ActivitiesEmpty, NotificationsEmpty } from "@/components/EmptyStates";

export default function CaretakerDashboard() {
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

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Simulate fetching updates from API
  const fetchStatusUpdates = async () => {
    // Simulate API call - in real app this would fetch from backend
    
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
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Caregiver Dashboard</h1>
            <div className="flex items-center space-x-4">
              <TapScale>
                <button
                  className="relative p-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setNotificationCount(0)}
                >
                  <FaBell size={24} />
                  <AnimatePresence>
                    {notificationCount > 0 && (
                      <Pulse>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        >
                          {notificationCount}
                        </motion.span>
                      </Pulse>
                    )}
                  </AnimatePresence>
                </button>
              </TapScale>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  C
                </div>
                <span className="text-sm font-medium text-gray-700">Caretaker</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <DashboardShimmer />
        ) : (
          <>
        {/* Emergency Alert Banner */}
        <AnimatePresence>
          {emergencyAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6"
            >
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <FaExclamationTriangle className="text-red-600" size={32} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800">Emergency Alert</h3>
                    <p className="text-red-700">{emergencyAlert.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmergencyAlert(null)}
                  className="text-red-600 hover:text-red-800 text-2xl"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Elder Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                G
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{mockProfile.name}</h2>
                <p className="text-gray-600">Last active: 10 minutes ago</p>
              </div>
            </div>
          </div>

          {/* Wellness and Safety Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Wellness Score */}
            <motion.div
              whileHover={{ scale: 1.02 }}
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
                  {wellnessScore >= 80 ? "Great Health & Happy!" : 
                   wellnessScore >= 60 ? "Good Health, Some Concerns" : 
                   "Needs Attention"}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Activity</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Medication</span>
                  <span className="text-yellow-600 font-medium">1 Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mood</span>
                  <span className="text-green-600 font-medium">Happy</span>
                </div>
              </div>
            </motion.div>

            {/* Safety Status */}
            <motion.div
              whileHover={{ scale: 1.02 }}
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
          </div>
        </motion.div>

        {/* Care Management Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Call Elderly */}
          <HoverLift>
            <TapScale>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 cursor-pointer text-white hover:shadow-xl transition-all">
                <div className="flex flex-col items-center space-y-3">
                  <Float>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <FaPhone className="text-white" size={28} />
                    </div>
                  </Float>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Call {mockProfile.name}</h3>
                    <p className="text-sm opacity-90">Start voice call</p>
                  </div>
                </div>
              </div>
            </TapScale>
          </HoverLift>

          {/* Medication Management */}
          <HoverLift>
            <TapScale>
              <div
                onClick={() => setShowMedicationModal(true)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaPills className="text-orange-600" size={28} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">Medications</h3>
                    <p className="text-sm text-gray-600">1 pending reminder</p>
                  </div>
                </div>
              </div>
            </TapScale>
          </HoverLift>

          {/* Wellness Checks */}
          <HoverLift>
            <TapScale>
              <div
                onClick={() => setShowWellnessModal(true)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-600" size={28} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">Wellness Checks</h3>
                    <p className="text-sm text-gray-600">Schedule calls</p>
                  </div>
                </div>
              </div>
            </TapScale>
          </HoverLift>

          {/* Upload Memories */}
          <Link href="/caregiver/memories">
            <HoverLift>
              <TapScale>
                <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                      <FaCamera className="text-pink-600" size={28} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800">Send Memories</h3>
                      <p className="text-sm text-gray-600">Photos & music</p>
                    </div>
                  </div>
                </div>
              </TapScale>
            </HoverLift>
          </Link>
        </div>

        {/* Communication & Chat */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/caregiver/chat">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 cursor-pointer text-white hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FaComments className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">AI Conversation Highlights</h3>
                  <p className="text-blue-100">Vera had 3 important conversations with {mockProfile.name}</p>
                  <p className="text-sm text-blue-200 mt-1">Latest: Medication reminder confirmed</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-6 cursor-pointer text-white hover:shadow-xl transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Emergency Alert</h3>
                <p className="text-red-100">Quick access to emergency services</p>
                <p className="text-sm text-red-200 mt-1">Status: All Clear ✓</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Activities</h3>
          {activities.length === 0 ? (
            <ActivitiesEmpty />
          ) : (
            <StaggerChildren className="space-y-3">
              {activities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * activities.indexOf(activity) }}
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
          )}
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Emergency Contacts</h3>
          <StaggerChildren className="grid md:grid-cols-3 gap-4">
            {mockEmergencyContacts.map((contact) => (
              <HoverLift key={contact.id}>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                  <p className="text-purple-600 font-medium mt-2">{contact.phone}</p>
                </div>
              </HoverLift>
            ))}
          </StaggerChildren>
        </motion.div>

        {/* Medication Management Modal */}
        {showMedicationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Medication Management</h3>
                <button
                  onClick={() => setShowMedicationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Today's Medications</h4>
                {mockProfile.medications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      med.taken ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {med.taken ? 'Taken ✓' : 'Pending'}
                    </div>
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold text-gray-700 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <RippleButton 
                      onClick={() => {
                        notification(`Reminder sent to ${mockProfile.name}`);
                        setShowMedicationModal(false);
                      }}
                      className="w-full"
                    >
                      Send Reminder to {mockProfile.name}
                    </RippleButton>
                    <RippleButton 
                      variant="secondary"
                      onClick={() => {
                        success('Medication marked as taken');
                        setShowMedicationModal(false);
                      }}
                      className="w-full"
                    >
                      Mark as Taken
                    </RippleButton>
                    <RippleButton 
                      variant="primary"
                      onClick={() => setShowMedicationModal(false)}
                      className="w-full"
                    >
                      Schedule New Medication
                    </RippleButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Wellness Check Modal */}
        {showWellnessModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Wellness Check Schedule</h3>
                <button
                  onClick={() => setShowWellnessModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Next Wellness Check</h4>
                  <p className="text-green-700">Today at 2:00 PM</p>
                  <p className="text-sm text-green-600">Scheduled call to check on Grammy</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Upcoming Checks</h4>
                  
                  {[
                    { time: "Tomorrow 10:00 AM", type: "Daily Check-in", status: "scheduled" },
                    { time: "Friday 3:00 PM", type: "Doctor Follow-up", status: "scheduled" },
                    { time: "Sunday 11:00 AM", type: "Weekly Assessment", status: "scheduled" }
                  ].map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{check.type}</p>
                        <p className="text-sm text-gray-600">{check.time}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Scheduled
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold text-gray-700 mb-3">Schedule New Check</h4>
                  <div className="space-y-2">
                    <RippleButton 
                      onClick={() => {
                        notification('Daily check-in scheduled');
                        setShowWellnessModal(false);
                      }}
                      className="w-full"
                    >
                      Schedule Daily Check-in
                    </RippleButton>
                    <RippleButton 
                      variant="secondary"
                      onClick={() => {
                        notification('Medical follow-up scheduled');
                        setShowWellnessModal(false);
                      }}
                      className="w-full"
                    >
                      Schedule Medical Follow-up
                    </RippleButton>
                    <RippleButton 
                      variant="primary"
                      onClick={() => {
                        success('Emergency check initiated');
                        setShowWellnessModal(false);
                      }}
                      className="w-full"
                    >
                      Emergency Check Now
                    </RippleButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </>
        )}
      </main>

      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast} 
        position="bottom-right" 
      />
    </div>
  );
}