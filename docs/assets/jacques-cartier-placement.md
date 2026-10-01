# Jacques-Cartier placement handoff

The main bridge and four island access ramps use the same local metric origin `[-73.5417613, 45.5218315]`, +X east, +Y up, +Z south. Assemble them without centring each component. The reusable GLBs contain estimated relative structural heights; terrain, sea-level elevation and host scene offsets are applied by the consuming application.

## Structural revision, 30 September 2026

The former island profile compressed the roadway to five metres and the pavilion into a low block. The revised model puts the deck at 22 estimated metres above island foundation ground. The mapped pavilion reaches the slab underside at about 20.98 m; four towers reach 33 m. These heights are visual estimates, not dimensions published by the bridge authority. Seven-metre approach trusses preserve the steel silhouette and continuous supports. Four separately exported concrete ramp paths follow mapped island-access alignments.

The [JCCBI pavilion reference](https://jacquescartierchamplain.ca/en/structures/jacques-cartier-bridge/ile-sainte-helene-pavilion-on-the-jacques-cartier-bridge/) establishes that the occupied pavilion roof supports the deck and describes its four turrets. [JCCBI bridge information](https://jacquescartierchamplain.ca/en/structures/jacques-cartier-bridge/about/) supplies structural context and published widths. Original geometry is CC BY 4.0; source is MIT. Alignments and footprints remain © OpenStreetMap contributors, ODbL 1.0.

## Host contract

The manifest records bank-fit controls, the bounded pavilion foundation footprint and `_bridgebase`. Every pavilion vertex receives one rigid island translation; roadway width/elevation fitting must not stretch its walls or towers. Deck controls interpolate between banks and the island; sampling the riverbed at every deck vertex collapses the structure.

Outgoing ramps descend from the main deck to independently fitted street approaches. Incoming ramps fork from an outgoing ramp and end at the main bridge. Fit outgoing ramps first, then evaluate each fork's accepted height. All loop junctions share the island datum; only the final 45 m of an outgoing street approach blend to their own ground. Refit from immutable authoring vertices after terrain or approach changes.

Navigation routes, vehicles, road paint and rendered decks must consume the same accepted surface. A landmark deck replaces an already fitted generic road datum; adding both creates doubled elevation. Terrain unavailability must restore the prior host surface and mask, rather than accepting missing data as zero metres.

## Verification scope

| Mode | Result | Evidence / limits |
| --- | --- | --- |
| Standalone library | Verified | Source and near/far GLBs inspected at matching pavilion angles, with day/night checks; exported metadata measured after license stamping. |
| Cityscape | Verified in local Codriver/Peregrine integration, 30 Sep 2026 | Flat ground, real mapped HD pavement and markings, all five components, connected forks, painted/unpainted views and route/vehicle deck agreement. |
| Full 3D world / topography | Verified in local Codriver/Peregrine integration, 30 Sep 2026 | AWS Mapzen terrain, bank-fit deck, rigid pavilion base, bounded foundation pad, HD road overlays, shared ramp junctions and 12 directional navigation-height checks. Automated regression covers missing/late terrain and repeated mode changes. |

The normal authenticated product rollout and in-car device performance were not tested. The public library viewer has no terrain engine and does not reproduce those host checks. Local renderer validation does not enable a product rollout gate.
