# Puente de Segovia, Madrid

Original procedural model of the Puente de Segovia, which carries Calle de Segovia over the Manzanares. Juan de Herrera built it in 1582–1584. It was blown up in November 1936, then rebuilt and widened after the war to about 31 m, and it now stands inside the Madrid Río park. The model shows the present bridge: nine semicircular granite arches, the central one largest and the rest decreasing symmetrically. The upstream (north) cutwaters are pointed with stepped pyramidal caps. The downstream (south) cutwaters are rounded, with stepped half-cone caps ("tajamares rematados cónicamente"). Proud voussoir rings, a dark water-stained plinth band and a cornice run under a plain parapet, with a ball finial on a pedestal over every pier and at both structural ends. The long plain east abutment is also modelled. These are what make the bridge recognisable.

The model leaves out the demolished 1648 ornamental gateway (Ardemans), the post-war patines and embarcadero, and the Madrid Río ponds and landscaping.

## Sources

- Spanish Wikipedia, *Puente de Segovia*: Herrera, 1582–1584; nine semicircular, rusticated ("almohadillados") granite arches; central arch largest, spans decreasing symmetrically; cutwaters with conical caps; simple parapet on the impost line with granite balls over the piers; destroyed 1936 and rebuilt widened.
- Mirador Madrid, *Puente de Segovia*: 31 m width after the widening; pointed cutwaters upstream (north) and semicircular ones downstream.
- OpenStreetMap: bridge outline 380275213 (building=yes, includes all 16 cutwater bumps), carriageway 380275223 (7 lanes) and the approach ways listed in `puente-de-segovia-alignment.js`. Extract saved in the lead dossier `tmp/top-cities/puente-de-segovia/osm.json`.
- IGN PNOA orthophoto (WMS GetMap, 0.12 m/px; © IGN, CC BY 4.0). Saved only to `tmp/top-cities/puente-de-segovia/pnoa.jpg` to measure widths, not redistributed.
- Reference photographs (dossier `refs/`, Commons): Manuel M. V. *Edificio Glorieta del puente de Segovia* (CC BY 2.0); Tiia Monto *Madrid - Segovia Bridge* (CC BY-SA 3.0); Carlos Delgado *Puente de Segovia (Madrid) - 01/02* (CC BY-SA 3.0). Links are in the catalog record. They were used for visual comparison only.

## Dimensions

| Feature | Evidence | Authored value |
| --- | --- | --- |
| Structure length | OSM bridge way / outline | 152.6 m, west face to east end, kept as mapped |
| Overall width | Mirador Madrid ~31 m; PNOA 31.1 m; OSM outline 30.7 m | 30.7 m (outline faces at −13.5 / +17.2 m of the OSM road line) |
| Carriageway / walks | PNOA: 24.3 m road centred on the structure, 3.4 m walk + parapet each side | 24.3 m road, 2.7 m walks, 0.5 m parapets |
| Number of arches, ordering | es.wikipedia | 9, central largest, symmetric |
| Clear spans | Estimated: fitted so the piers land on the eight mapped cutwater pairs | 8.4 / 9.6 / 11.1 / 12.6 / **13.0** / 12.6 / 11.1 / 9.6 / 8.4 m |
| Piers | Estimated from mapped bump widths (4.5–6.4 m) | 5.2 m; centres at 11.6, 26.4, 42.7, 60.5, 78.7, 96.5, 112.8, 127.6 m from the west face, within 0.35 m of the mapped cutwater pairs |
| Cutwater projection | OSM bumps, per pier | north 3.2–3.9 m, south 2.6–3.5 m (each its own mapped bump less 0.1 m) |
| Springing / crowns | Estimated from refs 1 and 3 | springing 1.0 m above the river; crowns 5.2 m (ends) to 7.5 m (centre) above it, i.e. 4.0 to 1.7 m below the road |
| Cutwater caps | Estimated from refs 1 and 4 | body to 0.42 r, stepped cap apex at 0.95 r of the smaller neighbouring arch (5.0–7.0 m above the river); 6 steps near, 3 far |
| Deck / parapet / finials | Estimated | road 9.3 m above the river and 0.10 m above the bank streets; walk +0.15 m; parapet 1.0 m + 0.12 m coping; 0.76 m balls on 0.6 m pedestals, top 2.7 m above grade |
| Lamps | Estimated, simplified Madrid cast-iron pattern | 8 posts on the walks (alternating sides), lanterns to 4.65 m above grade |

