# Pineapple Fountain, Charleston

Original procedural model of the 1990 Pineapple Fountain in Waterfront Park. It is the tiered sculptural fountain beside the City Gallery, distinct from the park’s separate northern splash fountain. [City photo gallery](https://www.charleston-sc.gov/gallery.aspx?PID=70) corroborates the pineapple body, curled crown and scalloped tiers; [Library of Congress photo 2017879904](https://www.loc.gov/item/2017879904/) identifies completion in 1990 and provides a clear frontal image.

## Sources and dimensions

| Feature | Model metres | Basis |
| --- | ---: | --- |
| Basin diameter | 10.56 | Sourced from mapped OSM basin ring 1356302855 |
| Overall sculpture / representative plume | approximately 4 | Estimated from photographs and unsurveyed OSM 4 m height tag |
| Lower bowl rim | 6.5 diameter at y=.95 | Estimated photographic proportions |
| Upper bowl rim | 4.24 diameter at y=1.95 | Estimated |
| Pineapple shoulder | 1.88 diameter at y=2.68 | Estimated |
| Crown | y=2.98–4.025 | Estimated curved leaf silhouettes, includes 2.5 cm solid thickness |
| Basin rim / water | .34 / .14 | Estimated above local pavement |

Mapped ring fetched through OSM 0.6 map API, 2026-11-09. Geographic data © OpenStreetMap contributors, ODbL 1.0. No primary surveyed construction dimensions were found; vertical values and tier dimensions are explicitly estimates.

Commons references: [east-facing fountain](https://commons.wikimedia.org/wiki/File:Charleston-SC-pineapple-fountain.jpg) and [west-facing fountain with City Gallery](https://commons.wikimedia.org/wiki/File:Charleston-Waterfront-Park-pineapple-fountain-back.jpg), JonathanLamb, both **CC BY 3.0**. Each file page’s licence and Charleston identity were checked. The first photo was obtained from its credited [Preservation in Mississippi mirror](https://misspreservation.com/2019/04/01/how-madisonia-came-to-windsor/) after Wikimedia rate limiting; second download was rate limited. City and Library of Congress photographs provide independent frontal/detail comparison. No reference photo is committed or used as a texture.

## Frame and foundation

Origin `[-79.925191,32.778087]`; real metres +X east/+Y up/+Z south, y=0 at outside basin foot. The basin is nearly circular: mapped east control `[-79.9251359,32.7780974]` and west control `[-79.9252476,32.7780863]` locate it, with north edge `[-79.9251931,32.7781348]`. No surveyed front is claimed for the radial sculpture; its nominal inspection front faces east, and zero additional rotation is needed. No terrain, sea-level datum or Mercator scale is baked in.

Only amenity way 1356302855 is owned, with its exact ring in footprint.js. This is a fountain basin, not permission to replace City Gallery or the park. The structure uses one rigid bounded median foundation ring with three perimeter controls and 1 m feather as handoff metadata. Basin floor/vertical contact, water datum and surrounding paving need independent host verification; no generic contextual park slab is exported.

## Procedural model

Two broad bowls have integrally scalloped rim silhouettes, supported by one grounded central stem. A tapered pineapple body carries original diamond skin plaques and three rings of curled, pointed leaves. The crown is actual closed geometry in both LODs. A small central plume and separate falling streams suggest one low-water operating phase while preserving negative space under the tiers. Upper streams meet the lower bowl; lower streams end at the basin water. The static flow is a stylization, not a simulation.

Far retains both bowls, all crown leaf groups, the pineapple volume and basin, reducing radial samples, plaques and streams. Five merged material draws: muted tan basin, warm bronze, dark patina pale subdued falling water and a separate darker basin pool. Fine plumbing, fine aggregate, exact sculpture carving, changing water curtains, landscaping, nearby harbour and park paths are omitted. No logo, text, texture, scan or imported mesh is included. Rebuild with `node scripts/build-top-cities-landmarks.mjs pineapple-fountain-charleston`; shared meshopt/quantization export only.

Cityscape: **not tested**. Full 3D world: **not tested**. Standalone appearance is not integration or hardware performance evidence.

## Export costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 8456 | 5 | 108088 |
| far | 2920 | 5 | 45888 |

Final report `tmp/charleston-3/fountain-metrics.json`: no flags; no back-face hits, layered/coplanar faces, below-grade or unsupported-member findings. Two visual rounds inspected against the credited Commons mirror and the LOC frontal image; final exported contact sheet `tmp/charleston-3/sheets/final/pineapple-fountain-charleston.jpg`. Final fix narrows the pineapple shoulder to the reference ratio, darkens the bronze and partitions the pool from pale falling streams. Both bowl tiers, leaf groups and distinct radial silhouette survive far. Very fine falling-water curtains remain deliberately sparse; no animated flow is claimed. Independent coordinator review pending.

