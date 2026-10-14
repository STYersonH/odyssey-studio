import type { Translations } from './es';

const en: Translations = {
  common: {},
  header: {
    brandAriaLabel: 'Odyssey - Home',
    mobileMenuAriaLabel: 'Open navigation',
    closeAriaLabel: 'Close navigation',
    langSwitchLabel: 'ES',
    langSwitchAriaLabel: 'Switch to Spanish',
    cta: 'Start a project',
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
    paragraph1:
      'We craft premium websites and digital experiences for ambitious brands and businesses.',
    paragraph2:
      'For businesses that need a digital presence as remarkable as the work they do.',
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
    subtitleDesktop: 'OUR WORK',
    projects: [
      {
        number: '01',
        total: '02',
        title: 'Andean Republic',
        description:
          'A marketplace of textiles, superfoods, and experiences that preserves the essence of the Andes and connects the world with its cultural richness.',
        statNumber: '03',
        statLabel: 'Andean universes',
        bgImage: '/images/work/andean-republic-bg.png',
        overlayImage: '/images/work/andean-republic.png',
        bgColor: '#C9C4BC',
      },
      {
        number: '02',
        total: '02',
        title: 'Andean Roots Initiative',
        description:
          'We drive education, innovation, and entrepreneurship in Andean communities to create sustainable opportunities.',
        statNumber: 'Greater',
        statLabel: 'Visibility for the organization',
        bgImage: '/images/work/andean-roots-bg.png',
        overlayImage: '/images/work/andean-roots.png',
        bgColor: '#D4D0C8',
      },
    ],
  },

  services: {
    title: ['WE CAN', 'HELP WITH'],
    subtitle: 'OUR SERVICES',
    subtitleDesktop: 'OUR SERVICES',
    defaultActive: 2,
    items: [
      {
        title: 'Website Design',
        description:
          'Visual systems and layouts that carry your brand with clarity and presence.',
        images: ['/images/services/website-design-1.png', '/images/services/website-design-2.png'],
      },
      {
        title: 'Website Development',
        description:
          'Fast, accessible builds engineered to scale — from launch to long-term growth.',
        images: ['/images/services/website-development-1.png', '/images/services/website-development-2.png'],
      },
      {
        title: 'UX/UI Design',
        description:
          'Interfaces that feel effortless — researched, structured, and polished for conversion.',
        images: ['/images/services/uxui-design-1.png', '/images/services/uxui-design-2.png'],
      },
      {
        title: 'Reservas',
        description:
          'Booking flows that turn interest into reservations without friction.',
        images: ['/images/services/reservas-1.png', '/images/services/reservas-2.png'],
      },
      {
        title: 'E-commerce',
        description:
          'Storefronts that turn interest into sales without friction.',
        images: ['/images/services/ecommerce-1.png', '/images/services/ecommerce-2.png'],
      },
    ],
  },

  process: {
    title: ['THE WORK', 'THAT WE DO'],
    titleMobile: ['THE', 'WORK THAT', 'WE DO'],
    subtitle: 'OUR PROCESS',
    subtitleDesktop: 'OUR PROCESS',
    heroImage: '/images/process-notebook.png',
    heroImageAlt: 'Hand writing ideas in a notebook',
    steps: [
      {
        number: '01',
        title: 'We uncover your story',
        description:
          'We dig deep into your brand, surface what makes you irreplaceable, and shape it into sharp positioning and a website strategy that connects in seconds.',
        image: '/images/process-step-01-b.png',
        imageAlt: 'Brand preview on a device',
      },
      {
        number: '02',
        title: 'We shape your digital presence',
        description:
          'With your narrative locked, we design and direct a brand and website that feels premium, signals credibility, and gives your audience one clear reason to lean in and act.',
        image: '/images/process-step-01-a.png',
        imageAlt: 'Digital presence preview',
      },
      {
        number: '03',
        title: 'We send it into the world',
        description:
          "Your brand and website goes live as a long-term asset that turns attention into opportunity, attracts the clients you're built for, and grows with you.",
        image: '/images/services-preview-b.png',
        imageAlt: 'Live brand preview',
      },
    ],
  },

  footer: {
    headline: ['WE HELP', 'WITH', 'YOUR', 'ODYSSEY.'],
    location: 'Based in Cusco, Perú',
    navigationLabel: '(Navigation)',
    nav: [
      { label: 'About', href: '#about' },
      { label: 'Work', href: '#work' },
      { label: 'Process', href: '#process' },
      { label: 'Services', href: '#services' },
      { label: 'Contact', href: 'mailto:info@byodysseystudio.com' },
    ],
    infoLabel: '(Info)',
    email: 'info@byodysseystudio.com',
    phone: '+51 927 829 352',
    phoneHref: 'tel:+51927829352',
    socialsLabel: '(Socials)',
    socials: [
      { label: 'Linkedin', href: 'https://www.linkedin.com' },
      { label: 'Instagram', href: 'https://www.instagram.com' },
      { label: 'Facebook', href: 'https://www.facebook.com' },
      { label: 'Whatsapp', href: 'https://wa.me/51927829352' },
    ],
    terms: 'Terms of service',
    privacy: 'Privacy policy',
    copyright: '© 2026 Odyssey Agency',
    backToTop: 'Back to top',
  },
};

export default en;
