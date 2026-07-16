# Breakpoints y clases responsive

Cómo declarar viewports en CSS/Tailwind y cómo organizar `class={cn(...)}` para que el markup sea legible.

Hub: [framework/methodology.md](./framework/methodology.md) · Diseño Figma: [framework/figma-to-code.md](./framework/figma-to-code.md)

Relacionado:

- Tema: [`src/styles/figma_var.css`](../src/styles/figma_var.css)
- Animaciones JS: [animation-breakpoints.md](./animation-breakpoints.md)
- Helper: [`src/lib/cn.ts`](../src/lib/cn.ts) (`clsx` + `tailwind-merge`)

---

## Prefijos del proyecto

| Prefijo   | Umbral (`min-width`) | Uso típico        |
| --------- | -------------------- | ----------------- |
| _(ninguno)_ | `< 440px`          | Base / móvil estrecho |
| `tb:`     | `>= 440px`           | Tablet / móvil ancho |
| `dk:`     | `>= 1025px`          | Desktop           |
| `dk-lg:`  | `>= 1600px`          | Desktop grande    |

Definidos en `@theme` como `--breakpoint-tb`, `--breakpoint-dk`, `--breakpoint-dk-lg`.

**No uses** `sm:` / `md:` / `lg:` / `xl:` / `2xl:` (defaults de Tailwind) junto con estos prefijos en la misma propiedad: el orden del CSS generado puede hacer que un `md:` pise a un `dk:`.

En JS, el tier por debajo de 440 se llama `mb` (`getAnimBreakpoint`). En CSS ese rango es solo la clase **base** (sin prefijo).

---

## Declarar clases con `cn()`

Usa `cn()` siempre que haya varias utilidades o variantes responsive. Cada **argumento string** de `cn()` es un grupo visual: una línea = una preocupación.

### Orden recomendado de grupos

De arriba a abajo (ajusta si el nodo es muy simple):

1. **Identidad / animación** — hooks locales (`data-anim` no va aquí; sí clases tipo `title-main-animate`, `will-change-*`).
2. **Layout** — `flex`, `grid`, `block`, dirección, alineación, `gap` base.
3. **Posición** — `absolute` / `relative`, `inset`, `top` / `left` / `right` / `bottom`, `translate`, `z-*`.
4. **Caja / tamaño** — `w-*`, `h-*`, `max-w-*`, `aspect-*`, `overflow-*`.
5. **Espaciado** — `p-*`, `m-*`, `gap-*` responsive (si no van en layout).
6. **Tipografía base** — `font-*`, `uppercase`, `tracking-*`, `text-left` / `text-center`, `whitespace-*`.
7. **Tamaño de texto** — solo `text-[…]` / `tb:text-*` / `dk:text-*` / `dk-lg:text-*` (una línea).
8. **Leading** — `leading-*` **en su propia línea y después de los `text-*`** (ver nota `twMerge` abajo).
9. **Color / superficie** — `text-*` de color, `bg-*`, `opacity-*`, bordes.
10. **Efectos** — `will-change`, filtros, sombras, transiciones.

No hace falta usar los diez grupos en cada nodo. Si solo hay tipografía, basta con tipografía base + tamaño + leading.

### Ejemplo (líneas de slogan)

```astro
class={cn(
  // tipografía base + hints de animación
  'font-neue-medium uppercase will-change-[opacity,transform]',
  // tamaño de texto por viewport
  'text-[32px] dk:text-[48px] dk-lg:text-[64px]',
  // leading (después de text-*, por twMerge)
  'leading-[1.1] dk:leading-[1.15] dk-lg:leading-[1.1]',
)}
```

### Ejemplo (bloque posicionado)

```astro
class={cn(
  'absolute flex flex-col items-center text-white',
  'top-[39%] right-1/2 translate-x-1/2 dk:top-[25%] dk-lg:top-[24%]',
)}
```

### Ejemplo (título con escala larga)

Cuando el `text-[clamp(...)]` es largo, una línea por breakpoint mejora el diff:

```astro
class={cn(
  'font-neue-medium leading-none tracking-[0.04em] text-neutral-900 whitespace-nowrap',
  'text-[4rem]',
  'tb:text-[clamp(4rem,11vw+2rem,7.5rem)]',
  'dk:text-[clamp(4rem,12vw+2rem,15.6rem)]',
  'dk-lg:text-[clamp(10rem,13vw+2rem,18.75rem)]',
)}
```

---

## Qué más conviene agrupar (checklist)

| Grupo                         | Incluye                                              | Por qué separarlo                                      |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| Layout                        | `flex` / `grid` / align / `gap` base                 | Se lee la estructura del nodo de un vistazo            |
| Posición + transform de ancla | `absolute`, `%` de `top`/`left`, `-translate-*`      | Responsive de colocación sin mezclar con tipografía    |
| Tamaño de caja                | `w` / `h` / `max-w` / `aspect`                       | Distinto del `text-[Npx]`                              |
| Padding / margin responsive   | `px-*` `tb:px-*` `dk:px-*`                           | Tokens de spacing a menudo van juntos                  |
| Tipografía “quién soy”        | font family, weight, `uppercase`, `tracking`         | Cambia poco entre breakpoints                          |
| Escala tipográfica            | solo `text-*` por `tb` / `dk` / `dk-lg`              | Lo que más se retoca en responsive                     |
| Leading                       | `leading-*`                                          | Debe ir **después** de `text-*` por `tailwind-merge`   |
| Color / opacidad              | `text-white`, `bg-*`, `opacity-*`                    | Separado de métricas tipográficas                      |
| Motion / performance          | `will-change-*`, `transition-*`                      | Contrato con GSAP / paint                              |

**Regla práctica:** si al escanear la clase no sabes “¿esto es posición o tipografía?”, divídelo en otra línea de `cn()`.

---

## Cuidado con `twMerge` y `leading`

`cn()` usa `tailwind-merge`. Trata `text-*` y `leading-*` como el mismo grupo de conflicto (porque en el scale de Tailwind el tamaño de fuente a menudo trae line-height).

Si escribes:

```ts
cn('leading-[1.1] font-neue-medium', 'text-[32px] dk:text-[48px]')
// → leading-[1.1] desaparece
```

**Haz esto:**

```ts
cn(
  'font-neue-medium uppercase',
  'text-[32px] dk:text-[48px] dk-lg:text-[64px]',
  'leading-[1.1] dk:leading-[1.15]', // último, o shorthand text-[32px]/[1.1]
)
```

Alternativa Tailwind v4: `text-[32px]/[1.1] dk:text-[48px]/[1.15]`.

---

## Orden de prefijos en una misma línea

Dentro de un grupo, escribe de **móvil → grande**:

```txt
text-[32px] tb:text-[48px] dk:text-[64px] dk-lg:text-[80px]
```

Así el escalón más específico queda a la derecha y el diff por breakpoint es predecible.

---

## Resumen

1. Solo `tb` / `dk` / `dk-lg` (+ base sin prefijo).
2. `cn()` con **una preocupación por string**.
3. Grupos habituales: layout → posición → caja → spacing → tipo base → **text size** → **leading** → color → effects.
4. `leading-*` siempre después de los `text-*` (o usa el shorthand `text-[]/[]`).
5. Para animaciones por viewport en JS, ver [animation-breakpoints.md](./animation-breakpoints.md).
