import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Clients from './components/Clients';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Scroll animations for Hero section elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Background Effects */}
      <div className="bg-glow-container">
        <div className="glow-blob glow-1"></div>
        <div className="glow-blob glow-2"></div>
        <div className="watermark">DESIGN<br />DREAMS</div>
      </div>

      <div className="layout-lines"></div>

      {/* Sections */}
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <Clients />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
