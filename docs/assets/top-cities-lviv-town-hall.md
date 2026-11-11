# Lviv Town Hall — Lviv

Lviv’s four-wing neoclassical town hall encloses the mapped open courtyard beneath low metal hip roofs; its set-back three-tier 65 m clock tower has a broad observation balcony and toothed roof crown.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Lviv_Town_Hall)
- [Mapped relation/3578153; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/relation/3578153)
- [Mapped way/683613329; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/683613329)
- [File:Lviv-Town hall-general view.jpg | Viacheslav Galievskyi | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Lviv-Town_hall-general_view.jpg)
- [File:1 Market Square, Lviv (05).jpg | Aeou | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:1_Market_Square,_Lviv_(05).jpg)
- [File:Ukraine-Lviv-Town Hall-1.jpg | Alex Zelenko | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Ukraine-Lviv-Town_Hall-1.jpg)
- [Lviv city tourism: published 65 m tower](https://lviv.travel/en/places/attractions/vezha-ratushi)
- [Lviv Center for Urban History: courtyard, tower and four wings](https://lia.lvivcenter.org/en/objects/city-hall/)
- [Mapped courtyard inner boundary 40876519](https://www.openstreetmap.org/way/40876519)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/lviv-town-hall/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tower masonry height | 65 | Lviv city tourism |
| Outer main body plan | 60 × 78.3 | OSM relation 3578153 |
| Body eaves / ridge | 22.7 / 26.2 | Four-storey exterior proportions, estimates |
| Lower tower footprint | 11.4 × 13.7 | OSM 683613329 |
| Clock tier / dial diameter | 43.8–63.5 / 3.8 | Photo estimates |

The 65 m tower height is published by Lviv tourism; rooftop flagpole is omitted so the structural height is explicit. OSM main-body height 15 m appears too low for the photographed four-storey facade; 22.7 m eaves and 26.2 m ridge are original estimates, not a survey. Clock/upper-tier widths, roof pitch, balcony and portico are photo estimates. The pre-1826 illustration and plaque-only photograph are excluded as current exterior references. Upper part 589215113 is a different tower roughly 130 m away and is not owned.

## Frame and ownership

Origin `[24.03157525, 49.841888]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[24.0311923, 49.8415209], [24.0309231, 49.8420268]]`; rotationY `1.9013685445011208` radians. Exact provider ways: `[35841391, 683613329]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. The outer ring of relation 3578153 and tower 683613329 are replacement envelopes; courtyard inner way 40876519 remains an actual geometry void and stays provider under the contract. No square paving, adjacent townhouses or other towers are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Exact mapped outer and courtyard outlines form adjoining facade partitions with four window tiers and pale window surrounds. Four hipped roof wings leave the courtyard open. The lower tower has arched stair glazing; its narrower upper tier has four clock holes with partitioned dials and hands. Both LODs keep the court, clock faces, observation railing and toothed crown. Portico arches have real soffits and masonry contacts. No heraldic emblems or lettering are reproduced. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11388 | 7 | 151904 |
| far | 4284 | 7 | 71480 |

Deterministic QA: no flags (`tmp/central-east/lviv-town-hall/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/lviv-town-hall.jpg`; source top over red OSM rings: `tmp/central-east/shots/lviv-town-hall/`. One visual refinement restored the five arched piano-nobile windows and pale central pilasters above the portico, with continuous pale floor cornices. Both LODs retain the mapped open court, stepped clock tower, observation balcony and toothed crown; roof and grade contacts inspected.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

Far window frames are simplified into individual rectangular panes with wider bay grouping, preserving four window rows, the central arched group, courtyard void, clocks, gallery rail and toothed crown. Far cost falls to 4284 triangles (35 percent lower, close to the optional 4k target). Near geometry is unchanged; the new sheet retains the civic-block rhythm.

One new exported contact sheet: `tmp/followup/sheets/lviv-town-hall.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
