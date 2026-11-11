# Constanța Casino — Constanța

The restored Art Nouveau casino retains its enormous shell-shaped fan window, twin sculptural corner crests, scalloped salon gables, dark mansard and open eight-bay veranda beneath a low balustrade.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Constan%C8%9Ba_Casino)
- [Mapped way/24786437; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/24786437)
- [File:Constanța Casino 2025 (54606449888).jpg | Dennis Sylvester Hurd | CC0](https://commons.wikimedia.org/wiki/File:Constan%C8%9Ba_Casino_2025_(54606449888).jpg)
- [File:Casino de Constanza, Constanza, Rumania, 2016-05-27, DD 01-03 HDR.jpg | Diego Delso | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Casino_de_Constanza,_Constanza,_Rumania,_2016-05-27,_DD_01-03_HDR.jpg)
- [Restoration architects: completed May 2025; historical-state recovery and remodeled seaward facade](https://www.anuala.ro/en/projects/2025/084/)
- [National Investment Company: basement, ground, first floor, partial attic and restoration scope](https://www.cni.ro/proiecte/lucrari-de-consolidare-si-reabilitare-cazino-constanta-id-826-cmsid-61)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/constanta-casino/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Mapped width / depth | About 55 / 34 | OSM way 24786437 |
| Crest / mansard ridge | 26.5 / 25.15 | Photo estimate |
| Central facade / veranda deck | 22.8 / 7.65 | Photo estimates |
| Shell width / top | 17 / 18.75 | Photo estimates from mapped facade |
| Salon scalloped gables | 19.35 | Photo estimate |

No surveyed or reliable primary published total height was found: all vertical dimensions are explicit photo estimates against the mapped 55 m plan. OSM building:levels=1 is not a height measurement and misses the basement, upper hall and partial attic documented by the National Investment Company. The 2025 restored pale exterior is used; the 2016 reference supplies fan and veranda detail only, while the 1944 image is rejected as historical. Sculptural reliefs and scrolls are simplified original geometric motifs. The detailed current seaward facade differs following the restoration; its three large arched bays are an exterior approximation pending independent placement/likeness review.

## Frame and ownership

Origin `[28.66348615, 44.17050055]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[28.6635998, 44.1706839], [28.6631668, 44.1705187]]`; rotationY `-2.652742535053762` radians. Exact provider ways: `[24786437]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only the mapped casino envelope is owned. The open veranda and low plinth are on the mapped building; no promenade paving, aquarium, quay wall or Black Sea surface is added.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The shell glazing is a true cut in the central facade with radial mullions and curved fan bands. The veranda has eight through arches and real soffits, with glass entrances recessed behind; far LOD preserves the fan, openings and balustrade. Scalloped salon pediments, twin 26.5 m corner crests and the shallow dark mansard remain in both LODs. No promenade, sea wall, flags, signage or landscaping is included. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6292 | 5 | 97572 |
| far | 3592 | 5 | 62048 |

Deterministic QA: no flags (`tmp/central-east/constanta-casino/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/constanta-casino.jpg`; source top over red OSM rings: `tmp/central-east/shots/constanta-casino/`. First visual refinement replaced continuous side glazing with individual arched salon windows, and added carved pilaster capitals and lobed Art Nouveau crest/gable silhouettes. Restored 2025 reference, fan/arcade proportions, top footprint, exported near/far and dark far inspected; dimensions remain photo estimates. Second visual refinement closes the central shallow mansard to its top plateau; a street facade view confirms the shell, eight arches and crest proportions.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
