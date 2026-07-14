# Breakpoints de animación (JS)

Fuente única para tiers de viewport en scripts GSAP: [`src/lib/breakpoints.ts`](../src/lib/breakpoints.ts).

## Tabla

| Nombre  | Umbral    | Uso                  | Prefijo CSS      |
| ------- | --------- | -------------------- | ---------------- |
| `mb`    | `< 440`   | móvil estrecho       | _(ninguno / base)_ |
| `tb`    | `>= 440`  | tablet / móvil ancho | `tb:`            |
| `dk`    | `>= 744`  | desktop              | `dk:`            |
| `dk-lg` | `>= 1600` | desktop grande       | `dk-lg:`         |

Los umbrales coinciden con `--breakpoint-tb` / `--breakpoint-dk` / `--breakpoint-dk-lg` en [`figma_var.css`](../src/styles/figma_var.css). En JS, `mb` cubre el rango por debajo del primer breakpoint CSS.

```ts
import { getAnimBreakpoint, type AnimBreakpoint } from '../src/lib/breakpoints';

const bp = getAnimBreakpoint(); // 'mb' | 'tb' | 'dk' | 'dk-lg'
```

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
