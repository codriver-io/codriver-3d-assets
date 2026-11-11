# Emirates Stadium — London

Emirates Stadium: mapped oval bowl with a rounded-rectangle open roof aperture, pale roof and translucent inner strip, four primary steel trusses on eight cores, glazed curved exterior and muted red seating around the full-size football pitch.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Emirates_Stadium)
- [Populous: elliptical roof supported on eight cores and glazed perimeter](https://populous.com/showcases/emirates-stadium)
- [Sir Robert McAlpine: stadium construction and 27,200 m² roof](https://www.srm.com/projects/emirates-stadium/)
- [ICE: four principal steel trusses](https://www.ice.org.uk/what-is-civil-engineering/infrastructure-projects/emirates-stadium)
- [OSM provider footprint / building part 193811136](https://www.openstreetmap.org/way/193811136)
- [OSM provider footprint / building part 193811138](https://www.openstreetmap.org/way/193811138)
- [OSM provider footprint / building part 193811140](https://www.openstreetmap.org/way/193811140)
- [OSM provider footprint / building part 193811141](https://www.openstreetmap.org/way/193811141)
- [File:Emirates Stadium - canons.jpg — Ronnie Macdonald; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Emirates_Stadium_-_canons.jpg)
- [File:London Emirates Stadium arsenal.jpg — Arne Müseler; CC BY-SA 3.0 de; comparison only](https://commons.wikimedia.org/wiki/File:London_Emirates_Stadium_arsenal.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/emirates-stadium/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.1120120,51.5527542,-0.1047880,51.5572458.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Highest primary truss | 41.5 m | Mapped stand height; roof profile estimated from photos |
| Mapped exterior bounds | 197.9 × 245.2 m | Union of the four OSM stand polygons |
| Roof aperture | Exact mapped rounded-rectangle inner ring | Union hole, about 86 × 128 m |
| Pitch | 68 × 105 m | Standard venue field dimensions; marked texture-free |
| Primary roof structure | 4 trusses / 8 cores | Architect and engineering sources |
| Body / upper terrace | 27 m | Photo estimate |
| Primary truss core / depth | 29.5 m cores, 32.8 m fork caps / 6.5 m trusses | Photo-calibrated estimate |

Origin `[-0.1083428871,51.5550084855]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped west inner edge [-0.1090073,51.554646] to [-0.1089786,51.555489] fixes the pitch axis about 1.21° east of north; the east edge [-0.1077701,51.555459] to [-0.1077978,51.5546252] confirms the same skew. The four stand footprints are unioned into exact outer and inner rings; all positions are exported east/up/south, with orientation baked once.

## Model and foundation

The roof uses the mapped oval exterior and rounded-rectangle opening, with a translucent inner strip and closed underside/edges. Four shallow arched lattice trusses connect eight supported cores; each chord, web and post is tested against named support geometry in both LODs. The curved facade keeps horizontal bands and separate glazed bays, with a small upper setback rather than a solid stadium cylinder. Inside the opening, coarse stepped seating remains visibly red in far, and a 68 × 105 m field has adjacent grass/line partitions at y=0.16 m, above local grade with no layered paint. The surrounding plaza, bridges, statues and housing are excluded. The original built roof is retained; expansion proposals and club artwork are not modeled.

OSM 41.5 m stand height sets the overall roof/truss envelope. Roof curvature, steel sections, core positions, seating terraces, facade glazing and local field datum are estimates; the four mapped stand plans and open aperture are exact. The model represents the current built stadium envelope, with no proposed expansion, logos, lettering, mural artwork, statues, crowds or neighbouring structures.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 20468 | 7 | 280876 |
| far | 5828 | 7 | 92848 |

Deterministic QA: `tmp/batch/emirates-stadium-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/emirates-stadium.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/emirates-stadium/emirates-stadium-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/emirates-stadium/emirates-stadium-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The final roof has flush steel panel divisions and a translucent inner strip; deeper four-truss steelwork meets eight Y-fork cores, with dark muted red seating in both LODs. The front retaining wall and upper concourse close and support the seating bowl. Logos, murals and surrounding bridges remain outside this asset.

Independent-review revision: Far roof, envelope and red bowl use 48 mapped-radius sectors and four broad seating tiers; the complete four-truss/eight-core support system, forks and open aperture remain. Near GLB is byte-identical.

Far cost: 8440 → 5828 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/emirates-stadium.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
