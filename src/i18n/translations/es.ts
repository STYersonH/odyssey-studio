// import type { AboutTagIconKey, ContactSocialPlatform } from '../types';

const es = {
  common: {},
  header: {
    brandAriaLabel: 'Andean Roots Initiative - Inicio',
    mobileMenuAriaLabel: 'Abrir navegación',
    navLinks: [
      { label: 'Home', slug: 'Home' },
      { label: 'Sobre nosotros', slug: 'About' },
      { label: 'Programas', slug: 'programs' },
      { label: 'Contacto', slug: 'contact' },
    ],
  },

  hero: {
    titleTop: 'Raíces andinas',
    titleBottom: 'que transforman el futuro',
    subheading:
      'Impulsamos educación, innovación y emprendimiento en comunidades andinas para generar oportunidades sostenibles y conectar el talento local con el mundo.',
    ctaText: 'SÉ UN ALIADO',
    ctaHref: '#impacto',
    scrollLabel: 'SCROLL DOWN',
    scrollAriaLabel: 'Desplazarse hacia abajo',
  },

  about: {
    heading: {
      line1: 'AYUDAMOS',
      line2: 'CON TU',
      line3: 'ODISEA.',
    },
    text: {
      paragraph1:
        'Todo proyecto comienza con un destino en mente. Ya sea que estés construyendo una marca de viajes, una experiencia hotelera o algo completamente nuevo, todo empieza con una visión.',
      paragraph2:
        'Nuestro rol es transformar esa visión en un viaje digital significativo —creado con estrategia, diseño y tecnología para ayudar a tu marca a avanzar con propósito.',
    },
  },

  slogan: {
    lines: ['TE HAREMOS', 'ESTAR MÁS', 'CERCA DE'],
    vision: 'TU VISIÓN',
  },

  work: {
    title: ['LAS', 'ODISEAS', 'QUE AYUDAMOS'],
    subtitle: 'NUESTRO TRABAJO',
    projects: [
      {
        number: '01',
        total: '05',
        title: 'OH Architecture',
        description:
          'Lorem ipsum dolor sit amet consectetur. Elementum scelerisque duis lacus sem vulputate at urna.',
        statNumber: '+10',
        statLabel: 'Nuevos proyectos',
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
        statLabel: 'Nuevos usuarios activos en la plataforma',
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
        statLabel: 'Nuevos murales en la ciudad',
        bgImage: '/images/work-mamots-bg.png',
        overlayImage: '/images/work-mamots-overlay.png',
        bgColor: '#F7EDEE',
      },
    ],
  },
};

export default es;
export type Translations = typeof es;
