# Grand Hotel Bucharest (former InterContinental) — Bucharest

Grand Hotel Bucharest, the former InterContinental: three concave balcony facades around a Y-shaped tower, tall pale end piers, a broad podium and curved roof crown.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Grand_Hotel_Bucharest)
- [Mapped way/1111645542; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1111645542)
- [Mapped way/23781503; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/23781503)
- [File:Grand Hotel Bucharest (24th May 2024) 002.jpg | Mtaylor848 | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Grand_Hotel_Bucharest_(24th_May_2024)_002.jpg)
- [File:Grand Hotel Bucharest (24th May 2024) 001.jpg | Mtaylor848 | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Grand_Hotel_Bucharest_(24th_May_2024)_001.jpg)
- [File:Bucuresti Hotel Intercontinental.jpg | Andrzej Otrębski | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Bucuresti_Hotel_Intercontinental.jpg)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/intercontinental-bucharest/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Roof | 87 | Published hotel article |
| Highest antenna | 90 | Estimate: 3 m above roof; OSM tower part tagged 90 |
| Storeys | 24 | Published |
| Plan | Exact podium and Y-shaped tower rings | OSM 1111645542 and 23781503 |
| Balcony pitch / recess | 3.4 / 0.65 | Photo estimate |

Published roof height is 87 m; OSM tower part is tagged 90 m. The model uses 87 m for the roof and an estimated 3 m antenna for a 90 m overall height. Balcony spacing, inset depth, podium divisions and roof crown are estimates. The current Grand Hotel name is recorded; all old/new logos and lettering are omitted.

## Frame and ownership

Origin `[26.1022401, 44.43729235]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[26.102414, 44.4375867], [26.1022837, 44.4375888]]`; rotationY `3.1190246830667343` radians. Exact provider ways: `[23781503, 937332760, 1019802601, 1019802602, 1111645542, 1188648894]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The exact mapped Y-shaped tower has three concave glazed loggias between full-height concrete end piers. Continuous floor plates project 0.65 m beyond inset glazing and are supported by the inner walls and end piers. Far keeps the concave openings and coarser individual glazing bays. The lower commercial podium follows its own mapped outline. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 10385 | 5 | 148484 |
| far | 5923 | 5 | 90548 |

Deterministic QA: no flags (`tmp/central-east/intercontinental-bucharest/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/intercontinental-bucharest.jpg`; source top over red OSM rings: `tmp/central-east/shots/intercontinental-bucharest/`. One look-fix round strengthened the pale balcony slab bands, corrected the visible floor rhythm and dipped the three crown edges between the end piers. Exported near/far retain concave loggias and distinct panes; a ray probe checks the real 0.65 m balcony recess. Mapped footprint, opposite side, rooftop antenna support and far/dark were inspected.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

Far LOD groups the tower into 14 discrete balcony/window levels instead of 20 near levels, reducing far cost to 5923 triangles. The three concave frontage groups, inset glazing, balcony plates, tall end piers and dipped crown remain; the new sheet retains the curved balcony rhythm. Near geometry is unchanged.

One new exported contact sheet: `tmp/followup/sheets/intercontinental-bucharest.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
