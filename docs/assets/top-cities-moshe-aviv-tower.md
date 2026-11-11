# Moshe Aviv Tower — Ramat Gan

Moshe Aviv Tower: a 235 m rounded blue-glass shaft beside a lower 211 m pale office fin, fine vertical/horizontal window grids and a projecting circular lantern crown.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Moshe_Aviv_Tower)
- [Mapped way/503512749; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/503512749)
- [Mapped way/503369427; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/503369427)
- [Mapped way/503369428; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/503369428)
- [Mapped way/503369430; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/503369430)
- [File:Hadmo2006 0603 115301.JPG |  | CC BY-SA 2.5](https://commons.wikimedia.org/wiki/File:Hadmo2006_0603_115301.JPG)
- [File:Ranat gan.jpg | No machine-readable author provided. Itayba assumed (based on copyright claims). | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Ranat_gan.jpg)
- [File:City Gate Ramat Gan 2008.jpg | Michael Yutsis | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:City_Gate_Ramat_Gan_2008.jpg)
- [File:Moshe Aviv Tower.jpg | Little Savage | Public domain](https://commons.wikimedia.org/wiki/File:Moshe_Aviv_Tower.jpg)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/moshe-aviv-tower/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Crown | 235 | Published and OSM upper parts |
| Main pale fin | 211 | OSM parts |
| Storeys | 68 | Published |
| Glazed shaft radius / hood radius | 13.4 / 14.5 | Photo estimate constrained by mapped circular envelope |
| Lantern posts | 230–233.7 | Estimated |

The outer/fin outline is tagged 211 m and 61 levels; the circular upper parts are tagged 235 m and 68 levels, agreeing with the published overall height. The 211 m fin and 235 m circular crown are modeled separately. Facade pitch, lantern subdivisions, 13.4 m glazing radius and canopy overhang are photo estimates. No branding or adjacent offices are modeled.

## Frame and ownership

Origin `[34.80374085, 32.0834758]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[34.8038953, 32.0833099], [34.8035885, 32.0833093]]`; rotationY `-3.1392844683546755` radians. Exact provider ways: `[503369427, 503369428, 503369430, 503512749]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The complete mapped fin is a union of its two overlapping outlines. A rounded glass shaft rises 24 m above it, with a narrow service core and an open post-supported canopy. Roof/canopy contacts are probed independently of the posts, including a deliberately shortened-post negative case. Far keeps the attached fin, circular shaft, separate panes and crown openings. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 22250 | 6 | 271404 |
| far | 5822 | 6 | 76264 |

Deterministic QA: no flags (`tmp/central-east/moshe-aviv-tower/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/moshe-aviv-tower.jpg`; source top over red OSM rings: `tmp/central-east/shots/moshe-aviv-tower/`. Silhouette, named feature, facade rhythm, roof, back and grade contacts inspected; far preserves the structure. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

Far glazing groups three storeys per cell and stays below the oversized-pane threshold. Triangles wholly buried where the round shaft overlaps the lower fin are removed consistently in both LODs; every boundary-intersecting cell is retained to avoid skin holes. The lower fin, round shaft, twelve/twenty open crown posts, canopy contacts and 235 m silhouette remain. New source/export contact probes and the sheet confirm crown openings and discrete far panes; near/far costs are 22250/5822 triangles.

One new exported contact sheet: `tmp/followup/sheets/moshe-aviv-tower.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
