# Smithsonian Institution Building ("the Castle") — original procedural exterior

The Smithsonian Institution Building, Washington, D.C.: James Renwick Jr.'s Norman / Gothic Revival "Castle" on the south side of the National Mall (built 1849–55, red Seneca sandstone, NHL 1965). This is an original, texture-free procedural model of the building as a driver sees it from Jefferson Drive, the Mall paths and 12th Street, in the top-cities registry (`src/peregrine/landmarks/top-cities/smithsonian-castle/`). It replaces the provider's extrusions of the three outline ways of OSM relation 7393969; the Haupt Garden pavilions, the neighbouring museums (Arts and Industries, Asian and African Art) and the Ripley pavilion stay provider data.

## Sources and provenance

- [Wikipedia: Smithsonian Institution Building](https://en.wikipedia.org/wiki/Smithsonian_Institution_Building): central section, two ranges and two wings; four occupiable and five decorative towers; the principal south tower 91 ft (28 m) high and 37 ft (11 m) square; two north towers, the taller 145 ft (44 m); a campanile at the north-east corner 17 ft (5.2 m) square and 117 ft (36 m) tall; red Seneca sandstone.
- [OSM relation 7393969](https://www.openstreetmap.org/relation/7393969) (ways 42341487, 788292737, 507462707, fetched through the OSM API `way/<id>/full`, the shared Overpass helper being down at the time): the outline, 135 m long on a due east–west axis (mapped edges at 89–90°), ~47 m deep with the north porch.
- Reference-only photographs, kept under ignored `tmp/top-cities/smithsonian-castle/refs/` and never exported: Robert Lyle Bolton, *Arts and Industries Building Across the Parterre* (CC BY 2.0); ajay_suresh, *Smithsonian Institution Building (53831938398)* (CC BY 2.0); User:Noclip, *Smithsonian Building NR* (public domain); Brady-Handy Photograph Collection, *Smithsonian Institution Castle* (public domain, Library of Congress); Geiserich77, *12072012 Smithsonian Building 02* (CC BY-SA 3.0); AgnosticPreachersKid, *East entrance - Smithsonian Institution Building* (CC BY-SA 3.0).

Authored by Codriver on 2026-10-15. No scan, traced mesh, photograph or texture is in the source or the GLBs.

## Frame and dimensions

Origin `[-77.026, 38.88875]` (the Castle's Wikipedia/NRHP coordinate); real metres, +X east, +Y up, +Z south; local y = 0 is grade. The mapped outline spans x −63…72 m, z −28…19 m around the origin. The axis is due east–west, so no rotation is baked: the model sits on the mapped rings as drawn (checked in the `--top` view and by the footprint-containment test).

| Feature | Model | Basis |
| --- | --- | --- |
| North octagonal tower (centre −3.0, −16.0) | 8.4 m across the flats, 43.25 m parapet with four 44.0 m pinnacles (long paired-arch belfry, no roof pyramid) | height sourced (145 ft); width from the mapped outline corner |
| North pyramid-roofed tower (east of the porch) | 6.8 × 7.3 m, roof apex 36.2 m | outline sourced; height estimated from photographs |
| Campanile, north-east corner of the main body | 5.3 m square, apex 36.0 m | size and height sourced (17 ft / 117 ft); position from the 5.3 m projection in the outline |
| South tower | 9.6 m wide, parapet 27 m + merlons ~28.8 m, flag turret 33 m, pole ~35.8 m | 91 ft sourced; footprint from the outline (the sourced 37 ft square includes its buttress and bay) |
| North-west flat-crowned octagon | apothem 2.0 m (4 m across flats), parapet 24 m | width/height estimated from photographs |
| Main body: west wing / west range / centre / east range / east wing | eaves 11.5 / 11 / 12.5 / 11 / 14.5 m, ridges 16.5 / 14.5 / 16.5 / 14.5 / 20 m | outline sourced; heights estimated from photographs |
| Gabled north porch | 6.5 m lower porch / 8.3 m upper gable, ridge 18 m, rose diameter 4 m, door 3.2 × 5 m | lower outline sourced; upper gable/rose/heights estimated |
| East entrance bay, east-wing crenellated corner turrets, west annex and turret, three small spire turrets, six roof stacks | see `geometry.js` | outline for plan; heights estimated |

## Geometry and LOD

Materials, four in both themes: `stone` (red sandstone), `trim` (paler window surrounds, dial, rose tracery and flag pole), `slate` and `glass` (window and door openings). One merged mesh per material, four draws.

- **Massing** follows the mapped outline: five E–W gabled blocks with one corbel course under each eave, stone gable triangles whose slopes pass exactly through the wall tops, a steep cross-gable porch on the Mall front, an east entrance bay with its own gable.
- **Towers**: the 44 m north octagon has a flat sandstone parapet with four small supported corner pinnacles, paired round arches on all eight faces, a long upper belfry tier, corner ribs, lower buttresses and corbel consoles. Its clock is at the photographed middle stage (23.6 m) and has a pale dial, hour ticks and hands. The north-west octagon ends in a lower flat 24 m crown; the former 31.5 m cone has been removed. The square north tower, campanile and small spire turrets retain slate roofs with a concave profile. South and wing turrets retain crenellations in both LODs.
- **Openings and façade detail**: round-headed bays with sandstone surrounds, separate glazing panes exposing mullions/transoms, floor string courses, bay pilasters, eave consoles and south-tower corner buttresses. Near surrounds stand 0.12 m proud and glazing 0.26 m proud. Crown/course geometry shares the sandstone material. Clock and rose details use separated sectors rather than crossed transparent overlays.
- **Far** keeps the revised crown silhouettes, paired tower arches, individual round-headed range windows, ribs, pilasters, string courses and crenellations. Small corbel consoles, pale window surrounds and glazing bars drop; no stacked far window surrounds. The paired openings survive on the tall octagon; the slim north-west turret has one opening per exposed face.

## Costs (exported GLBs)

| | triangles | draws | size |
| --- | --- | --- | --- |
| near | 14 430 | 4 | 914 KiB (936 308 bytes) |
| far | 4 580 | 4 | 285 KiB (292 116 bytes) |

Budgets: near ≤ 60 000 / 14 / 2.5 MB, far ≤ 12 000 / 8 / 500 KB. The review fix spends the additional near geometry on repeated architectural details; far remains below 300 KiB.

## Approximations and open items

Eaves, ridges, window dimensions and rhythm, minor turret heights, the 24 m north-west crown and concave slate profiles are photo estimates. Tower heights and mapped footprint are sourced separately above. Small carvings, figurative sculpture, the interior and precise Great Hall/cloister details remain simplified. No terrain levels are baked into the reusable GLB.

## Review fix and verification — 2026-10-15

The g10c reviewer identified an invented roof on the tall octagon, an oversized cone-roofed north-west tower, and insufficient architectural detail. Both LODs now have the flat 44 m crown and low 24 m north-west parapet. Paired upper belfry windows, corner shafts/buttresses, corbel crowns, arched window surrounds, glazing divisions, clock hands/hour ticks and radial rose tracery address the bare-shaft/toy-like detail finding. Concave slate profiles replace straight pyramid slopes on the remaining roofed towers. Eave details and west-gable rose placement were separated from glazing after depth analysis found intersections.

Evidence under `tmp/next-200/fix/g10c/smithsonian-castle/`: `comparison.jpg` places dossier photos beside final exported near/far GLB sheets; `final-near/` has overview, north, south, east, roof and detail; `final-far/` has overview, north, south and detail. Two look iterations used. `app/{city,world}/smithsonian-castle-{far,near,street}.png` and each mode's `report.json` record active loaded layers and far/near/near LOD selection. Inspected app screenshots show the corrected towers, clean sandstone façade rhythm and no visible duplicate provider extrusion or floating foundation from the north approach.

Cityscape: **verified for these static north-approach far/near/street views**. Full 3D world: **verified for these static north-approach far/near/street views**. Scratch-only app bundle `736a1b736095`, Protomaps tiles.codriver.io, AWS Terrarium terrain z15, slot L 3314/3316 (Cityscape street reframed at zoom 18.15 in equivalent bundle `56401551d648`). This does not establish mode-transition/lifecycle, terrain arrival/eviction, reverse approaches or device performance. Synthetic account requests and optional unavailable local data endpoints logged expected errors; landmark GLBs loaded successfully. No app runtime or provider mask change was required: OSM relation 7393969's exact three ways/ring remain owned.

Focused landmark tests: 11 pass, including full-width flat-crown raycasts, low stone north-west crown, both long belfry bays in both LODs, geometry/footprint budgets, crenellation and named flag-pole support. `qa-metrics.mjs`: near/far **ok** (no budget, coplanar, below-grade or back-face flags). Regenerated depth layers and `--check`: **0 cycle edges dropped**. Registry and catalog validation results are recorded in the fix report; unrelated concurrent edits may affect their aggregate result.

## Scoped final proportion fix — g10cr, 2026-10-15

The north-west drum was still nearly as wide as the tall tower. Both LODs now use a 2.0 m apothem (formerly 3.8), one window per exposed face and a narrowed low connecting annex, retaining the 24 m top. The porch upper gable widens from 6.5 to 8.3 m and its rose radius grows from 1.35 to 2.0 m. Four small stone pinnacles stand on the tall octagon's parapet, whose centre is 43.25 m; their tips preserve the sourced 44 m height. Day sandstone changes from #97523e to the darker, less orange #80463f; surrounds and the night palette darken proportionally. Dimensions of these decorative features remain photo estimates. No other landmark features or provider ownership changed.

Exported GLB near/far sheets and a photo comparison are under `tmp/next-200/fix/g10cr/smithsonian-castle/`; one look iteration. Focused tests pass 12/12, including observable drum width, enlarged rose, wider gable and crown support/top checks in both LODs. QA metrics report no issues (zero layered/coplanar faces, zero back-face hits, no below-grade geometry); regenerated depth layers and their check report zero dropped cycle edges. Fresh static north-approach near app evidence and aggregate-check results are recorded in the report in that directory; the earlier g10c lifecycle/terrain limitations still apply.

Fresh g10cr app evidence: `app/{city,world}/smithsonian-castle-near.png` (zoom 17.2, pitch 62) and `app/{city-street,world-street}/smithsonian-castle-street.png` (zoom 18.15, pitch 74), all bearing 180. Both modes have active, loaded near layers, with no visible provider overlap or footing gap in these static north views. Scratch bundle `5588bcd40840` used Protomaps tiles.codriver.io and AWS Terrarium z15; owned server PIDs 5888/5889 were stopped and the /tmp copy removed. The required registry file completed 821/822 tests, including all three Castle checks; its sole failure was the unrelated hotel-negresco GLB/source bounds mismatch. The catalog checker was run twice and remains blocked by concurrent gateway-arch registration/documentation (latest: missing `docs/3d-top-cities-gateway-arch.md`). No unrelated source or records were changed.
