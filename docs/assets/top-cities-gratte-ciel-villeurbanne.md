# Gratte-Ciel de Villeurbanne

Original texture-free procedural reconstruction of the residential Art Deco ensemble inaugurated in 1934, by Morice Leroux: two northern gateway towers and the four mapped residential wings along avenue Henri-Barbusse. This asset deliberately excludes the Hôtel de Ville, TNP, further southern groups, detached courtyard neighbours and newer construction. References depict the restored pale rendered exterior, rather than the temporary construction state shown in the historical photograph.

## Dimensions and geographic frame

| Feature | Value | Evidence |
| --- | --- | --- |
| Tower height | 65 m | SVU owner booklet key-figures table, p.5; the narrative in the same booklet says 61 m, older municipal history says 60 m. Selected 65 m; uncertainty remains. |
| Tower storeys | 19 | SVU and municipal Le Rize |
| Residential wing top | 32.6 m | Estimated within the published 9–11-storey / 31–38 m range |
| Commercial base | 6.2 m | Estimated two-storey photographic massing |
| Terrace elevations | 23.4 / 26.5 / 29.55 / 32.6 m | Estimated from photographic proportions |
| Tower upper setbacks | 44 / 56 / 62.2 / 64.3 m, rails to 65 m | Estimated, with total height pinned to published figure |
| Floor pitch / windows | 3.05 m / 1.34 × 1.5 m | Estimated rhythm, rather than a surveyed window schedule |
| Model plan | approximately 100 × 291 m | OSM mapped extent |

Metres, east/up/south, y=0 at rigid local grade. Origin `[4.87947,45.76793]` lies on the avenue between the wings. Rotation is baked into all exports. Two controls on way 466475080, `[4.8796927,45.7681265]` and `[4.8797579,45.7669286]`, establish its long axis approximately 177.8° from north. The cross-axis bears 87.8°. Exact geographic rings are converted through Mercator divided by local latitude stretch; 2.2° is used only to author terrace setbacks in aligned coordinates. No DEM, absolute altitude or scene stretch is baked into the mesh.

Provider ownership: ways 84817585, 466475080, 84818263, 84817879 and 84817757. The western tower is independently mapped; the eastern tower belongs to the north end of 84817879. All upper volumes stay within the listed rings, with facade panes and rail offsets under the provider's 0.8 m ownership tolerance. The avenue and cross-street remain open. Ground is plausibly near level; padM=190 covers the mapped radial envelope, but live foundation/pad effects need separate integration testing.

## Source and original modelling

Sources checked 2026-10-05: [SVU owner booklet](https://www.svu.fr/wp-content/uploads/2025/04/SVU-livret-gratte-ciel-ok-web.pdf), [Le Rize municipal residential history](https://lerizeplus.villeurbanne.fr/decouvertes/ressources-pedagogiques/visitez-les-gratte-ciels/les-logements), the supplied OSM dossier and a single northern Overpass query via the shared helper. OSM-derived outlines © OpenStreetMap contributors, ODbL 1.0.

The reference sheet `tmp/top-cities/gratte-ciel-villeurbanne/refs-sheet.jpg` was opened and compared. Its six Commons images are credited with their source links in the catalog: Colophanne, CC BY-SA 4.0 (ensemble south); SashiRolls, CC BY-SA 4.0 (stairwell/skyline); Romainbehar, CC0 (apartment interior); Karldupart, CC BY-SA 3.0 (place Chanoine-Boursier and cours Zola); Jules Sylvestre, public domain (construction view). Photographs stay under ignored tmp and are not textures, meshes or committed deliverables.

Mapped concave podiums, repeated redents, street-side roof terraces, two offset gateway towers, tall framed stair glazing, ground-floor shop bays and open crown railings are authored as merged geometry. Pale stucco, darker coping, desaturated blue-green glazing, grey metal frames and roof surfaces use seven near materials. Near windows have thin centre mullions and sills; far groups rows, retains the complete stepped skyline and avenue void, and removes small rooftop faces and most stair glazing bars. Night material `light` selects sparse warm apartment panes; the pattern is an artistic estimate, not an observed lighting schedule. Roof rails, crown details, stairwell segmentation and apartment bay counts are approximate. No photo, scan, lettering texture or third-party mesh ships.

## Verification

First source sheet exposed inward-facing window quads and excessive box-detail cost (142k triangles). The second source sheet confirmed corrected outward glazing and reduced near detail using flat sills/mullions and rails. Export byte checks then required far shop panes to become quads, and far stair bars to be reduced. Final exported GLB sheets and quantitative evidence are recorded below after the export check. No more than three visual look/fix iterations were used.

Tests pin both tower crowns, 65 m total height, no below-grade parts, the genuinely open avenue, upper terrace recession, stair glazing, all-vertex footprint containment and far silhouette/budget. `SPEC.ready` describes export readiness. Independent coordinator review remains pending.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Foundation, default extrusion replacement, late terrain, pad edges, mode/reanchor lifecycle and Tesla hardware performance have not been verified in the app. No shared file edits or runtime build/deployment were needed.

### Final exported evidence

I opened `tmp/top-cities/shots/gratte-ciel-villeurbanne/export-reference-contact.jpg`, with reference photos above the exported near/light, near/dark, far/light and far/dark sheets, and the overhead mapped-footprint view below. Each six-view sheet contains overview, north gateway facade, western back, roof, low street and tower detail views; their individual PNGs remain beside the contact sheet. The pair of crowns, street opening, redents, terrace roofline and pale render read in both LODs, and the red plan rings align with the exported structures. Window grouping makes far glazing coarser, deliberately; detailed facade ornament, roof rails, rear staircase placement and crown setbacks remain a photographic approximation. No visible holes, reversed exterior walls, floating parts or ground box clutter were found. The facade glazing is less finely subdivided than the original stained stairwell glass.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 36,384 | 7 | 1,903,452 | 1,859 |
| Far | 8,322 | 4 | 419,392 | 410 |

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/gratte-ciel-villeurbanne/gratte-ciel-villeurbanne.test.js`: 122/122 pass, including all four dedicated tests. `node scripts/asset-catalog.mjs`: valid, 164 entries / 310 variants. QA metrics: no coplanar different-material overlaps, 0.3% backface hits (293 sampled hits), no removable bridgeLift bytes, grade minimum 0 m, top 65.025 m, near/far bounds agree to less than 0.1 m. Durable local evidence: `tmp/top-cities/gratte-ciel-villeurbanne/tests.txt` and `qa-metrics.json`. Shared preview build and app integration are left to the coordinator under the worker's isolated-file ownership; no shared file was changed.
