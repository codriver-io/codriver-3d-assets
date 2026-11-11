# Astrodome (Reliant Astrodome) — Houston

Current circular Astrodome shell, after removal of the external ramp towers: a broad pale drum, 72 tapered perimeter ribs, continuous dark upper glazing, shallow gray dome with alternating radial roof bands, and small central weather station. Proposed reuse schemes and historic ramp towers are excluded.

## Sources and rights

- [National Register nomination, exterior and historic elevation pp 7–8,37](https://atlas.thc.texas.gov/NR/pdfs/13001099/13001099.pdf)
- [Conservancy: current state and interior clear-span dimensions](https://astrodomeconservancy.org/whats-next/)
- [Texas State Historical Association: interior height and history](https://www.tshaonline.org/handbook/entries/astrodome)
- [Completed post-ramp-removal exterior — EricEnfermero, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Reliant_Astrodome_in_January_2014.jpg)
- [Distinct completed aerial exterior — US CBP, public domain](https://commons.wikimedia.org/wiki/File:NRG_Stadium,_Houston,_Texas,_United_States.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-95.41005261063854,29.68302371541502,-95.40550294936146,29.68697628458498)
- [OSM way 119420928](https://www.openstreetmap.org/way/119420928)

EricEnfermero January 2014 exterior (CC BY-SA 3.0) and US CBP aerial exterior (public domain, shared park reference) were inspected. The edited 2014 b image is the same exposure and not counted as a second photo. Mark Hodgins 2009 and Michael Martin 2012 exteriors show the removed ramp cylinders; they are historical context only. 1965 photograph and 1969 scoreboard are not current exterior evidence. National Register PDF elevation was rendered and visually inspected; no drawing traced or redistributed.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/astrodome/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-95.407742194094,29.684871425806]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Origin is a least-squares circle fit of the mapped 76-vertex envelope, rather than the article’s offset coordinate. Radius fit 109.06 m; nominal drum/ribs approximately 107/108 m retains the mapped plan. Park-grid controls [-95.4113732,29.6860323] to [-95.4102838,29.6860559] on adjacent stadium way 119422708 establish +1.4 degrees Y for entrances and radial panel orientation. The main circular shell is rotation-invariant. y=0 is exterior rigid grade; no negative playing-field excavation or terrain baked in.

Published outside diameter 710 ft = 216.408 m, clear span 642 ft = 195.682 m. Conservancy and TSHA describe 208 ft (63.3984 m) interior height; the National Register text also gives 208 ft at the roof peak and a floor 25 ft below grade, without a fully consistent datum. This model uses estimated exterior height 183 ft = 55.7784 m (208 minus 25), checked against the historic elevation and completed photos, rather than treating interior height as above grade. OSM total 66.4 m and roof 28.3 m differ. Drum/glazing tops 25.5/31.8 m, dome apex 55.3 m and weather station 55.7784 m are explicitly estimated exterior elevations.

## Approximation and ownership

Current circular Astrodome shell, after removal of the external ramp towers: a broad pale drum, 72 tapered perimeter ribs, continuous dark upper glazing, shallow gray dome with alternating radial roof bands, and small central weather station. Proposed reuse schemes and historic ramp towers are excluded. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 119420928; surrounding buildings, roads and site landscaping excluded.

## Verification

Exported both LODs; deterministic QA: no flags. Visual self-review: passed. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 10304 | 6 | 144240 |
| far | 4484 | 6 | 73428 |

Contact sheet inspected: `tmp/batch/sheets/astrodome.jpg`. Metrics: `tmp/batch/astrodome-metrics.json`. Top view checked against mapped footprint rings; exported far/dark sheet checked where recorded in batch state. Asset-specific tests, registry conformance, catalog validation and depth check passed. QA issues: [].
