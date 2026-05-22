import './About.css';
import { useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    sectionRef.current?.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container about-grid">
        {/* Image side */}
        <div className="about-image-wrap fade-up">
          <div className="about-img-frame">
            <img
              src="/images/profile.png"
              alt="Thevindu Thenura"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="about-img-placeholder">
              <span>Add about.jpg to public/images/</span>
            </div>
          </div>
          <div className="about-badge">
            <span className="badge-num">4+</span>
            <span className="badge-label">Years<br />Experience</span>
          </div>
        </div>

        {/* Text side */}
        <div className="about-text fade-up" style={{ transitionDelay: '0.15s' }}>
          <div className="section-label">Who I am</div>
          <h2 className="section-title">Thevindu<br /><em>Thenura</em></h2>
          <p className="about-bio">
            I'm <strong>Thevindu Thenura</strong> — a Sri Lankan Graphic Designer and Visual Editor
            with over <strong>4 years of experience</strong> crafting visual identities that resonate.
            I work across domestic and international markets, bringing <strong>innovation and passion</strong> to every project.
          </p>
          <p className="about-bio">
            From bold logo concepts to polished brand identities, my work blends strategic thinking
            with creative execution. <em>"Design Your Dreams — let's create something beautiful together."</em>
          </p>

          <div className="skill-tags">
            {['Logo Design', 'Branding', 'Illustration', 'Video Editing', 'Photography', 'Motion Graphics', 'Print Design', 'Social Media'].map(s => (
              <span className="skill-tag" key={s}>{s}</span>
            ))}
          </div>

          <div className="social-links">
            <a href="https://instagram.com/mr.theviya" target="_blank" rel="noreferrer" className="social-btn">📸 Instagram</a>
            <a href="https://www.behance.net/mrtheviya1" target="_blank" rel="noreferrer" className="social-btn">🎨 Behance</a>
            <a href="https://www.fiverr.com/pe/WL39d7" target="_blank" rel="noreferrer" className="social-btn">⚡ Fiverr</a>
            <a href="https://www.upwork.com/freelancers/~018169c21ea3d09e71" target="_blank" rel="noreferrer" className="social-btn">↗ UpWork</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
