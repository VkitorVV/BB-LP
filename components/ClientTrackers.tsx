'use client';

import dynamic from 'next/dynamic';

// Carregados apenas no cliente — sem impacto no SSR/LCP
const SectionTracker  = dynamic(() => import('@/components/SectionTracker'),  { ssr: false });
const PresenceTracker = dynamic(() => import('@/components/PresenceTracker'), { ssr: false });

export default function ClientTrackers() {
  return (
    <>
      <SectionTracker />
      <PresenceTracker />
    </>
  );
}
