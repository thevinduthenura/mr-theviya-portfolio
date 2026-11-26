import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, GALLERY_CATEGORIES, GALLERY_PROJECTS } from '../data/portfolio';
import type { GalleryCategoryId, GalleryProject } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './ProjectGallery.css';

gsap.registerPlugin(Flip, ScrollTrigger);

type LayoutMode = 'bento' | 'grid' | 'editorial';

interface ProjectGalleryProps {
  activeCategory: GalleryCategoryId;
  onChangeCategory: (cat: GalleryCategoryId) => void;
}

const ProjectGallery = ({ activeCategory, onChangeCategory }: ProjectGalleryProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('bento');
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);

  const visibleProjects =
    activeCategory === 'all'
      ? GALLERY_PROJECTS
      : GALLERY_PROJECTS.filter((p) => p.category === activeCategory);

  const activeTabMeta =
    GALLERY_CATEGORIES.find((c) => c.id === activeCategory) ?? GALLERY_CATEGORIES[0];

  // Capture Flip state before changing category or layout
  const handleSelectCategory = (cat: GalleryCategoryId) => {
    if (cat === activeCategory) return;
    if (gridRef.current) {
      flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll('.pg-card'));
    }
    onChangeCategory(cat);
  };

  const handleSelectLayout = (mode: LayoutMode) => {
    if (mode === layoutMode) return;
    if (gridRef.current) {
      flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll('.pg-card'));
    }
    setLayoutMode(mode);
  };

  // Run GSAP Flip animation after DOM updates from filter or layout change
  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state || !gridRef.current) return;
    flipStateRef.current = null;

    Flip.from(state, {
      targets: gridRef.current.querySelectorAll('.pg-card'),
      duration: 0.72,
      ease: 'power3.inOut',
      stagger: 0.035,
      absolute: true,
      nested: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.88, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.55,
            ease: 'power3.out',
          }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.88,
          filter: 'blur(6px)',
          duration: 0.35,
          ease: 'power2.in',
        }),
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });
  }, [activeCategory, layoutMode]);

  // GSAP ScrollTrigger clip-path unveil + inner image parallax scrub
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.pg-card');

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            y: 44,
            opacity: 0,
            clipPath: 'inset(12% 0% 0% 0% round 22px)',
          },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0% round 22px)',
            duration: 0.85,
            delay: (index % 3) * 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          }
        );

        const img = card.querySelector<HTMLImageElement>('.pg-card-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.14 },
            {
              yPercent: 6,
              scale: 1.14,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject]);

  return (
    <section id="gallery" ref={sectionRef} className="section-block pg-section">
      <div className="section-container">
        {/* Editorial Header */}
        <div className="pg-header">
          <div className="pg-header-left">
            <div className="pg-eyebrow">
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
              <span className="micro-label">PROJECT GALLERIES · GSAP FLIP + SCROLLTRIGGER</span>
            </div>

            <KineticHeading
              as="h2"
              className="editorial-display pg-heading"
              lines={[
                { text: 'CURATED WORKS', tone: 'primary' },
                { text: 'by discipline', tone: 'reina' },
              ]}
            />
          </div>

          <div className="pg-header-right">
            <p className="pg-active-tagline reina-serif">{activeTabMeta.tagline}</p>

            {/* GSAP Flip Layout Mode Switcher */}
            <div className="pg-layout-switch glass-panel" role="group" aria-label="Gallery layout">
              <button
                type="button"
                className={layoutMode === 'bento' ? 'is-active' : ''}
                onClick={() => handleSelectLayout('bento')}
              >
                Bento
              </button>
              <button
                type="button"
                className={layoutMode === 'grid' ? 'is-active' : ''}
                onClick={() => handleSelectLayout('grid')}
              >
                3-Col
              </button>
              <button
                type="button"
                className={layoutMode === 'editorial' ? 'is-active' : ''}
                onClick={() => handleSelectLayout('editorial')}
              >
                Wide
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Graphic Design / Videography / Photography / Web Design) */}
        <div className="pg-tabs-bar" role="tablist" aria-label="Project categories">
          {GALLERY_CATEGORIES.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`pg-tab${isActive ? ' is-active' : ''}`}
                onClick={() => handleSelectCategory(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="pg-tab-count">{tab.countLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Flip + ScrollTrigger Gallery Grid */}
        <div
          ref={gridRef}
          className={`pg-grid pg-layout-${layoutMode} velocity-react`}
        >
          {visibleProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              data-flip-id={project.id}
              className={`pg-card pg-aspect-${project.aspect}`}
              onClick={() => setSelectedProject(project)}
              aria-label={`Inspect ${project.title} - ${project.categoryLabel}`}
            >
              <div className="pg-card-media">
                <img
                  src={project.image}
                  alt={project.title}
                  className="pg-card-img"
                  loading="lazy"
                />
                <div className="pg-card-scrim" />
              </div>

              <div className="pg-card-top">
                <span className="pg-card-badge">{project.categoryLabel}</span>
                <span className="pg-card-code">{project.code}</span>
              </div>

              <div className="pg-card-bottom">
                <div className="pg-card-text">
                  <h3>{project.title}</h3>
                  <span>
                    {project.client} · {project.year}
                  </span>
                </div>
                <span className="pg-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Archive CTA Strip */}
        <div className="pg-footer-strip glass-panel">
          <div>
            <span className="micro-label">WANT TO SEE MORE RAW FILES &amp; VIDEOS?</span>
            <p>
              Browse the full Behance showcase or open the live Google Drive samples folder for
              high-resolution reels and posters.
            </p>
          </div>
          <div className="pg-footer-actions">
            <a href={BRAND.driveSamples} target="_blank" rel="noreferrer" className="pill-btn">
              Google Drive Samples ↗
            </a>
            <a href={BRAND.behance} target="_blank" rel="noreferrer" className="pill-btn pill-btn-solid">
              Behance Showcase ↗
            </a>
          </div>
        </div>
      </div>

      {/* Portal Lightbox Modal (fixed cleanly outside ScrollSmoother) */}
      {selectedProject &&
        createPortal(
          <div
            className="pg-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="pg-modal glass-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pg-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project preview"
              >
                ✕
              </button>
              <div className="pg-modal-media">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>
              <div className="pg-modal-body">
                <span className="micro-label">
                  {selectedProject.code} · {selectedProject.categoryLabel} · {selectedProject.year}
                </span>
                <h3 className="reina-display">{selectedProject.title.toLowerCase()}</h3>
                <p className="pg-modal-client">{selectedProject.client}</p>
                <p className="pg-modal-summary">{selectedProject.summary}</p>
                <div className="pg-modal-tools">
                  {selectedProject.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                <div className="pg-modal-actions">
                  <a
                    href={selectedProject.href}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn pill-btn-solid"
                  >
                    Open Project ↗
                  </a>
                  <a
                    href={BRAND.driveSamples}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn"
                  >
                    All Samples ↗
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

export default ProjectGallery;
