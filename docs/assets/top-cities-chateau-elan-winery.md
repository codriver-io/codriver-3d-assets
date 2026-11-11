# Château Élan Winery — Braselton

French-inspired winery chateau, with three steep truncated pyramid roofs, small open roof rails, flagpoles without flags, pale stone paired windows, front arcade and dormered connecting roof; the adjoining production wing keeps its low roof.

## Sources and rights

- [Current winery operator](https://chateauelan.com/winery/)
- [Vineyard-side exterior — Bruce Tuten, CC BY 2.0](https://commons.wikimedia.org/wiki/File:American_winery_Chateau_Elan.jpg)
- [2024 Chateau Elan PR aerial — Orlando Magazine](https://www.orlandomagazine.com/escape-to-georgias-chateau-elan-for-a-luxurious-getaway/)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-83.82101720945921,34.09852236758894,-83.81624389488861,34.102474936758895)
- [OSM way 627633670](https://www.openstreetmap.org/way/627633670)

Bruce Tuten vineyard exterior (CC BY 2.0) and Chateau Elan PR aerial published in December 2024 Orlando Magazine (all rights reserved, comparison-only) were inspected; both show the same three-roof winery mass. The resort hotel and spa photographs were excluded. Current operator site reserves all rights; no media license was accepted. Pat’s 2004 exterior page was contextual only because its image download failed.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/chateau-elan-winery/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-83.81863,34.1005]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Controls [-83.8185879,34.1001229] to [-83.8185413,34.1001175] and the long eastern edge establish -8 degrees Y. Front faces the mapped fountain to the east-southeast; the model keeps the OSM L-shaped winery plan. No fountain, vineyard, hotel or separate neighboring building claimed.

OSM envelope roughly 52 by 95 m including the production wing; winery corner roof bases 21 by 21 m, masonry eave 11.8 m, steep roof top 24.4 m, rail top 25.2 m and bare mast top 29.5 m are photo estimates, not published elevations. Main connecting roof ridge 17.4 m. Roof slopes and three roof masses retained in far LOD.

## Approximation and ownership

French-inspired winery chateau, with three steep truncated pyramid roofs, small open roof rails, flagpoles without flags, pale stone paired windows, front arcade and dormered connecting roof; the adjoining production wing keeps its low roof. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 627633670; surrounding buildings, roads and site landscaping excluded.

## Verification

Review revision, 2026-11-10: Reduced far geometry from 6,037 to 2,593 triangles by halving facade subdivisions, removing subpixel window trim and simplifying roof-rail balusters. Both facade floors remain separate window rows; all three steep roof pavilions, dormers and open arcade survive the matched near/far sheet.

Standalone visual self-review passed; ready for independent re-review. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6301 | 7 | 88200 |
| far | 2593 | 7 | 46764 |

One new exported contact sheet inspected: `tmp/batch/fixes/sheets/chateau-elan-winery.jpg`. Reference images are fitted without cropping. Metrics: `tmp/batch/fixes/chateau-elan-winery-metrics.json`; no flags. Asset-specific tests and depth check passed.
