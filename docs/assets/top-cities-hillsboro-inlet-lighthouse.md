# Hillsboro Inlet Lighthouse

Hillsboro Beach, Florida, United States. Current permanent exterior, authored 2026-11-10.

Hillsboro Inlet Lighthouse, current octagonal skeletal cast-iron structure: eight tapered legs, X bracing, central stair cylinder, black watch room and gallery, diamond-pattern lantern glazing and conical finial. OSM lighthouse node and mapped circular pedestrian base ring define position/ownership; no provider building polygon exists. Current preservation society states 147 ft overall (44.8056 m) and 136 ft to lens room; historical sources give 132–144 ft, including 137 ft, so heights are adopted estimates rather than a survey. Eight footings on a 40 ft diameter circle, photo-based 22 m paint division; no keeper buildings or scenery are authored.

## Geographic frame and dimensions

Origin: [-80.0807464, 26.2591689]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 5.37813° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/989046540, node/9141453841.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Overall height | 44.8056 m adopted estimate | Current HLPS 147 ft; older 132–144 ft values disagree |
| Lens-room reference | 41.4528 m published | Current HLPS 136 ft; not a terrain altitude |
| Eight-footing diameter | 12.192 m | Published 40 ft circle, checked against mapped base |
| Mapped paved base | about 16.5 × 17.2 m | OSM way 989046540 |
| Paint division | 22 m estimate | Both current exterior photo proportions |

## References and rights

- [Hillsboro Lighthouse Preservation Society, current history: 1906/1907, 136 ft lens room and 147 ft overall; adopted estimate](https://www.hillsborolighthouse.org/history/)
- [US Lighthouse Society historical light lists: octagonal pyramidal skeleton and central stair cylinder; differing 136/137 ft historic heights](https://uslhs.org/gr/light_lists/lighthouse_list.php?id=962)
- [Hillsboro Lighthouse Preservation Society September 2001 newsletter: diamond-shaped curved lantern glazing; historic height 142 ft](https://www.hillsborolighthouse.org/Media/Default/pdf/2001_09.pdf)
- [Yanjipy, Aerial Shot of Hillsboro Inlet Lighthouse; CC BY-SA 4.0, current exterior comparison only](https://commons.wikimedia.org/wiki/File:Aerial_Shot_of_Hillsboro_Inlet_Lighthouse.jpg)
- [Jordon Kalilich, Hillsboro Inlet Lighthouse; CC BY-SA 3.0, current opposite exterior comparison only](https://commons.wikimedia.org/wiki/File:Hillsboro_Inlet_Lighthouse.jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/989046540)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

An octagonal five-bay skeleton has eight tapered pipe legs, 80 diagonal tension rods and 48 horizontal struts. All 168 structural members are inventoried against 48 independently meshed cast-iron joint nodes; each end has a closest-triangle support test with a displaced-end negative control. Open pipe ends terminate inside joints. The central cylinder, vestibule and raised steps stand separately from the open frame. A black octagonal watch room, five inset windows, gallery, curved diamond-pattern lantern and conical finial complete the crown. Both LODs retain eight large diamond divisions with 0.16 m black members outside the glazing. No glass texture is used. The base is the exact mapped pedestrian area, inverse-rotated before geographic yaw; it is not claimed as an OSM building footprint. Paving top is 0.16 m above grade and footings rise from it. Current HLPS height is adopted with the many conflicting historical values explicitly recorded; individual crown and paint splits are photographic estimates.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 5644 | 6 | 99724 |
| far | 3788 | 6 | 81488 |

Build: `pnpm build:top-cities-landmarks hillsboro-inlet-lighthouse`. Identity tests: `src/peregrine/landmarks/top-cities/hillsboro-inlet-lighthouse/hillsboro-inlet-lighthouse.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids hillsboro-inlet-lighthouse --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/hillsboro-inlet-lighthouse/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/hillsboro-inlet-lighthouse.jpg`. Red-ring procedural plan: `tmp/r4/shots/hillsboro-inlet-lighthouse/hillsboro-inlet-lighthouse-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/hillsboro-inlet-lighthouse/hillsboro-inlet-lighthouse-glb-far-dark-sheet.jpg`. Full silhouette, black/white division, eight tapered legs, grounded footings and real openings match both valid exterior references. One visual correction improved the lantern lattice contrast; the close exported detail visibly preserves the named Big Diamond feature. Source plan, far/dark and final sheet reviewed; six draws, zero QA flags and no dropped depth cycles.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Replaced the faint thin lantern lattice with eight divisions of prominent muted-black 0.16 m diagonal members in both LODs, against darker green glazing. Frame centre radius is 2.39 m around 2.25 m panes, leaving at least 0.06 m physical clearance outside the glass; lower ends meet the black base and upper ends meet the roof ring. Retained the 44.8056 m height, eight legs and all 168 tested skeleton-member contacts. Merging the frames into black reduces the export to six draws.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: Every lantern face retains the same complete, high-contrast diamonds in FAR; the eight-leg silhouette, five braced bays, white/black division, watch-room windows, gallery, entrance and footings match. Only tube/head curve samples reduce in FAR; separate-pane/black ordering is deterministic with zero dropped cycle edges.

New contact sheet: `tmp/followup/sheets/hillsboro-inlet-lighthouse.jpg`. Identity/conformance tests passed; `tmp/followup/hillsboro-inlet-lighthouse-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
