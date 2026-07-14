# Breakpoints de animación (JS)

Fuente única para tiers de viewport en scripts GSAP: [`src/lib/breakpoints.ts`](../src/lib/breakpoints.ts).

## Tabla

| Nombre   | Umbral     | Uso                    |
| -------- | ---------- | ---------------------- |
| `mb`     | `< 440`    | móvil estrecho         |
| `tb`     | `>= 440`   | tablet / móvil ancho   |
| `dk`     | `>= 744`   | desktop                |
| `dk-lg`  | `>= 1600`  | desktop grande         |

```ts
import { getAnimBreakpoint, type AnimBreakpoint } from '../src/lib/breakpoints';

const bp = getAnimBreakpoint(); // 'mb' | 'tb' | 'dk' | 'dk-lg'
```

## No confundir con CSS

Los **nombres** coinciden con prefijos Tailwind del proyecto (`mb:`, `tb:`, `dk:`, `dk-lg:`), pero los **umbrales de animación no son 1:1** con `--breakpoint-*` en [`figma_var.css`](../src/styles/figma_var.css).

Ejemplo: en CSS, `mb:` aplica desde `min-width: 440px`. En animaciones, `mb` es el rango **por debajo** de 440px.

No uses `sm` / `md` / `lg` / `xl` / `2xl` (defaults de Tailwind) para lookups de animación.

## Uso en `animation.ts`

```ts
import { getAnimBreakpoint, type AnimBreakpoint } from '../../../../lib/breakpoints';

const VISION_Y: Record<AnimBreakpoint, number> = {
  mb: -35,
  tb: 80,
  dk: 80,
  'dk-lg': 110,
};

const bp = getAnimBreakpoint();
gsap.set(vision, { y: VISION_Y[bp] });
```

JSON keyed por el mismo union (ej. `slogan-positions.json`):

```json
{
  "img1": {
    "mb": { "left": 26, "top": 18 },
    "tb": { "left": 27, "top": 11 },
    "dk": { "left": 26, "top": 33 },
    "dk-lg": { "left": 26, "top": 38 }
  }
}
```
