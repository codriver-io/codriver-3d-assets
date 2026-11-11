# Palais des congrès de Paris — Paris

Broad angular convention hall with a raked pale front,three triangular recessed bays and a glazed entrance base.

## Sources and rights

- [Viparis:current Palais des Congres venue identity and spaces](https://www.viparis.com/nos-lieux/palais-des-congres-de-paris)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Palais_des_congrès_de_Paris)
- [OSM way 229301764: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229301764)
- [OSM way 229301763: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229301763)
- [OSM way 229301761: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229301761)
- [OSM way 229301760: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229301760)
- [OSM way 229301759: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229301759)
- [OSM way 84329058: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/84329058)
- [OSM way 229301757: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229301757)
- [Reference photograph: File:Avenue Neuilly - Paris XVI (FR75) - 2021-08-11 - 1.jpg — Chabe01 — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Avenue_Neuilly_-_Paris_XVI_(FR75)_-_2021-08-11_-_1.jpg)
- [Reference photograph: File:Lafayette Complex at night.jpg — Corvax — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Lafayette_Complex_at_night.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/palais-des-congres-paris/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Main roof | 40 | OSM relation3074648 |
| Mapped front base | 21 | OSM relation3074646,contextual canopy |
| Glazed lower zone | 15 | Photo estimate |
| Facade rake | 10 | Photo estimate |
| Triangular bay peak | 33 | Photo estimate |

Origin `[2.2835852, 48.87931425]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The main hall and front footprint are modeled separately,with a closed raked upper frontage over a glazed entrance base. Three deep triangular bays have real recessed surfaces and closed reveals; no coplanar poster decals are used. The pale gray daylight colour is calibrated to the2021 exterior rather than assuming copper cladding. The adjacent hotel is deliberately excluded: a polygon-intersection regression verifies that its footprint is not masked,despite shared OSM boundary ways. Upper roof machinery,amphitheatre interiors,event banners and the surrounding Porte Maillot works are omitted. Both references show the completed1999 facade; the night image is used for form,not to copy illuminated branding.

1974 venue with1999 Portzamparc raked front. Main40 m height mapped; entrance base15 m,front rake10 m and triangular recesses are photo estimates. Owns only relations3074648 and3074646; adjacent Hyatt tower/lobby relations3074643/3074647 and tall part229301758 excluded. No event banners,logos,lettering,interiors,plaza or road works.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7506 | 5 | 130264 |
| far | 3008 | 5 | 60952 |

Deterministic metrics: `tmp/france/palais-des-congres-paris/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/palais-des-congres-paris.jpg`. Mapped orientation/top check: `tmp/france/shots/palais-des-congres-paris/palais-des-congres-paris-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Second look: replaced the two meeting roof caps with one union of the mapped rings,to close small simplification seams,and removed internal partition jambs from the continuous triangular recesses. Only the actual cavity perimeter retains reveals.
