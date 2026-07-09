# Guía: animaciones por sección (`animation.ts`)

Cómo crear y organizar animaciones GSAP en secciones de Astro, usando el patrón del proyecto.

---

## Estructura de archivos

Cada sección vive en su propia carpeta bajo `Page/_components/SectionName/`:

```
SectionName/
├── index.astro          # Markup + boot del script cliente
├── animation.ts         # ScrollTrigger, tweens, orquestación
├── SectionHeading.astro # Piezas de UI (opcional)
└── card-hover.ts        # Interacción acotada (opcional)
```

| Archivo                          | Responsabilidad                                                         |
| -------------------------------- | ----------------------------------------------------------------------- |
| `index.astro`                    | HTML, clases Tailwind, `data-anim`, `<script>` mínimo                   |
| `animation.ts`                   | Toda la lógica GSAP de la sección                                       |
| `*-hover.ts`, `counter.ts`, etc. | Comportamiento puntual (hover, contador) importado desde `animation.ts` |

**Regla:** el `<script>` de `index.astro` solo arranca la animación. No pongas tweens ni ScrollTriggers ahí.

---

## Boot en `index.astro`

El layout usa `<ClientRouter />`, así que el boot va solo en `astro:page-load`:

```astro
<script>
  import { initMySectionAnimation } from './animation';

  const boot = () => initMySectionAnimation();

  document.addEventListener('astro:page-load', boot);
</script>
```

- `astro:page-load` cubre la **primera carga** y la **navegación interna**.
- No hace falta `DOMContentLoaded`.
- Cada sección registra su propio listener; si no está en el DOM, `init` sale sin error.

---

## Markup: contratos mínimos

### 1. `id` en la `<section>` (obligatorio)

Debe coincidir con `rootId` en `animation.ts`:

```astro
<section id="partners" class="..."></section>
```

### 2. `data-anim` en nodos animados

Nombres **locales a la sección** (ej. `label-desktop`, `logo-item`):

```astro
<p data-anim="label-desktop">...</p>
<div data-anim="logo-item">...</div>
```

### 3. Texto partido (opcional)

Si vas a hacer stagger por palabras o líneas:

```astro
<p data-anim="description" data-mysection-text-words>...</p>
```

En `animation.ts` usa `splitWords` / `splitChars` de `src/utils/split-text.ts` y `resetSplitText` en el cleanup.

### 4. Estado inicial en CSS (no duplicar en JS)

Propiedades que GSAP va a animar (`opacity`, `clip-path`, `transform`, etc.) defínelas **una vez** en Tailwind (arbitrary props) o en un `<style>` scoped del componente. No las repitas en `gsap.set()` solo para “espejar” CSS.

---

## `createScrollSectionController`

Util compartido: `src/utils/create-scroll-section-controller.ts`.

Encapsula el ciclo de vida que toda sección con scroll necesita:

1. Busca `#rootId` en el DOM (si no existe, sale).
2. Limpia la ejecución anterior (`cleanupSetup`, `mm.revert`).
3. Ejecuta tu `setup`.
4. Refresca ScrollTrigger tras el layout.

### Opciones

| Opción   | Descripción                                                        |
| -------- | ------------------------------------------------------------------ |
| `rootId` | `id` del `<section>` en el HTML                                    |
| `setup`  | Donde vive la animación. Puede **retornar** una función de cleanup |

### Quién hace el cleanup

**Todo** va en el `return` de `setup` o de cada `mm.add`:

```ts
return () => {
  st.kill();
  cardTriggers.forEach((t) => t.kill());
  cleanupHover();
  clearMySectionStyles(root); // reset DOM: estilos, tweens, split-text
};
```

El controller solo orquesta: ejecuta el cleanup anterior y monta de nuevo.

### `rootId` del HTML

| Nombre   | Dónde                                          | Ejemplo                                  |
| -------- | ---------------------------------------------- | ---------------------------------------- |
| `rootId` | Opción del controller + atributo `id` del HTML | `'partners'` → `<section id="partners">` |

---

## Capas dentro de `animation.ts`

