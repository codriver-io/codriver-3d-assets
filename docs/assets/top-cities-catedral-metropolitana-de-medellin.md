# Catedral Metropolitana de Medellín

Original procedural model of the present Catedral Basílica Metropolitana de la Inmaculada Concepción de María, Carrera 48 #56-81, Villanueva, north side of Parque Bolívar, Medellín. Charles Émile Carré's brick Neo-Romanesque church was inaugurated in 1931. This asset models the exterior, excluding the park, adjacent buildings and interior fittings. Its twin square bell towers, low copper pyramidal caps, crosses, paired open bell arches, central gabled choir with three tall windows and clock, concentric portal arches, eight side bays, raised crossing, terracotta roofs and stepped rear apses are the identification features.

## Dimensions and geographic frame

| Dimension | Model | Evidence |
| --- | --- | --- |
| Tower height including cross | 53.20 m | Published architectural description |
| Tower roof apex / cross | 50.40 m / 2.80 m | Published architectural description |
| Nave width | 14.50 m | Published architectural description |
| Building length | Approximately 98 m mapped envelope | Published nave length 98.45 m; OSM envelope about 98.2 m |
| Transept width | 63.45 m core, about 64 m with engaged buttresses | Published transept length 63.40 m |
| Frontage | 52 m masonry; steps 53.4 m | Published frontage 52 m; mapped front envelope about 54.3 m |
| Tower width / centres | 11.9 m / ±13.45 m | Estimated from front photo and 40 m tower-to-tower published reference |
| Nave ridge / aisle eave | 35.8 m / 17.1 m | Photographic estimate |
| Crossing ridge / cross | 41.8 m / 44.1 m | Estimated from architecture and silhouette |
| Roof pitches, rear rooms and apses | Editable geometry parameters | Architectural/photo estimates, not a survey |

