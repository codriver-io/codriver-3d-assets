# Uspenski Cathedral — Helsinki, Finland

Original procedural present-day exterior of the Orthodox cathedral at Kanavakatu 1, on the Katajanokka rock, consecrated in 1868 and designed by Aleksey Gornostayev. The red-brick cruciform mass, green copper central crown capped with gold, four ridge cupolas, eight corner pinnacles, east apses and connected south bell tower distinguish it from the white Lutheran Helsinki Cathedral.

## Sources and rights

- [Orthodox parish](https://hos.fi/kirkot/uspenskin-katedraali/), checked 2026-10-13: cathedral identity, hilltop setting, consecration 25 October 1868, architect, and cupola roof reaching 33 m.
- [Wikipedia](https://en.wikipedia.org/wiki/Uspenski_Cathedral), checked 2026-10-13: Russian Revival identity and present-day exterior references. No dimension was invented from its empty infobox.
- [OSM main way 15242921](https://www.openstreetmap.org/way/15242921), west porch roof way 1262954877, and 50 nested building-part ways 1553708251–1553708300, supplied dossier `tmp/top-cities/uspenski-cathedral/osm.json`. © OpenStreetMap contributors, ODbL 1.0. The origin is the central onion centre, not the dossier's approximate road-side origin.
- [Uspenski Cathedral from air](https://commons.wikimedia.org/wiki/File:Uspenski_Cathedral_from_air.jpg), Timo Noko, CC BY 2.0: plan, apses, tower arrangement and copper crown profile.
- [Front of Uspenski Cathedral In Helsinki](https://commons.wikimedia.org/wiki/File:Front_of_Uspenski_Cathedral_In_Helsinki.jpg), John Samuel, CC BY-SA 4.0: west porch, granite shafts, arched windows, masonry bands and steps.
- [Uspenskin katedraali kesäiltana](https://commons.wikimedia.org/wiki/File:Uspenskin_katedraali_kes%C3%A4iltana.jpg), Jari Kolehmainen, CC BY-SA 4.0: brick/copper colors and distant silhouette.
- [Catedral Uspenski, DD 06](https://commons.wikimedia.org/wiki/File:Catedral_Uspenski,_Helsinki,_Finlandia,_2012-08-14,_DD_06.JPG), Diego Delso, CC BY-SA 3.0: bell stage and green roof with small gold cap.

Commons licences were checked on file pages. Reference photos are retained only in ignored scratch; no external mesh, photo or texture enters source or GLB. Code/docs are original Codriver authoring, MIT; original models CC BY 4.0, with independent OSM credit retained. Dossier interiors and plaque images were excluded from exterior modeling.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | --- | --- |
| Main copper roof / lantern neck | 33 (published) / 34.6 (model) | Parish roof height; redistributed crown profile is photo-estimated |
| Highest gold onion/cross | 37.84 | Estimated cap and cross above published roof |
| Central drum diameter / top | 9.5 / 28.1 | Photo-calibrated estimate; provider drum envelope is about 12.65 m |
| Main church width | about 29 | Mapped arm/pinnacle envelope |
| Full north–south envelope | about 44 | Mapped church plus south bell tower |
| Main walls / arm gables | 15 / 21 | OSM building-part heights |
| Four ridge green/gold crowns | 25 / 26 | OSM crown heights, simplified photo profile |
| Eight small green/gold crowns | 22 / 22.65 | OSM tags, photo-calibrated gold cap |
| South bell roof / cross | about 20.7 / 22.5 | OSM parts plus estimated cross |
| West porch columns / steps | 4.2 / 0.9 | Photo estimates |

OSM central cone/onion tags 39/44 m disagree with the parish's 33 m roof height. The original 33.3 m copper neck was too compressed in the aerial comparison; the revised neck is estimated at 34.6 m, while the existing 37.84 m summit is retained. These crown tiers are photo estimates, not a survey. The cathedral's hill is outside the asset.

Origin `[24.9599092, 60.1685234]`, real metres east/up/south, y=0 at the hilltop church footing. The yaw +3.3° is baked into exported vertices. Two mapped crossing controls `[24.9597658,60.1685863]` and `[24.9600325,60.1685937]` establish the arm's east edge bearing approximately 86.8°; the west-facing porch bearing is 266.7°. Host must not rotate it again. No DEM, sea-level datum or Mercator scale is baked.

The two replacement rings own only the main church and the west porch roof; exact 52 IDs include all nested crowns and annexes. Neighbouring mint, apartments, harbor warehouses and detached outbuildings stay provider-owned. Roof/pinnacle simplification projects no more than 1.65 m beyond the mapped rings, pinned by vertex-distance tests; stair granite is ground geometry, not authority to mask other buildings. A rigid granite plinth follows the chamfered nave plan.

## Geometry and approximations

Six merged material draws: subdued red-brown brick, patinated green copper, recessed dark glazing, grey granite, pale window trim and gold `lamp` crowns/crosses. Dark palette dims masonry and copper; gold stays visible without invented window bands. No raster textures or unsupported export extensions.

The external wall shells have actual arched holes and inset separate window panes in both LODs. Near adds two prominent stepped brick archivolt orders, shafts, glazing bars and dentils; far keeps one broad order and each separate opening, sill, pier, cornice and turret with fewer arc segments. Arm gables retain brick arch surrounds and supported sloping cornices. The copper crown has a broad lower shoulder, a narrow vertical lantern tier, a second shoulder and a narrow neck; the larger ridge turrets have pierced faceted drums. Three eastern apses and a low south connector preserve plan asymmetry. The west porch is an open brick arch supported by two granite columns and grounded stairs. Orthodox crosses keep upper/main/lower bars near and a simpler supported cross far.

Brick courses, ornate capitals, small kokoshnik decorations, bells and icons are simplified. Individual mortar joints and interior furnishings are omitted. Close-up capitals are approximate, but the continuous supports and open porch are retained. No broad plaza or rock mesh is fabricated.

## Review b7a corrections and verification — 2026-10-13

Finding 1: rebuilt the central pierced drum from radius 6.12 m to 4.75 m, extended its arched tier to 28.1 m and replaced the broad simple taper with distinct shoulders, narrow vertical lantern and neck. Gold cap/cross stays continuously supported at the same 37.84 m summit in both LODs. Finding 2: added stepped brick archivolts and jambs, thicker vertical piers, cornice bands, gable arch surrounds and continuous sloped gable cornices. Near has two arch orders; far retains one coarser order with real separate window openings. Vertex welding preserves normals and reduces export bytes.

Depth QA exposed reciprocal brick/copper layers after strengthening far masonry. Internal masonry caps were removed; far low-roof eaves were inset, end-cap trim dropped and intermediate turret collars dropped. This removes the layered geometry instead of hiding it with ordering ranks.

Compared dossier reference photos with exported near/far and light/dark contact sheets in `tmp/top-cities/shots/uspenski-cathedral/review-fix-2/`, covering overview, facade, rear, above, entrance and detail. Initial comparison is in `review-fix-1/`; exactly two look-fix iterations were used. The final source and exported GLBs retain consistent silhouettes and window/fold rhythm. No new external reference was fetched.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 36,385 | 6 | 1,482,544 | 1447.8 |
| far | 8,768 | 6 | 359,940 | 351.5 |

Targeted landmark tests verify supported contacts, geographic ownership, LOD dimensions and the revised observable silhouette/relief. Depth regeneration plus targeted check pass with zero dropped cycle edges. Exported QA reports no issues for either LOD. Shared test run: 605/606 pass, including all six conformance checks for these two landmarks and all 15 focused tests; the only failure is unrelated Charles Bridge polygon validity. Catalog validation and `pnpm assets:check` pass (336 entries / 592 variants); `pnpm assets:preview` builds the ignored local inspector. Full log: `tmp/top-cities/walt-disney-concert-hall/review-tests.txt`.

Cityscape: **not tested for this revision**. Full 3D world: **not tested for this revision**. Supplied b7 baseline app views showed no obvious provider penetration or exposed footing, but they predate these geometry changes and do not measure DEM residuals. The lead recaptures app views and independent re-review after handoff; hillside datum, resident lattice coverage, uphill/downhill approaches, terrain lifecycle and hardware remain unverified. No app server, runtime bundle, deployment or git write was performed in the shared tree.

## Round 2 — remaining b7ra finding

The remaining squat central crown was compared with `tmp/top-cities/uspenski-cathedral/refs/aerial.jpg`. The lower shoulder now rises from 28.15 to 30.9 m with a steeper taper; the narrow copper lantern extends from 31.15 to 33.2 m (2.05 m instead of 0.9 m), then tapers to a closed supporting neck at 34.6 m. The gilded cap radius falls from 1.35 to 0.88 m and its height from 2.78 to 1.48 m; the planted cross remains 37.84 m. Both LODs preserve this profile. Near ribs terminate on the two supported shoulder/lantern seats; far drops them. Photographic proportions are estimated and do not resolve the conflicting published/provider heights.

Fresh exported sheets inspected beside the aerial reference: `tmp/top-cities/shots/uspenski-cathedral/review-b7ra-1/uspenski-cathedral-glb-near-light-sheet.jpg` (overview, facade, rear, roof, crown detail and entrance) and `tmp/top-cities/shots/uspenski-cathedral/review-b7ra-final/uspenski-cathedral-glb-far-dark-sheet.jpg` (overview, facade, rear and crown detail). The combined reference/export comparison is `tmp/top-cities/uspenski-cathedral/review-b7ra-comparison.jpg`. Two visual inspection rounds were used.

Before → after: near **36,433 → 36,385 triangles / 6 → 6 draws / 1,483,956 → 1,482,544 bytes**; far **8,936 → 8,768 / 6 → 6 / 368,416 → 359,940 bytes**. All 7 focused Uspenski tests and the complete requested registry run pass; combined log `tmp/top-cities/uspenski-cathedral/review-b7ra-tests.txt` reports 621/621 passing. The final shared metrics report at `tmp/top-cities/uspenski-cathedral/review-b7ra-metrics.json` has no issues, zero near/far layered faces, zero near coplanar pairs and 0% near back-face hits. Targeted depth regeneration/check has zero dropped cycle edges. Catalog validation passes with 336 entries / 608 variants; the ignored local preview builds.

Cityscape and Full 3D world: **not tested for this revision**; the supplied b7r app evidence showed seated steps, but the lead must recapture current app views and obtain independent re-review. Uspenski's hillside DEM residuals, terrain refinement and lifecycle remain separate lead gates. No shared runtime code, server or git write was used.

Final checkpoint: the focused tests were repeated after the far statue torsos were extended to seat their heads, and pass 23/23 (`tmp/top-cities/uspenski-cathedral/review-b7ra-focused-final.txt`). The full requested run previously passed 621/621. Catalog validation previously passed 336 entries / 608 variants; the final recheck encountered an unrelated concurrently authored `centre-pompidou-far.glb` lacking its completed catalog registration. Targeted depth/QA uses the owned records and remains clean; the lead must rerun the shared catalog once that external export settles.
