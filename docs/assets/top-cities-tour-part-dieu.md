# Tour Part-Dieu (le Crayon), Lyon

Original procedural exterior of the tower completed in 1977, at 129 rue Servient, Lyon. Araldo Cossutta and collaborators designed its cylindrical brown shaft and square glass pyramid; the current upper hotel is Radisson Blu. The pencil silhouette, narrow vertical perimeter piers and dense rectangular window grid are the features visible from 100–800 m. No texture, photograph, scan or third-party mesh ships.

## Sources and dimensions

Sources checked 2026-10-05:

- [Ville de Lyon](https://www.lyon.fr/lieu/architecture-contemporaine/tour-du-credit-lyonnais): 165 m, 71 perimeter columns, construction 1974–1977, brown exterior and glass pyramid. Its hotel name is historical; the [current Radisson Blu site](https://www.radissonhotels.com/en-us/hotels/radisson-blu-lyon) confirms current use and address.
- OpenStreetMap [62337459](https://www.openstreetmap.org/way/62337459), [250863538](https://www.openstreetmap.org/way/250863538), [163278566](https://www.openstreetmap.org/way/163278566), fetched once through the shared Overpass helper; © OpenStreetMap contributors, ODbL 1.0. Both duplicate tower shells and the roof are owned; eastern low office annex 62336703 is omitted and remains provider-owned.
- [Tour Part-Dieu (2022)](https://commons.wikimedia.org/wiki/File:Tour_Part-Dieu_(2022).jpg), Matgrt, CC BY-SA 4.0: silhouette, facade colour and window rhythm.
- [Esplanade Charles-de-Gaulle entrance](https://commons.wikimedia.org/wiki/File:Esplanade_Charles-de-Gaulle_(Lyon)_-_entr%C3%A9e_de_la_Tour_Part-Dieu.jpg), Benoît Prieur, CC0: bronze portal and photographed 44 m diameter plaque.
- Dossier skyline photograph by Romainbehar, CC0, used for the distant silhouette. The dossier's fourth photo depicts a station clock and was excluded as unrelated. Reference photos remain under ignored `tmp/top-cities/tour-part-dieu/refs/`.

| Element | Model | Basis |
| --- | --- | --- |
| Overall top | 165 m | Published by Ville de Lyon; OSM roof top 164.9 m |
| Shaft / shoulder | 141.9 m | OSM shell height and roof min_height |
| Pyramid rise | 23.1 m | OSM roof:height 23 m, reconciled to published 165 m top |
| Shaft diameter | 44.1 m | 44 m on photographed plaque; mapped outline about 44.6 m |
| Perimeter columns | 71 near; 48 grouped far bays | Published 71; far simplification |
| Levels | Lobby + 40 window rows + collar | OSM 42 levels; exact division estimated |
| Roof square | approximately 29 × 29 m | Four OSM roof corners |
| Glazing recess | 0.38 m | Photo estimate |
| Lobby height / portal recess | 5.4 / 1.35 m | Photo estimate |
| Crown mullion grid | 14 bands, 10 divisions per face near | Photo estimate |

## Frame and construction

`origin = [4.85375495, 45.7610615]`, centre of the mapped shell's bounds. Metres, +X east / +Y up / +Z south. Local y=0 is a rigid flat-grade foundation, with no DEM height or Mercator scale baked in. The square crown uses OSM control points `[4.8534921,45.761037]` and `[4.853721,45.7612436]`: their 29 m edge bears approximately 38 degrees. All four geographic corners are projected into the model, so rotation is already exported. The cylindrical shaft has no grid alignment assumption. Its west portal is an estimated local placement.

Custom indexed surface geometry creates exterior piers, spandrels, recessed glazing, continuous jambs, and individual sill/head returns. Thin mullions and four planar pyramid faces preserve facade structure without one mesh per window. `assetBuilder` merges the model into seven materials. Brown terracotta, lighter tan ribs, dark blue-grey glass, bronze portal and muted silver frame are estimated from photographs. Night uses dimmer cladding and a deterministic sparse warm window occupancy through `glow`; this is an estimated lighting pattern. The glass remains opaque.

Far retains the same circular envelope and square pyramid, lobby/portal recess, collar and night colour separation. It groups window pairs into 20 rows and 48 bays, removes individual sill/head returns and internal window mullions, and reduces the crown grid. Continuous jambs close the glass-to-pier seams in both LODs.

Approximations: no Radisson/LCL lettering, internal atrium, interior rooms, roof maintenance plant, detailed glass reflections, plaza paving or adjoining low office annex. The facade pitch and entrance placement are photo estimates rather than an architectural survey.

## Exports and verification

Build: `pnpm build:top-cities-landmarks tour-part-dieu --no-check`.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 30,883 | 7 | 1,676,748 | 1,637.4 |
| Far | 5,260 | 7 | 292,360 | 285.5 |

The landmark tests check 165 m height, 44 m diameter, nothing below grade, 71 observable near piers, genuine facade recess depth, roof taper, opposite-side closure, recessed west entrance, every vertex inside the mapped ownership envelope, far silhouette and exported GLB bounds/materials/triangle counts. The test completes in under one second locally. Costs describe exported default scenes; Tesla hardware performance is unmeasured.

Visual evidence judged:

- `tmp/top-cities/tour-part-dieu/refs-sheet.jpg` — dossier photos; the clock was rejected as unrelated.
- `tmp/top-cities/shots/tour-part-dieu/iteration-1/tour-part-dieu-procedural-near-light-sheet.jpg` — overview, opposite side, roof, portal, detail and plan. The first model had the intended pencil profile and dense window rhythm; continuous jamb geometry and consolidated spandrel strips then reduced repeated geometry without changing the silhouette.
- `tmp/top-cities/shots/tour-part-dieu/exported/tour-part-dieu-glb-reference-contact.jpg` — reference photos next to exported near/far light/dark, opposite sides, roof, street, entrance, window detail and plan. The exported circle fits the red OSM ring and the square roof follows the mapped orientation. Fine crown members were inset to contact their glass support. No visible holes, flipped faces or facade flicker were observed. The first night comparison revealed diagonal light strings from a modular occupancy function; a hashed occupancy distribution replaced it, then all four exported variants were re-rendered and judged in the final contact sheet. Far intentionally groups the fine grid; signage remains an acknowledged omission.

Focused combined conformance and landmark checks passed all 11 Tour Part-Dieu assertions. The required unfiltered combined run had unrelated failures for St Peter’s Basilica (far byte budget) and Teatro Nacional (catalog/ready mismatch); Tour Part-Dieu passed. The shared catalog validator initially stopped on the missing St Peter’s Basilica documentation. Named-record QA succeeded with no issues: near coplanar pairs 0 and backface hits 0% over 439 rays; both LODs within budgets and no removable lift data. No other worker’s files were changed.

Independent reviewer approval is pending coordinator review; this authoring report does not claim it.

## Placement modes

- Cityscape: **not tested yet, integration is checked separately**.
- Full 3D world: **not tested yet, integration is checked separately**. The Part-Dieu block is generally level; the 25 m bounded pad covers the rigid tower footprint. No terrainPad is declared. The lead must check the DEM, pad edges, entrances, default extrusion replacement, late loads, LOD/theme changes and reanchors in the app before certifying terrain integration.

No shared file changes or app/deployment work were needed.
