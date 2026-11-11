# Mississauga Civic Centre

Mississauga Civic Centre’s buff barn-like civic hall, stepped office block, circular council drum and open red-and-white braced clock tower with four real dial faces.

## Identity and sources

Current exterior at Mississauga, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Mississauga_Civic_Centre)
- [Mapped replacement footprint 288862658](https://www.openstreetmap.org/way/288862658)
- [Mapped replacement footprint 149173949](https://www.openstreetmap.org/way/149173949)
- [Mapped replacement footprint 76584402](https://www.openstreetmap.org/way/76584402)
- [Mapped replacement footprint 288862659](https://www.openstreetmap.org/way/288862659)
- [Mapped replacement footprint 76584389](https://www.openstreetmap.org/way/76584389)
- [Mapped replacement footprint 92045505](https://www.openstreetmap.org/way/92045505)
- [Mapped replacement footprint 288862660](https://www.openstreetmap.org/way/288862660)
- [OSM complete civic relation](https://www.openstreetmap.org/relation/20666451)
- [City: civic centre architecture](https://www.mississauga.ca/city-of-mississauga-news/news/city-modernizing-the-civic-centre-ground-floor-2/)
- [File:Mississauga Civic Centre, May 16 2026 (02).jpg · Dillan Payne · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Mississauga_Civic_Centre,_May_16_2026_(02).jpg)
- [File:Mississauga Civic Centre (2009).jpg · Visnja · CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Mississauga_Civic_Centre_(2009).jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -79.64445,43.5884. Replacement OSM ways: 288862658,149173949,76584402,288862659,76584389,92045505,288862660. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Highest clock roof | 92 | Article; conflicting OSM79.6m is documented |
| Office upper mapped steps | 38 / 41 | OSM parts |
| Hall eave / ridge | 20 / 28 | OSM roof/height interpretation |
| Open frame / clock chamber | 38–75.5 / 75.5–86.5 | Photo estimates |
| Clock pyramid | 86.5–92 | Photo estimate |
| Council drum top | 35 | OSM part |

Mapped orientation controls are LOCAL_RINGS[0][0] [-79.643813,43.58936] and LOCAL_RINGS[0][1] [-79.6448175,43.5885586]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

1987 Jones and Kirkland building, checked against completed2009 and current2026 exterior photos; the council interior and shopping-centre photo were rejected. Relation20666451 has two closed adjacent exterior rings288862658 and149173949. All modelled office, clock, council and skylight parts are owned; library, Living Arts Centre and square pavilions are excluded. Overall height92m is reported by the article, while the mapped clock part gives79.6m; exterior datum/height difference is unresolved and clock frame/chamber heights are estimates. Four clock hands show an illustrative time, without numerals or lettering. No square paving, fountains or terrain are authored. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 6940 triangles / 8 draws / 101204 bytes; far: 4196 triangles / 8 draws / 70016 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/mississauga-civic-centre.jpg and tmp/east/mississauga-civic-centre/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.
