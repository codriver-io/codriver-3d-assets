# Grande Arche de La Défense

Original procedural model of the 1989 Grande Arche in Puteaux, France, designed by Johan Otto von Spreckelsen and Erik Reitzel, completed with Paul Andreu. The asset represents its permanent open-cube massing and current white exterior, without a temporary concert stage or plaza decorations. The two office piers, bevelled frame, roof cross-piece, broad raised parvis, low tensile cloud and skeletal panoramic lift guides distinguish it at street and regional scales.

## Sources and rights

The supplied dossier is retained under `tmp/top-cities/grande-arche/`: `osm.json`, `osm.txt`, `facts.txt`, `refs-sheet.jpg` and `refs/SOURCES.txt`. No raw Overpass calls, new imagery downloads, scans, traced meshes, photographs or textures were used in the authored source or exports.

- [fischer facade contractor](https://www.fischer.ae/en-ae/media-and-pr/references/22-11-29-la-grande-arche): 1989 completion, approximately 110 m height, original white Carrara marble and its replacement with similar-coloured Bethel White granite during renovation.
- [Grande Arche](https://en.wikipedia.org/wiki/Grande_Arche): identity, original team, 110 m cube, 6.33° rotation relative to the historic axis, cloud membrane and lift skeleton. The dossier contains the summary/infobox.
- [OSM main outline 19441489](https://www.openstreetmap.org/way/19441489), office outline 621620714 and their mapped roof/pier/stair parts: geographic frame and envelope. Derived data © OpenStreetMap contributors, ODbL 1.0.
- [Coldcreation, La Grande Arche de la Défense](https://en.wikipedia.org/wiki/File:La_Grande_Arche_de_la_D%C3%A9fense.jpg), October 2014, CC BY-SA 2.5: front bevel, membrane, steps and inner window reveals. The checked page also notes US-only architectural freedom of panorama; the photograph stays reference-only in ignored scratch and is not redistributed.
- [Tognopop, North facade, 20050906](https://commons.wikimedia.org/wiki/File:North_facade_of_the_Grande_Arche_de_la_D%C3%A9fense_-_20050906.jpg), checked CC0: mirrored outer office facade.
- [Spaghettifier, La Defense Jazz Festival 2023](https://commons.wikimedia.org/wiki/File:La_Defense_Jazz_Festival_2023.jpg), CC BY-SA 4.0 in supplied photo credits: inner bay rhythm and ceiling grid; the event stage is omitted.

The dossier sheet also includes Bretwa (western view, CC BY-SA 4.0), ASaber91 (GrandeArche, CC BY-SA 4.0) and Arthur Weidmann (distant axis view, CC BY-SA 4.0). These are credited in the catalog and remain ignored. Geometry is an original parameterized approximation, with separate geographic attribution.

## Dimensions and frame

| Feature | Authored value | Basis |
| --- | --- | --- |
| Highest point | 110 m | Published height, also OSM height |
| Cube plan | 106.9 × 111.9 m | Rounded OSM mapped outer envelope; commonly described as a 110 m cube |
| Central opening width | 69.4 m | Approximation from mapped inner pier edges (~±34.7 m) |
| Central soffit | y=100 m | Mapped roof part 225694316, min_height=100 |
| Inner terrace | y=8.3 m | Mapped central base 225694306, height=8.3 |
| Front/rear bevel depth | 18.4 m | Approximate mapped inner-to-outer edge distance |
| Side/rear terrace | y=7.56 m | Mapped part 975001872, exposed wings simplified to rectangles |
| Cloud envelope | 48 × 36 m; approximately y=12–21 m | Estimated from photographs; original smooth tensile approximation |
| Stair treads | 48 per approach near; 24 far | Estimated subdivisions over mapped rise/depth |
| Inner glazing | 24 bays × 32 rows near; 14 × 17 far | Visual approximation, not a surveyed module count |
| Outer glazing | 36 bays × 34 rows near; 22 × 18 far | Visual approximation |

Origin `[2.2358747, 48.892564475]` is the average of the four principal office-outline corners. Local coordinates are metres: +X east, +Y up, +Z south. Local y=0 is parvis approach grade, with all structure rigid. No absolute altitude, terrain heights or Mercator stretch are baked in.

Two mapped control points `(2.2348404, 48.8924243)` and `(2.235613, 48.8932391)` establish the cross-frame northeast axis. Its Three.js Y rotation is **58.059708°**, baked into every primitive and GLB once. The front face bearing is **121.940292°**, toward the southeast historic-axis approach. The published **6.33°** difference from the Axe historique is a separate relation, never an additional model rotation.

`footprint.js` preserves all 26 Grande Arche office, pier, stair and roof-part rings plus the mapped external rear terrace (27 ways in total). It excludes surrounding Collines de l’Arche offices, commercial buildings, roads and stations. Main provider outlines cover the complete roof envelope, including the void beneath it, so an upper generic box should not survive the replacement. The authored terrace is explicitly included; geometric tests check the model against the main envelope plus terrace with 0.75 m tolerance for sub-metre map/rectangular simplification.

## Geometry and LOD decisions

The arch is a true hollow structure: separate wedge-ended office piers and a roof, with no central infill. Its opening continues through both elevations above the raised parvis. White bevels taper inward on both front and rear. Inner and outer glazing is partitioned into the actual facade shell, rather than layered over a solid wall. Near inner glass has closed 0.45 m-deep reveals; far uses flush, separate coarse pane quads. White-panel and central soffit joints are separate surface partitions. Thin near joints are omitted in far.

A finite-thickness closed white membrane has undulating elevations, four ground-supported corner masts and four ties terminating on named stone bevel supports. Four slim lift uprights terminate on the parvis and roof soffit; small glass cars clasp these guides. All member terminal points are tested against their named supporting material, excluding the steel member itself. A deliberately shortened lift endpoint proves the support check rejects a free end.

The cloud is intentionally simplified: smooth folds rather than the exact membrane seam/eyelet network. The lift system lacks its full bracing, machinery and pedestrian cabin details. Roof restaurant, roof furniture, offices and interiors are omitted. Window counts, stair counts and glass tint are estimates. The rear platform uses two rigid rectangular wings fitted to its mapped extents; it is not a terrain-certified foundation. Palettes use muted white stone, cool glass and pale metal; dark preserves the same named materials and dimmer facade colours without invented decorative lighting.

## Export costs and checks

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 41,122 | 6 | 2,224,648 | 2,172.5 |
| Far | 6,236 | 5 | 340,956 | 332.96 |

Both are below the building caps (60k/14/2.5 MB near; 12k/8/500 KB far). The far triangle cost is approximately 15.2% of near, with identical overall bounds. Counts are exported default-scene metrics, not device performance.

Reproduce with:

```sh
pnpm build:top-cities-landmarks grande-arche --no-check
node scripts/landmark-depth-layers.mjs --ids grande-arche
node scripts/landmark-depth-layers.mjs --ids grande-arche --check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/grande-arche/grande-arche.test.js
node scripts/asset-catalog.mjs
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids grande-arche --out tmp/top-cities/grande-arche/qa-metrics.json
```

The ten landmark tests pass in approximately one second: measured dimensions, two-way opening raycasts, soffit and office-wall contacts, continuous stairs, named member support contacts (with a negative case), geographic containment, separate far bays and GLB normals/material/bounds/opening/support round trips. All three Grande Arche registry checks pass; the filtered combined run is **13/13 passing** in 1.14 seconds (`tmp/top-cities/grande-arche/focused-tests.txt`). The combined registry run recorded **602/604 passing**, with the only failures in **perot-museum**, whose in-progress catalog status and manifest did not yet agree with its ready spec; see `tmp/top-cities/grande-arche/final-tests.txt`. No other landmark was edited or waited on.

`asset-catalog.mjs` initially passed (336 records, 596 GLB variants); log `tmp/top-cities/grande-arche/catalog-check.txt`. A subsequent shared-tree recheck failed because the concurrent Perot Museum record referenced its not-yet-created `docs/3d-top-cities-perot-museum.md`; the final retry confirms the same unrelated missing file (`tmp/top-cities/grande-arche/catalog-final-check.txt`), which does not affect Grande Arche’s own files. QA metrics report no issues, no coplanar overlaps, no layered material faces and 0% back-face hits across 381 exterior rays. Near/far minimum y is effectively 0 and top is 110. Depth regeneration reports **zero dropped cycle edges** and the focused check is current. The only shared authored output changed is generated `src/peregrine/landmarks/depth-layers.js`, as authorized. The lead should regenerate all IDs before committing the batch.

## Visual evidence inspected

I inspected the supplied reference sheet and the front photograph, then the procedural near/light contact sheet at `tmp/top-cities/shots/grande-arche/iteration-1/grande-arche-procedural-near-light-sheet.jpg`. The first export was recognizable but exceeded bytes at 3,003 KiB. I reduced repeated facade/white-panel/soffit subdivisions and merged the planar bevel-ceiling tessellation to a single surface, preserving massing, opening, step contacts and pane grids; the final export fits the budget.

I then inspected these final **exported GLB** sheets and compared them alongside reference photos in `tmp/top-cities/shots/grande-arche/final/reference-comparison.jpg`:

- `grande-arche-glb-near-light-sheet.jpg`: overview, front, rear, roof, street, canopy/stair detail and inner facade.
- `grande-arche-glb-far-light-sheet.jpg`: overview, front, rear and detail.
- `grande-arche-glb-near-dark-sheet.jpg` and `grande-arche-glb-far-dark-sheet.jpg`: the same four views in dark.
- `grande-arche-glb-near-light-top.png`: north-up plan of the baked orientation and rear terrace envelope; the high roof occludes most grade-level red rings, so geographic containment is established by the vertex test and overview rings.

The opening remains visible in both LODs and themes, the cube proportions agree with the reference, and broad stairs meet the parvis. Near shows inset bay depth; far retains a discrete grid, with a visibly coarser glass pattern. Smooth cloud folds and minimal lift machinery remain deliberate approximations. Inspector lighting is PBR evidence only; the shared application shading path and terrain placement remain separate review gates.

## Integration handoff

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No app server, runtime clone, application bundle, deployment or rollout change was made. The lead owns unobstructed app screenshots in both modes, provider replacement/lifecycle checks and independent review. The raised main/rear terraces need DEM, pad-edge and footing-residual inspection before world certification; the default bounded pad is not proof of a correctly terraced terrain datum. Actual vehicle hardware performance remains unmeasured. Shared catalog preview was not rebuilt because this dispatch confines writes to landmark-owned paths; isolated exported-GLB screenshot rendering supplied inspection evidence.
