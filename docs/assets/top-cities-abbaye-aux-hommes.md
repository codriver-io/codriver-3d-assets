# Abbaye aux Hommes, Caen

Asset `abbaye-aux-hommes`: the present Saint-Étienne abbey church, eighteenth-century conventual buildings used as Caen's Hôtel de Ville, their cloister, the attached Salle des gardes and the detached Palais Ducal. Original procedural geometry authored 2026-10-10; no scan, traced mesh, photograph or texture is shipped. Contract: [top-cities landmarks](../top-cities-landmarks.md).

## Identity, scope and references

From place Saint-Martin the signature is the Romanesque west screen with two unequal Gothic limestone spires. From the municipal gardens the pale stone wings and dark slate roofs form a low foreground to those towers; the octagonal crossing lantern, four chevet turrets and open flying buttresses distinguish the eastern church. From above, the empty cloister court and southern forecourt separate the wings. The Gothic Palais Ducal remains a detached building to the west, rather than being joined to the church.

The [Ville de Caen](https://caen.fr/abbaye-aux-hommes/) identifies the medieval abbey and its eighteenth-century municipal buildings. The [Saint-Étienne architectural account](https://fr.wikipedia.org/wiki/%C3%89glise_Saint-%C3%89tienne_de_Caen) supplies the 82/80 m towers, 27.30 m facade and 111 m exterior length (107 m is the interior length).

Mapped source: dossier `tmp/top-cities/abbaye-aux-hommes/osm.json` plus a single shared-helper query retained in `selected-osm.json`. Main outlines: church [155629129](https://www.openstreetmap.org/way/155629129), monastery [155629494](https://www.openstreetmap.org/way/155629494), Palais Ducal [1432516139](https://www.openstreetmap.org/way/1432516139). All owned building parts are retained. Cloister [relation 19644543](https://www.openstreetmap.org/relation/19644543) contributes outer way 1432566826 and inner courtyard way 1432566827. The inner ring is retained as authoring data and remains open; it is not a separate replacement envelope. Porterie, Aile des Jardins and other neighbouring buildings are outside this asset's ownership.

Photo titles, authors, licences and Commons links are in the catalog record and ignored dossier `refs/SOURCES.txt`: references 1–2 by Patrick from Compiègne (CC BY-SA 2.0) and Zairon (CC BY-SA 4.0) show the civic wings; reference 3, Selbymay (CC BY-SA 4.0), shows Palais Ducal; reference 4, Ptyx (CC BY-SA 4.0), shows the west screen; references 5–6, Ikmo-ned and Viault (both CC BY-SA 3.0), show the chevet. References are comparison photographs, never textures or traced meshes.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | --- | --- |
| North / south western spire tips | 82 / 80 m | Published dimensions and OSM parts 398948450/398948451 |
| West-screen top / eaves | 27.30 / 24.50 m | Published dimensions and OSM main part 399129268 |
| Nave ridge / transept ridges | 35.3 / 36 m | Photo-based estimates following independent review; nave rises behind the unchanged west screen |
| Church outside length | approximately 110 m | Exact OSM replacement outline; published exterior length 111 m |
| West tower shafts / Gothic belfry shoulder | 42 / 53.8 m | OSM total and roof-height tags; subdivision estimated from photos |
| Crossing lantern wall / pyramid apex | 39.8 / 54 m | Photo-based estimates; octagon from OSM 398949880 |
| Four eastern turret tips | 44.5 m | Photo estimate; bases from OSM 399297063–399297066 |
| Civic eaves / mansard apex | 18.1 / 23.6 m | Three mapped levels and photo estimate |
| Cloister gallery roof | 6.27 m | One mapped level; estimated elevation |
| Palais Ducal main hall eaves / tile ridge | 13.6 / 18.8 m | Three mapped levels; estimated exterior elevation |
| Replacement origin | [-0.3731, 49.1818] | West-front structural anchor retained from the dossier |
| Nominal nave / west-front bearing | 95° / 275° | Rounded mapped orientation; detailed parts retain their actual individual bearings |

Real metres, +X east, +Y up, +Z south. Authoring coordinates run along the church; one rotation of −5° around Y is baked into every geometry. The local church roof rectangles use the rounded frame, while the walls, civic roofs and detached parts use their individual mapped polygons. Geographic controls on the north nave edge of OSM part 399129268 are recorded in `abbaye-aux-hommes-plan.js`; the individual edge is about 94°. The layer must not apply another rotation. `y=0` is the west-front pavement, not absolute altitude.

`padM=175` bounds this large ensemble. No terrain height is baked in and no `terrainPad` is declared: the developed grounds are expected to be approximately level, but this has not been surveyed. The historically buried eastern chevet, entrance steps and local grade differences are omitted. Before Full 3D world rollout, sample the separate church, civic and Palais footprints and replace the broad disc policy if measured relief exceeds roughly 2 m.

## Materials and modelling decisions

Seven merged materials in both variants: Caen limestone `stone`, lighter cornices and frames `trim`, dark portals `recess`, muted `glass`, slate `roof`, reddish brown Palais roof `tile`, and selected lit windows `glow`. Dark palettes dim the stone and roof; `glow` becomes warm. No texture or decoder is needed.

The west towers preserve the three arcature bands, corner clochetons, octagonal belfry openings and tapered spires. Near keeps mullions, stone window surrounds, roof dormers and spire ribs. Far uses simpler arches and omits small mullions, dormers and spire ribs; all towers, major roofs, courtyards and Gothic belfry openings remain. Far arcade faces retain both orientations to preserve openings without the near wall's small edge thickness.

The church uses stepped mapped aisle and choir envelopes. Flying buttresses use closed masonry profiles with curved intradoses, stay open below the flyers and meet ground piers; a blind arcaded gallery band sits below the apse roof, and the low eastern perimeter carries radial chapel-window rhythm. These are abstractions of the chapel ensemble, not a surveyed reconstruction of its thirteen individual chapels. The municipal wings use their own OSM parts with mansard profiles, a taller pediment pavilion and three facade tiers. Upper civic windows are rectangular, ground windows arched. Palais Ducal uses its mapped, irregular parts, pointed openings, small rose rings and a tile roof.

Simplifications: no interiors, individual saints, carved capitals, roof tile courses, exact chapel subdivisions or restored sculptural programme; the Palais elevation and roof transitions are approximate. Stone/stringcourse relief may project slightly beyond OSM walls; every near vertex is checked against the owned ring union with a maximum 0.65 m allowance. This allowance is for mouldings, rather than neighbouring ownership.

## Export costs and verification

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 40,092 | 7 | 1,758,060 | 1717 |
| Far | 9,017 | 7 | 463,432 | 453 |

Both GLBs are self-contained, texture-free and under the building budgets. Maximum near/far bound discrepancy is 0.167 m. Collapsed roof-edge triangles and unused vertices are removed before batching. The exporter no longer reports non-normalized normals.

Visual review had three iterations. The first exposed missing lower tower windows, overly thin belfry masonry and arched upper civic windows; these were corrected. The second incorporated the mapped open cloister. Final QA moved near-coplanar stringcourses away from walls, aligned nave windows to the actual sloping mapped edge, suppressed civic windows behind the pediment pavilion, and simplified far arches/arcade edges to meet the 500 KB cap.

Judged final evidence, all under `tmp/top-cities/shots/abbaye-aux-hommes/`:

- `abbaye-aux-hommes-final-comparison.jpg`: reference photographs directly above exported GLB facade, east/back, street and belfry detail views, for near/far and light/dark; also roofs, overview and Palais.
- `abbaye-aux-hommes-glb-near-light-top.png`: mapped footprint rings, preserved courts and detached Palais, checking orientation and ownership.
- Procedural light contact sheet was examined before export; four exported contact sheets retain all seven named views (`overview`, `facade`, `roof`, `east`, `street`, `detail`, `palais`).

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/abbaye-aux-hommes/abbaye-aux-hommes.test.js`: **292 passed, 0 failed**. The original five landmark-specific tests pin unequal tower heights, lantern, portal, open courtyard, belfry opening, owned footprint containment and far silhouette; the review fix adds two observable raycast/material-geometry tests for raised roofs, substantial flyers, open space below them, apse-gallery recesses and removal of civic glow. `node scripts/asset-catalog.mjs`: **valid, 222 entries / 416 GLB variants** at verification time. Deterministic `qa-metrics.mjs --ids abbaye-aux-hommes`: **ok**, zero back-face hits over 135 successful rays, no removable `bridgeLift`, no below-grade geometry; 4 m² of sub-threshold overlap candidates remain, predominantly ground-contact faces invisible above pavement (3.2 m²), plus small facade/roof junction candidates. No flicker was visible in the inspected views. Reports: `tmp/top-cities/abbaye-aux-hommes/{qa-metrics.json,final-tests.txt,catalog-check.txt}`.

Inspector views: `/asset-preview.html?asset=abbaye-aux-hommes&view=overview` and the six other named views. Local catalog/inspection assets are not published.

Cityscape and Full 3D world: **not tested yet, integration is checked separately**. Provider masking, failed/late loads, origin changes, entrance slopes and real-device costs have not been exercised in the app. No shared files, runtime layer, renderer bundle or deployment were changed.


## Independent review corrections

Addressed all four findings in `tmp/top-cities/review/abbaye-aux-hommes/REVIEW.md` (PASS-WITH-NITS, recognition 4/5), in one look-fix iteration:

| Finding before | Delivered after |
| --- | --- |
| One tall civic pavilion window glowed alone | Civic pavilion uses ordinary `glass`; intentional nave and Palais lighting remains |
| Nave ridge 27.3 m and transept ridges 29 m, obscured by wings | Nave rises behind the unchanged 27.3 m west screen to a 35.3 m ridge; transepts have steep slate gables to 36 m |
| Thin straight rods at the chevet, missing gallery band | Closed masonry flyers have 0.9–1.05 m width, curved intradoses and 1.3–1.4 m end depth; repeated blind arches and two stringcourses run below the apse roof |
| Saturated Palais tile `#795749` | Muted brown-grey `#665e55` by day, `#47433f` at night |

Roof heights, buttress profiles and gallery details remain photo-based estimates. Published west-front and tower dimensions, mapped ownership and overall near/far bounds remain unchanged.

Reviewed new exported QA sheet `tmp/top-cities/abbaye-aux-hommes/review-fix/abbaye-aux-hommes.jpg`, with its reference photo and near/far overview, opposite facade, street and top views; source review has no Prepare command, so the standard repository command was used:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids abbaye-aux-hommes --out tmp/top-cities/abbaye-aux-hommes/review-fix
```

Also judged `tmp/top-cities/shots/abbaye-aux-hommes/review-fix-dark/abbaye-aux-hommes-glb-near-dark-sheet.jpg` (street/east/roof) and `review-fix-light/abbaye-aux-hommes-glb-near-light-sheet.jpg` (east/street/tower detail), plus the chevet close-up `review-fix-light/abbaye-aux-hommes-glb-near-light-chevet.png`, against dossier reference 5. The daytime sheet shows the newly visible steep roofs; the dark sheet confirms no isolated civic light; the chevet close-up shows the intrados curve and gallery rhythm. The original review sheet is retained as `tmp/top-cities/abbaye-aux-hommes/review-before.jpg`.

Current verification: **7 landmark tests passed** in under one second; catalog check **valid, 222 entries / 416 GLB variants**; metrics **no issues, 0% back-face hits over 135 successful rays**, no budget overruns. Before → after costs: near 38,185 → 40,092 triangles, 7 → 7 draws, 1621 → 1717 KiB; far 8,170 → 9,017 triangles, 7 → 7 draws, 407 → 453 KiB. Exact new bytes: near 1,758,060, far 463,432. Metrics report: `tmp/top-cities/abbaye-aux-hommes/review-fix-metrics.json`. The original 292 conformance results above document the first build; the review fix reran the landmark-specific tests and catalog/metrics checks. Cityscape and Full 3D world remain **not tested yet, integration is checked separately**.
