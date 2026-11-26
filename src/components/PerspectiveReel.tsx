import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSPECTIVE_REEL } from '../data/portfolio';
import './PerspectiveReel.css';

gsap.registerPlugin(ScrollTrigger);

const PerspectiveReel = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const slideRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(2);
  const manualOverrideRef = useRef<boolean>(false);

  const total = PERSPECTIVE_REEL.length;

  // Scroll-scrubbed progression through the 5 vertical perspective slides
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        end: 'bottom 35%',
        onUpdate: (self) => {
          if (manualOverrideRef.current) return;
          const nextIdx = Math.min(
            total - 1,
            Math.max(0, Math.floor(self.progress * total))
          );
          setActiveIdx((prev) => (prev === nextIdx ? prev : nextIdx));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [total]);

  // GSAP 3D Vertical Coverflow (rotateX + depth-of-field motion blur)
  useEffect(() => {
    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      const offset = idx - activeIdx;
      const abs = Math.abs(offset);

      let y: number;
      let rotX: number;
      let scale: number;
      let blur: number;
      let opacity: number;
      let zIndex: number;

      if (offset === 0) {
        y = 0;
        rotX = 0;
        scale = 1;
        blur = 0;
        opacity = 1;
        zIndex = 30;
      } else if (abs === 1) {
        y = offset * 172;
        rotX = offset > 0 ? 34 : -34;
        scale = 0.84;
        blur = 2.2;
        opacity = 0.72;
        zIndex = 20;
      } else if (abs === 2) {
        y = offset * 140;
        rotX = offset > 0 ? 52 : -52;
        scale = 0.68;
        blur = 5.2;
        opacity = 0.36;
        zIndex = 10;
      } else {
        y = Math.sign(offset) * 320;
        rotX = offset > 0 ? 64 : -64;
        scale = 0.56;
        blur = 8;
        opacity = 0;
        zIndex = 5;
      }

      gsap.to(el, {
        y,
        rotationX: rotX,
        scale,
        opacity,
        zIndex,
        filter: `blur(${blur}px)`,
        duration: 0.72,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  }, [activeIdx]);

  const selectSlide = (idx: number) => {
    manualOverrideRef.current = true;
    setActiveIdx(idx);
    window.setTimeout(() => {
      manualOverrideRef.current = false;
    }, 1800);
  };

  const activeSlide = PERSPECTIVE_REEL[activeIdx];

  return (
    <section id="reel" ref={sectionRef} className="section-block reel-section">
      <div className="section-container">
        <div className="reel-grid">
          {/* Left Editorial Metadata Rail (Reference Image 2 Style) */}
          <div className="reel-side reel-side-left">
            <div className="reel-corner-meta">
              <span className="reel-thin-rule" />
              <div className="reel-meta-stack">
                {activeSlide.metaLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>

            <div className="reel-active-readout">
              <span className="reel-big-num reina-display">{activeSlide.num}</span>
              <span className="reel-accent-rule" />
              <h2 className="reel-slide-title">{activeSlide.title}</h2>
              <p className="reel-slide-sub">{activeSlide.subtitle}</p>
              <span className="reel-slide-discipline">{activeSlide.discipline}</span>
              <a
                href={activeSlide.href}
                target="_blank"
                rel="noreferrer"
                className="reel-open-link"
                data-cursor="OPEN"
              >
                VIEW COLLECTION ↗
              </a>
            </div>
          </div>

          {/* Center 3D Vertical Perspective Stack */}
          <div className="reel-stage-wrap">
            <div className="reel-stage-glow" aria-hidden="true" />
            <div className="reel-stage" data-cursor="SCROLL">
              {PERSPECTIVE_REEL.map((slide, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    ref={(el) => {
                      slideRefs.current[idx] = el;
                    }}
                    className={`reel-card${isActive ? ' is-active' : ''}`}
                    onClick={() => selectSlide(idx)}
                    aria-label={`${slide.num} ${slide.title}`}
                    data-cursor={isActive ? 'ACTIVE' : 'FOCUS'}
                  >
                    <img src={slide.image} alt={slide.title} loading="lazy" />
                    <div className="reel-card-vignette" />
                    {isActive && (
                      <div className="reel-card-glass-bar">
                        <span>{slide.num} · {slide.discipline}</span>
                        <span>{slide.subtitle}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Editorial Metadata Rail + Interactive Controls */}
          <div className="reel-side reel-side-right">
            <div className="reel-corner-meta align-right">
              <div className="reel-meta-stack">
                <span>EST.</span>
                <span>2021</span>
              </div>
              <span className="reel-thin-rule" />
            </div>

            <div className="reel-mid-right">
              <div className="reel-vertical-phrase">
                <span>MORE</span>
                <span>THAN</span>
                <span>A</span>
                <span>LOOK</span>
              </div>

              <div className="reel-controls glass-panel">
                <button
                  type="button"
                  onClick={() => selectSlide((activeIdx - 1 + total) % total)}
                  aria-label="Previous reel frame"
                >
                  ↑
                </button>
                <div className="reel-dots">
                  {PERSPECTIVE_REEL.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`reel-dot${idx === activeIdx ? ' is-active' : ''}`}
                      onClick={() => selectSlide(idx)}
                      aria-label={`Jump to ${s.title}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => selectSlide((activeIdx + 1) % total)}
                  aria-label="Next reel frame"
                >
                  ↓
                </button>
              </div>
            </div>

            <div className="reel-corner-meta align-right">
              <div className="reel-meta-stack">
                <span>VISUALS</span>
                <span>MOVE</span>
                <span>IDEAS</span>
                <span>STAY</span>
              </div>
              <span className="reel-thin-rule" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerspectiveReel;
