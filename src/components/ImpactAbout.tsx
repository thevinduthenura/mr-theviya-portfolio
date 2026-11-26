import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, SKILLS } from '../data/portfolio';
import type { SectionId } from '../types/portfolio';
import './ImpactAbout.css';

gsap.registerPlugin(ScrollTrigger);

interface ImpactAboutProps {
  onNavigate: (id: SectionId) => void;
}

const HUB_ITEMS = [
  { label: 'Creative CV', sub: 'PDF Resume', href: BRAND.creativeCv, tag: 'CV' },
  { label: 'Drive Samples', sub: 'Video & Design Folder', href: BRAND.driveSamples, tag: 'GD' },
  { label: 'Behance Portfolio', sub: 'mrtheviya1', href: BRAND.behance, tag: 'BE' },
  { label: 'Hatch.team', sub: 'Thevindu Gunathilaka', href: BRAND.hatchProfile, tag: 'HT' },
  { label: 'Pinterest Board', sub: '@mrtheviya', href: BRAND.pinterest, tag: 'PI' },
  { label: 'Mr.Theviya Linktree', sub: 'linktr.ee/mr.theviya', href: BRAND.linktreeBrand, tag: 'LT' },
  { label: 'Personal Linktree', sub: 'thevindu.thenura', href: BRAND.linktreePersonal, tag: 'LP' },
  { label: 'WhatsApp Direct', sub: BRAND.whatsappNumber, href: BRAND.whatsappDirect, tag: 'WA' },
];

const ImpactAbout = ({ onNavigate }: ImpactAboutProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const featureGlowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Opposite-direction horizontal scroll parallax on statement lines
      gsap.fromTo(
        '.imp-drift-right',
        { xPercent: -4 },
        {
          xPercent: 4,
          scrollTrigger: {
            trigger: '.impact-headline-wrap',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        }
      );

      gsap.fromTo(
        '.imp-drift-left',
        { xPercent: 4 },
        {
          xPercent: -4,
          scrollTrigger: {
            trigger: '.impact-headline-wrap',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        }
      );

      // Trio staggered rise + unblur
      gsap.fromTo(
        '.impact-trio > *',
        { y: 48, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.impact-trio',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Linktree ecosystem glass cards stagger
      gsap.fromTo(
        '.hub-card',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.linktree-hub-grid',
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleFeatureMove = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    const glow = featureGlowRef.current;
    if (!glow) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(glow, {
      x: x - rect.width * 0.65,
      y: y - rect.height * 0.35,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-block impact-section">
      <div className="section-container">
        {/* Giant Opposite-Drift Editorial Statement */}
        <div className="impact-headline-wrap">
          <h2 className="editorial-display impact-heading">
            <span className="impact-line-indent imp-drift-right">WE TURN IDEAS</span>
            <br />
            <span className="imp-drift-left imp-block-line">
              INTO VISUAL
              <span className="inline-pill-media">
                <img src="/images/editorial/video-motion.jpg" alt="" />
              </span>
              STATEMENTS
            </span>
            <span className="muted imp-drift-right imp-block-line">FROM VISION TO DELIVERY -</span>
            <span className="impact-line-right imp-drift-left">
              IMPACT THAT <span className="reina-serif">lasts</span>
            </span>
          </h2>
        </div>

        {/* 3-Card Asymmetric Editorial Bento Row */}
        <div className="impact-trio velocity-react">
          {/* Card 1: Editorial Studio Craft + Manifesto */}
          <div className="impact-col">
            <div className="impact-media-card">
              <img
                src="/images/projects/photography/editorial-lens.jpg"
                alt="Editorial visual composition"
                loading="lazy"
              />
              <div className="impact-media-scrim" />
              <span className="impact-corner-tag">{BRAND.fullName.toUpperCase()}</span>
            </div>

            <div className="impact-manifesto glass-panel">
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
              <p>
                Designing visual worlds that resonate - blending strategic thinking with creative
                execution for brands that refuse to blend in.
              </p>
            </div>
          </div>

          {/* Card 2: Signature Glowing Vermilion-Crimson Feature Card */}
          <a
            href={BRAND.behance}
            target="_blank"
            rel="noreferrer"
            className="impact-feature-card"
            onPointerMove={handleFeatureMove}
            data-cursor="BEHANCE"
          >
            <div ref={featureGlowRef} className="impact-feature-glow" aria-hidden="true" />
            <div className="impact-feature-top">
              <span className="impact-mini-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="impact-feature-tag">BEHANCE ARCHIVE</span>
            </div>

            <div className="impact-feature-bottom">
              <p className="impact-feature-text">
                Explore bold
                <span className="inline-outline-pill" aria-hidden="true" />
                <br />
                visual systems &amp;
                <span className="inline-outline-pill small" aria-hidden="true" />
                <br />
                <span className="reina-serif impact-feature-reina">brand stories</span>
              </p>
              <span className="impact-feature-btn" aria-hidden="true">
                ›
              </span>
            </div>
          </a>

          {/* Card 3: Sculptural Art Direction + Explore CTA */}
          <div className="impact-col">
            <div className="impact-media-card" data-cursor="CRAFT">
              <img
                src="/images/editorial/creative-direction.jpg"
                alt="Creative direction and brand art"
                loading="lazy"
              />
              <div className="impact-media-scrim" />
              <span className="impact-corner-tag">5+ YEARS CRAFT</span>
            </div>

            <button
              type="button"
              className="pill-btn impact-explore-btn"
              onClick={() => onNavigate('contact')}
              data-cursor="HIRE"
            >
              START A PROJECT
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        {/* Linktree Ecosystem Frosted Glass Hub (linktr.ee/mr.theviya + linktr.ee/thevindu.thenura) */}
        <div className="linktree-hub">
          <div className="linktree-hub-head">
            <div>
              <span className="micro-label">OFFICIAL ECOSYSTEM · LINKTREE</span>
              <h3 className="linktree-hub-title">
                Every Channel, CV &amp; <span className="reina-serif">sample reel</span>
              </h3>
            </div>
            <div className="linktree-hub-badges">
              <a href={BRAND.linktreeBrand} target="_blank" rel="noreferrer" className="pill-btn">
                linktr.ee/mr.theviya ↗
              </a>
              <a
                href={BRAND.linktreePersonal}
                target="_blank"
                rel="noreferrer"
                className="pill-btn"
              >
                linktr.ee/thevindu.thenura ↗
              </a>
            </div>
          </div>

          <div className="linktree-hub-grid">
            {HUB_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hub-card glass-panel"
                data-cursor="OPEN"
              >
                <span className="hub-card-tag">{item.tag}</span>
                <div className="hub-card-meta">
                  <strong>{item.label}</strong>
                  <span>{item.sub}</span>
                </div>
                <span className="hub-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Disciplines / Skills Strip */}
        <div className="impact-skills">
          <span className="micro-label">CORE DISCIPLINES</span>
          <div className="impact-skill-list">
            {SKILLS.map((skill) => (
              <span key={skill} className="impact-skill-chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactAbout;
