# Château de Caen

Original procedural present-day William the Conqueror castle in central Caen: the complete enceinte, northern donjon chemise and low ruins, both gates and barbicans, historic halls, Église Saint-Georges and simplified museum buildings. This revision addresses the independent boulevard-view review in `tmp/top-cities/review/chateau-de-caen/REVIEW.md`; no `REVIEW-2.md` was present.

## Evidence and rights

Consulted 2026-10-10:

- [Musée de Normandie: remparts, tours et portes](https://musee-de-normandie.caen.fr/le-chateau-de-caen/la-forteresse-remparts-tours-et-portes): the enclosure follows the rocky promontory; dry rock-cut moat to the north; eleven quadrangular towers and the round Puchot and Mathilde towers. The approximately 20 m relief above the city describes the spur, not the height of the masonry.
- [Porte des Champs](https://musee-de-normandie.caen.fr/le-chateau-de-caen/la-porte-des-champs): twin defended towers, central passage and machicolations; built after 1204, advanced barbican, dry ditch crossing.
- [Porte Saint-Pierre et sa barbacane](https://musee-de-normandie.caen.fr/node/19887): three turret lobes and connecting curtains, steep approach; gate rebuilt in 1804.
- [Mondes Normands: donjon](https://mondes-normands.caen.fr/france/patrimoine_architectural/normandie/campagne_caen/caen/1222bdonjon/index.htm): approximately five-hectare enclosure, quadrangular ruined keep with internal cross wall, four circular corner towers in its separate chemise.
- OSM [205610830](https://www.openstreetmap.org/way/205610830), [28774829](https://www.openstreetmap.org/way/28774829), [92032474](https://www.openstreetmap.org/way/92032474), and the building/part ways listed in `footprint.js`. All geometry was fetched by the shared Overpass helper or supplied in the dossier. No direct Overpass network call.
- Supplied Commons contact sheet: donjon panorama and northwest rampart by **Karldupart, CC BY-SA 3.0**; donjon southwest corner by **Benoit-caen, CC BY-SA 3.0**; Rue de Geôle excavations by **Karldupart, CC BY-SA 4.0**; exterior rampart and Porte Saint-Pierre photographs by **Florian Pépellin, CC BY-SA 4.0**. Exact file links and attribution are in the catalog record and ignored dossier `refs/SOURCES.txt`.

No images, textures, third-party meshes or captured assets are included in source or GLBs. Original geometry by Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0.

## Metric frame and revised proportions

Origin `[-0.36278,49.18639]`; real metres, +X east, +Y up, +Z south. Rotation is baked from mapped outlines; the north wall control points `[-26.382,-125.680]` and `[-62.238,-114.080]` retain the site's skew. Local y=0 now explicitly means the foot of the retaining scarp at street grade. The bailey sits on authored retaining masonry at +8 m; no absolute DEM elevation is baked into the GLB. No trench or skirt extends below y=0.

| Feature | Revised dimension | Evidence |
| --- | --- | --- |
| Enclosed site | approximately 5 ha | Primary heritage site; dossier says 5.5 ha |
| Outer envelope, including batter and projected towers | 316 × 312 m | Mapped plan plus estimated projection |
| Retaining scarp / dark plinth | 8 m / lower 2.8 m | Estimated from boulevard photographs and lead review |
| Curtain above bailey / street height | 10 m / 18 m | 10 m OSM wall tag; 8 m retaining terrace estimated |
| Square tower shafts above bailey | 16–19 m | Original 12–15 m authoring values raised 4 m per review |
| Highest street-height point | 27 m | 8 m terrace + 19 m square shaft; revised estimate |
| Square / round tower projection | 2.5 / 2.1 m outward, plans widened 18 / 20% | Review-directed, estimated; mapped positions and orientation retained |
| Round Puchot / Mathilde shaft and merlons | 24 / 24.9 m from street | Estimated profile, mapped curved plans |
| Donjon chemise above bailey | 10.6 m | Mapped 83 × 85 m plan; photo-estimated height |
| Keep ruins | 24 × 26 m, about 0.9–1.9 m above bailey | Estimated, low cross wall and open rooms |
| Barbican curtain above bailey | 7.4 m | Estimated; separate battered supports descend to y=0 |
| Gate widths / arch spring above bailey | 4.0 and 3.3 m / 3.6 m | Estimated; actual open tunnels in both LODs |
| Modern museum roof blocks | 4.5–7.2 m above bailey | Estimated stepped flat roofs, mapped museum envelope |

The original OSM 15 m tower tags remain provenance; they are not asserted as surveyed street heights of this revision. The primary site's roughly 20 m spur relief supports the need for a substantial scarp, but the modeled 8 m retaining terrace is a visual estimate requiring terrain integration checks.

## Review corrections

| Review defect | Before → after |
| --- | --- |
| Flat low slab at street level | 10 m curtain from grade → 8 m battered scarp below a 10 m curtain, with a darker 2.8 m plinth and 3.2 m foot batter |
| Flush, weak towers | Nearly flush 12–15 m shafts → outward projection of 2.1–2.5 m, wider plans, 4 m taller shafts; Puchot and Mathilde have visible round bodies and top merlons |
| Pale museum slabs and grey void | Pale flat caps → stepped museum volumes with dark slate caps and glazing; green bailey, gravel paths and barbican court surfaces |
| Weak far silhouette | Low tower relief → same tall scarp, projecting tower shafts, round merlons, hollow barbicans, museum steps and ground colour in far |

Main curtain tops remain level rather than receiving invented continuous crenellations. Far retains every signature mass and gate opening, while near adds joints, slit/window surrounds, railings and corbels. Materials: stone, trim, course, slate, glass, iron (near only), modern, bailey and gravel. Photographs, textures and third-party meshes are never included. Geometry is merged per material with equal position/normal vertices welded. Ground surfaces are explicitly separate from provider-building replacement masks; new footprint rings cover projected towers and narrow scarp masonry only.

The first revised sheet showed stronger castle relief but exposed material overlaps at the plinth/tower joins. Those joins were corrected, the detached barbicans received supports down to street grade, and gravel paths were added without overlapping main-path quads. The final deterministic scan has 0 m² different-material coplanar overlap; the two remaining zero-area course/trim contacts are edges, not faces.

## Export costs and verification

Build: `pnpm build:top-cities-landmarks chateau-de-caen --no-check`.

| Variant | Before triangles / draws / KiB | Revised triangles / draws / bytes / KiB |
| --- | --- | --- |
| Near | 32,082 / 7 / 1,652 | 38,643 / 9 / 2,037,740 / 1,990 |
| Far | 3,808 / 6 / 194 | 6,072 / 8 / 313,852 / 306 |

Both LODs are within every building budget; far uses the eight-draw cap. Near/far bounds differ by only 0.20 m, both have minY=0 and top=27 m. Final `qa-metrics.mjs` reports no issues, zero backface hits over 308 rays, no removable attribute bytes and zero-area cross-material edge contacts only. Dedicated landmark tests pin the retained open gates and courts, low keep, footprint containment, 27 m street-height envelope, dark scarp and prominent square/round towers in both LODs.

Only two look/fix iterations were used. Screenshots opened:

- `tmp/top-cities/shots/chateau-de-caen/revision-1/chateau-de-caen.jpg`: first revised exported-GLB review sheet.
- `tmp/top-cities/shots/chateau-de-caen/revision-final/chateau-de-caen.jpg`: final exported-GLB review sheet, prepared with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids chateau-de-caen --out tmp/top-cities/shots/chateau-de-caen/revision-final` because REVIEW.md contains no Prepare command.
- `tmp/top-cities/shots/chateau-de-caen/revision-final/review-with-references.jpg`: final near/far, light/dark sheets beside the actual supplied reference photos; includes boulevard, opposite side, top, street, gate detail and barbican views.

Final test and catalog outcomes are recorded after the last checks below. This evidence concerns the asset export, not application placement or hardware performance.

## Placement status and remaining limits

**Cityscape: accepted in the lead's application check. Full 3D world: terrain correction conformance checked; lead application recheck pending.** The lead's `tmp/top-cities/review/chateau-de-caen/lead-app/app-sheet.jpg` was opened: the top row has the accepted intact bailey, while the lower world row shows live DEM breaking through the ground surfaces.

The terrain correction replaces the shrunken, sparsely sampled pad and duplicate +8 m terrace with the complete inner-enceinte ring under the curtain, median boundary DEM datum and a 2 m feather. It covers the entire grass plate, including the Saint-Pierre gate recess, without extending over the outer scarp or surrounding boulevards. Full 3D world applies one reversible -7.8 m `terrainOffsets` run to every material mesh in both LODs. All walls, scarp, towers and inner buildings move as one rigid castle; the authored grass at 7.92 m now sits 0.12 m above the flattened DEM and gravel at 7.995 m sits 0.195 m above it. There is no duplicate raised DEM terrace to obscure those surfaces. The runtime restores every original Cityscape vertex exactly when terrain is switched off.

The new focused test exercises the actual building-layer terrain switch and HeightField pad against a synthetic 12–30 m DEM span: the median is 21 m, the bailey is flat and clear, and both LODs restore their original positions exactly. The lead must still check the correction in the application, particularly perimeter transitions, uphill/downhill gate approaches and detached barbican contacts. No static inspector image establishes Full 3D world integration.

The modern museum's roof-step heights, individual stones, crenellation spacing and window rhythm are simplified. The southern barbican's outer entrance/staircase remains approximate. No surrounding roads, provider buildings or shared runtime files were modified, and nothing was committed. Public publication and in-app rollout remain separate.

Earlier boulevard-revision checks: the requested combined landmark/conformance command passed **292/292** tests, including five dedicated Château de Caen tests completing in under one second; `node scripts/asset-catalog.mjs` passed with 222 entries and 416 GLB variants; `pnpm assets:preview` rebuilt the local inspector successfully. Both final contact sheets named above were opened after the last export. Final metrics are retained in `tmp/top-cities/chateau-de-caen/revision-final-metrics.json`; test/catalog/preview logs use the same `revision-final-` prefix in that dossier directory.


## Bailey terrain correction verification

Before → after: the decimated/shrunken footprint and +8 m DEM terrace could obscure the 7.92 m grass → full inner-enceinte median pad with 2 m feather and rigid world-only -7.8 m offsets leaves 0.12 m clearance; ground, walls and scarp keep their relative dimensions. The previously accepted Cityscape → exactly identical position/index hashes and materials, with exact terrain-off restoration verified from both exported GLBs. Geometry cost is unchanged: near 38,643 triangles / 9 draws / 1,990 KiB (2,037,740 bytes), far 6,072 / 8 / 306 KiB (313,852 bytes); only runtime metadata adds 396 / 344 bytes.

Re-exported with the required build command. REVIEW.md has no Prepare command, so the standard `qa-sheet.mjs --ids chateau-de-caen --out tmp/top-cities/shots/chateau-de-caen/terrain-final` prepared the new exported sheet. Opened that sheet, the lead app sheet, the reference sheet, and `tmp/top-cities/shots/chateau-de-caen/terrain-final/review-with-references.jpg`, which places near/far light/dark exports beside the reference photographs. The accepted massing, hollow bailey, gates, scarp, tower relief and roof contrast remain intact; no visual geometry revision was needed in this round.

All nine target checks pass (six dedicated tests plus three shared conformance checks); the full requested focused command reported 293/295 passing, with failures only in other active landmarks `abbaye-aux-dames` and `cathedrale-de-bayeux`. Catalog retry passed: 222 entries / 422 GLB variants. QA metrics report no issues, zero backface hits, zero-area edge contacts only, and no budget overrun. Logs and metrics: `tmp/top-cities/chateau-de-caen/terrain-{tests,target-tests,catalog-retry}.log`, `terrain-metrics.json`, and `terrain-export-verification.json`. No shared file was edited, and nothing was committed. Lead recheck of both modes in the app remains pending.
