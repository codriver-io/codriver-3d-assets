# Savage Mill

Savage, Maryland, United States. Current permanent exterior, authored 2026-11-10.

Savage Mill historic Carding, Spinning and Old Weave blocks: stone lower carding storeys with a brick fourth storey, gable and open belfry, red-brown brick courtyard wings and Romanesque stair tower with corbeled cornice/pyramidal dormered roof. The 1916 New Weave and other later structures remain provider geometry. Mapped plan approximately 90 × 63 m; roof, floor and 27.8 m tower heights are photographic estimates. The heritage authority calls the tower pre-1881 while the owner timeline groups it with 1881 additions; present exterior is modeled without resolving that dating discrepancy.

## Geographic frame and dimensions

Origin: [-76.82575, 39.13558]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 0.55484° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/138508601, way/138508602, way/116605963.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Owned plan | about 90 × 63 m | Three OSM component outlines |
| Carding | four storeys, 16 bays | Maryland Historical Trust HO-213; near keeps all bays |
| Carding eave/ridge | 14.4 / 19.2 m | Photographic estimate |
| Open eight-column belfry | 22.7 m top | Heritage description plus photographic estimate |
| Stair tower including vane | 27.8 m | Photographic estimate |

## References and rights

- [Maryland Historical Trust HO-213: materials, four storeys, 16 bays, open belfry, Romanesque tower and roof dormers](https://apps.mht.maryland.gov/nr/NRDetail.aspx?NRID=217)
- [Savage Mill owner history: Carding stone building and 1881 additions; tower dating differs from heritage description](https://www.savagemill.com/history/)
- [Acroterion, Savage Mill Courtyard MD1, CC BY-SA 4.0; courtyard/tower comparison only](https://commons.wikimedia.org/wiki/File:Savage_Mill_Courtyard_MD1.jpg)
- [Pubdog, Savage Mill Rear Dec 08, public domain; opposite exterior comparison only](https://commons.wikimedia.org/wiki/File:Savage_Mill_Rear_Dec_08.JPG)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/138508601)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The model owns Carding, Spinning and Old Weave, including their connectors and courtyard stair tower; New Weave, later sheds, river power house, bridges and surrounding ground remain outside ownership. Three lower Carding storeys are stone and its fourth is brick, with a long gable and open eight-column belfry. Two-storey brick wings preserve the open courtyard, industrial arched window rhythm and five roof light wells. The stair tower retains corbelled corner/cornice detail, pyramidal roof and four small dormers. Hidden shared walls and bottom faces were removed, and flat roofs are clipped around the tower instead of crossing it. Far halves dense bay columns while retaining all four Carding storeys and the U-shaped plan. Heights, floor splits and roof profiles are photographic estimates; fine sash panes, equipment, branding, lettering and interior are omitted.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 18989 | 6 | 291044 |
| far | 7418 | 6 | 127280 |

Build: `pnpm build:top-cities-landmarks savage-mill`. Identity tests: `src/peregrine/landmarks/top-cities/savage-mill/savage-mill.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids savage-mill --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/savage-mill/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/savage-mill.jpg`. Red-ring procedural plan: `tmp/r4/shots/savage-mill/savage-mill-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/savage-mill/savage-mill-glb-far-dark-sheet.jpg`. One visual correction reduced brick saturation to match the muted reference. The final exported sheet, mapped top and far/dark were inspected: U-shaped courtyard, stair tower/pyramidal dormers, long Carding gable, belfry and separate facade windows remain in far. All shared-wall/roof depth cycles, including a 0.3 m² hidden contact below the issue threshold, were resolved before readiness.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Applied the inexpensive courtyard-colour nit by darkening the brick to a browner, less orange tone in both palettes. No geometry, source ownership or material draw was added.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: Every street and courtyard face retains its separate factory-window rows, stair-tower windows and belfry openings. NEAR/FAR silhouettes and mapped blocks match; the only change is the brick palette.

New contact sheet: `tmp/followup/sheets/savage-mill.jpg`. Identity/conformance tests passed; `tmp/followup/savage-mill-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
