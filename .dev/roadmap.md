# Roadmap

## Active

### Move off Next.js; extract a generic Overture UI component library from this repo
Two linked initiatives: framework migration off Next.js (no replacement chosen yet, still open), and extracting a generic, reusable Overture UI component library published from this repo as its own package(s). Component foundation decided, August 2026: shadcn. Full reasoning and alternatives considered: `.dev/docs/atlas/roadmap/ui-component-library.md`. Storybook (component development/showcase in isolation, not a test runner) is a natural fit once this actually starts, worth deciding then, not before.

---

## Backlog

### Add Playwright for real-browser coverage, alongside Jest
Idea, not yet designed: Jest only covers pure logic here (co-located `.test.ts` files), nothing exercises an actual rendered page against a real backend. Raised 2026-08-11 after a real gap: the Arranger catalogue picker's wiring was verified correct via `tsc`/Jest/direct API checks, but whether it actually renders in a browser was never confirmed the same session, since no real-browser tooling was available (`chromium-cli` not installed, Playwright not a dependency here or globally). Not a replacement for Jest, a different layer: real network calls, real rendering, screenshots, the kind of thing only a live browser check catches.

Open, needs deciding before adopting: which flows get E2E coverage first (the explorer page's config/catalogue-resolution states seem like the obvious starting candidate, given today's incident), whether it runs in CI or stays a local/manual verification tool for now, and against which backend (a real dev deployment vs. the local `dev-services` mock stack).

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
