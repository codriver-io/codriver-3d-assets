# Altare della Patria / Vittoriano, Rome

Original procedural model of Giuseppe Sacconi's Monumento nazionale a Vittorio Emanuele II, Piazza Venezia, Rome; constructed 1885–1935, inaugurated 4 June 1911. This models the marble monument and attached Museo Centrale del Risorgimento in their present architectural form. The altar itself is the central Rome niche and Tomb of the Unknown Soldier, rather than the whole monument strictly speaking.

## Evidence and dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Highest quadriga wing | 81 m | Published monument height including quadrigas, Wikipedia |
| Propylaeum attic top | 70 m | Published architectural height excluding quadrigas; profile estimated |
| Main colonnade | 70 m between outer ends, 16 columns | VIVE, Main Colonnade |
| Main Corinthian columns | base 42 m, top 57 m: 15 m | VIVE publishes 15 m; elevation relative to street estimated |
| Monument nominal width / depth | Published 135 × 130 m | Wikipedia; not applied as a scale to the complete OSM site envelope |
| Main terrace body | 112 m wide, 61 m deep | Estimated within mapped outer ring |
| Quadriga pavilions | 20 × 23 m; centers 90 m apart | OSM geometry plus photographs; simplified rectangular lower pylons |
| Central equestrian pedestal | cap radius 6 m, top 33.6 m | Photo estimate; oval original approximated circular |
| Equestrian group | king reaches about 43.5 m | Photo estimate, original low-poly horse and rider |
| Four triumphal columns | 7 m including simplified bases/capitals | VIVE gives 7 m for the monolithic shafts; simplified model includes ornament in this envelope |
| Museum rear roof | 31.7 m | Estimated; separate mapped outline |
| Stair terraces | 2.8, 8, 17, 23.8, 35, 42 m | Estimated; closed stair profiles with reduced far tread count |

References checked 2026-10-05:

