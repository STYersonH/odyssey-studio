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
};

export default es;
export type Translations = typeof es;
