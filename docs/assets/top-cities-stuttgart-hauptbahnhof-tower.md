# Stuttgart Hauptbahnhof tower — Stuttgart

The Bonatz station clock tower: square sandstone shaft, five tall upper glazing slots, a large circular red-and-dark clock, projecting balcony and a low roof parapet.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Stuttgart_Hauptbahnhof)
- [Mapped way/27153443; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/27153443)
- [File:Bahnhofsturm Stuttgart.jpg | Felix König | CC BY 3.0](https://commons.wikimedia.org/wiki/File:Bahnhofsturm_Stuttgart.jpg)
- [File:Bahnhofsturm Stuttgart 2010.JPG | Felix König | CC BY 3.0](https://commons.wikimedia.org/wiki/File:Bahnhofsturm_Stuttgart_2010.JPG)
- [City of Stuttgart, updated August 2026: 56 m tower remains](https://www.stuttgart.de/en/leben/stadtentwicklung/bahnprojekt-stuttgart-ulm/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/stuttgart-hauptbahnhof-tower/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Masonry tower height | 56 | City of Stuttgart and OSM 27153443 |
| Main plan | 15.0 × 13.3 | Mapped tower part |
| Clock centre / diameter | 40.4 / 6.1 | Exterior proportions, estimates |
| Upper glazing | 45–51.5 | Photo estimate |

The city publishes 56 m for the masonry tower; the separate rooftop advertising star and its supports are deliberately omitted under the batch no-trademark rule. Clock position, pane dimensions, balcony and course projections are photo estimates; side/rear window arrangements are simplified. The station building and temporary construction works are excluded. Comparison photographs show the permanent masonry before the surrounding station works, which the city confirms is retained in 2026.

## Frame and ownership

Origin `[9.182783, 48.783374550000005]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[9.1826529, 48.7833489], [9.1827574, 48.7834627]]`; rotationY `1.0266643309299905` radians. Exact provider ways: `[27153443]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only mapped tower part 27153443 is owned. No station wing, hall, railway, construction pit or forecourt is replaced.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The main front is a single stone shape with genuine cutouts for the circular clock and five-pane window groups. Glazing is recessed with closed jambs. The clock is a partitioned circular face with twelve plain ticks and two hands, no lettering. Both LODs retain the clock, balcony, upper glazing and open roof parapet. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 8890 | 6 | 109008 |
| far | 3099 | 6 | 46352 |

Deterministic QA: no flags (`tmp/central-east/stuttgart-hauptbahnhof-tower/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/stuttgart-hauptbahnhof-tower.jpg`; source top over red OSM rings: `tmp/central-east/shots/stuttgart-hauptbahnhof-tower/`. One visual refinement added muted, individually partitioned sandstone courses on all four faces. Clock proportions, five-pane upper groups, projecting balcony and roof parapet checked against close and full exterior photographs; no rooftop trademark geometry.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

Every masonry course now uses one muted grey-brown sandstone, light #918b7e / dark #615d54; the former alternate colour keys have identical palette values and are absent from exported material batches. There are no bright camouflage blocks. Clock, five tall upper glazed slots, balcony and parapet remain; the advertising star stays excluded. The new sheet confirms uniform sandstone at overview and close range.

One new exported contact sheet: `tmp/followup/sheets/stuttgart-hauptbahnhof-tower.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
