'use client';

import dynamic from 'next/dynamic';

const HomePageContent = dynamic(() => import('./page-content'), {
  ssr: false,
});

export default function ClientOnlyContent() {
  return <HomePageContent />;
}