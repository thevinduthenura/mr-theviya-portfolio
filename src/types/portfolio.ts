export type SectionId =
  | 'home'
  | 'projects'
  | 'gallery'
  | 'archive'
  | 'reel'
  | 'services'
  | 'about'
  | 'contact';

export type GalleryCategoryId =
  | 'all'
  | 'graphic-design'
  | 'videography'
  | 'photography'
  | 'web-design';

export interface GalleryCategoryTab {
  id: GalleryCategoryId;
  label: string;
  countLabel: string;
  tagline: string;
}

export interface GalleryProject {
  id: string;
  code: string;
  title: string;
  category: Exclude<GalleryCategoryId, 'all'>;
  categoryLabel: string;
  client: string;
  year: string;
  aspect: 'wide' | 'tall' | 'square';
  image: string;
  href: string;
  tools: string[];
  summary: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface StatMetric {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  category: string;
  year: string;
  client: string;
  image: string;
  href: string;
}

export interface PosterWork {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'Brand Identity' | 'Campaign' | 'Video & VFX' | 'Art Direction';
  client: string;
  year: string;
  image: string;
  href: string;
  tags: string[];
  description: string;
}

export interface ReelSlide {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  discipline: string;
  metaLines: string[];
  image: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  num: string;
  badge: string;
  title: string;
  shortTitle: string;
  description: string;
  deliverables: string[];
  image: string;
  ctaLabel: string;
  featured?: boolean;
}

export interface ClientLogo {
  name: string;
  img: string;
}

export interface SocialLink {
  label: string;
  handle: string;
  abbr: string;
  href: string;
  group: 'brand' | 'personal' | 'work';
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  code: string;
}

export interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  message: string;
}
