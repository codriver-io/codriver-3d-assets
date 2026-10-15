# Dames Point Bridge

Original procedural model of the Dames Point Bridge (officially the Napoleon Bonaparte Broward Bridge), the 1989 concrete cable-stayed crossing of the St Johns River on I-295 / SR 9A, the East Beltway of Jacksonville, Florida. What makes it this bridge, and what the model is built around: two tall concrete **H-pylons** with two chevron struts each, and dense **harp** stays (parallel, not a fan) in vertical planes on both sides of both legs, over a crested 396 m main span and very long concrete approaches.

Sources: [Wikipedia](https://en.wikipedia.org/wiki/Dames_Point_Bridge) (1,300 ft main span, 175 ft clearance, 471 ft height, 106 ft width, 10,646 ft length, harp in multiple vertical planes: main-span cables paired vertically, side-span cables paired horizontally, 21 miles of cable), OpenStreetMap ways [10891837](https://www.openstreetmap.org/way/10891837) / [10891841](https://www.openstreetmap.org/way/10891841) and the mapped [air-gap sensor](https://www.openstreetmap.org/node/12215240468), Esri World Imagery (reference only, to place the pylons and dolphins), and the reference photographs listed in the catalog record (Commons, licences checked; none shipped).

## Dimensions

| Dimension | Authored value | Basis |
| --- | --- | --- |
| Main span | 396.24 m | Published 1,300 ft |
| Side spans | 198.12 m each | Estimated (half the main span; matches the photographed anchor-pier positions within a few metres) |
| Pylon crown | 143.56 m | Published height 471 ft (the task brief's ~134 m was approximate) |
| Deck surface / girder soffit at mid-channel | 55.34 / 53.34 m | Published 175 ft clearance plus an estimated 2.0 m deck depth |
| Deck surface at the pylons | 52.89 m | 8 km crest radius (estimated, photo-matched curvature) |
| Overall deck width | 32.2 m | Published 106 ft; parapets at ±16.1 m |
| Carriageways | 2 × 13.7 m (3 lanes + shoulders), 1.4 m median barrier | Published six lanes; shoulder split estimated |
| Pylon leg centres | ±18.6 m | Estimated: legs just clear of the deck edge (aerial and Navy photo) |
| Legs | 9.0 × 5.6 m at the pile cap to 5.8 × 4.2 m under the deck; 4.4 × 2.8 m above, 3.9 × 2.5 m at the crown | Photo-scaled |
| Struts | centres 71.0 m and 114.5 m; 6.4 m deep at the legs, top face dipping 4 m to a V at mid-width | Photo-scaled from Commons refs 1 and 4 (about 18 m and 62 m above the deck) |
| Stays | 18 positions per half harp, 288 cables near (pairs), 144 far; one slope, 26.2° | Count estimated from the 21 miles of cable; harp is published |
| Approach spans | 48.77 m (160 ft) | Estimated from photographs |
| Modelled alignment | 3,741 m: mapped bridge ways 3,261 m + 480 m of the north approach embankment | OSM; embankment estimated (see below) |

Pylons: the main-span centre is fixed at the mapped air-gap sensor and the deck expansion joint visible in aerial imagery (within 7 m of each other); the two pylons measured 392 m apart on the same imagery and are set at the published 396.24 m. Origin `[-81.5569563, 30.3847441]` is that mid-channel point. Units are real metres, east/up/south; the alignment is the midpoint of the two mapped one-way carriageways, so the deck follows the mapped S-curve of the south approach.

## Flat-map profile (Cityscape)

One crest radius (8 km) runs through both pylons; each side then takes the constant grade that lands it at grade with a 60 m sag curve and a 30 m level landing. South: crest to 210 m from mid-channel, then **2.62 %** over the long south viaduct (1,850 m). North: crest to 361 m, then **4.52 %**. The mapped bridge ways end 986 m north of mid-channel, where a real 4-5 % interstate grade is still about 19 m up, so the model continues 480 m onto the mapped motorway as an embankment between vertical concrete retaining walls (estimated form) and lands 120 m short of the Heckscher Drive ramp split; ending the deck at the mapped bridge end would have needed a 7.3 % ramp. The south abutment is the same fill for the first 194 m (deck under 3.5 m). Both fills stop where the deck is 0.5 m up, so no buried fill top shows round the landing noses (the flat map's ground writes no depth). Webster Street passes under the north side span at about 45 m; no other road crosses under the modelled corridor.

## Structure and modelling decisions

- **Deck**: concrete slab with two edge girders (the cable-stayed deck seen from below in the Navy photograph), plus two inner girder lines on the approach viaducts, transverse floor beams every 9 m under the stayed spans, an outer barrier (15.4-16.1 m) that holds the stay anchors, a 1 m anchorage curb carrying the lamp standards, and a split median barrier. All of it is lofted along the shared station/lateral frame.
- **Pylons**: chamfered octagonal legs flared below the deck, on a 48 × 18 m pile cap; a haunched crossbeam under the deck (the hexagonal opening between the lower legs); two struts with deep haunches and a V-dipped top; stay anchor blocks stepping up both faces of each leg (the serrated leg edge in the photographs, near LOD only).
- **Harps**: tower anchors evenly spaced from 62 m to 139.5 m; every stay has the same slope, chosen as the steepest that keeps the outermost side-span stay inside its span. Main-span cables are pairs one above the other, side-span cables pairs side by side, as published. The two main-span harps leave a 54 m central gap; outermost side-span stays land 8-12 m short of the anchor piers.
- **Supports**: 45 two-column bents with caps (tie beams on bents over 30 m), heavier anchor piers at both ends of the stayed unit, and the two ship-impact dolphins seen in the aerial and the 2013 aerial photograph (one per pylon, east side).
- **Lamps**: cobra-head standards every 54 m on both curbs (68 per side near; every other one, without arms, far); the `lamp` material is self-lit at night (sodium orange). Stays are pale at night, as floodlit in the night photographs.
- **Landings**: only the last 150 m at each end narrow onto the mapped carriageways (12 m noses centred on the mapped ways, or the provider's zoom-dependent ribbon width / measured HD edges in the app); barriers and curbs sink into the pavement over the last 25 m; the exported pavement colour blends toward the map road colour at the noses. The stayed and viaduct spans stay rigid (`fittedLateral` is the identity there).
- Full 3D world: `terrainPolicy: 'absolute-deck'` — authored heights are above the water, ramps blend into the DEM at both ends, pylon and pier feet (bridgeLift 0) follow the local ground.
- Full 3D world landing fix (review g2a, 2026-10-14): the shared `terrainClamp` lifts every vertex onto the DEM under it, so the deck slab and the two fills, whose top was a single chord from parapet to parapet, rose through the carriageways wherever the ground across the road is not planar (a beige polygon across the south landing near the end of the taper). Their top and bottom now break at the pavement edges and the median (`DECK_COLS`, each half on its own carriageway), and every strip end is a station of every strip it overlaps, so the slab stays 0.15 m and the fills 0.2 m under the asphalt vertex for vertex. The columns run on the fills and wherever the deck is under 20 m (`COL_DECK_M`; the DEM along the alignment stays under ~10 m); the high viaducts and stayed spans keep the single chord. A test bends the cross-section 1 m (on top of any crossfall) where the deck is low and requires the pavement to be the top surface at 6 laterals every 15 m over both landings in both LODs; it failed at s = 90 on the previous geometry.

## Costs

Near **41,436 triangles / 20 draws / 1,878,096 bytes**; far **13,732 / 6 / 535,068 bytes** (39,332 / 12,348 before the 2026-10-14 landing fix below) (budgets 120 k / 40 / 4.5 MB and 30 k / 10 / 1.2 MB). Strips are indexed per face (flat across edges, smooth along the deck); stays and poles are open tubes; far draws the slab at full girder depth instead of separate girders, keeps one cable per harp position and every other lamp, and samples the deck at 50 m (a 50 m chord on the 8 km crest sags 4 cm).

## Verification

- Tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/dames-point-bridge/dames-point-bridge.test.js` pass. The landmark test pins: crown 143.56 m, pylons 396.24 m apart, the portal open at 62/92/130 m and closed by each strut and the crossbeam, pavement 55.34 m and soffit 53.34 m at mid-channel, 32.2 m width, no channel pier, every bent and dolphin reaching the ground; parallel stays (all within 1.5°) in the leg planes; named terminal contact for every stay (leg / outer barrier), floor beam, bent column, tie and cap, anchor pier, crossbeam, strut, leg and lamp pole/arm/head, with a deliberately shortened stay at both ends and a lifted pole foot proven to fail; footprint containment of every vertex; landing taper and immutable refits; both headings on every mapped roadway vertex with median/off-road/crossing rejection; grades < 5 %; the app layer's zoom-dependent landing width and day/night pavement colour; GLB attachment weights.
- `node scripts/landmark-depth-layers.mjs --ids dames-point-bridge --check`: current, **0 cycle edges**.
- Looked at (all under `tmp/top-cities/shots/dames-point-bridge/`): `r1/…-near-light-sheet.jpg` (first pass: struts too thin and flat, compared with crops of Commons refs 1 and 4 → deep haunched V struts, a haunched crossbeam and leg anchor blocks; overview/facade cameras moved closer), `r2/…-near-light-sheet.jpg`, `r2/…-facade.png` (side elevation against ref 1: deck at 37 % of the pylon height as in the photograph, struts and harps read), `r2/…-far-dark-sheet.jpg`, `r2/…-top.png` (plan over the red footprint: alignment, S-curve and dolphin widenings), `r2/lands.jpg` (both landings and the north abutment: pillow-shaded boxes → flat-shaded faces; the 1.7 m flat parapet → barrier plus curb), then the exported GLBs: `glb/…-glb-near-light-sheet.jpg` and `glb/…-glb-far-dark-sheet.jpg`.

Full 3D world with the AWS Terrarium DEM, 256 px, z15; no HD lanes, no Redis): `tmp/top-cities/dames-point-bridge/app-probe.mjs` drives to both landings in both directions plus the north abutment and the main span, and reads `window.__map.landmarks.heightAt`. Shots: `app-cityscape/*.png` and `landings-crop.jpg`, `app-cityscape-std/` (far/near/street), `app-world/*.png` and `sheet.jpg`, `app-world-std/`. The first Cityscape capture showed a beige apron of buried fill top beside and between the ribbons at both noses; the fills were cut back (above) and the recapture shows the ribbons running straight into deck noses of the same width and colour, with no step or gap and no doubled provider bridge. The layer was active at near detail in every shot.

`heightAt(lng, lat, heading)` at the carriageway centres (−7 m / +7 m), identical in both driving headings; off-road (70 m) and a crossing heading return null everywhere. Cityscape equals the authored deck exactly; Full 3D world returns metres above the queried ground (absolute deck minus local DEM):

| Sample (station m) | Authored | Cityscape | Full 3D world |
| --- | --- | --- | --- |
| south-foot (5) | 0.00 | 0.00 / 0.00 | 0.31 / 0.39 |
| south-ramp (100) | 1.05 | 1.05 / 1.05 | 5.12 / 5.10 |
| south-abutment (200) | 3.67 | 3.67 / 3.67 | 4.83 / 5.99 |
| south-viaduct (900) | 22.03 | 22.03 / 22.03 | 20.06 / 20.71 |
| cable-start (1899) | 48.22 | 48.22 / 48.22 | 49.77 / 50.12 |
| south-tower (2087) | 53.13 | 53.13 / 53.13 | 39.90 / 41.46 |
| midspan (2275) | 55.34 | 55.34 / 55.34 | 55.40 / 55.39 |
| north-tower (2463) | 53.13 | 53.13 / 53.13 | 53.17 / 53.16 |
| cable-end (2651) | 46.51 | 46.51 / 46.51 | 42.98 / 42.97 |
| north-viaduct (3201) | 21.69 | 21.69 / 21.69 | 22.74 / 22.30 |
| north-embankment (3411) | 12.20 | 12.20 / 12.20 | 11.93 / 12.29 |
| north-ramp (3641) | 1.81 | 1.81 / 1.81 | 4.17 / 3.93 |
| north-foot (3736) | 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

The south-landing northbound world shot that showed the beige polygon now shows the two carriageways running clean into the viaduct; no concrete shows through the pavement at either nose in either mode, and the heights are unchanged. All 56 in-range mapped roadway vertices return a height in both headings in both modes (112 queries each, 0 null). The world values near the south pylon (ground about 13 m) and the ramps reflect the DEM under the deck, not the deck. Not measured: footing residuals of the planted pier/pylon vertices against the DEM (the shared absolute-deck clamp moves them; it was not probed here), HD lanes on the deck, a driven route.

## Known approximations

The side-span length, every pylon section, strut level and shape, the stay count, deck depth, approach span length and pier form are photo-based estimates. The north embankment's form (vertical retaining walls) is assumed; the real approach may use sloped fill. The real deck is built of precast concrete edge girders and floor beams; approach girder layout is generalised. The stay pairs are 1.0 m / 0.5 m apart, a visual reading of "paired". Fender systems around the pile caps and the lighting of the pylons are not modelled.
