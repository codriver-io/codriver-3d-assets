# Mercedes-Benz Museum — Stuttgart

Original procedural model of UNStudio's museum at Mercedesstraße 100, completed/opened in 2006, not the adjacent Mercedes-Benz sales centre. The smooth rounded trefoil, three deep glazing ribbons between aluminium bands, diagonal glazing supports, triangular atrium and small roof star are retained in both LODs. Source is MIT; original model is CC BY 4.0; mapped data is © OpenStreetMap contributors, ODbL 1.0. No photographs, textures or third-party meshes ship.

## Sources and dimensions

- [UNStudio project](https://www.unstudio.com/projects/mercedes-benz-museum/): 2001–2006, three overlapping circles, interlocking ramps and trefoil organisation; official exterior photo used as a reference only, all rights retained by its owner.
- [Mercedes-Benz Group](https://group.mercedes-benz.com/company/tradition/museums-historical-sites/mercedes-benz-museum.html): opened 19 May 2006, nine exhibition levels and 16,500 m² of exhibitions, double helix.
- [OSM relation 14292942](https://www.openstreetmap.org/relation/14292942): 47.5 m height, eight mapped building levels, metal material and museum outline. Nine exhibition levels and eight OSM building levels are different descriptions, not additional exterior window rows.
- [Mercedes-Benz Welt pan](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Welt_pan.jpg), pjt56, CC BY 3.0: museum is on the left; dealership on the right.
- [Museum 201312 08 blue hour](https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Museum_201312_08_blue_hour.jpg), Julian Herzog, CC BY 4.0: nighttime ribbons and diagonal supports.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Museum roof/body height | 47.5 m | OSM height tag; primary brand material describes almost 50 m |
| Replacement outline area | approximately 4,853 m² | Computed from mapped OSM outer ring |
| Body geographic bounds | approximately 80.0 × 82.8 m | Mapped envelope with 1.1% inset |
| Atrium roof area | approximately 567 m² | Roof part way 1073598797 |
| Highest model point | 51.575 m near / 51.551 m far | Estimated 3 m emblem and short mast above roof; not a surveyed height |
| Exterior glazing zones | 3 | Photograph-based, includes lobby |
| Glazing recess | approximately 1–1.5 m | Visual estimate |
| Ribbon variation | ±3.75 m | Visual approximation of curved rising/falling exterior bands |

## Geographic frame and ownership

Origin `[9.233926358218074, 48.788176077973155]` is the outer-ring area centroid. The dossier/Wikipedia coordinate `[9.23376, 48.78855]` was at the northern edge, about 43 m away, and is not the model origin. Units are real metres, X east / Y up / Z south; y=0 is rigid local grade. Geographic rotation is already baked into spline control points, with no host rotation. Control points `[9.2345435,48.788147]` at the east corner and `[9.2337844,48.7885717]` at the north corner pin the orientation. Approximate southwest frontage bearing is 239°.

Provider ownership covers relation 14292942's four outer member ways: **1073566079, 19384901, 1073566078, 1073290468**, and the central atrium roof part **1073598797**. The outer ways are joined in order into one ring; the skylight gets its own ring. The original dossier omitted relation geometry; the shared Overpass helper failed with HTTP 500, so one public OSM relation/full API call supplied the missing nodes. No raw Overpass calls were used. Detached parking rooflets, steps to other campus structures and neighbouring P4/dealership are outside model ownership. Underground plaza relation 14292941 spans the wider campus, but its museum-side boundary ways 1073566079 and 19384901 are already included in the museum envelope; the remaining campus members are deliberately excluded.

## Modelling decisions and limits

A centripetal spline smooths the original mapped three-leaf outline. Curved vertical surfaces alternate aluminium and recessed glazing. Full-height dark glazing slabs are avoided: each glazed ribbon is split into diagonal pane bays and multiple vertical subdivisions, including far. Frames and panel seams partition the facade skin instead of being placed over another face; recessed soffits close the skin between glass and silver bands. Near uses 192 edge samples and 72 glazed bays; far uses 64 edge samples and 36 bays, preserving all three bands and the central triangular skylight. The atrium glass is one metre below the roof, with actual reveal walls.

Subdued aluminium, blue-grey daylight glazing, darker night metal and warm self-lit night glazing are named materials. The roof star is deliberately small, secondary and an estimated depiction requested in the brief. The giant star in dossier photo 1 belongs to the dealership and was excluded as a museum reference. Exact interior ramps, exhibitions/cars, individual fabricated window shapes, external campus terraces and engineering details are omitted. Surface ribbons express the helix; this is not an interior architectural model. Glass is opaque, texture-free architectural geometry.

## Export and verification

Build: `pnpm build:top-cities-landmarks mercedes-benz-museum --no-check`.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 8,444 | 6 | 638,764 | 623.8 |
| far | 2,236 | 5 | 170,340 | 166.3 |

These are measured default-scene export costs, not hardware timing. Far/near bounds differ by less than 3 cm.

Evidence lives under ignored `tmp/top-cities/shots/mercedes-benz-museum/`. The initial procedural six-view sheet shows southwest facade, opposite facade, roof, north-up plan and close glazing. It led to wider diagonal mullions and larger slant offsets before export. Judged final images:

- `tmp/top-cities/shots/mercedes-benz-museum/final/reference-comparison.jpg`: official daytime exterior, Commons nighttime photo and campus panorama beside exported near/far facades, roof, rear and close glazing; curves, relative band heights and stronger diagonal frames read consistently.
- `tmp/top-cities/shots/mercedes-benz-museum/final/all-lods-themes.jpg`: all six views of both exported LODs in light/dark, assembled from `mercedes-benz-museum-glb-{near,far}-{light,dark}-sheet.jpg`; inspected overview, southwest facade, rear, roof, detail and north-up plan in every variant.
- `tmp/top-cities/shots/mercedes-benz-museum/final/mercedes-benz-museum-glb-far-dark-sheet.jpg`: also inspected separately for coarser glazing bays, illuminated atrium and silhouette.
- `tmp/top-cities/shots/mercedes-benz-museum/initial/mercedes-benz-museum-procedural-near-light-sheet.jpg`: first-pass source comparison, before mullion strengthening.

The source/GLB round trip retains geometry bounds and named materials. The upper roof remains flat as tagged in OSM, while ribbon edges undulate. Glazing opacity and lack of interior displays are explicit simplifications; no visible holes, inverted faces or hovering supports were found.

Landmark tests pin mapped area/orientation and ownership, body height, footprint containment of every vertex, no below-grade geometry, raycasts through all three glass and silver ribbons around every facade, recessed atrium, star/mast supports with shortened-member negative cases, and far silhouette/cost preservation. The ten dedicated tests pass, and the museum's three registry conformance tests pass independently with `--test-name-pattern=mercedes-benz-museum`. The requested combined test command ran 403 tests: 402 passed, with the sole failure on another worker's Notre-Dame de la Garde near model (88,716 triangles versus the 60,000 cap). Museum source, exported GLB and catalog assertions all passed. No full test suite or application server was run by this builder.

`node scripts/landmark-depth-layers.mjs --ids mercedes-benz-museum` generated the allowed shared depth entry; its `--check` passes and the cycle report contains zero dropped edges. `tmp/top-cities/mercedes-benz-museum/metrics.json` records clean budgets, zero coplanar overlaps, zero layered faces, 0% back-face hits and no removable attributes or far window flags. The global catalog check was retried: first it encountered AT&T Stadium exports not yet registered, then `docs/3d-top-cities-att-stadium.md` missing from that worker's in-progress record. No unrelated files were changed. Global asset-preview/catalog rebuild and both-mode app verification remain lead-owned, as the brief prohibits shared preview/server work.

| Integration gate | Status |
| --- | --- |
| Cityscape | Not tested yet; integration is checked separately by lead |
| Full 3D world / topography | Not tested yet; integration is checked separately by lead |
| Provider masking, shared app shading and terrain pad edge | Not tested |
| Independent reviewer | Pending |

A rigid foundation is authored at zero. The site's terrain datum, provider replacement, late loads, mode changes and hardware performance require separate application verification; local model sheets do not certify them.

## Independent review fixes — 2026-10-12

Review b2b shows a white provider slab burying the lowest glass ribbon in both app modes, with dark slivers along the world base. The OSM relation/full response is retained at `tmp/top-cities/mercedes-benz-museum/plaza-api.json`: underground relation 14292941 has `layer=-1`, `building:min_level=-1`, one underground level, and a footprint extending from longitude 9.2308221 to 9.2345435 and latitude 48.7865244 to 48.7886018. Only boundary ways **1073566079 and 19384901** lie wholly on the museum envelope, and both were already in `OSM_WAYS`. Adding the full relation or the other campus ways would incorrectly claim the surrounding plaza and is deliberately avoided. No new ownership rings were added.

The rigid local footing remains y=0. `SPEC.terrainPad` now explicitly follows the museum perimeter, samples eleven perimeter reference points, uses the **median** datum rather than the lowest sample, and feathers by 6 m. The runtime lattice-pad expansion supplies the resident-grid halo. A dedicated test pins the bounded pad and verifies that three points on the wider underground campus remain unowned. This improves datum stability without broad campus flattening; actual footing residuals and entrance continuity still require the lead's Full 3D world recapture.

The shared building mask keeps a provider triangle whenever any vertex lies outside the ownership envelope. This worker does **not** certify that the slab is removed. Preserve campus paving and suppress the erroneous above-grade underground extrusion in the shared renderer before closing the finding.

The exported comparison sheet `tmp/top-cities/shots/mercedes-benz-museum/review-fix/mercedes-benz-museum-glb-near-light-sheet.jpg` was inspected: smooth trefoil banding, three glazing ribbons down to local grade, recessed atrium and supported roof star remain intact. The geometry and costs are unchanged: near 8,444 triangles / 6 draws / 623.8 KiB, far 2,236 / 5 / 166.3 KiB. Eleven dedicated museum tests, eight stadium tests and all 399 registry tests pass; catalog validation and both depth checks pass with zero material cycles. Cityscape and Full 3D world remain **not tested** for the revised provider/pad integration; lead app captures and independent re-review remain required.
