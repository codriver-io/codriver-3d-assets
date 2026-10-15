# Royal Albert Hall, London

Original procedural model of the present external concert hall on Kensington Gore, completed in 1871. The identity is the red-brick elliptical drum, square-headed lower and round-headed upper window orders, buff terracotta decoration and figure mosaic, four projecting two-storey porches, and shallow glazed iron dome. Temporary banners, interior, subterranean services and the separate southwest chimney are omitted.

## Sources and geographic frame

[Historic England, list entry 1217742](https://historicengland.org.uk/listing/the-list/list-entry/1217742) confirms the materials, five external stages, window orders and four cardinal porches. The [published design description](https://en.wikipedia.org/wiki/Royal_Albert_Hall#Design) gives an external ellipse of 83 × 72 m and dome crown 41 m; these set the model dimensions. The dossier supplies the OSM geometry and photograph credits, reproduced in the catalog record. The comparison sheet uses Diliff (CC BY-SA 3.0), Matt Brown (CC BY 2.0), Anthony O'Neil (CC BY-SA 2.0), Txllxt TxllxT (CC BY-SA 4.0), Robin Sones (CC BY-SA 2.0) and Dr Neil Clifton (CC BY-SA 2.0). Photos are reference-only in ignored scratch, never runtime textures. The Diliff file licence was checked on its Commons page.

The origin [-0.17740224625, 51.50101459875] is the vertex mean of the principal drum part, OSM 952279006. The major axis runs approximately 354°/174°, baked once into exported vertices. Two mapped controls on the principal drum are north [-0.1774073, 51.5013915] and south [-0.1773926, 51.5006372]; porch edges establish the small westward skew more clearly than these broad ellipse tips. Coordinates are metres east/up/south and y=0 is rigid local grade. There is no absolute altitude or terrain exaggeration in the reusable geometry.

FOOTPRINTS preserves the full parent envelope 372860405 and all eleven attached/roof parts: 372860406–409 and 952279000–006. The separate chimney 117008109 and all neighboring university/residential buildings remain provider-owned. The south steps are architectural geometry beyond the mapped porch; they do not expand the provider mask.

## Dimensions and interpretation

| Feature | Model | Evidence |
| --- | --- | --- |
| External main ellipse | 83 × 72 m | published; excludes projecting porches |
| Highest dome crown | 41 m | published |
| Upper-window order | 13.05–19.31 m | photo estimate |
| Mosaic figure field | 23.2–26.2 m | photo estimate |
| Main cornice | 28.4 m | photo estimate |
| Inset upper drum | 60 × 70 m, shoulder 33 m | mapped/photo estimate |
| Dome rise above shoulder | 7 m, cap to 41 m | photo estimate constrained by published crown |
| Four porch projections | 7.1–8 m | mapped/photo estimate |
| South stair run / rise | 4 / 1 m | photo estimate |
| Main facade bays | 64 in both LODs | visual rhythm estimate |

OSM roof parts 952279005/004 carry 43.8/46.6 m heights, conflicting with the published 41 m. This model uses the published crown; it does not claim a survey resolving the disagreement. Main drum dimensions and orientation follow the mapped ellipse within architectural trim slack. Frieze poses suggest groups of human figures without reproducing individual mosaic artwork. Roof glass is represented by opaque grey panels and pale iron ribs; fine glass subdivisions, relief subject accuracy and moulding profiles are simplified.

## Geometry, materials and placement

Five merged material batches: muted brick, buff stone/terracotta, dark recessed glass, grey roof glass, and dark mosaic field. Both palettes have identical keys. The main window openings are actual apertures with recessed glazing and connecting reveals. The porch door arches are recessed; the two upper storeys retain three separate glazed bays. The south staircase has continuous supported treads. Curved roof ribbons run from the upper drum to the cap and are supported continuously by roof geometry. Far retains all 64 facade bays, four arched entries, the figure band and roof ribs, with coarser curves and reduced relief density. Identical vertices and normals are welded before export. No external geometry, texture, decoder or non-three dependency is required.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Terrain must place the structure rigidly, check both north and south entrances, and retain nearby roads. Pad radius is 54 m; actual resident DEM sampling, terrain contact, lattice coverage and reversible provider replacement remain the integration handoff. No runtime rollout or app bundle was changed.

## Verification

Inspected the prepared six-photo reference sheet at `tmp/top-cities/royal-albert-hall/refs-sheet.jpg` and the first procedural contact sheet in `tmp/top-cities/shots/royal-albert-hall/iteration-1/`. It established the recognizable dome/drum proportions and two facade orders; the oblique views exposed blank porch returns, so upper side sashes were added. Far detail was reduced from a near-budget 11,968 triangles by dropping concealed bottom caps and coarsening cornice curves while preserving the same silhouette. Final exported evidence and measured checks are recorded below after validation.

Final exported contact sheet **looked at with the image tool**: `tmp/top-cities/shots/royal-albert-hall/final/royal-albert-hall-reference-export-comparison.jpg`. It places the six reference photographs above exported near/light, near/dark, far/light and far/dark sheets, each with overview, north facade, south/back, roof, street and close-detail views. The final exported top plan was also inspected: `royal-albert-hall-glb-near-light-top.png` in the same directory. The model fits the mapped body and four porches; the last south stair has a measured 1.98 m architectural projection beyond the OSM ring, bounded to 2.1 m in tests without widening the replacement mask. No neighboring building is claimed.

Visual findings: red drum and grey shallow dome remain recognizable in far, both window rows retain individual bays, and the four porch arches remain distinct. Roof ribs attach to shoulder/cap supports in both LODs; far roof subdivision was aligned with the 32 ribs to remove edge-only support misses. Entrance depth cycles were fixed by omitting a concealed masonry underside and thin centre mullions. Degenerate apex triangles and unused vertices were removed. The mosaic figures are deliberately simplified and sparse at far; stone mouldings, porch profile and lighting remain stylized, with no photographic floodlight simulation or accurate sculptural narrative. Independent review and unobstructed in-app views remain required.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 23,600 | 5 | 797,760 | 779.1 |
| Far | 10,896 | 5 | 416,500 | 406.7 |

Validation completed on 2026-10-15:

- Required combined `node --test .../top-cities.test.js .../royal-albert-hall.test.js`: **843 passed, zero failures**, including all eleven own geometry tests and three landmark conformance checks; log `tmp/top-cities/royal-albert-hall/tests-final.txt`.
- `node scripts/asset-catalog.mjs`: valid, 406 records / 794 GLB variants at time of check; the earlier unrelated Edmonton document race resolved.
- `pnpm assets:preview`: local ignored inspection catalog built successfully.
- Geometry-derived depth regeneration and `--ids royal-albert-hall --check`: current, **zero dropped cycle edges**; the generated shared table is the sole shared-file exception.
- `qa-metrics.mjs --ids royal-albert-hall`: no issues, no different-material coplanar overlap, no unresolved layered faces after generated ranks, no removable bridge attributes, 0.8% near outside-in back-face hits, matching near/far bounds; report `tmp/top-cities/royal-albert-hall/metrics.json`.

Named support tests explicitly check every roof-rib shoulder against the roof, converging ends against the crown, and deliberately detached endpoints as a negative control. Window tests raycast multiple bays in both rows in both LODs; porch and step tests verify real recesses and continuous ground contact. Provider replacement, terrain lifecycle, app shading and real hardware remain untested. Do not infer terrain or app approval from catalog readiness.
