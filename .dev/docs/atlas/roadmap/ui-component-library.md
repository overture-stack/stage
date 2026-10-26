# Generic Overture UI component library: foundation decision

Relocated depth for the "Move off Next.js; extract a generic Overture UI component library from this repo" roadmap entry, per `roadmap_split: yes`.

Two linked initiatives:

- **Framework migration:** move this app off Next.js. No replacement is chosen yet; research alternatives (framework, routing, SSR/SSG needs carried over from the current Pages Router setup, build tooling) before committing to one.
- **Generic Overture UI component library:** alongside the migration, extract a library of generic, reusable Overture UI components, published from this same repo as exported package(s) rather than a separate repo, restructured as a monorepo the way other Overture projects already are (e.g. Lyric's `packages/` split).

## Component foundation decided, August 2026: shadcn

Chosen over Mantine, Base UI/Radix used directly, React Aria Components, Ark UI/Park UI, and Untitled UI, for these reasons:

- It's a copy-paste convention, not an installed dependency: the code is fully owned, matching the actual goal here (Overture's own library, not a consumed package), unlike Mantine or Untitled UI.
- It pairs with Tailwind CSS, a build-time styling system with no CSS-in-JS runtime cost, unlike Stage's current Emotion setup.
- As of July 2026 it defaults to Base UI rather than Radix, the more actively maintained accessibility/primitive layer following Radix's slowed update cadence after its acquisition by WorkOS.
- It ships genuinely neutral, unbranded defaults, unlike Mantine (reviews describe its default look as "harder to override in some components"), MUI/Ant Design (ruled out upfront as too branded/opinionated), and Untitled UI (technically sound, React Aria plus Tailwind, but itself a comprehensive, paid, opinionated design product rather than a neutral foundation, with unclear free-tier licensing terms worth avoiding for freely-forkable infrastructure).
- Ships an official monorepo template (pnpm + Turborepo, a shared `packages/ui`) matching the Lyric-style split already planned above.

Framework migration is still open; the component library foundation is settled.

**Reference:** passing JS-computed values into shadcn's Tailwind-based styling (variant/size choices vs. genuinely dynamic values) follows the `cva` (class-variance-authority) + `cn` (clsx + tailwind-merge) pattern shadcn itself ships; see [cva & cn in Tailwind CSS: Conditional Classes in React](https://medium.com/@rezazare2088/cva-cn-in-tailwind-css-conditional-classes-in-react-1250b5dfc803).

## Packaging the library so it does not break its hosts

A component package can break the apps that install it in ways its own source never shows: an entry point that throws on load, a stylesheet that restyles the whole host page, a peer range npm refuses to install. Lyric's `packages/ui` is the nearest precedent for this library, with shadcn components, Tailwind v4 and a Vite library build in a monorepo beside a server, released by a recursive publish. Built and run at commit `21c41951` (Lyric pull request 217, October 2026), it failed in each of the ways below. Each requirement names the failure it prevents and a check that catches it, and most of those checks need the built package rather than the source.

The same checks apply to any package Stage considers adopting during the migration, such as Usher's access-management UI package.

### Styles

| Requirement | Failure it prevents | Check |
| --- | --- | --- |
| Ship the stylesheet as a file the host imports, rather than as an `import` injected into the JavaScript bundle | An injected import makes the CommonJS entry throw on `require`. It also makes the ES module entry fail wherever Node loads it without a CSS loader, which covers server rendering and some test runners. And it takes control of load order away from the host, and load order decides which theme variables win. | `node -e "require('<package>')"`, then a dynamic `import()` of the ES module entry in plain Node |
| Point the stylesheet export at the file the build writes | An export naming a file the build never emits leaves hosts nothing to import | Run `npm pack` and compare the tarball listing with `exports` |
| Leave Tailwind's preflight out, and namespace Tailwind with `prefix()` | Preflight resets every element a host leaves to browser defaults, such as heading sizes, list bullets and button borders, in hosts without Tailwind too. Unprefixed theme variables such as `--spacing` and `--font-sans` share a layer and selector with a Tailwind v4 host's own, so whichever stylesheet loads last sets them for the whole page. | Compile the stylesheet and search the output for `box-sizing` and for an unprefixed `--spacing` |

