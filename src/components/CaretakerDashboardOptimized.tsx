"use client";

import React, { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBell, FaPhone, FaPills, FaCalendarAlt, FaCamera, 
  FaComments, FaShieldAlt, FaExclamationTriangle 
} from "react-icons/fa";
import Link from "next/link";
import { mockProfile, mockEmergencyContacts } from "../mockData";
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardShimmer, CardShimmer } from "@/components/Shimmer";
import { TapScale, Pulse, StaggerChildren, HoverLift } from "@/components/MicroInteractions";
import { ToastContainer } from "@/components/Toast";

// Import smaller components
import { WellnessCard } from "./dashboard/WellnessCard";
import { SafetyStatusCard } from "./dashboard/SafetyStatusCard";
import { ActivityList } from "./dashboard/ActivityList";
import { QuickActionCard } from "./dashboard/QuickActionCard";

// Lazy load modals
const MedicationModal = lazy(() => import("./modals/MedicationModal"));
const WellnessModal = lazy(() => import("./modals/WellnessModal"));

export default function CaretakerDashboardOptimized() {
  const {
    showMedicationModal,
    showWellnessModal,
    wellnessScore,
    safetyStatus,
    activities,
    emergencyAlert,
    notificationCount,
    isLoading,
    toasts,
    setShowMedicationModal,
    setShowWellnessModal,
    setEmergencyAlert,
    setNotificationCount,
    removeToast,
    notification,
    success
  } = useDashboardState();

  const hasPendingMedication = mockProfile.medications.some(m => !m.taken);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Caregiver Dashboard
            </h1>
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
                <WellnessCard
                  wellnessScore={wellnessScore}
                  activities={activities}
                  hasPendingMedication={hasPendingMedication}
                  mood="Happy"
                />
                <SafetyStatusCard safetyStatus={safetyStatus} />
              </div>
            </motion.div>

            {/* Care Management Actions */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <QuickActionCard
                icon={<FaPhone className="text-white" size={28} />}
                iconBgColor="bg-white/20"
                iconColor="text-white"
                title={`Call ${mockProfile.name}`}
                subtitle="Start voice call"
                gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                isGradient={true}
              />

              <QuickActionCard
                icon={<FaPills className="text-orange-600" size={28} />}
                iconBgColor="bg-orange-100"
                iconColor="text-orange-600"
                title="Medications"
                subtitle={hasPendingMedication ? "1 pending reminder" : "All taken"}
                onClick={() => setShowMedicationModal(true)}
              />

              <QuickActionCard
                icon={<FaCalendarAlt className="text-purple-600" size={28} />}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
                title="Wellness Checks"
                subtitle="Schedule calls"
                onClick={() => setShowWellnessModal(true)}
              />

              <Link href="/caregiver/memories">
                <QuickActionCard
                  icon={<FaCamera className="text-pink-600" size={28} />}
                  iconBgColor="bg-pink-100"
                  iconColor="text-pink-600"
                  title="Send Memories"
                  subtitle="Photos & music"
                />
              </Link>
            </div>

            {/* Communication & Chat */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Link href="/caregiver/chat">
                <HoverLift>
                  <motion.div
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
                </HoverLift>
              </Link>

              <HoverLift>
                <motion.div
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
              </HoverLift>
            </div>

            {/* Today's Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Activities</h3>
              <ActivityList activities={activities} />
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

            {/* Modals */}
            <Suspense fallback={<CardShimmer />}>
              {showMedicationModal && (
                <MedicationModal
                  medications={mockProfile.medications}
                  elderName={mockProfile.name}
                  onClose={() => setShowMedicationModal(false)}
                  onAction={notification}
                  onSuccess={success}
                />
              )}

              {showWellnessModal && (
                <WellnessModal
                  onClose={() => setShowWellnessModal(false)}
                  onAction={notification}
                />
              )}
            </Suspense>
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