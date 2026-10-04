# Dallas: Margaret Hunt Hill Bridge

Original procedural model of the current 2012 Santiago Calatrava bridge carrying six lanes of Woodall Rodgers Freeway / Spur 366 over the Trinity River. Its recognition features are the single tall white **transverse arch**, the twisting centreline stay fan, slender pale steel deck, and concrete approach bents. The parallel Ronald Kirk pedestrian bridge and nearby railway bridge are outside this model.

Build: `pnpm build:top-cities-landmarks margaret-hunt-hill-bridge --no-check`.
Inspect: `/asset-preview.html?asset=margaret-hunt-hill-bridge&view=overview`.

## Sources and dimensions

| Quantity | Model | Basis |
| --- | ---: | --- |
| Cable-supported section | 368 m | [Calatrava project page](https://calatrava.com/projects/margaret-hunt-hill-bridge.html) |
| Each half-span | 184 m | Same architect page |
| Deck width | 36.7 m | Same architect page |
| Stays | 58 near, 30 far | Architect and [Dallas fact sheet](https://trinityrivercorridor.com/transportations/Shared%20Documents/margaret-hunt-hill-fast-facts.pdf): centreline anchorages |
| Steel arch rise above concrete bases | 121.92 m (400 ft) | Dallas fact sheet; [EnginSoft engineering cross-validation](https://www.enginsoft.com/expertise/cross-validation-of-the-final-design-for-the-margaret-hunt-hill-bridge.html) corroborates a 122 m arch |
| Concrete arch bases | 9.144 m tall, 4.8768 m diameter | Dallas: 30 ft, approximately 16 ft |
| Steel tube base diameter | 4.445 m | Dallas: 14 ft 7 in |
| Overall crown from local foundation grade | 131.064 m | Interpretation: steel arch plus concrete bases; see datum uncertainty below |
| Across-road arch footing spread | 44.4 m | Estimated from reference photographs, not a mapped tower footprint |
| Deck elevation | 13 m | Estimated visual datum; published clearance unavailable |
| Crown tube diameter | 2.44475 m | Estimated taper from photos |
| Approach-inclusive alignment | 780.966 m | Averaged mapped OSM carriageways, clipped before the western abutment and on continuing freeway east |
| Flat ramps / peak grades | 166.524 m / 11.71% west; 246.442 m / 7.91% east | Authored smoothstep ramps; no surveyed vertical alignment |

**Datum uncertainty:** the architect quotes 136 m above the riverbanks, while the city and engineering validator describe a 400 ft arch. The city separately gives 30 ft concrete columns. This model interprets 400 ft as the steel rise above those columns, yielding 131.064 m above its foundation grade; the 136 m riverbank figure is not treated as the same datum. The deck elevation and exact datum require a survey for engineering accuracy.

The engineering validator describes a 365 m main span rather than the architect's 184 m half-spans; the cable-supported total is modeled as 368 m. The longer OSM bridge outline also includes approach structures and is not stretched down to the cable-supported length.

Photographic dossier reviewed: `refs-sheet.jpg` and the supplied six files. Independently checked Commons pages: [Reunion Tower August 2015 23](https://commons.wikimedia.org/wiki/File:View_of_Margaret_Hunt_Hill_Bridge_from_Reunion_Tower_August_2015_23.jpg), Michael Barera, CC BY-SA 4.0; [Margaret Hunt Hill Bridge](https://commons.wikimedia.org/wiki/File:Margaret_Hunt_Hill_Bridge.jpg), Fkbowen, CC BY-SA 4.0. Remaining supplied titles/authors/licenses are listed in catalog provenance, including the unknown author of the panorama. Photographs are reference-only in ignored scratch; no photograph, texture, mesh capture or traced geometry is shipped.

## Geographic frame and authoring

Metres, east/up/south. `origin = [-96.8221256, 32.7799486]`; the actual arch axis lands at `[-96.82215336, 32.78000456]` after projection onto the mapped road centre. This arch station is inferred from the dossier's geographic coordinate, **not surveyed or independently mapped**. Stations run west to east, positive lateral to the right/south. Orientation comes from the mapped carriageways, approximately 67.4° east of north; every vertex uses `PROFILE.bridgePoint`, so curvature and rotation are baked exactly once.

`margaret-hunt-hill-bridge-alignment.js` retains both mapped carriageways and way IDs, retrieved through the lead checkout's serialized Overpass helper on 2026-10-04. Scratch extract: `tmp/top-cities/margaret-hunt-hill-bridge/alignment-osm.json`. [Bridge outline way 1275449057](https://www.openstreetmap.org/way/1275449057) supplies `FOOTPRINTS`. No building-tagged tower/pier extrusion was present in the dossier or extended query. Neighboring commercial buildings are excluded. Arch feet extend outside the platform outline; ramps extend along mapped roads beyond it. Those are deliberate structural/road extents rather than building-replacement footprints.

The arch is a closed variable-radius parabolic sweep, with circular concrete bases planted at y=0. The swept tube keeps its open portal in both LODs. Fifty-eight closed thin rods fan from the median to opposite ordered upper-arch attachments, producing a spatially twisting web; anchor ordering is photographic interpretation. The median spine, outer box girders, transverse ribs and near diagonal struts retain open underside spaces. Concrete approach caps touch the girders and open shafts reach grade. No pier is placed inside either main half-span.

Near uses three station chunks per repeated material; far merges them, reduces tube facets and ribs, drops alternate stays, lane dashes, struts and lamp heads. Deck strips sample at 2 m near / 4 m far through the ramps, keeping chord mismatch below the HD overlay offsets. Semantic materials are `tower`, `cable`, `concrete`, `steel`, `asphalt`, `paint`, `lamp`. Pale daytime steel and floodlit night tower contrast with darker night pavement; lamp heads are self-lit. Foundations keep zero `bridgeLift`, approach shafts interpolate it, decks follow the road, and lower arch legs interpolate from their planted bases to the deck. The model needs no shared geometry/profile extension. Its follow-up integration adds the separately committed registry terrain-datum correction described below.

## Measured exports and checks

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 28,218 | 17 | 982,324 | 959 |
| Far | 11,214 | 6 | 316,248 | 309 |

Bounds are identical in both LODs: x −332.417..403.232, y approximately 0..131.064, z −178.587..141.686 m. These costs exclude runtime provider overlays and are not Tesla hardware timings.

Focused test command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/margaret-hunt-hill-bridge/margaret-hunt-hill-bridge.test.js`. The initial 95 focused tests passed, including eight landmark tests that cover observed arch height/portal, platform width, planted supports, stay counts and median contacts, pavement raycasts, mapped roadway ownership in both directions, perpendicular/off-road rejection, ramp joins and grades, immutable refitting, runtime route height and GLB attachment/normal retention. The follow-up required command additionally passes all **362 tests** across the root landmark tests and top-cities, Québec and Calgary registries, including the new registry-ground regression tests. Follow-up regression command:

```sh
node --test src/peregrine/landmarks/*.test.js src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/quebec/quebec.test.js src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/top-cities/margaret-hunt-hill-bridge/margaret-hunt-hill-bridge.test.js
```

Catalog validation and `pnpm assets:preview` pass. `qa-metrics.json`: no budget failures, zero detected coplanar overlaps and 0% back-face hits from 53 successful outside-in rays.

## Screenshots actually reviewed

All paths below are relative to `tmp/top-cities/shots/margaret-hunt-hill-bridge/`.

- `iteration-1/margaret-hunt-hill-bridge-procedural-near-light-sheet.jpg`: overview, front/back, above, crossing, arch, base detail, underside.
- `export-near-light/margaret-hunt-hill-bridge-glb-near-light-sheet.jpg` and `export-far-dark/margaret-hunt-hill-bridge-glb-far-dark-sheet.jpg`: initial exported source comparison.
- **Final** `final/reference-and-export-sheet.jpg`: actual final exported GLBs beside two reference photographs; near light overview/back/above/street/detail/underside, near dark overview/arch, far light overview/arch, far dark overview/underside.

Changes prompted by inspection and QA: moved cameras closer to the transverse arch, lowered the crossing target to retain the crown, centered the detail camera on the concrete/steel junction, extended pier caps to meet edge girders, preserved the exact crown apex in the six-sided far sweep, and inset the edge barriers 8 cm with an embedded base to eliminate coplanar curb/barrier faces. Thin cables remain subtle against the pale inspection background; their web reads more clearly in the night and driver views. Far retains the portal and fan extents while reducing strand density. Independent PASS/PASS-WITH-NITS review is pending the coordinator's review.

## App integration evidence and limits

Initial bundle stamp `9ca0ba2ca289`; corrected follow-up bundle `b6c32959f077` includes shared fix commit `3934156`. Slot A servers 3270 Cityscape / 3272 terrain. Protomaps from `tiles.codriver.io`; world used Terrarium DEM (256 px, maximum zoom 15). `app-shot.mjs` captured Cityscape far/near/street and world far/near with the actual bridge active in both LODs. `app-cityscape/initial-sheet.jpg` and the initial world sheets were reviewed; the original world matrix revealed the extra terrain datum. After the authorized correction, **`followup-world/fixed-world-sheet.jpg`** was reviewed: overview, both western approach directions, both eastern approach directions. All approaches now connect. The required app-shot captures were also read together in `followup-world/app-shot-approaches-sheet.jpg` (far/near and all four approach views). `app-shot.mjs --mode world --at` separately captured both ends in both bearings under `followup-world-west-67`, `followup-world-west-247`, `followup-world-east-67`, `followup-world-east-247`, with the actual bridge layer active. Custom `--at` captures cover both ramp feet in both bearings (67.4° / 247.4°), under `app-cityscape-approaches/`; screenshots show pavement meeting the ramp feet without an observable step or duplicate generic deck. Ad-hoc script reports say `active:false` because their synthetic spot IDs do not name a layer; the separate actual-layer probe confirms activity.

Live `window.__map.landmarks.heightAt` results, in **metres above the queried local ground**, for both travel directions:

| Sample / lateral | Cityscape | World |
| --- | ---: | ---: |
| West foot / −8 m | 0.000014 | −0.200659 |
| West foot / +8 m | 0.000014 | 0.498783 |
| West cable endpoint / −8 / +8 m | 13 / 13 | 12.999559 / 13.010219 |
| Arch / −8 / +8 m | 13 / 13 | 13.924161 / 14.455745 |
| East cable endpoint / −8 / +8 m | 13 / 13 | 12.604773 / 12.857426 |
| East foot / −8 / +8 m | 0.000006 / 0.000006 | 0.000461 / −0.002480 |

All **26 in-range mapped roadway vertices** return a deck height in both travel directions, in both modes. Off bridge at lateral 60 m and perpendicular heading return null. Flat approaches are `[0,0]`, with the platform 13 m throughout its cable-supported section. The live camera API returns 13 m in Cityscape, and the route ribbon reads approximately 15.605 Mercator metres (13.12 real metres including its 12 cm offset); the world API returns 13.924 m above local ground at the sampled arch lane. `app-modes-and-approaches.jpg` is historical evidence of the earlier world failure. Corrected durable world numbers are `tmp/top-cities/margaret-hunt-hill-bridge/followup-world-probe.json`; flat numbers remain in `app-height-probes.json`. The height-query numbers are unchanged by the registry fix: it corrects only an erroneous parent transform, bringing rendered geometry into agreement with the API.

| Environment | Status / limitation |
| --- | --- |
| Cityscape standard roads, basic approach continuity, near/far load and both directions | Verified in local app; no observable duplicate deck |
| Full 3D world, both approach directions and basic load/support/height queries | **Verified in the corrected local terrain build**; parent y=0, DEM present, approaches connected, all 26 mapped vertices owned in both directions |
| Surveyed rigid world deck and complete terrain/lifecycle matrix | Not tested; bank-fit remains a visual approximation and the full lifecycle matrix is checked separately |
| HD provider pavement/lane paint on/off | Not tested: `/osm-lanes` returns 503 without Redis locally |
| Car/camera/route shared height contract | Runtime API and focused route test verified; no paired vehicle or live navigation session |
| Late/missing/replaced terrain, mode switches, reanchor, load failure restoration | Shared implementation reused; not exercised for this new asset |
| MCU2/MCU3 performance | Not measured |

**Resolved world datum issue:** the original matrix showed disconnected approaches because `registry-landmarks-layer.js` placed `bank-fit` layers on a pad/scene datum although their fitted vertices already contained absolute DEM heights. The initial extra parent offset was 135.732357 m in Mercator space. Authorized minimal fix commit `3934156` keeps both `bank-fit` and `absolute-deck` parent groups at y=0. The corrected live probe reports **groupY=0**, bankYAt(0)=154.005867 Mercator m, with current scene datum 138.402224 m removed once by worldRoot. Screenshots and API heights now agree. `registry-ground.test.js` checks both ground-fitting policies, ordinary building/no-policy pad placement, reanchor/terrain removal, and unchanged actual Toronto/San Francisco/Québec/Calgary bridge registries. The separate bridge commit also scopes the existing Paris terrain-arrival test to `landmark:paris-*`: adding this ready bridge previously made its unscoped bank-fit count six rather than five, while every Paris-specific assertion is retained. No other test is loosened.

**Additional world approximation:** `bank-fit` avoids flattening the river corridor, but interpolates terrain along the alignment and moves the deck with that datum. This is not a surveyed rigid/level engineering deck. At the western foot the lateral DEM differs by up to ~0.5 m; one pavement sample sits 0.20 m below adjacent ground. The large approach disconnection is resolved; terrain-specific rigid deck placement and sub-metre ramp-edge finishing remain refinement items, not evidence of surveyed terrain accuracy. No DEM or Dallas sea-level altitude is baked into the reusable GLB.

The only shared source change is the authorized registry parent-datum condition, committed separately with its regression test. The coordinator additionally authorized the Paris-only test selection correction in the bridge commit. Other landmarks, online environments and published preview pages are untouched. Renderer bundles are rebuilt solely for local inspection, then restored before committing the bridge. Servers are stopped at completion; both commits remain on this worker branch without pushing.
