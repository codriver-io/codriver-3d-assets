# Harbour Centre (Vancouver Lookout)

Original procedural model of the current Harbour Centre / Spencer complex at
555 West Hastings Street, Vancouver, completed in 1977 (WZMH Architects).
The recognisable features are the offset round saucer, two tiers of splayed dark
glazing, broad pale fascia rings, concrete tower with recessed precast window
bays, twin glass bubble elevators on its southwest face, and collar antenna mast.
The podium includes the adjoining former Spencer department-store building.

## Sources and height convention

- [CTBUH / Skyscraper Center](https://www.skyscrapercenter.com/building/harbour-centre/4144):
  architectural height 147 m, 28 floors, completion 1977. This is **not** the office roof height.
- [Harbour Centre overview](https://en.wikipedia.org/wiki/Harbour_Centre): identity,
  177.1 m pinnacle convention and conflicting deck/roof height claims.
- [SkyscraperPage building-plans conventions](https://skyscraperpage.com/b60/vancouver/harbour-centre):
  roof 458 ft above Hastings entrance; Cordova entrance 21 ft (6.4 m) lower;
  current mast entry 558 ft above Hastings entrance (roughly 176.5 m above Cordova).
- [Official Lookout](https://vancouverlookout.com/): attraction reference; its
  advertised 168 m elevation is not assumed to be metres above our local grade.
- Prepared Overpass dossier `tmp/top-cities/harbour-centre/osm.json`, dated
  2026-10-06: building outlines and detailed crown/tower parts. No new query was
  needed. [Tower part 363385368](https://www.openstreetmap.org/way/363385368),
  [crown part 363385371](https://www.openstreetmap.org/way/363385371),
  [whole complex 1371268997](https://www.openstreetmap.org/way/1371268997).

The export uses a coherent mapped local-grade profile rather than treating the
147 m architectural figure as an office shaft height and stacking a second tower
above it. The pinnacle is 177.1 m; the architectural and visitor elevations have
inconsistent datums across references. No sea-level datum is baked into the GLB.

| Feature | Model | Basis |
| --- | ---: | --- |
| Antenna tip | 177.1 m | Published pinnacle convention; OSM part 177 m |
| Office roof | 116 m | OSM part, 28 window rows |
| Tower envelope | 35.15 × 35.15 m | Mapped tower outline; slight rectification under 0.5 m |
| Concrete support neck | 116–128 m | OSM core part |
| Saucer maximum diameter | 38.5 m | Mapped circular rim envelope |
| Lower / upper glazing | 134.2–138.2 / 139.9–145 m | Photo estimate fitted to mapped parts |
| Rim / roof / centre drum | 148 / 150.2 / 153.7 m | Rim mapped; roof and drum photo estimates |
| Spencer podium | 43 / 47 m | Two mapped stepped parts |
| Low retail / office podium | 12.7 / 26 m | Mapped parts; simple flat base |
| Elevator bays / cabins | Two bays; 3.7 m cabins | Photo estimate; fixed positions at 81 / 105 m |
| Window recess | 0.32 m | Photo estimate, near LOD only |

## Geographic frame and ownership

Origin `[-123.11221471052632, 49.28468226842105]` is the centroid of the
mapped mast ring. Real metres; +X east, +Y up, +Z south; y=0 is rigid local flat
grade. Geometry is authored in u northeast / v southeast, then rotated into
world axes before export. The bearing of u is 44.3668° from the first two mapped
tower control points `[−123.1120949,49.2849889]` and
`[−123.1117852,49.2847913]`; southwest frontage is 224.3668°.
Rotation is baked once; the host must not rotate again.

The office tower is offset northeast of the saucer axis, as the mapped upper
support sits near its southwest wall. `FOOTPRINTS` includes the full Harbour
Centre envelope, office outline, Spencer outline and all meaningful mapped
building parts, including the saucer overhang. Sub-4 m² mast-only parts are
already covered by the larger crown rings. Nearby hotels, Waterfront Station,
Grant Thornton Place and street geometry stay outside ownership.

The base is flat in Cityscape. A bounded `terrainPad` uses the complete mapped
complex ring, perimeter references, median datum and 8 m feather. The entrances
have a reported 6.4 m grade difference, so an unconstrained lowest-sample disc
would be inappropriate. The explicit pad is a placement handoff, **not** proof
of terrain integration: streets, entrances and its slope transition still need
in-app inspection and may require terraces following actual DEM sampling.

## Modelling and materials

`geometry.js` uses the shared assetBuilder, with original landmark-local mesh
helpers and mapped rings. Near has concrete grid shells whose windows are real
recessed panes surrounded by splayed reveals. Far keeps the same 28-row / ten-bay
facade rhythm with offset pane quads, disc profile, neck, mast, twin elevators and
stepped podium, while dropping reveals, most aerial supports and underside ribs.
Compatible geometry is merged into eight material draws in both variants.

The saucer is built from adjacent revolution bands rather than overlapping solid
rings; its underside is closed and joins the concrete core. Fine glazing mullions
follow the slope. Glass elevator tracks, side cheeks, static cabins, mast collars
and stylised two-sided red flag remain in far. Spencer windows and substantial
piers convey the masonry frontage; its ornaments and skylights are simplified.

Eight materials: warm tan concrete, pale sills, near-black blue glazing, shadow,
light metal, sandstone masonry, sparse self-lit warm night windows and red flag.
Light/dark palettes share names; glow is sensible glazing by day and warm light
at night. No textures, third-party meshes, scans or photographs are exported.

## Approximations and limits

The crown profile is an original approximation from photographs, not a survey:
small roof/aerial details and exact mullion counts are estimated. Podium floor
levels and historic ornaments are simplified, signs have no text, lifts and
restaurant do not animate, and interiors are omitted. The Canadian flag is a small
red silhouette without a maple leaf. Sparse window lighting is representational,
not a night lighting survey. Render cost is scene geometry, not Tesla timing.

Photos used only in ignored comparison files: Diego Delso, *Harbour Centre,
Vancouver, Canadá, 2017-08-14, DD 30* (CC BY-SA 4.0); David Herrera,
*Vancouver Lookout, Harbour Centre* (CC BY 2.0); Wpcpey, *Vancouver Lookout Lobby
2018* and *Vancouver Lookout Interior 2018* (CC BY-SA 4.0); Xicotencatl,
*Spencer Building Vancouver 02* (CC BY-SA 4.0); Dietmar Rabich, *Vancouver (BC,
Canada), Harbour Centre -- 2022 -- 1843* (CC BY-SA 4.0). Description-page links
and licences are in the catalog record; local downloads stay in `tmp/`.

## Verification

Read the dossier reference sheet and additional two-photo sheet before modelling.
First procedural contact sheet exposed excessively tall window panes and a
wrong-facing office-podium wall order. Second contact sheet corrected those,
then exposed recessed Spencer windows covered by its solid wall mass: final
Spencer glazing is offset externally and masonry piers retained. The underside
was changed from dark grey to concrete, matching the close reference photograph.

Procedural sheets judged:
`tmp/top-cities/shots/harbour-centre/iteration-1/harbour-centre-procedural-near-light-sheet.jpg`
and `tmp/top-cities/shots/harbour-centre/iteration-2/review-sheet.jpg` (overview,
facade, back, roof, street, detail, podium and top with red mapped footprint rings).
Final exported near/far light/dark contact sheet evidence and measured costs are
recorded below after export. Independent review accepted the asset PASS-WITH-NITS, recognisability 5/5; see the palette follow-up below.

Focused tests pin the antenna, office roof, radii of both glazed bands and the
rim, bubble-elevator projection, open air beside the support neck, real office
window recess, replacement-ring containment, and GLB/material round trips.

| Integration mode | Status |
| --- | --- |
| Cityscape | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately |

Build: `pnpm build:top-cities-landmarks harbour-centre --no-check`.

Final exported comparison judged: `tmp/top-cities/shots/harbour-centre/final/comparison-sheet.jpg`.
It places the four exterior references next to exported near/light overview,
facade, back, roof, street, crown detail and podium; near/dark overview, detail
and podium; far/light and far/dark overview, back and detail. The final exports
retain the offset saucer, two dark bands, visible neck, window grid and stepped
podium in both LODs. A final normal check corrected the centre-collapsed bottom
cap winding; the test rays explicitly confirm its downward-facing closure.
The podium remains an approximation of the historic frontage; small mullions,
stone ornaments and text are less detailed than the photographed building.

Measured exported default scenes:

| LOD | Triangles | Draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| Near | 30,062 | 8 | 1,629,916 | 1,592 |
| Far | 5,604 | 8 | 309,156 | 302 |

`qa-metrics.mjs --ids harbour-centre` reports no issues: zero coplanar overlap,
zero back-face hits in 232 intercepted sweep rays, minimum y=0, no bridgeLift
payload, and far silhouette within tolerance. The targeted combined test run
passes all Harbour Centre checks; the standalone landmark tests take about
0.3 s. `node scripts/asset-catalog.mjs` passes after the transient missing BC
Place documentation was completed by its owner. No shared files were edited,
no git write commands were run, and no app server or full test suite was used.


## Accepted-review palette follow-up

The independent review accepted the model **PASS-WITH-NITS, recognisability 5/5**.
The lead scoped this follow-up to the cheap concrete-colour nit only, retaining
the accepted proportions and the cream Spencer podium. Light concrete changed
from `#b5ada0` (pale warm grey) to `#a8957c` (warm tan/brown precast concrete);
dark concrete changed from blue-grey `#65707b` to matching warm brown-grey
`#635d55`. This darkens the office piers, support neck and saucer underside.
Pale Lookout eaves/sills (`#cec5b4`) and cream Spencer masonry (`#b4a084`)
retain their colours. Source changes were confined to the two concrete palette
entries; the existing 0.32 m window reveals and all geometry remain as accepted.

Re-exported near/far GLBs were inspected in one look-fix iteration using
`tmp/top-cities/shots/harbour-centre/palette-review/palette-contact-sheet.jpg`.
The sheet combines the standard exported near/far review views with near/dark
overview and crown detail, far/dark overview, and reference photo 2; the standard
sheet also contains the reference lead photo. Compared to the previous pale
finish, the tower and bowl read warmer and darker while the pale eaves and
podium remain distinct. No silhouette or facade-rhythm changes were made.

The supplied REVIEW.md contained no Prepare command, so the standard equivalent
preparation was used:

```sh
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids harbour-centre --out tmp/top-cities/harbour-centre/palette-review-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids harbour-centre --out tmp/top-cities/shots/harbour-centre/palette-review
```

All five landmark tests and catalog validation pass. Deterministic QA still
reports no issues, zero coplanar overlap and zero back-face hits; near remains
30,062 triangles / 8 draws / 1,592 KiB, far 5,604 / 8 / 302 KiB. The review's
optional deeper-window suggestion was outside the lead's palette-only scope.
Cityscape and Full 3D world placement remain not tested, checked separately.
