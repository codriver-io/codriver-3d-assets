# Beetham Tower — Manchester

Beetham Tower: slender glazed Manchester tower, four-metre level23 cantilever, two contrasting facade zones, low hotel wings and the thin open-louvred roof blade.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Beetham_Tower,_Manchester)
- [SimpsonHaugh:169 m,4 m cantilever at level23 and glazed blade](https://simpsonhaugh.com/projects/beetham-hilton-tower)
- [OSM provider footprint / building part 353289050](https://www.openstreetmap.org/way/353289050)
- [OSM provider footprint / building part 353289051](https://www.openstreetmap.org/way/353289051)
- [OSM provider footprint / building part 353289052](https://www.openstreetmap.org/way/353289052)
- [OSM provider footprint / building part 353289053](https://www.openstreetmap.org/way/353289053)
- [OSM provider footprint / building part 353289055](https://www.openstreetmap.org/way/353289055)
- [File:Beetham Tower seen from Bridgewater Viaduct.jpg — Michaelmazr; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Beetham_Tower_seen_from_Bridgewater_Viaduct.jpg)
- [File:Granada Studios Building and Beetham Tower in Manchester.jpg — David Brossard; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Granada_Studios_Building_and_Beetham_Tower_in_Manchester.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/beetham-tower-manchester/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-2.2521821,53.4742822,-2.2482579,53.4766178.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Highest blade | 169.2 m | OSM; architect rounded169 m |
| Main roof | 157 m | OSM; secondary158 m differs1 m |
| Cantilever transition | 72 m | OSM min-height at level23 |
| Cantilever projection | approximately4 m | Difference of exact mapped upper/lower plans; architect4 m |
| Low wings | 6 /12 m | OSM |

Origin `[-2.25032,53.47552]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped lower north edge [-2.2506151,53.4756364] to [-2.2499711,53.4755128] and upper edge [-2.2505972,53.4756686] to [-2.2499548,53.4755422] lock the baked azimuth and cantilever offset. All five provider part rings are owned; the adjacent church, viaduct and separate hotel/commercial neighbours are excluded.

## Model and foundation

The two tower volumes follow exact provider plans and meet at72 m, with the upper overhang expressed through its actual soffit. Repeated curtain-wall panels, mullions, contrasting hotel glass and staggered apartment spandrels survive far at coarser rhythm. The157–169.2 m blade is a thin roof screen with genuine slots between rails and supported corner posts, not a solid tower extension. Low mapped wings keep their glass and concrete roofs. No hotel names, signs, antennas not shown in the photos, surrounding paving or neighbouring development is included.

The architect169 m total is rounded relative to OSM169.2 m. The mapped157 m main roof is used rather than secondary158 m. Blade section, louvre spacing, facade module and glass colours are photo-calibrated estimates. Photos2 and3 show the built tower from opposite approaches; interior cocktail and different Manchester buildings are rejected.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 31193 | 6 | 346168 |
| far | 5153 | 6 | 71184 |

Deterministic QA: `tmp/batch/beetham-tower-manchester-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/beetham-tower-manchester.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/beetham-tower-manchester/beetham-tower-manchester-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/beetham-tower-manchester/beetham-tower-manchester-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: one look. The exact upper footprint retains its4 m hotel/apartment step; muted contrasting glass zones, the blade’s open slots and the low mapped wings remain in far. Tests cast through an actual slot and onto its neighbouring rail, and measure the cantilever on exported source geometry.

Independent-review revision: Dark blue-grey roof louvres provide70% projected coverage with real slots in both LODs; hotel/frame luminance contrast exceeds15% in both palettes, with the4 m cantilever retained. Coarser far bays reduce cost below6000 triangles.

Far cost: 6761 → 5153 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/beetham-tower-manchester.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
