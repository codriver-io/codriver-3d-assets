# BMW Headquarters — Munich

Munich’s four-cylinder headquarters with four rounded office drums, a dark separating service belt, suspended upper lobes and four silver roof cylinders.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/BMW_Headquarters)
- [Mapped way/310296322; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/310296322)
- [Mapped way/146381661; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/146381661)
- [File:4 Cilindros, Múnich, Alemania, 2013-02-11, DD 02.JPG | Diego Delso | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:4_Cilindros,_M%C3%BAnich,_Alemania,_2013-02-11,_DD_02.JPG)
- [File:4 Cilindros, Múnich, Alemania, 2013-02-11, DD 04.JPG | Diego Delso | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:4_Cilindros,_M%C3%BAnich,_Alemania,_2013-02-11,_DD_04.JPG)
- [File:4 cilindros y museo BMW, Múnich, Alemania 2012-04-28, DD 02.JPG | Diego Delso | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:4_cilindros_y_museo_BMW,_M%C3%BAnich,_Alemania_2012-04-28,_DD_02.JPG)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/bmw-headquarters/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Highest roof elements | 101 | Published article; OSM parts also reach 101 |
| Four-lobed plan | approximately 47 × 47 | OSM 310296322/146381661 |
| Offices | 22 storeys | Published |
| Cylinder radius / centers | 12.2 / ±10.7 | Mapped and photo-derived approximation |

OSM outer envelope is tagged 100 m while the published roof and mapped crown parts reach 101 m; modeled total is 101 m. Podium, service belt and crown subdivisions are visual estimates. The separate museum bowl, BMW Welt and factory sheds are excluded.

## Frame and ownership

Origin `[11.5601318, 48.17690745]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[11.5604328, 48.1769778], [11.5604264, 48.1768268]]`; rotationY `-1.5990519200011446` radians. Exact provider ways: `[146381661, 193654785, 193654786, 193654787, 193654788, 193654789, 193654790, 193654791, 193654792, 193654793, 193654794, 193654795, 193654796, 193654797, 193654798, 310279165, 310296322]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Four intersecting round drums preserve the clover plan. Each has separate window bays, a pinched dark service belt and a roof crown supported by a continuous central core. No logos, lettering or museum roof emblem. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 24836 | 3 | 282132 |
| far | 8452 | 3 | 106372 |

Deterministic QA: no flags (`tmp/central-east/bmw-headquarters/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/bmw-headquarters.jpg`; source top over red OSM rings: `tmp/central-east/shots/bmw-headquarters/`. One look-fix round increased the roof crown to 12.5 m above the office drums and added the characteristic sloping cylinder tops. Four-lobed plan, middle belt, glazing rhythm, crown support and near/far export were inspected against the exterior photos. The plan sits inside the mapped clover envelope.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
