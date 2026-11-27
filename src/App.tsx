import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectGallery from './components/ProjectGallery';
import Services from './components/Services';
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery';
import HorizontalScrollGallery from './components/HorizontalScrollGallery';
import Clients from './components/Clients';
import ImpactAbout from './components/ImpactAbout';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectsPage';
import type { DesignTabId, GalleryCategoryId, SectionId } from './types/portfolio';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

type PageRoute = 'home' | 'projects';

const SECTION_IDS: SectionId[] = [
  'home',
  'gallery',
  'services',
  'photography',
  'videography',
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

const readRouteFromLocation = (): { route: PageRoute; projectId: string | null } => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.replace(/^#/, '') || null;
  if (path === '/projects') {
    return { route: 'projects', projectId: hash };
  }
  return { route: 'home', projectId: null };
};

const App = () => {
  const initialLoc = readRouteFromLocation();
  const [route, setRoute] = useState<PageRoute>(initialLoc.route);
  const [targetProjectId, setTargetProjectId] = useState<string | null>(initialLoc.projectId);
  const pendingHomeSectionRef = useRef<SectionId | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>(
    initialLoc.route === 'projects' ? 'projects' : 'home'
  );
  const [activeDesignTab, setActiveDesignTab] = useState<DesignTabId>('projects');
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [smootherReady, setSmootherReady] = useState<boolean>(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);

  const openProjectsPage = useCallback((projectId?: string) => {
    const nextUrl = projectId ? `/projects#${projectId}` : '/projects';
    if (window.location.pathname + window.location.hash !== nextUrl) {
      window.history.pushState({ route: 'projects', projectId: projectId ?? null }, '', nextUrl);
    }
    setTargetProjectId(projectId ?? null);
    setRoute('projects');
    setActiveSection('projects');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const scrollToHomeSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (!target) return;

    if (smootherRef.current) {
      smootherRef.current.scrollTo(target, true, 'top 76px');
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleGoHome = useCallback(
    (section?: SectionId) => {
      if (route !== 'home') {
        const nextUrl = section && section !== 'home' ? `/#${section}` : '/';
        window.history.pushState({ route: 'home' }, '', nextUrl);
        setTargetProjectId(null);
        pendingHomeSectionRef.current = section ?? 'home';
        setRoute('home');
        setActiveSection(section ?? 'home');
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        return;
      }
      scrollToHomeSection(section ?? 'home');
    },
    [route, scrollToHomeSection]
  );

  const handleNavigate = useCallback(
    (id: SectionId) => {
      if (id === 'projects') {
        openProjectsPage();
        return;
      }
      handleGoHome(id);
    },
    [handleGoHome, openProjectsPage]
  );

  // Sync browser Back / Forward buttons
  useEffect(() => {
    const onPopState = () => {
      const next = readRouteFromLocation();
      setRoute(next.route);
      setTargetProjectId(next.projectId);
      setActiveSection(next.route === 'projects' ? 'projects' : 'home');
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleInquireService = useCallback(
    (serviceTitle: string) => {
      setPreselectedService(serviceTitle);
      handleGoHome('contact');
    },
    [handleGoHome]
  );

  const handleJumpToCategory = useCallback(
    (cat: GalleryCategoryId) => {
      if (cat === 'videography') {
        openProjectsPage();
        return;
      }
      if (cat === 'photography') {
        handleGoHome('photography');
        return;
      }
      if (cat === 'web-design') {
        setActiveDesignTab('web-design');
        handleGoHome('gallery');
        return;
      }
      setActiveDesignTab(cat === 'graphic-design' ? 'projects' : 'all');
      handleGoHome('gallery');
    },
    [handleGoHome, openProjectsPage]
  );

  const handleSelectHeroTag = useCallback(
    (tag: string) => {
      const cat = TAG_TO_CATEGORY[tag.toUpperCase()];
      if (cat) {
        handleJumpToCategory(cat);
        return;
      }
      handleGoHome('services');
    },
    [handleJumpToCategory, handleGoHome]
  );

  // Re-initialize GSAP ScrollSmoother cleanly whenever switching between Home and /projects
  useLayoutEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileOrTouch =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 960;

    if (!prefersReduced && !isMobileOrTouch) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.15,
        effects: true,
        smoothTouch: false,
      });
      smootherRef.current.scrollTop(0);
    } else {
      window.scrollTo(0, 0);
    }

    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0 });
    }

    const readyRaf = window.requestAnimationFrame(() => {
      setSmootherReady(true);
      ScrollTrigger.refresh();
    });

    const onWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onWindowLoad);

    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: self.progress });
        }
      },
    });

    return () => {
      window.cancelAnimationFrame(readyRaf);
      window.removeEventListener('load', onWindowLoad);
      progressTrigger.kill();
      smootherRef.current?.kill();
      smootherRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
      setSmootherReady(false);
    };
  }, [route]);

  // Execute deferred section scroll after returning from /projects to Home
  useEffect(() => {
    if (route !== 'home' || !smootherReady || !pendingHomeSectionRef.current) return;
    const sec = pendingHomeSectionRef.current;
    pendingHomeSectionRef.current = null;
    if (sec === 'home') return;
    const timer = window.setTimeout(() => {
      scrollToHomeSection(sec);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [route, smootherReady, scrollToHomeSection]);

  // Active section scroll-spy on Home page via ScrollTrigger
  useEffect(() => {
    if (route !== 'home' || !smootherReady) return;
    const triggers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 42%',
        end: 'bottom 42%',
        onEnter: () => setActiveSection(id === 'videography' ? 'projects' : id),
        onEnterBack: () => setActiveSection(id === 'videography' ? 'projects' : id),
      });
    });

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.clearTimeout(refreshTimer);
      triggers.forEach((t) => t?.kill());
    };
  }, [route, smootherReady]);

  return (
    <>
      <CustomCursor />

      {/* Top Crimson Scroll Progress Indicator (outside ScrollSmoother) */}
      <div className="scroll-progress-bar" aria-hidden="true">
        <div ref={progressRef} className="scroll-progress-fill" />
      </div>

      {/* Fixed Navigation Bar (works across both Home and /projects) */}
      <Navbar
        activeSection={route === 'projects' ? 'projects' : activeSection}
        onNavigate={handleNavigate}
      />

      {/* GSAP ScrollSmoother Wrapper */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="page-shell">
            <div className="ruler-strip" aria-hidden="true">
              {RULER_TICKS.map((tick) => (
                <span key={tick} className={`ruler-tick${tick % 4 === 0 ? ' tall' : ''}`} />
              ))}
            </div>

            <div className="editorial-frame">
              <main>
                {route === 'projects' ? (
                  <ProjectsPage
                    ready={smootherReady}
                    initialProjectId={targetProjectId}
                    onGoHome={handleGoHome}
                  />
                ) : (
                  <>
                    <Hero
                      onNavigate={handleNavigate}
                      onSelectServiceTag={handleSelectHeroTag}
                    />
                    <ProjectGallery
                      activeTab={activeDesignTab}
                      onChangeTab={setActiveDesignTab}
                    />
                    <Services onInquireService={handleInquireService} />
                    <ScrubbedBentoGallery ready={smootherReady} />
                    <HorizontalScrollGallery
                      ready={smootherReady}
                      onOpenProjectsPage={openProjectsPage}
                    />
                    <Clients />
                    <ImpactAbout onNavigate={handleNavigate} ready={smootherReady} />
                    <Contact
                      selectedService={preselectedService}
                      onSelectService={setPreselectedService}
                    />
                  </>
                )}
              </main>

              <Footer
                onNavigate={handleNavigate}
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
