# Development guide

## Repository structure

```
.
├── /components/     UI elements: theme/, utils/, and page-specific components under pages/
├── /global/         hooks/ and utils/ shared across the app: auth, URL state, env constants
├── /pages/          Next.js Pages Router routes: explorer/, login/, user/, api/ proxy routes
├── /public          static assets
└── /tests           Jest tests
```

See `docs/overview.md` for the fuller architecture description (published at [docs.overture.bio](https://docs.overture.bio/develop/Stage/overview)).

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) v8.3.0 or higher
- [Docker](https://www.docker.com/) v4.39.0 or higher
- GitHub CLI (`gh`), authenticated: any agent working in this repo uses `gh` for PRs and issues on your behalf; without it, your first GitHub-related request will stall on an auth prompt instead of just working

## Setup

1. If `gh auth status` doesn't already show you logged in, run `gh auth login` once per machine.
2. `npm install`
3. Copy `.env.schema` to `.env.local` and fill in the required values (Keycloak, Arranger, and Ego endpoints; see `.env.schema` for the full variable list). Never commit real values.

## Running the project

- `npm run dev`: local dev server (`next dev`)
- `npm run build && npm start`: production build and serve

## Running tests

- `npm test` (Jest)

## Working documents

The `.dev/` directory contains living documents maintained alongside the codebase:

- `.dev/roadmap.md`: planned features and architectural direction; read at session start
- `.dev/tech-debt.md`: known issues, scope-adjacent problems, and deferred work
- `.dev/sessions/`: one file per contributor per day (`YYYY-MM-DDTHHMMSS.md`), brief log of what changed and why
- `.dev/docs/`: service-specific deployment notes and operational guides; indexed at `.dev/docs/index.md`; one subdirectory per service (e.g. `.dev/docs/postgres/`, `.dev/docs/kafka/`)

Read the `.dev/` files at the start of each session before beginning work. Read the relevant `docs/<service>/` guide before deploying or debugging a specific service. Update these at the end of any session that produces meaningful output.
