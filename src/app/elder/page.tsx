'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Lazy load the Elder Home Screen
const ElderHomeScreen = dynamic(
  () => import('@/components/ElderHomeScreen'),
  {
    loading: () => <LoadingScreen />,
    ssr: false // Disable SSR for better performance
  }
);

export default function ElderPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ElderHomeScreen />
    </Suspense>
  );
}