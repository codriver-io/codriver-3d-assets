// Authoring-time view of the quebec registry: runtime entries plus geometry, views, manifest text and
// OSM ids. Read by the GLB build, the inspector, the screenshot harness and the tests; never by the app bundle.
import { QUEBEC_LANDMARKS as RUNTIME } from './registry.js';
import { MANIFEST as lm_chateau_frontenacManifest } from './chateau-frontenac/config.js';
import { OSM_WAYS as lm_chateau_frontenacWays } from './chateau-frontenac/footprint.js';
import { create as lm_chateau_frontenacCreate } from './chateau-frontenac/geometry.js';
import { VIEWS as lm_chateau_frontenacViews } from './chateau-frontenac/views.js';
import { MANIFEST as lm_casino_de_montrealManifest } from './casino-de-montreal/config.js';
import { OSM_WAYS as lm_casino_de_montrealWays } from './casino-de-montreal/footprint.js';
import { create as lm_casino_de_montrealCreate } from './casino-de-montreal/geometry.js';
import { VIEWS as lm_casino_de_montrealViews } from './casino-de-montreal/views.js';
import { MANIFEST as lm_centre_bellManifest } from './centre-bell/config.js';
import { OSM_WAYS as lm_centre_bellWays } from './centre-bell/footprint.js';
import { create as lm_centre_bellCreate } from './centre-bell/geometry.js';
import { VIEWS as lm_centre_bellViews } from './centre-bell/views.js';
import { MANIFEST as lm_canadian_museum_of_historyManifest } from './canadian-museum-of-history/config.js';
import { OSM_WAYS as lm_canadian_museum_of_historyWays } from './canadian-museum-of-history/footprint.js';
import { create as lm_canadian_museum_of_historyCreate } from './canadian-museum-of-history/geometry.js';
import { VIEWS as lm_canadian_museum_of_historyViews } from './canadian-museum-of-history/views.js';
import { MANIFEST as lm_basilique_sainte_anne_de_beaupreManifest } from './basilique-sainte-anne-de-beaupre/config.js';
import { OSM_WAYS as lm_basilique_sainte_anne_de_beaupreWays } from './basilique-sainte-anne-de-beaupre/footprint.js';
import { create as lm_basilique_sainte_anne_de_beaupreCreate } from './basilique-sainte-anne-de-beaupre/geometry.js';
import { VIEWS as lm_basilique_sainte_anne_de_beaupreViews } from './basilique-sainte-anne-de-beaupre/views.js';
import { MANIFEST as lm_marche_bonsecoursManifest } from './marche-bonsecours/config.js';
import { OSM_WAYS as lm_marche_bonsecoursWays } from './marche-bonsecours/footprint.js';
import { create as lm_marche_bonsecoursCreate } from './marche-bonsecours/geometry.js';
import { VIEWS as lm_marche_bonsecoursViews } from './marche-bonsecours/views.js';
import { MANIFEST as lm_hotel_de_ville_de_montrealManifest } from './hotel-de-ville-de-montreal/config.js';
import { OSM_WAYS as lm_hotel_de_ville_de_montrealWays } from './hotel-de-ville-de-montreal/footprint.js';
import { create as lm_hotel_de_ville_de_montrealCreate } from './hotel-de-ville-de-montreal/geometry.js';
import { VIEWS as lm_hotel_de_ville_de_montrealViews } from './hotel-de-ville-de-montreal/views.js';
import { MANIFEST as lm_hotel_du_parlementManifest } from './hotel-du-parlement/config.js';
import { OSM_WAYS as lm_hotel_du_parlementWays } from './hotel-du-parlement/footprint.js';
import { create as lm_hotel_du_parlementCreate } from './hotel-du-parlement/geometry.js';
import { VIEWS as lm_hotel_du_parlementViews } from './hotel-du-parlement/views.js';
import { MANIFEST as lm_notre_dame_de_quebecManifest } from './notre-dame-de-quebec/config.js';
import { OSM_WAYS as lm_notre_dame_de_quebecWays } from './notre-dame-de-quebec/footprint.js';
import { create as lm_notre_dame_de_quebecCreate } from './notre-dame-de-quebec/geometry.js';
import { VIEWS as lm_notre_dame_de_quebecViews } from './notre-dame-de-quebec/views.js';
import { MANIFEST as lm_edifice_marie_guyartManifest } from './edifice-marie-guyart/config.js';
import { OSM_WAYS as lm_edifice_marie_guyartWays } from './edifice-marie-guyart/footprint.js';
import { create as lm_edifice_marie_guyartCreate } from './edifice-marie-guyart/geometry.js';
import { VIEWS as lm_edifice_marie_guyartViews } from './edifice-marie-guyart/views.js';
import { MANIFEST as lm_marie_reine_du_mondeManifest } from './marie-reine-du-monde/config.js';
import { OSM_WAYS as lm_marie_reine_du_mondeWays } from './marie-reine-du-monde/footprint.js';
import { create as lm_marie_reine_du_mondeCreate } from './marie-reine-du-monde/geometry.js';
import { VIEWS as lm_marie_reine_du_mondeViews } from './marie-reine-du-monde/views.js';
import { MANIFEST as lm_notre_dame_du_capManifest } from './notre-dame-du-cap/config.js';
import { OSM_WAYS as lm_notre_dame_du_capWays } from './notre-dame-du-cap/footprint.js';
import { create as lm_notre_dame_du_capCreate } from './notre-dame-du-cap/geometry.js';
import { VIEWS as lm_notre_dame_du_capViews } from './notre-dame-du-cap/views.js';
import { MANIFEST as lm_biodome_de_montrealManifest } from './biodome-de-montreal/config.js';
import { OSM_WAYS as lm_biodome_de_montrealWays } from './biodome-de-montreal/footprint.js';
import { create as lm_biodome_de_montrealCreate } from './biodome-de-montreal/geometry.js';
import { VIEWS as lm_biodome_de_montrealViews } from './biodome-de-montreal/views.js';
import { MANIFEST as lm_mnbaq_pavillon_lassondeManifest } from './mnbaq-pavillon-lassonde/config.js';
import { OSM_WAYS as lm_mnbaq_pavillon_lassondeWays } from './mnbaq-pavillon-lassonde/footprint.js';
import { create as lm_mnbaq_pavillon_lassondeCreate } from './mnbaq-pavillon-lassonde/geometry.js';
import { VIEWS as lm_mnbaq_pavillon_lassondeViews } from './mnbaq-pavillon-lassonde/views.js';
import { MANIFEST as lm_gare_du_palaisManifest } from './gare-du-palais/config.js';
import { OSM_WAYS as lm_gare_du_palaisWays } from './gare-du-palais/footprint.js';
import { create as lm_gare_du_palaisCreate } from './gare-du-palais/geometry.js';
import { VIEWS as lm_gare_du_palaisViews } from './gare-du-palais/views.js';
import { MANIFEST as lm_pont_pierre_laporteManifest } from './pont-pierre-laporte/config.js';
import { OSM_WAYS as lm_pont_pierre_laporteWays } from './pont-pierre-laporte/footprint.js';
import { create as lm_pont_pierre_laporteCreate } from './pont-pierre-laporte/geometry.js';
import { VIEWS as lm_pont_pierre_laporteViews } from './pont-pierre-laporte/views.js';
import { MANIFEST as lm_pont_papineau_leblancManifest } from './pont-papineau-leblanc/config.js';
import { OSM_WAYS as lm_pont_papineau_leblancWays } from './pont-papineau-leblanc/footprint.js';
import { create as lm_pont_papineau_leblancCreate } from './pont-papineau-leblanc/geometry.js';
import { VIEWS as lm_pont_papineau_leblancViews } from './pont-papineau-leblanc/views.js';
import { MANIFEST as lm_pont_lavioletteManifest } from './pont-laviolette/config.js';
import { OSM_WAYS as lm_pont_lavioletteWays } from './pont-laviolette/footprint.js';
import { create as lm_pont_lavioletteCreate } from './pont-laviolette/geometry.js';
import { VIEWS as lm_pont_lavioletteViews } from './pont-laviolette/views.js';
import { MANIFEST as lm_pont_de_quebecManifest } from './pont-de-quebec/config.js';
import { OSM_WAYS as lm_pont_de_quebecWays } from './pont-de-quebec/footprint.js';
import { create as lm_pont_de_quebecCreate } from './pont-de-quebec/geometry.js';
import { VIEWS as lm_pont_de_quebecViews } from './pont-de-quebec/views.js';
import { MANIFEST as lm_pont_dubucManifest } from './pont-dubuc/config.js';
import { OSM_WAYS as lm_pont_dubucWays } from './pont-dubuc/footprint.js';
import { create as lm_pont_dubucCreate } from './pont-dubuc/geometry.js';
import { VIEWS as lm_pont_dubucViews } from './pont-dubuc/views.js';

