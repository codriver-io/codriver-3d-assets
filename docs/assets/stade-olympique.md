# Stade olympique + Tour de Montréal

March 2026 construction state: oval ribbed bowl, open technical ring and 165 m inclined tower. The central roof is absent.

Original procedural geometry authored 2026-09-27. Placement/footprints © OpenStreetMap contributors (ODbL 1.0). Official photographs informed proportions; no photo, scan, texture or third-party mesh is shipped.

Dated March 2026 state, not a live construction feed: old membrane removed; future rigid roof not installed. Tower sections, windows, shell, seats approximate; loose construction cable bundles omitted. Cranes, winter snow and temporary equipment omitted. Grounded on the flat map, not surveyed terrain. Tesla hardware performance unmeasured. QA 2026-10-11: loose temporary cable bundles omitted; dated open-bowl construction state retained.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.5516429, 45.5578149]`. Heights are visual approximations.

## Build

`pnpm build:stade-olympique`

Source: [`src/peregrine/landmarks/stade-olympique-geometry.js`](../../src/peregrine/landmarks/stade-olympique-geometry.js)

## References

- [Parc olympique — dimensions and height datums](https://parcolympique.qc.ca/a-propos/montreal-ville-olympique/donnees-et-statistiques/)
- [Parc olympique — 34 full and 4 truncated consoles](https://parcolympique.qc.ca/wp-content/uploads/2011/10/A_architecture_genie.pdf)
- [Technical ring completed 2 March 2026](https://toiture.parcolympique.qc.ca/2026/03/anneau-technique-complete-une-etape-majeure-franchie-au-stade-olympique/)
- [Official construction photos — March and September 2026](https://toiture.parcolympique.qc.ca/le-chantier-galerie-photos/)
- [Official roof project phases — reopening 2028](https://toiture.parcolympique.qc.ca/phases-du-projet/)
- [OSM stadium footprint](https://www.openstreetmap.org/way/108505523)
- [OSM tower/centre footprint](https://www.openstreetmap.org/way/20213158)
- [Starting visitor reference — Tourisme Montréal](https://www.mtl.org/en/experience/go-gold-montreal-olympic-park)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). Exported cost: near 23,460 triangles / 7 draws / 833,760 bytes; far 10,964 / 7 / 449,568.

## Research and modeled state

Research date: 2026-09-27. The starting [Tourisme Montréal reference](https://www.mtl.org/en/experience/go-gold-montreal-olympic-park)
establishes the visitor landmark. Primary Parc olympique sources determine the model:

* [Official dimensions](https://parcolympique.qc.ca/a-propos/montreal-ville-olympique/donnees-et-statistiques/):
  stadium 284 m long × 245 m wide; complex including tower 484 m long;
  tower 165 m above ground, 190 m above sea level, with 87 m concrete and
  78 m steel portions. The south face reaches 45° inclination; this does not
  mean the whole tower is a straight column rotated 45°.
* [Architecture and engineering](https://parcolympique.qc.ca/wp-content/uploads/2011/10/A_architecture_genie.pdf):
  34 full cantilever consoles plus four truncated consoles at the tower;
  each is distinct, carrying part of the technical ring.
* [Project phases](https://toiture.parcolympique.qc.ca/phases-du-projet/): old roof
  dismantled in 2024, ring replacement in 2025, roof fabrication/installation
  in 2026–2027, reopening scheduled for 2028.
* [2 March 2026 milestone](https://toiture.parcolympique.qc.ca/2026/03/anneau-technique-complete-une-etape-majeure-franchie-au-stade-olympique/):
  all 38 new technical-ring sections installed; preparations for 24 temporary
  cables supporting the future internal roof.
* [Official monthly photographs](https://toiture.parcolympique.qc.ca/le-chantier-galerie-photos/),
  especially March 2026 `ann_technique_complet_3`, `cables_suspendus_1` and
  `cables_suspendus_4`: the open central bowl, exposed steel ring and vertical
  hanging cables. April 2024 and September 2026 photos were also inspected to
  distinguish the removed membrane from the later roof assembly.
* [2024 technical briefing](https://toiture.parcolympique.qc.ca/wp-content/uploads/2025/01/breffage-technique_5fevrier2024.pdf):
  the intended roof is fixed, rigid and light, supported by tower and consoles.

The modeled month is March 2026: completed ring, pale outer shell panels,
open centre, inclined tower and temporary cable bundles omitted. There is
**no old white Birdair membrane, retractable orange roof, or future rigid central
roof**. The tower and ring are authored together so the roof-support relationship
remains legible in the absence of the roof. Construction cranes, snow, scaffolding,
temporary sheets and exact daily cable positions are omitted. The new roof's
September 2026 work-floor assembly is not mixed into this March state.

Five official photographs are retained only in ignored `tmp/stade-research/` and
registered as `stade-olympique-official-photo-references`. Rights remain with
Parc olympique/credited photographers; no redistribution permission is assumed.
No photography, captured mesh or third-party texture is included in either GLB.

## QA revision 2026-10-11

QA 2026-10-11: loose temporary cable bundles omitted; dated open-bowl construction state retained.

Current measured exports: near: 23,136 triangles / 7 draws / 815,836 bytes; far: 10,640 triangles / 7 draws / 431,648 bytes. Geometry metrics report no unresolved issues.

Current mode validation (2026-10-11): **Cityscape verified; Asset readiness and inspector output alone were not used to establish terrain verification.
