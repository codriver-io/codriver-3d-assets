# Olympiaturm — Munich

Olympiaturm with a long tapered concrete shaft, three substantial lower equipment tiers with dark grille belts, the glazed revolving-restaurant drum, an upper dish and striped antenna mast.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Olympiaturm)
- [Mapped way/164084344; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/164084344)
- [File:Olympiaturm, Múnich, Alemania 2012-04-28, DD 20.JPG | Diego Delso | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Olympiaturm,_M%C3%BAnich,_Alemania_2012-04-28,_DD_20.JPG)
- [File:Olympiaturm, Múnich, Alemania 2012-04-28, DD 21.JPG | Diego Delso | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Olympiaturm,_M%C3%BAnich,_Alemania_2012-04-28,_DD_21.JPG)
- [File:Torre Olímpica, Múnich, Alemania, 2015-07-03, DD 28-30 HDR.JPG | Diego Delso | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Torre_Ol%C3%ADmpica,_M%C3%BAnich,_Alemania,_2015-07-03,_DD_28-30_HDR.JPG)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/olympiaturm-munich/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall height | 291 | Published and OSM |
| Revolving restaurant | 182 | Published |
| Observation platform | 190 | Published |
| Main head diameter | approximately 28.4 | Photo estimate within 32 m mapped envelope |
| Principal lower equipment radii | 12.5–13.2 | Photo estimates constrained by independent review |
| Base shaft diameter | 15 | Estimate |

Antenna dish levels, shaft taper and pod dimensions are photo-derived estimates. The permanent 1968 tower with later mast is modeled; temporary renovation scaffolding and the separately mapped entrance pavilion are omitted.

## Frame and ownership

Origin `[11.553740099999999, 48.174409499999996]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[11.5535937, 48.1745164], [11.5536527, 48.174542]]`; rotationY `0.576834510387645` radians. Exact provider ways: `[18894695, 164084343, 164084344, 1049578248]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

A continuous closed radial profile connects every shelf, pod and antenna to the tapered shaft. Separate glazing quads retain three horizontal rows and vertical mullions in far. Three lower equipment tiers with dark belts, pale rims and recessed gaps remain distinct from the upper restaurant and antenna dish. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4600 | 5 | 60680 |
| far | 2696 | 5 | 40640 |

Deterministic QA: no flags (`tmp/central-east/olympiaturm-munich/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/olympiaturm-munich.jpg`; source top over red OSM rings: `tmp/central-east/shots/olympiaturm-munich/`. Silhouette, named feature, facade rhythm, roof, back and grade contacts inspected; far preserves the structure. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

The three lower equipment tiers now have substantial 12.5–13.2 m principal radii, dark grille/panel belts at 156–160, 165–169 and 174–176.5 m, and pale projecting rims. Recessed breaks around 162–164 and 171–173 m keep the stack distinct from the 182–190 m restaurant/observation head. Source/export radial probes pin each grille belt, the gaps and the 291 m tip. New sheet confirms the lower head has weight and a near/far tier ratio consistent with the reference.

One new exported contact sheet: `tmp/followup/sheets/olympiaturm-munich.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
