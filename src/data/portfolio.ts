import type {
  ClientLogo,
  ContactChannel,
  GalleryCategoryTab,
  GalleryProject,
  NavItem,
  PosterWork,
  ReelSlide,
  ServiceItem,
  ShowcaseProject,
  SocialLink,
  StatMetric,
} from '../types/portfolio';

export const BRAND = {
  monogram: 'MR.THEVIYA',
  monogramLower: 'mr.theviya',
  fullName: 'Thevindu Gunathilaka',
  aliasName: 'Thevindu Thenura',
  tagline: 'Design Your Dreams',
  taglineLower: 'design your dreams',
  subTagline: "Let's create something beautiful together!",
  roleLine: 'Graphic Designer • Visual Editor • Web Designer',
  location: 'Colombo, Sri Lanka',
  availability: 'Available for Freelance & Retainers',
  email: 'thevinduthenura222@gmail.com',
  whatsappDirect: 'https://wa.me/94765728960',
  whatsappNumber: '+94 76 572 8960',
  whatsappChannel: 'https://whatsapp.com/channel/0029VaAMUWs0gcfO6GBcoW2R',
  driveSamples:
    'https://drive.google.com/drive/folders/1pMdzCWnv3ljObhXKVxFvt129z1yi8qtD?usp=sharing',
  creativeCv:
    'https://drive.google.com/file/d/1VMs2K_2sTYuE1bHOIu0oh7kyVv-n5Un0/view?usp=sharing',
  portfolioDoc:
    'https://drive.google.com/file/d/1IztQzGITX0lfl2_z-oYOGmefAx7Ta6DS/view?usp=drivesdk',
  behance: 'https://www.behance.net/mrtheviya1',
  linktreeBrand: 'https://linktr.ee/mr.theviya',
  linktreePersonal: 'https://linktr.ee/thevindu.thenura',
  hatchProfile: 'https://hatch.team/people/thevindu-gunathilaka',
  pinterest: 'https://www.pinterest.com/mrtheviya',
  tagLogo: '/images/clients/Mr%20Theviya%20Tag%402x%201.svg',
  profilePhoto: '/images/profile.png',
} as const;

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'archive', label: 'Archive' },
  { id: 'reel', label: 'Reel' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export const HERO_TAGS: string[] = [
  'GRAPHIC DESIGN',
  'VIDEOGRAPHY',
  'PHOTOGRAPHY',
  'WEB DESIGN',
];

export const HERO_STATS: StatMetric[] = [
  {
    id: 'experience',
    value: 5,
    suffix: '+',
    label: 'Years of Experience',
    sublabel: 'Domestic & international markets',
  },
  {
    id: 'projects',
    value: 120,
    suffix: '+',
    label: 'Projects Done',
    sublabel: 'Brand systems, edits & web UI',
  },
  {
    id: 'clients',
    value: 35,
    suffix: '+',
    label: 'Happy Clients',
    sublabel: 'Studios, campuses & global brands',
  },
];

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'brand-identity',
    title: 'Visual Identity & Monogram Systems',
    category: 'Graphic Design',
    year: '2026',
    client: 'Behance Selected Works',
    image: '/images/projects/graphic-design/brand-identity.jpg',
    href: BRAND.behance,
  },
  {
    id: 'cinematic-edits',
    title: 'Post-Production & Motion Samples',
    category: 'Videography',
    year: '2026',
    client: 'Google Drive Reel',
    image: '/images/projects/videography/color-suite.jpg',
    href: BRAND.driveSamples,
  },
  {
    id: 'editorial-photography',
    title: 'Commercial & Portrait Direction',
    category: 'Photography',
    year: '2026',
    client: 'Instagram Visuals',
    image: '/images/projects/photography/editorial-lens.jpg',
    href: 'https://www.instagram.com/mr.theviya',
  },
];

/* ==========================================================================
   4-CATEGORY PROJECT GALLERY (GSAP Flip + ScrollTrigger)
   Replace images inside public/images/projects/<category>/ anytime!
   ========================================================================== */

