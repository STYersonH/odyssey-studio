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
};

export default es;
export type Translations = typeof es;
