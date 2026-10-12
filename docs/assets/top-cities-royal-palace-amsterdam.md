# Royal Palace (Paleis op de Dam), Amsterdam

Original procedural exterior of the Dutch classical town hall completed in 1665 and converted to a palace in 1808, on the west side of Dam Square, Nieuwezijds Voorburgwal 147. This models its present exterior, judged against the 2026 Dam Square photograph; the 1930 rear photograph clarifies the west elevation and Atlas silhouette. Source and GLBs are texture-free. Cityscape: **not tested yet**; Full 3D world: **not tested yet**; integration is checked separately by the lead. No app server, app bundle, deployment or publication was performed.

## Sources and rights

- [Royal Palace of Amsterdam, Wikipedia](https://en.wikipedia.org/wiki/Royal_Palace_of_Amsterdam): architects Jacob van Campen and Daniël Stalpaert, 1665 completion, 1808 palace conversion, sandstone darkened with time, lack of a grand entrance, six-metre Atlas carrying a globe on the west facade.
- [OSM relation 3580875](https://www.openstreetmap.org/relation/3580875): outer way **57856712**, inner courts 266639588/266639589. All eighteen palace parts **748659170–748659187** are included in the replacement record; neighbours and Nieuwe Kerk are excluded. Derived geographic data © OpenStreetMap contributors, ODbL 1.0. The dossier supplied part geometry and height tags; the shared Overpass relation request failed, so the permitted single-object OSM API `/api/0.6/relation/3580875/full.json` supplied the outer ring, saved in `tmp/top-cities/royal-palace-amsterdam/outline-api.json`.
- [Deerpeter, Paleis op de Dam 2026](https://commons.wikimedia.org/wiki/File:Paleis_op_de_Dam_2026.jpg), CC BY-SA 4.0: present east facade, subdued warm grey stone, seven entrances, paired small/tall window rows, pediment and cupola.
- [J.P.A. Antonietti / Rijksdienst voor het Cultureel Erfgoed, Achtergevel, May 1930](https://commons.wikimedia.org/wiki/File:Achtergevel_-_Amsterdam_-_20011609_-_RCE.jpg), CC BY-SA 4.0, required attribution Rijksdienst voor het Cultureel Erfgoed: west pediment and Atlas. Viewed `refs/rear.jpg`; licence verified on the Commons description page.
- [Richard Mortel, Royal Palace, Amsterdam, 1665 (1), 2019](https://commons.wikimedia.org/wiki/File:Royal_Palace,_Amsterdam,_1665_(1)_(47359690331).jpg), CC BY 2.0: west tympanum detail and globe; viewed `refs/rear-detail.jpg`, licence checked on Commons.
- Dossier context: Bernard F. Eilers' 1937 Dam wedding photograph, public domain; Rijksmuseum historical prints, CC0. The historical decorations are omitted.

Photographs and cached page descriptions remain in ignored `tmp/top-cities/royal-palace-amsterdam/refs/`; they are references only and are not redistributed in exports. All meshes and ornamental silhouettes are original procedural work by Codriver.

## Dimensions and geographic frame

| Feature | Model / mapped figure | Basis |
| --- | --- | --- |
| Origin | 4.89136, 52.37317 | Dossier origin, retained near structural centre |
| Front outer control points | [4.8917772, 52.3735015], [4.8917436, 52.3727748] | OSM east corners, ways 748659186 / 748659184 |
| Distance / direction between controls | 80.93 m, 1.62° west of south | Calculated from mapped points |
| Baked rotation | 1.55° west of south along +z | Best-fit simplified building axes, within 0.07° of controls |
| Translation in geographic metres | x −1.5, z +2.7 | Fits mapped palace ranges around dossier origin |
| Outer model envelope | about 66.5 m east–west × 82.1 m north–south | Simplified mapped massing, includes cornices |
| Main eaves / ridges | 25 m / 30 m | OSM `height=30`, `roof:height=5` |
| Corner hips | 31 m | OSM `height=31`, `roof:height=6` |
| Lower court galleries | 18 m eaves / 23 m ridges | OSM `height=23`, `roof:height=5` |
| Tower reference tag | 45 m, base `min_height=30`, domed roof 5 m | OSM 748659171; not a published survey |
| Model cupola | drum at 29.5 m, open belfry 32.9–41.8 m, dome shoulder 42.45 m, dome top 46.1 m | Photograph-fitted estimate; dome top about 1.1 m above tagged tower top |
| Highest vane tip | 51 m | Estimate from photographs, not a sourced published height |
| Atlas above seat | 6 m | Wikipedia; body/globe simplified to six-metre silhouette |
| Seven entrances | 1.8 m clear width, 3.4 m spacing, spring 2.8 m, crown 3.7 m | Photograph estimates |
| Window rhythm | 23 east-front bays; four upper rows plus small basal openings | Count judged from facade photograph |
| Cornice/pediment fit tolerance | max 1.59 m beyond mapped wall outer ring | Measured mesh vertex distance; simplified rectangles and projecting architectural coping, no detached plaza pad |

Units are real metres, +X east, +Y up, +Z south. Building axes are rotated **inside the vertex data**; the host must not rotate again. Local y=0 is grade; no DEM, sea-level height or Mercator stretch is encoded. The foundation is rigid. `padM=60` declares the regional foundation envelope; terrain arrival/refinement, pad datum and replacement behaviour remain for application QA. `FOOTPRINTS` records the actual outer wall ring plus every modeled provider part, rather than extending masking into the square for cornices.

## Modelling and LOD

The outer four ranges and the transverse Citizens' Hall surround two open courtyards, with lower galleries inside. All roofs use original hipped geometry; four higher corner hips, small near dormers and chimneys break the roofline. Near uses separated four-pane windows and stone sill/capital geometry. Far drops pane divisions, fine window surrounds, dormers and chimneys; it keeps each discrete window bay and row, the classical pilasters, seven curved arch recesses, both sculpted pediments, Atlas/globe, roof statues and the open domed cupola.

The seven entrance spandrels are cut to semicircular soffits; dark closed-door planes sit about 3.2 m behind the central frontage. This is an entrance recess, not an invented grand portico or a through passage. The octagonal cupola has eight piers and arched spandrels, a suspended bell, clock boards and a broad segmented dome under a small lantern. An original gold hull with three masts/sails provides the ship vane. The bell beam touches two specified piers; the hanger joins the beam and bell. Sculptures use connected torso/head/limb silhouettes rather than anonymous blocks.

Seven merged materials: weathered warm grey `stone` #a49e8f; slightly lighter `trim` #bab29e; slate `roof` #42464c; dark `glass` #303b40; oxidised `bronze` #50625b; subdued `gold` #bfa256; sparse `light` windows. Night uses the matching dark palette; `light` is self-lit and warm, with no blanket illuminated facade. Window planes stand 0.23 m proud near and 0.56 m far; generated depth ordering covers the remaining layered geometry. Near pane gaps receive mullions, avoiding overlapping glass/mullion faces.

Fine Corinthian carving, heraldry, relief anatomy, material weathering, clock numerals, maritime vane rigging and interiors are approximations or omitted. Rear base door arrangements are simplified; only the distinctive seven east arches are fully cut. The stone stays uniform rather than reproducing photo weather stains. The belfry and sculptures are coarser than the real carving. Night lighting is an artistic conservative approximation. These exports require independent visual review; `ready` means the asset handoff is usable, not that application placement or terrain is verified.

## Export costs

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 28,278 | 7 | 1,470,460 | 1436.0 |
| far | 6,682 | 7 | 347,132 | 339.0 |

Caps: near 60,000 / 14 / 2.5 MB; far 12,000 / 8 / 500 KB. Both fit with headroom. No textures, decoders, compression extensions or retained bridgeLift attributes.

## Verification evidence

Looked at the dossier `tmp/top-cities/royal-palace-amsterdam/refs-sheet.jpg`, the 2026 facade photo, the rear photograph and the Mortel tympanum detail. Initial exported GLB sheet in `tmp/top-cities/shots/royal-palace-amsterdam/iteration-1/` revealed downward-facing roof normals; the hip winding was corrected. The first far export was 535 KiB; removing subpixel window surrounds retained all bay/row quads and reduced it to 339 KiB. The southern central range was pulled back to the mapped wall line. Floating clock discs were grounded on boards connected to the lower cornice. Cupola cap/beam material cycles were eliminated by unifying touching pier/spandrel/beam geometry under trim, and the bell beam was shifted onto actual opposing piers. Pediment figure reliefs intersect their supporting tympanum rather than hovering proud of it.

Final evidence inspected in `tmp/top-cities/shots/royal-palace-amsterdam/final/`:

- `reference-comparison.jpg`: exported near/far in light/dark beside reference photographs, including facade/rear/roof/entrance/cupola tiles.
- `royal-palace-amsterdam-glb-{near,far}-{light,dark}-sheet.jpg`: six views each, overview, facade, rear, roof, entrance and cupola. Light/dark materials, small arches, separated windows and roof/courtyard silhouettes remain readable.
- `royal-palace-amsterdam-procedural-near-light-sheet.jpg`: source overview/facade/roof/cupola agrees with the exported GLBs.
- `tmp/top-cities/royal-palace-amsterdam/metrics.json`: deterministic GLB QA has **no issues**, y-min 0, 0.3% outside-in back-face hits, zero unresolved layered-face area, no removable attributes, no silhouette/window-rhythm flags.
- `tmp/top-cities/royal-palace-amsterdam/depth-cycles.json`: zero dropped edges after generation; selected-id freshness check passes.

The requested combined Node check passes **401/401**, including all **10** landmark tests (under 0.5 s alone). Tests pin dimensions, the complete OSM ownership, bounded horizontal envelope, sky-open courts, seven genuinely curved recessed entrances, all 23 bays/four rows, cupola void, Atlas/globe, ship vane and named pier/beam/bell contacts. A deliberately shortened beam must fail the contact assertion, proving it can detect a free end. Exported bounds/material/byte checks pass in registry conformance. Catalog validation passes. An earlier shared `vulcan-statue-parts.js` import failure cleared on retry; no other landmark was changed.

Reproduce with `pnpm build:top-cities-landmarks royal-palace-amsterdam --no-check`, the combined Node test from the brief, `node scripts/asset-catalog.mjs`, and `node scripts/landmark-depth-layers.mjs --ids royal-palace-amsterdam --check`. The generated depth table was regenerated as authorized. No runtime shared source was edited. Independent review and unobstructed Cityscape/Full 3D world screenshots, provider replacement, terrain footing, lifecycle transitions and device performance remain the lead's separate integration gate.
