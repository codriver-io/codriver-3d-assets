# Los Angeles City Hall

Original procedural model of the 1928 Los Angeles City Hall, 200 North Spring Street, by John Parkinson, John C. Austin and Albert C. Martin Sr. The tower, colonnaded observation crown and Mausoleum at Halicarnassus-inspired stepped pyramid are its identity. No captured mesh, imagery, textures or interior is shipped.

Build: `pnpm build:top-cities-landmarks los-angeles-city-hall --no-check`. Source: `src/peregrine/landmarks/top-cities/los-angeles-city-hall/`. Catalog: `prototypes/assets3d/catalog.d/los-angeles-city-hall.json`.

## Sources and dimensions

- [Wikipedia](https://en.wikipedia.org/wiki/Los_Angeles_City_Hall): 1928, 32 floors, 138 m roof, architects and Mausoleum inspiration.
- [OSM relation 6333145](https://www.openstreetmap.org/relation/6333145): base outer way 425993492 with five inner courts, plus building parts 443103746–443103750. Dossier fetched 2026-10-12; the shared Overpass helper timed out on the relation geometry, so one OSM relation/full API request recovered its member rings.
- [Front photograph](https://commons.wikimedia.org/wiki/File:Los_Angeles_City_Hall_front_view_2014.jpg), Neon Tommy, CC BY-SA 2.0; [April 2025 photograph](https://commons.wikimedia.org/wiki/File:Los_Angeles_City_Hall_(April_2025).jpg), Busition, CC BY 4.0; [night photograph](https://commons.wikimedia.org/wiki/File:LA_City_Hall_at_night.JPG), LEKI, public domain. Licence pages checked; references remain in ignored tmp only.

| Quantity | Model | Basis |
| --- | --- | --- |
| Overall roof | 138.4 m | OSM, agrees with published 138 m |
| Base outline | about 80 × 132 m | mapped outer ring, exact notched plan |
| Base wings | 20 m | OSM relation height |
| Upper wing roof | 46.5 m | OSM part 443103746; gabled/hipped profile estimated |
| Tower shoulders | 98.5 / 110 m | OSM 443103748 / 443103747 |
| Crown cornice | 121.6 m | OSM 443103750 |
| Pyramid base / height | 15 × 15 m / 11 m | mapped OSM 443103749 |
| Main shaft | 20.2 m cross core, 31.2 m shoulders | mapped part outline, simplified corner offsets |
| Window bays, cornices, columns, arches | procedural repetition | photograph estimates; no survey detail |

## Frame and model

Origin `[-118.242769,34.053691]` is the mapped pyramid centre. Real metres, +X east, +Y up, +Z south; local y=0 is rigid flat pavement grade. Two OSM pyramid control points `[-118.2427821,34.053785]` and `[-118.2426583,34.0537054]` establish the 128° long-wall direction. Rotation −38° is baked exactly once; the southeast First Street elevation faces bearing 128°. The opposite long elevation faces Temple Street (308°); Spring Street and Main Street face the shorter ends (218° and 38°). No absolute elevation, terrain heights or geographic stretch enter geometry.

The exact base roof is triangulated around all five mapped light courts, with outward walls and court-facing walls. The tower uses a single cross-shaped shell and smaller upper shaft, windowed long wings with muted terracotta roofs, a recessed glazed observation ring behind supported columns, an attic and a stepped stone pyramid. Every window is an individual aperture with closed reveals; glass is recessed 0.28 m near and 0.65 m far. Far keeps distinct rows/bays, the courts, arches, column ring and pyramid. Compatible vertices are welded per material.

Five near materials, four far: warm white terra cotta `stone`, subdued sill/mullion `trim`, dark neutral `glass`, muted brown `roof`, and crown `light`. The night palette reproduces pale floodlit stone with brighter crown slots without adding an unrelated beacon/spire or terrain lighting geometry.

Approximation: tiny setbacks, mouldings and reliefs are simplified; the OSM base ring and courts are exact, but facade window counts and wing roof profiles are estimates. No flags, courtyard furniture, landscaping, City Hall East/South or connecting bridge. Those neighbouring provider ways remain unowned.

## Verification

Measured exported default scenes:

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 30,300 | 5 | 1,521,468 | 1,486 |
| far | 9,806 | 4 | 488,148 | 477 |

Both LODs have identical bounds, grade 0 and roof 138.4 m. Focused landmark tests: 8/8 pass in about 1.2 s, including outward-face oblique rays, crown column seating, five open courts, ownership containment and GLB round trips. The three Los Angeles entries in the shared conformance test also pass. Exported QA metrics are clean: zero coplanar overlaps, layered faces, material cycles or removable attributes; no back-face failures. Depth generation and the selected-id freshness check pass.

I looked at `tmp/top-cities/shots/los-angeles-city-hall/los-angeles-city-hall-final-comparison.jpg`: attributed day/night photos beside near/far day/night exports, front, back, roof, entrance and crown. I also inspected `los-angeles-city-hall-glb-near-light-top.png` (all five courts, orientation and footprint), `los-angeles-city-hall-procedural-near-light-sheet.jpg`, and the near-light exported sheet in the same directory. Initial inspection prompted removal of hidden duplicate facades, welding and a coarser separate far grid; column bases were extended to their supporting ledge. The QA ray sweep exposed inverted aperture reveals, whose winding was corrected and pinned by a regression test before fresh exports and the final sheet. Pale stone, tower shoulders and pyramid are readable in every LOD; the far facade deliberately reduces rows, and fine mouldings and exact portal bay counts remain approximations.

The final catalog check passes (266 entries, 508 variants), after an earlier transient missing Museo Nacional document from another builder. The combined focused conformance run ends at 416 passing / 1 failing, solely the unrelated Palacio de Cibeles footprint area check. `pnpm assets:preview` passes after the transient blocker cleared. No shared file was changed to bypass these failures. No app server was started. Independent visual review and app evidence remain with the lead.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Provider replacement, runtime shading, DEM foundation/pad edges and lifecycle have not been certified by these standalone asset checks.
