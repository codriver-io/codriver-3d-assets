# California Palace of the Legion of Honor

Procedural near/far model of the Legion of Honor, 100 34th Avenue, Lincoln Park, San Francisco, for Codriver's San Francisco landmark set (contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md)). Source: `src/peregrine/landmarks/san-francisco/legion-of-honor/`; exports `public/models/buildings/legion-of-honor-{near,far}.glb` and `legion-of-honor.json`; catalog record `prototypes/assets3d/catalog.d/legion-of-honor.json`. Cityscape and Full 3D world are **not tested** here; integration is checked separately.

## Identity and version modelled

The museum as it stands today (2026): George Applegarth and Henri Guillaume's 1924 building, a full-size replica of the French Pavilion of the 1915 Panama-Pacific International Exposition, itself a three-quarter-scale Palais de la Légion d'Honneur (Hôtel de Salm, Paris, 1782). The 1992-95 renovation (Edward Larrabee Barnes and Mark Cavagnero) added the glass pyramid skylight in the Court of Honor; it is modelled. A driver sees, from the plaza at 100 m, the white triumphal arch between two colonnade screens and two tall end pavilions; from 800 m, a long pale mass with a skylit roof and a small dome at its far end.

What is drawn (all in cream stone unless noted):

- **U-shaped museum**: north and south gallery wings and the west museum block (OSM building:part ways, cornice 12.4 m, low hipped roofs to 14.2 m round dark skylight decks, as in the 1932 aerial), plinth, belt course and pilasters on the outer walls.
- **Entrance front (+u side)**: triumphal arch (round opening, archivolt, trumpeting-angel spandrel reliefs, cornice, attic), the colonnade entablature wrapping each pylon as a hood, two single-row colonnade screens with a second inner row, and the two end pavilions with attic parapets, relief friezes, an arched niche and two narrow windows each.
- **Court of Honor** (40 x 30 m): colonnades on all four sides (single row, about 1.8 m pitch, balustraded roofs, lit rear walls), the glass pyramid skylight, and Rodin's *The Thinker* on its plinth.
- **Portico** on the museum block, facing the arch: six Corinthian columns, architrave with inscription band, cornice and attic, over a lit recess wall.
- **Rotunda** at the back (west) end: a round apse drum with arched windows, cornice ring, a low dome and lantern.

## Frame

