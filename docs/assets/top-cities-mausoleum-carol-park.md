# Carol Park Mausoleum — Bucharest

Five slender red-granite arches form an open pentagonal crown above a stepped dark-granite rotunda and pale circular foundation.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Carol_Park)
- [Mapped way/105889107; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/105889107)
- [File:The Mausoleum Carol Park (29414299370).jpg | Clay Gilliland from Chandler, U.S.A. | CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:The_Mausoleum_Carol_Park_(29414299370).jpg)
- [File:Parcul Carol Carol Park Bukarest b.jpg | Spock1801 | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Parcul_Carol_Carol_Park_Bukarest_b.jpg)
- [File:Bucharest - Carol Park (20162803280).jpg | Ștefan Jurcă from Munich, Germany | CC BY 2.0](https://commons.wikimedia.org/wiki/File:Bucharest_-_Carol_Park_(20162803280).jpg)
- [National Museum of Romanian Literature: published 48 m and identity](https://mnlr.ro/memorialul-eroilor-neamului-din-bucuresti/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/mausoleum-carol-park/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall height | 48 | National Museum of Romanian Literature |
| Outer foundation diameter | 40.4 | Mapped envelope 105889107 |
| Rotunda diameter / roof | 30 / 8 | OSM part 1436781584 |
| Inner roof diameter / level | 21.6 / 9 | OSM part 1436781593 |
| Arch spring / crown | 43.6 / 48 | Crown adjusted to published total; spring estimated |

The museum publishes 48 m while OSM upper parts end at 46.7 m; the published total is used and arch spring/section dimensions are photo estimates. Five crown planes follow the mapped pentagonal support arrangement. The pale outer footing is estimated 1.8 m high; the OSM 7 m outer part describes the approach/terrace ambiguously and is not used as a surveyed local foundation level. Memorial terrace, long stairs, tomb and rear hemicycle are outside this asset.

## Frame and ownership

Origin `[26.096864500000002, 44.41123705]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[26.0966558, 44.4113398], [26.0966422, 44.4113244]]`; rotationY `-2.1335853847208024` radians. Exact provider ways: `[105889107, 1436781584, 1436781593, 1479274824, 1479274825, 1479274826, 1479274827, 1479274828, 1479274829, 1479274830, 1479274831, 1479274832, 1479274833, 1479274834]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only the mausoleum envelope and its contained parts are owned; no park paving, approach stairs or neighboring memorial is replaced.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Each of five extruded concave arch ribbons has a true open centre and rounded crown, continuous feet and a grounded rotunda underneath. Far retains all five openings and the pentagonal crown. No interior mosaics, inscriptions or restricted textures. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 1691 | 5 | 36344 |
| far | 1021 | 5 | 25840 |

Deterministic QA: no flags (`tmp/central-east/mausoleum-carol-park/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/mausoleum-carol-park.jpg`; source top over red OSM rings: `tmp/central-east/shots/mausoleum-carol-park/`. All five open arches, the crown curves and stepped base checked against two exterior views; the 0.515-radian local pentagon phase follows the mapped outer support at approximately [6.7,3.8] m. No visual fix beyond this mapped bearing adjustment.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
