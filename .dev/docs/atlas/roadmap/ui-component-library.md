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
