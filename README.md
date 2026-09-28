# Codriver 3D assets

Public source: [codriver-io/codriver-3d-assets](https://github.com/codriver-io/codriver-3d-assets).

An open collection of Montréal landmarks: 14 bridges and buildings, 36
self-contained GLB variants, and the editable Three.js generators behind them.

**[Explore the public library](https://codriver-3d-assets.pages.dev/)** ·
**[Licensing](LICENSES.md)**

The library is public, without accounts or passwords. Orbit each model, compare
near/far detail, switch between procedural and exported geometry, and download
the GLBs. Champlain also has its original pier, tower and driving views.

Included: Samuel-De Champlain, Victoria, Jacques-Cartier and Honoré-Mercier
bridges; Biosphère, Farine Five Roses, Orange Julep, Place Ville Marie and
L’Anneau, Habitat 67, Olympic Stadium and Montréal Tower, La Grande Roue,
Notre-Dame Basilica, Clock Tower, and Saint Joseph's Oratory.

## Use a model

Download a GLB from the library and import it in Blender, Three.js or another
glTF 2.0 tool. The models use metres, +X east, +Y up and +Z south, with a local
geographic origin recorded in each JSON manifest. No external textures or
special geometry decoders are required. Near/far variants represent detail
levels. Mercier includes complete models and independently usable bridge
partitions; don't render the complete model and partitions together.

The original source paths are retained to make the models' dependency graph
easy to follow. `src/peregrine/landmarks/` contains the generators and their
local coordinate data. This is a standalone asset library; no Codriver account,
application server or map service is needed.

## Build and preview

Requires Node 22+ and pnpm 11.2.2.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm check
pnpm dev
```

Open http://localhost:4173. `dist/` is the static Cloudflare Pages output.

For browser validation, keep the local server running, then run
`pnpm exec playwright install chromium` once and `pnpm test:browser`.
The check covers every cataloged model, both geometry sources, detail/theme
controls, the Champlain pier view and desktop/mobile catalog layouts.

To edit and regenerate models:

```sh
pnpm models:build
pnpm build
pnpm check
```

Individual `build:*` scripts are listed in `package.json` and each model's
documentation. After an individual export, `pnpm build` attaches license
metadata and recalculates the measured file sizes in its manifest. Full
regeneration works from an empty `public/models/` directory.

## Licenses and credit

Code: **MIT**. Original models: **CC BY 4.0**, credited to Codriver /
9570-6198 Québec inc. Geographic source data retains **ODbL 1.0** and
OpenStreetMap contributor attribution. See [LICENSES.md](LICENSES.md) for a
ready-to-use attribution and the scope of each license.

## Add an asset

Add the generator, its GLBs and a measured manifest; register it in
`prototypes/assets3d/catalog.json`. Include provenance, references, coordinate
frame, known approximations, license and inspection views. Extend the inspector
creator registry for procedural preview, then run the build and checks. Only
original, redistribution-ready models belong in the public collection.

## Deploy

With Cloudflare Pages access configured locally:

```sh
pnpm deploy
```

This uses direct upload to the `codriver-3d-assets` Pages project. GitHub stores
the public source; publishing a source commit alone does not deploy Pages.
No credentials are stored in this repository.
