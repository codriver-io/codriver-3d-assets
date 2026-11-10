# Ben Sawyer Bridge — Sullivan's Island

Original procedural model of the **2010 replacement**, in its closed road position. The new steel superstructure deliberately repeats the 1945 polygonal Pratt swing-truss appearance, but has wider lanes and one harbor-side sidewalk. The narrower pre-2010 span and temporary construction platforms are not modeled.

## Sources and rights

- [FHWA Innovator, issue 11](https://www.fhwa.dot.gov/innovation/innovator/issue11/): 247 ft center-pivot swing span, 452 ft approach on each bank, tender house above the roadway.
- [FHWA replacement demonstration report](https://www.fhwa.dot.gov/hfl/projects/sc_rapidremovalreplacement_bensawyerbridge_sc703.pdf): permanent replacement and six spans per approach.
- [SCDOT Winter 2010 Connector](https://www.scdot.org/inside/pdf/ConnectorArchives/Winter2010Connector.pdf), pp. 14–15: February 2010 reopening and 5.5 ft sidewalk; new 14 ft lanes.
- [OSM outline 709657858](https://www.openstreetmap.org/way/709657858), approach ways 55610715 and 927285595, [movable span 927285596](https://www.openstreetmap.org/way/927285596), and sidewalk 1459906451. OSM API fetched 2026-11-09; © OpenStreetMap contributors, ODbL 1.0.
- [Current open swing span, 2025](https://commons.wikimedia.org/wiki/File:Swing_span_of_Ben_Sawyer_Bridge_open_in_2025.jpg): Peter Burka, **CC BY-SA 2.0**, license verified on Commons. Shows this replacement span, pivot and overhead cabin, with marine traffic position used only to understand its structure.
- [2010 replacement aerial](https://commons.wikimedia.org/wiki/File:Ben_Sawyer_Bridge_Aerial_View_SC_(8424392896).jpg): Federal Highway Administration, **public domain US DOT work**, also verified Flickr CC BY 2.0. Shows the correct site and both temporary old/new superstructures; these are distinguished rather than modeled as parallel bridges.

Photos stay outside tracked paths and are comparison-only, never traced into a texture. Original geometry and docs use the commissioned-model precedent's CC BY 4.0 / MIT credit. No agent acceptance of contributor terms; separate product permission is a maintainer review.

## Dimensions

| Feature | Model | Basis |
| --- | ---: | --- |
| Swing unit | 75.2856 m (247 ft) | Sourced FHWA |
| Each nominal approach | 137.77 m (452 ft) | Sourced FHWA |
| Overall modeled envelope | 352.48 m | Sourced OSM outline, slightly different from the 350.82 m FHWA nominal sum |
| Two lanes | 4.267 m each | Sourced SCDOT; shoulders estimated |
| Harbor sidewalk | nominal 1.676 m (5.5 ft) | Sourced SCDOT; outer parapet/clear width simplified |
| Whole deck | 12 m | Estimated from mapped footprint and photos |
| Closed deck top / truss crown | 11.8 / 21 m | Estimated relative to support datum |
| Cabin roof / antenna top | 25.5 / 26.5 m | Photo estimate |
| Pier diameter, fenders, sections | See generator | Estimated |

## Frame and foundation

Origin `[-79.84205815,32.772720675]` is the midpoint of the mapped full-bridge end edges. The movable roadway endpoints `[-79.841871,32.7724155]` and `[-79.842218,32.7730316]` independently confirm the central unit and bearing. +X east, +Y up, +Z south, real metres; bearing 333.62° toward Mount Pleasant is baked once. Local y=0 is the pivot/approach support foot datum, not sea level. No terrain, Mercator scale or water is included.

Central 7.8 m footing diameter and approach twin-column bents require local ground fitting in a host. The roadway descends to 3 m at both terminal abutments. The host must attach its own roads and select the bank datum without stretching the swing truss or cabin. `layer.js` remains null; no integration code is supplied. Ownership is limited to the mapped bridge/road/sidewalk ways, excluding adjacent houses and causeway land.

## Geometry, decisions and omissions

Both LODs keep the polygonal top chords, sloping end posts, verticals, Pratt diagonals, floor beams, central cylindrical pivot and above-road cabin. Eight material batches, with separate cabin glazing bays and a muted green hipped roof. Far drops top cross-diagonals, uses coarser rails and a twelve-sided pivot. Both retain structural contacts and all twelve approach bents. Pavement is the slab top, not an overlay. Timber fenders are a simple pile/waler enclosure anchored to local y=0.

Excluded: operating gears, animation, construction works, highway signage/lettering, signal equipment, traffic, deck grating detail, rivets and exact fender tip geometry. The protective fender length, cabin profile, railing and steel sections are visual estimates. No terrain or provider replacement is claimed.

## Measured costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11110 | 8 | 165096 |
| far | 5302 | 8 | 88124 |

Metrics: `tmp/landmark-qa/ben-sawyer-bridge-metrics.json`, no flags. Hidden cabin bottom faces removed after layered-face screening; remaining sub-threshold small surfaces are physical railing/slab and floor-beam contacts, not facade overlays. Both LODs preserve the same bounds and truss/cabin/pivot silhouette. Full-crossing comparison: `tmp/landmark-qa/sheets/ben-sawyer-bridge-full.jpg`. Final main-unit sheet: `tmp/landmark-qa/final/ben-sawyer-bridge.jpg` (scratch focused bounds; approaches remain full-length in the GLBs). Two look rounds, with current-span and 2010 construction photographs compared; the closed model intentionally differs from the open 2025 reference position.

Cityscape: **not tested**. Full 3D world: **not tested**. Library view only; no host app or driving-surface validation.
