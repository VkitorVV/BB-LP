'use client';

import Image from 'next/image';
import React from 'react';

const cuts = [
  {
    src: '/images/carrosel-cortes/imagem-1.webp',
    alt: 'Degradê visto em dois ângulos',
  },
  {
    src: '/images/carrosel-cortes/imagem-2.webp',
    alt: 'Corte masculino com transição suave',
  },
  {
    src: '/images/carrosel-cortes/imagem-3.webp',
    alt: 'Fade com acabamento lateral e traseiro',
  },
  {
    src: '/images/carrosel-cortes/imagem-4.webp',
    alt: 'Degradê masculino com laterais revisadas',
  },
  {
    src: '/images/carrosel-cortes/imagem-5.webp',
    alt: 'Corte masculino visto de frente e de lado',
  },
] as const;

const wrapIndex = (index: number) => (index + cuts.length) % cuts.length;

export default function CarrosselCortesSlider() {
  const [current, setCurrent] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const dragRef = React.useRef<{ x: number; y: number; active: boolean } | null>(null);

  const goTo = React.useCallback((index: number) => {
    setCurrent(wrapIndex(index));
    setDragOffset(0);
  }, []);

  const goNext = React.useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrevious = React.useCallback(() => goTo(current - 1), [current, goTo]);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { x: event.clientX, y: event.clientY, active: true };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag?.active) return;

    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.05) return;

    event.preventDefault();
    setDragOffset(Math.max(-82, Math.min(82, deltaX)));
  }, []);

  const finishPointer = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!drag) return;
    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    setDragOffset(0);

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
    if (deltaX < 0) goNext();
    else goPrevious();
  }, [goNext, goPrevious]);

  const preventImageAction = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
  }, []);

  const visibleCuts = [
    cuts[wrapIndex(current - 1)],
    cuts[current],
    cuts[wrapIndex(current + 1)],
  ];

  return (
    <div
      className="cuts-carousel"
      style={{ '--drag-offset': `${dragOffset}px` } as React.CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onContextMenu={preventImageAction}
      onDragStart={preventImageAction}
    >
      <div className="cuts-track">
        {visibleCuts.map((cut, index) => (
          <div
            className={`cut-frame${index === 0 ? ' is-prev' : index === 1 ? ' is-active' : ' is-next'}`}
            key={cut.src}
          >
            <Image
              className="cut-image"
              src={cut.src}
              alt={index === 1 ? cut.alt : ''}
              width={1448}
              height={1086}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 759px) 86vw, (max-width: 1199px) 62vw, 650px"
              draggable={false}
              onContextMenu={preventImageAction}
              onDragStart={preventImageAction}
            />
          </div>
        ))}
      </div>
      <div className="cuts-bottom-controls">
        <button className="cuts-arrow prev" type="button" onClick={goPrevious} aria-label="Ver corte anterior">‹</button>
        <span className="cuts-swipe-label">DESLIZE</span>
        <button className="cuts-arrow next" type="button" onClick={goNext} aria-label="Ver próximo corte">›</button>
      </div>
    </div>
  );
}