Each half of the last requirement needs its own fix. Compiled with Tailwind 4.3.3, dropping preflight alone still emits the unprefixed variables, and `prefix()` alone still emits preflight. Importing only the theme and utilities layers, with the prefix on the theme, emits neither:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme) prefix(ov);
@import 'tailwindcss/utilities.css' layer(utilities);
```

`ov` is a placeholder. The prefix becomes part of every class string, such as `ov:bg-primary`, and of every theme variable, such as `--ov-color-primary`, so choosing it is a naming decision. Whether shadcn's `cn` package merges prefixed classes correctly was not checked.

### Theming

The roadmap already sets the theming interface as CSS custom properties, so the library works on Emotion and on Tailwind. Two requirements make that interface work:

| Requirement | Failure it prevents | Check |
| --- | --- | --- |
| The variables hosts are told to override are the ones the utilities read | Lyric's package derives shadcn-style aliases such as `--primary` from its Tailwind tokens such as `--color-primary`, the reverse of shadcn's direction, and nothing reads the aliases. A host following shadcn's convention by overriding `--primary` changes nothing. | Search the built CSS for `var(--<name>)` for every documented variable |
| Document overrides as plain, unlayered CSS on `:root` | Tailwind's `@theme` means nothing to a host without Tailwind. An override in the same layer as the package's defaults wins or loses on load order, while an unlayered rule beats layered defaults in any host. | Override one documented variable in a host without Tailwind and confirm it takes effect |

### Dependencies

| Requirement | Failure it prevents | Check |
| --- | --- | --- |
| Peer ranges include every React version the hosts run, and the package is exercised on each | npm refuses to install a package whose peer range excludes the host's React, with `ERESOLVE`. pnpm only warns, so a pnpm workspace never sees the failure. Lyric's `^18.3.0` excludes its first consumers, on React 19, and Stage, on React 17. | `npm install` the packed tarball into a scratch host on each React version |
| Each runtime dependency is either external to the bundle or left undeclared, never both | Lyric's build inlined Radix `Slot`, cva and the class merger while also declaring them, so hosts install copies nothing loads, and a host already carrying Radix ships two. Marking them external cut the ES module bundle from 39 KB to 1.8 KB. | Search the built bundle for inlined `node_modules` paths |
| Dependencies used only by stories are devDependencies | An icon set imported only by stories but declared as a runtime dependency installs into every host, and into any image built from the workspace: about 40 MB for `lucide-react` | Compare `dependencies` with the imports outside `*.stories.*` files |

### Components

| Requirement | Failure it prevents | Check |
| --- | --- | --- |
| A component that forwards its props onto its child passes the child through unwrapped | With Radix `Slot`, behind shadcn's `asChild`, wrapping the child in a Fragment makes the Fragment the target. Classes and handlers are discarded, the ref is skipped, and React 19 logs nothing. | Render test: `<Button asChild><a href="/x">Link</a></Button>` outputs an `<a>` carrying the variant classes |
| Icon-only sizes still render children | Dropping children at an icon size strips the screen-reader label from shadcn's icon-button pattern, leaving a button with no accessible name, which fails WCAG 4.1.2 | Render test at the icon size with an `sr-only` label as a child |

Checked against Radix `Slot` 1.3.3. shadcn now defaults to Base UI, which composes through a `render` prop rather than `asChild`, and that path was not checked.

### Monorepo and release

| Requirement | Failure it prevents | Check |
| --- | --- | --- |
| The package is `"private": true` until its first publish is intended | A recursive publish such as `pnpm -r publish` publishes every workspace package not marked private, so a release cut for any other package publishes the library as it stands. npm never lets a published version number be reused. With the flag, removing it is the publish decision. | `npm view <package>` returns 404 until the intended first release |
| Each image builds and installs only its own app and that app's workspace dependencies, for example with `pnpm --filter <app>...` | A root build that runs every package's build, followed by a workspace-wide production install, puts the library's build and its runtime dependencies inside every other image. A failing library build then fails them all. | List the image's `node_modules` for the library's dependencies |
| Path aliases are rewritten before they reach the emitted type declarations, for example with `tsc-alias` or `vite-plugin-dts` | shadcn's `components.json` generates `@/` imports. They resolve in the library's own build, but `tsc` emits them unchanged into `.d.ts` files, where consumers cannot resolve them. | Search `dist/**/*.d.ts` for `@/` |
