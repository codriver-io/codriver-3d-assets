# Bahá’í House of Worship

Nine-sided white temple with tall pylons, a tiered arched base and a ribbed, perforated lace dome; original simple fretwork retains real openings at near and far detail.

## Identity and sources

Current exterior at Wilmette, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Baháʼí_House_of_Worship_(Wilmette,_Illinois))
- [Mapped replacement footprint 369160462](https://www.openstreetmap.org/way/369160462)
- [Mapped replacement footprint 1285270362](https://www.openstreetmap.org/way/1285270362)
- [Mapped replacement footprint 1290674931](https://www.openstreetmap.org/way/1290674931)
- [Original 1953 booklet: dimensional table, final page](https://file.bahai.media/8/8d/The_Bahai_House_of_Worship_1953.pdf)
- [Temple owner and current identity](https://www.bahai.us/bahai-temple-welcome/bahai-temple/)
- [File:Baha'i Temple - Wilmette, IL.jpg · Wenbinbin2010 · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Baha%27i_Temple_-_Wilmette,_IL.jpg)
- [File:Baha'i Temple at Dusk.jpg · MichaelDPhotos · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Baha%27i_Temple_at_Dusk.jpg)
- [File:WilmetteTempleDome.jpg · Self-created photograph by Jonathunder · GFDL](https://en.wikipedia.org/wiki/File:WilmetteTempleDome.jpg)
- [File:Baha'i Temple WikiP-1.jpg · Scheueja · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Baha%27i_Temple_WikiP-1.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -87.6842935,42.0744343. Replacement OSM ways: 369160462,1285270362,1290674931. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Main floor to dome-rib tip|50.292|Original 1953 booklet: 165 ft|
|Main floor above local footing|3.6|Photo estimate; no terrain baked|
|Overall model tip|53.892|50.292 + estimated 3.6 footing offset|
|Dome outside diameter / rise|27.432 / 14.9352|1953 booklet: 90 / 49 ft|
|Mainstory pylon above main floor|13.716|1953 booklet: 45 ft|
|Circular platform above stairs|46.3296 diameter|1953 booklet: 152 ft; model retains mapped building outline rather than inventing a full platform|

Mapped orientation controls are LOCAL_RINGS[1][0] [-87.6841179,42.0744167] and LOCAL_RINGS[1][1] [-87.6841366,42.0743733]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The original 1953 publication distinguishes 191 ft from basement floor, 165 ft from main floor to dome ribs and 138 ft from main floor to the interior dome apex. The often-repeated 42 m and OSM dome height of 42 m correspond approximately to the 138 ft interior dimension and are not adopted as exterior total height. The model uses 165 ft plus a photo-estimated 3.6 m visible footing-to-main-floor offset; total height 53.892 m remains an estimated ground datum, not a surveyed one. Other intermediate gallery datums are photo estimates. OSM parent and two parts control the nine-sided/scalloped plan and dome location; a line between mapped dome vertices controls the baked rotation. All four photos were checked as exterior views of this temple. The white dome has nine ribs and original simplified repeated diamond perforations over recessed plain glazing; its surface is not a copied ornament pattern or traced image. Near and far keep the ninefold rhythm, true holes and raised pylon capitals. The original 30% perforation figure informs the approximate panel open area. Gardens, reflecting pools, paving, detached welcome centre, symbols and text are omitted. y=0 is the rigid exterior footing plane; the lower plinth stays within the mapped building rather than adding a terrain-shaped platform. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 24552 triangles / 5 draws / 403296 bytes; far: 11020 triangles / 5 draws / 176688 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/bahai-house-worship-wilmette.jpg and tmp/east/bahai-house-worship-wilmette/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Restored two middle-tier window rows in far, y=18–23.4 m and 24–29.4 m, separated by 0.6 m of opaque stone. Near uses the same separated rhythm. The far dome retains nine ribs and real perforations with four instead of five vertical lace rows to fund the window correction within the 12,000-triangle budget.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/bahai-house-worship-wilmette.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
