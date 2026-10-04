// Authoring-time view of the top-cities registry: runtime entries plus geometry, views, manifest text and
// OSM ids. Read by the GLB build, the inspector, the screenshot harness and the tests; never by the app bundle.
import { TOP_CITIES_LANDMARKS as RUNTIME } from './registry.js';
import { MANIFEST as lm_tower_bridgeManifest } from './tower-bridge/config.js';
import { OSM_WAYS as lm_tower_bridgeWays } from './tower-bridge/footprint.js';
import { create as lm_tower_bridgeCreate } from './tower-bridge/geometry.js';
import { VIEWS as lm_tower_bridgeViews } from './tower-bridge/views.js';
import { MANIFEST as lm_palace_of_westminsterManifest } from './palace-of-westminster/config.js';
import { OSM_WAYS as lm_palace_of_westminsterWays } from './palace-of-westminster/footprint.js';
import { create as lm_palace_of_westminsterCreate } from './palace-of-westminster/geometry.js';
import { VIEWS as lm_palace_of_westminsterViews } from './palace-of-westminster/views.js';
import { MANIFEST as lm_st_pauls_cathedralManifest } from './st-pauls-cathedral/config.js';
import { OSM_WAYS as lm_st_pauls_cathedralWays } from './st-pauls-cathedral/footprint.js';
import { create as lm_st_pauls_cathedralCreate } from './st-pauls-cathedral/geometry.js';
import { VIEWS as lm_st_pauls_cathedralViews } from './st-pauls-cathedral/views.js';
import { MANIFEST as lm_the_shardManifest } from './the-shard/config.js';
import { OSM_WAYS as lm_the_shardWays } from './the-shard/footprint.js';
import { create as lm_the_shardCreate } from './the-shard/geometry.js';
import { VIEWS as lm_the_shardViews } from './the-shard/views.js';
import { MANIFEST as lm_rijksmuseumManifest } from './rijksmuseum/config.js';
import { OSM_WAYS as lm_rijksmuseumWays } from './rijksmuseum/footprint.js';
import { create as lm_rijksmuseumCreate } from './rijksmuseum/geometry.js';
import { VIEWS as lm_rijksmuseumViews } from './rijksmuseum/views.js';
import { MANIFEST as lm_amsterdam_centraalManifest } from './amsterdam-centraal/config.js';
import { OSM_WAYS as lm_amsterdam_centraalWays } from './amsterdam-centraal/footprint.js';
import { create as lm_amsterdam_centraalCreate } from './amsterdam-centraal/geometry.js';
import { VIEWS as lm_amsterdam_centraalViews } from './amsterdam-centraal/views.js';
import { MANIFEST as lm_eye_filmmuseumManifest } from './eye-filmmuseum/config.js';
import { OSM_WAYS as lm_eye_filmmuseumWays } from './eye-filmmuseum/footprint.js';
import { create as lm_eye_filmmuseumCreate } from './eye-filmmuseum/geometry.js';
import { VIEWS as lm_eye_filmmuseumViews } from './eye-filmmuseum/views.js';
import { MANIFEST as lm_palacio_real_de_madridManifest } from './palacio-real-de-madrid/config.js';
import { OSM_WAYS as lm_palacio_real_de_madridWays } from './palacio-real-de-madrid/footprint.js';
import { create as lm_palacio_real_de_madridCreate } from './palacio-real-de-madrid/geometry.js';
import { VIEWS as lm_palacio_real_de_madridViews } from './palacio-real-de-madrid/views.js';
import { MANIFEST as lm_puerta_de_alcalaManifest } from './puerta-de-alcala/config.js';
import { OSM_WAYS as lm_puerta_de_alcalaWays } from './puerta-de-alcala/footprint.js';
import { create as lm_puerta_de_alcalaCreate } from './puerta-de-alcala/geometry.js';
import { VIEWS as lm_puerta_de_alcalaViews } from './puerta-de-alcala/views.js';
import { MANIFEST as lm_puerta_de_europaManifest } from './puerta-de-europa/config.js';
import { OSM_WAYS as lm_puerta_de_europaWays } from './puerta-de-europa/footprint.js';
import { create as lm_puerta_de_europaCreate } from './puerta-de-europa/geometry.js';
import { VIEWS as lm_puerta_de_europaViews } from './puerta-de-europa/views.js';
import { MANIFEST as lm_reunion_towerManifest } from './reunion-tower/config.js';
import { OSM_WAYS as lm_reunion_towerWays } from './reunion-tower/footprint.js';
import { create as lm_reunion_towerCreate } from './reunion-tower/geometry.js';
import { VIEWS as lm_reunion_towerViews } from './reunion-tower/views.js';
import { MANIFEST as lm_bank_of_america_plaza_dallasManifest } from './bank-of-america-plaza-dallas/config.js';
import { OSM_WAYS as lm_bank_of_america_plaza_dallasWays } from './bank-of-america-plaza-dallas/footprint.js';
import { create as lm_bank_of_america_plaza_dallasCreate } from './bank-of-america-plaza-dallas/geometry.js';
import { VIEWS as lm_bank_of_america_plaza_dallasViews } from './bank-of-america-plaza-dallas/views.js';
import { MANIFEST as lm_margaret_hunt_hill_bridgeManifest } from './margaret-hunt-hill-bridge/config.js';
import { OSM_WAYS as lm_margaret_hunt_hill_bridgeWays } from './margaret-hunt-hill-bridge/footprint.js';
import { create as lm_margaret_hunt_hill_bridgeCreate } from './margaret-hunt-hill-bridge/geometry.js';
import { VIEWS as lm_margaret_hunt_hill_bridgeViews } from './margaret-hunt-hill-bridge/views.js';
import { MANIFEST as lm_margaret_mcdermott_bridgeManifest } from './margaret-mcdermott-bridge/config.js';
import { OSM_WAYS as lm_margaret_mcdermott_bridgeWays } from './margaret-mcdermott-bridge/footprint.js';
import { create as lm_margaret_mcdermott_bridgeCreate } from './margaret-mcdermott-bridge/geometry.js';
import { VIEWS as lm_margaret_mcdermott_bridgeViews } from './margaret-mcdermott-bridge/views.js';
import { MANIFEST as lm_washington_monumentManifest } from './washington-monument/config.js';
import { OSM_WAYS as lm_washington_monumentWays } from './washington-monument/footprint.js';
import { create as lm_washington_monumentCreate } from './washington-monument/geometry.js';
import { VIEWS as lm_washington_monumentViews } from './washington-monument/views.js';
import { MANIFEST as lm_united_states_capitolManifest } from './united-states-capitol/config.js';
import { OSM_WAYS as lm_united_states_capitolWays } from './united-states-capitol/footprint.js';
import { create as lm_united_states_capitolCreate } from './united-states-capitol/geometry.js';
import { VIEWS as lm_united_states_capitolViews } from './united-states-capitol/views.js';
import { MANIFEST as lm_lincoln_memorialManifest } from './lincoln-memorial/config.js';
import { OSM_WAYS as lm_lincoln_memorialWays } from './lincoln-memorial/footprint.js';
import { create as lm_lincoln_memorialCreate } from './lincoln-memorial/geometry.js';
import { VIEWS as lm_lincoln_memorialViews } from './lincoln-memorial/views.js';
import { MANIFEST as lm_arlington_memorial_bridgeManifest } from './arlington-memorial-bridge/config.js';
import { OSM_WAYS as lm_arlington_memorial_bridgeWays } from './arlington-memorial-bridge/footprint.js';
import { create as lm_arlington_memorial_bridgeCreate } from './arlington-memorial-bridge/geometry.js';
import { VIEWS as lm_arlington_memorial_bridgeViews } from './arlington-memorial-bridge/views.js';
import { MANIFEST as lm_edificio_coltejerManifest } from './edificio-coltejer/config.js';
import { OSM_WAYS as lm_edificio_coltejerWays } from './edificio-coltejer/footprint.js';
import { create as lm_edificio_coltejerCreate } from './edificio-coltejer/geometry.js';
import { VIEWS as lm_edificio_coltejerViews } from './edificio-coltejer/views.js';
import { MANIFEST as lm_catedral_metropolitana_de_medellinManifest } from './catedral-metropolitana-de-medellin/config.js';
import { OSM_WAYS as lm_catedral_metropolitana_de_medellinWays } from './catedral-metropolitana-de-medellin/footprint.js';
import { create as lm_catedral_metropolitana_de_medellinCreate } from './catedral-metropolitana-de-medellin/geometry.js';
import { VIEWS as lm_catedral_metropolitana_de_medellinViews } from './catedral-metropolitana-de-medellin/views.js';
import { MANIFEST as lm_palacio_de_la_cultura_medellinManifest } from './palacio-de-la-cultura-medellin/config.js';
import { OSM_WAYS as lm_palacio_de_la_cultura_medellinWays } from './palacio-de-la-cultura-medellin/footprint.js';
import { create as lm_palacio_de_la_cultura_medellinCreate } from './palacio-de-la-cultura-medellin/geometry.js';
import { VIEWS as lm_palacio_de_la_cultura_medellinViews } from './palacio-de-la-cultura-medellin/views.js';
import { MANIFEST as lm_old_orange_county_courthouseManifest } from './old-orange-county-courthouse/config.js';
import { OSM_WAYS as lm_old_orange_county_courthouseWays } from './old-orange-county-courthouse/footprint.js';
import { create as lm_old_orange_county_courthouseCreate } from './old-orange-county-courthouse/geometry.js';
import { VIEWS as lm_old_orange_county_courthouseViews } from './old-orange-county-courthouse/views.js';
import { MANIFEST as lm_christ_cathedralManifest } from './christ-cathedral/config.js';
import { OSM_WAYS as lm_christ_cathedralWays } from './christ-cathedral/footprint.js';
import { create as lm_christ_cathedralCreate } from './christ-cathedral/geometry.js';
import { VIEWS as lm_christ_cathedralViews } from './christ-cathedral/views.js';
import { MANIFEST as lm_mission_innManifest } from './mission-inn/config.js';
import { OSM_WAYS as lm_mission_innWays } from './mission-inn/footprint.js';
import { create as lm_mission_innCreate } from './mission-inn/geometry.js';
import { VIEWS as lm_mission_innViews } from './mission-inn/views.js';
import { MANIFEST as lm_palace_of_the_parliamentManifest } from './palace-of-the-parliament/config.js';
import { OSM_WAYS as lm_palace_of_the_parliamentWays } from './palace-of-the-parliament/footprint.js';
import { create as lm_palace_of_the_parliamentCreate } from './palace-of-the-parliament/geometry.js';
import { VIEWS as lm_palace_of_the_parliamentViews } from './palace-of-the-parliament/views.js';
import { MANIFEST as lm_arcul_de_triumfManifest } from './arcul-de-triumf/config.js';
import { OSM_WAYS as lm_arcul_de_triumfWays } from './arcul-de-triumf/footprint.js';
import { create as lm_arcul_de_triumfCreate } from './arcul-de-triumf/geometry.js';
import { VIEWS as lm_arcul_de_triumfViews } from './arcul-de-triumf/views.js';
import { MANIFEST as lm_romanian_athenaeumManifest } from './romanian-athenaeum/config.js';
import { OSM_WAYS as lm_romanian_athenaeumWays } from './romanian-athenaeum/footprint.js';
import { create as lm_romanian_athenaeumCreate } from './romanian-athenaeum/geometry.js';
import { VIEWS as lm_romanian_athenaeumViews } from './romanian-athenaeum/views.js';
import { MANIFEST as lm_colosseumManifest } from './colosseum/config.js';
import { OSM_WAYS as lm_colosseumWays } from './colosseum/footprint.js';
import { create as lm_colosseumCreate } from './colosseum/geometry.js';
import { VIEWS as lm_colosseumViews } from './colosseum/views.js';
import { MANIFEST as lm_altare_della_patriaManifest } from './altare-della-patria/config.js';
import { OSM_WAYS as lm_altare_della_patriaWays } from './altare-della-patria/footprint.js';
import { create as lm_altare_della_patriaCreate } from './altare-della-patria/geometry.js';
import { VIEWS as lm_altare_della_patriaViews } from './altare-della-patria/views.js';
import { MANIFEST as lm_st_peters_basilicaManifest } from './st-peters-basilica/config.js';
import { OSM_WAYS as lm_st_peters_basilicaWays } from './st-peters-basilica/footprint.js';
import { create as lm_st_peters_basilicaCreate } from './st-peters-basilica/geometry.js';
import { VIEWS as lm_st_peters_basilicaViews } from './st-peters-basilica/views.js';
import { MANIFEST as lm_teatro_nacional_de_costa_ricaManifest } from './teatro-nacional-de-costa-rica/config.js';
import { OSM_WAYS as lm_teatro_nacional_de_costa_ricaWays } from './teatro-nacional-de-costa-rica/footprint.js';
import { create as lm_teatro_nacional_de_costa_ricaCreate } from './teatro-nacional-de-costa-rica/geometry.js';
import { VIEWS as lm_teatro_nacional_de_costa_ricaViews } from './teatro-nacional-de-costa-rica/views.js';
import { MANIFEST as lm_catedral_metropolitana_san_joseManifest } from './catedral-metropolitana-san-jose/config.js';
import { OSM_WAYS as lm_catedral_metropolitana_san_joseWays } from './catedral-metropolitana-san-jose/footprint.js';
import { create as lm_catedral_metropolitana_san_joseCreate } from './catedral-metropolitana-san-jose/geometry.js';
import { VIEWS as lm_catedral_metropolitana_san_joseViews } from './catedral-metropolitana-san-jose/views.js';
import { MANIFEST as lm_basilique_de_fourviereManifest } from './basilique-de-fourviere/config.js';
import { OSM_WAYS as lm_basilique_de_fourviereWays } from './basilique-de-fourviere/footprint.js';
import { create as lm_basilique_de_fourviereCreate } from './basilique-de-fourviere/geometry.js';
import { VIEWS as lm_basilique_de_fourviereViews } from './basilique-de-fourviere/views.js';
import { MANIFEST as lm_tour_part_dieuManifest } from './tour-part-dieu/config.js';
import { OSM_WAYS as lm_tour_part_dieuWays } from './tour-part-dieu/footprint.js';
import { create as lm_tour_part_dieuCreate } from './tour-part-dieu/geometry.js';
import { VIEWS as lm_tour_part_dieuViews } from './tour-part-dieu/views.js';
import { MANIFEST as lm_musee_des_confluencesManifest } from './musee-des-confluences/config.js';
import { OSM_WAYS as lm_musee_des_confluencesWays } from './musee-des-confluences/footprint.js';
import { create as lm_musee_des_confluencesCreate } from './musee-des-confluences/geometry.js';
import { VIEWS as lm_musee_des_confluencesViews } from './musee-des-confluences/views.js';
import { MANIFEST as lm_gratte_ciel_villeurbanneManifest } from './gratte-ciel-villeurbanne/config.js';
import { OSM_WAYS as lm_gratte_ciel_villeurbanneWays } from './gratte-ciel-villeurbanne/footprint.js';
import { create as lm_gratte_ciel_villeurbanneCreate } from './gratte-ciel-villeurbanne/geometry.js';
import { VIEWS as lm_gratte_ciel_villeurbanneViews } from './gratte-ciel-villeurbanne/views.js';
import { MANIFEST as lm_torre_colpatriaManifest } from './torre-colpatria/config.js';
import { OSM_WAYS as lm_torre_colpatriaWays } from './torre-colpatria/footprint.js';
import { create as lm_torre_colpatriaCreate } from './torre-colpatria/geometry.js';
import { VIEWS as lm_torre_colpatriaViews } from './torre-colpatria/views.js';
import { MANIFEST as lm_catedral_primada_de_colombiaManifest } from './catedral-primada-de-colombia/config.js';
import { OSM_WAYS as lm_catedral_primada_de_colombiaWays } from './catedral-primada-de-colombia/footprint.js';
import { create as lm_catedral_primada_de_colombiaCreate } from './catedral-primada-de-colombia/geometry.js';
import { VIEWS as lm_catedral_primada_de_colombiaViews } from './catedral-primada-de-colombia/views.js';
import { MANIFEST as lm_liberty_memorialManifest } from './liberty-memorial/config.js';
import { OSM_WAYS as lm_liberty_memorialWays } from './liberty-memorial/footprint.js';
import { create as lm_liberty_memorialCreate } from './liberty-memorial/geometry.js';
import { VIEWS as lm_liberty_memorialViews } from './liberty-memorial/views.js';
import { MANIFEST as lm_christopher_s_bond_bridgeManifest } from './christopher-s-bond-bridge/config.js';
import { OSM_WAYS as lm_christopher_s_bond_bridgeWays } from './christopher-s-bond-bridge/footprint.js';
import { create as lm_christopher_s_bond_bridgeCreate } from './christopher-s-bond-bridge/geometry.js';
import { VIEWS as lm_christopher_s_bond_bridgeViews } from './christopher-s-bond-bridge/views.js';

