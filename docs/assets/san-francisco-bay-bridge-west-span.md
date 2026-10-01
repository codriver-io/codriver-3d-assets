# San Francisco–Oakland Bay Bridge, West Span

`bay-bridge-west-span` · road-fitted bridge carrying I-80 · `src/peregrine/landmarks/san-francisco/bay-bridge-west-span/`

The 1936 West Span as it stands today: two suspension bridges end to end, sharing the concrete central
anchorage W4 ("Moran's Island"), from the San Francisco anchorage on Rincon Hill to the island anchorage W7
and the Yerba Buena Island tunnel. Silver-grey steel, a double-deck stiffening truss: the **upper deck
carries westbound** traffic, the **lower deck eastbound**, five lanes each. The East Span is a separate
landmark and is not modelled here.

## Sources

- HAER CA-32 (Library of Congress), West Bay Crossing description: spans, towers, truss, anchorages, tunnel.
- Wikipedia, *San Francisco–Oakland Bay Bridge*: clearance, deck widths, tower height, Bay Lights.
- OpenStreetMap (API 0.6 extracts, 2026-10-01; ODbL): westbound I-80 8921938 and its SoMa approach
  (1343738800, 120813417, 202485364, 1343730967, 617730080) and island ways (23874736, tunnel 11415208);
  eastbound 661905446 and its approach chain; supports 1136339258 (tagged W1, the San Francisco
  anchorage), 236373807 (transition pier W1), towers 432712476–79 (W2, W3, W5, W6), W4 236374789, W7 1136339259.
  The derivation is reproducible: `bay-bridge-west-span-derive.mjs` → `bay-bridge-west-span-alignment.js`.
- Photographs (Wikimedia Commons, local study only): Dllu (night; dusk from Yerba Buena Island, CC BY-SA 4.0),
  Radosław Botev (CC BY 3.0 pl), Daderot (CC0).

## Dimensions

| Item | Value | Status |
| --- | --- | --- |
| Main spans W2–W3, W5–W6 | 704.1 m (2310 ft); mapped towers 704.9 / 705.2 m apart | published, mapped |
| Side spans | 353.6 m (1160 ft); mapped W1–W2 357.5 m, W6 to the face of W7 355.5 m | published, mapped |
| W3–W4, W4–W5 | 379.5 m and 378.7 m between mapped centroids, against the published 353.6 m side spans: the published span ends at the cable bent on W4's face, and W4 is 69 m long, so its centroid lies ~25 m beyond each span end. The model keeps the mapped centroids and lands the cables in housings 26 m either side of them | mapped; convention explained |
| Tower tops above low water | W2/W6 139.6 m (458 ft), W3/W5 153.0 m (502 ft); base plates 12.2 m (40 ft) | HAER (Wikipedia/OSM give 160 m) |
| Tower legs | 30 × 20 ft at the base, 25 m apart at the base, over the cables (20.1 m) at the top; 2 X panels below the deck, 3 above | HAER; taper estimated |
| Truss | 66 ft (20.1 m) between trusses, 35 ft (10.7 m) deep, panels ~9.2 m | HAER; panel from 612 cable bands |
| Cables | two, 26 in (0.73 m wrapped); suspenders ~9.2 m apart | HAER |
| Clearance at mid main span | 220 ft (67 m) → upper road 77 m | published |
| Upper road at W2, W3, W4 | 70.3, 83.7, 88.0 m (1.9 % grade, crown at W4) | estimated from tower height difference |
| Upper to lower road | 9.0 m | estimated |
| Each deck kerb to kerb | 17.5 m (57.5 ft), five lanes | published |
| W4 | 69 × 40 m mapped outline, housings to 5 m above the deck | mapped; height estimated |
| Bearing | 40.3° | mapped |

## Modelling

- **Frame**: origin at the W4 centroid; station `s` runs San Francisco → island along the westbound way
  moved 1.4 m right, onto the centre of every mapped support (all within 1 m of the axis, tested).
