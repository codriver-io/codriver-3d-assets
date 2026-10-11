# Old Orange County Courthouse — Santa Ana

Original, texture-free procedural model of the present restored courthouse at 211 W. Santa Ana Boulevard. Its 1901 dedication, granite and red sandstone construction and 30,000-square-foot floor area are documented by [OC Parks](https://parks.oc.gov/historic-sites/old-orange-county-courthouse), with [construction/restoration history](https://parks.oc.gov/historic-sites/old-orange-county-courthouse/history). The current photographs show the roof without the former historic tower; this model follows that visible state.

## Geographic frame and dimensions

Local origin `[-117.8691702, 33.75021915]` is the mapped outline's bounding-envelope centre. Metres, east/up/south, rigid granite foundation at `y=0`; no absolute altitude, terrain height or Mercator stretch. OSM `ele=38` is deliberately not baked in. [OSM way 228740921](https://www.openstreetmap.org/way/228740921), from the prepared dossier, is the sole building owned; none of the neighbouring church/commercial buildings is included.

| Feature | Value | Evidence |
| --- | --- | --- |
| Dedication | 1901 | OC Parks, sourced |
| Total floor area | 30,000 sq ft (~2,787 m²) | OC Parks, sourced; not a footprint measurement |
| Outer mapped envelope | ~43.1 × 28.1 m | OSM geometry, mapped |
| Grid skew | ~0.45° | Two mapped points: west edge `[-117.8694038,33.7500948]` and `[-117.8694016,33.7503338]`; east long edge corroborates |
| Front direction | south, bearing ~180.45° | Street-facing reference facade and mapped plan |
| Export rotation | -0.45° about Y | Baked into all geometry, never applied twice |
| Granite basement | 2.7 m | Photo-derived estimate |
| Eave/cornice | 15.6 m | Photo-derived estimate |
| Highest gable coping/finial | 23.29 m | Photo-derived estimate; measured mesh top |
| Hip ridge | 20.7 m | Photo-derived estimate |
| Entry stair | 8.9 m wide, 2.7 m rise, ~7.3 m projection | Photo-derived estimate |

The small 0.25 m survey steps along the east outline are consolidated in the authored wall runs. Cornices/eaves project up to 0.6 m beyond the OSM walls. The second ownership ring explicitly covers the authored entrance stair; it is not a second OSM way or an invented building. Foundation is continuous beneath the shells. A 29 m pad covers the approximately level Santa Ana site; terrain variation is not surveyed.

## Geometry and references

`src/peregrine/landmarks/top-cities/old-orange-county-courthouse/` contains the spec, exact mapped footprint plus authored stair envelope, geometry, original solid constructors, view presets and observable tests. Model signature: three genuinely recessed arched portals above the granite stair, five central upper arches, three-window corner groups, tall centre and side pediments, arched corner dormers, hipped red roofs, corbel cornices and rusticated sandstone courses. Openings are cut from facade shells; glazing is behind the wall, not pasted over a solid extrusion. Near includes mortar gaps, relief blocks, divided sash, basement grilles and roof ribs. Far retains the openings, roofline and full footprint, using planar trim and fewer arch segments.

Materials: warm red/brown sandstone, relief ashlar, slightly lighter carved trim, pale grey granite, red clay roof, dark glass, dark timber and iron. Both theme palettes use the same names. Sparse `glow` window panes illustrate evening occupancy; the actual lighting pattern is not surveyed.

Reference sheet `tmp/top-cities/old-orange-county-courthouse/refs-sheet.jpg` was viewed before authoring. Checked comparison references:

- [Nkpug, Old Orange County Courthouse Santa Ana CA.jpg](https://commons.wikimedia.org/wiki/File:Old_Orange_County_Courthouse_Santa_Ana_CA.jpg), CC BY-SA 4.0 — oblique south/west facade, roof pitch, dormers and sandstone courses.
- [Cbl62, Old Orange County Courthouse, Santa Ana, California.jpg](https://commons.wikimedia.org/wiki/File:Old_Orange_County_Courthouse,_Santa_Ana,_California.jpg), CC BY-SA 3.0 — frontal facade, five upper arches and three entrance mouths.
- [Loco Steve, “Old Orange County Courthouse” Santa Ana CA. - panoramio.jpg](https://commons.wikimedia.org/wiki/File:%22Old_Orange_County_Courthouse%22_Santa_Ana_CA._-_panoramio.jpg), CC BY 3.0 — frontal proportions and granite plinth; dossier also includes Nkpug's cropped facade and plaque photograph, CC BY-SA 4.0.

Photos remain in ignored scratch only. No mesh, scan, photograph or texture was copied into source or GLBs. The Toronto Old City Hall implementation was studied for detail batching and genuine portal depth, not copied.

## Approximation and verification

Rear window grouping, rear roof junctions, precise stone courses, room interiors and carved foliage are reconstructed. Flagpole, cannons, lawn, trees, plaques, lettering and site furniture are omitted. Height and floor dimensions are estimates rather than published measured elevations. The exporter measures scene triangles, draws and uncompressed bytes, not actual Tesla performance.

First procedural contact sheet: `tmp/top-cities/shots/old-orange-county-courthouse/old-orange-county-courthouse-procedural-near-light-sheet.jpg` (overview, facade, back, roof, street and detail). It established the recognizable facade but exposed filled gable windows; the roof end caps were removed. Far trim and glazing were flattened to reduce cost while preserving openings. Deterministic QA then located coplanar roof undersides against gable feet; those hidden caps were removed before final export verification.

The exported contact sheet was opened and judged next to the frontal Cbl62 and oblique Nkpug photographs: `tmp/top-cities/shots/old-orange-county-courthouse/export-reference-contact-sheet.jpg`. It includes GLB near/light, far/light, near/dark and far/dark, each with overview, front facade, back, roof, street and entrance detail. Separate six-view sheets are `old-orange-county-courthouse-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory. Roof gable glazing is now visible, true entry recesses remain, the far silhouette matches near, the rigid base touches grade and no large coplanar overlaps remain. The back elevation is plausible reconstruction with no dedicated rear photograph and is not claimed as surveyed. Fine sandstone colour/relief and roof junctions remain stylized rather than photorealistic.

| Export | Triangles | Scene draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| near | 37,209 | 9 | 1,963,644 | 1917.6 |
| far | 4,655 | 8 | 220,080 | 214.9 |

Rebuild: `pnpm build:top-cities-landmarks old-orange-county-courthouse --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/old-orange-county-courthouse/old-orange-county-courthouse.test.js`. The landmark tests pin the observable width, roof tip, grade contact, ownership envelope, recessed three portals, five upper arched windows, open gable glazing, stair connection and near/far silhouette; heights are explicitly estimated, not claimed as sourced survey dimensions. Deterministic exported QA is recorded in `tmp/top-cities/old-orange-county-courthouse/qa-metrics.json`: budgets pass, no removable bridgeLift bytes, no coplanar issues above the 5 m² gate (2 m² of tiny ridge/trim candidates remain), 0.5% near back-face sweep hits (below the 2% gate), bounds agree between LODs.


## Integration handoff

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Runtime loading, provider replacement, terrain arrival, terrain toggles, origin shifts and actual hardware were not checked in this asset-authoring task. The structure must remain rigid on its local granite base; the surrounding site is expected to be approximately level. Independent exported-GLB review is the coordinator's next gate.

Validation results (2026-10-04): all five landmark-specific tests pass and all three courthouse conformance checks pass, including exported byte metrics and source/GLB bounds. The combined conformance command exits nonzero because another landmark (`palace-of-the-parliament`) exceeds the far byte budget; the global catalog check initially fails because `docs/3d-top-cities-basilique-de-fourviere.md` is missing. Neither file belongs to this landmark's worker and neither was changed; the coordinator was notified. The courthouse record has valid source/doc/inspection links and measured exports, independently checked by the targeted QA tool.

The final exported top-view sheet `tmp/top-cities/shots/old-orange-county-courthouse/old-orange-county-courthouse-glb-near-light-top-sheet.jpg` was also opened to verify the mapped skew, envelope and authored stair against the red ownership rings. The coordinator confirmed that unrelated catalog/conformance failures are assigned to their active builders and authorized completion against this landmark’s passing checks.

The unchanged `loadAssetCatalog` validator from `scripts/asset-catalog.mjs` also passes against an isolated scratch catalog containing only this record and links to this source, documentation and exports: **1 ready record / 2 measured variants** (`tmp/top-cities/old-orange-county-courthouse/catalog-validation.json`). All eight selected courthouse-specific/conformance tests pass when filtering out other landmarks.
