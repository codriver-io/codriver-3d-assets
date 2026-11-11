# Tour D2 — Courbevoie

Rounded blue-glass tower wrapped in a white diamond exoskeleton that closes into an open egg-shaped crown.

## Sources and rights

- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_D2)
- [OSM way 82467015: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/82467015)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)
- [Reference photograph: File:TourD2Courbevoie.jpg — Psay12 — CC-BY-SA-4.0](https://en.wikipedia.org/wiki/File:TourD2Courbevoie.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-d2/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Architectural cage | 171 | Published; OSM175 m discrepancy documented |
| Glass roof | 156 | Photo estimate |
| Diamond rows | 13 main rows near /10 far, refined crown | Photo estimate |
| Cage width | .48 near /.58 far | Estimate |
| Maximum frame stand-off | 0.65 | Estimated structural clearance |

Origin `[2.24796599, 48.89050086]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The mapped rounded plan is lofted through a full-width middle and narrower crown. The glass stops below an actually open diamond dome. Each exoskeleton segment ends at another named cage node, or at grade; the test includes a deliberately shortened segment that fails support. A light frame stands clear of glass rather than layering white coplanar decals. Far has fewer structural diamonds and separate curtain-wall panes while keeping the same egg silhouette and crown opening. Roof planting is represented only by a muted roof tone; landscape and signs are omitted.

Completed 2014 D2; published architectural envelope 171 m, versus OSM 175 m (171 m adopted as an envelope estimate). Rounded mapped plan, tapering upper glass, open lattice crown and continuous diamond exoskeleton preserved. Glass roof at156 m, cage pitch and radial taper photo-estimated. Maximum frame overhang about0.7 m beyond the mapped envelope; no surrounding plaza, signs or interiors.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19510 | 4 | 318444 |
| far | 6922 | 4 | 124864 |

Deterministic metrics: `tmp/france/tour-d2/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-d2.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-d2/tour-d2-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Second look: replaced an overly conical crown with a sampled elliptical dome profile and extra supported crown nodes, matching the rounded reference silhouette.

## 2026-11-10 application framing follow-up

Stock lower facade/base was occluded. Custom center 2.248116,48.890601; zoom 16.9, pitch 50, bearing 140; no model edits. New street-side lower facade/footing view complements the original crown evidence and resolves the base/neighbor separation in both modes. Final verdict: Cityscape **verified**; Full 3D world **verified**. Before/after evidence, capture diagnostics and exact command arguments are recorded in the follow-up report. No readiness gate was changed from a framing/data gap.
