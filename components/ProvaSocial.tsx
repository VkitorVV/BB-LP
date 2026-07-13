'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';

const stories = [
  { src: '/images/prova-social/prova-socialfeeds-05.webp' },
  { src: '/images/prova-social/prova-socialstory-04.webp' },
  { src: '/images/prova-social/prova-socialstory-01.webp' },
  { src: '/images/prova-social/prova-socialstory-02.webp' },
  { src: '/images/prova-social/prova-socialstory-03.webp' },
];

export default function ProvaSocial() {
  const [current, setCurrent] = useState(0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((index + stories.length) % stories.length);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

    if (!isHorizontalSwipe) return;
    if (deltaX < 0) goTo(current + 1);
    else goTo(current - 1);
  };

  const handlePointerCancel = () => {
    dragStartRef.current = null;
  };

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  return (
    <section
      id="prova-social"
      className="py-20 px-5"
      style={{ background: '#0B0704', borderBottom: '1px solid #3A1D10' }}
    >
      <div className="max-w-md mx-auto">

        <h2 className="font-display text-[2.4rem] leading-none uppercase text-[#FFF4E6] mb-3">
          Veja o que outros barbeiros falaram sobre o material
        </h2>

        <p className="text-[11px] font-bold text-[#D8A64A] uppercase tracking-wider mb-4">
          ✨ Prints reais de pessoas que acompanharam ou comentaram sobre o conteúdo.
        </p>

        <p className="text-sm text-[#D9C3A3] leading-relaxed mb-8">
          Quem está começando na barbearia geralmente tem a mesma dificuldade: entender onde
          a marca aparece, qual pente usar e como deixar a transição mais limpa. Veja retornos
          recebidos nos stories:
        </p>

        <div className="relative">
          <button
            onClick={prev}
            aria-label="Story anterior"
            className="absolute -left-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center w-9 h-9 sm:-left-4 sm:w-11 sm:h-11 rounded-full transition-all active:scale-95"
            style={{
              background: 'rgba(42,19,11,0.92)',
              border: '1.5px solid #5A321C',
              color: '#F28A1A',
              boxShadow: '0 4px 14px rgba(11,7,4,0.55)',
            }}
          >
            ←
          </button>

          <div
            onContextMenu={(event) => event.preventDefault()}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onDragStart={(event) => event.preventDefault()}
            className="scrollbar-hide w-full overflow-hidden rounded-2xl"
            style={{
              border: '1.5px solid #5A321C',
              boxShadow: '0 4px 16px rgba(11,7,4,0.7)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-y',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
            <div
              className="flex transition-transform duration-150 ease-out will-change-transform"
              style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
            >
              {stories.map((story) => (
                <div key={story.src} className="w-full shrink-0" style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}>
                  <Image
                    src={story.src}
                    alt="Print real de story com prova social sobre o Mapa do Degradê Sem Marca"
                    width={720}
                    height={1280}
                    loading="eager"
                    sizes="(max-width: 640px) calc(100vw - 40px), 448px"
                    draggable={false}
                    onContextMenu={(event) => event.preventDefault()}
                    style={{ width: '100%', height: 'auto', display: 'block', WebkitTouchCallout: 'none', userSelect: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            aria-label="Próximo story"
            className="absolute -right-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center w-9 h-9 sm:-right-4 sm:w-11 sm:h-11 rounded-full transition-all active:scale-95"
            style={{
              background: 'rgba(42,19,11,0.92)',
              border: '1.5px solid #5A321C',
              color: '#F28A1A',
              boxShadow: '0 4px 14px rgba(11,7,4,0.55)',
            }}
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {stories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Story ${idx + 1}`}
              style={{
                width: idx === current ? 20 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: idx === current ? '#F28A1A' : '#5A321C',
                transition: 'width .2s, background .2s',
                padding: 0,
              }}
            />
          ))}
        </div>

        <p className="text-[10px] text-center text-[#C9B89A] font-bold uppercase tracking-widest mt-3">
          {current + 1} / {stories.length}
        </p>

      </div>
    </section>
  );
}
