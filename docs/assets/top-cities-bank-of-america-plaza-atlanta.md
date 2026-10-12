# Bank of America Plaza, Atlanta

Stable asset ID: `bank-of-america-plaza-atlanta`. Original procedural model of the 1992 Kevin Roche / John Dinkeloo tower at 600 Peachtree Street NE. The shell is represented from the dossier photographs; the 2026 lobby/West Wing refurbishment described by the owner is not reconstructed. Source folder: `src/peregrine/landmarks/top-cities/bank-of-america-plaza-atlanta/`; catalog fragment: `prototypes/assets3d/catalog.d/bank-of-america-plaza-atlanta.json`.

## Identity and reference evidence

A driver sees a slender red-brown granite tower with strongly vertical window bays, serrated corners, stepped shoulders and an illuminated gold open-lattice pyramid below its obelisk tip. The model preserves those features in both LODs. It does not repeat historic tallest-building rankings as a current fact.

Sources checked 2026-10-11:

- [Official building site](https://www.bankofamericaplaza.com/): address, current refurbishment context.
- [Wikipedia architectural description](https://en.wikipedia.org/wiki/Bank_of_America_Plaza_(Atlanta)): 1,023 ft / 312 m architectural tip, 933 ft / 284 m roof, 55 office floors, completed 1992; granite, gilded open steel crown, diagonal relationship to streets.
- [OSM tower way 39449840](https://www.openstreetmap.org/way/39449840): 311.8 m height, 55 floors, pyramidal roof tag, serrated ring. Supplied `tmp/top-cities/bank-of-america-plaza-atlanta/osm.json` has timestamp 2026-10-12T03:21:36Z; no extra Overpass request was needed.
- [Day silhouette photograph](https://commons.wikimedia.org/wiki/File:Bankofamerica-atlanta-new.jpg), connor.carey, CC BY-SA 3.0 (licence checked on the Commons file page).
- [Closer tower view](https://commons.wikimedia.org/wiki/File:Bankofamerica-atlanta-feb09.jpg), connor.carey, CC BY-SA 3.0.
- [Looking up at corner bays](https://commons.wikimedia.org/wiki/File:Bank-of-America-Plaza-Atlanta-24802603.jpg), J. Geierman, CC BY-SA 3.0.
- [Night crown](https://commons.wikimedia.org/wiki/File:Scraper_(259777575).jpeg), Kailash U, CC0.

The supplied six-photo `refs-sheet.jpg` was inspected first, including the comparison-only street sign photograph by Atlantacitizen (CC BY-SA 3.0) and skyline photograph by Marc Merlin (CC BY-SA 4.0). Images stay in ignored `tmp/`; no photo, texture, external mesh or scan is exported. Code/notes are original repository authoring; original model rights follow ADR-0044 (CC BY 4.0), with independent OSM ODbL attribution.

## Dimensions and mapped frame

| Quantity | Model | Evidence |
| --- | --- | --- |
| Architectural tip | 312 m | Published 1,023 ft; OSM 311.8 m |
| Flat crown-support roof | 270 m | Photo estimate after independent review; published 284 m roof figure retained as a reference, not equated to visible lattice springing |
| Office floors | 55 | Published and OSM |
| Base plan | about 49 × 50 m, 1,965 m² | Mapped serrated OSM ring |
| Southeast face bearing | 135.8979° from north | Mapped controls [-84.3860261,33.7710922] → [-84.3858581,33.7709481] |
| Shoulder roofs | 250 / 258 / 264 m | Estimated from photographs |
| Lattice pyramid | 270–305.6 m, 34 m base width | Estimated split of overall crown height |
| Square obelisk | 305.4–312 m | Estimated, foot intersects upper lattice belt |
| Typical window pitch | 4.75 m; first row 7.65 m | Estimated facade distribution |
| Foundation datum | y=0, rigid | Authored local grade; no terrain baked in |

Origin `[-84.386139175,33.770864835]` is the mean of the mapped twenty outline vertices. Coordinates are metres east/up/south. The baked 0.8010693 rad tower-axis rotation comes from the two mapped controls above; the host must not rotate again. The measured axis matches the reported approximately 45° street-grid relationship without substituting a nominal street rotation.

Only OSM way 39449840 is replaced. The neighboring commercial building, Emory hospital parts and detached ATM are outside ownership. Upper rings stay within the base ring; the roof crown is supported by the 34 m roof. A 39 m rigid foundation pad radius encloses the mapped tower, but terrain footing and the surrounding sloping drives/stairs remain for separate integration review.

## Geometry and materials

The mapped twenty-edge serrated outline supplies the lower shaft. Corner arms recede at three estimated shoulder levels; the shaft ends in a flat roof. Granite piers and spandrels tile the facade around glass cells. Window surfaces replace wall cells rather than overlapping a background wall, so no window depth-rank workaround is required. Near keeps individual floor cells; far combines two floors and wider bays into separate quads, preserving the grid and silhouette. Exact duplicate vertices are welded without changing faces or normals; crown-member authoring diagnostics are nonenumerable and stay out of GLB JSON, saving about 60 KB near and 25 KB far. Near/far share subdued granite/glass tones; about 23% of office cells switch to warm self-lit windows at night.

The crown is genuinely open: six horizontal belts, sloping ribs, and intersecting diagonal girder members are merged into the `light` material. Far keeps belts, half the ribs and single diagonal braces. The square gilded obelisk intersects the upper belt. Source metadata records each member's index range and named supports after merging into one draw, enabling endpoint tests against actual support triangles with the member excluded. A deliberately shortened rib is the negative control.

The small entry lintel and jambs are embedded within the northern arm. Lobby interiors, exact entrance doors, the detached sign, lawns, garage ramps and latest West Wing work are omitted. Fine lattice spacing, exact setback elevations, window bay widths and lighting are estimates; the model is not a survey reconstruction.

## Exported costs and validation

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 24213 | 6 | 1289304 | 1259.1 |
| far | 7407 | 6 | 392748 | 383.5 |

Both exports fit the building budgets. Far is 30.6% of near triangles and retains identical tip height and essentially identical bounds. All exports are self-contained uncompressed GLB 2.0; six named material draws; no textures or bridge attributes. Rebuild: `pnpm build:top-cities-landmarks bank-of-america-plaza-atlanta --no-check`.

Landmark-specific tests pass (9): architectural height, exact rigid grade, vertex containment in the mapped envelope, outward facades, raycast roof/shoulders, open crown, every crown girder's named-support contact, negative shortened-end control, separate near/far windows, silhouette and cost ratio. The requested combined conformance command passes **387/387 tests**, including all Atlanta source/GLB checks. Final log: `tmp/top-cities/bank-of-america-plaza-atlanta/tests-final.txt`. No Dallas or other landmark files were changed.

Deterministic QA report: `tmp/top-cities/bank-of-america-plaza-atlanta/qa-metrics.json`: no issues, 0% backface sweep, zero significant coplanar pairs, zero removable bridge-lift bytes, no material cycles. A sub-1 m² crown/stone junction yields `light` rank 1 in both LODs; it is a support intersection, not a facade layer.

## Visual evidence actually inspected

Evidence directory: `tmp/top-cities/shots/bank-of-america-plaza-atlanta/`.

- First procedural near/light sheet: overview, opposite facade, above-roof, entrance and crown detail. It confirmed the open crown and stepped body; the daytime `glow` glass was then made identical to normal glass to remove patchwork, and the crown base was tightened to meet the roof edge.
- Exported `bank-of-america-plaza-atlanta-glb-near-light-sheet.jpg`: same five views after those changes; explicitly inspected.
- `comparison.jpg` and final post-welding `final/comparison.jpg`: exported near/light, far/light, near/dark and far/dark overview tiles directly beside dossier day/close/night photographs; explicitly inspected. Both LODs keep the serrated body, shoulder steps, golden pyramid and tip. The far night windows are visibly coarser and less varied than near, while the gold cage remains open.
- `bank-of-america-plaza-atlanta-glb-near-light-top.png`: inspected against red OSM ring; plan alignment agrees and no neighbor is masked.
- Final post-welding exported overview/detail sheets in `final/`: inspected again; visual silhouette and crown unchanged.

The exported crown detail and roof views show a flat inhabited roof under a porous pyramid, rather than a solid golden cap. Front/back/entrance views show continuous walls, with no floating roof members or reversed surfaces. The model approximates the photographs' shoulder distribution; independent review remains required for architectural likeness and unobstructed app placement.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. App bundle, provider replacement, theme shading in the shared renderer, terrain late/refined datums, pad edges and lifecycle are lead-owned checks. Tesla hardware performance is unmeasured; the contact sheets establish standalone asset appearance only.

## Independent-review fix — 2026-10-12

The short gold cap and long rectangular upper shaft were corrected: crown springing lowered from 284.4 to 270 m, lattice length increased from 21.2 to 35.6 m, base widened from 30 to 34 m, and shoulders redistributed from 228/263/276 to 250/258/264 m. The 312 m tip, 55 separate near office rows, diagonal mapped plan and supported open cage remain in both LODs. Window pitch is now 4.75 m, a photograph-derived estimate; the published 284 m roof figure does not establish the visible crown springing. Overview/facade/back inspector cameras now frame the whole tower.

Exported GLB contact sheets in `tmp/top-cities/shots/bank-of-america-plaza-atlanta/review-fix/` were inspected: overview, back, roof, entrance and crown detail (near/light); overview and crown detail (far/light and near/far dark). The dossier exterior reference sheet and prior `tmp/next-200/qa/b1/sheets/bank-of-america-plaza-atlanta.jpg` were compared. One look-fix iteration was used; the changes preserve recognisable near/far features. Static sheets do not establish runtime flicker or terrain integration.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 24,213 | 6 | 1,289,304 | 1259.1 |
| far | 7,407 | 6 | 392,748 | 383.5 |

Final combined prescribed run passes 411/411 tests (three landmark test files plus `top-cities.test.js`); log `tmp/top-cities/bank-of-america-plaza-atlanta/review-fix-tests.log`. Scoped deterministic QA reports no issues, no close-layer/coplanar defects, retained far window rhythm and 0% near backface hits; report `tmp/top-cities/bank-of-america-plaza-atlanta/review-fix-metrics.json`. Scoped depth generation and freshness check pass with zero dropped cycle edges; `cycles.json` is empty. The global catalog and preview checks currently encounter another builder's missing `docs/3d-top-cities-vulcan-statue.md`; final retry status is in the handoff report.

Cityscape and Full 3D world remain **not verified by this worker**: the review's existing app evidence is insufficient for the new exports. Fresh unobstructed application shots, shared-material appearance, provider/terrain contacts and independent re-review are lead-owned. No provider ids/rings, shared renderer logic, Git state or app server was changed. Earlier export/check narratives above are historical and superseded by this section.
