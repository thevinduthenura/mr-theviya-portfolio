import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import './KineticHeading.css';

export interface KineticLine {
  text: string;
  tone?: 'primary' | 'muted' | 'accent' | 'reina';
}

interface KineticHeadingProps {
  lines: KineticLine[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/**
 * Interactive Kinetic Typography for MAIN display headings only.
 * Moving the mouse across the letters triggers a smooth GSAP magnetic wave,
 * vertical lift, slight stretch, and brief crimson-champagne motion-blur trail.
 */
const KineticHeading = ({ lines, as = 'h2', className = '' }: KineticHeadingProps) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLHeadingElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>('.kh-char');
    const radius = 140;

    chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        const power = 1 - dist / radius;
        const lift = -power * 10;
        const skew = (dx / radius) * 10 * power;
        const scaleY = 1 + power * 0.14;
        const blur = power * 0.6;

        gsap.to(char, {
          y: lift,
          skewX: skew,
          scaleY,
          color: power > 0.45 ? '#ff6438' : '',
          textShadow:
            power > 0.35
              ? `0 ${Math.round(power * 10)}px ${Math.round(power * 24)}px rgba(255, 66, 26, 0.55)`
              : 'none',
          filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : 'blur(0px)',
          duration: 0.28,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (char.dataset.energized === '1') {
        char.dataset.energized = '0';
        gsap.to(char, {
          y: 0,
          skewX: 0,
          scaleY: 1,
          color: '',
          textShadow: 'none',
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto',
        });
      }

      if (dist < radius) {
        char.dataset.energized = '1';
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>('.kh-char');

    gsap.to(chars, {
      y: 0,
      skewX: 0,
      scaleY: 1,
      color: '',
      textShadow: 'none',
      filter: 'blur(0px)',
      duration: 0.7,
      stagger: 0.008,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  }, []);

  const Tag = as;
  const fullText = lines.map((l) => l.text).join(' ');

  return (
    <Tag
      ref={containerRef}
      className={`kinetic-heading ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="sr-only">{fullText}</span>
      {lines.map((line, lineIdx) => (
        <span
          key={`${line.text}-${lineIdx}`}
          className={`kh-line kh-tone-${line.tone ?? 'primary'}`}
          aria-hidden="true"
        >
          {line.text.split(' ').map((word, wordIdx, arr) => (
            <span className="kh-word" key={`${word}-${wordIdx}`}>
              {word.split('').map((ch, charIdx) => (
                <span className="kh-char" key={`${ch}-${charIdx}`}>
                  {ch}
                </span>
              ))}
              {wordIdx < arr.length - 1 && <span className="kh-space">&nbsp;</span>}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};

export default KineticHeading;
