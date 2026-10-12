# Jefferson Memorial — Washington, D.C.

Original texture-free procedural model of the permanent Thomas Jefferson Memorial at 900 Ohio Drive SW, completed in 1943, with the bronze statue installed in 1947. It represents the restored white-marble building, without temporary scaffolding, visitors, trees or water. The circular Ionic peristyle, shallow dome, northern pedimented portico and broad stepped approach establish its identity from the Tidal Basin and 14th Street approaches.

## Sources and geographic frame

The prepared dossier lives in ignored `tmp/top-cities/jefferson-memorial/`: `osm.json`, `osm.txt`, `facts.txt`, `refs-sheet.jpg` and six credited Commons references. [NPS dimensions](https://www.nps.gov/thje/learn/historyculture/places.htm) and [NPS architectural features](https://www.nps.gov/thje/learn/historyculture/memorialfeatures.htm) establish the column counts, widths, materials and statue. The [National Register description](https://npgallery.nps.gov/GetAsset/9de39bc1-a695-4052-968d-97b45e54feb1) supplies portico depth and pediment dimensions. The [historic memorial booklet](https://npshistory.com/publications/thje/memorial.pdf), structural-statistics page 28, distinguishes roadway height from chamber height; [USGS report 93-350](https://pubs.usgs.gov/of/1993/0350/report.pdf), Figure 1, supplies the column setting plan. These two PDFs were downloaded only into ignored scratch and visually inspected with Poppler.

Origin `[-77.0365547, 38.881383]` is the center of the mapped dome, [way 248460781](https://www.openstreetmap.org/way/248460781). Coordinates are metres east/up/south. Local y=0 is the foot of the retaining terraces; the chamber floor is y=4 m. No road, basin, Mercator stretch, DEM height or absolute elevation is baked into the asset. The 0.432° clockwise-from-north frontage is baked into the geometry once, measured from the portico edge control points `[-77.0367214,38.8816534]` and `[-77.0363808,38.8816514]`.

All **49** building/building-part IDs in the dossier are recorded in `OSM_WAYS`. Fifteen enclosing rings replace the dome, drum, walls, terraces, stairs, plinth and stair buttresses; the tiny individual column parts lie within those masks and do not need separate sub-4 m² rings. [Way 1491844988](https://www.openstreetmap.org/way/1491844988) supplies the complete principal building envelope. The outer grass terrace is way 248460790, stair flight 248460690, and detached buttresses 248460777/248460779. Source terrace geometry is generated directly from mapped polygons, including the northern connections and southern recess. Neighbors and roadways are outside ownership.

## Dimensions and estimates

| Feature | Model | Basis |
| --- | ---: | --- |
| Peristyle cornice diameter | 50.292 m / 165 ft | NPS published diameter |
| North portico width × depth | 31.0896 × 13.716 m / 102 × 45 ft | NPS / National Register |
| Exterior columns | 38: 26 circular + 12 portico | NPS / USGS setting plan |
| Interior columns | 16: four per opening | NPS / USGS setting plan |
| Exterior column height / shaft base diameter | 13.1064 / 1.6002 m | NPS 43 ft / 5 ft 3 in |
| Interior column height | 11.938 m | Historic booklet 39 ft 2 in |
| Standing statue / pedestal | 5.7912 / 1.8288 m | NPS 19 ft / 6 ft |
| Exterior apex above chamber floor | 29.1592 m / 95 ft 8 in | Estimated exterior height: published 91 ft 8 in interior plus 4 ft shell thickness |
| Apex above authored terrace datum | 33.1592 m | Previous height + mapped/estimated 4 m floor |
| Published roadway-to-apex height | 39.4208 m / 129 ft 4 in | Historic booklet; **different datum**, not the reusable GLB height |
| Dome diameter | 34.4 m | OSM dome outline |
| Pediment base / apex | y=19.8496 / 22.8976 m | National Register 10 ft pediment, apex 62 ft above floor |
| Exterior shaft centers | 22.2 m ring; front row ±13.3 m | OSM-informed fit, regularized with USGS plan |
| Drum, cap curvature, wall thickness, stair rhythm | Procedural estimates | Photo / OSM comparison |

OSM's vertical heights (39 m dome, 16.5 m column top) use inconsistent or undocumented datums; they are retained as research evidence rather than treated as a vertical survey. The NPS record also contains conflicting interior-ceiling numbers. The model prioritizes published relative dimensions, the historic booklet and reference silhouette; exterior shell thickness remains an estimate. The front row in OSM contains only seven mapped shafts and places one near the central axis; the NPS/USGS octastyle layout restores eight shafts and a genuinely open center bay.

## Geometry and materials

The dome is a smooth outer loft with a separate inward-facing chamber ceiling. Closed annular profiles create the drum, stepped circular cornices and peristyle soffit. Four curved chamber wall quadrants leave cardinal openings; sixteen inner Ionic columns retain their clear bays. The portico is an original triangular prism with closed roof and soffit. Its pediment relief groups standing Jefferson with four seated committee figures around a table; sculpture is deliberately stylized. The bronze standing Jefferson has separate head, torso, coat, legs, arms, document and a grounded granite pedestal represented with the dark bronze material.

Columns are **unfluted**, following the actual building, with turned bases, smooth tapered shafts, Ionic scrolls and abaci. Near retains four scrolls and two spiral rims per capital, dentils and raised pediment mouldings. Far retains all 54 columns, portals, relief group and statue while simplifying capitals, dome segments and tread count. Repeated components merge into five material draws per LOD.

The pale subdued marble palette follows the reference masonry; the older photos show pre-restoration dome staining, which is omitted. Named `stone`, `interior`, `granite`, `turf`, and `bronze` materials have matching day/night palette keys. Dome shading uses actual normals to preserve curvature. Dark theme dims the masonry; actual floodlight distribution is not simulated. All figures, joints and ornament are original geometry. Inscriptions, fine egg-and-dart carving, detailed coffers, basement interiors and accessibility ramp are omitted. No reference photograph, scan or texture ships.

The rigid foundation uses bounded median terrain-pad metadata with entrance/side reference points and a seven-metre feather. The grass perimeter is a graded open bank between the lower stone terrace and local grade, without exposed vertical granite sides. Terrain-pad metadata is a placement handoff, not measured DEM certification.

## Verification and measured exports

Looked at the dossier reference sheet and USGS Figure 1, then the first procedural sheet `tmp/top-cities/shots/jefferson-memorial/jefferson-memorial-procedural-near-light-sheet.jpg`. This exposed an unshaded dome with unreadable curvature and an obstructed center entrance inherited from incomplete OSM columns. The correction restored marble shading, the source-based octastyle layout, all four open cardinal portals and continuous stair buttresses. Far was reduced from an initial 17,612 triangles to 9,556.

Looked at **every tile** of `tmp/top-cities/shots/jefferson-memorial/jefferson-memorial-export-reference-sheet.jpg`: exported near/far, light/dark columns; overview, facade, back, roof, entrance, close Ionic/pediment detail and mapped plan rows; six reference photos and the USGS plan alongside. Both LODs preserve the circular silhouette, open peristyle, centered recessed statue and pediment. Dark masonry and sculpture remain readable as a dim night approximation. Larger component sheets are `jefferson-memorial-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 42,132 | 5 | 1,351,004 | 1319.3 |
| Far | 9,464 | 5 | 379,876 | 371.0 |

Near and far bounds are identical: approximately 89.72 × 33.16 × 95.82 m including the mapped grass terraces and stairs. Both meet the building budgets. Focused tests observe sourced dimensions, 54 shafts, real portico gaps and chamber openings, statue/pedestal dimensions, continuous stair treads, envelope containment and LOD silhouette. Geometry tests complete in under three seconds. No cables, stays, unsupported beams or truncated walkways are authored; structural member terminal tests are N/A. Columns are observed standing on the terrace and under capital/roof geometry.

Deterministic export QA is recorded in `tmp/top-cities/jefferson-memorial/qa-metrics.json`: no issues, zero different-material coplanar pairs, zero layered faces, zero back-facing first hits, no redundant bridge attributes and no material cycles. The generated depth table is refreshed only for this ID.

Final combined conformance run: **474/475 pass**; all six Jefferson tests and all three Jefferson registry/source/export checks pass, and the only failure is another in-progress landmark, High Museum of Art, at 76,308 near triangles against its 60,000 budget. Full catalog validation and `pnpm assets:preview` were retried after more than one minute and remain blocked by another builder's missing `docs/3d-top-cities-buckingham-palace.md`; no shared source or other landmark was edited to bypass this. Jefferson-specific QA and depth freshness checks pass through the tools' per-record fallback. The durable combined test log is `tmp/top-cities/jefferson-memorial/focused-tests.txt`.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. No app server was started and no deployment performed.

## Rebuild

```sh
pnpm build:top-cities-landmarks jefferson-memorial --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/jefferson-memorial/jefferson-memorial.test.js
node scripts/asset-catalog.mjs
node scripts/landmark-depth-layers.mjs --ids jefferson-memorial
node scripts/landmark-depth-layers.mjs --ids jefferson-memorial --check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids jefferson-memorial --out tmp/top-cities/jefferson-memorial/qa-metrics.json
```

## Independent-review correction, 2026-10-12

Removed the raised lawn disk and exposed granite sidewall. An original open turf bank slopes from y=3 at the mapped lower architectural terrace to y=0 on the mapped landscaped perimeter in both LODs; stone terrace steps and stair approach are retained. Raycasts observe the slope descending from approximately 1.88 m at x=35 to 0.40 m at x=43. Terrain-pad metadata remains unchanged; the lead must verify the outer contact against runtime terrain in both modes.

Inspected exported near/light and far/dark sheets at `tmp/top-cities/shots/jefferson-memorial/review-fix-final/jefferson-memorial-glb-{near-light,far-dark}-sheet.jpg` against the dossier references and b6a review. The sheets show the corrected feature, opposite facades and complete main silhouette; ornament remains a photographic approximation. No more than two look-fix rounds were used.

Current validation supersedes earlier concurrent-build exceptions: the combined registry and four-landmark run passes **506/506 tests**, including the graded-lawn and pointed-dormer regressions. Exported geometry QA reports all four on budget with no issues. Depth regeneration/check passes with **zero dropped cycle edges**; the shared generated table may be overwritten by concurrent workers, so the lead regenerates all IDs before commit. `node scripts/asset-catalog.mjs` validates 286 records / 560 GLB variants and `pnpm assets:preview` builds the ignored local catalog.

Cityscape and Full 3D world remain **not tested by this correction worker**. The independent review inspected pre-correction app captures, but new unobstructed app shots, shared runtime shading, provider ownership and Jefferson's graded perimeter/terrain-pad contact are the lead's required recapture and re-review gates.
