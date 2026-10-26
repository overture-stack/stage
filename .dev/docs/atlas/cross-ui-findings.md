# Cross-UI findings: patterns and lessons from sibling Overture-family portals

Findings surfaced while reviewing or reusing patterns from other Overture-family and Overture-adjacent UI apps, not tied to any one Stage feature, so they live here rather than scattered across individual roadmap or tech-debt entries. Grows as more sibling UIs get reviewed (iMicroSeq's portal-ui today; Lyric's new UI and others as they come up).

One sibling finding lives in its own file rather than as a section here, because it is long enough to warrant one: [system alert banners from environment config](system-alert-config.md), the validation and transport failure modes an ARGO gateway implementation hit, written to the pattern for a feature Stage does not have yet.

Lyric's UI package is covered with the library plans instead, because its findings are requirements for the library this repo will extract: [packaging the library so it does not break its hosts](roadmap/ui-component-library.md#packaging-the-library-so-it-does-not-break-its-hosts).

## iMicroSeq portal-ui's `NavBar/Dropdown.tsx`: portable mechanics, not a portable data shape

Looked at directly (2026-08-11) while scoping a possible Arranger multicatalogue picker for Stage's explorer page.

**The component itself is generic and portable.** Theme-driven styling (Emotion, matching Stage's own setup), click-outside handling, takes a plain `data: ReactNode[]` to render as a list under a toggle button. Its two dependencies both have close equivalents already in Stage: a `TransparentButton` (Stage has `components/Button.tsx`, no transparent variant yet, a small addition not a new primitive) and a `ChevronDown` icon (Stage already has `components/theme/icons/chevron_down.tsx`).

**Its actual usage isn't a dynamic picker, and copying that part would reintroduce the exact hardcoding it's meant to remove.** iMicroSeq's own "Explore Data" dropdown hardcodes two known datasets as separate nav links to separate routes (`Clinical-VirusSeq`, `Environmental-Wastewater`), authored by hand per dataset. For Stage's catalogue picker, the reusable part is the dropdown component; the `data` array itself needs to be generated from `resolveArrangerCatalogue`'s resolved catalogue IDs at runtime, with each entry switching which catalogue the same explorer page is bound to, not routed to a distinct page per catalogue. See `.dev/tech-debt.md`'s multicatalogue-picker entry.

## iMicroSeq portal-ui's access-management feature: the same split, in the same place

Looked at directly (2026-09-16) while documenting what Stage needs from Usher's access-management
UI package. Full writeup: [`../usher/access-management-ui.md`](../usher/access-management-ui.md).

**The split lands identically to the dropdown finding above, which is the point of recording it
twice.** The rendering component is portable and the data derivation is not. Portal-ui's profile
section showing "what access do I hold" does no token handling at all: it takes already-computed
values and renders them, so it survives a move to a completely different data source essentially
unchanged. The derivation sits in a separate hook, which parses JWT scope claims in the browser
(filter scopes by a configured prefix and suffix, strip the affixes to recover an identifier), and
that mechanism has no future under Usher, where permissions arrive as a JWE the browser never
decrypts.

**Two reviews of the same sibling app, two findings of the same shape.** In both cases the first
reading attributed the non-portable behaviour to the component rather than to what feeds it, and in
both cases the correction shrank the work: "replace the data source, the view is fine" rather than
"this component is not portable". Worth carrying into the next sibling review as a prior rather than
a discovery: **assume the view is portable and the derivation is not, then look for where the
derivation actually lives, because it is usually not in the file named after the feature.**

**One thing that did not port, and its absence is the finding.** Usher's design has a per-category
grant model, where access within a resource is multi-valued rather than a single toggle. Portal-ui
looks like it implements that and does not: its `sampleType` is a single classification set once at
resource creation, and access is a flat list of holders. So that part of Usher's model has no
working precedent in either portal and is new design rather than a port. Confirmed by portal-ui's
owner against their own code after an initial reading of mine got it wrong.
