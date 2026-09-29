# Contribute a landmark

Want to see a familiar bridge or building on your commute? Suggest it, improve an existing model, or contribute your own. You can work in Blender, write a Three.js generator, or use the shared builder skill with Codex or Claude Code.

[Suggest a landmark](https://github.com/codriver-io/codriver-3d-assets/issues/new?template=landmark.yml) · [Report a model problem](https://github.com/codriver-io/codriver-3d-assets/issues/new?template=model-problem.yml) · [Explore the library](https://codriver-3d-assets.pages.dev/)

## 1. Choose the place and check its sources

Search the catalog and existing issues first. For a substantial new model, open a landmark proposal with its name, city, map coordinates and reference links. A proposal is useful before spending days modeling; small fixes can go straight to a pull request.

Use original geometry and assets you have the right to contribute. A model downloaded from a simulator, a map provider or a “free” asset site is not automatically redistributable. Link reference photos and plans rather than copying them into the repository without permission. Record which dimensions are published, mapped or visually estimated. Models here are visual approximations, not surveys.

Public releases use **MIT** for code, procedural generators and documentation, and **CC BY 4.0** for original model files. For an outside contribution, also expressly accept the [Contributor License Agreement](CONTRIBUTOR-LICENSE.md): you keep ownership and grant Codriver permanent, worldwide, royalty-free commercial and sublicensing rights **without individual attribution in its apps or products**. Contributor recognition is provided in the 3D asset library; keep truthful copyright and public-license attribution in the catalog. See [how to record acceptance on GitHub](docs/contribution-acceptance.md). Geographic data retains its own license: OpenStreetMap-derived alignments/footprints require ODbL and contributor credit. See [LICENSES.md](LICENSES.md). AI assistance does not replace provenance or visual review.

## 2. Fork and run the collection

Use GitHub’s **Fork** button, clone your fork, and create a branch. Install Node 22+ and the pnpm version in `package.json`, then:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm check
pnpm dev
```

Open `http://localhost:4173`. The collection and inspector work without an account, a map API key or a Codriver app checkout. Keep the local server running for browser checks.

## 3. Create or import the model

The default is **editable procedural source plus self-contained GLB delivery**. A Blender-authored model is also welcome: include its editable source and exact export steps. A procedural generator is optional for imported models; the inspector can show GLBs alone.

- Use real **metres**, **+X east, +Y up, +Z south**, and a nearby `[longitude, latitude]` origin. Keep vertices local to that origin; do not export global Mercator coordinates.
- Document what local `y=0` means. Do not bake a terrain DEM, sea-level offset, Mercator scale or camera datum into the reusable GLB.
- Keep the silhouette recognizable. For bridges, match deck arrangement, span rhythm, tower/cable patterns and distinctive supports. For buildings, match footprint, height, roof, facade rhythm and openings.
- Export `near` and `far` GLBs, keeping important openings and structural contacts in both. Start with the closest existing landmark as a cost reference. Measure triangles, draw calls and bytes; there is no universal triangle budget and desktop timing is not in-car performance.
- Prefer simple self-contained materials. Avoid external textures and new geometry decoders unless agreed in the proposal. Apply transforms and inspect normals, winding and bounds after export.
- Keep buildings rigid. Bridge foundations, supports and decks must be identifiable so a host can place or fit them without stretching the whole structure.

### Cityscape and Full 3D world

One source asset should support both host environments. **Cityscape has a flat ground reference; Full 3D world uses topography.** The standalone viewer does not implement either app integration, so viewing a model here is not proof that it works on terrain.

For a building, describe a base plane/footprint and any separate terraces or site levels. The host chooses a rigid foundation datum or an explicit pad; it must not bend the facade to follow the ground. For a bridge, provide the alignment, abutments and support footprints: the deck spans the valley while the piers reach their local ground. It must not follow the riverbed point by point.

Report each mode as **verified**, **not tested**, or **unsupported**, with evidence. Do not invent a terrain result or enable a product gate to get a screenshot. See the [placement contract and verification matrix](docs/adr/0002-cityscape-and-topography.md).

## 4. Register the asset

Use an existing catalog record and manifest as the starting point. See the [submission checklist](docs/model-submission.md) for the required files and metadata.

1. Add the generator under `src/peregrine/landmarks/`, or editable authoring source under `sources/<id>/`. Register a procedural creator in `src/asset-preview.js` only if one exists.
2. Put exports and their JSON manifest under `public/models/{landmarks,bridges,buildings}/`. Give the model a stable kebab-case ID.
3. Add a **ready**, redistribution-cleared entry to `prototypes/assets3d/catalog.json`, including references, editable source path, copyright, attribution, geographic-data license and documentation. Public releases contain ready assets; unfinished or restricted material belongs in an issue or draft PR.
4. For a generator, add a `build:<id>` script to `package.json`. `pnpm models:build` runs these scripts. For a manual model, document the export procedure instead.
5. Add `docs/assets/<id>.md` with dimensions, coordinate frame, provenance, approximations, costs, inspection links and mode evidence. Choose useful facade/roof views for a building and support/deck/overview views for a bridge.

The build adds license metadata and recomputes byte counts after stamping. `glbMetrics()` in `scripts/asset-catalog.mjs` measures the default scene. Include the resulting manifest/GLB changes in your PR. Every runtime GLB must belong to a catalog entry.

## 5. Validate and show the result

```sh
# If you added or changed a generator, run its documented build:<id> command first.
pnpm build
pnpm check
pnpm exec playwright install chromium
pnpm test:browser
```

Open `/asset-preview.html?asset=<id>`. Inspect near/far, day/night, and exported geometry; compare procedural geometry when available. Look underneath the bridge and behind the building, not just from the flattering angle. Include at least two screenshots in the PR, with the asset ID, detail level and view. Include a reference link for the matching angle.

The GitHub workflow runs the build, catalog/metadata checks and browser checks for pull requests. It has no publishing credentials. A maintainer may need to approve a first-time contributor’s workflow run. Passing it validates the library; app integration and terrain QA are separate.

## 6. Open a pull request and record permission

Push to your fork and use GitHub’s **Compare & pull request** button, targeting `codriver-io/codriver-3d-assets:main`. Fill in the supplied template: linked issue, source/license, frame, measured costs, screenshots, and Cityscape/topography status. Mark untested checks honestly. Each outside rights holder must post the explicit [acceptance declaration](docs/contribution-acceptance.md) for the covered work; a template checkbox or an AI-generated signature is not consent. Maintainers verify authority and the declaration before merging. Maintainers review the model and publish accepted assets to the library; merging does not automatically promise inclusion in the driving app.

## Use the builder skill

This repository includes [build-3d-landmarks](.agents/skills/build-3d-landmarks/SKILL.md), with separate bridge and building references. It contains public modeling guidance only and is licensed under MIT.

- **Codex CLI/IDE:** open the clone and invoke `$build-3d-landmarks`, or ask Codex to use that skill.
- **Claude Code:** open the clone and invoke `/build-3d-landmarks`. Its `.claude/skills/` entry points to the same skill directory.
- **Other clients:** provide `SKILL.md` and the referenced files as context. The skill needs ordinary file/shell/browser tools, not a particular model or private service.

Example request:

> Use the build-3d-landmarks skill to model [landmark, city] from these reference links. Deliver editable source, near/far GLBs, a catalog entry and two inspection screenshots. Document the local base datum and Cityscape/topography placement assumptions. Report anything not verified.

Both native discovery layouts follow the [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skill documentation](https://code.claude.com/docs/en/skills). Git checkouts preserve the Claude directory symlink on supported systems. If your checkout materializes symlinks as text files, copy `.agents/skills/build-3d-landmarks/` into `.claude/skills/build-3d-landmarks/`; keep the contents identical. `pnpm check:contributions` checks either layout.
