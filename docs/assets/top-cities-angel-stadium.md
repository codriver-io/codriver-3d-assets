# Angel Stadium — Anaheim

Open asymmetrical baseball bowl, three stepped seating decks, pale outer concourses, structural ribs, two giant red entrance caps, and the California Spectacular rock pile.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Angel_Stadium)
- [Owned OSM way 23973377](https://www.openstreetmap.org/way/23973377)
- [Owned OSM way 934907692](https://www.openstreetmap.org/way/934907692)
- [File:Angel Stadium, home of the Los Angeles Angels.jpg  —  Quintin Soloviev  —  CC BY 4.0](https://commons.wikimedia.org/wiki/File:Angel_Stadium,_home_of_the_Los_Angeles_Angels.jpg)
- [File:Angelstadiumpano2019.jpg  —  CrispyCream27  —  CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Angelstadiumpano2019.jpg)
- [File:Angelstadiumfront2021.jpg  —  Troutfarm27  —  CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Angelstadiumfront2021.jpg)
- [File:Angelstadiumrockpile.jpg  —  Ken Lund  —  CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Angelstadiumrockpile.jpg)
- [Operator ballpark identity and twin-cap entrance](https://www.mlb.com/astros/news/featured/angel-stadium-guide-capacity-seating-chart-parking-and-more)
- [Operator ballpark](https://www.mlb.com/angels/ballpark)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Angel Stadium, home of the Los Angeles Angels.jpg | Quintin Soloviev | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Angel_Stadium,_home_of_the_Los_Angeles_Angels.jpg; 2.jpg | File:Angelstadiumpano2019.jpg | CrispyCream27 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Angelstadiumpano2019.jpg; 3.jpg | File:Angelstadiumfront2021.jpg | Troutfarm27 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Angelstadiumfront2021.jpg; 4.jpg | File:Angelstadiumrockpile.jpg | Ken Lund | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Angelstadiumrockpile.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 249.84 | OSM outline envelope |
| Depth in model axes | 271.4 | OSM outline envelope |
| Highest point | 39 | estimated from exterior photographs; lighting standards define 39 m model envelope |

Mapped outer stadium and California Spectacular owned. 39 m lighting envelope, deck elevations, giant cap dimensions, rock heights and field geometry estimated from exterior views. Three decks and open outfield retained in far LOD. Detached Big A parking-lot sign excluded; no branding, scoreboard lettering, trademarks or spectator geometry. Field surface y=0.18 m; no surrounding plaza or parking lot.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.8825624,33.80025885]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.8833498,33.79991],[-117.8831808,33.800806]]` yield baked yaw 81.0921 degrees; the host must not rotate again. OSM way 23973377, OSM way 934907692 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19286 | 8 | 235428 |
| far | 6878 | 8 | 104192 |

Deterministic metrics: `tmp/batch/angel-stadium-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/angel-stadium.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/angel-stadium/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Four current exterior references checked: aerial bowl, open field, twin entrance caps and rock pile. Model retains opening and cap silhouettes without logos.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Assigned the infield its own muted dirt material; field height, twin cap silhouettes and open outfield are unchanged.

Near: 19286 triangles / 8 draws / 235428 bytes. Far: 6878 triangles / 8 draws / 104192 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: angel-stadium.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.

## 2026-11-10 Full 3D world support-pad fix

Diagnosis: horseshoe ring excludes field and does not flatten supporting TIN nodes. The rigid field is already at y=0.18 m. Terrain support now closes the old horseshoe gap and includes one near-lattice-cell halo around the stadium envelope, retaining the original center reference and median datum. No field or architectural vertex moved. The halo is 31.76 m locally and keeps the supporting near-terrain TIN nodes at one grade. Palettes, Cityscape geometry and GLB bytes remain unchanged; only placement metadata and its manifest were updated. Before/after paths, numeric probes and final Cityscape/world verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`.
