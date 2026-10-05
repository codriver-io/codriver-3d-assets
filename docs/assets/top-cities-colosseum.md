# Colosseum, Rome

Landmark `colosseum` models the standing ruin at Piazza del Colosseo, not the restored ancient amphitheatre. The northern external travertine wall retains three open arcade orders and the attic; the southern external wall has been lost, exposing the smaller inner facade and broken cavea. The elliptical arena is open to the hypogeum. Modern visitor walkways, partial reconstructed arena floor, scaffolding and the adjacent Arch of Constantine are omitted.

## Sources and frame

[Platner and Ashby, *A Topographical Dictionary of Ancient Rome* (1929), Amphitheatrum Flavium](https://penelope.uchicago.edu/Thayer/E/Gazetteer/Places/Europe/Italy/Lazio/Roma/Rome/_Texts/PLATOP*/Amphitheatrum_Flavium.html) provides the 188 × 156 m original external ellipse, 48.50 m outer wall, 86 × 54 m arena, eighty bays, three arcade orders, alternating attic windows, engaged columns, and velarium corbels. This survey is a dimensional reference, not evidence that the modern ruined wall is a complete ellipse.

[OSM relation 1834818](https://www.openstreetmap.org/relation/1834818) was retrieved through the shared Overpass helper on 2026-10-04. Its outer ways are 136190591, 136190592, 136190595 and 994907267. These ways are tagged as fences individually, but together form the building multipolygon: they are not an unrelated smaller fence. `FOOTPRINTS` preserves their chained coordinates. The southern edge follows the smaller surviving inner wall. Adjacent ruins and the Arch of Constantine remain provider-owned.

A least-squares ellipse fit to the intact northern arc gives radii 93.854 and 78.099 m, center (-3.908, +7.564) m relative to the dossier’s vertex-mean origin, and major-axis bearing 105.544°. The model uses the published radii 94/78 m, the fitted center `[12.49229914, 41.89019898]`, and bearing 106° baked into geometry. Mapped controls on the intact northern arc and the east-end return determine that fit; coordinates are recorded below. Metres, +X east / +Y up / +Z south; local y=0 is flat plaza grade. No altitude, terrain stretch or terrain surface is baked into exports. Stylobate overhang and OSM fitting residuals are bounded by a 5.1 m tolerance in the landmark test; replacement itself uses the actual OSM ring, not an enlarged envelope.

Reference photographs were read together in `tmp/top-cities/colosseum/refs-sheet.jpg`: **Colosseo 2020.jpg** — FeaturedPics, CC BY-SA 4.0; **Colosseum, Rome.jpg** and **Colosseum, Eastern Interior.jpg** — Julian Lupyan, CC0; **Colosseum and Arch of Constantine seen from Palatine.jpg** — Livioandronico2013, CC BY-SA 4.0; **Colosseum under renovation in Rome, Italy (Ank Kumar) 03.jpg** — Ank kumar, CC BY-SA 4.0. The historical Gérôme painting in that sheet was not used for present-day geometry. Photos remain ignored comparison material, never runtime textures. Their checked Commons links and attribution are in the catalog record.

## Dimensions

| Feature | Model | Status |
| --- | --- | --- |
| Original outer ellipse | 188 × 156 m | sourced; only northern external wall survives |
| Maximum wall height | 48.5 m | sourced |
| Arena opening | 86 × 54 m | sourced |
| Original bays | 80 | sourced; 37 modeled surviving northern bays, break endpoints estimated |
| Ground arcade opening | approximately 4.2 m wide × 7.05 m high | sourced; width varies mildly with ellipse arc parameter |
| Upper arch heights | 6.45 / 6.40 m | sourced |
| Wall depth | 2.70 m | sourced |
| Wall2 clearance / wall3 clearance | 5.8 / 4.5 m | sourced; exact modern inner radii estimated |
| Level bases | 0.42 / 12.2 / 23.2 m | estimated storey splits |
| Attic base | 34.4 m | estimated |
| Inner ruin crown | roughly 23–36 m | estimated, deliberately irregular |
| Stylobate | two treads, total 0.42 m | sourced form, estimated size |
| Hypogeum | walls 3.19 m above a 0.12 m floor | estimated visible representation; no buried geometry |

## Geometry and materials

Original procedural geometry is merged into four meshes with named `travertine`, `brick`, `hypogeum`, and `void` materials. Both palettes have the same keys. The interior brick/tuff is muted brown, reflecting the mixed surviving masonry rather than a uniformly orange modern brick building. Dark uses dimmer warm stone and darker recesses; no fake emissive windows. No photographs, textures, external meshes, compression or decoders are present.

Three genuinely open arches per surviving northern bay have intrados, reveals and engaged half-columns. Near has projecting entablatures, attic pilasters and three velarium corbels per bay; alternate attic windows are inset. The eastern broken end has an estimated triangular brick support wedge. The southern facade retains real arched apertures and a variable crown; the interior contains broken rings, radial cavea ribs and exposed hypogeum passages around axial voids. Intersecting near hypogeum walls are split to avoid duplicate top surfaces.

Far preserves northern arches and surviving south openings, the missing outer southern wall, the overall crown and the exposed arena. It drops engaged column/corbel detail, flattens minor projecting string courses, coarsens interior terraces and reduces the hypogeum to parallel passages. Identical positions and normals are welded without smoothing across hard edges.

## Limitations and integration

Ruin breaks, masonry weathering, capitals, internal stairs and passage layout are stylized estimates, not a conservation survey. There is no individual block texture or scaffolding, and no reconstructed visitor floor. The southern interior is simplified. The original north wall’s thirty-seven procedural bays are an approximate surviving run rather than a claim about present-day numbering.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The valley-floor plaza is expected to be nearly level; `padM=115` covers the structure and no explicit terrain terraces are declared. This expectation needs an entrance/footprint terrain check; a DEM datum should keep the base rigid and avoid flattening neighboring hills. No runtime layers, shared registry, renderer bundles or rollout gates were edited.

## Verification

The first procedural contact sheet exposed cropped cameras, excessive orange brick and a featureless tall inner ring. These were corrected along with the fitted geographic frame, actual OSM replacement ring, alternating attic windows, exposed southern foundation and broken inner crown. The second exported near/light sheet confirmed the corrected ruin silhouette and masonry palette. Final exported near/far, light/dark and top-plan sheets are listed below. Independent visual approval is left to the coordinator; local image inspection is not app integration evidence.


Final contact sheet inspected with the file/image tool: `tmp/top-cities/shots/colosseum/final/colosseum-reference-export-comparison.jpg`, displaying the dossier photos alongside exported GLB near/light, near/dark, far/light, far/dark (overview, north facade, roof, southern ruin, east, ground-arch close detail) and the top plan. The source near/light sheet was inspected in `iteration-1/`, then the exported near/light sheet in `iteration-2/`. Final views show the missing southern outer wall and open arena; stone is appropriately pale, interior brick/tuff is muted, near arches have actual depth, and far preserves all three northern arcade orders. The far top view drops radial cavea ribs and has coarse interior rings; the interior is less detailed than the photos and remains a documented approximation.

The mapped ring and surveyed ideal ellipse disagree most at the eastern concave return: the surviving facade’s inner corner projects about **4.99 m** beyond that notch. This is an explicit horizontal-fit limitation, not a widened replacement mask. Elsewhere the stylobate projects up to 2.55 m. No neighboring building footprint is claimed. The landmark test bounds this exception at 5.1 m; follow-up app replacement QA must check that no provider extrusion remains in that corner.

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 30,666 | 4 | 1,607,228 | 1569.6 |
| Far | 9,360 | 4 | 485,892 | 474.5 |

`qa-metrics.mjs --ids colosseum` passes: no coplanar different-material overlaps, no removable bridge attributes, no below-grade geometry, acceptable back-face ray sweep and matching near/far bounds. Ragged inner-wall transitions and the attic crown were explicitly closed after the initial ray sweep flagged 2.1% back faces.

Six local geometry tests cover 48.5 m height, mapped crown locations, lost southern attic, three real arcade openings and supporting piers, ground-arch width/height, alternating inset attic windows, measured arena radii, exposed hypogeum, footprint overhang tolerance, near/far silhouette and four material draws. The shared conformance tests separately compare actual exported GLB bounds, metrics, palette names and byte caps to the source. Full driving-mode, terrain and independent visual review are not represented by these tests.

Reference frame checks from the retained OSM response:
- Control 83: [12.4930936, 41.8906418].
- Control 99: [12.4924109, 41.8908995].


Final validation: the requested combined `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/colosseum/colosseum.test.js` run passed with zero failures, including all nine Colosseum-specific/conformance checks (`tmp/top-cities/colosseum/tests-final.txt`). `node scripts/asset-catalog.mjs` and `pnpm assets:check` passed for 164 records / 272 GLB variants; `pnpm assets:preview` built the ignored local catalog. Metrics evidence is `tmp/top-cities/colosseum/metrics.json`: near outside-in back-face hits 1.1%, zero coplanar different-material overlap, zero removable bridgeLift bytes. No shared source file was required or modified. Independent exported visual review and both app modes remain untested.
