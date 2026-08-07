# Tech debt

## Open

### Tests live in `tests/` not co-located with source
fix: relocate `tests/index.test.js` next to the source file it tests, renamed to match the `.test.ts`/`.test.js` co-location convention; apply the same placement to any new test going forward. See `conventions/session-discipline.md` (agentics) § Tech-debt entry format.
standalone: yes

### Stack is on older majors: Next.js 12, React 17
fix: no immediate action; plan an upgrade pass (Next.js 13+/14+, React 18) when there's room, since newer library APIs (including future Arranger releases) may assume a newer major. Check `package.json` again before starting, this snapshot may already be outdated.
standalone: yes

### `ARRANGER_CATALOGUE` is hardcoded to `'donor'` in `components/pages/explorer/index.tsx`
fix: replace the hardcoded constant with a real, portal-configurable value once Stage's catalogue-configuration story is decided (this app is reused as scaffolding across deployments, so a single hardcoded catalogue ID doesn't generalize). Likely a new env var (e.g. `NEXT_PUBLIC_ARRANGER_CATALOGUE`) threaded through `getConfig()`/`.env.schema` the same way `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE` already is. Prefer populating it with the real catalogue ID over a `documentType`, even though Arranger's server can now resolve an unambiguous `documentType` too (see `.dev/docs/arranger/README.md`): the catalogue ID is guaranteed unique, `documentType` isn't, and a deployment that reuses a `documentType` across catalogues would otherwise get a `409` at request time instead of just working.
standalone: no
context: deliberately temporary, added while testing the new `catalogue` prop on `ArrangerDataProvider` against a locally-linked Arranger dev build (`npm run link:Arranger`) that isn't published yet. Revisit once that lands in a real release and Stage's own multi-catalogue support is scoped.

### `arrangerFetcher.ts` is POST-only and doesn't forward `signal`
fix: two independent gaps, only relevant if this fetcher is ever passed as `useArrangerConfig`'s `apiFetcher` (not done today; `documentType` is still hardcoded, so the hook never fires). (1) The underlying call is `ajax.post(...)`, hardcoded regardless of the `method` field in `APIFetcherFn`'s args; `useArrangerConfig` sends `method: 'GET'`, which would go out as a POST. Needs a real `method` (default `'post'`) threaded into the `ajax` call. (2) Forward `signal` (an `AbortSignal`, new on `APIFetcherFn`) to the underlying request, so a superseded request can be cancelled outright rather than just having its result ignored; best-effort, not required for correctness (see `.dev/docs/arranger/README.md`).
standalone: yes
context: the routing half of this file's original bug (root cause of the `/api/arranger/graphql/Arranger-ConfigsQuery` 404 diagnosed against the dev multicatalogue server) is fully fixed now: `arrangerFetcher.ts` takes `catalogue` at creation time (passed from `explorer/index.tsx`'s `ARRANGER_CATALOGUE`) and builds the proxy path directly from it, no longer re-derives anything from a per-call `url`. The POST-only limitation isn't new: it's the documented reason `checkArrangerCatalogue`/`index.tsx` already bypasses `arrangerFetcher` entirely for its own introspection call, rather than something just found.

### `arrangerFetcher.ts`'s response cache never invalidates or scopes by caller
fix: same design gap, same fix shape as Arranger's own `defaultApiFetcher` (see arranger repo `.dev/tech-debt.md` § `defaultApiFetcher`'s response cache never invalidates or scopes by caller): scope the cache per consumer/context instead of one `Map` for the fetcher's whole lifetime, and/or add a TTL or explicit invalidation hook.
standalone: yes; independent of the other `arrangerFetcher.ts` entries above, though touches the same file
context: `createArrangerFetcher`'s `cache` (a `Map`, keyed by `JSON.stringify(args)`) has no TTL and no invalidation, already flagged by its own `// TODO: max cache size` comment. Because the fetcher instance is created once and its closure (cache included) persists across Fast Refresh, a request cached before an unrelated fix landed can keep being served afterward, for as long as the same request shape recurs, with nothing to force a refresh short of a full reload. Raised (2026-08-06) while investigating a reported "duplicate key null" in the donor catalogue table: config and underlying data were both confirmed clean, so a stale cached response, not a query-construction bug, was the leading remaining explanation; a hard reload was recommended as the cheap way to confirm or rule it out before looking further.

### `NEXT_PUBLIC_ARRANGER_INDEX` is now unused
fix: remove the env var from `global/config.ts`, `.env.schema`, and any docs mentioning it (`DEVELOPMENT.md`, `docs/setup.md`), once confirmed no other consumer needs it.
standalone: yes
context: was only ever read for the old `hasValidConfig` check and its error display, both replaced by `GET /introspection`-based catalogue validation (keyed on catalogue ID, not the ES index name). Left in place for now since removing it touches files beyond the donor-path scope of that change.

### `dev-services/configs/arranger/donor/facets.json` uses the legacy `__`-escaped field-name form
fix: switch to the raw dotted-path form `extended.json` already uses, and rename the biomarker field to its real hyphenated name (e.g. `ca19-9_level`) while at it, to validate Arranger's GraphQL field-name sanitization (`.dev/docs/arranger/README.md`) against the mixed-convention case in the same pass.
standalone: no
context: raised during PR #257 review as worth doing, not blocking; PR approved to merge without it. Revisit alongside the donor catalogue integration work.

### `dev-services/docker-compose.yml`'s `ARRANGER_TAG` is pinned to an unreleased commit build
fix: bump to a real release tag once Arranger 3.1.0 ships.
standalone: no
context: PR #257 approved to merge with this pin in place; tracked here so it isn't forgotten once 3.1.0 is out.
