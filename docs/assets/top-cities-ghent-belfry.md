# Belfry of Ghent

Ghent’s Gothic belfry: massive three-stage paired-lancet stone shaft, four polygonal watch turrets, open gilded clock wheels, ornate slate spire and the gilded winged dragon.

Version: exterior standing on 2026-11-10, Ghent, Belgium. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

Mapped shaft approximately15.6×12m. Gallery45m, watch-turret stone62.5m and tips74.5m, upper slate shaft76m, main needle88.9m and dragon91m are reconstruction estimates. Tourism commonly quotes91m while OSM gives95m; the datum and feature disagreement is unresolved and no survey is claimed. Current dragon body dimensions are3.55m long,1.50m wing span and1.80m high, from the local heritage society; some accounts give2.10m including its mounting.

Origin 3.7247914,51.0536613; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -2.2074755963048194 radians is baked from the two mapped control points [[3.7248944,51.0536579],[3.724825,51.0535989]]; the host must not rotate again. Footprints replace only OSM ways 501472628. Tower only: adjacent Cloth Hall and Mammelokker are not authored or masked. Seven horizontal water tables, paired Gothic openings, hollow watch-turret slots, clock-window gables and both LODs’ small spire dormers remain visible. Four clocks are open wheels and hands in front of true pointed openings; no Roman numerals or lettering. Dragon is original low-poly sculpture informed by current exterior references, not traced or scanned. y=0 flat local street grade; all heights are reconstruction estimates.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Belfry_of_Ghent)
- [OSM mapped footprint](https://www.openstreetmap.org/way/501472628)
- [Flemish Heritage Inventory: belfry construction, storeys, clocks, watch turrets and spire](https://inventaris.onroerenderfgoed.be/erfgoedobjecten/24555)
- [Visit Ghent: current belfry and dragon](https://visit.gent.be/en/see-do/ghent-belfry)
- [De Oost-Oudburg heritage society: current dragon dimensions and history](https://www.deoostoudburg.be/sites/default/files/2021-06/nieuws-bijlages/HKN2021-Extra-20210617-LR.pdf)
- [File:Spire of the Belfry of Ghent, Belgium.jpg — Julian Lupyan — CC0](https://commons.wikimedia.org/wiki/File:Spire_of_the_Belfry_of_Ghent,_Belgium.jpg)
- [File:Belfry of Ghent (DSCF0247,DSCF0249).jpg — Trougnouf (Benoit Brummer) — CC BY 4.0](https://commons.wikimedia.org/wiki/File:Belfry_of_Ghent_(DSCF0247,DSCF0249).jpg)
- [File:BelfortGent.jpg — Donarreiskoffer at Dutch Wikipedia — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:BelfortGent.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/ghent-belfry.jpg`; mapped overhead: `tmp/benelux/ghent-belfry/qa/ghent-belfry-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/ghent-belfry/dark/ghent-belfry-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Single contact-sheet look passed: paired lancets, four watch turrets, open gilded clock wheels and the full-size winged dragon remain in both LODs. Identity tests measure actual dragon geometry, true clock recesses and gallery/axle contacts with shortened-member negative cases. Tower-only footprint leaves the Cloth Hall untouched; 91m overall is an explicit estimate against the conflicting95m OSM figure.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 9626 | 4 | 127396 |
| far | 6018 | 4 | 88156 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Reduced the four open clock rings from 6-by-48 to 4-by-24 torus segments near and from 4-by-32 to 3-by-16 far, saving 1536/640 triangles. Clock apertures, hands, brackets and the complete gilded dragon remain intact; the single fresh sheet passes the cheaper silhouette.

Fresh exported contact sheet: `tmp/followup/sheets/ghent-belfry.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 9626 | 4 | 127396 |
| far | 6018 | 4 | 88156 |

Cityscape: not tested. Full 3D world: not tested.
