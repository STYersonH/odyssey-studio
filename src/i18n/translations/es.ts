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
    paragraph1:
      'Creamos sitios web premium y experiencias digitales para marcas y negocios ambiciosos.',
    paragraph2:
      'Para negocios que necesitan una presencia digital tan notable como el trabajo que realizan.',
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
        'Todo proyecto comienza con un destino en mente. Ya sea que estés construyendo una marca, lanzando un negocio nuevo o explorando algo completamente distinto, todo empieza con una visión.',
      paragraph2:
        'Nuestro rol es convertir esa visión en un viaje digital significativo — moldeado por la estrategia, el diseño y la tecnología para hacer avanzar tu marca con propósito.',
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
        total: '02',
        title: 'Andean Republic',
        href: 'https://andeanrepublic.com/',
        description:
          'Un marketplace de textiles, superfoods y experiencias que conserva la esencia de los Andes y conecta al mundo con su riqueza cultural.',
        statNumber: '03',
        statLabel: 'Universos andinos',
        bgImage: '/images/work/andean-republic-bg.png',
        overlayImage: '/images/work/andean-republic.png',
        bgColor: '#C9C4BC',
      },
      {
        number: '02',
        total: '02',
        title: 'Andean Roots Initiative',
        href: 'https://roots.andeanrepublic.com/es/Home',
        description:
          'Impulsamos educación, innovación y emprendimiento en comunidades andinas para generar oportunidades sostenibles.',
        statNumber: 'Mayor',
        statLabel: 'Visibilidad para la organización',
        bgImage: '/images/work/andean-roots-bg.png',
        overlayImage: '/images/work/andean-roots.png',
        bgColor: '#D4D0C8',
      },
    ],
  },

  services: {
    title: ['PODEMOS', 'AYUDARTE'],
    subtitle: 'NUESTROS SERVICIOS',
    subtitleDesktop: 'SERVICIOS',
    defaultActive: 2,
    items: [
      {
        title: 'Diseño web',
        description:
          'Sistemas visuales y layouts que llevan tu marca con claridad y presencia.',
        images: ['/images/services/website-design-1.png', '/images/services/website-design-2.png'],
      },
      {
        title: 'Desarrollo web',
        description:
          'Construcciones rápidas y accesibles, listas para escalar desde el lanzamiento.',
        images: ['/images/services/website-development-1.png', '/images/services/website-development-2.png'],
      },
      {
        title: 'Diseño UX/UI',
        description:
          'Interfaces que se sienten naturales — investigadas, estructuradas y pensadas para convertir.',
        images: ['/images/services/uxui-design-1.png', '/images/services/uxui-design-2.png'],
      },
      {
        title: 'Reservas',
        description:
          'Flujos de reserva que convierten el interés en citas y estancias sin fricción.',
        images: ['/images/services/reservas-1.png', '/images/services/reservas-2.png'],
      },
      {
        title: 'E-commerce',
        description:
          'Tiendas que convierten el interés en ventas sin fricción.',
        images: ['/images/services/ecommerce-1.png', '/images/services/ecommerce-2.png'],
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
