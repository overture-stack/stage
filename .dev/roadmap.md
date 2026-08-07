# Roadmap

## Active

### Move off Next.js; extract a generic Overture UI component library from this repo
Two linked initiatives:

- **Framework migration:** move this app off Next.js. No replacement is chosen yet; research alternatives (framework, routing, SSR/SSG needs carried over from the current Pages Router setup, build tooling) before committing to one.
- **Generic Overture UI component library:** alongside the migration, extract a library of generic, reusable Overture UI components, published from this same repo as exported package(s) rather than a separate repo, restructured as a monorepo the way other Overture projects already are (e.g. Lyric's `packages/` split). **Component foundation decided, August 2026: shadcn**, over Mantine, Base UI/Radix used directly, React Aria Components, Ark UI/Park UI, and Untitled UI, for these reasons:
  - It's a copy-paste convention, not an installed dependency: the code is fully owned, matching the actual goal here (Overture's own library, not a consumed package), unlike Mantine or Untitled UI.
  - It pairs with Tailwind CSS, a build-time styling system with no CSS-in-JS runtime cost, unlike Stage's current Emotion setup.
  - As of July 2026 it defaults to Base UI rather than Radix, the more actively maintained accessibility/primitive layer following Radix's slowed update cadence after its acquisition by WorkOS.
  - It ships genuinely neutral, unbranded defaults, unlike Mantine (reviews describe its default look as "harder to override in some components"), MUI/Ant Design (ruled out upfront as too branded/opinionated), and Untitled UI (technically sound, React Aria plus Tailwind, but itself a comprehensive, paid, opinionated design product rather than a neutral foundation, with unclear free-tier licensing terms worth avoiding for freely-forkable infrastructure).
  - Ships an official monorepo template (pnpm + Turborepo, a shared `packages/ui`) matching the Lyric-style split already planned above.

Framework migration is still open; the component library foundation is settled.

**Reference:** passing JS-computed values into shadcn's Tailwind-based styling (variant/size choices vs. genuinely dynamic values) follows the `cva` (class-variance-authority) + `cn` (clsx + tailwind-merge) pattern shadcn itself ships; see [cva & cn in Tailwind CSS: Conditional Classes in React](https://medium.com/@rezazare2088/cva-cn-in-tailwind-css-conditional-classes-in-react-1250b5dfc803).

### Evaluate long-standing uncommitted changes before next commit
Working tree has had uncommitted changes for a long time (months, per the developer): an unstaged `package-lock.json` update, plus staged changes to `IconButton.tsx`, `Facets.tsx`, `RepoTable.tsx`, `arrangerFetcher.ts`, `package.json`, and `tsconfig.json`. The staged diff bumps `@overture-stack/arranger-components` from `3.0.0-beta.34` to `3.0.3`, splits/adds npm scripts (`clear:NextTemp`, `clear:NodeModules`, `link:Arranger`, `reset`), adds `preserveSymlinks: true` to `tsconfig.json` (typically needed for `npm link` workflows), and makes small type/import tidy-ups. Review this as a cohesive unit before the next commit: confirm the Arranger version bump still matches what's current, decide whether the npm-link scripts are still wanted, and check nothing else has drifted since.

---

## Backlog

### Canary deployment on Overture dependency pre-releases
Idea, not yet designed: use npm `next` dist-tags as the trigger for automatically deploying a canary build of Stage. When a dependency Stage consumes publishes a `next` prerelease (e.g. Arranger pushing to `main` and publishing `arranger-components@next`), that would trigger a Jenkins build of Stage against the `next` version, deployed to a separate, alternate pod in overture-dev, not the regular stable dev deployment. This surfaces integration breakage against upstream `main` well before that dependency actually cuts a release, instead of finding out only once a new version lands in `package.json` here.

Not Arranger-specific: the same mechanism should apply to any Overture dependency Stage takes on, current or future, including Usher (once its Stage-side plugin exists) and the generic Overture UI component library above.

Open, needs research before building anything:
- What actually fires the Jenkins build: a registry webhook, a scheduled poll of `npm view <pkg> dist-tags next`, or the dependency's own CI calling into Jenkins directly.
- How the canary pod is provisioned in overture-dev without disturbing the stable deployment: separate Helm release name, separate ingress host, lifecycle/cleanup policy.
- Where this job definition lives: Stage's own `Jenkinsfile`, or a shared job in `config-jenkins-instances` since it would eventually cover multiple dependencies and possibly multiple consuming apps.
- How a canary failure gets surfaced to whoever needs to act on it.

---

## Completed

<!-- Move items here once shipped -->