- **Geometry** (`geometry.js`, helpers in `-parts.js`, layout in `-structure.js`): chords as swept bars,
  Warren diagonals and verticals per panel, lower wind bracing and floor beams (near), plated flat-shaded
  tower struts and X bracing, lofted battered legs, saddle housings, red beacons, catenary cables with
  suspenders (north side material `bay`: the Bay Lights at night), concrete anchorages and piers on their
  mapped outlines, steel bents A/B, the SoMa viaduct on portal bents, the eastbound ramp beneath it, the
  island viaduct and the tunnel drawn as a concrete tube with its portal.
- **Materials**: steel, cable, hanger, bay, concrete, pier (W4: the darkest, greyest element, with
  pilasters and a string course), asphalt, paint, rail, beacon, void (the dark bore of the tunnel portal),
  and the upper deck's own asphaltUpper, paintUpper, deckUpper (see the fade below). Dark theme: cable
  necklace lights and the Bay Lights bright, south suspenders dim.
- **Tunnel portal**: a concrete face with an arched bore (dark above the tunnel roof), two concentric arch
  rings ("three planes of broad arches"), stepped blocks over the crown and wing walls splayed toward the bridge.
- **Far LOD** (seen from 2–5 km): the truss is its two chords and the deck slab, a band; the diagonals,
  verticals, rails, paint, beacons, lower deck and portal bore are near only; every fourth suspender;
  5-sided cables; towers keep all bracing, W4 and the anchorages keep their mass.

### Flat-map ramps (Cityscape)

The basemap has no Rincon Hill and no Yerba Buena Island relief, so the profile is
`start → San Francisco anchorage 30 m → W2 70.3 m … W6 70.3 m → tunnel east portal (end)`.
- San Francisco: the upper deck climbs 772 m of mapped SoMa viaduct (max 5.9 %), then the anchorage to W2 (max 9.5 %). W1 sits at 46.5 m instead of ~64 m.
- Eastbound: the mapped eastbound way runs up to 36 m south of the westbound one; it is at grade until it
  enters the deck corridor (station 505 m), then climbs under the viaduct into the truss (max 11.8 %).
- Island: from W6 to the tunnel's east portal, 660 m, max **16 %** (one curve is the gentlest possible);
  W7 stands at 28 m instead of ~64 m, and the W6–W7 side span slopes.

## Double deck (shared-file extension)

`bridge-profile.js`: optional `spec.deckOffset(s, direction)` — with a heading, travel toward +s reads
`deckHeight + deckOffset(s, +1)` (here the lower deck), toward −s `deckOffset(s, −1)` (0, upper deck); no
heading (pins) reads the upper deck; the profile exposes `deckOffset` (0 when absent).
`bridge-roads.js` / `bridge-hd-surface.js`: an HD triangle claimed by a structure records its travel
direction; stacked bridges drape each direction's pavement on its own deck. `bridge-layer.js`: optional
`spec.buildingFootprints` masks the provider's extrusions of the mapped towers (OSM `building=tower`,
160 m boxes) while the model is drawn. Every field is optional; Montréal, Paris, Toronto (Prince Edward
Viaduct) and Champlain tests pass unchanged (55/55).

**Needs the lead** (`registry-landmarks-layer.js`, not edited in the branch): road bridges never receive
`prepareBuildings`. One line forwards it:
`prepareBuildings(...args) { …buildings…; for (const bridge of this.bridges) bridge.prepareBuildings?.(...args); }`.
Without it the provider draws 160 m white boxes over the four towers (verified in-app both ways).

## Upper-deck fade (eastbound chase view)

The car and route on the lower deck sit under the upper deck, so a chase camera saw only the upper deck.
The buildings' marker cut (ADR-0034/0035, the window kept on after ADR-0039 was deactivated) cannot reach a
landmark mesh: its uniforms belong to the basemap's building material and only `facade/map.js` shares
them (with the trees). So the bridge layer does it itself (`bridge-layer.js`, optional `spec.upperDeck`):
when the car's or camera's heading-aware `heightAt` resolves to a lower deck, the upper deck's own
materials (asphaltUpper, paintUpper, deckUpper, over the stacked stretch only) turn translucent (opacity
0.2, no depth write) and `bridge-roads.js` hides the other direction's HD pavement draped on the upper
deck; 800 ms after the car leaves the lower deck both are restored. Route and traffic lines use the
internal height and never toggle it. Westbound, nothing changes. No per-frame work beyond the existing
two heightAt calls; other bridges, without the field, are unchanged.

