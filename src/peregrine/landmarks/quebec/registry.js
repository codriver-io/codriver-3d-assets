// The quebec landmark registry the RUNTIME reads: spec, palettes, footprints and (for a road-carrying
// bridge) its road layer. Geometry, views and manifest text are authoring-time only (authoring.js).
// File contract: docs/3d-quebec-landmarks.md.
import { SPEC as lm_chateau_frontenacSpec, PALETTES as lm_chateau_frontenacPalettes } from './chateau-frontenac/config.js';
import { FOOTPRINTS as lm_chateau_frontenacFootprints } from './chateau-frontenac/footprint.js';
import { SPEC as lm_casino_de_montrealSpec, PALETTES as lm_casino_de_montrealPalettes } from './casino-de-montreal/config.js';
import { FOOTPRINTS as lm_casino_de_montrealFootprints } from './casino-de-montreal/footprint.js';
import { SPEC as lm_centre_bellSpec, PALETTES as lm_centre_bellPalettes } from './centre-bell/config.js';
import { FOOTPRINTS as lm_centre_bellFootprints } from './centre-bell/footprint.js';
import { SPEC as lm_canadian_museum_of_historySpec, PALETTES as lm_canadian_museum_of_historyPalettes } from './canadian-museum-of-history/config.js';
import { FOOTPRINTS as lm_canadian_museum_of_historyFootprints } from './canadian-museum-of-history/footprint.js';
import { SPEC as lm_basilique_sainte_anne_de_beaupreSpec, PALETTES as lm_basilique_sainte_anne_de_beauprePalettes } from './basilique-sainte-anne-de-beaupre/config.js';
import { FOOTPRINTS as lm_basilique_sainte_anne_de_beaupreFootprints } from './basilique-sainte-anne-de-beaupre/footprint.js';
import { SPEC as lm_marche_bonsecoursSpec, PALETTES as lm_marche_bonsecoursPalettes } from './marche-bonsecours/config.js';
import { FOOTPRINTS as lm_marche_bonsecoursFootprints } from './marche-bonsecours/footprint.js';
import { SPEC as lm_hotel_de_ville_de_montrealSpec, PALETTES as lm_hotel_de_ville_de_montrealPalettes } from './hotel-de-ville-de-montreal/config.js';
import { FOOTPRINTS as lm_hotel_de_ville_de_montrealFootprints } from './hotel-de-ville-de-montreal/footprint.js';
import { SPEC as lm_hotel_du_parlementSpec, PALETTES as lm_hotel_du_parlementPalettes } from './hotel-du-parlement/config.js';
import { FOOTPRINTS as lm_hotel_du_parlementFootprints } from './hotel-du-parlement/footprint.js';
import { SPEC as lm_notre_dame_de_quebecSpec, PALETTES as lm_notre_dame_de_quebecPalettes } from './notre-dame-de-quebec/config.js';
import { FOOTPRINTS as lm_notre_dame_de_quebecFootprints } from './notre-dame-de-quebec/footprint.js';
import { SPEC as lm_edifice_marie_guyartSpec, PALETTES as lm_edifice_marie_guyartPalettes } from './edifice-marie-guyart/config.js';
import { FOOTPRINTS as lm_edifice_marie_guyartFootprints } from './edifice-marie-guyart/footprint.js';
import { SPEC as lm_marie_reine_du_mondeSpec, PALETTES as lm_marie_reine_du_mondePalettes } from './marie-reine-du-monde/config.js';
import { FOOTPRINTS as lm_marie_reine_du_mondeFootprints } from './marie-reine-du-monde/footprint.js';
import { SPEC as lm_notre_dame_du_capSpec, PALETTES as lm_notre_dame_du_capPalettes } from './notre-dame-du-cap/config.js';
import { FOOTPRINTS as lm_notre_dame_du_capFootprints } from './notre-dame-du-cap/footprint.js';
import { SPEC as lm_biodome_de_montrealSpec, PALETTES as lm_biodome_de_montrealPalettes } from './biodome-de-montreal/config.js';
import { FOOTPRINTS as lm_biodome_de_montrealFootprints } from './biodome-de-montreal/footprint.js';
import { SPEC as lm_mnbaq_pavillon_lassondeSpec, PALETTES as lm_mnbaq_pavillon_lassondePalettes } from './mnbaq-pavillon-lassonde/config.js';
import { FOOTPRINTS as lm_mnbaq_pavillon_lassondeFootprints } from './mnbaq-pavillon-lassonde/footprint.js';
import { SPEC as lm_gare_du_palaisSpec, PALETTES as lm_gare_du_palaisPalettes } from './gare-du-palais/config.js';
import { FOOTPRINTS as lm_gare_du_palaisFootprints } from './gare-du-palais/footprint.js';
import { SPEC as lm_pont_pierre_laporteSpec, PALETTES as lm_pont_pierre_laportePalettes } from './pont-pierre-laporte/config.js';
import { FOOTPRINTS as lm_pont_pierre_laporteFootprints } from './pont-pierre-laporte/footprint.js';
import { ROAD_LAYER as lm_pont_pierre_laporteRoad } from './pont-pierre-laporte/layer.js';
import { SPEC as lm_pont_papineau_leblancSpec, PALETTES as lm_pont_papineau_leblancPalettes } from './pont-papineau-leblanc/config.js';
import { FOOTPRINTS as lm_pont_papineau_leblancFootprints } from './pont-papineau-leblanc/footprint.js';
import { ROAD_LAYER as lm_pont_papineau_leblancRoad } from './pont-papineau-leblanc/layer.js';
import { SPEC as lm_pont_lavioletteSpec, PALETTES as lm_pont_laviolettePalettes } from './pont-laviolette/config.js';
import { FOOTPRINTS as lm_pont_lavioletteFootprints } from './pont-laviolette/footprint.js';
import { ROAD_LAYER as lm_pont_lavioletteRoad } from './pont-laviolette/layer.js';
import { SPEC as lm_pont_de_quebecSpec, PALETTES as lm_pont_de_quebecPalettes } from './pont-de-quebec/config.js';
import { FOOTPRINTS as lm_pont_de_quebecFootprints } from './pont-de-quebec/footprint.js';
import { ROAD_LAYER as lm_pont_de_quebecRoad } from './pont-de-quebec/layer.js';
import { SPEC as lm_pont_dubucSpec, PALETTES as lm_pont_dubucPalettes } from './pont-dubuc/config.js';
import { FOOTPRINTS as lm_pont_dubucFootprints } from './pont-dubuc/footprint.js';
import { ROAD_LAYER as lm_pont_dubucRoad } from './pont-dubuc/layer.js';

