import './Clients.css';

const clients = [
  { name: 'COSMOS', img: '/images/clients/Cosmos%20logo.svg' },
  { name: 'ROAR', img: '/images/clients/ROAR%20Logo%2026.svg' },
  { name: 'KALAAVATA', img: '/images/clients/kalaawata%20logo.svg' },
  { name: 'A.A. SAMARASINHA', img: '/images/clients/AASamarasinha%20Logo.svg' },
  { name: 'ROYAL', img: '/images/clients/Royal%20Logo.svg' },
  { name: 'SLIIT', img: '/images/clients/SLIIT-UNI-LOGOwhite%201.svg' },
  { name: 'SSC', img: '/images/clients/SSC%20Logo.svg' },
  { name: 'RUPAVAHINI', img: '/images/clients/rupavahini%20logo.svg' },
  { name: 'C2 DISTRICT', img: '/images/clients/C2%20District%20Logo.svg' }
];

const Clients = () => {
  const track = [...clients, ...clients]; // duplicate for infinite loop

  return (
    <section className="clients-section">
      <div className="clients-track-wrap">
        <div className="clients-track">
          {track.map((c, i) => (
            <div className="client-item" key={i}>
              <img
                src={c.img}
                alt={c.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="client-name-fallback">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
