// Authoring-time view of the San Francisco registry: the runtime entries plus geometry,
// inspector views, manifest text and OSM ids. Read by the GLB build, the inspector, the
// screenshot harness and the tests; never by the app bundle.
import { SAN_FRANCISCO_LANDMARKS as RUNTIME } from './registry.js';
import { MANIFEST as lm_golden_gate_bridgeManifest } from './golden-gate-bridge/config.js';
import { OSM_WAYS as lm_golden_gate_bridgeWays } from './golden-gate-bridge/footprint.js';
import { create as lm_golden_gate_bridgeCreate } from './golden-gate-bridge/geometry.js';
import { VIEWS as lm_golden_gate_bridgeViews } from './golden-gate-bridge/views.js';
import { MANIFEST as lm_bay_bridge_west_spanManifest } from './bay-bridge-west-span/config.js';
import { OSM_WAYS as lm_bay_bridge_west_spanWays } from './bay-bridge-west-span/footprint.js';
import { create as lm_bay_bridge_west_spanCreate } from './bay-bridge-west-span/geometry.js';
import { VIEWS as lm_bay_bridge_west_spanViews } from './bay-bridge-west-span/views.js';
import { MANIFEST as lm_bay_bridge_east_spanManifest } from './bay-bridge-east-span/config.js';
import { OSM_WAYS as lm_bay_bridge_east_spanWays } from './bay-bridge-east-span/footprint.js';
import { create as lm_bay_bridge_east_spanCreate } from './bay-bridge-east-span/geometry.js';
import { VIEWS as lm_bay_bridge_east_spanViews } from './bay-bridge-east-span/views.js';
import { MANIFEST as lm_lefty_odoul_bridgeManifest } from './lefty-odoul-bridge/config.js';
import { OSM_WAYS as lm_lefty_odoul_bridgeWays } from './lefty-odoul-bridge/footprint.js';
import { create as lm_lefty_odoul_bridgeCreate } from './lefty-odoul-bridge/geometry.js';
import { VIEWS as lm_lefty_odoul_bridgeViews } from './lefty-odoul-bridge/views.js';
import { MANIFEST as lm_transamerica_pyramidManifest } from './transamerica-pyramid/config.js';
import { OSM_WAYS as lm_transamerica_pyramidWays } from './transamerica-pyramid/footprint.js';
import { create as lm_transamerica_pyramidCreate } from './transamerica-pyramid/geometry.js';
import { VIEWS as lm_transamerica_pyramidViews } from './transamerica-pyramid/views.js';
import { MANIFEST as lm_salesforce_towerManifest } from './salesforce-tower/config.js';
import { OSM_WAYS as lm_salesforce_towerWays } from './salesforce-tower/footprint.js';
import { create as lm_salesforce_towerCreate } from './salesforce-tower/geometry.js';
import { VIEWS as lm_salesforce_towerViews } from './salesforce-tower/views.js';
import { MANIFEST as lm_555_california_streetManifest } from './555-california-street/config.js';
import { OSM_WAYS as lm_555_california_streetWays } from './555-california-street/footprint.js';
import { create as lm_555_california_streetCreate } from './555-california-street/geometry.js';
import { VIEWS as lm_555_california_streetViews } from './555-california-street/views.js';
import { MANIFEST as lm_columbus_towerManifest } from './columbus-tower/config.js';
import { OSM_WAYS as lm_columbus_towerWays } from './columbus-tower/footprint.js';
import { create as lm_columbus_towerCreate } from './columbus-tower/geometry.js';
import { VIEWS as lm_columbus_towerViews } from './columbus-tower/views.js';
import { MANIFEST as lm_ferry_buildingManifest } from './ferry-building/config.js';
import { OSM_WAYS as lm_ferry_buildingWays } from './ferry-building/footprint.js';
import { create as lm_ferry_buildingCreate } from './ferry-building/geometry.js';
import { VIEWS as lm_ferry_buildingViews } from './ferry-building/views.js';
import { MANIFEST as lm_sfmomaManifest } from './sfmoma/config.js';
import { OSM_WAYS as lm_sfmomaWays } from './sfmoma/footprint.js';
import { create as lm_sfmomaCreate } from './sfmoma/geometry.js';
import { VIEWS as lm_sfmomaViews } from './sfmoma/views.js';
import { MANIFEST as lm_san_francisco_city_hallManifest } from './san-francisco-city-hall/config.js';
import { OSM_WAYS as lm_san_francisco_city_hallWays } from './san-francisco-city-hall/footprint.js';
import { create as lm_san_francisco_city_hallCreate } from './san-francisco-city-hall/geometry.js';
import { VIEWS as lm_san_francisco_city_hallViews } from './san-francisco-city-hall/views.js';
import { MANIFEST as lm_coit_towerManifest } from './coit-tower/config.js';
import { OSM_WAYS as lm_coit_towerWays } from './coit-tower/footprint.js';
import { create as lm_coit_towerCreate } from './coit-tower/geometry.js';
import { VIEWS as lm_coit_towerViews } from './coit-tower/views.js';
import { MANIFEST as lm_sutro_towerManifest } from './sutro-tower/config.js';
import { OSM_WAYS as lm_sutro_towerWays } from './sutro-tower/footprint.js';
import { create as lm_sutro_towerCreate } from './sutro-tower/geometry.js';
import { VIEWS as lm_sutro_towerViews } from './sutro-tower/views.js';
import { MANIFEST as lm_grace_cathedralManifest } from './grace-cathedral/config.js';
import { OSM_WAYS as lm_grace_cathedralWays } from './grace-cathedral/footprint.js';
import { create as lm_grace_cathedralCreate } from './grace-cathedral/geometry.js';
import { VIEWS as lm_grace_cathedralViews } from './grace-cathedral/views.js';
import { MANIFEST as lm_cathedral_of_saint_maryManifest } from './cathedral-of-saint-mary/config.js';
import { OSM_WAYS as lm_cathedral_of_saint_maryWays } from './cathedral-of-saint-mary/footprint.js';
import { create as lm_cathedral_of_saint_maryCreate } from './cathedral-of-saint-mary/geometry.js';
import { VIEWS as lm_cathedral_of_saint_maryViews } from './cathedral-of-saint-mary/views.js';
import { MANIFEST as lm_painted_ladiesManifest } from './painted-ladies/config.js';
import { OSM_WAYS as lm_painted_ladiesWays } from './painted-ladies/footprint.js';
import { create as lm_painted_ladiesCreate } from './painted-ladies/geometry.js';
import { VIEWS as lm_painted_ladiesViews } from './painted-ladies/views.js';
import { MANIFEST as lm_palace_of_fine_artsManifest } from './palace-of-fine-arts/config.js';
import { OSM_WAYS as lm_palace_of_fine_artsWays } from './palace-of-fine-arts/footprint.js';
import { create as lm_palace_of_fine_artsCreate } from './palace-of-fine-arts/geometry.js';
import { VIEWS as lm_palace_of_fine_artsViews } from './palace-of-fine-arts/views.js';
import { MANIFEST as lm_ghirardelli_squareManifest } from './ghirardelli-square/config.js';
import { OSM_WAYS as lm_ghirardelli_squareWays } from './ghirardelli-square/footprint.js';
import { create as lm_ghirardelli_squareCreate } from './ghirardelli-square/geometry.js';
import { VIEWS as lm_ghirardelli_squareViews } from './ghirardelli-square/views.js';
import { MANIFEST as lm_alcatraz_islandManifest } from './alcatraz-island/config.js';
import { OSM_WAYS as lm_alcatraz_islandWays } from './alcatraz-island/footprint.js';
import { create as lm_alcatraz_islandCreate } from './alcatraz-island/geometry.js';
import { VIEWS as lm_alcatraz_islandViews } from './alcatraz-island/views.js';
import { MANIFEST as lm_oracle_parkManifest } from './oracle-park/config.js';
import { OSM_WAYS as lm_oracle_parkWays } from './oracle-park/footprint.js';
import { create as lm_oracle_parkCreate } from './oracle-park/geometry.js';
import { VIEWS as lm_oracle_parkViews } from './oracle-park/views.js';
import { MANIFEST as lm_chase_centerManifest } from './chase-center/config.js';
import { OSM_WAYS as lm_chase_centerWays } from './chase-center/footprint.js';
import { create as lm_chase_centerCreate } from './chase-center/geometry.js';
import { VIEWS as lm_chase_centerViews } from './chase-center/views.js';
import { MANIFEST as lm_conservatory_of_flowersManifest } from './conservatory-of-flowers/config.js';
import { OSM_WAYS as lm_conservatory_of_flowersWays } from './conservatory-of-flowers/footprint.js';
import { create as lm_conservatory_of_flowersCreate } from './conservatory-of-flowers/geometry.js';
import { VIEWS as lm_conservatory_of_flowersViews } from './conservatory-of-flowers/views.js';
import { MANIFEST as lm_de_young_museumManifest } from './de-young-museum/config.js';
import { OSM_WAYS as lm_de_young_museumWays } from './de-young-museum/footprint.js';
import { create as lm_de_young_museumCreate } from './de-young-museum/geometry.js';
import { VIEWS as lm_de_young_museumViews } from './de-young-museum/views.js';
import { MANIFEST as lm_california_academy_of_sciencesManifest } from './california-academy-of-sciences/config.js';
import { OSM_WAYS as lm_california_academy_of_sciencesWays } from './california-academy-of-sciences/footprint.js';
import { create as lm_california_academy_of_sciencesCreate } from './california-academy-of-sciences/geometry.js';
import { VIEWS as lm_california_academy_of_sciencesViews } from './california-academy-of-sciences/views.js';
import { MANIFEST as lm_legion_of_honorManifest } from './legion-of-honor/config.js';
import { OSM_WAYS as lm_legion_of_honorWays } from './legion-of-honor/footprint.js';
import { create as lm_legion_of_honorCreate } from './legion-of-honor/geometry.js';
import { VIEWS as lm_legion_of_honorViews } from './legion-of-honor/views.js';

