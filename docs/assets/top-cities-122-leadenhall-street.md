# 122 Leadenhall Street — London

The Leadenhall Building (Cheesegrater): 10.62° sloping south face, exposed pale steel megaframe, raised office wedge over the open public gallery, external service block and stepped rear lift wings with an open roof trough.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/122_Leadenhall_Street)
- [Building owner: south face inclination 10.62°](https://theleadenhallbuilding.com/the-building/our-vision/defining-a-landmark/)
- [Structural engineer paper: 224 m tower and megaframe](https://www.istructe.org/journal/volumes/volume-96-%282018%29/issue-4/structural-engineering-of-the-leadenhall-building/)
- [OSM provider footprint / building part 309413981](https://www.openstreetmap.org/way/309413981)
- [OSM provider footprint / building part 309413982](https://www.openstreetmap.org/way/309413982)
- [OSM provider footprint / building part 309415710](https://www.openstreetmap.org/way/309415710)
- [OSM provider footprint / building part 309415707](https://www.openstreetmap.org/way/309415707)
- [OSM provider footprint / building part 717955963](https://www.openstreetmap.org/way/717955963)
- [OSM provider footprint / building part 717955964](https://www.openstreetmap.org/way/717955964)
- [OSM provider footprint / building part 717955965](https://www.openstreetmap.org/way/717955965)
- [OSM provider footprint / building part 1138764582](https://www.openstreetmap.org/way/1138764582)
- [OSM provider footprint / building part 1138764583](https://www.openstreetmap.org/way/1138764583)
- [File:TheLeadenHallBuilding.jpg — FeydHuxtable; CC0; comparison only](https://commons.wikimedia.org/wiki/File:TheLeadenHallBuilding.jpg)
- [File:Top of the Cheesegrater from Horizon 22.jpg — The wub; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Top_of_the_Cheesegrater_from_Horizon_22.jpg)
- [File:London 122 Leadenhall Street lifts 1.jpg — Ymblanter; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:London_122_Leadenhall_Street_lifts_1.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/122-leadenhall-street/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.0840322,51.5128220,-0.0805678,51.5149780.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Architectural height | 224.5 m | OSM; structural paper rounds to 224 m |
| South face slope | 10.62° from vertical | Building owner |
| Main office underside | 28.5 m | Mapped part 309413982 |
| Lower glazed gallery stages | 4–20.5 / 20.5–24.5 / 24.5–28.5 m | Mapped parts 717955963/965/964 |
| Rear wings | 196 / 130 / 65 m | Mapped parts |
| Roof trough | 218.5 m floor, 224.5 m frame | Photo estimate |
| Frame bay grid | 28 m vertical modules, 46.8 m width | Photo estimate fitted inside mapped envelope |

Origin `[-0.082295,51.5139]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

South frontage controls [-0.0826433,51.51362] and [-0.0819433,51.5136221] fix the approximately 89.72° edge bearing. The rear edge [-0.0826459,51.5139547] to [-0.0819458,51.5139568] independently verifies the near east/west orientation. All rear wings use their exact mapped rings. The glass is inset behind the mapped structural frame; member cross-sections project less than 0.8 m beyond their centre lines.

## Model and foundation

The main glazed wedge is raised above y=28.5 and slopes north at the sourced angle. A floor grid follows the inclined front and tapered side faces rather than a plain triangular extrusion. The pale exoskeleton has three front/rear column lines, 28 m levels and complete diagonal megaframe modules in near and far. Every beam and brace is a named authoring part whose endpoints are tested against named support geometry, excluding itself, with detached-end negative controls. The lower stepped glazed gallery volumes retain their mapped minimum heights, leaving the street-side public-gallery void open. The full-height service block supports the office wedge; its roof has an open framed trough with seated plant. Mapped rear wings retain their stepped heights. Structural feet sit at y=0; no plaza or terrain surface is authored.

224.5 m mapped height is used versus the structural paper rounded 224 m. The 10.62° south slope and mapped lower-gallery/wing heights are retained. Glazing pitch, steel sections, frame module count, roof trough and service details are photo estimates. Glazing is inset to keep the exoskeleton inside the mapped outer frame; the uppermost glazed tip is simplified behind the roof frame. Interior escalators, roof maintenance equipment beyond simple seated plant, lettering and logos are omitted.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 31007 | 6 | 326500 |
| far | 5994 | 5 | 84128 |

Deterministic QA: `tmp/batch/122-leadenhall-street-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/122-leadenhall-street.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/122-leadenhall-street/122-leadenhall-street-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/122-leadenhall-street/122-leadenhall-street-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

The inspected near/far contact sheet shows the inclined south glass, complete pale megaframe, open public-gallery feet, stepped rear services and recessed roof trough. Current completed-exterior photographs 3, 6 and 7 were checked; construction photographs, the demolished predecessor and the 22 Bishopsgate image were rejected. Roof-frame centre lines sit at 224.0 m so their sections reach the declared 224.5 m top. The exposed rear lift cars are omitted rather than represented by hidden boxes. Steel base shoes and a low steel plinth unify the structural contacts; hidden ground caps are omitted, and roof parapets end below the upper frame to avoid depth cycles. Every structural terminal passes against its named support, with detached-end negative cases. One visual look; zero unresolved QA flags. The far model keeps all primary diagonals and a coarser separate window grid.

Independent-review revision: Far service grids and glazed wedge use coarser separated rows and bays; near geometry is byte-identical. Hidden beam end caps and collinear footprint points are removed, tiny roof plant is grouped, and nearly identical far steel/frame materials are merged; the full diagonal exoskeleton and open lower gallery remain.

Far cost: 9143 → 5994 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/122-leadenhall-street.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
