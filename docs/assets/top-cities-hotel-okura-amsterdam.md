# Hotel Okura Amsterdam

Hotel Okura’s warm grey-pink gridded tower, broad floating Japanese-style canopy, rooftop posts and slender mast above the mapped low hotel wings.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Published building height | 78 m | Published identity; antenna datum unspecified |
| Canopy / tip | 78 / 81.5 m | Model assumptions from exterior photos |
| Shaft plan | about 34 × 29 m | OSM 753577537 |
| Roof overhang | 3 m | Photo estimate |

Origin 4.893873825,52.348805125; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -0.08094410695725716 radians is baked from the two mapped control points [[4.8936444,52.3489458],[4.8941368,52.3489214]]; the host must not rotate again. Footprints replace only OSM ways 44451408, 753577526, 753577527, 753577528, 753577529, 753577530, 753577531, 753577532, 753577533, 753577534, 753577535, 753577536, 753577537. Published building height is 78 m, with no clear antenna datum. The canopy is modelled at 78 m and the photo-estimated 3.5 m mast gives an 81.5 m tip; both are explicitly approximate. OSM supplies the 78 m shaft and lower 2.5–13 m wing parts. The source shaft is shortened to 74 m for the open rooftop level and canopy supports. An additional authored canopy ring extends 3 m beyond the mapped shaft, inside the retained hotel envelope where possible; the ring is an estimated roof overhang, not another OSM way. Northern detached spa/conference buildings are excluded.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Hotel_Okura_Amsterdam)
- [OSM mapped footprint](https://www.openstreetmap.org/way/44451408)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577526)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577527)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577528)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577529)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577530)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577531)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577532)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577533)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577534)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577535)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577536)
- [OSM mapped footprint](https://www.openstreetmap.org/way/753577537)
- [Hotel corporate factsheet: 23 floors and exterior identity](https://www.conferencehotelgroup.com/img/hotels/files/319/Hotel%20Okura%20Amsterdam%20-%20Factsheet%20-%20Corporate%20-%20English.pdf)
- [File:Hotel Okura Amsterdam - Amstel Canal.jpg — Annevangulik — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Hotel_Okura_Amsterdam_-_Amstel_Canal.jpg)
- [File:Okura Hotel Amsterdam in 2016.jpg — Choinowski — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Okura_Hotel_Amsterdam_in_2016.jpg)
- [File:Hotel Okura @ De Pijp @ Amsterdam (19604907866).jpg — Guilhem Vellut from Annecy, France — CC BY 2.0](https://commons.wikimedia.org/wiki/File:Hotel_Okura_@_De_Pijp_@_Amsterdam_(19604907866).jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/hotel-okura-amsterdam.jpg`; mapped overhead: `tmp/benelux/hotel-okura-amsterdam/qa/hotel-okura-amsterdam-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/hotel-okura-amsterdam/dark/hotel-okura-amsterdam-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Reviewed three current-version exterior photos after excluding unrelated historical event pictures. The warm muted shaft, projecting canopy, open rooftop support level and mast are retained in far. Tests verify every canopy-post top and foot against the named supporting meshes, with a shortened-post negative case; all low hotel wings remain inside the mapped envelope plus the documented estimated roof overhang.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 8552 | 5 | 106756 |
| far | 3464 | 5 | 51204 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