const authoring = {
  'tower-bridge': { manifest: lm_tower_bridgeManifest, osmWays: lm_tower_bridgeWays, create: lm_tower_bridgeCreate, views: lm_tower_bridgeViews },
  'palace-of-westminster': { manifest: lm_palace_of_westminsterManifest, osmWays: lm_palace_of_westminsterWays, create: lm_palace_of_westminsterCreate, views: lm_palace_of_westminsterViews },
  'st-pauls-cathedral': { manifest: lm_st_pauls_cathedralManifest, osmWays: lm_st_pauls_cathedralWays, create: lm_st_pauls_cathedralCreate, views: lm_st_pauls_cathedralViews },
  'the-shard': { manifest: lm_the_shardManifest, osmWays: lm_the_shardWays, create: lm_the_shardCreate, views: lm_the_shardViews },
  'rijksmuseum': { manifest: lm_rijksmuseumManifest, osmWays: lm_rijksmuseumWays, create: lm_rijksmuseumCreate, views: lm_rijksmuseumViews },
  'amsterdam-centraal': { manifest: lm_amsterdam_centraalManifest, osmWays: lm_amsterdam_centraalWays, create: lm_amsterdam_centraalCreate, views: lm_amsterdam_centraalViews },
  'eye-filmmuseum': { manifest: lm_eye_filmmuseumManifest, osmWays: lm_eye_filmmuseumWays, create: lm_eye_filmmuseumCreate, views: lm_eye_filmmuseumViews },
  'palacio-real-de-madrid': { manifest: lm_palacio_real_de_madridManifest, osmWays: lm_palacio_real_de_madridWays, create: lm_palacio_real_de_madridCreate, views: lm_palacio_real_de_madridViews },
  'puerta-de-alcala': { manifest: lm_puerta_de_alcalaManifest, osmWays: lm_puerta_de_alcalaWays, create: lm_puerta_de_alcalaCreate, views: lm_puerta_de_alcalaViews },
  'puerta-de-europa': { manifest: lm_puerta_de_europaManifest, osmWays: lm_puerta_de_europaWays, create: lm_puerta_de_europaCreate, views: lm_puerta_de_europaViews },
  'reunion-tower': { manifest: lm_reunion_towerManifest, osmWays: lm_reunion_towerWays, create: lm_reunion_towerCreate, views: lm_reunion_towerViews },
  'bank-of-america-plaza-dallas': { manifest: lm_bank_of_america_plaza_dallasManifest, osmWays: lm_bank_of_america_plaza_dallasWays, create: lm_bank_of_america_plaza_dallasCreate, views: lm_bank_of_america_plaza_dallasViews },
  'margaret-hunt-hill-bridge': { manifest: lm_margaret_hunt_hill_bridgeManifest, osmWays: lm_margaret_hunt_hill_bridgeWays, create: lm_margaret_hunt_hill_bridgeCreate, views: lm_margaret_hunt_hill_bridgeViews },
  'margaret-mcdermott-bridge': { manifest: lm_margaret_mcdermott_bridgeManifest, osmWays: lm_margaret_mcdermott_bridgeWays, create: lm_margaret_mcdermott_bridgeCreate, views: lm_margaret_mcdermott_bridgeViews },
  'washington-monument': { manifest: lm_washington_monumentManifest, osmWays: lm_washington_monumentWays, create: lm_washington_monumentCreate, views: lm_washington_monumentViews },
  'united-states-capitol': { manifest: lm_united_states_capitolManifest, osmWays: lm_united_states_capitolWays, create: lm_united_states_capitolCreate, views: lm_united_states_capitolViews },
  'lincoln-memorial': { manifest: lm_lincoln_memorialManifest, osmWays: lm_lincoln_memorialWays, create: lm_lincoln_memorialCreate, views: lm_lincoln_memorialViews },
  'arlington-memorial-bridge': { manifest: lm_arlington_memorial_bridgeManifest, osmWays: lm_arlington_memorial_bridgeWays, create: lm_arlington_memorial_bridgeCreate, views: lm_arlington_memorial_bridgeViews },
  'edificio-coltejer': { manifest: lm_edificio_coltejerManifest, osmWays: lm_edificio_coltejerWays, create: lm_edificio_coltejerCreate, views: lm_edificio_coltejerViews },
  'catedral-metropolitana-de-medellin': { manifest: lm_catedral_metropolitana_de_medellinManifest, osmWays: lm_catedral_metropolitana_de_medellinWays, create: lm_catedral_metropolitana_de_medellinCreate, views: lm_catedral_metropolitana_de_medellinViews },
  'palacio-de-la-cultura-medellin': { manifest: lm_palacio_de_la_cultura_medellinManifest, osmWays: lm_palacio_de_la_cultura_medellinWays, create: lm_palacio_de_la_cultura_medellinCreate, views: lm_palacio_de_la_cultura_medellinViews },
  'old-orange-county-courthouse': { manifest: lm_old_orange_county_courthouseManifest, osmWays: lm_old_orange_county_courthouseWays, create: lm_old_orange_county_courthouseCreate, views: lm_old_orange_county_courthouseViews },
  'christ-cathedral': { manifest: lm_christ_cathedralManifest, osmWays: lm_christ_cathedralWays, create: lm_christ_cathedralCreate, views: lm_christ_cathedralViews },
  'mission-inn': { manifest: lm_mission_innManifest, osmWays: lm_mission_innWays, create: lm_mission_innCreate, views: lm_mission_innViews },
  'palace-of-the-parliament': { manifest: lm_palace_of_the_parliamentManifest, osmWays: lm_palace_of_the_parliamentWays, create: lm_palace_of_the_parliamentCreate, views: lm_palace_of_the_parliamentViews },
  'arcul-de-triumf': { manifest: lm_arcul_de_triumfManifest, osmWays: lm_arcul_de_triumfWays, create: lm_arcul_de_triumfCreate, views: lm_arcul_de_triumfViews },
  'romanian-athenaeum': { manifest: lm_romanian_athenaeumManifest, osmWays: lm_romanian_athenaeumWays, create: lm_romanian_athenaeumCreate, views: lm_romanian_athenaeumViews },
  'colosseum': { manifest: lm_colosseumManifest, osmWays: lm_colosseumWays, create: lm_colosseumCreate, views: lm_colosseumViews },
  'altare-della-patria': { manifest: lm_altare_della_patriaManifest, osmWays: lm_altare_della_patriaWays, create: lm_altare_della_patriaCreate, views: lm_altare_della_patriaViews },
  'st-peters-basilica': { manifest: lm_st_peters_basilicaManifest, osmWays: lm_st_peters_basilicaWays, create: lm_st_peters_basilicaCreate, views: lm_st_peters_basilicaViews },
  'teatro-nacional-de-costa-rica': { manifest: lm_teatro_nacional_de_costa_ricaManifest, osmWays: lm_teatro_nacional_de_costa_ricaWays, create: lm_teatro_nacional_de_costa_ricaCreate, views: lm_teatro_nacional_de_costa_ricaViews },
  'catedral-metropolitana-san-jose': { manifest: lm_catedral_metropolitana_san_joseManifest, osmWays: lm_catedral_metropolitana_san_joseWays, create: lm_catedral_metropolitana_san_joseCreate, views: lm_catedral_metropolitana_san_joseViews },
  'basilique-de-fourviere': { manifest: lm_basilique_de_fourviereManifest, osmWays: lm_basilique_de_fourviereWays, create: lm_basilique_de_fourviereCreate, views: lm_basilique_de_fourviereViews },
  'tour-part-dieu': { manifest: lm_tour_part_dieuManifest, osmWays: lm_tour_part_dieuWays, create: lm_tour_part_dieuCreate, views: lm_tour_part_dieuViews },
  'musee-des-confluences': { manifest: lm_musee_des_confluencesManifest, osmWays: lm_musee_des_confluencesWays, create: lm_musee_des_confluencesCreate, views: lm_musee_des_confluencesViews },
  'gratte-ciel-villeurbanne': { manifest: lm_gratte_ciel_villeurbanneManifest, osmWays: lm_gratte_ciel_villeurbanneWays, create: lm_gratte_ciel_villeurbanneCreate, views: lm_gratte_ciel_villeurbanneViews },
  'torre-colpatria': { manifest: lm_torre_colpatriaManifest, osmWays: lm_torre_colpatriaWays, create: lm_torre_colpatriaCreate, views: lm_torre_colpatriaViews },
  'catedral-primada-de-colombia': { manifest: lm_catedral_primada_de_colombiaManifest, osmWays: lm_catedral_primada_de_colombiaWays, create: lm_catedral_primada_de_colombiaCreate, views: lm_catedral_primada_de_colombiaViews },
  'liberty-memorial': { manifest: lm_liberty_memorialManifest, osmWays: lm_liberty_memorialWays, create: lm_liberty_memorialCreate, views: lm_liberty_memorialViews },
  'christopher-s-bond-bridge': { manifest: lm_christopher_s_bond_bridgeManifest, osmWays: lm_christopher_s_bond_bridgeWays, create: lm_christopher_s_bond_bridgeCreate, views: lm_christopher_s_bond_bridgeViews },
};

export const TOP_CITIES_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const topCitiesLandmark = (id) => TOP_CITIES_LANDMARKS.find((l) => l.id === id) || null;
