# Cathedral Basilica of Saint Louis

Romanesque granite cathedral with twin green-tiled front spires, a broad green crossing dome, an open stone lantern, round apses and the large front rose window.

## Identity and sources

Current exterior at St. Louis, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Cathedral_Basilica_of_Saint_Louis)
- [Mapped replacement footprint 477985197](https://www.openstreetmap.org/way/477985197)
- [Mapped replacement footprint 617120621](https://www.openstreetmap.org/way/617120621)
- [Mapped replacement footprint 617120622](https://www.openstreetmap.org/way/617120622)
- [Mapped replacement footprint 617120623](https://www.openstreetmap.org/way/617120623)
- [Mapped replacement footprint 617120624](https://www.openstreetmap.org/way/617120624)
- [Mapped replacement footprint 617120625](https://www.openstreetmap.org/way/617120625)
- [Mapped replacement footprint 617120626](https://www.openstreetmap.org/way/617120626)
- [Mapped replacement footprint 617120627](https://www.openstreetmap.org/way/617120627)
- [Mapped replacement footprint 617223807](https://www.openstreetmap.org/way/617223807)
- [Municipal preservation dimensions (220 ft conflicts with other accounts)](https://dynamic.stlouis-mo.gov/history/structdetail.cfm?Master_ID=1345)
- [Cathedral owner: art and architecture](https://cathedralstl.org/art-and-architecture)
- [File:Cathedral Basilica of Saint Louis (St. Louis, MO) - exterior, quarter view 2.jpg · Nheyob (changes by Rabanus Flavus) · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cathedral_Basilica_of_Saint_Louis_(St._Louis,_MO)_-_exterior,_quarter_view_2.jpg)
- [File:Cathedral Basilica, St Louis 4028.jpg · QuartierLatin1968 · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Cathedral_Basilica,_St_Louis_4028.jpg)
- [File:St. Louis Cathedral exterior 2026b.jpg · Antony-22 · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:St._Louis_Cathedral_exterior_2026b.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -90.25472222,38.6425. Replacement OSM ways: 477985197,617120621,617120622,617120623,617120624,617120625,617120626,617120627,617223807. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Overall mapped plan|approx 110 × 65|OSM parent polygon, oblique frame|
|Dome shell / lantern and cross|64 / 69|Mapped part heights; 227 ft accounts agree approximately|
|Front bell towers|47|OSM parts, published 157 ft is 47.85 m|
|Main wall / pitched roofs|22 / 35|OSM parts, intermediate eaves estimated|
|Dome drum base / dome spring|45 / 55|Photo proportion estimates; mapped 39 / 47 m tags differ|

Mapped orientation controls are LOCAL_RINGS[6][0] [-90.2550307,38.6422587] and LOCAL_RINGS[6][1] [-90.2549458,38.6422404]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The mapped 22 m parent height describes the low walls, not the complete dome. OSM distinguishes a 47 m drum, 64 m green dome and 69 m lantern; 69 m is adopted as the estimated exterior tip datum. The green shell rise is adjusted to 9 m over a 55 m spring datum from exterior photo proportions; intermediate drum heights therefore depart from the mapped 47 m tag and are estimates. The municipal preservation record instead lists a 220 ft (67.06 m) dome and 380 × 212 ft overall dimensions, while other accounts list a 227 ft (69.19 m) dome and 365 × 204 ft plan: these discrepancies are unresolved and the model uses mapped plan geometry rather than rescaling it. Front towers use mapped 47 m, close to the published 157 ft (47.85 m). Photos 3, 5 and 6 were checked as current exterior forms; photos 1, 2 and 4 are interiors and were excluded. The main dome, arched drum windows, smaller open lantern and cross, twin open belfries with steep green pyramids, low rounded apses, front rose and nave roof remain in far detail. Granite carving, tile-by-tile relief and interior mosaics are abstracted. No words, logos, religious text, paving or terrain are baked; y=0 is the single rigid exterior footing plane. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 11135 triangles / 5 draws / 147564 bytes; far: 6792 triangles / 5 draws / 97584 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/cathedral-basilica-st-louis.jpg and tmp/east/cathedral-basilica-st-louis/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Nit: added a 0.30 m light-granite surround around the front rose as adjoining wall tiles, not an overlay. This strengthens the front stone-frame hierarchy while keeping the 3 m glass radius, gable, arched bays, broad green dome and open twin campaniles unchanged.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/cathedral-basilica-st-louis.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
