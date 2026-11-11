# Toronto Ontario Temple

Brampton’s white temple with rounded blind facade panels, a low open colonnade, one tiered central needle and a small gold trumpet figure.

## Identity and sources

Current exterior at Brampton, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Toronto_Ontario_Temple)
- [Mapped replacement footprint 33193255](https://www.openstreetmap.org/way/33193255)
- [Temple owner: Toronto Ontario Temple](https://www.churchofjesuschrist.org/temples/details/toronto-ontario-temple?lang=eng)
- [File:Toronto temple2.jpg · Ricardo630 · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Toronto_temple2.jpg)
- [File:Toronto temple1.jpg · Ricardo630 · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Toronto_temple1.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -79.746059,43.744338. Replacement OSM ways: 33193255. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
|---|---|---|
| Spire and gold figure |52.1208| Published171ft; not a survey |
| Main body |61×47 approximately| Mapped footprint |
| Body/parapet |11.8| Photo estimate |
| Open portico underside |4.8| Photo estimate |
| Central arch header |13.8| Photo estimate |

Mapped orientation controls are LOCAL_RINGS[0][6] [-79.746083,43.744577] and LOCAL_RINGS[0][7] [-79.745615,43.744573]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The171ft published height is used to scale the single stepped spire. Photos2 and3 show opposite facades of the current exterior; the Salt Lake City statue returned as photo1 was rejected. White rounded blind panels remain opaque above lower dark glazing. The entrance arch and low colonnades are actual voids, with glazing recessed to the main wall. The small gold figure includes a robe, head, bent arm and flared trumpet; signs and lettering are omitted. White footing plane y0 requires later app datum verification. Other dimensions are photo estimates. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 3862 triangles / 6 draws / 53584 bytes; far: 2212 triangles / 6 draws / 37856 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/toronto-ontario-temple-brampton.jpg and tmp/east/toronto-ontario-temple-brampton/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.
