# Avicii Arena — Stockholm

Avicii Arena/Globen: the110 m white spherical shell, round porthole clusters and panel joints, grounded concrete buttresses and two parallel SkyView tracks carrying4.5 m spherical glass gondolas.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Avicii_Arena)
- [Owner SGA:110 m diameter,85 m interior height and current exterior](https://sgafastigheter.se/vara-arenor-fastigheter/avicii-arena/)
- [NCC builder:two parallel SkyView tracks and4.5 m gondolas](https://www.ncc.com/our-offer/our-projects/skyview/)
- [C.F. Møller:SkyView cabins and reinforced arena hull](https://www.cfmoller.com/p/Skyview-Stockholm-i2632.html)
- [Arena operator:current SkyView exterior attraction](https://aviciiarena.se/skyview/)
- [OSM provider footprint / building part 25431325](https://www.openstreetmap.org/way/25431325)
- [File:Globen (5510985669).jpg — bengt-re from Sweden; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Globen_(5510985669).jpg)
- [File:Ericsson Globe Stockholm.jpg — Alexandar Vujadinovic; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Ericsson_Globe_Stockholm.jpg)
- [File:Stockholm Globe Arena 2012.jpg — kallerna; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Stockholm_Globe_Arena_2012.jpg)
- [File:Stockholm Globe Arena 2.jpg — kallerna; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Stockholm_Globe_Arena_2.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/avicii-arena/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=18.0805335,59.2919830,18.0868665,59.2952170.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Sphere diameter | 110 m | SGA owner |
| Exterior shell top | 85 m | OSM; owner lists110×85 m but describes85 m as interior height |
| Sphere center | y30 m; lower visible sphere truncated at y8 above the grounded concourse | Geometric fit to chosen85 m exterior estimate and photos; no buried geometry |
| SkyView gondolas | 4.5 m diameter | NCC |
| Rail supports / buttresses | photo-scaled | Estimates, all contacts tested |

Origin `[18.08334549375,59.2936108]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Way25431325 fixes the arena center. Controls [18.0822927,59.2934124] and [18.0822291,59.2935235] constrain the western shell phase; mapped SkyView entrance node477044933 at [18.082055,59.2934673] and upper viewpoint node2134752444 at [18.0823788,59.2935052] fix the west-southwest track meridian. The exact provider way is retained; the runtime mask follows the published110 m shell envelope including its low perimeter concourse and small buttresses. Nearby shopping, Annexet and arena-office blocks remain outside ownership.

## Model and foundation

A closed, clipped spherical skin in real metres supplies the globe silhouette, with adjacent white panel seams and actual circular glass polygons. Portholes cluster at the photo-observed middle and lower bands; far retains them as coarser circles. Twin parallel curved tracks follow the western sphere surface. Every rail segment terminates on a named hull standoff, ties meet the rails and both gondolas have a carriage touching their frame. Gondolas are shown at plausible static mid-ride positions below the85 m shell apex. Concrete buttresses are grounded and reach the shell; no floating rails or blank far hemisphere is used.

The dome exterior remains the permanent1989 shell with2010 SkyView. The2025 arena refurbishment concerns internal performance facilities; the exterior sources and current owner/ride pages agree with these permanent features.85 m is an exterior modeling estimate based on OSM and photos, not a claim that published interior height equals an independently surveyed exterior height; no130 m sea-level offset is baked into geometry. The shell is not110 m high. Photos1 and6–8 are checked exterior views;3–4 are interiors and5 has the temporary2009 art cottage, which is omitted. Surrounding offices, temporary projections/signs, lettering, artwork, flags and plaza paving are excluded.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 41225 | 6 | 597484 |
| far | 5809 | 6 | 107968 |

Deterministic QA: `tmp/batch/avicii-arena-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/avicii-arena.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/avicii-arena/avicii-arena-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/avicii-arena/avicii-arena-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

The mapped arena envelope is roughly130 m across and includes the low concourse around the110 m sphere. Its exact outline is modeled as an estimated8 m dark glazed concourse, with a true annular roof meeting the white shell; neighbouring office blocks are excluded. [NCC’s2025 completion report](https://www.ncc.com/media/news/the-modernization-of-avicii-arena-is-now-complete/) confirms an internal ring/retractable inner roof, preserving the permanent exterior.

Author review used two looks. The second adds the track lattice diagonals to match the reference; all rails, standoffs, ties, diagonal webs and gondola carriages meet independent named supports in both LODs. The110 m white globe, circular pane clusters and two capsules remain recognizable in the far/night sheet.

Independent-review revision: Far sphere uses 24 longitudinal sectors and ten latitude bands, retaining real circular portholes, both supported SkyView tracks and 4.5 m gondolas. Hidden rail/bracket end caps and sub-pixel track subdivisions are omitted; near GLB is byte-identical. The low-bracket detached-control direction is horizontal so it cannot falsely hit the legitimate concourse roof.

Far cost: 10983 → 5809 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/avicii-arena.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
