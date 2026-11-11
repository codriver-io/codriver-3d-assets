# Prime Tower — Zürich

Prime Tower’s green faceted polygonal core with four shallow cantilevered facade strips starting at different floors, fine glazed grid and flat crown.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Prime_Tower)
- [Mapped way/47122541; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/47122541)
- [Mapped way/222618916; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/222618916)
- [Mapped way/222618906; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/222618906)
- [Mapped way/222618909; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/222618909)
- [Mapped way/222618911; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/222618911)
- [Mapped way/222618913; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/222618913)
- [File:Prime Tower Zürich..jpg | Gostsens | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Prime_Tower_Z%C3%BCrich..jpg)
- [File:Industriequartier - Prime Tower 2011-08-08 13-44-40.JPG | Roland zh | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Industriequartier_-_Prime_Tower_2011-08-08_13-44-40.JPG)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/prime-tower-zurich/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Roof | 126 | Published and OSM |
| Storeys | 36 | Published |
| Cantilever starts | 28, 35, 56, 91 | Mapped building-part min_height |
| Full plan envelope | approximately 40 × 59 in local frame | OSM outer and component rings |
| Curtain-wall rhythm | 3.5 m floor pitch | Published floors/height, visually estimated subdivisions |

The four cantilever starts come from OSM tags, not a survey. Curtain-wall mullions and glazing tints are visual estimates; reflective photography is represented by muted green glass. Neighboring Platform, Diagonal and Cubus buildings and signage are excluded.

## Frame and ownership

Origin `[8.51726055, 47.38611]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[8.5175038, 47.3862929], [8.5172469, 47.3864032]]`; rotationY `2.576444929038245` radians. Exact provider ways: `[47122541, 222618906, 222618909, 222618911, 222618913, 222618916]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The core is mapped way 222618916, with separately mapped strips rising from 28, 35, 56 and 91 m. Their undersides are closed and contact the core along shared vertical edges. Far preserves the angular plan and all four underside setbacks, plus a coarser grid of separate panes. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 22696 | 3 | 254420 |
| far | 6070 | 3 | 77360 |

Deterministic QA: no flags (`tmp/central-east/prime-tower-zurich/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/prime-tower-zurich.jpg`; source top over red OSM rings: `tmp/central-east/shots/prime-tower-zurich/`. Silhouette, named feature, facade rhythm, roof, back and grade contacts inspected; far preserves the structure. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
