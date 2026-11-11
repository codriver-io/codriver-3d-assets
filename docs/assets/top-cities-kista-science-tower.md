# Kista Science Tower — Stockholm

Kista Science Tower: the tall triangular glazed prism, black elevator overrun and slender lattice antenna, with its five lower triangular office wings, glazed gallery and mapped podium.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Kista_Science_Tower)
- [Visit Stockholm:124 m office landmark](https://www.visitstockholm.com/o/kista-science-tower/)
- [Architect White: six triangular prisms, double glass and160 m alternate total](https://whitearkitekter.com/se/projekt/kista-science-tower/)
- [CTBUH:124 m architectural top](https://www.skyscrapercenter.com/building/kista-science-tower/5309)
- [Owner Vasakronan:156 m including mast, leasing brochure](https://static.lokalguiden.se/uploads/customer/548/7ca72de42dd43e9f3c24ce9cd997df79.pdf)
- [Owner current building information](https://vasakronan.se/fastigheter/katla-1-14532/hyresgastinfo/)
- [OSM relation10311008: owned building parts](https://www.openstreetmap.org/relation/10311008)
- [OSM provider footprint / building part 746483557](https://www.openstreetmap.org/way/746483557)
- [OSM provider footprint / building part 403162812](https://www.openstreetmap.org/way/403162812)
- [OSM provider footprint / building part 37971418](https://www.openstreetmap.org/way/37971418)
- [OSM provider footprint / building part 746483558](https://www.openstreetmap.org/way/746483558)
- [OSM provider footprint / building part 403163155](https://www.openstreetmap.org/way/403163155)
- [OSM provider footprint / building part 403163296](https://www.openstreetmap.org/way/403163296)
- [OSM provider footprint / building part 403164373](https://www.openstreetmap.org/way/403164373)
- [OSM provider footprint / building part 403164809](https://www.openstreetmap.org/way/403164809)
- [OSM provider footprint / building part 746483562](https://www.openstreetmap.org/way/746483562)
- [OSM provider footprint / building part 746483561](https://www.openstreetmap.org/way/746483561)
- [OSM provider footprint / building part 746483560](https://www.openstreetmap.org/way/746483560)
- [File:Kista Science Tower.jpg — mdid; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Kista_Science_Tower.jpg)
- [File:Kista August 2014 05.jpg — Arild Vågen; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Kista_August_2014_05.jpg)
- [File:Kista Science Tower 2012.jpg — Larske; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Kista_Science_Tower_2012.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/kista-science-tower/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=17.9443528,59.4006525,17.9496472,59.4033475.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Main glass roof | 119 m | OSM |
| Black core top / architectural height | 124 m | CTBUH/Visit Stockholm;5 m overrun height estimated from roof119 |
| Antenna top | 156 m | Owner brochure; architect quotes160 m, documented4 m disagreement |
| Lower prisms | 27 /31 /36 /40 /43 | OSM |
| Podium / gallery | 7 /12 m | OSM |

Origin `[17.946960833333332,59.40147746666667]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Main triangle way37971418 fixes the exact three primary plan vertices. Edge [17.9466537,59.4013712]–[17.9474226,59.4012943] fixes the11.1160° east/south frame, corroborated by the long main west edge and the parallel annex edges. All11 building parts in relation10311008 are owned; its pedestrian/cycle/step members are deliberately excluded from OSM_WAYS. Way403164809 was outside the initial API map box and was fetched individually through the OSM API /way/403164809/full.json, accessed2026-11-10, ODbL1.0. No direct Overpass call was used.

## Model and foundation

A unioned height stack retains the exact triangular prisms and the irregular podium, with actual courtyard/terrace recesses above it. Main office skin begins at mapped12 m; a photo-calibrated glazed support storey carries each prism from the7 m podium to its mapped skin, avoiding floating volumes. Fine near floor rows, narrow mullions and restrained grey-green glass panes become coarser rows/bays in far, while the full triangular silhouette, five wings, dark overrun and mast survive. The roof box contains no extra imaginary office floors. A four-legged antenna lattice is grounded on the roof box; every brace and tie has a tested named support.

Completed2003 permanent complex. All four dossier photos show this exterior;1/3/4 are selected for close facade, rear/side and skyline. The architect’s160 m total differs4 m from the owner brochure’s156 m;156 m is modeled as the antenna envelope and124 m as architectural top. OSM119 m describes the glass body below the5 m elevator overrun. Photo-calibrated estimates include the overrun footprint, mast subdivision, lower glazed support storeys and facade module spacing. OSM ele124 on the base is a provider tag, not a local height or terrain offset, and is not baked into geometry. No highway, bridge/road layer, rooftop name lettering, flags, logos or adjacent mall/metro structure is exported.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 49040 | 7 | 554408 |
| far | 5382 | 7 | 83456 |

Deterministic QA: `tmp/batch/kista-science-tower-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/kista-science-tower.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/kista-science-tower/kista-science-tower-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/kista-science-tower/kista-science-tower-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Author review used two looks. The second corrects the elevator-overrun side normals and neutralizes the glass colour; a new horizontal ray test pins the outward-facing dark wall so its cap cannot float. Both LODs preserve the119 m triangular body,124 m black box,156 m antenna and all five lower triangular wings.

Independent-review revision: Periodic diagonal glass shading is removed in both LODs and horizontal spandrels have stronger muted contrast; near geometry and triangle count are unchanged. Far merges collinear wall pieces, continuous floor bands and shared bay frames, uses coarser separated rows and four antenna lattice levels; all six mapped prisms and the dark roof overrun remain.

Far cost: 10558 → 5382 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/kista-science-tower.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
