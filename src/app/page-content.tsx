"use client";

import { motion } from "framer-motion";
import { FaUser, FaUserMd } from "react-icons/fa";
import Link from "next/link";

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl w-full"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-6xl font-bold text-gray-800 mb-4"
        >
          ElderCare
        </motion.h1>
        <p className="text-xl text-gray-600 mb-12">
          Connecting families with love and care
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Link href="/elder">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUser className="text-white" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Elder View</h2>
              <p className="text-gray-600">Simple interface for seniors</p>
            </motion.div>
          </Link>

          <Link href="/caregiver">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserMd className="text-white" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Caretaker View</h2>
              <p className="text-gray-600">Monitor and manage care</p>
            </motion.div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-sm text-gray-500"
        >
          Demo Mode - Click either view to explore
        </motion.div>
      </motion.div>
    </div>
  );
}