# Tower of the Americas — San Antonio

Original procedural model of O’Neil Ford's 1968 HemisFair tower in its present restaurant/observation configuration. Identity: one pale fluted concrete shaft, exterior glass elevator line, ribbed annular underside, tapering multi-level top house with separated glazing tiers, broad roof lip and narrow antenna. Source is editable Three.js; no mesh, scan, texture or photo ships.

## Sources and dimensions

Read 2026-10-13. [Official tower history](https://www.toweroftheamericas.com/history/) establishes 750 ft overall, 45 ft shaft diameter, 76 ft top-house height and 1968 construction. [ASCE Texas Section](https://www.texasce.org/tce-news/building-of-the-tower-of-the-americas/) corroborates the structural dimensions and three elevators. [Skyscraper Center](https://www.skyscrapercenter.com/building/tower-of-the-americas/9604) records the 622 ft / 189.6 m roof; [Wikipedia](https://en.wikipedia.org/wiki/Tower_of_the_Americas) provides overall/roof-height context. The official history's outdated restaurant name is not used.

| Feature | Model | Basis |
| --- | --- | --- |
| Overall / roof height | 229 / 189.6 m | Published 750 / 622 ft |
| Top-house extent | 166.43–189.6 m | Published 76 ft / 23.1648 m height |
| Lower shaft outer diameter | 13.716 m | Published 45 ft |
| Maximum top-house diameter | 32.8 m | Inscribed in mapped ~33 m envelope |
| Shaft taper / flute count | 3.2% / 12 | Photo estimates |
| Restaurant glazing | 170.5–176.45 m | Photo estimate |
| Observation glazing | 179.8–184.3 m | Photo estimate |
| Recessed top gallery | 185.55–188.1 m | Photo estimate |
| Café/annex roofs | 6.2–9.4 m | Photo estimate, not coarse OSM height tags |
| Elevator bearing / cabin level | 344° / 38 m | Illustrative photo estimates |

The three elevators are represented by one visible exterior glazed line, not three surveyed or moving cars. The revolving restaurant, elevator and antenna are static. Base/annex glazing and detailed tier/bay stations are approximations. Forecourt sign arch, landscaping, flags and interiors are omitted.

## Frame and ownership

Origin `[-98.483573428125,29.419040175]` is the mean of unique shaft-ring vertices in way 351672057. Real metres, east/up/south, local grade y=0. Rotation is baked once. Circular tower massing is rotationally symmetric; elevator orientation is estimated. The northern annex and annular entrance canopy use exact mapped polygons. Annex control points `[-98.483571,29.4191887]` and `[-98.483566,29.4192566]` give an edge ~4° east of north (about 7.6 m long).

Every provider part is owned: outline **78485919**, antenna **351672055**, northern annex **351672056**, shaft **351672057**, circular base **351672058**, top house **351672059**, annular crescent canopy **351672060**. Exact rings are in `footprint.js`; the redundant <4 m² antenna ring is covered by the larger top-house mask, with its exact provider id retained in `OSM_WAYS`; no neighbouring convention-centre, Women's Pavilion, roads or plaza pad is masked. Geometry is checked against the outer replacement envelope. Seven canopy columns meet grade and the 6.2 m underside. `padM:31` is a bounded placement request, not DEM evidence; no terrain, absolute altitude or Mercator stretch is baked in.

## Materials and LOD

Seven merged materials: warm pale concrete, muted stone bands, blue-grey glass, subdued green-blue metal and roof, softly lit restaurant glazing at night, neutral antenna steel. Physical shallow flutes supply shaft relief. Glazing and masonry occupy adjacent intervals; mullions meet masonry sill/eave supports. Both LODs retain the same silhouette, base polygons, dish, elevator/cabin and separate glazed tier rhythm. Far reduces radial segmentation, bay/rib counts and guide density.

Photo references retained only in ignored scratch: Michael Barera's [San Antonio May 2018 8](https://commons.wikimedia.org/wiki/File:San_Antonio_May_2018_8_(Tower_of_the_Americas).jpg), CC BY-SA 4.0; Runner1928's [elevator/underside](https://commons.wikimedia.org/wiki/File:Tower_of_the_Americas_San_Antonio_elevator.jpg), CC BY-SA 3.0; Billy Hathorn's [entrance context](https://commons.wikimedia.org/wiki/File:Entrance_to_Tower_of_the_Americas_IMG_4576.JPG), CC BY 3.0. The official history's ExteriorShot01 is all-rights-reserved/reference-only, photographer and licence unspecified, never redistributed. The dossier's `Top of tower of americas.JPG` shows antenna equipment, so it was not used for the top-house profile.

## Export and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 8,240 | 7 | 381,688 | 372.7 |
| Far | 4,440 | 7 | 212,860 | 207.9 |

Rebuild: `pnpm build:top-cities-landmarks tower-of-the-americas --no-check`. Both exports fit budget with headroom; no Tesla-performance claim.

I looked at `tmp/top-cities/shots/tower-of-the-americas/comparison-01.jpg`: references alongside exported near/far light/dark overview and house close-up, opposite side, roof, underside, entrance and plan. The blank annex was corrected with glazing and canopy columns. The footprint regression caught a reflected underside polygon; its coordinate conversion was corrected. Final export evidence is `comparison-final.jpg` in the same folder, with per-variant `tower-of-the-americas-glb-{near,far}-{light,dark}-sheet.jpg`. It keeps the tier profile, concrete shaft flutes and bay rhythm across LODs.

Focused tests pin observable raycast dimensions, flute relief, visible elevator glass, tier/mullion rhythm, equal LOD bounds, footprint-envelope containment, named structural terminal contacts, a deliberately shortened unsupported track negative case, and GLB geometry/material/budget round trips. Own tests run under 3 seconds. Depth layers are regenerated/checked for this id with zero dropped cycle edges. Deterministic QA checks budgets, bounds, layering, coplanar faces, normal winding and window rhythm; its durable output is `tmp/top-cities/tower-of-the-americas/metrics.json`.

**Cityscape: not tested yet. Full 3D world: not tested yet.** Integration is checked separately. The lead still needs unobstructed app screenshots, provider replacement/fallback, DEM footing/pad edges, mode/theme changes, late loads, origin shifts and hardware checks. Inspector/contact-sheet success is asset evidence only. No app server, deployment or Git write was performed; the authorized generated depth-layer table is the only shared source edit.

Final checks (2026-10-13): the required combined `node --test` command passed **593/593**, including all six landmark-specific tests; `node scripts/asset-catalog.mjs` passed (336 entries, 584 variants), and the targeted depth-layer `--check` passed with zero cycle edges dropped. QA metrics report no issues, 0% back-face hits, no coplanar or layered flags, no removable attributes and no window-rhythm flags. The <4 m² antenna mask is redundant inside the exact top-house mask; omitting that ring resolved the conformance minimum-area check while retaining its exact provider id.