## Frame, profile and modelling decisions

- Geometry is in east/up/south metres about `[-3.7228546, 40.4140243]`, the midpoint of the mapped bridge carriageway. The geographic orientation (road bearing 91.5°) is baked in once through `createBridgeProfile`. **y = 0 is the bank-street grade**; the river is `RIVER` = −9.2 m. No DEM, sea level or latitude stretch is in the GLB.
- **Mapped span only, deck flush with the bank streets** (house rule for a low bridge over a canalised river, as Pont de la Fonderie). `puente-de-segovia-profile.js` cuts the Calle de Segovia alignment to the bridge way, 152.6 m end node to end node. The road is 0.10 m above grade, on a straight line between the two live bank datums; no approach ramp lies over the Glorieta or the Paseo de la Virgen del Puerto.
  - **Lateral:** rigid 24.3 m carriageway centred on the structure; walks and parapets run joint to joint and end square, where the bank streets' own walks begin.
  - **Fallback lane paint** (seven lanes) stops 1.5 m short of each joint, and the layer hides it whenever draped HD overlays cover the deck.
  - **Navigation:** the deck height is defined for both directions of travel. Crossing headings, the walks and points beyond the joints return null.
  - **Provider extrusion:** the outline is tagged `building=yes`, so `buildingFootprints` masks its provider extrusion.
- **Below grade.** The geometry is authored in a river frame (`geometry.js` shifts the profile by `RIVER`), so the arches, piers, cutwaters, caps, rings, cornice and coursing hang under the deck to the river. Cityscape's flat ground does not hide them, so `layer.js` shows `stone`, `base`, `ring` and `joint` in Full 3D world only.
- **Full 3D world: `bank-fit` plus a river cut.** The Terrarium DEM shows a smooth valley with no river channel: 586.9 m at the west joint, about 583.5 m mid-river and 584.6 m at the east joint. The deck rides the straight line between the DEM at the two joints (`groundControls`), 0.10 m above it there. The whole structure is rigid (`bridgeLift` 1) and runs on into the terrain. `puente-de-segovia-terrain.js` (runtime only, imported by `layer.js` alone) cuts the channel the DEM lacks: every near-lattice node strictly between the two abutments and at most one lattice cell (29.1 m) beyond either face is lowered to the water, `RIVER` + 0.3 m under the deck datum line, so the arches spring 0.7 m above it. Between the abutments the span crosses only water and pier strips (the river, OSM relation 3615910, s 45.5–93.3; the two Madrid Río pools under the side arches, relations 21595072 and 21595073; 6 m pier strips between them), so this is the mapped river level, not an invented valley. Never raised, no feather (each terrace holds one lattice node, the TIN supplies the slope), and never a node of a triangle under the bank streets the deck lands on (the road continuation 60 m beyond each joint, full structure width + 1 m). The pattern is Pont Mirabeau's north cutting (`terrainFootprint()` returning per-node terraces).
- Construction:
  - Each arch is one extruded prism across the deck, forming the barrel vault and spandrel fill.
  - Piers and abutments are prisms, with a `base` material up to the springing.
  - Cutwaters are lofted triangle soups. Each has a separate plinth, body and stepped cap, with its back edge 0.25 m inside the facade. Buried faces are omitted.
  - Near: 23–29 voussoirs per ring face, separated by small gaps, 0.14 m proud. Far: one ring prism per face.
  - Near only: ashlar coursing as 4.5 cm mortar joints, 10 cm proud, clipped around every opening, ring, cap and pilaster, plus parapet head joints in `trim`.
  - Two station chunks in near.
