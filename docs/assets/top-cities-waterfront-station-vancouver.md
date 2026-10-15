# Waterfront Station, Vancouver

Original procedural reconstruction of the present 1914 Canadian Pacific station at 601 West Cordova Street. Its identity is the long white Ionic screen on dark red brick, arched lower windows, symmetrical wings and level cornice with a raised central parapet. The attached rear circulation roof is included; the SeaBus bridge beyond that footprint and distant rail platforms remain outside this asset.

## References and dimensions

- [Vancouver Heritage Foundation](https://www.heritagesitefinder.ca/location/601-w-cordova-st-vancouver-bc): Barott, Blackader and Webster, 1912–1914; ten giant-order freestanding Ionic columns.
- [RJC Engineers](https://www.rjc.ca/project-details/the-station.html): four-storey steel building, brick and ornamental terracotta, circa 1913.
- [Wikipedia](https://en.wikipedia.org/wiki/Waterfront_station_(Vancouver)): CPR station opened August 1, 1914; red-brick neoclassical facade.
- [OSM headhouse 78393326](https://www.openstreetmap.org/way/78393326), [attached rear circulation 208599561](https://www.openstreetmap.org/way/208599561): supplied dossier geometry and headhouse height tag.
- Commons photographs: *Waterfront station 2025.jpg*, Canmenwalker, CC BY 4.0 (street facade); *Waterfront station track and bridge to seabus 2026.JPG*, Canmenwalker, CC BY 4.0 (rear railway context); *Waterfront Station Vancouver 1923.jpg*, Major James Skitt Matthews, public domain (elevated whole-building proportions). Full links/credits are in the catalog record. These are visual references only, stored in ignored tmp; no photographs/textures ship.

| Feature | Model | Evidence |
| --- | --- | --- |
| Highest parapet | 23 m | OSM height=23; tag, not a survey |
| Storeys | Four-storey facade hierarchy | RJC / OSM building:levels=4 |
| Front envelope | Approximately 118 m | OSM two street-facing corners |
| Cordova facade axis | 135.2° true | Two mapped controls; facing 225.2° |
| Ionic shafts | 10 freestanding | Vancouver Heritage Foundation; engaged end pilasters simplified |
| Shaft / capital heights | 1.15–14.1 m | Estimated from photographs |
| Column spacing / diameter | 5.7 m / about 1.4 m | Estimated from photograph proportions |
| Loggia depth | 3.5 m | Estimated, inside mapped front projection |
| Lower arches / attic windows | 8.5–8.6 m / 3.1 m | Estimated |
| Rear canopy roof | 6.7 m | Estimated; plan follows complete OSM annex |

## Frame and provider ownership

Real metres, east/up/south, origin `[-123.11167, 49.28583]`, y=0 rigid Cordova pavement. The facade-frame rotation of 45.2° is baked into source geometry and GLBs once. Controls are `[-123.1122651,49.2858456]` and `[-123.111367,49.2852555]`. The rail face tapers diagonally rather than copying a rectangular footprint. Exactly OSM ways 78393326 and 208599561 are replaced; adjacent office towers and the detached over-track bridge are not owned. Cornices project slightly beyond the walls, within a documented 1.5 m envelope tolerance.

## Modelling and materials

Seven batched materials in both LODs: subdued dark red `brick`, warm pale `stone` terracotta, grey `base`, muted `roof`, dark blue-grey `glass`, dark `metal`, and lower entrance `glow` (warm at night). Punched arches and rectangular windows provide actual reveal depth. Ten entasis shafts have paired Ionic volutes and square abaci; the screen remains open in far. Repeated elements merge by material. Far keeps the full window bay grid, column count, capitals, roofline and annex, using fewer arch/shaft segments and omitting mullions, arch trims, sill details and dentils. The canopy perimeter has continuous glazing and posts down to its base.

Estimates: detailed moulding profiles, arch counts, rooflights and low annex elevations. No interiors, figurative relief, small shop signs, flags, street furniture or off-footprint transport infrastructure. The rear is inferred chiefly from mapped plan and elevated historical reference; this is not a survey reconstruction.

## Verification

Exported default-scene costs:

| LOD | Triangles | Draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| Near | 14,762 | 7 | 815,968 | 797 |
| Far | 5,706 | 7 | 366,432 | 358 |

Far is 39% of near triangles and has identical bounds. Both are below all building budgets.

Screenshots judged under `tmp/top-cities/shots/waterfront-station-vancouver/` (ignored local evidence):

- `reference-comparison.jpg`: the credited 2025 street facade and 1923 elevated photograph beside exported near/far light/dark facades, near colonnade detail, rear and roof.
- `waterfront-station-vancouver-glb-near-light-sheet.jpg`: overview, facade, street, colonnade, rear, roof.
- `waterfront-station-vancouver-glb-far-light-sheet.jpg`: overview, facade, rear, roof.
- `waterfront-station-vancouver-glb-near-dark-sheet.jpg` and `waterfront-station-vancouver-glb-far-dark-sheet.jpg`: overview, facade, colonnade, rear.
- `waterfront-station-vancouver-glb-near-light-top.png`: mapped footprint alignment and attached circulation outline.
- `waterfront-station-vancouver-procedural-near-light-sheet.jpg`: overview, colonnade, rear, roof; source and export agree visually.

The first visual review changed the brick from a lighter rusty brown to subdued dark red-brown. Geometry/depth review split the rear/side walls around their stone bands, removed buried roof undersides and canopy-glass horizontal caps, and seated the roof against the attic interior; final depth generation reports **zero cycle edges dropped**. Final deterministic QA reports no issues, zero unresolved layered/coplanar area and 0% backface hits in the near outside-in sweep (304 rays). The tests pin the 23 m top, ~118 m front extent, ten shafts/capitals, actual open colonnade, distinct window rows, named end-pilaster support with a deliberately free terminal negative case, rigid grade, 1.5 m footprint envelope and matching far bounds.

Results: all four landmark-specific tests and all three Waterfront conformance checks pass; the required combined run reports **805/807 pass**, with only unrelated in-progress Palais Bourbon failures (a footprint ring below 4 m² and missing `public/models/buildings/palais-bourbon.json`). Catalog validation passes (406 entries / 734 variants); local preview generation passes; the single-id depth check is current and QA metrics have no issues.

Commands run: the required two-file Node test command, `node scripts/asset-catalog.mjs`, `pnpm assets:preview`, `node scripts/landmark-depth-layers.mjs --ids waterfront-station-vancouver` and its `--check`, plus the single-id QA metrics command. The generated shared depth table is the only shared source file changed, as authorized; the lead should regenerate the complete table at batch commit time.

 Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately. A contact sheet cannot establish terrain contact or provider replacement; the lead owns both app checks.

Build: `pnpm build:top-cities-landmarks waterfront-station-vancouver --no-check`.
