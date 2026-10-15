# Palais Bourbon — Assemblée nationale, Paris

Original texture-free procedural model of the palace, centred on Bernard Poyet’s 1806–1810 Seine-facing twelve-column Corinthian portico. The present Cortot pediment (1838–1841) is represented by grouped figure silhouettes. The palace has a different axis from its north front; the two mapped frames are retained, together with the hemicycle and open courtyard ranges.

## Sources and dimensions

The prepared dossier is `tmp/top-cities/palais-bourbon/`: `osm.json`, `osm.txt`, `facts.txt` and reference sheet. Geography is © OpenStreetMap contributors, ODbL 1.0; original source MIT, models CC BY 4.0. No photographs, scans, third-party meshes or textures ship.

| Feature | Value | Evidence |
| --- | --- | --- |
| North front | Twelve Corinthian columns, 1806–1810 | [Assemblée nationale history](https://www2.assemblee-nationale.fr/decouvrir-l-assemblee/patrimoine/palais-bourbon-et-hotel-de-lassay/l-histoire-du-palais-bourbon-et-de-l-hotel-de-lassay/les-travaux-realises-sous-le-premier-empire) |
| Perron | Thirty risers near; ten coarser risers far | Same official history; height 4.6 m from OSM steps way 380420446 |
| Column base / capital top | 4.6 / 18.4 m | Twelve OSM column parts 1459801044, 1459801046–1459801056 |
| Outer column-centre span | 39.176 m | Mapped first/last column centres, not a published survey |
| Pediment apex | 27.4 m | [OSM way 1459801045](https://www.openstreetmap.org/way/1459801045), roof height 6.8 m |
| Hemicycle / upper lantern | 22.7 / 23.9 m | OSM parts 1459531656 and 1459932064 |
| Present pediment | Cortot, 1838–1841 | [Official sculpture history](https://www2.assemblee-nationale.fr/decouvrir-l-assemblee/patrimoine/palais-bourbon-et-hotel-de-lassay/l-histoire-du-palais-bourbon-et-de-l-hotel-de-lassay/statues-et-bas-reliefs) |
| Profile and secondary detail | Estimated from photographs | Capitals/leaves, figure silhouettes, door sizes, window bays, dormers and roof profiles |

The two comparison photographs actually used are [Façade Palais Bourbon 3.jpg](https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_Palais_Bourbon_3.jpg), ZeusUpsistos, CC BY-SA 4.0 (north), and [Façade sud Palais Bourbon Paris 18.jpg](https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_sud_Palais_Bourbon_Paris_18.jpg), Chabe01, CC BY-SA 4.0 (south). Credits were checked against their Commons pages; photos stay in ignored scratch. Other dossier pictures mainly show interiors and were not used to author exterior detail.

## Frame, ownership and modelling

Origin `[2.31873,48.86173]`; real metres east/up/south, rigid local grade `y=0`. The twelve mapped column centres give an eastward colonnade bearing of 115.64° and outward facade bearing 25.64°. The western/eastern centre controls are explicitly derived in `templeFrame()`; rotation and translation are baked into the mesh once. Palace ranges follow their own mapped part edges. No altitude, DEM datum or latitude stretch is baked in.

Parent multipolygon 1019368 outer way 64959945 is also explicitly owned: its coarse frontage apron projects between the fine building parts and caused the low white remnant by the perron. The exact 164-node outer ring was fetched from the OSM API; separate guardhouses 64959898, 64959901, 64959908 and 64959931 remain provider-owned. All mapped provider parts modelled here are enumerated in `palais-bourbon-osm.js` and `OSM_WAYS`; replacement rings omit redundant tiny column rings because columns sit within the complete portico/steps footprints. The neighbouring Hôtel de Lassay, guardhouses and northern residence are excluded. No road replacement or shared renderer change.

Geometry batches by eight subdued named materials: pale limestone, darker shaded palace stone, grey steps, slate/zinc roofs, glass, dark windows, ivory sculpture and blue courtyard door. The far LOD retains twelve columns, six statues, the gabled portico, courtyard voids and individual window rows. Corinthian acanthus whorls and figure bodies are deliberately simplified, not exact sculptural reproductions. Near has thirty physical stair risers, coarser far has ten; both reach the same platform. The solid basement closes the landing beneath the colonnade. Large concave secondary roofs have simplified caps rather than detailed historic framing. Flags, interiors, railings and fine carving are omitted. The north frieze includes restrained ASSEMBLEE NATIONALE lettering. The porch wall is recessed 5.2 m behind the twelve bright columns; its soffit and back wall use darker stone. Three doors start at the 4.6 m perron. Pediment figures use connected broad drapery, heads and arms, with less than 0.5 m relief projection, tallest at the centre.

## Review g11a fixes and validation — 2026-10-15

Review g11a: twelve bright Corinthian columns stand 5.2 m forward of a darker rear wall and shaded soffit, portals start at the 4.6 m perron, and ivory grouped low relief replaces spiked figures. Recessed frieze includes ASSEMBLEE NATIONALE lettering. Simplified carving, anatomy, secondary roofs and courtyard remain; no interior, flags or street furniture.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 20,947 | 8 | 743,776 | 726.3 |
| far | 8,546 | 8 | 374,132 | 365.4 |

Evidence: `tmp/next-200/fix/g11a/palais-bourbon/comparison.jpg` places the dossier photos beside exported near/far GLB sheets. App appearance was visually checked in `app-sheet.jpg` and individual `app/{city,world}/{far,near,street}.png`; both modes loaded the intended near/far LOD. No shared renderer bundle was rebuilt.

All 21 focused landmark tests pass, including named-support contacts with shortened negative controls. Deterministic `metrics.json` reports no issues, zero layered faces and no material cycles; generated depth ordering passes its focused check. The top-cities conformance run and catalog validation are recorded in `tmp/next-200/fix/g11a/{conformance,catalog}.log`.

Cityscape: **visually verified in far/near/street screenshots**. Full 3D world: **visually verified in far/near/street screenshots** with terrain enabled. Lifecycle transitions, per-footing DEM residuals, pad lattice coverage and real-device performance are **not tested** by this fix pass; they remain integration gates.

Shared-tree check results: all nine focused conformance checks for these three landmarks pass; the requested broad run passed 828/831, with only Los Angeles Union Station, Edmonton City Hall and Arena Nationala failing during concurrent work. Catalog validation and local preview were retried and remain blocked by the other worker’s missing `docs/3d-top-cities-edmonton-city-hall.md`; no unrelated files were changed.
