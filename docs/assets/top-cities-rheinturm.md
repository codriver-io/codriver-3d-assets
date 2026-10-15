# Rheinturm

Asset `rheinturm`, Stromstraße / Rheinufer, Düsseldorf. Original procedural model of the
1981 concrete telecommunications tower: a slim shaft, one ribbed pod, the Lichtzeitpegel
on the Rhine face, and a stepped red-and-white mast. Contract:
[3d-top-cities-landmarks.md](../top-cities-landmarks.md).
Source: `src/peregrine/landmarks/top-cities/rheinturm/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Tip | 240.5 m (234.2 m until the DVB-T aerial of 15 Oct 2004) | published ([Wikipedia](https://en.wikipedia.org/wiki/Rheinturm)) |
| Public tower / deck | 172.5 m under the technical brim; observation deck 168 m | published (Wikipedia) |
| Architect, dates, structure | Harald Deilmann; completed 1 Dec 1981; opened 1 Mar 1982; reinforced concrete | published (Wikipedia) |
| Site | about 36.6 m NHN, not baked; local grade is y=0 | published (Wikipedia) |
| Lichtzeitpegel | Horst H. Baumann, 1981; 62 portholes, one west column, 2.5 m apart; groups for hours, minutes, seconds; red aviation pairs near 80 m and 120 m | published ([de.wikipedia Lichtzeitpegel](https://de.wikipedia.org/wiki/Lichtzeitpegel)) |
| Axis | `[6.7616587, 51.2179636]`, centroid of OSM way 161648930 | mapped |
| Foot ring | way 161648952, inscribed radius 9.35 m about that axis | mapped |
| Pod ring | way 161648930, height 174.5–179.4, inscribed radius 17.68 m | mapped |
| Shaft stages | ways 161650419, 161648951, 161648942, 161648943, inscribed 8.92 / 8.07 / 7.26 / 6.92 m | mapped |
| Cone, glass, mast steps | ribbed inverted cone, two dark bands, white mast with a red top | photographs (Taxiarchos228; Öztas; Foto-dus; Pitlane02) |

The Landtag (relation 10323145) is the neighbour and is not in `OSM_WAYS`.

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Tip | 240.5 m, both LODs, red beacon | sourced height |
| Shaft | foot radius 9.12 m, neck 6.82 m at 152 m, concave exponent 1.7 | foot and neck inside the inscribed rings; the curve is estimated. OSM's foot polygon averages about 10.8 m |
| Plinth | +0.16 m, 1.7 m tall | estimated, still inside the 9.35 m ring |
| Cone | 152 m to a lip at radius 16.55 m, y=166.15, with panel ribs (36 near, 12 far) | estimated from the worm's-eye photograph |
| Restaurant glass | y 166.05–168.05, radius about 16.4–16.9 m | estimated; the deck line at 168 m is published |
| Deck band | radius 17.05 m at y 168.12–168.95 | the 168 m deck is published; the radius is estimated |
| Observation glass | y 169.05–172.45, tapering 16.7 to 16.15 m | estimated |
| Public line / brim | shoulder starts at 172.5 m; brim radius 17.25 m, roof to 179.3 m | 172.5 m is published. OSM's brim averages about 19 m; 17.25 m is the largest disc that stays inside the 17.68 m inscribed ring |
| Clock | 62 lamps, bearing 270°, y = 11.25 + (n−1)×2.5. Lamp 44/45 centres on 120.0 m; lamp 27/28 centres on 77.5 m | spacing and the west face are sourced. The 11.25 m start is what puts the upper aviation pair on 120 m |
| Shown time | 16:56:39: lit lamps from the top of each digit group; aviation pairs always red | the Pitlane02 photograph. Separators and the unused end groups stay dark |
| Mast | saucer near 187 m, white to 222.5 m, red to 233.4 m, white tip, beacon to 240.5 m; four red rim lamps | tip height sourced; the steps are estimated |
| Door | east leaf, 2.5 m wide, sill 0.15 m | estimated |

## Materials

Eight merged materials, one draw each, same keys by day and night: `concrete` (shaft, cone, brim), `glass` (two storeys and the door), `metal` (mullions, rails, roof aerials), `white` and `red` (mast), `dark` (unlit portholes), `glow` (lit white time lamps), `light` (red aviation lamps, saucer lamps, beacon). `glow` and `light` are unshaded. Night glass is a dim cyan (`#1c5874`) so the pod still reads as lit glazing without a ninth material. No textures.

## Modelling decisions

- The silhouette a driver reads from the Rhine bank is the whole tower: a shaft much slimmer than the pod, one cone, two dark bands, a brim, a red-topped mast. The pod radius over the neck is about 2.5.
- The cone carries radial ribs because the first smooth underside did not match the photograph from below. Grooves stay in the far model, with 12 ribs instead of 36.
- Mullions stand 14 cm outside the glass. Short feet at each end cross the cone lip, the deck band and the inset shoulder, so the bars are not floating. Rail posts and the twelve near-only roof aerials are planted in the slab.
- The clock is round marks, not a texture. Concrete collars keep the lamp face about 5 cm proud of the collar and 12 cm proud of the shaft.
- Far keeps the same outer bbox (17.25 m brim, 240.5 m tip), both glass bands, the clock column and the mast steps.
- Every vertex is inside the 17 mapped rings (`ownsPoint`). The aerial way is listed so the provider mast is removed; the modelled mast stands inside the pod ring.
- Runtime zone: 6 km, zoom 12.5, near LOD within 550 m. `padM` is 40 m. No `terrainPad`.

## Approximations, honestly

- Lamps 58–62, the unlit top group, sit on the cone. A 2.5 m pitch that holds the aviation pairs at about 80 m and 120 m cannot also end at lamp 62 below the 152 m neck.
- The clock does not tell the current time. It shows 16:56:39.
- The brim is narrower than OSM's mean radius so the mesh stays inside the inscribed ring. The shaft foot is likewise the inscribed radius, not the mean of the irregular polygon.
- Mast diameters, rib count, mullion count and the east door are read from photographs.
- The Landtag, the interior, the cleaning rig and a live decimal clock are omitted.

## Verification

Looked at the dossier sheet `tmp/top-cities/rheinturm/refs-sheet.jpg` and refs 1 (Medienhafen), 2 (night, from the river), 4 (the 16:56:39 overlay) and 5 (ribbed cone from below). Refs 3 and 6 are views from the tower, not of it.

Procedural, after the rib pass: `tmp/top-cities/shots/rheinturm/rheinturm-procedural-near-light-sheet.jpg` (overview, facade, underside, clock) and `rheinturm-procedural-far-dark-sheet.jpg`. The cone ribs and the porthole collars read; night glass goes blue.

Exported GLB, which is what ships: `rheinturm-glb-near-light-sheet.jpg` (overview, west facade, roof, pod, clock, mast), `rheinturm-glb-near-dark-sheet.jpg`, `rheinturm-glb-far-light-sheet.jpg`, `rheinturm-glb-far-dark-sheet.jpg`. The far pod keeps the ribs, both bands and the clock. The model sits on the red footprint ring. Cityscape and Full 3D world were not opened.

## Cost

Near 18,536 triangles, 8 draws, 627 KB (641,988 bytes). Far 6,580 triangles, 8 draws, 244 KB (249,788 bytes). Building budget is 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far. Far uses the last draw slot; there is no separate night-rim material.
