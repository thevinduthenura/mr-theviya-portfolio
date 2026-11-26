import { CLIENT_LOGOS } from '../data/portfolio';
import './Clients.css';

const Clients = () => {
  const marqueeTrack = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="clients-strip" aria-label="Trusted brands and organizations">
      <div className="section-container">
        <div className="clients-header">
          <span className="clients-rule" />
          <span className="micro-label">TRUSTED BY BRANDS, CAMPUSES &amp; ORGANIZATIONS</span>
          <span className="clients-rule" />
        </div>
      </div>

      <div className="clients-marquee-wrap velocity-react">
        <div className="clients-marquee-track">
          {marqueeTrack.map((client, idx) => (
            <div className="client-logo-tile" key={`${client.name}-${idx}`}>
              <img
                src={client.img}
                alt={client.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = 'inline';
                }}
              />
              <span className="client-logo-fallback">{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
