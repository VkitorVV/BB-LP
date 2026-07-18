'use client';

import React from 'react';

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export interface GalleryItem {
  title: string;
  image: string;
  alt: string;
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  onItemClick?: (item: GalleryItem, index: number) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 420, autoRotateSpeed = 0.18, onItemClick, ...props }, ref) => {
    const [rotation, setRotation] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const frameRef = React.useRef<number | null>(null);
    const resumeTimerRef = React.useRef<number | null>(null);
    const pointerRef = React.useRef<{ x: number; rotation: number; moved: boolean } | null>(null);
    const lastDragTimeRef = React.useRef(0);

    React.useEffect(() => {
      items.forEach((item) => {
        const image = new window.Image();
        image.decoding = 'async';
        image.src = item.image;
      });
    }, [items]);

    React.useEffect(() => {
      const animate = () => {
        if (!isPaused && !pointerRef.current) {
          setRotation((current) => current + autoRotateSpeed);
        }
        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      };
    }, [autoRotateSpeed, isPaused]);

    const itemAngle = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Galeria circular de páginas do material"
        className={cn('circular-gallery', className)}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
          pointerRef.current = { x: event.clientX, rotation, moved: false };
          setIsPaused(true);
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!pointerRef.current) return;
          event.preventDefault();
          const delta = event.clientX - pointerRef.current.x;
          if (Math.abs(delta) > 6) pointerRef.current.moved = true;
          setRotation(pointerRef.current.rotation + delta * 0.22);
        }}
        onPointerUp={(event) => {
          if (pointerRef.current?.moved) lastDragTimeRef.current = Date.now();
          pointerRef.current = null;
          if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          resumeTimerRef.current = window.setTimeout(() => setIsPaused(false), 700);
        }}
        onPointerCancel={() => {
          pointerRef.current = null;
          setIsPaused(false);
        }}
        onDragStart={(event) => event.preventDefault()}
        {...props}
      >
        <div
          className="circular-gallery-track"
          style={{
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {items.map((item, index) => {
            const angle = index * itemAngle;
            const relative = (angle + rotation + 360) % 360;
            const normalized = Math.abs(relative > 180 ? 360 - relative : relative);
            const opacity = Math.max(0.32, 1 - normalized / 150);

            return (
              <div
                className="circular-gallery-item"
                key={item.image}
                role={onItemClick ? 'button' : undefined}
                tabIndex={onItemClick ? 0 : undefined}
                onClick={() => {
                  if (Date.now() - lastDragTimeRef.current < 250) return;
                  setIsPaused(true);
                  onItemClick?.(item, index);
                }}
                onKeyDown={(event) => {
                  if (!onItemClick || (event.key !== 'Enter' && event.key !== ' ')) return;
                  event.preventDefault();
                  setIsPaused(true);
                  onItemClick(item, index);
                }}
                style={{
                  opacity,
                  zIndex: Math.round(1000 - normalized),
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.alt} draggable={false} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