export const GALLERY_CATEGORIES: GalleryCategoryTab[] = [
  {
    id: 'all',
    label: 'All Works',
    countLabel: '12',
    tagline: 'complete curated portfolio across four creative disciplines',
  },
  {
    id: 'graphic-design',
    label: 'Graphic Design',
    countLabel: '03',
    tagline: 'logos, brand identities, stationery, packaging & campaign posters',
  },
  {
    id: 'videography',
    label: 'Videography',
    countLabel: '03',
    tagline: 'cinematic edits, color grading, concert aftermovies & vfx reels',
  },
  {
    id: 'photography',
    label: 'Photography',
    countLabel: '03',
    tagline: 'editorial portraits, commercial product shoots & studio lighting',
  },
  {
    id: 'web-design',
    label: 'Web Design',
    countLabel: '03',
    tagline: 'dark luxury interfaces, interactive portfolios & modern web ui',
  },
];

export const GALLERY_PROJECTS: GalleryProject[] = [
  // ---- GRAPHIC DESIGN (3) ----
  {
    id: 'gd-monolith',
    code: 'GD · 01',
    title: 'Obsidian Brand Identity',
    category: 'graphic-design',
    categoryLabel: 'Graphic Design',
    client: 'Luxury Monogram System',
    year: '2026',
    aspect: 'tall',
    image: '/images/projects/graphic-design/brand-identity.jpg',
    href: BRAND.behance,
    tools: ['Illustrator', 'Photoshop', 'Packaging'],
    summary:
      'Complete dark-luxury visual identity featuring custom mark construction, packaging system, and metallic print specifications.',
  },
  {
    id: 'gd-stationery',
    code: 'GD · 02',
    title: 'Noir Print & Brand Collateral',
    category: 'graphic-design',
    categoryLabel: 'Graphic Design',
    client: 'Corporate Rebrand',
    year: '2026',
    aspect: 'wide',
    image: '/images/projects/graphic-design/stationery-suite.jpg',
    href: BRAND.behance,
    tools: ['Brand Book', 'Print Design', 'Typography'],
    summary:
      'Tactile matte-black stationery suite, embossed business cards, and red-edged brand guidelines designed for unmistakable presence.',
  },
  {
    id: 'gd-emblem',
    code: 'GD · 03',
    title: 'Sculpted Emblem & Key Visual',
    category: 'graphic-design',
    categoryLabel: 'Graphic Design',
    client: 'Campaign Identity',
    year: '2025',
    aspect: 'square',
    image: '/images/projects/graphic-design/monolith-emblem.jpg',
    href: BRAND.pinterest,
    tools: ['Logo Craft', '3D Mockup', 'Art Direction'],
    summary:
      'Translucent smoked-glass emblem study built for bold digital launch posters, social media headers, and event stage visuals.',
  },

  // ---- VIDEOGRAPHY (3) ----
  {
    id: 'vd-color-suite',
    code: 'VD · 01',
    title: 'Chromatic Color Grading Suite',
    category: 'videography',
    categoryLabel: 'Videography',
    client: 'Commercial Post-Production',
    year: '2026',
    aspect: 'tall',
    image: '/images/projects/videography/color-suite.jpg',
    href: BRAND.driveSamples,
    tools: ['DaVinci Resolve', 'Premiere Pro', 'Sound Design'],
    summary:
      'Moody crimson-amber commercial film grading with rhythmic cuts, layered foley, and stylized motion graphics.',
  },
  {
    id: 'vd-concert-vfx',
    code: 'VD · 02',
    title: 'Live Stage & Concert Aftermovie',
    category: 'videography',
    categoryLabel: 'Videography',
    client: 'ROAR & Campus Media',
    year: '2026',
    aspect: 'square',
    image: '/images/projects/videography/concert-vfx.jpg',
    href: BRAND.driveSamples,
    tools: ['After Effects', 'Anamorphic VFX', 'Event Cut'],
    summary:
      'High-impact live showreel capturing stage lighting, crowd energy, speed-ramps, and cinematic volumetric transitions.',
  },
  {
    id: 'vd-audio-visual',
    code: 'VD · 03',
    title: 'Sonic Visualizer & Promo Reel',
    category: 'videography',
    categoryLabel: 'Videography',
    client: 'SL Visualizer',
    year: '2025',
    aspect: 'wide',
    image: '/images/projects/videography/sonic-reel.jpg',
    href: 'http://youtube.com/@slvisualizer',
    tools: ['Motion Graphics', 'Audio Sync', '3D Camera'],
    summary:
      'Music-driven visual promos and beat-synced motion cuts produced for artists, podcasts, and digital launch campaigns.',
  },

  // ---- PHOTOGRAPHY (3) ----
  {
    id: 'ph-editorial-lens',
    code: 'PH · 01',
    title: 'Chiaroscuro Studio Portrait',
    category: 'photography',
    categoryLabel: 'Photography',
    client: 'Editorial Series',
    year: '2026',
    aspect: 'tall',
    image: '/images/projects/photography/editorial-lens.jpg',
    href: 'https://www.instagram.com/mr.theviya',
    tools: ['Cinema Prime', 'Lightroom', 'Studio Strobe'],
    summary:
      'Dramatic shadow-play portrait photography shaped with hard Venetian light beams and warm crimson color gel accents.',
  },
  {
    id: 'ph-watch-product',
    code: 'PH · 02',
    title: 'Nocturne Luxury Product Shoot',
    category: 'photography',
    categoryLabel: 'Photography',
    client: 'Commercial Product',
    year: '2026',
    aspect: 'wide',
    image: '/images/projects/photography/product-watch.jpg',
    href: BRAND.behance,
    tools: ['Macro Lens', 'Retouching', 'Lighting'],
    summary:
      'Precision macro product photography crafted on wet volcanic stone with controlled specular rim lighting for luxury campaigns.',
  },
  {
    id: 'ph-automotive',
    code: 'PH · 03',
    title: 'Midnight Automotive Campaign',
    category: 'photography',
    categoryLabel: 'Photography',
    client: 'Editorial Lookbook',
    year: '2025',
    aspect: 'square',
    image: '/images/projects/photography/automotive-campaign.jpg',
    href: 'https://www.instagram.com/mr.theviya',
    tools: ['Location Shoot', 'Color Grade', 'Direction'],
    summary:
      'Moody automotive and fashion lookbook frames shot under directional tungsten and crimson studio spill.',
  },

  // ---- WEB DESIGN (3) ----
  {
    id: 'wd-agency-site',
    code: 'WD · 01',
    title: 'Dark Editorial Agency Platform',
    category: 'web-design',
    categoryLabel: 'Web Design',
    client: 'Creative Studio UI',
    year: '2026',
    aspect: 'wide',
    image: '/images/projects/web-design/agency-web.jpg',
    href: BRAND.behance,
    tools: ['Figma', 'TypeScript', 'GSAP Motion'],
    summary:
      'Full dark-mode agency website built around bold Swiss editorial grids, liquid glass panels, and scroll-driven micro-interactions.',
  },
  {
    id: 'wd-glass-dashboard',
    code: 'WD · 02',
    title: 'Frosted Glass Analytics UI',
    category: 'web-design',
    categoryLabel: 'Web Design',
    client: 'Interactive Web App',
    year: '2026',
    aspect: 'square',
    image: '/images/projects/web-design/glass-dashboard.jpg',
    href: BRAND.behance,
    tools: ['UI/UX Systems', 'React', 'Design Tokens'],
    summary:
      'Layered dark-glass web application interface with high-contrast telemetry curves, spatial depth, and accessible dark color tokens.',
  },
  {
    id: 'wd-responsive-suite',
    code: 'WD · 03',
    title: 'Responsive Portfolio Experience',
    category: 'web-design',
    categoryLabel: 'Web Design',
    client: 'Multi-Device Showcase',
    year: '2026',
    aspect: 'tall',
    image: '/images/projects/web-design/responsive-ui.jpg',
    href: BRAND.behance,
    tools: ['Responsive UI', 'Prototyping', 'Vite + TS'],
    summary:
      'Seamless desktop-to-mobile interactive brand flagship crafted with kinetic typography, 3D showcases, and smooth scroll physics.',
  },
];

