// Authoring-time view of the calgary registry: runtime entries plus geometry, views, manifest text and
// OSM ids. Read by the GLB build, the inspector, the screenshot harness and the tests; never by the app bundle.
import { CALGARY_LANDMARKS as RUNTIME } from './registry.js';
import { MANIFEST as lm_calgary_towerManifest } from './calgary-tower/config.js';
import { OSM_WAYS as lm_calgary_towerWays } from './calgary-tower/footprint.js';
import { create as lm_calgary_towerCreate } from './calgary-tower/geometry.js';
import { VIEWS as lm_calgary_towerViews } from './calgary-tower/views.js';
import { MANIFEST as lm_the_bowManifest } from './the-bow/config.js';
import { OSM_WAYS as lm_the_bowWays } from './the-bow/footprint.js';
import { create as lm_the_bowCreate } from './the-bow/geometry.js';
import { VIEWS as lm_the_bowViews } from './the-bow/views.js';
import { MANIFEST as lm_brookfield_place_calgaryManifest } from './brookfield-place-calgary/config.js';
import { OSM_WAYS as lm_brookfield_place_calgaryWays } from './brookfield-place-calgary/footprint.js';
import { create as lm_brookfield_place_calgaryCreate } from './brookfield-place-calgary/geometry.js';
import { VIEWS as lm_brookfield_place_calgaryViews } from './brookfield-place-calgary/views.js';
import { MANIFEST as lm_telus_skyManifest } from './telus-sky/config.js';
import { OSM_WAYS as lm_telus_skyWays } from './telus-sky/footprint.js';
import { create as lm_telus_skyCreate } from './telus-sky/geometry.js';
import { VIEWS as lm_telus_skyViews } from './telus-sky/views.js';
import { MANIFEST as lm_suncor_energy_centreManifest } from './suncor-energy-centre/config.js';
import { OSM_WAYS as lm_suncor_energy_centreWays } from './suncor-energy-centre/footprint.js';
import { create as lm_suncor_energy_centreCreate } from './suncor-energy-centre/geometry.js';
import { VIEWS as lm_suncor_energy_centreViews } from './suncor-energy-centre/views.js';
import { MANIFEST as lm_bankers_hallManifest } from './bankers-hall/config.js';
import { OSM_WAYS as lm_bankers_hallWays } from './bankers-hall/footprint.js';
import { create as lm_bankers_hallCreate } from './bankers-hall/geometry.js';
import { VIEWS as lm_bankers_hallViews } from './bankers-hall/views.js';
import { MANIFEST as lm_scotiabank_saddledomeManifest } from './scotiabank-saddledome/config.js';
import { OSM_WAYS as lm_scotiabank_saddledomeWays } from './scotiabank-saddledome/footprint.js';
import { create as lm_scotiabank_saddledomeCreate } from './scotiabank-saddledome/geometry.js';
import { VIEWS as lm_scotiabank_saddledomeViews } from './scotiabank-saddledome/views.js';
import { MANIFEST as lm_calgary_central_libraryManifest } from './calgary-central-library/config.js';
import { OSM_WAYS as lm_calgary_central_libraryWays } from './calgary-central-library/footprint.js';
import { create as lm_calgary_central_libraryCreate } from './calgary-central-library/geometry.js';
import { VIEWS as lm_calgary_central_libraryViews } from './calgary-central-library/views.js';
import { MANIFEST as lm_studio_bellManifest } from './studio-bell/config.js';
import { OSM_WAYS as lm_studio_bellWays } from './studio-bell/footprint.js';
import { create as lm_studio_bellCreate } from './studio-bell/geometry.js';
import { VIEWS as lm_studio_bellViews } from './studio-bell/views.js';
import { MANIFEST as lm_calgary_city_hallManifest } from './calgary-city-hall/config.js';
import { OSM_WAYS as lm_calgary_city_hallWays } from './calgary-city-hall/footprint.js';
import { create as lm_calgary_city_hallCreate } from './calgary-city-hall/geometry.js';
import { VIEWS as lm_calgary_city_hallViews } from './calgary-city-hall/views.js';
import { MANIFEST as lm_fairmont_palliserManifest } from './fairmont-palliser/config.js';
import { OSM_WAYS as lm_fairmont_palliserWays } from './fairmont-palliser/footprint.js';
import { create as lm_fairmont_palliserCreate } from './fairmont-palliser/geometry.js';
import { VIEWS as lm_fairmont_palliserViews } from './fairmont-palliser/views.js';
import { MANIFEST as lm_canada_olympic_parkManifest } from './canada-olympic-park/config.js';
import { OSM_WAYS as lm_canada_olympic_parkWays } from './canada-olympic-park/footprint.js';
import { create as lm_canada_olympic_parkCreate } from './canada-olympic-park/geometry.js';
import { VIEWS as lm_canada_olympic_parkViews } from './canada-olympic-park/views.js';
import { MANIFEST as lm_calgary_peace_bridgeManifest } from './calgary-peace-bridge/config.js';
import { OSM_WAYS as lm_calgary_peace_bridgeWays } from './calgary-peace-bridge/footprint.js';
import { create as lm_calgary_peace_bridgeCreate } from './calgary-peace-bridge/geometry.js';
import { VIEWS as lm_calgary_peace_bridgeViews } from './calgary-peace-bridge/views.js';
import { MANIFEST as lm_centre_street_bridgeManifest } from './centre-street-bridge/config.js';
import { OSM_WAYS as lm_centre_street_bridgeWays } from './centre-street-bridge/footprint.js';
import { create as lm_centre_street_bridgeCreate } from './centre-street-bridge/geometry.js';
import { VIEWS as lm_centre_street_bridgeViews } from './centre-street-bridge/views.js';
import { MANIFEST as lm_reconciliation_bridgeManifest } from './reconciliation-bridge/config.js';
import { OSM_WAYS as lm_reconciliation_bridgeWays } from './reconciliation-bridge/footprint.js';
import { create as lm_reconciliation_bridgeCreate } from './reconciliation-bridge/geometry.js';
import { VIEWS as lm_reconciliation_bridgeViews } from './reconciliation-bridge/views.js';

