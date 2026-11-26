import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, SHOWCASE_PROJECTS } from '../data/portfolio';
import './StatementShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const StatementShowcase = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const asteriskRef = useRef<HTMLSpanElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rotating editorial asterisk scrubbed by scroll
      if (asteriskRef.current) {
        gsap.to(asteriskRef.current, {
          rotation: 180,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Word-by-word motion-blur unblur & highlight scrub
      gsap.fromTo(
        '.st-scrub-word',
        { opacity: 0.22, filter: 'blur(7px)', y: 12 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.statement-hero',
            start: 'top 82%',
            end: 'bottom 45%',
            scrub: 0.9,
          },
        }
      );

      // Inline pill zoom-reveal on scroll
      if (pillRef.current) {
        gsap.fromTo(
          pillRef.current,
          { scale: 0.65, rotate: -6 },
          {
            scale: 1,
            rotate: 0,
            scrollTrigger: {
              trigger: '.statement-hero',
              start: 'top 76%',
              end: 'center 52%',
              scrub: 1,
            },
          }
        );
      }

      // Showcase cards staggered glass rise
      gsap.fromTo(
        '.showcase-card',
        { y: 46, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.showcase-grid',
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse-tracking glass sheen + gentle 3D tilt on cards
  const handleCardMove = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;

    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);

    gsap.to(el, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const handleCardLeave = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-block statement-section">
      <div className="section-container">
        {/* Top Meta Bar */}
        <div className="statement-top">
          <span ref={asteriskRef} className="editorial-asterisk" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 3v30M3 18h30M7.4 7.4l21.2 21.2M28.6 7.4 7.4 28.6"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="micro-label statement-top-right">
            DESIGN YOUR DREAMS
            <br />
            COLOMBO • WORLDWIDE
          </span>
        </div>

        {/* Scroll-Scrubbed Two-Tone Editorial Statement */}
        <div className="statement-hero">
          <h2 className="editorial-display statement-heading">
            <span className="st-scrub-word">MR. THEVIYA</span>{' '}
            <span className="st-scrub-word">CRAFTS</span>
            <br />
            <span className="st-scrub-word">BRAND</span>{' '}
            <span className="st-scrub-word">SYSTEMS</span>
            <span ref={pillRef} className="inline-pill-media">
              <img src="/images/projects/graphic-design/hyper-1.jpg" alt="" />
            </span>
            <span className="st-scrub-word">THAT</span>
            <br />
            <span className="st-scrub-word muted">REDEFINE</span>{' '}
            <span className="st-scrub-word muted">MODERN</span>
            <br />
            <span className="st-scrub-word">VISUAL</span>{' '}
            <span className="st-scrub-word reina-serif">culture</span>
          </h2>

          <p className="statement-copy">
            I&apos;m <strong>{BRAND.fullName}</strong> ({BRAND.aliasName}), a graphic designer,
            visual editor, and web designer with over five years of experience across domestic and
            international markets. Combining identity, motion, photography, and web craft - built to
            cut through noise and leave a lasting visual signature.
          </p>
        </div>

        {/* Showcase Row with Velocity Skew & 3D Glass Tilt */}
        <div className="showcase-layout velocity-react">
          <div className="showcase-rail">
            <div className="showcase-rail-title">
              <span>OUR</span>
              <span>LATEST</span>
              <span>PROJECTS</span>
            </div>
            <a
              href={BRAND.behance}
              target="_blank"
              rel="noreferrer"
              className="showcase-rail-link"
              data-cursor="OPEN"
            >
              View Behance ↗
            </a>
          </div>

          <div className="showcase-grid">
            {SHOWCASE_PROJECTS.map((project) => (
              <a
                key={project.id}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="showcase-card"
                onPointerMove={handleCardMove}
                onPointerLeave={handleCardLeave}
                data-cursor="VIEW"
              >
                <div className="showcase-card-media">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="showcase-card-scrim" />
                  <div className="showcase-card-sheen" aria-hidden="true" />
                  <span className="showcase-card-pill">
                    {project.platform} · {project.category}
                  </span>
                  <span className="showcase-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="showcase-card-meta">
                  <h3>{project.title}</h3>
                  <span>
                    {project.client} · {project.year}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatementShowcase;
