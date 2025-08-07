import React from 'react';
import { motion } from 'framer-motion';
import { RippleButton } from '@/components/MicroInteractions';
import { Medication } from '@/mockData';

interface MedicationModalProps {
  medications: Medication[];
  elderName: string;
  onClose: () => void;
  onAction: (message: string) => void;
  onSuccess: (message: string) => void;
}

export default function MedicationModal({
  medications,
  elderName,
  onClose,
  onAction,
  onSuccess
}: MedicationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Medication Management</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Today's Medications</h4>
          {medications.map((med, index) => (
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
                  onAction(`Reminder sent to ${elderName}`);
                  onClose();
                }}
                className="w-full"
              >
                Send Reminder to {elderName}
              </RippleButton>
              <RippleButton 
                variant="secondary"
                onClick={() => {
                  onSuccess('Medication marked as taken');
                  onClose();
                }}
                className="w-full"
              >
                Mark as Taken
              </RippleButton>
              <RippleButton 
                variant="primary"
                onClick={onClose}
                className="w-full"
              >
                Schedule New Medication
              </RippleButton>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}