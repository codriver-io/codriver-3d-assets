# Musée des Confluences, Lyon

Original procedural model of the Coop Himmelb(l)au museum opened in 2014 at 86 quai Perrache. The present building is represented: silver exhibition **Nuage**, glazed north **Cristal**, and low **Socle**. At road distance the elevated cloud, southern cantilevers, roof funnels and glass wedge establish the identity; the steel cage, panel joints and branching supports provide closer detail.

## Sources and rights

- [Architect project page](https://coop-himmelblau.at/projects/musee-des-confluences/): 2014 opening, three principal components and published overall 190 × 90 × 41 m dimensions.
- [Museum architecture](https://museedesconfluences.fr/fr/le-musee/larchitecture): crystal/cloud concept and architectural identity.
- Provided shared-helper OSM dossier, `tmp/top-cities/musee-des-confluences/osm.json`: way [98117664](https://www.openstreetmap.org/way/98117664), wall-free projections 312337539 and 312337540, southern canopy 440270635. No height or level tags in these ways. © OpenStreetMap contributors, ODbL 1.0.
- Reference sheet `tmp/top-cities/musee-des-confluences/refs-sheet.jpg` viewed before authoring: Fred Romero, *Lyon - Musée des Confluences (49525806051)* (CC BY 2.0), Samolymp, *Musée Des Confluences 06-08-2013* (CC BY-SA 3.0), plus the four photographs credited in the catalog provenance and dossier `refs/SOURCES.txt`.
- Two additional reference-only official exterior photographs, Raimund Koch (-02) and Sergio Pirrone (24), from the architect project page. Copyright reserved; originals stay in ignored `tmp/top-cities/musee-des-confluences/refs/extra-{1,2}.jpg`, with URLs in `EXTRA-SOURCES.txt`.

All geometry is original hand-authored procedural work. No external mesh, photograph, texture, photogrammetry or traced mesh is shipped. The finished de Young model was studied for merged panel batches, lofts and LOD discipline, without copying its source.

## Dimensions and frame

| Feature | Value | Basis |
| --- | --- | --- |
| Maximum height | 41 m in both exports | Published architect height; offset panels |
| Overall project size | 190 × 90 m | Published architect figure; scope broader than mapped body |
| Exported geographic bounds | About 98 × 158 m east-west / north-south | Measured model, constrained to cadastral rings |
| Main cloud roof | 31 m | Photographic estimate |
| Main cloud soffit and tapered tip underside | 14–28.4 m | Photographic estimate; chamfered perimeter |
| Second roof funnel | 37 m | Photographic estimate |
| Crystal ridge / northern toe | 34 / 8 m | Photographic estimate |
| Service plinth | 3.2 m | Photographic estimate |
| Model origin | [4.81808, 45.732595] | Rounded mapped body centroid |
| East facade bearing | About 8° from north | OSM control points below |

Two east outline controls are [4.8186229, 45.7332597] and [4.8185751, 45.7329014]: about 40 m apart, along a bearing of 7.6° modulo 180°. Geometry is authored directly in east/up/south, so this placement is already baked into the GLBs. No host rotation is needed. `y=0` is local plaza grade, with no absolute altitude or latitude stretch.

The cadastral body is smaller than the architect’s overall project envelope. The published 190 × 90 m is retained as context rather than used to enlarge the mesh over roads or rivers; this scope discrepancy remains an approximation for independent review. Four rings mask only museum-owned features. Every near and far vertex passes the layer’s containment predicate with its normal 0.8 m slack.

## Geometry and materials

The cloud is a closed loft with an outer waist, inset roof edge and deeply recessed soffit ring, preserving the concave southern fingers. Two leaning funnels with broad, rounded-rectangle shoulders connect through actual roof holes. Triangulated steel panels on the cloud’s large diagonal planes and rectangular funnel panels stand 0.15 m above joint backing and are merged into whole-material batches; tones follow large facets, without random patchwork. Two small west projections are thin attached blades; the mapped southern canopy is separately modeled.

The crystal is a closed triangular glass wedge with a three-direction steel cage. Pale opaque glass approximates reflected sky; the interior vortex and furnishings are omitted. Five splayed, flaring supports contact grade and penetrate the cloud soffit. A recessed glazed service core leaves open undercroft on both river sides. The entrance glow, canopy blade and short steps are retained.

Near has nine materials: `metal`, `facet`, `seam`, `soffit`, `concrete`, `glass`, `glassPale`, `frame`, `glow`. Far folds seam and soffit into facet, pale glass into glass; it keeps the whole geographic silhouette, roof funnels, support contacts, southern fingers, all canopy blades and a coarser glass cage in six draws. Light and dark palettes share keys. `glow` is a modest lit entrance / panorama strip; the night crystal is deliberately dimmer than the warm, fully illuminated official photograph.

## Costs and verification

| Export | Triangles | Draws | Size |
| --- | ---: | ---: | ---: |
| Near | 18,022 | 9 | 1,274 KiB (1,304,340 bytes) |
| Far | 3,491 | 6 | 224 KiB (229,756 bytes) |

Measured by `pnpm build:top-cities-landmarks musee-des-confluences --no-check`; exact bytes and bounds are in `public/models/buildings/musee-des-confluences.json`. Far differs from near bounds by under 0.06 m per axis. No texture, decoder, compression dependency or removable bridgeLift survives export.

Looked at procedural source and exported GLB contact sheets in `tmp/top-cities/shots/musee-des-confluences/`, compared beside the dossier and official reference photographs:

- `musee-des-confluences-procedural-near-light-sheet.jpg`: overview, east facade, opposite facade, roof, entrance, close glass detail and south cantilevers.
- `musee-des-confluences-glb-{near,far}-{light,dark}-sheet.jpg`: the same seven cameras, both LODs and palettes.
- `top/musee-des-confluences-glb-near-light-top.png`: geographic orientation and red replacement rings.
- `references-export-comparison.jpg`: two official reference views beside the four exported LOD/theme sheets.
- The distant export overview was also viewed during the initial export comparison.

The visual/QA pass changed the glass palette after diagonal stripes distracted from the crystal, shortened the service plinth to fit its northwest corner, corrected crystal roof winding, and replaced radial normal guesses on concave cloud edges with edge normals. The top view identified the two small west blades that needed explicit geometry. The entrance glow bottom was separated from the crystal floor to eliminate a coplanar overlap.

Initial targeted geometry QA (`tmp/top-cities/musee-des-confluences/qa-metrics.json`) passes: no coplanar overlaps, no removable attributes, no meaningful below-grade geometry, 1.3% back-face sweep hits (below 2% threshold). Six landmark-specific tests pin the 41 m funnels, glass wedge slope and steel cage, recessed undercroft, supports, every-vertex footprint containment, near/far silhouette and GLB round trip. The combined focused run passes all museum tests; its final run had one unrelated Villeurbanne far-byte-budget failure. The shared catalog passed finally (164 entries / 310 variants), after encountering concurrent Villeurbanne edits; those files were left untouched.

## Approximations and integration handoff

The continuous real folded skins are simplified to planar/ruled facets, the roof is flatter, and the funnel shoulders approximated by six unequal profiles. The crystal is opaque and its glass cage is approximate. The underside wave geometry, plinth/core, column positions, roof vents, glazing apertures and steps are photo estimates, not construction drawings. The roof’s smaller technical openings, panoramic glazing beyond the modeled strip, interior vortex, basin, landscaping, quay walls, boats, neighbouring bridge and street furniture are omitted. No Tesla hardware measurements were performed. Independent visual review is pending.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The building remains rigid; an explicit median terrain pad follows the four owned rings, with a plaza reference and 4 m feather, rather than flattening a wide disc across the Rhône or Saône. Validate bank edges, entrance datum and changing DEM resolution in the app; no terrain or runtime integration claims follow from these inspector views. No shared source file or runtime bundle was edited, and nothing was published.


## Independent-review fix pass (2026-10-05)

The initial independent verdict was FIX, recognition 3/5, citing the box-like cloud and isolated pyramid-like funnels. Two look/fix iterations addressed both findings:

| Defect | Before | After |
| --- | --- | --- |
| Cloud envelope | Long almost-vertical side bands and rectangular southern ends | Roof outline inset 13%, alternating unequal diagonal planar folds, connected triangular soffit planes, and 28.4 m underside at the thin 31 m cantilever tips |
| Roof funnels | Narrow six-sided pyramid-like isolated bumps | Broad asymmetric rounded-rectangle bases (main about 33 × 42 m), six progressively narrowing shoulder/neck profiles, unequal crown heights and lean up to 5 m east / 6 m north |
| Far fidelity | 1,642 triangles, coarse crystal cage and abrupt funnels | 3,491 triangles, eight-division crystal cage, sixteen-section funnels with all six silhouette profiles, and exactly the same large cloud planes as near |
| Surface closure | Some flared supports lacked top closure; radial orientation guesses could invert leaning funnel sides | Closed support ends, edge-derived funnel normals and corrected southern canopy wall orientation |

The first fix sheet established the improved folds but exposed overly conical funnel shoulders. The second changed the profiles to rounded rectangles with more gradual, unequal shoulders. QA briefly flagged 2.1% back-face hits; closure and winding corrections within that iteration reduced this to 1.0%, with zero coplanar overlaps and no flagged artifacts.

Viewed the final exported near/far comparison at `tmp/top-cities/shots/musee-des-confluences/fix-2/musee-des-confluences.jpg` alongside the supplied and official photographs: southwest/northeast, south street view, north-up plan, closer west and matched far views. Also viewed `fix-2/musee-des-confluences-glb-{near,far}-dark-sheet.jpg`, showing overview, front, rear and roof. The intermediate sheet is in `fix-1/` for comparison. The review document supplied no Prepare command, so the equivalent repository command was used:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids musee-des-confluences --out tmp/top-cities/shots/musee-des-confluences/fix-2
```

Final export costs are in the table above. `fix-metrics.json` records clean budgets, 1.0% back-face hits, zero coplanar overlap and no removable attributes. All eight museum tests pass, including new raycast checks for sloping cloud planes, taper and broad funnel shoulders in both LODs; the combined focused suite passes 126/126. The catalog passes at 164 entries / 310 GLB variants. Re-review remains pending; Cityscape and Full 3D world retain their separate not-tested status.
