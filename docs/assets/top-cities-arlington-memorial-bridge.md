# Arlington Memorial Bridge — procedural landmark

Current fixed-span Arlington Memorial Bridge, Washington, D.C., opened 1932 and rehabilitated in 2020. The removed movable machinery is not modeled; the ornamental metal central arch fascia remains. Original texture-free meshes, east/up/south metres about `[-77.05549895,38.8873481]`, orientation baked from OSM way 468423958, west to east, approximately 65.2 degrees.

## References and measurements

[NPS National Register nomination](https://npgallery.nps.gov/NRHP/GetAsset/NRHP/80000346_text) supplies dimensions and ornament; [NPS rehabilitation](https://www.nps.gov/gwmp/learn/management/amb-rehabilitation.htm) establishes the current fixed central span. OSM bridge outline 368707612 supplies pier stations and approach control points; the lead dossier is the source of the initial extract, with approaches fetched once through the shared Overpass helper.

| Feature | Published / mapped | Model / interpretation |
| --- | --- | --- |
| Structural length | 2163 ft / 659.2824 m, NPS | 659.3 m from station 50.5 to 709.8 |
| Width between balustrades | 90 ft / 27.432 m, NPS | 27.76 m between inner rail faces; outer masonry 28.3 m |
| Roadway | 60 ft / 18.288 m, NPS | 18.288 m, six lanes |
| Walks | 15 ft / 4.572 m each, NPS | 4.736 m inside outer rails |
| Openings | Nine river arches plus one road arch at each bank, NPS | Eleven full-width open soffits |
| Pier thickness | 32–41 ft, NPS | 10 m, rounded noses; approximate |
| Eagle discs | 12 ft / 3.658 m diameter, NPS | 3.658 m diameter |
| West pylons / eagles | 35 ft / 8 ft, NPS | Shaft/cap about 10.35 m; eagle abstraction 2.6 m |
| Gilded horse groups | Approximately 17 ft, NPS | 4.43 m high abstraction, pedestal 6.6 m estimated |
| Road alignment | OSM 468423958, ~670 m | Same points, plus 45 m on each mapped approach |
| Deck height | Not surveyed | 9.5 m visual estimate above flat grade |
| Flat ramps | Visual compromise | 150 m each; smoothstep steepest 9.5 percent |

Reference photos inspected: Antony-22, *Arlington Memorial Bridge 2020c* and *renovation 2019a*, CC BY-SA 4.0; G. Edward Johnson, *Arts of War after regilding Washington DC 2026-07-31*, CC BY 4.0. Links and attribution in catalog provenance. Dossier images 5/6 depict unbuilt proposals and were excluded; the construction image was used only to understand the repeated pier rhythm. No images, textures or copied meshes ship.

## Model decisions

Broad granite spandrels are closed extruded arch prisms with continuous full-width soffits. The central fixed span is darker, retaining a distinct ornamental fascia. Near includes clipped ashlar joints, arch voussoirs, stylized bison keystones, eagle discs and fasces, turned balusters, globe lamps, west pylon pilasters/wreaths and east horse/rider/companion figures. Far retains every opening, pier, relief disc, entrance monument, lamp silhouette and open railing, using fewer balusters and arch segments. Four station chunks merge repeated near members per material; far merges each material across the complete bridge.

Road surface, geometry and runtime navigation use one createBridgeProfile. createRegistryBridgeLayer owns live road fitting, GLB lifecycle and HD overlay. There are no shared-file changes. The profile uses absolute-deck terrain policy, does not flatten a corridor through the Potomac, and keeps foundation-to-deck bridgeLift weights. Flat ramps start 45 m before the structural ends and reach the plateau 105 m into the bridge; the flatter real bank-to-bank profile cannot be reproduced on a flat map without this compromise. Generic crossing roads should be rejected by heading alignment.

Eight semantic materials have matching light/dark keys; only globe lamps are emissive at night. Sculptures are original low-poly abstractions, rather than faithful artistic reproductions. The pylons and statues sit toward the walks and are simplified; facial/feather/inscription detail is omitted. No surveyed elevations, machinery, foundations below local grade, engineering reinforcement or exact masonry block layout.

## Verification evidence

Initial procedural contact sheet: `tmp/top-cities/shots/arlington-memorial-bridge/arlington-memorial-bridge-procedural-near-light-sheet.jpg` inspected in overview/front/back/roof/deck/underside/pylon/sculpture views against the dossier reference sheet. This exposed the need for ashlar rhythm on the broad spandrel faces; clipped bed/head joints were then added. Export and app verification results follow.

Cityscape: verified locally for model loading, standard-road approach continuity and navigation-height sampling; the broader lifecycle matrix is not tested. Full 3D world: inspected locally with terrain enabled; terrain-fit numbers and limitations follow. HD lane details are unavailable locally without Redis (`/osm-lanes` 503), so standard-road evidence cannot establish HD pavement/paint continuity. Independent reviewer acceptance remains a coordinator gate.


Final exported GLB comparison: `tmp/top-cities/shots/arlington-memorial-bridge/export-reference-contact-sheet.jpg` was opened and judged with the three current-bridge reference photos in its first row. It contains front/back/above/deck/underside/monument details in near/far and light/dark; the separate `arlington-memorial-bridge-glb-{near,far}-{light,dark}-sheet.jpg` files retain all eight cameras. Both LODs keep the arch silhouette and original sculptural abstractions; the ornaments are much less realistic than the architectural geometry and remain a deliberate approximation.

| Export | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 83,078 | 28 | 2,882,136 | 2,815 |
| Far | 21,026 | 8 | 763,448 | 746 |

The focused conformance plus landmark tests passed **98/98** in 1.13 s. Landmark raycasts pin nine river openings, ten support contacts, the gilded entrance groups, pylons and a 42 m envelope (including pier noses); the mapped footprint covers the structure, while the owned road profile extends 45 m on each bank. Export round trips preserve bounds, named materials, normals and bridgeLift weights. `node scripts/asset-catalog.mjs` passed (164 entries / 258 variants), `pnpm assets:preview` passed, and `pnpm build:peregrine` succeeded. The geometry scan reported 0 coplanar overlap pairs, 0 percent back-facing exterior hits on 49 rays, minY 0 and top 16.23 m; evidence in `tmp/top-cities/arlington-memorial-bridge/qa-metrics.json`.

`app-cityscape/` and `app-world/` each contain successful far/near/street captures and reports; both bridge LODs were active. `app-modes-sheet.jpg` was opened and compared. The four ad-hoc Cityscape approach captures (west/east, bearings 65.2/245.2) were assembled into `app-approaches-sheet.jpg` and inspected: fallback pavement transitions meet the mapped roads without a visible vertical step or doubled generic bridge. The snapshot helper reports active=false for custom spot IDs because it queries the spot name rather than the landmark; actual landmark captures and the height probe confirm active=true. The approach road locally simplifies a divided junction into the common bridge profile; exact HD lane count and dash continuity are unverified.

Navigation samples use the actual `window.__map.landmarks.heightAt` in both headings, rather than a separate authoring formula. Cityscape: approach road offset 0/0 m; structural landings at stations 50.5/709.8 return 2.5053/2.5048 m, mapped roadway endpoints at stations 45/715.294 return 2.0520 m, plateau at stations 150/300/450/610.294 returns 9.5000 m; end of eastern ramp returns 0.0000 m. Perpendicular headings, points 30 m laterally off the bridge and beyond the approach return null. The exact outer western boundary returns null and therefore uses the ordinary ground-road surface at the zero-height join. Raw samples: `tmp/top-cities/arlington-memorial-bridge/heights-cityscape.json`.

The terrain test uses local Terrarium configuration and the map's current shared terrain implementation; its screenshot attribution is Mapzen/AWS Terrain Tiles (USGS 3DEP, NRCan CDEM). Network/account CORS errors and local osm-lanes 503 responses are expected QA environment limits. Route/car/camera consumers share the accepted surface, but live traffic, full lifecycle toggles, exaggerated/late terrain and real hardware performance were not individually exercised.

World probe: terrain was enabled and ready, and `_ground` was present; sampled outer-bank DEM datums were 8.98675 / 8.65531 m, without an approach road offset. Returned deck offsets above the shared local terrain were 2.91077 / 1.71232 m at structural landings, 2.01789 / 0.78397 m at the mapped roadway endpoints, and 7.93546 / 9.39763 / 9.21710 / 9.36417 m at plateau stations 150 / 300 / 450 / 610.294. Forward and reverse values agree, perpendicular and off-bridge values are null, eastern outer-ramp join is 0 m. These offsets are relative to each query's current ground; they are not absolute sea-level bridge heights. Raw samples: `tmp/top-cities/arlington-memorial-bridge/heights-world.json`.

The probe also captured west/east approaches in both directions for Cityscape and world. `tmp/top-cities/shots/arlington-memorial-bridge/probe-approaches-modes-sheet.jpg` was opened and inspected with the terrain views alongside flat views. Full 3D world: **verified locally for loading, terrain-ready deck/support fitting, standard-road approaches and both-heading height queries**; the remaining lifecycle/HD/device matrix is **not tested**. Both shared navigation API samples are recorded, rather than inferring terrain support from an inspector screenshot.

Known integration limitation visible in the world approach contact sheet: the west divided junction is represented by one common approach corridor, and DEM fitting makes the short ramp visibly faceted. The standard road meets the zero-height outer join, but this does not establish exact lane geometry at both fork branches. Review that junction with HD lane service before rollout; the middle crossing, accepted navigation surface and structural openings pass the local checks. The standalone GLBs are ready; road-junction fidelity and the remaining integration matrix are separate review items.
