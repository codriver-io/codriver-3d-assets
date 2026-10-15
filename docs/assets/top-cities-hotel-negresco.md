# Hôtel Negresco — Nice

Original procedural model of the present Belle Époque hotel, opened in 1913, designed by Édouard-Jean Niermans. The reference set shows white stucco, iron balconies, a salmon-pink mansard and prominent rounded corner with pink dome, copper-green lantern, rooftop lettering and flag. No external mesh, texture, photograph or font is included.

Sources: [official hotel](https://www.lenegresco.com/en), [hotel history](https://en.wikipedia.org/wiki/Hotel_Negresco), [OSM relation 4563464](https://www.openstreetmap.org/relation/4563464), attributed Commons comparison photos listed in the catalog record. Reference photographs are local-only in `tmp/top-cities/hotel-negresco/refs/` (authors and licences in SOURCES.txt). The mapped dome is southeast, despite the brief's west-corner wording.

| Dimension | Value | Basis |
| --- | --- | --- |
| Main body | 24 m | OSM outer way 140218153 height tag |
| Building envelope | approximately 69 × 84 m, geographic axes | OSM cadastre outline |
| Main mansard top | 28.3 m | photo estimate |
| Dome drum / pink cap top | 27.9 / 36.6 m | photo estimate |
| Lantern / flagpole top | 38.6 / 40.6 m | photo estimate |
| Dome radius | 6.45 m | mapped part 326729270, photo fit |
| Main guest rows | five principal room rows plus upper/roof rooms | photographs; published floor count 5, OSM counts 7–8 differently |

Origin `[7.258,43.6947]`; +X east, +Y up, +Z south. Grade is rigid y=0. Orientation is baked directly from geographic controls `[7.257746,43.694340]` and `[7.258276,43.694458]`: the seafront runs about 73° east of north, giving outward bearing about 163°. Outer outline, dome, low Royal Lounge and saltbox part are all owned (ways 140218153, 326729270, 326729272, 326729273). The courtyard contains an oval glazed lounge dome. Adjacent apartment buildings and the promenade remain outside ownership.

Procedural walls follow the detailed mapped outline. The far LOD retains separate windows, the curved rotunda, pink cap, copper lantern, mansard/dormer rhythm, letters, flag and lounge. Near adds balcony balusters, pilasters, dormer trim and dome oculi. Stone sculpture, fine iron scrollwork and interior detail are approximations or omitted. Rear entrance canopy and flags are simplified photo estimates. Palettes dim stone and pink roofing at night, warm a subset of room windows and illuminate lettering.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Foundation/pad behavior, provider replacement, shared runtime shading, lifecycle and actual device performance remain lead integration checks; standalone inspector evidence does not establish those gates.

## Verification

Rebuild: `pnpm build:top-cities-landmarks hotel-negresco --no-check`. Focused tests, catalog validation, export metrics and depth ordering are recorded below after final QA.

First contact sheet `tmp/top-cities/shots/hotel-negresco/iteration1/hotel-negresco-procedural-near-light-sheet.jpg` was opened beside `tmp/top-cities/hotel-negresco/refs-sheet.jpg`. The roof and white façades aligned with the mapped footprint, but the lower corner rotunda was blank: window rows, ground-level arched glazing, paired cornices and supporting pilasters were added in both LODs. Balcony slabs were corrected to the local façade frame.

Final exports were opened in `tmp/top-cities/shots/hotel-negresco/final/comparison.jpg`: supplied daylight reference photographs alongside every exported `overview`, `facade`, `back`, `roof`, `street` and `detail` view in near/far and light/dark. The overhead footprint image is `hotel-negresco-glb-near-light-top.png` in that folder; the standard review sheet is `tmp/top-cities/shots/hotel-negresco/standard/hotel-negresco.jpg`. The last comparison caught inward-facing dormer glazing; its normal/offset was corrected and all four exported sheets regenerated and opened again. This completes the two visual correction rounds. The pink/green corner identity, white mass and discrete window rhythm survive far/night; sculptural richness and the varied bay surrounds remain simplified, so independent likeness review is still required.

Automated QA also exposed an open 24–28.3 m courtyard roof seam, now closed by the upper inner wall. Thin cornice ribbons are closed wafers; window/mullion depth ordering is acyclic. `tmp/top-cities/hotel-negresco/metrics.json` reports zero layered faces, zero coplanar pairs, zero back-face hits in 390 outside-in rays, no removable attributes and no issues. `node scripts/landmark-depth-layers.mjs --ids hotel-negresco` generated zero dropped cycle edges; its `--check` passes. The generated depth table is the only shared file changed.

| Export | Triangles | Draws | Bytes | KiB rounded |
| --- | --- | --- | --- | --- |
| Near | 20,650 | 8 | 836,376 | 817 |
| Far | 7,384 | 8 | 267,752 | 261 |

All five landmark tests pass in under one second: geographic envelope and grade, rotunda/dome/lantern and lower windows, far silhouette/window/letter retention, closed courtyard walls and the flagpole's named copper support (with a deliberately shortened-end negative assertion). `node scripts/asset-catalog.mjs` passes with 406 entries and 774 GLB variants; `pnpm assets:preview` successfully built the local inspector. Early whole-catalog attempts saw other workers' missing Real Casa de Correos/Gateway Arch documentation; those transient failures cleared. Full required two-file test results are retained in `tmp/top-cities/hotel-negresco/tests-final.txt`.

Final required two-file command passed **827/827 tests, zero failures** (55.7 s); the five hotel-specific tests are included. Final catalog and depth checks also pass. No runtime server, app bundle build, git write operation or online deployment was performed.
