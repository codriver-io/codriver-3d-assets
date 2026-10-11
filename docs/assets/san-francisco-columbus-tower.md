# Columbus Tower (Sentinel Building), San Francisco

Original procedural model of the Columbus Tower at 916 Kearny Street, the verdigris-green flatiron where Columbus Avenue meets Kearny Street. It is one folder in the San Francisco set ([contract](../san-francisco-landmarks.md), asset catalog): `src/peregrine/landmarks/san-francisco/columbus-tower/`, catalog record `prototypes/assets3d/catalog.d/columbus-tower.json`, exports `public/models/buildings/columbus-tower-{near,far}.glb` and `columbus-tower.json`.

Build: `pnpm build:san-francisco-landmarks columbus-tower`. Tests: `node --test src/peregrine/landmarks/san-francisco/san-francisco.test.js src/peregrine/landmarks/san-francisco/columbus-tower/columbus-tower.test.js`.

## Identity

- Sentinel Building, designed by Salfield & Kohlberg for Abe Ruef, framed before the 1906 earthquake and finished in 1907; San Francisco Landmark No. 33 (1970); renamed Columbus Tower 1958-72; owned by Francis Ford Coppola (American Zoetrope, Cafe Zoetrope on the ground floor).
- Modelled as a driver sees it today: a triangular, eight-storey steel-framed building clad in white glazed terracotta and patinated copper, standing on the wedge between Kearny Street (west) and Columbus Avenue (north-east), shouldering against the 900 Kearny (Golden Coin) building on its south side. Cafe Zoetrope fills the ground floor under a red awning; floors 2-7 carry the copper oriels; the eighth floor is the penthouse drum under the copper dome.
- Orientation, from the mapped outline: the round corner turret points north-north-west (bearing about 327 degrees) at the Columbus/Kearny/Pacific intersection; the Kearny face runs at bearing 350 degrees and looks west-south-west; the Columbus face runs at 131 degrees and looks north-east; the 14 m party wall is on the south.
- Famous view: the green wedge and its dome in front of the Transamerica Pyramid looking down Columbus Avenue. That is the apex-on view the model is built to read from.

## Sources

Facts (used as published):
- Wikipedia, "Columbus Tower (San Francisco)": 916 Kearny, completed 1907, Salfield & Kohlberg, eight floors, copper cladding, triangular lot between Columbus Avenue, Kearny and Jackson.
- SF Planning Commission packet for 916 Kearny (2019-019722CUA): "8-story over basement"; Cafe Zoetrope at the ground floor, offices on floors two to seven, one residence on the top level; the plan sheets A-6/A-7 label "EX. PATINA COPPER", "EX. WHITE GLAZED TERRACOTTA TILES", "EX. GOLD SPIRE", "EX. RED AWNING", "EX. BLACK STEEL FIRE ESCAPE".
- Noe Hill, Landmark 33: "white tile and copper", "surmounted by a copper dome", steel frame.
- OpenStreetMap way 288485994 (Sentinel Building, `building:levels=7`, `height=29`, `architect=Salfield & Kohlberg`) and its turret part way 1092161846 (`roof:shape=dome`, `colour=#008000`): the footprint (ODbL, (c) OpenStreetMap contributors). The ring has 18 nodes: a 12.9 m Kearny face, a 17.9 m Columbus face, a 14.3 m party wall and a ~5 m diameter round turret fitted at radius 2.49 m about (-4.84, -7.35) m from the origin.

Reference photographs (Wikimedia Commons, downloaded only to the ignored `tmp/san-francisco/columbus-tower/refs/` to compare; none is in the repository or the GLB): Dllu "Columbus Tower, 916 Kearny St, San Francisco" and "Sentinel Building San Francisco at night" (CC BY-SA 4.0); Billiamwhatcott "Columbus Tower (Sentinel Building)" (CC BY-SA 4.0); Shane Torgerson "Columbus Tower San Francisco" (CC BY-SA 3.0); UpdateNerd "Columbus Tower and Transamerica Pyramid" (CC0); BrokenSphere "Columbus Tower, SF side 1" and "side 2" (CC BY-SA 4.0).

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Storeys | basement + ground floor + 6 oriel floors + penthouse drum = 8 | sourced (SF Planning, Wikipedia) |
| Height to the spire tip | 29.8 m | OSM `height=29`; tip estimated |
| Footprint | 157 m2 wedge, faces 12.9 / 17.9 / 14.3 m | mapped (OSM) |
| Corner turret | radius 2.49 m at the cap ring, 1.99 m body | mapped (OSM circle) |
| Ground floor | 4.2 m: white plinth to 0.4 m, shop glass 0.9-3.25 m with a transom at 2.5 m, sign band to 3.95 m, white moulding to 4.2 m; corner door on the turret axis | estimated |
| Oriel floors | pitch 2.9 m (1.4 m copper panel + 1.5 m window row), first sill at 4.2 m, top window at 21.6 m | estimated from photographs against 29 m |
| Oriels | 3 on the Kearny face (canted, bow, canted), 3 on the Columbus face (canted, bow, bow); about 2.6 m wide, 0.5-0.6 m deep, narrow enough to leave white wall between them | counted on photographs, widths estimated |
| Turret windows | 6 per floor, flat-faced piers, recessed 0.3 m | counted on photographs |
| Cornice | 22.8-23.85 m, projects 0.55 m; roof 0.55 m below its crest | estimated |
| Cap ring, drum, dome, finial group | slim bell ring 21.6-23.5 m (widest 2.44 m radius), drum 1.5 m to 25.0 m, dome 1.9 m to 26.9 m, finial group 2.9 m (collar, secondary bulb, neck, gilded ball) to a tip at 29.8 m | estimated (+-1 m) |