- Materials (same keys light/dark). Above grade: `parapet`, `trim` (coping, finials, parapet joints), `asphalt` (recoloured by the layer), `walk`, `paint` (seven-lane fallback), `iron`, `lamp` (self-lit lanterns at night). Below grade (Full 3D world only): `stone`, `ring` (voussoirs, cutwater caps, cornice), `base` (water-stained plinth), `joint`.

## Approximations

- **Estimated, not surveyed:** the spans (fitted to the mapped piers), springing, crowns, deck datum, cap proportions, parapet, finial and lamp sizes.
- **Simplified:** masonry is regular coursing without weathering or colour variation. The rustication is suggested by separated, proud voussoirs.
- **Masonry below grade.** Cityscape is flat, so it shows only what stands above the street (deck, walks, parapets, coping, finials, lamps). Full 3D world shows the arches over the river cut: on a 29.1 m lattice the cut is 12 nodes (four columns at s ≈ 36, 65, 94 and 123 m, three rows straddling the faces), flat water from s ≈ 36 to 120 m. The first lattice column inside each abutment (s ≈ 7 and 152 m) holds the bank streets' triangles and is kept, so the ground slopes from the water up to grade over the two outer arches at each end; they show their crowns, not their springings. The quays are TIN slopes, not walls.
- **Seven-lane fallback paint** is drawn only without lane details; its lanes are evenly spaced.
- The pier "pilasters" over the caps are an interpretation of the projecting pier faces seen in ref 4.

## Costs

| GLB | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 23,172 | 22 | 1,772 KB |
| Far | 6,240 | 9 | 473 KB |

Budget: near ≤ 120 k / 40 / 4.5 MB, far ≤ 30 k / 10 / 1.2 MB. Far is 27 % of near: it keeps every arch, cutwater, cap, ring, finial, lamp and the parapet, and drops joints, ring gaps and lane dashes.

## Verification

Look/fix rounds (all sheets under `tmp/top-cities/shots/puente-de-segovia/`):

1. `r1/…-sheet.jpg` (procedural near, eight views) and `r1/…-top.png`. The pointed noses are north and the rounded ones south, on the red OSM rings. The colours were too pale against the photos, so I darkened the granite. I also moved the cornice up directly under the parapet (ref 3) and made the joints wider and darker.
2. `export/export-reference-sheet.jpg`: exported GLB near/far, light/dark, beside refs 1–4. The caps overtopped the crowns of the small end arches, which refs 1 and 4 contradict. Caps are now per pier, stopping under the smaller neighbouring crown.
3. Final exported sheet `export2/export-reference-sheet.jpg`: street, three-quarter, pointed-pier, rounded-pier, underside and deck views, near/far, light/dark, beside the four references. It is recognisable at a glance.

Along the way, the landmark test's footprint check found that the last downstream nose is mapped shorter (2.7 m) than the others. Each nose now takes its projection from its own mapped bump. The depth-layer check found three cycles: a parapet top face buried inside the coping, and a lamp cap disc coplanar with its lantern top. I removed the buried face and stacked the lamp parts. The result: 0 cycles, `--check` current.

Tests (first build): `node --test …/top-cities.test.js …/puente-de-segovia/puente-de-segovia.test.js` passed 777/777; the landmark file then covered the items below (since the flush-deck revision it pins the flush deck, the joint ends, the grade split and the HD paint toggle instead of the ramps):

- arch openings and crown closure for all nine arches, with spans measured by raycast within 0.15 m and checked to be semicircular;
- pier rhythm against the mapped cutwaters, and a pointed versus rounded nose chord;
- caps that climb toward the facade and stay under the neighbouring crowns;
- the 30.7 m face-to-face width, footprint containment (0.8 m provider slack) and grade envelope;
- solid-column contacts for finials, lamps, parapet feet and pilaster/cap/cutwater columns, plus a synthetic floating-member case that proves the probe can fail;
- both headings, crossing and walk rejection, rigid river spans and the ramp grade;
- a GLB round trip.