const entry = (spec, palettes, footprints, roadLayer = null) => Object.freeze({
  id: spec.id, spec, palettes, footprints, roadLayer,
  dir: spec.kind === 'bridge' ? 'bridges' : 'buildings',
});

export const QUEBEC_LANDMARKS = Object.freeze([
  entry(lm_chateau_frontenacSpec, lm_chateau_frontenacPalettes, lm_chateau_frontenacFootprints),
  entry(lm_casino_de_montrealSpec, lm_casino_de_montrealPalettes, lm_casino_de_montrealFootprints),
  entry(lm_centre_bellSpec, lm_centre_bellPalettes, lm_centre_bellFootprints),
  entry(lm_canadian_museum_of_historySpec, lm_canadian_museum_of_historyPalettes, lm_canadian_museum_of_historyFootprints),
  entry(lm_basilique_sainte_anne_de_beaupreSpec, lm_basilique_sainte_anne_de_beauprePalettes, lm_basilique_sainte_anne_de_beaupreFootprints),
  entry(lm_marche_bonsecoursSpec, lm_marche_bonsecoursPalettes, lm_marche_bonsecoursFootprints),
  entry(lm_hotel_de_ville_de_montrealSpec, lm_hotel_de_ville_de_montrealPalettes, lm_hotel_de_ville_de_montrealFootprints),
  entry(lm_hotel_du_parlementSpec, lm_hotel_du_parlementPalettes, lm_hotel_du_parlementFootprints),
  entry(lm_notre_dame_de_quebecSpec, lm_notre_dame_de_quebecPalettes, lm_notre_dame_de_quebecFootprints),
  entry(lm_edifice_marie_guyartSpec, lm_edifice_marie_guyartPalettes, lm_edifice_marie_guyartFootprints),
  entry(lm_marie_reine_du_mondeSpec, lm_marie_reine_du_mondePalettes, lm_marie_reine_du_mondeFootprints),
  entry(lm_notre_dame_du_capSpec, lm_notre_dame_du_capPalettes, lm_notre_dame_du_capFootprints),
  entry(lm_biodome_de_montrealSpec, lm_biodome_de_montrealPalettes, lm_biodome_de_montrealFootprints),
  entry(lm_mnbaq_pavillon_lassondeSpec, lm_mnbaq_pavillon_lassondePalettes, lm_mnbaq_pavillon_lassondeFootprints),
  entry(lm_gare_du_palaisSpec, lm_gare_du_palaisPalettes, lm_gare_du_palaisFootprints),
  entry(lm_pont_pierre_laporteSpec, lm_pont_pierre_laportePalettes, lm_pont_pierre_laporteFootprints, lm_pont_pierre_laporteRoad),
  entry(lm_pont_papineau_leblancSpec, lm_pont_papineau_leblancPalettes, lm_pont_papineau_leblancFootprints, lm_pont_papineau_leblancRoad),
  entry(lm_pont_lavioletteSpec, lm_pont_laviolettePalettes, lm_pont_lavioletteFootprints, lm_pont_lavioletteRoad),
  entry(lm_pont_de_quebecSpec, lm_pont_de_quebecPalettes, lm_pont_de_quebecFootprints, lm_pont_de_quebecRoad),
  entry(lm_pont_dubucSpec, lm_pont_dubucPalettes, lm_pont_dubucFootprints, lm_pont_dubucRoad),
]);

export const quebecLandmark = (id) => QUEBEC_LANDMARKS.find((l) => l.id === id) || null;
