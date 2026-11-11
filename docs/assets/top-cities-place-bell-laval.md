# Place Bell

Laval’s arena complex with its pale rounded main bowl, shallow silver crown, dark angular entrance canopy and lower community-rink wings.

## Identity and sources

Current exterior at Laval, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Place_Bell)
- [Mapped replacement footprint 484506152](https://www.openstreetmap.org/way/484506152)
- [File:Place Bell - Fall 2019.jpg · Bryantriplex · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Place_Bell_-_Fall_2019.jpg)
- [File:Place Bell Laval.20170601 195705.jpg · MaxCote · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Place_Bell_Laval.20170601_195705.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -73.7218,45.5558. Replacement OSM ways: 484506152. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Compound mapped envelope | approx 183 × 136 on its own axes | OSM outline |
| Main bowl plan | 110 × 108 | Photo estimate fitted to mapped envelope |
| Main wall / roof crown | 23.7 / 26 | Photo estimates, not surveyed |
| Entry/community roofs | 6.8–11.5 | Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][56] [-73.7213823,45.5566869] and LOCAL_RINGS[0][57] [-73.7219661,45.5563682]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The 2017 completed-envelope aerial photograph and 2019 street exterior show the same rounded white arena and low community-rink extension. The construction and interior photos in the dossier were rejected as exterior references. Main-bowl dimensions, exterior heights, roof slopes and glazing pitch are estimates; signage and logos omitted. The adjacent development and building parts north of the arena are excluded. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 1746 triangles / 5 draws / 32248 bytes; far: 1108 triangles / 5 draws / 24616 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/place-bell-laval.jpg and tmp/east/place-bell-laval/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

Visual correction: the initially level white bowl skirt was replaced by a rising dark lower fascia, reflecting the prominent angled entrance/canopy edge in both exterior photos. The upper wall and crown heights remain estimates.
