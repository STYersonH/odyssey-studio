# Ingeniería inversa: Slogan → checklist Figma para 1 prompt

Análisis de [`src/pages/Home/_components/slogan/`](../../src/pages/Home/_components/slogan/) para diseñar en Figma de forma que el agente implemente markup + i18n + JSON de posiciones + `animation.ts` **con un solo prompt**.

Relacionado: [../framework/methodology.md](../framework/methodology.md) · [../breakpoints.md](../breakpoints.md) · [../animation-breakpoints.md](../animation-breakpoints.md) · [../section-animation.md](../section-animation.md) · [../framework/figma-animation-handoff.md](../framework/figma-animation-handoff.md)

---

## Qué es realmente esta sección (modelo mental)

Slogan no es un layout “flow” normal. Es un **escenario full-viewport** con:

| Capa | Rol en código | En Figma |
| ---- | ------------- | -------- |
| `#slogan` | `min-h-screen`, `relative`, `overflow-hidden`, `bg-neutral-900`, perspectiva 3D | Frame raíz de la sección = 100% × 100% de referencia |
| `slogan-images` | Contenedor `h-[100vh]` absolute children | Grupo `images` dentro del frame |
| `img-1` / `img-2` / `img-3` | Absolute; **left/top = centro** (`-translate-x/y-1/2`) | Tres rectángulos/imágenes absolute; anotar **centro**, no esquina |
| `slogan-lines` | Stack de 3 líneas uppercase | Grupo tipográfico (Auto Layout vertical OK) |
| `slogan-vision` | Palabra enorme centrada | Text absolute centrado |

La animación **mueve** las imágenes desde un cluster cerca del centro (estado START en markup) hacia posiciones finales en `%` (JSON). El texto grande escala y sube; las líneas y la visión revelan letra a letra con blur.

Si Figma solo entrega el estado “bonito final”, el agente inventa el start y los timings. Para un solo prompt fiel, Figma debe entregar **estado final + estado inicial + anotaciones de motion**.

---

## 1. Frames: los 4 viewports (obligatorio)

Crea **exactamente 4 frames** de la misma sección, misma estructura de capas, mismos nombres:

| Nombre de frame sugerido | Ancho | Alto | Tier código |
| ------------------------ | ----- | ---- | ----------- |
| `Slogan / mb` | **390** (o 375–430, siempre &lt; 440) | **844** (o 100vh del artboard móvil) | base / `mb` |
| `Slogan / tb` | **440** | **100vh** coherente | `tb:` |
| `Slogan / dk` | **1025** | **100vh** | `dk:` |
| `Slogan / dk-lg` | **1600** | **100vh** | `dk-lg:` |

Reglas:

- El alto del frame **es** la altura de la sección (`100vh` / `min-h-screen`). No diseñes la sección más baja “porque el contenido cabe”: el pin/scrub asume viewport completo.
- Fondo sólido del frame = color de sección (`#1a1a1a` / `neutral-900` en este proyecto). Sin gradientes inventados si el código es flat.
- **Prohibido** anotar `sm` / `md` / `lg` / `xl`. Solo `mb` / `tb` / `dk` / `dk-lg`.

---

## 2. Naming de capas (contrato con `data-anim`)

Los nombres deben ser **idénticos** en los 4 frames. Preferir snake o kebab estable:

```text
Slogan                    ← frame (= section#slogan)
├── images                ← data-anim="slogan-images"
│   ├── img-1             ← data-anim="img-1"  (flowers)
│   ├── img-2             ← data-anim="img-2"  (woman)
│   └── img-3             ← data-anim="img-3"  (building)
└── text                  ← data-anim="slogan-text"
    ├── lines             ← data-anim="slogan-lines"
    │   ├── line-1        ← data-anim="slogan-line" (instance 1)
    │   ├── line-2
    │   └── line-3
    └── vision            ← data-anim="slogan-vision"
```

- Un nombre = un nodo en código. No renombres por viewport (`img-1-desktop`).
- Si hay overlay sobre una imagen (ej. `bg-black/30` en img-1), capa hija `img-1/overlay` con opacidad anotada.

---

## 3. Absolute + centro (la regla que más tiempo ahorra)

En código, cada imagen usa:

```text
left: X%   top: Y%   +  translate(-50%, -50%)
```

Es decir: **X/Y son el centro del rectángulo**, no la esquina superior izquierda.

### Cómo medir en Figma

Para cada imagen en cada frame:

```text
centerX% = ((layer.x + layer.width  / 2) / frame.width)  * 100
centerY% = ((layer.y + layer.height / 2) / frame.height) * 100
```

Documenta en una nota del frame (o en la descripción del archivo) una tabla:

| layer | mb L/T | tb L/T | dk L/T | dk-lg L/T | w×h mb | w×h tb | w×h dk | w×h dk-lg |
| ----- | ------ | ------ | ------ | --------- | ------ | ------ | ------ | --------- |
| img-1 | … | … | … | … | 179×129 | … | 258×186 | 265×191 |
| img-2 | … | … | … | … | … | … | … | … |
| img-3 | … | … | … | … | … | … | … | … |

