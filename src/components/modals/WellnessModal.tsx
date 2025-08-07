import React from 'react';
import { motion } from 'framer-motion';
import { RippleButton } from '@/components/MicroInteractions';

interface WellnessModalProps {
  onClose: () => void;
  onAction: (message: string) => void;
}

export default function WellnessModal({
  onClose,
  onAction
}: WellnessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Wellness Check Schedule</h3>
          <button
            onClick={onClose}
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
                  onAction('Daily check-in scheduled');
                  onClose();
                }}
                className="w-full"
              >
                Schedule Daily Check-in
              </RippleButton>
              <RippleButton 
                variant="secondary"
                onClick={() => {
                  onAction('Medical follow-up scheduled');
                  onClose();
                }}
                className="w-full"
              >
                Schedule Medical Follow-up
              </RippleButton>
              <RippleButton 
                variant="primary"
                onClick={() => {
                  onAction('Emergency check initiated');
                  onClose();
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
  );
}