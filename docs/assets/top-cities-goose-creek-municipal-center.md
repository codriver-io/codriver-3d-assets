# Goose Creek Municipal Center — City Hall / Building B

Original procedural model of the standing City Hall at 519 North Goose Creek Boulevard, unit B, within the Marguerite H. Brown Municipal Center. The broad brick entrance gable, smaller relief gable and attached pilasters, two tiers of deeply recessed rectangular openings, raised rear clerestory and circular forecourt fountain carry recognition. This is the government building, not an interior political town-hall event.

## Sources and rights

- [City government page](https://www.goosecreeksc.gov/government), with the [City's exterior aerial DJI_0043.JPG](https://www.goosecreeksc.gov/sites/default/files/PIO/DJI_0043.JPG): primary identity and wide exterior view showing the brick gable, rear raised gable, metal roof and fountain.
- [City mayor and council](https://www.goosecreeksc.gov/government/mayor-and-city-council): Municipal Center address, Building B.
- [City 50th-anniversary history](https://tourism.berkeleycountysc.gov/wp-content/uploads/docs/Celebrating%20our%20Future%20City%20of%20Goose%20Creek%2050th%20Anniversary.pdf): center built in 1999. No published building height or plan dimensions were found in the primary material checked.
- [WCSC, 2022 budget report](https://www.live5news.com/2022/09/14/goose-creek-budget-increase-by-20-2023-mayor-says/): second exterior view, close frontage. The source image is `https://cloudfront-us-east-1.images.arcpublishing.com/gray/WJUG7VXELNBZ3E4NXVNI4JUOBQ.png`. Visually checked against the city aerial: same brick gables, central transom, tall door/window recesses and metal roof.
- Both City and WCSC photographs are **all rights reserved, reference-only, not redistributed**. No open photo licence is asserted. The coordinator expressly allowed this exception to the Commons/open-photo requirement for this landmark. Images were viewed in local scratch only, never traced or committed; all geometry is original procedural work. Commons “Goose Creek SC Town Hall” campaign interiors were rejected as unusable exterior references.
- [OSM way 1538475633](https://www.openstreetmap.org/way/1538475633): government building with `addr:housenumber=519`, `addr:street=North Goose Creek Boulevard`, `addr:unit=B`, `name=Building B`. Matches the city's address and photographed location by the campus fountain. [Small south canopy 1538475634](https://www.openstreetmap.org/way/1538475634) is included. [Fountain way 1538475656](https://www.openstreetmap.org/way/1538475656) is separate site geometry. API snapshot 2026-11-09; © OpenStreetMap contributors, ODbL 1.0.

## Dimensions

| Feature | Model | Status |
| --- | ---: | --- |
| City Hall mapped envelope | about 38.6 × 27.8 m in aligned frame | Sourced, OSM; exact small notches retained |
| Main east facade | about 20.3 m wide | Sourced, mapped east edges |
| Small south canopy | about 4.6 × 4.8 m | Sourced, OSM |
| Main eaves / entrance ridge | about 4.7–5.0 / 10.3 m | Estimated from the two exterior photos |
| Raised rear clerestory top | 12.3 m | Estimated |
| Relief gable top | 8.65 m | Estimated |
| Tall front openings | 1.1–2.9 m wide, 3.8–4.25 m high | Estimated |
| Upper square transoms | 1.15 × 1.25 m | Estimated |
| Fountain water basin | radius 2.19 m | Sourced approximate mapped basin size |
| Fountain rim / seating | 0.68 / 0.60 m high | Estimated from city aerial; seat radius/layout approximate |
| Front bearing | 95.5° | Sourced from OSM opposite building edges |

## Frame, ownership and foundation

Origin `[-80.03619,33.027974]` is inside City Hall. The rear/north edge controls `[-80.0363678,33.0281153]` and `[-80.0360068,33.0280862]` establish the long east axis about 5.5° south of east; lower wall segments independently confirm it. The main entrance faces east towards the mapped fountain, not south towards the small service canopy. The −5.5° Y rotation is baked into all geometry and exports. Real metres, +X east, +Y up, +Z south. Local y=0 is the rigid foundation toe, not sea level. No terrain DEM, altitude or Mercator scale is baked in.

Only City Hall way 1538475633 and its south canopy way 1538475634 enter `OSM_WAYS` and `FOOTPRINTS`. The separate fountain has its own constant and mapped ring; it does not authorize provider-building replacement. The long campus connector roof 1538475632 and other buildings, including Building D 1538475654, are excluded, as are the lake and neighbouring recreation center. Hosts must use a rigid foundation/pad and verify each component's local grade without bending the building to terrain.

## Modeling decisions and omissions

Mapped walls have real rectangular cutouts and separate glazing deep in the openings; the front relief gable and pilasters attach to the wall. The roof is one original surface assembled from clipped roof-plane samples, rather than overlapping hip/gable slabs; the raised clerestory is a separate attached volume with arched fanlights. The small south canopy is open on four grounded brick posts. The separate fountain preserves an open-water basin inside a brick rim and four low curved seats on an annular paved base. Static water is shown; spray is omitted.

Near has finer roof samples, window lights and curves; far keeps the roof silhouette, front gable/relief, openings, raised clerestory, supported canopy and fountain. Roof intersections and rear elevations remain approximations, not construction drawings. Brick courses, lettering, municipal seals/logos, flags, furniture, vegetation, roads, parking, new Assembly construction and other campus buildings are omitted. No external meshes, textures or photo tracing; no legal terms accepted by an agent.

## Costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 7,306 | 6 | 95,820 |
| Far | 2,590 | 6 | 46,944 |

Final `qa-metrics` reports no flags, zero coplanar/layered candidates and no back-face sweep hits, with matching LOD bounds. Metrics: `tmp/landmark-qa/goose-creek-municipal-center-metrics.json`. Final contact sheet: `tmp/landmark-qa/sheets/goose-final2/goose-creek-municipal-center-front-night.jpg`. The script-generated sheet uses padded scratch bounds and is supplemented with actual inspector facade captures in near day, far day and near night, because the automatic southwest/northeast cameras emphasize the rear. Two look-fix rounds removed hidden roof/wall caps and resolved front-opening occlusion by the small mapped east-facade notch and relief gable. Source ray checks reach glazing/frame through all five lower and upper openings in the final model. The complete roof, canopy, fountain, opposite facade and same far silhouette are visible in the sheet. Model dimensions and roof intersections remain approximations. Reference tiles are local QA only and are never committed or redistributed.

Cityscape: **not tested**. Full 3D world: **not tested**. Standalone library QA does not establish either host mode or road/terrain integration.

Final library validation: `pnpm build` and `pnpm check` passed for 419 assets / 846 GLB variants. The focused browser matrix loaded near/far, light/dark and GLB/procedural for all four Charleston-area landmarks (32 scenarios, no page errors); local evidence: `tmp/landmark-qa/builder-5-browser-matrix.json`. Shared final geometry metrics are in `tmp/landmark-qa/builder-5-final-metrics.json`. Byte counts above include the final licence metadata stamp, read from each measured manifest rather than the exporter's pre-stamp console summary.
