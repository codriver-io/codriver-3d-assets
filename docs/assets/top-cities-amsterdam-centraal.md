# Amsterdam Centraal station

The 1889 headhouse on Stationsplein (P.J.H. Cuypers with A.L. van Gendt), Rijksmonument 5681, plus the Eijmer train sheds and the 1920 east block De Oost (Joseph Cuypers). A driver on Stationsplein sees a long red-brick front: two clock towers with pale dial panels and tiered slate spires, a steep central gable with a stone outline, and three tall glazed arches over a row of rectangular ground-floor bays. The wings carry stone bands and cross-gables, and the glass vaults of the platforms sit behind. The IJ-side bus station and the Noord-Zuid Hollandsch Koffiehuis are separate buildings and are not in this model.

Origin `[4.9, 52.37833]` sits on the city facade between the towers. The long axis, 120.67°, is the weighted bearing of the long edges of Cuypersgebouw (OSM way 1239767708). Geometry is authored in that frame and rotated once into east / up / south. y = 0 is local platform grade. The island is flat fill, so there is no `terrainPad`.

## Sources

OpenStreetMap building parts in the dossier (© OpenStreetMap contributors, ODbL). Rijksmonument 5681 (P.J.H. Cuypers, 1881–1889, a palace-like front with the centre flanked by towers). Wikipedia (en and nl) for the opening date, 15 October 1889, and the architects. Published descriptions used for the 1889 overall size (about 306 m by 30 m) and for L.J. Eijmer's first shed (span almost 45 m, height about 23 m, 50 trusses, finished October 1889). Photographs viewed, not copied: Slaunger, CC BY-SA 4.0 (city facade, 2016); Calstanhope, CC0 (entrance); Christian Alexander Tietgen, CC BY 4.0 (shed interior); public-domain historic city-side view.

## Dimensions

| Part | Value | Status |
| --- | --- | --- |
| Axis | 120.67° | Measured from way 1239767708 |
| Cuypersgebouw plan | about 244 m × 31 m | Mapped outline. The 306 m × 30 m figure is the 1889 design, before De Oost replaced the east wing |
| Wing ridge / eave | 23.3 m / 17.8 m | Ridge is way 752653565. Its `roof:height` 0.75 m disagrees with the gables and the photos; the eave is 22.45 − 4.65 |
| Cross-gables | 22.45 m, five of them | Mapped. The smaller gables between them (peak 21.05 m) are estimated from the facade photos |
| Central gable | 29.25 m | Mapped peak. Drawn as one steep triangle with a pale stone outline and an iron pinnacle to 33.45 m (estimated). The slate roof behind it falls to 23.45 m at the back |
| Clock towers | eaves 26.25 m, apex 34.25 m | Mapped. The spire is a slate skirt, a stone lantern and an upper pyramid, not one cone. Iron finial to 36.65 m is estimated and is the model's top |
| Koningspaviljoen | 26 m, front gable 25 m | Mapped height. The plan follows the ring: a shallow city block, a lower rear leg (ridge 17.2 m, estimated), and the entrance bay that actually reaches v ≈ 2 |
| West wing | 12 m gambrel | Mapped height. The outline steps, so the west cap's city face is set back from the rest |
| De Oost | 20 m, eave 15 m | Mapped height and `roof:height` 5. Drawn as a gable; OSM says skillion |
| Zuidkap | span 42.4 m inside the ring, crown 21.5 m | Footprint mapped (about 45 m). Crown is a semicircle on that inset span. The published height is about 23 m |
| Middenkap / Noordkap | crowns 8.8 m / 17.3 m | Spans mapped, no OSM height. Semicircles on their own spans. The middle shed is the narrower 1922 roof |

## Materials

Light brick `#8e4036`, stone `#f1e6d0`, slate `#454c5c`, glass `#c3d2d8`, iron `#3a4046`. Night brick is `#5a2a24`. `glow` is a dull `#3e494f` by day and `#ffb85c` at night (unshaded); the three central arches use it, so they match the wing windows, while the train sheds stay on `glass`. `lamp` is the clock faces and the band over the doors (`#f4efe4` / `#ffe6b0`). No lettering: the band stands in for the "Amsterdam Centraal" sign.

## What was simplified

Ribs every 12 m near and 36 m far, not all 50 trusses. Window bays are a regular pitch, not a counted survey. The three arches are the upper storey (estimated opening 5.9 m wide, spring at 16.15 m, crown about 19.1 m), each split by one mullion and two transoms. The ground floor is rectangular bays in the stone porch, both LODs. Clock dials and arch piers are narrow stone bands with brick between them. Tower pinnacles sit on the cornice, clear of the slate skirt. Shed sills stop 0.28 m outside the arch feet and still inside the rings.

## Cost

Near 11,884 triangles, 7 draws, 470,452 bytes (459 KB). Far 4,741 triangles, 7 draws, 214,576 bytes (210 KB). Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Far bounds match near. The mullions, pier bands and dial frames added about 3% near and 8% far.

## Verification

Looked at `tmp/top-cities/shots/amsterdam-centraal/`:

- Procedural near/light sheet, then facade, detail, sheds and overview, against the Slaunger facade and the Tietgen shed. The centre wall was two dark slabs; they became punched windows. The roof camera was moved off the sheds onto the headhouse.
- Second near/light sheet (facade, detail, roof, overview). The centre reads as a clock gable over three arches; the wing gables and the three vaults read. The slate shoulders beside the central gable are steeper than the real roof and look like fins from above.
- Exported GLB near/light sheet, far/dark facade and sheds, and a top view. Far keeps the towers, arches, gables and vaults; night windows and clocks light up; the top view sits in the red footprint rings.
- Review fix, 2026-10-04. The three arches had been short openings at street level, with slots above them; they are now the tall upper arches, and the ground floor is rectangular bays in both LODs. The central gable was a staircase; it is one triangle with a stone chevron and a pinnacle. The towers were plain pyramids; they now have a dial panel, a lantern between two slate stages, and a bulbed finial. Judged on the near/light facade and detail renders and the far/dark detail render under `tmp/landmarks/shots/amsterdam-centraal/`, then on the review sheet.

`amsterdam-centraal.test.js` raycasts the ridge, gable, tower apex, west wing, De Oost, Zuidkap crown, an upper arch (glow, off the mullion), a ground-floor bay, a tower dial and the stone band under it, and checks footprint overhang ≤ 1.2 m. A later colour pass moved the brick from `#c45c42` / `#7a3c32` to `#8e4036` / `#5a2a24` and was judged on the regenerated review sheet.

Cityscape and Full 3D world: not tested yet, integration is checked separately.
