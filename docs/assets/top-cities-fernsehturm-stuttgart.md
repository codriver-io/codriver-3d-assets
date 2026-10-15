# Fernsehturm Stuttgart

Original procedural asset `fernsehturm-stuttgart`, Jahnstraße 120, Stuttgart, Germany, on the Hoher Bopser. Fritz Leonhardt and Erwin Heinle's 1956 concrete television tower, in its permanent modern form with extended antenna; temporary restoration scaffolding is excluded. Source is `src/peregrine/landmarks/top-cities/fernsehturm-stuttgart/`; reproduce with `pnpm build:top-cities-landmarks fernsehturm-stuttgart --no-check`.

## Facts and sources

The [structural engineer LAP](https://www.lap-consult.com/projekte/detail/fernsehturm-stuttgart) records a 217 m mast tip, 15 m maximum cabin diameter and 12 m cabin height, with its four enclosed storeys between 138 and 150 m. The [SWR construction history](https://www.fernsehturm-stuttgart.de/en/swr-tv-tower/building-construction) explains the parabolic concrete shaft, twin observation levels, aluminium cladding and square lattice antenna. References checked 2026-10-15; the dossier's Wikipedia facts fetch failed, so primary sources were used.

| Feature | Model | Evidence / precision |
| --- | --- | --- |
| Overall height | 217 m | SWR/LAP nominal height; some sources give 216.61 m |
| Shaft diameter | 10.80 m at grade; 5.04 m at basket | SWR published |
| Basket | 15 m diameter; 138–150 m | LAP published |
| Lower / upper deck | 150 / 153 m; radii 7 / 4.6 m | SWR lower deck level; upper level and radii photo/OSM estimates |
| Concrete head | through 161 m, radius 3 m tapering above 157.5 m | OSM part height; silhouette estimated |
| Antenna | lower square 1.90 m × 32 m, upper 1.29 m × 19 m; tip extension to 217 m | SWR section dimensions; simplified bay geometry |
| Shaft curve | radius 2.52 + 2.88 × (1 − y/138)^1.75 | photo-fitted approximation of the sourced parabolic profile |
| Windows | four rows; 64 bays near, 32 far | floor count sourced; bay spacing, band heights and glazing tones estimated |

No external mesh, traced mesh, photograph or texture is included in the runtime asset. Commons comparison photographs are retained only in ignored `tmp/top-cities/fernsehturm-stuttgart/refs/`: *Stuttgarter Fernsehturm6.jpg*, Taxiarchos228, Free Art Licence; *StuttgartTVTowerObservationDeck.jpg*, Pjt56, CC BY-SA 4.0; *Stuttgart TV tower at night.jpg*, pjt56, CC BY 3.0; *Fernsehturm Stuttgart and Full Moon Summer 2013 06.jpg*, Julian Herzog, CC BY 4.0. Full file-description links and provenance are in the catalog record; the unrelated plaque photo was not used for dimensions or geometry.

## Frame, ownership and rigid placement

Origin `[9.1901683034, 48.7557595897]` is the mean centre of mapped basket way 203951590. +X east, +Y up, +Z south, metres; y=0 is local tower grade. No hill, sea-level elevation or latitude stretch is baked into geometry. Mapped OSM geometry is the supplied dossier extract, © OpenStreetMap contributors, ODbL 1.0.

The tower outline 203951586 and all five tower building parts 203951587/588/589/590 and 1349543682 are individually registered. The published basket is marginally wider than the approximately 14.7 m mapped polygon: containment uses a 0.30 m survey tolerance, below the provider ownership slack. Neighbouring offices 796362885 and 23713502 and the attached ground-level entrance pavilion 203951634 remain provider-owned and are not rebuilt or masked. The structural base is the shaft itself, rather than an invented podium.

Two mapped pavilion controls `[9.1901934,48.7559323]` and `[9.1904529,48.7560482]` lie on its principal diagonal frontage direction (about 56°). `frontageBearing: 146` records the perpendicular approach direction. The tower's circular shaft/cabin need no plan rotation; the square mast's north/south alignment and radio dish bearings are estimated, not a surveyed antenna orientation. No host rotation is needed.

The declared `terrainPad` is a 12 m radius bounded rigid ring with five central footing references, median datum and 10 m feather. This requests a level table around the tower without flattening the whole forest hill. Coverage of resident terrain lattice nodes, provider replacement and footing residuals await the separate application integration check.

## Geometry and materials

All geometry is original Three.js procedural work, using `assetBuilder` for one merged mesh per material. The shaft is a sampled concave surface of revolution; the basket is partitioned edge-to-edge into four glass rows, individual bays/mullions, opaque aluminium spandrels and rounded soffit/roof profiles. There is no opaque cylinder behind glazing and no stacked coplanar window overlays. The open observation space, upper deck guardrail and square mast lattice survive far LOD. Mast diagonal endpoints attach to named continuous corner chords; chords terminate at the concrete head, transition plate and upper cap. Every deck post touches its deck and continuous closed top rail.

Seven palette materials: warm grey `concrete`, pale `aluminium`, dark mullion/soffit `dark`, subdued `steel`, aviation `red`, `glow` glazing (dark blue-grey by day, warm yellow at night), and a red tip `light`. Windows and beacon use the shared self-lit material naming convention. Far halves angular segments and lattice bay density while keeping four separate rows and identical overall bounds. No textures, decoders or app-runtime imports.

Approximations: no interiors, exact rivets, feeder cables, aviation lights down the shaft, forest, furniture, foundation excavation or pavilion. Dish shapes and shaft taper are estimated. The night palette approximates warm cabin illumination; it does not reproduce the full lighting installation. The nominal 217 m height intentionally follows SWR/LAP.

## Verification and evidence

Looked at the dossier reference sheet and whole-tower photo, then procedural near light sheet showing overview, opposite/back, above, cabin, base and antenna. The first authored shape retained the source proportions and required no visual correction. The named-support test initially encountered degenerate pole triangles in a closed lathe cap; skipping zero-area triangles corrected the distance calculation, without changing geometry.

Judged exported GLBs against day/night reference photos in `tmp/top-cities/shots/fernsehturm-stuttgart/final-reference-export-sheet.jpg`: near and far overview/cabin/roof/antenna in light, overview/cabin/roof in dark, plus straight-down plan and base. Also inspected exported `facade` and `back` in `fernsehturm-stuttgart-glb-near-light-sheet.jpg`, and the procedural back view in `fernsehturm-stuttgart-procedural-near-light-sheet.jpg`. Export sheets are `fernsehturm-stuttgart-glb-{near,far}-{light,dark}-sheet.jpg`; individual PNGs use the same prefix and view suffix. Comparison preserves the slim shaft, short widening basket, four horizontal window rows, smaller upper observation platform and slender lattice. Grid/red rings are inspection aids only.

Focused landmark tests pass: height, diameters/taper, glass rows by outward raycast, observation/lattice negative space, every beam/post endpoint against its named support (including a deliberately shortened failing endpoint), mapped ownership, LOD envelope, and GLB metrics/material/normal round trip. Deterministic `qa-metrics.json` reports zero coplanar/layered faces, zero backface ray hits, no budget or window-rhythm issues. Depth regeneration reports zero cycle edges dropped; generated table check passes.

| Exported default scene | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 11,224 | 7 | 383,884 | 374.9 |
| Far | 4,520 | 7 | 178,636 | 174.4 |

| Application mode | Status |
| --- | --- |
| Cityscape | Not tested yet, integration is checked separately |
| Full 3D world | Not tested yet, integration is checked separately |

Independent review and unobstructed application shots in both modes belong to the lead's handoff; inspector rendering does not certify terrain, shared app shading, lifecycle or provider replacement. Actual device performance is not measured.

Final shared-check result: all seven landmark tests and all three Fernsehturm conformance checks pass; combined run was 835/836 passing, with only another builder's `bromo-seltzer-tower` catalog-ready mismatch. Repository-wide catalog validation and `pnpm assets:preview` were attempted repeatedly and stopped on another builder's missing `docs/3d-top-cities-gare-de-lyon-clock-tower.md`. An isolated root containing this record, its source/document and both exports passed the exact `loadAssetCatalog` validator (one asset, two variants). No other landmark was modified to resolve these transient shared failures.
