# Civil Courts Building

Limestone courthouse tower with recessed columned entrances, a 32-column upper temple, stepped gray pyramid and two original simplified winged griffins at its summit.

## Identity and sources

Current exterior at St. Louis, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Civil_Courts_Building)
- [Mapped replacement footprint 565578443](https://www.openstreetmap.org/way/565578443)
- [Mapped replacement footprint 565578444](https://www.openstreetmap.org/way/565578444)
- [Municipal architectural record](https://dynamic.stlouis-mo.gov/history/structdetail.cfm?Master_ID=2090)
- [Law Library Association: temple, pyramid and griffin reference](https://llastl.org/blog/law-librarys-home-civil-courts-building)
- [CTBUH: 117.7 m / 386 ft](https://www.skyscrapercenter.com/building/civil-courts-building/14629)
- [Local legal account: column and griffin dimensions](https://simonlawpc.com/blog/legal-news-updates/st-louis-civil-courts-building/)
- [File:2010-07-04 1960x2940 stlouis civil courts building.jpg · J. Crocker · Attribution](https://commons.wikimedia.org/wiki/File:2010-07-04_1960x2940_stlouis_civil_courts_building.jpg)
- [File:St. Louis Civil Courts Building rear facade.jpg · Triciaburmeister · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:St._Louis_Civil_Courts_Building_rear_facade.jpg)
- [Upper part of Civil Courts Building, Missouri Historical Society via Law Library Association · Photographer unspecified; historical photograph; rights not stated, treated as all rights reserved for comparison only](https://llastl.org/blog/law-librarys-home-civil-courts-building)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -90.1972,38.6276. Replacement OSM ways: 565578443,565578444. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Overall tip|117.6528|386 ft published; CTBUH rounds to 117.7 m|
|Mapped main body / crown plan|approx 49 × 42 / 34.5 × 28|OSM control polygons|
|Upper columns|12.8016 high; 1.6764 diameter|Published 42 ft / 5.5 ft|
|Crown platform / entablature / pyramid top|88.5 / 103.8 / 114|Photo estimates|
|Griffin height|3.6528|Approximately published 12 ft; top retained within total height|

Mapped orientation controls are LOCAL_RINGS[1][0] [-90.197348,38.627736] and LOCAL_RINGS[1][3] [-90.1969674,38.6276498]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The OSM 100 m main-part and 118 m crown heights describe simplified massing; the model adopts published 386 ft (117.6528 m) overall height and estimates intermediate floors and crown datums from photos. The public Law Library Association photograph verifies the stepped pyramid, Ionic capitals, recessed upper windows and paired winged griffins; it is a historical detail reference, rights unstated and conservatively treated as all rights reserved, while exterior photos 1 and 2 verify the current building form. The 32 upper columns are separate supports around an inset library core; the colonnade remains open at both LODs. The pyramid uses sixteen steps and the paired summit figures are original simple body, head and wing volumes, with no copied sculpture mesh or image tracing. Small relief carving and inscriptions are omitted. The building is currently officially named Clyde S. Cahill Courts Building; the historic Civil Courts name is retained as the familiar landmark identity. No forecourt, words, logos or terrain; y=0 is the rigid exterior footing plane. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 10342 triangles / 6 draws / 140452 bytes; far: 7210 triangles / 6 draws / 102948 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/civil-courts-building-st-louis.jpg and tmp/east/civil-courts-building-st-louis/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Narrowed every main-shaft glass opening to 1.4091 m wide at its existing 3.1 m height, a 2.2:1 height/width ratio in both LODs. Separate rows and bays, the 32-column temple, stepped pyramid and paired griffins are retained.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/civil-courts-building-st-louis.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
