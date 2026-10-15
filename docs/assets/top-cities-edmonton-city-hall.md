# Edmonton City Hall — 1992 building

Original procedural model of Gene Dub / Dub Architects' postmodern City Hall at 1 Sir Winston Churchill Square, Edmonton. Opened August 28, 1992; this is the present building, not the 1957 predecessor. The identity is the pair of steel/glass pyramids, three-storey stone/concrete wings, monumental open south colonnade and detached Friendship Tower with green diamond clocks and an open four-post box-frame carillon crown.

## Sources and dimensions

- [City of Edmonton](https://www.edmonton.ca/attractions_events/city-hall): architect, opening date, south entrance Arcade and eight-storey City Room pyramid.
- [Edmonton City Hall](https://en.wikipedia.org/wiki/Edmonton_City_Hall): main pyramid peak 43 m above grade, three-storey concrete base, two pyramids and approximately 60 m Friendship Tower.
- Dossier `tmp/top-cities/edmonton-city-hall/osm.json`: [way 35008768](https://www.openstreetmap.org/way/35008768), main hall, 15 m / 3 levels; [451068545](https://www.openstreetmap.org/way/451068545), Friendship Tower, 60.96 m. Main pyramid roof part 839760194 has a 28 m rise; council roof 839760195 has a 15 m rise. Five subsidiary glass gables 839760189–193 are also owned. All nine mapped rings are copied in `footprint.js`; no neighboring provider structures are owned.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Main pyramid peak | 43 m | Published, supported by OSM 15 m base + 28 m roof |
| Friendship Tower peak | 60.96 m | OSM height; published descriptions round to 60 m |
| Concrete roof / three-storey cornice | 15 m | OSM height |
| Council pyramid peak | 30 m | OSM 15 m base + 15 m roof rise |
| Main pyramid base | approximately 34.5 × 43.5 m | Mapped four-sided roof outline |
| Tower base | 5.3 × 5.0 m | Mapped detached footprint |
| Belfry stage | 48–60.96 m | Photo estimate |
| Clock diamond | 5.0 m tip to tip, centre 35.5 m | Photo estimate |
| Window/column spacing, bell forms and lean of roof apexes | Parameterized | Photo estimates |

The task stub's 62 m pyramid height was not retained: it conflicts with the 43 m published ground-to-peak height and approximately 61 m tower.

## Frame and ownership

Origin `[-113.49014, 53.54556]`; real metres, +X east, +Y up, +Z south, rigid y=0 local flat grade. No terrain elevation or Mercator stretch is baked in. Authoring u is bearing 84 degrees; v faces south at bearing 174 degrees. A 6-degree Y rotation is baked once into both GLBs. Control points on the main roof, `[-113.4904815,53.5457749]` and `[-113.4899614,53.5458086]`, establish the approximately east-going wall; the perpendicular mapped edge establishes the southern direction. Geographic rings are the original coordinates, not a bounding rectangle. Model plan covers the hall, mapped southwest garden walk, skylights and detached tower; the plaza, fountain, trees, memorials and neighboring buildings are excluded. The roof-view red outlines and numerical envelope tests were checked.

## Geometry and materials

The mapped outline is used for the thin grounded base and roof slab, with narrow west cornice tabs at the southwest walk trimmed to its supported wall face (u = -41.13 m). Provider ownership retains the complete mapped envelope. Integrated edge-to-edge masonry/window panels preserve three separate window rows. The glazed city-room south wall is recessed behind an open double row of rectangular columns. The southwest covered walk stays open beneath its slab. No opaque rectangular mass hides the colonnade openings. Every column lands on the base and supports the underside of the continuous roof; two initial columns at mapped cornice notches were removed after contact tests found no roof over them.

Both glass roofs use their mapped outline; the main apex leans north and the council apex south. Diamond glazing is original barycentric polygon tiling: each inset pane and its surrounding metal strips occupy adjacent regions of one plane, without overlapping faces. Far uses half the lattice density while keeping all roof planes, peaks and facade rows. Five mapped small glass skylights survive in both LODs. Tower shaft, five-metre green clock diamonds, hands, four corner posts, seven crossbar levels on all four faces, face-centre dividers and 23 simplified hanging bells remain in far. The crown spans the shaft footprint inset 0.3 m; internal bearers terminate at face crossbars, and each bell crown contacts a short hanger. The open crown follows the photographs rather than adding an invented pointed spire.

Seven merged material draws in each LOD: subdued warm grey Tyndall stone/concrete, a separately warmer sand-tan tower shaft (#c7b28a light / #70634d dark), pale trim, blue-grey glass, grey roof/bells, pale metal and green clocks. Dark palette dims stone/glass while retaining legibility of the metal crown. The blue event floodlighting/fireworks in the dossier is not reproduced as permanent illumination. The first light render looked too pale in the glass, so glass was darkened from `#527a8e` to `#3e6277`. Materials are texture-free; no external geometry or image pixels are embedded.

## Measured exported cost

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 16,894 | 7 | 925,184 | 903.5 |
| Far | 7,058 | 7 | 395,500 | 386.2 |

These are exported default-scene costs, not Tesla timings. Far retains identical overall bounds and all landmark silhouette features; the reduction comes from pane grids and mullions, not a solid replacement block.

## Visual and automated evidence

Inspected locally, not committed: `tmp/top-cities/shots/edmonton-city-hall/final-reference-comparison.jpg` places reference south-front / main-pyramid / north photographs beside exported near-light, far-light, near-dark and far-dark facade/back/tower views. Also read `edmonton-city-hall-glb-near-light-sheet.jpg` (overview, front, back, above, entrance and clock/belfry detail) and `edmonton-city-hall-procedural-near-light-sheet.jpg` (overview, above, entrance) in that same directory. The final export silhouettes, back-to-back pyramids, open colonnade, tower/clock proportions and roof-to-footprint orientation were visually judged against those photographs. Source and GLB bounds match. Far has coarser diamond lattice, as intended.

Reference-only photos are in ignored dossier scratch. Credits: Chris Woodrich, *Edmonton City Hall, Edmonton, Alberta, 2026-09-27 01*, CC BY-SA 4.0; Heidi G, *CN and the Pyramid* and *Looking up -)*, CC BY 2.0; hobvias sudoneighm, *Edmonton's 100th birthday ~ liquid light*, CC BY 2.0; Simon Law, *Glass roof*, CC BY-SA 2.0; WinterforceMedia/WinterE229, *City Hall Edmonton Alberta Canada 02*, CC0 1.0. Exact Commons links are recorded in the catalog; only the north view was fetched in addition to the supplied dossier. No photographs are shipped.

Review-fix evidence (g12cr): inspected exported near-light and far-dark six-view sheets in `tmp/top-cities/shots/edmonton-city-hall/review-fix/`. These show the volumetric open crown from opposite bearings, warmed shaft, enlarged clock diamonds and trimmed southwest roof tabs; the main pyramid remains 43 m. This used one look-fix iteration. The original independent review found clean placement and no provider overlap in both modes.

The 13 focused tests pass, covering both peak heights, independent grounded tower, open plaza/colonnade, column-to-base/roof contacts, all four corner post contacts, face crossbar contacts, internal bearers and bell hangers, open crown cells, deliberately shortened unsupported-end rejection, trimmed roof tab absence, enlarged clocks, footprint envelope and GLB round-trip bounds. The requested combined top-cities run passed 847/848 tests; its sole failure was the unrelated `art-gallery-of-alberta` exported material `steelUnder` assertion. Edmonton conformance passed. Asset catalog validation passed (406 entries / 800 variants). Depth regeneration/check passed with zero dropped cycle edges. Focused QA (`tmp/top-cities/edmonton-city-hall/review-fix-metrics.json`) reports no issues, zero coplanar pairs, 0% back-face hits, no far window-rhythm warnings and no below-grade structures; 0.45 m² of tiny bell/hanger face projections at 11.5 cm separation are structural contacts, with no cycles.

## Approximations and integration handoff

Window counts, north/side facade subdivisions, roof apex offsets, colonnade spacing, belfry heights and bell count/layout are estimates rather than a measured architectural survey. Bell silhouettes are simplified; the model uses 23 simplified bell silhouettes in six tiers rather than surveying their individual positions. It omits interior structure, inscriptions, artwork, site furniture, the fountain, temporary banners and permanent lighting design. No photograph textures, transparency/refraction or interior atrium are modeled. The southwest walk follows the mapped envelope at the three-storey cornice; exact architectural roof slopes and stair transitions there remain simplified.

Cityscape: **verified for static appearance, near/far selection, visible footing and provider replacement**. Full 3D world: **verified for the same static views with resident Terrarium terrain**. Captured and inspected `tmp/top-cities/edmonton-city-hall/review-fix/app/{city-lod,world-lod}/edmonton-city-hall-{far,near}.png` at zoom 15.2 / 17.2, pitch 55 / 62, bearing 355; reports confirm active far / near LODs and no outstanding tile downloads. The full-height inspection views in `app/{city,world}/edmonton-city-hall-near.png` use zoom 17.6, pitch 65 and bearing 355; the files labeled far/street in those two directories use that same custom camera and do not establish another LOD. The crown remains a box frame in shared runtime shading, the shaft is tan, and the southwest slabs are trimmed. The app source bundle stamp was `1e97b2922e20` (before this final manifest-only evidence-text update), served from `/tmp/codriver-edmonton-g12cr-aHb10c` on slot J. Servers 79336 / 79337 were stopped by PID after capture. Protomaps source `tiles.codriver.io`; world DEM AWS Terrarium z≤15. Expected unauthenticated API/CORS errors are recorded in capture reports; model loading succeeded.

Terrain refinement/eviction, numeric per-footing DEM residuals, pad-edge transitions, failure recovery and lifecycle tests remain **not tested in this fix** and need the lead's integration judgement; static screenshots do not establish those gates. The 88 m pad covers the complete modeled extent. Shared public runtime bundles, deployment and git state were untouched. Only this landmark's owned files and the permitted shared generated `src/peregrine/landmarks/depth-layers.js` were changed.