`node scripts/asset-catalog.mjs` is valid.

### In-app (local, slot D; raised-deck revision, superseded)

Server on 3282 for Cityscape and 3284 for Full 3D world (Terrarium terrain), with the bundle built from this worktree. Captures:

- `app-cityscape/` and `app-world/`: `app-shot.mjs` far/near/street. The layer loaded and was active, near and far.
- `approach-cityscape/` and `approach-world/` (`tmp/top-cities/puente-de-segovia/approach.mjs`): both landings in both directions, close-ups of each ramp foot both ways, both abutments and a river-side view. Sheets: `sheet.jpg` and `sheet-feet.jpg`.

Findings:

- The pavement meets each foot with no step or gap.
- The generic provider bridge does not double the deck, and the outline's building extrusion is masked.
- The first Cityscape pass showed square full-width ramp ends with walks and kerbs. These now taper to the bare carriageway, as recaptured.
- In world mode the piers stand on the terrain and the ramps land on the DEM.
- HD lanes were not tested: no Redis or `/osm-lanes` locally.

`heightAt(lng, lat, heading)`: metres above the query ground. Values are identical for headings 91.5° and 271.5°. A heading of 1.5° returned null at every station, as did the south walk and a point 2 m beyond the west end. Raw data is in `approach-*/heights.json`.

| Station (from west structural end) | Cityscape | Full 3D world | World query ground (m) |
| --- | ---: | ---: | ---: |
| −104 (west alignment end) | 0 | 0 | 597.20 |
| −100 (ramp foot) | 0.000 | 0.000 | 596.96 |
| −74 | 2.024 | 1.466 | 595.21 |
| −50 | 4.650 | 4.452 | 592.67 |
| 0 (west structural end) | 9.300 | 9.300 | 586.88 |
| 69.6 (central arch) | 9.300 | 11.364 | 583.77 |
| 152.6 (east structural end) | 9.300 | 9.300 | 584.58 |
| 202.6 | 4.650 | 4.650 | 588.09 |
| 226.6 | 2.024 | 2.020 | 590.13 |
| 252.6 (ramp foot) | 0.000 | −0.007 | 592.23 |
| 255.6 (east alignment end) | 0 | −0.002 | 592.45 |

The world mid-river value (11.36 m) is the level deck over a DEM that dips 2 m between the banks. Pier feet carry `bridgeLift` 0, so the shared fit puts them at their local DEM by construction; I did not measure the residuals separately. The −0.7 cm at the east foot is query-ground interpolation and is negligible.

### Review fixes (g3a, 2026-10-15; superseded by the second round below)

The independent review (FIX, 4/5) found broad rectangular ramp mouths (the 22 m default) feeding a much narrower provider road, with lane paint ending across the whole mouth. Changed: the default foot is now 8 m on the provider road's OSM line, which is what the SD ribbon measures at driving zooms, with the 24.3 m structure carriageway easing to it down each ramp; the walks, kerbs, parapets and ramp slab follow the narrowed edges; the fallback paint drops out lane by lane and the centre line ends about 20 m before each foot. With lane details on, the measured HD pavement still overrides the default (pinned by the test). The heights are unchanged (same profile). The mouths now meet the ribbon at its width with no step, and no line crosses them. Height probes match the table above in both modes (0 at both feet, 9.3 m at the abutments; null for crossing headings, the south walk and beyond the west end). Costs before → after: near 30,770 → 30,440 tris (18 draws, 2,436 → 2,407 KB), far 9,624 → 9,598 tris (8 draws, 769 → 767 KB).

Not changed: the reviewer's second point, that the 10.9 % ramps read as a raised causeway over the bank streets rather than the real level connection. In flat Cityscape the river is at grade, so a lower deck would bury the 7.5 m central arch, a shorter ramp would be steeper and a longer one would reach over more junctions; the real fix needs a sunken river channel the flat map does not have. In Full 3D world the DEM shows no channel either (see above). This is left to the lead.

