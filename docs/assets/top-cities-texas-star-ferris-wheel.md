# Texas Star — Dallas

Texas Star at Fair Park: open double-rim wheel, 44 hanging multicolour gondolas, pale-blue A-frame supports and a small white hub star. No ride lettering, fairground logos or scene terrain.

## Sources and rights

- [State Fair: 212 ft 6 in, 44 gondolas and hub character](https://bigtex.com/texas-star-lights-up-the-skies-around-fair-park/)
- [Current ride operator: over 212 ft](https://talleyamusements.com/attraction/texas-star/)
- [OSM wheel point](https://www.openstreetmap.org/node/5205613509)
- [Mapped site alignment: The Midway](https://www.openstreetmap.org/way/10012251)
- [Exterior structure — 17Shamrocks, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Texas_Star,_Fair_Park.jpg)
- [Exterior wheel — Terry Shuck, CC BY 2.0](https://commons.wikimedia.org/wiki/File:Texas_Star_Black_and_White_2007.jpg)
- [Exterior wheel — Praefcke, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Texas_State_Fair_Texas_Star.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-96.76161951902323,32.774761715415025,-96.75691848097678,32.77871428458498)

17Shamrocks, Texas Star Fair Park, CC BY-SA 4.0; Terry Shuck, Texas Star Black and White 2007, CC BY 2.0; Andreas Praefcke, Texas State Fair Texas Star, CC BY 3.0. All verified exterior views of this wheel. Older white support paint is treated as historical; muted blue supports follow the contemporary comparison and documented 2016 repaint.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/texas-star-ferris-wheel/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-96.7592667,32.7767789]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Wheel center uses OSM node 5205613509. Nearby Midway controls [-96.759344,32.777204] and [-96.758909,32.776837] establish the NW–SE site axis; the wheel plane is authored parallel to this axis, a photo-based alignment estimate rather than a surveyed support baseline. Rotation -45° Y is baked once. No provider building occupies the wheel; FOOTPRINTS and OSM_WAYS are empty and footprintless is explicit. The top view verifies the open support arrangement; no fictitious replacement ring is supplied.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall modeled height | 64.77 | Operator’s 212 ft 6 in rounded |
| OSM height / Wikipedia height | 64.6 / 65.8 | Conflicting published values; not treated as surveyed |
| Rim radius / axle height | 29.5 / 35.02 | Photo-based subdivision of the published envelope |
| Gondolas | 44 | Operator |
| A-frame feet | ±17 lateral, ±7.5 depth | Photo estimate |
| Cab body and suspension | about 2.1 × 2.4 × 1.5 | Photo estimates |

## Approximation and ownership

Texas Star at Fair Park: open double-rim wheel, 44 hanging multicolour gondolas, pale-blue A-frame supports and a small white hub star. No ride lettering, fairground logos or scene terrain. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways ; surrounding buildings, roads and site landscaping excluded.

## Verification

Exported both LODs; deterministic QA: no flags. Visual self-review: passed. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 8128 | 8 | 96796 |
| far | 4752 | 8 | 70760 |

Contact sheet inspected: `tmp/batch/sheets/texas-star-ferris-wheel.jpg`. Metrics: `tmp/batch/texas-star-metrics.json`. Top view checked against mapped footprint rings; exported far/dark sheet checked where recorded in batch state. Asset-specific tests, registry conformance, catalog validation and depth check passed. QA issues: [].
