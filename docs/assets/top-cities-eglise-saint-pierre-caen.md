# Église Saint-Pierre de Caen

Original procedural, texture-free exterior of the restored church at Place Saint-Pierre / passage Sohier, at the foot of the castle. Ownership covers the church only, including the western side tower and eastern Renaissance chevet; the adjacent service building, castle, streets, scaffolding and furniture are excluded.

The [City of Caen restoration page](https://caen.fr/la-restauration-de-leglise-saint-pierre) establishes the 75 m stone spire and absence of a transept. Its [heritage description](https://caen.fr/node/6538) confirms the postwar reconstruction of the stone spire and the sixteenth-century chevet with Italian Renaissance decoration. The supplied historical facts identify the Gothic/Renaissance church, listed since 1840; Hector Sohier's chevet is the road-facing distinguishing eastern feature. The model selects the restored, scaffold-free exterior rather than temporary restoration works.

The dossier reference sheet `tmp/top-cities/eglise-saint-pierre-caen/refs-sheet.jpg` was viewed. It shows the west rose and deeply pointed portal, setback western tower, slender open belfry, tall eight-sided needle, and layered chevet with pilasters, chapel glazing and balustrades. Five photo credits, Commons page links and licences are preserved in the catalog: Chabe01, CC BY-SA 4.0; DennisPeeters, public domain; unknown historical author, public domain; Julien1978, CC BY-SA 3.0; Kahouanne, CC0. Photos remain in ignored scratch and are not present in the GLBs or source distribution.

## Frame and measurements

The supplied shared-helper OSM extract contains [way 154620108](https://www.openstreetmap.org/way/154620108), a single cadastral church outline with no height tags. No neighboring building or building part is owned. `FOOTPRINTS` preserves its complete 148-point ring and the side tower projection. Geographic data © OpenStreetMap contributors, ODbL 1.0.

Origin `[-0.3609,49.18402]`; real metres east/up/south, rigid pavement y=0. The long northeast wall control points `[-0.3606685,49.1841467]` and `[-0.3604364,49.1839719]` give an approximately 139° southeast axis; the regularized geometry uses 140° and its front faces 320°. A −50° rotation from the authoring +X axis is baked into both source and GLB. The app must not rotate it again. No vertical datum, DEM elevation or Mercator stretch is authored.

| Feature | Model | Basis |
| --- | ---: | --- |
| Highest point | 75 m | Municipal restoration page; tourism's approximately 80 m is less precise |
| Overall church envelope | Approximately 66 × 30 m including tower | Supplied mapped outline, regularized wall/chapel construction |
| Body width | Approximately 26 m | Mapped outline |
| Nave ridge / eave | 30 / 24 m | Photographic estimates |
| Main lower aisles | 13.6 m walls, sloping roofs to 16.2 m | Photographic estimates |
| Belfry shaft / open arches / crown | 28.8 / 30–44.1 / 45.6 m | Photographic estimates |
| Tower base width | 8.25 m | Mapped side projection |
| Stone needle | 46.05–74.6 m plus finial to 75 m | Proportioned to the sourced total height |
| Lower chevet radius / cornice | 12.3 / 14.7 m | Mapped envelope and photographic estimates |
| Rose diameter | 6.9 m glazing | Photographic estimate |

The substantial central Caen street site is expected to be nearly level. `padM=49` covers the church; no terrainPad is authored. Full 3D world datum, DEM arrival and neighboring road levels require separate integration checks.

## Model decisions and limits

The nave has a dark slate gable roof without a transept, ten regularized clerestory bays per side, recessed glazing and thin Gothic mullions. Lower aisles use deep pointed windows, stepped buttresses, flying struts and pierced galleries. The west facade retains the large rose, circular petal tracery, pointed entrance, nested mouldings, gabled surround and corner pinnacles. The tower has a planted square lower shaft, four faces of three genuinely open tall belfry apertures, stone mullions, a corniced open terrace, an eight-sided stone spire, gablets, pinnacles, arris crockets and small dark spire niches.

The chevet uses two stepped polygonal envelopes: radiating lower chapels and the upper choir. Repeated pilasters, capitals, frieze rings, round oculi, balustrades and tall Gothic glazing distinguish it from the nave. Renaissance sculptural decoration is represented as original abstract relief rather than copied or traced sculptures. Its exact carved cupolas, vaults, curved window tracery, statues and chapel-by-chapel irregularities are simplified; this is an exterior driving landmark rather than a conservation survey. No interiors are modeled.

Seven merged named materials cover grey-tan Caen stone, lighter trim, darker chevet ornament, dark slate, shadow recess, subdued glazing and the west rose's restrained night glow. Night dims the masonry; widespread artificial interior illumination is not assumed. Far reduces arc samples, masonry bands, roof relief and crocket rows while retaining rose petal tracery, pierced parapets, the open belfry, all pinnacles, complete needle, buttress rhythm and stepped chevet. Export geometry removes the unused bridgeLift attribute and merges coincident vertices.

## Verification evidence

The first procedural contact sheet revealed an incorrect belfry hole coordinate offset and inward-facing chevet facade normals. Those defects were corrected; mouldings were changed from boxes around every curve segment to flat relief ribbons to remove hidden faces. The second sheet showed correctly open belfry arches and chevet glazing; footprint tests then identified the west socle and first buttress projecting past the cadastral corner. The foundation was shaped to the mapped corner, the first buttress moved inward, and the spire-base pinnacles made taller to match the reference silhouette. Door/moulding endpoints were raised to avoid below-grade relief.

Viewed procedural evidence:
- `tmp/top-cities/shots/eglise-saint-pierre-caen/eglise-saint-pierre-caen-procedural-near-light-sheet.jpg`
- `tmp/top-cities/shots/eglise-saint-pierre-caen/revision/eglise-saint-pierre-caen-procedural-near-light-sheet.jpg`

Final exported GLB visual evidence, costs and numeric QA are recorded below. Cityscape and Full 3D world: **not tested yet, integration is checked separately**. Asset inspection does not verify provider replacement, terrain behavior, runtime lifecycle or device performance.


Final comparison judged: `tmp/top-cities/shots/eglise-saint-pierre-caen/final/comparison.jpg` places DennisPeeters’ west-front photo and Kahouanne’s chevet photo above all seven GLB views (overview, facade, back, roof, entrance, tower, chevet) in near/light, near/dark, far/light and far/dark. The four component `eglise-saint-pierre-caen-glb-<near|far>-<light|dark>-sheet.jpg` sheets are in the same directory. The exported models preserve the rose, tower needle, open belfry and stepped chevet; far intentionally simplifies tracery and spire niches. The reference chevet’s exact sculpted capitals and chapel roof details remain approximate. The final roof view includes the mapped red ring. No detached structure or changed rotation was seen after export.

Numeric QA exposed reversed aisle-roof triangles; their winding was corrected and the hidden horizontal nave-roof base was removed where it coincided with masonry. Final `tmp/top-cities/eglise-saint-pierre-caen/qa-metrics.json`: no flagged issue, zero back-face hits in 164 intersecting sweep rays, zero removable bridgeLift, grade 0 and top 75 m. Seven small internal masonry/trim coincidence candidates total approximately 1 m² at the west gable/buttress junction, below the artifact threshold; they produced no visible flicker in the judged sheets.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 32696 | 6 | 1465768 | 1431.4 |
| far | 10174 | 6 | 468860 | 457.9 |

All three landmark-specific tests pass (approximately 0.7 s): sourced height and finial, actual open triple belfry bays and mullion support, rose/portal/chevet raycasts, estimated roof ridge, no below-grade vertices, mapped footprint with a 0.8 m cornice allowance, and near/far bounds within 0.5 m. All three Saint-Pierre registry conformance cases pass, including source/GLB bounds, materials and byte metrics. Final required command output is saved to `tmp/top-cities/eglise-saint-pierre-caen/test-results-final.txt`; it reported 290 passes and two failures belonging to other active builders: abbaye-aux-dames far geometry over budget and a transient cathedrale-de-bayeux catalog/readiness mismatch. All six Saint-Pierre cases passed.

`node scripts/asset-catalog.mjs` passes: 222 entries / 424 GLB variants; output saved to `tmp/top-cities/eglise-saint-pierre-caen/catalog-check-final.txt`. Earlier transient unregistered Bayeux exports and missing sibling authoring helpers resolved without edits to any shared or sibling file. No git writes, installation command, full suite, app bundle, local launcher or persistent development server was run. Independent reviewer approval and both placement modes remain separate.


## Independent-review revision, 2026-10-10

The lead requested all four findings from `tmp/top-cities/review/eglise-saint-pierre-caen/REVIEW.md` (PASS-WITH-NITS, recognition 3/5); no REVIEW-2 file was present. The review contains no Prepare command, so its repository workflow was regenerated with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids eglise-saint-pierre-caen --out tmp/top-cities/shots/eglise-saint-pierre-caen/revision-final`. That exported-GLB sheet was judged alongside dedicated entrance, tower and chevet sheets in both LODs and light/dark themes, combined with the existing front/back reference photographs in `tmp/top-cities/shots/eglise-saint-pierre-caen/revision-final/comparison.jpg`. Two look/fix iterations were used.

1. Chevet: barely visible 4 m thin chapel pinnacles and flat rail strips → 6.2 m pinnacles on the radiating-chapel pilasters (tips 21 m), intermediate 3 m spikes, pierced 1.25 m lower-chapel parapets, and pierced 1.5 m upper-apse parapets with 3.6 m pinnacles (tips 28.6 m). Darker named ornament material separates the parapet holes, pilasters and shafts from lighter coping. Each parapet has actual through apertures; far uses fewer larger apertures. These are photographic estimates, with simplified carving.
2. Spire/belfry: small pinnacles largely buried in the needle and near-only 0.15 m crockets → four independent terrace corner pinnacles reaching 55.05 m, eight existing needle-base pinnacles moved outward from 3.7 to 4 m radius, and enlarged 0.27 m near / 0.24 m far ridge crockets reaching 0.65 m above each base. Far retains four crocket rows instead of a smooth needle. The sourced total height remains 75 m.
3. Rose: already present but absent from the review's global cameras and fine at distance → stronger 0.4 m outer ring, thicker spokes, 12 larger 0.66 m petal rings retained in both LODs, and broader west gable pinnacles. The dedicated west entrance view now proves the complete tracery above the portal; the rose was not duplicated elsewhere.
4. Stone: light cream `#b9ac8d` / `#d0c2a1` → grey-tan stone `#918b7c`, lighter trim `#aaa394`, darker chevet ornament `#797568`; matching night values were updated. Directional daylight still warms the stone, while the material itself is less yellow and more weathered.

The first revised numeric sweep found close trim/ornament planes at the lower pilaster capitals and parapet coping. Capitals were widened to maintain over 5 cm separation, parapet faces moved 0.1 m farther out, and their inward thickness retained support. Revised geometry has zero back-face hits in 165 intersecting sweep rays, no unused attributes, no budget or artifact flags, and only four small old west-gable masonry/trim candidates totaling approximately 1 m² below the artifact threshold. `tmp/top-cities/eglise-saint-pierre-caen/qa-metrics-revision.json` records the results.

| Export | Before triangles / draws / KiB | Revised triangles / draws / KiB | Revised bytes |
| --- | ---: | ---: | ---: |
| near | 32696 / 6 / 1431.4 | 37944 / 7 / 1714.8 | 1755912 |
| far | 10174 / 6 / 457.9 | 10766 / 7 / 479.3 | 490768 |

Near-specific ornament is retained while far aisle balusters become flat relief strips and rose petals use eight curve segments; this keeps seven draws and the far export below 500,000 bytes. No orientation, height, ownership ring, provider mask, terrain policy or shared file changed. Landmark tests pass for both LODs, including new raycasts for four separate belfry corner pinnacles, protruding spire crockets, rose petal tracery, real parapet holes/solid piers and a 21 m chevet pinnacle. The three Saint-Pierre registry conformance cases also pass. Combined focused output is `tmp/top-cities/eglise-saint-pierre-caen/test-results-revision.txt`; other landmarks' independent failures are listed there and are outside this revision. Catalog check passes (222 entries / 426 variants), saved to `tmp/top-cities/eglise-saint-pierre-caen/catalog-check-revision.txt`.

Remaining approximation: exact Renaissance sculpture and curved chapel roof decoration are abstracted, and the review tool's global west camera does not face the local west front, so the dedicated entrance view is essential. Cityscape and Full 3D world remain **not tested yet, integration is checked separately**.
