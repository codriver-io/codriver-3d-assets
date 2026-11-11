# Royal National Theatre — London

National Theatre: Lasdun’s stepped concrete terraces, two differently oriented fly towers, recessed glazed foyers and roof service stacks on the South Bank.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Royal_National_Theatre)
- [Historic England: listed exterior, forty-five degree Olivier and layered foyers](https://historicengland.org.uk/listing/the-list/list-entry/1272324)
- [National Theatre archive: architectural history](https://artsandculture.google.com/story/VwWhA0PNKAUA8A)
- [OSM provider footprint / building part 150143253](https://www.openstreetmap.org/way/150143253)
- [OSM provider footprint / building part 150143254](https://www.openstreetmap.org/way/150143254)
- [OSM provider footprint / building part 150143256](https://www.openstreetmap.org/way/150143256)
- [OSM provider footprint / building part 150143258](https://www.openstreetmap.org/way/150143258)
- [OSM provider footprint / building part 150143259](https://www.openstreetmap.org/way/150143259)
- [OSM provider footprint / building part 150143262](https://www.openstreetmap.org/way/150143262)
- [OSM provider footprint / building part 319342616](https://www.openstreetmap.org/way/319342616)
- [OSM provider footprint / building part 319342617](https://www.openstreetmap.org/way/319342617)
- [OSM provider footprint / building part 319342619](https://www.openstreetmap.org/way/319342619)
- [OSM provider footprint / building part 319342620](https://www.openstreetmap.org/way/319342620)
- [OSM provider footprint / building part 319342621](https://www.openstreetmap.org/way/319342621)
- [OSM provider footprint / building part 319342622](https://www.openstreetmap.org/way/319342622)
- [OSM provider footprint / building part 319342623](https://www.openstreetmap.org/way/319342623)
- [OSM provider footprint / building part 319342624](https://www.openstreetmap.org/way/319342624)
- [OSM provider footprint / building part 319343598](https://www.openstreetmap.org/way/319343598)
- [OSM provider footprint / building part 319343599](https://www.openstreetmap.org/way/319343599)
- [OSM provider footprint / building part 319343600](https://www.openstreetmap.org/way/319343600)
- [OSM provider footprint / building part 319343601](https://www.openstreetmap.org/way/319343601)
- [OSM provider footprint / building part 319343644](https://www.openstreetmap.org/way/319343644)
- [File:Royal National Theatre, London (Southwest View - 01).jpg — Doyle of London; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Royal_National_Theatre,_London_(Southwest_View_-_01).jpg)
- [File:Royal National Theater.jpg — Mattsjc; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Royal_National_Theater.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/national-theatre-london/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.1167422,51.5052932,-0.1112578,51.5087068.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Olivier fly tower | 40.8 m | OSM height |
| Lyttelton fly tower | 32 m | OSM height |
| Major terrace levels | 6.5 / 10.5 / 14 / 18 / 21.5 / 24 / 26 m | Exact mapped parts |
| Roof service stacks | 28.4 / 32 m | Exact mapped parts |
| Small roof lantern | 24–27 m | OSM pyramidal3 m roof |

Origin `[-0.11405,51.50703]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped Lyttelton edge [-0.1143859,51.5067078] to [-0.114086,51.506812] and Olivier edge [-0.1139031,51.5071306] to [-0.1136667,51.5072154] bake in the site orientation and distinct tower plans. All19 provider parts are unioned by elevation; shared internal walls and hidden roof caps are discarded.

## Model and foundation

Original procedural exterior assembled from exact mapped concrete strata. Exterior walls are derived from the union of occupied parts in each height interval, retaining stepped roof terraces and the contrasting tower orientations. Lower foyers have recessed glass behind the terrace fascia with repeated adjacent concrete piers. Twin fly towers retain narrow board/joint bands in near and simplified horizontal rhythm in far. Four mapped service vents and the small pyramidal roof lantern remain on the skyline. Surrounding plaza, river, Waterloo Bridge, banners, lettering and temporary cranes are excluded.

All absolute heights are mapped estimates; published sources establish the form and orientation without a measured overall survey. Foyer setbacks, glazing bays, board joints and fascia depths are photo-calibrated estimates. This is the standing completed theatre envelope; no interior auditoria or surrounding pavement is authored.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 9162 | 5 | 128428 |
| far | 4556 | 5 | 72772 |

Deterministic QA: `tmp/batch/national-theatre-london-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/national-theatre-london.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/national-theatre-london/national-theatre-london-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/national-theatre-london/national-theatre-london-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The second keeps the fly towers solid down through the intersecting strata and limits upper terrace glazing to horizontal strips; lower foyer panes sit0.55 m behind actual jamb/soffit surfaces. The mapped19 parts and12 elevation intervals preserve the complete stepped silhouette in far. Temporary construction equipment, signs and artwork are excluded.
