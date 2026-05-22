import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';

function App() {
  return (
    <>
      <div className="bg-glow-container">
        <div className="glow-blob glow-1"></div>
        <div className="glow-blob glow-2"></div>
        <div className="watermark">DESIGN DREAMS</div>
      </div>
      
      <div className="layout-lines"></div>

      <Navbar />
      <Hero />
      <Services />
      
      {/* Brands row can go here if needed later */}
      <div className="container" style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px', paddingBottom: '40px' }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>TRUSTED BY</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
          <span>COSMOS</span>
          <span>ROAR</span>
          <span>KALAAVATA</span>
          <span>AA OPTOMETRISTS</span>
        </div>
      </div>
    </>
  );
}

export default App;
