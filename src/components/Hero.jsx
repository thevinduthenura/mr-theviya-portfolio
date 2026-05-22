import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-inner">

        {/* ── LEFT: Text ── */}
        <div className="hero-left">
          {/* Dashed arrow — exact Figma: 10px dashed rgba(235,235,235,0.8) rotate(23deg) */}
          <div className="hero-dashed-arrow"></div>

          <div className="tag-name">
            <p className="hero-greeting">Hey, I'm</p>
            <h1 className="hero-name">mr.theviya</h1>
            <p className="hero-roles">• Graphic Designer &nbsp;• Visual Editor</p>
            {/* Underline — exact Figma: 7px solid #BB4A0D rotate(5.56deg) */}
            <div className="hero-underline"></div>
          </div>
        </div>

        {/* ── CENTER: Portrait ── */}
        <div className="hero-center">
          <div className="portrait-outer">
            <img
              src="/images/profile.jpg"
              alt="Mr. Theviya"
              className="portrait-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
            {/* Dark gradient overlay at bottom — exact Figma */}
            <div className="portrait-overlay"></div>
          </div>
        </div>

        {/* ── RIGHT: Stats ── */}
        <div className="hero-right">
          <div className="stat-item">
            <div className="stat-label">Years of experiences</div>
            <div className="stat-num">5+</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Projects done</div>
            <div className="stat-num">120+</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Clients</div>
            <div className="stat-num">35+</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
