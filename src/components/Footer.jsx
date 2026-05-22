import './Footer.css';

const Footer = () => {
  const socials = [
    { label: 'ig', href: 'https://instagram.com/mr.theviya' },
    { label: 'fb', href: 'https://www.facebook.com/mr.theviya' },
    { label: 'tk', href: 'https://www.tiktok.com/@mr.theviya' },
    { label: '𝕏', href: 'https://x.com/thevi____' },
    { label: 'be', href: 'https://www.behance.net/mrtheviya1' },
    { label: 'yt', href: 'http://youtube.com/@slvisualizer' },
  ];

  return (
    <footer className="footer">
      <div className="footer-logo"><span>Mr.</span>Theviya</div>
      <div className="footer-copy">© 2025 Thevindu Thenura. All rights reserved.</div>
      <div className="footer-socials">
        {socials.map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noreferrer" className="footer-social">{s.label}</a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
