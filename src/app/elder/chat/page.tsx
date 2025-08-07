'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

const ElderChatScreen = dynamic(
  () => import('@/components/ElderChatScreenOptimized'),
  {
    loading: () => <LoadingScreen />,
    ssr: false
  }
);

export default function ElderChatPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ElderChatScreen />
    </Suspense>
  );
}