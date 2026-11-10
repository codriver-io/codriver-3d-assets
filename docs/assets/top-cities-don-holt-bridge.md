# Don N. Holt Bridge — North Charleston

Current 1992 I-526 crossing over the Cooper River, in the pale Citadel-blue paint applied in 2017. Original procedural exterior; no imported mesh, image texture, sign lettering or logo. Source: `src/peregrine/landmarks/top-cities/don-holt-bridge/`; exports: `public/models/bridges/don-holt-bridge*`.

## Sources and rights

- [SCDOT existing conditions, July 2022](https://info2.scdot.org/projects/ViewerFiles/Appendix%20A-Existing%20Transportation%20Conditions%20Summary-Final%20July%202022.pdf): 1992 construction, three-span continuous steel main unit, concrete approaches, about two miles overall and 155 ft navigation clearance.
- [OSM truss way 1469639956](https://www.openstreetmap.org/way/1469639956) and road ways [35067062](https://www.openstreetmap.org/way/35067062), [35067064](https://www.openstreetmap.org/way/35067064), fetched from the OSM API 2026-11-09. © OpenStreetMap contributors, ODbL 1.0.
- [Donholt.JPG](https://commons.wikimedia.org/wiki/File:Donholt.JPG): Citm2000, public-domain dedication verified on file page. This 2008 photograph shows the correct main truss from Ravenel Bridge, but predates the repaint. The only photo in the Commons category; coordinator approved additional comparison-only sources.
- [SCDOT painting update](https://info2.scdot.org/SCDOTPress/Lists/Posts/Post.aspx?ID=2616) and [2017 Citadel-blue repaint report](https://www.live5news.com/story/36522491/don-holt-bridge-gets-makeover-in-citadel-blue-color-as-painting-resumes/): all rights reserved, reference-only, not redistributed.

Photos and source captures remain outside tracked paths. Original generator/docs MIT; original models CC BY 4.0; credit matches the commissioned-model precedent. No agent accepts contributor terms or supplies a signature. Separate product permission remains a maintainer review.

## Dimensions

| Element | Model | Basis |
| --- | ---: | --- |
| Total authored crossing | 3330 m | Estimated representation of SCDOT's approximately 2 miles; not a survey of individual approach bays |
| Truss envelope | 491 × 29.4 m | Sourced from OSM outline |
| Main/side spans | 244 / 123.5 / 123.5 m | Estimated; public secondary 800 ft main-span figure, not authenticated design drawings |
| Pavement/deck width | 28.5 m | Estimated within OSM envelope |
| Navigation clearance | 47.24 m (155 ft) | Sourced SCDOT; contextual, not a baked sea-level datum |
| Road crest / chord rise | 52 / 21 m | Estimated from photo proportions |
| Approach profile, pier sections, 20 panels | See generator | Estimated |

## Frame and foundation

Origin is the centroid of the four OSM truss corners; +X east, +Y up, +Z south in real metres. Station axis bearing 99.6 degrees eastward is baked once. The end midpoints of the OSM outline and the paired highway endpoints are independent placement controls. Local y=0 is an abstract flat footing datum, not surveyed sea level. Both approach ends stand at 4 m on terminal abutments; host roads require explicit attachment and ground fitting. No DEM, terrain exaggeration or Mercator scale is baked in. Four main bents sit at stations -245.5, -122, 122 and 245.5 m; approach bents recur at 45 m. Supports and abutments are bounded, with no riverbed slab.

The OSM bridge highway ways extend beyond the separately mapped truss. The authored 3330 m envelope is a simplified whole-crossing approximation; do not blindly replace entire highway ways or the Virginia Avenue ramps. `layer.js` remains null. This is a portable static asset, not app road integration.

## Modeling decisions and omissions

Both LODs preserve continuous parallel upper chords with sloping end posts, every alternating Warren diagonal, transverse top ties, bottom chords and four main supports. Near adds intermediate vertical steel and top lateral bracing; far keeps the open truss. Pavement replaces the concrete slab top; it is not a coplanar overlay. Muted blue steel and grey concrete match the current finish. Approach bay spacing, vertical curve and exposed pier heights remain estimates. Exit ramps, lamps, pavement markings, fenders, utilities, bearings and rivets are omitted. No terrain, water, neighbouring paper mill or approach embankment is included.

## Measured costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15932 | 3 | 214668 |
| far | 13428 | 3 | 182680 |

Deterministic metrics: `tmp/landmark-qa/don-holt-bridge-metrics.json`, no flags; no layered/coplanar faces, no below-grade parts or backface hits. Full crossing sheet: `tmp/landmark-qa/sheets/don-holt-bridge.jpg`. Final focused main-unit near/far sheet: `tmp/landmark-qa/final/don-holt-bridge.jpg`, using scratch bounds to make the 491 m truss readable beside the reference. Two look rounds: corrected current blue tone, retained full 3330 m geometry. A later deterministic contact review joined the upper end posts exactly to the lower chord and removed coincident terminal diagonals; final metrics and the focused sheet were regenerated without another appearance-design round. Both sheets inspected; central truss proportions, four supports, panel rhythm and near/far contacts preserved. The automatic full-crossing framing makes the truss small; inspector overview/deck/support presets focus on it.

Cityscape: **not tested**. Full 3D world: **not tested**. Static library inspection does not establish provider replacement, drivable surfaces or terrain placement.
