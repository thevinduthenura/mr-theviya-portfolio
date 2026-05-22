import './Clients.css';

const clients = [
  { name: 'COSMOS', img: '/images/clients/cosmos.png' },
  { name: 'ROAR', img: '/images/clients/roar.png' },
  { name: 'KALAAVATA', img: '/images/clients/kalaavata.png' },
  { name: 'A.A. OPTOMETRISTS', img: '/images/clients/aa-optometrists.png' },
  { name: 'THE ROYAL', img: '/images/clients/the-royal.png' },
  { name: 'SHRIYA', img: '/images/clients/shriya.png' },
  { name: 'TAJ MAHAL', img: '/images/clients/taj-mahal.png' },
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
