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
};

export default en;