Eso alimenta directamente `slogan-positions.json` (estado **END**) y los `w`/`h` en `cn()` del markup.

### Estado START vs END

Slogan necesita **dos composiciones** por viewport (o un componente con variantes):

| Estado | Qué muestra | Dónde vive en código |
| ------ | ----------- | -------------------- |
| **END** (hero estático final) | Imágenes en posiciones finales, vision grande, líneas legibles | JSON `%` + tipografía final |
| **START** (antes del pin travel) | Imágenes juntas cerca del centro, más pequeñas / “lejos” en Z, vision pequeña o ilegible | Posiciones iniciales en markup / `gsap.set` |

Mínimo aceptable si no quieres 8 frames:

- 4 frames = **END** pixel-perfect.
- Un frame extra `Slogan / start (dk)` (o notas) con el cluster inicial + escala aproximada (`scale ~0.35`, “profundidad”).
- Anotar: “start centers ≈ left 45%/64%/36% top 44%/47%/53.5% en mb; ajustar por tier si cambia”.

Sin START, el agente puede recrear el patrón slogan, pero no será pixel-faithful en la entrada.

---

## 4. Tipografía (specs exactas por tier)

Extraído de `SloganText.astro`:

### Líneas (`line-1…3`)

| Prop | mb | tb | dk | dk-lg |
| ---- | -- | -- | -- | ----- |
| Font | Neue Montreal Medium | igual | igual | igual |
| Case | UPPERCASE | | | |
| Size | 32px | 32px (si no cambia) | 48px | 64px |
| Leading | 1.1 | 1.1 | 1.15 | 1.1 |
| Color | white | | | |
| Align | center | | | |
| Posición grupo | top ~39%, centrado horizontal | | top ~25% | top ~24% |

En Figma: Text style nombrado `Slogan / Line` con overrides por frame, o 4 estilos `…/mb` etc. Copy real en capas (no un solo bloque fusionado si son 3 líneas animadas por separado).

### Vision (`vision`)

| Prop | mb | tb | dk | dk-lg |
| ---- | -- | -- | -- | ----- |
| Font | Neue Montreal / body weight 500 | | | |
| Case | UPPERCASE | | | |
| Size | 64px | 100px | 200px | 260px |
| Leading | 1.0 | | | |
| Posición END | centro óptico (luego GSAP mueve `y` a ~40%/40%/23%/20%) | | | |

Anota en el frame END la posición visual final de vision **después** del travel (o dos posiciones: mid-pin vs end). En código:

```ts
VISION_MAX_Y = { mb: '40%', tb: '40%', dk: '23%', 'dk-lg': '20%' }
```

Eso debe salir de Figma (desplazamiento vertical del centro de vision al final del scrub).

---

## 5. Imágenes y assets

Por cada `img-*`:

1. **Asset exportable** con nombre estable (`image-flowers.png`, …) → `/public/images/…`.
2. **Tamaño intrínseco por tier** en px (no solo escala visual confusa).
3. `object-fit: cover` si el crop importa: muestra el crop final en el frame.
4. Overlays (tint `black/30`): capa encima con fill y %.
5. `alt` vacío decorativo vs significativo: anotar si es solo atmósfera.

No uses un collage flatten a un solo PNG si en código son 3 nodos que viajan aparte.

---

## 6. Z-index y orden de pintura

En slogan:

- Sección `z-10`
- Imágenes contenedor `z-20`
- Texto `z-30` (en `dk` baja a `z-10` para que las fotos crucen por encima en parte del travel)

Si el diseño depende de que las fotos pasen **delante o detrás** del texto en algún momento, anótalo por viewport. El agente no adivinará el flip `dk:z-10`.

---

## 7. Motion: lo que Figma debe declarar (aunque no anime)

El código hace esto; cada ítem debería tener una nota en el archivo:

| Beat | Comportamiento | Parámetros a anotar |
| ---- | -------------- | ------------------- |
| Enter (sección sube) | Fade/slide de sección previa (`[data-anim="enter"]`) | scrub al entrar |
| Vision chars | Split por letra; blur 20px → 0; stagger | blur px, stagger |
| Pin | Pin `top top`, duración ~**4× viewport** de scroll | multiplicador de pin |
| Images fade-in | Stagger opacity 0→1 al inicio del pin | orden img-1→2→3 |
| Travel | left/top % START→END + scale 0.35→1 + z -800→0 | centros %, scale start |
| Vision travel | scale 0.3→1 + `y` a VISION_MAX_Y | % final por tier |
| Lines reveal | Split chars; blur 4px → 0; línea 1→2→3 | blur, orden |

Formato útil de nota en Figma (una sola capa `NOTES / motion`):

```text
section-id: slogan
pin: 4vh
images: absolute, position=center%, start clustered, end=table
vision: SplitText chars, blur 20, scale 0.3→1, endY mb40 tb40 dk23 dk-lg20
lines: SplitText chars, blur 4, sequential
scrub: true
waitForFonts: true
```

---

## 8. i18n / copy

En Figma, textos finales (no Lorem):

