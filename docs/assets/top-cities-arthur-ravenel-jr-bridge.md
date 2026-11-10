# Arthur Ravenel Jr. Bridge — Charleston, South Carolina

Original procedural model of the current 2005 Cooper River bridge, covering the cable-stayed unit and enough high approach viaduct to retain its profile. No third-party mesh, image, texture, lettering or signage is included.

## Sources and dimensions

[TYLin](https://www.tylin.com/work/projects/arthur-ravenel-jr-bridge), the design-review and construction-engineering consultant, identifies the diamond towers, eight traffic lanes, walking/cycling path and protective rock islands. OSM API map extract retrieved 2026-11-09 supplies alignment controls and the bridge outline. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).

| Feature | Value | Basis |
| --- | ---: | --- |
| Main span | 471.2208 m / 1546 ft | Sourced, TYLin |
| Tower top | 174.9552 m / 574 ft | Sourced, TYLin; some secondary descriptions round to 575 ft, not treated as an additional survey |
| Navigation clearance | 56.6928 m / 186 ft minimum | Sourced, TYLin; not a universal deck datum |
| Midspan deck top / slab depth | 62 / 2 m | Estimated; consistent with TYLin saying deck rises just over 200 ft |
| Deck width | 39 m | Estimated from reference photographs and mapped outline |
| Side spans | about 221 m each | Estimated from photographs |
| Approved library extent | 1440 m | Authored: stayed unit plus 257 m of supported high approach each end |
| Diamond breadth / longitudinal depth | 50 / 5.6 m | Estimated from photos |
| Stay arrangement | 16 per tower/side/direction, 128 near / 72 far | Estimated representative count and anchor distribution |
| Island size, pier spacing and deck camber | 71 × 57 m; 64.5 m; 7.2 m crest fall | Estimated; no seabed or surveyed approach profile |

Two licensed photos checked for identity and appearance: [DXR, West Partial View 20160704 1](https://commons.wikimedia.org/wiki/File:Arthur_Ravenel_Jr_Bridge,_West_Partial_View_20160704_1.jpg), **CC BY-SA 4.0**, shows the diamond underside, walkway and stays; [w_lemay, Charleston SC](https://commons.wikimedia.org/wiki/File:Arthur_Ravenel_Jr._Bridge,_Charleston,_SC.jpg), **CC0 1.0**, shows both current towers and the approach rhythm. Both retained only in local scratch.

## Mapped mainline and shared surface (stage B, 2026-11-10)

Stage A (`d0288290`, verified ancestor) imported the approved library model from `4241517a4bec3ff9e0954b7c69e20fc09c9c7410` without changing its GLBs. Stage B fits that structure to the live mainline. The original 1,440 m export covered only the stayed unit and high approaches; it ended 54.8 m above flat grade and could not carry app traffic.

`arthur-ravenel-jr-bridge-alignment.js` retains both mapped four-lane carriageways from ways **927255593, 927255592, 38968007** (toward Mount Pleasant) and **50054023, 927255594, 927255595** (toward Charleston). Retrieved 2026-11-10 exclusively through `.agents/skills/build-3d-city/scripts/overpass.mjs`; raw response `tmp/ravenel/osm.json` and the helper cache. © OpenStreetMap contributors, ODbL 1.0. The profile averages the two carriageways at their combined longitude vertices, then clips to the following endpoint planes:

| Quantity | Value |
| --- | ---: |
| Charleston / western joint | `[-79.93315, 32.80503577685947]` |
| Mount Pleasant / eastern joint | `[-79.90405, 32.80142142457727]` |
| Approach-inclusive profile | 2,753.759697 m |
| Midspan station | 1,688.443674 m |
| Preserved stayed-unit camber | `62 - 7.2 * (x / 720)^2`, for `abs(x) <= 456 m` |
| West / east descent lengths | 1,212.443674 / 589.316023 m |
| West / east peak flat grades | **5.096301% / 11.095829%** |
| Vertical curves / flat endpoint landings | 60 m at each ramp extremity / 20 m |
| Width-fit noses | First and last 100 m only |

This is explicitly a **flat-Cityscape approximation**: the real bridge grade is about **4%**. The coordinator authorised regrading the outer approaches, with western grade below 6% and a hard eastern cap of 12%. Both ramps start with the unchanged stayed deck's tangent, change smoothly to a constant grade, and return smoothly to a flat landing. The eastern ramp is intentionally steeper so it lands before the US 17 / SC 703 fork without assigning an invented common surface to the diverging roads. It is not a reconstruction of the surveyed vertical alignment.

The **Mount Pleasant fork and the Charleston-side I-26, Meeting Street and Morrison Drive ramps require a separately scoped multi-branch interchange surface**. No branch beyond either endpoint belongs to this model. The western endpoint is east of the Morrison entrance merge. Full input ways are retained for provenance, but ownership is clipped by station, carriageway envelope and direction; long ways are not erased wholesale.

Origin remains `[-79.915287075,32.802954275]`; real metres east/up/south, y=0 flat-map/water grade. Rotation is baked once by `PROFILE.bridgePoint`; no DEM, Mercator stretch or moving scene datum is baked into the GLBs. `terrainPolicy:'absolute-deck'` preserves the central deck's absolute authored height, fits the ramp ends to terrain and plants support feet at their local DEM. It does not flatten a river corridor. The terrain clamp keeps the low deck 8 cm above the sampled ground, avoiding quantized pavement clipping into the terrain at the western nose; this small rendering clearance is shared with navigation heights and does not change Cityscape or planted feet. `clipStandardEnds:true` splits owned standard roads at the exact endpoint planes. One deck serves both directions; there is no stacked `deckOffset` or separate lower-road ownership problem.

The factory `createRegistryBridgeLayer(PROFILE, PALETTES)` supplies model loading, road replacement, HD overlay support and the route/car/camera surface. The landmark-local layer follows current Dames Point: standard-road zoom width and colour apply only at the tapering noses. The structural deck stays 39 m wide; a partial HD sample cannot squeeze the stayed unit. Each taper joins its mapped carriageway separately; the median narrows to a point instead of forming a concrete apron. The custom `roadEdges` and `bridgeRoadHeight` use the same taper and endpoint fits.

Provider tower extrusions **1505466634 (Silas N Pearman)** and **1505466635 (John P Grace)** have exact rings in `BUILDING_FOOTPRINTS`, passed to the profile's `buildingFootprints`. These replace the mapped tower boxes only. The older `FOOTPRINTS` ring remains the approved 1,440 m library inspection outline, not a blanket building mask over the extended roads. Neighbouring park shelters, homes and waterfront buildings remain outside tower ownership.

## Differences from the approved library model

- The approved diamond sections and openings, 471.2208 m tower spacing, 174.9552 m crowns, 39 m rigid deck, 128 near / 72 far stays, cable anchors, central camber, protective islands and palettes remain. The structure now uses the mapped profile's horizontal frame rather than a single rotation; small horizontal shifts follow the mapped centreline (maximum 1.143 m over the stayed-unit sample grid).
- Both outer high approaches are regraded beyond `abs(x)=456 m`, including the formerly high ends at ±720 m, and extended to the joints above. Approach piers keep the approved twin-column/cap form and 64.5 m rhythm, with their heights reseated beneath the deck. Additional matching piers support the extensions; the low noses collapse to grade.
- Pavement, slab shell, barriers and the south walk follow the same profile. Only the first/last 100 m narrow onto the standard road ribbons; walk and barrier widths/heights vanish at the road connection. The landing slab is split beneath the two ribbons so no concrete wedge spans their gap. Handrails end on posts at the full-width portion of each approach.
- Railing and lane-paint rhythms continue into the new approaches while retaining their original station grid through the approved model. Far still omits lane paint and reduces stays/rail sections. The slender asphalt slit beneath the median prevents the nose mesh from paving the provider separator.
- `bridgeLift` is now retained: feet/islands are planted, lower tower/support vertices interpolate ground-to-deck attachment, and road/barriers/stays follow the accepted deck. This is functional fitting metadata, not a whole-model vertical shift.

No new lamps, sign gantries, utilities, detailed rock texture, fenders, interchange geometry or third-party mesh/texture were added. Contact tests exclude the member being tested; shortened stays and handrails fail their negative controls. Degenerate faces created by zero-width noses are removed before export. The standalone near/far daylight/dark comparison preserves both diamond voids and stay fans.

## Costs and automated evidence

| LOD | Approved triangles / draws / bytes | Fitted triangles / draws / bytes |
| --- | ---: | ---: |
| Near | 19,828 / 7 / 227,836 | 36,638 / 7 / 655,740 |
| Far | 7,156 / 6 / 101,296 | 14,570 / 6 / 292,248 |

Budgets: near 120,000 / 40 / 4.5 MB; far 30,000 / 10 / 1.2 MB. Costs exclude the app's provider/terrain/road overlays and do not establish Tesla hardware performance.

Eleven landmark tests cover every mapped in-range vertex in both headings, exact endpoint road edges, off-road/median/crossing rejection, branch exclusion, continuous height and tangent at each profile splice, authorised grade caps, preserved diamond openings/crowns/camber, reseated caps/piers, named stay and railing contacts with shortened-member negative controls, absence of landing aprons, rigid spans under width fitting, repeated-fit stability, terrain removal restoration, runtime `heightAt`, and GLB budgets/licensing/normals/attachment weights. Source/export conformance and registry-ground/absolute-deck tests are run with the full top-cities registry. Results: **975/975** registry/conformance/landmark tests passed (`tmp/ravenel/conformance-release.log`); after the terrain-clearance correction, **16/16** targeted landmark/absolute-deck/registry-ground tests passed (`tests-clearance.log`). All **5/5** fresh-bundle parity checks passed (`bundle-parity.log`). `pnpm assets:check` passed, **445 entries / 878 GLB variants**; `pnpm assets:preview` built the ignored catalog. Depth check: **Depth layers current (1 models)**, **0 cycle edges dropped**. `qa-metrics-release.json`: both LODs **ok**, no flagged issues. Geometry/source changes were followed by fresh exports; no shared runtime source changed.

## In-app evidence and remaining limits

Local native server in this worktree only, ports **3301 / 3401**, no shared preview or online deployment. Public Protomaps tiles/glyphs/trees/lanes use `tiles.codriver.io`; world uses AWS Terrarium, tile size 256 / max zoom 15. Telemetry is disabled. Final renderer source stamp: **`be5cec40a2ad`**. Stock `.agents/skills/build-3d-city/scripts/app-shot.mjs` is unmodified and supplies its existing synthetic demo bootstrap. The temporary readiness flag is retained only after the Cityscape checks pass.

Visual evidence uses stock app-shot images. An additional **local read-only diagnostic** at `tmp/ravenel/height-probe.mjs` reuses exactly the stock bootstrap and camera API, then reads active-layer state, every mapped vertex and both headings, a dense 20 m survey and rendered footing/DEM residuals. It adds no app grant, flag, entitlement, localStorage key or gate and is not committed. This follows the Queensborough/Basarab/Cambie evidence method; the diagnostic is not a product authentication test.

**Cityscape: verified** for standard roads, both joints in both directions, near/far loading, model placement, tower-box replacement, ground contacts and the shared navigation-height API. The two road ribbons join their tapered noses without a visible gap or height step. The deck and fallback paint follow the same grade, the towers stay open, and no duplicate generic bridge or tower box is visible. Evidence: `tmp/ravenel/city-overview/`, `final-city-west-forward/`, `final-city-west-reverse/`, `final-city-east-forward/`, `final-city-east-reverse/`, `final-city-joints.jpg`, and `final-city-dark/` (far/near/street).

**Full 3D world: verified** for the same standard-road cases with real DEM present. Final evidence: `tmp/ravenel/world-overview/`, `final-world-west-forward/`, `final-world-west-reverse/`, `final-world-east-forward/`, `final-world-east-reverse/`, `final-world-west.jpg` and `final-world-east-and-dark.jpg`. The initial western nose clipped against terrain; adding the shared 8 cm clamp clearance eliminated the visible holes in a fresh capture of both headings. Both eastern headings remain continuous with the fork beyond the ownership plane. No world-only tower offset, terrain trench, provider box, buried pavement or floating pier is visible in the final views.

Absolute-deck placement **does change the eastern approach**: the sampled endpoint datum is **0.766376 m** (western **−0.057986 m**) instead of Cityscape zero. The central stayed unit remains at its authored absolute height; ramps blend to those end datums and keep the 8 cm terrain clearance. `heightAt` is the lift above the queried local ground, not an absolute deck elevation:

| Location / station | Cityscape lift m, north / south ribbon | World lift m, north / south ribbon |
| --- | ---: | ---: |
| West joint, 0 | 0 / 0 | 0.08 / 0.08 |
| West ramp, 100 | 2.548151 / 2.548151 | 1.807833 / 1.973347 |
| Near midpoint, 1680 | 61.999010 / 61.999010 | 61.999010 / 61.999010 |
| East ramp, 2700 | 1.053842 / 1.053842 | 1.227824 / 1.297109 |
| East joint, 2753.759697 | 0 / 0 | 0.08 / 0.08 |

Both headings agree exactly. At each of three camera positions (main span and both joints), **all 28 mapped roadway vertices and 278 dense survey locations** are accepted in both headings: **612 height queries per view**, **1,836 per mode**, with **zero nulls**. Each agrees with the accepted profile/terrain surface within **1.8e−11 m**. Layer active throughout; world DEM present throughout; parent `groupY=0` in both modes. Runtime `heightAt` evidence: `tmp/ravenel/{cityscape,world}-heightAt.json` and `height-summary.json`. The synthetic spot IDs in stock joint reports show `active:false` because they do not name the bridge; the read-only diagnostic checks the real Ravenel layer and confirms it active at both joints.

The live near model's **484 planted y=0 vertices** were measured at each camera: maximum absolute rendered-foot residual **0.021523 m** in Cityscape and **0.022864 m** against DEM in world, within GLB quantization. This measures the current application's sampled DEM, not survey accuracy. Both LODs separately pass synthetic planted-support/repeated-fit tests. Final exported near-light/far-dark sheets: `tmp/ravenel/final-export-{near,far}/`; combined `final-export-montage.jpg` was read back after the final export.

**Ready: true.** Cityscape and world standard-road acceptance passed, as did the required export/catalog/depth/registry checks. **22 app page boots** were used (19 stock visual runs, 3 read-only diagnostics), plus **4 isolated inspector boots: 26 total**, below the task budget. The native server is stopped and both **3301 / 3401 are free** (`tmp/ravenel/ports-after.json`). Generated depth table and renderer bundle are isolated in a separate `generated:` commit for the integrator to drop and regenerate. No shared runtime source, other landmark, shared preview, account gate, Plan issue, online host or branch was changed or published.


Live HD lanes return **503** in this isolated native environment; HD pavement/paint, lane count/dash continuity and paint toggles are **not tested**. Standard road connection and the shared navigation-height API are verified separately; no paired vehicle, driven active route, live traffic feed or hardware test is claimed. Full failure/reanchor/mode-toggle lifecycle and absent/late DEM sequences reuse the shared factory but are not independently exercised for this asset. No contributor consent was fabricated or signed.
