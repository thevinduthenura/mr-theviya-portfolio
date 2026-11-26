import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

/**
 * Subtle ambient crimson light glow that softly tracks the pointer
 * without any distracting cursor ring or circle over the native mouse pointer.
 */
const CustomCursor = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced || !glowRef.current) return;

    const glowEl = glowRef.current;
    const glowX = gsap.quickTo(glowEl, 'x', { duration: 0.85, ease: 'power2.out' });
    const glowY = gsap.quickTo(glowEl, 'y', { duration: 0.85, ease: 'power2.out' });

    const onMove = (e: PointerEvent) => {
      glowEl.style.opacity = '1';
      glowX(e.clientX);
      glowY(e.clientY);
    };

    const onLeave = () => {
      glowEl.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="ambient-pointer-layer" aria-hidden="true">
      <div ref={glowRef} className="ambient-pointer-glow" />
    </div>
  );
};

export default CustomCursor;
