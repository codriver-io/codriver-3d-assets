# Viñoly Tower

Viñoly’s silver-blue curtain wall in three stepped components, with deep diagonal stair notches wrapping around an inset structural core.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Overall height | 91 m | Municipal Zuidas; 92 m OSM / 95 m CTBUH alternatives |
| Tower plan | about 40 × 32 m | OSM parts |
| Long low wing | about 50 × 26 m | OSM part 754894014 |
| Recessed notch gap | 2.2 m | Photo estimate |

Origin 4.87204,52.337804; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation 0 radians is baked from the two mapped control points [[4.8730554,52.3379366],[4.873072,52.3377621]]; the host must not rotate again. Footprints replace only OSM ways 27653949, 754894011, 754894012, 754894013, 754894014. Municipal Zuidas project page gives 91 m; CTBUH lists 95 m and OSM upper part 92 m. The model follows the municipal 91 m with all alternatives documented as uncertainty. The footprint and 26/62/92 m mapped divisions guide the massing; diagonal stair gradients, 2.2 m vertical notch gaps and facade pitch are estimates. Adjacent SOM and Ito structures are excluded.

## Sources and rights

- [Landmark identity and architectural context](https://nl.wikipedia.org/wiki/Viñoly)
- [OSM mapped footprint](https://www.openstreetmap.org/way/27653949)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754894011)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754894012)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754894013)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754894014)
- [Municipality Zuidas: 91 m, three components and wrapping stair notches](https://zuidas.nl/en/construction-project/mahler-4-vinoly/)
- [CTBUH Mahler 4 height cross-check](https://www.skyscrapercenter.com/complex/85)
- [Bestand:Kantoortoren Viñoly in Amsterdam-Zuid.jpg — Choinowski — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Kantoortoren_Vi%C3%B1oly_in_Amsterdam-Zuid.jpg)
- [Bestand:WTCAmsterdam3.jpg — Geen machineleesbare auteur aanwezig. Op basis van auteursrechtclaims wordt auteur Migdejong aangenomen. — Public domain](https://commons.wikimedia.org/wiki/File:WTCAmsterdam3.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/vinoly-tower-amsterdam.jpg`; mapped overhead: `tmp/benelux/vinoly-tower-amsterdam/qa/vinoly-tower-amsterdam-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/vinoly-tower-amsterdam/dark/vinoly-tower-amsterdam-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The diagonal belts are recessed geometric notches with supported treads, rather than colour bands. Deterministic depth checks exposed coplanar tread ends at the facade corners: treads were inset and their ends shortened onto the existing landings, clearing every material cycle. The two exterior views retain the three-part stepped tower in near and far.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 20832 | 4 | 250712 |
| far | 7408 | 4 | 99068 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Added one continuous 0.24 m stair stringer beneath each diagonal run, tied into the existing treads at both ends. This strengthens stair continuity in both LODs for only 96 extra triangles each, without adding railings or altering the signature notches; the fresh sheet and supported-stair tests pass.

Fresh exported contact sheet: `tmp/followup/sheets/vinoly-tower-amsterdam.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 20832 | 4 | 250712 |
| far | 7408 | 4 | 99068 |

Cityscape: not tested. Full 3D world: not tested.