`+X east, +Y up, +Z south`, local metres around `origin = [-122.500759, 37.7845338]`, the centre of the mapped outline's oriented bounding box (on the building's axis of symmetry). The outline is a rectangle turned **48.91 degrees** from north (mean edge bearing of relation 21115818's outer way, weighted by edge length); its long axis `u` points to bearing 48.91, so the arch and the Court of Honor face the +u direction (north-east) and the rotunda is at the south-west. Parts are authored in the OSM outline's plan metres (`u`, `v`) and turned onto the grid once in `legion-of-honor-kit.js`. `y = 0` is the Court of Honor floor and entrance level. The bluff is not modelled; `padM = 75` covers the 94 x 60 m outline, the apse and the forecourt steps.

## Sources

| Fact | Source |
| --- | --- |
| Identity, 1924, replica of the PPIE French Pavilion, 1990s pyramid and architects, The Thinker in the court | Wikipedia, *Legion of Honor (museum)* (API read 2026-10-01) |
| Outline, court hole, orientation, portico, colonnade strips, arch pylons, apse and dome, glass pyramid, heights | OSM relation 21115818 (outer way 1540340820, inner 1540340819), building:part ways 1540337302-05, 1540327029-30, 1540333313-14, 1410202325, 1410202318, way 393275341; read through the shared Overpass helper 2026-10-01 |
| Arch, colonnade, portico, pavilion and court proportions | Photographs listed in the catalog provenance (Mpasques 'Façade', Highsmith LCCN2011630619, NARA 1932 aerial, 1920s-30s postcards) |

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Outline (u x v) | 93.8 x 60.5 m | mapped (OSM) |
| Orientation of the long axis | 48.91 degrees from north | mapped (edge mean) |
| Court of Honor | 40.1 x 30.0 m, axis at v = -17.8 | mapped |
| Colonnade strips | 2.8 m deep, 8.2 m high (columns 5.9 m to the entablature, balustrade to 8.2) | width mapped; heights estimated |
| East screens | 3.8 m deep, 12.2 m long each side of the arch | mapped; columns estimated |
| Arch block | 10.7 x 4.9 m, opening 4.8 m, crown 10.0 m, cornice 11.6 m, top 13.0 m | width/depth mapped; opening and heights estimated from the photograph |
| Portico | 12.6 m wide, projects 5.6 m, top 12.0 m; six columns about 1.0 m diameter at 2.16 m | width/depth mapped; columns, heights estimated |
| Wings and museum block | cornice 12.4 m, roof deck 14.2 m, hip run 3.2 m; end-pavilion attic 13.6 m | OSM (17 m ridge, roof 2 m) minus the 3 m base, see below; pitch estimated |
| Rotunda | apse radius 7.0 m centred 39.8 m from the origin along the axis, toward the rotunda end; dome base radius 6.6 m, top 18.0 m | mapped (dome way 1410202318); drum and dome profile estimated |
| Glass pyramid | 7.4 m diagonal, 1.0 m rise, rotated 45 degrees to the court | mapped (way 393275341) |
| Total height | **18.0 m** (`SPEC.height`) | OSM 21 m minus the 3 m base |

**The 3 m base.** OSM tags give dome 21, wings 17, arch 16 (crown 13), portico 15 and colonnades 11 m. Measured against their mapped widths in the photographs, the arch is about 12.5-13 m, the portico about 12 m and the colonnade balustrade about 8.2 m above the court floor: each is close to the OSM value minus 3 m, so the OSM heights evidently count from the lowest grade (the building is a storey taller on its west and south sides, where the bluff falls away). The model puts `y = 0` at the court and entrance level, subtracts 3 m, and keeps every wall standing on `y = 0`; the basement storey below it is not drawn. This is an estimate and is flagged in the catalog notes and manifest.

## Materials

`stone` (cream limestone), `shade` (slightly darker stone: the arched niches and narrow windows of the end pavilions only; the angel reliefs, friezes and inscription band are shallow stone-colour relief panels, an inset frame plus a raised field), `roof` (pale metal skirts of the hipped roofs), `glass` (skylight bays, glass pyramid, drum windows), `glow` (the colonnade and portico rear walls, drawn unshaded: warm-lit at night, shadowed stone by day), `dome`, `bronze` (The Thinker). Near uses seven materials; far five (`shade` and `bronze` dropped). Palettes light and dark carry the same keys.

## Modelling decisions

- Everything is merged by material: columns (8-sided shafts near, 4-sided far) with square base and capital, balusters as 8-triangle prisms (cap faces hidden under the rails are dropped), pilasters, belt course and reliefs as boxes. Far drops pilasters, belt course, plinth, balusters (solid parapets), reliefs, windows, skylight bays, arch mouldings, the inner column row of the east screens and the colonnade column bases and capitals (4-sided shafts only; the portico keeps capitals) but keeps the arch opening, the open colonnades, the portico, the pavilions, the roofs and the dome.
- The colonnades stay **negative space in both LODs**: eye-height rays between the columns of the east screen pass through to the court's west wall (asserted in the tests).
- The main mass is one extruded polygon of the outline with the court cut out, so no two wall boxes share a plane; plinth and cornice bands are filled once at each corner; every added strip starts or ends inside the volume it meets, or is inset 0.05 m (ashlar courses, balustrade ends). A scratch coplanar-overlap scan (`tmp/san-francisco/legion-of-honor/coplanar.mjs`) reports only back-facing faces hidden inside the walls.
- Roofs are low hips round a flat pale deck carrying dark glass skylight bays between 0.55 m bars (about 7 m bays, two across the wide block roofs), as the dark segmented decks in the 1932 aerial; far keeps one glazed deck per roof.
- The Thinker stands on the arch side of the pyramid (u = 7.4, the Highsmith court photograph) on a 1.6 m plinth (about 0.9 x the 1.85 m figure), as a seated, forward-leaning stack of bronze blocks (rock, thighs, shins, back, torso, arm to the knee, bowed head).

## Approximations and not modelled

Estimated, not measured: arch opening width and crown, colonnade pitch and column proportions, portico column spacing, roof pitch, drum height, dome profile, window and niche shapes, relief panels, pilaster rhythm and every height (see the 3 m base). Not modelled: statuary other than The Thinker, the lions, El Cid, the balustraded forecourt terraces and steps, lettering, ashlar joints on the long walls, interiors, the underground gallery, the basement below the court and the bluff. Stone texture and colour are flat palette colours.

## Cost

| | triangles | draws | bytes |
| --- | --- | --- | --- |
| near | 9 432 | 7 | 579 KB |
| far | 2 120 | 5 | 97 KB |

Budget (building): near 60 000 / 14 / 2.5 MB; far 12 000 / 8 / 500 KB. Geometry is non-indexed flat-shaded, so bytes per triangle are high; headroom is large.

## Verification (2026-10-01)

Rendered with `node tmp/san-francisco/shot.mjs legion-of-honor` (procedural and `--source glb`, near and far, light and dark) into `tmp/san-francisco/shots/legion-of-honor/`:

- Plan (`--top`): the model sits inside the red OSM outline; the pyramid diamond matches its mapped ring; the apse follows the mapped bulge.
- Overview, entrance front, court-through-the-arch, arch detail, rotunda, south wall, roofs-from-above, 100 m and 800 m driver views, compared against the 'Façade', Highsmith court, NARA aerial and postcard references.
- Exported GLBs (near light overview/arch/back/rotunda; far light overview/court/arch; far dark facade; near dark overview/facade) match the procedural renders.

Review round (2026-10-01, PASS-WITH-NITS): The Thinker moved to the arch side of the pyramid with the 1.6 m plinth and a seated silhouette; the angel reliefs, pavilion friezes and inscription band became stone-colour relief panels (they read as windows before); the roof decks became segmented skylight bays; far lost the inner colonnade row and the column bases/capitals (3 500 to 2 120 triangles). Re-rendered the court and an 800 m view from the exported GLB.

Looks that changed the model: the first render showed saturated blue skylight decks and pale, too-wide pilaster strips (darker glass and roof palette, wider pilasters with more relief); the tests then caught a missing cornice soffit and missing balustrade rail tops (hole seen from below/above; restored) and the coplanar scan found ashlar courses sharing the arch jamb planes and balustrade rails overlapping at corners (inset). The niche was lifted onto the plinth.

Tests: `node --test src/peregrine/landmarks/san-francisco/legion-of-honor/legion-of-honor.test.js` (mapped outline size and orientation, 18 m dome over the rotunda, arch 13 m, portico 12 m, colonnades 8.2 m, open arch and open colonnades by raycast, glass pyramid, containment in the mapped outline, no back-facing first hits from above, far silhouette, GLB round trip) and the shared `san-francisco.test.js` entries for this id.

Not verified: Cityscape and Full 3D world integration, terrain pad behaviour on the Lincoln Park bluff, in-car performance.

## Rebuild

```sh
pnpm build:san-francisco-landmarks legion-of-honor
node tmp/san-francisco/shot.mjs legion-of-honor --source glb
```
