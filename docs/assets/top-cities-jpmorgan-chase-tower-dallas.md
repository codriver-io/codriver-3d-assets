# Dallas Arts Tower (Chase Tower) — Dallas

1987 Dallas Arts Tower, historically Chase Tower: stepped granite-and-glass shaft, large open keyhole below a curved, split crown and projecting corner piers.

## Sources and rights

- [Wikipedia: 225 m roof, 55 storeys, current identity](https://en.wikipedia.org/wiki/Chase_Tower_(Dallas))
- [Full tower and keyhole — Nmajdan, CC BY-SA 2.5](https://commons.wikimedia.org/wiki/File:JPMorganChaseTower.png)
- [Street exterior — Connor Cunningham, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower_(Dallas)_from_below_2017_3.jpg)
- [Opposite street exterior — Connor Cunningham, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:JPMorgan_Chase_Tower_(Dallas)_from_Below_2017.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-96.79895081130374,32.78582371541502,-96.79424918869626,32.789776284584974)
- [OSM way 28781114](https://www.openstreetmap.org/way/28781114)

Nmajdan, JPMorganChaseTower.png, CC BY-SA 2.5: full exterior and keyhole. Connor Cunningham, JPMorgan Chase Tower (Dallas) from below 2017 3 and from Below 2017, CC BY-SA 4.0: street facades. Joe Mabel Museum Tower & JPMorgan Chase Tower, CC BY-SA 3.0: background context only, not the foreground Museum Tower. All comparison-only.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/jpmorgan-chase-tower-dallas/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-96.7966,32.7878]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Two mapped controls [-96.7967458,32.7876006] and [-96.7970016,32.7878206] establish the approximately 45° facade skew. The lower shaft uses the actual irregular OSM ring; the inverse rotation is applied before authoring upper parts, then +45° Y rotation baked once into the exported geometry. Upper crown centered at local oriented [10,-14].

| Feature | Metres | Basis |
| --- | ---: | --- |
| Roof height | 225 | Published and OSM |
| Lower plan envelope | about 70 × 49 | OSM |
| Keyhole width / bottom / lintel underside | 18 / 176 / 200 | Photo estimates |
| Crown spring / rise | 204 / 21 | Photo estimates |
| Crown central split | 3 | Photo estimate |

## Approximation and ownership

1987 Dallas Arts Tower, historically Chase Tower: stepped granite-and-glass shaft, large open keyhole below a curved, split crown and projecting corner piers. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 28781114; surrounding buildings, roads and site landscaping excluded.

## Verification

Review revision, 2026-11-10: Added keyhole and keyholeFacade inspection cameras normal to the baked facade, showing the open sky-window and curved split crown in both exports; nine rays at local X=2,10,18 m and Y=180,188,196 m clear the opening. The one new sheet now uses a fitted complete crown photograph (Nmajdan, CC BY-SA 2.5) and matching feature-facing near/far tiles; geometry is unchanged.

Standalone visual self-review passed; ready for independent re-review. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 21558 | 3 | 257852 |
| far | 7162 | 3 | 91252 |

One new exported contact sheet inspected: `tmp/batch/fixes/sheets/jpmorgan-chase-tower-dallas.jpg`. Reference images are fitted without cropping. Metrics: `tmp/batch/fixes/jpmorgan-chase-tower-dallas-metrics.json`; no flags. Asset-specific tests and depth check passed.