In-app (`tmp/san-francisco/bay-bridge-west-span/drive.mjs`, synthetic eastbound GPS at 72 km/h near W5, Model 3
on): before, the car is hidden under the upper deck (`drive/eb-car-before.png`); after, it shows through
the faded deck (`drive/eb-car-after.png`), layer state `_upperFade = 1`; westbound `_upperFade = 0`
(`drive/wb-car-after.png`).

## Costs

From the manifest bytes: near 58 491 triangles / 29 draws / 2.46 MB; far 11 004 / 8 / 0.43 MB
(budget 120 000 / 40 / 4.5 MB and 30 000 / 10 / 1.2 MB).

## Verification

Inspector (procedural and exported GLB, `tmp/san-francisco/shots/bay-bridge-west-span/`): overview, facade
(compared with Daderot's dusk view), tower W3, W4, deck (compared with Dllu's view from the island),
lower deck, underside, approach, island; far dark facade and near dark tower (compared with Dllu's night
view). Changes made from them: tower struts and X members made flat-shaded and wider (they read as round
pipes); overview camera moved closer; edge lines on the lower deck (it read as a blank slab); in the app,
the provider's 160 m tower boxes (hence the building mask). From the landmark test: the San Francisco
side-span cable sagged through the deck near W1 and now sags less.

**Cityscape — verified** (local server, `app-shot.mjs`, `probe.mjs`; HD lanes not checkable locally, /osm-lanes 503):
`heightAt(lng, lat, heading)` at 40.3° (eastbound) / 220.3° (westbound) / none / 130.3° (crossing):
SFA 21.0 / 30.0 / 30.0 / null; W2 61.3 / 70.3 / 70.3 / null; mid W2–W3 68.0 / 77.0 / 77.0 / null;
W4 79.0 / 88.0 / 88.0 / null; W7 19.2 / 28.2 / 28.2 / null; 20 m from the end 0.19 for both; eastbound
10 m before entering the corridor 0 (at grade); 60 m off the bridge null. Approach heights are 0 locally.
Shots at both approaches in both directions: the generic road is replaced, no doubled deck; with the
building forward the provider tower boxes disappear.

**Full 3D world — verified** (terrain server, `--mode world`, `terrainPolicy: 'absolute-deck'` from the
Golden Gate branch; no corridor flattening). `heightAt` reads height above the local ground; deck = reading
+ ground. Upper/lower deck above low water: W2 70.3 / 61.3 (ground 1.3), mid W2–W3 77.0 / 68.0 (bay floor
−24.6), W4 88.0 / 79.0, W6 70.3 / 61.3, W7 69.0 / 60.0 (the 'end' ramp takes the island DEM, so W7 is near
its real ~64 m). San Francisco approach: over Rincon Hill (ground 29–31 m) both directions run on grade
(readings 0 / 0) instead of the lower deck being buried. Yerba Buena Island: the tunnel range
(`spec.tunnels`) keeps the deck under the hill (readings −7.3 / −12.0 at 150 m, −31 at 80 m from the end,
ground 76–99 m); no channel is cut, the portal and wing walls stand in the hillside. Shared changes for
this: `bridge-layer.js` exposes the DEM along the alignment (`demAt`, −∞ inside optional `spec.tunnels`),
a stacked lower deck is clamped to the ground like the upper one, and `bridge-hd-surface.js` drapes a
stacked direction's HD pavement on that same surface. Single-deck absolute-deck bridges (the Golden Gate)
read exactly as before (130/130 bridge tests). Cityscape readings are unchanged.

## Open problems

- The registry forward above (lead).
- Eastbound car/route sit inside the truss under the upper deck: correct, but a chase camera above sees the
  upper deck, not the car. Approach heights in production (HD 'start'/'end') shift the eastbound ramp start.
- Cityscape: island ramp 16 % and the tunnel tube on flat ground. Full 3D world: the decks ride on grade over Rincon Hill (the anchorage knot is a flat-map 30 m).
- Estimated deck elevations; W1 and W7 lower than real on the flat map.