/* 5-Card Interactive 3D Fanned Poster Deck */
export const POSTER_DECK_WORKS: PosterWork[] = [
  {
    id: 'monolith-identity',
    code: 'ARCH · 01',
    title: 'obsidian brand dna',
    subtitle: 'Luxury Identity & Packaging',
    category: 'Brand Identity',
    client: 'Identity System',
    year: '2026',
    image: '/images/projects/graphic-design/monolith-emblem.jpg',
    href: BRAND.behance,
    tags: ['Logo System', '3D Mockup', 'Guidelines'],
    description:
      'High-contrast dark luxury brand system engineered for sculptural presence across print, packaging, and digital surfaces.',
  },
  {
    id: 'color-grading-reel',
    code: 'ARCH · 02',
    title: 'chromatic cut',
    subtitle: 'Post-Production & Color Grading',
    category: 'Video & VFX',
    client: 'Video Samples Archive',
    year: '2026',
    image: '/images/projects/videography/color-suite.jpg',
    href: BRAND.driveSamples,
    tags: ['Color Grade', 'Sound Design', 'VFX'],
    description:
      'Atmospheric commercial & event edits combining rhythmic pacing, stylized crimson-amber grading, and crisp motion typography.',
  },
  {
    id: 'built-to-move',
    code: 'ARCH · 03',
    title: 'nocturne campaign',
    subtitle: 'Editorial Art Direction & Poster',
    category: 'Campaign',
    client: 'Mr. Theviya Studio',
    year: '2026',
    image: '/images/projects/photography/automotive-campaign.jpg',
    href: BRAND.behance,
    tags: ['Key Visual', 'Poster Series', 'Typography'],
    description:
      'Bold automotive & fashion campaign poster series crafted with dramatic studio lighting, sharp editorial grids, and fearless composition.',
  },
  {
    id: 'viewfinder-live',
    code: 'ARCH · 04',
    title: 'frame the moment',
    subtitle: 'Live Event & Concert Visuals',
    category: 'Video & VFX',
    client: 'ROAR & Campus Media',
    year: '2025',
    image: '/images/projects/videography/concert-vfx.jpg',
    href: BRAND.driveSamples,
    tags: ['Aftermovie', 'Anamorphic Grade', 'Direction'],
    description:
      'High-energy live coverage and cinematic visual storytelling designed for major university showcases and broadcast media.',
  },
  {
    id: 'sonic-direction',
    code: 'ARCH · 05',
    title: 'crimson acoustics',
    subtitle: 'Product & Art Direction',
    category: 'Art Direction',
    client: 'Commercial Concept',
    year: '2025',
    image: '/images/projects/videography/sonic-reel.jpg',
    href: BRAND.pinterest,
    tags: ['Art Direction', 'Product Visual', 'Social Kit'],
    description:
      'Minimalist product storytelling built around sculptural negative space, warm metallic textures, and unmistakable shelf impact.',
  },
];

