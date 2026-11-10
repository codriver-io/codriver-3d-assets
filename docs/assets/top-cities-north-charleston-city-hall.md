# North Charleston City Hall

Original procedural model of the current 2009 City Hall at 2500 City Hall Lane. The broad red-brick upper block, pale lower two floors, tall segmental-arched windows and projecting glazed civic entrance with a curved pale crown are the road-distance identifiers. No city seal, lettering, flags, imported mesh or texture is included.

## Sources and dimensions

- [CEMS Engineering | Architecture's project record](https://architizer.com/projects/north-charleston-city-hall/): 2009, four stories, 150,000 sq ft City Hall, 50,000 sq ft garage, 2,500 sq ft two-story entrance atrium. This is the designer's project description hosted on Architizer.
- [City 2023 financial report](https://cms2.revize.com/revize/cityofnorthcharleston/Documents/Government/City%20Departments/Finance/2023-Annual-Comprehensive-Financial-Report-ACFR.pdf): September 2009 opening, 167,000 sq ft. This differs from CEMS' area scope; neither number is used to infer a surveyed height.
- [OSM way 301403114](https://www.openstreetmap.org/way/301403114), named North Charleston City Hall, API snapshot 2026-11-09: complete plan and orientation, including the central front and rear projections. © OpenStreetMap contributors, ODbL 1.0.
- [Ryan Johnson / North Charleston, side exterior](https://commons.wikimedia.org/wiki/File:North_Charleston_City_Hall_(31039015332).jpg), 2016, CC BY-SA 2.0.
- [Ryan Johnson / North Charleston, front exterior](https://commons.wikimedia.org/wiki/File:North_Charleston_City_Hall_(31067978171).jpg), 2016, CC BY-SA 2.0. Both Commons file descriptions, licences and actual images checked: same current building and projecting entrance at City Hall Lane. Images stay in ignored/local reference paths and are not redistributed.

| Property | Model | Status |
| --- | ---: | --- |
| Main block width | about 76.8 m | Sourced, OSM plan |
| Main block depth | about 62.4–62.9 m | Sourced, OSM plan; small facade offsets retained |
| Entrance projection width / depth | 18.83 / 16.54 m | Sourced, OSM plan |
| Rear projection | about 16.24 × 4.9 m | Sourced, OSM plan |
| Main cornice / central top | 20.6 / 22.4 m | Estimated from photographs |
| Lower pale floors / upper brick split | 9.4 m | Estimated |
| Upper window rows | sills 10.6 / 15.7 m, heights 2.75 / 2.80 m | Estimated; four-storey count sourced |
| Entrance pilasters / curved crown | 15.7 / 19.2 m | Estimated |
| Entrance glazing width / height | 10.8 / 12.0 m | Estimated |
| Front bearing | 141.58° | Sourced, OSM opposing side-edge controls |

## Frame and rigid foundation

Origin `[-80.01217383333334,32.8769795]` is within the mapped civic building. The mapped northeast side controls `[-80.0120814,32.8774325]` to `[-80.0116633,32.8769898]` and opposite southwest side `[-80.0122991,32.8765532]` to `[-80.0127136,32.8769922]` establish a southeast entrance normal about 141.58°. The 38.42° Y rotation of the northeast authoring u axis is already baked into each mesh and exported GLB; hosts must not rotate again.

Metres, +X east, +Y up, +Z south. Local y=0 is the rigid foundation at local grade, not sea level. OSM way 301403114 owns only this city hall's footprint; adjacent garage way 301404189 and surrounding buildings are excluded. The tiny entrance step is site geometry, not an extra provider replacement claim. Terrain relief, pad choice and rigid footing datum belong to the host; no DEM or Mercator stretch is baked into the model.

## Modeling and omissions

The generator follows the full mapped outline rather than a generic rectangular box. Thick walls have real cutouts and recessed separate window panes in four rows, with tall shallow arches on the upper pale floor and stone keystones above the upper brick windows. Inlaid dark frame strips replace pane surfaces; no glass is laid over an opaque facade. Far keeps four rows and the arched opening type while using coarser bay and pane grids. A higher projecting entrance bay carries a large upper arch and two flanking arches; the pale frontispiece is open around the lower atrium glass, with four grounded pilasters and a curved crown. The flat main roof is cut clear of the higher entrance volume.

Heights, bays, minor rear facade arrangements, pilaster section and crown curvature are estimates. Fine masonry courses, interiors, services, landscaping, city seal, signage lettering, flags and detached garage are omitted. Materials use muted red-brown brick, cream limestone and blue-grey glass. No contributor terms have been accepted by an agent.

## Costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 26,330 | 5 | 324,052 |
| Far | 10,222 | 5 | 152,880 |

Final `qa-metrics` reports no flags, zero coplanar/layered candidates and no back-face sweep hits. Bounds match between LODs. Metrics: `tmp/landmark-qa/north-charleston-city-hall-metrics.json`. Final contact sheet: `tmp/landmark-qa/sheets/north-final/north-charleston-city-hall-front-night.jpg`. The script-generated final sheet uses padded scratch bounds; because its automatic southwest/northeast angles hide the southeast entrance, three tiles are supplemented with actual inspector facade captures: near day, far day and near night. The final sheet shows the full silhouette, curved crown, four storeys, recessed openings and opposite side/roof. The first visual round prompted the complete front/day/night comparison; geometry QA removed hidden inside caps, coplanar roof/joins and internal keystone faces. No shared script was changed locally.

Cityscape: **not tested**. Full 3D world: **not tested**. Library inspection is separate from host integration, provider replacement, shared shading and terrain validation.

Final library validation: `pnpm build` and `pnpm check` passed for 419 assets / 846 GLB variants. The focused browser matrix loaded near/far, light/dark and GLB/procedural for all four Charleston-area landmarks (32 scenarios, no page errors); local evidence: `tmp/landmark-qa/builder-5-browser-matrix.json`. Shared final geometry metrics are in `tmp/landmark-qa/builder-5-final-metrics.json`. Byte counts above include the final licence metadata stamp, read from each measured manifest rather than the exporter's pre-stamp console summary.

The final `pnpm test:browser http://localhost:4315` passed the complete 419-viewer public library suite, including desktop/mobile, GLB/procedural, LOD/theme, scene download and licences; no page errors or failed responses.