The raised causeway described here was replaced in the second fix round below.

### Second fix round (g3a2, 2026-10-15): flush deck, mapped span only

The re-review (FIX, 4/5) kept the raised causeway (9.3 m deck, 100 m ramps at 10.9 % over flat bank streets) as the blocking defect and asked for HD pavement/paint and a moving drive through both landings. The lead's house rule for a low bridge over a canalised river applies: model the mapped span only, deck flush with the bank streets, no authored approach over junctions or bends, masonry below toward the river.

Changed:

- **Profile:** the alignment is the bridge way itself, 152.6 m end node to end node. The road is 0.10 m above the bank grade, on a straight line between the two live bank datums (`deckHeight`, as Pont de la Fonderie). No ramps, no landing taper, no lateral fit: the carriageway stays at its authored 24.3 m (`roadEdges`, `fittedLateral` identity), and the fallback paint stops 1.5 m short of each joint, where the bank streets' junction paint begins.
- **Geometry:** authored in a river frame and exported in the bank-grade frame (`RIVER` = −9.2 m), so the arch rhythm, cutwaters, caps, rings and coursing are unchanged and hang below the deck. Every vertex is rigid (`bridgeLift` 1). Materials split by grade: `parapet` (new, the parapet wall) and `trim` (coping, finials, parapet joints) stand above it; `stone`, `base`, `ring` (new: voussoirs, cutwater caps, cornice) and `joint` are wholly below it (pinned: above-grade min y ≥ 0, below-grade max y ≤ 0). Mortar joints are now 10 cm proud (were 3 cm). Far draws the walk in the parapet's near-identical colour (9 draws, not 10).
- **Layer:** `layer.js` hides the below-grade materials in Cityscape and shows them in Full 3D world (the Fonderie and Millau pattern). It also hides the model's fallback lane paint while draped HD overlays cover the deck: the in-app check with lane details on showed both sets of lines, because the fallback paint, 3 cm under the HD pavement with a depth-layer offset, showed through it.
- **Full 3D world:** `groundControls` are the two joints only. The structure rides the line between the DEM there and runs on into the terrain. The Terrarium DEM still has no channel (about 2 m dip), so most of the arches are under the terrain; the deck is 0.1 m above it at the joints and up to 2.2 m above it mid-river.

Costs before → after: near 30,440 → 23,172 tris, 18 → 22 draws, 2,407 → 1,772 KB; far 9,598 → 6,240 tris, 8 → 9 draws, 767 → 473 KB. Depth layers regenerated for this id: 0 cycle edges dropped, `--check` current. Landmark test 12/12, conformance 793/793, `asset-catalog.mjs` valid.

