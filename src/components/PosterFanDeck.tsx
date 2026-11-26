import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, POSTER_DECK_WORKS } from '../data/portfolio';
import type { PosterWork } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './PosterFanDeck.css';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'Campaign', 'Merch & Apparel', 'Editorial'] as const;

const PosterFanDeck = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deckStageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [lightboxWork, setLightboxWork] = useState<PosterWork | null>(null);

  const total = POSTER_DECK_WORKS.length;

  const getCircularOffset = useCallback(
    (index: number) => {
      let diff = index - activeIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    },
    [activeIndex, total]
  );

  // Animate 3D fanned card positions with GSAP + subtle motion-blur sweep
  const animateDeck = useCallback(
    (withMotionFlash: boolean) => {
      const isMobile = window.innerWidth < 720;
      const spreadX = isMobile ? 92 : 185;
      const spreadOuterX = isMobile ? 165 : 335;

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const offset = getCircularOffset(idx);
        const abs = Math.abs(offset);

        let x: number;
        let y: number;
        let rotZ: number;
        let rotY: number;
        let scale: number;
        let blur: number;
        let opacity: number;
        let zIndex: number;

        if (offset === 0) {
          x = 0;
          y = 0;
          rotZ = 0;
          rotY = 0;
          scale = 1;
          blur = 0;
          opacity = 1;
          zIndex = 30;
        } else if (abs === 1) {
          x = offset * spreadX;
          y = 22;
          rotZ = offset * 8;
          rotY = -offset * 16;
          scale = 0.84;
          blur = 0.9;
          opacity = 0.88;
          zIndex = 20;
        } else {
          x = Math.sign(offset) * spreadOuterX;
          y = 54;
          rotZ = Math.sign(offset) * 15;
          rotY = -Math.sign(offset) * 26;
          scale = 0.68;
          blur = 2.6;
          opacity = 0.56;
          zIndex = 10;
        }

        if (withMotionFlash) {
          gsap.fromTo(
            card,
            { filter: `blur(${Math.min(blur + 4, 6)}px)` },
            {
              x,
              y,
              rotationZ: rotZ,
              rotationY: rotY,
              scale,
              opacity,
              zIndex,
              filter: `blur(${blur}px)`,
              duration: 0.72,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          );
        } else {
          gsap.to(card, {
            x,
            y,
            rotationZ: rotZ,
            rotationY: rotY,
            scale,
            opacity,
            zIndex,
            filter: `blur(${blur}px)`,
            duration: 0.85,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      });
    },
    [getCircularOffset]
  );

  // GSAP ScrollTrigger initial fan-out entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLButtonElement[];
      gsap.set(cards, { x: 0, y: 70, rotationZ: 0, scale: 0.72, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 72%',
        once: true,
        onEnter: () => animateDeck(false),
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-animate when activeIndex changes or window resizes
  useEffect(() => {
    animateDeck(true);
  }, [activeIndex, animateDeck]);

  useEffect(() => {
    const onResize = () => animateDeck(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [animateDeck]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxWork) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxWork(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxWork]);

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);

  const handleCategoryClick = (cat: (typeof CATEGORIES)[number]) => {
    setActiveCategory(cat);
    if (cat === 'All') return;
    const matchIdx = POSTER_DECK_WORKS.findIndex((w) => w.category === cat);
    if (matchIdx !== -1) setActiveIndex(matchIdx);
  };

  const activeWork = POSTER_DECK_WORKS[activeIndex];

  return (
    <section id="archive" ref={sectionRef} className="section-block fan-deck-section">
      <div className="section-container">
        {/* Top Centered Brand Stamp (Reference Image 1 Inspired) */}
        <div className="fan-top-bar">
          <span className="fan-brand-stamp">MR · THEVIYA · ARCHIVE</span>
          <div className="fan-category-pills" role="tablist" aria-label="Filter poster archive">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`fan-cat-pill${activeCategory === cat ? ' is-active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Fanned Poster Stage */}
        <div ref={deckStageRef} className="fan-stage" data-cursor="VIEW">
          <div className="fan-ambient-glow" aria-hidden="true" />
          {POSTER_DECK_WORKS.map((work, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <button
                key={work.id}
                type="button"
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`fan-card${isCenter ? ' is-center' : ''}`}
                onClick={() => {
                  if (isCenter) {
                    setLightboxWork(work);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                aria-label={`${work.title} - ${work.category}`}
                data-cursor={isCenter ? 'INSPECT' : 'FOCUS'}
              >
                <img src={work.image} alt={work.title} className="fan-card-img" loading="lazy" />
                <div className="fan-card-scrim" />

                {/* Editorial Poster Top Header */}
                <div className="fan-card-top">
                  <span className="fan-card-code">{work.code}</span>
                  <span className="fan-card-year">{work.year}</span>
                </div>

                {/* Editorial Poster Bottom Glass Strip */}
                <div className="fan-card-bottom">
                  <span className="fan-card-cat">{work.category}</span>
                  <h3 className="fan-card-title">{work.title}</h3>
                  <div className="fan-card-meta-row">
                    <span>{work.subtitle}</span>
                    {isCenter && <span className="fan-inspect-tag">INSPECT ↗</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Reference Image 1 Style Editorial Typographic Footer Underneath Deck */}
        <div className="fan-typographic-base">
          <div className="fan-title-lockup">
            <span className="fan-kicker">Selected Works</span>
            <div className="fan-giant-row">
              <KineticHeading
                as="h2"
                className="editorial-display fan-giant-title"
                lines={[{ text: 'Design Archive', tone: 'muted' }]}
              />
              <span className="fan-edition-num reina-serif">2.0</span>
            </div>
          </div>

          <div className="fan-active-summary glass-panel">
            <div className="fan-summary-left">
              <span className="micro-label">{activeWork.code} · {activeWork.category}</span>
              <p>{activeWork.description}</p>
            </div>
            <div className="fan-summary-actions">
              <a
                href={BRAND.driveSamples}
                target="_blank"
                rel="noreferrer"
                className="pill-btn"
                data-cursor="OPEN"
              >
                Drive Samples ↗
              </a>
              <a
                href={BRAND.behance}
                target="_blank"
                rel="noreferrer"
                className="pill-btn pill-btn-solid"
                data-cursor="OPEN"
              >
                Behance ↗
              </a>
            </div>
          </div>

          {/* Bottom Controls Row */}
          <div className="fan-bottom-controls">
            <span className="fan-copyright">
              © 2026 | {BRAND.fullName} - {activeWork.title}
            </span>
            <div className="fan-nav-arrows">
              <button
                type="button"
                className="circle-arrow-btn"
                onClick={handlePrev}
                aria-label="Previous design poster"
              >
                ‹
              </button>
              <span className="fan-counter">
                0{activeIndex + 1} / 0{total}
              </span>
              <button
                type="button"
                className="circle-arrow-btn"
                onClick={handleNext}
                aria-label="Next design poster"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liquid Glass Lightbox Modal (portal outside ScrollSmoother) */}
      {lightboxWork &&
        createPortal(
          <div
            className="fan-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxWork.title}
            onClick={() => setLightboxWork(null)}
          >
            <div
              className="fan-lightbox-modal glass-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="fan-lightbox-close"
                onClick={() => setLightboxWork(null)}
                aria-label="Close preview"
              >
                ✕
              </button>
              <div className="fan-lightbox-media">
                <img src={lightboxWork.image} alt={lightboxWork.title} />
              </div>
              <div className="fan-lightbox-info">
                <span className="micro-label">
                  {lightboxWork.code} · {lightboxWork.category} · {lightboxWork.year}
                </span>
                <h3 className="reina-display">{lightboxWork.title.toLowerCase()}</h3>
                <p className="fan-lightbox-sub">{lightboxWork.subtitle}</p>
                <p className="fan-lightbox-desc">{lightboxWork.description}</p>
                <div className="fan-lightbox-tags">
                  {lightboxWork.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="fan-lightbox-btns">
                  <a
                    href={lightboxWork.href}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn pill-btn-solid"
                  >
                    Open Full Project ↗
                  </a>
                  <a
                    href={BRAND.driveSamples}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn"
                  >
                    All Drive Samples ↗
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default PosterFanDeck;