## Modelling decisions

- The plan is derived from `footprint.js` at load (`columbus-tower-site.js`): two face lines and the party wall fitted to the mapped nodes, and the turret circle fitted to the mapped arc. The circle is **not** tangent to the faces (its centre is ~1.8 m from each, its radius 2.49 m), so about 250 degrees of the turret stands proud of the building, as it does in the photographs. The tile wall plane sits 0.5 m inside the outline, so the cornice and the turret ring reach the mapped outline.
- `columbus-tower-parts.js` holds a small face builder whose quads are wound to their intended normals (no inside-out faces), a wall frame, mitred profile sweeps and a lathe. Everything is generated from the plan: the awning, shop front, tile wall and cornice are sweeps along the outline; each oriel is a swept plan polyline (canted three-face or four-face bow) carried into the wall at both ends, so no end is open.
- Each oriel floor is a copper apron, a recessed patina field (the Gothic arcade panels, kept close to the copper tone) and a low sill ledge, with full-height posts between recessed windows (muted brown frame ring, meeting rail, glass set back 0.09 m); a head cap and a segmental copper arch with two lights sit under the cornice. White string courses run along the tile wall at every floor line and under the cornice, and the oriels are narrow enough that the white terracotta shows between them: 15.7% of the apex-on view between floors 2 and 7 is tile. The turret repeats the six floors with lathe rings and a pier-and-window layout around the arc (a pier on the axis, then three windows a side, ending in a buttress at each wall), a slim bell-shaped copper cap ring, a 1.5 m drum with small windows, the dome, and a finial group of collar, secondary bulb, neck, gilded ball and a thin spire. Two coppers are used: a greyer verdigris for the oriels and turret rings, and a paler one (`verdigris`) for the cornice, drum, dome and finial.
- Ground floor: pale plinth, shop glass with posts and a transom bar, a dark sign band, a white moulding under the oriels, a corner door (two glazed leaves, transom, stained-wood frame) on a white step, and one sloped red canopy per shop bay with a valance and closed ends, with small gaps between bays.
- Near only: window frames and rails, the patina panels and ledges, string courses, shop posts, door and canopies, the Columbus-face fire escape (landings, rails, posts, cantilever beams and stair stringers), the roof penthouse and vent pipe, and three low roof hatches set back behind the cornice. About a quarter of windows, and the shop glass, are the self-lit `glow` material (warm at night, glass-coloured by day).
- Far keeps the wedge, the tile wall, six-floor oriels with a glass strip per face per floor, the six turret window rows, cap ring, drum, dome, finial group (as copper) and spire, the cornice, a swept awning, the shop band and a simplified fire escape (six landings with a front rail and stair ribbons in the dark `base` material): 7 draws, about 22% of the near triangles.
- Materials: `tile` (white glazed terracotta), `copper` and `verdigris` (two greens), `patina` (recessed panels), `glass`, `frame` (stained wood), `base` (storefront), `awning`, `iron`, `roof`, `gold`, `glow`; light and dark palettes share keys. Far merges `verdigris` into `copper` and draws the fire escape in `base`.

## Approximations and limits

- No survey exists in the sources: floor levels, oriel and window sizes, which oriels are canted or bowed, the fire escape, the awning, the cornice and the dome proportions are estimates from the photographs. The Gothic arcade ornament is a recessed field, not carved arches; the fleur-de-lis and the curved window glazing are not modelled.
- The south party wall is drawn plain: it is hidden by the 900 Kearny building in the street views and was not photographed.
- The ground floor is drawn as a glazed shop front with posts, a transom, a corner door and canopies; the real Cafe Zoetrope entrance detailing, awning lettering and sign are not modelled.
- Oriels, the awning (about 1.05 m) and the fire escape (about 1.1 m) overhang the mapped outline: they project over the sidewalk. The extrusion removal only touches provider triangles entirely inside the ring (0.8 m slack).
- Ground is flat local grade (y = 0); the corner slopes slightly in reality. No terrain, sea level or latitude stretch is baked in.
- No Tesla hardware measurement. Software-GL screenshots are not device timing.

