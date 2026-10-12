# Storseisundet Bridge, Atlantic Ocean Road

Original procedural model of Storseisundbrua between Averøy and Hustadvika, Norway: the three-span concrete cantilever bridge built in 1988 on the Atlantic Road, which opened in 1989. Its steep, sideways-curving hump makes the roadway appear to end in midair when approached. Two rectangular piers, a variable-depth box girder, slim galvanized guardrails and engineered rock-fill approaches retain that silhouette in both exported LODs. Source lives in `src/peregrine/landmarks/top-cities/storseisundet-bridge/`; no scan, traced mesh, photograph or texture ships.

## Sources and dimensions

[Riksantikvaren's Atlantic Road protection dossier](https://riksantikvaren.no/content/uploads/2022/11/Vedlegg-29.16-Atlanterhavsvegen.pdf) identifies a 260 m, three-span concrete free-cantilever bridge, built in 1988, with about 23 m sailing clearance and a sharp curve over the bridge hump. The supplied [Wikipedia dossier](https://en.wikipedia.org/wiki/Storseisundet_Bridge) gives the 130 m main span and 1989 road opening. These are structural references, not a surveyed vertical alignment. The lead's supplied OSM extract was reused, not re-fetched; no Overpass/network queue request was needed.

| Feature | Authored / reference value | Basis |
| --- | --- | --- |
| Published structural length | 260 m | Riksantikvaren, supplied dossier |
| Mapped structural length | 264.259 m | OSM roadway 123498061, retained without rescaling; 1.64% longer |
| Main support-centre span | 130 m | Supplied main-span fact; positions registered around mapped bridge midpoint |
| Side support-centre spans | 67.130 / 67.130 m | Remaining mapped length divided equally, estimate |
| Fitting corridor | 624.259 m | Mapped bridge plus 180 m of roadway at each end |
| Structural / vehicle width | 7.4 / 6.3 m | OSM outline and two-lane photographic proportions; estimate |
| Central soffit clearance | 23.0 m above authored grade | About 23 m published sailing clearance interpreted at the central soffit |
| Road crest / rail top | 25.2 / 26.35 m | Crest includes estimated 2.2 m slab/box depth; not a published road elevation |
| Abutment road height | 13.0 m | Photograph-based flat-map compromise, not survey |
| Box depth at pier root / crown | 7.4 / 2.05 m below the flange top | Photo estimates, plus 0.15 m flange datum below pavement |
| Pier shaft / footing | 2.7 × 4.9–5.5 m / 5.3 × 6.1 × 0.8 m | Photo estimates; no underwater pile model |
| Approach peak grade | 12.57%, two 180 m ramps | Clamped cubic vertical curve from grade to abutments |
| Central hump peak grade | 12.94% | Continuous cubic vertical curve, 12.2 m rise in 132.13 m on each side |
| Rock-fill slope | About 0.65 m outward per metre of height | Engineered support approximation; surrounding islands/terrain omitted |

The original authoring study used four dossier photographs: [Storseisundet bridge.jpg](https://commons.wikimedia.org/wiki/File:Storseisundet_bridge.jpg), Iwoelbern, public domain; [Storseisundet Bridge 2.jpg](https://commons.wikimedia.org/wiki/File:Storseisundet_Bridge_2.jpg), Ernst Vikne, CC BY-SA 2.0; [Atlantic Ocean Road.jpg](https://commons.wikimedia.org/wiki/File:Atlantic_Ocean_Road.jpg), CHG, CC BY 3.0; and [Storseisundbrua, Atlanterhavsveien, Norway 20170531.jpg](https://commons.wikimedia.org/wiki/File:Storseisundbrua,_Atlanterhavsveien,_Norway_20170531.jpg), dconvertini, CC BY-SA 2.0. The original authoring notes record checked Commons reference pages and licensing fields. This QA round used the cached contact-sheet reference photo; the original dossier folder was unavailable. All reference files remain in ignored dossier scratch, outside delivered source and exports.

## Frame, road fitting and construction

Origin `[7.3545931, 63.0167825]` is an OSM roadway control point near the structural midpoint. Geometry is metric east/up/south; station increases west to east. OSM ways 123498060, 123498061 and 751715045 supply the winding road, including approaches. Structural endpoints are `[7.3522021,63.0165475]` and `[7.3571739,63.017251]`, approximately bearing 65° overall. The centreline's lateral curve is retained; rotation is baked into the geometry once. The immutable mapped points and outline are in `storseisundet-bridge-mapped.js`; a copy of the original extract is in ignored `tmp/top-cities/storseisundet-bridge/osm.json`.

`FOOTPRINTS` contains OSM bridge outline 1159266079; the same ring is passed as `buildingFootprints`. No building or building-part way was present in the supplied extract. Bridge geometry is checked against that mapped envelope with 0.65 m tolerance for rails/support edges. The rock-fill fitting approaches lie along roadway outside the structural ring; they are engineered fill, not building footprints or baked DEM terrain.

`PROFILE` is shared by the girder, fallback road, provider road fitting and navigation in both directions. The standard `createRegistryBridgeLayer` owns GLB loading, LOD swaps, provider structure replacement and accepted road heights. `clipStandardEnds` is enabled. The `'absolute-deck'` terrain policy preserves the bridge's authored deck, blends fitting endpoints into the live ground and adapts individual foundations/shafts. Here `lateralBankFit: { terrainClamp: true, clearanceM: 0.12 }` samples the actual deformed pavement vertex instead of an interpolated centreline DEM, and clamps each sampled vertex to that terrain plus 12 cm. The focused follow-up adds a 1 m longitudinal / at most 0.45 m lateral pavement grid on both approaches in both LODs. Paint follows the same longitudinal samples. At alignment bends the authored pavement height uses its actual projected station, matching fitting/navigation. Terrain clearance remains a sampled validation rather than a global bound. Geometry, navigation and HD overlays share the same actual-position function; absent-field bridges remain unchanged.

The girder is a closed loft with a projecting top flange, beveled web shoulders and a narrow bottom box; its depth increases quadratically toward each pier. This is a cantilever haunch, not a separate load-bearing arch. Shafts contact the girder roots; the navigation channel is open beneath the 130 m main span. Near includes W-section galvanized barriers, upper parapet rails and closely spaced posts/base plates/reflectors. Decorative fill stones were removed in this QA round because independent terrain fitting could expose them outside the fill surface. Both LODs keep curb-rooted terminal rail posts and yellow centre dashes. Far retains the same box profile, piers, curve, hump and parapet outline, with fewer posts and simpler rail sections. Repetition is merged by material. Structural lofts discard degenerate triangles and merge vertices with identical normals. Fill lofts have rounded shoulders/toes, smooth longitudinal normals and 2 m near / 4 m far sampling. Hidden fill tops/bottoms and approach-slab undersides are omitted at their union to avoid material cycles. The thin at-grade endpoint wedges are omitted.

Material palettes use weathered grey concrete, darker bearings/soffit trim, grey asphalt, galvanized rail, white edges and yellow centre dashes, and grey-green fill. Dark palettes dim these materials; no invented floodlights are added. Provider pavement determines the application's fallback asphalt colour. Near and far each use seven draws; both retain a distinct yellow paint material. Fixed feet carry attachment weight 0, deck/rails carry 1, shafts and fill interpolate; the GLBs retain `_BRIDGELIFT` (loader `_bridgelift`).

## Focused approach QA fix and evidence

The previous Round 3 fix smoothed the crest and fill, but left live-terrain pavement penetration of 0.370470 m near / 0.063878 m far at triangle interiors. All pavement corners cleared terrain; the old panels still spanned the full 6.3 m vehicle width. This follow-up changes only this landmark's geometry: a 1 m longitudinal / maximum 0.45 m lateral approach grid gives the existing actual-vertex clamp enough samples to follow ground across each panel. The main span keeps coarse lateral sampling and both LODs retain its cantilever shape, two piers, yellow centre dashes, edge markings and rail outline. No shared runtime code changed.

| Variant | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | ---: | ---: |
| Near | 41,460 / 7 / 2,391,784 | 52,422 / 7 / 2,628,320 |
| Far | 13,928 / 7 / 746,440 | 25,386 / 7 / 999,844 |

Both LODs remain within bridge budgets. Depth layers were regenerated after every export; the generated Storseisundet entry remains unchanged and the complete check passes. Deterministic metrics report no unresolved issues. Dedicated geometry/export, terrain, HD/navigation and new approach triangle-interior regression coverage pass; the Paris absent-field golden test still proves two other bridges byte-identical in both LODs and modes. The combined selected bridge/fidelity/top-cities conformance run passes all 325 tests, and the catalog/preview checks pass.

No terrain patches rise through the pavement in inspected frames. All 310 lane-position probes accept both directions, including mapped alignment vertices, with zero direction difference.

Live world pavement vertices, triangle centres and edge midpoints show **0 m penetration** in both LODs. Minimum sampled clearance is **0.073042 m near / 0.095779 m far**. Near checks 5,983 vertices plus 43,408 interior samples; far checks 5,851 vertices plus 42,880 interior samples. Cityscape's minimum is zero within 6e-16 m floating-point noise. These results close the dispatched visible approach defect; they do not establish a bound for every possible future DEM/provider.

The local focused `REPORT.md` records exact before/after metrics, commands and limits.

Surrounding islands and ground remain supplied by the map. Fill toes may be occluded by terrain as the estimated engineered support meets it; this is separate from the cleared driving surface. Exact fill topography, pier heights, abutment levels and guardrail sections remain estimates. Live HD paint continuity, tracked vehicle/route/traffic driving, the broad lifecycle/terrain-failure matrix, night/paint toggles and Tesla hardware performance remain not tested. Account CORS and unavailable optional-service errors are retained in capture logs.
