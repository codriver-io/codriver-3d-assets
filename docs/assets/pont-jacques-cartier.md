# Pont Jacques-Cartier

Green cantilever trusses, four main-span finials, curved Montréal approaches, a raised Seaway span and the occupied Île Sainte-Hélène pavilion with four towers. Revised 30 September 2026.

Original procedural geometry by Codriver / 9570-6198 Québec inc. from public structural and pavilion references. Models: CC BY 4.0; source: MIT. Mapped alignments/footprint © OpenStreetMap contributors, ODbL 1.0. No captured mesh, third-party texture or simulator asset is shipped.

## Geographic frame and assembly

Metres; +X east, +Y up, +Z south. Shared origin `[-73.5417613, 45.5218315]`. Local y=0 represents foundation ground. Heights are relative visual estimates; no terrain DEM or global sea-level datum is baked into the GLBs.

Download the main bridge plus the north-out, south-out, north-in and south-in ramp components for the complete island access kit. Do not centre components independently. The main GLB contains the bridge and pavilion; it does not contain the four ramps. See [placement requirements and mode evidence](jacques-cartier-placement.md).

The island deck is estimated at 22 m, with the pavilion roof contacting the slab underside at about 20.98 m and four towers rising to 33 m. Vertical dimensions, member sections and facade details are approximate. The five-lane deck has fallback authored pavement; a consuming application can replace its markings with its own HD road data.

## Build and inspect

`pnpm build:montreal-landmarks`, then `pnpm build` to stamp licenses and recompute measured bytes.

- [Main bridge generator](../../src/peregrine/landmarks/montreal-bridges-geometry.js)
- [Rigid pavilion generator](../../src/peregrine/landmarks/jacques-pavilion-geometry.js)
- [Ramp generator](../../src/peregrine/landmarks/jacques-island-ramps.js)
- [Measured manifest](../../public/models/landmarks/pont-jacques-cartier.json)
- [Pavilion inspector](https://3d-assets.codriver.io/asset-preview.html?asset=pont-jacques-cartier&view=pavilion)

The main export has 49,416 near triangles / 34 draws and 13,224 far triangles / 5 draws. Including all four ramps: 54,594 near triangles / 46 draws and 17,750 far triangles / 13 draws. The far level uses open-ended truss members, one Warren diagonal per approach panel, and keeps approach trusses and footings no lower than about -1 m. The manifests own exact file sizes after license metadata is added; no mobile or in-car performance claim follows from these counts.

Matching public-viewer captures: [near GLB](../screenshots/jacques-cartier/pavilion-glb-near.png), [far GLB](../screenshots/jacques-cartier/pavilion-glb-far.png), and [editable near source](../screenshots/jacques-cartier/pavilion-procedural-near.png). These establish library geometry inspection; host-mode evidence is reported separately in the placement handoff.

## References

- [JCCBI · island pavilion, roof and four turrets](https://jacquescartierchamplain.ca/en/structures/jacques-cartier-bridge/ile-sainte-helene-pavilion-on-the-jacques-cartier-bridge/)
- [JCCBI · technical and structural reference](https://jacquescartierchamplain.ca/en/structures/jacques-cartier-bridge/about/)
- [CSCE · span dimensions](https://legacy.csce.ca/en/historic-site/jacques-cartier-bridge/)
- [Mapped alignment / footprint · OpenStreetMap](https://www.openstreetmap.org/copyright)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). approach trusses and footings stop at about −1.3 m (were −7.3 m); far LOD 25k → 13k triangles with one Warren diagonal per panel; alignment, profile and pavilion unchanged. Exported cost: near 49,416 triangles / 34 draws / 2,746,908 bytes; far 13,224 / 5 / 724,132.