Source: [Spanish architectural article](https://es.wikipedia.org/wiki/Catedral_Metropolitana_de_Medell%C3%ADn), checked 2026-10-05; [official parish history](https://lacatedralmedellin.org/2025/06/29/historia/) confirms identity and brick construction, and the [parish homepage](https://lacatedralmedellin.org/) provides the address. Published numbers are distinct from mapped fit and visual estimates.

The source is in `src/peregrine/landmarks/top-cities/catedral-metropolitana-de-medellin/`, including the editable masonry kit. Units are real metres, axes east/up/south, rigid local foundation grade y=0. The structural origin is `[-75.56394147086847, 6.254024779938192]`. A -31.35° Three.js yaw is baked into all vertices; the runtime must not rotate again. The front outward bearing is 211.35°. Two mapped front-edge controls `[-75.5643817,6.2537754]` and `[-75.563963,6.2535209]` set the facade bearing; the long nave edge `[-75.5639718,6.2536169]` to `[-75.5637707,6.2539438]` confirms the perpendicular axis. The footprint owns only [OSM way 366050226](https://www.openstreetmap.org/way/366050226), verified with the shared Overpass helper on 2026-10-05. The supplied nearby retail multipolygon is excluded. All modeled vertices fit the outline with the provider's 0.8 m replacement slack.

## Geometry and materials

Masonry walls use original polygon extrusion with real arched holes. Bell-stage apertures are open through front and rear; narrow inner twin arches and a dividing column distinguish each bell window near. Closed nave windows have inset glass behind pierced walls. Rear rooms and crossing use shallow arched glass overlays with 0.09 m clearance; all trim is offset from its wall. Copper-clad entrance leaves sit back from the masonry and beneath repeated archivolts. The model deliberately omits a cathedral interior, carved figurative details and individual brick meshes.

Eight material batches: brick, trim, recess, roof, copper, glass, door, stone. Warm ochre brick and slightly lighter projecting masonry follow the facade reference; low weathered green copper tower caps contrast with terracotta nave roofs. The night palette dims those materials without inventing a glowing office-window grid. UVs and textures are absent. Compatible vertices are welded after source assembly, retaining hard normals. Far uses flat arch trim and simplified polygons while retaining all tower apertures, clock disk, crosses, roof hierarchy, apses and eight side bays; near adds recessed twin lancets, corbels, dentils, clock hands and shallow brick-course relief.

## Verification

Commands: `pnpm build:top-cities-landmarks catedral-metropolitana-de-medellin --no-check`; focused `node --test` for `top-cities.test.js` and this landmark's test; `node scripts/asset-catalog.mjs`; `qa-metrics.mjs --ids catedral-metropolitana-de-medellin`. The named landmark tests raycast real open belfries, the three portal leaves, choir glass and clock, tower contacts and dimensions, all eight clerestory bays, the nave/transept width and footprint containment; conformance tests round-trip both GLBs.

Visual evidence is under ignored `tmp/top-cities/shots/catedral-metropolitana-de-medellin/`. The supplied `tmp/top-cities/catedral-metropolitana-de-medellin/refs-sheet.jpg` was opened and compared before modeling. Iteration 1's procedural near/light contact sheet (`iteration-1/catedral-metropolitana-de-medellin-procedural-near-light-sheet.jpg`) was inspected at front, back, above, street, bell-stage detail and straight-down plan views. It showed recognizable massing but buried glass on the rear/crossing; those windows were offset visibly, the front lancets gained inner paired frames and engaged pilasters, and accidental glass in front of the recessed portal leaves was removed. Near cost was reduced by welding compatible vertices; far trims became flat polygons. A hidden coplanar lower apse cap and central pilaster top were corrected following deterministic QA. Final exported GLB evidence and measured costs are recorded after the final contact-sheet inspection below.

## Terrain and integration

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No renderer files, bundles or app services were changed. A conservative `terrainPad` uses the exact footprint and five reference locations, a median datum and 7 m feather, because a valley-city location should not inherit a lowest-sample 65 m disc. No DEM was sampled and no slope or pad-edge claim is made; terrain fitting and late-resolution behavior require app verification. No absolute altitude or terrain exaggeration is baked into the asset. Actual Tesla device performance is unmeasured. Independent coordinator visual review remains required before release.

## Reference photographs and rights

Photographs were compared in ignored scratch only; no reference pixels, third-party meshes or textures enter the source or GLB. Original procedural modeling is attributed to Codriver; geographic data independently retains OpenStreetMap contributors / ODbL 1.0.

- [Fachada completa - C. de Medellín](https://commons.wikimedia.org/wiki/File:Fachada_completa_-_C._de_Medell%C3%ADn.jpg), www.hippopx.com, CC0: front proportions, arcades, window subdivisions, brick palette and copper caps; Commons license checked.
- [Vista del Parque Bolivar](https://commons.wikimedia.org/wiki/File:Vista_del_Parque_Bolivar.JPG), Abodrocc, CC BY-SA 3.0: supplied aerial-context photograph, roof hierarchy and relation to the park; Commons author/license verified directly with the file page on 2026-10-05.
- Other supplied sheet views were context only: SajoR, *Parque Bolivar-Medellin* (CC BY-SA 2.5); Pastor Restrepo Maya, *Medellín - Panorámica Villanueva - 1875* (public domain); Benjamín de la Calle Muñoz, *Procesión del Corpus Christi por Junín* (public domain). The historic scenes are not used to reconstruct a former building state.

## Final exported evidence (2026-10-05)

I opened and judged `tmp/top-cities/shots/catedral-metropolitana-de-medellin/iteration-2/exported-reference-contact-sheet.jpg`: two reference photographs followed by the exported **near/light, far/light, near/dark and far/dark** variants, each at **facade, back, roof, street, detail and plan** views in that order. Those individual PNGs are named `catedral-metropolitana-de-medellin-glb-{near|far}-{light|dark}-{view}.png`; all four per-variant sheets are alongside the combined sheet. Twin tower spacing, gabled choir, low outer shoulders, bell apertures, long clerestory and crossing/apse hierarchy persist in far. No detached parts, visible reversed faces or footprint mismatch appeared. The far archivolts are deliberately polygonal; rear roof heights and room arrangement are still less firmly constrained than the photographed facade. Night has a dark silhouette rather than simulated floodlighting. No reference photo was committed.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 36,218 | 8 | 1,718,472 | 1678.2 |
| far | 6,344 | 8 | 280,772 | 274.2 |

`tmp/top-cities/catedral-metropolitana-de-medellin/qa-metrics.json` reports **zero coplanar material overlap pairs**, **0% back-face hits across 273 rays**, y-min 0 m, top 53.2 m and no removable attributes. Both variants fit hard budgets with headroom. The exact focused acceptance command passed **113/113 tests**, including six landmark-specific tests plus all three ready-landmark conformance checks; its log is `tmp/top-cities/catedral-metropolitana-de-medellin/tests-final.log`. The first whole-catalog check was transiently blocked by another worker's missing `docs/3d-top-cities-christ-cathedral.md`; only the assigned record was changed, with a final catalog retry recorded separately. No shared file was needed or modified.

The assigned record additionally passed the **same catalog validator in an isolated scratch root** containing only this record, its linked source/documentation and its exported GLBs; evidence is `tmp/top-cities/catedral-metropolitana-de-medellin/isolated-catalog-check.json`. The whole-tree catalog remains temporarily blocked by the active Christ Cathedral worker’s missing document. The coordinator explicitly accepted the isolated record validation for this dispatch and requested successful completion without waiting on that worker. The global catalog retry remains with the coordinator.
