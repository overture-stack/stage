# Complementary services for Stage development

Stage is front-end scaffolding. Its data table, facets, and query bar are Arranger UI
components, so they render nothing until a search API is behind them. This directory
supplies that back end for local development: an OpenSearch search engine and an
Arranger search server, preloaded with mock ARGO clinical data.

Stage itself is deliberately not part of this stack. You run it on your host with
`npm run dev`, so the copy you are editing is the one you see in the browser.

```
make up      # start the services and load the data
make down    # stop them, keeping the data
make status  # show what is running
make logs    # follow the Arranger and OpenSearch logs
make reset   # delete the search engine volume and start over
```

| Service    | Port   | Purpose                                                    |
| ---------- | ------ | ---------------------------------------------------------- |
| OpenSearch | `9200` | Search engine; holds `donor-index`                         |
| setup      | -      | Creates the index, loads the mock data, then exits         |
| Arranger   | `5050` | The search API Stage queries, serving the `donor` catalogue |

Both ports bind to `127.0.0.1` only, so they are reachable from your host but not from
your network. The stack has no identity provider, so Stage's login and profile flows
cannot be exercised against it.

## What is in here

- `configs/opensearch/donor-mapping.json` is the index template for `donor-index`,
  including its `donor_centric` alias.
- `configs/arranger/donor/` is the Arranger catalogue: which index to read, and the
  facet and table configuration the UI components use.
- `data/donor.ndjson` is the mock ARGO clinical data, 373 donor documents with nested
  specimen, diagnosis, treatment, follow-up, and biomarker entities. It is already in
  OpenSearch `_bulk` form. The data and configs are taken from the Prelude
  `docs-demo/ai-assisted-data-discovery` demo so the two line up.

The Arranger server serves one catalogue per directory under `configs/arranger`. With a
single catalogue it mounts at the root, `http://localhost:5050/graphql`, and only
switches to `/<catalogue>/graphql` when more than one is registered. Stage reads one
catalogue, so this stack ships one.

See [../docs/setup.md](../docs/setup.md) for the full walkthrough, including the Stage
environment variables that point at these services.

> **Development only.** OpenSearch runs with its security plugin disabled, which is why
> no credentials are needed. Do not use this configuration anywhere network-exposed.
