# Access management UI

Stage has no access-management feature today. iMicroSeq's portal-ui has a working one, and Usher
plans to own this surface as its PAP (Policy Administration Point) layer. This page records what the
existing implementation actually does, so Stage's version can be specified against something real
rather than designed from scratch.

**This is the consuming application's half of a two-document pair.** The plan is that Usher ships
this surface as a reusable UI package, and Stage takes it as a dependency rather than rebuilding it.
Usher's repo holds the implementation design for that package; this page holds what a consuming
portal needs from it, and what the existing reference implementation actually does. Neither document
is the whole picture, and they are co-owned: Usher owns what the package is, Stage owns what a
consumer needs of it.

Read alongside Usher's own design docs in the `overture/usher` repo: `.dev/design/management-ui.md`
(the administration surface) and `.dev/design/profile-view.md` (the self-service surface).

Scope note: this page is about the interface. The policy model underneath it (grants, roles,
custodians, revocation, audit) is Usher's, and lives in their design docs rather than here.

## Why "access management" and not "studies"

"Study" is a domain label, not a concept. Usher's `management-ui.md` states this directly: the UI
presents domain-specific language configured per instance, and in an iMicroSeq instance "resources"
appear as "studies" while roles appear as "study enrolments".

Stage serves arbitrary data models, which is the same reason its Arranger integration resolves
catalogues at runtime instead of hardcoding one. A feature named after one deployment's vocabulary
would contradict that. So this page uses Usher's generic vocabulary throughout, and any Stage
implementation should treat the displayed label as configuration.

## Two surfaces, separated by audience

Usher splits this into two surfaces, and the split is by *whose* access is being acted on, not by
what the screens do:

| Surface | Audience | Question it answers |
| --- | --- | --- |
| Access management | Administrators, coordinators | Who may reach what, and change it |
| Profile | Everyone, including administrators | What do *I* hold |

A person with no administrative standing still has a profile. An administrator's profile is about
their own access, not their authority over anyone else's.

Stage today has the profile page (`/user`) and nothing on the management side.

## Vocabulary mapping

iMicroSeq's implementation predates Usher and uses its own terms. The mapping:

| portal-ui term | Usher term | Notes |
| --- | --- | --- |
| Study | Resource | The thing access is granted over |
| `studyId` | Resource identifier | Also embedded inside scope strings, see below |
| Submitter | Holder | A person with access to a resource |
| Study Access (profile section) | Profile view | The self-service side |

**Usher's category concept has no analogue here, and that is worth knowing before specifying.**
Portal-ui's `sampleType` looks like one and is not: it is a single classification field set once when
a resource is created, and a resource is one classification or the other, never both. Access is a
flat list of holders on the resource. Nobody holds a resource for one category and not another.

So Usher's per-category grant model, which `management-ui.md` describes as "per-category and
multi-valued rather than a single box", has no working precedent in either portal. It is new design,
not a port.

Confirmed by the portal-ui owner against their own code: the management surface contains no
reference to portal-ui's category-style scopes at all. That access split is real in that
application, but it lives in its submission pages and is unconnected to this surface.

## The reference implementation

### Data model

A resource carries an identifier, a display name, an owning organization, a description, a
classification, and a flat list of holders. Source: `global/hooks/useStudiesSvcData/types.ts` in
portal-ui.

### Operations

Four, all against a standalone backing service:

| Operation | Call |
| --- | --- |
| List resources, optionally filtered by classification | `GET /studies?sampleType=` |
| Create a resource | `POST /studies` |
| Add holders to a resource | `POST /studies/submitters` |
| Remove one holder from a resource | `DELETE /studies/submitters?...` |

The add and remove requests carry the resource's classification alongside its identifier. Why the
service requires it is not visible from the UI side.

There is no update operation and no delete-resource operation. Creation and holder membership are
the entire write surface.

Adding holders is plural and removing is singular: the add request carries a list, the remove
request carries one identifier. The UI reflects this, with a bulk-add modal and a per-row removal
confirmation.

### Who may open it

A single scope controls the whole management surface. If the caller's token carries it, the page
renders; otherwise the page renders a 401. The check is one exact-match comparison against a
configured scope string, defaulting to `STUDY-SVC.WRITE`.

This is coarse by design: it is entry to the administrative surface, not per-resource authority.
Nothing in the UI restricts which resources an administrator may act on once inside.

### Error vocabulary

The backing service returns a typed error rather than an HTTP status alone, and the UI maps each
type to its own notification. Nine types: two distinct not-found variants (the resource, and the
holders), resource already exists, holders already hold access, holder does not hold access, one
failure type per write operation, and an `UNKNOWN` catch-all the client also falls back to when a
request throws.

This is worth keeping. A UI that can say "that person already has access" instead of "something went
wrong" needs the service to make that distinction, and Usher's portal-facing contract does not
specify a denial shape yet.

## The profile side, and the mechanism Usher replaces

Portal-ui renders a person's own access in a profile section. It groups by data type, listing the
resource identifiers that person holds in each. An administrator for a data type sees a single
"All studies" entry instead of an enumeration.

**How it knows: it parses the JWT's scope claims in the browser.** Scope strings are shaped
`<prefix><resourceId><suffix>`, with prefix and suffix configured per data type. The scopes are
filtered to those matching one data type's affixes, then the affixes are stripped to recover the
resource identifier. A separate exact-match scope per data type means administrator.

