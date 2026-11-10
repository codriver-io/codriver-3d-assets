# Pineapple Fountain, Charleston

Original procedural model of the 1990 Pineapple Fountain in Waterfront Park. It is the tiered sculptural fountain beside the City Gallery, distinct from the park’s separate northern splash fountain. [City photo gallery](https://www.charleston-sc.gov/gallery.aspx?PID=70) corroborates the pineapple body, curled crown and scalloped tiers; [Library of Congress photo 2017879904](https://www.loc.gov/item/2017879904/) identifies completion in 1990 and provides a clear frontal image.

## Sources and dimensions

| Feature | Model metres | Basis |
| --- | ---: | --- |
| Basin diameter | 10.56 | Sourced from mapped OSM basin ring 1356302855 |
| Leaf crown top / height above basin water | 5.14 / 5.00 | Revised photographic estimate; the unsurveyed OSM 4 m tag is not adopted |
| Lower bowl rim | 6.5 diameter at y=1.10 | Estimated photographic proportions; lip reaches 1.28 |
| Upper bowl rim | 4.24 diameter at y=2.00 | Estimated; lip reaches 2.18 |
| Ovoid pineapple body | approximately 2.0 wide × 1.78 high, y=2.16–3.94 | Estimated from the Commons reference scaled to the estimated 6.5 m lower bowl; body extends 1.76 m above the upper lip |
| Leaf crown | roots y=3.82–3.90, top 5.14 | Estimated about 1.2 m rise above the fruit; includes 2.5 cm solid thickness |
| Basin rim / water | .34 / .14 | Estimated above local pavement |

Mapped ring fetched through OSM 0.6 map API, 2026-11-09. Geographic data © OpenStreetMap contributors, ODbL 1.0. No primary surveyed construction dimensions were found; vertical values and tier dimensions are explicitly estimates. The earlier 4 m overall estimate adopted the unsurveyed OSM tag and compressed the fruit/crown. The revised approximately 5 m height above water follows the reference silhouette; the disagreement is retained here rather than treating either value as a survey.

Commons references: [east-facing fountain](https://commons.wikimedia.org/wiki/File:Charleston-SC-pineapple-fountain.jpg) and [west-facing fountain with City Gallery](https://commons.wikimedia.org/wiki/File:Charleston-Waterfront-Park-pineapple-fountain-back.jpg), JonathanLamb, both **CC BY 3.0**. Each file page’s licence and Charleston identity were checked. The first photo was obtained from its credited [Preservation in Mississippi mirror](https://misspreservation.com/2019/04/01/how-madisonia-came-to-windsor/) after Wikimedia rate limiting; second download was rate limited. City and Library of Congress photographs provide independent frontal/detail comparison. No reference photo is committed or used as a texture.

## Frame and foundation

Origin `[-79.925191,32.778087]`; real metres +X east/+Y up/+Z south, y=0 at outside basin foot. The basin is nearly circular: mapped east control `[-79.9251359,32.7780974]` and west control `[-79.9252476,32.7780863]` locate it, with north edge `[-79.9251931,32.7781348]`. No surveyed front is claimed for the radial sculpture; its nominal inspection front faces east, and zero additional rotation is needed. No terrain, sea-level datum or Mercator scale is baked in.

Only amenity way 1356302855 is owned, with its exact ring in footprint.js. This is a fountain basin, not permission to replace City Gallery or the park. The structure uses one rigid bounded median foundation ring with three perimeter controls and 1 m feather as handoff metadata. Basin floor/vertical contact, water datum and surrounding paving need independent host verification; no generic contextual park slab is exported.

## Procedural model

Two broad bowls have integrally scalloped rim silhouettes, supported by one grounded central stem. A full ovoid pineapple body stands above the upper bowl, with a height/width ratio about 0.89. Its raised diamond facets form the actual closed skin, partitioned between two muted bronze tones; there is no underlying lathe or stacked plaque surface. Three rings of curled, pointed leaves rise from the fruit neck. The crown is actual closed geometry in both LODs. A small central plume and separate falling streams suggest one low-water operating phase while preserving negative space under the tiers. Upper streams meet the lower bowl; lower streams end at the basin water. The static flow is a stylization, not a simulation.

Far retains both bowls, all crown leaf groups, the pineapple volume and basin, reducing radial samples, diamond cells and streams. Six merged material draws: muted tan basin, bronze, lighter fruit facets, dark patina, pale falling water and a darker basin pool. Fine plumbing, fine aggregate, exact sculpture carving, changing water curtains, landscaping, nearby harbour and park paths are omitted. No logo, text, texture, scan or imported mesh is included. Rebuild with `node scripts/build-top-cities-landmarks.mjs pineapple-fountain-charleston`; shared meshopt/quantization export only.

Cityscape: **not tested**. Full 3D world: **not tested**. Standalone appearance is not integration or hardware performance evidence.

## Export costs and evidence

The three other Charleston assets are approved and unchanged by this revision.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 8552 | 6 | 118444 |
| far | 2872 | 6 | 49716 |

`tmp/charleston-3/fountain-review-r1-metrics.json`: no remaining flags, zero back-face hits and no layered/coplanar faces. Both LODs remain below the review targets of approximately 10k / 3.5k triangles. The one review-round contact sheet is `tmp/charleston-3/sheets/review-r1/pineapple-fountain-charleston.jpg`.


## Coordinator review correction, round 1

The first delivery compressed the fruit into a low cup beneath the crown. This correction raises and enlarges the ovoid to approximately 2 m wide × 1.78 m high, places it at y=2.16–3.94, and raises the crown to 5.14 m above pavement / 5 m above the basin water. Bowl rim levels are re-estimated at 1.10 and 2.00 m. All these values remain photographic estimates, scaled against the estimated 6.5 m lower bowl width in JonathanLamb’s reference.

Diamond relief now tessellates the complete fruit surface in both LODs, with shallow raised centres and disjoint colour-separated faces. Near has 180 complete diamonds plus boundary half cells; far retains 60 complete diamonds plus boundary half cells. The lower foot and upper neck are closed. The stem reaches the fruit foot, leaf roots embed in the neck, and falling streams have been adjusted to the revised bowl/fruit levels. Sparse water leaves the identifying body visible from every side.

One new exported contact sheet was inspected against the full reference: `tmp/charleston-3/sheets/review-r1/pineapple-fountain-charleston.jpg`. Padded scratch bounds keep the full silhouette, basin and crown visible. Near and far both show a separate tall diamond-patterned fruit; this is awaiting coordinator re-review. No further visual round was used for this correction.

Focused regression tests in `pineapple.test.mjs` inspect both source and exported near/far geometry: ovoid width, height/width ratio, clearance above the upper lip, crown height above water, the requested triangle limits, and horizontal fruit intersections at three heights from sixteen bearings. Source seam vertices require off-edge ray bearings to avoid floating-point exact-edge ambiguity; all 192 final source/export ray samples pass.

Cityscape: **not tested**. Full 3D world: **not tested**. The correction does not establish integration or device performance.