```text
lines: ["TE HAREMOS", "ESTAR MÁS", "CERCA DE"]
vision: "TU VISIÓN"
```

El agente creará `t.slogan.lines` / `t.slogan.vision` en `es` + `en`. Si hay EN frame, incluye el copy EN o una nota `i18n: en = …`.

---

## 9. Qué NO hacer en Figma (rompe el one-prompt)

- Un solo frame desktop y “ya se adapta”.
- Capas renombradas por breakpoint.
- Posicionar imágenes por esquina sin decir “centro”.
- Fusionar las 3 fotos en un solo export.
- Tipografía con Inter/Roboto default si el proyecto usa Neue Montreal.
- Anotar breakpoints Tailwind default.
- Solo estado final sin hint de START / scale / blur.
- Sección más baja que el viewport si el motion asume pin full-screen.
- Cards, sombras decorativas o chips que no existen en el diseño real.

---

## 10. Entregable mínimo para el agente (checklist)

Antes de pegar el prompt, verifica:

- [ ] 4 frames `mb` / `tb` / `dk` / `dk-lg` con **mismos nombres de capa**
- [ ] Tabla de **centros %** END por imagen y tier
- [ ] Tabla de **w×h px** por imagen y tier
- [ ] Specs tipo líneas + vision (size, leading, font, case, color)
- [ ] Posición del grupo `lines` (top %) y de `vision` (centro / endY)
- [ ] Assets nombrados o embebidos exportables
- [ ] Nota `NOTES / motion` (pin, blur, scale, orden)
- [ ] Hint START (frame o nota con cluster inicial)
- [ ] Copy real + locale
- [ ] `section id` y fondo
- [ ] URLs Figma con `node-id` de los 4 frames (o página que los contiene)

---

## 11. Mapa Figma → archivos de código (lo que el agente generará)

| Origen Figma | Archivo |
| ------------ | ------- |
| Frame + capas estructura | `Slogan.astro`, `SloganImages.astro`, `SloganText.astro` |
| Copy | `src/i18n/translations/es.ts` + `en.ts` (`slogan`) |
| Centros % END | `slogan-positions.json` |
| w×h, top% lines, text sizes | clases `cn()` con `tb`/`dk`/`dk-lg` |
| Motion notes | `animation.ts` (`createSectionAnimationController`, SplitText, pin, scrub) |
| Boot | `<script>` `astro:page-load` en `Slogan.astro` |

---

## 12. Prompt único (copy-paste)

Adjunta los 4 frames (o la página Figma) y pega:

```text
Implementa la sección completa "Slogan" (o el nombre de la sección) en un solo paso, a partir de estos 4 frames Figma:
- mb: [URL node-id]
- tb: [URL node-id]
- dk: [URL node-id]
- dk-lg: [URL node-id]

Lee y obedece en este orden:
1) docs/framework/methodology.md
2) docs/breakpoints.md + docs/framework/components.md + docs/framework/i18n-and-pages.md + docs/framework/design-tokens.md
3) docs/animation-breakpoints.md + docs/section-animation.md + docs/framework/figma-animation-handoff.md
4) docs/analysis-figma/slogan-reverse-engineering.md (este handoff: centro=%, START/END, pin, SplitText)

Entrega en `src/pages/Home/_components/[SectionName]/` (o la página que indiques):
- [Section].astro con <section id="…">, lang, boot solo astro:page-load
- Piezas Astro (images / text) con cn(), solo prefijos tb/dk/dk-lg (nunca sm/md/lg)
- data-anim alineado a los nombres de capa Figma
- translations es + en (namespace de la sección)
- *-positions.json: left/top = CENTRO en % del frame, keys mb/tb/dk/dk-lg
- animation.ts con createSectionAnimationController, getAnimBreakpoint, cleanup clearSectionStyles, waitForFonts si hay SplitText

Reglas de fidelidad extraídas de Slogan:
- Sección full-viewport; imágenes absolute con left/top + translate -50%
- Estado START (cluster / scale bajo) → END (tabla %); no inventes breakpoints ni umbrales fuera de 440/1025/1600
- Tipografía y tamaños por tier desde los frames; tokens del proyecto
- Motion según NOTES del archivo Figma (pin duration, blur, stagger, vision endY). Si falta una nota, replica el patrón de Home/_components/slogan/ y documenta el assumption en un comentario breve
- No regeneres el stack; no hardcodees copy en el Astro

Al final: lista breve de supuestos y checklist QA mb/tb/dk/dk-lg.
```

---

## 13. Por qué este prompt funciona (y cuándo falla)

**Funciona** cuando los 4 frames comparten nombres, hay tabla centro/% o capas medibles, y hay nota de motion o el patrón slogan es el modelo explícito.

**Falla** si solo hay un mockup desktop, las fotos están flatten, las posiciones son “a ojo” sin centro, o el motion es otro paradigma (carrusel, horizontal scroll) sin notas: entonces divide en Prompt 1 markup → Prompt 2 JSON → Prompt 3 animation ([agent-section-workflow.md](../framework/agent-section-workflow.md)).
