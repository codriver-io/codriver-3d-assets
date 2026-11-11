# M&T Bank Stadium

Baltimore’s purple open football bowl with four distinct upper-deck corner notches, brick and glass concourses, tall light trusses and the completed2026low North Plaza additions.

## Identity and sources

Current exterior at Baltimore, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/M%26T_Bank_Stadium)
- [Mapped replacement footprint 1171329996](https://www.openstreetmap.org/way/1171329996)
- [Mapped replacement footprint 24617369](https://www.openstreetmap.org/way/24617369)
- [Mapped replacement footprint 172620322](https://www.openstreetmap.org/way/172620322)
- [Team: stadium dimensions and185ftheight](https://www.baltimoreravens.com/stadium/information)
- [Team:August2026renovationcompletion](https://www.baltimoreravens.com/news/ravens-renovation-project-mt-bank-stadium-complete-north-plaza-gate-a)
- [Structural engineer:185ft and corner suite additions](https://www.thorntontomasetti.com/project/mt-bank-stadium)
- [File:M&T Bank Stadium in Baltimore.jpg · Quintin Soloviev · CC BY 4.0](https://commons.wikimedia.org/wiki/File:M%26T_Bank_Stadium_in_Baltimore.jpg)
- [File:2016-05-11 08 00 03 View of M&T Bank Stadium from southbound Maryland State Route 295 (Russell Street) in downtown Baltimore City, Maryland.jpg · Famartin · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:2016-05-11_08_00_03_View_of_M%26T_Bank_Stadium_from_southbound_Maryland_State_Route_295_(Russell_Street)_in_downtown_Baltimore_City,_Maryland.jpg)
- [September21,2026 completed renovation photo IMG_0663 · Kevin Lynch, SouthBMore · All rights reserved, comparison only](https://www.southbmore.com/2026/09/21/photo-tour-new-bars-music-venue-and-hospitality-spaces-at-mt-bank-stadium/)
- [September21,2026 completed renovation photo IMG_0394 · Kevin Lynch, SouthBMore · All rights reserved, comparison only](https://www.southbmore.com/2026/09/21/photo-tour-new-bars-music-venue-and-hospitality-spaces-at-mt-bank-stadium/)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -76.62277778,39.27805556. Replacement OSM ways: 1171329996,24617369,172620322. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Maximum light-bank height|56.388| Team published185ft |
|Mapped playing rectangle|109.7×53.6approximately| OSMpitch172620322 |
|Upper rim / suite top|44.5/24| Photo estimates |
|Lower first row|1.83abovefield| Teampublished6ft |
|North Plaza low blocks|9.5–14.5| Photo estimates within mappedstadium boundary |

Mapped orientation controls are LOCAL_RINGS[2][3] [-76.6232162,39.2783687] and LOCAL_RINGS[2][0] [-76.6219794,39.2780174]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The mapped stadium building is multipolygon2304778, outerway24617369; the courtyardway93172473 is empty bowl space. The stadium leisureboundary1171329996 also encloses the completed North Plaza. Its west entertainment and east retail/hospitality buildings are original photo-estimated envelopes aligned to the mapped northsiteedge, not surveyed individual footprints. Four genuine upper-deck corner notches and four corner masonry/glass pavilions remain in far LOD. Photos6and7are September2026 completed-exterior views by KevinLynch (all rights reserved, comparison only);1is the earlier aerial used only for the unchanged main bowl and4confirms the motorway facade. Rejectedinterior5/8/9 are not exterior sources. The team confirms renovation completionAugust2026; future renderings were not treated as existing. Every exterior surface remains inside the declared mappedsite/building masks. Fieldgrass stands0.15m above rigidfooting y0; firstrow at1.98m includes thatdatum. Most vertical levels and fine member dimensions are photo estimates, while maximum185ft and standardfieldsize are published/mapped. No logos, words, branded signs, flags, statuary or adjacent viaduct. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 22930 triangles / 8 draws / 291796 bytes; far: 8442 triangles / 8 draws / 126432 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/mt-bank-stadium-baltimore.jpg and tmp/east/mt-bank-stadium-baltimore/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.
