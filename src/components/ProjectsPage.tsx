import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { BRAND, GALLERY_PROJECTS } from '../data/portfolio';
import { SOCIAL_PROJECT_GROUPS } from '../data/socialProjects';
import type { SectionId, SocialMediaItem, SocialProjectGroup } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './HorizontalScrollGallery.css';
import './ProjectsPage.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface ProjectsPageProps {
  ready?: boolean;
  initialProjectId?: string | null;
  onGoHome: (section?: SectionId) => void;
}

const KIND_BADGE: Record<SocialMediaItem['kind'], string> = {
  'instagram-reel': 'IG REEL',
  'instagram-post': 'IG POST',
  'facebook-video': 'FB VIDEO',
  youtube: 'YOUTUBE',
};

const JUMP_LABELS: Record<string, string> = {
  'sp-euphoria-26': "Euphoria '26",
  'sp-wiramaya': "Wiramaya '25 & '26",
  'sp-sliit-walk-26': "SLIIT Walk '26",
  'sp-convocation-campus': 'Convocation & Campus',
  'sp-concerts-portraits-coastal': 'Concerts, Portraits & IG',
};

/**
 * Dedicated Project-Wise LinkedIn & Instagram Live Media Page (/projects)
 * Loads true Instagram Reel/Post & Facebook Video embeds project-by-project
 * with GSAP ScrollTrigger effects: scrubbed crimson timeline spine,
 * parallax numerals, depth card reveals, and full-screen theater modal.
 */
