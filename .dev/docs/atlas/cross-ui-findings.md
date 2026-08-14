# Cross-UI findings: patterns and lessons from sibling Overture-family portals

Findings surfaced while reviewing or reusing patterns from other Overture-family and Overture-adjacent UI apps, not tied to any one Stage feature, so they live here rather than scattered across individual roadmap or tech-debt entries. Grows as more sibling UIs get reviewed (iMicroSeq's portal-ui today; Lyric's new UI and others as they come up).

## iMicroSeq portal-ui's `NavBar/Dropdown.tsx`: portable mechanics, not a portable data shape

Looked at directly (2026-08-11) while scoping a possible Arranger multicatalogue picker for Stage's explorer page.

**The component itself is generic and portable.** Theme-driven styling (Emotion, matching Stage's own setup), click-outside handling, takes a plain `data: ReactNode[]` to render as a list under a toggle button. Its two dependencies both have close equivalents already in Stage: a `TransparentButton` (Stage has `components/Button.tsx`, no transparent variant yet, a small addition not a new primitive) and a `ChevronDown` icon (Stage already has `components/theme/icons/chevron_down.tsx`).

**Its actual usage isn't a dynamic picker, and copying that part would reintroduce the exact hardcoding it's meant to remove.** iMicroSeq's own "Explore Data" dropdown hardcodes two known datasets as separate nav links to separate routes (`Clinical-VirusSeq`, `Environmental-Wastewater`), authored by hand per dataset. For Stage's catalogue picker, the reusable part is the dropdown component; the `data` array itself needs to be generated from `resolveArrangerCatalogue`'s resolved catalogue IDs at runtime, with each entry switching which catalogue the same explorer page is bound to, not routed to a distinct page per catalogue. See `.dev/tech-debt.md`'s multicatalogue-picker entry.
