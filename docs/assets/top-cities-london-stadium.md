# London Stadium — London

London Stadium in its post-2016 form: broad open cable-net roof, white lattice compression ring, inverted floodlight paddles, sloping external support legs and a dark-and-pale seating bowl.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/London_Stadium)
- [Olympic Park: expanded84 m cantilever roof](https://www.queenelizabetholympicpark.co.uk/our-stories/stadium-roof-begins-take-shape-queen-elizabeth-olympic-park)
- [Olympic Park: fourteen new inverted18 m floodlight paddles](https://www.queenelizabetholympicpark.co.uk/our-stories/transformation-lights-former-olympic-stadium)
- [PFEIFER: completed2014–2016 replacement cable-net roof](https://www.pfeifer-structures.com/projects/london-stadium/)
- [OSM owned multipolygon relation10266378](https://www.openstreetmap.org/relation/10266378)
- [OSM provider footprint / building part 486297861](https://www.openstreetmap.org/way/486297861)
- [OSM provider footprint / building part 172788640](https://www.openstreetmap.org/way/172788640)
- [File:London Olympic Stadium West Ham.jpg — Arne Müseler; CC BY-SA 3.0 de; comparison only](https://commons.wikimedia.org/wiki/File:London_Olympic_Stadium_West_Ham.jpg)
- [File:London Olympic Stadium September 2016.jpg — Kittelträger; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:London_Olympic_Stadium_September_2016.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/london-stadium/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.0206439,51.5360847,-0.0125561,51.5411153.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Compression-ring top | 53 m | Mapped building relation |
| Main roof outer / inner edge | 40 / 36 m | Photo estimate within mapped envelope |
| Roof aperture | Exact mapped inner ring | Relation10266378 |
| Floodlight paddles | 14 ×18 m hanging down | Olympic Park owner |
| Field | 68 ×105 m | Texture-free football configuration |

Origin `[-0.01658,51.53867]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

The north inner ring controls [-0.0165154,51.5393169] and [-0.016587,51.5380361] constrain the principal axis close to true north. The exact east and west ring control points [-0.0157335,51.5386947] and [-0.0172895,51.5386103] fix the baked geographic scale and asymmetric aperture. Outer and inner way ownership is recorded through relation10266378.

## Model and foundation

The broad2016 roof connects mapped outer and inner rings, with a flush translucent inner strip and cable/rib divisions. White V-braced compression-ring steel rises above the membrane, while14 inverted triangular floodlight paddles hang below the aperture ring. Named structural members join explicit ring/footing supports in both LODs, tested with detached negative controls. The external envelope has sloping legs and neutral plain wrap panels; neither historic2012 above-roof light towers nor branded wrap artwork is exported. A coarse two-colour bowl and full football field remain visible through the real aperture. Pitch and field margins are at y0.16 m. Surrounding plazas, bridges, Orbit and vendor structures are excluded.

The53 m overall height is an OSM estimate. Ring chord sections, member spacing, membrane sag, concourse heights, paddles placement, seat rows and football configuration are photo-calibrated estimates. The current post2016 roof is represented; the narrower2012 roof and removed above-roof triangles are not. Published45000 m² and contractor40000 m² roof figures describe different scopes; mapped rings determine this model without forcing either area.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 35915 | 8 | 505268 |
| far | 5907 | 8 | 116188 |

Deterministic QA: `tmp/batch/london-stadium-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/london-stadium.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/london-stadium/london-stadium-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/london-stadium/london-stadium-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: one contact sheet. The completed2016 roof has the broad membrane,14 inverted light paddles, white outer compression ring and visible open pitch; all named beam ends and lamp rails meet explicit supports in both LODs. The far shell samples56 directions while near retains all mapped contour controls; far keeps the complete ring, legs, bowl and paddles without branded artwork.

Independent-review revision: Far canopy/envelope use 42 sectors and four seating tiers; 28 perimeter structural bays and all fourteen paddles remain. Hidden beam end caps are omitted and far lamps are grouped per rail; near GLB is byte-identical.

Far cost: 9435 → 5907 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/london-stadium.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
