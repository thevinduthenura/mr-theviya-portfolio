import { useEffect, useState } from 'react';
import { BRAND, GALLERY_CATEGORIES, NAV_ITEMS, SOCIAL_LINKS } from '../data/portfolio';
import type { GalleryCategoryId, SectionId } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './Footer.css';

interface FooterProps {
  onNavigate: (id: SectionId) => void;
  onJumpToCategory: (cat: GalleryCategoryId) => void;
}

const getColomboTime = () => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch {
    return 'GMT+5:30';
  }
};

const Footer = ({ onNavigate, onJumpToCategory }: FooterProps) => {
  const year = new Date().getFullYear();
  const [colomboTime, setColomboTime] = useState<string>(getColomboTime);

  useEffect(() => {
    const id = window.setInterval(() => setColomboTime(getColomboTime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const disciplineLinks = GALLERY_CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <footer className="ed-footer">
      <div className="ed-footer-glow" aria-hidden="true" />

      <div className="section-container">
        {/* Monumental Signature CTA Banner */}
        <div className="ed-footer-hero glass-panel">
          <div className="ed-footer-hero-left">
            <div className="ed-footer-status">
              <span className="ed-footer-dot" />
              <span className="micro-label">AVAILABLE FOR NEW PROJECTS · {BRAND.location}</span>
            </div>

            <KineticHeading
              as="h2"
              className="ed-footer-mega reina-display"
              lines={[{ text: 'mr.theviya', tone: 'reina' }]}
            />
            <p className="ed-footer-sub reina-serif">
              design your dreams - let&apos;s create something unforgettable
            </p>
          </div>

          <div className="ed-footer-hero-right">
            <button
              type="button"
              className="pill-btn pill-btn-solid"
              onClick={() => onNavigate('contact')}
            >
              Start a Project ↗
            </button>
            <a
              href={BRAND.creativeCv}
              target="_blank"
              rel="noreferrer"
              className="pill-btn"
            >
              Creative CV ↗
            </a>
            <a
              href={BRAND.whatsappDirect}
              target="_blank"
              rel="noreferrer"
              className="pill-btn"
            >
              WhatsApp Direct ↗
            </a>
          </div>
        </div>

        {/* 4-Column Architectural Directory */}
        <div className="ed-footer-grid">
          {/* Col 1: Brand & Direct Info */}
          <div className="ed-footer-brand">
            <img
              src={BRAND.tagLogo}
              alt="Mr. Theviya"
              className="ed-footer-logo"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <p className="ed-footer-tagline">
              Graphic Designer, Videographer, Photographer &amp; Web Designer crafting bold visual
              identities for domestic and international brands.
            </p>
            <div className="ed-footer-direct">
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              <a href={BRAND.whatsappDirect} target="_blank" rel="noreferrer">
                {BRAND.whatsappNumber}
              </a>
            </div>
            <div className="ed-footer-clock">
              <span className="micro-label">COLOMBO LOCAL TIME</span>
              <strong>{colomboTime}</strong>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="ed-footer-col">
            <span className="micro-label">NAVIGATION</span>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Project Galleries */}
          <div className="ed-footer-col">
            <span className="micro-label">GALLERIES</span>
            <ul>
              {disciplineLinks.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    className="ed-footer-cat-btn"
                    onClick={() => onJumpToCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span>{cat.countLabel}</span>
                  </button>
                </li>
              ))}
              <li>
                <a href={BRAND.driveSamples} target="_blank" rel="noreferrer">
                  Google Drive Samples ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Socials & Single Linktree */}
          <div className="ed-footer-col">
            <span className="micro-label">PLATFORMS &amp; LINKS</span>
            <div className="ed-footer-socials">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ed-social-chip"
                  title={`${social.label} (${social.handle})`}
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Architectural Bar */}
        <div className="ed-footer-bottom">
          <span>
            © {year} {BRAND.fullName} ({BRAND.monogram}). All rights reserved.
          </span>

          <div className="ed-footer-bottom-right">
            <span className="ed-footer-loc">COLOMBO, SRI LANKA · WORLDWIDE</span>
            <button
              type="button"
              className="ed-back-top"
              onClick={() => onNavigate('home')}
              aria-label="Back to top"
            >
              TOP ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
