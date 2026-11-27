import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, HERO_STATS, HERO_TAGS } from '../data/portfolio';
import type { SectionId } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onNavigate: (id: SectionId) => void;
  onSelectServiceTag: (serviceTitle: string) => void;
}

const Hero = ({ onNavigate, onSelectServiceTag }: HeroProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  // Display final verified numbers immediately so visitors never catch partial mid-tick values
  const counts = {
    experience: HERO_STATS[0].value,
    projects: HERO_STATS[1].value,
    clients: HERO_STATS[2].value,
  };

  // GSAP Entrance Orchestration + Clean ScrollTrigger Parallax (no portrait blur/offset lock!)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        portraitRef.current,
        { y: 26, scale: 0.96, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.95, clearProps: 'transform,opacity' }
      )
        .fromTo(
          '.hero-anim-left',
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, clearProps: 'transform,opacity' },
          '-=0.7'
        )
        .fromTo(
          '.hero-anim-right',
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' },
          '-=0.75'
        )
        .fromTo(
          '.hero-bento-card',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, clearProps: 'transform,opacity' },
          '-=0.55'
        );

      // Subtle scroll-driven parallax ONLY on background watermark & crimson ribbon
      // Portrait stays 100% crisp, centered, and un-blurred whenever returning to Home!
      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { y: 0, scale: 1, opacity: 1 },
          {
            y: -70,
            scale: 1.05,
            opacity: 0.4,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 100px',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        );
      }

      if (ribbonRef.current) {
        gsap.fromTo(
          ribbonRef.current,
          { xPercent: 0, rotation: -7 },
          {
            xPercent: 10,
            rotation: -3,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 100px',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="hero-stage">
      {/* Studio Crimson-Amber Lighting Layers */}
      <div className="hero-glow hero-glow-top" aria-hidden="true" />
      <div className="hero-glow hero-glow-right" aria-hidden="true" />
      <div ref={ribbonRef} className="hero-glow hero-glow-ribbon" aria-hidden="true" />

      {/* Giant Subtle Background Watermark (from Figma) */}
      <div ref={watermarkRef} className="hero-watermark" aria-hidden="true">
        <span>DESIGN</span>
        <span>YOUR</span>
        <span>DREAMS</span>
      </div>

      {/* Center Editorial Portrait with Dramatic Crimson Studio Rim Light */}
      <div className="hero-portrait-stage" aria-hidden="true">
        <div ref={portraitRef} className="hero-portrait-arch">
          <div className="hero-portrait-rim" />
          <img
            src={BRAND.profilePhoto}
            alt="Thevindu Gunathilaka - Mr. Theviya"
            className="hero-portrait-img"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-portrait-scrim" />
        </div>
      </div>

      {/* Foreground 2-Column Editorial Layout */}
      <div className="hero-content">
        {/* Left Column: Eyebrow Descriptor + High-Contrast Bento Metric Cards */}
        <div className="hero-col-left">
          <div className="hero-source-block hero-anim-left">
            <span className="hero-source-title">
              SOURCE
              <br />
              OF BOLD
              <br />
              VISUALS
            </span>
            <span className="hero-source-rule" />
            <p className="hero-source-copy">
              Hey, I&apos;m <strong className="hero-serif-name">mr.theviya</strong> - Sri Lankan
              Graphic Designer, Visual Editor &amp; Web Designer crafting bold visual identities
              for local and global brands.
            </p>
          </div>

          {/* Dual Glass + Contrast Bento Cards */}
          <div className="hero-bento-row">
            <div className="hero-bento-card hero-bento-contrast" data-cursor="STATS">
              <div className="hero-bento-top">
                <span className="hero-dots-mark" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span className="hero-bento-micro">
                  PROVEN
                  <br />
                  TRACK RECORD
                </span>
              </div>
              <div className="hero-bento-value reina-display">
                {counts.projects}
                <span>+</span>
              </div>
              <p className="hero-bento-foot">Projects crafted across brands &amp; media</p>
            </div>

            <div className="hero-bento-card hero-bento-glass glass-panel" data-cursor="CRAFT">
              <div className="hero-bento-top">
                <span className="hero-bento-kicker">
                  Elevate
                  <br />
                  your brand
                </span>
                <span className="hero-bento-spark" aria-hidden="true">
                  ✳
                </span>
              </div>
              <div className="hero-bento-split">
                <div>
                  <strong className="reina-display">{counts.experience}+</strong>
                  <span>Yrs Exp.</span>
                </div>
                <div className="hero-bento-divider" />
                <div>
                  <strong className="reina-display">{counts.clients}+</strong>
                  <span>Clients</span>
                </div>
              </div>
              <p className="hero-bento-foot">Design Your Dreams - Vision to Reality</p>
            </div>
          </div>
        </div>

        {/* Right Column: Kinetic Mouse-Reactive Main Display Heading + Quick Links */}
        <div className="hero-col-right">
          <div className="hero-headline-group hero-anim-right">
            <span className="hero-eyebrow-serif reina-serif">hey, i&apos;m mr.theviya</span>
            <KineticHeading
              as="h1"
              className="hero-title"
              lines={[
                { text: 'CREATIVE', tone: 'primary' },
                { text: 'VISUAL', tone: 'primary' },
                { text: 'DESIGNER', tone: 'primary' },
              ]}
            />
            <div className="hero-pitch-row">
              <p className="hero-pitch">
                Bold brand identities, high-impact edits, photography, and web design that cut
                through the noise - from logo DNA to final frame.
              </p>
              <button
                type="button"
                className="circle-arrow-btn"
                onClick={() => onNavigate('gallery')}
                aria-label="Explore project gallery"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </button>
            </div>
          </div>

          <div className="hero-bottom-right hero-anim-right">
            <div className="hero-quick-links">
              <a
                href={BRAND.creativeCv}
                target="_blank"
                rel="noreferrer"
                className="hero-glass-chip"
                data-cursor="CV"
              >
                CREATIVE CV ↗
              </a>
              <a
                href={BRAND.driveSamples}
                target="_blank"
                rel="noreferrer"
                className="hero-glass-chip"
                data-cursor="SAMPLES"
              >
                DRIVE SAMPLES ↗
              </a>
              <a
                href={BRAND.behance}
                target="_blank"
                rel="noreferrer"
                className="hero-behance-chip"
                data-cursor="OPEN"
              >
                <span className="hero-behance-dot" />
                BEHANCE ↗
              </a>
            </div>
            <div className="hero-tag-pills">
              {HERO_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="hero-tag-pill"
                  onClick={() => onSelectServiceTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
