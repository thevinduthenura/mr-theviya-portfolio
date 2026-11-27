import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ABOUT_TIMELINE, BRAND, TOOLSTACK } from '../data/portfolio';
import type { SectionId } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './ImpactAbout.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface ImpactAboutProps {
  onNavigate: (id: SectionId) => void;
  ready?: boolean;
}

const CV_PREVIEW_URL = 'https://drive.google.com/file/d/1VMs2K_2sTYuE1bHOIu0oh7kyVv-n5Un0/preview';

const ImpactAbout = ({ onNavigate, ready = true }: ImpactAboutProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [showCvModal, setShowCvModal] = useState<boolean>(false);

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.ab-reveal', {
        y: 22,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 86%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    if (!showCvModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCvModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      smoother?.paused(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [showCvModal]);

  return (
    <section id="about" ref={sectionRef} className="section-block ab-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="ab-head ab-reveal">
          <div>
            <div className="ab-eyebrow">
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
              <span className="micro-label">ABOUT ME · {BRAND.location}</span>
            </div>
            <KineticHeading
              as="h2"
              className="editorial-display ab-heading"
              lines={[
                { text: 'THEVINDU GUNATHILAKA', tone: 'primary' },
                { text: 'designer behind mr.theviya', tone: 'reina' },
              ]}
            />
          </div>

          <div className="ab-head-actions">
            <button
              type="button"
              className="pill-btn pill-btn-solid"
              onClick={() => setShowCvModal(true)}
            >
              Preview Creative CV
            </button>
            <button type="button" className="pill-btn" onClick={() => onNavigate('contact')}>
              Book Availability ↗
            </button>
          </div>
        </div>

        {/* Main 2-Column Bio + Portrait & Quick Facts */}
        <div className="ab-grid">
          <div className="ab-bio-card glass-panel ab-reveal">
            <div className="ab-profile-row">
              <div className="ab-portrait-thumb">
                <img
                  src={BRAND.profilePhoto}
                  alt={BRAND.fullName}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <span className="ab-status-pill">
                  <i />
                  {BRAND.availability}
                </span>
                <h3>{BRAND.fullName}</h3>
                <p className="ab-role-sub">
                  Creative Visual Designer · SLIIT Undergraduate · Colombo, Sri Lanka
                </p>
              </div>
            </div>

            <div className="ab-story">
              <p>
                I&apos;m <strong>Thevindu Gunathilaka</strong> (known online as{' '}
                <strong>Mr. Theviya</strong>), a Sri Lankan graphic designer, visual editor,
                photographer, and web designer with 5+ years of hands-on creative experience.
              </p>
              <p>
                Alongside my studies at <strong>SLIIT</strong> - where I lead visual campaigns and
                media coverage for FCSC, SIS, and the Leo Club of SLIIT - I partner with concert
                promoters, automotive dealers, fashion brands, and international clients in
                Australia. My workflow connects the entire visual chain: from initial poster concept
                and shoot direction to final grade, motion edit, and web rollout.
              </p>
            </div>

            <div className="ab-facts">
              <div>
                <span className="micro-label">EDUCATION</span>
                <strong>SLIIT (Computing &amp; Media Lead)</strong>
              </div>
              <div>
                <span className="micro-label">WORKING STYLE</span>
                <strong>Concept → Shoot → Edit → Launch</strong>
              </div>
              <div>
                <span className="micro-label">MARKETS</span>
                <strong>Sri Lanka &amp; International (AUS)</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Experience Timeline */}
          <div className="ab-timeline-card glass-panel ab-reveal">
            <span className="micro-label">EXPERIENCE &amp; CREDITS</span>
            <h3 className="ab-sub-title reina-display">where i&apos;ve built my craft</h3>
            <ol className="ab-timeline">
              {ABOUT_TIMELINE.map((item) => (
                <li key={item.title} className="ab-tl-item">
                  <span className="ab-tl-period">{item.period}</span>
                  <strong>{item.title}</strong>
                  <span className="ab-tl-org">{item.org}</span>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tools & Software Stack */}
        <div className="ab-tools ab-reveal">
          <div className="ab-tools-head">
            <div>
              <span className="micro-label">DAILY TOOLSTACK</span>
              <h3 className="ab-sub-title reina-display">software &amp; stack</h3>
            </div>
            <a href={BRAND.linktreeBrand} target="_blank" rel="noreferrer" className="pill-btn">
              All Links on Linktree ↗
            </a>
          </div>

          <div className="ab-tools-grid">
            {TOOLSTACK.map((tool) => (
              <div key={tool.name} className="ab-tool-card glass-panel">
                <strong>{tool.name}</strong>
                <span>{tool.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* On-Site Creative CV Preview Modal (No Forced Tab Exit!) */}
      {showCvModal &&
        createPortal(
          <div
            className="ab-cv-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Creative CV Preview"
            onClick={() => setShowCvModal(false)}
          >
            <div className="ab-cv-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="ab-cv-head">
                <div>
                  <span className="micro-label">RESUME · ON-SITE PREVIEW</span>
                  <h3 className="reina-display">thevindu gunathilaka - creative cv</h3>
                </div>
                <div className="ab-cv-actions">
                  <a
                    href={BRAND.creativeCv}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn pill-btn-solid"
                  >
                    Open / Download PDF ↗
                  </a>
                  <button
                    type="button"
                    className="ab-cv-close"
                    onClick={() => setShowCvModal(false)}
                    aria-label="Close CV preview"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="ab-cv-frame">
                <iframe src={CV_PREVIEW_URL} title="Thevindu Gunathilaka Creative CV" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default ImpactAbout;
