# Arranger integration

What this app actually depends on from the Arranger project, and where to look for anything not covered here. Written from the Arranger side, so it reflects the current implementation, not just this app's usage of it; re-verify against Arranger's own docs before relying on version-specific detail, since `arranger-components` here is pinned to whatever version `package.json` currently says.

## What Arranger is

A GraphQL (and REST introspection) search API over Elasticsearch/OpenSearch, config-driven per catalogue (`base.json`, `extended.json`, `facets.json`, `table.json`). Can serve one catalogue at a flat `/graphql` path, or multiple catalogues under `/{catalogueId}/graphql` (multicatalogue mode). Check the deployed Arranger's `GET /introspection` response to see which mode is active and what paths are actually registered, rather than assuming.

Canonical docs: https://docs.overture.bio (Arranger section) and `docs/reference/` in the [Arranger repo](https://github.com/overture-stack/arranger) (renamed from `docs/usage/` on 2026-08-04).

## What this app consumes

Only `@overture-stack/arranger-components` is an explicit dependency (`package.json`); there is no direct dependency on `@overture-stack/sqon`. The actual import surface, confirmed against the current explorer pages:

- `components/pages/explorer/index.tsx`: `ArrangerDataProvider` (wraps the explorer page's data/query context)
- `components/pages/explorer/QueryBar.tsx`: `SQONViewer`, `useArrangerTheme`
- `components/pages/explorer/PageContent.tsx`: `useArrangerData`, and `SQONType` from `@overture-stack/arranger-components/dist/DataContext/types.js`
- `components/pages/explorer/RepoTable.tsx`: table types (`CustomExporterInput`, `UseThemeContextProps`) and `FieldName` from `@overture-stack/arranger-components/dist/SQONViewer/helpers.js`
- `components/pages/explorer/Facets.tsx`: `Aggregations`, `useArrangerTheme`

**SQON typing goes through `arranger-components`'s own internal dist path**, not the standalone `@overture-stack/sqon` package. Arranger's own SQON logic (operator metadata, the query builder, JSON Schema) has been consolidating into that standalone package; if a future `arranger-components` release re-exports from it directly instead of defining its own local type, this import path would need updating.

**Fixed bug directly relevant to `Facets.tsx`'s `Aggregations` usage (2026-08-05):** `Aggregations` used to ignore `DataProvider`'s resolved `apiUrl` entirely, always querying the fetcher's own unscoped default regardless of `catalogue` (or even a plain, non-default `apiUrl`). Confirmed as a real gap, not theoretical: the main table correctly went through `DataProvider`'s `fetchData`, while facet panels had their own separate, unscoped query path. Fixed upstream by threading `apiUrl` through `Aggregations` → `AggsQuery` → the underlying `Query`'s `url`. No action needed on this app's side beyond picking up the fix once it's in whatever `arranger-components` build/release this app pins; worth confirming facets behave correctly (not just the table) whenever this app's own multicatalogue support is smoke-tested, since this is exactly the kind of thing that looks fine on the table and silently wrong on facets.

## GraphQL field name sanitization (Arranger 3.1)

Field names with characters GraphQL can't use as identifiers (a hyphen, a leading digit, both seen in real clinical/biomarker naming) are now sanitized automatically before schema generation: `biomarker.ca19-9_level` becomes a valid identifier instead of crashing schema generation entirely. Two things worth knowing if a field ever looks different than expected here:

- Aggregation field names flatten nested/object paths with `__` (e.g. `biomarker__ca19_9_level` for an aggregation on `biomarker.ca19-9_level`), a naming pattern that shows up anywhere this app reads an aggregation's GraphQL field name directly.
- The sanitization is transport-level only. Server-side config (`extended.json`/`table.json`/`facets.json`) still references fields by their raw dotted path; nothing on this app's side needs to know the sanitization rule itself, only that a GraphQL field name and its underlying ES field path aren't always character-for-character identical.

## Startup config check: migrated off `hasValidConfig` to `GET /introspection`

`components/pages/explorer/index.tsx` used to call the deprecated `hasValidConfig(documentType, index)` GraphQL query as a startup preflight check, coupling validity to the raw ES index name. It now calls `GET /introspection` directly (via `ajax`, not the shared `arrangerFetcher`, since that helper is POST-only) and picks whichever catalogue is available through the pure `resolveArrangerCatalogue` helper in `resolveArrangerCatalogue.ts` (BDD-style tests co-located alongside it). Matches on catalogue ID (the `catalogs` object key), not `documentType`, since a server can register more than one catalogue under the same document type. See the Arranger repo's `docs/migration/v3.1.md` § "Recommended migrations" for the pattern this followed.

**The catalogue ID is resolved at runtime, not hardcoded** (fixed 2026-08-10, see `.dev/tech-debt.md`'s now-closed entry): Stage is data-model agnostic, so it can't assume a fixed catalogue ID any more than it can assume a fixed document type. `resolveArrangerCatalogue` picks the single available catalogue from the introspection response when there's exactly one; when there's more than one, `explorer/index.tsx` shows `CataloguePicker` (2026-08-11), autopopulated from `resolveArrangerCatalogue`'s `catalogueIds`, and holds the choice in the `catalogue` URL query param so it's shareable and survives a refresh, rather than resetting to a picker every load. `ArrangerDataProvider` gets a `catalogue` prop either way, scoping its requests to `{apiUrl}/{catalogue}/graphql`.

`NEXT_PUBLIC_ARRANGER_CATALOGUES` (renamed 2026-08-11 from `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE`), a comma-separated list, optionally restricts `resolveArrangerCatalogue` to catalogues matching one of the given values by ID or document type, instead of every catalogue `GET /introspection` reports as available; empty or unset keeps the fully automatic behaviour. `documentType` itself is resolved from the same introspection response, per catalogue, not passed through `useArrangerConfig`'s own internal fallback: see that section below for why, a real, confirmed incompatibility, not a style choice.

**Server-side identifier resolution, added after the above shipped (2026-08-04):** `GET /introspection/:catalogueId` and `/{catalogueId}/graphql` now also accept a `documentType` in that path segment, provided it names exactly one catalogue on the server; a real catalogue ID is checked first and always wins, so this can't introduce a wrong-catalogue routing bug. Not something this app relies on: `resolveArrangerCatalogue` above always resolves and passes a real catalogue ID, never a `documentType`, so the `409 ambiguous_document_type` fallback path is Arranger's own safety net for other consumers, not something Stage's own resolution needs. Full contract: `docs/concepts.md` and `docs/reference/05-introspection.md` in the Arranger repo.

## `useArrangerConfig`: `DataProvider`'s own config/validity resolution (shipped 2026-08-05)

**Tried directly (2026-08-11), and confirmed incompatible with this app's proxy setup, not just left unmigrated for convenience.** `ArrangerDataProvider`'s `documentType` prop is optional: omit it (with `catalogue` given instead) and the provider resolves `documentType` itself via `useArrangerConfig` internally, calling `GET /{catalogue}/introspection` through whatever fetcher is passed as `customFetcher`. Wiring this in (passing `arrangerFetcher` as `customFetcher`, omitting `documentType`) breaks for two confirmed, compounding reasons, both in `.dev/tech-debt.md`:

1. `arrangerFetcher.ts` hardcodes `ajax.post(...)`, ignoring the `method: 'GET'` this hook's bootstrap call sends.
2. That same bootstrap call passes `url: apiUrl` (deliberately unscoped) plus `endpoint: `${catalogue}/introspection`` (manually pre-prefixed), since it's the call that confirms catalogue validity in the first place, nothing is scoped yet. `arrangerFetcher.ts` ignores `url` by design (it must route through this app's own proxy, not Arranger's resolved host, see the git-archaeology section below) and rebuilds the URI from its own creation-time `catalogue` value instead, producing a double-prefixed, 404ing path. Confirmed directly with Arranger: their `APIFetcherFn` contract is correct as documented (now with an explicit exception for this bootstrap call, added after this exact incident), the incompatibility is specific to a proxy-routing fetcher like this one.

**What this app does instead:** `explorer/index.tsx` resolves `documentType` itself from the same `GET /introspection` response it already fetches for catalogue discovery, since that response already includes a `documentType` per catalogue, and passes it to `ArrangerDataProvider` explicitly. No extra request, and the incompatibility above never gets exercised. `useArrangerConfig` is also exported standalone, for validating a catalogue without wiring it into a `DataProvider` at all, unaffected by this, if that shape is ever useful independent of `customFetcher`.

## Where to look next

- Arranger's `docs/reference/` (introspection API, SQON query processing, feature flags, defaults and limits; renamed from `docs/usage/` on 2026-08-04, update any bookmarks)
- Arranger's `docs/migration/` for anything version-specific to whichever `arranger-components` version is currently pinned in `package.json`
- Arranger's `.dev/tech-debt.md`/`.dev/roadmap.md` for known issues or in-progress redesigns, e.g. the hits/edges/nodes response shape is a planned breaking change tracked there, that would eventually affect this app's own data-fetching code
- Arranger's `.dev/docs/components-multicatalogue.md`: the fuller design history behind the `useArrangerConfig` section above, plus a deep-`dist/`-import type-export fix prompted by this app's own explorer components' deep `arranger-components/dist/*` type imports (unaffected by the config-check migration, its own separate follow-up)

## `APIFetcherFn` gained a `signal` field (2026-08-05)

The fetcher contract now also accepts an optional `signal` (`AbortSignal`), which
`useArrangerConfig` passes so a superseded request (e.g. `catalogue` changing) can be cancelled
outright rather than just having its result discarded. `arrangerFetcher.ts` doesn't forward it,
moot for the reason above: this app doesn't route `useArrangerConfig` through `arrangerFetcher`
at all. Best-effort either way: `useArrangerConfig` still guards against applying a stale result
even without real cancellation, so nothing would break by leaving it unhandled if that changes.

**Note, corrected 2026-08-06:** this section previously described a `url`-forwarding fix via a
`resolveCatalogueSuffix` helper. That approach was superseded before ever being committed: see
"Why `arrangerFetcher.ts` proxies at all" below for what actually shipped, passing `catalogue`
in at creation time instead of re-deriving it from `url` per call.

## Why `arrangerFetcher.ts` proxies at all, and the fix applied on top of the one described above (2026-08-06)

**The proxy exists for auth, traced via git history, not assumed.** `arrangerFetcher.ts` originally
(commit `e689116`, "update to Arranger v3", 2023-05-31) called the real Arranger host directly:
`urlJoin(NEXT_PUBLIC_ARRANGER_API, endpoint, endpointTag)`, no proxy at all. Five months later,
commit `5826af9` ("refactor auth provider logic to add keycloak", 2023-10-24) switched it to
`urlJoin(INTERNAL_API_PROXY.ARRANGER, endpoint, endpointTag)` instead: almost certainly so a
server-side hop (Stage's own Next.js API route) can attach a Keycloak session token the browser
itself shouldn't hold. `explorer/index.tsx`'s `apiUrl={NEXT_PUBLIC_ARRANGER_API}` on
`ArrangerDataProvider` was never updated to match; confirmed via `git log -S`, that line has
exactly one commit in its entire history, the original one. It's been a stale value the fetcher
ignored completely for about two years; it only started mattering again because multicatalogue
needs the fetcher to read `url` at all, which is what `resolveCatalogueSuffix` exists to bridge.

**Applied: give the fetcher the catalogue explicitly, at creation time, instead of
reverse-engineering it from a per-call `url`.** `ARRANGER_CATALOGUE` was already in scope in
`explorer/index.tsx` at the exact point `createArrangerFetcher({})` is called; now passed straight
through (moved above the fetcher's own declaration, since it needed to be in scope there first):

```diff
- const arrangerFetcher = createArrangerFetcher({});
+ const arrangerFetcher = createArrangerFetcher({ catalogue: ARRANGER_CATALOGUE });
```
```diff
- const createArrangerFetcher = ({ onError = ..., defaultHeaders = {} } = {}) => {
+ const createArrangerFetcher = ({ catalogue, onError = ..., defaultHeaders = {} } = {}) => {
    ...
-   const { body = {}, endpoint = '/graphql', endpointTag = '', headers = {}, url = ... } = args;
-   const catalogueSuffix = resolveCatalogueSuffix(url, NEXT_PUBLIC_ARRANGER_API);
-   const uri = urlJoin(INTERNAL_API_PROXY.ARRANGER, catalogueSuffix, endpoint, endpointTag);
+   const { body = {}, endpoint = '/graphql', endpointTag = '', headers = {} } = args;
+   const uri = urlJoin(INTERNAL_API_PROXY.ARRANGER, catalogue ?? '', endpoint, endpointTag);
```
`resolveCatalogueSuffix.ts` and its test are deleted; the `NEXT_PUBLIC_ARRANGER_API`/`getConfig`
import is gone from this file entirely, since it no longer needs to know the real host even for
comparison. This also lines up with the server's own
"accept `catalogueId` or `documentType`" resolution (`docs/reference/05-introspection.md` in the
Arranger repo): `ARRANGER_CATALOGUE` gets passed straight through as the path segment either way,
and the server resolves or rejects it; Stage's existing `catalogueError`/`isArrangerCatalogueAvailable`
handling deals with whatever comes back, no client-side disambiguation needed.

**Why this is more correct, not just simpler:** the previous, now-removed version still partially
trusted `url`: it extracted a suffix from whatever `DataProvider` computed, so a bug in that
computation would still have propagated. Passing `catalogue` explicitly at creation time means the
request's destination comes from exactly one source: the value this app's own code configured,
completely decoupled from whatever `url` the fetcher happens to be called with. A first draft of
this redesign proposed letting the fetcher trust `url` directly (no `catalogue` param at all),
which would have been a real regression: it would only stay proxy-safe as long as every future
caller of this fetcher remembers to pass a proxy-scoped `apiUrl`, rather than the fetcher
enforcing that invariant itself regardless of what it's told. Passing `catalogue` explicitly gets
the simplification without that regression.

**Does not affect `RepoTable.tsx`'s download link, already independently correct.**
`Table/DownloadButton` (in `arranger-components`) reads `apiUrl` directly off context to build a
default download URL, submitted via a hidden-iframe form (a real browser navigation, invisible to
any custom fetcher, since it never goes through `apiFetcher` at all). `RepoTable.tsx` already
overrides this explicitly (`downloadUrl: urlJoin(apiHost, 'download')` with
`apiHost: INTERNAL_API_PROXY.ARRANGER`), so downloads are already proxy-routed today regardless of
what `apiUrl` says or what the fetcher redesign above does. Still worth pointing
`ArrangerDataProvider`'s `apiUrl` at `INTERNAL_API_PROXY.ARRANGER` (not the real host) as a safety
net for any future page that renders `DownloadButton` without bothering to override its theme
`downloadUrl`, even though neither the redesigned fetcher nor this app's current pages actually
read `apiUrl` for anything today.

**Implemented 2026-08-06.**
