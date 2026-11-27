import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { BRAND, GALLERY_PROJECTS, GRAPHIC_SUB_TABS } from '../data/portfolio';
import type { DesignTabId, GalleryProject } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './ProjectGallery.css';

gsap.registerPlugin(Flip, ScrollTrigger, ScrollSmoother);

interface ProjectGalleryProps {
  activeTab: DesignTabId;
  onChangeTab: (tab: DesignTabId) => void;
}

const DESIGN_TABS: { id: DesignTabId; label: string }[] = [
  ...GRAPHIC_SUB_TABS,
  { id: 'web-design', label: 'Web Design (04)' },
];

/**
 * GSAP Animate CSS Grid Positions Gallery (inspired by demos.gsap.com/demo/animate-css-grid-positions/)
 * Clean, un-cluttered exhibition frames with captions below the artwork.
 * Clicking ANY project smoothly animates CSS grid positions via GSAP Flip, expanding that card
 * into a live 2x2 spotlight slot right inside the grid with multi-slide switching!
 */
const ProjectGallery = ({ activeTab, onChangeTab }: ProjectGalleryProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const lbStageRef = useRef<HTMLDivElement | null>(null);
  const lbTrackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragBaseXRef = useRef<number>(0);
  const dragOffsetPxRef = useRef<number>(0);
  const lastWheelMsRef = useRef<number>(0);
  const lbInitRef = useRef<boolean>(false);

  const [expandedId, setExpandedId] = useState<string>('proj-wiramaya');
  const [expandedSlide, setExpandedSlide] = useState<number>(0);
  const [lightboxItem, setLightboxItem] = useState<GalleryProject | null>(null);
  const [lightboxSlide, setLightboxSlide] = useState<number>(0);

  const items = GALLERY_PROJECTS.filter((p) => {
    if (activeTab === 'web-design') return p.category === 'web-design';
    if (p.category !== 'graphic-design') return false;
    if (activeTab === 'all') return true;
    return p.subGroup === activeTab;
  });

  const captureFlip = () => {
    if (gridRef.current) {
      flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll('.ag-item'));
    }
  };

  const handleSelectTab = (tab: DesignTabId) => {
    if (tab === activeTab) return;
    captureFlip();
    onChangeTab(tab);
    setExpandedSlide(0);
    // Highlight first item in the newly selected tab
    const nextList = GALLERY_PROJECTS.filter((p) => {
      if (tab === 'web-design') return p.category === 'web-design';
      if (p.category !== 'graphic-design') return false;
      if (tab === 'all') return true;
      return p.subGroup === tab;
    });
    if (nextList[0]) setExpandedId(nextList[0].id);
  };

  const handleExpandItem = (id: string) => {
    if (id === expandedId) return;
    captureFlip();
    setExpandedId(id);
    setExpandedSlide(0);
  };

  // GSAP Flip: Animate CSS Grid Positions fluidly on card click OR tab switch
  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state || !gridRef.current) return;
    flipStateRef.current = null;

    Flip.from(state, {
      targets: gridRef.current.querySelectorAll('.ag-item'),
      duration: 0.72,
      ease: 'power3.inOut',
      stagger: 0.02,
      absolute: true,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.28, ease: 'power2.in' }),
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });
  }, [expandedId, activeTab]);

  // Subtle GSAP ScrollTrigger.batch lift (always visible by default so jump-scroll never leaves cards blank)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll('.ag-item');
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 20 },
            {
              y: 0,
              duration: 0.55,
              stagger: 0.04,
              ease: 'power3.out',
              clearProps: 'transform',
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pause ScrollSmoother & lock body scroll while project lightbox is open
  useEffect(() => {
    if (!lightboxItem) {
      lbInitRef.current = false;
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
  }, [lightboxItem]);

  const computeLbCenterX = useCallback((idx: number) => {
    const stage = lbStageRef.current;
    const track = lbTrackRef.current;
    if (!stage || !track) return 0;
    const target = track.children[idx] as HTMLElement | undefined;
    if (!target) return 0;
    return -(target.offsetLeft + target.offsetWidth / 2 - stage.clientWidth / 2);
  }, []);

  // Smooth GSAP side-scroll glide inside project lightbox with peeking neighbors
  useEffect(() => {
    if (!lightboxItem || !lbTrackRef.current || !lbStageRef.current) return;
    const track = lbTrackRef.current;

    const align = (instant: boolean) => {
      const targetX = computeLbCenterX(lightboxSlide);
      dragBaseXRef.current = targetX;
      if (instant) {
        gsap.set(track, { x: targetX });
      } else {
        gsap.to(track, {
          x: targetX,
          duration: 0.62,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    if (!lbInitRef.current) {
      const raf = window.requestAnimationFrame(() => {
        align(true);
        lbInitRef.current = true;
      });
      return () => window.cancelAnimationFrame(raf);
    }

    align(false);
    const onResize = () => align(true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [lightboxItem, lightboxSlide, computeLbCenterX]);

  // Keyboard support in lightbox
  useEffect(() => {
    if (!lightboxItem) return;
    const slides = lightboxItem.galleryImages ?? [lightboxItem.image];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
      if (slides.length > 1 && e.key === 'ArrowRight') {
        setLightboxSlide((i) => (i + 1) % slides.length);
      }
      if (slides.length > 1 && e.key === 'ArrowLeft') {
        setLightboxSlide((i) => (i - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxItem]);

  const lbSlides = lightboxItem ? lightboxItem.galleryImages ?? [lightboxItem.image] : [];
  const lbCount = lbSlides.length;

  const stepLbSlide = (dir: 1 | -1) => {
    if (lbCount < 2) return;
    setLightboxSlide((s) => (s + dir + lbCount) % lbCount);
  };

  const handleLbWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (lbCount < 2) return;
    e.stopPropagation();
    const now = performance.now();
    if (now - lastWheelMsRef.current < 230) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    lastWheelMsRef.current = now;
    stepLbSlide(delta > 0 ? 1 : -1);
  };

  const handleLbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lbSlides.length < 2 || (e.target as HTMLElement).closest('button.ag-modal-arrow')) return;
    dragStartXRef.current = e.clientX;
    dragOffsetPxRef.current = 0;
    dragBaseXRef.current = computeLbCenterX(lightboxSlide);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleLbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null || !lbTrackRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    dragOffsetPxRef.current = dx;
    gsap.set(lbTrackRef.current, { x: dragBaseXRef.current + dx });
  };

  const handleLbPointerUp = () => {
    if (dragStartXRef.current === null) return;
    const dx = dragOffsetPxRef.current;
    dragStartXRef.current = null;
    dragOffsetPxRef.current = 0;
    if (Math.abs(dx) > 48) {
      stepLbSlide(dx < 0 ? 1 : -1);
    } else if (lbTrackRef.current) {
      gsap.to(lbTrackRef.current, {
        x: dragBaseXRef.current,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section id="gallery" ref={sectionRef} className="section-block ag-section">
      <div className="section-container">
        {/* Clean Editorial Header */}
        <div className="ag-header">
          <div>
            <div className="ag-eyebrow">
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
              <span className="micro-label">SELECTED WORK · GRAPHIC &amp; WEB DESIGN</span>
            </div>

            <KineticHeading
              as="h2"
              className="editorial-display ag-heading"
              lines={[
                { text: 'SELECTED DESIGN', tone: 'primary' },
                { text: 'click any project for case study', tone: 'reina' },
              ]}
            />
          </div>

          <div className="ag-header-actions">
            <a href={BRAND.behancePosters} target="_blank" rel="noreferrer" className="pill-btn">
              Behance Poster Gallery ↗
            </a>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="ag-tabs" role="tablist" aria-label="Filter graphic and web design works">
          {DESIGN_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className={`ag-tab${activeTab === t.id ? ' is-active' : ''}`}
              onClick={() => handleSelectTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* GSAP Flip Animated CSS Grid (Click any item to smoothly expand it to 2x2!) */}
        <div ref={gridRef} className="ag-grid">
          {items.map((item) => {
            const isExpanded = item.id === expandedId;
            const slides = item.galleryImages?.length ? item.galleryImages : [item.image];
            const displayImg = isExpanded ? slides[expandedSlide % slides.length] : item.image;

            return (
              <article
                key={item.id}
                data-flip-id={item.id}
                className={`ag-item${isExpanded ? ' is-expanded' : ''}`}
                onClick={() => {
                  if (!isExpanded) handleExpandItem(item.id);
                }}
              >
                {/* Clean Un-Cluttered Artwork Frame */}
                <div className="ag-art-frame">
                  <img src={displayImg} alt={item.title} loading="lazy" />

                  {isExpanded && slides.length > 1 && (
                    <div className="ag-slide-controls" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSlide((s) => (s - 1 + slides.length) % slides.length)
                        }
                        aria-label="Previous slide"
                      >
                        ‹
                      </button>
                      <span>
                        0{(expandedSlide % slides.length) + 1} / 0{slides.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedSlide((s) => (s + 1) % slides.length)}
                        aria-label="Next slide"
                      >
                        ›
                      </button>
                    </div>
                  )}

                  {isExpanded && (
                    <button
                      type="button"
                      className="ag-zoom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxSlide(expandedSlide % slides.length);
                        setLightboxItem(item);
                      }}
                    >
                      Full View ↗
                    </button>
                  )}
                </div>

                {/* Clean Catalog Label BELOW Artwork (Never Blocking the Photo!) */}
                <div className="ag-meta">
                  <div className="ag-meta-top">
                    <span className="ag-meta-client">
                      {item.client}
                      {slides.length > 1 ? ` · ${slides.length} slides` : ''}
                    </span>
                    <span className="ag-meta-year">{item.year}</span>
                  </div>
                  <h3>{item.title}</h3>

                  {isExpanded && (
                    <div className="ag-expanded-details" onClick={(e) => e.stopPropagation()}>
                      {item.caseStudy ? (
                        <div className="ag-case-study">
                          <div>
                            <span className="ag-cs-label">MY ROLE</span>
                            <p>{item.caseStudy.role}</p>
                          </div>
                          <div>
                            <span className="ag-cs-label">THE BRIEF</span>
                            <p>{item.caseStudy.brief}</p>
                          </div>
                          <div>
                            <span className="ag-cs-label">OUTCOME</span>
                            <p>{item.caseStudy.outcome}</p>
                          </div>
                        </div>
                      ) : (
                        <p>{item.summary}</p>
                      )}
                      {slides.length > 1 && (
                        <div className="ag-inline-thumbs">
                          {slides.map((src, idx) => (
                            <button
                              key={src}
                              type="button"
                              className={idx === expandedSlide % slides.length ? 'is-active' : ''}
                              onClick={() => setExpandedSlide(idx)}
                              aria-label={`Slide ${idx + 1}`}
                            >
                              <img src={src} alt="" loading="lazy" />
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="ag-expanded-links">
                        {item.socialLinks.map((sl, i) => (
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
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Portal Full-Screen Lightbox */}
      {lightboxItem &&
        createPortal(
          <div
            className="ag-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.title}
            onClick={() => setLightboxItem(null)}
            onWheel={handleLbWheel}
          >
            <div className="ag-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="ag-modal-close"
                onClick={() => setLightboxItem(null)}
                aria-label="Close full view"
              >
                ✕
              </button>
              <div
                ref={lbStageRef}
                className="ag-modal-stage"
                onPointerDown={handleLbPointerDown}
                onPointerMove={handleLbPointerMove}
                onPointerUp={handleLbPointerUp}
                onPointerCancel={handleLbPointerUp}
              >
                <div ref={lbTrackRef} className="ag-modal-track">
                  {lbSlides.map((src, i) => {
                    const isCurrent = i === lightboxSlide;
                    const isAdjacent = Math.abs(i - lightboxSlide) === 1;
                    return (
                      <div
                        key={src}
                        className={`ag-modal-slide${isCurrent ? ' is-current' : ''}${
                          isAdjacent ? ' is-adjacent' : ''
                        }`}
                        onClick={() => {
                          if (!isCurrent && Math.abs(dragOffsetPxRef.current) < 8) {
                            setLightboxSlide(i);
                          }
                        }}
                      >
                        <img
                          src={src}
                          alt={`${lightboxItem.title} - ${i + 1}`}
                          draggable={false}
                        />
                      </div>
                    );
                  })}
                </div>
                {lbSlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="ag-modal-arrow prev"
                      onClick={() => stepLbSlide(-1)}
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="ag-modal-arrow next"
                      onClick={() => stepLbSlide(1)}
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              <div className="ag-modal-foot">
                <div>
                  <span className="micro-label">
                    {lightboxItem.client} · {lightboxItem.year}
                  </span>
                  <h3 className="reina-display">{lightboxItem.title.toLowerCase()}</h3>
                </div>
                <div className="ag-expanded-links">
                  {lightboxItem.socialLinks.map((sl, i) => (
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

export default ProjectGallery;
