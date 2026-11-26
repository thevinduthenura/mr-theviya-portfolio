import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../data/portfolio';
import type { ServiceItem } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  onInquireService: (serviceTitle: string) => void;
}

const Services = ({ onInquireService }: ServicesProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string>('video-editing');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.srv-card',
        { y: 64, rotateY: -12, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          rotateY: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-deck',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (srv: ServiceItem) => {
    setActiveId(srv.id);
    onInquireService(srv.title);
  };

  // Liquid glass specular light + gentle 3D cursor tilt
  const handleCardMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
  }, []);

  return (
    <section id="services" ref={sectionRef} className="section-block services-editorial">
      <div className="section-container">
        {/* Centered Interactive Kinetic Heading */}
        <div className="services-intro">
          <KineticHeading
            as="h2"
            className="editorial-display services-title"
            lines={[
              { text: 'EVERYTHING YOUR', tone: 'primary' },
              { text: 'BRAND NEEDS TO GROW', tone: 'muted' },
            ]}
          />
          <p className="services-lead">
            Strategic visual identity, cinematic videography, editorial photography, and dark-luxury
            web design - built to elevate your brand from concept to execution.
          </p>
        </div>

        {/* 4-Card Elevated Interactive Glass Deck */}
        <div className="services-deck">
          {SERVICES.map((srv) => {
            const isActive = activeId === srv.id;

            return (
              <article
                key={srv.id}
                className={`srv-card${isActive ? ' is-elevated' : ''}`}
                onMouseEnter={() => setActiveId(srv.id)}
                onFocus={() => setActiveId(srv.id)}
                onPointerMove={handleCardMove}
                data-cursor="SELECT"
              >
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="srv-card-bg"
                  loading="lazy"
                />
                <div className="srv-card-overlay" />
                <div className="srv-card-glass-sheen" aria-hidden="true" />

                <div className="srv-card-top">
                  <span className="srv-badge">
                    <span>{srv.num}</span>
                    <span className="srv-badge-sep">/</span>
                    <span>{srv.badge}</span>
                  </span>
                </div>

                <div className="srv-card-body">
                  <h3 className="srv-card-title">{srv.title}</h3>
                  <p className="srv-card-desc">{srv.description}</p>

                  <ul className="srv-deliverables">
                    {srv.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="srv-card-cta"
                    onClick={() => handleSelect(srv)}
                  >
                    <span className="srv-cta-circle" aria-hidden="true">
                      ↗
                    </span>
                    <span>{srv.ctaLabel}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
