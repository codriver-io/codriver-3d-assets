# Conservatory of Flowers (San Francisco)

`conservatory-of-flowers`: the 1879 wood-and-glass Victorian greenhouse at 100 John F Kennedy Drive, Golden Gate Park, the oldest building in the park. Original procedural model, near and far GLBs. Contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). Files: `src/peregrine/landmarks/san-francisco/conservatory-of-flowers/` (`config`, `footprint`, `geometry`, `views`, `conservatory-of-flowers-kit.js`, `conservatory-of-flowers-parts.js`, `conservatory-of-flowers.test.js`).

## What a driver sees

A white glass pavilion with a ribbed dome, a lit drum and a finial about 18 m high, flanked by two long, low, arch-framed glass wings that end in cupola-topped lobes turned toward the lawn. At 100 to 300 m the dome and the symmetric wings are the silhouette; at night the walls, drum and lantern glow warm (`glow`) under dark glass roofs.

## Frame and orientation

Authoring frame: `p` along the building's long axis, `q` toward the entrance (south), `y` up, origin on the dome axis. The whole mesh is rotated once by **5.9 degrees** (axis turned anticlockwise from east-west, east end further north) inside the kit, so the model sits in its mapped outline; `frontageBearing` is 174 deg. The angle is the median of seven long edges of OSM way 30675038, which all read between 173.2 and 174.6 (or -5.8 to -6.0) degrees. `y = 0` is the foot of the masonry foundation course; the entrance stair, lawn terraces and the slope of Conservatory Valley are not modelled (ADR-0045: the host places a rigid foundation; `padM` 48 covers the 41 m reach of the outline).

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Built | 1879, wood skeleton with glass walls on a raised masonry foundation | Wikipedia, Conservatory of Flowers |
| Dome height | "nearly 60 feet (18 m)" | Wikipedia (SPEC.height 18) |
| Overall length | 240 ft (73 m); mapped outline 74 m | Wikipedia; OSM way 30675038 |
| Plan | shallow E-shaped plan along an east-west axis; octagonal pavilion; one-story glazed gable-roof vestibule on the south side; wings L-shaped with cupolas where the two segments meet; dormers east, west and south; Tudor arches | Wikipedia |
| Outline, axis, widths | way 30675038 (`building=conservatory`, `height=15`) | OSM, via the shared Overpass queue |

## Dimensions: sourced, mapped or estimated

| Item | Model | Basis |
| --- | --- | --- |
| Highest point (lantern spire) | 18.0 m | sourced |
| Overall length on the axis | 74.2 m (plinth) | mapped (73 m published) |
| Pavilion plan | 17.4 x 17.0 m chamfered square (3.1 m chamfers), walls 0.5 to 5.6 m | mapped plan, wall height estimated |
| Vestibule | 7.5 m wide, 7 m deep, ridge 5.1 m | mapped plan, heights estimated |
| Shoulder roof top, drum, dome crown | 8.6 m, 10.8 m, 15.0 m | estimated from photographs (front elevation scaled on the 73 m length) |
| Dome | 8.8 m diameter, 4.3 m rise, 8 ribs | estimated |
| Wing hall | 10.8 m between walls, eaves 2.6 m, ridge 5.0 m (lowered from 5.4 m after review: about 4.9 m in the front elevation), Tudor arch (n = 2.3) | mapped width, heights estimated |
| Lobe | 10.8 m wide, 20 m from the hall's north face to its faceted south end | mapped |
| Cupola | octagonal glazed lantern (0.95 m), cornice, ogee roof and ball finial; tip 7.5 m, 2.5 m over the ridge (was 9.4 m; the harley front elevation shows about 2.3 m) | mapped position, form and height estimated |
| Alley between wings and rear houses | 3.1 m | mapped (the outline has a slit) |
| Rear service houses | six blocks, 4.4 to 4.8 m | plan mapped, **form and heights estimated** from an aerial view |
| Masonry footing | 0.5 m | estimated |

## Materials

`stone` (foundation course), `frame` (white-painted wood: arch ribs, purlins, mullion posts, cornices, dormers, lantern and spire), `glass` (roof glazing, shaded so the curves read; a cooler blue-grey `#86a6b4` so the white frames read at 100 to 150 m), `glow` (vertical glazing of walls, drum, lantern, gables; unshaded), `roof` (flat service roof, warm slate `#6b5f55` so it separates from the green ground). Same keys in the dark palette: glow turns warm, glass dark blue, frames light grey.

## Modelling decisions

