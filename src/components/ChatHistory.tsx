"use client";

import { motion } from "framer-motion";
import { FaMicrophone, FaKeyboard, FaArrowLeft, FaPlay, FaPills, FaHeart, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { mockAIHighlights, mockProfile } from "../mockData";
import Link from "next/link";
import { useState } from "react";
import { CardShimmer } from "@/components/Shimmer";
import { ConversationsEmpty } from "@/components/EmptyStates";
import { TapScale, HoverLift, StaggerChildren, RippleButton } from "@/components/MicroInteractions";

export default function ChatHistory() {
  const [isLoading, setIsLoading] = useState(false);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <FaPills className="text-orange-500" size={20} />;
      case 'wellness': return <FaHeart className="text-green-500" size={20} />;
      case 'concern': return <FaExclamationTriangle className="text-red-500" size={20} />;
      case 'activity': return <FaCheckCircle className="text-blue-500" size={20} />;
      default: return <FaCheckCircle className="text-gray-500" size={20} />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/caregiver">
                <TapScale>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <FaArrowLeft className="text-gray-600" size={20} />
                  </button>
                </TapScale>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">AI Conversation Highlights with {mockProfile.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Active now</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Conversation Highlights */}
        {isLoading ? (
          <div className="space-y-6 mb-20">
            {[1, 2, 3].map(i => (
              <CardShimmer key={i} />
            ))}
          </div>
        ) : mockAIHighlights.length === 0 ? (
          <ConversationsEmpty />
        ) : (
          <StaggerChildren className="space-y-6 mb-20">
            {mockAIHighlights.map((highlight) => (
              <HoverLift key={highlight.id}>
                <div className={`bg-white rounded-2xl shadow-lg border-l-4 ${getImportanceColor(highlight.importance)} p-6 hover:shadow-xl transition-shadow`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(highlight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{highlight.summary}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        highlight.importance === 'high' ? 'bg-red-100 text-red-700' :
                        highlight.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {highlight.importance}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{highlight.details}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{highlight.timestamp}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      highlight.outcome === 'success' ? 'bg-green-100 text-green-700' :
                      highlight.outcome === 'positive' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {highlight.outcome}
                    </span>
                  </div>
                </div>
              </div>
                </div>
              </HoverLift>
            ))}
          </StaggerChildren>
        )}

        {/* AI Management Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3">
            <RippleButton
              variant="primary"
              size="sm"
              className="bg-green-500 hover:bg-green-600 w-full"
            >
              <span className="flex items-center justify-center space-x-2">
                <FaCheckCircle size={16} />
                <span>Mark as Reviewed</span>
              </span>
            </RippleButton>
            
            <RippleButton
              variant="primary"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 w-full"
            >
              <span className="flex items-center justify-center space-x-2">
                <FaHeart size={16} />
                <span>Send Support</span>
              </span>
            </RippleButton>

            <RippleButton
              variant="primary"
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 w-full"
            >
              <span className="flex items-center justify-center space-x-2">
                <FaPills size={16} />
                <span>Update Care Plan</span>
              </span>
            </RippleButton>
          </div>
        </div>

        {/* Message Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-32 mt-8"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Messages</h3>
          <StaggerChildren className="grid grid-cols-2 gap-3">
            {[
              "How are you feeling today?",
              "Did you take your medication?",
              "I love you!",
              "Call me when you can"
            ].map((template, index) => (
              <TapScale key={index}>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg p-3 text-sm transition-colors w-full">
                  {template}
                </button>
              </TapScale>
            ))}
          </StaggerChildren>
        </motion.div>
      </main>
    </div>
  );
}