'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

const CaretakerDashboard = dynamic(
  () => import('@/components/CaretakerDashboardOptimized'),
  {
    loading: () => <LoadingScreen />,
    ssr: false
  }
);

export default function CaregiverPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CaretakerDashboard />
    </Suspense>
  );
}