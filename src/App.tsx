import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatementShowcase from './components/StatementShowcase';
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery';
import HorizontalScrollGallery from './components/HorizontalScrollGallery';
import ProjectGallery from './components/ProjectGallery';
import PosterFanDeck from './components/PosterFanDeck';
import PerspectiveReel from './components/PerspectiveReel';
import Services from './components/Services';
import Clients from './components/Clients';
import ImpactAbout from './components/ImpactAbout';
import Contact from './components/Contact';
import Footer from './components/Footer';
import type { DesignTabId, GalleryCategoryId, SectionId } from './types/portfolio';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SECTION_IDS: SectionId[] = [
  'home',
  'projects',
  'photography',
  'videography',
  'gallery',
  'archive',
  'reel',
  'services',
  'about',
  'contact',
];
const RULER_TICKS = Array.from({ length: 29 }, (_, idx) => idx);

const TAG_TO_CATEGORY: Record<string, GalleryCategoryId> = {
  'GRAPHIC DESIGN': 'graphic-design',
  VIDEOGRAPHY: 'videography',
  PHOTOGRAPHY: 'photography',
  'WEB DESIGN': 'web-design',
};

const App = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [activeDesignTab, setActiveDesignTab] = useState<DesignTabId>('projects');
  const [preselectedService, setPreselectedService] = useState<string>('');
  const progressRef = useRef<HTMLDivElement | null>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);

  const scrollToSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (!target) return;

    if (smootherRef.current) {
      smootherRef.current.scrollTo(target, true, 'top 76px');
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleInquireService = useCallback(
    (serviceTitle: string) => {
      setPreselectedService(serviceTitle);
      scrollToSection('contact');
    },
    [scrollToSection]
  );

  const handleJumpToCategory = useCallback(
    (cat: GalleryCategoryId) => {
      if (cat === 'photography') {
        scrollToSection('photography');
        return;
      }
      if (cat === 'videography') {
        scrollToSection('videography');
        return;
      }
      if (cat === 'web-design') {
        setActiveDesignTab('web-design');
        scrollToSection('gallery');
        return;
      }
      setActiveDesignTab(cat === 'graphic-design' ? 'projects' : 'all');
      scrollToSection('gallery');
    },
    [scrollToSection]
  );

  const handleSelectHeroTag = useCallback(
    (tag: string) => {
      const cat = TAG_TO_CATEGORY[tag.toUpperCase()];
      if (cat) {
        handleJumpToCategory(cat);
        return;
      }
      scrollToSection('services');
    },
    [handleJumpToCategory, scrollToSection]
  );

  // Initialize GSAP ScrollSmoother (desktop only) + Scroll Progress + Velocity Motion Blur
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileOrTouch =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 960;
    const proxy = { skew: 0, blur: 0 };

    const applyVars = () => {
      document.documentElement.style.setProperty('--scroll-skew', `${proxy.skew.toFixed(2)}deg`);
      document.documentElement.style.setProperty('--scroll-blur', `${proxy.blur.toFixed(2)}px`);
    };

    // Use native 120Hz momentum scroll on mobile/touch; reserve ScrollSmoother for desktop
    if (!prefersReduced && !isMobileOrTouch) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.35,
        effects: true,
        smoothTouch: false,
      });
    }

    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: self.progress });
        }

        if (prefersReduced || isMobileOrTouch) return;

        const velocity = self.getVelocity();
        const targetSkew = gsap.utils.clamp(-2.6, 2.6, velocity / -780);
        const targetBlur = gsap.utils.clamp(0, 1.25, Math.abs(velocity) / 2700);

        if (Math.abs(targetSkew) > Math.abs(proxy.skew)) {
          proxy.skew = targetSkew;
          proxy.blur = targetBlur;
          applyVars();

          gsap.to(proxy, {
            skew: 0,
            blur: 0,
            duration: 0.72,
            ease: 'power3.out',
            overwrite: 'auto',
            onUpdate: applyVars,
          });
        }
      },
    });

    return () => {
      progressTrigger.kill();
      smootherRef.current?.kill();
      smootherRef.current = null;
      document.documentElement.style.setProperty('--scroll-skew', '0deg');
      document.documentElement.style.setProperty('--scroll-blur', '0px');
    };
  }, []);

  // Active section scroll-spy via ScrollTrigger
  useEffect(() => {
    const triggers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 42%',
        end: 'bottom 42%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.clearTimeout(refreshTimer);
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <>
      <CustomCursor />

      {/* Top Crimson Scroll Progress Indicator (outside ScrollSmoother) */}
      <div className="scroll-progress-bar" aria-hidden="true">
        <div ref={progressRef} className="scroll-progress-fill" />
      </div>

      {/* Fixed Navigation Bar (outside ScrollSmoother so fixed stays crisp) */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* GSAP ScrollSmoother Wrapper */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="page-shell">
            {/* Subtle architectural ruler marks framing the top edge */}
            <div className="ruler-strip" aria-hidden="true">
              {RULER_TICKS.map((tick) => (
                <span key={tick} className={`ruler-tick${tick % 4 === 0 ? ' tall' : ''}`} />
              ))}
            </div>

            <div className="editorial-frame">
              <main>
                <Hero onNavigate={scrollToSection} onSelectServiceTag={handleSelectHeroTag} />
                <StatementShowcase />
                <ScrubbedBentoGallery />
                <HorizontalScrollGallery />
                <ProjectGallery
                  activeTab={activeDesignTab}
                  onChangeTab={setActiveDesignTab}
                />
                <PosterFanDeck />
                <PerspectiveReel />
                <Services onInquireService={handleInquireService} />
                <Clients />
                <ImpactAbout onNavigate={scrollToSection} />
                <Contact
                  selectedService={preselectedService}
                  onSelectService={setPreselectedService}
                />
              </main>

              <Footer
                onNavigate={scrollToSection}
                onJumpToCategory={handleJumpToCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
