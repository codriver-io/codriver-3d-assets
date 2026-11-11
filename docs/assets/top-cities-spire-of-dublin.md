# Spire of Dublin — Dublin

Spire of Dublin: the slender120 m stainless-steel cone,3 m at its base and150 mm at the tip, with restrained section joints and a pale upper12 m.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Spire_of_Dublin)
- [Ian Ritchie:120 m height and3 m diameter](https://www.ritchie.studio/projects/dublin/)
- [Structural engineer/designer paper:150 mm tip](https://www.ritchie.studio/wp-content/uploads/2011/02/IStructE-Paper.pdf)
- [IMOA: upper12 m lighting zone and stainless steel construction](https://www.imoa.info/molybdenum-uses/molybdenum-grade-stainless-steels/architecture/stainless-steel-spire-graces.php)
- [OSM provider footprint / building part 96578181](https://www.openstreetmap.org/way/96578181)
- [File:The Spire-doyler79.jpg — Doyler79; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:The_Spire-doyler79.jpg)
- [File:The Spire.jpg — Almbauer; Public domain; comparison only](https://commons.wikimedia.org/wiki/File:The_Spire.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/spire-of-dublin/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-6.2615039,53.3490814,-6.2590961,53.3505186.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Overall height | 120 m | Designer; OSM121.2 m differs1.2 m |
| Shaft base diameter | 3 m | Designer; mapped ring is smaller and treated as a center/alignment control |
| Tip diameter | 0.15 m | Designer engineering paper |
| Pale upper zone | 108–120 m | Published upper12 m illumination zone; non-emissive material |
| Small base disc | 0.12 m top | Local estimate, above grade |

Origin `[-6.26025435,53.3498013]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Center is fitted to way96578181. North/south mapped controls [-6.2602536,53.3498111] and [-6.260252,53.3497912] fix the geometric axis and near-north facet phase; the axially symmetric shaft does not depend on yaw. The exact small mapped ring remains in PARTS; the runtime replacement mask uses the published3 m base plus a0.1 m margin, rather than a sub4 m² OSM control ring.

## Model and foundation

Original closed conical shell in metre units, with a3 m base and150 mm closed tip. Circumferential construction seams are narrow adjacent material bands, not stacks of floating rings; the upper12 m stays identifiable in far through a pale material. A small base disc reaches y0.12 m so it clears local grade. The shaft is grounded on that disc; no plaza, street furniture, lettering or traced base artwork is included. Its simple silhouette remains below2000 triangles in each LOD.

The designer’s120 m height takes precedence over the mapped121.2 m. The mapped footprint is used for center/alignment rather than diameter because its approximately2.2 m span disagrees with the published3 m base. Section-joint positions and plain base disc are estimates; the patterned base artwork and illumination perforations are omitted rather than copied. Tip lighting is represented by material colour with no emissive bloom.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 1272 | 4 | 22868 |
| far | 632 | 4 | 15384 |

Deterministic QA: `tmp/batch/spire-of-dublin-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/spire-of-dublin.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/spire-of-dublin/spire-of-dublin-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/spire-of-dublin/spire-of-dublin-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: one look. The whole slender shaft, restrained joint bands, pale upper12 m and closed150 mm tip survive far. The small base disc clears grade by0.12 m, with original base artwork, lettering and lighting effects omitted. Mapped-control facet phase1.619 radians is baked into the vertex positions; the axial shape remains unchanged.
