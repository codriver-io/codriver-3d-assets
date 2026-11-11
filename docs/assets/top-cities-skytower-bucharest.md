# SkyTower Bucharest — Bucharest

The 137 m oval SkyTower: slender rounded glass shaft, fine pale curtain-wall grid, staggered blue-grey panes and recessed roof cap.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Floreasca_City_Center)
- [Mapped way/219622660; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/219622660)
- [File:Bucharest Business District.jpg | Madalin Pentelie | CC0](https://commons.wikimedia.org/wiki/File:Bucharest_Business_District.jpg)
- [File:Sky Tower Bucharest - panoramio.jpg | Marius-Ionut | CC-BY-SA-3.0](https://en.wikipedia.org/wiki/File:Sky_Tower_Bucharest_-_panoramio.jpg)
- [Operator SkyTower](https://www.skytower.ro/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/skytower-bucharest/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Roof | 137 | Published, Floreasca City Center article/operator |
| Floors | 37 | Published |
| Oval envelope | Exact mapped ring | OSM way 219622660 |
| Floor pitch / roof parapet | 3.55 / 2 | Photo estimates |

Curtain-wall pitch, pane tints and roof setback are estimated from exterior photographs. The adjacent mall and lower office block are excluded; no signage or logos.

## Frame and ownership

Origin `[26.1047356, 44.4779584]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[26.1049718, 44.4779119], [26.1049507, 44.4778493]]`; rotationY `-1.8068136107515762` radians. Exact provider ways: `[219622660]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The mapped oval is preserved with a fine alternating vertical pane rhythm. A low entrance level supports the full tower; the roof is closed at 135 m and the mapped parapet reaches 137 m. Far keeps all 37 horizontal rows but combines neighboring facade bays. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19148 | 4 | 218344 |
| far | 5600 | 4 | 70864 |

Deterministic QA: no flags (`tmp/central-east/skytower-bucharest/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/skytower-bucharest.jpg`; source top over red OSM rings: `tmp/central-east/shots/skytower-bucharest/`. One look-fix round reduced pane tint contrast and grouped the light panes into vertical streaks; QA framing was widened because the automatic sheet clipped the tall shaft. The oval shaft, closed crown, muted glass, near/far facade grids and rigid base were inspected. Red-ring plan aligns exactly with the map; far/dark export inspected separately.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
