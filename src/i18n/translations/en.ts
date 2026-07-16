import type { Translations } from './es';

const en: Translations = {
  common: {},
  header: {
    brandAriaLabel: 'Andean Roots Initiative - Home',
    mobileMenuAriaLabel: 'Open navigation',
    navLinks: [
      { label: 'Home', slug: 'Home' },
      { label: 'About Us', slug: 'About' },
      { label: 'Programs', slug: 'programs' },
      { label: 'Contact', slug: 'contact' },
    ],
  },

  hero: {
    titleTop: 'Andean roots',
    titleBottom: 'that transform the future',
    subheading:
      'We drive education, innovation and entrepreneurship in Andean communities to generate sustainable opportunities and connect local talent with the world.',
    ctaText: 'BE AN ALLY',
    ctaHref: '#impacto',
    scrollLabel: 'SCROLL DOWN',
    scrollAriaLabel: 'Scroll down',
  },

  about: {
    heading: {
      line1: 'WE HELP',
      line2: 'WITH YOUR',
      line3: 'ODYSSEY.',
    },
    text: {
      paragraph1:
        "Every project begins with a destination in mind. Whether you're building a travel brand, a hospitality experience, or something entirely new, it starts with a vision.",
      paragraph2:
        'Our role is to transform that vision into a meaningful digital journey—crafted with strategy, design, and technology to help your brand move forward with purpose.',
    },
  },

  slogan: {
    lines: ['WE  WILL', 'MAKE  YOU', 'CLOSER  TO'],
    vision: 'YOUR VISION',
  },

  work: {
    title: ['THE', 'ODYSSEYS', 'WE HELPED'],
    subtitle: 'OUR WORK',
    projects: [
      {
        number: '01',
        total: '05',
        title: 'OH Architecture',
        description: 'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+10',
        statLabel: 'New projects',
        bgImage: '/images/work-oh-arch-bg.png',
        overlayImage: '/images/work-oh-arch-overlay.png',
      },
      {
        number: '02',
        total: '05',
        title: 'SUPERSOLID',
        description: 'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+2000',
        statLabel: 'New users actively in the platform',
        bgImage: '/images/work-supersolid-bg.png',
        overlayImage: '/images/work-supersolid-overlay.png',
      },
      {
        number: '03',
        total: '05',
        title: 'MAMOTS MURALS',
        description: 'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+18',
        statLabel: 'New murals in the city',
        bgImage: '/images/work-mamots-bg.png',
        overlayImage: '/images/work-mamots-overlay.png',
      },
    ],
  },
};

export default en;
