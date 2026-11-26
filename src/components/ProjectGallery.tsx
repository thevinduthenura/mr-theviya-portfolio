import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BRAND,
  GALLERY_CATEGORIES,
  GALLERY_PROJECTS,
  GRAPHIC_SUB_TABS,
} from '../data/portfolio';
import type {
  GalleryCategoryId,
  GalleryProject,
  GraphicSubFilterId,
} from '../types/portfolio';
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

  const [graphicSub, setGraphicSub] = useState<GraphicSubFilterId>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('bento');
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [modalSlideIdx, setModalSlideIdx] = useState<number>(0);

  const visibleProjects = GALLERY_PROJECTS.filter((p) => {
    if (activeCategory === 'all') {
      return Boolean(p.featuredInAll);
    }
    if (p.category !== activeCategory) return false;
    if (activeCategory === 'graphic-design' && graphicSub !== 'all') {
      return p.subGroup === graphicSub;
    }
    return true;
  });

  const activeTabMeta =
    GALLERY_CATEGORIES.find((c) => c.id === activeCategory) ?? GALLERY_CATEGORIES[0];

  const captureFlip = () => {
    if (gridRef.current) {
      flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll('.pg-card'));
    }
  };

  const handleSelectCategory = (cat: GalleryCategoryId) => {
    if (cat === activeCategory) return;
    captureFlip();
    if (cat !== 'graphic-design') {
      setGraphicSub('all');
    }
    onChangeCategory(cat);
  };

  const handleSelectSubFilter = (sub: GraphicSubFilterId) => {
    if (sub === graphicSub) return;
    captureFlip();
    setGraphicSub(sub);
  };

  const handleSelectLayout = (mode: LayoutMode) => {
    if (mode === layoutMode) return;
    captureFlip();
    setLayoutMode(mode);
  };

  const openProjectModal = (project: GalleryProject) => {
    setModalSlideIdx(0);
    setSelectedProject(project);
  };

  // GSAP Flip transition whenever category, sub-filter, or layout changes
  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state || !gridRef.current) return;
    flipStateRef.current = null;

    Flip.from(state, {
      targets: gridRef.current.querySelectorAll('.pg-card'),
      duration: 0.72,
      ease: 'power3.inOut',
      stagger: 0.025,
      absolute: true,
      nested: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.9, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.52,
            ease: 'power3.out',
          }
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          scale: 0.9,
          filter: 'blur(6px)',
          duration: 0.3,
          ease: 'power2.in',
        }),
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });
  }, [activeCategory, graphicSub, layoutMode]);

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
            duration: 0.8,
            delay: (index % 3) * 0.05,
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
            { yPercent: -5, scale: 1.12 },
            {
              yPercent: 5,
              scale: 1.12,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.85,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keyboard controls inside lightbox (Esc + Left/Right slides)
  useEffect(() => {
    if (!selectedProject) return;
    const slides = selectedProject.galleryImages?.length
      ? selectedProject.galleryImages
      : [selectedProject.image];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
      if (slides.length > 1 && e.key === 'ArrowRight') {
        setModalSlideIdx((i) => (i + 1) % slides.length);
      }
      if (slides.length > 1 && e.key === 'ArrowLeft') {
        setModalSlideIdx((i) => (i - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject]);

  const modalSlides = selectedProject
    ? selectedProject.galleryImages?.length
      ? selectedProject.galleryImages
      : [selectedProject.image]
    : [];

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
              <span className="micro-label">PROJECT ARCHIVE · GSAP FLIP + SCROLLTRIGGER</span>
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

        {/* Main Category Tabs */}
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

        {/* Contextual Sub-Filters for Graphic Design (Full Projects / SLIIT / Brands / School & Other) */}
        {activeCategory === 'graphic-design' && (
          <div className="pg-subtabs-bar" role="tablist" aria-label="Graphic design groups">
            {GRAPHIC_SUB_TABS.map((sub) => (
              <button
                key={sub.id}
                type="button"
                role="tab"
                aria-selected={graphicSub === sub.id}
                className={`pg-subtab${graphicSub === sub.id ? ' is-active' : ''}`}
                onClick={() => handleSelectSubFilter(sub.id)}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Flip + ScrollTrigger Gallery Grid */}
        <div ref={gridRef} className={`pg-grid pg-layout-${layoutMode} velocity-react`}>
          {visibleProjects.map((project) => {
            const isVideo = project.category === 'videography';
            const slideCount = project.galleryImages?.length ?? 1;

            return (
              <button
                key={project.id}
                type="button"
                data-flip-id={project.id}
                className={`pg-card pg-aspect-${project.aspect}${isVideo ? ' is-video-card' : ''}${
                  project.isProject ? ' is-case-project' : ''
                }`}
                onClick={() => openProjectModal(project)}
                aria-label={`Preview ${project.title} - ${project.categoryLabel}`}
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

                {/* Top Social Platform + Project Stack Badge */}
                <div className="pg-card-top">
                  <span className="pg-social-pill">
                    <span className="pg-social-dot" />
                    <span>{project.primaryPlatform}</span>
                    {project.mediaFormat && (
                      <span className="pg-format-sep">· {project.mediaFormat}</span>
                    )}
                  </span>
                  <span className="pg-card-code">
                    {slideCount > 1 ? `${slideCount} IMGS` : project.code}
                  </span>
                </div>

                {/* Center Frosted Play Badge for Videography Previews */}
                {isVideo && (
                  <div className="pg-play-badge" aria-hidden="true">
                    <span>▶</span>
                  </div>
                )}

                {/* Bottom Glass Caption */}
                <div className="pg-card-bottom">
                  <div className="pg-card-text">
                    <h3>{project.title}</h3>
                    <span>
                      {project.client} · {project.socialHandle}
                    </span>
                  </div>
                  <span className="pg-card-arrow" aria-hidden="true">
                    {isVideo ? '▶' : '↗'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Social Media Channels Quick Strip */}
        <div className="pg-footer-strip glass-panel">
          <div>
            <span className="micro-label">DIRECT SOCIAL ARCHIVES &amp; BEHANCE POSTER GALLERY</span>
            <p>
              Explore all 25 Graphic Design works, 7 Photography series, live social posts, Behance
              Poster Design archive, and Google Drive video reels.
            </p>
          </div>
          <div className="pg-footer-actions">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="pill-btn">
              Instagram ↗
            </a>
            <a href={BRAND.behancePosters} target="_blank" rel="noreferrer" className="pill-btn">
              Behance Posters ↗
            </a>
            <a href={BRAND.youtube} target="_blank" rel="noreferrer" className="pill-btn">
              YouTube ↗
            </a>
            <a
              href={BRAND.driveSamples}
              target="_blank"
              rel="noreferrer"
              className="pill-btn pill-btn-solid"
            >
              Drive Reels ↗
            </a>
          </div>
        </div>
      </div>

      {/* Portal Multi-Slide Case Study & Social Media Preview Modal */}
      {selectedProject &&
        createPortal(
          <div
            className="pg-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            onClick={() => setSelectedProject(null)}
          >
            <div className="pg-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="pg-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project preview"
              >
                ✕
              </button>

              {/* Left: Social Preview Header + Multi-Slide Image Viewer or Live YouTube Embed */}
              <div className="pg-modal-media-col">
                <div className="pg-social-preview-head">
                  <div className="pg-social-avatar">t</div>
                  <div>
                    <strong>{selectedProject.socialHandle}</strong>
                    <span>
                      {selectedProject.primaryPlatform} · {selectedProject.client}
                    </span>
                  </div>
                  <span className="pg-featured-badge">
                    {selectedProject.isProject ? 'PROJECT CASE STUDY' : 'SOCIAL PREVIEW'}
                  </span>
                </div>

                {selectedProject.youtubeEmbedId ? (
                  <div className="pg-modal-video-wrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedProject.youtubeEmbedId}?rel=0`}
                      title={selectedProject.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <>
                    <div className="pg-modal-media">
                      <img
                        src={modalSlides[modalSlideIdx] || selectedProject.image}
                        alt={`${selectedProject.title} - slide ${modalSlideIdx + 1}`}
                      />

                      {modalSlides.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="pg-slide-arrow pg-slide-prev"
                            onClick={() =>
                              setModalSlideIdx(
                                (i) => (i - 1 + modalSlides.length) % modalSlides.length
                              )
                            }
                            aria-label="Previous project image"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="pg-slide-arrow pg-slide-next"
                            onClick={() =>
                              setModalSlideIdx((i) => (i + 1) % modalSlides.length)
                            }
                            aria-label="Next project image"
                          >
                            ›
                          </button>
                          <span className="pg-slide-counter">
                            0{modalSlideIdx + 1} / 0{modalSlides.length}
                          </span>
                        </>
                      )}

                      {selectedProject.category === 'videography' && (
                        <a
                          href={selectedProject.href}
                          target="_blank"
                          rel="noreferrer"
                          className="pg-modal-play-overlay"
                        >
                          <span className="pg-modal-play-icon">▶</span>
                          <span>Watch Reel on {selectedProject.primaryPlatform} ↗</span>
                        </a>
                      )}
                    </div>

                    {/* Clickable Thumbnail Strip for Multi-Slide Projects & Photo Shoots */}
                    {modalSlides.length > 1 && (
                      <div className="pg-thumb-strip">
                        {modalSlides.map((src, idx) => (
                          <button
                            key={src}
                            type="button"
                            className={`pg-thumb${idx === modalSlideIdx ? ' is-active' : ''}`}
                            onClick={() => setModalSlideIdx(idx)}
                            aria-label={`View slide ${idx + 1}`}
                          >
                            <img src={src} alt="" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right: Project Story + Direct Social Links */}
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

                <div className="pg-modal-social-block">
                  <span className="micro-label">OPEN SOCIAL PREVIEW &amp; LINKS</span>
                  <div className="pg-modal-actions">
                    {selectedProject.socialLinks.map((sl, idx) => (
                      <a
                        key={`${sl.platform}-${sl.handle}`}
                        href={sl.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`pill-btn${idx === 0 ? ' pill-btn-solid' : ''}`}
                      >
                        {sl.platform} ↗
                      </a>
                    ))}
                  </div>
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
