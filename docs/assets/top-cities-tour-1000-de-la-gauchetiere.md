# 1000 De La Gauchetière, Montréal

Original procedural model of the completed 1992 office tower at 1000 De La Gauchetière West, designed by Lemay and Dimakopoulos. The distinguishing features are its pale granite and blue-green office grid, recessed and stepped corner offices, long pointed copper crown, and the glass-roofed rink atrium on the podium. Source is in `src/peregrine/landmarks/top-cities/tour-1000-de-la-gauchetiere/`; GLBs and manifest are in `public/models/buildings/`.

## Sources and dimensions

- [Wikipedia](https://en.wikipedia.org/wiki/1000_de_La_Gaucheti%C3%A8re): completion 1992, 205 m roof height, 51 floors, architects, triangular copper roof, four copper-capped corner rotundas and indoor rink. Height is limited by the Mount Royal elevation envelope; no altitude is baked into this model.
- [Official Le 1000 site](https://le1000.com/en/): identity and public rink.
- [OSM way 114875723](https://www.openstreetmap.org/way/114875723) and its 46 contained building parts, read from the supplied dossier dated October 2026: podium envelope, atrium position, 17/26/32/40/58/138/153/158/165/198/205 m levels. Ownership lists every part from 1112189504 through 1112189549 and the outer way; the separate underground bus-terminal outline is not claimed.
- Reference photographs and exact creator/licence links are recorded in the catalog. The supplied sheet contains CanadianPhotographer (CC0), Niranjan Arminius and Jeangagnon (CC BY-SA 4.0), Montrealais and Andrevruas (CC BY-SA 3.0). Photographs remain in ignored scratch only; no mesh or texture was copied.

| Quantity | Value | Basis |
| --- | --- | --- |
| Roof height | 205 m | published and OSM |
| Storeys | 51 | published; near facade pitch is an estimate rather than a floor survey |
| Tower principal axis | 125° | mapped control points (-73.566195,45.4986211) and (-73.5656153,45.4983443), approximately 125.1° |
| Main tower envelope | approximately 45 × 66 m | regularised mapped setbacks |
| Crown eaves / ridge | 170 / 198 m, cap to 205 m | 28 m roof slope and cap height mapped; exact cap profile estimated |
| Podium | exact mapped outer ring, 17 m | mapped; local facade panelling estimated |
| Rink atrium | about 22 × 15 m, eaves 21 m, ridge 26 m | footprint and highest point mapped; eaves and panel rhythm estimated |
| Office grid | 3.7 m pitch, approximately 3 m bays near | estimated from reference photos; far combines paired rows and wider bays |

## Construction

Metres, east/up/south, rigid y=0 local grade, origin [-73.56627,45.49824]. Rotation is baked once into the exported geometry. A disjoint rectangular height field regularises the mapped shaft parts, exposes the stepped corners and avoids buried walls between touching tower segments. Every visible wall is tiled into separate stone and glass quads, with no full-wall backing plane beneath the windows. Far keeps the same envelope and setbacks with a coarser two-dimensional pane grid. Seven merged material draws in each LOD; no textures or extensions.

The crown is a long truncated pointed roof with sloped blue-green panels and copper ribs. The pitched atrium closes the hole reserved in the podium roof. Four compact copper-capped entrance rotundas suggest the real corner entrances. Sparse deterministic `glow` panes become warm at night; other materials dim. Geometry is indexed after panel creation to preserve crisp normals without duplicating every corner.

Approximation limits: the mapped irregular tower plan is regularised, rounded high-level bays are represented by recessed square bays, the ridge cap is simplified, rotunda caps are low-poly conical suggestions, and the interior rink/underground terminal is not modelled. Podium ground facades, window lighting, crown panel spacing and colours are estimates. These are original authored geometry, not a survey.

## Export cost

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,862 | 7 | 1,132,048 | 1105.5 |
| Far | 10,396 | 7 | 423,296 | 413.4 |

Both fit building budgets. Far and near have identical measured bounds: [-61.6572,0,-55.3369] to [66.4090,205,63.4855] m. These are default-scene mesh costs, not measured vehicle hardware performance.

## Verification evidence

Looked at supplied `tmp/top-cities/tour-1000-de-la-gauchetiere/refs-sheet.jpg`, then procedural source sheet under `tmp/top-cities/shots/tour-1000-de-la-gauchetiere/source/`. The first view exposed reversed clipped triangles on the sloped crown: corrected winding using the first non-degenerate triangle, and reduced the granite/glass contrast.

Final exported near/far GLBs were rendered in light/dark from overview, facade, opposite rear, above roof, entrance and crown detail cameras. All four sheets were viewed together with the reference photos in `tmp/top-cities/shots/tour-1000-de-la-gauchetiere/comparison.jpg`; individual sheets are in `glb-{near,far}-{light,dark}/` there. The corrected crown is continuous, the setbacks and atrium remain in far, the office panes remain a grid, and nighttime panes are warm. A top view also checks the red mapped envelope.

Focused tests pin height and grade, seven different setback/roof samples by raycast, roof slopes, atrium ridge and eaves, exact footprint containment for every vertex, all mapped ownership ids, glass/stone grid presence, identical LOD bounds and cost reduction. Export bounds round trip is covered by the shared conformance test. Depth ordering is regenerated from exported geometry and must contain zero dropped material-cycle edges.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Provider replacement, terrain contact and runtime shared-material shading are checked separately by the lead; inspector renders establish none of those gates. Independent review and app captures remain with the lead, as specified in the builder brief.

Final deterministic checks: all 11 landmark-specific tests pass; the three filtered shared conformance cases for this landmark pass, including exported source bounds, byte budgets and catalog agreement. `qa-metrics.mjs --ids tour-1000-de-la-gauchetiere` reports no issues: zero coplanar pairs, zero layered faces, zero back-face hits in its 273-ray sweep, no window-rhythm flags and no member-end candidates. Catalog validation passes with 425 entries and 834 variants at the time of checking, and the local catalog preview builds successfully. The named depth table is current with zero dropped cycle edges. Raw metrics are in `tmp/top-cities/tour-1000-de-la-gauchetiere/metrics.json`; the requested full top-cities conformance run also passes with zero failures and is logged in `tmp/top-cities/tour-1000-de-la-gauchetiere/test-results.txt`.
