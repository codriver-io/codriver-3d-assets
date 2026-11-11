# Azrieli Center (original three towers) — Tel Aviv

The original three Azrieli towers: a 187 m circular shaft, 169 m triangular prism and 154 m rotated square tower, each with a pale curtain-wall grid and retained mechanical crown, above the shared low mall and circular roof atrium.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Azrieli_Center)
- [Mapped way/32635200; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/32635200)
- [Mapped way/90723265; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/90723265)
- [Mapped way/90723261; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/90723261)
- [Mapped way/90723278; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/90723278)
- [File:Azrieli Center From ToHa 2019-12.jpg | Ynhockey | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Azrieli_Center_From_ToHa_2019-12.jpg)
- [File:Sarona CBD 01.jpg | Ynhockey | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Sarona_CBD_01.jpg)
- [Azrieli Group operator: three heights and floor counts](https://azrieligroup.com/properties/azrieli-towers-tel-aviv/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/azrieli-center/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Round / triangular / square towers | 187 / 169 / 154 | Azrieli Group operator |
| Operator floor counts | 49 / 45 / 41 | Operator; OSM/Wikipedia count 46/42 for last two |
| Round tower diameter | 43.6 | Mapped circle, fitted centre [-0.6,-26.3] m |
| Mall roof | 18.5 | Photo-based four-storey estimate |
| Atrium diameter / top | 27.3 / 24.2 | Mapped plan / photo estimate |

Published tower heights are from the operator. Floor counts differ by one between the operator and OSM for the triangular and square towers; facade cadence is a visual approximation. OSM mall height 37 m and estimated min_height 9.25 m conflict with the photographed four-storey low podium, so this model uses an explicitly estimated 18.5 m roof with grounded walls and a 24.2 m glass atrium. The new Spiral Tower, construction, bridge links and detached entrance glazing are excluded; this asset is the original three-tower group only.

## Frame and ownership

Origin `[34.791866299999995, 32.074623]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[34.7922391, 32.074893], [34.7922346, 32.0755607]]`; rotationY `1.57650707407052` radians. Exact provider ways: `[32635200, 90723265, 90723261, 90723278, 550577387, 586301544]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Provider ways are the mall, original three towers, duplicate triangular part and contained circular atrium. Detached entrance glazing/footbridges and separately mapped Spiral Tower are not owned. The four footprint rings retain the actual original-group envelopes.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Mapped triangle and rotated square plans remain exact; the mapped circular envelope is fitted to an 84-sided near / 28-sided far shaft. Adjoining facade partitions provide floor bands and vertical mullions without stacked skins. Far coarsens cadence while preserving all three shapes, height differences and mechanical crowns. The mall roof is triangulated with tower and atrium holes, and the atrium dome contacts its roof opening. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 51343 | 6 | 541512 |
| far | 11093 | 6 | 134268 |

Deterministic QA: no flags (`tmp/central-east/azrieli-center/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/azrieli-center.jpg`; source top over red OSM rings: `tmp/central-east/shots/azrieli-center/`. Silhouette, named feature, facade rhythm, roof, back and grade contacts inspected; far preserves the structure. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

Final cap audit: closed clipping rings are normalized before triangulation indices are flattened, keeping tower, atrium and shaft holes correct. Near/far source-export identity and opening probes pass; refreshed deterministic QA has no flags or depth cycles.

## 2026-11-10 Full 3D world support-pad fix

Diagnosis: 40m default disc misses mall footprint; roof-contaminated DEM outside it intrudes. The old 40 m anchor disc missed the long mall podium. A bounded pad now covers the mapped original three-tower/mall site and one near-lattice-cell support halo, using the same origin grade rather than roof-contaminated DEM peaks as its datum. No architectural vertex moved. The halo is 32.38 m locally and keeps the supporting near-terrain TIN nodes at one grade. Palettes, Cityscape geometry and GLB bytes remain unchanged; only placement metadata and its manifest were updated. Before/after paths, numeric probes and final Cityscape/world verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`.

Final follow-up verdict: **Cityscape verified / Full 3D world finding**. The bounded pad clears the modeled mall, but the final near shot still shows a steep terrain mound beside the Giv'at HaTahmoshet approach outside the pad. That surrounding DEM/approach issue is not cleared by documenting it; no wider-city flattening or architectural change was attempted, and readiness remains true because Cityscape is unaffected.
