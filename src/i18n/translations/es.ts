// import type { AboutTagIconKey, ContactSocialPlatform } from '../types';

const es = {
  common: {},
  header: {
    brandAriaLabel: 'Odyssey - Inicio',
    mobileMenuAriaLabel: 'Abrir navegación',
    closeAriaLabel: 'Cerrar navegación',
    langSwitchLabel: 'EN',
    langSwitchAriaLabel: 'Cambiar a inglés',
    cta: 'Hablemos hoy ',
    navLinks: [
      { label: 'Sobre nosotros', slug: 'about' },
      { label: 'Proyectos', slug: 'work' },
      { label: 'Servicios', slug: 'services' },
      { label: 'Proceso', slug: 'process' },
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
    title: ['ODISEAS', 'EN LAS QUE', 'AYUDAMOS'],
    subtitle: 'NUESTROS PROYECTOS',
    subtitleDesktop: 'PROYECTOS',
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

  services: {
    title: ['PODEMOS', 'AYUDARTE'],
    subtitle: 'NUESTROS SERVICIOS',
    subtitleDesktop: 'SERVICIOS',
    defaultActive: 1,
    items: [
      {
        title: 'Estrategia web',
        description:
          'Definimos objetivos, audiencia y recorrido para que cada página tenga un propósito claro.',
        images: ['/images/work-oh-arch-bg.png', '/images/work-oh-arch-overlay.png'],
      },
      {
        title: 'Diseño UX/UI',
        description:
          'Interfaces que se sienten naturales — investigadas, estructuradas y pensadas para convertir.',
        images: ['/images/services-preview-a.png', '/images/services-preview-b.png'],
      },
      {
        title: 'Diseño web',
        description:
          'Sistemas visuales y layouts que llevan tu marca con claridad y presencia.',
        images: ['/images/work-supersolid-bg.png', '/images/work-supersolid-overlay.png'],
      },
      {
        title: 'Desarrollo web',
        description:
          'Construcciones rápidas y accesibles, listas para escalar desde el lanzamiento.',
        images: ['/images/work-mamots-bg.png', '/images/work-mamots-overlay.png'],
      },
      {
        title: 'Reservas & Commerce',
        description:
          'Flujos que convierten el interés en reservas y ventas sin fricción.',
        images: ['/images/services-preview-b.png', '/images/services-preview-a.png'],
      },
    ],
  },

  process: {
    title: ['LO QUE', 'HACEMOS'],
    titleMobile: ['LO', 'QUE', 'HACEMOS'],
    subtitle: 'NUESTRO PROCESO',
    subtitleDesktop: 'NUESTRO PROCESO',
    heroImage: '/images/process-notebook.png',
    heroImageAlt: 'Mano escribiendo ideas en un cuaderno',
    steps: [
      {
        number: '01',
        title: 'Descubrimos tu historia',
        description:
          'Profundizamos en tu marca, sacamos a la luz lo que te hace irreemplazable y lo convertimos en un posicionamiento nítido y una estrategia web que conecta en segundos.',
        image: '/images/process-step-01-b.png',
        imageAlt: 'Vista previa de marca en dispositivo',
      },
      {
        number: '02',
        title: 'Damos forma a tu presencia digital',
        description:
          'Con la narrativa definida, diseñamos y dirigimos una marca y un sitio que se sienten premium, transmiten credibilidad y dan a tu audiencia una razón clara para acercarse y actuar.',
        image: '/images/process-step-01-a.png',
        imageAlt: 'Vista previa de presencia digital',
      },
      {
        number: '03',
        title: 'Lo lanzamos al mundo',
        description:
          'Tu marca y tu sitio salen al aire como un activo a largo plazo que convierte atención en oportunidad, atrae a los clientes para los que estás hecho y crece contigo.',
        image: '/images/services-preview-b.png',
        imageAlt: 'Vista previa de marca en vivo',
      },
    ],
  },

  footer: {
    headline: ['AYUDAMOS', 'CON', 'TU', 'ODISEA.'],
    location: 'Con base en Cusco, Perú',
    navigationLabel: '(Navegación)',
    nav: [
      { label: 'Nosotros', href: '#about' },
      { label: 'Proyectos', href: '#work' },
      { label: 'Proceso', href: '#process' },
      { label: 'Servicios', href: '#services' },
      { label: 'Contacto', href: 'mailto:info@byodysseystudio.com' },
    ],
    infoLabel: '(Info)',
    email: 'info@byodysseystudio.com',
    phone: '+51 927 829 352',
    phoneHref: 'tel:+51927829352',
    socialsLabel: '(Redes)',
    socials: [
      { label: 'Linkedin', href: 'https://www.linkedin.com' },
      { label: 'Instagram', href: 'https://www.instagram.com' },
      { label: 'Facebook', href: 'https://www.facebook.com' },
      { label: 'Whatsapp', href: 'https://wa.me/51927829352' },
    ],
    terms: 'Términos de servicio',
    privacy: 'Política de privacidad',
    copyright: '© 2026 Odyssey Agency',
    backToTop: 'Volver arriba',
  },
};

export default es;
export type Translations = typeof es;
