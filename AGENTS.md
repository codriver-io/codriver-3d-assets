# Working on Codriver 3D assets

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [ADRs](docs/adr/0001-open-landmark-pipeline.md) before adding a landmark. Use the repository’s [build-3d-landmarks skill](.agents/skills/build-3d-landmarks/SKILL.md) for bridge/building modeling.

Keep editable source, near/far GLBs, the catalog, measured manifest and provenance in sync. Preserve contributor credit and geographic-data licenses. Use local metres (+X east, +Y up, +Z south); do not bake runtime terrain or Mercator scale into GLBs. Report Cityscape and Full 3D world validation separately.

Run `pnpm build`, `pnpm check` and the relevant browser checks. `pnpm dev` serves only the static library locally. A library preview does not establish app integration. Publishing is a maintainer operation, not part of building a proposed model. No account, map service or deployment credential is required for contribution.
