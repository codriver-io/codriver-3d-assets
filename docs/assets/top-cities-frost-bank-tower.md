# Frost Bank Tower — Austin

Original procedural model of the completed 2003 Frost Bank Tower at 401 Congress Avenue, designed by Duda/Paine with HKS. Stable asset ID `frost-bank-tower`; source under `src/peregrine/landmarks/top-cities/frost-bank-tower/`.

## Identity and references

The silvery blue folded glass shaft steps inward at clipped corners before reaching a cluster of four pointed, faceted crown sails. The approximately 30 m crown, open clefts, silver lattice and Frost rosettes carry the skyline identity. At street distance the Congress Avenue limestone podium, glazed bays and curtain-wall grid become visible. The small pointed terminals represent lightning rods, not a tall central antenna.

Sources checked 2026-10-15:

- [Wikipedia — Frost Bank Tower](https://en.wikipedia.org/wiki/Frost_Bank_Tower): 515 ft / 157 m, 33 floors, 2003 completion, Duda/Paine and HKS, approximately 30 m crown, limestone base and blue low-e glass.
- [OSM way 37546502](https://www.openstreetmap.org/way/37546502): mapped L-shaped podium, height=157, building:levels=33. The supplied shared-helper dossier contains the exact ring and ground-floor parts [1507549538](https://www.openstreetmap.org/way/1507549538) and [1507549539](https://www.openstreetmap.org/way/1507549539); all three provider ways are owned. Adjacent Mexic-Arte Museum, visitor center and other neighbors remain outside ownership.
- [FrostTowerAerial.jpg](https://commons.wikimedia.org/wiki/File:FrostTowerAerial.jpg), Shane.torgerson, CC BY-SA 3.0: podium, shaft offset and crown plan.
- [FrostTower-Feb2009.JPG](https://commons.wikimedia.org/wiki/File:FrostTower-Feb2009.JPG), LoneStarMike, CC BY-SA 3.0: faceted shoulder setbacks, crown and geometric rosettes.
- [Frostbanktoweraustintx.jpg](https://commons.wikimedia.org/wiki/File:Frostbanktoweraustintx.jpg) and [Frostbanktower 5th-guadalupe.jpg](https://commons.wikimedia.org/wiki/File:Frostbanktower_5th-guadalupe.jpg), CMBJ, CC BY-SA 2.5: curtain-wall rhythm and street silhouette.
- [FrostBankTowerLobbYAustinTX.JPG](https://commons.wikimedia.org/wiki/File:FrostBankTowerLobbYAustinTX.JPG), WhisperToMe, public domain: glazed lobby and round columns.

All photos are reference-only in ignored `tmp/top-cities/frost-bank-tower/refs/`; no photo, texture, scan or traced third-party mesh ships. Original source/docs use the library MIT terms, original meshes CC BY 4.0, and mapped data retains ODbL/OpenStreetMap contributor attribution.

## Frame and dimensions

Real metres; +X east, +Y up, +Z south. Origin `[-97.74269, 30.26649]` matches the dossier anchor. The shaft is offset by plan coordinates `[-23, 6]` within the broad mapped podium. Local y=0 is lobby grade. No latitude stretch, DEM elevation or terrain exaggeration is baked into the GLBs.

The plan is rotated clockwise 17.3 degrees from east, baked into every exported vertex. OSM control points `[-97.7432949,30.2662503]` and `[-97.7427621,30.2661054]` define the long south edge, approximately bearing 107.3 degrees; the perpendicular Congress frontage faces 287.3 degrees. No host rotation is required.

| Quantity | Model | Basis |
| --- | --- | --- |
| Architectural top | 157 m | Sourced, 515 ft; used instead of the stub's rounded 158 m |
| Storeys | 33 | Sourced; curtain-wall rows are an estimated visual module |
| Crown | glass from 130 to 156 m; four separate lightning terminals to 157 m | Overall approximately 30 m sourced; profile estimated |
| Shaft lower envelope | about 44.6 × 51 m, clipped corners and V folds | Photo-estimated inside mapped podium |
| Shoulder terraces | 67, 96, 122, 130 m | Estimated from photographs |
| Mapped podium envelope | about 104 × 70 m, L-shaped | OSM; not the shaft dimensions |
| Retail podium / garage roof | 7.6 / 23 m | Estimated |
| Curtain-wall pitch | about 3.65 m rows, 2.4 m bays near; double pitch far | Estimated |
| Terrain pad radius | 78 m | Authored bound covering podium; terrain placement untested |

## Review corrections (g10a)

The crown is four separate steep folded glass sails, with narrower shoulders, tips at y=156 m around the central void and 1 m terminals seated on the tips. The sail feet sit on the y=130 m shoulder; clefts remain open down toward y=135 m. The louvered core ends at y=134 m rather than projecting between the peaks. Each sail is a closed thin shell with an integrated triangular lattice, retained at lower subdivision in far. There is no central mast.

The 67/96/122 m corner setbacks now terminate in 7 m pointed glass gables. Horizontal setback caps use the same blue tone as the glass, rather than pale horizontal ledges. The Congress Avenue limestone podium and garage roof remain. Daytime glass, blueGlass and occupiedGlass use one reflective-blue colour. Occupied panes use a shaded material with that exact day colour, changing to warm colour only in the dark palette; this avoids the previous unshaded day patchwork. Four Frost rosettes remain above the shaft.

The model is an original photographic approximation. Crown width/clefts, inset, shoulder heights, window pitch, rosettes and garage details are estimated, not construction drawings. No textures or external meshes ship. Provider ownership remains ways 37546502, 1507549538 and 1507549539, already including the mapped podium and parts.

## Export verification and costs

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 19,362 | 8 | 969,312 | 946.6 |
| far | 6,166 | 8 | 308,320 | 301.1 |

Both LODs meet the building budgets. `qa-metrics.mjs` reports no issues: no layered faces, no coplanar different-material pairs, no unsupported member candidates, grade zero, and zero outside-in backface hits. Depth generation/check passes with zero cycle edges dropped. Focused tests cover source/export parity, dimensions, footprint containment, near/far silhouette and named support contacts with negative controls. The aquarium additionally pins canopy voids and roof swells.

Final exported near/far GLB sheets, reference comparisons and app evidence are under `tmp/next-200/fix/g10a/frost-bank-tower/` (replace ID with this asset id). The GLB sheets include overview, opposite facade, roof, entrance and crown/bow detail. Two look-fix iterations were used. Focused tests: 18/18 pass across these two models. Registry conformance: all six checks for these assets pass; complete top-cities invocation reports 816/819, with three unrelated in-progress `los-angeles-union-station` failures. Catalog validation and local preview generation passed at the 406-entry / 766-variant checkpoint; later catalog retries can encounter that sibling’s missing documentation. See the batch `REPORT.md` for commands, evidence paths and app verification limits.

## Placement status

Cityscape: **verified for static photographed appearance**. Full 3D world: **verified for static photographed appearance**. App evidence is captured separately from a scratch `/tmp` bundle on slot M (3318/3320); no shared app bundle is rebuilt. These screenshots establish static appearance for the photographed views only; terrain arrival/eviction, pad residuals, failed loading, origin shifts, disposal and real-device performance are not certified by this fix pass. Independent re-review remains required. No deployment or git write operation is performed.