const ProjectsPage = ({ ready = true, initialProjectId = null, onGoHome }: ProjectsPageProps) => {
  const pageRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const spineFillRef = useRef<HTMLDivElement | null>(null);

  const [activeIndices, setActiveIndices] = useState<Record<string, number>>(() =>
    Object.fromEntries(SOCIAL_PROJECT_GROUPS.map((g) => [g.id, 0]))
  );

  const [mountedProjects, setMountedProjects] = useState<Record<string, boolean>>(() => ({
    [SOCIAL_PROJECT_GROUPS[0].id]: true,
    ...(initialProjectId ? { [initialProjectId]: true } : {}),
  }));

  const [activeProjectId, setActiveProjectId] = useState<string>(
    initialProjectId ?? SOCIAL_PROJECT_GROUPS[0].id
  );
  const [playingYoutube, setPlayingYoutube] = useState<boolean>(false);
  const [theaterState, setTheaterState] = useState<{
    group: SocialProjectGroup;
    index: number;
  } | null>(null);

  const featuredYoutube = useMemo(
    () => GALLERY_PROJECTS.find((p) => p.category === 'videography' && Boolean(p.youtubeEmbedId)),
    []
  );

  const totalMediaCount = useMemo(
    () => SOCIAL_PROJECT_GROUPS.reduce((acc, g) => acc + g.media.length, 0),
    []
  );

  const selectMediaItem = useCallback((projectId: string, index: number) => {
    setMountedProjects((prev) => (prev[projectId] ? prev : { ...prev, [projectId]: true }));
    setActiveIndices((prev) => ({ ...prev, [projectId]: index }));

    const stage = pageRef.current?.querySelector(`[data-stage-for="${projectId}"]`);
    if (stage) {
      gsap.fromTo(
        stage,
        { scale: 0.985 },
        { scale: 1, duration: 0.42, ease: 'power3.out', clearProps: 'transform' }
      );
    }
  }, []);

  const stepMediaItem = useCallback((group: SocialProjectGroup, dir: 1 | -1) => {
    setMountedProjects((prev) => (prev[group.id] ? prev : { ...prev, [group.id]: true }));
    setActiveIndices((prev) => {
      const curr = prev[group.id] ?? 0;
      const next = (curr + dir + group.media.length) % group.media.length;
      return { ...prev, [group.id]: next };
    });
  }, []);

  const jumpToProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    setMountedProjects((prev) => ({ ...prev, [projectId]: true }));
    const target = document.getElementById(projectId);
    if (!target) return;
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(target, true, 'top 96px');
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Scroll straight to a requested project if opened from a Home teaser card
  useEffect(() => {
    if (!ready || !initialProjectId) return;
    const timer = window.setTimeout(() => {
      jumpToProject(initialProjectId);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [ready, initialProjectId, jumpToProject]);

  // Native IntersectionObserver so jump-scrolls & mobile always auto-mount live embeds
  useEffect(() => {
    const root = timelineRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const chapters = root.querySelectorAll<HTMLElement>('.sp-chapter');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const pid = (entry.target as HTMLElement).dataset.projectId;
          if (!pid) return;
          setMountedProjects((prev) => (prev[pid] ? prev : { ...prev, [pid]: true }));
        });
      },
      { rootMargin: '240px 0px' }
    );
    chapters.forEach((ch) => io.observe(ch));
    return () => io.disconnect();
  }, []);

  // Signature GSAP ScrollTrigger effects
  useEffect(() => {
    if (!ready || !pageRef.current || !timelineRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>('.sp-chapter');

      chapters.forEach((chapter) => {
        const pid = chapter.dataset.projectId;
        if (!pid) return;

        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 118%',
          once: true,
          onEnter: () => {
            setMountedProjects((prev) => (prev[pid] ? prev : { ...prev, [pid]: true }));
          },
        });

        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 46%',
          end: 'bottom 46%',
          onEnter: () => setActiveProjectId(pid),
          onEnterBack: () => setActiveProjectId(pid),
          toggleClass: 'is-active-chapter',
        });
      });

      if (prefersReduced) return;

      // Hero gentle lift on page entry
      gsap.from('.pp-hero-anim', {
        y: 22,
        duration: 0.72,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform',
      });

      // Scrubbed crimson timeline progress spine
      if (spineFillRef.current) {
        gsap.fromTo(
          spineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 72%',
              end: 'bottom 78%',
              scrub: 0.45,
            },
          }
        );
      }

      // Per-chapter GSAP scroll elevation + parallax numerals + media rail stagger
      chapters.forEach((chapter) => {
        const card = chapter.querySelector<HTMLElement>('.sp-chapter-card');
        const numeral = chapter.querySelector<HTMLElement>('.sp-watermark-num');
        const thumbs = chapter.querySelectorAll<HTMLElement>('.sp-rail-item');

        if (card) {
          gsap.from(card, {
            y: 36,
            scale: 0.982,
            duration: 0.78,
            ease: 'power3.out',
            immediateRender: false,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 88%',
              once: true,
            },
          });
        }

        if (numeral) {
          gsap.fromTo(
            numeral,
            { yPercent: -14 },
            {
              yPercent: 16,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (thumbs.length) {
          gsap.from(thumbs, {
            x: 18,
            duration: 0.52,
            stagger: 0.045,
            ease: 'power3.out',
            immediateRender: false,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 84%',
              once: true,
            },
          });
        }
      });
    }, pageRef);

    return () => ctx.revert();
  }, [ready]);

  // Lock ScrollSmoother while theater modal is open
  useEffect(() => {
    if (!theaterState) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTheaterState(null);
      if (e.key === 'ArrowRight') {
        setTheaterState((curr) =>
          curr ? { ...curr, index: (curr.index + 1) % curr.group.media.length } : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setTheaterState((curr) =>
          curr
            ? {
                ...curr,
                index: (curr.index - 1 + curr.group.media.length) % curr.group.media.length,
              }
            : null
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      smoother?.paused(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [theaterState]);

  return (
    <section ref={pageRef} className="pp-page">
      <div className="section-container">
        {/* Dedicated Page Hero Header */}
        <div className="pp-hero">
          <div className="pp-hero-top pp-hero-anim">
            <button type="button" className="pp-back-btn" onClick={() => onGoHome('home')}>
              ← Back to Portfolio Home
            </button>
            <span className="micro-label">
              LINKEDIN PROJECTS &amp; INSTAGRAM ARCHIVE · 0{SOCIAL_PROJECT_GROUPS.length} PROJECTS ·{' '}
              {totalMediaCount} LIVE EMBEDS
            </span>
          </div>

          <div className="pp-hero-main pp-hero-anim">
            <KineticHeading
              as="h1"
              className="editorial-display pp-heading"
              lines={[
                { text: 'MEDIA & SOCIAL PROJECTS', tone: 'primary' },
                { text: 'project-wise live embeds from linkedin & instagram', tone: 'reina' },
              ]}
            />
            <p className="pp-hero-copy">
              Every official LinkedIn production and Instagram drop organized project-by-project.
              Scroll through each chapter to load live Instagram reels, posts, and Facebook event
              films directly on the page.
            </p>
          </div>

          <div className="pp-hero-actions pp-hero-anim">
            <a
              href={`${BRAND.linkedin}/details/projects/`}
              target="_blank"
              rel="noreferrer"
              className="pill-btn pill-btn-solid"
            >
              LinkedIn Projects ↗
            </a>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="pill-btn">
              @mr.theviya IG ↗
            </a>
            <a
              href="https://www.instagram.com/sliit.fcmu/"
              target="_blank"
              rel="noreferrer"
              className="pill-btn"
            >
              @sliit.fcmu IG ↗
            </a>
            <button type="button" className="pill-btn" onClick={() => onGoHome('contact')}>
              Book a Production ↗
            </button>
          </div>
        </div>

        {/* Single-Row Project Jump Bar */}
        <div className="sp-jump-bar" role="navigation" aria-label="Jump to project">
          {SOCIAL_PROJECT_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`sp-jump-pill${activeProjectId === group.id ? ' is-active' : ''}`}
              onClick={() => jumpToProject(group.id)}
            >
              <span className="sp-jump-num">{group.num}</span>
              <span>{JUMP_LABELS[group.id] ?? group.title.split(' - ')[0]}</span>
              <span className="sp-jump-count">({group.media.length})</span>
            </button>
          ))}
        </div>

        {/* Project-Wise Timeline Stack with GSAP Scrubbed Progress Spine */}
        <div ref={timelineRef} className="sp-timeline">
          <div className="sp-spine-track" aria-hidden="true">
            <div ref={spineFillRef} className="sp-spine-fill" />
          </div>

          {SOCIAL_PROJECT_GROUPS.map((group) => {
            const activeIdx = activeIndices[group.id] ?? 0;
            const activeItem = group.media[activeIdx] ?? group.media[0];
            const isMounted = Boolean(mountedProjects[group.id]);

            return (
              <article
                key={group.id}
                id={group.id}
                data-project-id={group.id}
                className="sp-chapter"
              >
                <div className="sp-spine-node" aria-hidden="true">
                  <span>{group.num}</span>
                </div>

                <div className="sp-chapter-card glass-panel">
                  <span className="sp-watermark-num reina-display" aria-hidden="true">
                    {group.num}
                  </span>

                  {/* Left Column: Project Details + Interactive Media Strip */}
                  <div className="sp-chapter-info">
                    <div className="sp-chapter-meta">
                      <span className="sp-source-pill">{group.sourceBadge}</span>
                      <span className="sp-period">{group.period}</span>
                    </div>

                    <h2 className="sp-chapter-title">{group.title}</h2>
                    <p className="sp-chapter-sub reina-display">{group.subtitle}</p>

                    <div className="sp-org-row">
                      <div>
                        <span className="micro-label">ORGANIZATION</span>
                        <strong>{group.organization}</strong>
                      </div>
                      <div>
                        <span className="micro-label">MY ROLE</span>
                        <strong>{group.role}</strong>
                      </div>
                    </div>

                    <p className="sp-chapter-desc">{group.description}</p>

                    <div className="sp-tags">
                      {group.tags.map((tag) => (
                        <span key={tag} className="sp-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="sp-rail-header">
                      <span className="micro-label">
                        SELECT MEDIA TO LOAD LIVE ({activeIdx + 1} / {group.media.length})
                      </span>
                      <div className="sp-rail-nav">
                        <button
                          type="button"
                          onClick={() => stepMediaItem(group, -1)}
                          aria-label={`Previous media in ${group.title}`}
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => stepMediaItem(group, 1)}
                          aria-label={`Next media in ${group.title}`}
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    <div className="sp-rail">
                      {group.media.map((item, idx) => {
                        const isSelected = idx === activeIdx;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`sp-rail-item${isSelected ? ' is-selected' : ''}`}
                            onClick={() => selectMediaItem(group.id, idx)}
                            aria-pressed={isSelected}
                          >
                            <div className="sp-rail-thumb">
                              <img
                                src={item.posterImage}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="sp-rail-kind">{KIND_BADGE[item.kind]}</span>
                              <span className="sp-rail-idx">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="sp-rail-copy">
                              <strong>{item.title}</strong>
                              <span>{item.handle}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="sp-chapter-actions">
                      <a
                        href={activeItem.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pill-btn pill-btn-solid"
                      >
                        Open {activeItem.platform} Original ↗
                      </a>
                      <a
                        href={group.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pill-btn"
                      >
                        {group.sourceLabel} ↗
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Live True Embed Stage */}
                  <div className="sp-stage-col">
                    <div className="sp-stage-shell" data-stage-for={group.id}>
                      <div className="sp-stage-bar">
                        <div className="sp-stage-status">
                          <i aria-hidden="true" />
                          <span>
                            {KIND_BADGE[activeItem.kind]} · {activeItem.handle}
                          </span>
                        </div>
                        <div className="sp-stage-bar-actions">
                          <button
                            type="button"
                            className="sp-bar-btn"
                            onClick={() => setTheaterState({ group, index: activeIdx })}
                          >
                            Theater ↗
                          </button>
                          <a
                            href={activeItem.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="sp-bar-btn"
                          >
                            Open ↗
                          </a>
                        </div>
                      </div>

                      <div
                        className={`sp-embed-viewport${
                          activeItem.kind === 'facebook-video' ? ' is-fb' : ''
                        }`}
                      >
                        <img
                          src={activeItem.posterImage}
                          alt={activeItem.title}
                          className="sp-embed-backdrop"
                          loading="lazy"
                          decoding="async"
                        />

                        {isMounted ? (
                          <iframe
                            key={activeItem.id}
                            src={activeItem.embedUrl}
                            title={activeItem.title}
                            className="sp-embed-iframe"
                            loading="lazy"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <button
                            type="button"
                            className="sp-embed-facade"
                            onClick={() =>
                              setMountedProjects((prev) => ({ ...prev, [group.id]: true }))
                            }
                          >
                            <span className="hs-facade-play" aria-hidden="true">
                              ▶
                            </span>
                            <span className="hs-facade-label">LOAD LIVE EMBED</span>
                          </button>
                        )}
                      </div>

                      <div className="sp-stage-caption">
                        <strong>{activeItem.title}</strong>
                        <p>{activeItem.caption}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bonus Spotlight: @SLVisualizer YouTube + Google Drive Archive */}
        {featuredYoutube?.youtubeEmbedId && (
          <div className="hs-featured-player glass-panel">
            <div className="hs-featured-embed">
              {playingYoutube ? (
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
                  onClick={() => setPlayingYoutube(true)}
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
              <span className="micro-label">YOUTUBE &amp; ARCHIVE REELS · AFTER EFFECTS</span>
              <h3 className="reina-display">{featuredYoutube.title.toLowerCase()}</h3>
              <p>{featuredYoutube.summary}</p>
              <div className="hs-featured-actions">
                <a
                  href={BRAND.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-btn pill-btn-solid"
                >
                  Watch @SLVisualizer ↗
                </a>
                <a
                  href={BRAND.driveAfterMovies}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-btn"
                >
                  Drive Aftermovies ↗
                </a>
                <button type="button" className="pill-btn" onClick={() => onGoHome('contact')}>
                  Start a Project ↗
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Portal Full-Screen Live Embed Theater Modal */}
      {theaterState &&
        createPortal(
          <div
            className="hs-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={theaterState.group.media[theaterState.index].title}
            onClick={() => setTheaterState(null)}
          >
            <div className="sp-theater-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="sp-theater-head">
                <div>
                  <span className="micro-label">
                    {theaterState.group.title} ·{' '}
                    {String(theaterState.index + 1).padStart(2, '0')} /{' '}
                    {String(theaterState.group.media.length).padStart(2, '0')}
                  </span>
                  <h3 className="reina-display">
                    {theaterState.group.media[theaterState.index].title.toLowerCase()}
                  </h3>
                </div>
                <div className="sp-theater-controls">
                  <button
                    type="button"
                    className="sp-bar-btn"
                    onClick={() =>
                      setTheaterState((curr) =>
                        curr
                          ? {
                              ...curr,
                              index:
                                (curr.index - 1 + curr.group.media.length) %
                                curr.group.media.length,
                            }
                          : null
                      )
                    }
                    aria-label="Previous item"
                  >
                    ‹ Prev
                  </button>
                  <button
                    type="button"
                    className="sp-bar-btn"
                    onClick={() =>
                      setTheaterState((curr) =>
                        curr
                          ? { ...curr, index: (curr.index + 1) % curr.group.media.length }
                          : null
                      )
                    }
                    aria-label="Next item"
                  >
                    Next ›
                  </button>
                  <a
                    href={theaterState.group.media[theaterState.index].originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn pill-btn-solid"
                  >
                    Open Original ↗
                  </a>
                  <button
                    type="button"
                    className="sp-theater-close"
                    onClick={() => setTheaterState(null)}
                    aria-label="Close theater"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="sp-theater-stage">
                <img
                  src={theaterState.group.media[theaterState.index].posterImage}
                  alt={theaterState.group.media[theaterState.index].title}
                  className="sp-embed-backdrop"
                />
                <iframe
                  key={theaterState.group.media[theaterState.index].id}
                  src={theaterState.group.media[theaterState.index].embedUrl}
                  title={theaterState.group.media[theaterState.index].title}
                  className="sp-embed-iframe"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default ProjectsPage;
