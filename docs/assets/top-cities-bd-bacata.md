# BD Bacatá — Bogotá

BD Bacatá’s actual stepped twin towers: the216m south glass cascade with pale concrete spine/open crown,167m north residential slab and terraced wings, joined by two high links above a U-shaped podium.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/BD_Bacatá)
- [OSM way/706225264](https://www.openstreetmap.org/way/706225264)
- [OSM way/706225263](https://www.openstreetmap.org/way/706225263)
- [OSM way/1175167430](https://www.openstreetmap.org/way/1175167430)
- [OSM way/1175167431](https://www.openstreetmap.org/way/1175167431)
- [OSM way/1175167433](https://www.openstreetmap.org/way/1175167433)
- [OSM way/1175167434](https://www.openstreetmap.org/way/1175167434)
- [OSM way/1175167435](https://www.openstreetmap.org/way/1175167435)
- [OSM way/1175167436](https://www.openstreetmap.org/way/1175167436)
- [OSM way/1175167437](https://www.openstreetmap.org/way/1175167437)
- [OSM way/1175167438](https://www.openstreetmap.org/way/1175167438)
- [OSM way/1175167439](https://www.openstreetmap.org/way/1175167439)
- [OSM way/1175167440](https://www.openstreetmap.org/way/1175167440)
- [OSM way/1175167441](https://www.openstreetmap.org/way/1175167441)
- [OSM way/1175167442](https://www.openstreetmap.org/way/1175167442)
- [OSM way/1175167443](https://www.openstreetmap.org/way/1175167443)
- [Council on Vertical Urbanism/CTBUH current building database:216m south,167m north](https://www.skyscrapercenter.com/complex/637)
- [Project structural engineer P&D:68levels,220m summary;240/190m foundation-to-roof dimensions](https://pyd.com.co/portfolio/edificio-bacata/)
- [Project supplier PBPSA/Nueva Terrain: links at floors14and25](https://www.pbpsa.com/case-studies/bd-bacata---bogota-co)
- [2026 report confirms prolonged incomplete south-tower shell](https://www.lafm.com.co/sociedad/rascacielos-bacata-construccion-megaobra-15-anos-problemas-legales-y-financieros-afectados-fiduciarias-409686)
- [File:2018 Bd Bacatá, Bogotá Col.jpg — EEIM; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:2018_Bd_Bacat%C3%A1,_Bogot%C3%A1_Col.jpg)
- [File:2018 Bogotá edificios BD Bacatá.jpg — Felipe Restrepo Acosta; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:2018_Bogot%C3%A1_edificios_BD_Bacat%C3%A1.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| South /north roof height |216 /167 | Council on Tall Buildings/Vertical Urbanism current measured-building database |
| Seven south cascade levels |54,81,108,135,162,189,216 | OSM stepped parts; approximately nine3m floors per step |
| South width /full depth |13.6 /51.0 | OSM1175167433 and nested parts |
| North main slab plan |22.6 ×12.8 | OSM706225263 |
| Podium top |13 | Five-floor photographic exterior estimate; OSM27 disagrees |
| Two pedestrian link floors |45 /80 | Approximate14th/25th floor levels, supplier identifies floor numbers |

Origin: [-74.0703643875,4.6050983375]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -121.3560766650667 degrees is baked from the controls [[-74.0705252,4.605086],[-74.0705889,4.6049818]]; the host must not rotate again. Footprint ownership: 706225264, 706225263, 1175167430, 1175167431, 1175167433, 1175167434, 1175167435, 1175167436, 1175167437, 1175167438, 1175167439, 1175167440, 1175167441, 1175167442, 1175167443. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Use current structural exterior massing, not a proposed260m promotional rendering or the demolished Hotel Bacatá. Main2018 completion-state photos1and7 show the same permanent stepped concrete/glass shell discussed in2026 reporting; temporary construction hoists, scaffolding, cranes and adverts are omitted. CTBUH/CVU216/167m roofs override OSM187m north height and earlier240/260m design claims. Structural engineer P&D reports240/190m from foundation to roof and220m in its summary; those use different stated datums/counts and do not establish a street-grade216m conflict resolution by themselves. All adopted external heights remain estimates where sources disagree. Mapped cumulative parts are unioned into exposed step faces, rather than exported as overlapping boxes. Bare pale lower concrete under each south glazing strip, a rear concrete spine and open upper crown preserve the unfinished exterior. North terraces and both high links survive far. Podium follows the mapped U footprint; all terrain references remain local grade, and no terrain height is baked. No branding, glass photo textures, neighboring shops or temporary equipment.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 26130 | 3 | 458472 |
| far | 5302 | 3 | 224332 |

Metrics: `tmp/batch/bd-bacata/metrics.json`, no flags. Contact sheet: `tmp/batch/final/bd-bacata.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/bd-bacata/bd-bacata-procedural-near-light-top.png`. One reference-led refinement added the integral near facade muntin grid. Coalesced exposed faces retain all south steps,167m north slab, open concrete crown and two links; far removes only hidden inner wall caps behind opaque glazing while keeping shorter6.4m window groups and the exposed crown inner faces. All step/crown rays, courtyard void and actual named bridge-bearing tests pass; complete exported silhouette view inspected. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Removed only glazing-concealed inward wall faces and tiny reveal tubes at far, retaining every separate glazing row/bay, all stepped roof terraces, unequal heights, rear spine and the genuinely open concrete crown. Both high links and their named floor-bearing tests remain intact. Near geometry is unchanged; the opposite far tiles were checked against near for missing bays.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/bd-bacata.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
