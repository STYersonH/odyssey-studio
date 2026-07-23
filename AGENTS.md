## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project methodology (read first)

Before implementing UI, responsive classes, i18n, or GSAP section animations, read:

- [docs/framework/methodology.md](docs/framework/methodology.md) — hub and workflow order
- [docs/breakpoints.md](docs/breakpoints.md) — CSS prefixes `tb`/`dk`/`dk-lg` + `cn()`
- [docs/section-animation.md](docs/section-animation.md) — section GSAP lifecycle
- [docs/animation-breakpoints.md](docs/animation-breakpoints.md) — JS tiers `mb`/`tb`/`dk`/`dk-lg`
- [docs/framework/figma-to-code.md](docs/framework/figma-to-code.md) — Figma → markup prompts
- [docs/framework/figma-animation-handoff.md](docs/framework/figma-animation-handoff.md) — Figma → `%` / motion prompts
- [docs/framework/agent-section-workflow.md](docs/framework/agent-section-workflow.md) — copy-paste prompts for a new section

Also: [project-setup](docs/framework/project-setup.md), [i18n-and-pages](docs/framework/i18n-and-pages.md), [components](docs/framework/components.md), [design-tokens](docs/framework/design-tokens.md).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
