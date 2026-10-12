# Oratoire Saint-Joseph

Copper dome and octagonal drum above the stone basilica, open colonnade, crypt terrace and monumental approach stairs.

Authored 2026-09-27 from primary dimensions, reference photos and OSM footprint. Original procedural geometry, no copied mesh or photo textures. Placement © OpenStreetMap contributors, ODbL. Reference photographs are not redistributed.

Original procedural model; local hillside compressed to 24 m at basilica floor with solid foundations. Vehicle roads are unchanged. Fine sculpture, interior, surrounding annexes and modern reception complex are omitted.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.6165115625, 45.49188]`. Heights are visual approximations.

## Build

`pnpm build:oratoire-saint-joseph`

Source: [`src/peregrine/landmarks/oratoire-saint-joseph-geometry.js`](../../src/peregrine/landmarks/oratoire-saint-joseph-geometry.js)

## References

- [Montréal landscape and access history](https://montroyal.montreal.ca/paysage-oratoire-saint-joseph-mont-royal)
- [Oratory must-sees](https://saint-joseph.org/en/the-staples/)
- [Oratory basilica dimensions and datums](https://saint-joseph.org/en/incontournable/the-basilica/)
- [OSM basilica relation 6275154](https://www.openstreetmap.org/relation/6275154)
- [OSM mapped dome](https://www.openstreetmap.org/way/132499529)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). portico has an entablature and an attic with the great arch under the front pediment; turret roofs are reddish-brown copper; aisle windows and buttresses sit on the walls. Exported cost: near 8,483 triangles / 7 draws / 414,308 bytes; far 4,191 / 7 / 225,252.

## Local grounding

The flat renderer cannot reproduce the full hillside without relocating its
roads. The model uses solid foundations down to −0.4 m, a crypt terrace at
15.55 m, basilica floor at 24 m and cross top at 121 m. The implied real rise
from the published figures is roughly 58 m (155−97); compressing that to 24 m
is an explicit visual approximation, not surveyed topography. The body dimensions
and 97 m exterior height are retained. The central lower stairs rise from ground
to 8 m, side flights reach the crypt terrace, and the main 61-step flight reaches
the colonnade. The distant LOD reduces tread counts but retains these levels.

Foundations follow the mapped basilica and crypt; narrow grass/stone terraces
are confined to the pedestrian axis. Chemin de Kingston, private service access,
parking aisles and Rue Surrey Gardens keep their original pavement and navigation
height. There is no road masking, bridge surface,
car/route lift or citywide terrain change. Cityscape exposes the compressed retaining faces. Full 3D world uses the bounded terraces declared in the config to transition into the hill.
The rear-west foundation corner is narrowed to leave space beside Kingston;
the raw mapped outline comes within about 2.3 m of its centreline. Ray checks
cover the retained access ways at two-metre intervals and lateral offsets of
−3, 0 and +3 m. This validates a six-metre corridor, not every possible provider
pavement width. Pedestrian cross-paths remain at basemap height and are not a
walkable navigation simulation through the new stairs.

## Implementation and integration

Editable generator: `src/peregrine/landmarks/oratoire-saint-joseph-geometry.js`.
It reuses the material batching helper. Both LODs keep the tall lofted copper
dome and ribs, octagonal drum/windows, four corner turrets, pitched nave and
transept roofs, apse, the attic pediment, a six-column portico with arched doors
behind each bay, open lantern, crypt terrace and supported stairs. Turret
roofs use the `wood` material, recoloured reddish-brown (`#8a5a47`) like the unweathered
copper in the photographs, while the dome and roofs keep green patina. Hidden faces
(buried stair undersides over the lawn strip, crypt slab caps against each other, the
turret shaft tops under their cornices) are not emitted, and revised facade overlays sit at least 10 cm off their backing surfaces; the great arch has a real recessed reveal. Windows are dark inset planes; capitals,
sculpture and masonry are simplified. Adjacent annexes/reception structures and
interiors are outside scope and retain the generic map geometry.

The dedicated layer is added to `MontrealLandmarksLayer`, so ordinary Cityscape
loads it without a special URL. It uses regional lazy loading, near/far distance
and zoom hysteresis, MCU2 far detail, vertex shading, theme palettes, reanchoring,
epoch protection, retry backoff and disposal. Existing geometry stays visible
until successful model activation. Only building triangles wholly inside the
mapped basilica/crypt footprint are suppressed, using shared composable masks;
disable, 2D, leaving the region and disposal restore them. No per-frame mesh work.

The existing local asset inspector gains procedural/GLB comparison and dedicated
overview, façade, roof and approach viewpoints for this asset. The map inspector
uses the committed normal Peregrine bundle.

## QA revision 2026-10-11

QA 2026-10-11: actual recessed facade arch, deeper portico, shallow pediment relief and crypt bays. Round 1 used terrain terraces at +2/+4/+6.5/+8/+15/+19.8/+24 m, which the independent re-review found buried parts of the approach. The Round 2 policy below supersedes those terrain offsets.

Current measured exports: near: 8,831 triangles / 7 draws / 430,916 bytes; far: 4,363 triangles / 7 draws / 233,792 bytes. Geometry metrics report no unresolved issues.

Current mode validation (2026-10-11): **Cityscape verified; Asset readiness and inspector output alone were not used to establish terrain verification.

## Round 2: continuous hillside approach (2026-10-11)

The terrain lattice is about 27 real metres across at this latitude. Thin rings
at the walking levels let interpolation from higher nodes cut through stairs
and landings. The Oratory-only terrain configuration now uses wider, bounded
rings and delays rising ground grades uphill: -0.6, +1.4, +3.4, +5.9, +7.4,
+14.4, +19.2 and +24 m. The exact walking datums remain in the rigid stone
geometry, including the 15.55 m crypt landing and 24.025 m entrance landing;
these ground offsets are clearance grades beneath them, not replacement floor
heights. The basilica floor stays at 24 m. Cityscape, source geometry and both
exported GLBs are byte-identical to Round 1.

Near/far regression tests ray-check every flight and landing at quarter-metre
intervals against the actual world TIN.
provides far/near/street captures and an unobstructed front view; the dense live
probe checks 2,682 approach points with public Terrarium DEM at zoom 13 and
exaggeration 1. Current costs stay 8,831 triangles / 7 draws / 430,916 bytes
near and 4,363 / 7 / 233,792 far. See the Round 2 section of

The hill remains a compressed visual approximation. The coarse mesh slopes
beneath solid stair supports, leaving short retaining faces at the steepest
transitions; it does not reproduce every tread as terrain. Other exaggerations,
terrain resolution transitions, real-device performance and signed-in navigation
are not certified by these captures. No shared renderer implementation or road
mask/surface ownership changed; no online release was performed.
