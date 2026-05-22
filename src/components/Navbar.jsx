import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar container">
      <div className="nav-logo">THEVIYA</div>
      
      <ul className="nav-links">
        <li><a href="#home" className="active">HOME</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      
      <a href="#contact" className="nav-cta">More Info</a>
    </nav>
  );
};

export default Navbar;
