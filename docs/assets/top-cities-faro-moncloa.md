# Faro de Moncloa — Madrid

Original Faro de Moncloa with its slim pale concrete shaft, external slotted lift/service strip, eccentric saucer-shaped observation room, inclined circular roof and aerial mast.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Faro_de_Moncloa)
- [OSM relation/4101237](https://www.openstreetmap.org/relation/4101237)
- [OSM way/236695654](https://www.openstreetmap.org/way/236695654)
- [OSM way/307143827](https://www.openstreetmap.org/way/307143827)
- [OSM way/307143828](https://www.openstreetmap.org/way/307143828)
- [OSM way/307143829](https://www.openstreetmap.org/way/307143829)
- [OSM way/307143831](https://www.openstreetmap.org/way/307143831)
- [OSM way/307143832](https://www.openstreetmap.org/way/307143832)
- [OSM way/335504787](https://www.openstreetmap.org/way/335504787)
- [Madrid official tourism:92m observation floor and110m total](https://www.esmadrid.com/en/tourist-information/faro-de-moncloa)
- [File:Madrid - Faro de la Moncloa.jpg — Tiia Monto; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Madrid_-_Faro_de_la_Moncloa.jpg)
- [File:Faro De Moncloa.jpg — Carlos Reusser Monsalvez; CC0; comparison only](https://commons.wikimedia.org/wiki/File:Faro_De_Moncloa.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall height | 110 | Madrid tourism |
| Observation floor | 92 | Madrid tourism lift height |
| Crown footprint | about28 diameter,offset4m from stem | OSM outer236695654 and shaft307143827 |
| Neck diameter | about6 | Mapped stem footprint |
| Sloping roof | about96.6–99.6 | Photo-calibrated estimate |

Origin: [-3.7216854781250004,40.43733773437499]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 25.605418960415324 degrees is baked from the controls [[-3.7217002,40.4373123],[-3.7216514,40.4373301]]; the host must not rotate again. Footprint ownership: relation/4101237, way/236695654, way/307143827, way/307143828, way/307143829, way/307143831, way/307143832, way/335504787. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

The mapped parts report a104–110m observation crown and140m antenna. These conflict with the official92m observation deck and110m total, which are adopted here; OSM heights are not treated as ground-datum measurements. Crown diameter, eccentricity and shaft are mapped, roof pitch and mast details estimated from the exterior photos. Main origin is the shaft centre; the eccentric crown offset is baked geographically from its mapped centre. Only the bounded shaft and separate north service footing pads are flattened, never the whole elevated crown projection. External service slots survive in far. No lettering, floorplan, park, adjoining museum or below-grade elements are included. Unrelated castle photo2 is explicitly rejected.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4288 | 4 | 69592 |
| far | 2424 | 4 | 43432 |

Metrics: `tmp/batch/faro-moncloa/metrics.json`, no flags. Contact sheet: `tmp/batch/final/faro-moncloa.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/faro-moncloa/faro-moncloa-procedural-near-light-top.png`. One exterior-strip refinement made the real service rhythm visible in both LODs. Enlarged bounds show the full mast; the sloping eccentric crown and its plan projection were inspected against valid photos1/3. Tiny aerial hardware is simplified. Sill foundation duplicates were removed before final metrics, which have no flags or dropped cycle edges. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

One visual correction strengthened the two exterior lift/service strips at mapped north/south positions; the small north footing is separately padded. Their upper ends embed in the named saucer deck and lower ends in the named foundation slabs.
