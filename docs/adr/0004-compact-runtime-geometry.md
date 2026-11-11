# ADR-0004: Keep runtime GLB geometry compact

- Status: Accepted
- Date: 2026-10-29
- Related: [format and loader contract](../meshopt-compression.md), [compression report](../meshopt-compression-report.md), [asset pipeline](0001-open-landmark-pipeline.md), [submission checklist](../model-submission.md)

## Context

The models in this library are drawn by the codriver driving app, inside a car's browser. That browser has a fixed memory allowance, and it closes the page ("Aw, Snap!") when it runs short. What closes the page is mostly how much memory arrives at once while models and map tiles load, not what stays in memory afterwards.

On 2026-10-27, the app shipped this library's meshopt-compressed, quantized landmarks: 838 GLBs, 718 → 237 MB raw, and 708 → 416 MB of loaded GPU geometry. They went out together with compact map buffers. In the days that followed, the app measured about 90% fewer browser closures on its most common car computer.

A compact model downloads, decodes and uploads in smaller pieces, and it stays quantized on the GPU. That makes compact geometry a reliability requirement for this library, not an optional size saving.

## Decision

1. **Every runtime GLB goes through the shared exporter's meshopt compression and quantized attributes** ([format](../meshopt-compression.md)). Don't bypass it, and don't commit an uncompressed runtime GLB. Editable sources and authoring masters are unaffected.
2. **Record loaded GPU geometry bytes** alongside triangles, draws and download bytes; the manifest's metrics carry them. A model's compressed download size isn't its memory cost.
3. **Keep the quantization error within the recorded tolerance.** A model that needs more precision explains why in its asset doc.
4. **Keep both detail levels lean, the far one especially:** it's the one most cars hold while driving past.
5. **New decoders and texture formats still need agreement in the landmark proposal** ([CONTRIBUTING](../../CONTRIBUTING.md)).

## Consequences

- **Consumers need `EXT_meshopt_compression` and `KHR_mesh_quantization`.** The library's inspectors include the decoder.
- **Blender or other imported models are converted with the exporter's commands** ([format](../meshopt-compression.md)) before they're registered.
- **Reviewers compare a new model's GPU geometry bytes with the closest existing landmark's.** A model well above it is a review question, as triangles and draws already are.

## Alternatives considered

- **Uncompressed GLBs:** the simplest delivery, but several times heavier in memory and in download.
- **Draco:** small downloads, but it decodes back to full-size float attributes, so it saves no GPU memory, and it adds a WebAssembly decoder.
