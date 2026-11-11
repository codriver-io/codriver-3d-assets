# Saint Paul Cathedral

Gothic cathedral with an ochre paired-lancet belfry, four clock dormers, steep slate spire, open octagonal lantern, corner pinnacles, seven-bay high nave, flying buttresses and uncovered cloister court.

Version: exterior standing on 2026-11-10, Liège, Belgium. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

Owner: interior length82.75m, transept33.5m, vault24m, central nave11m and seven nave bays. Exterior mapped long span86.5m. Model eave26m, ridge34m, belfry49.5m and tip90m are reconstruction estimates. Published overall heights differ:90m in historical encyclopedia summaries versus84m in a2025 local visitor article;90m is an estimate pending surveyed height. Open lantern72–77m and four corner pinnacles65.6m are photo proportions, not surveyed levels.

Origin 5.5717034000000005,50.64013345; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -2.8486428086332047 radians is baked from the two mapped control points [[5.5720966,50.6405423],[5.5712884,50.6403877]]; the host must not rotate again. Footprints replace only OSM ways 31563794, 172111628. y=0 exterior church grade. The mapped outer building relation2295569 and innercourt172111628 are partitioned into two concave masks so the court is not filled or suppressed. Restored grey masonry and ochre upper belfry follow the2022/2025 exterior photographs. No clocks numerals, lettering, banners or signs. Clock faces partition gold ticks/hands and dark dial in one plane; dormer boxes seat into the spire. Both LODs preserve the lantern, belfry slots and cloister void. Lower roofs, relief tracery and apse geometry are simplified.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Liège_Cathedral)
- [OSM mapped footprint](https://www.openstreetmap.org/way/31563794)
- [OSM mapped footprint](https://www.openstreetmap.org/way/172111628)
- [Owner architecture guide:dimensions, seven bays and construction phases](https://www.cathedraledeliege.be/visite/)
- [Wallonia heritage institution](https://connaitrelawallonie.wallonie.be/cathedrale-saint-paul)
- [90m historical height summary (not a survey)](https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Saint-Paul_de_Li%C3%A8ge)
- [84m contemporary visitor estimate (not a survey)](https://www.vues-de-liege.be/cathedrale-saint-paul-de-liege-visiter-un-joyau-du-patrimoine-religieux-liegeois/)
- [Restored Saint Paul Cathedral exterior, published October2025 — Photographer not credited in fetched metadata; published by RCF Liège — All rights reserved; comparison only, no redistribution](https://assets.radiorcf.com/styles/890x500/assets/2025-10/cathedrale-saint-paul-liege.png.webp)
- [Restored Saint Paul Cathedral exterior, published2022 — Photographer not credited in fetched metadata; published by RTBF — All rights reserved; comparison only, no redistribution](https://ds.static.rtbf.be/article/image/1920x1080/0/3/6/798cebccb32617ad94123450fd137104-1655197300.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/saint-paul-cathedral-liege.jpg`; mapped overhead: `tmp/benelux/saint-paul-cathedral-liege/qa/saint-paul-cathedral-liege-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/saint-paul-cathedral-liege/dark/saint-paul-cathedral-liege-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The restored exterior photos15/16 establish grey masonry and ochre belfry; initial interior/collection photo results were discarded. After one visual fix, cooler masonry, apse lancets and open aisle parapets improve the reference match. Real belfry slots, open lantern and uncovered court pass rays; every flying buttress and lantern column passes contact tests with shortened-member negative cases. Total height remains explicitly estimated because published figures disagree.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 14218 | 6 | 180520 |
| far | 7610 | 6 | 106968 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Coarsened far Gothic arch curves, reduced each far window to one central tracery mullion, simplified the far apse and aisle parapet repeats, and reduced far clock-circle segments. Far falls from 10174 to 7610 triangles while near remains 14218; cloister court, belfry apertures/louvres, open lantern and 90 m spire survive the fresh sheet and contact tests.

Fresh exported contact sheet: `tmp/followup/sheets/saint-paul-cathedral-liege.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 14218 | 6 | 180520 |
| far | 7610 | 6 | 106968 |

Cityscape: not tested. Full 3D world: not tested.

## 2026-11-10 application-finding diagnosis

Relation 2295569 contains outer 31563794 and inner cloister 172111628. The source preserves the courtyard opening using two concave wing masks. Diagnostic provider-building removal leaves the pale cloister floor unchanged, while ground/road removal clears it: the captured surface is paving at grade, not a retained raised building. No new ring or approved geometry change is justified by this finding. Both-mode final captures and the mode verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`; diagnostic layer visibility overrides are not acceptance screenshots.
