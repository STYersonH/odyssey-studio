# Componente `Reveal` (stagger de hijos)

Wrapper shared para animar **varios elementos hijos** con entrada/salida por dirección. Más simple que [`Copy`](./copy-component.md): no usa SplitText ni variants de tipografía.

Hub: [methodology.md](./methodology.md) · Componentes: [components.md](./components.md)

Código: [`src/components/Reveal/`](../../src/components/Reveal/)

---

## Playground

Página de prueba en vivo: [`/reveal`](../src/pages/reveal.astro) — panel React + mismo motor que `<Reveal>` (`createRevealAnimation`).

---

## Cuándo usarlo

- Bloques de UI (número, título, párrafo, stats) que entran con stagger.
- Misma API de scroll que `Copy` (`scrub`, `start`/`end`, `reverse`), sin partir letras.

```astro
---
import Reveal from '../../components/Reveal/index.astro';
---

<Reveal from="right" reverse>
  <p>01 / 05</p>
  <h3>OH Architecture</h3>
  <p>Description…</p>
</Reveal>
```

Anima nodos de **contenido** (`h2`, `p`, `img`, `button`, …) en orden DOM, aunque estén dentro de wrappers de layout. Los `<div>` solo-estructura no cuentan como unidad de stagger.

```astro
<Reveal from="right">
  <div>
    <h2>OH Architecture</h2>
    <p>Systems that hold under pressure.</p>
    <img src="/hero.jpg" alt="" />
  </div>
  <div>
    <h3>Signal Clarity</h3>
    <p>Cut noise until the path is obvious.</p>
  </div>
  <button>Explore the odyssey</button>
</Reveal>
```

---

## Props

| Prop              | Tipo                                   | Default      | Notas                                                      |
| ----------------- | -------------------------------------- | ------------ | ---------------------------------------------------------- |
| `from`            | `left` \| `right` \| `top` \| `bottom` | `right`      | Dirección de **entrada** (desde dónde vienen).             |
| `out`             | misma \| `null`                        | `= from`     | Dirección de **salida** en reverse. Con `scrub` se ignora. |
| `distance`        | `number`                               | `72`         | Viaje en px.                                               |
| `stagger`         | `number`                               | `0.08`       | Delay entre hijos.                                         |
| `delay`           | `number`                               | `0`          | Solo play-once.                                            |
| `duration`        | `number`                               | `0.75`       | Solo play-once (scrub → `1`).                              |
| `ease`            | `string`                               | `power3.out` | Ignorado con scrub (`none`).                               |
| `animateOnScroll` | `boolean`                              | `true`       | `false` = al montar. Ignorado con scrub.                   |
| `trigger`         | `string`                               | root         | Selector ScrollTrigger.                                    |
| `start`           | `string`                               | `top 80%`    |                                                            |
| `end`             | `string`                               | `top 20%`    | Solo scrub.                                                |
| `scrub`           | `boolean` \| `number`                  | `false`      | Progress ligado al scroll.                                 |
| `reverse`         | `boolean`                              | `false`      | Play-once: revierte al subir. Ignorado con scrub.          |
| `class`           | `string`                               |              | Clases del wrapper.                                        |

### Modos

- **Play once** — entra al cruzar `start`.
- **Reverse** — al subir past `start`, sale. Si `out === from`, el tween va hacia atrás; si `out` es otra dirección, usa un tween de salida propio.
- **Scrub** — progress entre `start` y `end` (`ease`/`out`/`reverse` no aplican).

---

## Arquitectura

Igual espíritu que `Copy`:

- `index.astro` → props a `data-reveal-options` (JSON)
- `animation.ts` → boot en `astro:page-load`, `Map` + prune View Transitions
- `utils/` → `createRevealAnimation`, targets, offsets

Visibilidad: `[data-reveal]:not(.reveal-ready)` oculto hasta el setup.
