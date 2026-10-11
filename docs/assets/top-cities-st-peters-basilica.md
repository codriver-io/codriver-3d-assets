# St. Peter's Basilica

Original procedural exterior of the present Papal Basilica of Saint Peter, Vatican City, in the Rome metropolitan area. The Renaissance/Baroque basilica was completed in 1626; this asset represents the present exterior with the clocks and roof statues. It excludes Bernini's piazza colonnades, sacristy, adjoining Vatican buildings and all interiors.

Source: `src/peregrine/landmarks/top-cities/st-peters-basilica/`, with configuration, immutable mapped plan, footprints, geometry, a geometry kit, facade and dome modules, cameras and focused tests. Catalog: `prototypes/assets3d/catalog.d/st-peters-basilica.json`. Build: `pnpm build:top-cities-landmarks st-peters-basilica --no-check`.

## Sources and rights

- [Official basilica height FAQ](https://www.basilicasanpietro.va/en/faq/what-is-the-height-of-st-peters-dome): 136.57 m from base to cross top, checked 2026-10-05.
- [Official dome history](https://www.basilicasanpietro.va/en/san-pietro/the-dome): double shell and ogival exterior.
- [St. Peter's Basilica](https://en.wikipedia.org/wiki/St._Peter%27s_Basilica): 114.69 m facade width, 45.55 m facade height, travertine and thirteen rooftop figures. The dossier's nominal 220 m length / 150 m width are general building dimensions; this model uses the mapped outer envelope, about 217.5 m by 157.1 m.
- [OSM way 244159210](https://www.openstreetmap.org/way/244159210): basilica envelope; dome/drum, lantern, cross, four corner domes and front pitched chapel parts are in `OSM_WAYS`. Dossier OSM geometry was reused and owned ways checked through the shared Overpass helper, saved in ignored `tmp/top-cities/st-peters-basilica/owned-osm.json`. The very small cross parts are covered by the main ring instead of tiny invalid polygons. © OpenStreetMap contributors, ODbL 1.0.
- [Front photograph](https://commons.wikimedia.org/wiki/File:Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg), Alvesgaspar, CC BY-SA 4.0; [distant view](https://commons.wikimedia.org/wiki/File:PonteSantAngeloRom.jpg), Rabax63, CC BY-SA 4.0.
- [Historical aerial](https://commons.wikimedia.org/wiki/File:Aerial_shot_of_St._Peter%27s_Basilica,_the_Vatican,_Rome,_by_Fedele_Azari_(Getty_108JM1).jpg), Fedele Azari / Getty, CC0 1.0, 1920s: used only for lasting massing and roof arrangement.
- [Garden-side exterior](https://commons.wikimedia.org/wiki/File:Saint_Peter%27s_Basilica_Dome_2020_P04.jpg), Fallaner, CC BY-SA 4.0: dome, lantern and lower domes.

Photos remained in ignored scratch, were viewed for comparison, and are not shipped or used as textures. Original geometry only; no traced mesh, scan or external mesh. Dossier interior images were visible on its supplied reference sheet, but were not used to author an interior. Reference file pages were checked for attribution/licensing.

## Geographic frame and placement

Origin `[12.453372, 41.902166]` is the dome-axis anchor from the mapped dome part. Metres: +X east, +Y up, +Z south. Local y=0 is flat grade; foundations remain rigid, with no DEM, altitude or latitude stretch baked in. Model building axes are rotated +0.55 degrees about Y, once, inside authoring/export. Main front faces bearing 89.45 degrees; the host must not rotate again.

Two OSM control points on the long entrance wall are `[12.4550112, 41.9026776]` and `[12.4550245, 41.9016425]`. Their approximately 115.2 m N–S line defines the frontage normal. Footprints include the owned basilica outline and its roof/drum parts; excluded buildings are left to the provider. Cornices/columns project up to roughly 1.5 m beyond portions of the mapped wall line; the focused envelope check permits 2.5 m. No plaza slab covers adjacent roads.

`padM: 145` encloses the basilica at the dome anchor. No site survey/DEM was performed; a relatively level rigid basilica base is assumed. Full 3D world must separately sample the footprint and entrance before accepting its datum; a bounded median pad may be needed if relief exceeds 2 m. The default pad's effect on neighboring ground has not been verified.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Cross top | 136.57 m | Official published dimension |
| Facade wall width / roofline | 114.69 m / 45.55 m | Published facade dimensions; figures rise above the roofline |
| Outer metric bounds | 217.52 m east–west / 157.12 m north–south | OSM envelope, plus small trim projections |
| Dome/drum axis | local `(0,0)` | Mapped dome part |
| Foundation/lower walls | y=0–34 m | Estimated |
| Nave roof eaves / ridge | 47.2 / 53.3 m | Estimate, informed by 47–54 m OSM roof parts |
| Main drum core radius / paired-column radius | 24.7 / 26.5 m | Estimated from mapped exterior and photos; not the interior diameter |
| Drum base / shell spring / shell crown | 58 / 81 / 114.5 m | Estimated; OSM dome includes lower drum stages |
| Dome shell base diameter | 51.4 m, below a roughly 60.5 m base cornice | Estimated external profile, kept distinct from internal dome diameter |
| Lantern columns / cap / globe | 116–125.8 / 127–131.4 / 132.9 m | Estimated between sourced height anchors |
| Lower corner dome radii / tops | 8.6–9.1 m / 61.3 m | Mapped positions/diameters, estimated lanterns |
| Entrance porch depth | about 10 m | Estimated; genuine space between columns and recessed doors |
| Giant facade columns | eight, 1.2 m base radius, y=1–29.4 m | Reference rhythm, estimated sizes |
| Roof statues | thirteen, abstract 5.7 m figures; center 6.1 m | Count published; sculpture sizes/profile estimated |

## Geometry and materials

The long Latin-cross nave is distinct from the crossing and three rounded apses. An irregular mapped lower body carries stepped roofs and raised nave/transept spines. Lower windows, pilasters and courses follow each mapped exterior run. Four corner domes sit at their individually mapped positions.

The hero dome is an ogival lathe with sixteen trim ribs, three rows of small shell openings in near, a paired-column drum, cornices, and an eight-column lantern on a glazed core. The lantern's metal globe and cross reach the published 136.57 m. Facade geometry has genuine arch voids and a recessed porch, detached giant-order columns with abstract Corinthian leaf capitals/flutes in near, central pediment and shield/keys, attic windows, thirteen figures, two clock faces and scroll-like surrounds. Carved Latin lettering is omitted rather than approximated as unreadable glyphs.

Eight merged material names exist in both palettes: `stone`, `trim`, `recess`, `roof`, `dome`, `glass`, `lamp`, `light`. Warm travertine contrasts with darker relief, brown tile, grey dome metal and shaded glazing. Night stone is dimmer, while `lamp` metal and `light` drum/lantern glazing remain visible through the app's unshaded material convention. This is a stylized night treatment, not a measured floodlight plan.

Far keeps columns, actual porch openings, clocks, statues, paired drum columns, all sixteen ribs, the lantern/cross and four lower domes. It drops fine fluting/capital leaves, shell dormers, grilles and small window trims, reduces segment counts and simplifies small outline notches. Duplicated vertices are welded with normals retained; grade-facing hidden triangles are removed. The two variants have identical bounds.

## Export costs and verification

Measured GLB default scenes, uncompressed and texture-free:

| Detail | Triangles | Draws | Bytes | KiB rounded |
| --- | --- | --- | --- | --- |
| Near | 36,640 | 8 | 1,534,544 | 1,499 |
| Far | 10,707 | 8 | 460,212 | 449 |

Both fit the 60k / 14 / 2.5 MB and 12k / 8 / 500 KB caps. Far retains more geometry than the preferred 3–8k target because the large facade, paired-column drum and roof statues remain legible. No Tesla hardware measurement was made.

Viewed evidence, all under ignored `tmp/top-cities/`:

- `st-peters-basilica/refs-sheet.jpg` and `st-peters-basilica/refs/extra-sheet.jpg`: supplied front/distant references plus two additional views (aerial and garden side).
- `shots/st-peters-basilica/st-peters-basilica-procedural-near-light-sheet.jpg`: first eight-view look, including front, opposite side, roof, street, close facade, dome and top footprint plan.
- `shots/st-peters-basilica/st-peters-basilica-final-contact.jpg`: **opened and judged** with four reference photos followed by all eight views of each exported GLB variant: near/light, far/light, near/dark, far/dark. Includes front/back/above/street/detail comparisons and red footprint rings.
- Four individual eight-view exported sheets also remain in that folder, named `st-peters-basilica-glb-{near,far}-{light,dark}-sheet.jpg`.

Changes driven by the first comparison: added mapped lower-wall windows/pilasters to avoid blank rear walls; darkened tile roofs; kept the deeper nave so street-level facade obscures the drum as in the photograph. Deterministic QA then found overlapping grade/cornice faces and an oversized far export: removed hidden grade faces, widened cornice ends clear of wall planes, simplified far ribs/columns and welded duplicate vertices; removed redundant side decorations authored at assumed wall positions, retaining only mapped lower-wall detail. Final GLB inspection found the silhouette and entrance composition recognizable in both variants, without visible holes or floating parts. Sculpture, capitals, service roofs, masonry variation and exact illumination remain simplified; the garden photograph obscures much of the lower rear, so rear window placement is a reasoned estimate.

Focused tests pin sourced height, mapped envelope/orientation, facade width, eight free columns, recessed middle entrance and adjacent solid pier, thirteen roof figures, four lower dome contacts, ogival taper, lantern and source/GLB bounds/counts. They run in under a second. The required combined top-cities and landmark test command passed all 116 tests; `node scripts/asset-catalog.mjs` passed (164 entries, 296 GLB variants) on 2026-10-05. `qa-metrics.json` in the dossier reports no issues: no flagged coplanar overlaps, zero back-face hits over 256 rays, no removable bridge-lift bytes, nothing meaningfully below grade.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Provider masking, terrain/pad edges, loaded app lighting, lifecycle/LOD transitions and actual device performance remain for the coordinator's separate integration review. Independent visual review is still required before release; this document records builder inspection.
