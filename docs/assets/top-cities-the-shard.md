# The Shard — London

Original procedural model of the completed Renzo Piano tower at 32 London Bridge Street, Southwark, opened in 2012. The skyline features are its eight sloping glass shards, dark winter-garden fractures, uneven open spire and broad lower office floors; at street level the two backpack wings and recessed glazing establish the base. The dossier's construction photos are used for facade rhythm only: construction cranes, exposed concrete and the inaugural red lightshow are not part of this completed-building model.

## Sources and dimensions

- [The Shard operator](https://www.the-shard.com/about/): 309.6 m total height, 95 storeys, highest occupied level 72, viewing floors 68–72 and 244 m gallery elevation, address and completed uses.
- [Renzo Piano Building Workshop](https://www.rpbw.com/project/the-shard-london-bridge-tower): eight glass shards, naturally ventilated winter-garden fractures and extra-white double glazing; completed building photographs by Chris Martin and Michel Denancé.
- [OSM main building](https://www.openstreetmap.org/way/31110737), way 226737912 and the eight blade/core parts from the coordinator's queued Overpass dossier. Geometry is derived ODbL data, © OpenStreetMap contributors. Reused the supplied JSON rather than making another network query.
- Dossier Commons photographs and licences are listed in the catalog provenance and `tmp/top-cities/the-shard/refs/SOURCES.txt`. The completed street view `Shard from Great Tower Street` by EEPaul (CC BY 2.0) provides the principal dossier skyline reference. The additional RPBW aerial by Chris Martin and street image by Michel Denancé are copyrighted reference-only images, retained under ignored `tmp/` and never redistributed.

| Quantity | Value | Evidence |
| --- | ---: | --- |
| Highest glass blade | 309.6 m | Operator, sourced |
| Number of facade shards | 8 | RPBW, sourced |
| Storeys / highest inhabited level | 95 / 72 | Operator, sourced; no literal 95-floor grid imposed |
| Viewing gallery elevation | 244 m | Operator, sourced context |
| Closed roof inside crown | 252 m | OSM part 666126950, approximate map tag |
| East and south backpack heights | 74 / 70 m | OSM parts 665171689 / 665171690, mapped tags |
| Main base envelope | about 65 × 71 m | Simplified facade control points inside mapped outline |
| Full base incl. backpacks | about 73 × 94 m | Exported bounds, mapped outlines |
| Glass floor / bay rhythm | 3.35 / about 1.65 m | Estimated from photos, varies at taper |
| Blade termination pairs | 250–252, 304–309.6, 286–290, 247–253, 250–254, 300–309.6, 255–260, 299–309.6 m | Estimated uneven shard profiles, not surveyed elevations |
| Facade taper | scale = 1 − y/336 | Estimated silhouette; blades retain finite tip width |
| Winter-garden fracture | roughly 0.8–1.7 m | Estimated, recessed closed glazing below the roof |

## Geographic frame and ownership

Origin `[-0.0865, 51.5045]`, real metres, east/up/south. `y=0` is local flat-map street grade; height and geographic stretch are independent. The geometry is already aligned geographically, and needs no host rotation. Two southern facade control points `[-0.0864534,51.5041406]` and `[-0.0867452,51.5042622]` establish a northwest-running edge and southwest-facing frontage around 213.8°. The additional facade points come directly from the mapped outline; two concave east/west vestibule corners are respected by choosing inward mapped control points rather than drawing through their notches.

`FOOTPRINTS` includes the main outline, legacy simple spike outline, eight blade parts, closed occupied core and both backpack parts. London Bridge station, Shard Place, the News Building, hospital and their separate parts are excluded. Every near/far vertex is checked against the replacement layer's actual ownership predicate. The roof and footprint are separate concepts: open crown gaps do not allow the generic provider's upper extrusion to survive.

A rigid base and `padM=70` cover the tower and the mapped backpack wings. This compact London site is not modelled as a hill; no absolute elevation, terrain samples or Mercator stretch are baked into the GLBs.

## Geometry, materials and approximations

Eight independently tessellated sloping panes surround a closed recessed occupied envelope. Above the 252 m roof the blades have explicit backs, narrow edge caps and unequal angled tips; open sky remains visible between them. Horizontal framing is subtle, with thin vertical mullions. Pane colours and a deterministic small proportion of warm lit windows share merged material batches; a lit pane replaces the regular pane, so no coplanar overlay is introduced. Sparse cool crown lights remain in both LODs. The street lobby is recessed with slender attached columns and canopy beams. Both mapped wings have facade rhythm and capped roofs, with a small horizontal inset avoiding shared boundary faces.

Eight palette names are available in light and dark: `glass`, `glassCool`, `glassPale`, `seam`, `frame`, `roof`, `glow`, `light`. Glass is opaque reflective-looking standard material, with no texture, transparency sorting or physical double skin. At night occupied panes glow warm and the crown bands glow cool; the inaugural red laser show is not reproduced. Repetition is merged and coplanar glass vertices are indexed to reduce the delivered bytes. Near retains each facade row and fine bays; far uses three-row spacing, wider bays and the same eight blade silhouettes and open crown.

Approximations: exact plane intersections, individual blade heights, visible steel framing, annex roof curvature, internal blinds, entrance doors, signage and detailed rooftop equipment are not surveyed. The two backpack wings use the OSM polygons with straight walls and simplified flat caps. No surrounding station canopy, plaza, other building, interiors, cranes, photos or external mesh is shipped. Source estimates should not be treated as an architectural survey.

## Build and verification

```sh
pnpm build:top-cities-landmarks the-shard --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/the-shard/the-shard.test.js
node scripts/asset-catalog.mjs
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids the-shard --out tmp/top-cities/the-shard/metrics.json
```

| Final GLB | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 37,358 | 8 | 1,496,724 | 1,461.6 |
| Far | 7,122 | 8 | 351,708 | 343.5 |

These are measured default-scene asset costs, not Tesla device timings. Deterministic GLB QA (`tmp/top-cities/the-shard/metrics.json`) reports zero coplanar pairs, zero back-face hits out of 232 successful sample rays, zero removable bridgeLift bytes, no below-grade geometry and matching LOD silhouettes.

The six focused tests pin the published height, grade, equal LOD bounds, far cost reduction, tapered closed occupied floors, genuinely open crown, both 70/74 m backpack roof contacts, all vertices within owned footprints, exclusion of station/neighbours, outward facade normals, crown illumination and GLB bounds/material/metric round trips. The six landmark-specific tests pass in about 0.66 seconds locally. The exact combined command ran 103 tests: all nine Shard tests passed, and its sole failure was the other worker’s transient `old-orange-county-courthouse` readiness/catalog mismatch. A filtered run of both requested files confirms nine Shard tests pass. The whole catalog subsequently passed with 164 entries and 270 GLB variants; no shared file was modified.

Looked at the reference sheet `tmp/top-cities/the-shard/refs-sheet.jpg`, plus completed-building `refs/7.jpg` (Chris Martin aerial) and `refs/8.jpg` (Michel Denancé street). Looked at source sheet `tmp/top-cities/shots/the-shard/iteration-1/the-shard-procedural-near-light-sheet.jpg` and exported sheet `iteration-2/the-shard-glb-near-light-sheet.jpg`: each includes overview, front, back, roof, street, crown detail, entrance and plan. The first look prompted subtler glass variation, constant-width crown fractures and improved camera framing. A geometry test caught simplified east/west chords crossing two shallow footprint notches; the final base uses their inward mapped control points. The initial unindexed GLB exceeded the near byte cap; shared coplanar vertices were indexed and far framing was thinned before delivery.

Final visual comparison actually read: `tmp/top-cities/shots/the-shard/final/the-shard-export-reference-contact-sheet.jpg`. This labelled contact sheet places the exported near and far GLBs in light and dark alongside the two completed-building photographs, with overview/front, opposite side, above, street, crown detail, entrance and plan coverage. The final silhouette has the uneven separated tips; near glazing reads as a fine grid and far retains it with coarser rows. The two backpacks match the red mapped outlines. The far model's night windows are intentionally broader representative lit bays, and both simple backpack roofs remain an approximation. No additional geometry change was needed after this final look. Underlying PNGs and the four variant sheets are in the same `final/` directory.

## Placement and review gates

- Cityscape: **not tested yet, integration is checked separately**.
- Full 3D world: **not tested yet, integration is checked separately**. Rigid local-grade foundation; pad and entrance datum need application verification.
- Independent reviewer: pending the coordinator's exported-GLB review. Asset-authoring readiness does not establish terrain, device performance or runtime lifecycle correctness.
