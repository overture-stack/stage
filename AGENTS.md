<!-- agentics-template-version: 0.11.0 | synced: 99d04abec4e1cbc4fe959d1af0953cf7e08f38c9 -->
# Agent collaboration conventions

**For AI agents:** this file is instructions your agent reads and follows; it is not documentation written for people. If you're a person looking for how this project works, see this project's own `README.md` or `DEVELOPMENT.md` instead.

Adapted from [softeng/agentics](https://github.com/oicr-softeng/agentics). This is the canonical source for this project's conventions, agent-neutral by design. `CLAUDE.md` exists only because Claude Code loads it automatically; it points here rather than keeping its own copy of anything.

## Interaction parameters
- Ask clarifying questions before making large assumptions about intent
- Check in before non-trivial decisions: it gives the user a chance to catch design misalignments early, before code exists or a document is rewritten, not only before writing code. Don't over-ask on mechanical steps, but do ask on direction
- Surface ideas, improvements, or next steps you already see, unprompted: don't wait for an open-ended question to draw them out. Covers alternatives to what's about to be implemented, a shipped fix that still has the weakness it just fixed, or anything else obvious in hindsight; let the user decide. See agentics' `CHANGELOG.md` § `deterministic-by-design` for the case that named this gap
- Push back on bad ideas and identify blind spots before they are baked into code: lead with the objection, not a neutral trade-off list; don't wait to be asked
- Sanity check requests: not just the literal phrase. A yes/no-shaped question ("does this make sense," "am I right," "am I missing anything") is still a sanity check when its actual function is inviting scrutiny of the user's own idea, reasoning, or plan, not a literal yes/no about the world. Answer the intent, not the grammar: review the whole conversation as relevant, not just the latest message, and surface gaps, blind spots, unresolved threads, and edge cases plainly; a shallow "yes" isn't an answer
- Default review or audit posture: assume there's something real to find, not that the artifact is fine until proven otherwise, the same reason a neutral "does this look okay" or "is this done?" invites confirming over searching. This is a search stance, not a quota: a manufactured nitpick, technically true but inconsequential, just to have something to report, is worse than finding nothing; surface a finding only if it concretely matters. See `conventions/review-conduct.md` for PR/ticket-review specifics, `conventions/definition-of-done.md` for the completion-checklist specifics, and your own memory for any standing self-audit trigger you maintain
- Verify purpose alignment before implementing: when a task names a goal, check whether the chosen approach achieves that goal directly, not just something adjacent to it; lead with that gap as an objection before writing anything
- Flag scope-adjacent issues verbally, then document them in `.dev/tech-debt.md`

## Critical constraints
- No credentials, secrets, or private URLs in any file: ever
- Library/module code must not read from the environment; configuration belongs at the application boundary, passed in as typed parameters
- Do not modify `CLAUDE.md`, `AGENTS.md`, or other instruction files without explicit instruction from the developer: surface suggestions, do not self-edit
- No machine- or user-specific absolute paths, usernames, or individuals' real names in committed files. If your agent's global context adds a reference to a local resource keyed by machine or clone location (e.g. a per-project memory path), use a generic placeholder, not the resolved path: it will not exist for another developer, another machine, or after the repo moves. Before committing, grep the diff for your own OS username, git identity, and any personal fork name you know is yours: this has leaked into committed docs before
- Name code, not people: attribute work in session files, tech-debt entries, docs, and any other persisted content to features, modules, and systems, not to individuals. Attribution belongs in git history, not in documents

## Project notes
- Next.js 12 (Pages Router) + React 17 scaffold for Overture-suite data portals, styled with Emotion; `next-auth` + Keycloak handle identity
- Structure: `components/` (UI, page-specific components under `components/pages/`, `theme/`), `pages/` (Next.js routes: `explorer`, `login`, `user`, `api` proxy routes), `global/` (`hooks/`, `utils/`: auth, URL state, env constants), `tests/` (Jest)
- Integrates with Arranger Server/Components for search UI (GraphQL over Elasticsearch); version and integration details live in `package.json`, not here, since they change independently of these conventions
- `origin` pushes directly to `overture-stack/stage` (the real upstream), not a personal fork: no separate publish/mirror step, but the global per-chat feature-branch convention still applies

## When to read what

Every path below is a live pointer into agentics or your own global context, never a local copy to create in this project: see `conventions/convention-levels.md` § How much to keep locally for the full rule.

- Starting a session              -> read `conventions/session-discipline.md` (also covers git/commit rules), then the `.dev/` files it specifies, and `conventions/writing-style.md` (applies to any output, dev or not, so it's read unconditionally rather than gated behind "Writing code" below)
- Working in a specific role      -> read `CLAUDE.roles/<role>.md` (set during initialization; skip if role is already defined in global context)
- Writing or reviewing tests      -> read `conventions/testing.md`
- Writing code                    -> read `conventions/code-style.md`
- Working on Arranger integration (explorer pages, SQON, facets, search UI) -> read `.dev/docs/arranger/README.md`
- Reviewing a PR or change        -> read `conventions/code-style.md`, `conventions/code-review.md`, `conventions/review-conduct.md`
- Writing or updating docs        -> read `conventions/documentation.md`
- Security-relevant work          -> read `conventions/security.md` (credentials policy, supply chain, quick threat model), then `conventions/security-guidelines.md` (full OWASP patterns and code review triggers)
- softeng team member             -> read `CLAUDE.softeng.md` at session start
- Overture project                -> read `CLAUDE.overture.md` at session start
- Adding or improving a convention -> read `conventions/convention-levels.md`
- Upgrading this project's agentics integration -> read `conventions/upgrading-adoption.md`
- Deploying or debugging a service -> read `.dev/docs/<service>/` if it exists
- Finishing a task, or asked "is this done?" -> read `conventions/definition-of-done.md`

## Memory and contribution hygiene
When writing to project memory: keep entries concise; store no content derivable from code or files. If an insight could apply to all your projects, offer to promote it to your agent's global context. If a convention could benefit other teams, flag it as a potential PR to the agentics repo.

## Initialization
If no project memory exists for you in this project yet:
1. Check whether you have access to a cross-project map in your agent's global context. If yes, read it for cross-project relationships. If no and the user works across multiple projects, offer to set one up (see `global-context/projects.md` in the agentics template for the recommended format).
2. Ask: "What best describes your primary work on this project?": developer / bioinformatician / AI engineering / general (non-code work) (or describe it). If the answer is already in your global context, skip this question. Otherwise read the matching file in `CLAUDE.roles/`.
3. Ask: "Are you part of the softeng team?": if yes, apply conventions from `CLAUDE.softeng.md` on top of your role conventions. Skip if already known from global context.
4. Ask: "Is this an Overture project?": if yes, apply conventions from `CLAUDE.overture.md` on top of your role conventions. Skip if already known from global context.
5. Ask: "Do you already have agent conventions for this project?": if yes, treat these conventions as supplementary; defer to your existing setup on conflicts.
6. Ask: "Would you like me to suggest when conventions could be useful beyond this project?": record as `propagation_suggestions: yes | no` **in your global context, not just this project's memory** — it's a default that applies to every project you work in, not only this one. Skip if already known from global context.
Record role, softeng-team, Overture-project, and existing-setup answers in project memory; record `propagation_suggestions` in global context per above. A specific project can still locally override the global default later (recorded in that project's own memory instead); when both exist, the project-level record wins for that project only. Do not ask again.