/* 5-Frame 3D Vertical Perspective Depth Reel */
export const PERSPECTIVE_REEL: ReelSlide[] = [
  {
    id: 'reel-01',
    num: '01',
    title: 'BRAND SYSTEMS',
    subtitle: 'identity & monogram craft',
    discipline: 'GRAPHIC DESIGN',
    metaLines: ['LOGOS', 'SYSTEMS', 'TYPOGRAPHY', 'PRINT'],
    image: '/images/projects/graphic-design/brand-identity.jpg',
    href: BRAND.behance,
  },
  {
    id: 'reel-02',
    num: '02',
    title: 'MOTION SUITE',
    subtitle: 'color grading & post-production',
    discipline: 'VIDEOGRAPHY',
    metaLines: ['RHYTHM', 'COLOR', 'SOUND', 'VFX'],
    image: '/images/projects/videography/color-suite.jpg',
    href: BRAND.driveSamples,
  },
  {
    id: 'reel-03',
    num: '03',
    title: 'VISUAL CULTURE',
    subtitle: 'framing stories that stay',
    discipline: 'CREATIVE DIRECTION',
    metaLines: ['PEOPLE', 'PLACES', 'STORIES', 'STYLE'],
    image: '/images/projects/videography/concert-vfx.jpg',
    href: BRAND.driveSamples,
  },
  {
    id: 'reel-04',
    num: '04',
    title: 'SHADOW & LIGHT',
    subtitle: 'commercial & portrait lens',
    discipline: 'PHOTOGRAPHY',
    metaLines: ['PORTRAIT', 'EVENTS', 'PRODUCT', 'STUDIO'],
    image: '/images/projects/photography/editorial-lens.jpg',
    href: 'https://www.instagram.com/mr.theviya',
  },
  {
    id: 'reel-05',
    num: '05',
    title: 'WEB INTERFACES',
    subtitle: 'dark luxury digital craft',
    discipline: 'WEB DESIGN',
    metaLines: ['FIGMA', 'UI/UX', 'MOTION', 'LAUNCH'],
    image: '/images/projects/web-design/agency-web.jpg',
    href: BRAND.behance,
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'graphic-design',
    num: '01',
    badge: 'BRAND CORE',
    title: 'Graphic Design',
    shortTitle: 'Graphic Design',
    description:
      'Creating visual identities, logos, and brand materials that make lasting impressions across every platform.',
    deliverables: ['Logo Design', 'Brand Identity', 'Print Design', 'Digital Graphics'],
    image: '/images/projects/graphic-design/brand-identity.jpg',
    ctaLabel: 'Discuss Graphic Design',
  },
  {
    id: 'video-editing',
    num: '02',
    badge: 'VISUAL MOTION',
    title: 'Videography & Editing',
    shortTitle: 'Videography',
    description:
      'Professional video editing and post-production crafted for pacing, color mood, and visual punch.',
    deliverables: ['Color Grading', 'Motion Graphics', 'Sound Design', 'Visual Effects'],
    image: '/images/projects/videography/color-suite.jpg',
    ctaLabel: 'Discuss Videography',
    featured: true,
  },
  {
    id: 'photography',
    num: '03',
    badge: 'EDITORIAL LENS',
    title: 'Photography',
    shortTitle: 'Photography',
    description:
      'Capturing moments and telling stories through purposeful lighting, framing, and editorial composition.',
    deliverables: ['Portrait Photography', 'Event Coverage', 'Product Photography', 'Commercial Shoots'],
    image: '/images/projects/photography/editorial-lens.jpg',
    ctaLabel: 'Discuss Photography',
  },
  {
    id: 'web-design',
    num: '04',
    badge: 'DIGITAL UI',
    title: 'Web Design & Direction',
    shortTitle: 'Web Design',
    description:
      'Designing dark-luxury interactive websites, UI systems, and creative direction from concept to launch.',
    deliverables: ['UI/UX Design', 'Interactive Web', 'Creative Strategy', 'Brand Consulting'],
    image: '/images/projects/web-design/agency-web.jpg',
    ctaLabel: 'Discuss Web Design',
  },
];

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Royal College', img: '/images/clients/Royal%20Logo.svg' },
  { name: 'COSMOS', img: '/images/clients/Cosmos%20logo.svg' },
  { name: 'Rupavahini', img: '/images/clients/rupavahini%20logo.svg' },
  { name: 'ROAR 2026', img: '/images/clients/ROAR%20Logo%2026.svg' },
  { name: 'SSC', img: '/images/clients/SSC%20Logo.svg' },
  { name: 'SLIIT UNI', img: '/images/clients/SLIIT-UNI-LOGOwhite%201.svg' },
  { name: 'Kalaavata', img: '/images/clients/kalaawata%20logo.svg' },
  { name: 'A.A. Samarasinghe', img: '/images/clients/AASamarasinha%20Logo.svg' },
  { name: 'C2 District', img: '/images/clients/C2%20District%20Logo.svg' },
];

