'use client';

import Image from 'next/image';
import React from 'react';

const testimonials = [
  {
    src: '/images/prova-social/prova-socialfeeds-05.webp',
    width: 971,
    height: 1620,
    alt: 'Mensagem recebida de barbeiro sobre o material',
  },
  {
    src: '/images/prova-social/prova-socialstory-04.webp',
    width: 941,
    height: 1571,
    alt: 'Depoimento em mensagem sobre o Mapa do Degradê Sem Marca',
  },
  {
    src: '/images/prova-social/prova-socialstory-01.webp',
    width: 941,
    height: 1577,
    alt: 'Mensagem recebida sobre o material',
  },
  {
    src: '/images/prova-social/prova-socialstory-02.webp',
    width: 941,
    height: 1571,
    alt: 'Depoimento em mensagem de barbeiro',
  },
  {
    src: '/images/prova-social/prova-socialstory-03.webp',
    width: 941,
    height: 1571,
    alt: 'Mensagem sobre o Mapa do Degradê Sem Marca',
  },
] as const;

export default function ProvaSocialCarousel() {
  const [current, setCurrent] = React.useState(0);
  const [shouldPrepareImages, setShouldPrepareImages] = React.useState(false);
  const [loadedImages, setLoadedImages] = React.useState(() => new Set<number>());
  const pendingSlideRef = React.useRef<number | null>(null);
  const swipeStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || shouldPrepareImages) return;

    const isNearViewport = () => {
      const rect = carousel.getBoundingClientRect();
      return rect.top < window.innerHeight + 1200 && rect.bottom > -1200;
    };

    const prepareIfNear = () => {
      if (window.location.hash === '#prova-social' || isNearViewport()) {
        setShouldPrepareImages(true);
        return true;
      }
      return false;
    };

    if (prepareIfNear()) return;

    const timers = [250, 800, 1600].map((delay) => window.setTimeout(prepareIfNear, delay));

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldPrepareImages(true);
        observer.disconnect();
      },
      { rootMargin: '1200px 0px 1200px 0px', threshold: 0.01 },
    );

    observer.observe(carousel);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [shouldPrepareImages]);

  const show = React.useCallback((index: number) => {
    const nextIndex = (index + testimonials.length) % testimonials.length;
    setShouldPrepareImages(true);

    if (loadedImages.has(nextIndex)) {
      pendingSlideRef.current = null;
      setCurrent(nextIndex);
      return;
    }

    const nextImage = carouselRef.current?.querySelector<HTMLImageElement>(`img[data-social-index="${nextIndex}"]`);
    if (nextImage?.complete && nextImage.naturalWidth > 0) {
      pendingSlideRef.current = null;
      setLoadedImages((loaded) => {
        const nextLoaded = new Set(loaded);
        nextLoaded.add(nextIndex);
        return nextLoaded;
      });
      setCurrent(nextIndex);
      return;
    }

    pendingSlideRef.current = nextIndex;
  }, [loadedImages]);

  const markLoaded = React.useCallback((index: number) => {
    setLoadedImages((loaded) => {
      if (loaded.has(index)) return loaded;
      const nextLoaded = new Set(loaded);
      nextLoaded.add(index);
      return nextLoaded;
    });

    if (pendingSlideRef.current === index) {
      pendingSlideRef.current = null;
      setCurrent(index);
    }
  }, []);

  const goNext = React.useCallback(() => show(current + 1), [current, show]);
  const goPrevious = React.useCallback(() => show(current - 1), [current, show]);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 38 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;

    if (deltaX < 0) goNext();
    else goPrevious();
  }, [goNext, goPrevious]);

  const preventImageAction = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
  }, []);

  return (
    <>
      <div
        ref={carouselRef}
        className="social-carousel"
        aria-label="Depoimentos de barbeiros"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { swipeStartRef.current = null; }}
        onContextMenu={preventImageAction}
        onDragStart={preventImageAction}
      >
        <button className="social-arrow prev" type="button" onClick={goPrevious} aria-label="Ver depoimento anterior">‹</button>
        <div className="social-frame">
          {testimonials.map((testimonial, index) => (
            <Image
              className={`social-print${index === current ? ' is-active' : ''}`}
              data-social-index={index}
              key={testimonial.src}
              src={testimonial.src}
              alt={index === current ? testimonial.alt : ''}
              width={testimonial.width}
              height={testimonial.height}
              loading={shouldPrepareImages ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={shouldPrepareImages ? 'low' : undefined}
              quality={72}
              sizes="(max-width: 759px) 92vw, 540px"
              draggable={false}
              aria-hidden={index === current ? undefined : true}
              onLoad={() => markLoaded(index)}
              onContextMenu={preventImageAction}
              onDragStart={preventImageAction}
            />
          ))}
        </div>
        <button className="social-arrow next" type="button" onClick={goNext} aria-label="Ver próximo depoimento">›</button>
      </div>

      <div className="social-controls" aria-label="Selecionar depoimento">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.src}
            className={`social-dot${index === current ? ' is-active' : ''}`}
            type="button"
            onClick={() => show(index)}
            aria-label={`Mostrar depoimento ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>
      <p className="social-count">{current + 1} / {testimonials.length}</p>
      <p className="social-hint">Arraste para ver mais</p>
    </>
  );
}