const authoring = {
  'chateau-frontenac': { manifest: lm_chateau_frontenacManifest, osmWays: lm_chateau_frontenacWays, create: lm_chateau_frontenacCreate, views: lm_chateau_frontenacViews },
  'casino-de-montreal': { manifest: lm_casino_de_montrealManifest, osmWays: lm_casino_de_montrealWays, create: lm_casino_de_montrealCreate, views: lm_casino_de_montrealViews },
  'centre-bell': { manifest: lm_centre_bellManifest, osmWays: lm_centre_bellWays, create: lm_centre_bellCreate, views: lm_centre_bellViews },
  'canadian-museum-of-history': { manifest: lm_canadian_museum_of_historyManifest, osmWays: lm_canadian_museum_of_historyWays, create: lm_canadian_museum_of_historyCreate, views: lm_canadian_museum_of_historyViews },
  'basilique-sainte-anne-de-beaupre': { manifest: lm_basilique_sainte_anne_de_beaupreManifest, osmWays: lm_basilique_sainte_anne_de_beaupreWays, create: lm_basilique_sainte_anne_de_beaupreCreate, views: lm_basilique_sainte_anne_de_beaupreViews },
  'marche-bonsecours': { manifest: lm_marche_bonsecoursManifest, osmWays: lm_marche_bonsecoursWays, create: lm_marche_bonsecoursCreate, views: lm_marche_bonsecoursViews },
  'hotel-de-ville-de-montreal': { manifest: lm_hotel_de_ville_de_montrealManifest, osmWays: lm_hotel_de_ville_de_montrealWays, create: lm_hotel_de_ville_de_montrealCreate, views: lm_hotel_de_ville_de_montrealViews },
  'hotel-du-parlement': { manifest: lm_hotel_du_parlementManifest, osmWays: lm_hotel_du_parlementWays, create: lm_hotel_du_parlementCreate, views: lm_hotel_du_parlementViews },
  'notre-dame-de-quebec': { manifest: lm_notre_dame_de_quebecManifest, osmWays: lm_notre_dame_de_quebecWays, create: lm_notre_dame_de_quebecCreate, views: lm_notre_dame_de_quebecViews },
  'edifice-marie-guyart': { manifest: lm_edifice_marie_guyartManifest, osmWays: lm_edifice_marie_guyartWays, create: lm_edifice_marie_guyartCreate, views: lm_edifice_marie_guyartViews },
  'marie-reine-du-monde': { manifest: lm_marie_reine_du_mondeManifest, osmWays: lm_marie_reine_du_mondeWays, create: lm_marie_reine_du_mondeCreate, views: lm_marie_reine_du_mondeViews },
  'notre-dame-du-cap': { manifest: lm_notre_dame_du_capManifest, osmWays: lm_notre_dame_du_capWays, create: lm_notre_dame_du_capCreate, views: lm_notre_dame_du_capViews },
  'biodome-de-montreal': { manifest: lm_biodome_de_montrealManifest, osmWays: lm_biodome_de_montrealWays, create: lm_biodome_de_montrealCreate, views: lm_biodome_de_montrealViews },
  'mnbaq-pavillon-lassonde': { manifest: lm_mnbaq_pavillon_lassondeManifest, osmWays: lm_mnbaq_pavillon_lassondeWays, create: lm_mnbaq_pavillon_lassondeCreate, views: lm_mnbaq_pavillon_lassondeViews },
  'gare-du-palais': { manifest: lm_gare_du_palaisManifest, osmWays: lm_gare_du_palaisWays, create: lm_gare_du_palaisCreate, views: lm_gare_du_palaisViews },
  'pont-pierre-laporte': { manifest: lm_pont_pierre_laporteManifest, osmWays: lm_pont_pierre_laporteWays, create: lm_pont_pierre_laporteCreate, views: lm_pont_pierre_laporteViews },
  'pont-papineau-leblanc': { manifest: lm_pont_papineau_leblancManifest, osmWays: lm_pont_papineau_leblancWays, create: lm_pont_papineau_leblancCreate, views: lm_pont_papineau_leblancViews },
  'pont-laviolette': { manifest: lm_pont_lavioletteManifest, osmWays: lm_pont_lavioletteWays, create: lm_pont_lavioletteCreate, views: lm_pont_lavioletteViews },
  'pont-de-quebec': { manifest: lm_pont_de_quebecManifest, osmWays: lm_pont_de_quebecWays, create: lm_pont_de_quebecCreate, views: lm_pont_de_quebecViews },
  'pont-dubuc': { manifest: lm_pont_dubucManifest, osmWays: lm_pont_dubucWays, create: lm_pont_dubucCreate, views: lm_pont_dubucViews },
};

export const QUEBEC_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const quebecLandmark = (id) => QUEBEC_LANDMARKS.find((l) => l.id === id) || null;
