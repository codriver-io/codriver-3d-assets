# Ohio Statehouse — Columbus, Ohio

Original procedural model of the present Capitol Square compound at 1 Capitol Square: the 1839–1861 Greek Revival Statehouse, the enclosed atrium and the 1901 Judiciary/Senate annex. Its identifying features are buff Columbus limestone, eight west Doric columns, six-column north/south porticos, a broad low roofline, and a two-storey cylindrical cupola with a shallow cone rather than a hemispherical dome. The east annex has its own elevated four-column recess and pediment.

## Sources and dimensions

Research started with `tmp/top-cities/ohio-statehouse/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}`. Reference-only photos remain in ignored scratch; neither photos nor textures enter the GLBs.

| Feature | Model | Basis |
| --- | --- | --- |
| Cupola drum diameter | 19.5072 m / 64 ft | [CSRAB official cupola](https://www.ohiostatehouse.org/about/capitol-square/statehouse/cupola) |
| Top of pinnacle | 48.1584 m / 158 ft | Same official source; slender pinnacle/pole profile estimated |
| Cupola drum | Officially 70 ft tall | Interpreted from photos as including enclosure below the visible rooftop cylinder; this interpretation is estimated |
| Visible cupola | y=23.8–38.336 m | Photo-estimated tier split; roof cone to 40.05 m and raised skylight to 41.4 m |
| Exterior skylight | 9.4488 m / 31 ft | Official cupola source |
| Main building envelope | about 57 × 93 m | Dossier OSM outline; exported masonry inset to fit mapped envelope |
| Main entablature / roof | 17 m / about 20 m | OSM part height and roof-height tags; tier allocation estimated |
| West portico | Eight columns | [CSRAB logo explanation](https://ohiostatehouse.org/about/csrab), confirmed by front photo |
| Column shaft/capital | 13.1 m total, 1.84 m shaft diameter | Estimated from front photo |
| Annex / connector | about 28 × 67 m / 17 × 38 m | OSM mapped parts; facade detailing estimated |
| Annex height | Main roof 20 m, pediment 21 m | OSM 20 m part height; pediment estimated from rear photo |

[CSRAB architecture](https://www.ohiostatehouse.org/about/capitol-square/statehouse) identifies Columbus limestone and broad horizontal Greek Revival massing. The [atrium description](https://ohiostatehouse.org/about/capitol-square/atrium) confirms the connector uses the same limestone vein.

Photos inspected: Carol M. Highsmith, *Columbus, Ohio - Highsmith 40* (public domain), dossier `refs/1.jpg`; Sixflashphoto, *Top of Ohio Statehouse on 9-11 1* (CC BY-SA 4.0), `refs/5.jpg`; Bob Hall, [*Ohio Statehouse aerial shot (9843708756)*](https://commons.wikimedia.org/wiki/File:Ohio_Statehouse_aerial_shot_(9843708756).jpg) (CC BY-SA 2.0), `refs/6.jpg`; levlaz, [*Ohio Statehouse Rear*](https://commons.wikimedia.org/wiki/File:Ohio_Statehouse_Rear.jpg) (CC BY-SA 2.0), `refs/7.jpg`. Commons file licensing was checked; the first reference sheet also includes older documentary views.

## Geographic frame and ownership

Metres, +X east / +Y up / +Z south. Origin `[-82.9991013, 39.9613191]` is the mapped cupola centre. Local y=0 is rigid flat-map grade, without baked terrain elevation. Rotation +8.85° around Y is baked into source and exports, from the main northern outline edge between `[-82.9995069,39.9616933]` and `[-82.9988481,39.9617723]`; its eastward bearing is about 81.15°, and the main facade points west at about 278.85°.

The compound outline is OSM way 30172881. Provider parts 849502268, 849502269, 849502270, 1125310283, 1125310284, 1454785003, 1454785004, 1454785005, 1454785223 and 1454786126 are all listed with their complete mapped rings. Neighbouring buildings and the detached 7 m² site cabin are excluded. A supplemental 3.2 × 39.6 m bounded west-stair ring covers the stair projection omitted by the building outline. The model retains the two courtyards alongside the narrower atrium connector. A bounded median terrain pad covers the compound and stair; terrain placement is a separate gate.

## Geometry and approximations

All meshes are original and texture-free. Facades are partitioned into masonry and real recessed window surfaces, with opening reveals; glass never overlays a solid wall. The near model has fluted tapered Doric shafts, capitals, window frames/mullions, a few dentils and roof chimney stacks. Far preserves the same bays, two window rows, column gaps, pediments, drum and roof silhouette; it drops mullions/dentils and reduces curved subdivisions. Seven merged named materials are calibrated to the buff limestone and muted oxidized roof; the dark palette includes a sparse warm window material.

Fine inscriptions, figurative relief sculpture, the interior rotunda, monuments, flags, landscaped grounds, and exact skylight framing are omitted. Column sizes, drum vertical tier allocation, openings, roof equipment and pinnacle profile are estimates rather than survey data. Official and OSM diameter/height tags differ: the official 64-foot drum is used, rather than the larger mapped enclosing roof polygon or OSM's roughly 40 m top-height tags.

## Verification and integration

Initial procedural sheet inspected: `tmp/top-cities/shots/ohio-statehouse/ohio-statehouse-procedural-near-light-sheet.jpg`, all six views. Comparison with references prompted added wing pilasters and west entrance doors, lighter roof glazing, closed pediment prisms, and the annex's actual recessed four-column upper portico. Tests also prompted closed entablature soffits.

Final exported GLB comparison judged in all 20 frames: `tmp/top-cities/shots/ohio-statehouse/exported-comparison.jpg` places west, drum, aerial and annex photos beside facade/back/roof/street/detail renders for near/far in light/dark. Four original exported sheets also remain alongside it as `ohio-statehouse-glb-{near,far}-{light,dark}-sheet.jpg`. The near/far cupola and colonnade silhouettes agree; glazing retains separate rows/bays at distance, the roof sits within the mapped compound, and the lighter skylights no longer read as black roof holes. The annex portico reads as a recess, while the wider Statehouse remains the dominant mass. 

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Inspector renders do not establish provider replacement, runtime material shading, DEM contacts, mode changes or lifecycle behavior; the lead owns those app checks.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 19,742 | 7 | 818,764 | 799.6 |
| Far | 6,774 | 7 | 348,668 | 340.5 |

Final `pnpm build:top-cities-landmarks ohio-statehouse --no-check` succeeded; an earlier attempt encountered another builder's temporarily missing Amsterdam helper, which was resolved before final export. The standard export command produced the delivered assets; the temporary isolated exporter is retained only in ignored scratch.

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/ohio-statehouse/ohio-statehouse.test.js`: **395 passed, zero failed**, including five Ohio observable geometry tests. Tests cover measured drum/pinnacle, low-cone profile, all 24 drum window bays in two rows, portico gaps, floor/soffit support with a shortened-end negative control, annex recess, courtyard voids, stair approach, mapped envelope, ownership and identical LOD bounds. Export/source bounds match exactly through the shared conformance tests.

`node scripts/asset-catalog.mjs`: **valid**, 266 entries and 470 GLB variants at check time. `pnpm assets:preview`: **passed**, ignored local inspector generated. `node scripts/landmark-depth-layers.mjs --ids ohio-statehouse --check`: **current**, with zero dropped cycle edges during generation. `qa-metrics.mjs --ids ohio-statehouse`: **no issues**; both LODs have zero layered faces, near has zero coplanar overlaps, no removable lift bytes, and an approximately 1% backface sweep rate below the 2% gate. Metrics are saved to `tmp/top-cities/ohio-statehouse/qa-metrics.json`.

The shared generated depth table is the only edited file outside the owned landmark/catalog/doc/exports. No app server, runtime layer changes, git writes, staging promotion or full-suite run occurred. Independent visual review and both-mode app integration remain for the lead; fine sculpture and exact ornamental fidelity remain intentional approximations.

## Independent-review refinement — 2026-10-12

Mint roof colour: desaturated the roof to muted grey-green (#858e88 light, #444b48 dark), preserving the buff limestone and flat-topped cylindrical drum. Geometry and scene costs are unchanged.

Opened and judged `tmp/top-cities/shots/ohio-statehouse/review-fix/ohio-statehouse-glb-near-light-sheet.jpg` and the matching `-far-light-sheet.jpg` against the supplied dossier/reference and reviewer findings. This was one look-fix iteration. All 437 combined dedicated and top-cities conformance tests pass; catalog validation passes (266 entries / 488 GLB variants), and the five-asset depth generation/check passes with zero dropped cycle edges.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| near | 19,742 / 7 / 818,764 | 19,742 / 7 / 818,764 |
| far | 6,774 / 7 / 348,668 | 6,774 / 7 / 348,668 |

Both remain within building budgets. The reviewer found the pictured footing/provider replacement acceptable for Vulcan, Griffith and Notre-Dame; this worker made no terrain or footprint changes and captured no new app shots.

Post-refinement deterministic QA: **ok**, no reported issues; `tmp/top-cities/freedom-tower-miami/review-fix-qa.json`. The ignored local catalog and inspector preview rebuilt successfully with `pnpm assets:preview`.
