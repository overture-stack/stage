# Roadmap

## Active

### Usher integration: replace EGO, and adopt Usher for access control
Stage is the first integration target for Usher (Overture's access authorization service), proven in
overture-dev before the work carries to iMicroSeq's portal-ui. Four pieces, in design as of
September 2026, nothing implemented yet:

- **Remove EGO, move authentication to Keycloak.** Stage already supports both providers, selected
  by `NEXT_PUBLIC_AUTH_PROVIDER`, so this is removal of a path rather than construction of one.
  Usher is not an authentication service and does not replace this layer: it consumes a subject from
  Keycloak and answers what that subject may reach. What Usher needs from it is a stable `sub`,
  which is also what its audit trail correlates on.
- **Rework the user profile to read from Usher.** The profile must show a person their own access.
  Today's equivalent in the sibling portal derives that from JWT scope claims parsed in the browser,
  which Usher's design rules out: permissions arrive as a JWE the browser must never decrypt, so the
  read goes through a server-side bridge. Stage has the server side to host one.
- **Add an access-management surface, consumed rather than built.** Usher ships this as a reusable
  UI package and Stage takes it as a dependency. Stage's requirements of that package, the reference
  implementation it is modelled on, and what is settled versus open: `.dev/docs/usher/access-management-ui.md`.
- **A fifth piece the developer expects to surface later**, not yet named.

The API-token surface on `/user` is the nearest existing thing and is not being replaced: it already
performs the "what does this caller hold" read to compute token scopes, then discards the result
unrendered.

### Move off Next.js; extract a generic Overture UI component library from this repo
Two linked initiatives: framework migration off Next.js (no replacement chosen yet, still open), and extracting a generic, reusable Overture UI component library published from this repo as its own package(s). Component foundation decided, August 2026: shadcn. Full reasoning, alternatives considered, and the packaging requirements a published UI package has to meet: `.dev/docs/atlas/roadmap/ui-component-library.md`. Storybook (component development/showcase in isolation, not a test runner) is a natural fit once this actually starts, worth deciding then, not before.

**A constraint on the migration window, surfaced September 2026 while specifying Usher's UI package.** Stage is on Emotion now and shadcn/Tailwind later, and the gap between those is long enough that Stage will adopt third-party Overture UI packages inside it. So any package Stage takes on during the window has to be themeable on both stacks, or it needs re-theming mid-migration. The interface that satisfies both is CSS custom properties: Tailwind v4 defines its theme as custom properties, shadcn's convention is CSS variables for colour, and Emotion styles can read `var(--x)`. A JS theme object, which is what Stage and Arranger use today, is the one option that is stack-specific. This applies to packages Stage consumes and equally to the library extracted from this repo, since its consumers will be on mixed stacks for the same reason.

**The window has a React constraint too.** Stage runs React 17 and installs with npm, which refuses a package whose peer range excludes the host's React. So a package Stage adopts before its own React upgrade has to declare and work on React 17. Lyric's UI package currently declares `^18.3.0`, which excludes it.

**Leaving Next.js means building a session layer, because NextAuth is the whole of the current one.** Surfaced October 2026. NextAuth owns sign-in, the OAuth exchange with Keycloak, token refresh, session encryption and sign-out, so whatever replaces Next.js has to provide all of it, directly or through a backend-for-frontend, which Usher's design names as the end state for both portals.

What that layer must do, in short: the browser holds no token, encrypted or not, only an opaque session reference into a server-side store. Refresh happens on the server ahead of expiry, one refresh at a time per session, and a failed refresh ends the session. Every secret fails closed. The session never outlives Keycloak's own. And a 401 from an ushered application is read as "this token is no good", not as a reason to fall back to anonymous.

**These are a design constraint on the move, not a description of a layer to port.** Three of the rules were decided for iMicroSeq's portal and adopted for Stage on 2026-10-20: the sign-in token is kept out of what page scripts can read and refreshed before it expires, a session whose refresh fails ends, and the browser receives no token. It matters beyond Stage because iMicroSeq's portal is moving onto Stage's pattern. The rules and each one's standing: `.dev/docs/atlas/roadmap/session-layer.md`.

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
