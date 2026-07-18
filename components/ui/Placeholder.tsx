'use client';

import React from 'react';

interface PlaceholderProps {
  type:
    | 'main-kit'
    | 'mapa'
    | 'tabela'
    | 'checklist'
    | 'erros'
    | 'referencias'
    | 'acabamento'
    | 'story-1'
    | 'story-2'
    | 'story-3'
    | 'story-4'
    | 'story-5'
    | 'story-6'
    | 'basic-plan'
    | 'complete-plan'
    | 'garantia';
  className?: string;
  featured?: boolean;
}

export default function Placeholder({ type, className = '', featured = false }: PlaceholderProps) {
  const isStory   = type.startsWith('story-');
  const isMainKit = type === 'main-kit';
  const isGarantia = type === 'garantia';

  const aspectClass = isStory
    ? 'aspect-[9/16]'
    : isMainKit
    ? 'aspect-[4/3]'
    : isGarantia
    ? 'aspect-[2/1]'
    : 'aspect-[4/3]';

  const borderColor = featured
    ? 'border-[var(--color-gold)]'
    : 'border-[var(--color-border)]';

  const shadowStyle = featured
    ? 'var(--shadow-card)'
    : 'none';

  return (
    <div
      className={`image-frame w-full ${aspectClass} rounded-xl ${borderColor} ${className}`}
      style={{ boxShadow: shadowStyle }}
      data-placeholder={type}
    />
  );
}
