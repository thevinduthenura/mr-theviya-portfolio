import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, GALLERY_PROJECTS } from '../data/portfolio';
import type { GalleryProject } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './ScrubbedBentoGallery.css';

gsap.registerPlugin(Flip, ScrollTrigger);

interface FlatPhotoFrame {
  key: string;
  src: string;
  shoot: GalleryProject;
  slideIndex: number;
  shootShortTitle: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * GSAP Scrubbed Bento Gallery (inspired by demos.gsap.com/demo/scrubbed-bento-gallery/)
 * Dedicated to all 7 real DSLR Photography collections (95 full-folder frames total).
 * 1) Pinned Scrubbed Bento pulls back from the center photograph into an 8-tile mosaic.
 * 2) Clean borderless Collection Contact Sheet below lets visitors browse all 95 photos
 *    by shoot or all at once, opening directly into the full-bleed lightbox filmstrip.
 */
const ScrubbedBentoGallery = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const archiveGridRef = useRef<HTMLDivElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const [activeAlbumId, setActiveAlbumId] = useState<string>('all');
  const [showAllFrames, setShowAllFrames] = useState<boolean>(false);
  const [activeShoot, setActiveShoot] = useState<GalleryProject | null>(null);
  const [slideIdx, setSlideIdx] = useState<number>(0);

  const photoShoots = useMemo(
    () => GALLERY_PROJECTS.filter((p) => p.category === 'photography'),
    []
  );

  const totalPhotoCount = useMemo(
    () =>
      photoShoots.reduce(
        (sum, shoot) => sum + (shoot.galleryImages?.length ?? 1),
        0
      ),
    [photoShoots]
  );

  // 8 bento hero slots across all 7 shoots + extra Blue Beach B&W artistic frame
  const bentoTiles = useMemo(() => {
    const get = (idx: number) => photoShoots[idx] ?? photoShoots[0];
    return [
      {
        key: 'bento-1',
        image: get(5).image,
        label: get(5).title,
        sub: 'Coastal Editorial',
        shoot: get(5),
        initialSlide: 0,
      },
      {
        key: 'bento-2',
        image: get(1).image,
        label: get(1).title,
        sub: 'Live Concert',
        shoot: get(1),
        initialSlide: 0,
      },
      {
        key: 'bento-3',
        image: get(0).image,
        label: get(0).title,
        sub: 'Stage Monochrome',
        shoot: get(0),
        initialSlide: 0,
      },
      {
        key: 'bento-4',
        image: get(2).image,
        label: get(2).title,
        sub: 'Graduation Portraits',
        shoot: get(2),
        initialSlide: 0,
      },
      {
        key: 'bento-5',
        image: get(3).image,
        label: get(3).title,
        sub: "Get '26 Live",
        shoot: get(3),
        initialSlide: 0,
      },
      {
        key: 'bento-6',
        image: get(4).image,
        label: get(4).title,
        sub: 'Event Story (20)',
        shoot: get(4),
        initialSlide: 0,
      },
      {
        key: 'bento-7',
        image: get(5).galleryImages?.[1] ?? get(5).image,
        label: 'Blue Beach - Monochrome',
        sub: 'B&W Horizon',
        shoot: get(5),
        initialSlide: 1,
      },
      {
        key: 'bento-8',
        image: get(6).image,
        label: get(6).title,
        sub: 'Celebration Portraits',
        shoot: get(6),
        initialSlide: 0,
      },
    ];
  }, [photoShoots]);

  // Build visible frames for the clean borderless photography archive below the bento
  const visibleFrames = useMemo<FlatPhotoFrame[]>(() => {
    if (activeAlbumId !== 'all') {
      const shoot = photoShoots.find((s) => s.id === activeAlbumId);
      if (!shoot) return [];
      const shortTitle = shoot.title.split(' - ')[0];
      const imgs = shoot.galleryImages ?? [shoot.image];
      return imgs.map((src, idx) => ({
        key: `${shoot.id}-${idx}`,
        src,
        shoot,
        slideIndex: idx,
        shootShortTitle: shortTitle,
      }));
    }

    if (showAllFrames) {
      return photoShoots.flatMap((shoot) => {
        const shortTitle = shoot.title.split(' - ')[0];
        const imgs = shoot.galleryImages ?? [shoot.image];
        return imgs.map((src, idx) => ({
          key: `${shoot.id}-${idx}`,
          src,
          shoot,
          slideIndex: idx,
          shootShortTitle: shortTitle,
        }));
      });
    }

    // Balanced preview across all 7 shoots (3 each = 21 frames) until user reveals all 95
    return photoShoots.flatMap((shoot) => {
      const shortTitle = shoot.title.split(' - ')[0];
      const imgs = (shoot.galleryImages ?? [shoot.image]).slice(0, 3);
      return imgs.map((src, idx) => ({
        key: `${shoot.id}-${idx}`,
        src,
        shoot,
        slideIndex: idx,
        shootShortTitle: shortTitle,
      }));
    });
  }, [activeAlbumId, photoShoots, showAllFrames]);

  // GSAP Scrubbed Bento ScrollTrigger + Flip (matchMedia: pinned scrub on desktop, smooth scroll reveal on mobile)
  useEffect(() => {
    const wrapEl = wrapRef.current;
    const gridEl = gridRef.current;
    if (!wrapEl || !gridEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 860px)', () => {
      const tiles = gridEl.querySelectorAll<HTMLElement>('.sb-tile');

      gridEl.classList.remove('is-expanded');
      const finalState = Flip.getState(tiles);

      gridEl.classList.add('is-expanded');

      const flipTween = Flip.to(finalState, {
        scale: true,
        ease: 'none',
        absolute: false,
        simple: true,
      });

      ScrollTrigger.create({
        trigger: wrapEl,
        start: 'top top',
        end: '+=155%',
        pin: true,
        scrub: 0.9,
        animation: flipTween,
        invalidateOnRefresh: true,
      });
    });

    mm.add('(max-width: 859px)', () => {
      gridEl.classList.remove('is-expanded');
      const tiles = gridEl.querySelectorAll<HTMLElement>('.sb-tile');
      gsap.from(tiles, {
        y: 26,
        opacity: 0,
        scale: 0.96,
        duration: 0.65,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: gridEl,
          start: 'top 86%',
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  // Animate contact-sheet frames on album change & refresh ScrollTrigger for downstream pins
  useEffect(() => {
    const el = archiveGridRef.current;
    if (el) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        const cards = el.querySelectorAll('.sb-shot');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: { amount: 0.35, from: 'start' },
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    }

    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [activeAlbumId, showAllFrames]);

  // Keep active thumbnail centered inside the horizontal lightbox filmstrip
  useEffect(() => {
    if (!activeShoot || !thumbsRef.current) return;
    const activeBtn = thumbsRef.current.children[slideIdx] as HTMLElement | undefined;
    activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeShoot, slideIdx]);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!activeShoot) return;
    const slides = activeShoot.galleryImages ?? [activeShoot.image];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveShoot(null);
      if (e.key === 'ArrowRight') setSlideIdx((i) => (i + 1) % slides.length);
      if (e.key === 'ArrowLeft') setSlideIdx((i) => (i - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeShoot]);

  const openShoot = (shoot: GalleryProject, startIdx = 0) => {
    setSlideIdx(startIdx);
    setActiveShoot(shoot);
  };

  const slides = activeShoot ? activeShoot.galleryImages ?? [activeShoot.image] : [];
  const activeShootObj = photoShoots.find((s) => s.id === activeAlbumId);

  return (
    <section id="photography" className="sb-section">
      {/* Intro Header Above Pinned Scrubbed Bento Stage */}
      <div className="section-container sb-header">
        <div>
          <div className="sb-eyebrow">
            <span className="editorial-asterisk" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
                <path
                  d="M18 3v30M3 18h30M7.4 7.4l21.2 21.2M28.6 7.4 7.4 28.6"
                  stroke="currentColor"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="micro-label">
              PHOTOGRAPHY · {totalPhotoCount} FRAMES · GSAP SCRUBBED BENTO
            </span>
          </div>
          <KineticHeading
            as="h2"
            className="editorial-display sb-heading"
            lines={[
              { text: 'CAPTURED FRAMES', tone: 'primary' },
              { text: 'through the lens', tone: 'reina' },
            ]}
          />
        </div>

        <div className="sb-header-meta">
          <p>
            Scroll to pull back from the centerpiece into 7 complete photography shoots (
            {totalPhotoCount} curated frames) - click any photograph to inspect full-bleed.
          </p>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="pill-btn">
            @mr.theviya on Instagram ↗
          </a>
        </div>
      </div>

      {/* Pinned Full-Viewport Scrubbed Bento Stage */}
      <div ref={wrapRef} className="sb-pin-wrap">
        <div ref={gridRef} className="sb-bento-grid">
          {bentoTiles.map((tile, idx) => (
            <button
              key={tile.key}
              type="button"
              className={`sb-tile sb-tile-${idx + 1}`}
              onClick={() => openShoot(tile.shoot, tile.initialSlide)}
              aria-label={`Open ${tile.label} photography collection`}
            >
              <img src={tile.image} alt={tile.label} loading="lazy" />
              <div className="sb-tile-hover">
                <span className="sb-tile-sub">{tile.sub}</span>
                <strong>{tile.label}</strong>
                <span className="sb-tile-cta">
                  Open {tile.shoot.galleryImages?.length ?? 1} Shots ↗
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Complete Borderless Photography Contact Sheet (All 95 Photos by Shoot) */}
      <div className="section-container sb-archive">
        <div className="sb-archive-head">
          <div>
            <span className="micro-label">COMPLETE SHOOT ARCHIVE · {totalPhotoCount} PHOTOGRAPHS</span>
            <h3 className="sb-archive-title reina-display">
              {activeShootObj ? activeShootObj.title.toLowerCase() : 'all 7 photography collections'}
            </h3>
          </div>

          {activeShootObj && (
            <a
              href={activeShootObj.href}
              target="_blank"
              rel="noreferrer"
              className="pill-btn"
            >
              View on {activeShootObj.primaryPlatform} ↗
            </a>
          )}
        </div>

        {/* Shoot Filter Strip */}
        <div className="sb-album-tabs" role="tablist" aria-label="Filter photography collections">
          <button
            type="button"
            role="tab"
            aria-selected={activeAlbumId === 'all'}
            className={`sb-album-tab${activeAlbumId === 'all' ? ' is-active' : ''}`}
            onClick={() => setActiveAlbumId('all')}
          >
            All Shoots ({totalPhotoCount})
          </button>
          {photoShoots.map((shoot) => {
            const shortName = shoot.title.split(' - ')[0];
            const count = shoot.galleryImages?.length ?? 1;
            return (
              <button
                key={shoot.id}
                type="button"
                role="tab"
                aria-selected={activeAlbumId === shoot.id}
                className={`sb-album-tab${activeAlbumId === shoot.id ? ' is-active' : ''}`}
                onClick={() => setActiveAlbumId(shoot.id)}
              >
                {shortName} ({pad2(count)})
              </button>
            );
          })}
        </div>

        {/* Pure Uncluttered Photo Wall */}
        <div ref={archiveGridRef} className="sb-contact-grid">
          {visibleFrames.map((frame) => (
            <button
              key={frame.key}
              type="button"
              className="sb-shot"
              onClick={() => openShoot(frame.shoot, frame.slideIndex)}
              aria-label={`Inspect ${frame.shootShortTitle} frame ${frame.slideIndex + 1}`}
            >
              <img
                src={frame.src}
                alt={`${frame.shootShortTitle} - photo ${frame.slideIndex + 1}`}
                loading="lazy"
                decoding="async"
              />
              <span className="sb-shot-hover">
                {frame.shootShortTitle} · {pad2(frame.slideIndex + 1)}
              </span>
            </button>
          ))}
        </div>

        {/* Expand / Collapse All 95 Photos Button when in "All Shoots" view */}
        {activeAlbumId === 'all' && (
          <div className="sb-archive-more">
            <button
              type="button"
              className="pill-btn pill-btn-solid"
              onClick={() => setShowAllFrames((v) => !v)}
            >
              {showAllFrames
                ? 'Collapse to Highlights ↑'
                : `Show All ${totalPhotoCount} Photographs ↓`}
            </button>
          </div>
        )}
      </div>

      {/* Full-Bleed Clean Photography Lightbox Portal */}
      {activeShoot &&
        createPortal(
          <div
            className="sb-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={activeShoot.title}
            onClick={() => setActiveShoot(null)}
          >
            <div className="sb-lightbox glass-panel" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="sb-lightbox-close"
                onClick={() => setActiveShoot(null)}
                aria-label="Close photo viewer"
              >
                ✕
              </button>

              <div
                className="sb-lightbox-stage"
                onTouchStart={(e) => {
                  touchStartXRef.current = e.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(e) => {
                  const startX = touchStartXRef.current;
                  const endX = e.changedTouches[0]?.clientX;
                  touchStartXRef.current = null;
                  if (startX === null || endX === undefined || slides.length < 2) return;
                  const delta = endX - startX;
                  if (Math.abs(delta) > 42) {
                    setSlideIdx((i) =>
                      delta < 0
                        ? (i + 1) % slides.length
                        : (i - 1 + slides.length) % slides.length
                    );
                  }
                }}
              >
                <img
                  src={slides[slideIdx] ?? activeShoot.image}
                  alt={`${activeShoot.title} - frame ${slideIdx + 1}`}
                />
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="sb-arrow sb-prev"
                      onClick={() => setSlideIdx((i) => (i - 1 + slides.length) % slides.length)}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="sb-arrow sb-next"
                      onClick={() => setSlideIdx((i) => (i + 1) % slides.length)}
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="sb-lightbox-bar">
                <div className="sb-lightbox-meta">
                  <span className="micro-label">
                    {activeShoot.client} · {pad2(slideIdx + 1)} / {pad2(slides.length)}
                  </span>
                  <h3 className="reina-display">{activeShoot.title.toLowerCase()}</h3>
                </div>

                <div className="sb-lightbox-links">
                  {activeShoot.socialLinks.map((sl, i) => (
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

              {/* Scrollable Filmstrip for 5 to 22+ Photos */}
              <div ref={thumbsRef} className="sb-lightbox-thumbs" aria-label="Shoot filmstrip">
                {slides.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={i === slideIdx ? 'is-active' : ''}
                    onClick={() => setSlideIdx(i)}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default ScrubbedBentoGallery;
