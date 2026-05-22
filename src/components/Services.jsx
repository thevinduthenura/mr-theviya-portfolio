import './Services.css';

const Services = () => {
  const servicesData = [
    {
      num: '01',
      title: 'GRAPHIC DESIGN',
      desc: 'Creating visual identities, logos, and brand materials that make lasting impressions.',
      items: ['Logo Design', 'Brand Identity', 'Print Design', 'Digital Graphics'],
      linkText: 'ABOUT WEB DESIGN'
    },
    {
      num: '02',
      title: 'VIDEO EDITING',
      desc: 'Professional video editing and post-production services for all your content needs.',
      items: ['Color Grading', 'Motion Graphics', 'Sound Design', 'Visual Effects'],
      linkText: 'ABOUT WORKFLOW'
    },
    {
      num: '03',
      title: 'PHOTOGRAPHY',
      desc: 'Capturing moments and telling stories through professional photography services.',
      items: ['Portrait Photography', 'Event Coverage', 'Product Photography', 'Commercial Shoots'],
      linkText: 'ABOUT SEO'
    },
    {
      num: '04',
      title: 'CREATIVE DIRECTION',
      desc: 'Leading creative projects from concept to completion with strategic vision.',
      items: ['Creative Strategy', 'Project Management', 'Team Leadership', 'Brand Consulting'],
      linkText: 'ABOUT WEB DESIGN'
    }
  ];

  return (
    <section id="services" className="services container">
      <div className="services-grid">
        {servicesData.map((srv, index) => (
          <div className="service-card" key={index}>
            <span className="service-num">{srv.num}</span>
            <h3 className="service-title">{srv.title}</h3>
            <p className="service-desc">{srv.desc}</p>
            <ul className="service-list">
              {srv.items.map((item, i) => (
                <li key={i}><span className="dot-small"></span>{item}</li>
              ))}
            </ul>
            <a href="#" className="service-link">
              <span className="link-arrow">↗</span> {srv.linkText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
