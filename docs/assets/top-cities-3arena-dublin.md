# 3Arena — Dublin

3Arena: the retained Point Depot brick frontage with granite arched openings and narrow upper windows, slate hip roof and chimneys, in front of the larger silver-clad modern arena.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/3Arena_(Dublin))
- [Populous:2008 arena retained the listed warehouse facade](https://populous.com/projects/the-o2-dublin)
- [Walls Construction: original Point and arena redevelopment](https://walls.ie/project/the-3-arena-north-wall-quay-dublin-1/)
- [Concast: facade retained within a tight envelope](https://concast.ie/portfolio/o2-arena/)
- [OSM provider footprint / building part 23722561](https://www.openstreetmap.org/way/23722561)
- [File:3 Arena (Dublin) in 2025.01.jpg — CAPTAIN RAJU; CC0; comparison only](https://commons.wikimedia.org/wiki/File:3_Arena_(Dublin)_in_2025.01.jpg)
- [File:The O2 In Dublin (5864444928).jpg — William Murphy from Dublin, Ireland; CC BY-SA 2.0; comparison only](https://commons.wikimedia.org/wiki/File:The_O2_In_Dublin_(5864444928).jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/3arena-dublin/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-6.2311077,53.3460627,-6.2262923,53.3489373.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Modern hall roof | 26.5 m | Exterior-photo estimate; no mapped measured height |
| Historic cornice / hip ridge | 16.5 /18.4 m | Photo estimate |
| Chimney tops | 20.2 m | Photo estimate |
| Main frontage | approximately57 m | Exact mapped front edge |
| Front openings | 11 lower arches /22 upper window bays | Photo-calibrated rhythm |

Origin `[-6.22845,53.3475]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Historic south facade controls [-6.2288345,53.3469776] to [-6.227988,53.3469209] set the approximately6.4 degree south-of-east facade axis. Rear edge [-6.2286345,53.3480494] to [-6.2277479,53.3479899] confirms the shared grid. The single provider outline is split into an original low front strip and a setback modern hall at an explicitly estimated depth, keeping every perimeter control in the ownership mask.

## Model and foundation

The foreground block has real recessed arched glazing and intrados rather than painted arch shapes; its narrow upper windows and rusticated stone base survive far. A low slate hip roof and six small brick chimneys retain the old warehouse silhouette. The silver modern arena behind it follows the mapped plan with panel divisions, a closed roof and recessed-looking service louvres. The different 2011 signage in photo2 is excluded; photo1 confirms the retained2025 frontage. The adjacent EXO and office buildings, former Ferris wheel, gates, street furniture and all logos/lettering are omitted.

No reliable measured height is supplied by the provider or the consulted architects, so26.5 m hall,16.5 m facade,18.4 m hip ridge and20.2 m chimneys are documented photo estimates. Historic/modern split depth, bay spacing, roof pitch and metal modules are estimates within the exact mapped overall envelope. Exterior photos1 and2 show the same completed2008 building with changed branding and neighbours; interior photo3 is rejected.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 10942 | 6 | 128288 |
| far | 3704 | 6 | 53748 |

Deterministic QA: `tmp/batch/3arena-dublin-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/3arena-dublin.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/3arena-dublin/3arena-dublin-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/3arena-dublin/3arena-dublin-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The retained frontage keeps11 actual arched recesses,22 narrow upper windows, the hip roof and six supported chimney caps in far. The final brick and slate are darker, with restrained variation in the modern metal panel bays; the original listed facade remains the principal road-facing cue without branding.

Independent-review revision: Periodic diagonal checker shading is removed from the modern silver hall in both LODs. Geometry, facade seams and the historic arched brick frontage remain unchanged.

Far cost: 3704 → 3704 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/3arena-dublin.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
