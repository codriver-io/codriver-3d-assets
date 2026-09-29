# Paris geographic registration — 29 September 2026

The fifteen building models now share a measured geographic registration table in `paris-building-placement.js`. Angles and origins derive from OpenStreetMap building outlines retrieved on 29 September 2026; these are map-derived fits, not a cadastral survey. Architectural detail remains an approximation. The referenced way/relation IDs are recorded per building in `paris-building-footprints.js` (© OpenStreetMap contributors, ODbL 1.0).

The generator translates the authoring center, applies the documented horizontal fit, and rotates about Y. Exports already use east/up/south; a host must not apply the authoring rotation a second time. Vertical dimensions, y=0, material names and LODs remain unchanged. The host alone applies Mercator stretch and a terrain datum.

| Asset | Origin longitude, latitude | Rotation about Y | Horizontal fit X, Z |
| --- | --- | ---: | --- |
| `paris-tour-eiffel` | 2.2944985, 48.8582606 | 45.76° | 1, 1 |
| `paris-arc-de-triomphe` | 2.2950405, 48.8737787 | 64.65° | 1, 1 |
| `paris-notre-dame` | 2.3498345, 48.8528978 | -116.59° | 1, 1 |
| `paris-sacre-coeur` | 2.3430176, 48.8867955 | 4.43° | 0.9, 0.947 |
| `paris-invalides` | 2.3125418, 48.8550484 | -4.57° | 1, 1 |
| `paris-louvre` | 2.3358520, 48.8610140 | -20.50° | 1, 1 |
| `paris-palais-garnier` | 2.3317069, 48.8720387 | 15.87° | 1, 1.079 |
| `paris-grand-palais` | 2.3122732, 48.8661493 | 0.67° | 1.084, 1.159 |
| `paris-petit-palais` | 2.3149565, 48.8660219 | -4.80° | 0.802, 1.043 |
| `paris-musee-orsay` | 2.3265022, 48.8599514 | -24.10° | 0.866, 0.877 |
| `paris-pantheon` | 2.3460829, 48.8462025 | 71.76° | 1, 0.921 |
| `paris-hotel-de-ville` | 2.3525311, 48.8564261 | 70.06° | 0.967, 0.878 |
| `paris-madeleine` | 2.3244655, 48.8700280 | 154.42° | 1, 1 |
| `paris-conciergerie` | 2.3449436, 48.8563941 | -20.50° | 1.08, 1 |
| `paris-institut-de-france` | 2.3370973, 48.8573202 | -16.50° | 0.77, 1 |

The Louvre uses the mapped main pyramid center as its origin; the source pyramid is at authoring (170, 0). The palace wings remain schematic and do not trace every courtyard or setback. The Conciergerie owns only its Seine frontage, and the Institut only the river-facing ensemble; their connected rear palace buildings remain outside replacement ownership. Grand Palais uses its whole mapped building envelope for its horizontal fit, not the published nave dimensions alone. OSM outlines, including steps and projections, need not equal published facade dimensions.

Replacement masks and terrain foundations serve different purposes. Masks follow the provider building envelope, including the upper spans of the Eiffel Tower and Arc de Triomphe; model openings must not leave a giant provider extrusion in the center. Mapped courtyard interiors stay outside building masks. Three metres of tolerance accommodates vector-tile quantization. Only building geometry is masked, after a model loads, and it restores on disable or failure.

The Paris terrain pad follows the mapped convex envelope with an eight-metre support margin, including its open plaza/courts as ground. The terrain datum uses the median mapped perimeter sample; an isolated depressed DEM pixel must not lower the entire plaza. A twelve-metre transition blends the pad into surrounding ground. Buildings remain rigid; bridge bank fitting is separate.

A host must refine a provisional foundation when finer DEM arrives and retain the best resolution on zoom-out or tile eviction. Freezing the first regional DEM sample produced reproducible artificial hills: Eiffel stayed at 62.56 m even after the detailed DEM reported 34 m. Cityscape always uses y=0. Neither standalone library inspection nor desktop renderer tests establish vehicle-hardware performance.
