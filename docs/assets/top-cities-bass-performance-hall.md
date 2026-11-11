# Bass Performance Hall — Fort Worth

1998 Bass Performance Hall: cream limestone grand facade, five tall arched windows, twin corner portal domes and two robed, winged angels playing projecting gold trumpets. Sculpture is original simplified geometry, with published full-size proportions.

## Sources and rights

- [Official venue: two 48 ft angels and interior 80 ft diameter dome](https://www.basshall.com/about/bass-performance-hall/)
- [Official facts: angel, wing and trumpet dimensions](https://www.basshall.com/media/qn4kusy4/bass-hall-facts.pdf)
- [Exterior and corner dome — Barera, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Fort_Worth_June_2016_49_(Bass_Performance_Hall).jpg)
- [Grand facade — Barera, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Fort_Worth_June_2016_55_(Bass_Performance_Hall).jpg)
- [Supplementary exterior — Hudson, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Bass_performance_hall_-_Fort_Worth_-_Texas_-_USA_-_panoramio.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-97.33235994301701,32.75294371541502,-97.32766005698299,32.756896284584975)
- [OSM way 483466355](https://www.openstreetmap.org/way/483466355)

Michael Barera, Fort Worth June 2016 49 and 55 (Bass Performance Hall), CC BY-SA 4.0: two verified completed exterior angles including both angels, corner domes and stage block. Dameon Hudson, Bass performance hall Fort Worth panoramio, CC BY 3.0: supplementary exterior. Photos are comparison-only; no sculpture mesh or texture imported or traced.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/bass-performance-hall/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-97.32981868333334,32.75484225]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Origin is the mapped building center. Controls [-97.3297285,32.7551222] and [-97.3301501,32.7549207] establish the 29.3° baked Y rotation. Front sculpture and trumpets project over the sidewalk as in the operator’s photos; their tips are not ground supports and do not claim road ownership. Complete provider building is way 483466355.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Building plan | about 61 × 61 | OSM |
| Stage block / grand facade | 31.5 / 29.5 | Photo estimates; no surveyed exterior height found |
| Angel height | 14.6304 (48 ft) | Official venue facts |
| Wing height / total width | 9.144 / 5.4864 (30 / 18 ft) | Official venue facts |
| Trumpet length | 3.9624 (13 ft) | Official venue facts |
| Corner dome / lantern top | 22 / 26.1 | Photo estimates |

OSM height=80 is inconsistent with the exterior photo proportions and the official 48-foot angels. It is not silently used as an 80 m building height. The operator’s 80 ft value refers to an interior dome diameter, not exterior height; 31.5 m is explicitly an estimate.

## Approximation and ownership

1998 Bass Performance Hall: cream limestone grand facade, five tall arched windows, twin corner portal domes and two robed, winged angels playing projecting gold trumpets. Sculpture is original simplified geometry, with published full-size proportions. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 483466355; surrounding buildings, roads and site landscaping excluded.

## Verification

Review revision, 2026-11-10: Rebuilt both angels as continuous fluted robes, shoulders, necks and modeled heads, with joined tapered sleeves, arms and hands holding each trumpet. Each has two broad closed feathered wings with scalloped tips and overlapping flight-feather relief in both LODs; frontal and oblique exported tiles show two distinct robed figures and open upper wing profiles. Tests measure 14.6304 m figures, 9.144 m wing height, 5.4864 m total wing width and 3.9624 m trumpets; added angelsFront and angelsOblique inspection views. The single fresh sheet passes self-review.

Standalone visual self-review passed; ready for independent re-review. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 22104 | 6 | 228616 |
| far | 7151 | 6 | 94256 |

One new exported contact sheet inspected: `tmp/batch/fixes/sheets/bass-performance-hall.jpg`. Reference images are fitted without cropping. Metrics: `tmp/batch/fixes/bass-performance-hall-metrics.json`; no flags. Asset-specific tests and depth check passed.
