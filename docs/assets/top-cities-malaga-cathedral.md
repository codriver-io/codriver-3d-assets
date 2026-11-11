# Málaga Cathedral — Málaga

Original Málaga Cathedral in its November2026 exterior state: one completed northern bell tower, the unfinished southern tower, polychrome three-bay west portals, newly completed triangular pediment, Renaissance apse and partly clad new timber roof.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Málaga_Cathedral)
- [OSM way/1015333951](https://www.openstreetmap.org/way/1015333951)
- [Cathedral chapter: facade,14bells,north tower87m and unfinished south tower](https://cabildocatedralmalaga.es/arquitectura-exterior/)
- [Andalusia heritage: facade and octagonal bell architecture](https://www.juntadeandalucia.es/organismos/culturapatrimoniohistoricoydeporte/areas/bienes-culturales/actuaciones-conservacion/intervenciones/detalle/39801.html)
- [Diocese: October22,2026 pediment completion](https://odisur.es/malaga/la-catedral-de-malaga-culmina-su-fronton-con-la-colocacion-de-la-ultima-piedra-244-anos-despues-de-la-paralizacion-de-las-obras/)
- [Cathedral chapter: new roof and future sculpture program,May2026](https://cabildocatedralmalaga.es/la-catedral-de-malaga-inicia-la-construccion-del-fronton-para-culminar-su-fachada-principal/)
- [Cathedral roof works panorama, November8,2026 article — Javier Albiñana / Málaga Hoy (Grupo Joly); Copyright all rights reserved, comparison only; comparison only](https://www.malagahoy.es/malaga/catedral-malaga-amplia-2028-plazo-finalizar-obras_0_2008430306.html)
- [File:254 Jahre dauerte es bis der Bau der Kathedrale von Malaga vollendet war. 07.jpg — Holger Uwe Schmitt; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:254_Jahre_dauerte_es_bis_der_Bau_der_Kathedrale_von_Malaga_vollendet_war._07.jpg)
- [Cathedral fronton completed October22,2026 — Diocese of Málaga / ODISUR (no individual photographer credited); All rights reserved; no reuse licence stated; comparison only; comparison only](https://odisur.es/malaga/la-catedral-de-malaga-culmina-su-fronton-con-la-colocacion-de-la-ultima-piedra-244-anos-despues-de-la-paralizacion-de-las-obras/)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| North tower total | 87 | Cathedral chapter exterior page;84 and93 published alternatives disagree; adopted estimate |
| Mapped exterior envelope | about120 long ×72 wide,plus small stair projections | OSM1015333951 |
| Nave cornice | 37.8 | Photo-calibrated estimate |
| New roof ridge | 48.5 | November2026roof photograph estimate |
| New west pediment crest | 49.6 | Estimate;October22,2026 completion confirmed by diocese |
| Unfinished south tower stubs | 47.3 | Photo estimate |

Origin: [-4.41943,36.72012]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -86.38276899756399 degrees is baked from the controls [[-4.4200525,36.7203944],[-4.4200038,36.7197769]]; the host must not rotate again. Footprint ownership: 1015333951. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Dated2026state: the triangular west pediment was completed October22, but the main roof intervention remains in progress. The apse timber rafters are exposed and the nave has dark waterproof underlay as in the November8panorama; finished ceramic tiles and nine proposed future facade statues are not invented. Temporary cranes/scaffolding are omitted. The87m chapter height is adopted as an estimate;84m and93m published figures are unresolved rather than asserted equivalent datums. Photo1 supplies unchanged portal detail;7 shows the current upper belfry;9 the current roof/apse. Dossier2–6 are interiors and8 is a logo, all rejected. Attached Sagrario church and unrelated gardens are excluded. Massing follows the cathedral way; three bounded authored facade/cornice projection rings cover estimated relief and overhang; footing and DEM contacts remain untested. No lettering, logos, textures or interiors.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 18763 | 9 | 302832 |
| far | 6560 | 8 | 165368 |

Metrics: `tmp/batch/malaga-cathedral/metrics.json`, no flags. Contact sheet: `tmp/batch/final/malaga-cathedral.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/malaga-cathedral/malaga-cathedral-procedural-near-light-top.png`. The2026 timber/underlay roof and new pediment are dated approximations verified against current exterior evidence; no future statues or finished tiles were added. One visual correction exposed the real tall-window/oculus rhythm above the lowered chapel roofs; first-hit regressions preserve it. Facade relief is simplified, and tower87m remains a documented estimate. Named cornice/ridge/purlin/bell contacts pass in both LODs; final metrics have no flags or depth cycles. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

One visual correction lowered estimated chapel roofs to11.5m so they no longer bury the nave windows, enlarged the oculi to the photographed rhythm, and added a first-hit ray regression for both LODs. Nave masonry is estimated1.6m thick; projected pilasters meet the wall, roof hips meet overlapping horizontal cornices, and buried end caps were removed. The cathedral chapter [portal close-up](https://cabildocatedralmalaga.es/wp-content/uploads/2026/03/11-1-768x1024.jpg), copyright/no reuse licence, checks unchanged polychrome details. Three bounded authored relief/cornice rings supplement the mapped ground shell; the median pad remains on the mapped ring only.

## Independent-review follow-up

Deepened stone, roof-underlay and timber colours for the requested daytime contrast, keeping the documented November2026 incomplete roof state. Far retains the unequal towers, all portal/oculus openings, supported bells, pediment and open apse rafters while removing opaque-glazing concealed faces and simplifying small circular members. Far remains 6560 triangles because further reductions would compromise the many actual open belfry/portal apertures and the supported construction-state roof; the remaining 560 above the soft target is deliberate. Near changes only in the requested colours.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/malaga-cathedral.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.

## 2026-11-10 application framing follow-up

Application basemap around the cathedral stays blank even after final captures reach zero downloads; archive coverage exists. Custom exact origin; zoom 17.2, pitch 45, bearing 20; three successive settling shots in each mode; no model edits. Final top views still lack nearby streets/buildings despite downloading=0; central public MVT returns HTTP 200 with 4,958 buildings and 310 roads, so this is an application tile/rendering evidence gap, not an established model defect. Final verdict: Cityscape **not tested**; Full 3D world **not tested**. Before/after evidence, capture diagnostics and exact command arguments are recorded in the follow-up report. No readiness gate was changed from a framing/data gap.