- **Roof glass is a surface, the frames are merged swept bars.** Hall and lobe vaults are one Tudor-arch profile; 0.18 m ribs about every 3.8 m, a ridge and two side purlin lines, valley bars on the diagonals of the cross-vault where hall and lobe meet, and meridian ribs on the lobes' five-gore dome ends. No individual panes. Swept bars and wall posts omit the face against the glass, their ends and their tops/bottoms, but keep their normals (frame was 90% of the first export's bytes, and the lattice is invisible beyond ~150 m).
- **Cross-vault corners are exact:** the hall surface is the union of two vaults, built from four triangular patches meeting on valley diagonals (shared vertices, no cracks), with the cupola on the crossing.
- **Pavilion** has a closed chamfered-octagon wall chain (board, lit glazing, posts, mid-rail, cornice), an arched shoulder roof loft, three gabled dormers, an octagonal drum with a floor plate (so the interior never shows), an ellipsoid dome, a glazed lantern and a baluster spire.
- **Far LOD** keeps the footprint, plinth, wall glazing and cornices, glass roofs at half the arch resolution, one rib in four, ridge and valley bars, 4 dome ribs, 6-sided cupolas and the finial. Same bounding box as near.
- Plinth is one prism round the pavilion, wings and lobes plus one for the vestibule and one per rear block (no overlapping tops). Frames sit 0.04 to 0.05 m proud of glass; no coplanar faces.

## Approximations and limits

Glazing is opaque; interiors, plants, ponds and the statue in the vestibule are absent. The rear service houses are the weakest part: mapped plan, guessed forms. The dome is a plain ellipsoid with the lantern truncating it; the real dome and its ribs are slightly more elaborate. The vestibule gable is a plain triangle (no fanlight arch). Cresting along the ridges, flower beds, the entrance stair, newel piers, urns and trees are site landscape and are not modelled. A pavilion east/west wall panel is built behind each hall's open end (hidden inside the hall volume) so the interior never shows.

## Costs

| | triangles | draws | bytes |
| --- | --- | --- | --- |
| near | 7 722 | 5 | 377 KB |
| far | 2 423 | 5 | 123 KB |

First export: near 15 952 tris / 790 KB, far 4 377 tris / 222 KB; the independent review asked for a leaner near (target at most about 8 k triangles and 450 KB).

Budget (building): near 60 000 / 14 / 2.5 MB, far 12 000 / 8 / 500 KB.

## Verification evidence

Rendered with `node tmp/san-francisco/shot.mjs conservatory-of-flowers` (procedural source and `--source glb`, near and far, light and dark; red OSM rings, 10 m grid). Reference photos compared (ignored `tmp/`): the harley/panoramio and PeteBobb front elevations for the pavilion tiers, dormers, vestibule and lobes; WolfmanSF's wide view for the wing length; Morris and the early photograph for the dome and vestibule proportions; an aerial tile for the E-shaped plan and the rear strip.

Looked at, and changed because of it: (1) first pass, front/overview/roof/dome/wing/rear: the plan matched the aerial, but the cupolas read as bare cones and the lobe porch was a blank box, so the cupola got a glazed octagonal lantern, cornice, ogee roof and ribs and the porch got a lit door and a gable; (2) the roof view showed a tan ring around the dome through a gap between the dome and the drum cornice (the floor seen through the model): a floor plate was added under the dome; (3) the far render was a lump, so it gained half-density ribs, ridge/valley bars and dome ribs; (4) after export the GLB near/far were rendered again (front, wing, vestibule, rear, far dark overview) and matched; the porch front sat 0.5 m past the lobe wall, so it was moved back into the wall. Plan view over the red outline: the model stays inside the OSM ring (largest vertex outside is under 1.3 m, asserted in the test).

Review fix round (PASS-WITH-NITS, 4/5): lattice cost cut (above); cupolas lowered and given a lantern, cornice, ogee roof and finial; wing ridge lowered to 5.0 m; roof glass and glow made cooler and darker and the frame whiter (dark palette: frame lighter, glass darker) after rendering at JFK Drive distance (`--source glb --eye 8,1.7,100` and `,150`, light and dark): the white ribs now separate from the glass; the flat service roof changed from grey-green to warm slate. Pitch and widths read at 100 to 150 m; they are a suggestion of the lattice, not a count.

Tests (`conservatory-of-flowers.test.js`, about 0.1 s): finial height 18 m, length 72 to 76.5 m, dome diameter/crown/drum/lantern/spire by raycast, vestibule front and ridge, shoulder roof, hall width and ridge, cupola tips, open lawn court and alley, baked 5.9 degree axis, containment in the footprint, and far/near envelope.

## Cityscape and Full 3D world

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately. The model is a rigid structure on local `y = 0` with `padM` 48; the building stands on a slope in Park terrain, which only the Full 3D pad addresses.

OpenStreetMap-derived outline: © OpenStreetMap contributors, ODbL 1.0.
