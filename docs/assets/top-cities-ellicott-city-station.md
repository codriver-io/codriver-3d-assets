# Ellicott City Station

Ellicott City, Maryland, United States. Current permanent exterior, authored 2026-11-10.

Current Ellicott City station museum: two-storey grey granite body, long gable, wooden roof ventilator, separate sash bays and upper trackside platform/cantilever brackets. Only the main station is owned; freight house, caboose, viaduct and track are excluded. Heritage description gives approximately 90 × 25 ft (27.4 × 7.6 m) for the masonry; mapped roof/canopy envelope is about 28.2 × 9.5 m. Overall 12.4 m, floor splits and cupola dimensions are photo estimates. Sources use 1830 or 1831 for completion; the restored current exterior is modeled. Local y=0 is the lower Maryland Avenue foundation, with the upper platform at a relative 3.6 m; no terrain is baked.

## Geographic frame and dimensions

Origin: [-76.7949525, 39.267535]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 0.82915° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/78365941.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Masonry body | 27.6 × 7.6 m | Heritage approximate 90 × 25 ft; mapped roof is wider |
| Mapped roof envelope | about 28.2 × 9.5 m | OSM way 78365941 |
| Eave / ridge | 7.8 / 10.4 m | Photographic estimate |
| Ventilator top | 12.4 m | Photographic estimate |
| Trackside platform | 3.6 m above lower foundation | Relative architectural level, estimated from two storeys |

## References and rights

- [Howard County owner: station history, two-level museum and 1831 completion](https://www.howardcountymd.gov/ecborail)
- [Maryland heritage nomination HO-78: approximate 90 × 25 ft, upper track/lower street levels](https://apps.mht.maryland.gov/medusa/PDF/Howard/HO-78.pdf)
- [Pemilligan, Ellicott City station 2025 01 02, CC0; current street facade comparison only](https://commons.wikimedia.org/wiki/File:Ellicott_City_station_2025_01_02.jpg)
- [Adam Moss, Ellicott City Station (26523867027), CC BY-SA 2.0; opposite/trackside comparison only](https://commons.wikimedia.org/wiki/File:Ellicott_City_Station_(26523867027).jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/78365941)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The current station’s long granite body, gable, wooden ventilator, sash grid, lower street entrance and upper trackside canopy establish the 1830–1831 building. Only the main station footprint is owned; the separate freight house, caboose, turntable, viaduct and railway are not modeled. The raised platform is an architectural floor level with supports down to y=0; no hillside is fabricated. All four canopy brackets meet the named stone wall and roof surfaces in both LODs, with shortened-end negative controls. Window apertures and mullions remain separate in far, along with the ventilator, shutters and quoins. Fine ashlar tooling, signs, flags, seasonal decorations and interior are omitted.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2175 | 6 | 42468 |
| far | 1838 | 6 | 38296 |

Build: `pnpm build:top-cities-landmarks ellicott-city-station`. Identity tests: `src/peregrine/landmarks/top-cities/ellicott-city-station/ellicott-city-station.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids ellicott-city-station --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/ellicott-city-station/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/ellicott-city-station.jpg`. Red-ring procedural plan: `tmp/r4/shots/ellicott-city-station/ellicott-city-station-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/ellicott-city-station/ellicott-city-station-glb-far-dark-sheet.jpg`. One visual correction: added the photographed lower shutters and corner stone relief, corrected the ventilator cap orientation, and muted the granite colour. The final exported sheet, mapped plan and exported far/dark view were inspected. The small asset remains 2,175 / 1,838 triangles; the roof cupola, upper platform and window rhythm survive far. A platform-to-wall depth contact was resolved before QA.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.
