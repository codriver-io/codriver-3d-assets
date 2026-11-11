# Baltimore City Hall

Baltimore’s white Second Empire City Hall: symmetrical steep slate mansards, repeated round-headed windows, a true columned entrance and the tall ribbed cast-iron dome with its small open lantern and gold cap.

## Identity and sources

Current exterior at Baltimore, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Baltimore_City_Hall)
- [Mapped replacement footprint 453652415](https://www.openstreetmap.org/way/453652415)
- [Mapped replacement footprint 453652424](https://www.openstreetmap.org/way/453652424)
- [Mapped replacement footprint 453652416](https://www.openstreetmap.org/way/453652416)
- [Mapped replacement footprint 453652419](https://www.openstreetmap.org/way/453652419)
- [Mapped replacement footprint 453652427](https://www.openstreetmap.org/way/453652427)
- [Mapped replacement footprint 453652431](https://www.openstreetmap.org/way/453652431)
- [Mapped replacement footprint 453652418](https://www.openstreetmap.org/way/453652418)
- [Mapped replacement footprint 453652421](https://www.openstreetmap.org/way/453652421)
- [Mapped replacement footprint 453652422](https://www.openstreetmap.org/way/453652422)
- [Mapped replacement footprint 453652429](https://www.openstreetmap.org/way/453652429)
- [Mapped replacement footprint 453652430](https://www.openstreetmap.org/way/453652430)
- [Mapped replacement footprint 453652432](https://www.openstreetmap.org/way/453652432)
- [Mapped replacement footprint 453652411](https://www.openstreetmap.org/way/453652411)
- [Mapped replacement footprint 453652410](https://www.openstreetmap.org/way/453652410)
- [Mapped replacement footprint 453652409](https://www.openstreetmap.org/way/453652409)
- [Maryland Historical Trust: National Register inventory](https://apps.mht.maryland.gov/nr/NRDetail.aspx?NRID=164)
- [Baltimore Heritage:227ft cast-iron dome and mansard identity](https://baltimoreheritage.org/bbotw-city-hall/)
- [Historic City Hall construction account, published dimensions](https://www.seekingmyroots.com/members/files/H003679.pdf)
- [File:Baltimore City Hall Jan. 18, 2025.jpg · Jonmallard · CC BY 4.0](https://commons.wikimedia.org/wiki/File:Baltimore_City_Hall_Jan._18,_2025.jpg)
- [File:1city hall baltimore.jpg · Marylandstater · Public domain](https://commons.wikimedia.org/wiki/File:1city_hall_baltimore.jpg)
- [File:Baltimore City Hall-1.jpg · Smash the Iron Cage · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Baltimore_City_Hall-1.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -76.61069444,39.29086111. Replacement OSM ways: 453652415,453652424,453652416,453652419,453652427,453652431,453652418,453652421,453652422,453652429,453652430,453652432,453652411,453652410,453652409. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Dome finial height|69.1896| Historic227ft published, compared to current photos |
|Main plan|approximately75×47| ExactOSMparent; historical238ft×149ft varies by facade/projections |
|Main body/corner roof|25.7/33.3| Photo estimates |
|Central pediment peak|36.4| Photo estimate |
|Drum/dome shoulder/lantern|35–48.2/59.3/65.4| Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][0] [-76.6104933,39.2908145] and LOCAL_RINGS[0][1] [-76.6104855,39.2906921]. The working-frame angle is atan2(Δsouth, Δeast) minus 90°; its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The current January2025front and additional full exterior3 were verified against the same standing structure; reference5 is a plaque and is rejected as a geometry source. The published227ft(69.1896m) top and OSMpart74m disagree; this model adopts the published total and uses photo-estimated vertical subdivisions rather than claiming surveyed OSM heights. The75m mapped outside envelope includes corner projections; historical238ft×149ft refers to street fronts. The main entrance projection is hollowed into a real four-column portico; shallow entry steps sit above localfooting. Four steep slate corner roofs and smaller linking roofs retain dormers in both LODs. The tall drum has distinct glass lancets, the white dome has genuinely tiled circular oculi, and the upper lantern has open space between its columns. Every authored roof is fitted to its mapped component polygon. No city seal, words, flags or ornamental copyrighted imagery. y0 is the local rigid street-level footing plane, with no terrain baked. Both app modes require later datum verification. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 14030 triangles / 7 draws / 178284 bytes; far: 10348 triangles / 7 draws / 141256 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/baltimore-city-hall.jpg and tmp/east/baltimore-city-hall/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

The nested lantern/finial plans remain authoring controls and OSM ownership IDs; their masks are redundant inside the parent/dome masks. The tiny finial plan is under the registry’s4m² standalone polygon threshold.

## Independent review follow-up

Nit: gave the existing central portico platform/cornice and pediment face a distinct muted limestone tone (#b2b6a4 daylight) to strengthen the entrance hierarchy. Dome, lantern, mansards and all structural dimensions are unchanged.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/baltimore-city-hall.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
