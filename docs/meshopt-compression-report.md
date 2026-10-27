# Public-library compression report

All 838 shipped bridge/building/landmark GLBs were converted from this library's own source revision `890229f426848e7b2b6f23e50a7e8180d3fb3657`; no app binaries were copied over the library's model versions. The 415 manifests now match their compact exports. The additional downloadable Jacques-Cartier scene archive includes four compact GLBs and updated content hashes.

| Collection metric | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| GLB bytes | 718,082,764 | 236,598,528 | 67.05% |
| GLB Brotli Q11 bytes | 111,593,032 | 58,652,932 | 47.44% |
| Loaded geometry buffer bytes | 707,114,946 | 415,148,970 | 41.29% |

Geometry counts sum the complete collection, not a simultaneously loaded scene or measured GPU-process resident memory. They use the app's `sceneMemory` accounting after the loader removes CPU-only source attributes. No Tesla hardware measurement is claimed. The library is a second distribution of the assets; this conversion does not add another 292 MB saving to the already optimized app collection.

| Pilot, near variant | GLB bytes | Brotli Q11 bytes | Loaded geometry bytes |
| --- | ---: | ---: | ---: |
| samuel-de-champlain | 1,602,276 → 778,168 | 332,340 → 288,285 | 1,570,956 → 996,900 |
| pont-jacques-cartier | 2,746,908 → 1,146,960 | 377,446 → 342,173 | 2,703,408 → 1,800,816 |
| cambie-bridge | 3,849,104 → 1,630,572 | 457,992 → 335,331 | 3,811,504 → 2,376,280 |
| golden-gate-bridge | 1,771,080 → 467,808 | 420,367 → 78,083 | 1,755,276 → 1,035,060 |
| cn-tower | 506,252 → 133,032 | 84,529 → 29,779 | 497,748 → 293,508 |
| tower-bridge | 2,098,240 → 982,352 | 233,393 → 306,865 | 2,086,840 → 1,279,780 |

The ZIP download shrank from **3,341,891 to 1,152,609 bytes (65.51%)**. Its four contained GLBs shrink from 10,682,236 to 3,171,184 raw bytes, and from 10,536,912 to 7,053,432 loaded geometry bytes (33.06%). The archive includes geometry already fitted to its standalone terrain presets; its metadata continues to mark host Cityscape and Full 3D world integration as not tested.

44 variants grow under Brotli Q11, by 1,607,100 bytes in total. Of those, 41 carry exact Float32 CPU authoring inputs, deliberately retained where attachment/station decisions can change at piecewise boundaries; three other variants account for 9,272 bytes of format/entropy overhead. They are meshopt-compressed in downloads and removed from rendered geometry. The entire collection still improves under Brotli by 47.44%.

The codec preserves vertex/index order, named meshes/materials, licensing, opaque extras and custom attachment streams. Positions use normalized Int16 and normals normalized Int8. Exact flags, the shared codec API, loader requirements and regeneration commands are in [meshopt-compression.md](meshopt-compression.md). All 21 exporter recipes produce compact exports directly; a catalog check rejects stale costs and missing compression/quantization. The inspectors and Node GLB tests use the shared decoder/frame loader. Existing float GLBs remain loadable.

Evidence:

- [Per-variant before/after measurements and hashes](meshopt-compression-metrics.json). All 838 public GLB SHA256 values match their semantically validated candidates after the final build/license pass.
- [Accepted model capture inventory](meshopt-compression-visual.json): 24 raw/encoded paired captures (all 48 PNG files verified), six pilots, near/far, day overview and night supports/roof, 1254×784 CSS pixels at DPR 1.53 (1919×1200 screenshots).
- Original/candidate snapshots and logs: `tmp/meshopt-all/{before,after}/`, `metrics.json`, `run.log`; build/check logs: `tmp/build-final.log`, `tmp/check-final.log`.
- Model screenshots: `tmp/meshopt-visual/{before,after}/` for Champlain, Jacques-Cartier, Golden Gate, CN Tower and Tower Bridge; `tmp/meshopt-visual-cambie/{before,after}/` for Cambie. Preliminary Cambie captures with an unsupported `piers` preset or an obstructed existing `underside` preset are excluded. The accepted facade preset clearly shows its deck and supports.
- Offline scene preset screenshots: `tmp/meshopt-scene-visual/{before,after}/`, eight raw/encoded paired views (all 16 PNG files verified) across near/far/Cityscape/world preset files. These are standalone rendered preset files, not live app mode tests.
- [Offline scene measurements](meshopt-scene-compression-metrics.json); archive validity/hashes checked after extraction. Repacking the already optimized archive is byte-identical (SHA256 `8cab04b2a4827fdde4a8c3c9ab5f4156802c95076c5f5aedbb3dbf93fca2bc7f`).

The paired model and scene captures have no renderer/asset errors. Visible inspected regions retain silhouette, placement, support contacts and shading within the quantization tolerance; image differences include subpixel edges and normal rounding. Viewer captures cannot establish HD-road draping, navigation elevation, live terrain foundations or app-mode rollout. Those remain outside this library-only change. The app has its own separate compression/integration evidence.

Validation: `pnpm build` and `pnpm check` pass, including 415 catalog entries, 838 GLBs, the offline archive, contribution/license checks, 11 geometric architecture tests, five codec/frame tests and the license-stamping test. The complete 415-viewer `pnpm test:browser http://localhost:4257 tmp/browser-final` gate passes with zero page errors or failed local requests, covering GLB/procedural, near/far, day/night, mobile/desktop, downloads and the Champlain viewer. Full report: `tmp/browser-final/report.json`; log: `tmp/browser-final.log`. Independent lead review inspected the codec/loader/metadata changes and full-resolution paired Champlain/Cambie/offline-pavilion captures with no new geometry or shading findings. No deployment, main/staging merge or restricted/reference source conversion was performed.
