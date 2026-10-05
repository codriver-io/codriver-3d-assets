# Bank of America Plaza, Dallas

Original procedural model of the completed 1985 JPJ Architects tower at **901 Main Street**, with the present programmable facade outline represented in its iconic green night state. The blue curtain wall, narrow gray marble floor bands, faceted staircase plan and stepped crown identify the tower from downtown streets and skyline distance. No neighboring tower, parking garage, detached canopy, street or park is authored.

## Sources and dimensions

The supplied dossier was used directly; no additional photographs or Overpass calls were needed. References were opened on 2026-10-05. The [official building site](https://baplaza.com/) gives the address and 72-story commercial description. [Wikipedia](https://en.wikipedia.org/wiki/Bank_of_America_Plaza_(Dallas)) provides the architectural height, completion, architect and blue-glazing/gray-marble cladding description; its 74-floor infobox differs from the 72-story marketing count. Facade pitch is estimated rather than treating either count as a measured elevation schedule.

| Dimension | Value | Basis |
| --- | --- | --- |
| Architectural maximum | 280.7 m | Published architectural height; highest modeled roof edge |
| Roof height reference | 279 m | Published; no separate measured parapet survey available |
| Main mapped envelope, east/south | approximately 56.8 × 64.3 m | OSM polygon with projecting facade trims |
| Crown levels | 240, 248, 256, 264, 272, 280.7 m | Intermediate OSM part heights treated as estimates; highest part adjusted from OSM 277 m to architectural maximum |
| Floor/bay pitch | 3.65 / approximately 1.85 m | Photo estimates |
| Gray marble strip height | 0.36 m near, 0.55 m every second floor far | Photo estimate / visual LOD simplification |
| Lobby height | 8 m | Photo estimate; no interior modeled |
| Pad radius | 43 m | Covers tower envelope; downtown site expected nearly level |

Mapped source is [OSM tower way 138670474](https://www.openstreetmap.org/way/138670474), with building parts 1492295745–1492295750. All seven rings are listed in `footprint.js`; only their covered extrusions are owned. The dossier's `osm.json` retains full provenance and geography in ignored scratch. Neighboring roof 471948142 is intentionally excluded.

## Frame and structure

`origin = [-96.803901097, 32.780014871]` is the polygon centroid. Metres east/up/south; y=0 is rigid local grade, without absolute altitude, terrain or Mercator stretch. Rotation is already baked into the local OSM rings, so the host must not rotate them again. Main mapped control points `[-96.8036758, 32.780275]` and `[-96.8036003, 32.780007]` define the long facade edge at approximately 167 degrees from north (actual extracted coordinates are authoritative in the footprint module).

A nested shell uses mapped tower/upper outlines, clipping each upper outline to its predecessor to remove tiny provider rounding protrusions. Polygon differences triangulate exposed terraces only: no buried shared cap faces between storeys. Ground and highest roof close the shell; caps and facade quads have explicit outward normals. Blue glass, alternate reflection strips, gray horizontal bands, fine vertical mullions and sparse lit office panes are merged by material. Lobby piers and entrance glass are facade surfaces, avoiding freestanding ground clutter. Outline strips attach to the faceted shell and crown. The far LOD retains every crown level and mapped silhouette, uses half the floor bands and omits fine mullions and individual illuminated offices.

No texture, photo, scan or imported mesh appears in the source or exported GLBs. Geometry is original Codriver procedural work; OSM-derived geography is © OpenStreetMap contributors, ODbL 1.0. Source/photos inform proportions rather than supplying geometry.

## Reference photo provenance

All images remain under ignored `tmp/top-cities/bank-of-america-plaza-dallas/refs/`, used for visual comparison only:

- [View of Bank of America Plaza from Reunion Tower August 2015 20](https://commons.wikimedia.org/wiki/File:View_of_Bank_of_America_Plaza_from_Reunion_Tower_August_2015_20.jpg), Michael Barera, CC BY-SA 4.0: daylight massing, facade bands.
- [Bank of America in Dallas Snow 2021](https://commons.wikimedia.org/wiki/File:Bank_of_America_in_Dallas_Snow_2021.jpg), Matthew T Rader, CC BY-SA 4.0: street view and lighting.
- [Bank of America Plaza (Dallas) night purple](https://commons.wikimedia.org/wiki/File:Bank_of_America_Plaza_(Dallas)_night_purple.jpg), RomDales, CC BY-SA 4.0: full-height outline pattern.
- [Bank of America Plaza in October 2025](https://commons.wikimedia.org/wiki/File:Bank_of_America_Plaza_in_October_2025.jpg), FeaturingDallas, CC BY-SA 4.0: present facade/crown.
- [Dallas Bank of America Plaza top night](https://commons.wikimedia.org/wiki/File:Dallas_Bank_of_America_Plaza_top_night.jpg), Justin Cozart, CC BY 2.0: stepped green crown.

## Verification evidence

Export: `pnpm build:top-cities-landmarks bank-of-america-plaza-dallas --no-check`.
Focused acceptance: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/bank-of-america-plaza-dallas/bank-of-america-plaza-dallas.test.js`.
Catalog: `node scripts/asset-catalog.mjs`. Deterministic export checks use `.agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids bank-of-america-plaza-dallas`.

Screenshots personally opened and judged against `tmp/top-cities/bank-of-america-plaza-dallas/refs-sheet.jpg`:

- `tmp/top-cities/shots/bank-of-america-plaza-dallas/bank-of-america-plaza-dallas-procedural-near-light-sheet.jpg`: initial overview, opposite face, roof, entrance, crown detail. Thinned the marble strips, extended outline strips across facets, and widened cameras to avoid cropped skyline views.
- `tmp/top-cities/shots/bank-of-america-plaza-dallas/export-reference-contact-sheet.jpg`: exported near/light (overview, street facade, back, roof, entrance, detail), near/dark, far/light, far/dark (overview, back, crown detail), and exported plan with mapped footprint, beside dossier photos. The first export sheet showed lighting was too subtle at skyline distance; outline thickness was increased for readability, then rectangular bars were replaced by attached round tubes to eliminate incidental coplanar intersections with glass and roof caps.
- The corresponding final GLB contact sheets carry `bank-of-america-plaza-dallas-glb-{near,far}-{light,dark}-sheet.jpg`; plan is in `top/bank-of-america-plaza-dallas-glb-near-light-top.png`.

## Final measured costs and checks

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 25,008 | 8 | 1,305,632 | 1,275 |
| Far | 4,032 | 5 | 195,628 | 191 |

Both are well below the contract caps. Exported bounds and material names agree with source; far retains all six crown levels and the near silhouette. The four landmark tests plus three registry tests for this id pass (7/7 with `--test-name-pattern 'Dallas Plaza|bank-of-america-plaza-dallas'`, approximately 0.35 s). The required unfiltered two-file command passes every Dallas test, but the shared run currently has an unrelated `eye-filmmuseum` material/palette mismatch; its files were left to their owner. Catalog validation passes. Final deterministic QA records zero coplanar pairs, zero removable attributes and zero back-face hits in 457 successful rays; evidence is `tmp/top-cities/bank-of-america-plaza-dallas/qa-metrics.json`. Final exported models were personally viewed again in the reference contact sheet after the tube change; mapped placement, six crown terraces and daytime/nighttime silhouette remain intact.

## Limits and integration

Intermediate crown elevations, facade bay layout, lobby doors and lighting tube thickness are approximations. The shell has no interiors, operating doors, small rooftop communications equipment, exact marble joints, reflected skyline textures or programmable color schedule. Self-lit geometry approximates luminous tubes without bloom. Photograph reflections and office occupancy are stylized. Independent visual review remains the coordinator's separate acceptance step.

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** The rigid grade-level tower and bounded 43 m pad should suit the downtown site, but DEM relief, entrances, provider masking, late loads, terrain refinement, mode switches and actual device performance remain unverified. No app/server/deployment or shared files were changed.
