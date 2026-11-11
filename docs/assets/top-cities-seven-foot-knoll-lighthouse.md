# Seven Foot Knoll Lighthouse

The relocated red circular screw-pile lighthouse at Pier5: nine exposed piles and cross braces, a ring balcony, white windows with green shutters, a low conical black roof and its small raised light chamber.

## Identity and sources

Current exterior at Baltimore, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Seven_Foot_Knoll_Light)
- [Mapped replacement footprint 178328407](https://www.openstreetmap.org/way/178328407)
- [Maryland HistoricalTrust: dimensions of relocated lighthouse](https://apps.mht.maryland.gov/medusa/PDF/NR_PDFs/NR-1040.pdf)
- [USCoastGuard:40ft above mean high water while onstation](https://www.history.uscg.mil/Browse-by-Topic/Assets/Land/All/Article/2009020/seven-foot-knoll-light/)
- [Current museum owner: SevenFootKnoll](https://historicships.org/explore/sevenfootknoll-lighthouse)
- [File:The Seven Foot Knoll Light at the south end of Pier 5.jpg · Richard N Horne · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:The_Seven_Foot_Knoll_Light_at_the_south_end_of_Pier_5.jpg)
- [File:Seven Foot Knoll Light exterior construction.jpg · TheCrazedBeast · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Seven_Foot_Knoll_Light_exterior_construction.jpg)
- [File:Seven Foot Knoll Light, Baltimore, Maryland.JPG · Rizka · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Seven_Foot_Knoll_Light,_Baltimore,_Maryland.JPG)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -76.6053511,39.2835825. Replacement OSM ways: 178328407. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Living cylinder diameter|12.192| NationalRegister40ft |
|Exterior platform diameter|15.5448| NationalRegister51ft; mapped15.6m |
|Upper red story/light chamber diameters|4.572/1.8288| NationalRegister15ft/6ft |
|Ground-to-finial|12.4| Current relocated-setting photo estimate; OSM12mrounded |
|Platform floor|3.9| Photo estimate above current localground |

Mapped orientation controls are LOCAL_RINGS[0][0] [-76.6053446,39.2835124] and LOCAL_RINGS[0][9] [-76.6054379,39.283562]. The circular envelope centre is computed from the full mapped ring; the first ring vertex fixes the house-panel phase relative to that centre. The controls and the remaining ring vertices establish its geographic frame; the radial structure has no extra runtime yaw.

## Modelling and limits

The Wikipedia article contains both current and original offshore coordinates. This asset is at the mapped Pier5 circle, centered−76.6053511,39.2835825; it is not the former Patapsco offshore site. The CoastGuard40ft value is height above mean high water when on station, not a surveyed current ground height. Current12.4m is an estimate consistent with OSM12m and the relocated exterior photos. The historical1900photo1 is not a current geometry/paint reference; current2and5 show the red dwelling, black framing and land-based supports, while3confirms green shutters and white frames. The measured51ftplatform and40ftdwelling diameters are retained. An estimated switchback access stair is aligned east from the mapped circular frame, enclosed by a separately authored component mask; it is not claimed as a surveyed OSM stair. Both LODs keep the raised underside open, nine load-bearing piles, actual diagonal braces, hollow balcony rails and glazed upper light chamber. The historic pier plinth, pavement and surrounding water are not authored. Feet are at rigidlocaly0; later appgrounddatum verification is required. No lettering, plaques or lens texture. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 3796 triangles / 7 draws / 60796 bytes; far: 2796 triangles / 7 draws / 48636 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/seven-foot-knoll-lighthouse.jpg and tmp/east/seven-foot-knoll-lighthouse/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Recalibrated the iron-red dwelling and raised drum to muted #843936 in daylight and #6d3334 at night. Dark roof, pale frames, green shutters, piles and stair geometry are retained.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/seven-foot-knoll-lighthouse.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
