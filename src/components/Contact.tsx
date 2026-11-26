import { useEffect, useRef, useState, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND, CONTACT_CHANNELS, SERVICE_PILLS } from '../data/portfolio';
import type { ContactFormState } from '../types/portfolio';
import KineticHeading from './KineticHeading';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  selectedService: string;
  onSelectService: (service: string) => void;
}

const INITIAL_FORM: Omit<ContactFormState, 'service'> = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

const Contact = ({ selectedService, onSelectService }: ContactProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState<Omit<ContactFormState, 'service'>>(INITIAL_FORM);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.channel-row',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-channels',
            start: 'top 84%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.inquiry-card',
        { y: 40, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.inquiry-card',
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleToggleService = (pill: string) => {
    onSelectService(selectedService.toLowerCase() === pill.toLowerCase() ? '' : pill);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email.trim() || !form.message.trim()) {
      setHasError(true);
      setStatusMessage('Please enter your email address and a brief message about your project.');
      return;
    }

    setHasError(false);
    const subject = encodeURIComponent(
      `Portfolio Inquiry - ${selectedService || 'Creative Project'}`
    );
    const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nService: ${selectedService || 'General'}\n\nProject Details:\n${form.message}`
    );

    window.open(`mailto:${BRAND.email}?subject=${subject}&body=${body}`, '_self');
    setStatusMessage('Opening your email client - I will respond shortly!');
    window.setTimeout(() => setStatusMessage(''), 4500);
  };

  return (
    <section id="contact" ref={sectionRef} className="section-block contact-editorial">
      <div className="section-container">
        <div className="contact-layout">
          {/* Left Column: Kinetic Editorial Heading + Direct Channels */}
          <div className="contact-left">
            <div className="contact-eyebrow">
              <span className="editorial-asterisk" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M18 3v30M3 18h30M7.4 7.4l21.2 21.2M28.6 7.4 7.4 28.6"
                    stroke="currentColor"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="micro-label">GET IN TOUCH</span>
            </div>

            <KineticHeading
              as="h2"
              className="editorial-display contact-heading"
              lines={[
                { text: "LET'S BUILD", tone: 'primary' },
                { text: 'SOMETHING', tone: 'muted' },
                { text: 'bold together', tone: 'reina' },
              ]}
            />

            <p className="contact-copy">
              {BRAND.subTagline} Have a brand, campaign, or visual story ready to launch? Reach out
              directly via WhatsApp, email, or drop a project brief below.
            </p>

            <div className="contact-direct-row">
              <a href={`mailto:${BRAND.email}`} className="contact-direct-email" data-cursor="MAIL">
                <span>{BRAND.email}</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={BRAND.whatsappDirect}
                target="_blank"
                rel="noreferrer"
                className="contact-direct-email"
                data-cursor="CHAT"
              >
                <span>WhatsApp {BRAND.whatsappNumber}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="contact-channels">
              {CONTACT_CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noreferrer"
                  className="channel-row glass-panel"
                  data-cursor="OPEN"
                >
                  <span className="channel-code">{ch.code}</span>
                  <div className="channel-meta">
                    <strong>{ch.label}</strong>
                    <span>{ch.value}</span>
                  </div>
                  <span className="channel-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Liquid Glass Project Inquiry Form */}
          <div className="contact-right">
            <form className="inquiry-card glass-panel" onSubmit={handleSubmit} noValidate>
              <div className="inquiry-card-head">
                <span className="micro-label">PROJECT BRIEF</span>
                <h3 className="reina-display">send a message</h3>
              </div>

              <div className="inquiry-row">
                <label className="inquiry-field">
                  <span>First Name</span>
                  <input
                    type="text"
                    placeholder="Alex"
                    value={form.firstName}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </label>

                <label className="inquiry-field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    placeholder="Perera"
                    value={form.lastName}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </label>
              </div>

              <label className="inquiry-field">
                <span>Email Address *</span>
                <input
                  type="email"
                  required
                  placeholder="you@brand.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </label>

              <div className="inquiry-services">
                <span className="inquiry-label">What do you need help with?</span>
                <div className="inquiry-pills">
                  {SERVICE_PILLS.map((pill) => {
                    const active = selectedService.toLowerCase() === pill.toLowerCase();
                    return (
                      <button
                        key={pill}
                        type="button"
                        className={`inquiry-pill${active ? ' is-active' : ''}`}
                        onClick={() => handleToggleService(pill)}
                      >
                        {pill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="inquiry-field">
                <span>Project Details *</span>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your brand, timeline, and creative vision..."
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </label>

              <button type="submit" className="inquiry-submit" data-cursor="SEND">
                <span>Send Project Inquiry</span>
                <span aria-hidden="true">↗</span>
              </button>

              {statusMessage && (
                <p
                  className={`inquiry-status${hasError ? ' is-error' : ''}`}
                  role={hasError ? 'alert' : 'status'}
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