## Costs

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 12 302 | 12 | 679 052 |
| far | 2 693 | 7 | 153 464 |

Budgets are 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB; the aim was 15 000 near and 3 000 far (about 679 KB near and 153 KB far on disk).

## Verification evidence

Rendered with `tmp/san-francisco/shot.mjs` (headless Chromium, red footprint rings, 10 m grid), procedural source and exported GLB, near and far, light and dark, and read against the photographs above:

- Apex-on against Dllu "916 Kearny St" and UpdateNerd (with the Transamerica Pyramid): `columbus-tower-glb-near-light-dllu-compare.png`, `...-overview.png`; the same massing: turret with bell cap ring and dome on the left of the Columbus face, red awning wrapping the corner, oriels receding on both faces.
- Columbus face with the fire escape against BrokenSphere "side 1": `...-glb-near-light-postcard.png`, `...-columbus.png` (the escape sits on the canted oriel next to the turret, as photographed; bow oriels with arched attic windows at the far end).
- Kearny face against Whatcott and Torgerson: `...-procedural-near-light-facade.png` (turret, then canted / bow / canted oriels).
- Turret close-up, dome and finial: `...-turret.png`, `...-dome.png`; street level: `...-street.png`; plan over the red footprint rings: `...-top.png` (wedge sits inside the ring, apex at the NNW, turret circle on the mapped arc).
- Far: `...-glb-far-dark-overview.png`, `...-glb-far-light-far150.png` (about 150 m) and `...-d500.png` (about 500 m); near dark: `...-glb-near-dark-overview.png`.
- Changed because of what the screenshots showed: the first awning was a thick slab, so its projection was cut to 0.7 m and it stops short of the acute south-east corner; the dome and finial were onion-shaped with an oversized ball, so the dome was flattened to a hemisphere and the ball slimmed to a 0.32 m radius; the arched attic windows were added after the Torgerson and side-1 photographs showed them at the top of every oriel; shop posts were added round the turret because the glowing glass read as one cream drum at night; the roof was lowered 0.15 m under the cornice crest so it can never fight the cap ring top; the fire escape's solid stair treads were removed after they read as a black ramp.
- Fix round after the independent review (PASS-WITH-NITS, 4/5), checked on the exported GLBs: `columbus-tower-glb-near-light-apex-postcard.png` (apex-on from Columbus Avenue, to compare with Dllu "916 Kearny St"), `...-glb-near-light-read120.png` and `...-glb-far-light-read120_far.png` / `...-far-dark-read120_far.png` (about 120 m), `...-glb-near-light-columbus.png`. What changed: the white terracotta was invisible at 100-150 m, so the albedo went up, oriels were narrowed, and white string courses, a white plinth and a white moulding under the oriels were added (15.7% tile apex-on); the striped look of the turret came from a dark patina field between pale ledges and strong orange frames, so the field is now close to the copper tone, the ledges project 0.06-0.1 m instead of 0.1-0.12, the frames are a muted brown and the copper is greyer; the cap ring was slimmed (widest 2.44 m) and the drum, dome and finial group made taller with a secondary bulb (tip now 29.8 m); the awning slab became per-bay sloped canopies with a valance, and the plinth gained a door, transom and white moulding; the roof hatches were lowered to 0.25 m above the cornice crest and set back 0.9-1.8 m, so the apex-on skyline no longer reads as crenellations; the far model gained a simplified fire escape.
- `columbus-tower.test.js` (12 tests) pins the mapped wedge and its bearings, the turret circle, containment within 1.15 m of the footprint, the 29.8 m spire tip, the secondary bulb and gilded ball read from the side, the 2.44 m cap ring radius, the slim ring and tall drum and dome, the sloped canopies with valance and gaps, the corner door and step, the tile share (>12% apex-on), the low set-back roof hatches, the far fire escape, six window rows on the turret in near and far (set back behind the piers in near), three oriels on each street face stepping out of the tile wall, the iron landings at all six floors on the Columbus face only, the copper cornice and awning, triangle winding against normals, far bounds and both exported GLBs.

## Placement modes

- Cityscape (flat ground): not tested yet, integration is checked separately.
- Full 3D world (topography): not tested yet, integration is checked separately. The model stays rigid on its own ground floor and bakes no terrain datum; `padM` is 20 m.
