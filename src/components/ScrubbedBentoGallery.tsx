import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { BRAND, GALLERY_PROJECTS } from '../data/portfolio';
import type { GalleryProject } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './ScrubbedBentoGallery.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

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
interface ScrubbedBentoGalleryProps {
  ready?: boolean;
}

const ScrubbedBentoGallery = ({ ready = true }: ScrubbedBentoGalleryProps) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const archiveGridRef = useRef<HTMLDivElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const lbStageRef = useRef<HTMLDivElement | null>(null);
  const lbTrackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragBaseXRef = useRef<number>(0);
  const dragOffsetPxRef = useRef<number>(0);
  const lastWheelMsRef = useRef<number>(0);
  const lbOpenInitRef = useRef<boolean>(false);

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

  // Exact 7 unique bento slots matching the 7 distinct photography collections (zero repeats!)
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
        sub: 'Live Concert Stage',
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
        sub: 'Book Launch Story',
        shoot: get(4),
        initialSlide: 0,
      },
      {
        key: 'bento-7',
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

  // GSAP Scrubbed Bento ScrollTrigger (runs ONLY after ScrollSmoother is ready so pinType & pinSpacing are exact!)
  useEffect(() => {
    if (!ready) return;
    const wrapEl = wrapRef.current;
    const gridEl = gridRef.current;
    if (!wrapEl || !gridEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 860px)', () => {
      const outerTiles = gridEl.querySelectorAll<HTMLElement>('.sb-tile:not(.sb-tile-3)');
      const tileImgs = gridEl.querySelectorAll<HTMLImageElement>('.sb-tile img');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapEl,
          start: 'top top',
          end: '+=55%',
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        gridEl,
        { scale: 1.55, transformOrigin: '50% 50%' },
        { scale: 1, ease: 'none', duration: 1 },
        0
      )
        .fromTo(outerTiles, { opacity: 0.35 }, { opacity: 1, ease: 'none', duration: 0.7 }, 0.1)
        .fromTo(tileImgs, { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1 }, 0);
    });

    mm.add('(max-width: 859px)', () => {
      const tiles = gridEl.querySelectorAll<HTMLElement>('.sb-tile');
      const heroTileImg = gridEl.querySelector<HTMLImageElement>('.sb-tile-3 img');

      // Smooth GPU staggered mobile bento reveal via ScrollTrigger.batch
      gsap.set(tiles, { y: 32, opacity: 0, scale: 0.94 });
      ScrollTrigger.batch(tiles, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          });
        },
      });

      // Subtle scrubbed zoom parallax on mobile centerpiece tile
      if (heroTileImg) {
        gsap.fromTo(
          heroTileImg,
          { scale: 1.16 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.sb-tile-3',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [ready]);

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

  // Lock background ScrollSmoother & body scroll while lightbox is open
  useEffect(() => {
    if (!activeShoot) {
      lbOpenInitRef.current = false;
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    return () => {
      document.body.style.overflow = prevOverflow;
      smoother?.paused(false);
    };
  }, [activeShoot]);

  const computeCenterX = useCallback((idx: number) => {
    const stage = lbStageRef.current;
    const track = lbTrackRef.current;
    if (!stage || !track) return 0;
    const target = track.children[idx] as HTMLElement | undefined;
    if (!target) return 0;
    return -(target.offsetLeft + target.offsetWidth / 2 - stage.clientWidth / 2);
  }, []);

  // Smooth GSAP horizontal side-scroll glide centering active slide with peeking neighbors
  useEffect(() => {
    if (!activeShoot || !lbTrackRef.current || !lbStageRef.current) return;
    const track = lbTrackRef.current;

    const align = (instant: boolean) => {
      const targetX = computeCenterX(slideIdx);
      dragBaseXRef.current = targetX;
      if (instant) {
        gsap.set(track, { x: targetX });
      } else {
        gsap.to(track, {
          x: targetX,
          duration: 0.65,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    if (!lbOpenInitRef.current) {
      const raf = window.requestAnimationFrame(() => {
        align(true);
        lbOpenInitRef.current = true;
      });
      return () => window.cancelAnimationFrame(raf);
    }

    align(false);

    const onResize = () => align(true);
    window.addEventListener('resize', onResize);

    if (thumbsRef.current) {
      const activeBtn = thumbsRef.current.children[slideIdx] as HTMLElement | undefined;
      activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    return () => window.removeEventListener('resize', onResize);
  }, [activeShoot, slideIdx, computeCenterX]);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!activeShoot) return;
    const shootSlides = activeShoot.galleryImages ?? [activeShoot.image];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveShoot(null);
      if (e.key === 'ArrowRight') setSlideIdx((i) => (i + 1) % shootSlides.length);
      if (e.key === 'ArrowLeft') setSlideIdx((i) => (i - 1 + shootSlides.length) % shootSlides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeShoot]);

  const openShoot = (shoot: GalleryProject, startIdx = 0) => {
    lbOpenInitRef.current = false;
    setSlideIdx(startIdx);
    setActiveShoot(shoot);
  };

  const slides = useMemo(
    () => (activeShoot ? activeShoot.galleryImages ?? [activeShoot.image] : []),
    [activeShoot]
  );

  const stepSlide = useCallback(
    (dir: 1 | -1) => {
      if (slides.length < 2) return;
      setSlideIdx((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  const handleStageWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (slides.length < 2) return;
      e.stopPropagation();
      const now = performance.now();
      if (now - lastWheelMsRef.current < 230) return;
      const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primaryDelta) < 8) return;
      lastWheelMsRef.current = now;
      stepSlide(primaryDelta > 0 ? 1 : -1);
    },
    [slides.length, stepSlide]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (slides.length < 2) return;
    if ((e.target as HTMLElement).closest('button.sb-arrow')) return;
    dragStartXRef.current = e.clientX;
    dragOffsetPxRef.current = 0;
    dragBaseXRef.current = computeCenterX(slideIdx);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null || !lbTrackRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    dragOffsetPxRef.current = dx;
    gsap.set(lbTrackRef.current, { x: dragBaseXRef.current + dx });
  };

  const handlePointerUp = () => {
    if (dragStartXRef.current === null) return;
    const dx = dragOffsetPxRef.current;
    dragStartXRef.current = null;
    dragOffsetPxRef.current = 0;

    if (Math.abs(dx) > 48) {
      stepSlide(dx < 0 ? 1 : -1);
    } else if (lbTrackRef.current) {
      gsap.to(lbTrackRef.current, {
        x: dragBaseXRef.current,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };
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
              PHOTOGRAPHY · 7 COLLECTIONS · {totalPhotoCount} FRAMES
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
            Seven complete shoots spanning live concerts, graduations, coastal editorials, and
            portraits - click any frame to open the full collection viewer.
          </p>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="pill-btn">
            @mr.theviya on Instagram ↗
          </a>
        </div>
      </div>

      {/* Pinned Full-Viewport Scrubbed Bento Stage (isolated pin outer wrapper) */}
      <div className="sb-pin-outer">
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
            onWheel={handleStageWheel}
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
                ref={lbStageRef}
                className="sb-lightbox-stage"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <div ref={lbTrackRef} className="sb-lightbox-track">
                  {slides.map((src, i) => {
                    const isCurrent = i === slideIdx;
                    const isAdjacent = Math.abs(i - slideIdx) === 1;
                    return (
                      <div
                        key={src}
                        className={`sb-lightbox-slide${isCurrent ? ' is-current' : ''}${
                          isAdjacent ? ' is-adjacent' : ''
                        }`}
                        onClick={() => {
                          if (!isCurrent && Math.abs(dragOffsetPxRef.current) < 8) {
                            setSlideIdx(i);
                          }
                        }}
                      >
                        <img
                          src={src}
                          alt={`${activeShoot.title} - frame ${i + 1}`}
                          draggable={false}
                          decoding="async"
                        />
                      </div>
                    );
                  })}
                </div>
                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="sb-arrow sb-prev"
                      onClick={() => stepSlide(-1)}
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="sb-arrow sb-next"
                      onClick={() => stepSlide(1)}
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
                    {activeShoot.client} · {pad2(slideIdx + 1)} / {pad2(slides.length)} · SCROLL OR
                    DRAG
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

              {/* Scrollable Filmstrip for 5 to 22+ Photos (wheel translates vertically to horizontal) */}
              <div
                ref={thumbsRef}
                className="sb-lightbox-thumbs"
                aria-label="Shoot filmstrip"
                onWheel={(e) => {
                  if (!thumbsRef.current) return;
                  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    thumbsRef.current.scrollLeft += e.deltaY * 1.4;
                  }
                }}
              >
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
