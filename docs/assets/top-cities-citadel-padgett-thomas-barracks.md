# Padgett-Thomas Barracks, The Citadel, Charleston

Original procedural model of the **2004 replacement**. The owner confirms that the 1922 barracks was demolished in 2001; this is not a reconstruction of that original. The architectural centerpiece is the white central tower over the east sally port. The model includes this barracks only, excluding Law/Murray Barracks, parade ground, monuments and adjacent buildings.

## Sources and dimensions

- [The Citadel owner: current 2004 barracks and 109 ft / eight-storey tower](https://www.citadel.edu/our-campus/2023/05/padgett-thomas-barracks/)
- [The Citadel brand encyclopedia: replacement building identity](https://brand.citadel.edu/encyclopedia/padgett-thomas-barracks/)
- [OSM multipolygon 6897174](https://www.openstreetmap.org/relation/6897174)
- [PT Barracks · CocoaBeachBoy, 2007 (public domain)](https://commons.wikimedia.org/wiki/File:PT_Barracks.JPG)
- [Inside PT Barracks · CocoaBeachBoy, 2007 (public domain)](https://commons.wikimedia.org/wiki/File:Inside_PT_Barracks.jpg)

| Feature | Dimension | Basis |
| --- | ---: | --- |
| Central tower | 109 ft / 33.2232 m | Sourced: The Citadel, eight stories; height excludes flagpole |
| Outer mapped envelope | about 98.6 × 67.0 m | Sourced: OSM outer ring including round turret projections |
| Main wing rectangle | 92.6 × 62.6 m | Estimated simplification within mapped envelope |
| Courtyard | about 75.8 × 42.2 m mapped, 72.6 × 42.6 m authored arcade opening | Sourced mapped controls; estimated regularized gallery plan |
| Wing roof / parapet / crenels | 14.6 / 15.2 / 15.75 m | Estimated from four-storey exterior and photos |
| Corner staircase turret crown | 17 m | Estimated from photo relative to wing |
| Central tower width / projection | 11.4 m / 2.7 m | Estimated, constrained by mapped east tower projection |
| Sally port clear width / crown | 4.6 m / 5.0 m | Estimated arch; genuine passage in both LODs |
| Gallery floor levels | 3.65, 7.3, 10.95 m | Estimated; ground trabeated gallery and three arched tiers |

The exterior photo was taken in October 2007, after the replacement opened: central tower, four-storey wings and Summerall Field match the owner description. The courtyard image is verified by the same tall tower behind the four-level open galleries and red/cream checker paving. Each Commons file page explicitly releases CocoaBeachBoy's work to the public domain. They are linked and kept only in ignored local scratch, never in the model or repository.

## Geographic frame and foundation

Origin `[-79.961352,32.796970]`; real metres, +X east / +Y up / +Z south. OSM relation **6897174** owns outer **38733112** and inner courtyard **38733113**. Two mapped controls on the parade side, `[-79.9608825,32.7967643]` and `[-79.9612316,32.797405]`, establish the roughly 335.4° long facade axis and east-facing normal 65.4°. That rotation is baked once into all geometry. The source rings retain detailed round stair towers while authored long walls regularize the small mapper irregularities.

Local `y=0` is the rigid quadrangle paving/exterior footing plane. The checker courtyard floor is a structural paving surface inside the building, not a terrain or landscape pad. The center remains open to the sky. No absolute elevation, DEM, runtime sea-level offset, Mercator scaling or terrain deformation is present. A host must choose a rigid datum or a bounded pad for the barracks; it must retain the inner ring as an opening and preserve all adjacent barracks/provider geometry.

## Geometry, LOD and approximations

Four wings have individually tiled outer window grids, recessed room doors behind the courtyard arcade, continuous gallery floors with soffits, connected piers and curved arch intrados. The east sally port remains a full passage through the tower/wing thickness. The square tower retains triple slit windows, a clock disc, roof and crenellations; a cylindrical mounting connects the clock to the wall. Round corner stair turrets and all parapet crenels remain in far. The repeated arches, white mass and tall tower carry recognition without a logo or lettering.

Far reduces curve segmentation, groups neighboring arcade/window bays into a coarser grid and coarsens courtyard checker squares, retaining all four facade/gallery rows, the quadrangle and the sally port. Interiors, spiral stair detail, water tank, doors beyond their recesses, flag/flagpole, coats of arms, lettering, drainage, decorative clock markings and courtyard people are omitted. The paving colors and gallery proportions are photographic estimates, not a measured conservation survey. No third-party mesh, scan, photo or texture ships.

## Costs and evidence

near: 34,082 triangles / 5 draws / 562,872 bytes; far: 10,616 triangles / 5 draws / 180,580 bytes. No remaining qa-metrics flags. Final contact sheet: `tmp/landmark-qa/sheets/citadel-padgett-thomas-barracks.jpg`; metrics: `tmp/chs4/citadel-metrics.json`; `--bounds tmp/chs4/citadel-framing.json` provides the full silhouette in the oblique evidence tiles. Export: `node scripts/build-top-cities-landmarks.mjs citadel-padgett-thomas-barracks` uses shared meshopt compression and quantization. QA checks exported near/far bounds, budgets, hidden/layered faces, back faces, window rhythm and member contacts; the final sheet provides overview/opposite/roof/street and far views. Static browser verification is separate from any driving application.

**Cityscape: not tested / Full 3D world: not tested.** No application is present. Separate contributor/product permission remains a human maintainer check; no agent signature or acceptance is claimed.
