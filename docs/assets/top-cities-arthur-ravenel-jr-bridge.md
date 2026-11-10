# Arthur Ravenel Jr. Bridge — Charleston, South Carolina

Original procedural model of the current 2005 Cooper River bridge, covering the cable-stayed unit and enough high approach viaduct to retain its profile. No third-party mesh, image, texture, lettering or signage is included.

## Sources and dimensions

[TYLin](https://www.tylin.com/work/projects/arthur-ravenel-jr-bridge), the design-review and construction-engineering consultant, identifies the diamond towers, eight traffic lanes, walking/cycling path and protective rock islands. OSM API map extract retrieved 2026-11-09 supplies alignment controls and the bridge outline. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).

| Feature | Value | Basis |
| --- | ---: | --- |
| Main span | 471.2208 m / 1546 ft | Sourced, TYLin |
| Tower top | 174.9552 m / 574 ft | Sourced, TYLin; some secondary descriptions round to 575 ft, not treated as an additional survey |
| Navigation clearance | 56.6928 m / 186 ft minimum | Sourced, TYLin; not a universal deck datum |
| Midspan deck top / slab depth | 62 / 2 m | Estimated; consistent with TYLin saying deck rises just over 200 ft |
| Deck width | 39 m | Estimated from reference photographs and mapped outline |
| Side spans | about 221 m each | Estimated from photographs |
| Modelled extent | 1440 m | Authored: stayed unit plus 257 m of supported high approach each end |
| Diamond breadth / longitudinal depth | 50 / 5.6 m | Estimated from photos |
| Stay arrangement | 16 per tower/side/direction, 128 near / 72 far | Estimated representative count and anchor distribution |
| Island size, pier spacing and deck camber | 71 × 57 m; 64.5 m; 7.2 m crest fall | Estimated; no seabed or surveyed approach profile |

Two licensed photos checked for identity and appearance: [DXR, West Partial View 20160704 1](https://commons.wikimedia.org/wiki/File:Arthur_Ravenel_Jr_Bridge,_West_Partial_View_20160704_1.jpg), **CC BY-SA 4.0**, shows the diamond underside, walkway and stays; [w_lemay, Charleston SC](https://commons.wikimedia.org/wiki/File:Arthur_Ravenel_Jr._Bridge,_Charleston,_SC.jpg), **CC0 1.0**, shows both current towers and the approach rhythm. Both retained only in local scratch.

## Frame and placement

Origin `[-79.915287075, 32.802954275]`; metres east/up/south. The midpoint averages the paired carriageways at two mapped controls, `[-79.9178095,32.80328175]` and `[-79.91276465,32.8026268]`, from ways [927255592](https://www.openstreetmap.org/way/927255592) and [927255594](https://www.openstreetmap.org/way/927255594). Their 477.64 m mapped segmentation is scaled along-axis to TYLin’s 471.22 m span, retaining the midpoint and bearing. Rotation −0.153244674 radians is baked once. `y=0` is the visual waterline, without an absolute elevation or terrain/Mercator scale.

Alignment way IDs: **927255592, 927255594, 927255593, 50054023, 38968007, 927255595**; bridge outline **1494459861**. `FOOTPRINTS` bounds the authored 1440 m portion only; a host must clip any provider replacement to this corridor, preserve the remainder of these long ways and fit omitted approaches. The model ends on complete bearing piers, at deck y=54.8 m. No runtime road layer is provided (`ROAD_LAYER=null`). Islands and pier feet are local waterline attachments, not terrain pads. Keep the stayed unit rigid.

## Modelling and omissions

Hollow extruded diamond pylons preserve both upper and lower openings in both LODs. Stays terminate at the pylon face and continuous concrete anchorage barrier; sampled deck and supporting caps share their height function. The deck surface and underside are separate faces without a hidden full-width top slab beneath the asphalt. Muted concrete, pale cables, dark roadway and low oval rock islands match the references. Far reduces cable cross-section segments and selects a coarser stay/railing rhythm while keeping all support contacts.

No interchange, low bank approaches, detailed fenders, light standards, drain pipes, utility equipment or masonry texture. Lane paint is decorative and cannot certify traffic/navigation continuity. Rock islands are smooth low polygon approximations. Exact cable sections and tower taper are visual estimates.

## Verification


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19828 | 7 | 227836 |
| far | 7156 | 6 | 101296 |

Mechanical QA: no flags. Named cable-terminal tests pass both LODs, including shortened-end negative controls. Exported contact sheet: `tmp/landmark-qa/final/arthur-ravenel-jr-bridge.jpg`; metrics: `tmp/landmark-qa/arthur-ravenel-jr-bridge-metrics.json`. Reference identity, diamond proportions, near/far openings and support contacts were inspected; two visual refinement rounds added the separate pedestrian surface and completed outer anchorage. A subsequent mechanical-only correction starts railing posts above the anchorage curb to remove hidden parallel faces. Browser inspection is library-only.

Cityscape: **not tested**. Full 3D world: **not tested**. No contributor licence or product permission has been accepted by the agent.
