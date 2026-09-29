# Model submission checklist

Use this checklist for a bridge or building. [CONTRIBUTING.md](../CONTRIBUTING.md) is the complete walkthrough.

- [ ] Identity: stable ID, current/historical version, kind, city and coordinates.
- [ ] Provenance: primary references; published versus estimated dimensions; rights to source, geometry and textures.
- [ ] Editable source and reproducible build/export steps.
- [ ] For outside work, each rights holder’s explicit [contributor-license acceptance](contribution-acceptance.md), agreement version/permalink and covered PR/commit are verified; the declaration permalink is recorded in provenance notes. A bot signature or public license alone is not separate Codriver product permission.
- [ ] Self-contained near/far GLBs, with matching silhouette and usable bounds.
- [ ] Manifest: `id`, `[longitude, latitude]` origin, `units: "metres"`, `axes: { x: "east", y: "up", z: "south" }`, named variants and measured `bytes`, `triangles`, `drawCalls`.
- [ ] Local `y=0` datum, rotation/orientation, footprint and support/abutment attachment assumptions documented.
- [ ] Catalog: `name`, `kind`, `location`, `status: "ready"`, description, notes, source path/provenance/reference links/source URL, manifest, documentation, inspector URL/views.
- [ ] Credit: `license: "CC-BY-4.0"`, `codeLicense: "MIT"`, contributor `copyright`, `attribution`, `geographicDataLicense` and `geographicDataUrl`. Use `"none"` and omit the geographic URL only when no separately licensed geographic dataset was used; explain that in provenance. OSM-derived data uses `"ODbL-1.0"` and `https://www.openstreetmap.org/copyright`.
- [ ] The source URL uses this repository’s `blob/main/` path, including before the PR merges; reference links point to the external evidence.
- [ ] Two or more screenshots showing source/export, near/far and relevant structural views. Record day/night checks.
- [ ] Measured size/draw/triangle costs; no unsupported device performance claims.
- [ ] Separate Cityscape and Full 3D world results: verified with environment/revision/evidence, not tested, or unsupported with reason. A standalone viewer result is only a viewer result.
- [ ] `pnpm build`, `pnpm check`, browser checks passed, or exact outstanding failure reported.

For procedural models, provide `createName({ detail })` returning a Three.js Object3D and add it to the inspector’s creator registry. For manual sources, leave the procedural selector disabled; do not supply a fake generator. When adding variants, keep the download links, costs and preview selector in agreement.