const authoring = {
  'calgary-tower': { manifest: lm_calgary_towerManifest, osmWays: lm_calgary_towerWays, create: lm_calgary_towerCreate, views: lm_calgary_towerViews },
  'the-bow': { manifest: lm_the_bowManifest, osmWays: lm_the_bowWays, create: lm_the_bowCreate, views: lm_the_bowViews },
  'brookfield-place-calgary': { manifest: lm_brookfield_place_calgaryManifest, osmWays: lm_brookfield_place_calgaryWays, create: lm_brookfield_place_calgaryCreate, views: lm_brookfield_place_calgaryViews },
  'telus-sky': { manifest: lm_telus_skyManifest, osmWays: lm_telus_skyWays, create: lm_telus_skyCreate, views: lm_telus_skyViews },
  'suncor-energy-centre': { manifest: lm_suncor_energy_centreManifest, osmWays: lm_suncor_energy_centreWays, create: lm_suncor_energy_centreCreate, views: lm_suncor_energy_centreViews },
  'bankers-hall': { manifest: lm_bankers_hallManifest, osmWays: lm_bankers_hallWays, create: lm_bankers_hallCreate, views: lm_bankers_hallViews },
  'scotiabank-saddledome': { manifest: lm_scotiabank_saddledomeManifest, osmWays: lm_scotiabank_saddledomeWays, create: lm_scotiabank_saddledomeCreate, views: lm_scotiabank_saddledomeViews },
  'calgary-central-library': { manifest: lm_calgary_central_libraryManifest, osmWays: lm_calgary_central_libraryWays, create: lm_calgary_central_libraryCreate, views: lm_calgary_central_libraryViews },
  'studio-bell': { manifest: lm_studio_bellManifest, osmWays: lm_studio_bellWays, create: lm_studio_bellCreate, views: lm_studio_bellViews },
  'calgary-city-hall': { manifest: lm_calgary_city_hallManifest, osmWays: lm_calgary_city_hallWays, create: lm_calgary_city_hallCreate, views: lm_calgary_city_hallViews },
  'fairmont-palliser': { manifest: lm_fairmont_palliserManifest, osmWays: lm_fairmont_palliserWays, create: lm_fairmont_palliserCreate, views: lm_fairmont_palliserViews },
  'canada-olympic-park': { manifest: lm_canada_olympic_parkManifest, osmWays: lm_canada_olympic_parkWays, create: lm_canada_olympic_parkCreate, views: lm_canada_olympic_parkViews },
  'calgary-peace-bridge': { manifest: lm_calgary_peace_bridgeManifest, osmWays: lm_calgary_peace_bridgeWays, create: lm_calgary_peace_bridgeCreate, views: lm_calgary_peace_bridgeViews },
  'centre-street-bridge': { manifest: lm_centre_street_bridgeManifest, osmWays: lm_centre_street_bridgeWays, create: lm_centre_street_bridgeCreate, views: lm_centre_street_bridgeViews },
  'reconciliation-bridge': { manifest: lm_reconciliation_bridgeManifest, osmWays: lm_reconciliation_bridgeWays, create: lm_reconciliation_bridgeCreate, views: lm_reconciliation_bridgeViews },
};

export const CALGARY_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const calgaryLandmark = (id) => CALGARY_LANDMARKS.find((l) => l.id === id) || null;
