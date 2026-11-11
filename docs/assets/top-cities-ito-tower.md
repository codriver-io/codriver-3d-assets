# Ito Tower

Ito Tower’s pale horizontal bands, two stepped slabs and large through-openings, with the mapped connected SOM low podium and open courtyard.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Tower / middle slab / low podium | 100 / 66 / 26 m | Published tower; mapped lower divisions |
| Middle through-hole | 12 m wide, y30–52 m | Exterior-photo estimate |
| Upper through-hole | 10 m wide, y77–88 m | Exterior-photo estimate |

Origin 4.87291389,52.33716111; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation 0 radians is baked from the two mapped control points [[4.8731741,52.3368112],[4.8727018,52.3368104]]; the host must not rotate again. Footprints replace only OSM ways 277373193, 289543438, 754852670, 754852671, 754852672, 754894015. BREEAM and the published identity give 100 m; OSM tower part 754852672 gives 98 m. The upper cap is extended to the published 100 m and the 2 m disagreement is retained as uncertainty. Hole widths, vertical ranges and window pitch are photo estimates. OSM main building 277373193 aggregates Ito and SOM, so the connected low U-shaped SOM part is included to avoid deleting an unmodelled provider component; unrelated Mahler blocks remain outside ownership.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Ito-toren)
- [OSM mapped footprint](https://www.openstreetmap.org/way/277373193)
- [OSM mapped footprint](https://www.openstreetmap.org/way/289543438)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754852670)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754852671)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754852672)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754894015)
- [BREEAM ITO: published 100 m and 23 floors](https://www.breeam.nl/projecten/ito-building-4855)
- [File:Zuidas4.jpg — No machine-readable author provided. Migdejong assumed (based on copyright claims). — Public domain](https://commons.wikimedia.org/wiki/File:Zuidas4.jpg)
- [File:Ito toren.jpg — franzconde — CC BY 2.0](https://commons.wikimedia.org/wiki/File:Ito_toren.jpg)
- [File:Toyo Ito-3-.jpg — (SketchUp) — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Toyo_Ito-3-.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/ito-tower.jpg`; mapped overhead: `tmp/benelux/ito-tower/qa/ito-tower-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/ito-tower/dark/ito-tower-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Compared the broad horizontal bands, offset 66/100 m slabs and two deep rectangular through-openings with the exterior photos. Raycasts pass through both openings and hit their piers/lintels in both LODs; the plan keeps the mapped courtyard open. The connected low SOM envelope is explicitly included because the provider main outline aggregates the complex.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 22892 | 3 | 249636 |
| far | 8232 | 3 | 96172 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## 2026-11-10 application-finding diagnosis

OSM main outline 277373193 already encloses the connected Ito/SOM courtyard and all selected tower/podium parts; way 754894015 remains the U-shaped SOM part. The pale courtyard floor survives hiding provider buildings and disappears with ground/roads hidden, identifying ground/paving rather than an unowned building extrusion. No geometry or mask change is justified. Both-mode final captures and the mode verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`; diagnostic layer visibility overrides are not acceptance screenshots.
