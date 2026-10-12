# Cologne Cathedral

`cologne-cathedral` — Hohe Domkirche Sankt Petrus, Domkloster 4, Cologne, Germany. Original procedural model of the completed exterior; temporary repair scaffolds are omitted. Contract: [top-cities landmarks](../top-cities-landmarks.md). No scanned mesh, traced third-party mesh, photographic texture or reference image is shipped.

## Identity and sources

A road view reads the paired tall openwork west spires, stepped square tower bases and three pointed portals; from the south the long metal roofs, deep transept gable, flying buttress rows and polygonal east choir distinguish the building. The high clerestory sits above two lower aisles. Small pinnacles and grouped figures break the west front without attempting individual sculpture.

- [Cathedral official figures](https://www.koelner-dom.de/erleben/der-dom-in-zahlen), checked 2026-10-12.
- [OSM cathedral way 4532022](https://www.openstreetmap.org/way/4532022) and Domsakristei way 207377050; dossier `tmp/top-cities/cologne-cathedral/osm.json` and `osm.txt`.
- [West facade, Raimond Spekking, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:K%C3%B6lner_Dom_-_Westfassade_2022_ohne_Ger%C3%BCst-0968_b.jpg).
- [South exterior, Velvet, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cologne_cathedrale_vue_sud.jpg).
- Dossier contact sheet `tmp/top-cities/cologne-cathedral/refs-sheet.jpg`; full titles, authors and licences in the ignored `refs/SOURCES.txt`. The historic public-domain exterior and close spire detail were also compared there; no reference image is redistributed.

| Feature | Published / mapped value | Implementation |
| --- | --- | --- |
| South / north tip | Official 157.22 / 157.18 m | Exact tip heights in both LODs |
| Overall plan | Official 144.58 × 86.25 m | Model approximately 144.60 × 86.55 m in the geographic axes; OSM envelope includes projecting buttresses |
| West facade | Official 61.54 m wide | Tower spacing and counterforts from mapped parts; narrow details estimated |
| Transept facade | Official 39.95 m wide, 69.95 m high | Outer mapped wings and pinnacles; gable tip 69.95 m |
| Crossing tip | Official 109.12 m | Exact height, faceted metal fleche |
| Nave vault / aisle vault | Official internal 43.35 / 19.80 m | Exterior wall/roof levels follow OSM, not internal heights |
| Main eaves / roof ridge | OSM parts: 45.6 / 61.1 m | Model walls 46 m, ridge 61.1 m |
| Tower base / spire spring | OSM base 71 m; roof height roughly 61.6 m | Solid base 71 m, pierced masonry belfry to 97 m, tapered openwork above |
| Chapel and buttress profiles | Estimated from OSM and photos | Simplified repeated sectors and solid pier-supported arches |

## Geographic frame and ownership

Real metres, +X east, +Y up, +Z south. Origin `[6.95833, 50.94139]` is a geographic anchor within the choir, matching the precomputed dossier. `y=0` is local cathedral pavement grade. Nave control points `[6.9571403,50.9412942]` and `[6.9587959,50.9413224]` give the roughly 1.57° north-of-east ridge; `rotateY(0.0274)` is baked once, and the west frontage bearing is 268.430°. No Mercator stretch, DEM, absolute altitude or host scene offset is baked into the GLB.

Two mapped rings own the cathedral and sacristy. `OSM_WAYS` enumerates 88 overlapping provider outlines/parts, including both tower bases, every mapped south-spire tier, Nordturm, nave/transept roofs, crossing fleche, choir and sacristy roofs. The station, shop, neighbouring museums and underground service buildings are excluded. Minor projecting relief reaches at most 0.8 m beyond tiny notches in the detailed OSM ring; the focused vertex test pins this to the provider clipping slack.

The model remains rigid. A bounded median terrain-pad proposal uses the two ownership rings, three entrance/choir grade references and 12 m feathering; the lead must verify these references against resident terrain, pavement and nearby roads. This proposal is not terrain certification.

## Geometry, materials and LOD

Four merged materials: subdued weathered sandstone `stone`, grey metal `roof`, dark `glass` and portal `recess`. Light and dark palettes have identical names. No emissive materials or simulated facade floodlighting; the dark variant is a dim architectural approximation, not a calibrated night-lighting study.

Square towers have paired pointed window tiers, front gabled surrounds, shafts, canopied figure groups and stepped counterforts. The 71–97 m octagonal belfries now have masonry sills and pointed-head spandrels surrounding tall lancets, with paired mullions anchored into both. Above them, tapered stone panels have real pointed openings: fourteen courses near and nine far replace the previous diagonal lattice and four sparse far galleries. Near panels have 14 cm physical thickness and belfry panels 30 cm; far panels preserve both visible sides without introducing another material. Spire tips and the void between the towers remain identical in both LODs.

Nested portal archivolts, paired west-front shafts and blind pointed spandrel tracery add depth to the west facade. The transept has projecting flanking counterforts, seated pinnacles, layered portal mouldings and grouped vertical gable tracery. Far simplifies repeated small shafts and mouldings while retaining the principal profiles and the open spire courses. Both LODs keep separate window bays and supported flying arches.

Window openings are cut through the stone faces, with glass inset 0.68 m; this avoids opposite depth ordering between choir windows and nave windows. The choir ambulatory has continuous roof sectors behind its chapel caps. The transept high walls are inside the lower aisle roofs, with seated flying members. Roof normals and geographic rotations survive GLB round trip.

Approximation limits: no individual portrait sculpture, gargoyles, complete 1,125-pinnacle inventory, interior, exact stained glass, temporary scaffolding, or weathering texture. The seven choir sectors and repeated Gothic tiers are architectural simplifications. Near is deliberately detailed and uses much of the building byte budget; far retains recognition at reduced cost.

## Export and checks

Standard export: `pnpm build:top-cities-landmarks cologne-cathedral --no-check`, followed by selected depth-layer generation and `--check`. Final review-fix costs, 2026-10-12:

| LOD | Before triangles / draws / KiB | Current triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: | ---: |
| Near | 43,431 / 4 / 2,293.8 | 46,575 | 4 | 2,425,052 | 2,368.2 |
| Far | 9,435 / 4 / 461.4 | 10,659 | 4 | 474,068 | 463.0 |

Both exports pass the building budgets. Near/far bounds are identical at approximately 144.60 × 157.22 × 86.55 m. `public/models/buildings/cologne-cathedral.json` records exact exported measurements. Thick near pierced panels replace the temporary coincident back-face duplicates; their normals pass the exported sweep. The west nave roof end was moved 0.6 m behind the raised stone screen to remove the earlier roof/stone coplanar candidate without changing the visible facade.

The focused tests verify official tips, the crossing and nave ridge, pointed portals, porous spires and sky between the towers, masonry belfry sills/spandrels, at least ten measured solid/open spire transitions, mapped ownership and near/far silhouette. Every belfry mullion terminates in its named masonry sill and pointed head; rays exclude the tested mullion's own faces, and deliberately raised/shortened endpoints fail. Existing named flying-arch pier/clerestory contact tests remain in both LODs. Horizontal ownership checks examine all distinct horizontal vertices once, avoiding repeated elevation/normal splits.

Final exported QA in `tmp/top-cities/cologne-cathedral/review-fix-metrics.json`: both landmarks report no issues; Cologne has zero layered faces, zero coplanar overlaps, 0% back-face hits, no removable lift attributes, and no far window-rhythm flags. Selected depth generation and `--check` pass with zero cycle edges dropped. The shared catalog command passes, 286 entries / 520 GLB variants at the checked snapshot.

## Visual evidence and integration status

Independent review `tmp/next-200/review/b3a/REVIEW.md` identified empty belfries, mast-like spires and blank facade planes. Two look-fix rounds were used: `tmp/top-cities/shots/cologne-cathedral/review-fix1/` and `review-fix2/`. The final inspected exported `cologne-cathedral-glb-near-light-sheet.jpg` in `review-fix2/` covers west facade, roof, south, east, portal and close spire detail; the corresponding far sheet covers facade, south and tracery. Compared with `tmp/top-cities/cologne-cathedral/refs-sheet.jpg`, both now show pierced masonry tower stages and continuous pointed spire courses rather than crossed lattice bars. West and transept ribs and portal mouldings remain architectural simplifications; individual sculpture, full decorative inventory and precise weathering are omitted.

Supplied b3 Cityscape and Full 3D world captures were independently verified for placement, visible terrain/base contacts and provider replacement. The revised geometry is **not yet recaptured in either mode**: the lead owns refreshed application views and independent re-review. Contact sheets establish exported geometry only. Temporal terrain refinement/eviction, unseen terrace edges, lifecycle/mode changes and Tesla hardware remain separate integration gates. No app server or bundle was started in the shared tree.

Final command evidence is in `tmp/top-cities/cologne-cathedral/review-fix-tests.txt` and `REVIEW-FIX.md`; see the report for the final combined suite result, including any unrelated shared-tree failures.

Final focused run: **17/17 passed** for both landmarks together in 1.7 seconds, including 12 Cologne tests. Required combined top-cities plus both landmarks run: **431/432 passed**; the sole failure is another active builder’s `washington-dc-temple` footprint polygon, outside this fix’s scope. All six Westin/Cologne registry conformance checks pass.

`pnpm assets:check` and `pnpm assets:preview` passed; the standalone catalog is generated only under ignored `tmp/champlain-preview/`.
