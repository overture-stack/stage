# Tech debt

## Open

### Tests live in `tests/` not co-located with source
fix: relocate `tests/index.test.js` next to the source file it tests, renamed to match the `.test.ts`/`.test.js` co-location convention; apply the same placement to any new test going forward. See `conventions/session-discipline.md` (agentics) § Tech-debt entry format.
standalone: yes

### Stack is on older majors: Next.js 12, React 17
fix: no immediate action; plan an upgrade pass (Next.js 13+/14+, React 18) when there's room, since newer library APIs (including future Arranger releases) may assume a newer major. Check `package.json` again before starting, this snapshot may already be outdated.
standalone: yes

### `arrangerFetcher.ts` can't be used as `useArrangerConfig`'s `apiFetcher`
fix: two confirmed, compounding gaps, verified directly against Arranger's source (2026-08-11), not hypothetical. (1) The underlying call is `ajax.post(...)`, hardcoded regardless of `args.method`; `useArrangerConfig`'s bootstrap call sends `method: 'GET'`, which would go out as a POST. (2) Bigger blocker: that same bootstrap call passes `url: apiUrl` (deliberately unscoped, since it's the call that confirms catalogue validity in the first place) plus `endpoint: `${catalogue}/introspection`` (manually pre-prefixed). `arrangerFetcher.ts` ignores the `url` argument by design (it must route through this app's own proxy, not Arranger's resolved host, see the git-archaeology section below) and instead rebuilds the URI from a `catalogue` value baked in at fetcher-creation time, producing a double-prefixed, 404ing path (`{proxy}/{catalogue}/{catalogue}/introspection`). Confirmed with Arranger directly: their contract (`url` pre-resolved to include catalogue) is correct and now documents this bootstrap-call exception explicitly; the incompatibility is specific to a proxy-routing fetcher like this one. Fixing this file to handle both would mean detecting an already-catalogue-prefixed `endpoint` before rebuilding the URI, real but non-trivial; not attempted, since resolving `documentType` a different way (below) sidesteps needing it at all.
standalone: yes
context: the routing half of this file's original bug (root cause of the `/api/arranger/graphql/Arranger-ConfigsQuery` 404 diagnosed against the dev multicatalogue server) is fully fixed and unaffected by this: `arrangerFetcher.ts` takes `catalogue` at creation time (passed from `explorer/index.tsx`'s runtime-resolved catalogue, see `resolveArrangerCatalogue.ts`) and builds the proxy path directly from it for every *other* call. `explorer/index.tsx` resolves `documentType` itself from the same `GET /introspection` response it already fetches for catalogue discovery (a `documentType` per catalogue, straight from Arranger's own response shape) rather than passing `customFetcher` through `useArrangerConfig`'s internal path, so this gap is real but currently unreachable in practice, not just deferred.

### `arrangerFetcher.ts`'s response cache never invalidates or scopes by caller
fix: same design gap, same fix shape as Arranger's own `defaultApiFetcher` (see arranger repo `.dev/tech-debt.md` § `defaultApiFetcher`'s response cache never invalidates or scopes by caller): scope the cache per consumer/context instead of one `Map` for the fetcher's whole lifetime, and/or add a TTL or explicit invalidation hook.
standalone: yes; independent of the other `arrangerFetcher.ts` entry above, though touches the same file
context: `createArrangerFetcher`'s `cache` (a `Map`, keyed by `JSON.stringify(args)`) has no TTL and no invalidation, already flagged by its own `// TODO: max cache size` comment. Because the fetcher instance is created once and its closure (cache included) persists across Fast Refresh, a request cached before an unrelated fix landed can keep being served afterward, for as long as the same request shape recurs, with nothing to force a refresh short of a full reload. Raised (2026-08-06) while investigating a reported "duplicate key null" in the donor catalogue table: config and underlying data were both confirmed clean, so a stale cached response, not a query-construction bug, was the leading remaining explanation; a hard reload was recommended as the cheap way to confirm or rule it out before looking further.

### Migrate path aliases from `@/...` to `#...`
fix: switch `tsconfig.json`'s `paths` mapping from `@/*` to Node's subpath-imports-style `#*` (iMicroSeq's portal-ui already does this: `"#*": ["./*"]` plus a narrower `"#virusseq/*"` alias, same `typescript-transform-paths` plugin Stage already has), then rewrite every existing `@/...` import across the codebase to the new prefix. The plugin/tooling side is a small, contained change; rewriting every call site is the actual bulk of the work, and mechanical enough to script (a project-wide find/replace) rather than needing case-by-case judgment.
standalone: yes
context: raised 2026-08-11 while converting this session's new files from relative (`../../`) imports to match Stage's existing alias convention. Confirmed Stage's actual current alias is `@/*`, not `#...`; decided to move to `#...` to match iMicroSeq's portal-ui, but deliberately as its own PR rather than folded into this session's Arranger/catalogue work, since it touches the whole codebase, not just the files this session already changed.

### `dev-services/configs/arranger/donor/facets.json` uses the legacy `__`-escaped field-name form
fix: switch to the raw dotted-path form `extended.json` already uses, and rename the biomarker field to its real hyphenated name (e.g. `ca19-9_level`) while at it, to validate Arranger's GraphQL field-name sanitization (`.dev/docs/arranger/README.md`) against the mixed-convention case in the same pass.
standalone: no
context: raised during PR #257 review as worth doing, not blocking; PR approved to merge without it. Revisit alongside the donor catalogue integration work.

### `dev-services/docker-compose.yml`'s `ARRANGER_TAG` is pinned to an unreleased commit build
fix: bump to a real release tag once Arranger 3.1.0 ships.
standalone: no
context: PR #257 approved to merge with this pin in place; tracked here so it isn't forgotten once 3.1.0 is out.
