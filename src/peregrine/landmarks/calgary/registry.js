// The calgary landmark registry the RUNTIME reads: spec, palettes, footprints and (for a road-carrying
// bridge) its road layer. Geometry, views and manifest text are authoring-time only (authoring.js).
// File contract: docs/3d-calgary-landmarks.md.
import { SPEC as lm_calgary_towerSpec, PALETTES as lm_calgary_towerPalettes } from './calgary-tower/config.js';
import { FOOTPRINTS as lm_calgary_towerFootprints } from './calgary-tower/footprint.js';
import { SPEC as lm_the_bowSpec, PALETTES as lm_the_bowPalettes } from './the-bow/config.js';
import { FOOTPRINTS as lm_the_bowFootprints } from './the-bow/footprint.js';
import { SPEC as lm_brookfield_place_calgarySpec, PALETTES as lm_brookfield_place_calgaryPalettes } from './brookfield-place-calgary/config.js';
import { FOOTPRINTS as lm_brookfield_place_calgaryFootprints } from './brookfield-place-calgary/footprint.js';
import { SPEC as lm_telus_skySpec, PALETTES as lm_telus_skyPalettes } from './telus-sky/config.js';
import { FOOTPRINTS as lm_telus_skyFootprints } from './telus-sky/footprint.js';
import { SPEC as lm_suncor_energy_centreSpec, PALETTES as lm_suncor_energy_centrePalettes } from './suncor-energy-centre/config.js';
import { FOOTPRINTS as lm_suncor_energy_centreFootprints } from './suncor-energy-centre/footprint.js';
import { SPEC as lm_bankers_hallSpec, PALETTES as lm_bankers_hallPalettes } from './bankers-hall/config.js';
import { FOOTPRINTS as lm_bankers_hallFootprints } from './bankers-hall/footprint.js';
import { SPEC as lm_scotiabank_saddledomeSpec, PALETTES as lm_scotiabank_saddledomePalettes } from './scotiabank-saddledome/config.js';
import { FOOTPRINTS as lm_scotiabank_saddledomeFootprints } from './scotiabank-saddledome/footprint.js';
import { SPEC as lm_calgary_central_librarySpec, PALETTES as lm_calgary_central_libraryPalettes } from './calgary-central-library/config.js';
import { FOOTPRINTS as lm_calgary_central_libraryFootprints } from './calgary-central-library/footprint.js';
import { SPEC as lm_studio_bellSpec, PALETTES as lm_studio_bellPalettes } from './studio-bell/config.js';
import { FOOTPRINTS as lm_studio_bellFootprints } from './studio-bell/footprint.js';
import { SPEC as lm_calgary_city_hallSpec, PALETTES as lm_calgary_city_hallPalettes } from './calgary-city-hall/config.js';
import { FOOTPRINTS as lm_calgary_city_hallFootprints } from './calgary-city-hall/footprint.js';
import { SPEC as lm_fairmont_palliserSpec, PALETTES as lm_fairmont_palliserPalettes } from './fairmont-palliser/config.js';
import { FOOTPRINTS as lm_fairmont_palliserFootprints } from './fairmont-palliser/footprint.js';
import { SPEC as lm_canada_olympic_parkSpec, PALETTES as lm_canada_olympic_parkPalettes } from './canada-olympic-park/config.js';
import { FOOTPRINTS as lm_canada_olympic_parkFootprints } from './canada-olympic-park/footprint.js';
import { SPEC as lm_calgary_peace_bridgeSpec, PALETTES as lm_calgary_peace_bridgePalettes } from './calgary-peace-bridge/config.js';
import { FOOTPRINTS as lm_calgary_peace_bridgeFootprints } from './calgary-peace-bridge/footprint.js';
import { SPEC as lm_centre_street_bridgeSpec, PALETTES as lm_centre_street_bridgePalettes } from './centre-street-bridge/config.js';
import { FOOTPRINTS as lm_centre_street_bridgeFootprints } from './centre-street-bridge/footprint.js';
import { ROAD_LAYER as lm_centre_street_bridgeRoad } from './centre-street-bridge/layer.js';
import { SPEC as lm_reconciliation_bridgeSpec, PALETTES as lm_reconciliation_bridgePalettes } from './reconciliation-bridge/config.js';
import { FOOTPRINTS as lm_reconciliation_bridgeFootprints } from './reconciliation-bridge/footprint.js';
import { ROAD_LAYER as lm_reconciliation_bridgeRoad } from './reconciliation-bridge/layer.js';

const entry = (spec, palettes, footprints, roadLayer = null) => Object.freeze({
  id: spec.id, spec, palettes, footprints, roadLayer,
  dir: spec.kind === 'bridge' ? 'bridges' : 'buildings',
});

export const CALGARY_LANDMARKS = Object.freeze([
  entry(lm_calgary_towerSpec, lm_calgary_towerPalettes, lm_calgary_towerFootprints),
  entry(lm_the_bowSpec, lm_the_bowPalettes, lm_the_bowFootprints),
  entry(lm_brookfield_place_calgarySpec, lm_brookfield_place_calgaryPalettes, lm_brookfield_place_calgaryFootprints),
  entry(lm_telus_skySpec, lm_telus_skyPalettes, lm_telus_skyFootprints),
  entry(lm_suncor_energy_centreSpec, lm_suncor_energy_centrePalettes, lm_suncor_energy_centreFootprints),
  entry(lm_bankers_hallSpec, lm_bankers_hallPalettes, lm_bankers_hallFootprints),
  entry(lm_scotiabank_saddledomeSpec, lm_scotiabank_saddledomePalettes, lm_scotiabank_saddledomeFootprints),
  entry(lm_calgary_central_librarySpec, lm_calgary_central_libraryPalettes, lm_calgary_central_libraryFootprints),
  entry(lm_studio_bellSpec, lm_studio_bellPalettes, lm_studio_bellFootprints),
  entry(lm_calgary_city_hallSpec, lm_calgary_city_hallPalettes, lm_calgary_city_hallFootprints),
  entry(lm_fairmont_palliserSpec, lm_fairmont_palliserPalettes, lm_fairmont_palliserFootprints),
  entry(lm_canada_olympic_parkSpec, lm_canada_olympic_parkPalettes, lm_canada_olympic_parkFootprints),
  entry(lm_calgary_peace_bridgeSpec, lm_calgary_peace_bridgePalettes, lm_calgary_peace_bridgeFootprints),
  entry(lm_centre_street_bridgeSpec, lm_centre_street_bridgePalettes, lm_centre_street_bridgeFootprints, lm_centre_street_bridgeRoad),
  entry(lm_reconciliation_bridgeSpec, lm_reconciliation_bridgePalettes, lm_reconciliation_bridgeFootprints, lm_reconciliation_bridgeRoad),
]);

export const calgaryLandmark = (id) => CALGARY_LANDMARKS.find((l) => l.id === id) || null;
