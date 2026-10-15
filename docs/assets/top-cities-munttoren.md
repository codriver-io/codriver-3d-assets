# Munttoren, Amsterdam

Original procedural model of the permanent restored Mint Tower at Muntplein 12/14 and the adjoining neo-Renaissance replacement guardhouse. No reconstruction of the lost eastern medieval gate tower. Source: `src/peregrine/landmarks/top-cities/munttoren/`; exports: `public/models/buildings/munttoren-{near,far}.glb`. Follows the [top-cities contract](../top-cities-landmarks.md).

## Sources and dimensional frame

| Feature | Value | Basis |
| --- | --- | --- |
| Overall vane tip | 41 m | [Amsterdam Monumentenstad](https://amsterdam-monumentenstad.nl/database/grachtenboek_objecten.php?id=3085), correcting the approximate 31 m scaffold |
| Upper carillon room | About 30 m above street | [Gemeente Amsterdam](https://www.amsterdam.nl/nieuws/achtergrond/dinosaurus-moderne-drukte-muntplein/), corroborating that 31 m is too short for the whole spire |
| Upper tower | 1620, Hendrick de Keyser; octagonal timber with lead cladding, four clocks and open lantern | [ARCAM](https://arcam.nl/architectuur-gids/munttoren/) |
| Base | Medieval round structure, subsequently octagonally encased | [Dutch heritage register, monument 3729](https://monumentenregister.cultureelerfgoed.nl/monumenten/pdf/3729) |
| Guardhouse | Current structure replaces the former guardhouse in the nineteenth century | ARCAM; OSM plan tags include later rebuilt portions |
| Base diameter / masonry top | About 5.5 m / 21.8 m | Diameter mapped; stage height estimated from photographs |
| Clock face centre / diameter | 24.15 m / 3.48 m | Photographic estimate |
| Open carillon / crown orb | 26.3–30.95 m / 36.82 m | Photographic estimate; crown profiles simplified |
| Guardhouse envelope / eaves / ridge | About 14.1 × 7.65 m / 7.8 m / 12.65 m | Mapped plan, OSM way 751683820 height 13 and roof:height 5; small profile adjustment estimated |
| Connector eaves / ridge | 6 m / 8.8 m | OSM way 751683818 height 9, roof:height 3 |
| Origin | [4.893212, 52.367055] | Mapped tower anchor |
| Bearing | Guardhouse north edge 2.52° north of east; frontage 177.48° | Two OSM control points [4.8928583,52.3670802] and [4.8930658,52.3670858] |

The dossier's OSM stage heights 7/14/19/24 m do not include a credible complete spire envelope: the published 41 m is used for the top, with stage proportions estimated from reference photographs. They are not represented as surveyed measurements. +X east, +Y up, +Z south; rigid street grade y=0. Rotation is baked into vertices once. No terrain heights, altitude, latitude stretch or app datum are baked in.

## Geographic ownership and materials

Mapped provider rings cover tower outline 57862728, guardhouse outline 976474361, lower projections 751683816/817, guardhouse/connector roofs 751683818/820, round stump 751683819 and octagonal upper parts 751698382/383/384. Every modeled provider part is enumerated in footprint.js; the two tiny stair-part rings retain all mapped exterior vertices and include the tower anchor as an interior overlap point so each exceeds the shared 4 m² polygon minimum; adjacent apartments, houseboats, streets and bridges stay provider-owned. The vertex test allows the contract's 0.8 m edge tolerance for cornices, clocks and stair projection dressings. No broad ground slab is authored.

Eight merged material meshes per LOD: subdued brick, weathered sandstone, dark lead/metal, lead roof/shutters, tile, glass, black recess and gilt. Dark theme uses the same material names with dimmer colours; no fabricated floodlight rig or unsupported self-lit windows. Walls are shells with actual arched apertures, with individual inset panes rather than long stripes. The guardhouse has two rows of bays, stepped end gables and dormers; the connector has three genuinely open arcade bays. The clock faces retain geometry Roman numerals and hands in both LODs. The upper carillon has open arched bays, posts, supported bell frames, bells, curved brackets, an open bulb crown, finials, orb and vane.

The g9a review fix adds a projecting stone balustrade at 14.1–15.24 m, compresses the open bell stage by 25% (6.2 → 4.65 m), and uses a supported ogee cap below a wider eight-rib gilded crown with two tying bands. Both LODs retain the crown openings. Brick is deeper red-brown and stone is lighter.

Near adds shutter louvres, clock minute ticks, masonry strings, quoin detail and belfry brackets. Far drops those subpixel details and reduces curve sections while preserving the openings, silhouette, four clocks, bell groups, crown and individual facade bays. Approximation: chamfered octagonal reading of the medieval circular stump, simplified bell count, crown/vane ornament, no heraldic sculpture, interiors or brick mortar. Window count and individual decorative profiles are not a survey claim.

## Provenance

All geometry is original and texture-free; no scans, traced external meshes or photograph pixels are included. OSM-derived plan data © OpenStreetMap contributors, ODbL 1.0. Reference images remain exclusively in ignored `tmp/top-cities/munttoren/refs/`:

- [Munttoren Amsterdam](https://commons.wikimedia.org/wiki/File:Munttoren_Amsterdam.jpg), Massimo Catarinella, CC BY 3.0: overall night silhouette.
- [Munttoren-Amsterdam](https://commons.wikimedia.org/wiki/File:Munttoren-Amsterdam.jpg), Yair Haklai, CC BY-SA 3.0: belfry, bells and clock details.
- [Amsterdam (NL), Munttoren -- 2015 -- 7237](https://commons.wikimedia.org/wiki/File:Amsterdam_(NL),_Munttoren_--_2015_--_7237.jpg), Dietmar Rabich, CC BY-SA 4.0: daylight cladding, crown and clock detail; licence checked on the Commons description page.
- Historical context in the supplied refs-sheet: Simon Frisius gate print (public domain), two RCE cityscapes (unknown authors, CC BY-SA 4.0), and AmstelAmsterdamNederland (unknown author, public domain). These establish historic context, not the present-day gate configuration; source links and credits are in the dossier's SOURCES.txt.

## Verification and placement status

Focused tests pin published overall height, orientation, exact provider ownership, above-grade base, footprint containment, four clock materials, open belfry/arcade sightlines, guardhouse ridge and near/far bounds. Named carillon beam terminals are checked against observed corner-post surfaces, excluding the member itself; deliberately shortened terminals fail the same distance criterion. Every post is checked against the lower and upper cornice. Exported geometry receives budget, normal/back-face, window rhythm, layered-face and depth-cycle checks.

Cityscape: **visual placement verified**, 2026-10-15. Full 3D world: **visual placement verified**, 2026-10-15, terrain enabled, resident foundation datum 8.621 m. These are limited visual checks of the north facade and base, provider clearance, runtime material appearance and near/far switching. Terrain refinement/eviction, slope residuals, failure/reload, origin shifts and other lifecycle cases remain **not tested**; these captures do not establish all terrain gates.

## Review fix and evidence — 2026-10-15

The g9a review found a skeletal black crown, excessively tall open lantern, absent projecting gallery and pink-beige guardhouse. The revised model shortens the open stage by 25%, retains supported bells and corner beams, gives the crown a broad squat bulb with eight substantial gilt ribs, two gold bands and gilt orbs/vane, and adds a stone gallery whose balusters embed in both rails. The unchanged vane tip remains 41 m. Shared brick is now deep red-brown, with lighter stone bands. Ornament and gold extent remain photographic/stylized estimates rather than survey measurements.

| LOD | Triangles before → after | Draws | Bytes before → after | KiB before → after |
| --- | ---: | ---: | ---: | ---: |
| Near | 16,238 → 17,262 | 8 → 8 | 695,828 → 737,300 | 679.5 → 720.0 |
| Far | 7,602 → 8,434 | 8 → 8 | 312,688 → 350,512 | 305.4 → 342.3 |

One geometry look-fix round. Judged the exported near/far, light/dark GLBs from overview, facade, opposite facade, roof, street and crown detail against the existing photos in `tmp/next-200/fix/g9a/munttoren/glb-reference-comparison.jpg`; all four full sheets and individual views are under `glb/`. The gold crown now reads clearly in dark far detail; clock faces, individual bays and open bell stage remain readable. No new reference images or retained captures were added.

Unobstructed north/Rokin-side app captures are under `tmp/next-200/fix/g9a/munttoren/app/{city,world}/north-{far,near,street}.png`, compared in `app-comparison.jpg`. The closest north view uses bearing 180°, zoom 18, effective pitch 70°, approximately 205 m horizontal setback. It shows the complete tower, arcade and guardhouse base without foreground blocks; no provider overlap, obvious floating base, terrain cutting the facade or exposed pad wall is visible in either mode. Reports record active landmark, LOD, camera, terrain enablement and world datum. Runtime scratch bundle stamp `e21f64c77c54`, OSM/Protomaps tiles from tiles.codriver.io, world Terrarium DEM from elevation-tiles-prod at max z15. These are appearance captures, not a driving or device-performance test.

Eight focused landmark tests pass, including observed gold bulb extent, named lead-cap/rib contact with a displaced-free-end negative case, gallery presence, bell beam/post contacts, four clocks, open arcade, bounds and exact provider ownership. Deterministic QA reports no issues, layered or coplanar faces; near back-face sweep 1.5%, zero dropped material-cycle edges. Depth-layer generation and freshness checks pass. The requested shared conformance run reports 811 pass / 2 fail, both unrelated Palais Bourbon footprint/missing-manifest errors; all three Munttoren checks pass. Global catalog validation was attempted twice and blocked by concurrent Smithsonian Castle export/registration, then its missing documentation; the same catalog validator passes against an isolated own-record/source/doc/manifest/GLB bundle (`catalog-own.json`). `pnpm assets:check` and `pnpm assets:preview` were also attempted and blocked by the unrelated missing Smithsonian Castle documentation.

Scratch app servers use only ports 3314/3316 (admin 3315/3317), with PID-based cleanup recorded in `scratch.json`; shared public bundles were not rebuilt. No Git writes, hand-written shared runtime edits or SPEC.ready changes/assertions were made; only the authorized generated depth table was refreshed. Independent re-review remains with the lead.