Orden recomendado (de arriba a abajo):

```
1. Imports
2. gsap.registerPlugin(...)
3. Constantes (umbrales T_*, selectores locales)
4. Helpers puros (split text, parseo, formato)
5. clearXStyles(root) — reset de la sección
6. export const initX = createScrollSectionController({ ... })
```

Dentro de `setup`:

```
1. querySelector / querySelectorAll
2. setInitialState (gsap.set una vez)
3. Funciones reveal / hide / handleThresholds
4. ScrollTrigger.create({ trigger: root, ... })
5. Módulos colocados (hover, etc.)
6. return () => { ... }  — cleanup local
```

---

## Dos patrones de `setup`

### A) Sección simple (sin breakpoints)

Cuando el comportamiento es el mismo en todos los tamaños de pantalla, **no uses** `mm.add('(min-width: 0px)')`. Escribe el setup directo y retorna cleanup:

```ts
setup: ({ root }) => {
  const st = ScrollTrigger.create({ trigger: root, /* ... */ });
  const cleanupHover = setupCardHover(root);

  return () => {
    st.kill();
    cleanupHover();
  };
},
```

Referencia: `PartnershipSection/animation.ts`.

### B) Sección responsive (desktop vs mobile)

Usa `mm.add` por breakpoint. Cada bloque retorna su cleanup; `mm.revert()` los ejecuta todos en re-init:

```ts
setup: ({ root, mm }) => {
  mm.add('(min-width: 1200px)', () => {
    // lógica desktop
    const st = ScrollTrigger.create({ /* ... */ });
    return () => {
      st.kill();
      clearMySectionStyles(root);
    };
  });

  mm.add('(max-width: 1199px)', () => {
    // lógica mobile/tablet
    const st = ScrollTrigger.create({ /* ... */ });
    return () => {
      st.kill();
      clearMySectionStyles(root);
    };
  });
},
```

Referencia: `NumbersSection/animation.ts`.

**Regla:** todo ScrollTrigger / tween scrub / listener que crees en un bloque debe matarse en el `return` de ese mismo bloque.

---

## `clearXStyles` en el cleanup

Define una función local que resetee la sección y **llámala al final de cada cleanup** (`setup` return o `mm.add` return):

```ts
function clearMySectionStyles(root: HTMLElement) {
  root.querySelectorAll('[data-anim], [data-anim] *').forEach((el) => {
    (el as HTMLElement).removeAttribute('style');
  });
  gsap.killTweensOf(gsap.utils.toArray(root.querySelectorAll('[data-anim], [data-anim] *')));
  resetSplitText(root, '[data-mysection-text-words]');
}

return () => {
  st.kill();
  cleanupHover();
  clearMySectionStyles(root);
};
```

En secciones con **dos breakpoints**, incluye `clearMySectionStyles(root)` en el `return` de **cada** bloque `mm.add` (desktop y mobile).

---

## Interacciones puntuales (hover, tilt, etc.)

Archivo colocado en la misma carpeta, por ejemplo `tag-pills-hover.ts`:

```ts
export function setupTagPillsHover(root: HTMLElement) {
  const pills = root.querySelectorAll<HTMLElement>('[data-tag-pill]');
  const cleanups: Array<() => void> = [];

  pills.forEach((pill) => {
    const onEnter = () => {
      /* gsap.to(...) */
    };
    const onLeave = () => {
      /* gsap.to(...) */
    };
    pill.addEventListener('mouseenter', onEnter);
    pill.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      pill.removeEventListener('mouseenter', onEnter);
      pill.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(pill);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
```

En `animation.ts`:

```ts
const cleanupHover = setupTagPillsHover(root);
return () => {
  st.kill();
  cleanupHover();
};
```

---

## Plantilla básica (copiar y adaptar)

### `index.astro`

```astro
---
// imports y props...
---

<section id="my-section" class="...">
  <h2 data-anim="title">Título</h2>
  <p data-anim="description">Texto</p>
</section>

<script>
  import { initMySectionAnimation } from './animation';

  document.addEventListener('astro:page-load', () => initMySectionAnimation());
</script>
```

