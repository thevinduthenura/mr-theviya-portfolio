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

/**
 * GSAP Horizontal Scrolling Gallery (inspired by demos.gsap.com/demo/horizontal-scrolling-gallery/)
 * Showcases Videography Social Previews + Flagship Campaigns in a pinned horizontal cinema rail
 * with inner image parallax (containerAnimation) and zero clutter over the visuals.
 */
interface HorizontalScrollGalleryProps {
  ready?: boolean;
}

const HorizontalScrollGallery = ({ ready = true }: HorizontalScrollGalleryProps) => {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [modalItem, setModalItem] = useState<GalleryProject | null>(null);
  const lastModalWheelRef = useRef<number>(0);

  // Curate Videography (4) + Flagship Visual Projects (4) = 8 clean horizontal cinema panels
  const items = useMemo<GalleryProject[]>(
    () => [
      ...GALLERY_PROJECTS.filter((p) => p.category === 'videography'),
      ...GALLERY_PROJECTS.filter((p) =>
        ['proj-wiramaya', 'proj-sunway', 'proj-christmas-promise', 'wd-cinevault'].includes(p.id)
      ),
    ],
    []
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
    if (!ready) return;
    const pinEl = pinRef.current;
    const trackEl = trackRef.current;
    if (!pinEl || !trackEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Desktop (>= 860px): pinned GSAP horizontal cinema rail + inner parallax
    // Mobile (< 860px): silky native horizontal touch-swipe snap carousel
    const mm = gsap.matchMedia();

    mm.add('(min-width: 860px)', () => {
      const getScrollAmount = () => Math.max(0, trackEl.scrollWidth - pinEl.clientWidth + 96);

      const horizontalTween = gsap.to(trackEl, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${Math.max(900, getScrollAmount())}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: self.progress });
            }
            const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            setActiveIndex((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      // Inner parallax on every horizontal panel image via containerAnimation
      const imgs = trackEl.querySelectorAll<HTMLImageElement>('.hs-frame-img');
      imgs.forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -9, scale: 1.16 },
          {
            xPercent: 9,
            scale: 1.16,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.hs-panel'),
              containerAnimation: horizontalTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });
    });

    // Mobile (< 860px): crisp GSAP ScrollTrigger entrance for the touch-swipe cinema rail
    mm.add('(max-width: 859px)', () => {
      const panels = trackEl.querySelectorAll<HTMLElement>('.hs-panel');
      gsap.fromTo(
        panels,
        { x: 36, opacity: 0, scale: 0.94 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top 84%',
            once: true,
          },
        }
      );
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [items.length, ready]);

  const handleMobileSwipeScroll = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    const maxScroll = Math.max(1, vp.scrollWidth - vp.clientWidth);
    const ratio = Math.min(1, Math.max(0, vp.scrollLeft / maxScroll));
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${ratio})`;
    }
    const idx = Math.min(items.length - 1, Math.round(ratio * (items.length - 1)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  };

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
    <section id="videography" className="hs-section">
      <div ref={pinRef} className="hs-pin-stage">
        {/* Top Clean Strip */}
        <div className="section-container hs-top-bar">
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
              <span className="micro-label">VIDEOGRAPHY &amp; REELS · GSAP HORIZONTAL GALLERY</span>
            </div>
            <KineticHeading
              as="h2"
              className="editorial-display hs-heading"
              lines={[
                { text: 'MOTION & REELS', tone: 'primary' },
                { text: 'cinema filmstrip', tone: 'reina' },
              ]}
            />
          </div>

          <div className="hs-top-right">
            <span className="hs-counter reina-display">
              0{activeIndex + 1} / 0{items.length}
            </span>
            <a href={BRAND.driveSamples} target="_blank" rel="noreferrer" className="pill-btn">
              Google Drive Reels ↗
            </a>
          </div>
        </div>

        {/* Horizontal Gliding Filmstrip Track */}
        <div
          ref={viewportRef}
          className="hs-viewport"
          onScroll={handleMobileSwipeScroll}
        >
          <div ref={trackRef} className="hs-track">
            {items.map((item, idx) => {
              const isVideo = item.category === 'videography';
              const isFocused = idx === activeIndex;
              return (
                <article
                  key={item.id}
                  className={`hs-panel${isFocused ? ' is-focused' : ''}`}
                >
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
                    />
                    {isVideo && (
                      <span className="hs-play-pill" aria-hidden="true">
                        ▶
                      </span>
                    )}
                  </button>

                  {/* Clean Museum Caption BELOW image (zero overlap on artwork!) */}
                  <div className="hs-caption">
                    <div className="hs-caption-top">
                      <span className="hs-index">0{idx + 1}</span>
                      <span className="hs-platform">
                        {item.primaryPlatform} · {item.categoryLabel}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="hs-caption-foot">
                      <span>{item.client}</span>
                      <button
                        type="button"
                        className="hs-open-btn"
                        onClick={() => setModalItem(item)}
                      >
                        {isVideo ? 'Watch Preview ↗' : 'Inspect ↗'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom Scrub Progress Bar */}
        <div className="section-container hs-bottom-bar">
          <span className="micro-label">SCROLL TO GLIDE HORIZONTALLY</span>
          <div className="hs-progress-track">
            <div ref={progressBarRef} className="hs-progress-fill" />
          </div>
          <a href={BRAND.youtube} target="_blank" rel="noreferrer" className="micro-label hs-yt-link">
            @SLVISUALIZER YOUTUBE ↗
          </a>
        </div>
      </div>

      {/* Portal Video & Social Preview Lightbox */}
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
                  {modalItem.category === 'videography' && (
                    <a
                      href={modalItem.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hs-modal-play"
                    >
                      <span>▶</span>
                      Open Reel on {modalItem.primaryPlatform} ↗
                    </a>
                  )}
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
