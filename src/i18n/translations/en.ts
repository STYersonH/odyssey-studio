import type { Translations } from './es';

const en: Translations = {
  common: {},
  header: {
    brandAriaLabel: 'Odyssey - Home',
    mobileMenuAriaLabel: 'Open navigation',
    cta: 'Start a project',
    ctaCompact: 'Start a project',
    menu: 'Menu',
    navLinks: [
      { label: 'About', slug: 'about' },
      { label: 'Work', slug: 'work' },
      { label: 'Services', slug: 'services' },
      { label: 'Process', slug: 'process' },
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
        description:
          'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+10',
        statLabel: 'New projects',
        bgImage: '/images/work-oh-arch-bg.png',
        overlayImage: '/images/work-oh-arch-overlay.png',
        bgColor: '#D2CDC6',
      },
      {
        number: '02',
        total: '05',
        title: 'SUPERSOLID',
        description:
          'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+2000',
        statLabel: 'New users actively in the platform',
        bgImage: '/images/work-supersolid-bg.png',
        overlayImage: '/images/work-supersolid-overlay.png',
        bgColor: '#D5E1D8',
      },
      {
        number: '03',
        total: '05',
        title: 'MAMOTS MURALS',
        description:
          'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+18',
        statLabel: 'New murals in the city',
        bgImage: '/images/work-mamots-bg.png',
        overlayImage: '/images/work-mamots-overlay.png',
        bgColor: '#E1D9D0',
      },
    ],
  },

  services: {
    title: ['WE CAN', 'HELP WITH'],
    subtitle: 'OUR SERVICES',
    defaultActive: 1,
    items: [
      {
        title: 'Website Strategy',
        description:
          'We map goals, audience, and journey so every page has a clear job to do.',
        images: ['/images/work-oh-arch-bg.png', '/images/work-oh-arch-overlay.png'],
      },
      {
        title: 'UX/UI Design',
        description:
          'Interfaces that feel effortless — researched, structured, and polished for conversion.',
        images: ['/images/services-preview-a.png', '/images/services-preview-b.png'],
      },
      {
        title: 'Website Design',
        description:
          'Visual systems and layouts that carry your brand with clarity and presence.',
        images: ['/images/work-supersolid-bg.png', '/images/work-supersolid-overlay.png'],
      },
      {
        title: 'Website Development',
        description:
          'Fast, accessible builds engineered to scale — from launch to long-term growth.',
        images: ['/images/work-mamots-bg.png', '/images/work-mamots-overlay.png'],
      },
      {
        title: 'Booking & Commerce',
        description:
          'Flows that turn interest into bookings and sales without friction.',
        images: ['/images/services-preview-b.png', '/images/services-preview-a.png'],
      },
    ],
  },
};

export default en;