const authoring = {
  'golden-gate-bridge': { manifest: lm_golden_gate_bridgeManifest, osmWays: lm_golden_gate_bridgeWays, create: lm_golden_gate_bridgeCreate, views: lm_golden_gate_bridgeViews },
  'bay-bridge-west-span': { manifest: lm_bay_bridge_west_spanManifest, osmWays: lm_bay_bridge_west_spanWays, create: lm_bay_bridge_west_spanCreate, views: lm_bay_bridge_west_spanViews },
  'bay-bridge-east-span': { manifest: lm_bay_bridge_east_spanManifest, osmWays: lm_bay_bridge_east_spanWays, create: lm_bay_bridge_east_spanCreate, views: lm_bay_bridge_east_spanViews },
  'lefty-odoul-bridge': { manifest: lm_lefty_odoul_bridgeManifest, osmWays: lm_lefty_odoul_bridgeWays, create: lm_lefty_odoul_bridgeCreate, views: lm_lefty_odoul_bridgeViews },
  'transamerica-pyramid': { manifest: lm_transamerica_pyramidManifest, osmWays: lm_transamerica_pyramidWays, create: lm_transamerica_pyramidCreate, views: lm_transamerica_pyramidViews },
  'salesforce-tower': { manifest: lm_salesforce_towerManifest, osmWays: lm_salesforce_towerWays, create: lm_salesforce_towerCreate, views: lm_salesforce_towerViews },
  '555-california-street': { manifest: lm_555_california_streetManifest, osmWays: lm_555_california_streetWays, create: lm_555_california_streetCreate, views: lm_555_california_streetViews },
  'columbus-tower': { manifest: lm_columbus_towerManifest, osmWays: lm_columbus_towerWays, create: lm_columbus_towerCreate, views: lm_columbus_towerViews },
  'ferry-building': { manifest: lm_ferry_buildingManifest, osmWays: lm_ferry_buildingWays, create: lm_ferry_buildingCreate, views: lm_ferry_buildingViews },
  'sfmoma': { manifest: lm_sfmomaManifest, osmWays: lm_sfmomaWays, create: lm_sfmomaCreate, views: lm_sfmomaViews },
  'san-francisco-city-hall': { manifest: lm_san_francisco_city_hallManifest, osmWays: lm_san_francisco_city_hallWays, create: lm_san_francisco_city_hallCreate, views: lm_san_francisco_city_hallViews },
  'coit-tower': { manifest: lm_coit_towerManifest, osmWays: lm_coit_towerWays, create: lm_coit_towerCreate, views: lm_coit_towerViews },
  'sutro-tower': { manifest: lm_sutro_towerManifest, osmWays: lm_sutro_towerWays, create: lm_sutro_towerCreate, views: lm_sutro_towerViews },
  'grace-cathedral': { manifest: lm_grace_cathedralManifest, osmWays: lm_grace_cathedralWays, create: lm_grace_cathedralCreate, views: lm_grace_cathedralViews },
  'cathedral-of-saint-mary': { manifest: lm_cathedral_of_saint_maryManifest, osmWays: lm_cathedral_of_saint_maryWays, create: lm_cathedral_of_saint_maryCreate, views: lm_cathedral_of_saint_maryViews },
  'painted-ladies': { manifest: lm_painted_ladiesManifest, osmWays: lm_painted_ladiesWays, create: lm_painted_ladiesCreate, views: lm_painted_ladiesViews },
  'palace-of-fine-arts': { manifest: lm_palace_of_fine_artsManifest, osmWays: lm_palace_of_fine_artsWays, create: lm_palace_of_fine_artsCreate, views: lm_palace_of_fine_artsViews },
  'ghirardelli-square': { manifest: lm_ghirardelli_squareManifest, osmWays: lm_ghirardelli_squareWays, create: lm_ghirardelli_squareCreate, views: lm_ghirardelli_squareViews },
  'alcatraz-island': { manifest: lm_alcatraz_islandManifest, osmWays: lm_alcatraz_islandWays, create: lm_alcatraz_islandCreate, views: lm_alcatraz_islandViews },
  'oracle-park': { manifest: lm_oracle_parkManifest, osmWays: lm_oracle_parkWays, create: lm_oracle_parkCreate, views: lm_oracle_parkViews },
  'chase-center': { manifest: lm_chase_centerManifest, osmWays: lm_chase_centerWays, create: lm_chase_centerCreate, views: lm_chase_centerViews },
  'conservatory-of-flowers': { manifest: lm_conservatory_of_flowersManifest, osmWays: lm_conservatory_of_flowersWays, create: lm_conservatory_of_flowersCreate, views: lm_conservatory_of_flowersViews },
  'de-young-museum': { manifest: lm_de_young_museumManifest, osmWays: lm_de_young_museumWays, create: lm_de_young_museumCreate, views: lm_de_young_museumViews },
  'california-academy-of-sciences': { manifest: lm_california_academy_of_sciencesManifest, osmWays: lm_california_academy_of_sciencesWays, create: lm_california_academy_of_sciencesCreate, views: lm_california_academy_of_sciencesViews },
  'legion-of-honor': { manifest: lm_legion_of_honorManifest, osmWays: lm_legion_of_honorWays, create: lm_legion_of_honorCreate, views: lm_legion_of_honorViews },
};

export const SAN_FRANCISCO_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const sanFranciscoLandmark = (id) => SAN_FRANCISCO_LANDMARKS.find((l) => l.id === id) || null;
