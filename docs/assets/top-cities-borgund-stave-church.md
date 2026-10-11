# Borgund stavkyrkje — Lærdal

Original procedural model of the conserved medieval stave church at Vindhella 606, excluding the detached stave bell tower, newer church, visitor centre and cemetery. Authored 2026-10-08; contract [top-cities landmarks](../top-cities-landmarks.md).

## Identity and evidence

The [owner, Fortidsminneforeningen](https://fortidsminneforeningen.no/en/museum/borgund-stave-church/), dates the church to 1180 and identifies the seven-tiered roof, galleries, dragon heads, scale-like wooden shingles, raised central space and ridge turret; the prepared [Wikipedia dossier](https://en.wikipedia.org/wiki/Borgund_Stave_Church) describes c.1200 and a Sogn-type triple-nave stave church. The current conserved exterior is the target, with the historic Knud Knudsen photo used to clarify the apse and skirts. Photos and their licences are listed in the catalog; no photos, meshes or textures ship.

## Plan, frame and dimensions

OSM way [557505485](https://www.openstreetmap.org/way/557505485) is the sole replacement envelope. Full geometry from the prepared dossier is retained in footprint.js; the requested refresh via the shared Overpass helper returned HTTP 403. It has no height or roof-dimension tags. Other nearby buildings stay provider geometry.

| Dimension | Value | Basis |
| --- | --- | --- |
| Origin | 7.81229° E, 61.047203° N | near plan centroid from OSM |
| Nave axis | 76° eastward, west front 256° | OSM control points [7.812208,61.047236] → [7.812265,61.047242], 77.7°; opposite edge [7.812190,61.047150] → [7.812255,61.047158], 75.8°; rounded 76° |
| Mapped overall church plan | about 16.5 m along nave × 11 m across portals; 127 m² | OSM envelope |
| Model height to rod | 20 m nominal (19.95 m bounds) | photograph estimate, no sourced surveyed height found |
| Nave central wall | 7.7 × 5.65 m, eave 8.27 m | plan fitting / photo estimate |
| Great nave ridge | 12.75 m | photo estimate |
| Aisle / gallery eaves | 4.13 / 2.48 m | photo estimate |
| Choir ridge | 8.5 m | photo estimate |
| Three turret roof tops | 15.05 / 16.75 / 19.18 m | photo estimate |

Real metres, east/up/south. Geometry rotates the church frame 14° once, into the exported GLB. Foundation follows the full mapped footprint with local y=0 at grade and a 0.23 m stone sill. Horizontal roof overhangs and tiny portal eaves have a sub-metre tolerance beyond the mapped envelope, documented and tested. No terrain, DEM altitude or Mercator stretch baked in. The compact churchyard appears near level in the references, so padM is 12 m without a terrainPad claim.

## Geometry and materials

Six named materials: tarred timber, roof backing, slightly lighter shingle faces, worn timber seam detail, dark trim, grey foundation stone; matching darker nighttime palette, with no artificial glow. Merged material batches; texture-free standard GLB.

Two nave skirts surround the tall central room; the steep gabled nave roof supports a diminishing ridge turret. The choir has a smaller gable, skirts and semicircular eastern apse. Low gallery walls terminate in real open slit bays under the skirt eaves; recessed west door and north/south gabled portals stay open around their structural posts. Repeated board strips and staggered scale-shaped shingles are geometry. Five simplified pierced dragon silhouettes retain crest, curved neck and snout, with a small eye hole near. Far retains all roof stages, dragon outlines, apse, portal gaps and gallery bays, dropping plank seams and carving strokes and coarsening shingle courses.

## Approximations

All elevations, roof pitches, precise stave layout, door carvings, gallery-post spacing, colour aging and turret proportions are estimates from the dossier photographs. Dragon carvings are original geometric suggestions, not replicas. Apse roof uses facets; the structure is an exterior representation with closed central massing, no navigable interior. No landscaping, inscriptions or grave markers. Photographic references include different tar/weathering states; the palette represents dark tarred wood. Independent review pending and Tesla performance unmeasured.

## Verification

Looked at prepared refs-sheet.jpg, then the procedural near/light sheet at `tmp/top-cities/shots/borgund-stave-church/borgund-stave-church-procedural-near-light-sheet.jpg`. The first render showed patchy roof colours, overly open gallery bays and a bare front gable; reduced colour variation, increased gallery boards to leave a short slit, exposed gable timber seams, staggered shingles and removed subpixel far plank detail. Looked at the second exported near/light sheet (same directory, `borgund-stave-church-glb-near-light-sheet.jpg`) covering overview, west facade, eastern back/apse, above, entrance, dragon/turret detail and plan: recognizable silhouette and alignment, no detached ornament noticed. The final four-variant comparison caught a roof offset regression: some shingles had moved under the backing roof. Corrected the normal direction, rooted the shingles into the backing and closed exposed side/toe faces; added a raycast regression pinning visible shingle faces on both nave slopes. Final verification is below.

## Integration

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately. Foundation remains rigid; actual local DEM, foundation exposure, terrain toggle/refinement, pad edges, neighbouring buildings, provider replacement and lifecycle are unverified. No runtime/shared renderer files changed.


## Final export verification and costs

| LOD | Triangles | Draws | KiB (rounded) |
| --- | --- | --- | --- |
| Near | 29,264 | 6 | 1,405 |
| Far | 5,924 | 6 | 297 |

Actual scene metrics from exported GLBs; both have substantial headroom against hard budgets. Near slightly exceeds the task's 10–25k aspiration because of closed physical shingle edges, and stays below the contract's 60k cap. Far shingles are deliberately broad and are the most visible approximation at inspector close-up distances.

Looked at `tmp/top-cities/shots/borgund-stave-church/borgund-stave-church-final-comparison.jpg`: reference photos beside exported near/light, near/dark, far/light and far/dark overview, back/apse, above/roof and dragon/turret detail. Main gables, stepped roof skirts, dragons, rounded apse and gallery read in all four variants. Night wood is intentionally dark, without artificial illumination. Also rendered the final west facade, street-level entrance and mapped plan in each variant in `borgund-stave-church-glb-{near,far}-{light,dark}-sheet.jpg`; earlier near/light sheets judged the portal recess, gallery openings and footprint alignment. The mapped stone sill is visible without a large plaza pad. No floating ornament or large visible surface flicker noticed.

Focused command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/borgund-stave-church/borgund-stave-church.test.js`; all nine Borgund checks pass, including six landmark tests in about 0.5 s after adding the shingle regression. Earlier the entire focused pair passed 227/227; final run passed 227/228 with the sole failure in another active builder’s astrup-fearnley-museum palette (material stone absent). That file is outside this task and was not edited. Tests pin frame/control bearing, bounds, grade contact, three observable roof heights, open gallery and west portal, apse, dragon neck, shingle visibility, footprint overhang tolerance, far silhouette and nondegenerate triangles. Export/source agreement is covered by the shared conformance test.

`node scripts/asset-catalog.mjs`: valid, 198 entries / 382 variants at validation time. `qa-metrics.mjs --ids borgund-stave-church`: no issues; no removable bridgeLift bytes; 0% exterior back-face sweep hits, with 2 m² residual small coplanar contacts below the 5 m² QA threshold, at small framing intersections. No claim of mathematically zero internal contact planes. Deterministic details: `tmp/top-cities/borgund-stave-church/qa-metrics.json`; focused test log: `tmp/top-cities/borgund-stave-church/tests.log`. Standalone screenshot tools used; no shared preview, runtime clone, dev server, staging deploy or Git write operations performed. Independent reviewer verdict remains pending with the coordinator.
