# Cathedral of the Transfiguration

Markham, Canada. Current permanent exterior, authored 2026-11-10.

Current Cathedral of the Transfiguration: published 64 m central and 45 m side towers, dark copper onion bulbs topped by small gilt lantern bulbs and crosses, rear crossing dome, pale stone pilasters and separate arched/oculus window bays. The footprint and all 31 mapped building parts are recorded; the outer footprint contains the nested parts. OSM outer height=0.1 is not an architectural height and is rejected. Stage profiles are estimated from checked photographs and mapped parts; no mosaics, lettering or interior are reproduced. Geographic yaw baked once.

## Geographic frame and dimensions

Origin: [-79.37272, 43.8937]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation -80.07967° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/67298057, way/1117929124, way/1117929125, way/1117929126, way/1117929127, way/1117929128, way/1117929129, way/1117929130, way/1117929131, way/1117929132, way/1117929133, way/1117929134, way/1117929135, way/1117929136, way/1117929137, way/1117929138, way/1117929139, way/1117929140, way/1117929141, way/1117929142, way/1117929143, way/1117929144, way/1117929145, way/1117929146, way/1117929147, way/1117929148, way/1117929149, way/1117929150, way/1117929151, way/1117929152, way/1117929153, way/1117929154.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Central tower | 64 m including cross | Published tower height; mapped part 1117929151 agrees |
| Side towers | 45 m including crosses | Published heights; mapped parts 1117929145/46 agree |
| Main envelope | about 35 × 69 m | OSM outline 67298057 |
| Rear crossing cupola | 40 m | OSM building-part height, estimated architectural interpretation |
| Onion and lantern stages | 44/54/58.2/62.3 m on central tower | Photographic estimates guided by mapped part heights |

## References and rights

- [Identity and published 64 m / 45 m tower heights](https://en.wikipedia.org/wiki/Cathedral_of_the_Transfiguration_(Markham,_Ontario))
- [Jeff Hitchcock, Cathedral of the Transfiguration (onion towers exterior), CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Cathedral_of_the_Transfiguration_(21066922103).jpg)
- [George Socka, July 2012 Slovak Cathedral of the Transfiguration Markham, CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:July_2012_Slovak_Cathedral_of_the_Transfiguration_Markham_(7511931902).jpg)
- [Transportfan70, Cathedraltown Cathedral High Street (2), CC BY-SA 4.0; road approach comparison only](https://commons.wikimedia.org/wiki/File:Cathedraltown_Cathedral_High_Street_(2).jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/67298057)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The present church has three tall front towers and a lower rear crossing cupola. Each large bulb is dark copper, with a much smaller gilded crown and cross: it is not modeled as an entirely golden dome. The published 64/45 m hierarchy, mapped arrangement, onion volumes, open lantern apertures, pale piers, tall arched panes and separate oculi survive far. Mapped outline and all 31 nested provider part IDs are retained; nested parts share the encompassing outer replacement ring. Actual wall holes and independent glazing avoid facade overlays. Far folds low horizontal bands into stone to eliminate sub-50 cm material cycles, retaining their relief. Mosaics, inscriptions, fine carved capitals and interiors are omitted; all roof/lantern profile splits are estimates.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11945 | 6 | 178024 |
| far | 7876 | 6 | 126288 |

Build: `pnpm build:top-cities-landmarks cathedral-transfiguration-markham`. Identity tests: `src/peregrine/landmarks/top-cities/cathedral-transfiguration-markham/cathedral-transfiguration-markham.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids cathedral-transfiguration-markham --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/cathedral-transfiguration-markham/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/cathedral-transfiguration-markham.jpg`. Red-ring procedural plan: `tmp/r4/shots/cathedral-transfiguration-markham/cathedral-transfiguration-markham-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/cathedral-transfiguration-markham/cathedral-transfiguration-markham-glb-far-dark-sheet.jpg`. The exported sheet was compared to the exterior tower/detail and July 2012 photographs; the mapped top and exported far/dark view were inspected. All three front onion towers, small gold crowns, rear cupola and separate window rhythm remain visible in far. Deterministic fixes removed shared internal walls and folded minor far trim so no depth-cycle edge is dropped. No visual correction round was required.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.
