import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['home', 'about', 'services', 'contact'];

  const handleNav = (id) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">THEVIYA</div>

        <ul className="nav-links">
          {navLinks.map(id => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNav(id); }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="nav-cta" onClick={(e) => { e.preventDefault(); handleNav('contact'); }}>
          More Info
        </a>

        <button
          className={`nav-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map(id => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); handleNav(id); }}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