### `animation.ts` — sección simple

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollSectionController } from '../../../../utils/create-scroll-section-controller';

gsap.registerPlugin(ScrollTrigger);

function clearMySectionStyles(root: HTMLElement) {
  root.querySelectorAll('[data-anim], [data-anim] *').forEach((el) => {
    (el as HTMLElement).removeAttribute('style');
  });
  gsap.killTweensOf(gsap.utils.toArray(root.querySelectorAll('[data-anim], [data-anim] *')));
}

export const initMySectionAnimation = createScrollSectionController({
  rootId: 'my-section',
  setup: ({ root }) => {
    const title = root.querySelector<HTMLElement>('[data-anim="title"]');
    const description = root.querySelector<HTMLElement>('[data-anim="description"]');

    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (description) gsap.set(description, { opacity: 0, y: 16 });

    const reveal = () => {
      if (title) gsap.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      if (description) {
        gsap.to(description, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 });
      }
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      onEnter: reveal,
      onEnterBack: reveal,
    });

    return () => {
      st.kill();
      clearMySectionStyles(root);
    };
  },
});
```

### `animation.ts` — con breakpoints

```ts
export const initMySectionAnimation = createScrollSectionController({
  rootId: 'my-section',
  setup: ({ root, mm }) => {
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-anim="card"]'));

    mm.add('(min-width: 1200px)', () => {
      gsap.set(cards, { opacity: 0, y: 30 });

      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top 75%',
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
        },
      });

      return () => {
        st.kill();
        clearMySectionStyles(root);
      };
    });

    mm.add('(max-width: 1199px)', () => {
      const triggers = cards.map((card) =>
        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
          },
        }),
      );

      gsap.set(cards, { opacity: 0, y: 24 });
      return () => {
        triggers.forEach((t) => t.kill());
        clearMySectionStyles(root);
      };
    });
  },
});
```

---

## Excepciones (no usar el controller)

Algunas piezas no encajan en el patrón de sección con scroll:

| Caso                      | Dónde                        | Ejemplo en el proyecto                   |
| ------------------------- | ---------------------------- | ---------------------------------------- |
| Hero con intro de página  | `HeroSection/animation.ts`   | Timeline de entrada, sin scroll section  |
| Header / menú persistente | `Header/animation.ts`        | `transition:persist`                     |
| Efecto global en layout   | `Layout.astro`               | `initButtonLinkMagnetic`                 |
| Text reveal reutilizable  | `src/components/TextReveal/` | Importado por secciones que lo necesiten |

Para esos casos: exporta `initX()`, escucha `astro:page-load` y implementa tu propio cleanup idempotente.

---

## Checklist al crear una sección nueva

- [ ] Carpeta `SectionName/` con `index.astro` + `animation.ts`
- [ ] `<section id="...">` único en la página
- [ ] `data-anim` en nodos que participan en la timeline
- [ ] `return () => { … }` mata ScrollTriggers, listeners **y** llama a `clearXStyles(root)`
- [ ] Boot solo con `document.addEventListener('astro:page-load', ...)`
- [ ] Estado inicial de GSAP en CSS (Tailwind o `<style>` scoped), no duplicado en JS
- [ ] Breakpoints con `mm.add` solo si el comportamiento cambia por viewport
- [ ] Hover / listeners en módulo colocado con `return () => cleanup()`

---

## Referencias en el repo

| Ejemplo                                         | Patrón                                       |
| ----------------------------------------------- | -------------------------------------------- |
| `Home/_components/PartnershipSection/`          | Scroll simple + hover colocado + split words |
| `Home/_components/NumbersSection/`              | Breakpoints + counters                       |
| `Home/_components/ActionSection/`               | Umbrales de progreso + split text            |
| `Home/_components/HeroSection/`                 | Intro de página (sin controller)             |
| `src/utils/create-scroll-section-controller.ts` | Lifecycle compartido                         |
| `src/utils/split-text.ts`                       | Split / reset de texto                       |
