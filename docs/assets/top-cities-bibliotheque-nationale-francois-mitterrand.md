# Bibliothèque François-Mitterrand — Paris

Four79 m L-shaped glass book towers facing one another,with silver grid and muted wood-shutter panels.

## Sources and rights

- [BnF:four open-book towers around the esplanade](https://www.bnf.fr/fr/francois-mitterrand)
- [Dominique Perrault Architecture:1989–1995 four corner towers and inward-facing plan](https://perraultarchitecture.com/projets/bibliotheque-nationale-de-france/)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Bibliothèque_nationale_de_France)
- [OSM way 62379530: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/62379530)
- [OSM way 62379535: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/62379535)
- [OSM way 62379550: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/62379550)
- [OSM way 62379561: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/62379561)
- [Reference photograph: File:Paris 13e BNF Site François-Mitterrand 746.jpg — GFreihalter — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Paris_13e_BNF_Site_Fran%C3%A7ois-Mitterrand_746.jpg)
- [Reference photograph: File:Bibliothèque Mitterrand Mai 2022.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Biblioth%C3%A8que_Mitterrand_Mai_2022.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/bibliotheque-nationale-francois-mitterrand/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Each book tower | 79 | Mapped height;published contemporary documentation |
| Storeys | 22 | BnF and mapped |
| Tower count | 4 | Operator and architect |
| Terrace/plaza level | 0 | Rigid local tower foundation datum;not DEM |

Origin `[2.37583333, 48.83361111]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The four exact L-shaped mapped tower rings are extruded as four separate books,with genuine empty notches facing the central precinct. Thin curtain-wall grids and grouped muted wood shutters evoke the glass/wood double skin. Far retains all four positions,arms,openings and coarser separate panes. Four tower-only footprints preserve the public esplanade,forest and underground-library provider geometry; those site works are outside this asset. Explicit small footing rings replace the inappropriate large default terrain disc,but do not establish actual terrain placement. The two completed Francois-Mitterrand exterior references are used; Richelieu interiors,its old facade and the Labrouste room were rejected.

1995/1996 Francois-Mitterrand site:four mapped L-shaped open-book towers,each79 m and22 storeys. Four named tower footprints only; the esplanade,underground library,forest court,steps and neighbouring MK2 are excluded. Window/wood-shutter grouping and colours estimated. Local y=0 is the common tower foundation/esplanade datum; bounded per-tower terrain pads avoid flattening the entire precinct. No terrain or app verification.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 27376 | 4 | 416416 |
| far | 6640 | 4 | 116308 |

Deterministic metrics: `tmp/france/bibliotheque-nationale-francois-mitterrand/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/bibliotheque-nationale-francois-mitterrand.jpg`. Mapped orientation/top check: `tmp/france/shots/bibliotheque-nationale-francois-mitterrand/bibliotheque-nationale-francois-mitterrand-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


## Independent review follow-up — 2026-11-10

Nit: staggered wood shutters between successive floor groups and widened the horizontal frame separators, breaking the aligned ochre stripes. Four 79 m open books and bounded tower pads are unchanged; triangle and draw counts are unchanged.

Fresh exported comparison: `tmp/france/fixes/sheets/bibliotheque-nationale-francois-mitterrand.jpg`; deterministic metrics `tmp/france/fixes/bibliotheque-nationale-francois-mitterrand-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.

## 2026-11-10 Full 3D world support-pad fix

Diagnosis: four separate tower pads miss the esplanade between towers. A single bounded site pad now connects the four tower footings and the intervening esplanade, with one near-lattice-cell support halo; the four original tower datum references are retained. The reusable geometry remains the four towers only; no esplanade mesh was added. The halo is 25.16 m locally and keeps the supporting near-terrain TIN nodes at one grade. Palettes, Cityscape geometry and GLB bytes remain unchanged; only placement metadata and its manifest were updated. Before/after paths, numeric probes and final Cityscape/world verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`.