**This is exactly the mechanism Usher's design rules out.** Under Usher, permissions arrive as a JWE
that the browser must never hold or decrypt, so a profile view is built by a server-side bridge that
decrypts and renders, never by the browser inspecting its own token.

**The port boundary sits between two files, and it is not where it first appears.** The parsing lives
entirely in `global/hooks/useAuthContext.tsx` (`extractScopes`, plus the per-data-type admin
exact-match checks). `components/pages/user/StudyAccess.tsx` does no token handling at all: it
destructures already-computed values from that hook and renders them.

So the rendering component is the *reusable* half, and would likely need no change if fed the same
shape of data from a server-side source. The hook's scope extraction is the half with no future
under Usher.

Two consequences for Stage:

- Replacing the data source is the whole job; the view is not the problem. That read is Usher's first
  open question in `profile-view.md`: either the bridge exchanges for its own audience, or the
  controller grows a read endpoint for a principal's own state.
- Usher's positive-only rule applies: show what someone holds, never what they lack. The absence of
  a grant discloses that restricted data exists at all. Portal-ui already renders positive-only, but
  incidentally rather than as an enforced rule, since a token only carries scopes a person has.

## What Stage has that portal-ui does not

Stage's `/user` page already holds the API token surface: generate a token, revoke it, see its
expiry, and derive the scopes it will carry from the caller's current permissions.

That last part matters for sequencing. **Stage already performs the "what permissions does this
caller hold" read today**, to compute what a token may carry, and then discards the result without
rendering it. The profile view is closer to a rendering gap than a new feature.

## What Stage needs from a shared package

Constraints that already hold in Stage, so the package is designed against them rather than
discovering them at integration time. None is a preference. **All five are agreed with Usher.**

- **It must theme to the host, and not through a CSS-in-JS theme object.** Stage styles through an
  Emotion theme object today, and Arranger's components are fed a theme that way. That is not the
  target: Stage's component foundation is decided as shadcn, which pairs with Tailwind, and
  `.dev/docs/atlas/roadmap/ui-component-library.md` names Emotion's CSS-in-JS runtime as a reason
  for choosing it. A package taking a JS theme object would be built against the system Stage is
  leaving, and would need re-theming at the migration.

  **CSS custom properties are the interface that survives the migration.** Tailwind v4 defines its
  theme as custom properties, shadcn's convention is CSS variables for colour, and Emotion styles
  can read `var(--x)` perfectly well. So a package styled from custom properties can be themed by a
  host in either system, which is the only option that is correct before and after Stage moves.
- **It must not hardcode a data model or a vocabulary.** Stage resolves Arranger catalogues at
  runtime specifically so that no data model is baked in. A package naming one deployment's concepts
  in its rendered output would reintroduce exactly what that work removed.
- **Its data source must be injectable.** Stage reaches backends through its own Next.js API routes
  rather than calling them from the browser, and under Usher the permissions read has to be
  server-side regardless. A package that fetches directly from the browser could not be used here at
  all; one that renders from data it is handed can.
- **It should render components, not assume routes.** Stage's navigation is four pages and a
  two-item user menu. Where an administrative surface sits in that is Stage's decision, so the
  package should not assume it owns a route or a menu.
- **It must not need its own store seeded.** Everything rendered should derive from what Usher
  returns plus what the host injects. A package holding its own copy of any fact makes the host
  maintain two sources for it. Raised by Usher as the consumer-side twin of a decision already made
  on their side.

### The package is a pure rendering layer, and the guarantees split in two

Settled with Usher. The host fetches and the package renders what it is handed. The immediate
question that raises is where the positive-only guarantee lives, if the layer that draws the screen
no longer fetches for it.

**It lives in Usher's endpoint, and always did.** The read returns what a principal holds and
nothing else, so neither a host nor a package can obtain what someone lacks, and therefore neither
can render it. A fetching package would not have protected anything the endpoint does not already
protect.

What the package does make structural is narrower and still worth having: **the rendering choices
that leak even when the data is correct.**

- No count that implies a denominator. "Three of seven resources" discloses that seven exist, while
  every value in it came from a correct positive-only response.
- No affordance for something the viewer cannot reach.
- No empty state that distinguishes "nothing here" from "nothing for you".

So: Usher's endpoint owns what the data contains, the package owns what the rendering implies. Two
guarantees in two places. Those rendering choices are easy to get independently wrong in two
codebases, which is the actual argument for one package.

**This also keeps the bridge on the host's side.** The host decrypts, because the host has the
server side and the key. The package never sees a token.

## Open questions for Stage

- **Where the management surface lives.** Portal-ui gives it a top-level route gated by a scope.
  Stage's navigation is four pages and a two-item user menu, so adding an administrative section is
  a navigation decision, not just a page.
- **The package's input type, which is now the whole contract.** Because the package renders what it
  is handed, the read shape is not an agreement between the package and Usher: it is the component's
  props. Usher's endpoint produces that type and the host pipes it through, so specifying the props
  specifies the contract. This is the concrete next step, and it is a more tractable conversation
  than designing an endpoint in the abstract.
- **How the host supplies the displayed vocabulary.** That labels are configurable rather than baked
  in is settled from both sides. The mechanism is not: Usher records deploy-time environment
  variables, a settings page, or a config file as the open options.
- **How an administrator finds a person to grant access to.** Portal-ui takes typed identifiers.
  Usher records IdP user-directory search as an open question, including what happens when someone
  exists in the policy store but no longer in the IdP.
