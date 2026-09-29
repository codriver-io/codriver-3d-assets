## Change

Describe the landmark or fix and link its issue. For docs/tooling-only changes, mark model-specific items N/A.

## Source and rights

- [ ] Editable source or generator and reproducible export steps are included.
- [ ] Original contributions: MIT code/docs, CC BY 4.0 models. Reference rights checked; no restricted captures shipped.
- [ ] Creator copyright, attribution, geographic-data license/URL and reference links are recorded.
- [ ] I have read the [Contributor License Agreement](https://github.com/codriver-io/codriver-3d-assets/blob/main/CONTRIBUTOR-LICENSE.md): Codriver receives separate commercial/relicensing rights without individual product attribution; recognition stays in the asset library.
- Outside rights holders’ [acceptance declarations](https://github.com/codriver-io/codriver-3d-assets/blob/main/docs/contribution-acceptance.md), with immutable agreement URL and covered commit: [comment links; this checkbox alone is not acceptance]
- For wholly Codriver-owned work, ownership basis instead: [record or N/A]

Maintainer review (do not pre-check as the submitter):

- [ ] All relevant rights holders and authority verified, declarations match the accepted work, or Codriver ownership is established; independent third-party notices reviewed. CI does not perform this review.

## Model handoff

- Asset ID and catalog/manifest:
- Origin `[longitude, latitude]`, metres, east/up/south, meaning of `y=0`:
- Foundation/pad, abutments, supports and deck attachment assumptions:
- Near/far triangle counts, draw calls and GLB bytes:
- Known approximations:

## Evidence

Add two screenshots with view/detail/source labels and matching reference links. Include an underside/support view for bridges; roof/opposite facade for buildings.

| Check | Verified / not tested / unsupported / N/A | Evidence |
| --- | --- | --- |
| Source → exported GLB, near/far, day/night | | |
| Cityscape (flat ground) | | |
| Full 3D world (topography) | | |
| Mode changes, delayed terrain, LOD and lifecycle in host | | |

The standalone viewer does not verify host integration. Do not enable access gates to complete this table.

- [ ] `pnpm build` and `pnpm check` pass.
- [ ] `pnpm test:browser` passes with the local server running.
- [ ] All GLBs are cataloged, metadata/metrics are current, and limitations are documented.
