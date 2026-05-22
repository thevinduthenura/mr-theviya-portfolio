import './Hero.css';

const Hero = () => {
  return (
    <section className="hero container">
      {/* Left: Typography */}
      <div className="hero-left">
        <img src="/images/arrow.svg" alt="" className="hero-arrow" />
        <p className="hero-greeting">Hey, I'm</p>
        <h1 className="hero-name">mr.theviya</h1>
        <div className="hero-roles">
          <span className="dot">•</span> Graphic Designer <span className="dot">•</span> Visual Editor
        </div>
        <div className="hero-underline"></div>
      </div>

      {/* Center: Portrait */}
      <div className="hero-center">
        <div className="portrait-container">
          <img src="/images/profile.jpg" alt="Thevindu Thenura" />
        </div>
      </div>

      {/* Right: Stats */}
      <div className="hero-right">
        <div className="stat-item">
          <div className="stat-label">Years of experiences</div>
          <div className="stat-value">4<span>+</span></div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Projects done</div>
          <div className="stat-value">120<span>+</span></div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Clients</div>
          <div className="stat-value">35<span>+</span></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
