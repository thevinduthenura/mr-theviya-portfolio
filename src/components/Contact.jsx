import { useRef, useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', service: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSend = () => {
    if (!form.email || !form.message) return;
    const subject = encodeURIComponent(`Portfolio Inquiry - ${form.service || 'General'}`);
    const body = encodeURIComponent(`Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nService: ${form.service}\n\nMessage:\n${form.message}`);
    window.open(`mailto:thevinduthenura222@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const contacts = [
    { icon: '💬', label: 'WhatsApp', value: 'Message me directly', href: 'https://whatsapp.com/channel/0029VaAMUWs0gcfO6GBcoW2R' },
    { icon: '📸', label: 'Instagram', value: '@mr.theviya', href: 'https://instagram.com/mr.theviya' },
    { icon: '💼', label: 'LinkedIn', value: 'Thevindu Thenura', href: 'https://www.linkedin.com/in/thevindu-thenura' },
    { icon: '⚡', label: 'Hire on Fiverr', value: 'Quick turnaround projects', href: 'https://www.fiverr.com/pe/WL39d7' },
  ];

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="container contact-grid">
        {/* Left */}
        <div className="contact-info fade-up">
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">Let's Work<br /><em>Together</em></h2>
          <p className="contact-desc">Have a project in mind? I'd love to hear about it. Drop a message and let's create something extraordinary.</p>
          <div className="contact-items">
            {contacts.map((c, i) => (
              <a href={c.href} key={i} className="contact-item" target="_blank" rel="noreferrer">
                <div className="contact-icon">{c.icon}</div>
                <div>
                  <div className="contact-item-label">{c.label}</div>
                  <div className="contact-item-value">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div className="contact-form fade-up" style={{ transitionDelay: '0.15s' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" placeholder="John"
                value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" placeholder="Doe"
                value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Service</label>
            <input className="form-input" type="text" placeholder="e.g. Logo Design, Video Editing..."
              value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-textarea" placeholder="Tell me about your project..."
              value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </div>
          <button className="btn-send" onClick={handleSend}>Send Message →</button>
          {sent && <div className="form-success">✅ Opening email client... I'll get back to you soon!</div>}
        </div>
      </div>
    </section>
  );
};

export default Contact;
