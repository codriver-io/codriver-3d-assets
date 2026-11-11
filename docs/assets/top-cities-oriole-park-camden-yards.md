# Oriole Park at Camden Yards

Camden Yards’ open green baseball bowl, repeated brick street arches and exposed steel light frames beside the remarkably long B&O warehouse; includes the completed2026 enlarged video board without branding.

## Identity and sources

Current exterior at Baltimore, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Oriole_Park_at_Camden_Yards)
- [Mapped replacement footprint 1171328455](https://www.openstreetmap.org/way/1171328455)
- [Mapped replacement footprint 93170801](https://www.openstreetmap.org/way/93170801)
- [Mapped replacement footprint 93172117](https://www.openstreetmap.org/way/93172117)
- [Mapped replacement footprint 336381051](https://www.openstreetmap.org/way/336381051)
- [Architect Populous: ballpark and retained warehouse](https://populous.com/projects/oriole-park-at-camden-yards)
- [Stadium authority:2026completed upgrades and later phases](https://mdstad.com/projects/renovation-projects-oriole-park-camden-yards)
- [Governor: March2026completed video board](https://mdstad.com/press-release/governor-moore-unveils-historic-stadium-upgrades-oriole-park-camden-yards-opening-day)
- [File:OrioleParkatCamdenYardsSummer2025.jpg · Aspifi · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:OrioleParkatCamdenYardsSummer2025.jpg)
- [File:Oriole Park Conway Street.JPG · Jkinsocal · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Oriole_Park_Conway_Street.JPG)
- [Maryland Stadium Authority exterior aerial, Getty Images · Getty Images; individual photographer not credited on project page · All rights reserved, comparison only](https://www.mdstad.com/projects/oriole-park-camden-yards)
- [2026 Opening Day completed center-field videoboard · Office of Governor of Maryland; individual photographer uncredited · All rights reserved, comparison only; no explicit reuse licence found](https://mdstad.com/press-release/governor-moore-unveils-historic-stadium-upgrades-oriole-park-camden-yards-opening-day)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -76.62166667,39.28388889. Replacement OSM ways: 1171328455,93170801,93172117,336381051. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
|---|---|---|
| Warehouse mapped length/width |approx315/16| OSM; published1016ft(309.7m) differs |
| Warehouse eave/ridge |30.4/34| Photo estimate,8mappedstoreys |
| Seating upper rim/light frame |33/42| Photo estimates |
| 2026 center-field screen |32.8×21.2| Area694m² inferred from published7466sqft; aspect estimated from completedphoto |
| Field surface |0.15abovefooting | Local rigid datum |

Mapped orientation controls are LOCAL_RINGS[0][11] [-76.620266,39.2841149] and LOCAL_RINGS[0][12] [-76.6201317,39.2819856]. The working-frame angle is atan2(Δsouth, Δeast) minus 90°; its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The Ravens’ published stadium facts imply an Oriole Park height of 150 ft (45.72 m) by stating that their 185 ft stadium stands 35 ft above it. This model’s 42 m maximum is a photo-based estimate with a different unverified roof/lighting datum; the discrepancy is unresolved and should be checked during independent review. [Ravens stadium facts](https://www.baltimoreravens.com/stadium/information).

The OSM stadium leisure boundary owns the bowl and field; the actual building multipolygon2205481 uses outerway24617367 and inner courtyardway93171526. Outerway24617367 is also declared for provider ownership, while the existing leisure mask already covers its complete geometry; mapped warehouse93170801 and two small stadium pavilions are also declared. Main bowl seating paths are photo estimates fitted inside that boundary, not surveyed seat locations. The stadium is an open horseshoe with stepped seats, exposed upper steelwork and true negative space above the brick street facade. Source8 is the stadium authority aerial (Getty, all rights reserved);4 confirms street arches;10 is the March2026 completed videoboard from the Maryland governor (no explicit reuse licence, all rights reserved comparison only). Source2 confirms 2025 bowl geometry. The older narrow scoreboard in1/2/3/8 is superseded by the completed2026 screen. Future upper-deck changes announcedSeptember2026 are not assumed completed. No reference image is redistributed; no sponsors, text, marks, logos or flags. The warehouse is315m in the mapped plan versus1016ft in published descriptions; this asset preserves the mapped alignment. Playingfield surface is0.15m above localfooting and the app terrain datum remains untested. Heights are photo estimates. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 13772 triangles / 8 draws / 172468 bytes; far: 7411 triangles / 8 draws / 105816 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/oriole-park-camden-yards.jpg and tmp/east/oriole-park-camden-yards/shots/. Both app modes remain untested. Light rail endpoint contacts are tested from actual end-cap vertices against separate named columns, including shortened-end negative cases.

Cityscape: not tested. Full 3D world: not tested.

Mapped building: https://www.openstreetmap.org/relation/2205481 and https://www.openstreetmap.org/way/24617367.