- [VIVE: Main Colonnade](https://vive.cultura.gov.it/_cms/en/vittoriano/what-see/main-colonnade): 70 m length, sixteen 15 m columns, Corinthian capitals, gilded rear-wall decoration and regional allegories.
- [VIVE: Triumph columns](https://vive.cultura.gov.it/_cms/en/vittoriano/what-see/triumphal-columns): two pairs, 7 m monolithic shafts, marble and sculptured bases.
- [Victor Emmanuel II Monument](https://en.wikipedia.org/wiki/Victor_Emmanuel_II_Monument): identification, dates, Sacconi, overall 81 m height and nominal 135 × 130 m dimensions.
- [OSM relation 1849830](https://www.openstreetmap.org/relation/1849830), main monument, and [relation 1849831](https://www.openstreetmap.org/relation/1849831), museum. Relations fetched once through the shared Overpass helper; the dossier already contains the surrounding building parts.
- Six Commons photographs listed with title, author, license and links in the catalog record; dossier `refs/SOURCES.txt` is the research ledger. Main facade by Fitzws (CC BY-SA 4.0), equestrian monument by Carlomorino (CC BY-SA 4.0), portico, altar and propylaeum by Darafsh (CC BY-SA 3.0).

Only photographs in ignored `tmp/` were consulted. No photographic texture, scan or third-party mesh is embedded in code or GLB. This is original modeled geometry. Geographic footprint data retain OpenStreetMap contributor attribution and ODbL 1.0.

## Geographic frame and replacement

Origin `[12.4831, 41.8947]`; real metres, east/up/south; local y=0 is the Piazza Venezia entrance grade. Authoring axes are X along the facade and -Z toward Piazza Venezia. A 17 degree Y rotation is baked into every exported vertex once; facade bearing 343 degrees. No runtime second rotation or absolute terrain height is needed.

Control points from the mapped western/eastern colonnade ends and pavilion roof groups establish the facade axis. For example, the source's rear western roof group around `[-40, 52]` and eastern group around `[46, 24]` in east/south metres establish an approximately 18 degree skew; long mapped edges cluster at 163–166 degrees from north, giving the 343 degree outward bearing. The source uses 17 degrees, with shallow portico curvature modeled independently.

`FOOTPRINTS` contains the joined outer ways of both mapped multipolygons. `OSM_WAYS` includes those members and all monument building-part ways present in the dossier, including roof steps, columns and sculptural extrusions. The main basal slab follows the entire owned outline; the rear museum follows its independent outline. The neighbouring Santa Maria in Aracoeli, Palazzo Nuovo and convent are excluded. The published nominal 135 × 130 m dimensions describe the monument; the complete mapped envelope includes long stairs, irregular edges and the attached museum. Geometry tests pin both envelope and polygon containment through the existing building-layer ownership function and preserve the exact basal outline (no near or far vertices outside the owned polygons). They do not establish live provider-mask behavior.

## Modeling and materials

The signature silhouette includes shallow concave portico with sixteen distinct tapered/fluted shafts, simplified Corinthian capitals, deep open bays and a recessed gilded mural band; two genuinely open propylaea with four frontal columns each, pediments and stepped attics; quadrigas with four horses, chariot and winged Victory; central bronze king on horseback; two pairs of triumphal Victories; sixteen regional roof figures; central gilded Rome niche and eternal flame bowls; broad advancing stair terraces and facade relief figures.

Every repeated element is merged by material. Seven materials: warm Botticino `stone`, brighter dressed `trim`, subdued sculptural `relief`, patinated `bronze`, dark `recess`, `gold` decoration and flame `glow`. Both themes name the same materials; night dims marble and bronze, while flame bowls become warm self-lit accents. Night facade floodlighting and gold-wall artwork are approximated by material color rather than photographic lighting or texture.

Near shafts have geometric scalloping/entasis, capitals have four compact ornamental lobes, terrace rails have open baluster rhythm, walls have courses and piers, and foreground relief uses modeled figures. Far replaces the shaft profiles and small capitals with simpler solids, drops the carved frieze, pedestal city figures, stone joints and dentils, and reduces stair/baluster sampling. It retains all sixteen portico columns, roof allegories, propylaea openings, quadrigas, horse/rider, altar and full envelope.

Approximations: sculptural anatomy and wings are stylized; no accurate portraiture, inscription lettering, foliage, carved animals, mural scenes, interiors or archaeological foundations. Rear elevations and museum roof are estimated without a rear photograph. Gilded bands and rectangular frieze relief panels simplify the real decorated surface. The marble can read brighter and less shaded than the reference under the inspector's strong ambient lighting. Surrounding roads, plaza, church, fountains and Capitoline hill are not authored.

## Export and validation

Export command: `pnpm build:top-cities-landmarks altare-della-patria --no-check`.

| Export | Triangles | Draws | KiB rounded |
| --- | ---: | ---: | ---: |
| near | 43,148 | 7 | 1,338 |
| far | 9,804 | 7 | 401 |

Costs are the exported default scene, measured in the generated manifest; no textures, decoders, compressed/quantized geometry or removable bridgeLift attributes. They are within 60k/14/2.5 MB near and 12k/8/500 KB far. The final-round caps are also met: near ≤50k, far ≤10k triangles, ≤10 draws and far ≤500 KB. These are asset costs, not Tesla hardware measurements.

Focused tests: `node --test src/peregrine/landmarks/top-cities/altare-della-patria/altare-della-patria.test.js` passes nine tests in under one second. They pin the 81 m summit, no below-grade vertices, sixteen 15 m shafts with separate bays, common 42 m floors, 65 m cornice, clear street-facing shafts above the compact terrace, genuine deep triangular propylaea, four separated horse-heads abreast, preserved altar and equestrian contacts, mapped polygon containment, near/far bounds and GLB round trip. Catalog validation passes; source and GLB costs agree.

Final deterministic QA: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids altare-della-patria --out tmp/top-cities/review/altare-della-patria/metrics.json`: no budget/artifact issues, zero coplanar pairs, zero back-face hits in 252 accepted sweep rays, min y=0, max y=81 and no removable bridgeLift attributes. The initial combined conformance run passed all 110 then-current tests; the final correction is covered by the nine dedicated landmark tests. The sweep samples exported geometry and is not an exhaustive manifold proof.

## Screenshots actually judged

Research sheet: `tmp/top-cities/altare-della-patria/refs-sheet.jpg`.

1. `tmp/top-cities/shots/altare-della-patria/iteration1/altare-della-patria-procedural-near-light-sheet.jpg`: overview, facade, roof, rear, street, portico detail, quadriga. Stair bands had floating undersides; they were replaced with closed profile extrusions. Oversampled rounded ornaments exceeded the budgets; detail was reduced while retaining the structural members.
2. `tmp/top-cities/shots/altare-della-patria/iteration2/altare-della-patria-procedural-near-light-sheet.jpg`: confirmed closed stair massing and added rear articulation. Exported deterministic QA then found the portico floor coplanar with the podium roof; the floor now stands 0.18 m above it. Flame bowls were moved onto their support ledge.
3. `tmp/top-cities/shots/altare-della-patria/final/comparison-sheet.jpg`: the exported GLBs alongside supplied reference photos, near/far, light/dark; frontal, opposite/rear, above, street, close portico, quadriga and mapped top. Confirmed overall recognizable portico/twin quadriga silhouette, open bays, supported sculptures and consistent near/far massing. Top view shows the mapped outline and the museum extension separately. Source and exports have matching bounds/materials.

Individual captures and four raw GLB contact sheets remain under the same `final/` directory. Builder visual verification is complete. Independent reviewer PASS/PASS-WITH-NITS remains the coordinator's release gate.

## Placement modes

Cityscape: **not tested yet, integration is checked separately**.

Full 3D world: **not tested yet, integration is checked separately**. `terrainPad` declares both owned rings, median datum and 10 m feather because the footprint lies against the Capitoline slope. The structure remains rigid with internal terraces; neither hill geometry nor a sampled DEM height is baked into it. A live world review must sample entrance and museum edges, check surrounding roads/church, refine the datum as terrain arrives, and verify that the pad does not bury the rear or lift the plaza. Median placement is a declared strategy, not an established terrain fit. Failed/late loading, default extrusion replacement, mode toggles and reanchor are also untested in the app.

## Final independent-review correction (2026-10-05)

The first alignment correction raised the main floor to 51.8 m, but the re-review correctly identified excessive blank podium mass. The final correction lowers both main and propylaea floors to 42 m together, retains the sourced sixteen 15 m main columns, and reduces the highest blank riser from 16.6 to 6.8 m. Its face remains behind the equestrian terrace and street rays now reach the main shafts above the preceding 35 m terrace. Main capitals are at 57 m, the central cornice at 65 m and regional figures at 68.1 m. The estimated propylaea shafts are taller at 20 m (42–62 m), matching their taller openings in the supplied photographs. Flanking flights and their balustrades follow the lower common floor. The portico's dark recessed inner backing provides the contrast visible in photographs while its exterior rear wall remains marble.

The former 2.3 m rise / 0.7 m deep pediment slabs become true 4.2 m rise triangular prisms from 63.2 to 67.4 m, 24.7 m deep across the pylons, with smaller inset relief tympana standing 0.15 m proud of the marble borders. The stepped attic closes above them to the same 70 m roof, supporting the unchanged 81 m quadriga summit. The last riser/trim overlaps are offset so the exported coplanar check is clean.

The quadriga horses previously faced sideways and were arranged along depth, so frontal views merged their silhouettes. Each is now rotated to face building -Z, with four horses abreast along X at 2.1 m centers. Heads have explicit intervening gaps, the chariot and two modeled wheels sit behind the row, and each Victory's wings narrow from roughly 10.6 to 4.1 m overall. This preserves the full summit while avoiding the oversized single-winged-horse reading. Horse limbs, wheel rims and human anatomy remain stylized original geometry.

Orientation was checked before editing: `world([0,0,-1]) = [-0.29237,0,-0.95630]`, bearing 343 degrees, toward Piazza Venezia. The staircase center is west/north of the rear colonnade center; the mapped outline and red-ring top render agree. The existing 17 degree baked rotation was correct and is retained. Evidence: `tmp/top-cities/shots/altare-della-patria/final-fix-orientation/altare-della-patria-glb-near-light-top.png`.

I viewed the regenerated final standard sheet `tmp/top-cities/review/altare-della-patria/altare-della-patria.jpg` beside its reference photo, plus `tmp/top-cities/shots/altare-della-patria/final-fix2/comparison-sheet.jpg`, which combines that review sheet with frontal near/far/light/dark, street, close portico and quadriga tiles. The front now reads as sixteen pale columns against dark open bays, rather than the blank upper terrace; the pediment profiles and four-horse silhouette are visible. Opposite views remain quiet marble museum elevations. Standard back views necessarily show the rear because the verified front faces north-north-west, not the standard sheet's south-facing street camera. No shared camera or renderer code was changed.

Reproduction: `pnpm build:top-cities-landmarks altare-della-patria --no-check`; dedicated tests above; `node scripts/asset-catalog.mjs`; final metrics command above; `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids altare-della-patria --out tmp/top-cities/review/altare-della-patria`. Independent final review and Cityscape/Full 3D world integration remain separate gates.
