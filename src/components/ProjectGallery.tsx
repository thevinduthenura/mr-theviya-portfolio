import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, GALLERY_PROJECTS, GRAPHIC_SUB_TABS } from '../data/portfolio';
import type { DesignTabId, GalleryProject } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './ProjectGallery.css';

gsap.registerPlugin(Flip, ScrollTrigger);

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
  const touchStartXRef = useRef<number | null>(null);

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

  // Subtle GSAP ScrollTrigger staggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ag-item',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
              <span className="micro-label">GRAPHIC &amp; WEB DESIGN · GSAP FLIP GRID POSITIONS</span>
            </div>

            <KineticHeading
              as="h2"
              className="editorial-display ag-heading"
              lines={[
                { text: 'DESIGN EXHIBITION', tone: 'primary' },
                { text: 'click any piece to expand', tone: 'reina' },
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
                      <p>{item.summary}</p>
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
                className="ag-modal-stage"
                onTouchStart={(e) => {
                  touchStartXRef.current = e.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={(e) => {
                  const startX = touchStartXRef.current;
                  const endX = e.changedTouches[0]?.clientX;
                  touchStartXRef.current = null;
                  if (startX === null || endX === undefined || lbSlides.length < 2) return;
                  const delta = endX - startX;
                  if (Math.abs(delta) > 42) {
                    setLightboxSlide((s) =>
                      delta < 0
                        ? (s + 1) % lbSlides.length
                        : (s - 1 + lbSlides.length) % lbSlides.length
                    );
                  }
                }}
              >
                <img
                  src={lbSlides[lightboxSlide] ?? lightboxItem.image}
                  alt={lightboxItem.title}
                />
                {lbSlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="ag-modal-arrow prev"
                      onClick={() =>
                        setLightboxSlide((s) => (s - 1 + lbSlides.length) % lbSlides.length)
                      }
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="ag-modal-arrow next"
                      onClick={() => setLightboxSlide((s) => (s + 1) % lbSlides.length)}
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
