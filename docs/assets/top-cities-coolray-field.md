# Gwinnett Field (formerly Coolray Field) — Lawrenceville

Gwinnett Field’s open baseball diamond, blue stepped infield grandstands, glazed upper suite ribbon, overlapping canopy roofs, masonry entry pavilion and tall floodlights. The 2026 name is used; all sponsor/team lettering and adjacent apartment buildings are excluded.

## Sources and rights

- [Current operator: Gwinnett Field identity and facts](https://www.milb.com/gwinnett/ballpark/gwinnett-field)
- [Completed outdoor grandstand — choking sun, CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Coolray_Field_2009.jpg)
- [Sponsor’s outdoor bowl photographs — Moore / Roughgarden, all rights reserved](https://www.coolray.com/community-involvement/professional-sporting-team/coolray-field)
- [Original exterior and overlapping roof study — Joe Mock, all rights reserved](https://baseballparks.com/indepth/gwinnett/)
- [Mapped playing-surface outline](https://www.openstreetmap.org/way/1139181940)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-83.99477385998628,34.03860704541502,-83.99000392001372,34.042559614584974)
- [OSM way 1139181941](https://www.openstreetmap.org/way/1139181941)

choking sun, Coolray Field 2009.jpg, CC BY-SA 2.0: completed outdoor stand, suite ribbon and roof. Coolray sponsor gallery views behind home plate and from the side, credited jointly by the page to Karl Moore and Chris Roughgarden, all rights reserved and used by the site with permission: two completed outdoor architectural views, comparison only here. Joe Mock, BaseballParks.com, all rights reserved: published original exterior/roof study consulted for overlapping-roof and entry arrangement. Under-construction photo and John Rocker portrait rejected. No photo, texture, screen content or third-party model redistributed.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/coolray-field/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-83.99295,34.04073]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Origin is near the mapped backstop; the home plate is estimated 12 m forward in the local field frame. Mapped foul-envelope controls [-83.991784,34.041065] and [-83.9926357,34.0400554] establish the east-southeast field axis, consistent with the original architectural description. +65° Y rotation is baked once. Seating follows the actual mapped inner grandstand boundary and is bounded by the outer building ring. OSM classifies a broad stadium envelope as building=stadium; open courts inside that envelope remain open rather than being extruded solid.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Playing-surface and building plan | Actual OSM rings | Mapped |
| Base-path length | 27.432 (90 ft) | Standard professional diamond, not a site survey |
| Seat tiers / upper suite / canopy | 0.8–10.8 / 11.5–18.8 / 20.3–21 | Photo estimates |
| Main entry pavilion / overlapping roofs | 13 / 16.7–18.2 | Photo estimates |
| Floodlight top | 34.9 | Photo estimate, no published structural height found |

The 2026 operator lists capacity 10,115 (updated 2024), while old pages state 10,427; these are contextual only and not used to claim modeled individual-seat counts. Field surface is y=0.15 m, at least 0.10 m above grade. Terrain berms, crowds, surrounding apartments and branded signs are omitted.

## Approximation and ownership

Gwinnett Field’s open baseball diamond, blue stepped infield grandstands, glazed upper suite ribbon, overlapping canopy roofs, masonry entry pavilion and tall floodlights. The 2026 name is used; all sponsor/team lettering and adjacent apartment buildings are excluded. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 1139181941; surrounding buildings, roads and site landscaping excluded.

## Verification

Exported both LODs; deterministic QA: no flags. Visual self-review: passed. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 9923 | 8 | 139040 |
| far | 3733 | 8 | 63740 |

Contact sheet inspected: `tmp/batch/sheets/coolray-field.jpg`. Metrics: `tmp/batch/coolray-metrics.json`. Top view checked against mapped footprint rings; exported far/dark sheet checked where recorded in batch state. Asset-specific tests, registry conformance, catalog validation and depth check passed. QA issues: [].
