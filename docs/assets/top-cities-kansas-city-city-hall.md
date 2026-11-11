# Kansas City City Hall

Kansas City’s limestone ArtDeco civic tower, with a six-storey base, continuous bronze window stacks, successive crown setbacks and an unflagged slender roofmast.

## Identity and sources

Current exterior at Kansas City, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Kansas_City_City_Hall)
- [Mapped replacement footprint 118650979](https://www.openstreetmap.org/way/118650979)
- [HistoricAmericanBuildingsSurvey: plan dimensions and sixstoreybase](https://tile.loc.gov/storage-services/master/pnp/habshaer/mo/mo0400/mo0440/data/mo0440data.pdf)
- [CTBUH:135m/443ft and30floors](https://www.skyscrapercenter.com/building/kansas-city-city-hall/12762)
- [Municipalhistory: Indiana limestone andArtDeco](https://www.kcmo.gov/home/showpublisheddocument/12644/638517986909100000)
- [File:Abraham Lincoln Kansas City City Hall Statue.jpg · JHawk88 · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_Kansas_City_City_Hall_Statue.jpg)
- [File:KC MO city hall.jpg · Enorton at English Wikipedia · GFDL](https://commons.wikimedia.org/wiki/File:KC_MO_city_hall.jpg)
- [File:Kansas City Missouri City Hall.jpg · KindaGuitarded · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Kansas_City_Missouri_City_Hall.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -94.577997,39.100569. Replacement OSM ways: 118650979. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Nominal masonryroof|135.0264| Published443ft, CTBUH135mrounded |
|Mast tip|144.0264|9mphotoestimate above nominalroof |
|Base plan|61.26×39.01published| HABS201×128ft; exact OSMoutline includes projections |
|Towerplan|37.6428×29.5656| HABS123.5×97ft |
|Base roof|26.8| Sixstoreys, photoestimate |
|Shoulders|113.5/122.4/133| Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][2] [-94.5782493,39.1007742] and LOCAL_RINGS[0][3] [-94.5782649,39.1004511]. The working-frame angle is atan2(Δsouth, Δeast) minus 90°; its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

Photos6and7show the full Missouri cityhall, while2confirms its lower limestone/glazing detail. Initialphoto3is a differentKansasCity(Kansas)cityhall and is rejected;4is a distant skyline and5a reliefdetail. HABS supplies the sixstoreybase and towerplan dimensions and describes bronze spandrels against Indiana limestone. Sources use29or30stories; this model records the distinction and does not claim a surveyedfloor schedule.443ft is adopted as nominalmasonryheight from CTBUH/roofaccounts; the HABS text refers to the upperfloor/observationdeck, so its exact relation to the currentroofdatum remains unverified. The visible plainroofmast is estimated9m; noflag authored. Mainstreetentryground datum is localrigidy0, while the actualplaza sits on a hill and was renovatedin2026; no plaza, lawn, steps, fountains, figurativefriezes, seals, lettering or trademarks are authored. Facade windows replace stone between continuouspiers; darkbronze spandrels and finalcrownwindows remain in farLOD. Laterappgrade/roofheightvalidation is required. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 4068 triangles / 5 draws / 53416 bytes; far: 3804 triangles / 5 draws / 50712 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/kansas-city-city-hall.jpg and tmp/east/kansas-city-city-hall/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Lightened the bronze floor spandrels to #aaa78f daylight / #84949e dark, retaining all 20 main-shaft rows. The 1.1788 m main separators exceed 0.65 m; weighted sRGB grayscale is over 40/255 above adjacent glass in both palettes, so the glazing reads as separated windows rather than dark stripes.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/kansas-city-city-hall.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
