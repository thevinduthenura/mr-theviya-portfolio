import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { BRAND, GALLERY_PROJECTS } from '../data/portfolio';
import type { GalleryProject } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './HorizontalScrollGallery.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface HorizontalScrollGalleryProps {
  ready?: boolean;
}

/**
 * Videography & Motion Showcase (04 Real Video Reels + Live Embedded YouTube Player)
 * Zero vertical scroll-trapping on trackpads: smooth GSAP reveal + playable on-site reel
 * + horizontal swipeable / clickable reel strip with full lightbox preview.
 */
const HorizontalScrollGallery = ({ ready = true }: HorizontalScrollGalleryProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [modalItem, setModalItem] = useState<GalleryProject | null>(null);
  const [playingFeatured, setPlayingFeatured] = useState<boolean>(false);
  const lastModalWheelRef = useRef<number>(0);

  // ONLY the 4 real Videography & Motion reels (accurate 01 / 04 count!)
  const items = useMemo<GalleryProject[]>(
    () => GALLERY_PROJECTS.filter((p) => p.category === 'videography'),
    []
  );

  const featuredYoutube = useMemo(
    () => items.find((it) => Boolean(it.youtubeEmbedId)) ?? items[0],
    [items]
  );

  const stepModalItem = useCallback(
    (dir: 1 | -1) => {
      setModalItem((curr) => {
        if (!curr) return curr;
        const idx = items.findIndex((it) => it.id === curr.id);
        return items[(idx + dir + items.length) % items.length];
      });
    },
    [items]
  );

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.hs-panel');
      if (cards?.length) {
        gsap.from(cards, {
          y: 22,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: '.hs-reels-grid',
            start: 'top 88%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    if (!modalItem) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalItem(null);
      if (e.key === 'ArrowRight') stepModalItem(1);
      if (e.key === 'ArrowLeft') stepModalItem(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      smoother?.paused(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [modalItem, stepModalItem]);

  return (
    <section id="videography" ref={sectionRef} className="section-block hs-section">
      <div className="section-container">
        {/* Clean Header */}
        <div className="hs-top-bar">
          <div>
            <div className="hs-eyebrow">
              <span className="editorial-asterisk" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M18 3v30M3 18h30M7.4 7.4l21.2 21.2M28.6 7.4 7.4 28.6"
                    stroke="currentColor"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="micro-label">VIDEOGRAPHY &amp; MOTION · 04 REELS</span>
            </div>
            <KineticHeading
              as="h2"
              className="editorial-display hs-heading"
              lines={[
                { text: 'MOTION & REELS', tone: 'primary' },
                { text: 'aftermovies, trailers & edits', tone: 'reina' },
              ]}
            />
          </div>

          <div className="hs-top-right">
            <span className="hs-counter reina-display">04 reels</span>
            <a href={BRAND.youtube} target="_blank" rel="noreferrer" className="pill-btn">
              @SLVisualizer YouTube ↗
            </a>
          </div>
        </div>

        {/* Live Playable Featured Reel Right On-Site (Click-to-Play Facade + Live Embed) */}
        {featuredYoutube?.youtubeEmbedId && (
          <div className="hs-featured-player glass-panel">
            <div className="hs-featured-embed">
              {playingFeatured ? (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredYoutube.youtubeEmbedId}?autoplay=1&rel=0`}
                  title={featuredYoutube.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="hs-featured-facade"
                  onClick={() => setPlayingFeatured(true)}
                  aria-label={`Play ${featuredYoutube.title}`}
                >
                  <img
                    src={featuredYoutube.image}
                    alt={featuredYoutube.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="hs-facade-overlay">
                    <span className="hs-facade-play" aria-hidden="true">
                      ▶
                    </span>
                    <span className="hs-facade-label">PLAY YOUTUBE REEL ON SITE</span>
                  </span>
                </button>
              )}
            </div>
            <div className="hs-featured-meta">
              <span className="micro-label">FEATURED PLAYABLE EDIT · YOUTUBE</span>
              <h3 className="reina-display">{featuredYoutube.title.toLowerCase()}</h3>
              <p>{featuredYoutube.summary}</p>
              <div className="hs-featured-actions">
                <a
                  href={BRAND.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-btn pill-btn-solid"
                >
                  Watch Channel ↗
                </a>
                <a href={BRAND.driveSamples} target="_blank" rel="noreferrer" className="pill-btn">
                  Full Drive Reels ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 4 Real Video Reel Cards (Grid on Desktop, Smooth Horizontal Swipe on Mobile) */}
        <div className="hs-reels-grid">
          {items.map((item, idx) => (
            <article key={item.id} className="hs-panel">
              <button
                type="button"
                className="hs-frame"
                onClick={() => setModalItem(item)}
                aria-label={`Preview ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="hs-frame-img"
                  loading="lazy"
                  decoding="async"
                />
                <span className="hs-play-pill" aria-hidden="true">
                  ▶
                </span>
              </button>

              <div className="hs-caption">
                <div className="hs-caption-top">
                  <span className="hs-index">0{idx + 1} / 0{items.length}</span>
                  <span className="hs-platform">{item.mediaFormat ?? item.primaryPlatform}</span>
                </div>
                <h3>{item.title}</h3>
                <div className="hs-caption-foot">
                  <span>{item.client}</span>
                  <button
                    type="button"
                    className="hs-open-btn"
                    onClick={() => setModalItem(item)}
                  >
                    Preview ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Portal Video Preview Lightbox */}
      {modalItem &&
        createPortal(
          <div
            className="hs-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={modalItem.title}
            onClick={() => setModalItem(null)}
            onWheel={(e) => {
              e.stopPropagation();
              const now = performance.now();
              if (now - lastModalWheelRef.current < 240) return;
              const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
              if (Math.abs(delta) < 8) return;
              lastModalWheelRef.current = now;
              stepModalItem(delta > 0 ? 1 : -1);
            }}
          >
            <div className="hs-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="hs-modal-close"
                onClick={() => setModalItem(null)}
                aria-label="Close preview"
              >
                ✕
              </button>

              {modalItem.youtubeEmbedId ? (
                <div className="hs-modal-embed">
                  <iframe
                    src={`https://www.youtube.com/embed/${modalItem.youtubeEmbedId}?rel=0`}
                    title={modalItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="hs-modal-media">
                  <img src={modalItem.image} alt={modalItem.title} />
                  <a
                    href={modalItem.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hs-modal-play"
                  >
                    <span>▶</span>
                    Watch Reel on {modalItem.primaryPlatform} ↗
                  </a>
                </div>
              )}

              <div className="hs-modal-info">
                <span className="micro-label">
                  {modalItem.primaryPlatform} · {modalItem.client} · {modalItem.year}
                </span>
                <h3 className="reina-display">{modalItem.title.toLowerCase()}</h3>
                <p>{modalItem.summary}</p>
                <div className="hs-modal-links">
                  {modalItem.socialLinks.map((sl, i) => (
                    <a
                      key={sl.platform}
                      href={sl.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`pill-btn${i === 0 ? ' pill-btn-solid' : ''}`}
                    >
                      {sl.platform} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default HorizontalScrollGallery;
