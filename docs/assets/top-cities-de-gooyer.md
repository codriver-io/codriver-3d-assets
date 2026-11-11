# De Gooyer windmill

De Gooyer’s tall two-stage octagonal smock on a square stone base, 17.8 m gallery, supported balcony braces and four open lattice sails.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Sail span | 26.6 m | Owner Stadsherstel |
| Gallery | 17.8 m | Owner Stadsherstel |
| Square stone base | about 7 m high, 11 × 11 m plan | Mill society / OSM |
| Roof / hub / highest frozen tip | 29.6 / 27.5 / about 37.6 m | Photo estimates |

Origin 4.926173,52.366807575; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -0.08980646070875872 radians is baked from the two mapped control points [[4.9262607,52.3668526],[4.9262461,52.3667536]]; the host must not rotate again. Footprints replace only OSM ways 269052487. The owner identifies 26.6 m as sail SPAN, not structural height as some summaries imply; the gallery is 17.8 m and the mill society gives an approximately 7 m square stone base. Roof 29.6 m, hub 27.5 m and maximum rest-position tip about 37.6 m are photo estimates. Four 13.3 m radial sails are frozen at a diagonal rest position; the movable cap heading is a representative street-facing setting. The mapped base bearing is baked once; two authored rings cover the gallery and rotor overhang. The adjacent brewery is excluded. Current Dutch lattice rods follow the post-restoration exterior photos; the 1896 image is excluded from used references.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/De_Gooyer,_Amsterdam)
- [OSM mapped footprint](https://www.openstreetmap.org/way/269052487)
- [Owner Stadsherstel: 26.6 m sail span, 17.8 m gallery, restoration history](https://stadsherstel.nl/monumenten/funenkade-5-molen-de-gooyer/)
- [De Hollandsche Molen: 7 m stone base, two octagons and 2016 rod replacement](https://www.molens.nl/ontdek-molens/alle-molens/de-gooyer-te-amsterdam)
- [File:De gooyer amsterdam.jpg — Jvhertum — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:De_gooyer_amsterdam.jpg)
- [File:Windmill De Gooyer in Amsterdam.jpg — Zeljko.filipin — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Windmill_De_Gooyer_in_Amsterdam.jpg)
- [File:"De Gooyer" windmill @ Amsterdam (19605122206).jpg — Guilhem Vellut from Annecy, France — CC BY 2.0](https://commons.wikimedia.org/wiki/File:%22De_Gooyer%22_windmill_@_Amsterdam_(19605122206).jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/de-gooyer.jpg`; mapped overhead: `tmp/benelux/de-gooyer/qa/de-gooyer-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/de-gooyer/dark/de-gooyer-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The first look showed narrow sails: the final version widened the open lattice and retained extra longitudinal spars, with thicker far bars for readability, while remaining only 2,278 near triangles. The 17.8 m gallery and 26.6 m sail span follow the owner; all other heights are labelled estimates. Tests check lattice edge/rung/arm contacts, hub attachment, gallery brackets and railing ends excluding the tested rail, tail anchors and shortened-rung negative cases.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 2278 | 7 | 45712 |
| far | 1538 | 7 | 35272 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Darkened the brick base to muted grey-brown in both palettes, preserving the open lattice sails, cap, gallery and original 2278/1538-triangle weight. The single fresh sheet passes this restrained colour-only nit.

Fresh exported contact sheet: `tmp/followup/sheets/de-gooyer.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 2278 | 7 | 45712 |
| far | 1538 | 7 | 35272 |

Cityscape: not tested. Full 3D world: not tested.
