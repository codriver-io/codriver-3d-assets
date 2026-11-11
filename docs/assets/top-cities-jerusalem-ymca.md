# Jerusalem International YMCA — Jerusalem

Jerusalem YMCA’s stone campanile has paired open belfries, four small corner cupolas and a pierced central dome, between two domed hall wings and an arcaded hotel block.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Jerusalem_International_YMCA)
- [Mapped way/44169052; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/44169052)
- [File:Jerusalem YMCA Tower.jpg | Gellerj | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Jerusalem_YMCA_Tower.jpg)
- [File:Bell tower-Jerusalem International YMCA-2.jpg | Yair-haklai | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Bell_tower-Jerusalem_International_YMCA-2.jpg)
- [File:West Jerusalem YMCA tower.jpg | Neta | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:West_Jerusalem_YMCA_tower.jpg)
- [YMCA Three Arches operator: 152-foot tower, domes and arches](https://www.ymca3arches.com/history-and-architecture)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/jerusalem-ymca/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tower summit | 46.33 | Operator’s 152 ft, converted |
| Main shaft / lantern / dome | 35 / 42 / 46.33 | Photo estimates within published total |
| Shaft width | 7.8 | Photo estimate within mapped central hotel strip |
| Hotel / hall roofs | 17.3 / 10.3 | Photo estimates |
| Hall dome diameter / summit | 15.6 / 17 | Mapped wing width and exterior proportions |

The operator publishes 152 ft (46.33 m); other summaries round to 45, 46 or 50 m. Component heights, tower’s 7.8 m plan and hall-dome sizes are estimates calibrated to current exterior photos. The tower is centred in the mapped hotel strip at local [5.3,-2.35] m; no separate tower part is mapped, so that internal positioning needs independent review. The irregular rear plan is retained from OSM but simplified into lower hall wings and a taller central hotel body. Historic photos and interior photo 2 were rejected as current reference evidence. Fine sculptural friezes, inscriptions and YMCA logos are omitted.

## Frame and ownership

Origin `[35.22155835, 31.774309600000002]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[35.2218937, 31.7738912], [35.2212949, 31.7738447]]`; rotationY `-3.0505001118243507` radians. Exact provider ways: `[44169052]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. The complete mapped historic building envelope 44169052 is owned. Tower and domes remain inside it. No forecourt paving, garden, stadium redevelopment, pool extension or nearby building is owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Mapped plan is partitioned into the central hotel and two lower hall wings. The hotel ground-floor arcades and tower’s three entrance arches have real openings and soffits. Lower and upper belfry groups stay open in both LODs. Four corner cupolas contact the square shaft; the central dome has eight genuinely cut oculi with recessed glazing. Two wing domes sit on twelve-window drums. Both LODs keep every major dome, belfry opening and arcaded frontage. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19807 | 5 | 288584 |
| far | 8993 | 5 | 142556 |

Deterministic QA: no flags (`tmp/central-east/jerusalem-ymca/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/jerusalem-ymca.jpg`; source top over red OSM rings: `tmp/central-east/shots/jerusalem-ymca/`. One visual refinement restored the three curved gables and grouped arched hall windows, plus the hotel’s upper arched loggia. The upper belfry openings were narrowed to the photographed stone-to-void proportion. Current tower crown, two domes, ground arcades, footprint and dark far LOD inspected; internal tower placement and component heights remain estimates.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

Final cap audit: closed clipping rings are normalized before triangulation indices are flattened, keeping tower, atrium and shaft holes correct. Near/far source-export identity and opening probes pass; refreshed deterministic QA has no flags or depth cycles.
