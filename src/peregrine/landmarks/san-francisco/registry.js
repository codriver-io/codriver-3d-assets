// The San Francisco landmark registry the RUNTIME reads: spec, palettes, footprints and
// (for a road-carrying bridge) its road layer. Geometry, inspector views and manifest text
// are authoring-time only and live in authoring.js, so none of it ships in peregrine.js.
// A landmark is added by filling in its folder, never by editing a shared switch.
// File contract: docs/3d-san-francisco-landmarks.md.
import { SPEC as lm_golden_gate_bridgeSpec, PALETTES as lm_golden_gate_bridgePalettes } from './golden-gate-bridge/config.js';
import { FOOTPRINTS as lm_golden_gate_bridgeFootprints } from './golden-gate-bridge/footprint.js';
import { ROAD_LAYER as lm_golden_gate_bridgeRoad } from './golden-gate-bridge/layer.js';
import { SPEC as lm_bay_bridge_west_spanSpec, PALETTES as lm_bay_bridge_west_spanPalettes } from './bay-bridge-west-span/config.js';
import { FOOTPRINTS as lm_bay_bridge_west_spanFootprints } from './bay-bridge-west-span/footprint.js';
import { ROAD_LAYER as lm_bay_bridge_west_spanRoad } from './bay-bridge-west-span/layer.js';
import { SPEC as lm_bay_bridge_east_spanSpec, PALETTES as lm_bay_bridge_east_spanPalettes } from './bay-bridge-east-span/config.js';
import { FOOTPRINTS as lm_bay_bridge_east_spanFootprints } from './bay-bridge-east-span/footprint.js';
import { ROAD_LAYER as lm_bay_bridge_east_spanRoad } from './bay-bridge-east-span/layer.js';
import { SPEC as lm_lefty_odoul_bridgeSpec, PALETTES as lm_lefty_odoul_bridgePalettes } from './lefty-odoul-bridge/config.js';
import { FOOTPRINTS as lm_lefty_odoul_bridgeFootprints } from './lefty-odoul-bridge/footprint.js';
import { SPEC as lm_transamerica_pyramidSpec, PALETTES as lm_transamerica_pyramidPalettes } from './transamerica-pyramid/config.js';
import { FOOTPRINTS as lm_transamerica_pyramidFootprints } from './transamerica-pyramid/footprint.js';
import { SPEC as lm_salesforce_towerSpec, PALETTES as lm_salesforce_towerPalettes } from './salesforce-tower/config.js';
import { FOOTPRINTS as lm_salesforce_towerFootprints } from './salesforce-tower/footprint.js';
import { SPEC as lm_555_california_streetSpec, PALETTES as lm_555_california_streetPalettes } from './555-california-street/config.js';
import { FOOTPRINTS as lm_555_california_streetFootprints } from './555-california-street/footprint.js';
import { SPEC as lm_columbus_towerSpec, PALETTES as lm_columbus_towerPalettes } from './columbus-tower/config.js';
import { FOOTPRINTS as lm_columbus_towerFootprints } from './columbus-tower/footprint.js';
import { SPEC as lm_ferry_buildingSpec, PALETTES as lm_ferry_buildingPalettes } from './ferry-building/config.js';
import { FOOTPRINTS as lm_ferry_buildingFootprints } from './ferry-building/footprint.js';
import { SPEC as lm_sfmomaSpec, PALETTES as lm_sfmomaPalettes } from './sfmoma/config.js';
import { FOOTPRINTS as lm_sfmomaFootprints } from './sfmoma/footprint.js';
import { SPEC as lm_san_francisco_city_hallSpec, PALETTES as lm_san_francisco_city_hallPalettes } from './san-francisco-city-hall/config.js';
import { FOOTPRINTS as lm_san_francisco_city_hallFootprints } from './san-francisco-city-hall/footprint.js';
import { SPEC as lm_coit_towerSpec, PALETTES as lm_coit_towerPalettes } from './coit-tower/config.js';
import { FOOTPRINTS as lm_coit_towerFootprints } from './coit-tower/footprint.js';
import { SPEC as lm_sutro_towerSpec, PALETTES as lm_sutro_towerPalettes } from './sutro-tower/config.js';
import { FOOTPRINTS as lm_sutro_towerFootprints } from './sutro-tower/footprint.js';
import { SPEC as lm_grace_cathedralSpec, PALETTES as lm_grace_cathedralPalettes } from './grace-cathedral/config.js';
import { FOOTPRINTS as lm_grace_cathedralFootprints } from './grace-cathedral/footprint.js';
import { SPEC as lm_cathedral_of_saint_marySpec, PALETTES as lm_cathedral_of_saint_maryPalettes } from './cathedral-of-saint-mary/config.js';
import { FOOTPRINTS as lm_cathedral_of_saint_maryFootprints } from './cathedral-of-saint-mary/footprint.js';
import { SPEC as lm_painted_ladiesSpec, PALETTES as lm_painted_ladiesPalettes } from './painted-ladies/config.js';
import { FOOTPRINTS as lm_painted_ladiesFootprints } from './painted-ladies/footprint.js';
import { SPEC as lm_palace_of_fine_artsSpec, PALETTES as lm_palace_of_fine_artsPalettes } from './palace-of-fine-arts/config.js';
import { FOOTPRINTS as lm_palace_of_fine_artsFootprints } from './palace-of-fine-arts/footprint.js';
import { SPEC as lm_ghirardelli_squareSpec, PALETTES as lm_ghirardelli_squarePalettes } from './ghirardelli-square/config.js';
import { FOOTPRINTS as lm_ghirardelli_squareFootprints } from './ghirardelli-square/footprint.js';
import { SPEC as lm_alcatraz_islandSpec, PALETTES as lm_alcatraz_islandPalettes } from './alcatraz-island/config.js';
import { FOOTPRINTS as lm_alcatraz_islandFootprints } from './alcatraz-island/footprint.js';
import { SPEC as lm_oracle_parkSpec, PALETTES as lm_oracle_parkPalettes } from './oracle-park/config.js';
import { FOOTPRINTS as lm_oracle_parkFootprints } from './oracle-park/footprint.js';
import { SPEC as lm_chase_centerSpec, PALETTES as lm_chase_centerPalettes } from './chase-center/config.js';
import { FOOTPRINTS as lm_chase_centerFootprints } from './chase-center/footprint.js';
import { SPEC as lm_conservatory_of_flowersSpec, PALETTES as lm_conservatory_of_flowersPalettes } from './conservatory-of-flowers/config.js';
import { FOOTPRINTS as lm_conservatory_of_flowersFootprints } from './conservatory-of-flowers/footprint.js';
import { SPEC as lm_de_young_museumSpec, PALETTES as lm_de_young_museumPalettes } from './de-young-museum/config.js';
import { FOOTPRINTS as lm_de_young_museumFootprints } from './de-young-museum/footprint.js';
import { SPEC as lm_california_academy_of_sciencesSpec, PALETTES as lm_california_academy_of_sciencesPalettes } from './california-academy-of-sciences/config.js';
import { FOOTPRINTS as lm_california_academy_of_sciencesFootprints } from './california-academy-of-sciences/footprint.js';
import { SPEC as lm_legion_of_honorSpec, PALETTES as lm_legion_of_honorPalettes } from './legion-of-honor/config.js';
import { FOOTPRINTS as lm_legion_of_honorFootprints } from './legion-of-honor/footprint.js';

