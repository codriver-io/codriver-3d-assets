# Estadio Santiago Bernabéu, Madrid

Original texture-free procedural model of Real Madrid’s stadium after the 2019–2024 renovation, Avenida de Concha Espina / Paseo de la Castellana, Madrid. The architectural identity is the continuous silver stainless-steel louvre shell, rounded corners, changing facade curvature and retractable roof. The exported operating state is static and fully open; the neutral inward LED wrap, blue stepped seating bowl and pitch are visible from above. Four older corner access cores are enclosed by the new shell; the generator retains their grounded lower rotundas rather than projecting obsolete external towers through the renovated skin.

## Sources and geographic frame

- [sbp, roof structural engineer](https://www.sbp.de/en/project/santiago-bernabeu-stadium/): stainless-steel louvres, retractable PTFE-coated membrane, stadium dimensions 220 × 240 m, inner roof 75 × 110 m. Its spoke-wheel roof engineering is represented by a closed fixed roof and aperture rather than fabricated exposed cable detail.
- [L35 architects](https://www.l35.com/en/news/l35-news/winning-project-in-the-competition-for-remodelling-santiago-bernabeu-stadium.html): continuous metallic strips of changing curvature and retractable roof. Search result verified the page; direct retrieval returned an internal error during this run.
- [OSM relation 21041481](https://www.openstreetmap.org/relation/21041481), [outer way 1507411898](https://www.openstreetmap.org/way/1507411898): mapped stadium envelope. The relation has outer way 1507411898 and inner pitch way 1446479375. The pitch is leisure geometry, not a provider building. The full outer ring alone suppresses the stadium extrusion; neighbouring blocks, roads and plaza furniture are excluded.
- [Wikipedia identity/history](https://en.wikipedia.org/wiki/Bernab%C3%A9u_(stadium)): late-2024 renovation and retractable-roof stadium, matching the supplied facts dossier. Height is treated as an approximation here rather than a surveyed dimension.
- Current exterior [Estadio Santiago Bernabéu 39](https://commons.wikimedia.org/wiki/File:Estadio_Santiago_Bernab%C3%A9u_39.jpg), west facade, 21 April 2024, Luis García (Zaqarbal), CC BY-SA 4.0; [38](https://commons.wikimedia.org/wiki/File:Estadio_Santiago_Bernab%C3%A9u_38.jpg), same author/licence. Commons description and licence checked. These informed the broad shell, horizontal relief and ground concourse.
- Interior dossier photos: “Estadio Santiago Bernabeu (53988637843)”, Daniel from Glasgow, CC BY 2.0; “2025 NFL Madrid Game 2”, Badefa, CC0. Historical “Estadio Bernabeu. Madrid (12117582503)”, Biblioteca de la Facultad de Empresa y Gestión Pública Universidad de Zaragoza, CC BY-SA 2.0, and “2010 Champions League Final opening ceremony”, Johnny Vulkan, CC BY 2.0, were visible in the dossier sheet but excluded as current exterior evidence.
- Two additional sbp photos were retained only in ignored scratch: `refs/roof-sbp.jpg` (upper shell/roof context) and `refs/aerial-sbp.jpg` (despite the scratch name, this is a corner louvre close-up). Photographer credited by the project page: Marcus Bredt; rights reserved. Neither is shipped or used as a texture.

The dossier’s OSM query returned relation bounds without member geometry. Two requests through the required shared Overpass helper timed out; the permitted single-object OSM API fallback `/api/0.6/relation/21041481/full.json` supplied the complete ring. `tmp/top-cities/santiago-bernabeu/osm-api.json` is the retained extract. The attempted extra building-part query also timed out; no additional detached building part is represented by the relation or original dossier. Confirm provider-part coverage in app review.

Origin is the outer-ring area centroid `[-3.688285777870803,40.45305475547995]`. Real metres, +X east, +Y up, +Z south; y=0 is the rigid local flat grade. The complete curved outline is preserved as literal local coordinates. Example western facade controls `[-3.6896072,40.4533025]` and `[-3.6896277,40.4530233]` establish its slight westward drift toward the south. Pitch controls `[-3.6887284,40.4534894]` and `[-3.6888082,40.4526627]` establish the roughly four-degree pitch-axis skew. Interior orientation is an approximated −0.0688 radian rotation about Y, baked once; exterior stations intersect the exact geographic outline directly. No renderer rotation, terrain height or Mercator stretch is baked into the export.

## Dimensions

| Element | Model/reference | Status |
| --- | --- | --- |
| Stadium main dimensions | 220 × 240 m | Published by sbp; axis interpretation approximate |
| Mapped full envelope | 245.51 × 226.90 m east/south | OSM outer ring, including eastern swelling |
| Authored outer shell | about 240.06 × 221.93 m | Measured exported near bounds, inset inside OSM |
| Height | 60 m | Approximation consistent with renovated massing |
| Inner roof | 75 × 110 m, corner radius 8 m | Dimensions published by sbp; corner radius estimated |
| Ground concourse / shell | 8 m / about 8–58 m | Photo estimates |
| Pitch | 68 × 105 m; surface y=0.3 m | Conventional football pitch; not a surveyed pitch placement |
| Corner access rotundas | four, radius 9 m, visible lower portion to 12 m | Simplified enclosed original cores |
| Bowl | stepped rows from 2 to 45 m | Photo estimate; seats are continuous terrace surfaces |
| Facade rhythm | 44 courses × 76 adaptive perimeter stations near; 44 × 42 far | Intentional geometry simplification |
| Rolled roof rhythm | 18 courses near; 12 far | Estimated continuous metal course pattern |

The shell’s radial section varies with height, and its courses drift slightly in elevation around the perimeter. Silver front folds and dark shadow channels partition the surface without a backing overlay. The recessed concourse keeps separate glazing bays in both LODs. The roof continues the wrap’s course rhythm, closes outward to the last shell course and inward to the aperture, and has an underside. Eight parked membrane folds have skirts embedded into the fixed roof; their exact machinery and travel pose are approximate. The LED fascia is attached directly to the inner roof edge. No loose trusses, cables, walkways or rails are authored, so free-ended-member checks are not applicable; parked fold support includes an aperture negative case in the tests.

Materials use subdued silver/grey metal, charcoal shadow channels, muted blue seating/glazing and green turf. The inward LED fascia is neutral blue by day and luminous cyan at night. Night colours are a stylized palette, not measured photometry. Roof framing, tower interiors, facade panel fasteners, restaurant glazing, branded lettering, stadium logos, advertising and seat instances are omitted. Membrane/glass remain opaque for the shared renderer. All geometry is original; no photo, texture, external mesh, scan or decal is shipped.

## Export and verification

The b10b independent review found two defects: far simplified the continuous
metallic skin into sixteen broad bands, and its corners/roof courses became
angular nested contours. Both LODs now retain forty-four facade courses. Near
keeps folded relief; far partitions a single shallow shell into silver strips
and narrow 8% shadow channels, without a backing overlay. Adaptive perimeter
stations retain mapped changes of direction, plan extrema and aperture corner
tangencies; straight runs use fewer stations. The final station counts are
76 near / 42 far. Far roof courses increase from six to twelve.

To pay for the exterior, far's mostly hidden bowl uses three stepped rows and
sixteen sectors. Position sharing preserves the shallow skin's smooth corner
normals and reduces bytes. Near retains twenty bowl rows and sixty-four sectors.
The open roof, inward LED fascia, four grounded corner rotundas, pitch and
individual glazed concourse bays remain in both LODs. Fold/display support tests
and the deliberately unsupported fold negative case still pass.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 33,874 | 8 | 2,273,412 | 2,220 |
| Far | 11,460 | 8 | 347,164 | 339 |

Before review: near 32,390 / 8 / 2,111.9 KiB; far 6,994 / 8 / 442.7 KiB.
The new far exterior uses more triangles while shared vertices and simpler
interior geometry reduce its size. Both exports meet the building budgets.

Fresh exported GLB sheets are in
`tmp/top-cities/shots/santiago-bernabeu/review-fix-1/`, named
`santiago-bernabeu-glb-{near,far}-{light,dark}-sheet.jpg`. They cover overview,
western facade, eastern/back facade, roof, entrance, louvre detail and top.
`review-fix-reference-comparison.jpg` beside them combines modern exterior
references with revised near/far exports. One look-fix iteration was used.
The day comparison shows fine far facade cadence, narrower dark shares and
smoother roof/corner silhouettes; night retains the neutral inward LED wrap.

Eleven landmark tests pass, including raycast facade closure and a new measured
fine-course/narrow-shadow regression. Requested registry and catalog results
are in `tmp/top-cities/santiago-bernabeu/review-fix-report.md` and
`review-fix-tests.log`. Selected export metrics report no issues: zero layered
faces/coplanar pairs, preserved glazing rhythm and 0.2% near backface hits.
Depth generation and the `--ids` check pass with zero dropped cycle edges.

Cityscape: **not tested for this revision**. Full 3D world: **not tested for this
revision**. The lead recaptures both modes and obtains independent re-review;
these export sheets do not establish updated provider replacement, terrain
contacts or shared runtime shading. Footprint/OSM ownership is unchanged because
review identified no provider overlap. Slat pitch, shell curvature, bowl,
branding omissions and parked roof machinery remain approximations. No runtime
bundle, app server, git write or deployment was performed.

Final requested combined registry/landmark run: **644/644 passed**; catalog
validation passed **336 entries / 656 GLB variants**, and `pnpm assets:preview`
generated the ignored local catalog successfully.
