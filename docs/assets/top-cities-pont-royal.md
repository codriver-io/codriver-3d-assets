# Pont Royal, Paris

Original procedural, road-fitted model of the Pont Royal across the Seine, the stone bridge built 1685–1689 (Jacques IV Gabriel and Jules Hardouin-Mansart, works by François Romain) to replace the wooden Pont Rouge. It runs from the Quai Voltaire at the Rue du Bac to the Quai François Mitterrand by the Pavillon de Flore and the Tuileries. What makes it this bridge: five three-centred basket arches growing towards the middle, four piers with pointed cutwaters on both faces under pyramidal stone chaperons, a voussoir head ring around every arch, a plain cornice and a solid stone parapet over a gently humped deck, flared mouths where the quays meet it, and the hydrometric (flood) scales on the last pier of each bank. The model is the bridge as it stands today; the Revolution-era renaming and the carved arms on the centre arch are not represented.

## Sources

- [Wikipédia (fr), *Pont Royal (Paris)*](https://fr.wikipedia.org/wiki/Pont_Royal_(Paris)), citing the 1685 specification: centre arch 72 ft (23.40 m), intermediate arches 69 ft (22.42 m), bank arches 64 ft (20.80 m); three-centred basket arches rising one third of their opening; every pier 14 ft (4.55 m); hydrometric scales on the last pier of each bank.
- [Wikipedia (en)](https://en.wikipedia.org/wiki/Pont_Royal) and [Structurae](https://structurae.net/en/structures/pont-royal): length 110 m, width 17 m.
- OpenStreetMap (dossier extract 2026-10-14, ODbL): bridge outline [way 176396894](https://www.openstreetmap.org/way/176396894) with its eight cutwater noses and quay flares; carriageway ways 21124959 (bridge), 176408879/21124917/22874870 (Rue du Bac side), 531267850/176408882/318380798 (Avenue du Général Lemonnier side).
- IGN orthophoto (Géoplateforme WMTS `ORTHOIMAGERY.ORTHOPHOTOS`, z19, 0.20 m/px, Licence Ouverte 2.0; tiles kept in ignored `tmp/` only): measured 17.3–17.5 m over the cornices, a ~10 m cobbled carriageway with a dashed lane line, ~3 m walks, cutwater spacing ~27.4 m.
- Reference photographs (reference only, under ignored `tmp/top-cities/pont-royal/refs/`): Jean-François Gornet, *Pont Royal 2009* (CC BY-SA 2.0); Pierre Blaché, *Pont Royal and Musée d'Orsay* (CC0); DXR, *Musée d'Orsay and Pont Royal, North-West view* (CC BY-SA 3.0); *France Paris Pont Royal 01* (CC BY 2.5); Djielle, *Crue 2016 – Échelle de crue du Pont Royal* (CC BY-SA 4.0); Livinus Cruyl 1686 and the 1814 BnF view (public domain). Links in the catalog record.

## Dimensions

| Feature | Evidence | Authored |
| --- | --- | --- |
| Arch openings | 1685 specification (sourced) | 20.80 / 22.42 / 23.40 / 22.42 / 20.80 m at the springing |
| Arch form | sourced: three-centred, rise = opening / 3 | 60° segments, r1 = 0.545 a, r2 = 1.455 a; rises 6.93 / 7.47 / 7.80 m |
| Piers | sourced 4.55 m | 4.55 m, centred on the mean of the four mapped noses (each within 1.1 m of OSM) |
| Abutment to abutment | sourced spans + piers = 128.04 m | 128.04 m; mapped flare corners at u = −9.6 / 122.0 m |
| Width | sourced 17 m; IGN 17.3–17.5 m | faces ±8.35 m, cornice ±8.65 m (17.3 m) |
| Carriageway / walks | IGN orthophoto | 10.0 m setts, 2.85 m walks, 0.5 m parapets |
| Cutwaters | OSM noses 4.1–4.5 m out; photo proportions | 4.3 m out, 4.6 m wide; body to 3.6 m, coping to 4.15 m, chaperon tip 6.4 m above the modelled water |
| Crown to walk | photo (Gornet 2009, scaled by the 23.40 m opening) ~1.2 m | 1.35 m (centre), 1.43 m (intermediate), 1.37 m (bank arches) |
| Voussoir ring | photo estimate | 0.75 m radial, 0.12 m proud, 23–25 voussoirs per arch |
| Flared mouths | OSM flares open to ±16–19 m | ±15 / ±13 m (south), ±18.5 / ±15 m (north), wide enough for the turning carriageway |

Bearing of the mapped carriageway 26.1°; origin `[2.3299162, 48.8601221]` is the crown of the centre arch on that axis. Orientation is baked in from the two mapped carriageway nodes (merge and split). The structure frame (u along the axis from the south merge node, d across, + upstream) is straight; the road centreline is the mapped carriageway with 18–30 m fillets and lies on the axis from u = 5.5 to 105.5 m.

## Profile: flush with the quays (both modes)

House rule for low bridges over the canalised Seine (review g4a, 2026-10-15): the model is the **mapped span only**, from quay corner to quay corner (u = −9.6 to 122.0 m, 136.4 m along the road), with the deck **flush with the live quay street**: 0.10 m proud of the quay datum at both mouths, level through the flared mouths, then a parabolic 0.85 m dos d'âne to 0.95 m over the centre arch (steepest grade 3.4 %). There are no authored ramps; Rue du Bac, Avenue du Général Lemonnier and the quay roads stay live provider roads (`clipStandardEnds`), so the quay junctions, stop lines and turns are never buried. The carriageway's square-cut ends are slid back along the road to the quay line, so the curving road never overshoots a mouth.

y = 0 is the quay grade. The river (normal level) is 7.2 m below it, the arches spring 1 m under the river, and the piers, cutwaters and quay walls run on to 10.2 m below grade (`belowGradeM: 7.5`) so on terrain every support ends in the riverbed.

- **Cityscape:** the flat ground writes no depth, so everything wholly below grade is drawn only on terrain (`layer.js`, the Millau / Pont de la Fonderie pattern): materials `masonry` (spandrel faces below grade, piers, cutwaters, chaperons, aprons, quay walls), `ring` (voussoirs, cutwater copings), `glow` (soffits), `mark` and `gauge` (flood scales). What stays is the deck, walks, setts, cornice, parapet and a `stone` strip of face from grade up to the cornice under the hump, so the cornice never hovers over the water. In Cityscape the Pont Royal therefore reads as its humped stone deck, cornice and parapets; the arches show only in Full 3D world.
- **Full 3D world:** `bank-fit`. The datum is the live ground where each street leaves the mouth (`groundControls` at s = 0 and s = L); the crossing interpolates bank to bank (no riverbed sample). The Mapterhorn DEM tilts steeply across both mouths (−2.9 m to +1.9 m over 28 m at the south end: the quay walls and terraces smeared), so `lateralBankFit { blendM: 16 }` gives each mouth the ground's crossfall at the quay line and eases back to the bank line by the hump, as on the Pont de la Concorde; fans and carriageway are split into lanes across (8 and 4 near) so each vertex takes its own crossfall. Where the ground rises inside a mouth (north: +0.3 m at 6 m in), `layer.js#mouthControls` adds one control at the highest point within 12 m; ground falling towards the river adds nothing, so the deck never sags into the trough. Lift weights are all 1: rigid masonry rides with the deck. `fittedLateral` is identity.

## Materials

`stone` (limestone walls, parapets, cutwaters, chaperons, quay walls), `trim` (voussoir rings, cornice, copings), `glow` (arch soffits: shaded stone by day, warm uplight at night as in the dusk reference), `setts` (cobbled carriageway and mouth fans), `walk`, `asphalt` (ramps), `paint` (dashed lane line), `mark` and `gauge` (the engraved metre marks and the modern white gauge of the flood scales, near only). Same keys light/dark; dark dims stone to blue-grey.

## Modelling decisions and approximations

- One spandrel polygon per face (earcut) with the five openings, a smooth lofted soffit per arch, and separate voussoir prisms with 5 cm joints (near) or one continuous band (far).
- Cutwaters are pointed prisms with a projecting coping and a two-faced pyramidal chaperon whose tip meets the spandrel wall over the pier; the nose bases stay inside the pier so the openings keep their sourced width.
- Flared mouths: the parapet and cornice follow the flare; a 1.2 m corbelled apron carries them over the bank arches (which stay open beneath), and quay walls run from each flare corner down to the riverbed. The walks run on to the quay pavements (no return wall across them); the parapet and cornice end in caps at the corners.
- Flood scales: on the downstream flank of piers 1 and 4, engraved tick marks plus a white gauge plate with dark marks (near only), after the 2016 flood photograph. Numerals are not modelled.
- Not modelled: the arms of France on the centre arch, masonry coursing, lamps/signs, the quays and the lower quays (port des Saints-Pères), the river.

## Costs

| GLB | Triangles | Draws | KB |
| --- | ---: | ---: | ---: |
| Near | 10,614 | 20 | 864 |
| Far | 4,616 | 8 | 389 |

Before the flush refit: near 9,042 / 18 / 664 KB, far 4,136 / 7 / 302 KB. The two extra draws are the below-grade `masonry` and `ring` materials that Cityscape hides. Far keeps every arch, cutwater, chaperon, ring band, cornice and parapet; it drops voussoir joints, copings, kerbs detail and the flood scales.

## Verification

- Inspector rounds (contact sheets opened): `tmp/top-cities/shots/pont-royal/r1/` (first build: the flared wing walls dropped to the ring line and hid the bank arches; mouths drawn as wide walks), `r2`/`r3` (corbelled aprons; mouths re-paved as carriageway fans; walk widths fixed; top views of both mouths `r3/mouths.jpg` against the red OSM outline), `r4` (compared with the Gornet 2009 photograph, `r4/cmp4.jpg`, `r4/crop4.jpg`: the measured crop showed the crowns sit ~1.2 m under the walk and the cutwaters/chaperons are much taller than first modelled), `r5` (re-proportioned: water at 1 m above springing, ring 0.75 m, cutwater body 3.6 m, chaperon tip 6.4 m).
- Exported GLB sheets with the references: `tmp/top-cities/shots/pont-royal/glb/export-contact-sheet-A.jpg` (near light, far dark, refs 4/2/6) and `export-contact-sheet-B.jpg` (near dark, far light); views overview, facade (downstream), back (upstream), tower (pier/chaperon), underside, south and north mouths, roof.
- `qa-metrics.mjs`: 0 coplanar pairs, 0 layered faces, 0 % back-face hits on 73 rays, minY −0.02 m (ramp fascia at the street), top 9.40 m. `landmark-depth-layers.mjs --ids pont-royal`: 0 cycle edges; `--check` current.
- Tests: `pont-royal.test.js` (16; pre-refit list, plus the flush profile, the Cityscape below-grade split, clipped carriageway ends and the inner-mouth datum) pins the five openings through the full width, the sourced spans at the water and the one-third rise by raycast, 4.55 m piers within 1.1 m of the mapped noses, 17.3 m over the cornices, the 0.85 m hump and crown-to-walk gaps, pointed tapering cutwaters and rising chaperons, chaperon/coping contacts with a detached-point negative case, containment in the mapped outline (0.8 m provider slack; nose tips 1.3 m), quay end walls and parapet returns, the flood scales on the end piers only, both headings on the profile, crossing/off-road refusals, ramps < 10 %, deck surface = profile, rigid width, and the GLB round trip. `top-cities.test.js` + landmark test: 790/790 pass; `node scripts/asset-catalog.mjs` valid.

## Review fix (g4a, 2026-10-15): flush deck

Reviewer defects: (1) the world deck rode ~7 m above the quays on 90 m ramps over the bank intersections; (2) quay side links met raised mouths at a cliff; (3) navigation continuity untested. Changes: the 7.3 m lift and both ramps removed (mapped span only, deck = quay datum + 0.10 m, 0.85 m hump kept; five arches, one-third rise and stone unchanged), below-grade parts hidden in Cityscape, world datum from the street ends with crossfall and the inner-mouth control, carriageway ends clipped to the quay line, `OSM_WAYS` trimmed to the bridge-tagged ways (the streets beyond the corners stay live).

Cityscape :3278, Full 3D world :3280 on the production Mapterhorn archive `tiles.codriver.io/terrain`, 512 px, z12). Shots opened: `tmp/top-cities/shots/pont-royal/fix-app/{cityscape,world}-sheet.jpg` (both landings, bearings 26°/206°/116°, near and far), `fix-app2/sheet.jpg` (side views across the river, north mouth close-ups), `fix-app4/ne.jpg` (north-east and south-west mouths after the lane split: the sawtooth where terrain cut the two-vertex fan is gone), `fix-final/sheet.jpg`. HD lanes not tested (no local `/osm-lanes`).

`window.__map.landmarks.heightAt` on the road centreline (metres above the query ground; `tmp/top-cities/pont-royal/fix/heights-{cityscape,world}.txt`). Reverse headings equal forward; every crossing heading, every probe 9.5 m off the centre (walks) and 8 m beyond each end (the live streets) returns null in both modes.

| Station | Cityscape | Full 3D world |
| --- | ---: | ---: |
| South end (s = 0.3) | 0.100 | 0.151 |
| South mouth (s = 6) | 0.100 | 1.123 (ground falls to the river) |
| Hump start | 0.100 | 3.44 |
| Pier 1 | 0.387 | 4.82 |
| Crown | 0.950 | 5.82 |
| Pier 4 | 0.373 | 4.04 |
| North mouth (s = L − 6) | 0.100 | 0.100 |
| North end (s = L − 0.3) | 0.100 | 0.131 |

World values over the river are the deck above the DEM's trough (only ~5.4 m deep at this resolution, so on terrain the lower parts of the arches are in the ground). Before the inner-mouth control the north mouth read −0.18 m (deck under the ground). Moving car/route through both landings and mode switches were not driven; the static heightAt walk above stands in for them.

## Earlier in-app verification (superseded raised profile)

Shots opened: `tmp/top-cities/shots/pont-royal/app-city/sheet.jpg` (Cityscape far/near/street: model loaded and active in both LODs beside the Musée d'Orsay and Louvre landmarks, no doubled provider deck), `app-approaches-cityscape/sheet.jpg` and `app-approaches-world2/` + `app-world/` (ad-hoc `app-shot --at` at the south landing (Quai Voltaire / Rue du Bac) and north landing (Quai François Mitterrand / Lemonnier), bearings 26° and 206° each, both modes). The ramps are drawn in the map's own pavement colour (the shared layer recolours `asphalt` and draws it unshaded), so the deck's setts give way to the street colour at the quay end walls and the ramps read as the streets rising to the deck. HD lanes were not tested (no local Redis / `/osm-lanes`).

`window.__map.landmarks.heightAt(lng, lat, heading)` on the road centreline (metres above the query ground; full dumps `tmp/top-cities/pont-royal/heights-{cityscape,world}.txt`). Reverse heading gives the same value; every crossing heading (+90°) and every probe 9.5 m off the carriageway centre (on the walks) returns null in both modes (20/20).

| Station | Cityscape | Full 3D world |
| --- | ---: | ---: |
| South ramp end, Rue du Bac (s = 0.5) | 0.0008 | −0.051 |
| South ramp mid (s = 45) | 3.650 | 0.872 |
| South abutment (s = 90) | 7.300 | 11.927 |
| Hump start (u = 5.5) | 7.300 | 13.548 |
| Pier 1 | 7.587 | 14.316 |
| Crown, centre arch | 8.150 | 14.911 |
| Pier 4 | 7.573 | 14.806 |
| North abutment | 7.300 | 11.359 |
| North ramp mid | 3.650 | 7.852 |
| North ramp end, Lemonnier | 0.0008 | −0.122 |

World datum: `bank-fit` with explicit `groundControls` at the two street ends and on each quay 25 m inland of its abutment; the crossing interpolates bank to bank. The world values are relative to the local DEM, which on the coarse Terrarium source dips into the river trough under the abutments and piers, hence the larger numbers there; the deck itself is 7.3–8.15 m above the interpolated quay datum, i.e. about 7 m higher than the real deck, which sits at quay level (flat-map compromise carried into world mode, as with the Pont-Neuf in Toulouse). Two other datums were measured and rejected: the default alignment-vertex controls (fillet points by the river) and an explicit river-surface sample both buried the south ramp 2.1–2.2 m below ground at mid-ramp. Worst residual with the shipped controls: ramp ends 5–12 cm below the query ground at the streets. Moving car/route/camera, lifecycle and mode switches: not tested.

## Review fix (g5, 2026-10-15): quay pavement seam

The north mouth's clipped curved carriageway overlapped the lowered fan of setts, exposing a dark tongue and pale slivers where the terrain crossed them. Each mouth now has one continuous fan at the deck level, ending exactly on the quay line; the central carriageway ends on the fan's straight inner seam. Walk edges continue the mapped road-edge tangent where the inside of the curve leaves the span. The fans use 0.5 m longitudinal strips and 24/12 lateral subdivisions near/far to follow quay crossfall without a jagged intersection.

Full 3D world clamps the mouth datum to its own local ground where that is higher than the bank fit, easing to the unchanged central span over the last 2 m. The same bank function fits the stone, walks, paving, navigation heightAt and HD overlays; refits always start from immutable authoring coordinates. The previous post-fit mesh-only lift was replaced so navigation cannot lag behind the paving. Cityscape retains the accepted low bridge: 0.10 m at both quay mouths, 0.85 m gentle hump, arches hidden below grade.

Exported GLB sheet opened: `tmp/top-cities/shots/pont-royal/g5-resume-glb/pont-royal-glb-near-light-sheet.jpg` (overview, roof, both mouths). The bridge is active in every landing view; world uses the production Mapterhorn terrain. Both headings agree, transverse headings return null; Cityscape endpoints are +0.100 m, world south +0.151 m and north +0.131 m above query ground. HD lanes and driven route/car playback remain not tested.

Costs before → after (tris / draws / KiB): near 9,512 / 20 / 730 → 10,614 / 20 / 864; far 4,032 / 8 / 318 → 4,616 / 8 / 389. Additional vertices resolve ground crossfall; no new draw calls. Export depth table has zero cycles and passes --check. The focused test now also exercises a rising quay, shared geometry/navigation height, repeated refits and restoration to Cityscape in both LODs.
