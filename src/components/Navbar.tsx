import { useEffect, useState } from 'react';
import { BRAND, NAV_ITEMS } from '../data/portfolio';
import type { SectionId } from '../types/portfolio';
import './Navbar.css';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (id: SectionId) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header className={`ed-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="ed-nav-inner">
          {/* Left: Brand Tag */}
          <a
            href="#home"
            className="ed-brand"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            aria-label="Mr. Theviya Home"
          >
            <img
              src={BRAND.tagLogo}
              alt="Mr. Theviya"
              className="ed-brand-img"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="ed-brand-status">
              <span className="ed-status-dot" />
              <span className="ed-status-text">OPEN FOR WORK</span>
            </span>
          </a>

          {/* Center: Frosted Glass Pill Nav */}
          <nav className="ed-nav-pill" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`ed-nav-link${activeSection === item.id ? ' is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: Circular Links + Creative CV + Contact */}
          <div className="ed-nav-actions">
            <a
              href={BRAND.behance}
              target="_blank"
              rel="noreferrer"
              className="ed-icon-circle"
              aria-label="Behance Portfolio"
              title="Behance"
            >
              BE
            </a>
            <a
              href={BRAND.creativeCv}
              target="_blank"
              rel="noreferrer"
              className="ed-icon-circle"
              aria-label="Creative CV"
              title="Creative CV"
            >
              CV
            </a>
            <a
              href="#contact"
              className="ed-nav-cta"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('contact');
              }}
            >
              More Info
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className={`ed-burger${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`ed-drawer${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="ed-drawer-inner">
          <div className="ed-drawer-header">
            <span className="micro-label">NAVIGATION</span>
            <button
              type="button"
              className="ed-drawer-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>
          <div className="ed-drawer-links">
            {NAV_ITEMS.map((item, idx) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`ed-drawer-link${activeSection === item.id ? ' is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
              >
                <span className="ed-drawer-num">0{idx + 1}</span>
                <span>{item.label}</span>
                <span className="ed-drawer-arrow">↗</span>
              </a>
            ))}
          </div>
          <div className="ed-drawer-footer">
            <a
              href="#contact"
              className="pill-btn pill-btn-solid"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('contact');
              }}
            >
              Start a Project ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