Exported GLB sheets: `tmp/top-cities/shots/puente-de-segovia/g3a2-r1/` (near light: below-grade facade, tower, detail and street views keep the nine arches, rings, coursing and cutwaters; the inspector's ground plane hides them from above, like Cityscape; `far/…-far-dark-sheet.jpg`).

Public Overpass refuses this machine, so the nine z15 `/osm-lanes` tiles round the bridge were copied from staging's guest endpoint into the local Redis (payload v4, same as local). Script `tmp/next-200-fix2/approach.mjs`, captures and `heights.json` in `tmp/next-200-fix2/approach-{cityscape,world}/` (sheets `sheet-static.jpg`, `sheet-drive.jpg`; Cityscape without lane details: `sheet-nohd.jpg`):

- Lane details on, both modes: both landings in both directions, both joint close-ups and overheads, the river side. One set of lane lines on the deck (the HD paint), the HD junction paint at both joints is visible and unburied, no step or gap at either joint, no folded bend.
- A drive: 10 Hz geolocation fixes at 12 m/s along the road, eastbound and westbound, with the follow camera; frames before, on and after each joint and at mid-span. The car stays on the deck and the camera follows with no jump at either joint, in both modes.
- `heightAt`: Cityscape 0.10 m from s = 0 to s = 152.6 for headings 91.5° and 271.5°, null beyond both joints, on both walks and for a crossing heading. Full 3D world: 0.10 m above the query ground at the west joint, rising to 2.2 m above it mid-river (the DEM dip) and 0.55 m at s = 145, identical in both directions. Rendered asphalt minus (`heightAt` + query ground) is under 0.03 mm in world.
- Without lane details (Cityscape): the deck's fallback lanes are drawn; the 24.3 m carriageway meets SD ribbons that are narrower at driving zooms, an honest width step at a junction rather than a defect of the deck.

Not tested: moving traffic, a routed drive (navigation needs an account locally), mode-switch lifecycle and device performance. `src/peregrine/landmarks/depth-layers.js` and `public/peregrine*.js` were regenerated locally and are not committed.

### Third fix round (g3a3, 2026-10-15): the river channel in Full 3D world

The re-review (FIX, 2/5 in app) found that Full 3D world's terrain buried the nine arches and cutwaters, leaving a parapet strip over a flat valley. The flush deck and the mapped span stay as they were; the model and the GLBs are unchanged (no re-export: same 23,172 / 6,240 tris, 22 / 9 draws, 1,814,404 / 484,028 bytes).

Changed: `puente-de-segovia-terrain.js` and `layer.js#terrainFootprint()`, the river cut described above. Cityscape has no terrain and no cut (`terrainFootprint()` is null there). The far terrain lattice (z12 or coarser) shares no node with the cut (none of the 12 is a multiple of 4 on both axes), so a zoomed-out view keeps its DEM.

Test (`puente-de-segovia.test.js`, 13/13): on a synthetic sloping DEM the cut lowers only nodes strictly between the abutments and within one cell of the faces, never raises one, leaves every bank-street point (60 m beyond each joint, full width) and both deck datums exactly unchanged, puts water under every springing of the four central arches on both faces (mid-span floor = `RIVER` + 0.3 within 2 cm), shows at least the upper half of the next arch each side, spills nothing two cells beyond a face, and declines to cut a DEM already below the water. Removing the street protection or raising the water to 2 m fails it.

Script `tmp/next-200-fix3/approach.mjs`, captures and `heights.json` in `tmp/next-200-fix3/approach-{cityscape,world}/`; sheets `tmp/next-200-fix3/sheet-world-sides.jpg`, `sheet-landings-{world,cityscape}.jpg`, `sheet-drive-{world,cityscape}.jpg`:

- World, side views from the south and north banks at three distances (`river-side-*`, `side-*-near`, `side-*-far`) and two obliques: seven arches stand open over the water with their cutwaters (pointed upstream on the north face, rounded downstream on the south face), the outer pair at each end half-buried by the bank slope.
- Both landings in both directions, both joint close-ups and overheads, both modes: the bank streets and their HD junction paint are where they were, the deck meets them flush, the lane paint is one set. Cityscape is unchanged from round 2.
- A 10 Hz geolocation drive both ways in both modes: the car stays on the deck through both joints. World `heightAt` is now relative to the cut ground: 1.25 m at s = 8, 9.0 m mid-span, 2.55 m at s = 145 (the deck itself has not moved).
- Probes (`tmp/next-200-fix3/probe.mjs`): the zoned terrain equals the raw DEM TIN at all 744 bank-street samples (max difference 0); the ground under both faces is −8.90 m (model metres from the deck datum) from s = 36 to 120 m.
- Pavement residual, measured on real vertices this time: the 30 asphalt vertices of the model's carriageway are within 0.026 mm of `heightAt` + query ground in world (0.0000015 mm in Cityscape), and the 228 draped HD pavement vertices on the span are within 0.023 mm of it after their 6 cm surface bias (0.000002 mm in Cityscape). The round-2 figure above came from a probe that had sampled no vertex (`heights.json`: `vertices: 0`); this replaces it.

Not tested: moving traffic, a routed drive, mode-switch lifecycle, device performance. `public/peregrine*.js` was rebuilt locally for the captures and is not committed.
