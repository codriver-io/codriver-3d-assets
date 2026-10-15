# Battersea Power Station

Original procedural exterior of the restored Battersea Power Station, Nine Elms, London, England. Its identity is the four white, fluted, tapering chimneys above broad stepped brick wash towers, the long elevated boiler house, and lower turbine and switch houses. Contemporary roof clerestories are schematic; the Lift109 capsule is shown retracted. No scan, traced third-party mesh, photograph or texture ships. `SPEC.ready = true` describes asset readiness only.

## References and rights

- [Official heritage history](https://batterseapowerstation.co.uk/about/heritage-history/): Giles Gilbert Scott joined the project in 1929; the western pair reach 101 m, composed of 51 m wash towers and 50 m chimneys. This published architectural datum takes precedence over approximate OSM tags of 103/55 m.
- [Official restoration completion, 2022](https://batterseapowerstation.co.uk/news/construction-of-bps-reaches-practical-completion/): restored public building, Art Deco Battersea A and more utilitarian Battersea B. Moving Lift109 excursion height is excluded from static structural height.
- [OSM main building way 4965216](https://www.openstreetmap.org/way/4965216) and all twelve associated modeled building-part ways from the supplied `tmp/top-cities/battersea-power-station/osm.json`. Geographic data © OpenStreetMap contributors, ODbL 1.0. Exact owned IDs and geographic rings are in `footprint.js`; neighboring retail and apartment buildings are excluded.
- Dossier reference photos viewed: [Battersea Power Station, Nine Elms, London](https://commons.wikimedia.org/wiki/File:Battersea_Power_Station,_Nine_Elms,_London.jpg), David Samuel / Hellodavey1902, CC BY-SA 3.0; [from the river](https://commons.wikimedia.org/wiki/File:Battersea_Power_Station_from_the_river.jpg), Alberto Pascual, CC BY-SA 3.0; [2022 night view](https://commons.wikimedia.org/wiki/File:London_Borough_of_Wandsworth_-_Battersea_Power_Station_-_20221014193138.jpg), Ruben J Davies, CC BY-SA 4.0; [2006 view](https://commons.wikimedia.org/wiki/File:Battersea_Power_Station_in_London_(2006).jpg), Russ Anderson, CC BY 2.0. Historical exterior views establish massing and chimney flutes; the 2022 image establishes the restored condition. Dossier image 5 depicts nearby cranes and is not an architectural reference for the station.

Original geometry authored by Codriver, 2026-10-15. References remain in ignored scratch, with their attribution retained in the catalog; none is redistributed with the asset.

## Frame and dimensions

Origin `[-0.14472, 51.48167]`; real metres, +X east, +Y up, +Z south. Local y=0 is the rigid flat foundation; no sea-level, DEM or Mercator scale is baked. Orthogonal architectural u/v axes rotate 12.4° east of south into the exported coordinates. Two mapped west-wall controls are `[-0.1455049,51.4824815]` and `[-0.1455901,51.4822386]`; the north frontage faces bearing 347.6°. Host rotation must remain zero.

| Feature | Modeled dimension | Basis |
| --- | --- | --- |
| Chimney overall top | 101 m | Official heritage history; common datum used for all four |
| Wash tower / chimney shaft | 51 m / 50 m | Official heritage history |
| Main building envelope | approximately 160 × 170 m in architectural axes | OSM, orthogonalised with <=1.5 m fit tolerance |
| Boiler house | 61.2 × 145.2 m; roof 49 m | Mapped plan; roof height estimated near the OSM 50 m tag |
| Turbine/switch-house roofs | 30 m | OSM height tags; simplified flat roofs |
| Chimney base / tip diameter | 8.6 / 6.7 m | Photo and mapped chimney-plan estimates |
| Tower shoulders | 44, 47.5, 51 m | Photo estimate fitted to published top |
| Restored low roof clerestories | top 50.7 m | Schematic photo estimate |
| Chimney mouth bore / recess | 5.76 m / 2 m | Visual estimate |

Mapped plan fit is independent of height. Ownership includes outer outline 4965216, side/boiler parts 452939926–452939933, and chimneys 223254725, 223255111, 223255300, 223255478. The procedural envelope simplifies small jogs and omits fine entrance canopies; the whole modeled provider building is replaced. Vertex-to-owned-ring tests measure the fit, rather than assuming the origin alone establishes placement.

No jetty is mapped in the supplied building dossier. A small shared-helper pier query did not return usable data; a jetty has therefore not been invented or added to building ownership. Riverside jetty/cranes, detailed apartment terraces, landscaping and interiors remain outside this asset.

`terrainPad` proposes the exact owned rings with the main building outline as a median datum reference and 8 m feathering. This metadata requires separate in-app validation of DEM footing and surrounding lattice coverage; it does not establish topography integration.

## Geometry, colour and LOD

The plan is a union of orthogonal mapped masses, meshed as exposed surfaces only. Lower roofs under the taller boiler house and wash towers are removed. Collinear exposed wall fragments are merged before partitioning them into brick piers and genuine disjoint glass faces. The end facade retains seven separate window registers; lower turbine and switch houses retain small lower openings and tall upper slots. Far reduces the bay count but preserves rows and individual windows.

Wash towers have two setbacks before their chimney plinths and full-height vertical brick flutes. The chimneys use a continuous fluted tapered shell, supported at y=51, with rim bands, an open annular mouth and a recessed dark bore floor. Near uses 128 radial samples and 32 flute lobes; far uses 48 samples and 24 lobes. Five merged materials in each LOD: subdued warm brown brick, charcoal roof, dark glass, pale cream concrete, and a restrained lit end-window subset. The dark palette dims the architecture and lights selected end windows. Coloured event floodlighting and its photometry are not reconstructed.

Restored roof apartments and clerestories are simplified into low continuous strips, without per-unit balconies. Fine brick coursing, exact ornamental profiles and lettering are omitted. The exterior remains identifiable from either end and both sides at driving distances.

## Measured exported costs

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 16,144 | 5 | 551,844 | 538.9 |
| Far | 8,964 | 5 | 366,872 | 358.3 |

Both are under the building caps: near 60,000 triangles / 14 draws / 2.5 MB, far 12,000 / 8 / 500 KB. Identical source and exported bounds, approximately 179.33 × 101 × 181.43 m in east/up/south axes. Exported GLB 2.0 is self-contained, uncompressed, texture-free and has normals; no `bridgeLift` remains.

## Visual and deterministic evidence

Viewed `tmp/top-cities/battersea-power-station/refs-sheet.jpg`, then the procedural near/light sheet under `tmp/top-cities/shots/battersea-power-station/`. This comparison confirmed chimney placement, stepped tower proportions, warm brown brick and lower side-hall massing. The dossier's OSM chimney-height approximation was corrected to the official 101 m before export. Wall windows were constructed as disjoint surface partitions to avoid overlay flicker.

Viewed final exported near/far light/dark sheets (`battersea-power-station-glb-{near,far}-{light,dark}-sheet.jpg`) and `battersea-power-station-final-reference-sheet.jpg` in that same directory. The final comparison sheet places near/far, both palettes, north facade, south/east rear, roof/footprint and close chimney detail beside the four attributed reference photos. The initial source sheet also includes the low street view. All four chimneys, seven-row end glazing, side-hall slots, shoulder setbacks and roof hierarchy survive far detail; fine decorative geometry is intentionally simplified.

Six landmark-specific tests pass in under one second: published height/grade/orientation, four tapered shafts and open mouths, every chimney-to-named-plinth contact with a deliberately raised negative control, roof hierarchy and observable window rows, full vertex footprint containment, and far bounds/budgets. Deterministic exported QA reports no material cycles, coplanar/layered-face issues, back-face or unsupported-member flags, or far window-rhythm issues. Depth-table generation and ID-specific `--check` pass. Catalog validation, `pnpm assets:check` and `pnpm assets:preview` pass.

The requested two-file registry/landmark command is recorded in `tmp/top-cities/battersea-power-station/tests-final.log`. All six landmark tests and its three registry checks pass; the whole requested command has two unrelated in-progress `palais-bourbon` failures (a footprint below the minimum area and missing `public/models/buildings/palais-bourbon.json`). Only the permitted generated `src/peregrine/landmarks/depth-layers.js` was regenerated; no shared source, server, bundle or git write was used.

## Integration handoff

| Mode/case | Status | Remaining validation |
| --- | --- | --- |
| Source and exported GLB; near/far, light/dark | verified | Measured and visually inspected above |
| Cityscape app placement and shared shading | not tested | Coordinator app bundle and unobstructed captures |
| Full 3D world and terrain contacts | not tested | Rigid datum, DEM arrival/refinement, pad edges and entrances |
| Provider masking, failure fallback and lifecycle | not tested | Failed/late load, disposal, theme/mode/region changes and reanchor |
| Driving and physical-device performance | not tested | Export size alone does not establish runtime performance |

