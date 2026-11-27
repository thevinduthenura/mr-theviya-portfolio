import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, GALLERY_PROJECTS } from '../data/portfolio';
import { SOCIAL_PROJECT_GROUPS } from '../data/socialProjects';
import KineticHeading from './KineticHeading';
import './HorizontalScrollGallery.css';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollGalleryProps {
  ready?: boolean;
  onOpenProjectsPage: (projectId?: string) => void;
}

/**
 * Compact Home Page Teaser for Videography, Reels & Live LinkedIn/Instagram Projects.
 * Clicking any project card or CTA navigates to the dedicated /projects page
 * with all 34 live Instagram/Facebook embeds and full GSAP ScrollTrigger timeline.
 */
const HorizontalScrollGallery = ({
  ready = true,
  onOpenProjectsPage,
}: HorizontalScrollGalleryProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playingYoutube, setPlayingYoutube] = useState<boolean>(false);

  const featuredYoutube = useMemo(
    () => GALLERY_PROJECTS.find((p) => p.category === 'videography' && Boolean(p.youtubeEmbedId)),
    []
  );

  const totalMediaCount = useMemo(
    () => SOCIAL_PROJECT_GROUPS.reduce((acc, g) => acc + g.media.length, 0),
    []
  );

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.hs-teaser-card');
      if (cards?.length) {
        gsap.from(cards, {
          y: 26,
          duration: 0.68,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: '.hs-teaser-grid',
            start: 'top 88%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="videography" ref={sectionRef} className="section-block hs-section">
      <div className="section-container">
        {/* Clean Editorial Header */}
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
              <span className="micro-label">
                VIDEOGRAPHY &amp; SOCIAL PROJECTS · 0{SOCIAL_PROJECT_GROUPS.length} PROJECTS ·{' '}
                {totalMediaCount} LIVE EMBEDS
              </span>
            </div>
            <KineticHeading
              as="h2"
              className="editorial-display hs-heading"
              lines={[
                { text: 'MOTION & PROJECTS', tone: 'primary' },
                { text: 'linkedin reels, aftermovies & instagram feeds', tone: 'reina' },
              ]}
            />
          </div>

          <div className="hs-top-right">
            <button
              type="button"
              className="pill-btn pill-btn-solid"
              onClick={() => onOpenProjectsPage()}
            >
              Open Full Projects Page ({totalMediaCount} Live) →
            </button>
            <a href={BRAND.youtube} target="_blank" rel="noreferrer" className="pill-btn">
              @SLVisualizer YouTube ↗
            </a>
          </div>
        </div>

        {/* 5 Project-Wise Teaser Cards Linking Straight to Dedicated /projects Page */}
        <div className="hs-teaser-grid">
          {SOCIAL_PROJECT_GROUPS.map((group) => {
            const cover = group.media[0]?.posterImage;
            return (
              <button
                key={group.id}
                type="button"
                className="hs-teaser-card glass-panel"
                onClick={() => onOpenProjectsPage(group.id)}
              >
                <div className="hs-teaser-media">
                  <img src={cover} alt={group.title} loading="lazy" decoding="async" />
                  <span className="hs-teaser-num">{group.num}</span>
                  <span className="hs-teaser-count">{group.media.length} LIVE LINKS</span>
                  <span className="hs-teaser-play" aria-hidden="true">
                    ▶
                  </span>
                </div>

                <div className="hs-teaser-body">
                  <span className="hs-teaser-org">{group.organization}</span>
                  <h3>{group.title}</h3>
                  <p>{group.role}</p>
                  <div className="hs-teaser-foot">
                    <span>{group.period}</span>
                    <span className="hs-teaser-cta">Open Project →</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Click-to-Play Featured YouTube Reel Right on Home */}
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
              <span className="micro-label">FEATURED PLAYABLE EDIT · YOUTUBE</span>
              <h3 className="reina-display">{featuredYoutube.title.toLowerCase()}</h3>
              <p>{featuredYoutube.summary}</p>
              <div className="hs-featured-actions">
                <button
                  type="button"
                  className="pill-btn pill-btn-solid"
                  onClick={() => onOpenProjectsPage()}
                >
                  View All {totalMediaCount} Live Embeds →
                </button>
                <a href={BRAND.driveSamples} target="_blank" rel="noreferrer" className="pill-btn">
                  Full Drive Reels ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HorizontalScrollGallery;
