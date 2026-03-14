'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';

interface BannerSlide {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
}

interface Props {
  slides: BannerSlide[];
  duration?: number;
}

export default function HeroBannerImage({ slides, duration = 5000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgressKey((k) => k + 1);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setTimeout(next, duration);
    return () => clearTimeout(id);
  }, [next, slides.length, duration, progressKey]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="rethink-hero-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`rethink-hero-carousel__slide${i === current ? ' rethink-hero-carousel__slide--active' : ''}`}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            style={{ objectFit: 'cover' }}
            priority={i === 0}
          />
          <div className="rethink-hero-carousel__overlay" />
          <div className="rethink-hero-carousel__content">
            <p className="rethink-hero-carousel__eyebrow">Vật tư nông nghiệp</p>
            <h1>{slide.title}</h1>
            <p className="rethink-hero-carousel__subtitle">{slide.subtitle}</p>
            {slide.cta && (
              <Link href={slide.cta.href} className="rethink-hero-carousel__cta">
                {slide.cta.label}
              </Link>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="rethink-hero-carousel__nav">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`rethink-hero-carousel__nav-item${i === current ? ' rethink-hero-carousel__nav-item--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            >
              <span className="rethink-hero-carousel__nav-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="rethink-hero-carousel__nav-bar">
                <span
                  key={i === current ? `active-${progressKey}` : `idle-${i}`}
                  className="rethink-hero-carousel__nav-progress"
                  style={i === current ? { animationDuration: `${duration}ms` } : undefined}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
