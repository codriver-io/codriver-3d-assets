# St. Louis Union Station

StLouis’s long Romanesque station headhouse, three red-tiled hipped pavilions, turreted east clocktower and open column-supported train-shed canopies behind.

## Identity and sources

Current exterior at St. Louis, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/St._Louis_Union_Station)
- [Mapped replacement footprint 108705187](https://www.openstreetmap.org/way/108705187)
- [Municipalpreservation:230ftclocktower](https://dynamic.stlouis-mo.gov/history/structdetail.cfm?Master_ID=1335)
- [Municipalpreservation:threepavilions andeastclocktower](https://dynamic.stlouis-mo.gov/history/eventdetail.cfm?Master_ID=244)
- [Municipalarchitecturaldescription](https://www.stlouis-mo.gov/government/departments/planning/cultural-resources/preservation-plan/The-Victorian-City-Transportation-Structures.cfm)
- [ASCE:232ftclocktower](https://www.asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/union-station/)
- [Restorationengineering article: conflicting280ft](https://www.icri.org/wp-content/uploads/2024/04/CRBNovDec10_StLUnionStation.pdf)
- [File:St. Louis Union Station - tower from northeast (2025).jpg · Steve Morgan · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station_-_tower_from_northeast_(2025).jpg)
- [File:St. Louis Union Station, Market Street, St. Louis, MO - 53050964105.jpg · w_lemay · CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:St._Louis_Union_Station,_Market_Street,_St._Louis,_MO_-_53050964105.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -90.20763,38.62923. Replacement OSM ways: 108705187. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Clocktower/attachedturret tip|70.104| Municipal230ft adopted; ASCE232ft and other published280ft disagree |
|Mapped overallcomplex|approx230×320| OSM108705187 oblique frame |
|Mainhall roof/hotelroof|36/33| Photo estimates |
|Clockshaft/belfry/upperroom|54/57.5/61| Photo estimates |
|Rearcanopies|9–16| Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][0] [-90.2091076,38.6296763] and LOCAL_RINGS[0][177] [-90.2086338,38.6295771]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The municipalpreservationrecord gives230ft for the eastclocktower; ASCEgives232ft, while restoration andotheraccounts give280ft. This model adopts the municipal230ft(70.104m) and records the unresolved discrepancy rather than claiming a survey. Current2025towerphoto2and MarketStreetfront3were checked;1and4are interior/train references, not exterior massing sources. The three headhousepavilions, hippedredroofs, pairedfrontturrets, tallclockshaft and small attached octagonal turret are retained. The exact unifiedOSMbuilding includes the long train-shed complex; its rear canopies are a deliberately simple open structural abstraction with grounded posts and closed thin roofs, not a giant solidbox. Currentaquariuminteriors, rides, detachedrestaurants, forecourts and figurativeornament are outside this sourceasset. Clock faces are procedural unnumbered disks; no words, signs, logos, flags orreferenceimagery. y0 is a single rigidexteriorfooting plane; no terrainbaked and bothappmodesuntested. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 26001 triangles / 7 draws / 311916 bytes; far: 8204 triangles / 7 draws / 119520 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/st-louis-union-station.jpg and tmp/east/st-louis-union-station/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Added tiled contrasting hands to all four 1.9 m-radius clock dials: 0.9 m hour hand, 1.4 m minute hand, both 0.16 m wide, with 12 ticks near and four far. The hands and ticks replace holes in the dial polygons on the same plane, so there are no overlapping dial faces or depth offsets. Both LODs keep readable unnumbered clocks.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/st-louis-union-station.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
