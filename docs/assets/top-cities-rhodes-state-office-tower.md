# Rhodes State Office Tower

Columbus, Ohio, United States. Current permanent exterior, authored 2026-11-10.

James A. Rhodes State Office Tower: broad granite cores, deeply recessed horizontal glazing, stepped open mechanical crown and opposite higher corner shafts with rooftop communications cage. The mapped 58 × 57 m podium encloses a narrower 45 × 48 m tower. Ohio DAS publishes 629 ft (191.72 m); CTBUH gives 190.2 m, so the main core height is an adopted published estimate. Antenna tip 201.72 m is estimated from the contractor exterior photo and excluded from the published architectural height. Current renovation preserved the granite/window composition; no logos or inscriptions.

## Geographic frame and dimensions

Origin: [-82.99944685, 39.962785]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 8.47925° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/195485070.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Mapped podium | 57.9 × 56.8 m | OSM way 195485070 |
| Main corner cores | 191.72 m adopted | 629 ft Thornton Tomasetti / Ohio facility listing; CTBUH 190.2 m disagreement |
| Antenna tip | 201.72 m estimate | Contractor exterior photo ratios |
| Tower body | 45 × 48 m estimate | Mapped podium plus opposite-face photo ratios |

## References and rights

- [Turner Construction, current Rhodes Tower envelope-renovation exterior, copyright/all rights reserved; comparison only](https://www.turnerconstruction.com/projects/rhodes-tower-building-envelope-renovation)
- [Turner Construction exterior image, copyright/all rights reserved; comparison only](https://ep-turnerconstruction-prod-asdcetgubtducba3.z01.azurefd.net/uploads/10980-03-LoRes.jpg)
- [Derek Jensen (Tysto), Rhodes State crop, 2005; public domain; opposite exterior retained after envelope renovation](https://commons.wikimedia.org/wiki/File:Rhodes_State_crop.jpg)
- [Council on Tall Buildings and Urban Habitat: architectural height 190.2 m (disagrees with 629 ft adopted height)](https://www.skyscrapercenter.com/building/rhodes-state-office-tower/9102/)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/195485070)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The wider mapped podium keeps its southeast notch; only its low foundation is extruded. The upper tower is hollow, with long east/west recessed office bands, two dominant continuous granite shafts around a recessed 36% window zone, narrower north/south glazing between granite masses, separate corner shafts and an open steel communications cage. Mechanical crown openings remain recessed in far. Storey rhythm and granite proportions are approximations rather than a panel-by-panel survey; window numbers are deliberately simplified. The contractor current-renovation image and Jensen opposite-face photo show the same permanent composition; an unrelated facade photo returned by research was rejected. The published roof/core heights disagree and are adopted estimates, while antennas are explicitly additional estimated structure.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4088 | 4 | 78404 |
| far | 3972 | 4 | 77120 |

Build: `pnpm build:top-cities-landmarks rhodes-state-office-tower`. Identity tests: `src/peregrine/landmarks/top-cities/rhodes-state-office-tower/rhodes-state-office-tower.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids rhodes-state-office-tower --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/rhodes-state-office-tower/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/rhodes-state-office-tower.jpg`. Red-ring procedural plan: `tmp/r4/shots/rhodes-state-office-tower/rhodes-state-office-tower-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/rhodes-state-office-tower/rhodes-state-office-tower-glb-far-dark-sheet.jpg`. Uncropped overview silhouettes, asymmetrical higher cores, crown recesses, two facade rhythms and open antenna cage reviewed against both valid exterior views. Source plan fits the mapped podium; far/dark view framed with a tall-tower camera preset. Four material draws and no deterministic flags.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Replaced nearly full-width broad-face glazing with a 17.3 m central zone (36% of the 48 m face), recessed more than 1.5 m behind two dominant continuous granite shafts. Preserved individual horizontal office rows, narrower return-face rows, stepped open crown, 191.72 m architectural cores and additional estimated antenna.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: Both east/west broad faces retain the same 36% zone, two shafts and 36 separate rows; both north/south returns retain their 14.4 m separate-row glazing. Crown steps, open recesses and antenna silhouette agree. FAR only reduces slender mullions and antenna tube segments.

New contact sheet: `tmp/followup/sheets/rhodes-state-office-tower.jpg`. Identity/conformance tests passed; `tmp/followup/rhodes-state-office-tower-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
