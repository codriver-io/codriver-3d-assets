# Torres Paseo Colón — San José

Twin Paseo Colón towers with taller north block, repeated rounded western balconies, pale blank end walls, blue glazed lower offices and adjoining low parking podiums.

## Sources and rights

- [Article: identity and architectural context](https://es.wikipedia.org/wiki/Torres_Paseo_Colón)
- [OSM way/193050718](https://www.openstreetmap.org/way/193050718)
- [OSM way/572495805](https://www.openstreetmap.org/way/572495805)
- [UCR structural monitoring: approximate98.2/101.4m,27–29floors and two towers](https://estructuras.lis.ucr.ac.cr/Edificio/Torres-Paseo-Colon)
- [PROYCON: TorreI28floors, lower offices and nine-level parking annex](https://proycon.com/portfolio/torres-paseo-colon/)
- [Torres Paseo Colón exterior, structural monitoring page — Universidad de Costa Rica, Laboratorio de Ingeniería Sísmica (individual photographer uncredited); Copyright; no image reuse licence stated; comparison only; comparison only](https://estructuras.lis.ucr.ac.cr/Edificio/Torres-Paseo-Colon)
- [File:Torre 1 de Paseo Colón.jpg — JosephC5; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Torre_1_de_Paseo_Col%C3%B3n.jpg)
- [Torre1 Paseo Colón exterior — PROYCON, individual photographer uncredited; Copyright; no explicit reuse licence stated; comparison only; comparison only](https://proycon.com/portfolio/torres-paseo-colon/)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| TowerI / TowerII total |98.2 /101.4 | UCR structural laboratory approximate heights; other sources round to97/101 |
| Tower floor counts |27–28 /29 | UCR and contractor differ on counting basement/roof |
| Mapped podium envelopes |about51×32 each | OSM193050718 /572495805 |
| Western tower slab width /depth |22 /29 | Exterior and mapped podium estimate |
| Office/parking podium top |30.4 | Nine levels, contractor; exterior estimate |

Origin: [-84.0909796625,9.935691825]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -5.561451892616738 degrees is baked from the controls [[-84.0912173,9.9356402],[-84.0907575,9.9355961]]; the host must not rotate again. Footprint ownership: 193050718, 572495805. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Two independently mapped podiums keep the open gap between the towers. Each high-rise occupies the western part of its larger podium, with inset dark glass behind curved balcony slabs and supported railings. TowerI has nineteen residential balcony levels above nine office/podium levels; TowerII has twenty-one. UCR heights98.2/101.4m are approximate and conflict with rounded97/101m; these are adopted exterior estimates, not surveyed heights. Far retains every balcony level and the stepped crowns, with fewer curved segments and simplified rail posts. Parking facades, rear service rooms and roof details are approximated from available exteriors. No shop signs, branding or copied glazing textures.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 16356 | 6 | 262120 |
| far | 5624 | 6 | 147132 |

Metrics: `tmp/batch/torres-paseo-colon/metrics.json`, no flags. Contact sheet: `tmp/batch/final/torres-paseo-colon.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/torres-paseo-colon/torres-paseo-colon-procedural-near-light-top.png`. One reference-led refinement replaced the flat crown with the rounded glazed upper screen below the taller end walls. Curved balconies remain genuinely recessed; every rail endpoint and guardpost foot is tested against its named support, and a supplemental full-twins GLB view preserves both complete silhouettes. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Far retains every balcony and discrete end/rear window row, using two curved plan facets per balcony instead of four and removing only opaque glazing-concealed inward wall faces/reveal tubes. All guard foot and rail bearing tests pass at the retained vertices; unequal crowns and the inter-tower gap remain. Near geometry is unchanged.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/torres-paseo-colon.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