export const SKILLS: string[] = [
  'Logo Design',
  'Brand Identity',
  'Videography',
  'Color Grading',
  'Motion Graphics',
  'Photography',
  'Web Design',
  'Creative Direction',
];

export const SERVICE_PILLS: string[] = [
  'Graphic Design',
  'Brand Identity',
  'Videography',
  'Photography',
  'Web Design',
  'Creative Direction',
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    code: 'WA',
    label: 'WhatsApp Direct',
    value: '+94 76 572 8960',
    href: BRAND.whatsappDirect,
  },
  {
    code: 'CH',
    label: 'WhatsApp Channel',
    value: 'Mr.Theviya Updates',
    href: BRAND.whatsappChannel,
  },
  {
    code: 'IG',
    label: 'Instagram',
    value: '@mr.theviya',
    href: 'https://www.instagram.com/mr.theviya',
  },
  {
    code: 'IN',
    label: 'LinkedIn',
    value: 'Thevindu Gunathilaka',
    href: 'https://www.linkedin.com/in/thevindu-thenura',
  },
  {
    code: 'FV',
    label: 'Fiverr',
    value: 'Quick project turnaround',
    href: 'https://www.fiverr.com/pe/WL39d7',
  },
  {
    code: 'UW',
    label: 'UpWork',
    value: 'Freelance contracts',
    href: 'https://www.upwork.com/freelancers/~018169c21ea3d09e71',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Behance', handle: 'mrtheviya1', abbr: 'BE', href: BRAND.behance, group: 'work' },
  { label: 'Drive Samples', handle: 'Video & Design', abbr: 'GD', href: BRAND.driveSamples, group: 'work' },
  { label: 'Creative CV', handle: 'PDF Resume', abbr: 'CV', href: BRAND.creativeCv, group: 'work' },
  { label: 'Fiverr', handle: 'Mr.Theviya', abbr: 'FV', href: 'https://www.fiverr.com/pe/WL39d7', group: 'work' },
  {
    label: 'UpWork',
    handle: 'Thevindu G.',
    abbr: 'UW',
    href: 'https://www.upwork.com/freelancers/~018169c21ea3d09e71',
    group: 'work',
  },
  { label: 'Hatch.team', handle: 'Thevindu G.', abbr: 'HT', href: BRAND.hatchProfile, group: 'work' },
  { label: 'Instagram', handle: '@mr.theviya', abbr: 'IG', href: 'https://www.instagram.com/mr.theviya', group: 'brand' },
  { label: 'TikTok', handle: '@mr.theviya', abbr: 'TK', href: 'https://www.tiktok.com/@mr.theviya', group: 'brand' },
  { label: 'Pinterest', handle: '@mrtheviya', abbr: 'PI', href: BRAND.pinterest, group: 'brand' },
  { label: 'Facebook', handle: 'mr.theviya', abbr: 'FB', href: 'https://www.facebook.com/mr.theviya', group: 'brand' },
  { label: 'YouTube', handle: '@slvisualizer', abbr: 'YT', href: 'http://youtube.com/@slvisualizer', group: 'brand' },
  { label: 'LinkedIn', handle: 'thevindu-thenura', abbr: 'IN', href: 'https://www.linkedin.com/in/thevindu-thenura', group: 'personal' },
  { label: 'X / Twitter', handle: '@thevi____', abbr: 'X', href: 'https://x.com/thevi____', group: 'personal' },
  { label: 'Snapchat', handle: '@thevindut', abbr: 'SC', href: 'https://www.snapchat.com/add/thevindut', group: 'personal' },
  { label: 'Linktree Brand', handle: 'linktr.ee/mr.theviya', abbr: 'LT', href: BRAND.linktreeBrand, group: 'brand' },
  { label: 'Linktree Personal', handle: 'thevindu.thenura', abbr: 'LP', href: BRAND.linktreePersonal, group: 'personal' },
];
