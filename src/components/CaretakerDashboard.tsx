"use client";

import { motion } from "framer-motion";
import { FaHeartbeat, FaShieldAlt, FaCamera, FaComments, FaBell, FaChartLine } from "react-icons/fa";
import { mockProfile, mockActivities, mockEmergencyContacts } from "../mockData";
import Link from "next/link";

export default function CaretakerDashboard() {
  const getWellnessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Caretaker Dashboard</h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <FaBell size={24} />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </motion.button>
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
                <div className={`text-5xl font-bold ${getWellnessColor(mockProfile.wellnessScore)}`}>
                  {mockProfile.wellnessScore}
                </div>
                <p className="text-gray-600 mt-2">Good Overall Health</p>
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
                <div className={`inline-flex px-6 py-3 rounded-full text-lg font-semibold border-2 ${getSafetyColor(mockProfile.safetyStatus.level)}`}>
                  {mockProfile.safetyStatus.message}
                </div>
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/caregiver/memories">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCamera className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Upload Memories</h3>
                  <p className="text-sm text-gray-600">Add photos & music</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/caregiver/chat">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaComments className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">View Chat</h3>
                  <p className="text-sm text-gray-600">5 new messages</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-6 cursor-pointer text-white"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <FaShieldAlt size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Emergency</h3>
                <p className="text-sm opacity-90">Contact help</p>
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
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{activity.activity}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.completed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {activity.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Emergency Contacts</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {mockEmergencyContacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.role}</p>
                <p className="text-purple-600 font-medium mt-2">{contact.phone}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}