const entry = (spec, palettes, footprints, roadLayer = null) => Object.freeze({
  id: spec.id, spec, palettes, footprints,
  // A road-fitted bridge layer, { Layer, profile } from createRegistryBridgeLayer; null for everything else.
  roadLayer,
  // Bridges live in public/models/bridges, everything else in buildings.
  dir: spec.kind === 'bridge' ? 'bridges' : 'buildings',
});

export const SAN_FRANCISCO_LANDMARKS = Object.freeze([
  entry(lm_golden_gate_bridgeSpec, lm_golden_gate_bridgePalettes, lm_golden_gate_bridgeFootprints, lm_golden_gate_bridgeRoad),
  entry(lm_bay_bridge_west_spanSpec, lm_bay_bridge_west_spanPalettes, lm_bay_bridge_west_spanFootprints, lm_bay_bridge_west_spanRoad),
  entry(lm_bay_bridge_east_spanSpec, lm_bay_bridge_east_spanPalettes, lm_bay_bridge_east_spanFootprints, lm_bay_bridge_east_spanRoad),
  entry(lm_lefty_odoul_bridgeSpec, lm_lefty_odoul_bridgePalettes, lm_lefty_odoul_bridgeFootprints),
  entry(lm_transamerica_pyramidSpec, lm_transamerica_pyramidPalettes, lm_transamerica_pyramidFootprints),
  entry(lm_salesforce_towerSpec, lm_salesforce_towerPalettes, lm_salesforce_towerFootprints),
  entry(lm_555_california_streetSpec, lm_555_california_streetPalettes, lm_555_california_streetFootprints),
  entry(lm_columbus_towerSpec, lm_columbus_towerPalettes, lm_columbus_towerFootprints),
  entry(lm_ferry_buildingSpec, lm_ferry_buildingPalettes, lm_ferry_buildingFootprints),
  entry(lm_sfmomaSpec, lm_sfmomaPalettes, lm_sfmomaFootprints),
  entry(lm_san_francisco_city_hallSpec, lm_san_francisco_city_hallPalettes, lm_san_francisco_city_hallFootprints),
  entry(lm_coit_towerSpec, lm_coit_towerPalettes, lm_coit_towerFootprints),
  entry(lm_sutro_towerSpec, lm_sutro_towerPalettes, lm_sutro_towerFootprints),
  entry(lm_grace_cathedralSpec, lm_grace_cathedralPalettes, lm_grace_cathedralFootprints),
  entry(lm_cathedral_of_saint_marySpec, lm_cathedral_of_saint_maryPalettes, lm_cathedral_of_saint_maryFootprints),
  entry(lm_painted_ladiesSpec, lm_painted_ladiesPalettes, lm_painted_ladiesFootprints),
  entry(lm_palace_of_fine_artsSpec, lm_palace_of_fine_artsPalettes, lm_palace_of_fine_artsFootprints),
  entry(lm_ghirardelli_squareSpec, lm_ghirardelli_squarePalettes, lm_ghirardelli_squareFootprints),
  entry(lm_alcatraz_islandSpec, lm_alcatraz_islandPalettes, lm_alcatraz_islandFootprints),
  entry(lm_oracle_parkSpec, lm_oracle_parkPalettes, lm_oracle_parkFootprints),
  entry(lm_chase_centerSpec, lm_chase_centerPalettes, lm_chase_centerFootprints),
  entry(lm_conservatory_of_flowersSpec, lm_conservatory_of_flowersPalettes, lm_conservatory_of_flowersFootprints),
  entry(lm_de_young_museumSpec, lm_de_young_museumPalettes, lm_de_young_museumFootprints),
  entry(lm_california_academy_of_sciencesSpec, lm_california_academy_of_sciencesPalettes, lm_california_academy_of_sciencesFootprints),
  entry(lm_legion_of_honorSpec, lm_legion_of_honorPalettes, lm_legion_of_honorFootprints),
]);

export const sanFranciscoLandmark = (id) => SAN_FRANCISCO_LANDMARKS.find((l) => l.id === id) || null;
