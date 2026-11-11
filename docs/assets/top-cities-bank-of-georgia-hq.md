# Bank of Georgia headquarters — Tbilisi

Five two-storey concrete office bars interlock at right angles above three circulation cores, with real cantilevered ends, open gaps, two recessed ribbon-window rows and gridded soffits.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Bank_of_Georgia_headquarters)
- [Mapped way/1236448832; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1236448832)
- [File:Bank-of-georgia-hq.jpg | TheadoreTwombly | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Bank-of-georgia-hq.jpg)
- [File:Bank-of-georgia-headquarter.jpg | TheadoreTwombly | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Bank-of-georgia-headquarter.jpg)
- [File:Didube-Chugureti, Tbilisi, Georgia - panoramio (1).jpg | Daibo Taku | CC BY 3.0](https://commons.wikimedia.org/wiki/File:Didube-Chugureti,_Tbilisi,_Georgia_-_panoramio_(1).jpg)
- [Architects’ renovation account: five two-storey bars and raised foundation](https://www.archdaily.com/228934/new-headquarters-of-bank-of-georgia-illuminated-translucent-concrete-for-interior-design-architectural-group-partners)
- [Georgian heritage register object 4944](https://memkvidreoba.gov.ge/objects/immovable/immovableObject?id=4944)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/bank-of-georgia-hq/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Highest core | 51 | Estimate: 17 mapped levels × 3 m |
| Overall plan envelope | 75.8 × 76.9 | OSM 1236448832 |
| Five bar levels | 15–21, 24–30, 33–39 (two), 42–48 | Mapped min/total levels × estimated 3 m pitch |
| Grounded cores | Two mapped; third approximately 6 × 7 m | OSM 1236448835/8837 and exterior estimate |
| Glazing recess | 0.55 near / 0.65 far | Original visual estimate |

No reliable surveyed height was located: 51 m is explicitly an estimate from 17 OSM levels at 3 m, while published descriptions call the tallest core 18 storeys. Bar elevations follow OSM level/min-level ratios, not a terrain survey. The third core, within the left-hand bar and lower crossbar intersection, is estimated from the photographs; its 6 × 7 m plan is an authoring approximation. All three foundations use one rigid y=0 datum; the steep hillside and actual footing elevations require later Full 3D world fitting. The detached modern glass entrance cube, landscaping and access ramps are outside this asset. Photo 4 shows the different old city-centre bank and is excluded.

## Frame and ownership

Origin `[44.770783300000005, 41.7357447]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[44.7711463, 41.7356307], [44.7710657, 41.7358654]]`; rotationY `1.8216634339760938` radians. Exact provider ways: `[557466932, 557466934, 557466935, 1236448832, 1236448833, 1236448834, 1236448835, 1236448837, 1358301477]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Mapped outer way 1236448832 and listed contained parts only. The estimated third core remains fully inside that envelope. The detached entrance cube and neighboring structures/roads are not replaced.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Mapped bar plans and min-height intervals preserve the five distinct suspended volumes. Every bar has an independently tested named core contact; exposed core segments stop at bar soffits and resume above roofs. Soffits are clipped around intersecting cores. Window mouths have closed side/top/bottom reveals to recessed glass, with adjoining small mullions. Both LODs retain the gaps, complete cantilevers and both window ribbons. Near adds a restrained square soffit rhythm without textures. No logo, lettering, ivy texture or terrain is baked. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7594 | 7 | 105464 |
| far | 3617 | 6 | 56556 |

Deterministic QA: no flags (`tmp/central-east/bank-of-georgia-hq/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/bank-of-georgia-hq.jpg`; source top over red OSM rings: `tmp/central-east/shots/bank-of-georgia-hq/`. The five suspended bars and all gaps remain legible in near/far and dark views; recessed ribbon glazing, asymmetric short-end windows and soffit rhythm checked against both current exterior photographs. No visual fix was required. Height, estimated third-core plan and the long visible core bases must be reviewed during later hillside placement; the detached glass entrance is deliberately outside this model.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

Final cap audit: closed clipping rings are normalized before triangulation indices are flattened, keeping tower, atrium and shaft holes correct. Near/far source-export identity and opening probes pass; refreshed deterministic QA has no flags or depth cycles.
