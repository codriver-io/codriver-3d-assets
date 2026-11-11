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
import { MANIFEST as lm_lions_gate_bridgeManifest } from './lions-gate-bridge/config.js';
import { OSM_WAYS as lm_lions_gate_bridgeWays } from './lions-gate-bridge/footprint.js';
import { create as lm_lions_gate_bridgeCreate } from './lions-gate-bridge/geometry.js';
import { VIEWS as lm_lions_gate_bridgeViews } from './lions-gate-bridge/views.js';
import { MANIFEST as lm_port_mann_bridgeManifest } from './port-mann-bridge/config.js';
import { OSM_WAYS as lm_port_mann_bridgeWays } from './port-mann-bridge/footprint.js';
import { create as lm_port_mann_bridgeCreate } from './port-mann-bridge/geometry.js';
import { VIEWS as lm_port_mann_bridgeViews } from './port-mann-bridge/views.js';
import { MANIFEST as lm_burrard_street_bridgeManifest } from './burrard-street-bridge/config.js';
import { OSM_WAYS as lm_burrard_street_bridgeWays } from './burrard-street-bridge/footprint.js';
import { create as lm_burrard_street_bridgeCreate } from './burrard-street-bridge/geometry.js';
import { VIEWS as lm_burrard_street_bridgeViews } from './burrard-street-bridge/views.js';
import { MANIFEST as lm_canada_placeManifest } from './canada-place/config.js';
import { OSM_WAYS as lm_canada_placeWays } from './canada-place/footprint.js';
import { create as lm_canada_placeCreate } from './canada-place/geometry.js';
import { VIEWS as lm_canada_placeViews } from './canada-place/views.js';
import { MANIFEST as lm_science_world_vancouverManifest } from './science-world-vancouver/config.js';
import { OSM_WAYS as lm_science_world_vancouverWays } from './science-world-vancouver/footprint.js';
import { create as lm_science_world_vancouverCreate } from './science-world-vancouver/geometry.js';
import { VIEWS as lm_science_world_vancouverViews } from './science-world-vancouver/views.js';
import { MANIFEST as lm_bc_placeManifest } from './bc-place/config.js';
import { OSM_WAYS as lm_bc_placeWays } from './bc-place/footprint.js';
import { create as lm_bc_placeCreate } from './bc-place/geometry.js';
import { VIEWS as lm_bc_placeViews } from './bc-place/views.js';
import { MANIFEST as lm_harbour_centreManifest } from './harbour-centre/config.js';
import { OSM_WAYS as lm_harbour_centreWays } from './harbour-centre/footprint.js';
import { create as lm_harbour_centreCreate } from './harbour-centre/geometry.js';
import { VIEWS as lm_harbour_centreViews } from './harbour-centre/views.js';
import { MANIFEST as lm_vancouver_houseManifest } from './vancouver-house/config.js';
import { OSM_WAYS as lm_vancouver_houseWays } from './vancouver-house/footprint.js';
import { create as lm_vancouver_houseCreate } from './vancouver-house/geometry.js';
import { VIEWS as lm_vancouver_houseViews } from './vancouver-house/views.js';
import { MANIFEST as lm_bc_parliament_buildingsManifest } from './bc-parliament-buildings/config.js';
import { OSM_WAYS as lm_bc_parliament_buildingsWays } from './bc-parliament-buildings/footprint.js';
import { create as lm_bc_parliament_buildingsCreate } from './bc-parliament-buildings/geometry.js';
import { VIEWS as lm_bc_parliament_buildingsViews } from './bc-parliament-buildings/views.js';
import { MANIFEST as lm_fairmont_empressManifest } from './fairmont-empress/config.js';
import { OSM_WAYS as lm_fairmont_empressWays } from './fairmont-empress/footprint.js';
import { create as lm_fairmont_empressCreate } from './fairmont-empress/geometry.js';
import { VIEWS as lm_fairmont_empressViews } from './fairmont-empress/views.js';
import { MANIFEST as lm_alberta_legislature_buildingManifest } from './alberta-legislature-building/config.js';
import { OSM_WAYS as lm_alberta_legislature_buildingWays } from './alberta-legislature-building/footprint.js';
import { create as lm_alberta_legislature_buildingCreate } from './alberta-legislature-building/geometry.js';
import { VIEWS as lm_alberta_legislature_buildingViews } from './alberta-legislature-building/views.js';
import { MANIFEST as lm_walterdale_bridgeManifest } from './walterdale-bridge/config.js';
import { OSM_WAYS as lm_walterdale_bridgeWays } from './walterdale-bridge/footprint.js';
import { create as lm_walterdale_bridgeCreate } from './walterdale-bridge/geometry.js';
import { VIEWS as lm_walterdale_bridgeViews } from './walterdale-bridge/views.js';
import { MANIFEST as lm_fairmont_banff_springsManifest } from './fairmont-banff-springs/config.js';
import { OSM_WAYS as lm_fairmont_banff_springsWays } from './fairmont-banff-springs/footprint.js';
import { create as lm_fairmont_banff_springsCreate } from './fairmont-banff-springs/geometry.js';
import { VIEWS as lm_fairmont_banff_springsViews } from './fairmont-banff-springs/views.js';
import { MANIFEST as lm_canadian_museum_for_human_rightsManifest } from './canadian-museum-for-human-rights/config.js';
import { OSM_WAYS as lm_canadian_museum_for_human_rightsWays } from './canadian-museum-for-human-rights/footprint.js';
import { create as lm_canadian_museum_for_human_rightsCreate } from './canadian-museum-for-human-rights/geometry.js';
import { VIEWS as lm_canadian_museum_for_human_rightsViews } from './canadian-museum-for-human-rights/views.js';
import { MANIFEST as lm_storseisundet_bridgeManifest } from './storseisundet-bridge/config.js';
import { OSM_WAYS as lm_storseisundet_bridgeWays } from './storseisundet-bridge/footprint.js';
import { create as lm_storseisundet_bridgeCreate } from './storseisundet-bridge/geometry.js';
import { VIEWS as lm_storseisundet_bridgeViews } from './storseisundet-bridge/views.js';
import { MANIFEST as lm_halogaland_bridgeManifest } from './halogaland-bridge/config.js';
import { OSM_WAYS as lm_halogaland_bridgeWays } from './halogaland-bridge/footprint.js';
import { create as lm_halogaland_bridgeCreate } from './halogaland-bridge/geometry.js';
import { VIEWS as lm_halogaland_bridgeViews } from './halogaland-bridge/views.js';
import { MANIFEST as lm_hardanger_bridgeManifest } from './hardanger-bridge/config.js';
import { OSM_WAYS as lm_hardanger_bridgeWays } from './hardanger-bridge/footprint.js';
import { create as lm_hardanger_bridgeCreate } from './hardanger-bridge/geometry.js';
import { VIEWS as lm_hardanger_bridgeViews } from './hardanger-bridge/views.js';
import { MANIFEST as lm_tromso_bridgeManifest } from './tromso-bridge/config.js';
import { OSM_WAYS as lm_tromso_bridgeWays } from './tromso-bridge/footprint.js';
import { create as lm_tromso_bridgeCreate } from './tromso-bridge/geometry.js';
import { VIEWS as lm_tromso_bridgeViews } from './tromso-bridge/views.js';
import { MANIFEST as lm_helgeland_bridgeManifest } from './helgeland-bridge/config.js';
import { OSM_WAYS as lm_helgeland_bridgeWays } from './helgeland-bridge/footprint.js';
import { create as lm_helgeland_bridgeCreate } from './helgeland-bridge/geometry.js';
import { VIEWS as lm_helgeland_bridgeViews } from './helgeland-bridge/views.js';
import { MANIFEST as lm_svinesund_bridgeManifest } from './svinesund-bridge/config.js';
import { OSM_WAYS as lm_svinesund_bridgeWays } from './svinesund-bridge/footprint.js';
import { create as lm_svinesund_bridgeCreate } from './svinesund-bridge/geometry.js';
import { VIEWS as lm_svinesund_bridgeViews } from './svinesund-bridge/views.js';
import { MANIFEST as lm_oslo_opera_houseManifest } from './oslo-opera-house/config.js';
import { OSM_WAYS as lm_oslo_opera_houseWays } from './oslo-opera-house/footprint.js';
import { create as lm_oslo_opera_houseCreate } from './oslo-opera-house/geometry.js';
import { VIEWS as lm_oslo_opera_houseViews } from './oslo-opera-house/views.js';
import { MANIFEST as lm_oslo_city_hallManifest } from './oslo-city-hall/config.js';
import { OSM_WAYS as lm_oslo_city_hallWays } from './oslo-city-hall/footprint.js';
import { create as lm_oslo_city_hallCreate } from './oslo-city-hall/geometry.js';
import { VIEWS as lm_oslo_city_hallViews } from './oslo-city-hall/views.js';
import { MANIFEST as lm_royal_palace_osloManifest } from './royal-palace-oslo/config.js';
import { OSM_WAYS as lm_royal_palace_osloWays } from './royal-palace-oslo/footprint.js';
import { create as lm_royal_palace_osloCreate } from './royal-palace-oslo/geometry.js';
import { VIEWS as lm_royal_palace_osloViews } from './royal-palace-oslo/views.js';
import { MANIFEST as lm_holmenkollbakkenManifest } from './holmenkollbakken/config.js';
import { OSM_WAYS as lm_holmenkollbakkenWays } from './holmenkollbakken/footprint.js';
import { create as lm_holmenkollbakkenCreate } from './holmenkollbakken/geometry.js';
import { VIEWS as lm_holmenkollbakkenViews } from './holmenkollbakken/views.js';
import { MANIFEST as lm_munch_museumManifest } from './munch-museum/config.js';
import { OSM_WAYS as lm_munch_museumWays } from './munch-museum/footprint.js';
import { create as lm_munch_museumCreate } from './munch-museum/geometry.js';
import { VIEWS as lm_munch_museumViews } from './munch-museum/views.js';
import { MANIFEST as lm_akershus_fortressManifest } from './akershus-fortress/config.js';
import { OSM_WAYS as lm_akershus_fortressWays } from './akershus-fortress/footprint.js';
import { create as lm_akershus_fortressCreate } from './akershus-fortress/geometry.js';
import { VIEWS as lm_akershus_fortressViews } from './akershus-fortress/views.js';
import { MANIFEST as lm_astrup_fearnley_museumManifest } from './astrup-fearnley-museum/config.js';
import { OSM_WAYS as lm_astrup_fearnley_museumWays } from './astrup-fearnley-museum/footprint.js';
import { create as lm_astrup_fearnley_museumCreate } from './astrup-fearnley-museum/geometry.js';
import { VIEWS as lm_astrup_fearnley_museumViews } from './astrup-fearnley-museum/views.js';
import { MANIFEST as lm_bryggenManifest } from './bryggen/config.js';
import { OSM_WAYS as lm_bryggenWays } from './bryggen/footprint.js';
import { create as lm_bryggenCreate } from './bryggen/geometry.js';
import { VIEWS as lm_bryggenViews } from './bryggen/views.js';
import { MANIFEST as lm_nidaros_cathedralManifest } from './nidaros-cathedral/config.js';
import { OSM_WAYS as lm_nidaros_cathedralWays } from './nidaros-cathedral/footprint.js';
import { create as lm_nidaros_cathedralCreate } from './nidaros-cathedral/geometry.js';
import { VIEWS as lm_nidaros_cathedralViews } from './nidaros-cathedral/views.js';
import { MANIFEST as lm_arctic_cathedralManifest } from './arctic-cathedral/config.js';
import { OSM_WAYS as lm_arctic_cathedralWays } from './arctic-cathedral/footprint.js';
import { create as lm_arctic_cathedralCreate } from './arctic-cathedral/geometry.js';
import { VIEWS as lm_arctic_cathedralViews } from './arctic-cathedral/views.js';
import { MANIFEST as lm_norwegian_petroleum_museumManifest } from './norwegian-petroleum-museum/config.js';
import { OSM_WAYS as lm_norwegian_petroleum_museumWays } from './norwegian-petroleum-museum/footprint.js';
import { create as lm_norwegian_petroleum_museumCreate } from './norwegian-petroleum-museum/geometry.js';
import { VIEWS as lm_norwegian_petroleum_museumViews } from './norwegian-petroleum-museum/views.js';
import { MANIFEST as lm_vikingskipetManifest } from './vikingskipet/config.js';
import { OSM_WAYS as lm_vikingskipetWays } from './vikingskipet/footprint.js';
import { create as lm_vikingskipetCreate } from './vikingskipet/geometry.js';
import { VIEWS as lm_vikingskipetViews } from './vikingskipet/views.js';
import { MANIFEST as lm_kilden_performing_arts_centreManifest } from './kilden-performing-arts-centre/config.js';
import { OSM_WAYS as lm_kilden_performing_arts_centreWays } from './kilden-performing-arts-centre/footprint.js';
import { create as lm_kilden_performing_arts_centreCreate } from './kilden-performing-arts-centre/geometry.js';
import { VIEWS as lm_kilden_performing_arts_centreViews } from './kilden-performing-arts-centre/views.js';
import { MANIFEST as lm_borgund_stave_churchManifest } from './borgund-stave-church/config.js';
import { OSM_WAYS as lm_borgund_stave_churchWays } from './borgund-stave-church/footprint.js';
import { create as lm_borgund_stave_churchCreate } from './borgund-stave-church/geometry.js';
import { VIEWS as lm_borgund_stave_churchViews } from './borgund-stave-church/views.js';
import { MANIFEST as lm_farris_badManifest } from './farris-bad/config.js';
import { OSM_WAYS as lm_farris_badWays } from './farris-bad/footprint.js';
import { create as lm_farris_badCreate } from './farris-bad/geometry.js';
import { VIEWS as lm_farris_badViews } from './farris-bad/views.js';
import { MANIFEST as lm_pont_neuf_toulouseManifest } from './pont-neuf-toulouse/config.js';
import { OSM_WAYS as lm_pont_neuf_toulouseWays } from './pont-neuf-toulouse/footprint.js';
import { create as lm_pont_neuf_toulouseCreate } from './pont-neuf-toulouse/geometry.js';
import { VIEWS as lm_pont_neuf_toulouseViews } from './pont-neuf-toulouse/views.js';
import { MANIFEST as lm_pont_des_catalansManifest } from './pont-des-catalans/config.js';
import { OSM_WAYS as lm_pont_des_catalansWays } from './pont-des-catalans/footprint.js';
import { create as lm_pont_des_catalansCreate } from './pont-des-catalans/geometry.js';
import { VIEWS as lm_pont_des_catalansViews } from './pont-des-catalans/views.js';
import { MANIFEST as lm_viaduc_de_millauManifest } from './viaduc-de-millau/config.js';
import { OSM_WAYS as lm_viaduc_de_millauWays } from './viaduc-de-millau/footprint.js';
import { create as lm_viaduc_de_millauCreate } from './viaduc-de-millau/geometry.js';
import { VIEWS as lm_viaduc_de_millauViews } from './viaduc-de-millau/views.js';
import { MANIFEST as lm_basilique_saint_serninManifest } from './basilique-saint-sernin/config.js';
import { OSM_WAYS as lm_basilique_saint_serninWays } from './basilique-saint-sernin/footprint.js';
import { create as lm_basilique_saint_serninCreate } from './basilique-saint-sernin/geometry.js';
import { VIEWS as lm_basilique_saint_serninViews } from './basilique-saint-sernin/views.js';
import { MANIFEST as lm_capitole_de_toulouseManifest } from './capitole-de-toulouse/config.js';
import { OSM_WAYS as lm_capitole_de_toulouseWays } from './capitole-de-toulouse/footprint.js';
import { create as lm_capitole_de_toulouseCreate } from './capitole-de-toulouse/geometry.js';
import { VIEWS as lm_capitole_de_toulouseViews } from './capitole-de-toulouse/views.js';
import { MANIFEST as lm_dome_de_la_graveManifest } from './dome-de-la-grave/config.js';
import { OSM_WAYS as lm_dome_de_la_graveWays } from './dome-de-la-grave/footprint.js';
import { create as lm_dome_de_la_graveCreate } from './dome-de-la-grave/geometry.js';
import { VIEWS as lm_dome_de_la_graveViews } from './dome-de-la-grave/views.js';
import { MANIFEST as lm_cite_de_l_espaceManifest } from './cite-de-l-espace/config.js';
import { OSM_WAYS as lm_cite_de_l_espaceWays } from './cite-de-l-espace/footprint.js';
import { create as lm_cite_de_l_espaceCreate } from './cite-de-l-espace/geometry.js';
import { VIEWS as lm_cite_de_l_espaceViews } from './cite-de-l-espace/views.js';
import { MANIFEST as lm_couvent_des_jacobinsManifest } from './couvent-des-jacobins/config.js';
import { OSM_WAYS as lm_couvent_des_jacobinsWays } from './couvent-des-jacobins/footprint.js';
import { create as lm_couvent_des_jacobinsCreate } from './couvent-des-jacobins/geometry.js';
import { VIEWS as lm_couvent_des_jacobinsViews } from './couvent-des-jacobins/views.js';
import { MANIFEST as lm_cite_de_carcassonneManifest } from './cite-de-carcassonne/config.js';
import { OSM_WAYS as lm_cite_de_carcassonneWays } from './cite-de-carcassonne/footprint.js';
import { create as lm_cite_de_carcassonneCreate } from './cite-de-carcassonne/geometry.js';
import { VIEWS as lm_cite_de_carcassonneViews } from './cite-de-carcassonne/views.js';
import { MANIFEST as lm_cathedrale_sainte_cecile_albiManifest } from './cathedrale-sainte-cecile-albi/config.js';
import { OSM_WAYS as lm_cathedrale_sainte_cecile_albiWays } from './cathedrale-sainte-cecile-albi/footprint.js';
import { create as lm_cathedrale_sainte_cecile_albiCreate } from './cathedrale-sainte-cecile-albi/geometry.js';
import { VIEWS as lm_cathedrale_sainte_cecile_albiViews } from './cathedrale-sainte-cecile-albi/views.js';
import { MANIFEST as lm_pont_saint_pierreManifest } from './pont-saint-pierre/config.js';
import { OSM_WAYS as lm_pont_saint_pierreWays } from './pont-saint-pierre/footprint.js';
import { create as lm_pont_saint_pierreCreate } from './pont-saint-pierre/geometry.js';
import { VIEWS as lm_pont_saint_pierreViews } from './pont-saint-pierre/views.js';
import { MANIFEST as lm_pont_saint_michelManifest } from './pont-saint-michel/config.js';
import { OSM_WAYS as lm_pont_saint_michelWays } from './pont-saint-michel/footprint.js';
import { create as lm_pont_saint_michelCreate } from './pont-saint-michel/geometry.js';
import { VIEWS as lm_pont_saint_michelViews } from './pont-saint-michel/views.js';
import { MANIFEST as lm_ponts_jumeauxManifest } from './ponts-jumeaux/config.js';
import { OSM_WAYS as lm_ponts_jumeauxWays } from './ponts-jumeaux/footprint.js';
import { create as lm_ponts_jumeauxCreate } from './ponts-jumeaux/geometry.js';
import { VIEWS as lm_ponts_jumeauxViews } from './ponts-jumeaux/views.js';
import { MANIFEST as lm_viaduc_de_calixManifest } from './viaduc-de-calix/config.js';
import { OSM_WAYS as lm_viaduc_de_calixWays } from './viaduc-de-calix/footprint.js';
import { create as lm_viaduc_de_calixCreate } from './viaduc-de-calix/geometry.js';
import { VIEWS as lm_viaduc_de_calixViews } from './viaduc-de-calix/views.js';
import { MANIFEST as lm_pegasus_bridgeManifest } from './pegasus-bridge/config.js';
import { OSM_WAYS as lm_pegasus_bridgeWays } from './pegasus-bridge/footprint.js';
import { create as lm_pegasus_bridgeCreate } from './pegasus-bridge/geometry.js';
import { VIEWS as lm_pegasus_bridgeViews } from './pegasus-bridge/views.js';
import { MANIFEST as lm_pont_de_la_fonderieManifest } from './pont-de-la-fonderie/config.js';
import { OSM_WAYS as lm_pont_de_la_fonderieWays } from './pont-de-la-fonderie/footprint.js';
import { create as lm_pont_de_la_fonderieCreate } from './pont-de-la-fonderie/geometry.js';
import { VIEWS as lm_pont_de_la_fonderieViews } from './pont-de-la-fonderie/views.js';
import { MANIFEST as lm_pont_de_normandieManifest } from './pont-de-normandie/config.js';
import { OSM_WAYS as lm_pont_de_normandieWays } from './pont-de-normandie/footprint.js';
import { create as lm_pont_de_normandieCreate } from './pont-de-normandie/geometry.js';
import { VIEWS as lm_pont_de_normandieViews } from './pont-de-normandie/views.js';
import { MANIFEST as lm_abbaye_aux_hommesManifest } from './abbaye-aux-hommes/config.js';
import { OSM_WAYS as lm_abbaye_aux_hommesWays } from './abbaye-aux-hommes/footprint.js';
import { create as lm_abbaye_aux_hommesCreate } from './abbaye-aux-hommes/geometry.js';
import { VIEWS as lm_abbaye_aux_hommesViews } from './abbaye-aux-hommes/views.js';
import { MANIFEST as lm_chateau_de_caenManifest } from './chateau-de-caen/config.js';
import { OSM_WAYS as lm_chateau_de_caenWays } from './chateau-de-caen/footprint.js';
import { create as lm_chateau_de_caenCreate } from './chateau-de-caen/geometry.js';
import { VIEWS as lm_chateau_de_caenViews } from './chateau-de-caen/views.js';
import { MANIFEST as lm_eglise_saint_pierre_caenManifest } from './eglise-saint-pierre-caen/config.js';
import { OSM_WAYS as lm_eglise_saint_pierre_caenWays } from './eglise-saint-pierre-caen/footprint.js';
import { create as lm_eglise_saint_pierre_caenCreate } from './eglise-saint-pierre-caen/geometry.js';
import { VIEWS as lm_eglise_saint_pierre_caenViews } from './eglise-saint-pierre-caen/views.js';
import { MANIFEST as lm_abbaye_aux_damesManifest } from './abbaye-aux-dames/config.js';
import { OSM_WAYS as lm_abbaye_aux_damesWays } from './abbaye-aux-dames/footprint.js';
import { create as lm_abbaye_aux_damesCreate } from './abbaye-aux-dames/geometry.js';
import { VIEWS as lm_abbaye_aux_damesViews } from './abbaye-aux-dames/views.js';
import { MANIFEST as lm_memorial_de_caenManifest } from './memorial-de-caen/config.js';
import { OSM_WAYS as lm_memorial_de_caenWays } from './memorial-de-caen/footprint.js';
import { create as lm_memorial_de_caenCreate } from './memorial-de-caen/geometry.js';
import { VIEWS as lm_memorial_de_caenViews } from './memorial-de-caen/views.js';
import { MANIFEST as lm_cathedrale_de_bayeuxManifest } from './cathedrale-de-bayeux/config.js';
import { OSM_WAYS as lm_cathedrale_de_bayeuxWays } from './cathedrale-de-bayeux/footprint.js';
import { create as lm_cathedrale_de_bayeuxCreate } from './cathedrale-de-bayeux/geometry.js';
import { VIEWS as lm_cathedrale_de_bayeuxViews } from './cathedrale-de-bayeux/views.js';
import { MANIFEST as lm_georgia_state_capitolManifest } from './georgia-state-capitol/config.js';
import { OSM_WAYS as lm_georgia_state_capitolWays } from './georgia-state-capitol/footprint.js';
import { create as lm_georgia_state_capitolCreate } from './georgia-state-capitol/geometry.js';
import { VIEWS as lm_georgia_state_capitolViews } from './georgia-state-capitol/views.js';
import { MANIFEST as lm_bank_of_america_plaza_atlantaManifest } from './bank-of-america-plaza-atlanta/config.js';
import { OSM_WAYS as lm_bank_of_america_plaza_atlantaWays } from './bank-of-america-plaza-atlanta/footprint.js';
import { create as lm_bank_of_america_plaza_atlantaCreate } from './bank-of-america-plaza-atlanta/geometry.js';
import { VIEWS as lm_bank_of_america_plaza_atlantaViews } from './bank-of-america-plaza-atlanta/views.js';
import { MANIFEST as lm_sunshine_skyway_bridgeManifest } from './sunshine-skyway-bridge/config.js';
import { OSM_WAYS as lm_sunshine_skyway_bridgeWays } from './sunshine-skyway-bridge/footprint.js';
import { create as lm_sunshine_skyway_bridgeCreate } from './sunshine-skyway-bridge/geometry.js';
import { VIEWS as lm_sunshine_skyway_bridgeViews } from './sunshine-skyway-bridge/views.js';
import { MANIFEST as lm_dallas_city_hallManifest } from './dallas-city-hall/config.js';
import { OSM_WAYS as lm_dallas_city_hallWays } from './dallas-city-hall/footprint.js';
import { create as lm_dallas_city_hallCreate } from './dallas-city-hall/geometry.js';
import { VIEWS as lm_dallas_city_hallViews } from './dallas-city-hall/views.js';
import { MANIFEST as lm_fox_theatre_atlantaManifest } from './fox-theatre-atlanta/config.js';
import { OSM_WAYS as lm_fox_theatre_atlantaWays } from './fox-theatre-atlanta/footprint.js';
import { create as lm_fox_theatre_atlantaCreate } from './fox-theatre-atlanta/geometry.js';
import { VIEWS as lm_fox_theatre_atlantaViews } from './fox-theatre-atlanta/views.js';
import { MANIFEST as lm_lviv_national_operaManifest } from './lviv-national-opera/config.js';
import { OSM_WAYS as lm_lviv_national_operaWays } from './lviv-national-opera/footprint.js';
import { create as lm_lviv_national_operaCreate } from './lviv-national-opera/geometry.js';
import { VIEWS as lm_lviv_national_operaViews } from './lviv-national-opera/views.js';
import { MANIFEST as lm_jpmorgan_chase_tower_houstonManifest } from './jpmorgan-chase-tower-houston/config.js';
import { OSM_WAYS as lm_jpmorgan_chase_tower_houstonWays } from './jpmorgan-chase-tower-houston/footprint.js';
import { create as lm_jpmorgan_chase_tower_houstonCreate } from './jpmorgan-chase-tower-houston/geometry.js';
import { VIEWS as lm_jpmorgan_chase_tower_houstonViews } from './jpmorgan-chase-tower-houston/views.js';
import { MANIFEST as lm_willis_towerManifest } from './willis-tower/config.js';
import { OSM_WAYS as lm_willis_towerWays } from './willis-tower/footprint.js';
import { create as lm_willis_towerCreate } from './willis-tower/geometry.js';
import { VIEWS as lm_willis_towerViews } from './willis-tower/views.js';
import { MANIFEST as lm_mercedes_benz_stadiumManifest } from './mercedes-benz-stadium/config.js';
import { OSM_WAYS as lm_mercedes_benz_stadiumWays } from './mercedes-benz-stadium/footprint.js';
import { create as lm_mercedes_benz_stadiumCreate } from './mercedes-benz-stadium/geometry.js';
import { VIEWS as lm_mercedes_benz_stadiumViews } from './mercedes-benz-stadium/views.js';
import { MANIFEST as lm_edificio_de_correos_costa_ricaManifest } from './edificio-de-correos-costa-rica/config.js';
import { OSM_WAYS as lm_edificio_de_correos_costa_ricaWays } from './edificio-de-correos-costa-rica/footprint.js';
import { create as lm_edificio_de_correos_costa_ricaCreate } from './edificio-de-correos-costa-rica/geometry.js';
import { VIEWS as lm_edificio_de_correos_costa_ricaViews } from './edificio-de-correos-costa-rica/views.js';
import { MANIFEST as lm_helsinki_cathedralManifest } from './helsinki-cathedral/config.js';
import { OSM_WAYS as lm_helsinki_cathedralWays } from './helsinki-cathedral/footprint.js';
import { create as lm_helsinki_cathedralCreate } from './helsinki-cathedral/geometry.js';
import { VIEWS as lm_helsinki_cathedralViews } from './helsinki-cathedral/views.js';
import { MANIFEST as lm_freedom_tower_miamiManifest } from './freedom-tower-miami/config.js';
import { OSM_WAYS as lm_freedom_tower_miamiWays } from './freedom-tower-miami/footprint.js';
import { create as lm_freedom_tower_miamiCreate } from './freedom-tower-miami/geometry.js';
import { VIEWS as lm_freedom_tower_miamiViews } from './freedom-tower-miami/views.js';
import { MANIFEST as lm_texas_state_capitolManifest } from './texas-state-capitol/config.js';
import { OSM_WAYS as lm_texas_state_capitolWays } from './texas-state-capitol/footprint.js';
import { create as lm_texas_state_capitolCreate } from './texas-state-capitol/geometry.js';
import { VIEWS as lm_texas_state_capitolViews } from './texas-state-capitol/views.js';
import { MANIFEST as lm_ohio_statehouseManifest } from './ohio-statehouse/config.js';
import { OSM_WAYS as lm_ohio_statehouseWays } from './ohio-statehouse/footprint.js';
import { create as lm_ohio_statehouseCreate } from './ohio-statehouse/geometry.js';
import { VIEWS as lm_ohio_statehouseViews } from './ohio-statehouse/views.js';
import { MANIFEST as lm_royal_palace_amsterdamManifest } from './royal-palace-amsterdam/config.js';
import { OSM_WAYS as lm_royal_palace_amsterdamWays } from './royal-palace-amsterdam/footprint.js';
import { create as lm_royal_palace_amsterdamCreate } from './royal-palace-amsterdam/geometry.js';
import { VIEWS as lm_royal_palace_amsterdamViews } from './royal-palace-amsterdam/views.js';
import { MANIFEST as lm_vulcan_statueManifest } from './vulcan-statue/config.js';
import { OSM_WAYS as lm_vulcan_statueWays } from './vulcan-statue/footprint.js';
import { create as lm_vulcan_statueCreate } from './vulcan-statue/geometry.js';
import { VIEWS as lm_vulcan_statueViews } from './vulcan-statue/views.js';
import { MANIFEST as lm_griffith_observatoryManifest } from './griffith-observatory/config.js';
import { OSM_WAYS as lm_griffith_observatoryWays } from './griffith-observatory/footprint.js';
import { create as lm_griffith_observatoryCreate } from './griffith-observatory/geometry.js';
import { VIEWS as lm_griffith_observatoryViews } from './griffith-observatory/views.js';
import { MANIFEST as lm_mercedes_benz_museumManifest } from './mercedes-benz-museum/config.js';
import { OSM_WAYS as lm_mercedes_benz_museumWays } from './mercedes-benz-museum/footprint.js';
import { create as lm_mercedes_benz_museumCreate } from './mercedes-benz-museum/geometry.js';
import { VIEWS as lm_mercedes_benz_museumViews } from './mercedes-benz-museum/views.js';
import { MANIFEST as lm_notre_dame_de_la_gardeManifest } from './notre-dame-de-la-garde/config.js';
import { OSM_WAYS as lm_notre_dame_de_la_gardeWays } from './notre-dame-de-la-garde/footprint.js';
import { create as lm_notre_dame_de_la_gardeCreate } from './notre-dame-de-la-garde/geometry.js';
import { VIEWS as lm_notre_dame_de_la_gardeViews } from './notre-dame-de-la-garde/views.js';
import { MANIFEST as lm_att_stadiumManifest } from './att-stadium/config.js';
import { OSM_WAYS as lm_att_stadiumWays } from './att-stadium/footprint.js';
import { create as lm_att_stadiumCreate } from './att-stadium/geometry.js';
import { VIEWS as lm_att_stadiumViews } from './att-stadium/views.js';
import { MANIFEST as lm_golden_ears_bridgeManifest } from './golden-ears-bridge/config.js';
import { OSM_WAYS as lm_golden_ears_bridgeWays } from './golden-ears-bridge/footprint.js';
import { create as lm_golden_ears_bridgeCreate } from './golden-ears-bridge/geometry.js';
import { VIEWS as lm_golden_ears_bridgeViews } from './golden-ears-bridge/views.js';
import { MANIFEST as lm_westin_peachtree_plazaManifest } from './westin-peachtree-plaza/config.js';
import { OSM_WAYS as lm_westin_peachtree_plazaWays } from './westin-peachtree-plaza/footprint.js';
import { create as lm_westin_peachtree_plazaCreate } from './westin-peachtree-plaza/geometry.js';
import { VIEWS as lm_westin_peachtree_plazaViews } from './westin-peachtree-plaza/views.js';
import { MANIFEST as lm_ponte_25_de_abrilManifest } from './ponte-25-de-abril/config.js';
import { OSM_WAYS as lm_ponte_25_de_abrilWays } from './ponte-25-de-abril/footprint.js';
import { create as lm_ponte_25_de_abrilCreate } from './ponte-25-de-abril/geometry.js';
import { VIEWS as lm_ponte_25_de_abrilViews } from './ponte-25-de-abril/views.js';
import { MANIFEST as lm_white_houseManifest } from './white-house/config.js';
import { OSM_WAYS as lm_white_houseWays } from './white-house/footprint.js';
import { create as lm_white_houseCreate } from './white-house/geometry.js';
import { VIEWS as lm_white_houseViews } from './white-house/views.js';
import { MANIFEST as lm_westerkerkManifest } from './westerkerk/config.js';
import { OSM_WAYS as lm_westerkerkWays } from './westerkerk/footprint.js';
import { create as lm_westerkerkCreate } from './westerkerk/geometry.js';
import { VIEWS as lm_westerkerkViews } from './westerkerk/views.js';
import { MANIFEST as lm_cologne_cathedralManifest } from './cologne-cathedral/config.js';
import { OSM_WAYS as lm_cologne_cathedralWays } from './cologne-cathedral/footprint.js';
import { create as lm_cologne_cathedralCreate } from './cologne-cathedral/geometry.js';
import { VIEWS as lm_cologne_cathedralViews } from './cologne-cathedral/views.js';
import { MANIFEST as lm_london_eyeManifest } from './london-eye/config.js';
import { OSM_WAYS as lm_london_eyeWays } from './london-eye/footprint.js';
import { create as lm_london_eyeCreate } from './london-eye/geometry.js';
import { VIEWS as lm_london_eyeViews } from './london-eye/views.js';
import { MANIFEST as lm_fred_hartman_bridgeManifest } from './fred-hartman-bridge/config.js';
import { OSM_WAYS as lm_fred_hartman_bridgeWays } from './fred-hartman-bridge/footprint.js';
import { create as lm_fred_hartman_bridgeCreate } from './fred-hartman-bridge/geometry.js';
import { VIEWS as lm_fred_hartman_bridgeViews } from './fred-hartman-bridge/views.js';
import { MANIFEST as lm_peoples_salvation_cathedralManifest } from './peoples-salvation-cathedral/config.js';
import { OSM_WAYS as lm_peoples_salvation_cathedralWays } from './peoples-salvation-cathedral/footprint.js';
import { create as lm_peoples_salvation_cathedralCreate } from './peoples-salvation-cathedral/geometry.js';
import { VIEWS as lm_peoples_salvation_cathedralViews } from './peoples-salvation-cathedral/views.js';
import { MANIFEST as lm_pitt_river_bridgeManifest } from './pitt-river-bridge/config.js';
import { OSM_WAYS as lm_pitt_river_bridgeWays } from './pitt-river-bridge/footprint.js';
import { create as lm_pitt_river_bridgeCreate } from './pitt-river-bridge/geometry.js';
import { VIEWS as lm_pitt_river_bridgeViews } from './pitt-river-bridge/views.js';
import { MANIFEST as lm_museo_nacional_de_costa_ricaManifest } from './museo-nacional-de-costa-rica/config.js';
import { OSM_WAYS as lm_museo_nacional_de_costa_ricaWays } from './museo-nacional-de-costa-rica/footprint.js';
import { create as lm_museo_nacional_de_costa_ricaCreate } from './museo-nacional-de-costa-rica/geometry.js';
import { VIEWS as lm_museo_nacional_de_costa_ricaViews } from './museo-nacional-de-costa-rica/views.js';
import { MANIFEST as lm_los_angeles_city_hallManifest } from './los-angeles-city-hall/config.js';
import { OSM_WAYS as lm_los_angeles_city_hallWays } from './los-angeles-city-hall/footprint.js';
import { create as lm_los_angeles_city_hallCreate } from './los-angeles-city-hall/geometry.js';
import { VIEWS as lm_los_angeles_city_hallViews } from './los-angeles-city-hall/views.js';
import { MANIFEST as lm_palacio_de_cibelesManifest } from './palacio-de-cibeles/config.js';
import { OSM_WAYS as lm_palacio_de_cibelesWays } from './palacio-de-cibeles/footprint.js';
import { create as lm_palacio_de_cibelesCreate } from './palacio-de-cibeles/geometry.js';
import { VIEWS as lm_palacio_de_cibelesViews } from './palacio-de-cibeles/views.js';
import { MANIFEST as lm_alex_fraser_bridgeManifest } from './alex-fraser-bridge/config.js';
import { OSM_WAYS as lm_alex_fraser_bridgeWays } from './alex-fraser-bridge/footprint.js';
import { create as lm_alex_fraser_bridgeCreate } from './alex-fraser-bridge/geometry.js';
import { VIEWS as lm_alex_fraser_bridgeViews } from './alex-fraser-bridge/views.js';
import { MANIFEST as lm_the_alamoManifest } from './the-alamo/config.js';
import { OSM_WAYS as lm_the_alamoWays } from './the-alamo/footprint.js';
import { create as lm_the_alamoCreate } from './the-alamo/geometry.js';
import { VIEWS as lm_the_alamoViews } from './the-alamo/views.js';
import { MANIFEST as lm_skyview_atlantaManifest } from './skyview-atlanta/config.js';
import { OSM_WAYS as lm_skyview_atlantaWays } from './skyview-atlanta/footprint.js';
import { create as lm_skyview_atlantaCreate } from './skyview-atlanta/geometry.js';
import { VIEWS as lm_skyview_atlantaViews } from './skyview-atlanta/views.js';
import { MANIFEST as lm_frauenkirche_munichManifest } from './frauenkirche-munich/config.js';
import { OSM_WAYS as lm_frauenkirche_munichWays } from './frauenkirche-munich/footprint.js';
import { create as lm_frauenkirche_munichCreate } from './frauenkirche-munich/geometry.js';
import { VIEWS as lm_frauenkirche_munichViews } from './frauenkirche-munich/views.js';
import { MANIFEST as lm_the_wheel_icon_parkManifest } from './the-wheel-icon-park/config.js';
import { OSM_WAYS as lm_the_wheel_icon_parkWays } from './the-wheel-icon-park/footprint.js';
import { create as lm_the_wheel_icon_parkCreate } from './the-wheel-icon-park/geometry.js';
import { VIEWS as lm_the_wheel_icon_parkViews } from './the-wheel-icon-park/views.js';
import { MANIFEST as lm_washington_dc_templeManifest } from './washington-dc-temple/config.js';
import { OSM_WAYS as lm_washington_dc_templeWays } from './washington-dc-temple/footprint.js';
import { create as lm_washington_dc_templeCreate } from './washington-dc-temple/geometry.js';
import { VIEWS as lm_washington_dc_templeViews } from './washington-dc-temple/views.js';
import { MANIFEST as lm_ironworkers_memorial_bridgeManifest } from './ironworkers-memorial-bridge/config.js';
import { OSM_WAYS as lm_ironworkers_memorial_bridgeWays } from './ironworkers-memorial-bridge/footprint.js';
import { create as lm_ironworkers_memorial_bridgeCreate } from './ironworkers-memorial-bridge/geometry.js';
import { VIEWS as lm_ironworkers_memorial_bridgeViews } from './ironworkers-memorial-bridge/views.js';
import { MANIFEST as lm_magere_brugManifest } from './magere-brug/config.js';
import { OSM_WAYS as lm_magere_brugWays } from './magere-brug/footprint.js';
import { create as lm_magere_brugCreate } from './magere-brug/geometry.js';
import { VIEWS as lm_magere_brugViews } from './magere-brug/views.js';
import { MANIFEST as lm_tower_of_londonManifest } from './tower-of-london/config.js';
import { OSM_WAYS as lm_tower_of_londonWays } from './tower-of-london/footprint.js';
import { create as lm_tower_of_londonCreate } from './tower-of-london/geometry.js';
import { VIEWS as lm_tower_of_londonViews } from './tower-of-london/views.js';
import { MANIFEST as lm_fountain_placeManifest } from './fountain-place/config.js';
import { OSM_WAYS as lm_fountain_placeWays } from './fountain-place/footprint.js';
import { create as lm_fountain_placeCreate } from './fountain-place/geometry.js';
import { VIEWS as lm_fountain_placeViews } from './fountain-place/views.js';
import { MANIFEST as lm_motherland_monumentManifest } from './motherland-monument/config.js';
import { OSM_WAYS as lm_motherland_monumentWays } from './motherland-monument/footprint.js';
import { create as lm_motherland_monumentCreate } from './motherland-monument/geometry.js';
import { VIEWS as lm_motherland_monumentViews } from './motherland-monument/views.js';
import { MANIFEST as lm_vincent_thomas_bridgeManifest } from './vincent-thomas-bridge/config.js';
import { OSM_WAYS as lm_vincent_thomas_bridgeWays } from './vincent-thomas-bridge/footprint.js';
import { create as lm_vincent_thomas_bridgeCreate } from './vincent-thomas-bridge/geometry.js';
import { VIEWS as lm_vincent_thomas_bridgeViews } from './vincent-thomas-bridge/views.js';
import { MANIFEST as lm_marine_buildingManifest } from './marine-building/config.js';
import { OSM_WAYS as lm_marine_buildingWays } from './marine-building/footprint.js';
import { create as lm_marine_buildingCreate } from './marine-building/geometry.js';
import { VIEWS as lm_marine_buildingViews } from './marine-building/views.js';
import { MANIFEST as lm_basilica_de_los_angeles_cartagoManifest } from './basilica-de-los-angeles-cartago/config.js';
import { OSM_WAYS as lm_basilica_de_los_angeles_cartagoWays } from './basilica-de-los-angeles-cartago/footprint.js';
import { create as lm_basilica_de_los_angeles_cartagoCreate } from './basilica-de-los-angeles-cartago/geometry.js';
import { VIEWS as lm_basilica_de_los_angeles_cartagoViews } from './basilica-de-los-angeles-cartago/views.js';
import { MANIFEST as lm_edificio_metropolisManifest } from './edificio-metropolis/config.js';
import { OSM_WAYS as lm_edificio_metropolisWays } from './edificio-metropolis/footprint.js';
import { create as lm_edificio_metropolisCreate } from './edificio-metropolis/geometry.js';
import { VIEWS as lm_edificio_metropolisViews } from './edificio-metropolis/views.js';
import { MANIFEST as lm_high_museum_of_artManifest } from './high-museum-of-art/config.js';
import { OSM_WAYS as lm_high_museum_of_artWays } from './high-museum-of-art/footprint.js';
import { create as lm_high_museum_of_artCreate } from './high-museum-of-art/geometry.js';
import { VIEWS as lm_high_museum_of_artViews } from './high-museum-of-art/views.js';
import { MANIFEST as lm_williams_towerManifest } from './williams-tower/config.js';
import { OSM_WAYS as lm_williams_towerWays } from './williams-tower/footprint.js';
import { create as lm_williams_towerCreate } from './williams-tower/geometry.js';
import { VIEWS as lm_williams_towerViews } from './williams-tower/views.js';
import { MANIFEST as lm_basarab_overpassManifest } from './basarab-overpass/config.js';
import { OSM_WAYS as lm_basarab_overpassWays } from './basarab-overpass/footprint.js';
import { create as lm_basarab_overpassCreate } from './basarab-overpass/geometry.js';
import { VIEWS as lm_basarab_overpassViews } from './basarab-overpass/views.js';
import { MANIFEST as lm_john_hancock_centerManifest } from './john-hancock-center/config.js';
import { OSM_WAYS as lm_john_hancock_centerWays } from './john-hancock-center/footprint.js';
import { create as lm_john_hancock_centerCreate } from './john-hancock-center/geometry.js';
import { VIEWS as lm_john_hancock_centerViews } from './john-hancock-center/views.js';
import { MANIFEST as lm_att_building_nashvilleManifest } from './att-building-nashville/config.js';
import { OSM_WAYS as lm_att_building_nashvilleWays } from './att-building-nashville/footprint.js';
import { create as lm_att_building_nashvilleCreate } from './att-building-nashville/geometry.js';
import { VIEWS as lm_att_building_nashvilleViews } from './att-building-nashville/views.js';
import { MANIFEST as lm_granville_street_bridgeManifest } from './granville-street-bridge/config.js';
import { OSM_WAYS as lm_granville_street_bridgeWays } from './granville-street-bridge/footprint.js';
import { create as lm_granville_street_bridgeCreate } from './granville-street-bridge/geometry.js';
import { VIEWS as lm_granville_street_bridgeViews } from './granville-street-bridge/views.js';
import { MANIFEST as lm_jefferson_memorialManifest } from './jefferson-memorial/config.js';
import { OSM_WAYS as lm_jefferson_memorialWays } from './jefferson-memorial/footprint.js';
import { create as lm_jefferson_memorialCreate } from './jefferson-memorial/geometry.js';
import { VIEWS as lm_jefferson_memorialViews } from './jefferson-memorial/views.js';
import { MANIFEST as lm_adam_torenManifest } from './adam-toren/config.js';
import { OSM_WAYS as lm_adam_torenWays } from './adam-toren/footprint.js';
import { create as lm_adam_torenCreate } from './adam-toren/geometry.js';
import { VIEWS as lm_adam_torenViews } from './adam-toren/views.js';
import { MANIFEST as lm_buckingham_palaceManifest } from './buckingham-palace/config.js';
import { OSM_WAYS as lm_buckingham_palaceWays } from './buckingham-palace/footprint.js';
import { create as lm_buckingham_palaceCreate } from './buckingham-palace/geometry.js';
import { VIEWS as lm_buckingham_palaceViews } from './buckingham-palace/views.js';
import { MANIFEST as lm_samuel_beckett_bridgeManifest } from './samuel-beckett-bridge/config.js';
import { OSM_WAYS as lm_samuel_beckett_bridgeWays } from './samuel-beckett-bridge/footprint.js';
import { create as lm_samuel_beckett_bridgeCreate } from './samuel-beckett-bridge/geometry.js';
import { VIEWS as lm_samuel_beckett_bridgeViews } from './samuel-beckett-bridge/views.js';
import { MANIFEST as lm_fairmont_hotel_vancouverManifest } from './fairmont-hotel-vancouver/config.js';
import { OSM_WAYS as lm_fairmont_hotel_vancouverWays } from './fairmont-hotel-vancouver/footprint.js';
import { create as lm_fairmont_hotel_vancouverCreate } from './fairmont-hotel-vancouver/geometry.js';
import { VIEWS as lm_fairmont_hotel_vancouverViews } from './fairmont-hotel-vancouver/views.js';
import { MANIFEST as lm_pennybacker_bridgeManifest } from './pennybacker-bridge/config.js';
import { OSM_WAYS as lm_pennybacker_bridgeWays } from './pennybacker-bridge/footprint.js';
import { create as lm_pennybacker_bridgeCreate } from './pennybacker-bridge/geometry.js';
import { VIEWS as lm_pennybacker_bridgeViews } from './pennybacker-bridge/views.js';
import { MANIFEST as lm_walt_disney_concert_hallManifest } from './walt-disney-concert-hall/config.js';
import { OSM_WAYS as lm_walt_disney_concert_hallWays } from './walt-disney-concert-hall/footprint.js';
import { create as lm_walt_disney_concert_hallCreate } from './walt-disney-concert-hall/geometry.js';
import { VIEWS as lm_walt_disney_concert_hallViews } from './walt-disney-concert-hall/views.js';
import { MANIFEST as lm_one_atlantic_centerManifest } from './one-atlantic-center/config.js';
import { OSM_WAYS as lm_one_atlantic_centerWays } from './one-atlantic-center/footprint.js';
import { create as lm_one_atlantic_centerCreate } from './one-atlantic-center/geometry.js';
import { VIEWS as lm_one_atlantic_centerViews } from './one-atlantic-center/views.js';
import { MANIFEST as lm_cambie_bridgeManifest } from './cambie-bridge/config.js';
import { OSM_WAYS as lm_cambie_bridgeWays } from './cambie-bridge/footprint.js';
import { create as lm_cambie_bridgeCreate } from './cambie-bridge/geometry.js';
import { VIEWS as lm_cambie_bridgeViews } from './cambie-bridge/views.js';
import { MANIFEST as lm_estadio_nacional_costa_ricaManifest } from './estadio-nacional-costa-rica/config.js';
import { OSM_WAYS as lm_estadio_nacional_costa_ricaWays } from './estadio-nacional-costa-rica/footprint.js';
import { create as lm_estadio_nacional_costa_ricaCreate } from './estadio-nacional-costa-rica/geometry.js';
import { VIEWS as lm_estadio_nacional_costa_ricaViews } from './estadio-nacional-costa-rica/views.js';
import { MANIFEST as lm_uspenski_cathedralManifest } from './uspenski-cathedral/config.js';
import { OSM_WAYS as lm_uspenski_cathedralWays } from './uspenski-cathedral/footprint.js';
import { create as lm_uspenski_cathedralCreate } from './uspenski-cathedral/geometry.js';
import { VIEWS as lm_uspenski_cathedralViews } from './uspenski-cathedral/views.js';
import { MANIFEST as lm_atomiumManifest } from './atomium/config.js';
import { OSM_WAYS as lm_atomiumWays } from './atomium/footprint.js';
import { create as lm_atomiumCreate } from './atomium/geometry.js';
import { VIEWS as lm_atomiumViews } from './atomium/views.js';
import { MANIFEST as lm_chords_bridgeManifest } from './chords-bridge/config.js';
import { OSM_WAYS as lm_chords_bridgeWays } from './chords-bridge/footprint.js';
import { create as lm_chords_bridgeCreate } from './chords-bridge/geometry.js';
import { VIEWS as lm_chords_bridgeViews } from './chords-bridge/views.js';
import { MANIFEST as lm_bob_kerrey_pedestrian_bridgeManifest } from './bob-kerrey-pedestrian-bridge/config.js';
import { OSM_WAYS as lm_bob_kerrey_pedestrian_bridgeWays } from './bob-kerrey-pedestrian-bridge/footprint.js';
import { create as lm_bob_kerrey_pedestrian_bridgeCreate } from './bob-kerrey-pedestrian-bridge/geometry.js';
import { VIEWS as lm_bob_kerrey_pedestrian_bridgeViews } from './bob-kerrey-pedestrian-bridge/views.js';
import { MANIFEST as lm_plant_hall_tampaManifest } from './plant-hall-tampa/config.js';
import { OSM_WAYS as lm_plant_hall_tampaWays } from './plant-hall-tampa/footprint.js';
import { create as lm_plant_hall_tampaCreate } from './plant-hall-tampa/geometry.js';
import { VIEWS as lm_plant_hall_tampaViews } from './plant-hall-tampa/views.js';
import { MANIFEST as lm_catedral_de_la_almudenaManifest } from './catedral-de-la-almudena/config.js';
import { OSM_WAYS as lm_catedral_de_la_almudenaWays } from './catedral-de-la-almudena/footprint.js';
import { create as lm_catedral_de_la_almudenaCreate } from './catedral-de-la-almudena/geometry.js';
import { VIEWS as lm_catedral_de_la_almudenaViews } from './catedral-de-la-almudena/views.js';
import { MANIFEST as lm_tower_of_the_americasManifest } from './tower-of-the-americas/config.js';
import { OSM_WAYS as lm_tower_of_the_americasWays } from './tower-of-the-americas/footprint.js';
import { create as lm_tower_of_the_americasCreate } from './tower-of-the-americas/geometry.js';
import { VIEWS as lm_tower_of_the_americasViews } from './tower-of-the-americas/views.js';
import { MANIFEST as lm_woodrow_wilson_bridgeManifest } from './woodrow-wilson-bridge/config.js';
import { OSM_WAYS as lm_woodrow_wilson_bridgeWays } from './woodrow-wilson-bridge/footprint.js';
import { create as lm_woodrow_wilson_bridgeCreate } from './woodrow-wilson-bridge/geometry.js';
import { VIEWS as lm_woodrow_wilson_bridgeViews } from './woodrow-wilson-bridge/views.js';
import { MANIFEST as lm_leveque_towerManifest } from './leveque-tower/config.js';
import { OSM_WAYS as lm_leveque_towerWays } from './leveque-tower/footprint.js';
import { create as lm_leveque_towerCreate } from './leveque-tower/geometry.js';
import { VIEWS as lm_leveque_towerViews } from './leveque-tower/views.js';
import { MANIFEST as lm_nemo_science_museumManifest } from './nemo-science-museum/config.js';
import { OSM_WAYS as lm_nemo_science_museumWays } from './nemo-science-museum/footprint.js';
import { create as lm_nemo_science_museumCreate } from './nemo-science-museum/geometry.js';
import { VIEWS as lm_nemo_science_museumViews } from './nemo-science-museum/views.js';
import { MANIFEST as lm_vancouver_public_libraryManifest } from './vancouver-public-library/config.js';
import { OSM_WAYS as lm_vancouver_public_libraryWays } from './vancouver-public-library/footprint.js';
import { create as lm_vancouver_public_libraryCreate } from './vancouver-public-library/geometry.js';
import { VIEWS as lm_vancouver_public_libraryViews } from './vancouver-public-library/views.js';
import { MANIFEST as lm_queen_elizabeth_ii_bridgeManifest } from './queen-elizabeth-ii-bridge/config.js';
import { OSM_WAYS as lm_queen_elizabeth_ii_bridgeWays } from './queen-elizabeth-ii-bridge/footprint.js';
import { create as lm_queen_elizabeth_ii_bridgeCreate } from './queen-elizabeth-ii-bridge/geometry.js';
import { VIEWS as lm_queen_elizabeth_ii_bridgeViews } from './queen-elizabeth-ii-bridge/views.js';
import { MANIFEST as lm_saturn_v_huntsvilleManifest } from './saturn-v-huntsville/config.js';
import { OSM_WAYS as lm_saturn_v_huntsvilleWays } from './saturn-v-huntsville/footprint.js';
import { create as lm_saturn_v_huntsvilleCreate } from './saturn-v-huntsville/geometry.js';
import { VIEWS as lm_saturn_v_huntsvilleViews } from './saturn-v-huntsville/views.js';
import { MANIFEST as lm_charles_bridgeManifest } from './charles-bridge/config.js';
import { OSM_WAYS as lm_charles_bridgeWays } from './charles-bridge/footprint.js';
import { create as lm_charles_bridgeCreate } from './charles-bridge/geometry.js';
import { VIEWS as lm_charles_bridgeViews } from './charles-bridge/views.js';
import { MANIFEST as lm_grande_archeManifest } from './grande-arche/config.js';
import { OSM_WAYS as lm_grande_archeWays } from './grande-arche/footprint.js';
import { create as lm_grande_archeCreate } from './grande-arche/geometry.js';
import { VIEWS as lm_grande_archeViews } from './grande-arche/views.js';
import { MANIFEST as lm_sixth_street_viaductManifest } from './sixth-street-viaduct/config.js';
import { OSM_WAYS as lm_sixth_street_viaductWays } from './sixth-street-viaduct/footprint.js';
import { create as lm_sixth_street_viaductCreate } from './sixth-street-viaduct/geometry.js';
import { VIEWS as lm_sixth_street_viaductViews } from './sixth-street-viaduct/views.js';
import { MANIFEST as lm_perot_museumManifest } from './perot-museum/config.js';
import { OSM_WAYS as lm_perot_museumWays } from './perot-museum/footprint.js';
import { create as lm_perot_museumCreate } from './perot-museum/geometry.js';
import { VIEWS as lm_perot_museumViews } from './perot-museum/views.js';
import { MANIFEST as lm_cec_palaceManifest } from './cec-palace/config.js';
import { OSM_WAYS as lm_cec_palaceWays } from './cec-palace/footprint.js';
import { create as lm_cec_palaceCreate } from './cec-palace/geometry.js';
import { VIEWS as lm_cec_palaceViews } from './cec-palace/views.js';
import { MANIFEST as lm_jackson_street_bridge_atlantaManifest } from './jackson-street-bridge-atlanta/config.js';
import { OSM_WAYS as lm_jackson_street_bridge_atlantaWays } from './jackson-street-bridge-atlanta/footprint.js';
import { create as lm_jackson_street_bridge_atlantaCreate } from './jackson-street-bridge-atlanta/geometry.js';
import { VIEWS as lm_jackson_street_bridge_atlantaViews } from './jackson-street-bridge-atlanta/views.js';
import { MANIFEST as lm_knight_street_bridgeManifest } from './knight-street-bridge/config.js';
import { OSM_WAYS as lm_knight_street_bridgeWays } from './knight-street-bridge/footprint.js';
import { create as lm_knight_street_bridgeCreate } from './knight-street-bridge/geometry.js';
import { VIEWS as lm_knight_street_bridgeViews } from './knight-street-bridge/views.js';
import { MANIFEST as lm_porsche_museumManifest } from './porsche-museum/config.js';
import { OSM_WAYS as lm_porsche_museumWays } from './porsche-museum/footprint.js';
import { create as lm_porsche_museumCreate } from './porsche-museum/geometry.js';
import { VIEWS as lm_porsche_museumViews } from './porsche-museum/views.js';
import { MANIFEST as lm_centre_pompidouManifest } from './centre-pompidou/config.js';
import { OSM_WAYS as lm_centre_pompidouWays } from './centre-pompidou/footprint.js';
import { create as lm_centre_pompidouCreate } from './centre-pompidou/geometry.js';
import { VIEWS as lm_centre_pompidouViews } from './centre-pompidou/views.js';
import { MANIFEST as lm_washington_national_cathedralManifest } from './washington-national-cathedral/config.js';
import { OSM_WAYS as lm_washington_national_cathedralWays } from './washington-national-cathedral/footprint.js';
import { create as lm_washington_national_cathedralCreate } from './washington-national-cathedral/geometry.js';
import { VIEWS as lm_washington_national_cathedralViews } from './washington-national-cathedral/views.js';
import { MANIFEST as lm_mucemManifest } from './mucem/config.js';
import { OSM_WAYS as lm_mucemWays } from './mucem/footprint.js';
import { create as lm_mucemCreate } from './mucem/geometry.js';
import { VIEWS as lm_mucemViews } from './mucem/views.js';
import { MANIFEST as lm_oresund_bridgeManifest } from './oresund-bridge/config.js';
import { OSM_WAYS as lm_oresund_bridgeWays } from './oresund-bridge/footprint.js';
import { create as lm_oresund_bridgeCreate } from './oresund-bridge/geometry.js';
import { VIEWS as lm_oresund_bridgeViews } from './oresund-bridge/views.js';
import { MANIFEST as lm_yerevan_cascadeManifest } from './yerevan-cascade/config.js';
import { OSM_WAYS as lm_yerevan_cascadeWays } from './yerevan-cascade/footprint.js';
import { create as lm_yerevan_cascadeCreate } from './yerevan-cascade/geometry.js';
import { VIEWS as lm_yerevan_cascadeViews } from './yerevan-cascade/views.js';
import { MANIFEST as lm_rogers_arenaManifest } from './rogers-arena/config.js';
import { OSM_WAYS as lm_rogers_arenaWays } from './rogers-arena/footprint.js';
import { create as lm_rogers_arenaCreate } from './rogers-arena/geometry.js';
import { VIEWS as lm_rogers_arenaViews } from './rogers-arena/views.js';
import { MANIFEST as lm_edificio_metalicoManifest } from './edificio-metalico/config.js';
import { OSM_WAYS as lm_edificio_metalicoWays } from './edificio-metalico/footprint.js';
import { create as lm_edificio_metalicoCreate } from './edificio-metalico/geometry.js';
import { VIEWS as lm_edificio_metalicoViews } from './edificio-metalico/views.js';
import { MANIFEST as lm_san_jacinto_monumentManifest } from './san-jacinto-monument/config.js';
import { OSM_WAYS as lm_san_jacinto_monumentWays } from './san-jacinto-monument/footprint.js';
import { create as lm_san_jacinto_monumentCreate } from './san-jacinto-monument/geometry.js';
import { VIEWS as lm_san_jacinto_monumentViews } from './san-jacinto-monument/views.js';
import { MANIFEST as lm_concertgebouwManifest } from './concertgebouw/config.js';
import { OSM_WAYS as lm_concertgebouwWays } from './concertgebouw/footprint.js';
import { create as lm_concertgebouwCreate } from './concertgebouw/geometry.js';
import { VIEWS as lm_concertgebouwViews } from './concertgebouw/views.js';
import { MANIFEST as lm_tour_montparnasseManifest } from './tour-montparnasse/config.js';
import { OSM_WAYS as lm_tour_montparnasseWays } from './tour-montparnasse/footprint.js';
import { create as lm_tour_montparnasseCreate } from './tour-montparnasse/geometry.js';
import { VIEWS as lm_tour_montparnasseViews } from './tour-montparnasse/views.js';
import { MANIFEST as lm_westminster_abbeyManifest } from './westminster-abbey/config.js';
import { OSM_WAYS as lm_westminster_abbeyWays } from './westminster-abbey/footprint.js';
import { create as lm_westminster_abbeyCreate } from './westminster-abbey/geometry.js';
import { VIEWS as lm_westminster_abbeyViews } from './westminster-abbey/views.js';
import { MANIFEST as lm_opera_de_lyonManifest } from './opera-de-lyon/config.js';
import { OSM_WAYS as lm_opera_de_lyonWays } from './opera-de-lyon/footprint.js';
import { create as lm_opera_de_lyonCreate } from './opera-de-lyon/geometry.js';
import { VIEWS as lm_opera_de_lyonViews } from './opera-de-lyon/views.js';
import { MANIFEST as lm_santiago_bernabeuManifest } from './santiago-bernabeu/config.js';
import { OSM_WAYS as lm_santiago_bernabeuWays } from './santiago-bernabeu/footprint.js';
import { create as lm_santiago_bernabeuCreate } from './santiago-bernabeu/geometry.js';
import { VIEWS as lm_santiago_bernabeuViews } from './santiago-bernabeu/views.js';
import { MANIFEST as lm_saint_sophia_cathedral_kyivManifest } from './saint-sophia-cathedral-kyiv/config.js';
import { OSM_WAYS as lm_saint_sophia_cathedral_kyivWays } from './saint-sophia-cathedral-kyiv/footprint.js';
import { create as lm_saint_sophia_cathedral_kyivCreate } from './saint-sophia-cathedral-kyiv/geometry.js';
import { VIEWS as lm_saint_sophia_cathedral_kyivViews } from './saint-sophia-cathedral-kyiv/views.js';
import { MANIFEST as lm_oak_street_bridgeManifest } from './oak-street-bridge/config.js';
import { OSM_WAYS as lm_oak_street_bridgeWays } from './oak-street-bridge/footprint.js';
import { create as lm_oak_street_bridgeCreate } from './oak-street-bridge/geometry.js';
import { VIEWS as lm_oak_street_bridgeViews } from './oak-street-bridge/views.js';
import { MANIFEST as lm_riverside_county_courthouseManifest } from './riverside-county-courthouse/config.js';
import { OSM_WAYS as lm_riverside_county_courthouseWays } from './riverside-county-courthouse/footprint.js';
import { create as lm_riverside_county_courthouseCreate } from './riverside-county-courthouse/geometry.js';
import { VIEWS as lm_riverside_county_courthouseViews } from './riverside-county-courthouse/views.js';
import { MANIFEST as lm_place_de_la_concorde_obeliskManifest } from './place-de-la-concorde-obelisk/config.js';
import { OSM_WAYS as lm_place_de_la_concorde_obeliskWays } from './place-de-la-concorde-obelisk/footprint.js';
import { create as lm_place_de_la_concorde_obeliskCreate } from './place-de-la-concorde-obelisk/geometry.js';
import { VIEWS as lm_place_de_la_concorde_obeliskViews } from './place-de-la-concorde-obelisk/views.js';
import { MANIFEST as lm_atlanta_city_hallManifest } from './atlanta-city-hall/config.js';
import { OSM_WAYS as lm_atlanta_city_hallWays } from './atlanta-city-hall/footprint.js';
import { create as lm_atlanta_city_hallCreate } from './atlanta-city-hall/geometry.js';
import { VIEWS as lm_atlanta_city_hallViews } from './atlanta-city-hall/views.js';
import { MANIFEST as lm_ut_towerManifest } from './ut-tower/config.js';
import { OSM_WAYS as lm_ut_towerWays } from './ut-tower/footprint.js';
import { create as lm_ut_towerCreate } from './ut-tower/geometry.js';
import { VIEWS as lm_ut_towerViews } from './ut-tower/views.js';
import { MANIFEST as lm_belem_towerManifest } from './belem-tower/config.js';
import { OSM_WAYS as lm_belem_towerWays } from './belem-tower/footprint.js';
import { create as lm_belem_towerCreate } from './belem-tower/geometry.js';
import { VIEWS as lm_belem_towerViews } from './belem-tower/views.js';
import { MANIFEST as lm_parthenonManifest } from './parthenon/config.js';
import { OSM_WAYS as lm_parthenonWays } from './parthenon/footprint.js';
import { create as lm_parthenonCreate } from './parthenon/geometry.js';
import { VIEWS as lm_parthenonViews } from './parthenon/views.js';
import { MANIFEST as lm_bank_of_america_corporate_centerManifest } from './bank-of-america-corporate-center/config.js';
import { OSM_WAYS as lm_bank_of_america_corporate_centerWays } from './bank-of-america-corporate-center/footprint.js';
import { create as lm_bank_of_america_corporate_centerCreate } from './bank-of-america-corporate-center/geometry.js';
import { VIEWS as lm_bank_of_america_corporate_centerViews } from './bank-of-america-corporate-center/views.js';
import { MANIFEST as lm_miami_towerManifest } from './miami-tower/config.js';
import { OSM_WAYS as lm_miami_towerWays } from './miami-tower/footprint.js';
import { create as lm_miami_towerCreate } from './miami-tower/geometry.js';
import { VIEWS as lm_miami_towerViews } from './miami-tower/views.js';
import { MANIFEST as lm_vancouver_art_galleryManifest } from './vancouver-art-gallery/config.js';
import { OSM_WAYS as lm_vancouver_art_galleryWays } from './vancouver-art-gallery/footprint.js';
import { create as lm_vancouver_art_galleryCreate } from './vancouver-art-gallery/geometry.js';
import { VIEWS as lm_vancouver_art_galleryViews } from './vancouver-art-gallery/views.js';
import { MANIFEST as lm_pont_de_bercyManifest } from './pont-de-bercy/config.js';
import { OSM_WAYS as lm_pont_de_bercyWays } from './pont-de-bercy/footprint.js';
import { create as lm_pont_de_bercyCreate } from './pont-de-bercy/geometry.js';
import { VIEWS as lm_pont_de_bercyViews } from './pont-de-bercy/views.js';
import { MANIFEST as lm_library_of_congress_jeffersonManifest } from './library-of-congress-jefferson/config.js';
import { OSM_WAYS as lm_library_of_congress_jeffersonWays } from './library-of-congress-jefferson/footprint.js';
import { create as lm_library_of_congress_jeffersonCreate } from './library-of-congress-jefferson/geometry.js';
import { VIEWS as lm_library_of_congress_jeffersonViews } from './library-of-congress-jefferson/views.js';
import { MANIFEST as lm_stedelijk_museumManifest } from './stedelijk-museum/config.js';
import { OSM_WAYS as lm_stedelijk_museumWays } from './stedelijk-museum/footprint.js';
import { create as lm_stedelijk_museumCreate } from './stedelijk-museum/geometry.js';
import { VIEWS as lm_stedelijk_museumViews } from './stedelijk-museum/views.js';
import { MANIFEST as lm_rheinturmManifest } from './rheinturm/config.js';
import { OSM_WAYS as lm_rheinturmWays } from './rheinturm/footprint.js';
import { create as lm_rheinturmCreate } from './rheinturm/geometry.js';
import { VIEWS as lm_rheinturmViews } from './rheinturm/views.js';
import { MANIFEST as lm_the_gherkinManifest } from './the-gherkin/config.js';
import { OSM_WAYS as lm_the_gherkinWays } from './the-gherkin/footprint.js';
import { create as lm_the_gherkinCreate } from './the-gherkin/geometry.js';
import { VIEWS as lm_the_gherkinViews } from './the-gherkin/views.js';
import { MANIFEST as lm_pennzoil_placeManifest } from './pennzoil-place/config.js';
import { OSM_WAYS as lm_pennzoil_placeWays } from './pennzoil-place/footprint.js';
import { create as lm_pennzoil_placeCreate } from './pennzoil-place/geometry.js';
import { VIEWS as lm_pennzoil_placeViews } from './pennzoil-place/views.js';
import { MANIFEST as lm_casa_presei_libereManifest } from './casa-presei-libere/config.js';
import { OSM_WAYS as lm_casa_presei_libereWays } from './casa-presei-libere/footprint.js';
import { create as lm_casa_presei_libereCreate } from './casa-presei-libere/geometry.js';
import { VIEWS as lm_casa_presei_libereViews } from './casa-presei-libere/views.js';
import { MANIFEST as lm_marina_cityManifest } from './marina-city/config.js';
import { OSM_WAYS as lm_marina_cityWays } from './marina-city/footprint.js';
import { create as lm_marina_cityCreate } from './marina-city/geometry.js';
import { VIEWS as lm_marina_cityViews } from './marina-city/views.js';
import { MANIFEST as lm_queensborough_bridgeManifest } from './queensborough-bridge/config.js';
import { OSM_WAYS as lm_queensborough_bridgeWays } from './queensborough-bridge/footprint.js';
import { create as lm_queensborough_bridgeCreate } from './queensborough-bridge/geometry.js';
import { VIEWS as lm_queensborough_bridgeViews } from './queensborough-bridge/views.js';
import { MANIFEST as lm_opera_bastilleManifest } from './opera-bastille/config.js';
import { OSM_WAYS as lm_opera_bastilleWays } from './opera-bastille/footprint.js';
import { create as lm_opera_bastilleCreate } from './opera-bastille/geometry.js';
import { VIEWS as lm_opera_bastilleViews } from './opera-bastille/views.js';
import { MANIFEST as lm_catedral_de_alajuelaManifest } from './catedral-de-alajuela/config.js';
import { OSM_WAYS as lm_catedral_de_alajuelaWays } from './catedral-de-alajuela/footprint.js';
import { create as lm_catedral_de_alajuelaCreate } from './catedral-de-alajuela/geometry.js';
import { VIEWS as lm_catedral_de_alajuelaViews } from './catedral-de-alajuela/views.js';
import { MANIFEST as lm_high_level_bridge_edmontonManifest } from './high-level-bridge-edmonton/config.js';
import { OSM_WAYS as lm_high_level_bridge_edmontonWays } from './high-level-bridge-edmonton/footprint.js';
import { create as lm_high_level_bridge_edmontonCreate } from './high-level-bridge-edmonton/geometry.js';
import { VIEWS as lm_high_level_bridge_edmontonViews } from './high-level-bridge-edmonton/views.js';
import { MANIFEST as lm_truist_parkManifest } from './truist-park/config.js';
import { OSM_WAYS as lm_truist_parkWays } from './truist-park/footprint.js';
import { create as lm_truist_parkCreate } from './truist-park/geometry.js';
import { VIEWS as lm_truist_parkViews } from './truist-park/views.js';
import { MANIFEST as lm_long_beach_international_gatewayManifest } from './long-beach-international-gateway/config.js';
import { OSM_WAYS as lm_long_beach_international_gatewayWays } from './long-beach-international-gateway/footprint.js';
import { create as lm_long_beach_international_gatewayCreate } from './long-beach-international-gateway/geometry.js';
import { VIEWS as lm_long_beach_international_gatewayViews } from './long-beach-international-gateway/views.js';
import { MANIFEST as lm_cuatro_torresManifest } from './cuatro-torres/config.js';
import { OSM_WAYS as lm_cuatro_torresWays } from './cuatro-torres/footprint.js';
import { create as lm_cuatro_torresCreate } from './cuatro-torres/geometry.js';
import { VIEWS as lm_cuatro_torresViews } from './cuatro-torres/views.js';
import { MANIFEST as lm_palais_de_chaillotManifest } from './palais-de-chaillot/config.js';
import { OSM_WAYS as lm_palais_de_chaillotWays } from './palais-de-chaillot/footprint.js';
import { create as lm_palais_de_chaillotCreate } from './palais-de-chaillot/geometry.js';
import { VIEWS as lm_palais_de_chaillotViews } from './palais-de-chaillot/views.js';
import { MANIFEST as lm_waterfront_station_vancouverManifest } from './waterfront-station-vancouver/config.js';
import { OSM_WAYS as lm_waterfront_station_vancouverWays } from './waterfront-station-vancouver/footprint.js';
import { create as lm_waterfront_station_vancouverCreate } from './waterfront-station-vancouver/geometry.js';
import { VIEWS as lm_waterfront_station_vancouverViews } from './waterfront-station-vancouver/views.js';
import { MANIFEST as lm_old_red_courthouseManifest } from './old-red-courthouse/config.js';
import { OSM_WAYS as lm_old_red_courthouseWays } from './old-red-courthouse/footprint.js';
import { create as lm_old_red_courthouseCreate } from './old-red-courthouse/geometry.js';
import { VIEWS as lm_old_red_courthouseViews } from './old-red-courthouse/views.js';
import { MANIFEST as lm_frederick_douglass_memorial_bridgeManifest } from './frederick-douglass-memorial-bridge/config.js';
import { OSM_WAYS as lm_frederick_douglass_memorial_bridgeWays } from './frederick-douglass-memorial-bridge/footprint.js';
import { create as lm_frederick_douglass_memorial_bridgeCreate } from './frederick-douglass-memorial-bridge/geometry.js';
import { VIEWS as lm_frederick_douglass_memorial_bridgeViews } from './frederick-douglass-memorial-bridge/views.js';
import { MANIFEST as lm_muttart_conservatoryManifest } from './muttart-conservatory/config.js';
import { OSM_WAYS as lm_muttart_conservatoryWays } from './muttart-conservatory/footprint.js';
import { create as lm_muttart_conservatoryCreate } from './muttart-conservatory/geometry.js';
import { VIEWS as lm_muttart_conservatoryViews } from './muttart-conservatory/views.js';
import { MANIFEST as lm_pont_raymond_barreManifest } from './pont-raymond-barre/config.js';
import { OSM_WAYS as lm_pont_raymond_barreWays } from './pont-raymond-barre/footprint.js';
import { create as lm_pont_raymond_barreCreate } from './pont-raymond-barre/geometry.js';
import { VIEWS as lm_pont_raymond_barreViews } from './pont-raymond-barre/views.js';
import { MANIFEST as lm_pont_mirabeauManifest } from './pont-mirabeau/config.js';
import { OSM_WAYS as lm_pont_mirabeauWays } from './pont-mirabeau/footprint.js';
import { create as lm_pont_mirabeauCreate } from './pont-mirabeau/geometry.js';
import { VIEWS as lm_pont_mirabeauViews } from './pont-mirabeau/views.js';
import { MANIFEST as lm_munttorenManifest } from './munttoren/config.js';
import { OSM_WAYS as lm_munttorenWays } from './munttoren/footprint.js';
import { create as lm_munttorenCreate } from './munttoren/geometry.js';
import { VIEWS as lm_munttorenViews } from './munttoren/views.js';
import { MANIFEST as lm_skybridge_vancouverManifest } from './skybridge-vancouver/config.js';
import { OSM_WAYS as lm_skybridge_vancouverWays } from './skybridge-vancouver/footprint.js';
import { create as lm_skybridge_vancouverCreate } from './skybridge-vancouver/geometry.js';
import { VIEWS as lm_skybridge_vancouverViews } from './skybridge-vancouver/views.js';
import { MANIFEST as lm_battersea_power_stationManifest } from './battersea-power-station/config.js';
import { OSM_WAYS as lm_battersea_power_stationWays } from './battersea-power-station/footprint.js';
import { create as lm_battersea_power_stationCreate } from './battersea-power-station/geometry.js';
import { VIEWS as lm_battersea_power_stationViews } from './battersea-power-station/views.js';
import { MANIFEST as lm_frost_bank_towerManifest } from './frost-bank-tower/config.js';
import { OSM_WAYS as lm_frost_bank_towerWays } from './frost-bank-tower/footprint.js';
import { create as lm_frost_bank_towerCreate } from './frost-bank-tower/geometry.js';
import { VIEWS as lm_frost_bank_towerViews } from './frost-bank-tower/views.js';
import { MANIFEST as lm_georgia_aquariumManifest } from './georgia-aquarium/config.js';
import { OSM_WAYS as lm_georgia_aquariumWays } from './georgia-aquarium/footprint.js';
import { create as lm_georgia_aquariumCreate } from './georgia-aquarium/geometry.js';
import { VIEWS as lm_georgia_aquariumViews } from './georgia-aquarium/views.js';
import { MANIFEST as lm_stade_de_franceManifest } from './stade-de-france/config.js';
import { OSM_WAYS as lm_stade_de_franceWays } from './stade-de-france/footprint.js';
import { create as lm_stade_de_franceCreate } from './stade-de-france/geometry.js';
import { VIEWS as lm_stade_de_franceViews } from './stade-de-france/views.js';
import { MANIFEST as lm_rogers_placeManifest } from './rogers-place/config.js';
import { OSM_WAYS as lm_rogers_placeWays } from './rogers-place/footprint.js';
import { create as lm_rogers_placeCreate } from './rogers-place/geometry.js';
import { VIEWS as lm_rogers_placeViews } from './rogers-place/views.js';
import { MANIFEST as lm_mission_bridgeManifest } from './mission-bridge/config.js';
import { OSM_WAYS as lm_mission_bridgeWays } from './mission-bridge/footprint.js';
import { create as lm_mission_bridgeCreate } from './mission-bridge/geometry.js';
import { VIEWS as lm_mission_bridgeViews } from './mission-bridge/views.js';
import { MANIFEST as lm_los_angeles_union_stationManifest } from './los-angeles-union-station/config.js';
import { OSM_WAYS as lm_los_angeles_union_stationWays } from './los-angeles-union-station/footprint.js';
import { create as lm_los_angeles_union_stationCreate } from './los-angeles-union-station/geometry.js';
import { VIEWS as lm_los_angeles_union_stationViews } from './los-angeles-union-station/views.js';
import { MANIFEST as lm_allianz_arenaManifest } from './allianz-arena/config.js';
import { OSM_WAYS as lm_allianz_arenaWays } from './allianz-arena/footprint.js';
import { create as lm_allianz_arenaCreate } from './allianz-arena/geometry.js';
import { VIEWS as lm_allianz_arenaViews } from './allianz-arena/views.js';
import { MANIFEST as lm_tawatina_bridgeManifest } from './tawatina-bridge/config.js';
import { OSM_WAYS as lm_tawatina_bridgeWays } from './tawatina-bridge/footprint.js';
import { create as lm_tawatina_bridgeCreate } from './tawatina-bridge/geometry.js';
import { VIEWS as lm_tawatina_bridgeViews } from './tawatina-bridge/views.js';
import { MANIFEST as lm_bridge_of_peace_tbilisiManifest } from './bridge-of-peace-tbilisi/config.js';
import { OSM_WAYS as lm_bridge_of_peace_tbilisiWays } from './bridge-of-peace-tbilisi/footprint.js';
import { create as lm_bridge_of_peace_tbilisiCreate } from './bridge-of-peace-tbilisi/geometry.js';
import { VIEWS as lm_bridge_of_peace_tbilisiViews } from './bridge-of-peace-tbilisi/views.js';
import { MANIFEST as lm_dames_point_bridgeManifest } from './dames-point-bridge/config.js';
import { OSM_WAYS as lm_dames_point_bridgeWays } from './dames-point-bridge/footprint.js';
import { create as lm_dames_point_bridgeCreate } from './dames-point-bridge/geometry.js';
import { VIEWS as lm_dames_point_bridgeViews } from './dames-point-bridge/views.js';
import { MANIFEST as lm_puente_de_segoviaManifest } from './puente-de-segovia/config.js';
import { OSM_WAYS as lm_puente_de_segoviaWays } from './puente-de-segovia/footprint.js';
import { create as lm_puente_de_segoviaCreate } from './puente-de-segovia/geometry.js';
import { VIEWS as lm_puente_de_segoviaViews } from './puente-de-segovia/views.js';
import { MANIFEST as lm_pont_royalManifest } from './pont-royal/config.js';
import { OSM_WAYS as lm_pont_royalWays } from './pont-royal/footprint.js';
import { create as lm_pont_royalCreate } from './pont-royal/geometry.js';
import { VIEWS as lm_pont_royalViews } from './pont-royal/views.js';
import { MANIFEST as lm_san_fernando_cathedralManifest } from './san-fernando-cathedral/config.js';
import { OSM_WAYS as lm_san_fernando_cathedralWays } from './san-fernando-cathedral/footprint.js';
import { create as lm_san_fernando_cathedralCreate } from './san-fernando-cathedral/geometry.js';
import { VIEWS as lm_san_fernando_cathedralViews } from './san-fernando-cathedral/views.js';
import { MANIFEST as lm_washington_union_stationManifest } from './washington-union-station/config.js';
import { OSM_WAYS as lm_washington_union_stationWays } from './washington-union-station/footprint.js';
import { create as lm_washington_union_stationCreate } from './washington-union-station/geometry.js';
import { VIEWS as lm_washington_union_stationViews } from './washington-union-station/views.js';
import { MANIFEST as lm_black_church_brasovManifest } from './black-church-brasov/config.js';
import { OSM_WAYS as lm_black_church_brasovWays } from './black-church-brasov/footprint.js';
import { create as lm_black_church_brasovCreate } from './black-church-brasov/geometry.js';
import { VIEWS as lm_black_church_brasovViews } from './black-church-brasov/views.js';
import { MANIFEST as lm_gastown_steam_clockManifest } from './gastown-steam-clock/config.js';
import { OSM_WAYS as lm_gastown_steam_clockWays } from './gastown-steam-clock/footprint.js';
import { create as lm_gastown_steam_clockCreate } from './gastown-steam-clock/geometry.js';
import { VIEWS as lm_gastown_steam_clockViews } from './gastown-steam-clock/views.js';
import { MANIFEST as lm_stantec_towerManifest } from './stantec-tower/config.js';
import { OSM_WAYS as lm_stantec_towerWays } from './stantec-tower/footprint.js';
import { create as lm_stantec_towerCreate } from './stantec-tower/geometry.js';
import { VIEWS as lm_stantec_towerViews } from './stantec-tower/views.js';
import { MANIFEST as lm_johan_cruijff_arenaManifest } from './johan-cruijff-arena/config.js';
import { OSM_WAYS as lm_johan_cruijff_arenaWays } from './johan-cruijff-arena/footprint.js';
import { create as lm_johan_cruijff_arenaCreate } from './johan-cruijff-arena/geometry.js';
import { VIEWS as lm_johan_cruijff_arenaViews } from './johan-cruijff-arena/views.js';
import { MANIFEST as lm_albert_bridge_londonManifest } from './albert-bridge-london/config.js';
import { OSM_WAYS as lm_albert_bridge_londonWays } from './albert-bridge-london/footprint.js';
import { create as lm_albert_bridge_londonCreate } from './albert-bridge-london/geometry.js';
import { VIEWS as lm_albert_bridge_londonViews } from './albert-bridge-london/views.js';
import { MANIFEST as lm_fondation_louis_vuittonManifest } from './fondation-louis-vuitton/config.js';
import { OSM_WAYS as lm_fondation_louis_vuittonWays } from './fondation-louis-vuitton/footprint.js';
import { create as lm_fondation_louis_vuittonCreate } from './fondation-louis-vuitton/geometry.js';
import { VIEWS as lm_fondation_louis_vuittonViews } from './fondation-louis-vuitton/views.js';
import { MANIFEST as lm_westminster_abbey_missionManifest } from './westminster-abbey-mission/config.js';
import { OSM_WAYS as lm_westminster_abbey_missionWays } from './westminster-abbey-mission/footprint.js';
import { create as lm_westminster_abbey_missionCreate } from './westminster-abbey-mission/geometry.js';
import { VIEWS as lm_westminster_abbey_missionViews } from './westminster-abbey-mission/views.js';
import { MANIFEST as lm_tarrant_county_courthouseManifest } from './tarrant-county-courthouse/config.js';
import { OSM_WAYS as lm_tarrant_county_courthouseWays } from './tarrant-county-courthouse/footprint.js';
import { create as lm_tarrant_county_courthouseCreate } from './tarrant-county-courthouse/geometry.js';
import { VIEWS as lm_tarrant_county_courthouseViews } from './tarrant-county-courthouse/views.js';
import { MANIFEST as lm_george_c_king_bridgeManifest } from './george-c-king-bridge/config.js';
import { OSM_WAYS as lm_george_c_king_bridgeWays } from './george-c-king-bridge/footprint.js';
import { create as lm_george_c_king_bridgeCreate } from './george-c-king-bridge/geometry.js';
import { VIEWS as lm_george_c_king_bridgeViews } from './george-c-king-bridge/views.js';
import { MANIFEST as lm_wilshire_grand_centerManifest } from './wilshire-grand-center/config.js';
import { OSM_WAYS as lm_wilshire_grand_centerWays } from './wilshire-grand-center/footprint.js';
import { create as lm_wilshire_grand_centerCreate } from './wilshire-grand-center/geometry.js';
import { VIEWS as lm_wilshire_grand_centerViews } from './wilshire-grand-center/views.js';
import { MANIFEST as lm_palais_bourbonManifest } from './palais-bourbon/config.js';
import { OSM_WAYS as lm_palais_bourbonWays } from './palais-bourbon/footprint.js';
import { create as lm_palais_bourbonCreate } from './palais-bourbon/geometry.js';
import { VIEWS as lm_palais_bourbonViews } from './palais-bourbon/views.js';
import { MANIFEST as lm_w_r_bennett_bridgeManifest } from './w-r-bennett-bridge/config.js';
import { OSM_WAYS as lm_w_r_bennett_bridgeWays } from './w-r-bennett-bridge/footprint.js';
import { create as lm_w_r_bennett_bridgeCreate } from './w-r-bennett-bridge/geometry.js';
import { VIEWS as lm_w_r_bennett_bridgeViews } from './w-r-bennett-bridge/views.js';
import { MANIFEST as lm_smithsonian_castleManifest } from './smithsonian-castle/config.js';
import { OSM_WAYS as lm_smithsonian_castleWays } from './smithsonian-castle/footprint.js';
import { create as lm_smithsonian_castleCreate } from './smithsonian-castle/geometry.js';
import { VIEWS as lm_smithsonian_castleViews } from './smithsonian-castle/views.js';
import { MANIFEST as lm_cathedrale_saint_jean_lyonManifest } from './cathedrale-saint-jean-lyon/config.js';
import { OSM_WAYS as lm_cathedrale_saint_jean_lyonWays } from './cathedrale-saint-jean-lyon/footprint.js';
import { create as lm_cathedrale_saint_jean_lyonCreate } from './cathedrale-saint-jean-lyon/geometry.js';
import { VIEWS as lm_cathedrale_saint_jean_lyonViews } from './cathedrale-saint-jean-lyon/views.js';
import { MANIFEST as lm_fernsehturm_stuttgartManifest } from './fernsehturm-stuttgart/config.js';
import { OSM_WAYS as lm_fernsehturm_stuttgartWays } from './fernsehturm-stuttgart/footprint.js';
import { create as lm_fernsehturm_stuttgartCreate } from './fernsehturm-stuttgart/geometry.js';
import { VIEWS as lm_fernsehturm_stuttgartViews } from './fernsehturm-stuttgart/views.js';
import { MANIFEST as lm_brandenburg_gateManifest } from './brandenburg-gate/config.js';
import { OSM_WAYS as lm_brandenburg_gateWays } from './brandenburg-gate/footprint.js';
import { create as lm_brandenburg_gateCreate } from './brandenburg-gate/geometry.js';
import { VIEWS as lm_brandenburg_gateViews } from './brandenburg-gate/views.js';
import { MANIFEST as lm_pont_de_l_almaManifest } from './pont-de-l-alma/config.js';
import { OSM_WAYS as lm_pont_de_l_almaWays } from './pont-de-l-alma/footprint.js';
import { create as lm_pont_de_l_almaCreate } from './pont-de-l-alma/geometry.js';
import { VIEWS as lm_pont_de_l_almaViews } from './pont-de-l-alma/views.js';
import { MANIFEST as lm_zaanse_schans_windmillsManifest } from './zaanse-schans-windmills/config.js';
import { OSM_WAYS as lm_zaanse_schans_windmillsWays } from './zaanse-schans-windmills/footprint.js';
import { create as lm_zaanse_schans_windmillsCreate } from './zaanse-schans-windmills/geometry.js';
import { VIEWS as lm_zaanse_schans_windmillsViews } from './zaanse-schans-windmills/views.js';
import { MANIFEST as lm_edmonton_city_hallManifest } from './edmonton-city-hall/config.js';
import { OSM_WAYS as lm_edmonton_city_hallWays } from './edmonton-city-hall/footprint.js';
import { create as lm_edmonton_city_hallCreate } from './edmonton-city-hall/geometry.js';
import { VIEWS as lm_edmonton_city_hallViews } from './edmonton-city-hall/views.js';
import { MANIFEST as lm_real_casa_de_correosManifest } from './real-casa-de-correos/config.js';
import { OSM_WAYS as lm_real_casa_de_correosWays } from './real-casa-de-correos/footprint.js';
import { create as lm_real_casa_de_correosCreate } from './real-casa-de-correos/geometry.js';
import { VIEWS as lm_real_casa_de_correosViews } from './real-casa-de-correos/views.js';
import { MANIFEST as lm_royal_albert_hallManifest } from './royal-albert-hall/config.js';
import { OSM_WAYS as lm_royal_albert_hallWays } from './royal-albert-hall/footprint.js';
import { create as lm_royal_albert_hallCreate } from './royal-albert-hall/geometry.js';
import { VIEWS as lm_royal_albert_hallViews } from './royal-albert-hall/views.js';
import { MANIFEST as lm_hotel_negrescoManifest } from './hotel-negresco/config.js';
import { OSM_WAYS as lm_hotel_negrescoWays } from './hotel-negresco/footprint.js';
import { create as lm_hotel_negrescoCreate } from './hotel-negresco/geometry.js';
import { VIEWS as lm_hotel_negrescoViews } from './hotel-negresco/views.js';
import { MANIFEST as lm_gateway_archManifest } from './gateway-arch/config.js';
import { OSM_WAYS as lm_gateway_archWays } from './gateway-arch/footprint.js';
import { create as lm_gateway_archCreate } from './gateway-arch/geometry.js';
import { VIEWS as lm_gateway_archViews } from './gateway-arch/views.js';
import { MANIFEST as lm_palais_du_luxembourgManifest } from './palais-du-luxembourg/config.js';
import { OSM_WAYS as lm_palais_du_luxembourgWays } from './palais-du-luxembourg/footprint.js';
import { create as lm_palais_du_luxembourgCreate } from './palais-du-luxembourg/geometry.js';
import { VIEWS as lm_palais_du_luxembourgViews } from './palais-du-luxembourg/views.js';
import { MANIFEST as lm_arena_nationalaManifest } from './arena-nationala/config.js';
import { OSM_WAYS as lm_arena_nationalaWays } from './arena-nationala/footprint.js';
import { create as lm_arena_nationalaCreate } from './arena-nationala/geometry.js';
import { VIEWS as lm_arena_nationalaViews } from './arena-nationala/views.js';
import { MANIFEST as lm_wrigley_buildingManifest } from './wrigley-building/config.js';
import { OSM_WAYS as lm_wrigley_buildingWays } from './wrigley-building/footprint.js';
import { create as lm_wrigley_buildingCreate } from './wrigley-building/geometry.js';
import { VIEWS as lm_wrigley_buildingViews } from './wrigley-building/views.js';
import { MANIFEST as lm_parthenon_nashvilleManifest } from './parthenon-nashville/config.js';
import { OSM_WAYS as lm_parthenon_nashvilleWays } from './parthenon-nashville/footprint.js';
import { create as lm_parthenon_nashvilleCreate } from './parthenon-nashville/geometry.js';
import { VIEWS as lm_parthenon_nashvilleViews } from './parthenon-nashville/views.js';
import { MANIFEST as lm_art_gallery_of_albertaManifest } from './art-gallery-of-alberta/config.js';
import { OSM_WAYS as lm_art_gallery_of_albertaWays } from './art-gallery-of-alberta/footprint.js';
import { create as lm_art_gallery_of_albertaCreate } from './art-gallery-of-alberta/geometry.js';
import { VIEWS as lm_art_gallery_of_albertaViews } from './art-gallery-of-alberta/views.js';
import { MANIFEST as lm_capitol_records_buildingManifest } from './capitol-records-building/config.js';
import { OSM_WAYS as lm_capitol_records_buildingWays } from './capitol-records-building/footprint.js';
import { create as lm_capitol_records_buildingCreate } from './capitol-records-building/geometry.js';
import { VIEWS as lm_capitol_records_buildingViews } from './capitol-records-building/views.js';
import { MANIFEST as lm_lake_eola_fountainManifest } from './lake-eola-fountain/config.js';
import { OSM_WAYS as lm_lake_eola_fountainWays } from './lake-eola-fountain/footprint.js';
import { create as lm_lake_eola_fountainCreate } from './lake-eola-fountain/geometry.js';
import { VIEWS as lm_lake_eola_fountainViews } from './lake-eola-fountain/views.js';
import { MANIFEST as lm_gare_de_lyon_clock_towerManifest } from './gare-de-lyon-clock-tower/config.js';
import { OSM_WAYS as lm_gare_de_lyon_clock_towerWays } from './gare-de-lyon-clock-tower/footprint.js';
import { create as lm_gare_de_lyon_clock_towerCreate } from './gare-de-lyon-clock-tower/geometry.js';
import { VIEWS as lm_gare_de_lyon_clock_towerViews } from './gare-de-lyon-clock-tower/views.js';
import { MANIFEST as lm_bromo_seltzer_towerManifest } from './bromo-seltzer-tower/config.js';
import { OSM_WAYS as lm_bromo_seltzer_towerWays } from './bromo-seltzer-tower/footprint.js';
import { create as lm_bromo_seltzer_towerCreate } from './bromo-seltzer-tower/geometry.js';
import { VIEWS as lm_bromo_seltzer_towerViews } from './bromo-seltzer-tower/views.js';
import { MANIFEST as lm_wembley_stadiumManifest } from './wembley-stadium/config.js';
import { OSM_WAYS as lm_wembley_stadiumWays } from './wembley-stadium/footprint.js';
import { create as lm_wembley_stadiumCreate } from './wembley-stadium/geometry.js';
import { VIEWS as lm_wembley_stadiumViews } from './wembley-stadium/views.js';
import { MANIFEST as lm_chateau_de_vincennesManifest } from './chateau-de-vincennes/config.js';
import { OSM_WAYS as lm_chateau_de_vincennesWays } from './chateau-de-vincennes/footprint.js';
import { create as lm_chateau_de_vincennesCreate } from './chateau-de-vincennes/geometry.js';
import { VIEWS as lm_chateau_de_vincennesViews } from './chateau-de-vincennes/views.js';
import { MANIFEST as lm_templo_de_debodManifest } from './templo-de-debod/config.js';
import { OSM_WAYS as lm_templo_de_debodWays } from './templo-de-debod/footprint.js';
import { create as lm_templo_de_debodCreate } from './templo-de-debod/geometry.js';
import { VIEWS as lm_templo_de_debodViews } from './templo-de-debod/views.js';
import { MANIFEST as lm_custom_house_dublinManifest } from './custom-house-dublin/config.js';
import { OSM_WAYS as lm_custom_house_dublinWays } from './custom-house-dublin/footprint.js';
import { create as lm_custom_house_dublinCreate } from './custom-house-dublin/geometry.js';
import { VIEWS as lm_custom_house_dublinViews } from './custom-house-dublin/views.js';
import { MANIFEST as lm_chateau_de_versaillesManifest } from './chateau-de-versailles/config.js';
import { OSM_WAYS as lm_chateau_de_versaillesWays } from './chateau-de-versailles/footprint.js';
import { create as lm_chateau_de_versaillesCreate } from './chateau-de-versailles/geometry.js';
import { VIEWS as lm_chateau_de_versaillesViews } from './chateau-de-versailles/views.js';
import { MANIFEST as lm_tour_incityManifest } from './tour-incity/config.js';
import { OSM_WAYS as lm_tour_incityWays } from './tour-incity/footprint.js';
import { create as lm_tour_incityCreate } from './tour-incity/geometry.js';
import { VIEWS as lm_tour_incityViews } from './tour-incity/views.js';
import { MANIFEST as lm_colorado_street_bridgeManifest } from './colorado-street-bridge/config.js';
import { OSM_WAYS as lm_colorado_street_bridgeWays } from './colorado-street-bridge/footprint.js';
import { create as lm_colorado_street_bridgeCreate } from './colorado-street-bridge/geometry.js';
import { VIEWS as lm_colorado_street_bridgeViews } from './colorado-street-bridge/views.js';
import { MANIFEST as lm_louise_bridge_calgaryManifest } from './louise-bridge-calgary/config.js';
import { OSM_WAYS as lm_louise_bridge_calgaryWays } from './louise-bridge-calgary/footprint.js';
import { create as lm_louise_bridge_calgaryCreate } from './louise-bridge-calgary/geometry.js';
import { VIEWS as lm_louise_bridge_calgaryViews } from './louise-bridge-calgary/views.js';
import { MANIFEST as lm_institut_du_monde_arabeManifest } from './institut-du-monde-arabe/config.js';
import { OSM_WAYS as lm_institut_du_monde_arabeWays } from './institut-du-monde-arabe/footprint.js';
import { create as lm_institut_du_monde_arabeCreate } from './institut-du-monde-arabe/geometry.js';
import { VIEWS as lm_institut_du_monde_arabeViews } from './institut-du-monde-arabe/views.js';
import { MANIFEST as lm_wuppertal_schwebebahn_sonnbornManifest } from './wuppertal-schwebebahn-sonnborn/config.js';
import { OSM_WAYS as lm_wuppertal_schwebebahn_sonnbornWays } from './wuppertal-schwebebahn-sonnborn/footprint.js';
import { create as lm_wuppertal_schwebebahn_sonnbornCreate } from './wuppertal-schwebebahn-sonnborn/geometry.js';
import { VIEWS as lm_wuppertal_schwebebahn_sonnbornViews } from './wuppertal-schwebebahn-sonnborn/views.js';
import { MANIFEST as lm_fairmont_chateau_lake_louiseManifest } from './fairmont-chateau-lake-louise/config.js';
import { OSM_WAYS as lm_fairmont_chateau_lake_louiseWays } from './fairmont-chateau-lake-louise/footprint.js';
import { create as lm_fairmont_chateau_lake_louiseCreate } from './fairmont-chateau-lake-louise/geometry.js';
import { VIEWS as lm_fairmont_chateau_lake_louiseViews } from './fairmont-chateau-lake-louise/views.js';
import { MANIFEST as lm_edificio_inteligente_epmManifest } from './edificio-inteligente-epm/config.js';
import { OSM_WAYS as lm_edificio_inteligente_epmWays } from './edificio-inteligente-epm/footprint.js';
import { create as lm_edificio_inteligente_epmCreate } from './edificio-inteligente-epm/geometry.js';
import { VIEWS as lm_edificio_inteligente_epmViews } from './edificio-inteligente-epm/views.js';
import { MANIFEST as lm_pantheon_romeManifest } from './pantheon-rome/config.js';
import { OSM_WAYS as lm_pantheon_romeWays } from './pantheon-rome/footprint.js';
import { create as lm_pantheon_romeCreate } from './pantheon-rome/geometry.js';
import { VIEWS as lm_pantheon_romeViews } from './pantheon-rome/views.js';
import { MANIFEST as lm_union_station_kansas_cityManifest } from './union-station-kansas-city/config.js';
import { OSM_WAYS as lm_union_station_kansas_cityWays } from './union-station-kansas-city/footprint.js';
import { create as lm_union_station_kansas_cityCreate } from './union-station-kansas-city/geometry.js';
import { VIEWS as lm_union_station_kansas_cityViews } from './union-station-kansas-city/views.js';
import { MANIFEST as lm_pavillon_roger_gaudryManifest } from './pavillon-roger-gaudry/config.js';
import { OSM_WAYS as lm_pavillon_roger_gaudryWays } from './pavillon-roger-gaudry/footprint.js';
import { create as lm_pavillon_roger_gaudryCreate } from './pavillon-roger-gaudry/geometry.js';
import { VIEWS as lm_pavillon_roger_gaudryViews } from './pavillon-roger-gaudry/views.js';
import { MANIFEST as lm_marche_atwaterManifest } from './marche-atwater/config.js';
import { OSM_WAYS as lm_marche_atwaterWays } from './marche-atwater/footprint.js';
import { create as lm_marche_atwaterCreate } from './marche-atwater/geometry.js';
import { VIEWS as lm_marche_atwaterViews } from './marche-atwater/views.js';
import { MANIFEST as lm_tour_1000_de_la_gauchetiereManifest } from './tour-1000-de-la-gauchetiere/config.js';
import { OSM_WAYS as lm_tour_1000_de_la_gauchetiereWays } from './tour-1000-de-la-gauchetiere/footprint.js';
import { create as lm_tour_1000_de_la_gauchetiereCreate } from './tour-1000-de-la-gauchetiere/geometry.js';
import { VIEWS as lm_tour_1000_de_la_gauchetiereViews } from './tour-1000-de-la-gauchetiere/views.js';
import { MANIFEST as lm_parliament_hill_centre_blockManifest } from './parliament-hill-centre-block/config.js';
import { OSM_WAYS as lm_parliament_hill_centre_blockWays } from './parliament-hill-centre-block/footprint.js';
import { create as lm_parliament_hill_centre_blockCreate } from './parliament-hill-centre-block/geometry.js';
import { VIEWS as lm_parliament_hill_centre_blockViews } from './parliament-hill-centre-block/views.js';
import { MANIFEST as lm_burlington_bay_skywayManifest } from './burlington-bay-skyway/config.js';
import { OSM_WAYS as lm_burlington_bay_skywayWays } from './burlington-bay-skyway/footprint.js';
import { create as lm_burlington_bay_skywayCreate } from './burlington-bay-skyway/geometry.js';
import { VIEWS as lm_burlington_bay_skywayViews } from './burlington-bay-skyway/views.js';
import { MANIFEST as lm_arthur_ravenel_jr_bridgeManifest } from './arthur-ravenel-jr-bridge/config.js';
import { OSM_WAYS as lm_arthur_ravenel_jr_bridgeWays } from './arthur-ravenel-jr-bridge/footprint.js';
import { create as lm_arthur_ravenel_jr_bridgeCreate } from './arthur-ravenel-jr-bridge/geometry.js';
import { VIEWS as lm_arthur_ravenel_jr_bridgeViews } from './arthur-ravenel-jr-bridge/views.js';
import { MANIFEST as lm_ashley_river_memorial_bridgeManifest } from './ashley-river-memorial-bridge/config.js';
import { OSM_WAYS as lm_ashley_river_memorial_bridgeWays } from './ashley-river-memorial-bridge/footprint.js';
import { create as lm_ashley_river_memorial_bridgeCreate } from './ashley-river-memorial-bridge/geometry.js';
import { VIEWS as lm_ashley_river_memorial_bridgeViews } from './ashley-river-memorial-bridge/views.js';
import { MANIFEST as lm_uss_yorktown_cv10Manifest } from './uss-yorktown-cv10/config.js';
import { OSM_WAYS as lm_uss_yorktown_cv10Ways } from './uss-yorktown-cv10/footprint.js';
import { create as lm_uss_yorktown_cv10Create } from './uss-yorktown-cv10/geometry.js';
import { VIEWS as lm_uss_yorktown_cv10Views } from './uss-yorktown-cv10/views.js';
import { MANIFEST as lm_fort_sumterManifest } from './fort-sumter/config.js';
import { OSM_WAYS as lm_fort_sumterWays } from './fort-sumter/footprint.js';
import { create as lm_fort_sumterCreate } from './fort-sumter/geometry.js';
import { VIEWS as lm_fort_sumterViews } from './fort-sumter/views.js';
import { MANIFEST as lm_don_holt_bridgeManifest } from './don-holt-bridge/config.js';
import { OSM_WAYS as lm_don_holt_bridgeWays } from './don-holt-bridge/footprint.js';
import { create as lm_don_holt_bridgeCreate } from './don-holt-bridge/geometry.js';
import { VIEWS as lm_don_holt_bridgeViews } from './don-holt-bridge/views.js';
import { MANIFEST as lm_ben_sawyer_bridgeManifest } from './ben-sawyer-bridge/config.js';
import { OSM_WAYS as lm_ben_sawyer_bridgeWays } from './ben-sawyer-bridge/footprint.js';
import { create as lm_ben_sawyer_bridgeCreate } from './ben-sawyer-bridge/geometry.js';
import { VIEWS as lm_ben_sawyer_bridgeViews } from './ben-sawyer-bridge/views.js';
import { MANIFEST as lm_noisette_creek_pedestrian_bridgeManifest } from './noisette-creek-pedestrian-bridge/config.js';
import { OSM_WAYS as lm_noisette_creek_pedestrian_bridgeWays } from './noisette-creek-pedestrian-bridge/footprint.js';
import { create as lm_noisette_creek_pedestrian_bridgeCreate } from './noisette-creek-pedestrian-bridge/geometry.js';
import { VIEWS as lm_noisette_creek_pedestrian_bridgeViews } from './noisette-creek-pedestrian-bridge/views.js';
import { MANIFEST as lm_north_charleston_coliseumManifest } from './north-charleston-coliseum/config.js';
import { OSM_WAYS as lm_north_charleston_coliseumWays } from './north-charleston-coliseum/footprint.js';
import { create as lm_north_charleston_coliseumCreate } from './north-charleston-coliseum/geometry.js';
import { VIEWS as lm_north_charleston_coliseumViews } from './north-charleston-coliseum/views.js';
import { MANIFEST as lm_st_michaels_church_charlestonManifest } from './st-michaels-church-charleston/config.js';
import { OSM_WAYS as lm_st_michaels_church_charlestonWays } from './st-michaels-church-charleston/footprint.js';
import { create as lm_st_michaels_church_charlestonCreate } from './st-michaels-church-charleston/geometry.js';
import { VIEWS as lm_st_michaels_church_charlestonViews } from './st-michaels-church-charleston/views.js';
import { MANIFEST as lm_st_philips_church_charlestonManifest } from './st-philips-church-charleston/config.js';
import { OSM_WAYS as lm_st_philips_church_charlestonWays } from './st-philips-church-charleston/footprint.js';
import { create as lm_st_philips_church_charlestonCreate } from './st-philips-church-charleston/geometry.js';
import { VIEWS as lm_st_philips_church_charlestonViews } from './st-philips-church-charleston/views.js';
import { MANIFEST as lm_us_custom_house_charlestonManifest } from './us-custom-house-charleston/config.js';
import { OSM_WAYS as lm_us_custom_house_charlestonWays } from './us-custom-house-charleston/footprint.js';
import { create as lm_us_custom_house_charlestonCreate } from './us-custom-house-charleston/geometry.js';
import { VIEWS as lm_us_custom_house_charlestonViews } from './us-custom-house-charleston/views.js';
import { MANIFEST as lm_pineapple_fountain_charlestonManifest } from './pineapple-fountain-charleston/config.js';
import { OSM_WAYS as lm_pineapple_fountain_charlestonWays } from './pineapple-fountain-charleston/footprint.js';
import { create as lm_pineapple_fountain_charlestonCreate } from './pineapple-fountain-charleston/geometry.js';
import { VIEWS as lm_pineapple_fountain_charlestonViews } from './pineapple-fountain-charleston/views.js';
import { MANIFEST as lm_rainbow_row_charlestonManifest } from './rainbow-row-charleston/config.js';
import { OSM_WAYS as lm_rainbow_row_charlestonWays } from './rainbow-row-charleston/footprint.js';
import { create as lm_rainbow_row_charlestonCreate } from './rainbow-row-charleston/geometry.js';
import { VIEWS as lm_rainbow_row_charlestonViews } from './rainbow-row-charleston/views.js';
import { MANIFEST as lm_citadel_padgett_thomas_barracksManifest } from './citadel-padgett-thomas-barracks/config.js';
import { OSM_WAYS as lm_citadel_padgett_thomas_barracksWays } from './citadel-padgett-thomas-barracks/footprint.js';
import { create as lm_citadel_padgett_thomas_barracksCreate } from './citadel-padgett-thomas-barracks/geometry.js';
import { VIEWS as lm_citadel_padgett_thomas_barracksViews } from './citadel-padgett-thomas-barracks/views.js';
import { MANIFEST as lm_morris_island_lighthouseManifest } from './morris-island-lighthouse/config.js';
import { OSM_WAYS as lm_morris_island_lighthouseWays } from './morris-island-lighthouse/footprint.js';
import { create as lm_morris_island_lighthouseCreate } from './morris-island-lighthouse/geometry.js';
import { VIEWS as lm_morris_island_lighthouseViews } from './morris-island-lighthouse/views.js';
import { MANIFEST as lm_charleston_international_airport_terminalManifest } from './charleston-international-airport-terminal/config.js';
import { OSM_WAYS as lm_charleston_international_airport_terminalWays } from './charleston-international-airport-terminal/footprint.js';
import { create as lm_charleston_international_airport_terminalCreate } from './charleston-international-airport-terminal/geometry.js';
import { VIEWS as lm_charleston_international_airport_terminalViews } from './charleston-international-airport-terminal/views.js';
import { MANIFEST as lm_st_james_goose_creek_churchManifest } from './st-james-goose-creek-church/config.js';
import { OSM_WAYS as lm_st_james_goose_creek_churchWays } from './st-james-goose-creek-church/footprint.js';
import { create as lm_st_james_goose_creek_churchCreate } from './st-james-goose-creek-church/geometry.js';
import { VIEWS as lm_st_james_goose_creek_churchViews } from './st-james-goose-creek-church/views.js';
import { MANIFEST as lm_goose_creek_municipal_centerManifest } from './goose-creek-municipal-center/config.js';
import { OSM_WAYS as lm_goose_creek_municipal_centerWays } from './goose-creek-municipal-center/footprint.js';
import { create as lm_goose_creek_municipal_centerCreate } from './goose-creek-municipal-center/geometry.js';
import { VIEWS as lm_goose_creek_municipal_centerViews } from './goose-creek-municipal-center/views.js';
import { MANIFEST as lm_colonial_dorchester_bell_towerManifest } from './colonial-dorchester-bell-tower/config.js';
import { OSM_WAYS as lm_colonial_dorchester_bell_towerWays } from './colonial-dorchester-bell-tower/footprint.js';
import { create as lm_colonial_dorchester_bell_towerCreate } from './colonial-dorchester-bell-tower/geometry.js';
import { VIEWS as lm_colonial_dorchester_bell_towerViews } from './colonial-dorchester-bell-tower/views.js';
import { MANIFEST as lm_north_charleston_city_hallManifest } from './north-charleston-city-hall/config.js';
import { OSM_WAYS as lm_north_charleston_city_hallWays } from './north-charleston-city-hall/footprint.js';
import { create as lm_north_charleston_city_hallCreate } from './north-charleston-city-hall/geometry.js';
import { VIEWS as lm_north_charleston_city_hallViews } from './north-charleston-city-hall/views.js';
import { MANIFEST as lm_122_leadenhall_streetManifest } from './122-leadenhall-street/config.js';
import { OSM_WAYS as lm_122_leadenhall_streetWays } from './122-leadenhall-street/footprint.js';
import { create as lm_122_leadenhall_streetCreate } from './122-leadenhall-street/geometry.js';
import { VIEWS as lm_122_leadenhall_streetViews } from './122-leadenhall-street/views.js';
import { MANIFEST as lm_20_fenchurch_streetManifest } from './20-fenchurch-street/config.js';
import { OSM_WAYS as lm_20_fenchurch_streetWays } from './20-fenchurch-street/footprint.js';
import { create as lm_20_fenchurch_streetCreate } from './20-fenchurch-street/geometry.js';
import { VIEWS as lm_20_fenchurch_streetViews } from './20-fenchurch-street/views.js';
import { MANIFEST as lm_3arena_dublinManifest } from './3arena-dublin/config.js';
import { OSM_WAYS as lm_3arena_dublinWays } from './3arena-dublin/footprint.js';
import { create as lm_3arena_dublinCreate } from './3arena-dublin/geometry.js';
import { VIEWS as lm_3arena_dublinViews } from './3arena-dublin/views.js';
import { MANIFEST as lm_8_canada_squareManifest } from './8-canada-square/config.js';
import { OSM_WAYS as lm_8_canada_squareWays } from './8-canada-square/footprint.js';
import { create as lm_8_canada_squareCreate } from './8-canada-square/geometry.js';
import { VIEWS as lm_8_canada_squareViews } from './8-canada-square/views.js';
import { MANIFEST as lm_absolute_world_mississaugaManifest } from './absolute-world-mississauga/config.js';
import { OSM_WAYS as lm_absolute_world_mississaugaWays } from './absolute-world-mississauga/footprint.js';
import { create as lm_absolute_world_mississaugaCreate } from './absolute-world-mississauga/geometry.js';
import { VIEWS as lm_absolute_world_mississaugaViews } from './absolute-world-mississauga/views.js';
import { MANIFEST as lm_accor_arena_bercyManifest } from './accor-arena-bercy/config.js';
import { OSM_WAYS as lm_accor_arena_bercyWays } from './accor-arena-bercy/footprint.js';
import { create as lm_accor_arena_bercyCreate } from './accor-arena-bercy/geometry.js';
import { VIEWS as lm_accor_arena_bercyViews } from './accor-arena-bercy/views.js';
import { MANIFEST as lm_afi_silver_theatreManifest } from './afi-silver-theatre/config.js';
import { OSM_WAYS as lm_afi_silver_theatreWays } from './afi-silver-theatre/footprint.js';
import { create as lm_afi_silver_theatreCreate } from './afi-silver-theatre/geometry.js';
import { VIEWS as lm_afi_silver_theatreViews } from './afi-silver-theatre/views.js';
import { MANIFEST as lm_american_airlines_centerManifest } from './american-airlines-center/config.js';
import { OSM_WAYS as lm_american_airlines_centerWays } from './american-airlines-center/footprint.js';
import { create as lm_american_airlines_centerCreate } from './american-airlines-center/geometry.js';
import { VIEWS as lm_american_airlines_centerViews } from './american-airlines-center/views.js';
import { MANIFEST as lm_anaheim_articManifest } from './anaheim-artic/config.js';
import { OSM_WAYS as lm_anaheim_articWays } from './anaheim-artic/footprint.js';
import { create as lm_anaheim_articCreate } from './anaheim-artic/geometry.js';
import { VIEWS as lm_anaheim_articViews } from './anaheim-artic/views.js';
import { MANIFEST as lm_anaheim_packing_houseManifest } from './anaheim-packing-house/config.js';
import { OSM_WAYS as lm_anaheim_packing_houseWays } from './anaheim-packing-house/footprint.js';
import { create as lm_anaheim_packing_houseCreate } from './anaheim-packing-house/geometry.js';
import { VIEWS as lm_anaheim_packing_houseViews } from './anaheim-packing-house/views.js';
import { MANIFEST as lm_angel_stadiumManifest } from './angel-stadium/config.js';
import { OSM_WAYS as lm_angel_stadiumWays } from './angel-stadium/footprint.js';
import { create as lm_angel_stadiumCreate } from './angel-stadium/geometry.js';
import { VIEWS as lm_angel_stadiumViews } from './angel-stadium/views.js';
import { MANIFEST as lm_arenes_de_nimesManifest } from './arenes-de-nimes/config.js';
import { OSM_WAYS as lm_arenes_de_nimesWays } from './arenes-de-nimes/footprint.js';
import { create as lm_arenes_de_nimesCreate } from './arenes-de-nimes/geometry.js';
import { VIEWS as lm_arenes_de_nimesViews } from './arenes-de-nimes/views.js';
import { MANIFEST as lm_astrodomeManifest } from './astrodome/config.js';
import { OSM_WAYS as lm_astrodomeWays } from './astrodome/footprint.js';
import { create as lm_astrodomeCreate } from './astrodome/geometry.js';
import { VIEWS as lm_astrodomeViews } from './astrodome/views.js';
import { MANIFEST as lm_athens_city_hallManifest } from './athens-city-hall/config.js';
import { OSM_WAYS as lm_athens_city_hallWays } from './athens-city-hall/footprint.js';
import { create as lm_athens_city_hallCreate } from './athens-city-hall/geometry.js';
import { VIEWS as lm_athens_city_hallViews } from './athens-city-hall/views.js';
import { MANIFEST as lm_athens_towerManifest } from './athens-tower/config.js';
import { OSM_WAYS as lm_athens_towerWays } from './athens-tower/footprint.js';
import { create as lm_athens_towerCreate } from './athens-tower/geometry.js';
import { VIEWS as lm_athens_towerViews } from './athens-tower/views.js';
import { MANIFEST as lm_avicii_arenaManifest } from './avicii-arena/config.js';
import { OSM_WAYS as lm_avicii_arenaWays } from './avicii-arena/footprint.js';
import { create as lm_avicii_arenaCreate } from './avicii-arena/geometry.js';
import { VIEWS as lm_avicii_arenaViews } from './avicii-arena/views.js';
import { MANIFEST as lm_aviva_stadiumManifest } from './aviva-stadium/config.js';
import { OSM_WAYS as lm_aviva_stadiumWays } from './aviva-stadium/footprint.js';
import { create as lm_aviva_stadiumCreate } from './aviva-stadium/geometry.js';
import { VIEWS as lm_aviva_stadiumViews } from './aviva-stadium/views.js';
import { MANIFEST as lm_azrieli_centerManifest } from './azrieli-center/config.js';
import { OSM_WAYS as lm_azrieli_centerWays } from './azrieli-center/footprint.js';
import { create as lm_azrieli_centerCreate } from './azrieli-center/geometry.js';
import { VIEWS as lm_azrieli_centerViews } from './azrieli-center/views.js';
import { MANIFEST as lm_bahai_house_worship_wilmetteManifest } from './bahai-house-worship-wilmette/config.js';
import { OSM_WAYS as lm_bahai_house_worship_wilmetteWays } from './bahai-house-worship-wilmette/footprint.js';
import { create as lm_bahai_house_worship_wilmetteCreate } from './bahai-house-worship-wilmette/geometry.js';
import { VIEWS as lm_bahai_house_worship_wilmetteViews } from './bahai-house-worship-wilmette/views.js';
import { MANIFEST as lm_baltimore_city_hallManifest } from './baltimore-city-hall/config.js';
import { OSM_WAYS as lm_baltimore_city_hallWays } from './baltimore-city-hall/footprint.js';
import { create as lm_baltimore_city_hallCreate } from './baltimore-city-hall/geometry.js';
import { VIEWS as lm_baltimore_city_hallViews } from './baltimore-city-hall/views.js';
import { MANIFEST as lm_baltimore_world_trade_centerManifest } from './baltimore-world-trade-center/config.js';
import { OSM_WAYS as lm_baltimore_world_trade_centerWays } from './baltimore-world-trade-center/footprint.js';
import { create as lm_baltimore_world_trade_centerCreate } from './baltimore-world-trade-center/geometry.js';
import { VIEWS as lm_baltimore_world_trade_centerViews } from './baltimore-world-trade-center/views.js';
import { MANIFEST as lm_bancolombia_medellinManifest } from './bancolombia-medellin/config.js';
import { OSM_WAYS as lm_bancolombia_medellinWays } from './bancolombia-medellin/footprint.js';
import { create as lm_bancolombia_medellinCreate } from './bancolombia-medellin/geometry.js';
import { VIEWS as lm_bancolombia_medellinViews } from './bancolombia-medellin/views.js';
import { MANIFEST as lm_bank_of_georgia_hqManifest } from './bank-of-georgia-hq/config.js';
import { OSM_WAYS as lm_bank_of_georgia_hqWays } from './bank-of-georgia-hq/footprint.js';
import { create as lm_bank_of_georgia_hqCreate } from './bank-of-georgia-hq/geometry.js';
import { VIEWS as lm_bank_of_georgia_hqViews } from './bank-of-georgia-hq/views.js';
import { MANIFEST as lm_basilica_saint_nicholas_amsterdamManifest } from './basilica-saint-nicholas-amsterdam/config.js';
import { OSM_WAYS as lm_basilica_saint_nicholas_amsterdamWays } from './basilica-saint-nicholas-amsterdam/footprint.js';
import { create as lm_basilica_saint_nicholas_amsterdamCreate } from './basilica-saint-nicholas-amsterdam/geometry.js';
import { VIEWS as lm_basilica_saint_nicholas_amsterdamViews } from './basilica-saint-nicholas-amsterdam/views.js';
import { MANIFEST as lm_basilique_saint_frederic_drummondvilleManifest } from './basilique-saint-frederic-drummondville/config.js';
import { OSM_WAYS as lm_basilique_saint_frederic_drummondvilleWays } from './basilique-saint-frederic-drummondville/footprint.js';
import { create as lm_basilique_saint_frederic_drummondvilleCreate } from './basilique-saint-frederic-drummondville/geometry.js';
import { VIEWS as lm_basilique_saint_frederic_drummondvilleViews } from './basilique-saint-frederic-drummondville/views.js';
import { MANIFEST as lm_basilique_visitation_annecyManifest } from './basilique-visitation-annecy/config.js';
import { OSM_WAYS as lm_basilique_visitation_annecyWays } from './basilique-visitation-annecy/footprint.js';
import { create as lm_basilique_visitation_annecyCreate } from './basilique-visitation-annecy/geometry.js';
import { VIEWS as lm_basilique_visitation_annecyViews } from './basilique-visitation-annecy/views.js';
import { MANIFEST as lm_bass_performance_hallManifest } from './bass-performance-hall/config.js';
import { OSM_WAYS as lm_bass_performance_hallWays } from './bass-performance-hall/footprint.js';
import { create as lm_bass_performance_hallCreate } from './bass-performance-hall/geometry.js';
import { VIEWS as lm_bass_performance_hallViews } from './bass-performance-hall/views.js';
import { MANIFEST as lm_bd_bacataManifest } from './bd-bacata/config.js';
import { OSM_WAYS as lm_bd_bacataWays } from './bd-bacata/footprint.js';
import { create as lm_bd_bacataCreate } from './bd-bacata/geometry.js';
import { VIEWS as lm_bd_bacataViews } from './bd-bacata/views.js';
import { MANIFEST as lm_beetham_tower_manchesterManifest } from './beetham-tower-manchester/config.js';
import { OSM_WAYS as lm_beetham_tower_manchesterWays } from './beetham-tower-manchester/footprint.js';
import { create as lm_beetham_tower_manchesterCreate } from './beetham-tower-manchester/geometry.js';
import { VIEWS as lm_beetham_tower_manchesterViews } from './beetham-tower-manchester/views.js';
import { MANIFEST as lm_beffroi_hotel_de_ville_lilleManifest } from './beffroi-hotel-de-ville-lille/config.js';
import { OSM_WAYS as lm_beffroi_hotel_de_ville_lilleWays } from './beffroi-hotel-de-ville-lille/footprint.js';
import { create as lm_beffroi_hotel_de_ville_lilleCreate } from './beffroi-hotel-de-ville-lille/geometry.js';
import { VIEWS as lm_beffroi_hotel_de_ville_lilleViews } from './beffroi-hotel-de-ville-lille/views.js';
import { MANIFEST as lm_bella_sky_copenhagenManifest } from './bella-sky-copenhagen/config.js';
import { OSM_WAYS as lm_bella_sky_copenhagenWays } from './bella-sky-copenhagen/footprint.js';
import { create as lm_bella_sky_copenhagenCreate } from './bella-sky-copenhagen/geometry.js';
import { VIEWS as lm_bella_sky_copenhagenViews } from './bella-sky-copenhagen/views.js';
import { MANIFEST as lm_berlin_fernsehturmManifest } from './berlin-fernsehturm/config.js';
import { OSM_WAYS as lm_berlin_fernsehturmWays } from './berlin-fernsehturm/footprint.js';
import { create as lm_berlin_fernsehturmCreate } from './berlin-fernsehturm/geometry.js';
import { VIEWS as lm_berlin_fernsehturmViews } from './berlin-fernsehturm/views.js';
import { MANIFEST as lm_bibliotheque_nationale_francois_mitterrandManifest } from './bibliotheque-nationale-francois-mitterrand/config.js';
import { OSM_WAYS as lm_bibliotheque_nationale_francois_mitterrandWays } from './bibliotheque-nationale-francois-mitterrand/footprint.js';
import { create as lm_bibliotheque_nationale_francois_mitterrandCreate } from './bibliotheque-nationale-francois-mitterrand/geometry.js';
import { VIEWS as lm_bibliotheque_nationale_francois_mitterrandViews } from './bibliotheque-nationale-francois-mitterrand/views.js';
import { MANIFEST as lm_bibliotheque_schoelcherManifest } from './bibliotheque-schoelcher/config.js';
import { OSM_WAYS as lm_bibliotheque_schoelcherWays } from './bibliotheque-schoelcher/footprint.js';
import { create as lm_bibliotheque_schoelcherCreate } from './bibliotheque-schoelcher/geometry.js';
import { VIEWS as lm_bibliotheque_schoelcherViews } from './bibliotheque-schoelcher/views.js';
import { MANIFEST as lm_big_chicken_mariettaManifest } from './big-chicken-marietta/config.js';
import { OSM_WAYS as lm_big_chicken_mariettaWays } from './big-chicken-marietta/footprint.js';
import { create as lm_big_chicken_mariettaCreate } from './big-chicken-marietta/geometry.js';
import { VIEWS as lm_big_chicken_mariettaViews } from './big-chicken-marietta/views.js';
import { MANIFEST as lm_biltmore_tbilisiManifest } from './biltmore-tbilisi/config.js';
import { OSM_WAYS as lm_biltmore_tbilisiWays } from './biltmore-tbilisi/footprint.js';
import { create as lm_biltmore_tbilisiCreate } from './biltmore-tbilisi/geometry.js';
import { VIEWS as lm_biltmore_tbilisiViews } from './biltmore-tbilisi/views.js';
import { MANIFEST as lm_bmw_headquartersManifest } from './bmw-headquarters/config.js';
import { OSM_WAYS as lm_bmw_headquartersWays } from './bmw-headquarters/footprint.js';
import { create as lm_bmw_headquartersCreate } from './bmw-headquarters/geometry.js';
import { VIEWS as lm_bmw_headquartersViews } from './bmw-headquarters/views.js';
import { MANIFEST as lm_braselton_brothers_storeManifest } from './braselton-brothers-store/config.js';
import { OSM_WAYS as lm_braselton_brothers_storeWays } from './braselton-brothers-store/footprint.js';
import { create as lm_braselton_brothers_storeCreate } from './braselton-brothers-store/geometry.js';
import { VIEWS as lm_braselton_brothers_storeViews } from './braselton-brothers-store/views.js';
import { MANIFEST as lm_bt_tower_londonManifest } from './bt-tower-london/config.js';
import { OSM_WAYS as lm_bt_tower_londonWays } from './bt-tower-london/footprint.js';
import { create as lm_bt_tower_londonCreate } from './bt-tower-london/geometry.js';
import { VIEWS as lm_bt_tower_londonViews } from './bt-tower-london/views.js';
import { MANIFEST as lm_california_state_capitolManifest } from './california-state-capitol/config.js';
import { OSM_WAYS as lm_california_state_capitolWays } from './california-state-capitol/footprint.js';
import { create as lm_california_state_capitolCreate } from './california-state-capitol/geometry.js';
import { VIEWS as lm_california_state_capitolViews } from './california-state-capitol/views.js';
import { MANIFEST as lm_california_theatre_san_bernardinoManifest } from './california-theatre-san-bernardino/config.js';
import { OSM_WAYS as lm_california_theatre_san_bernardinoWays } from './california-theatre-san-bernardino/footprint.js';
import { create as lm_california_theatre_san_bernardinoCreate } from './california-theatre-san-bernardino/geometry.js';
import { VIEWS as lm_california_theatre_san_bernardinoViews } from './california-theatre-san-bernardino/views.js';
import { MANIFEST as lm_castel_sant_angeloManifest } from './castel-sant-angelo/config.js';
import { OSM_WAYS as lm_castel_sant_angeloWays } from './castel-sant-angelo/footprint.js';
import { create as lm_castel_sant_angeloCreate } from './castel-sant-angelo/geometry.js';
import { VIEWS as lm_castel_sant_angeloViews } from './castel-sant-angelo/views.js';
import { MANIFEST as lm_cathedral_basilica_st_louisManifest } from './cathedral-basilica-st-louis/config.js';
import { OSM_WAYS as lm_cathedral_basilica_st_louisWays } from './cathedral-basilica-st-louis/footprint.js';
import { create as lm_cathedral_basilica_st_louisCreate } from './cathedral-basilica-st-louis/geometry.js';
import { VIEWS as lm_cathedral_basilica_st_louisViews } from './cathedral-basilica-st-louis/views.js';
import { MANIFEST as lm_cathedral_blessed_sacrament_sacramentoManifest } from './cathedral-blessed-sacrament-sacramento/config.js';
import { OSM_WAYS as lm_cathedral_blessed_sacrament_sacramentoWays } from './cathedral-blessed-sacrament-sacramento/footprint.js';
import { create as lm_cathedral_blessed_sacrament_sacramentoCreate } from './cathedral-blessed-sacrament-sacramento/geometry.js';
import { VIEWS as lm_cathedral_blessed_sacrament_sacramentoViews } from './cathedral-blessed-sacrament-sacramento/views.js';
import { MANIFEST as lm_cathedral_transfiguration_markhamManifest } from './cathedral-transfiguration-markham/config.js';
import { OSM_WAYS as lm_cathedral_transfiguration_markhamWays } from './cathedral-transfiguration-markham/footprint.js';
import { create as lm_cathedral_transfiguration_markhamCreate } from './cathedral-transfiguration-markham/geometry.js';
import { VIEWS as lm_cathedral_transfiguration_markhamViews } from './cathedral-transfiguration-markham/views.js';
import { MANIFEST as lm_cathedrale_clermont_ferrandManifest } from './cathedrale-clermont-ferrand/config.js';
import { OSM_WAYS as lm_cathedrale_clermont_ferrandWays } from './cathedrale-clermont-ferrand/footprint.js';
import { create as lm_cathedrale_clermont_ferrandCreate } from './cathedrale-clermont-ferrand/geometry.js';
import { VIEWS as lm_cathedrale_clermont_ferrandViews } from './cathedrale-clermont-ferrand/views.js';
import { MANIFEST as lm_cathedrale_notre_dame_reimsManifest } from './cathedrale-notre-dame-reims/config.js';
import { OSM_WAYS as lm_cathedrale_notre_dame_reimsWays } from './cathedrale-notre-dame-reims/footprint.js';
import { create as lm_cathedrale_notre_dame_reimsCreate } from './cathedrale-notre-dame-reims/geometry.js';
import { VIEWS as lm_cathedrale_notre_dame_reimsViews } from './cathedrale-notre-dame-reims/views.js';
import { MANIFEST as lm_cathedrale_notre_dame_strasbourgManifest } from './cathedrale-notre-dame-strasbourg/config.js';
import { OSM_WAYS as lm_cathedrale_notre_dame_strasbourgWays } from './cathedrale-notre-dame-strasbourg/footprint.js';
import { create as lm_cathedrale_notre_dame_strasbourgCreate } from './cathedrale-notre-dame-strasbourg/geometry.js';
import { VIEWS as lm_cathedrale_notre_dame_strasbourgViews } from './cathedrale-notre-dame-strasbourg/views.js';
import { MANIFEST as lm_cathedrale_saint_antoine_longueuilManifest } from './cathedrale-saint-antoine-longueuil/config.js';
import { OSM_WAYS as lm_cathedrale_saint_antoine_longueuilWays } from './cathedrale-saint-antoine-longueuil/footprint.js';
import { create as lm_cathedrale_saint_antoine_longueuilCreate } from './cathedrale-saint-antoine-longueuil/geometry.js';
import { VIEWS as lm_cathedrale_saint_antoine_longueuilViews } from './cathedrale-saint-antoine-longueuil/views.js';
import { MANIFEST as lm_cathedrale_saint_denis_reunionManifest } from './cathedrale-saint-denis-reunion/config.js';
import { OSM_WAYS as lm_cathedrale_saint_denis_reunionWays } from './cathedrale-saint-denis-reunion/footprint.js';
import { create as lm_cathedrale_saint_denis_reunionCreate } from './cathedrale-saint-denis-reunion/geometry.js';
import { VIEWS as lm_cathedrale_saint_denis_reunionViews } from './cathedrale-saint-denis-reunion/views.js';
import { MANIFEST as lm_cathedrale_saint_louis_fort_de_franceManifest } from './cathedrale-saint-louis-fort-de-france/config.js';
import { OSM_WAYS as lm_cathedrale_saint_louis_fort_de_franceWays } from './cathedrale-saint-louis-fort-de-france/footprint.js';
import { create as lm_cathedrale_saint_louis_fort_de_franceCreate } from './cathedrale-saint-louis-fort-de-france/geometry.js';
import { VIEWS as lm_cathedrale_saint_louis_fort_de_franceViews } from './cathedrale-saint-louis-fort-de-france/views.js';
import { MANIFEST as lm_chateau_elan_wineryManifest } from './chateau-elan-winery/config.js';
import { OSM_WAYS as lm_chateau_elan_wineryWays } from './chateau-elan-winery/footprint.js';
import { create as lm_chateau_elan_wineryCreate } from './chateau-elan-winery/geometry.js';
import { VIEWS as lm_chateau_elan_wineryViews } from './chateau-elan-winery/views.js';
import { MANIFEST as lm_christiansborg_palaceManifest } from './christiansborg-palace/config.js';
import { OSM_WAYS as lm_christiansborg_palaceWays } from './christiansborg-palace/footprint.js';
import { create as lm_christiansborg_palaceCreate } from './christiansborg-palace/geometry.js';
import { VIEWS as lm_christiansborg_palaceViews } from './christiansborg-palace/views.js';
import { MANIFEST as lm_church_of_our_saviour_copenhagenManifest } from './church-of-our-saviour-copenhagen/config.js';
import { OSM_WAYS as lm_church_of_our_saviour_copenhagenWays } from './church-of-our-saviour-copenhagen/footprint.js';
import { create as lm_church_of_our_saviour_copenhagenCreate } from './church-of-our-saviour-copenhagen/geometry.js';
import { VIEWS as lm_church_of_our_saviour_copenhagenViews } from './church-of-our-saviour-copenhagen/views.js';
import { MANIFEST as lm_cite_du_vin_bordeauxManifest } from './cite-du-vin-bordeaux/config.js';
import { OSM_WAYS as lm_cite_du_vin_bordeauxWays } from './cite-du-vin-bordeaux/footprint.js';
import { create as lm_cite_du_vin_bordeauxCreate } from './cite-du-vin-bordeaux/geometry.js';
import { VIEWS as lm_cite_du_vin_bordeauxViews } from './cite-du-vin-bordeaux/views.js';
import { MANIFEST as lm_civil_courts_building_st_louisManifest } from './civil-courts-building-st-louis/config.js';
import { OSM_WAYS as lm_civil_courts_building_st_louisWays } from './civil-courts-building-st-louis/footprint.js';
import { create as lm_civil_courts_building_st_louisCreate } from './civil-courts-building-st-louis/geometry.js';
import { VIEWS as lm_civil_courts_building_st_louisViews } from './civil-courts-building-st-louis/views.js';
import { MANIFEST as lm_coimbra_university_towerManifest } from './coimbra-university-tower/config.js';
import { OSM_WAYS as lm_coimbra_university_towerWays } from './coimbra-university-tower/footprint.js';
import { create as lm_coimbra_university_towerCreate } from './coimbra-university-tower/geometry.js';
import { VIEWS as lm_coimbra_university_towerViews } from './coimbra-university-tower/views.js';
import { MANIFEST as lm_collegiale_saint_andre_grenobleManifest } from './collegiale-saint-andre-grenoble/config.js';
import { OSM_WAYS as lm_collegiale_saint_andre_grenobleWays } from './collegiale-saint-andre-grenoble/footprint.js';
import { create as lm_collegiale_saint_andre_grenobleCreate } from './collegiale-saint-andre-grenoble/geometry.js';
import { VIEWS as lm_collegiale_saint_andre_grenobleViews } from './collegiale-saint-andre-grenoble/views.js';
import { MANIFEST as lm_collegiate_saint_gertrude_nivellesManifest } from './collegiate-saint-gertrude-nivelles/config.js';
import { OSM_WAYS as lm_collegiate_saint_gertrude_nivellesWays } from './collegiate-saint-gertrude-nivelles/footprint.js';
import { create as lm_collegiate_saint_gertrude_nivellesCreate } from './collegiate-saint-gertrude-nivelles/geometry.js';
import { VIEWS as lm_collegiate_saint_gertrude_nivellesViews } from './collegiate-saint-gertrude-nivelles/views.js';
import { MANIFEST as lm_comerica_bank_towerManifest } from './comerica-bank-tower/config.js';
import { OSM_WAYS as lm_comerica_bank_towerWays } from './comerica-bank-tower/footprint.js';
import { create as lm_comerica_bank_towerCreate } from './comerica-bank-tower/geometry.js';
import { VIEWS as lm_comerica_bank_towerViews } from './comerica-bank-tower/views.js';
import { MANIFEST as lm_constanta_casinoManifest } from './constanta-casino/config.js';
import { OSM_WAYS as lm_constanta_casinoWays } from './constanta-casino/footprint.js';
import { create as lm_constanta_casinoCreate } from './constanta-casino/geometry.js';
import { VIEWS as lm_constanta_casinoViews } from './constanta-casino/views.js';
import { MANIFEST as lm_coolray_fieldManifest } from './coolray-field/config.js';
import { OSM_WAYS as lm_coolray_fieldWays } from './coolray-field/footprint.js';
import { create as lm_coolray_fieldCreate } from './coolray-field/geometry.js';
import { VIEWS as lm_coolray_fieldViews } from './coolray-field/views.js';
import { MANIFEST as lm_coquitlam_city_hallManifest } from './coquitlam-city-hall/config.js';
import { OSM_WAYS as lm_coquitlam_city_hallWays } from './coquitlam-city-hall/footprint.js';
import { create as lm_coquitlam_city_hallCreate } from './coquitlam-city-hall/geometry.js';
import { VIEWS as lm_coquitlam_city_hallViews } from './coquitlam-city-hall/views.js';
import { MANIFEST as lm_cosmodome_lavalManifest } from './cosmodome-laval/config.js';
import { OSM_WAYS as lm_cosmodome_lavalWays } from './cosmodome-laval/footprint.js';
import { create as lm_cosmodome_lavalCreate } from './cosmodome-laval/geometry.js';
import { VIEWS as lm_cosmodome_lavalViews } from './cosmodome-laval/views.js';
import { MANIFEST as lm_cristo_rei_almadaManifest } from './cristo-rei-almada/config.js';
import { OSM_WAYS as lm_cristo_rei_almadaWays } from './cristo-rei-almada/footprint.js';
import { create as lm_cristo_rei_almadaCreate } from './cristo-rei-almada/geometry.js';
import { VIEWS as lm_cristo_rei_almadaViews } from './cristo-rei-almada/views.js';
import { MANIFEST as lm_dallas_hall_smuManifest } from './dallas-hall-smu/config.js';
import { OSM_WAYS as lm_dallas_hall_smuWays } from './dallas-hall-smu/footprint.js';
import { create as lm_dallas_hall_smuCreate } from './dallas-hall-smu/geometry.js';
import { VIEWS as lm_dallas_hall_smuViews } from './dallas-hall-smu/views.js';
import { MANIFEST as lm_de_gooyerManifest } from './de-gooyer/config.js';
import { OSM_WAYS as lm_de_gooyerWays } from './de-gooyer/footprint.js';
import { create as lm_de_gooyerCreate } from './de-gooyer/geometry.js';
import { VIEWS as lm_de_gooyerViews } from './de-gooyer/views.js';
import { MANIFEST as lm_denver_union_stationManifest } from './denver-union-station/config.js';
import { OSM_WAYS as lm_denver_union_stationWays } from './denver-union-station/footprint.js';
import { create as lm_denver_union_stationCreate } from './denver-union-station/geometry.js';
import { VIEWS as lm_denver_union_stationViews } from './denver-union-station/views.js';
import { MANIFEST as lm_donjon_de_niortManifest } from './donjon-de-niort/config.js';
import { OSM_WAYS as lm_donjon_de_niortWays } from './donjon-de-niort/footprint.js';
import { create as lm_donjon_de_niortCreate } from './donjon-de-niort/geometry.js';
import { VIEWS as lm_donjon_de_niortViews } from './donjon-de-niort/views.js';
import { MANIFEST as lm_eglise_purification_repentignyManifest } from './eglise-purification-repentigny/config.js';
import { OSM_WAYS as lm_eglise_purification_repentignyWays } from './eglise-purification-repentigny/footprint.js';
import { create as lm_eglise_purification_repentignyCreate } from './eglise-purification-repentigny/geometry.js';
import { VIEWS as lm_eglise_purification_repentignyViews } from './eglise-purification-repentigny/views.js';
import { MANIFEST as lm_eglise_saint_augustin_parisManifest } from './eglise-saint-augustin-paris/config.js';
import { OSM_WAYS as lm_eglise_saint_augustin_parisWays } from './eglise-saint-augustin-paris/footprint.js';
import { create as lm_eglise_saint_augustin_parisCreate } from './eglise-saint-augustin-paris/geometry.js';
import { VIEWS as lm_eglise_saint_augustin_parisViews } from './eglise-saint-augustin-paris/views.js';
import { MANIFEST as lm_eglise_saint_hubert_longueuilManifest } from './eglise-saint-hubert-longueuil/config.js';
import { OSM_WAYS as lm_eglise_saint_hubert_longueuilWays } from './eglise-saint-hubert-longueuil/footprint.js';
import { create as lm_eglise_saint_hubert_longueuilCreate } from './eglise-saint-hubert-longueuil/geometry.js';
import { VIEWS as lm_eglise_saint_hubert_longueuilViews } from './eglise-saint-hubert-longueuil/views.js';
import { MANIFEST as lm_eglise_saint_joachim_pointe_claireManifest } from './eglise-saint-joachim-pointe-claire/config.js';
import { OSM_WAYS as lm_eglise_saint_joachim_pointe_claireWays } from './eglise-saint-joachim-pointe-claire/footprint.js';
import { create as lm_eglise_saint_joachim_pointe_claireCreate } from './eglise-saint-joachim-pointe-claire/geometry.js';
import { VIEWS as lm_eglise_saint_joachim_pointe_claireViews } from './eglise-saint-joachim-pointe-claire/views.js';
import { MANIFEST as lm_eglise_saint_lambertManifest } from './eglise-saint-lambert/config.js';
import { OSM_WAYS as lm_eglise_saint_lambertWays } from './eglise-saint-lambert/footprint.js';
import { create as lm_eglise_saint_lambertCreate } from './eglise-saint-lambert/geometry.js';
import { VIEWS as lm_eglise_saint_lambertViews } from './eglise-saint-lambert/views.js';
import { MANIFEST as lm_eglise_saint_pierre_saint_paul_pointe_a_pitreManifest } from './eglise-saint-pierre-saint-paul-pointe-a-pitre/config.js';
import { OSM_WAYS as lm_eglise_saint_pierre_saint_paul_pointe_a_pitreWays } from './eglise-saint-pierre-saint-paul-pointe-a-pitre/footprint.js';
import { create as lm_eglise_saint_pierre_saint_paul_pointe_a_pitreCreate } from './eglise-saint-pierre-saint-paul-pointe-a-pitre/geometry.js';
import { VIEWS as lm_eglise_saint_pierre_saint_paul_pointe_a_pitreViews } from './eglise-saint-pierre-saint-paul-pointe-a-pitre/views.js';
import { MANIFEST as lm_ellicott_city_stationManifest } from './ellicott-city-station/config.js';
import { OSM_WAYS as lm_ellicott_city_stationWays } from './ellicott-city-station/footprint.js';
import { create as lm_ellicott_city_stationCreate } from './ellicott-city-station/geometry.js';
import { VIEWS as lm_ellicott_city_stationViews } from './ellicott-city-station/views.js';
import { MANIFEST as lm_emirates_stadiumManifest } from './emirates-stadium/config.js';
import { OSM_WAYS as lm_emirates_stadiumWays } from './emirates-stadium/footprint.js';
import { create as lm_emirates_stadiumCreate } from './emirates-stadium/geometry.js';
import { VIEWS as lm_emirates_stadiumViews } from './emirates-stadium/views.js';
import { MANIFEST as lm_esch_sur_alzette_town_hallManifest } from './esch-sur-alzette-town-hall/config.js';
import { OSM_WAYS as lm_esch_sur_alzette_town_hallWays } from './esch-sur-alzette-town-hall/footprint.js';
import { create as lm_esch_sur_alzette_town_hallCreate } from './esch-sur-alzette-town-hall/geometry.js';
import { VIEWS as lm_esch_sur_alzette_town_hallViews } from './esch-sur-alzette-town-hall/views.js';
import { MANIFEST as lm_faro_moncloaManifest } from './faro-moncloa/config.js';
import { OSM_WAYS as lm_faro_moncloaWays } from './faro-moncloa/footprint.js';
import { create as lm_faro_moncloaCreate } from './faro-moncloa/geometry.js';
import { VIEWS as lm_faro_moncloaViews } from './faro-moncloa/views.js';
import { MANIFEST as lm_flagey_buildingManifest } from './flagey-building/config.js';
import { OSM_WAYS as lm_flagey_buildingWays } from './flagey-building/footprint.js';
import { create as lm_flagey_buildingCreate } from './flagey-building/geometry.js';
import { VIEWS as lm_flagey_buildingViews } from './flagey-building/views.js';
import { MANIFEST as lm_fondation_vasarely_aixManifest } from './fondation-vasarely-aix/config.js';
import { OSM_WAYS as lm_fondation_vasarely_aixWays } from './fondation-vasarely-aix/footprint.js';
import { create as lm_fondation_vasarely_aixCreate } from './fondation-vasarely-aix/geometry.js';
import { VIEWS as lm_fondation_vasarely_aixViews } from './fondation-vasarely-aix/views.js';
import { MANIFEST as lm_fort_chamblyManifest } from './fort-chambly/config.js';
import { OSM_WAYS as lm_fort_chamblyWays } from './fort-chambly/footprint.js';
import { create as lm_fort_chamblyCreate } from './fort-chambly/geometry.js';
import { VIEWS as lm_fort_chamblyViews } from './fort-chambly/views.js';
import { MANIFEST as lm_fort_langley_community_hallManifest } from './fort-langley-community-hall/config.js';
import { OSM_WAYS as lm_fort_langley_community_hallWays } from './fort-langley-community-hall/footprint.js';
import { create as lm_fort_langley_community_hallCreate } from './fort-langley-community-hall/geometry.js';
import { VIEWS as lm_fort_langley_community_hallViews } from './fort-langley-community-hall/views.js';
import { MANIFEST as lm_fortin_herediaManifest } from './fortin-heredia/config.js';
import { OSM_WAYS as lm_fortin_herediaWays } from './fortin-heredia/footprint.js';
import { create as lm_fortin_herediaCreate } from './fortin-heredia/geometry.js';
import { VIEWS as lm_fortin_herediaViews } from './fortin-heredia/views.js';
import { MANIFEST as lm_gare_orienteManifest } from './gare-oriente/config.js';
import { OSM_WAYS as lm_gare_orienteWays } from './gare-oriente/footprint.js';
import { create as lm_gare_orienteCreate } from './gare-oriente/geometry.js';
import { VIEWS as lm_gare_orienteViews } from './gare-oriente/views.js';
import { MANIFEST as lm_gas_south_arenaManifest } from './gas-south-arena/config.js';
import { OSM_WAYS as lm_gas_south_arenaWays } from './gas-south-arena/footprint.js';
import { create as lm_gas_south_arenaCreate } from './gas-south-arena/geometry.js';
import { VIEWS as lm_gas_south_arenaViews } from './gas-south-arena/views.js';
import { MANIFEST as lm_gasometro_romeManifest } from './gasometro-rome/config.js';
import { OSM_WAYS as lm_gasometro_romeWays } from './gasometro-rome/footprint.js';
import { create as lm_gasometro_romeCreate } from './gasometro-rome/geometry.js';
import { VIEWS as lm_gasometro_romeViews } from './gasometro-rome/views.js';
import { MANIFEST as lm_ghent_belfryManifest } from './ghent-belfry/config.js';
import { OSM_WAYS as lm_ghent_belfryWays } from './ghent-belfry/footprint.js';
import { create as lm_ghent_belfryCreate } from './ghent-belfry/geometry.js';
import { VIEWS as lm_ghent_belfryViews } from './ghent-belfry/views.js';
import { MANIFEST as lm_grand_hotel_dieu_lyonManifest } from './grand-hotel-dieu-lyon/config.js';
import { OSM_WAYS as lm_grand_hotel_dieu_lyonWays } from './grand-hotel-dieu-lyon/footprint.js';
import { create as lm_grand_hotel_dieu_lyonCreate } from './grand-hotel-dieu-lyon/geometry.js';
import { VIEWS as lm_grand_hotel_dieu_lyonViews } from './grand-hotel-dieu-lyon/views.js';
import { MANIFEST as lm_grosse_cloche_bordeauxManifest } from './grosse-cloche-bordeaux/config.js';
import { OSM_WAYS as lm_grosse_cloche_bordeauxWays } from './grosse-cloche-bordeaux/footprint.js';
import { create as lm_grosse_cloche_bordeauxCreate } from './grosse-cloche-bordeaux/geometry.js';
import { VIEWS as lm_grosse_cloche_bordeauxViews } from './grosse-cloche-bordeaux/views.js';
import { MANIFEST as lm_gur_sikh_templeManifest } from './gur-sikh-temple/config.js';
import { OSM_WAYS as lm_gur_sikh_templeWays } from './gur-sikh-temple/footprint.js';
import { create as lm_gur_sikh_templeCreate } from './gur-sikh-temple/geometry.js';
import { VIEWS as lm_gur_sikh_templeViews } from './gur-sikh-temple/views.js';
import { MANIFEST as lm_gwinnett_historic_courthouseManifest } from './gwinnett-historic-courthouse/config.js';
import { OSM_WAYS as lm_gwinnett_historic_courthouseWays } from './gwinnett-historic-courthouse/footprint.js';
import { create as lm_gwinnett_historic_courthouseCreate } from './gwinnett-historic-courthouse/geometry.js';
import { VIEWS as lm_gwinnett_historic_courthouseViews } from './gwinnett-historic-courthouse/views.js';
import { MANIFEST as lm_haney_houseManifest } from './haney-house/config.js';
import { OSM_WAYS as lm_haney_houseWays } from './haney-house/footprint.js';
import { create as lm_haney_houseCreate } from './haney-house/geometry.js';
import { VIEWS as lm_haney_houseViews } from './haney-house/views.js';
import { MANIFEST as lm_heritage_plaza_houstonManifest } from './heritage-plaza-houston/config.js';
import { OSM_WAYS as lm_heritage_plaza_houstonWays } from './heritage-plaza-houston/footprint.js';
import { create as lm_heritage_plaza_houstonCreate } from './heritage-plaza-houston/geometry.js';
import { VIEWS as lm_heritage_plaza_houstonViews } from './heritage-plaza-houston/views.js';
import { MANIFEST as lm_hillsboro_inlet_lighthouseManifest } from './hillsboro-inlet-lighthouse/config.js';
import { OSM_WAYS as lm_hillsboro_inlet_lighthouseWays } from './hillsboro-inlet-lighthouse/footprint.js';
import { create as lm_hillsboro_inlet_lighthouseCreate } from './hillsboro-inlet-lighthouse/geometry.js';
import { VIEWS as lm_hillsboro_inlet_lighthouseViews } from './hillsboro-inlet-lighthouse/views.js';
import { MANIFEST as lm_honda_centerManifest } from './honda-center/config.js';
import { OSM_WAYS as lm_honda_centerWays } from './honda-center/footprint.js';
import { create as lm_honda_centerCreate } from './honda-center/geometry.js';
import { VIEWS as lm_honda_centerViews } from './honda-center/views.js';
import { MANIFEST as lm_hotel_de_ville_grenobleManifest } from './hotel-de-ville-grenoble/config.js';
import { OSM_WAYS as lm_hotel_de_ville_grenobleWays } from './hotel-de-ville-grenoble/footprint.js';
import { create as lm_hotel_de_ville_grenobleCreate } from './hotel-de-ville-grenoble/geometry.js';
import { VIEWS as lm_hotel_de_ville_grenobleViews } from './hotel-de-ville-grenoble/views.js';
import { MANIFEST as lm_hotel_okura_amsterdamManifest } from './hotel-okura-amsterdam/config.js';
import { OSM_WAYS as lm_hotel_okura_amsterdamWays } from './hotel-okura-amsterdam/footprint.js';
import { create as lm_hotel_okura_amsterdamCreate } from './hotel-okura-amsterdam/geometry.js';
import { VIEWS as lm_hotel_okura_amsterdamViews } from './hotel-okura-amsterdam/views.js';
import { MANIFEST as lm_houston_city_hallManifest } from './houston-city-hall/config.js';
import { OSM_WAYS as lm_houston_city_hallWays } from './houston-city-hall/footprint.js';
import { create as lm_houston_city_hallCreate } from './houston-city-hall/geometry.js';
import { VIEWS as lm_houston_city_hallViews } from './houston-city-hall/views.js';
import { MANIFEST as lm_hypo_haus_munichManifest } from './hypo-haus-munich/config.js';
import { OSM_WAYS as lm_hypo_haus_munichWays } from './hypo-haus-munich/footprint.js';
import { create as lm_hypo_haus_munichCreate } from './hypo-haus-munich/geometry.js';
import { VIEWS as lm_hypo_haus_munichViews } from './hypo-haus-munich/views.js';
import { MANIFEST as lm_iglesia_merced_san_joseManifest } from './iglesia-merced-san-jose/config.js';
import { OSM_WAYS as lm_iglesia_merced_san_joseWays } from './iglesia-merced-san-jose/footprint.js';
import { create as lm_iglesia_merced_san_joseCreate } from './iglesia-merced-san-jose/geometry.js';
import { VIEWS as lm_iglesia_merced_san_joseViews } from './iglesia-merced-san-jose/views.js';
import { MANIFEST as lm_inntel_zaandamManifest } from './inntel-zaandam/config.js';
import { OSM_WAYS as lm_inntel_zaandamWays } from './inntel-zaandam/footprint.js';
import { create as lm_inntel_zaandamCreate } from './inntel-zaandam/geometry.js';
import { VIEWS as lm_inntel_zaandamViews } from './inntel-zaandam/views.js';
import { MANIFEST as lm_intercontinental_bucharestManifest } from './intercontinental-bucharest/config.js';
import { OSM_WAYS as lm_intercontinental_bucharestWays } from './intercontinental-bucharest/footprint.js';
import { create as lm_intercontinental_bucharestCreate } from './intercontinental-bucharest/geometry.js';
import { VIEWS as lm_intercontinental_bucharestViews } from './intercontinental-bucharest/views.js';
import { MANIFEST as lm_ito_towerManifest } from './ito-tower/config.js';
import { OSM_WAYS as lm_ito_towerWays } from './ito-tower/footprint.js';
import { create as lm_ito_towerCreate } from './ito-tower/geometry.js';
import { VIEWS as lm_ito_towerViews } from './ito-tower/views.js';
import { MANIFEST as lm_jerusalem_ymcaManifest } from './jerusalem-ymca/config.js';
import { OSM_WAYS as lm_jerusalem_ymcaWays } from './jerusalem-ymca/footprint.js';
import { create as lm_jerusalem_ymcaCreate } from './jerusalem-ymca/geometry.js';
import { VIEWS as lm_jerusalem_ymcaViews } from './jerusalem-ymca/views.js';
import { MANIFEST as lm_jpmorgan_chase_tower_dallasManifest } from './jpmorgan-chase-tower-dallas/config.js';
import { OSM_WAYS as lm_jpmorgan_chase_tower_dallasWays } from './jpmorgan-chase-tower-dallas/footprint.js';
import { create as lm_jpmorgan_chase_tower_dallasCreate } from './jpmorgan-chase-tower-dallas/geometry.js';
import { VIEWS as lm_jpmorgan_chase_tower_dallasViews } from './jpmorgan-chase-tower-dallas/views.js';
import { MANIFEST as lm_kaknas_towerManifest } from './kaknas-tower/config.js';
import { OSM_WAYS as lm_kaknas_towerWays } from './kaknas-tower/footprint.js';
import { create as lm_kaknas_towerCreate } from './kaknas-tower/geometry.js';
import { VIEWS as lm_kaknas_towerViews } from './kaknas-tower/views.js';
import { MANIFEST as lm_kansas_city_city_hallManifest } from './kansas-city-city-hall/config.js';
import { OSM_WAYS as lm_kansas_city_city_hallWays } from './kansas-city-city-hall/footprint.js';
import { create as lm_kansas_city_city_hallCreate } from './kansas-city-city-hall/geometry.js';
import { VIEWS as lm_kansas_city_city_hallViews } from './kansas-city-city-hall/views.js';
import { MANIFEST as lm_kauffman_center_kansas_cityManifest } from './kauffman-center-kansas-city/config.js';
import { OSM_WAYS as lm_kauffman_center_kansas_cityWays } from './kauffman-center-kansas-city/footprint.js';
import { create as lm_kauffman_center_kansas_cityCreate } from './kauffman-center-kansas-city/geometry.js';
import { VIEWS as lm_kauffman_center_kansas_cityViews } from './kauffman-center-kansas-city/views.js';
import { MANIFEST as lm_kista_science_towerManifest } from './kista-science-tower/config.js';
import { OSM_WAYS as lm_kista_science_towerWays } from './kista-science-tower/footprint.js';
import { create as lm_kista_science_towerCreate } from './kista-science-tower/geometry.js';
import { VIEWS as lm_kista_science_towerViews } from './kista-science-tower/views.js';
import { MANIFEST as lm_koekelberg_basilicaManifest } from './koekelberg-basilica/config.js';
import { OSM_WAYS as lm_koekelberg_basilicaWays } from './koekelberg-basilica/footprint.js';
import { create as lm_koekelberg_basilicaCreate } from './koekelberg-basilica/geometry.js';
import { VIEWS as lm_koekelberg_basilicaViews } from './koekelberg-basilica/views.js';
import { MANIFEST as lm_la_rosaledaManifest } from './la-rosaleda/config.js';
import { OSM_WAYS as lm_la_rosaledaWays } from './la-rosaleda/footprint.js';
import { create as lm_la_rosaledaCreate } from './la-rosaleda/geometry.js';
import { VIEWS as lm_la_rosaledaViews } from './la-rosaleda/views.js';
import { MANIFEST as lm_library_of_birminghamManifest } from './library-of-birmingham/config.js';
import { OSM_WAYS as lm_library_of_birminghamWays } from './library-of-birmingham/footprint.js';
import { create as lm_library_of_birminghamCreate } from './library-of-birmingham/geometry.js';
import { VIEWS as lm_library_of_birminghamViews } from './library-of-birmingham/views.js';
import { MANIFEST as lm_liege_guilleminsManifest } from './liege-guillemins/config.js';
import { OSM_WAYS as lm_liege_guilleminsWays } from './liege-guillemins/footprint.js';
import { create as lm_liege_guilleminsCreate } from './liege-guillemins/geometry.js';
import { VIEWS as lm_liege_guilleminsViews } from './liege-guillemins/views.js';
import { MANIFEST as lm_london_stadiumManifest } from './london-stadium/config.js';
import { OSM_WAYS as lm_london_stadiumWays } from './london-stadium/footprint.js';
import { create as lm_london_stadiumCreate } from './london-stadium/geometry.js';
import { VIEWS as lm_london_stadiumViews } from './london-stadium/views.js';
import { MANIFEST as lm_lviv_town_hallManifest } from './lviv-town-hall/config.js';
import { OSM_WAYS as lm_lviv_town_hallWays } from './lviv-town-hall/footprint.js';
import { create as lm_lviv_town_hallCreate } from './lviv-town-hall/geometry.js';
import { VIEWS as lm_lviv_town_hallViews } from './lviv-town-hall/views.js';
import { MANIFEST as lm_maison_carree_nimesManifest } from './maison-carree-nimes/config.js';
import { OSM_WAYS as lm_maison_carree_nimesWays } from './maison-carree-nimes/footprint.js';
import { create as lm_maison_carree_nimesCreate } from './maison-carree-nimes/geometry.js';
import { VIEWS as lm_maison_carree_nimesViews } from './maison-carree-nimes/views.js';
import { MANIFEST as lm_maison_de_la_radioManifest } from './maison-de-la-radio/config.js';
import { OSM_WAYS as lm_maison_de_la_radioWays } from './maison-de-la-radio/footprint.js';
import { create as lm_maison_de_la_radioCreate } from './maison-de-la-radio/geometry.js';
import { VIEWS as lm_maison_de_la_radioViews } from './maison-de-la-radio/views.js';
import { MANIFEST as lm_malaga_cathedralManifest } from './malaga-cathedral/config.js';
import { OSM_WAYS as lm_malaga_cathedralWays } from './malaga-cathedral/footprint.js';
import { create as lm_malaga_cathedralCreate } from './malaga-cathedral/geometry.js';
import { VIEWS as lm_malaga_cathedralViews } from './malaga-cathedral/views.js';
import { MANIFEST as lm_markham_civic_centreManifest } from './markham-civic-centre/config.js';
import { OSM_WAYS as lm_markham_civic_centreWays } from './markham-civic-centre/footprint.js';
import { create as lm_markham_civic_centreCreate } from './markham-civic-centre/geometry.js';
import { VIEWS as lm_markham_civic_centreViews } from './markham-civic-centre/views.js';
import { MANIFEST as lm_mausoleum_carol_parkManifest } from './mausoleum-carol-park/config.js';
import { OSM_WAYS as lm_mausoleum_carol_parkWays } from './mausoleum-carol-park/footprint.js';
import { create as lm_mausoleum_carol_parkCreate } from './mausoleum-carol-park/geometry.js';
import { VIEWS as lm_mausoleum_carol_parkViews } from './mausoleum-carol-park/views.js';
import { MANIFEST as lm_meyerson_symphony_centerManifest } from './meyerson-symphony-center/config.js';
import { OSM_WAYS as lm_meyerson_symphony_centerWays } from './meyerson-symphony-center/footprint.js';
import { create as lm_meyerson_symphony_centerCreate } from './meyerson-symphony-center/geometry.js';
import { VIEWS as lm_meyerson_symphony_centerViews } from './meyerson-symphony-center/views.js';
import { MANIFEST as lm_mission_san_juan_capistranoManifest } from './mission-san-juan-capistrano/config.js';
import { OSM_WAYS as lm_mission_san_juan_capistranoWays } from './mission-san-juan-capistrano/footprint.js';
import { create as lm_mission_san_juan_capistranoCreate } from './mission-san-juan-capistrano/geometry.js';
import { VIEWS as lm_mission_san_juan_capistranoViews } from './mission-san-juan-capistrano/views.js';
import { MANIFEST as lm_mississauga_civic_centreManifest } from './mississauga-civic-centre/config.js';
import { OSM_WAYS as lm_mississauga_civic_centreWays } from './mississauga-civic-centre/footprint.js';
import { create as lm_mississauga_civic_centreCreate } from './mississauga-civic-centre/geometry.js';
import { VIEWS as lm_mississauga_civic_centreViews } from './mississauga-civic-centre/views.js';
import { MANIFEST as lm_mondriaan_towerManifest } from './mondriaan-tower/config.js';
import { OSM_WAYS as lm_mondriaan_towerWays } from './mondriaan-tower/footprint.js';
import { create as lm_mondriaan_towerCreate } from './mondriaan-tower/geometry.js';
import { VIEWS as lm_mondriaan_towerViews } from './mondriaan-tower/views.js';
import { MANIFEST as lm_moshe_aviv_towerManifest } from './moshe-aviv-tower/config.js';
import { OSM_WAYS as lm_moshe_aviv_towerWays } from './moshe-aviv-tower/footprint.js';
import { create as lm_moshe_aviv_towerCreate } from './moshe-aviv-tower/geometry.js';
import { VIEWS as lm_moshe_aviv_towerViews } from './moshe-aviv-tower/views.js';
import { MANIFEST as lm_moulin_neuf_terrebonneManifest } from './moulin-neuf-terrebonne/config.js';
import { OSM_WAYS as lm_moulin_neuf_terrebonneWays } from './moulin-neuf-terrebonne/footprint.js';
import { create as lm_moulin_neuf_terrebonneCreate } from './moulin-neuf-terrebonne/geometry.js';
import { VIEWS as lm_moulin_neuf_terrebonneViews } from './moulin-neuf-terrebonne/views.js';
import { MANIFEST as lm_mt_bank_stadium_baltimoreManifest } from './mt-bank-stadium-baltimore/config.js';
import { OSM_WAYS as lm_mt_bank_stadium_baltimoreWays } from './mt-bank-stadium-baltimore/footprint.js';
import { create as lm_mt_bank_stadium_baltimoreCreate } from './mt-bank-stadium-baltimore/geometry.js';
import { VIEWS as lm_mt_bank_stadium_baltimoreViews } from './mt-bank-stadium-baltimore/views.js';
import { MANIFEST as lm_museo_arte_costarricenseManifest } from './museo-arte-costarricense/config.js';
import { OSM_WAYS as lm_museo_arte_costarricenseWays } from './museo-arte-costarricense/footprint.js';
import { create as lm_museo_arte_costarricenseCreate } from './museo-arte-costarricense/geometry.js';
import { VIEWS as lm_museo_arte_costarricenseViews } from './museo-arte-costarricense/views.js';
import { MANIFEST as lm_namur_saint_aubinManifest } from './namur-saint-aubin/config.js';
import { OSM_WAYS as lm_namur_saint_aubinWays } from './namur-saint-aubin/footprint.js';
import { create as lm_namur_saint_aubinCreate } from './namur-saint-aubin/geometry.js';
import { VIEWS as lm_namur_saint_aubinViews } from './namur-saint-aubin/views.js';
import { MANIFEST as lm_national_library_romaniaManifest } from './national-library-romania/config.js';
import { OSM_WAYS as lm_national_library_romaniaWays } from './national-library-romania/footprint.js';
import { create as lm_national_library_romaniaCreate } from './national-library-romania/geometry.js';
import { VIEWS as lm_national_library_romaniaViews } from './national-library-romania/views.js';
import { MANIFEST as lm_national_space_centreManifest } from './national-space-centre/config.js';
import { OSM_WAYS as lm_national_space_centreWays } from './national-space-centre/footprint.js';
import { create as lm_national_space_centreCreate } from './national-space-centre/geometry.js';
import { VIEWS as lm_national_space_centreViews } from './national-space-centre/views.js';
import { MANIFEST as lm_national_theatre_bucharestManifest } from './national-theatre-bucharest/config.js';
import { OSM_WAYS as lm_national_theatre_bucharestWays } from './national-theatre-bucharest/footprint.js';
import { create as lm_national_theatre_bucharestCreate } from './national-theatre-bucharest/geometry.js';
import { VIEWS as lm_national_theatre_bucharestViews } from './national-theatre-bucharest/views.js';
import { MANIFEST as lm_national_theatre_londonManifest } from './national-theatre-london/config.js';
import { OSM_WAYS as lm_national_theatre_londonWays } from './national-theatre-london/footprint.js';
import { create as lm_national_theatre_londonCreate } from './national-theatre-london/geometry.js';
import { VIEWS as lm_national_theatre_londonViews } from './national-theatre-london/views.js';
import { MANIFEST as lm_nhow_amsterdam_raiManifest } from './nhow-amsterdam-rai/config.js';
import { OSM_WAYS as lm_nhow_amsterdam_raiWays } from './nhow-amsterdam-rai/footprint.js';
import { create as lm_nhow_amsterdam_raiCreate } from './nhow-amsterdam-rai/geometry.js';
import { VIEWS as lm_nhow_amsterdam_raiViews } from './nhow-amsterdam-rai/views.js';
import { MANIFEST as lm_nottingham_council_houseManifest } from './nottingham-council-house/config.js';
import { OSM_WAYS as lm_nottingham_council_houseWays } from './nottingham-council-house/footprint.js';
import { create as lm_nottingham_council_houseCreate } from './nottingham-council-house/geometry.js';
import { VIEWS as lm_nottingham_council_houseViews } from './nottingham-council-house/views.js';
import { MANIFEST as lm_nrg_stadiumManifest } from './nrg-stadium/config.js';
import { OSM_WAYS as lm_nrg_stadiumWays } from './nrg-stadium/footprint.js';
import { create as lm_nrg_stadiumCreate } from './nrg-stadium/geometry.js';
import { VIEWS as lm_nrg_stadiumViews } from './nrg-stadium/views.js';
import { MANIFEST as lm_ohio_stadiumManifest } from './ohio-stadium/config.js';
import { OSM_WAYS as lm_ohio_stadiumWays } from './ohio-stadium/footprint.js';
import { create as lm_ohio_stadiumCreate } from './ohio-stadium/geometry.js';
import { VIEWS as lm_ohio_stadiumViews } from './ohio-stadium/views.js';
import { MANIFEST as lm_olympiaturm_munichManifest } from './olympiaturm-munich/config.js';
import { OSM_WAYS as lm_olympiaturm_munichWays } from './olympiaturm-munich/footprint.js';
import { create as lm_olympiaturm_munichCreate } from './olympiaturm-munich/geometry.js';
import { VIEWS as lm_olympiaturm_munichViews } from './olympiaturm-munich/views.js';
import { MANIFEST as lm_olympic_stadium_amsterdamManifest } from './olympic-stadium-amsterdam/config.js';
import { OSM_WAYS as lm_olympic_stadium_amsterdamWays } from './olympic-stadium-amsterdam/footprint.js';
import { create as lm_olympic_stadium_amsterdamCreate } from './olympic-stadium-amsterdam/geometry.js';
import { VIEWS as lm_olympic_stadium_amsterdamViews } from './olympic-stadium-amsterdam/views.js';
import { MANIFEST as lm_one_canada_squareManifest } from './one-canada-square/config.js';
import { OSM_WAYS as lm_one_canada_squareWays } from './one-canada-square/footprint.js';
import { create as lm_one_canada_squareCreate } from './one-canada-square/geometry.js';
import { VIEWS as lm_one_canada_squareViews } from './one-canada-square/views.js';
import { MANIFEST as lm_oriole_park_camden_yardsManifest } from './oriole-park-camden-yards/config.js';
import { OSM_WAYS as lm_oriole_park_camden_yardsWays } from './oriole-park-camden-yards/footprint.js';
import { create as lm_oriole_park_camden_yardsCreate } from './oriole-park-camden-yards/geometry.js';
import { VIEWS as lm_oriole_park_camden_yardsViews } from './oriole-park-camden-yards/views.js';
import { MANIFEST as lm_padrao_descobrimentosManifest } from './padrao-descobrimentos/config.js';
import { OSM_WAYS as lm_padrao_descobrimentosWays } from './padrao-descobrimentos/footprint.js';
import { create as lm_padrao_descobrimentosCreate } from './padrao-descobrimentos/geometry.js';
import { VIEWS as lm_padrao_descobrimentosViews } from './padrao-descobrimentos/views.js';
import { MANIFEST as lm_palais_de_l_isle_annecyManifest } from './palais-de-l-isle-annecy/config.js';
import { OSM_WAYS as lm_palais_de_l_isle_annecyWays } from './palais-de-l-isle-annecy/footprint.js';
import { create as lm_palais_de_l_isle_annecyCreate } from './palais-de-l-isle-annecy/geometry.js';
import { VIEWS as lm_palais_de_l_isle_annecyViews } from './palais-de-l-isle-annecy/views.js';
import { MANIFEST as lm_palais_de_la_porte_doreeManifest } from './palais-de-la-porte-doree/config.js';
import { OSM_WAYS as lm_palais_de_la_porte_doreeWays } from './palais-de-la-porte-doree/footprint.js';
import { create as lm_palais_de_la_porte_doreeCreate } from './palais-de-la-porte-doree/geometry.js';
import { VIEWS as lm_palais_de_la_porte_doreeViews } from './palais-de-la-porte-doree/views.js';
import { MANIFEST as lm_palais_des_congres_parisManifest } from './palais-des-congres-paris/config.js';
import { OSM_WAYS as lm_palais_des_congres_parisWays } from './palais-des-congres-paris/footprint.js';
import { create as lm_palais_des_congres_parisCreate } from './palais-des-congres-paris/geometry.js';
import { VIEWS as lm_palais_des_congres_parisViews } from './palais-des-congres-paris/views.js';
import { MANIFEST as lm_palais_des_papes_avignonManifest } from './palais-des-papes-avignon/config.js';
import { OSM_WAYS as lm_palais_des_papes_avignonWays } from './palais-des-papes-avignon/footprint.js';
import { create as lm_palais_des_papes_avignonCreate } from './palais-des-papes-avignon/geometry.js';
import { VIEWS as lm_palais_des_papes_avignonViews } from './palais-des-papes-avignon/views.js';
import { MANIFEST as lm_palazzo_civilta_italianaManifest } from './palazzo-civilta-italiana/config.js';
import { OSM_WAYS as lm_palazzo_civilta_italianaWays } from './palazzo-civilta-italiana/footprint.js';
import { create as lm_palazzo_civilta_italianaCreate } from './palazzo-civilta-italiana/geometry.js';
import { VIEWS as lm_palazzo_civilta_italianaViews } from './palazzo-civilta-italiana/views.js';
import { MANIFEST as lm_parc_des_princesManifest } from './parc-des-princes/config.js';
import { OSM_WAYS as lm_parc_des_princesWays } from './parc-des-princes/footprint.js';
import { create as lm_parc_des_princesCreate } from './parc-des-princes/geometry.js';
import { VIEWS as lm_parc_des_princesViews } from './parc-des-princes/views.js';
import { MANIFEST as lm_parlement_europeen_louise_weissManifest } from './parlement-europeen-louise-weiss/config.js';
import { OSM_WAYS as lm_parlement_europeen_louise_weissWays } from './parlement-europeen-louise-weiss/footprint.js';
import { create as lm_parlement_europeen_louise_weissCreate } from './parlement-europeen-louise-weiss/geometry.js';
import { VIEWS as lm_parlement_europeen_louise_weissViews } from './parlement-europeen-louise-weiss/views.js';
import { MANIFEST as lm_parus_business_centreManifest } from './parus-business-centre/config.js';
import { OSM_WAYS as lm_parus_business_centreWays } from './parus-business-centre/footprint.js';
import { create as lm_parus_business_centreCreate } from './parus-business-centre/geometry.js';
import { VIEWS as lm_parus_business_centreViews } from './parus-business-centre/views.js';
import { MANIFEST as lm_perris_depotManifest } from './perris-depot/config.js';
import { OSM_WAYS as lm_perris_depotWays } from './perris-depot/footprint.js';
import { create as lm_perris_depotCreate } from './perris-depot/geometry.js';
import { VIEWS as lm_perris_depotViews } from './perris-depot/views.js';
import { MANIFEST as lm_phare_de_verzenayManifest } from './phare-de-verzenay/config.js';
import { OSM_WAYS as lm_phare_de_verzenayWays } from './phare-de-verzenay/footprint.js';
import { create as lm_phare_de_verzenayCreate } from './phare-de-verzenay/geometry.js';
import { VIEWS as lm_phare_de_verzenayViews } from './phare-de-verzenay/views.js';
import { MANIFEST as lm_philharmonie_luxembourgManifest } from './philharmonie-luxembourg/config.js';
import { OSM_WAYS as lm_philharmonie_luxembourgWays } from './philharmonie-luxembourg/footprint.js';
import { create as lm_philharmonie_luxembourgCreate } from './philharmonie-luxembourg/geometry.js';
import { VIEWS as lm_philharmonie_luxembourgViews } from './philharmonie-luxembourg/views.js';
import { MANIFEST as lm_place_bell_lavalManifest } from './place-bell-laval/config.js';
import { OSM_WAYS as lm_place_bell_lavalWays } from './place-bell-laval/footprint.js';
import { create as lm_place_bell_lavalCreate } from './place-bell-laval/geometry.js';
import { VIEWS as lm_place_bell_lavalViews } from './place-bell-laval/views.js';
import { MANIFEST as lm_pontsteigerManifest } from './pontsteiger/config.js';
import { OSM_WAYS as lm_pontsteigerWays } from './pontsteiger/footprint.js';
import { create as lm_pontsteigerCreate } from './pontsteiger/geometry.js';
import { VIEWS as lm_pontsteigerViews } from './pontsteiger/views.js';
import { MANIFEST as lm_port_coquitlam_city_hallManifest } from './port-coquitlam-city-hall/config.js';
import { OSM_WAYS as lm_port_coquitlam_city_hallWays } from './port-coquitlam-city-hall/footprint.js';
import { create as lm_port_coquitlam_city_hallCreate } from './port-coquitlam-city-hall/geometry.js';
import { VIEWS as lm_port_coquitlam_city_hallViews } from './port-coquitlam-city-hall/views.js';
import { MANIFEST as lm_porte_cailhau_bordeauxManifest } from './porte-cailhau-bordeaux/config.js';
import { OSM_WAYS as lm_porte_cailhau_bordeauxWays } from './porte-cailhau-bordeaux/footprint.js';
import { create as lm_porte_cailhau_bordeauxCreate } from './porte-cailhau-bordeaux/geometry.js';
import { VIEWS as lm_porte_cailhau_bordeauxViews } from './porte-cailhau-bordeaux/views.js';
import { MANIFEST as lm_porte_de_la_craffeManifest } from './porte-de-la-craffe/config.js';
import { OSM_WAYS as lm_porte_de_la_craffeWays } from './porte-de-la-craffe/footprint.js';
import { create as lm_porte_de_la_craffeCreate } from './porte-de-la-craffe/geometry.js';
import { VIEWS as lm_porte_de_la_craffeViews } from './porte-de-la-craffe/views.js';
import { MANIFEST as lm_portland_union_stationManifest } from './portland-union-station/config.js';
import { OSM_WAYS as lm_portland_union_stationWays } from './portland-union-station/footprint.js';
import { create as lm_portland_union_stationCreate } from './portland-union-station/geometry.js';
import { VIEWS as lm_portland_union_stationViews } from './portland-union-station/views.js';
import { MANIFEST as lm_prime_tower_zurichManifest } from './prime-tower-zurich/config.js';
import { OSM_WAYS as lm_prime_tower_zurichWays } from './prime-tower-zurich/footprint.js';
import { create as lm_prime_tower_zurichCreate } from './prime-tower-zurich/geometry.js';
import { VIEWS as lm_prime_tower_zurichViews } from './prime-tower-zurich/views.js';
import { MANIFEST as lm_pyramid_cestiusManifest } from './pyramid-cestius/config.js';
import { OSM_WAYS as lm_pyramid_cestiusWays } from './pyramid-cestius/footprint.js';
import { create as lm_pyramid_cestiusCreate } from './pyramid-cestius/geometry.js';
import { VIEWS as lm_pyramid_cestiusViews } from './pyramid-cestius/views.js';
import { MANIFEST as lm_rai_eliciumManifest } from './rai-elicium/config.js';
import { OSM_WAYS as lm_rai_eliciumWays } from './rai-elicium/footprint.js';
import { create as lm_rai_eliciumCreate } from './rai-elicium/geometry.js';
import { VIEWS as lm_rai_eliciumViews } from './rai-elicium/views.js';
import { MANIFEST as lm_red_brick_courthouse_rockvilleManifest } from './red-brick-courthouse-rockville/config.js';
import { OSM_WAYS as lm_red_brick_courthouse_rockvilleWays } from './red-brick-courthouse-rockville/footprint.js';
import { create as lm_red_brick_courthouse_rockvilleCreate } from './red-brick-courthouse-rockville/geometry.js';
import { VIEWS as lm_red_brick_courthouse_rockvilleViews } from './red-brick-courthouse-rockville/views.js';
import { MANIFEST as lm_rembrandt_towerManifest } from './rembrandt-tower/config.js';
import { OSM_WAYS as lm_rembrandt_towerWays } from './rembrandt-tower/footprint.js';
import { create as lm_rembrandt_towerCreate } from './rembrandt-tower/geometry.js';
import { VIEWS as lm_rembrandt_towerViews } from './rembrandt-tower/views.js';
import { MANIFEST as lm_renaissance_tower_dallasManifest } from './renaissance-tower-dallas/config.js';
import { OSM_WAYS as lm_renaissance_tower_dallasWays } from './renaissance-tower-dallas/footprint.js';
import { create as lm_renaissance_tower_dallasCreate } from './renaissance-tower-dallas/geometry.js';
import { VIEWS as lm_renaissance_tower_dallasViews } from './renaissance-tower-dallas/views.js';
import { MANIFEST as lm_rhodes_state_office_towerManifest } from './rhodes-state-office-tower/config.js';
import { OSM_WAYS as lm_rhodes_state_office_towerWays } from './rhodes-state-office-tower/footprint.js';
import { create as lm_rhodes_state_office_towerCreate } from './rhodes-state-office-tower/geometry.js';
import { VIEWS as lm_rhodes_state_office_towerViews } from './rhodes-state-office-tower/views.js';
import { MANIFEST as lm_riverside_fox_theaterManifest } from './riverside-fox-theater/config.js';
import { OSM_WAYS as lm_riverside_fox_theaterWays } from './riverside-fox-theater/footprint.js';
import { create as lm_riverside_fox_theaterCreate } from './riverside-fox-theater/geometry.js';
import { VIEWS as lm_riverside_fox_theaterViews } from './riverside-fox-theater/views.js';
import { MANIFEST as lm_sage_gatesheadManifest } from './sage-gateshead/config.js';
import { OSM_WAYS as lm_sage_gatesheadWays } from './sage-gateshead/footprint.js';
import { create as lm_sage_gatesheadCreate } from './sage-gateshead/geometry.js';
import { VIEWS as lm_sage_gatesheadViews } from './sage-gateshead/views.js';
import { MANIFEST as lm_saint_paul_cathedral_liegeManifest } from './saint-paul-cathedral-liege/config.js';
import { OSM_WAYS as lm_saint_paul_cathedral_liegeWays } from './saint-paul-cathedral-liege/footprint.js';
import { create as lm_saint_paul_cathedral_liegeCreate } from './saint-paul-cathedral-liege/geometry.js';
import { VIEWS as lm_saint_paul_cathedral_liegeViews } from './saint-paul-cathedral-liege/views.js';
import { MANIFEST as lm_san_bernardino_county_courthouseManifest } from './san-bernardino-county-courthouse/config.js';
import { OSM_WAYS as lm_san_bernardino_county_courthouseWays } from './san-bernardino-county-courthouse/footprint.js';
import { create as lm_san_bernardino_county_courthouseCreate } from './san-bernardino-county-courthouse/geometry.js';
import { VIEWS as lm_san_bernardino_county_courthouseViews } from './san-bernardino-county-courthouse/views.js';
import { MANIFEST as lm_san_giovanni_lateranoManifest } from './san-giovanni-laterano/config.js';
import { OSM_WAYS as lm_san_giovanni_lateranoWays } from './san-giovanni-laterano/footprint.js';
import { create as lm_san_giovanni_lateranoCreate } from './san-giovanni-laterano/geometry.js';
import { VIEWS as lm_san_giovanni_lateranoViews } from './san-giovanni-laterano/views.js';
import { MANIFEST as lm_san_pedro_claver_cartagenaManifest } from './san-pedro-claver-cartagena/config.js';
import { OSM_WAYS as lm_san_pedro_claver_cartagenaWays } from './san-pedro-claver-cartagena/footprint.js';
import { create as lm_san_pedro_claver_cartagenaCreate } from './san-pedro-claver-cartagena/geometry.js';
import { VIEWS as lm_san_pedro_claver_cartagenaViews } from './san-pedro-claver-cartagena/views.js';
import { MANIFEST as lm_sanford_stadiumManifest } from './sanford-stadium/config.js';
import { OSM_WAYS as lm_sanford_stadiumWays } from './sanford-stadium/footprint.js';
import { create as lm_sanford_stadiumCreate } from './sanford-stadium/geometry.js';
import { VIEWS as lm_sanford_stadiumViews } from './sanford-stadium/views.js';
import { MANIFEST as lm_santa_justa_liftManifest } from './santa-justa-lift/config.js';
import { OSM_WAYS as lm_santa_justa_liftWays } from './santa-justa-lift/footprint.js';
import { create as lm_santa_justa_liftCreate } from './santa-justa-lift/geometry.js';
import { VIEWS as lm_santa_justa_liftViews } from './santa-justa-lift/views.js';
import { MANIFEST as lm_santa_maria_maggioreManifest } from './santa-maria-maggiore/config.js';
import { OSM_WAYS as lm_santa_maria_maggioreWays } from './santa-maria-maggiore/footprint.js';
import { create as lm_santa_maria_maggioreCreate } from './santa-maria-maggiore/geometry.js';
import { VIEWS as lm_santa_maria_maggioreViews } from './santa-maria-maggiore/views.js';
import { MANIFEST as lm_savage_millManifest } from './savage-mill/config.js';
import { OSM_WAYS as lm_savage_millWays } from './savage-mill/footprint.js';
import { create as lm_savage_millCreate } from './savage-mill/geometry.js';
import { VIEWS as lm_savage_millViews } from './savage-mill/views.js';
import { MANIFEST as lm_seven_foot_knoll_lighthouseManifest } from './seven-foot-knoll-lighthouse/config.js';
import { OSM_WAYS as lm_seven_foot_knoll_lighthouseWays } from './seven-foot-knoll-lighthouse/footprint.js';
import { create as lm_seven_foot_knoll_lighthouseCreate } from './seven-foot-knoll-lighthouse/geometry.js';
import { VIEWS as lm_seven_foot_knoll_lighthouseViews } from './seven-foot-knoll-lighthouse/views.js';
import { MANIFEST as lm_shrine_of_the_bookManifest } from './shrine-of-the-book/config.js';
import { OSM_WAYS as lm_shrine_of_the_bookWays } from './shrine-of-the-book/footprint.js';
import { create as lm_shrine_of_the_bookCreate } from './shrine-of-the-book/geometry.js';
import { VIEWS as lm_shrine_of_the_bookViews } from './shrine-of-the-book/views.js';
import { MANIFEST as lm_siegestor_munichManifest } from './siegestor-munich/config.js';
import { OSM_WAYS as lm_siegestor_munichWays } from './siegestor-munich/footprint.js';
import { create as lm_siegestor_munichCreate } from './siegestor-munich/geometry.js';
import { VIEWS as lm_siegestor_munichViews } from './siegestor-munich/views.js';
import { MANIFEST as lm_skytower_bucharestManifest } from './skytower-bucharest/config.js';
import { OSM_WAYS as lm_skytower_bucharestWays } from './skytower-bucharest/footprint.js';
import { create as lm_skytower_bucharestCreate } from './skytower-bucharest/geometry.js';
import { VIEWS as lm_skytower_bucharestViews } from './skytower-bucharest/views.js';
import { MANIFEST as lm_spire_of_dublinManifest } from './spire-of-dublin/config.js';
import { OSM_WAYS as lm_spire_of_dublinWays } from './spire-of-dublin/footprint.js';
import { create as lm_spire_of_dublinCreate } from './spire-of-dublin/geometry.js';
import { VIEWS as lm_spire_of_dublinViews } from './spire-of-dublin/views.js';
import { MANIFEST as lm_st_louis_union_stationManifest } from './st-louis-union-station/config.js';
import { OSM_WAYS as lm_st_louis_union_stationWays } from './st-louis-union-station/footprint.js';
import { create as lm_st_louis_union_stationCreate } from './st-louis-union-station/geometry.js';
import { VIEWS as lm_st_louis_union_stationViews } from './st-louis-union-station/views.js';
import { MANIFEST as lm_st_michaels_church_clujManifest } from './st-michaels-church-cluj/config.js';
import { OSM_WAYS as lm_st_michaels_church_clujWays } from './st-michaels-church-cluj/footprint.js';
import { create as lm_st_michaels_church_clujCreate } from './st-michaels-church-cluj/geometry.js';
import { VIEWS as lm_st_michaels_church_clujViews } from './st-michaels-church-cluj/views.js';
import { MANIFEST as lm_stade_des_alpesManifest } from './stade-des-alpes/config.js';
import { OSM_WAYS as lm_stade_des_alpesWays } from './stade-des-alpes/footprint.js';
import { create as lm_stade_des_alpesCreate } from './stade-des-alpes/geometry.js';
import { VIEWS as lm_stade_des_alpesViews } from './stade-des-alpes/views.js';
import { MANIFEST as lm_stade_mayol_toulonManifest } from './stade-mayol-toulon/config.js';
import { OSM_WAYS as lm_stade_mayol_toulonWays } from './stade-mayol-toulon/footprint.js';
import { create as lm_stade_mayol_toulonCreate } from './stade-mayol-toulon/geometry.js';
import { VIEWS as lm_stade_mayol_toulonViews } from './stade-mayol-toulon/views.js';
import { MANIFEST as lm_stade_pierre_mauroyManifest } from './stade-pierre-mauroy/config.js';
import { OSM_WAYS as lm_stade_pierre_mauroyWays } from './stade-pierre-mauroy/footprint.js';
import { create as lm_stade_pierre_mauroyCreate } from './stade-pierre-mauroy/geometry.js';
import { VIEWS as lm_stade_pierre_mauroyViews } from './stade-pierre-mauroy/views.js';
import { MANIFEST as lm_stockholm_city_hallManifest } from './stockholm-city-hall/config.js';
import { OSM_WAYS as lm_stockholm_city_hallWays } from './stockholm-city-hall/footprint.js';
import { create as lm_stockholm_city_hallCreate } from './stockholm-city-hall/geometry.js';
import { VIEWS as lm_stockholm_city_hallViews } from './stockholm-city-hall/views.js';
import { MANIFEST as lm_stone_mountain_carillonManifest } from './stone-mountain-carillon/config.js';
import { OSM_WAYS as lm_stone_mountain_carillonWays } from './stone-mountain-carillon/footprint.js';
import { create as lm_stone_mountain_carillonCreate } from './stone-mountain-carillon/geometry.js';
import { VIEWS as lm_stone_mountain_carillonViews } from './stone-mountain-carillon/views.js';
import { MANIFEST as lm_strat_tower_las_vegasManifest } from './strat-tower-las-vegas/config.js';
import { OSM_WAYS as lm_strat_tower_las_vegasWays } from './strat-tower-las-vegas/footprint.js';
import { create as lm_strat_tower_las_vegasCreate } from './strat-tower-las-vegas/geometry.js';
import { VIEWS as lm_strat_tower_las_vegasViews } from './strat-tower-las-vegas/views.js';
import { MANIFEST as lm_stuttgart_hauptbahnhof_towerManifest } from './stuttgart-hauptbahnhof-tower/config.js';
import { OSM_WAYS as lm_stuttgart_hauptbahnhof_towerWays } from './stuttgart-hauptbahnhof-tower/footprint.js';
import { create as lm_stuttgart_hauptbahnhof_towerCreate } from './stuttgart-hauptbahnhof-tower/geometry.js';
import { VIEWS as lm_stuttgart_hauptbahnhof_towerViews } from './stuttgart-hauptbahnhof-tower/views.js';
import { MANIFEST as lm_surrey_city_hallManifest } from './surrey-city-hall/config.js';
import { OSM_WAYS as lm_surrey_city_hallWays } from './surrey-city-hall/footprint.js';
import { create as lm_surrey_city_hallCreate } from './surrey-city-hall/geometry.js';
import { VIEWS as lm_surrey_city_hallViews } from './surrey-city-hall/views.js';
import { MANIFEST as lm_tagblatt_turm_stuttgartManifest } from './tagblatt-turm-stuttgart/config.js';
import { OSM_WAYS as lm_tagblatt_turm_stuttgartWays } from './tagblatt-turm-stuttgart/footprint.js';
import { create as lm_tagblatt_turm_stuttgartCreate } from './tagblatt-turm-stuttgart/geometry.js';
import { VIEWS as lm_tagblatt_turm_stuttgartViews } from './tagblatt-turm-stuttgart/views.js';
import { MANIFEST as lm_tate_modernManifest } from './tate-modern/config.js';
import { OSM_WAYS as lm_tate_modernWays } from './tate-modern/footprint.js';
import { create as lm_tate_modernCreate } from './tate-modern/geometry.js';
import { VIEWS as lm_tate_modernViews } from './tate-modern/views.js';
import { MANIFEST as lm_tbilisi_tv_towerManifest } from './tbilisi-tv-tower/config.js';
import { OSM_WAYS as lm_tbilisi_tv_towerWays } from './tbilisi-tv-tower/footprint.js';
import { create as lm_tbilisi_tv_towerCreate } from './tbilisi-tv-tower/geometry.js';
import { VIEWS as lm_tbilisi_tv_towerViews } from './tbilisi-tv-tower/views.js';
import { MANIFEST as lm_temple_saint_martin_montbeliardManifest } from './temple-saint-martin-montbeliard/config.js';
import { OSM_WAYS as lm_temple_saint_martin_montbeliardWays } from './temple-saint-martin-montbeliard/footprint.js';
import { create as lm_temple_saint_martin_montbeliardCreate } from './temple-saint-martin-montbeliard/geometry.js';
import { VIEWS as lm_temple_saint_martin_montbeliardViews } from './temple-saint-martin-montbeliard/views.js';
import { MANIFEST as lm_texas_star_ferris_wheelManifest } from './texas-star-ferris-wheel/config.js';
import { OSM_WAYS as lm_texas_star_ferris_wheelWays } from './texas-star-ferris-wheel/footprint.js';
import { create as lm_texas_star_ferris_wheelCreate } from './texas-star-ferris-wheel/geometry.js';
import { VIEWS as lm_texas_star_ferris_wheelViews } from './texas-star-ferris-wheel/views.js';
import { MANIFEST as lm_the_o2_londonManifest } from './the-o2-london/config.js';
import { OSM_WAYS as lm_the_o2_londonWays } from './the-o2-london/footprint.js';
import { create as lm_the_o2_londonCreate } from './the-o2-london/geometry.js';
import { VIEWS as lm_the_o2_londonViews } from './the-o2-london/views.js';
import { MANIFEST as lm_the_rock_amsterdamManifest } from './the-rock-amsterdam/config.js';
import { OSM_WAYS as lm_the_rock_amsterdamWays } from './the-rock-amsterdam/footprint.js';
import { create as lm_the_rock_amsterdamCreate } from './the-rock-amsterdam/geometry.js';
import { VIEWS as lm_the_rock_amsterdamViews } from './the-rock-amsterdam/views.js';
import { MANIFEST as lm_toronto_ontario_temple_bramptonManifest } from './toronto-ontario-temple-brampton/config.js';
import { OSM_WAYS as lm_toronto_ontario_temple_bramptonWays } from './toronto-ontario-temple-brampton/footprint.js';
import { create as lm_toronto_ontario_temple_bramptonCreate } from './toronto-ontario-temple-brampton/geometry.js';
import { VIEWS as lm_toronto_ontario_temple_bramptonViews } from './toronto-ontario-temple-brampton/views.js';
import { MANIFEST as lm_torre_caliManifest } from './torre-cali/config.js';
import { OSM_WAYS as lm_torre_caliWays } from './torre-cali/footprint.js';
import { create as lm_torre_caliCreate } from './torre-cali/geometry.js';
import { VIEWS as lm_torre_caliViews } from './torre-cali/views.js';
import { MANIFEST as lm_torre_reloj_cartagenaManifest } from './torre-reloj-cartagena/config.js';
import { OSM_WAYS as lm_torre_reloj_cartagenaWays } from './torre-reloj-cartagena/footprint.js';
import { create as lm_torre_reloj_cartagenaCreate } from './torre-reloj-cartagena/geometry.js';
import { VIEWS as lm_torre_reloj_cartagenaViews } from './torre-reloj-cartagena/views.js';
import { MANIFEST as lm_torres_paseo_colonManifest } from './torres-paseo-colon/config.js';
import { OSM_WAYS as lm_torres_paseo_colonWays } from './torres-paseo-colon/footprint.js';
import { create as lm_torres_paseo_colonCreate } from './torres-paseo-colon/geometry.js';
import { VIEWS as lm_torres_paseo_colonViews } from './torres-paseo-colon/views.js';
import { MANIFEST as lm_torrespanaManifest } from './torrespana/config.js';
import { OSM_WAYS as lm_torrespanaWays } from './torrespana/footprint.js';
import { create as lm_torrespanaCreate } from './torrespana/geometry.js';
import { VIEWS as lm_torrespanaViews } from './torrespana/views.js';
import { MANIFEST as lm_tour_altoManifest } from './tour-alto/config.js';
import { OSM_WAYS as lm_tour_altoWays } from './tour-alto/footprint.js';
import { create as lm_tour_altoCreate } from './tour-alto/geometry.js';
import { VIEWS as lm_tour_altoViews } from './tour-alto/views.js';
import { MANIFEST as lm_tour_bretagne_nantesManifest } from './tour-bretagne-nantes/config.js';
import { OSM_WAYS as lm_tour_bretagne_nantesWays } from './tour-bretagne-nantes/footprint.js';
import { create as lm_tour_bretagne_nantesCreate } from './tour-bretagne-nantes/geometry.js';
import { VIEWS as lm_tour_bretagne_nantesViews } from './tour-bretagne-nantes/views.js';
import { MANIFEST as lm_tour_carpe_diemManifest } from './tour-carpe-diem/config.js';
import { OSM_WAYS as lm_tour_carpe_diemWays } from './tour-carpe-diem/footprint.js';
import { create as lm_tour_carpe_diemCreate } from './tour-carpe-diem/geometry.js';
import { VIEWS as lm_tour_carpe_diemViews } from './tour-carpe-diem/views.js';
import { MANIFEST as lm_tour_cma_cgmManifest } from './tour-cma-cgm/config.js';
import { OSM_WAYS as lm_tour_cma_cgmWays } from './tour-cma-cgm/footprint.js';
import { create as lm_tour_cma_cgmCreate } from './tour-cma-cgm/geometry.js';
import { VIEWS as lm_tour_cma_cgmViews } from './tour-cma-cgm/views.js';
import { MANIFEST as lm_tour_d2Manifest } from './tour-d2/config.js';
import { OSM_WAYS as lm_tour_d2Ways } from './tour-d2/footprint.js';
import { create as lm_tour_d2Create } from './tour-d2/geometry.js';
import { VIEWS as lm_tour_d2Views } from './tour-d2/views.js';
import { MANIFEST as lm_tour_de_la_miotteManifest } from './tour-de-la-miotte/config.js';
import { OSM_WAYS as lm_tour_de_la_miotteWays } from './tour-de-la-miotte/footprint.js';
import { create as lm_tour_de_la_miotteCreate } from './tour-de-la-miotte/geometry.js';
import { VIEWS as lm_tour_de_la_miotteViews } from './tour-de-la-miotte/views.js';
import { MANIFEST as lm_tour_de_leurope_mulhouseManifest } from './tour-de-leurope-mulhouse/config.js';
import { OSM_WAYS as lm_tour_de_leurope_mulhouseWays } from './tour-de-leurope-mulhouse/footprint.js';
import { create as lm_tour_de_leurope_mulhouseCreate } from './tour-de-leurope-mulhouse/geometry.js';
import { VIEWS as lm_tour_de_leurope_mulhouseViews } from './tour-de-leurope-mulhouse/views.js';
import { MANIFEST as lm_tour_de_lilleManifest } from './tour-de-lille/config.js';
import { OSM_WAYS as lm_tour_de_lilleWays } from './tour-de-lille/footprint.js';
import { create as lm_tour_de_lilleCreate } from './tour-de-lille/geometry.js';
import { VIEWS as lm_tour_de_lilleViews } from './tour-de-lille/views.js';
import { MANIFEST as lm_tour_des_archives_rouenManifest } from './tour-des-archives-rouen/config.js';
import { OSM_WAYS as lm_tour_des_archives_rouenWays } from './tour-des-archives-rouen/footprint.js';
import { create as lm_tour_des_archives_rouenCreate } from './tour-des-archives-rouen/geometry.js';
import { VIEWS as lm_tour_des_archives_rouenViews } from './tour-des-archives-rouen/views.js';
import { MANIFEST as lm_tour_du_midiManifest } from './tour-du-midi/config.js';
import { OSM_WAYS as lm_tour_du_midiWays } from './tour-du-midi/footprint.js';
import { create as lm_tour_du_midiCreate } from './tour-du-midi/geometry.js';
import { VIEWS as lm_tour_du_midiViews } from './tour-du-midi/views.js';
import { MANIFEST as lm_tour_elithis_dijonManifest } from './tour-elithis-dijon/config.js';
import { OSM_WAYS as lm_tour_elithis_dijonWays } from './tour-elithis-dijon/footprint.js';
import { create as lm_tour_elithis_dijonCreate } from './tour-elithis-dijon/geometry.js';
import { VIEWS as lm_tour_elithis_dijonViews } from './tour-elithis-dijon/views.js';
import { MANIFEST as lm_tour_firstManifest } from './tour-first/config.js';
import { OSM_WAYS as lm_tour_firstWays } from './tour-first/footprint.js';
import { create as lm_tour_firstCreate } from './tour-first/geometry.js';
import { VIEWS as lm_tour_firstViews } from './tour-first/views.js';
import { MANIFEST as lm_tour_la_marseillaiseManifest } from './tour-la-marseillaise/config.js';
import { OSM_WAYS as lm_tour_la_marseillaiseWays } from './tour-la-marseillaise/footprint.js';
import { create as lm_tour_la_marseillaiseCreate } from './tour-la-marseillaise/geometry.js';
import { VIEWS as lm_tour_la_marseillaiseViews } from './tour-la-marseillaise/views.js';
import { MANIFEST as lm_tour_lanterne_rochelleManifest } from './tour-lanterne-rochelle/config.js';
import { OSM_WAYS as lm_tour_lanterne_rochelleWays } from './tour-lanterne-rochelle/footprint.js';
import { create as lm_tour_lanterne_rochelleCreate } from './tour-lanterne-rochelle/geometry.js';
import { VIEWS as lm_tour_lanterne_rochelleViews } from './tour-lanterne-rochelle/views.js';
import { MANIFEST as lm_tour_lu_nantesManifest } from './tour-lu-nantes/config.js';
import { OSM_WAYS as lm_tour_lu_nantesWays } from './tour-lu-nantes/footprint.js';
import { create as lm_tour_lu_nantesCreate } from './tour-lu-nantes/geometry.js';
import { VIEWS as lm_tour_lu_nantesViews } from './tour-lu-nantes/views.js';
import { MANIFEST as lm_tour_metallique_fourviereManifest } from './tour-metallique-fourviere/config.js';
import { OSM_WAYS as lm_tour_metallique_fourviereWays } from './tour-metallique-fourviere/footprint.js';
import { create as lm_tour_metallique_fourviereCreate } from './tour-metallique-fourviere/geometry.js';
import { VIEWS as lm_tour_metallique_fourviereViews } from './tour-metallique-fourviere/views.js';
import { MANIFEST as lm_tour_oxygeneManifest } from './tour-oxygene/config.js';
import { OSM_WAYS as lm_tour_oxygeneWays } from './tour-oxygene/footprint.js';
import { create as lm_tour_oxygeneCreate } from './tour-oxygene/geometry.js';
import { VIEWS as lm_tour_oxygeneViews } from './tour-oxygene/views.js';
import { MANIFEST as lm_tour_paradis_liegeManifest } from './tour-paradis-liege/config.js';
import { OSM_WAYS as lm_tour_paradis_liegeWays } from './tour-paradis-liege/footprint.js';
import { create as lm_tour_paradis_liegeCreate } from './tour-paradis-liege/geometry.js';
import { VIEWS as lm_tour_paradis_liegeViews } from './tour-paradis-liege/views.js';
import { MANIFEST as lm_tour_perret_grenobleManifest } from './tour-perret-grenoble/config.js';
import { OSM_WAYS as lm_tour_perret_grenobleWays } from './tour-perret-grenoble/footprint.js';
import { create as lm_tour_perret_grenobleCreate } from './tour-perret-grenoble/geometry.js';
import { VIEWS as lm_tour_perret_grenobleViews } from './tour-perret-grenoble/views.js';
import { MANIFEST as lm_tour_pey_berlandManifest } from './tour-pey-berland/config.js';
import { OSM_WAYS as lm_tour_pey_berlandWays } from './tour-pey-berland/footprint.js';
import { create as lm_tour_pey_berlandCreate } from './tour-pey-berland/geometry.js';
import { VIEWS as lm_tour_pey_berlandViews } from './tour-pey-berland/views.js';
import { MANIFEST as lm_tour_royale_toulonManifest } from './tour-royale-toulon/config.js';
import { OSM_WAYS as lm_tour_royale_toulonWays } from './tour-royale-toulon/footprint.js';
import { create as lm_tour_royale_toulonCreate } from './tour-royale-toulon/geometry.js';
import { VIEWS as lm_tour_royale_toulonViews } from './tour-royale-toulon/views.js';
import { MANIFEST as lm_tour_saint_aubin_angersManifest } from './tour-saint-aubin-angers/config.js';
import { OSM_WAYS as lm_tour_saint_aubin_angersWays } from './tour-saint-aubin-angers/footprint.js';
import { create as lm_tour_saint_aubin_angersCreate } from './tour-saint-aubin-angers/geometry.js';
import { VIEWS as lm_tour_saint_aubin_angersViews } from './tour-saint-aubin-angers/views.js';
import { MANIFEST as lm_tour_saint_gobainManifest } from './tour-saint-gobain/config.js';
import { OSM_WAYS as lm_tour_saint_gobainWays } from './tour-saint-gobain/footprint.js';
import { create as lm_tour_saint_gobainCreate } from './tour-saint-gobain/geometry.js';
import { VIEWS as lm_tour_saint_gobainViews } from './tour-saint-gobain/views.js';
import { MANIFEST as lm_tour_saint_nicolas_rochelleManifest } from './tour-saint-nicolas-rochelle/config.js';
import { OSM_WAYS as lm_tour_saint_nicolas_rochelleWays } from './tour-saint-nicolas-rochelle/footprint.js';
import { create as lm_tour_saint_nicolas_rochelleCreate } from './tour-saint-nicolas-rochelle/geometry.js';
import { VIEWS as lm_tour_saint_nicolas_rochelleViews } from './tour-saint-nicolas-rochelle/views.js';
import { MANIFEST as lm_tour_t1Manifest } from './tour-t1/config.js';
import { OSM_WAYS as lm_tour_t1Ways } from './tour-t1/footprint.js';
import { create as lm_tour_t1Create } from './tour-t1/geometry.js';
import { VIEWS as lm_tour_t1Views } from './tour-t1/views.js';
import { MANIFEST as lm_tour_total_coupoleManifest } from './tour-total-coupole/config.js';
import { OSM_WAYS as lm_tour_total_coupoleWays } from './tour-total-coupole/footprint.js';
import { create as lm_tour_total_coupoleCreate } from './tour-total-coupole/geometry.js';
import { VIEWS as lm_tour_total_coupoleViews } from './tour-total-coupole/views.js';
import { MANIFEST as lm_tour_trinityManifest } from './tour-trinity/config.js';
import { OSM_WAYS as lm_tour_trinityWays } from './tour-trinity/footprint.js';
import { create as lm_tour_trinityCreate } from './tour-trinity/geometry.js';
import { VIEWS as lm_tour_trinityViews } from './tour-trinity/views.js';
import { MANIFEST as lm_tovrea_castleManifest } from './tovrea-castle/config.js';
import { OSM_WAYS as lm_tovrea_castleWays } from './tovrea-castle/footprint.js';
import { create as lm_tovrea_castleCreate } from './tovrea-castle/geometry.js';
import { VIEWS as lm_tovrea_castleViews } from './tovrea-castle/views.js';
import { MANIFEST as lm_trethewey_houseManifest } from './trethewey-house/config.js';
import { OSM_WAYS as lm_trethewey_houseWays } from './trethewey-house/footprint.js';
import { create as lm_trethewey_houseCreate } from './trethewey-house/geometry.js';
import { VIEWS as lm_trethewey_houseViews } from './trethewey-house/views.js';
import { MANIFEST as lm_tribunal_de_parisManifest } from './tribunal-de-paris/config.js';
import { OSM_WAYS as lm_tribunal_de_parisWays } from './tribunal-de-paris/footprint.js';
import { create as lm_tribunal_de_parisCreate } from './tribunal-de-paris/geometry.js';
import { VIEWS as lm_tribunal_de_parisViews } from './tribunal-de-paris/views.js';
import { MANIFEST as lm_tustin_south_hangarManifest } from './tustin-south-hangar/config.js';
import { OSM_WAYS as lm_tustin_south_hangarWays } from './tustin-south-hangar/footprint.js';
import { create as lm_tustin_south_hangarCreate } from './tustin-south-hangar/geometry.js';
import { VIEWS as lm_tustin_south_hangarViews } from './tustin-south-hangar/views.js';
import { MANIFEST as lm_ucr_bell_towerManifest } from './ucr-bell-tower/config.js';
import { OSM_WAYS as lm_ucr_bell_towerWays } from './ucr-bell-tower/footprint.js';
import { create as lm_ucr_bell_towerCreate } from './ucr-bell-tower/geometry.js';
import { VIEWS as lm_ucr_bell_towerViews } from './ucr-bell-tower/views.js';
import { MANIFEST as lm_uga_archManifest } from './uga-arch/config.js';
import { OSM_WAYS as lm_uga_archWays } from './uga-arch/footprint.js';
import { create as lm_uga_archCreate } from './uga-arch/geometry.js';
import { VIEWS as lm_uga_archViews } from './uga-arch/views.js';
import { MANIFEST as lm_vinoly_tower_amsterdamManifest } from './vinoly-tower-amsterdam/config.js';
import { OSM_WAYS as lm_vinoly_tower_amsterdamWays } from './vinoly-tower-amsterdam/footprint.js';
import { create as lm_vinoly_tower_amsterdamCreate } from './vinoly-tower-amsterdam/geometry.js';
import { VIEWS as lm_vinoly_tower_amsterdamViews } from './vinoly-tower-amsterdam/views.js';
import { MANIFEST as lm_walter_reed_tower_bethesdaManifest } from './walter-reed-tower-bethesda/config.js';
import { OSM_WAYS as lm_walter_reed_tower_bethesdaWays } from './walter-reed-tower-bethesda/footprint.js';
import { create as lm_walter_reed_tower_bethesdaCreate } from './walter-reed-tower-bethesda/geometry.js';
import { VIEWS as lm_walter_reed_tower_bethesdaViews } from './walter-reed-tower-bethesda/views.js';
import { MANIFEST as lm_walton_historic_courthouseManifest } from './walton-historic-courthouse/config.js';
import { OSM_WAYS as lm_walton_historic_courthouseWays } from './walton-historic-courthouse/footprint.js';
import { create as lm_walton_historic_courthouseCreate } from './walton-historic-courthouse/geometry.js';
import { VIEWS as lm_walton_historic_courthouseViews } from './walton-historic-courthouse/views.js';
import { MANIFEST as lm_will_rogers_memorial_centerManifest } from './will-rogers-memorial-center/config.js';
import { OSM_WAYS as lm_will_rogers_memorial_centerWays } from './will-rogers-memorial-center/footprint.js';
import { create as lm_will_rogers_memorial_centerCreate } from './will-rogers-memorial-center/geometry.js';
import { VIEWS as lm_will_rogers_memorial_centerViews } from './will-rogers-memorial-center/views.js';
import { MANIFEST as lm_winspear_opera_houseManifest } from './winspear-opera-house/config.js';
import { OSM_WAYS as lm_winspear_opera_houseWays } from './winspear-opera-house/footprint.js';
import { create as lm_winspear_opera_houseCreate } from './winspear-opera-house/geometry.js';
import { VIEWS as lm_winspear_opera_houseViews } from './winspear-opera-house/views.js';
import { MANIFEST as lm_ziggo_domeManifest } from './ziggo-dome/config.js';
import { OSM_WAYS as lm_ziggo_domeWays } from './ziggo-dome/footprint.js';
import { create as lm_ziggo_domeCreate } from './ziggo-dome/geometry.js';
import { VIEWS as lm_ziggo_domeViews } from './ziggo-dome/views.js';
import { MANIFEST as lm_ziggurat_west_sacramentoManifest } from './ziggurat-west-sacramento/config.js';
import { OSM_WAYS as lm_ziggurat_west_sacramentoWays } from './ziggurat-west-sacramento/footprint.js';
import { create as lm_ziggurat_west_sacramentoCreate } from './ziggurat-west-sacramento/geometry.js';
import { VIEWS as lm_ziggurat_west_sacramentoViews } from './ziggurat-west-sacramento/views.js';

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
  'lions-gate-bridge': { manifest: lm_lions_gate_bridgeManifest, osmWays: lm_lions_gate_bridgeWays, create: lm_lions_gate_bridgeCreate, views: lm_lions_gate_bridgeViews },
  'port-mann-bridge': { manifest: lm_port_mann_bridgeManifest, osmWays: lm_port_mann_bridgeWays, create: lm_port_mann_bridgeCreate, views: lm_port_mann_bridgeViews },
  'burrard-street-bridge': { manifest: lm_burrard_street_bridgeManifest, osmWays: lm_burrard_street_bridgeWays, create: lm_burrard_street_bridgeCreate, views: lm_burrard_street_bridgeViews },
  'canada-place': { manifest: lm_canada_placeManifest, osmWays: lm_canada_placeWays, create: lm_canada_placeCreate, views: lm_canada_placeViews },
  'science-world-vancouver': { manifest: lm_science_world_vancouverManifest, osmWays: lm_science_world_vancouverWays, create: lm_science_world_vancouverCreate, views: lm_science_world_vancouverViews },
  'bc-place': { manifest: lm_bc_placeManifest, osmWays: lm_bc_placeWays, create: lm_bc_placeCreate, views: lm_bc_placeViews },
  'harbour-centre': { manifest: lm_harbour_centreManifest, osmWays: lm_harbour_centreWays, create: lm_harbour_centreCreate, views: lm_harbour_centreViews },
  'vancouver-house': { manifest: lm_vancouver_houseManifest, osmWays: lm_vancouver_houseWays, create: lm_vancouver_houseCreate, views: lm_vancouver_houseViews },
  'bc-parliament-buildings': { manifest: lm_bc_parliament_buildingsManifest, osmWays: lm_bc_parliament_buildingsWays, create: lm_bc_parliament_buildingsCreate, views: lm_bc_parliament_buildingsViews },
  'fairmont-empress': { manifest: lm_fairmont_empressManifest, osmWays: lm_fairmont_empressWays, create: lm_fairmont_empressCreate, views: lm_fairmont_empressViews },
  'alberta-legislature-building': { manifest: lm_alberta_legislature_buildingManifest, osmWays: lm_alberta_legislature_buildingWays, create: lm_alberta_legislature_buildingCreate, views: lm_alberta_legislature_buildingViews },
  'walterdale-bridge': { manifest: lm_walterdale_bridgeManifest, osmWays: lm_walterdale_bridgeWays, create: lm_walterdale_bridgeCreate, views: lm_walterdale_bridgeViews },
  'fairmont-banff-springs': { manifest: lm_fairmont_banff_springsManifest, osmWays: lm_fairmont_banff_springsWays, create: lm_fairmont_banff_springsCreate, views: lm_fairmont_banff_springsViews },
  'canadian-museum-for-human-rights': { manifest: lm_canadian_museum_for_human_rightsManifest, osmWays: lm_canadian_museum_for_human_rightsWays, create: lm_canadian_museum_for_human_rightsCreate, views: lm_canadian_museum_for_human_rightsViews },
  'storseisundet-bridge': { manifest: lm_storseisundet_bridgeManifest, osmWays: lm_storseisundet_bridgeWays, create: lm_storseisundet_bridgeCreate, views: lm_storseisundet_bridgeViews },
  'halogaland-bridge': { manifest: lm_halogaland_bridgeManifest, osmWays: lm_halogaland_bridgeWays, create: lm_halogaland_bridgeCreate, views: lm_halogaland_bridgeViews },
  'hardanger-bridge': { manifest: lm_hardanger_bridgeManifest, osmWays: lm_hardanger_bridgeWays, create: lm_hardanger_bridgeCreate, views: lm_hardanger_bridgeViews },
  'tromso-bridge': { manifest: lm_tromso_bridgeManifest, osmWays: lm_tromso_bridgeWays, create: lm_tromso_bridgeCreate, views: lm_tromso_bridgeViews },
  'helgeland-bridge': { manifest: lm_helgeland_bridgeManifest, osmWays: lm_helgeland_bridgeWays, create: lm_helgeland_bridgeCreate, views: lm_helgeland_bridgeViews },
  'svinesund-bridge': { manifest: lm_svinesund_bridgeManifest, osmWays: lm_svinesund_bridgeWays, create: lm_svinesund_bridgeCreate, views: lm_svinesund_bridgeViews },
  'oslo-opera-house': { manifest: lm_oslo_opera_houseManifest, osmWays: lm_oslo_opera_houseWays, create: lm_oslo_opera_houseCreate, views: lm_oslo_opera_houseViews },
  'oslo-city-hall': { manifest: lm_oslo_city_hallManifest, osmWays: lm_oslo_city_hallWays, create: lm_oslo_city_hallCreate, views: lm_oslo_city_hallViews },
  'royal-palace-oslo': { manifest: lm_royal_palace_osloManifest, osmWays: lm_royal_palace_osloWays, create: lm_royal_palace_osloCreate, views: lm_royal_palace_osloViews },
  'holmenkollbakken': { manifest: lm_holmenkollbakkenManifest, osmWays: lm_holmenkollbakkenWays, create: lm_holmenkollbakkenCreate, views: lm_holmenkollbakkenViews },
  'munch-museum': { manifest: lm_munch_museumManifest, osmWays: lm_munch_museumWays, create: lm_munch_museumCreate, views: lm_munch_museumViews },
  'akershus-fortress': { manifest: lm_akershus_fortressManifest, osmWays: lm_akershus_fortressWays, create: lm_akershus_fortressCreate, views: lm_akershus_fortressViews },
  'astrup-fearnley-museum': { manifest: lm_astrup_fearnley_museumManifest, osmWays: lm_astrup_fearnley_museumWays, create: lm_astrup_fearnley_museumCreate, views: lm_astrup_fearnley_museumViews },
  'bryggen': { manifest: lm_bryggenManifest, osmWays: lm_bryggenWays, create: lm_bryggenCreate, views: lm_bryggenViews },
  'nidaros-cathedral': { manifest: lm_nidaros_cathedralManifest, osmWays: lm_nidaros_cathedralWays, create: lm_nidaros_cathedralCreate, views: lm_nidaros_cathedralViews },
  'arctic-cathedral': { manifest: lm_arctic_cathedralManifest, osmWays: lm_arctic_cathedralWays, create: lm_arctic_cathedralCreate, views: lm_arctic_cathedralViews },
  'norwegian-petroleum-museum': { manifest: lm_norwegian_petroleum_museumManifest, osmWays: lm_norwegian_petroleum_museumWays, create: lm_norwegian_petroleum_museumCreate, views: lm_norwegian_petroleum_museumViews },
  'vikingskipet': { manifest: lm_vikingskipetManifest, osmWays: lm_vikingskipetWays, create: lm_vikingskipetCreate, views: lm_vikingskipetViews },
  'kilden-performing-arts-centre': { manifest: lm_kilden_performing_arts_centreManifest, osmWays: lm_kilden_performing_arts_centreWays, create: lm_kilden_performing_arts_centreCreate, views: lm_kilden_performing_arts_centreViews },
  'borgund-stave-church': { manifest: lm_borgund_stave_churchManifest, osmWays: lm_borgund_stave_churchWays, create: lm_borgund_stave_churchCreate, views: lm_borgund_stave_churchViews },
  'farris-bad': { manifest: lm_farris_badManifest, osmWays: lm_farris_badWays, create: lm_farris_badCreate, views: lm_farris_badViews },
  'pont-neuf-toulouse': { manifest: lm_pont_neuf_toulouseManifest, osmWays: lm_pont_neuf_toulouseWays, create: lm_pont_neuf_toulouseCreate, views: lm_pont_neuf_toulouseViews },
  'pont-des-catalans': { manifest: lm_pont_des_catalansManifest, osmWays: lm_pont_des_catalansWays, create: lm_pont_des_catalansCreate, views: lm_pont_des_catalansViews },
  'viaduc-de-millau': { manifest: lm_viaduc_de_millauManifest, osmWays: lm_viaduc_de_millauWays, create: lm_viaduc_de_millauCreate, views: lm_viaduc_de_millauViews },
  'basilique-saint-sernin': { manifest: lm_basilique_saint_serninManifest, osmWays: lm_basilique_saint_serninWays, create: lm_basilique_saint_serninCreate, views: lm_basilique_saint_serninViews },
  'capitole-de-toulouse': { manifest: lm_capitole_de_toulouseManifest, osmWays: lm_capitole_de_toulouseWays, create: lm_capitole_de_toulouseCreate, views: lm_capitole_de_toulouseViews },
  'dome-de-la-grave': { manifest: lm_dome_de_la_graveManifest, osmWays: lm_dome_de_la_graveWays, create: lm_dome_de_la_graveCreate, views: lm_dome_de_la_graveViews },
  'cite-de-l-espace': { manifest: lm_cite_de_l_espaceManifest, osmWays: lm_cite_de_l_espaceWays, create: lm_cite_de_l_espaceCreate, views: lm_cite_de_l_espaceViews },
  'couvent-des-jacobins': { manifest: lm_couvent_des_jacobinsManifest, osmWays: lm_couvent_des_jacobinsWays, create: lm_couvent_des_jacobinsCreate, views: lm_couvent_des_jacobinsViews },
  'cite-de-carcassonne': { manifest: lm_cite_de_carcassonneManifest, osmWays: lm_cite_de_carcassonneWays, create: lm_cite_de_carcassonneCreate, views: lm_cite_de_carcassonneViews },
  'cathedrale-sainte-cecile-albi': { manifest: lm_cathedrale_sainte_cecile_albiManifest, osmWays: lm_cathedrale_sainte_cecile_albiWays, create: lm_cathedrale_sainte_cecile_albiCreate, views: lm_cathedrale_sainte_cecile_albiViews },
  'pont-saint-pierre': { manifest: lm_pont_saint_pierreManifest, osmWays: lm_pont_saint_pierreWays, create: lm_pont_saint_pierreCreate, views: lm_pont_saint_pierreViews },
  'pont-saint-michel': { manifest: lm_pont_saint_michelManifest, osmWays: lm_pont_saint_michelWays, create: lm_pont_saint_michelCreate, views: lm_pont_saint_michelViews },
  'ponts-jumeaux': { manifest: lm_ponts_jumeauxManifest, osmWays: lm_ponts_jumeauxWays, create: lm_ponts_jumeauxCreate, views: lm_ponts_jumeauxViews },
  'viaduc-de-calix': { manifest: lm_viaduc_de_calixManifest, osmWays: lm_viaduc_de_calixWays, create: lm_viaduc_de_calixCreate, views: lm_viaduc_de_calixViews },
  'pegasus-bridge': { manifest: lm_pegasus_bridgeManifest, osmWays: lm_pegasus_bridgeWays, create: lm_pegasus_bridgeCreate, views: lm_pegasus_bridgeViews },
  'pont-de-la-fonderie': { manifest: lm_pont_de_la_fonderieManifest, osmWays: lm_pont_de_la_fonderieWays, create: lm_pont_de_la_fonderieCreate, views: lm_pont_de_la_fonderieViews },
  'pont-de-normandie': { manifest: lm_pont_de_normandieManifest, osmWays: lm_pont_de_normandieWays, create: lm_pont_de_normandieCreate, views: lm_pont_de_normandieViews },
  'abbaye-aux-hommes': { manifest: lm_abbaye_aux_hommesManifest, osmWays: lm_abbaye_aux_hommesWays, create: lm_abbaye_aux_hommesCreate, views: lm_abbaye_aux_hommesViews },
  'chateau-de-caen': { manifest: lm_chateau_de_caenManifest, osmWays: lm_chateau_de_caenWays, create: lm_chateau_de_caenCreate, views: lm_chateau_de_caenViews },
  'eglise-saint-pierre-caen': { manifest: lm_eglise_saint_pierre_caenManifest, osmWays: lm_eglise_saint_pierre_caenWays, create: lm_eglise_saint_pierre_caenCreate, views: lm_eglise_saint_pierre_caenViews },
  'abbaye-aux-dames': { manifest: lm_abbaye_aux_damesManifest, osmWays: lm_abbaye_aux_damesWays, create: lm_abbaye_aux_damesCreate, views: lm_abbaye_aux_damesViews },
  'memorial-de-caen': { manifest: lm_memorial_de_caenManifest, osmWays: lm_memorial_de_caenWays, create: lm_memorial_de_caenCreate, views: lm_memorial_de_caenViews },
  'cathedrale-de-bayeux': { manifest: lm_cathedrale_de_bayeuxManifest, osmWays: lm_cathedrale_de_bayeuxWays, create: lm_cathedrale_de_bayeuxCreate, views: lm_cathedrale_de_bayeuxViews },
  'georgia-state-capitol': { manifest: lm_georgia_state_capitolManifest, osmWays: lm_georgia_state_capitolWays, create: lm_georgia_state_capitolCreate, views: lm_georgia_state_capitolViews },
  'bank-of-america-plaza-atlanta': { manifest: lm_bank_of_america_plaza_atlantaManifest, osmWays: lm_bank_of_america_plaza_atlantaWays, create: lm_bank_of_america_plaza_atlantaCreate, views: lm_bank_of_america_plaza_atlantaViews },
  'sunshine-skyway-bridge': { manifest: lm_sunshine_skyway_bridgeManifest, osmWays: lm_sunshine_skyway_bridgeWays, create: lm_sunshine_skyway_bridgeCreate, views: lm_sunshine_skyway_bridgeViews },
  'dallas-city-hall': { manifest: lm_dallas_city_hallManifest, osmWays: lm_dallas_city_hallWays, create: lm_dallas_city_hallCreate, views: lm_dallas_city_hallViews },
  'fox-theatre-atlanta': { manifest: lm_fox_theatre_atlantaManifest, osmWays: lm_fox_theatre_atlantaWays, create: lm_fox_theatre_atlantaCreate, views: lm_fox_theatre_atlantaViews },
  'lviv-national-opera': { manifest: lm_lviv_national_operaManifest, osmWays: lm_lviv_national_operaWays, create: lm_lviv_national_operaCreate, views: lm_lviv_national_operaViews },
  'jpmorgan-chase-tower-houston': { manifest: lm_jpmorgan_chase_tower_houstonManifest, osmWays: lm_jpmorgan_chase_tower_houstonWays, create: lm_jpmorgan_chase_tower_houstonCreate, views: lm_jpmorgan_chase_tower_houstonViews },
  'willis-tower': { manifest: lm_willis_towerManifest, osmWays: lm_willis_towerWays, create: lm_willis_towerCreate, views: lm_willis_towerViews },
  'mercedes-benz-stadium': { manifest: lm_mercedes_benz_stadiumManifest, osmWays: lm_mercedes_benz_stadiumWays, create: lm_mercedes_benz_stadiumCreate, views: lm_mercedes_benz_stadiumViews },
  'edificio-de-correos-costa-rica': { manifest: lm_edificio_de_correos_costa_ricaManifest, osmWays: lm_edificio_de_correos_costa_ricaWays, create: lm_edificio_de_correos_costa_ricaCreate, views: lm_edificio_de_correos_costa_ricaViews },
  'helsinki-cathedral': { manifest: lm_helsinki_cathedralManifest, osmWays: lm_helsinki_cathedralWays, create: lm_helsinki_cathedralCreate, views: lm_helsinki_cathedralViews },
  'freedom-tower-miami': { manifest: lm_freedom_tower_miamiManifest, osmWays: lm_freedom_tower_miamiWays, create: lm_freedom_tower_miamiCreate, views: lm_freedom_tower_miamiViews },
  'texas-state-capitol': { manifest: lm_texas_state_capitolManifest, osmWays: lm_texas_state_capitolWays, create: lm_texas_state_capitolCreate, views: lm_texas_state_capitolViews },
  'ohio-statehouse': { manifest: lm_ohio_statehouseManifest, osmWays: lm_ohio_statehouseWays, create: lm_ohio_statehouseCreate, views: lm_ohio_statehouseViews },
  'royal-palace-amsterdam': { manifest: lm_royal_palace_amsterdamManifest, osmWays: lm_royal_palace_amsterdamWays, create: lm_royal_palace_amsterdamCreate, views: lm_royal_palace_amsterdamViews },
  'vulcan-statue': { manifest: lm_vulcan_statueManifest, osmWays: lm_vulcan_statueWays, create: lm_vulcan_statueCreate, views: lm_vulcan_statueViews },
  'griffith-observatory': { manifest: lm_griffith_observatoryManifest, osmWays: lm_griffith_observatoryWays, create: lm_griffith_observatoryCreate, views: lm_griffith_observatoryViews },
  'mercedes-benz-museum': { manifest: lm_mercedes_benz_museumManifest, osmWays: lm_mercedes_benz_museumWays, create: lm_mercedes_benz_museumCreate, views: lm_mercedes_benz_museumViews },
  'notre-dame-de-la-garde': { manifest: lm_notre_dame_de_la_gardeManifest, osmWays: lm_notre_dame_de_la_gardeWays, create: lm_notre_dame_de_la_gardeCreate, views: lm_notre_dame_de_la_gardeViews },
  'att-stadium': { manifest: lm_att_stadiumManifest, osmWays: lm_att_stadiumWays, create: lm_att_stadiumCreate, views: lm_att_stadiumViews },
  'golden-ears-bridge': { manifest: lm_golden_ears_bridgeManifest, osmWays: lm_golden_ears_bridgeWays, create: lm_golden_ears_bridgeCreate, views: lm_golden_ears_bridgeViews },
  'westin-peachtree-plaza': { manifest: lm_westin_peachtree_plazaManifest, osmWays: lm_westin_peachtree_plazaWays, create: lm_westin_peachtree_plazaCreate, views: lm_westin_peachtree_plazaViews },
  'ponte-25-de-abril': { manifest: lm_ponte_25_de_abrilManifest, osmWays: lm_ponte_25_de_abrilWays, create: lm_ponte_25_de_abrilCreate, views: lm_ponte_25_de_abrilViews },
  'white-house': { manifest: lm_white_houseManifest, osmWays: lm_white_houseWays, create: lm_white_houseCreate, views: lm_white_houseViews },
  'westerkerk': { manifest: lm_westerkerkManifest, osmWays: lm_westerkerkWays, create: lm_westerkerkCreate, views: lm_westerkerkViews },
  'cologne-cathedral': { manifest: lm_cologne_cathedralManifest, osmWays: lm_cologne_cathedralWays, create: lm_cologne_cathedralCreate, views: lm_cologne_cathedralViews },
  'london-eye': { manifest: lm_london_eyeManifest, osmWays: lm_london_eyeWays, create: lm_london_eyeCreate, views: lm_london_eyeViews },
  'fred-hartman-bridge': { manifest: lm_fred_hartman_bridgeManifest, osmWays: lm_fred_hartman_bridgeWays, create: lm_fred_hartman_bridgeCreate, views: lm_fred_hartman_bridgeViews },
  'peoples-salvation-cathedral': { manifest: lm_peoples_salvation_cathedralManifest, osmWays: lm_peoples_salvation_cathedralWays, create: lm_peoples_salvation_cathedralCreate, views: lm_peoples_salvation_cathedralViews },
  'pitt-river-bridge': { manifest: lm_pitt_river_bridgeManifest, osmWays: lm_pitt_river_bridgeWays, create: lm_pitt_river_bridgeCreate, views: lm_pitt_river_bridgeViews },
  'museo-nacional-de-costa-rica': { manifest: lm_museo_nacional_de_costa_ricaManifest, osmWays: lm_museo_nacional_de_costa_ricaWays, create: lm_museo_nacional_de_costa_ricaCreate, views: lm_museo_nacional_de_costa_ricaViews },
  'los-angeles-city-hall': { manifest: lm_los_angeles_city_hallManifest, osmWays: lm_los_angeles_city_hallWays, create: lm_los_angeles_city_hallCreate, views: lm_los_angeles_city_hallViews },
  'palacio-de-cibeles': { manifest: lm_palacio_de_cibelesManifest, osmWays: lm_palacio_de_cibelesWays, create: lm_palacio_de_cibelesCreate, views: lm_palacio_de_cibelesViews },
  'alex-fraser-bridge': { manifest: lm_alex_fraser_bridgeManifest, osmWays: lm_alex_fraser_bridgeWays, create: lm_alex_fraser_bridgeCreate, views: lm_alex_fraser_bridgeViews },
  'the-alamo': { manifest: lm_the_alamoManifest, osmWays: lm_the_alamoWays, create: lm_the_alamoCreate, views: lm_the_alamoViews },
  'skyview-atlanta': { manifest: lm_skyview_atlantaManifest, osmWays: lm_skyview_atlantaWays, create: lm_skyview_atlantaCreate, views: lm_skyview_atlantaViews },
  'frauenkirche-munich': { manifest: lm_frauenkirche_munichManifest, osmWays: lm_frauenkirche_munichWays, create: lm_frauenkirche_munichCreate, views: lm_frauenkirche_munichViews },
  'the-wheel-icon-park': { manifest: lm_the_wheel_icon_parkManifest, osmWays: lm_the_wheel_icon_parkWays, create: lm_the_wheel_icon_parkCreate, views: lm_the_wheel_icon_parkViews },
  'washington-dc-temple': { manifest: lm_washington_dc_templeManifest, osmWays: lm_washington_dc_templeWays, create: lm_washington_dc_templeCreate, views: lm_washington_dc_templeViews },
  'ironworkers-memorial-bridge': { manifest: lm_ironworkers_memorial_bridgeManifest, osmWays: lm_ironworkers_memorial_bridgeWays, create: lm_ironworkers_memorial_bridgeCreate, views: lm_ironworkers_memorial_bridgeViews },
  'magere-brug': { manifest: lm_magere_brugManifest, osmWays: lm_magere_brugWays, create: lm_magere_brugCreate, views: lm_magere_brugViews },
  'tower-of-london': { manifest: lm_tower_of_londonManifest, osmWays: lm_tower_of_londonWays, create: lm_tower_of_londonCreate, views: lm_tower_of_londonViews },
  'fountain-place': { manifest: lm_fountain_placeManifest, osmWays: lm_fountain_placeWays, create: lm_fountain_placeCreate, views: lm_fountain_placeViews },
  'motherland-monument': { manifest: lm_motherland_monumentManifest, osmWays: lm_motherland_monumentWays, create: lm_motherland_monumentCreate, views: lm_motherland_monumentViews },
  'vincent-thomas-bridge': { manifest: lm_vincent_thomas_bridgeManifest, osmWays: lm_vincent_thomas_bridgeWays, create: lm_vincent_thomas_bridgeCreate, views: lm_vincent_thomas_bridgeViews },
  'marine-building': { manifest: lm_marine_buildingManifest, osmWays: lm_marine_buildingWays, create: lm_marine_buildingCreate, views: lm_marine_buildingViews },
  'basilica-de-los-angeles-cartago': { manifest: lm_basilica_de_los_angeles_cartagoManifest, osmWays: lm_basilica_de_los_angeles_cartagoWays, create: lm_basilica_de_los_angeles_cartagoCreate, views: lm_basilica_de_los_angeles_cartagoViews },
  'edificio-metropolis': { manifest: lm_edificio_metropolisManifest, osmWays: lm_edificio_metropolisWays, create: lm_edificio_metropolisCreate, views: lm_edificio_metropolisViews },
  'high-museum-of-art': { manifest: lm_high_museum_of_artManifest, osmWays: lm_high_museum_of_artWays, create: lm_high_museum_of_artCreate, views: lm_high_museum_of_artViews },
  'williams-tower': { manifest: lm_williams_towerManifest, osmWays: lm_williams_towerWays, create: lm_williams_towerCreate, views: lm_williams_towerViews },
  'basarab-overpass': { manifest: lm_basarab_overpassManifest, osmWays: lm_basarab_overpassWays, create: lm_basarab_overpassCreate, views: lm_basarab_overpassViews },
  'john-hancock-center': { manifest: lm_john_hancock_centerManifest, osmWays: lm_john_hancock_centerWays, create: lm_john_hancock_centerCreate, views: lm_john_hancock_centerViews },
  'att-building-nashville': { manifest: lm_att_building_nashvilleManifest, osmWays: lm_att_building_nashvilleWays, create: lm_att_building_nashvilleCreate, views: lm_att_building_nashvilleViews },
  'granville-street-bridge': { manifest: lm_granville_street_bridgeManifest, osmWays: lm_granville_street_bridgeWays, create: lm_granville_street_bridgeCreate, views: lm_granville_street_bridgeViews },
  'jefferson-memorial': { manifest: lm_jefferson_memorialManifest, osmWays: lm_jefferson_memorialWays, create: lm_jefferson_memorialCreate, views: lm_jefferson_memorialViews },
  'adam-toren': { manifest: lm_adam_torenManifest, osmWays: lm_adam_torenWays, create: lm_adam_torenCreate, views: lm_adam_torenViews },
  'buckingham-palace': { manifest: lm_buckingham_palaceManifest, osmWays: lm_buckingham_palaceWays, create: lm_buckingham_palaceCreate, views: lm_buckingham_palaceViews },
  'samuel-beckett-bridge': { manifest: lm_samuel_beckett_bridgeManifest, osmWays: lm_samuel_beckett_bridgeWays, create: lm_samuel_beckett_bridgeCreate, views: lm_samuel_beckett_bridgeViews },
  'fairmont-hotel-vancouver': { manifest: lm_fairmont_hotel_vancouverManifest, osmWays: lm_fairmont_hotel_vancouverWays, create: lm_fairmont_hotel_vancouverCreate, views: lm_fairmont_hotel_vancouverViews },
  'pennybacker-bridge': { manifest: lm_pennybacker_bridgeManifest, osmWays: lm_pennybacker_bridgeWays, create: lm_pennybacker_bridgeCreate, views: lm_pennybacker_bridgeViews },
  'walt-disney-concert-hall': { manifest: lm_walt_disney_concert_hallManifest, osmWays: lm_walt_disney_concert_hallWays, create: lm_walt_disney_concert_hallCreate, views: lm_walt_disney_concert_hallViews },
  'one-atlantic-center': { manifest: lm_one_atlantic_centerManifest, osmWays: lm_one_atlantic_centerWays, create: lm_one_atlantic_centerCreate, views: lm_one_atlantic_centerViews },
  'cambie-bridge': { manifest: lm_cambie_bridgeManifest, osmWays: lm_cambie_bridgeWays, create: lm_cambie_bridgeCreate, views: lm_cambie_bridgeViews },
  'estadio-nacional-costa-rica': { manifest: lm_estadio_nacional_costa_ricaManifest, osmWays: lm_estadio_nacional_costa_ricaWays, create: lm_estadio_nacional_costa_ricaCreate, views: lm_estadio_nacional_costa_ricaViews },
  'uspenski-cathedral': { manifest: lm_uspenski_cathedralManifest, osmWays: lm_uspenski_cathedralWays, create: lm_uspenski_cathedralCreate, views: lm_uspenski_cathedralViews },
  'atomium': { manifest: lm_atomiumManifest, osmWays: lm_atomiumWays, create: lm_atomiumCreate, views: lm_atomiumViews },
  'chords-bridge': { manifest: lm_chords_bridgeManifest, osmWays: lm_chords_bridgeWays, create: lm_chords_bridgeCreate, views: lm_chords_bridgeViews },
  'bob-kerrey-pedestrian-bridge': { manifest: lm_bob_kerrey_pedestrian_bridgeManifest, osmWays: lm_bob_kerrey_pedestrian_bridgeWays, create: lm_bob_kerrey_pedestrian_bridgeCreate, views: lm_bob_kerrey_pedestrian_bridgeViews },
  'plant-hall-tampa': { manifest: lm_plant_hall_tampaManifest, osmWays: lm_plant_hall_tampaWays, create: lm_plant_hall_tampaCreate, views: lm_plant_hall_tampaViews },
  'catedral-de-la-almudena': { manifest: lm_catedral_de_la_almudenaManifest, osmWays: lm_catedral_de_la_almudenaWays, create: lm_catedral_de_la_almudenaCreate, views: lm_catedral_de_la_almudenaViews },
  'tower-of-the-americas': { manifest: lm_tower_of_the_americasManifest, osmWays: lm_tower_of_the_americasWays, create: lm_tower_of_the_americasCreate, views: lm_tower_of_the_americasViews },
  'woodrow-wilson-bridge': { manifest: lm_woodrow_wilson_bridgeManifest, osmWays: lm_woodrow_wilson_bridgeWays, create: lm_woodrow_wilson_bridgeCreate, views: lm_woodrow_wilson_bridgeViews },
  'leveque-tower': { manifest: lm_leveque_towerManifest, osmWays: lm_leveque_towerWays, create: lm_leveque_towerCreate, views: lm_leveque_towerViews },
  'nemo-science-museum': { manifest: lm_nemo_science_museumManifest, osmWays: lm_nemo_science_museumWays, create: lm_nemo_science_museumCreate, views: lm_nemo_science_museumViews },
  'vancouver-public-library': { manifest: lm_vancouver_public_libraryManifest, osmWays: lm_vancouver_public_libraryWays, create: lm_vancouver_public_libraryCreate, views: lm_vancouver_public_libraryViews },
  'queen-elizabeth-ii-bridge': { manifest: lm_queen_elizabeth_ii_bridgeManifest, osmWays: lm_queen_elizabeth_ii_bridgeWays, create: lm_queen_elizabeth_ii_bridgeCreate, views: lm_queen_elizabeth_ii_bridgeViews },
  'saturn-v-huntsville': { manifest: lm_saturn_v_huntsvilleManifest, osmWays: lm_saturn_v_huntsvilleWays, create: lm_saturn_v_huntsvilleCreate, views: lm_saturn_v_huntsvilleViews },
  'charles-bridge': { manifest: lm_charles_bridgeManifest, osmWays: lm_charles_bridgeWays, create: lm_charles_bridgeCreate, views: lm_charles_bridgeViews },
  'grande-arche': { manifest: lm_grande_archeManifest, osmWays: lm_grande_archeWays, create: lm_grande_archeCreate, views: lm_grande_archeViews },
  'sixth-street-viaduct': { manifest: lm_sixth_street_viaductManifest, osmWays: lm_sixth_street_viaductWays, create: lm_sixth_street_viaductCreate, views: lm_sixth_street_viaductViews },
  'perot-museum': { manifest: lm_perot_museumManifest, osmWays: lm_perot_museumWays, create: lm_perot_museumCreate, views: lm_perot_museumViews },
  'cec-palace': { manifest: lm_cec_palaceManifest, osmWays: lm_cec_palaceWays, create: lm_cec_palaceCreate, views: lm_cec_palaceViews },
  'jackson-street-bridge-atlanta': { manifest: lm_jackson_street_bridge_atlantaManifest, osmWays: lm_jackson_street_bridge_atlantaWays, create: lm_jackson_street_bridge_atlantaCreate, views: lm_jackson_street_bridge_atlantaViews },
  'knight-street-bridge': { manifest: lm_knight_street_bridgeManifest, osmWays: lm_knight_street_bridgeWays, create: lm_knight_street_bridgeCreate, views: lm_knight_street_bridgeViews },
  'porsche-museum': { manifest: lm_porsche_museumManifest, osmWays: lm_porsche_museumWays, create: lm_porsche_museumCreate, views: lm_porsche_museumViews },
  'centre-pompidou': { manifest: lm_centre_pompidouManifest, osmWays: lm_centre_pompidouWays, create: lm_centre_pompidouCreate, views: lm_centre_pompidouViews },
  'washington-national-cathedral': { manifest: lm_washington_national_cathedralManifest, osmWays: lm_washington_national_cathedralWays, create: lm_washington_national_cathedralCreate, views: lm_washington_national_cathedralViews },
  'mucem': { manifest: lm_mucemManifest, osmWays: lm_mucemWays, create: lm_mucemCreate, views: lm_mucemViews },
  'oresund-bridge': { manifest: lm_oresund_bridgeManifest, osmWays: lm_oresund_bridgeWays, create: lm_oresund_bridgeCreate, views: lm_oresund_bridgeViews },
  'yerevan-cascade': { manifest: lm_yerevan_cascadeManifest, osmWays: lm_yerevan_cascadeWays, create: lm_yerevan_cascadeCreate, views: lm_yerevan_cascadeViews },
  'rogers-arena': { manifest: lm_rogers_arenaManifest, osmWays: lm_rogers_arenaWays, create: lm_rogers_arenaCreate, views: lm_rogers_arenaViews },
  'edificio-metalico': { manifest: lm_edificio_metalicoManifest, osmWays: lm_edificio_metalicoWays, create: lm_edificio_metalicoCreate, views: lm_edificio_metalicoViews },
  'san-jacinto-monument': { manifest: lm_san_jacinto_monumentManifest, osmWays: lm_san_jacinto_monumentWays, create: lm_san_jacinto_monumentCreate, views: lm_san_jacinto_monumentViews },
  'concertgebouw': { manifest: lm_concertgebouwManifest, osmWays: lm_concertgebouwWays, create: lm_concertgebouwCreate, views: lm_concertgebouwViews },
  'tour-montparnasse': { manifest: lm_tour_montparnasseManifest, osmWays: lm_tour_montparnasseWays, create: lm_tour_montparnasseCreate, views: lm_tour_montparnasseViews },
  'westminster-abbey': { manifest: lm_westminster_abbeyManifest, osmWays: lm_westminster_abbeyWays, create: lm_westminster_abbeyCreate, views: lm_westminster_abbeyViews },
  'opera-de-lyon': { manifest: lm_opera_de_lyonManifest, osmWays: lm_opera_de_lyonWays, create: lm_opera_de_lyonCreate, views: lm_opera_de_lyonViews },
  'santiago-bernabeu': { manifest: lm_santiago_bernabeuManifest, osmWays: lm_santiago_bernabeuWays, create: lm_santiago_bernabeuCreate, views: lm_santiago_bernabeuViews },
  'saint-sophia-cathedral-kyiv': { manifest: lm_saint_sophia_cathedral_kyivManifest, osmWays: lm_saint_sophia_cathedral_kyivWays, create: lm_saint_sophia_cathedral_kyivCreate, views: lm_saint_sophia_cathedral_kyivViews },
  'oak-street-bridge': { manifest: lm_oak_street_bridgeManifest, osmWays: lm_oak_street_bridgeWays, create: lm_oak_street_bridgeCreate, views: lm_oak_street_bridgeViews },
  'riverside-county-courthouse': { manifest: lm_riverside_county_courthouseManifest, osmWays: lm_riverside_county_courthouseWays, create: lm_riverside_county_courthouseCreate, views: lm_riverside_county_courthouseViews },
  'place-de-la-concorde-obelisk': { manifest: lm_place_de_la_concorde_obeliskManifest, osmWays: lm_place_de_la_concorde_obeliskWays, create: lm_place_de_la_concorde_obeliskCreate, views: lm_place_de_la_concorde_obeliskViews },
  'atlanta-city-hall': { manifest: lm_atlanta_city_hallManifest, osmWays: lm_atlanta_city_hallWays, create: lm_atlanta_city_hallCreate, views: lm_atlanta_city_hallViews },
  'ut-tower': { manifest: lm_ut_towerManifest, osmWays: lm_ut_towerWays, create: lm_ut_towerCreate, views: lm_ut_towerViews },
  'belem-tower': { manifest: lm_belem_towerManifest, osmWays: lm_belem_towerWays, create: lm_belem_towerCreate, views: lm_belem_towerViews },
  'parthenon': { manifest: lm_parthenonManifest, osmWays: lm_parthenonWays, create: lm_parthenonCreate, views: lm_parthenonViews },
  'bank-of-america-corporate-center': { manifest: lm_bank_of_america_corporate_centerManifest, osmWays: lm_bank_of_america_corporate_centerWays, create: lm_bank_of_america_corporate_centerCreate, views: lm_bank_of_america_corporate_centerViews },
  'miami-tower': { manifest: lm_miami_towerManifest, osmWays: lm_miami_towerWays, create: lm_miami_towerCreate, views: lm_miami_towerViews },
  'vancouver-art-gallery': { manifest: lm_vancouver_art_galleryManifest, osmWays: lm_vancouver_art_galleryWays, create: lm_vancouver_art_galleryCreate, views: lm_vancouver_art_galleryViews },
  'pont-de-bercy': { manifest: lm_pont_de_bercyManifest, osmWays: lm_pont_de_bercyWays, create: lm_pont_de_bercyCreate, views: lm_pont_de_bercyViews },
  'library-of-congress-jefferson': { manifest: lm_library_of_congress_jeffersonManifest, osmWays: lm_library_of_congress_jeffersonWays, create: lm_library_of_congress_jeffersonCreate, views: lm_library_of_congress_jeffersonViews },
  'stedelijk-museum': { manifest: lm_stedelijk_museumManifest, osmWays: lm_stedelijk_museumWays, create: lm_stedelijk_museumCreate, views: lm_stedelijk_museumViews },
  'rheinturm': { manifest: lm_rheinturmManifest, osmWays: lm_rheinturmWays, create: lm_rheinturmCreate, views: lm_rheinturmViews },
  'the-gherkin': { manifest: lm_the_gherkinManifest, osmWays: lm_the_gherkinWays, create: lm_the_gherkinCreate, views: lm_the_gherkinViews },
  'pennzoil-place': { manifest: lm_pennzoil_placeManifest, osmWays: lm_pennzoil_placeWays, create: lm_pennzoil_placeCreate, views: lm_pennzoil_placeViews },
  'casa-presei-libere': { manifest: lm_casa_presei_libereManifest, osmWays: lm_casa_presei_libereWays, create: lm_casa_presei_libereCreate, views: lm_casa_presei_libereViews },
  'marina-city': { manifest: lm_marina_cityManifest, osmWays: lm_marina_cityWays, create: lm_marina_cityCreate, views: lm_marina_cityViews },
  'queensborough-bridge': { manifest: lm_queensborough_bridgeManifest, osmWays: lm_queensborough_bridgeWays, create: lm_queensborough_bridgeCreate, views: lm_queensborough_bridgeViews },
  'opera-bastille': { manifest: lm_opera_bastilleManifest, osmWays: lm_opera_bastilleWays, create: lm_opera_bastilleCreate, views: lm_opera_bastilleViews },
  'catedral-de-alajuela': { manifest: lm_catedral_de_alajuelaManifest, osmWays: lm_catedral_de_alajuelaWays, create: lm_catedral_de_alajuelaCreate, views: lm_catedral_de_alajuelaViews },
  'high-level-bridge-edmonton': { manifest: lm_high_level_bridge_edmontonManifest, osmWays: lm_high_level_bridge_edmontonWays, create: lm_high_level_bridge_edmontonCreate, views: lm_high_level_bridge_edmontonViews },
  'truist-park': { manifest: lm_truist_parkManifest, osmWays: lm_truist_parkWays, create: lm_truist_parkCreate, views: lm_truist_parkViews },
  'long-beach-international-gateway': { manifest: lm_long_beach_international_gatewayManifest, osmWays: lm_long_beach_international_gatewayWays, create: lm_long_beach_international_gatewayCreate, views: lm_long_beach_international_gatewayViews },
  'cuatro-torres': { manifest: lm_cuatro_torresManifest, osmWays: lm_cuatro_torresWays, create: lm_cuatro_torresCreate, views: lm_cuatro_torresViews },
  'palais-de-chaillot': { manifest: lm_palais_de_chaillotManifest, osmWays: lm_palais_de_chaillotWays, create: lm_palais_de_chaillotCreate, views: lm_palais_de_chaillotViews },
  'waterfront-station-vancouver': { manifest: lm_waterfront_station_vancouverManifest, osmWays: lm_waterfront_station_vancouverWays, create: lm_waterfront_station_vancouverCreate, views: lm_waterfront_station_vancouverViews },
  'old-red-courthouse': { manifest: lm_old_red_courthouseManifest, osmWays: lm_old_red_courthouseWays, create: lm_old_red_courthouseCreate, views: lm_old_red_courthouseViews },
  'frederick-douglass-memorial-bridge': { manifest: lm_frederick_douglass_memorial_bridgeManifest, osmWays: lm_frederick_douglass_memorial_bridgeWays, create: lm_frederick_douglass_memorial_bridgeCreate, views: lm_frederick_douglass_memorial_bridgeViews },
  'muttart-conservatory': { manifest: lm_muttart_conservatoryManifest, osmWays: lm_muttart_conservatoryWays, create: lm_muttart_conservatoryCreate, views: lm_muttart_conservatoryViews },
  'pont-raymond-barre': { manifest: lm_pont_raymond_barreManifest, osmWays: lm_pont_raymond_barreWays, create: lm_pont_raymond_barreCreate, views: lm_pont_raymond_barreViews },
  'pont-mirabeau': { manifest: lm_pont_mirabeauManifest, osmWays: lm_pont_mirabeauWays, create: lm_pont_mirabeauCreate, views: lm_pont_mirabeauViews },
  'munttoren': { manifest: lm_munttorenManifest, osmWays: lm_munttorenWays, create: lm_munttorenCreate, views: lm_munttorenViews },
  'skybridge-vancouver': { manifest: lm_skybridge_vancouverManifest, osmWays: lm_skybridge_vancouverWays, create: lm_skybridge_vancouverCreate, views: lm_skybridge_vancouverViews },
  'battersea-power-station': { manifest: lm_battersea_power_stationManifest, osmWays: lm_battersea_power_stationWays, create: lm_battersea_power_stationCreate, views: lm_battersea_power_stationViews },
  'frost-bank-tower': { manifest: lm_frost_bank_towerManifest, osmWays: lm_frost_bank_towerWays, create: lm_frost_bank_towerCreate, views: lm_frost_bank_towerViews },
  'georgia-aquarium': { manifest: lm_georgia_aquariumManifest, osmWays: lm_georgia_aquariumWays, create: lm_georgia_aquariumCreate, views: lm_georgia_aquariumViews },
  'stade-de-france': { manifest: lm_stade_de_franceManifest, osmWays: lm_stade_de_franceWays, create: lm_stade_de_franceCreate, views: lm_stade_de_franceViews },
  'rogers-place': { manifest: lm_rogers_placeManifest, osmWays: lm_rogers_placeWays, create: lm_rogers_placeCreate, views: lm_rogers_placeViews },
  'mission-bridge': { manifest: lm_mission_bridgeManifest, osmWays: lm_mission_bridgeWays, create: lm_mission_bridgeCreate, views: lm_mission_bridgeViews },
  'los-angeles-union-station': { manifest: lm_los_angeles_union_stationManifest, osmWays: lm_los_angeles_union_stationWays, create: lm_los_angeles_union_stationCreate, views: lm_los_angeles_union_stationViews },
  'allianz-arena': { manifest: lm_allianz_arenaManifest, osmWays: lm_allianz_arenaWays, create: lm_allianz_arenaCreate, views: lm_allianz_arenaViews },
  'tawatina-bridge': { manifest: lm_tawatina_bridgeManifest, osmWays: lm_tawatina_bridgeWays, create: lm_tawatina_bridgeCreate, views: lm_tawatina_bridgeViews },
  'bridge-of-peace-tbilisi': { manifest: lm_bridge_of_peace_tbilisiManifest, osmWays: lm_bridge_of_peace_tbilisiWays, create: lm_bridge_of_peace_tbilisiCreate, views: lm_bridge_of_peace_tbilisiViews },
  'dames-point-bridge': { manifest: lm_dames_point_bridgeManifest, osmWays: lm_dames_point_bridgeWays, create: lm_dames_point_bridgeCreate, views: lm_dames_point_bridgeViews },
  'puente-de-segovia': { manifest: lm_puente_de_segoviaManifest, osmWays: lm_puente_de_segoviaWays, create: lm_puente_de_segoviaCreate, views: lm_puente_de_segoviaViews },
  'pont-royal': { manifest: lm_pont_royalManifest, osmWays: lm_pont_royalWays, create: lm_pont_royalCreate, views: lm_pont_royalViews },
  'san-fernando-cathedral': { manifest: lm_san_fernando_cathedralManifest, osmWays: lm_san_fernando_cathedralWays, create: lm_san_fernando_cathedralCreate, views: lm_san_fernando_cathedralViews },
  'washington-union-station': { manifest: lm_washington_union_stationManifest, osmWays: lm_washington_union_stationWays, create: lm_washington_union_stationCreate, views: lm_washington_union_stationViews },
  'black-church-brasov': { manifest: lm_black_church_brasovManifest, osmWays: lm_black_church_brasovWays, create: lm_black_church_brasovCreate, views: lm_black_church_brasovViews },
  'gastown-steam-clock': { manifest: lm_gastown_steam_clockManifest, osmWays: lm_gastown_steam_clockWays, create: lm_gastown_steam_clockCreate, views: lm_gastown_steam_clockViews },
  'stantec-tower': { manifest: lm_stantec_towerManifest, osmWays: lm_stantec_towerWays, create: lm_stantec_towerCreate, views: lm_stantec_towerViews },
  'johan-cruijff-arena': { manifest: lm_johan_cruijff_arenaManifest, osmWays: lm_johan_cruijff_arenaWays, create: lm_johan_cruijff_arenaCreate, views: lm_johan_cruijff_arenaViews },
  'albert-bridge-london': { manifest: lm_albert_bridge_londonManifest, osmWays: lm_albert_bridge_londonWays, create: lm_albert_bridge_londonCreate, views: lm_albert_bridge_londonViews },
  'fondation-louis-vuitton': { manifest: lm_fondation_louis_vuittonManifest, osmWays: lm_fondation_louis_vuittonWays, create: lm_fondation_louis_vuittonCreate, views: lm_fondation_louis_vuittonViews },
  'westminster-abbey-mission': { manifest: lm_westminster_abbey_missionManifest, osmWays: lm_westminster_abbey_missionWays, create: lm_westminster_abbey_missionCreate, views: lm_westminster_abbey_missionViews },
  'tarrant-county-courthouse': { manifest: lm_tarrant_county_courthouseManifest, osmWays: lm_tarrant_county_courthouseWays, create: lm_tarrant_county_courthouseCreate, views: lm_tarrant_county_courthouseViews },
  'george-c-king-bridge': { manifest: lm_george_c_king_bridgeManifest, osmWays: lm_george_c_king_bridgeWays, create: lm_george_c_king_bridgeCreate, views: lm_george_c_king_bridgeViews },
  'wilshire-grand-center': { manifest: lm_wilshire_grand_centerManifest, osmWays: lm_wilshire_grand_centerWays, create: lm_wilshire_grand_centerCreate, views: lm_wilshire_grand_centerViews },
  'palais-bourbon': { manifest: lm_palais_bourbonManifest, osmWays: lm_palais_bourbonWays, create: lm_palais_bourbonCreate, views: lm_palais_bourbonViews },
  'w-r-bennett-bridge': { manifest: lm_w_r_bennett_bridgeManifest, osmWays: lm_w_r_bennett_bridgeWays, create: lm_w_r_bennett_bridgeCreate, views: lm_w_r_bennett_bridgeViews },
  'smithsonian-castle': { manifest: lm_smithsonian_castleManifest, osmWays: lm_smithsonian_castleWays, create: lm_smithsonian_castleCreate, views: lm_smithsonian_castleViews },
  'cathedrale-saint-jean-lyon': { manifest: lm_cathedrale_saint_jean_lyonManifest, osmWays: lm_cathedrale_saint_jean_lyonWays, create: lm_cathedrale_saint_jean_lyonCreate, views: lm_cathedrale_saint_jean_lyonViews },
  'fernsehturm-stuttgart': { manifest: lm_fernsehturm_stuttgartManifest, osmWays: lm_fernsehturm_stuttgartWays, create: lm_fernsehturm_stuttgartCreate, views: lm_fernsehturm_stuttgartViews },
  'brandenburg-gate': { manifest: lm_brandenburg_gateManifest, osmWays: lm_brandenburg_gateWays, create: lm_brandenburg_gateCreate, views: lm_brandenburg_gateViews },
  'pont-de-l-alma': { manifest: lm_pont_de_l_almaManifest, osmWays: lm_pont_de_l_almaWays, create: lm_pont_de_l_almaCreate, views: lm_pont_de_l_almaViews },
  'zaanse-schans-windmills': { manifest: lm_zaanse_schans_windmillsManifest, osmWays: lm_zaanse_schans_windmillsWays, create: lm_zaanse_schans_windmillsCreate, views: lm_zaanse_schans_windmillsViews },
  'edmonton-city-hall': { manifest: lm_edmonton_city_hallManifest, osmWays: lm_edmonton_city_hallWays, create: lm_edmonton_city_hallCreate, views: lm_edmonton_city_hallViews },
  'real-casa-de-correos': { manifest: lm_real_casa_de_correosManifest, osmWays: lm_real_casa_de_correosWays, create: lm_real_casa_de_correosCreate, views: lm_real_casa_de_correosViews },
  'royal-albert-hall': { manifest: lm_royal_albert_hallManifest, osmWays: lm_royal_albert_hallWays, create: lm_royal_albert_hallCreate, views: lm_royal_albert_hallViews },
  'hotel-negresco': { manifest: lm_hotel_negrescoManifest, osmWays: lm_hotel_negrescoWays, create: lm_hotel_negrescoCreate, views: lm_hotel_negrescoViews },
  'gateway-arch': { manifest: lm_gateway_archManifest, osmWays: lm_gateway_archWays, create: lm_gateway_archCreate, views: lm_gateway_archViews },
  'palais-du-luxembourg': { manifest: lm_palais_du_luxembourgManifest, osmWays: lm_palais_du_luxembourgWays, create: lm_palais_du_luxembourgCreate, views: lm_palais_du_luxembourgViews },
  'arena-nationala': { manifest: lm_arena_nationalaManifest, osmWays: lm_arena_nationalaWays, create: lm_arena_nationalaCreate, views: lm_arena_nationalaViews },
  'wrigley-building': { manifest: lm_wrigley_buildingManifest, osmWays: lm_wrigley_buildingWays, create: lm_wrigley_buildingCreate, views: lm_wrigley_buildingViews },
  'parthenon-nashville': { manifest: lm_parthenon_nashvilleManifest, osmWays: lm_parthenon_nashvilleWays, create: lm_parthenon_nashvilleCreate, views: lm_parthenon_nashvilleViews },
  'art-gallery-of-alberta': { manifest: lm_art_gallery_of_albertaManifest, osmWays: lm_art_gallery_of_albertaWays, create: lm_art_gallery_of_albertaCreate, views: lm_art_gallery_of_albertaViews },
  'capitol-records-building': { manifest: lm_capitol_records_buildingManifest, osmWays: lm_capitol_records_buildingWays, create: lm_capitol_records_buildingCreate, views: lm_capitol_records_buildingViews },
  'lake-eola-fountain': { manifest: lm_lake_eola_fountainManifest, osmWays: lm_lake_eola_fountainWays, create: lm_lake_eola_fountainCreate, views: lm_lake_eola_fountainViews },
  'gare-de-lyon-clock-tower': { manifest: lm_gare_de_lyon_clock_towerManifest, osmWays: lm_gare_de_lyon_clock_towerWays, create: lm_gare_de_lyon_clock_towerCreate, views: lm_gare_de_lyon_clock_towerViews },
  'bromo-seltzer-tower': { manifest: lm_bromo_seltzer_towerManifest, osmWays: lm_bromo_seltzer_towerWays, create: lm_bromo_seltzer_towerCreate, views: lm_bromo_seltzer_towerViews },
  'wembley-stadium': { manifest: lm_wembley_stadiumManifest, osmWays: lm_wembley_stadiumWays, create: lm_wembley_stadiumCreate, views: lm_wembley_stadiumViews },
  'chateau-de-vincennes': { manifest: lm_chateau_de_vincennesManifest, osmWays: lm_chateau_de_vincennesWays, create: lm_chateau_de_vincennesCreate, views: lm_chateau_de_vincennesViews },
  'templo-de-debod': { manifest: lm_templo_de_debodManifest, osmWays: lm_templo_de_debodWays, create: lm_templo_de_debodCreate, views: lm_templo_de_debodViews },
  'custom-house-dublin': { manifest: lm_custom_house_dublinManifest, osmWays: lm_custom_house_dublinWays, create: lm_custom_house_dublinCreate, views: lm_custom_house_dublinViews },
  'chateau-de-versailles': { manifest: lm_chateau_de_versaillesManifest, osmWays: lm_chateau_de_versaillesWays, create: lm_chateau_de_versaillesCreate, views: lm_chateau_de_versaillesViews },
  'tour-incity': { manifest: lm_tour_incityManifest, osmWays: lm_tour_incityWays, create: lm_tour_incityCreate, views: lm_tour_incityViews },
  'colorado-street-bridge': { manifest: lm_colorado_street_bridgeManifest, osmWays: lm_colorado_street_bridgeWays, create: lm_colorado_street_bridgeCreate, views: lm_colorado_street_bridgeViews },
  'louise-bridge-calgary': { manifest: lm_louise_bridge_calgaryManifest, osmWays: lm_louise_bridge_calgaryWays, create: lm_louise_bridge_calgaryCreate, views: lm_louise_bridge_calgaryViews },
  'institut-du-monde-arabe': { manifest: lm_institut_du_monde_arabeManifest, osmWays: lm_institut_du_monde_arabeWays, create: lm_institut_du_monde_arabeCreate, views: lm_institut_du_monde_arabeViews },
  'wuppertal-schwebebahn-sonnborn': { manifest: lm_wuppertal_schwebebahn_sonnbornManifest, osmWays: lm_wuppertal_schwebebahn_sonnbornWays, create: lm_wuppertal_schwebebahn_sonnbornCreate, views: lm_wuppertal_schwebebahn_sonnbornViews },
  'fairmont-chateau-lake-louise': { manifest: lm_fairmont_chateau_lake_louiseManifest, osmWays: lm_fairmont_chateau_lake_louiseWays, create: lm_fairmont_chateau_lake_louiseCreate, views: lm_fairmont_chateau_lake_louiseViews },
  'edificio-inteligente-epm': { manifest: lm_edificio_inteligente_epmManifest, osmWays: lm_edificio_inteligente_epmWays, create: lm_edificio_inteligente_epmCreate, views: lm_edificio_inteligente_epmViews },
  'pantheon-rome': { manifest: lm_pantheon_romeManifest, osmWays: lm_pantheon_romeWays, create: lm_pantheon_romeCreate, views: lm_pantheon_romeViews },
  'union-station-kansas-city': { manifest: lm_union_station_kansas_cityManifest, osmWays: lm_union_station_kansas_cityWays, create: lm_union_station_kansas_cityCreate, views: lm_union_station_kansas_cityViews },
  'pavillon-roger-gaudry': { manifest: lm_pavillon_roger_gaudryManifest, osmWays: lm_pavillon_roger_gaudryWays, create: lm_pavillon_roger_gaudryCreate, views: lm_pavillon_roger_gaudryViews },
  'marche-atwater': { manifest: lm_marche_atwaterManifest, osmWays: lm_marche_atwaterWays, create: lm_marche_atwaterCreate, views: lm_marche_atwaterViews },
  'tour-1000-de-la-gauchetiere': { manifest: lm_tour_1000_de_la_gauchetiereManifest, osmWays: lm_tour_1000_de_la_gauchetiereWays, create: lm_tour_1000_de_la_gauchetiereCreate, views: lm_tour_1000_de_la_gauchetiereViews },
  'parliament-hill-centre-block': { manifest: lm_parliament_hill_centre_blockManifest, osmWays: lm_parliament_hill_centre_blockWays, create: lm_parliament_hill_centre_blockCreate, views: lm_parliament_hill_centre_blockViews },
  'burlington-bay-skyway': { manifest: lm_burlington_bay_skywayManifest, osmWays: lm_burlington_bay_skywayWays, create: lm_burlington_bay_skywayCreate, views: lm_burlington_bay_skywayViews },
  'arthur-ravenel-jr-bridge': { manifest: lm_arthur_ravenel_jr_bridgeManifest, osmWays: lm_arthur_ravenel_jr_bridgeWays, create: lm_arthur_ravenel_jr_bridgeCreate, views: lm_arthur_ravenel_jr_bridgeViews },
  'ashley-river-memorial-bridge': { manifest: lm_ashley_river_memorial_bridgeManifest, osmWays: lm_ashley_river_memorial_bridgeWays, create: lm_ashley_river_memorial_bridgeCreate, views: lm_ashley_river_memorial_bridgeViews },
  'uss-yorktown-cv10': { manifest: lm_uss_yorktown_cv10Manifest, osmWays: lm_uss_yorktown_cv10Ways, create: lm_uss_yorktown_cv10Create, views: lm_uss_yorktown_cv10Views },
  'fort-sumter': { manifest: lm_fort_sumterManifest, osmWays: lm_fort_sumterWays, create: lm_fort_sumterCreate, views: lm_fort_sumterViews },
  'don-holt-bridge': { manifest: lm_don_holt_bridgeManifest, osmWays: lm_don_holt_bridgeWays, create: lm_don_holt_bridgeCreate, views: lm_don_holt_bridgeViews },
  'ben-sawyer-bridge': { manifest: lm_ben_sawyer_bridgeManifest, osmWays: lm_ben_sawyer_bridgeWays, create: lm_ben_sawyer_bridgeCreate, views: lm_ben_sawyer_bridgeViews },
  'noisette-creek-pedestrian-bridge': { manifest: lm_noisette_creek_pedestrian_bridgeManifest, osmWays: lm_noisette_creek_pedestrian_bridgeWays, create: lm_noisette_creek_pedestrian_bridgeCreate, views: lm_noisette_creek_pedestrian_bridgeViews },
  'north-charleston-coliseum': { manifest: lm_north_charleston_coliseumManifest, osmWays: lm_north_charleston_coliseumWays, create: lm_north_charleston_coliseumCreate, views: lm_north_charleston_coliseumViews },
  'st-michaels-church-charleston': { manifest: lm_st_michaels_church_charlestonManifest, osmWays: lm_st_michaels_church_charlestonWays, create: lm_st_michaels_church_charlestonCreate, views: lm_st_michaels_church_charlestonViews },
  'st-philips-church-charleston': { manifest: lm_st_philips_church_charlestonManifest, osmWays: lm_st_philips_church_charlestonWays, create: lm_st_philips_church_charlestonCreate, views: lm_st_philips_church_charlestonViews },
  'us-custom-house-charleston': { manifest: lm_us_custom_house_charlestonManifest, osmWays: lm_us_custom_house_charlestonWays, create: lm_us_custom_house_charlestonCreate, views: lm_us_custom_house_charlestonViews },
  'pineapple-fountain-charleston': { manifest: lm_pineapple_fountain_charlestonManifest, osmWays: lm_pineapple_fountain_charlestonWays, create: lm_pineapple_fountain_charlestonCreate, views: lm_pineapple_fountain_charlestonViews },
  'rainbow-row-charleston': { manifest: lm_rainbow_row_charlestonManifest, osmWays: lm_rainbow_row_charlestonWays, create: lm_rainbow_row_charlestonCreate, views: lm_rainbow_row_charlestonViews },
  'citadel-padgett-thomas-barracks': { manifest: lm_citadel_padgett_thomas_barracksManifest, osmWays: lm_citadel_padgett_thomas_barracksWays, create: lm_citadel_padgett_thomas_barracksCreate, views: lm_citadel_padgett_thomas_barracksViews },
  'morris-island-lighthouse': { manifest: lm_morris_island_lighthouseManifest, osmWays: lm_morris_island_lighthouseWays, create: lm_morris_island_lighthouseCreate, views: lm_morris_island_lighthouseViews },
  'charleston-international-airport-terminal': { manifest: lm_charleston_international_airport_terminalManifest, osmWays: lm_charleston_international_airport_terminalWays, create: lm_charleston_international_airport_terminalCreate, views: lm_charleston_international_airport_terminalViews },
  'st-james-goose-creek-church': { manifest: lm_st_james_goose_creek_churchManifest, osmWays: lm_st_james_goose_creek_churchWays, create: lm_st_james_goose_creek_churchCreate, views: lm_st_james_goose_creek_churchViews },
  'goose-creek-municipal-center': { manifest: lm_goose_creek_municipal_centerManifest, osmWays: lm_goose_creek_municipal_centerWays, create: lm_goose_creek_municipal_centerCreate, views: lm_goose_creek_municipal_centerViews },
  'colonial-dorchester-bell-tower': { manifest: lm_colonial_dorchester_bell_towerManifest, osmWays: lm_colonial_dorchester_bell_towerWays, create: lm_colonial_dorchester_bell_towerCreate, views: lm_colonial_dorchester_bell_towerViews },
  'north-charleston-city-hall': { manifest: lm_north_charleston_city_hallManifest, osmWays: lm_north_charleston_city_hallWays, create: lm_north_charleston_city_hallCreate, views: lm_north_charleston_city_hallViews },
  '122-leadenhall-street': { manifest: lm_122_leadenhall_streetManifest, osmWays: lm_122_leadenhall_streetWays, create: lm_122_leadenhall_streetCreate, views: lm_122_leadenhall_streetViews },
  '20-fenchurch-street': { manifest: lm_20_fenchurch_streetManifest, osmWays: lm_20_fenchurch_streetWays, create: lm_20_fenchurch_streetCreate, views: lm_20_fenchurch_streetViews },
  '3arena-dublin': { manifest: lm_3arena_dublinManifest, osmWays: lm_3arena_dublinWays, create: lm_3arena_dublinCreate, views: lm_3arena_dublinViews },
  '8-canada-square': { manifest: lm_8_canada_squareManifest, osmWays: lm_8_canada_squareWays, create: lm_8_canada_squareCreate, views: lm_8_canada_squareViews },
  'absolute-world-mississauga': { manifest: lm_absolute_world_mississaugaManifest, osmWays: lm_absolute_world_mississaugaWays, create: lm_absolute_world_mississaugaCreate, views: lm_absolute_world_mississaugaViews },
  'accor-arena-bercy': { manifest: lm_accor_arena_bercyManifest, osmWays: lm_accor_arena_bercyWays, create: lm_accor_arena_bercyCreate, views: lm_accor_arena_bercyViews },
  'afi-silver-theatre': { manifest: lm_afi_silver_theatreManifest, osmWays: lm_afi_silver_theatreWays, create: lm_afi_silver_theatreCreate, views: lm_afi_silver_theatreViews },
  'american-airlines-center': { manifest: lm_american_airlines_centerManifest, osmWays: lm_american_airlines_centerWays, create: lm_american_airlines_centerCreate, views: lm_american_airlines_centerViews },
  'anaheim-artic': { manifest: lm_anaheim_articManifest, osmWays: lm_anaheim_articWays, create: lm_anaheim_articCreate, views: lm_anaheim_articViews },
  'anaheim-packing-house': { manifest: lm_anaheim_packing_houseManifest, osmWays: lm_anaheim_packing_houseWays, create: lm_anaheim_packing_houseCreate, views: lm_anaheim_packing_houseViews },
  'angel-stadium': { manifest: lm_angel_stadiumManifest, osmWays: lm_angel_stadiumWays, create: lm_angel_stadiumCreate, views: lm_angel_stadiumViews },
  'arenes-de-nimes': { manifest: lm_arenes_de_nimesManifest, osmWays: lm_arenes_de_nimesWays, create: lm_arenes_de_nimesCreate, views: lm_arenes_de_nimesViews },
  'astrodome': { manifest: lm_astrodomeManifest, osmWays: lm_astrodomeWays, create: lm_astrodomeCreate, views: lm_astrodomeViews },
  'athens-city-hall': { manifest: lm_athens_city_hallManifest, osmWays: lm_athens_city_hallWays, create: lm_athens_city_hallCreate, views: lm_athens_city_hallViews },
  'athens-tower': { manifest: lm_athens_towerManifest, osmWays: lm_athens_towerWays, create: lm_athens_towerCreate, views: lm_athens_towerViews },
  'avicii-arena': { manifest: lm_avicii_arenaManifest, osmWays: lm_avicii_arenaWays, create: lm_avicii_arenaCreate, views: lm_avicii_arenaViews },
  'aviva-stadium': { manifest: lm_aviva_stadiumManifest, osmWays: lm_aviva_stadiumWays, create: lm_aviva_stadiumCreate, views: lm_aviva_stadiumViews },
  'azrieli-center': { manifest: lm_azrieli_centerManifest, osmWays: lm_azrieli_centerWays, create: lm_azrieli_centerCreate, views: lm_azrieli_centerViews },
  'bahai-house-worship-wilmette': { manifest: lm_bahai_house_worship_wilmetteManifest, osmWays: lm_bahai_house_worship_wilmetteWays, create: lm_bahai_house_worship_wilmetteCreate, views: lm_bahai_house_worship_wilmetteViews },
  'baltimore-city-hall': { manifest: lm_baltimore_city_hallManifest, osmWays: lm_baltimore_city_hallWays, create: lm_baltimore_city_hallCreate, views: lm_baltimore_city_hallViews },
  'baltimore-world-trade-center': { manifest: lm_baltimore_world_trade_centerManifest, osmWays: lm_baltimore_world_trade_centerWays, create: lm_baltimore_world_trade_centerCreate, views: lm_baltimore_world_trade_centerViews },
  'bancolombia-medellin': { manifest: lm_bancolombia_medellinManifest, osmWays: lm_bancolombia_medellinWays, create: lm_bancolombia_medellinCreate, views: lm_bancolombia_medellinViews },
  'bank-of-georgia-hq': { manifest: lm_bank_of_georgia_hqManifest, osmWays: lm_bank_of_georgia_hqWays, create: lm_bank_of_georgia_hqCreate, views: lm_bank_of_georgia_hqViews },
  'basilica-saint-nicholas-amsterdam': { manifest: lm_basilica_saint_nicholas_amsterdamManifest, osmWays: lm_basilica_saint_nicholas_amsterdamWays, create: lm_basilica_saint_nicholas_amsterdamCreate, views: lm_basilica_saint_nicholas_amsterdamViews },
  'basilique-saint-frederic-drummondville': { manifest: lm_basilique_saint_frederic_drummondvilleManifest, osmWays: lm_basilique_saint_frederic_drummondvilleWays, create: lm_basilique_saint_frederic_drummondvilleCreate, views: lm_basilique_saint_frederic_drummondvilleViews },
  'basilique-visitation-annecy': { manifest: lm_basilique_visitation_annecyManifest, osmWays: lm_basilique_visitation_annecyWays, create: lm_basilique_visitation_annecyCreate, views: lm_basilique_visitation_annecyViews },
  'bass-performance-hall': { manifest: lm_bass_performance_hallManifest, osmWays: lm_bass_performance_hallWays, create: lm_bass_performance_hallCreate, views: lm_bass_performance_hallViews },
  'bd-bacata': { manifest: lm_bd_bacataManifest, osmWays: lm_bd_bacataWays, create: lm_bd_bacataCreate, views: lm_bd_bacataViews },
  'beetham-tower-manchester': { manifest: lm_beetham_tower_manchesterManifest, osmWays: lm_beetham_tower_manchesterWays, create: lm_beetham_tower_manchesterCreate, views: lm_beetham_tower_manchesterViews },
  'beffroi-hotel-de-ville-lille': { manifest: lm_beffroi_hotel_de_ville_lilleManifest, osmWays: lm_beffroi_hotel_de_ville_lilleWays, create: lm_beffroi_hotel_de_ville_lilleCreate, views: lm_beffroi_hotel_de_ville_lilleViews },
  'bella-sky-copenhagen': { manifest: lm_bella_sky_copenhagenManifest, osmWays: lm_bella_sky_copenhagenWays, create: lm_bella_sky_copenhagenCreate, views: lm_bella_sky_copenhagenViews },
  'berlin-fernsehturm': { manifest: lm_berlin_fernsehturmManifest, osmWays: lm_berlin_fernsehturmWays, create: lm_berlin_fernsehturmCreate, views: lm_berlin_fernsehturmViews },
  'bibliotheque-nationale-francois-mitterrand': { manifest: lm_bibliotheque_nationale_francois_mitterrandManifest, osmWays: lm_bibliotheque_nationale_francois_mitterrandWays, create: lm_bibliotheque_nationale_francois_mitterrandCreate, views: lm_bibliotheque_nationale_francois_mitterrandViews },
  'bibliotheque-schoelcher': { manifest: lm_bibliotheque_schoelcherManifest, osmWays: lm_bibliotheque_schoelcherWays, create: lm_bibliotheque_schoelcherCreate, views: lm_bibliotheque_schoelcherViews },
  'big-chicken-marietta': { manifest: lm_big_chicken_mariettaManifest, osmWays: lm_big_chicken_mariettaWays, create: lm_big_chicken_mariettaCreate, views: lm_big_chicken_mariettaViews },
  'biltmore-tbilisi': { manifest: lm_biltmore_tbilisiManifest, osmWays: lm_biltmore_tbilisiWays, create: lm_biltmore_tbilisiCreate, views: lm_biltmore_tbilisiViews },
  'bmw-headquarters': { manifest: lm_bmw_headquartersManifest, osmWays: lm_bmw_headquartersWays, create: lm_bmw_headquartersCreate, views: lm_bmw_headquartersViews },
  'braselton-brothers-store': { manifest: lm_braselton_brothers_storeManifest, osmWays: lm_braselton_brothers_storeWays, create: lm_braselton_brothers_storeCreate, views: lm_braselton_brothers_storeViews },
  'bt-tower-london': { manifest: lm_bt_tower_londonManifest, osmWays: lm_bt_tower_londonWays, create: lm_bt_tower_londonCreate, views: lm_bt_tower_londonViews },
  'california-state-capitol': { manifest: lm_california_state_capitolManifest, osmWays: lm_california_state_capitolWays, create: lm_california_state_capitolCreate, views: lm_california_state_capitolViews },
  'california-theatre-san-bernardino': { manifest: lm_california_theatre_san_bernardinoManifest, osmWays: lm_california_theatre_san_bernardinoWays, create: lm_california_theatre_san_bernardinoCreate, views: lm_california_theatre_san_bernardinoViews },
  'castel-sant-angelo': { manifest: lm_castel_sant_angeloManifest, osmWays: lm_castel_sant_angeloWays, create: lm_castel_sant_angeloCreate, views: lm_castel_sant_angeloViews },
  'cathedral-basilica-st-louis': { manifest: lm_cathedral_basilica_st_louisManifest, osmWays: lm_cathedral_basilica_st_louisWays, create: lm_cathedral_basilica_st_louisCreate, views: lm_cathedral_basilica_st_louisViews },
  'cathedral-blessed-sacrament-sacramento': { manifest: lm_cathedral_blessed_sacrament_sacramentoManifest, osmWays: lm_cathedral_blessed_sacrament_sacramentoWays, create: lm_cathedral_blessed_sacrament_sacramentoCreate, views: lm_cathedral_blessed_sacrament_sacramentoViews },
  'cathedral-transfiguration-markham': { manifest: lm_cathedral_transfiguration_markhamManifest, osmWays: lm_cathedral_transfiguration_markhamWays, create: lm_cathedral_transfiguration_markhamCreate, views: lm_cathedral_transfiguration_markhamViews },
  'cathedrale-clermont-ferrand': { manifest: lm_cathedrale_clermont_ferrandManifest, osmWays: lm_cathedrale_clermont_ferrandWays, create: lm_cathedrale_clermont_ferrandCreate, views: lm_cathedrale_clermont_ferrandViews },
  'cathedrale-notre-dame-reims': { manifest: lm_cathedrale_notre_dame_reimsManifest, osmWays: lm_cathedrale_notre_dame_reimsWays, create: lm_cathedrale_notre_dame_reimsCreate, views: lm_cathedrale_notre_dame_reimsViews },
  'cathedrale-notre-dame-strasbourg': { manifest: lm_cathedrale_notre_dame_strasbourgManifest, osmWays: lm_cathedrale_notre_dame_strasbourgWays, create: lm_cathedrale_notre_dame_strasbourgCreate, views: lm_cathedrale_notre_dame_strasbourgViews },
  'cathedrale-saint-antoine-longueuil': { manifest: lm_cathedrale_saint_antoine_longueuilManifest, osmWays: lm_cathedrale_saint_antoine_longueuilWays, create: lm_cathedrale_saint_antoine_longueuilCreate, views: lm_cathedrale_saint_antoine_longueuilViews },
  'cathedrale-saint-denis-reunion': { manifest: lm_cathedrale_saint_denis_reunionManifest, osmWays: lm_cathedrale_saint_denis_reunionWays, create: lm_cathedrale_saint_denis_reunionCreate, views: lm_cathedrale_saint_denis_reunionViews },
  'cathedrale-saint-louis-fort-de-france': { manifest: lm_cathedrale_saint_louis_fort_de_franceManifest, osmWays: lm_cathedrale_saint_louis_fort_de_franceWays, create: lm_cathedrale_saint_louis_fort_de_franceCreate, views: lm_cathedrale_saint_louis_fort_de_franceViews },
  'chateau-elan-winery': { manifest: lm_chateau_elan_wineryManifest, osmWays: lm_chateau_elan_wineryWays, create: lm_chateau_elan_wineryCreate, views: lm_chateau_elan_wineryViews },
  'christiansborg-palace': { manifest: lm_christiansborg_palaceManifest, osmWays: lm_christiansborg_palaceWays, create: lm_christiansborg_palaceCreate, views: lm_christiansborg_palaceViews },
  'church-of-our-saviour-copenhagen': { manifest: lm_church_of_our_saviour_copenhagenManifest, osmWays: lm_church_of_our_saviour_copenhagenWays, create: lm_church_of_our_saviour_copenhagenCreate, views: lm_church_of_our_saviour_copenhagenViews },
  'cite-du-vin-bordeaux': { manifest: lm_cite_du_vin_bordeauxManifest, osmWays: lm_cite_du_vin_bordeauxWays, create: lm_cite_du_vin_bordeauxCreate, views: lm_cite_du_vin_bordeauxViews },
  'civil-courts-building-st-louis': { manifest: lm_civil_courts_building_st_louisManifest, osmWays: lm_civil_courts_building_st_louisWays, create: lm_civil_courts_building_st_louisCreate, views: lm_civil_courts_building_st_louisViews },
  'coimbra-university-tower': { manifest: lm_coimbra_university_towerManifest, osmWays: lm_coimbra_university_towerWays, create: lm_coimbra_university_towerCreate, views: lm_coimbra_university_towerViews },
  'collegiale-saint-andre-grenoble': { manifest: lm_collegiale_saint_andre_grenobleManifest, osmWays: lm_collegiale_saint_andre_grenobleWays, create: lm_collegiale_saint_andre_grenobleCreate, views: lm_collegiale_saint_andre_grenobleViews },
  'collegiate-saint-gertrude-nivelles': { manifest: lm_collegiate_saint_gertrude_nivellesManifest, osmWays: lm_collegiate_saint_gertrude_nivellesWays, create: lm_collegiate_saint_gertrude_nivellesCreate, views: lm_collegiate_saint_gertrude_nivellesViews },
  'comerica-bank-tower': { manifest: lm_comerica_bank_towerManifest, osmWays: lm_comerica_bank_towerWays, create: lm_comerica_bank_towerCreate, views: lm_comerica_bank_towerViews },
  'constanta-casino': { manifest: lm_constanta_casinoManifest, osmWays: lm_constanta_casinoWays, create: lm_constanta_casinoCreate, views: lm_constanta_casinoViews },
  'coolray-field': { manifest: lm_coolray_fieldManifest, osmWays: lm_coolray_fieldWays, create: lm_coolray_fieldCreate, views: lm_coolray_fieldViews },
  'coquitlam-city-hall': { manifest: lm_coquitlam_city_hallManifest, osmWays: lm_coquitlam_city_hallWays, create: lm_coquitlam_city_hallCreate, views: lm_coquitlam_city_hallViews },
  'cosmodome-laval': { manifest: lm_cosmodome_lavalManifest, osmWays: lm_cosmodome_lavalWays, create: lm_cosmodome_lavalCreate, views: lm_cosmodome_lavalViews },
  'cristo-rei-almada': { manifest: lm_cristo_rei_almadaManifest, osmWays: lm_cristo_rei_almadaWays, create: lm_cristo_rei_almadaCreate, views: lm_cristo_rei_almadaViews },
  'dallas-hall-smu': { manifest: lm_dallas_hall_smuManifest, osmWays: lm_dallas_hall_smuWays, create: lm_dallas_hall_smuCreate, views: lm_dallas_hall_smuViews },
  'de-gooyer': { manifest: lm_de_gooyerManifest, osmWays: lm_de_gooyerWays, create: lm_de_gooyerCreate, views: lm_de_gooyerViews },
  'denver-union-station': { manifest: lm_denver_union_stationManifest, osmWays: lm_denver_union_stationWays, create: lm_denver_union_stationCreate, views: lm_denver_union_stationViews },
  'donjon-de-niort': { manifest: lm_donjon_de_niortManifest, osmWays: lm_donjon_de_niortWays, create: lm_donjon_de_niortCreate, views: lm_donjon_de_niortViews },
  'eglise-purification-repentigny': { manifest: lm_eglise_purification_repentignyManifest, osmWays: lm_eglise_purification_repentignyWays, create: lm_eglise_purification_repentignyCreate, views: lm_eglise_purification_repentignyViews },
  'eglise-saint-augustin-paris': { manifest: lm_eglise_saint_augustin_parisManifest, osmWays: lm_eglise_saint_augustin_parisWays, create: lm_eglise_saint_augustin_parisCreate, views: lm_eglise_saint_augustin_parisViews },
  'eglise-saint-hubert-longueuil': { manifest: lm_eglise_saint_hubert_longueuilManifest, osmWays: lm_eglise_saint_hubert_longueuilWays, create: lm_eglise_saint_hubert_longueuilCreate, views: lm_eglise_saint_hubert_longueuilViews },
  'eglise-saint-joachim-pointe-claire': { manifest: lm_eglise_saint_joachim_pointe_claireManifest, osmWays: lm_eglise_saint_joachim_pointe_claireWays, create: lm_eglise_saint_joachim_pointe_claireCreate, views: lm_eglise_saint_joachim_pointe_claireViews },
  'eglise-saint-lambert': { manifest: lm_eglise_saint_lambertManifest, osmWays: lm_eglise_saint_lambertWays, create: lm_eglise_saint_lambertCreate, views: lm_eglise_saint_lambertViews },
  'eglise-saint-pierre-saint-paul-pointe-a-pitre': { manifest: lm_eglise_saint_pierre_saint_paul_pointe_a_pitreManifest, osmWays: lm_eglise_saint_pierre_saint_paul_pointe_a_pitreWays, create: lm_eglise_saint_pierre_saint_paul_pointe_a_pitreCreate, views: lm_eglise_saint_pierre_saint_paul_pointe_a_pitreViews },
  'ellicott-city-station': { manifest: lm_ellicott_city_stationManifest, osmWays: lm_ellicott_city_stationWays, create: lm_ellicott_city_stationCreate, views: lm_ellicott_city_stationViews },
  'emirates-stadium': { manifest: lm_emirates_stadiumManifest, osmWays: lm_emirates_stadiumWays, create: lm_emirates_stadiumCreate, views: lm_emirates_stadiumViews },
  'esch-sur-alzette-town-hall': { manifest: lm_esch_sur_alzette_town_hallManifest, osmWays: lm_esch_sur_alzette_town_hallWays, create: lm_esch_sur_alzette_town_hallCreate, views: lm_esch_sur_alzette_town_hallViews },
  'faro-moncloa': { manifest: lm_faro_moncloaManifest, osmWays: lm_faro_moncloaWays, create: lm_faro_moncloaCreate, views: lm_faro_moncloaViews },
  'flagey-building': { manifest: lm_flagey_buildingManifest, osmWays: lm_flagey_buildingWays, create: lm_flagey_buildingCreate, views: lm_flagey_buildingViews },
  'fondation-vasarely-aix': { manifest: lm_fondation_vasarely_aixManifest, osmWays: lm_fondation_vasarely_aixWays, create: lm_fondation_vasarely_aixCreate, views: lm_fondation_vasarely_aixViews },
  'fort-chambly': { manifest: lm_fort_chamblyManifest, osmWays: lm_fort_chamblyWays, create: lm_fort_chamblyCreate, views: lm_fort_chamblyViews },
  'fort-langley-community-hall': { manifest: lm_fort_langley_community_hallManifest, osmWays: lm_fort_langley_community_hallWays, create: lm_fort_langley_community_hallCreate, views: lm_fort_langley_community_hallViews },
  'fortin-heredia': { manifest: lm_fortin_herediaManifest, osmWays: lm_fortin_herediaWays, create: lm_fortin_herediaCreate, views: lm_fortin_herediaViews },
  'gare-oriente': { manifest: lm_gare_orienteManifest, osmWays: lm_gare_orienteWays, create: lm_gare_orienteCreate, views: lm_gare_orienteViews },
  'gas-south-arena': { manifest: lm_gas_south_arenaManifest, osmWays: lm_gas_south_arenaWays, create: lm_gas_south_arenaCreate, views: lm_gas_south_arenaViews },
  'gasometro-rome': { manifest: lm_gasometro_romeManifest, osmWays: lm_gasometro_romeWays, create: lm_gasometro_romeCreate, views: lm_gasometro_romeViews },
  'ghent-belfry': { manifest: lm_ghent_belfryManifest, osmWays: lm_ghent_belfryWays, create: lm_ghent_belfryCreate, views: lm_ghent_belfryViews },
  'grand-hotel-dieu-lyon': { manifest: lm_grand_hotel_dieu_lyonManifest, osmWays: lm_grand_hotel_dieu_lyonWays, create: lm_grand_hotel_dieu_lyonCreate, views: lm_grand_hotel_dieu_lyonViews },
  'grosse-cloche-bordeaux': { manifest: lm_grosse_cloche_bordeauxManifest, osmWays: lm_grosse_cloche_bordeauxWays, create: lm_grosse_cloche_bordeauxCreate, views: lm_grosse_cloche_bordeauxViews },
  'gur-sikh-temple': { manifest: lm_gur_sikh_templeManifest, osmWays: lm_gur_sikh_templeWays, create: lm_gur_sikh_templeCreate, views: lm_gur_sikh_templeViews },
  'gwinnett-historic-courthouse': { manifest: lm_gwinnett_historic_courthouseManifest, osmWays: lm_gwinnett_historic_courthouseWays, create: lm_gwinnett_historic_courthouseCreate, views: lm_gwinnett_historic_courthouseViews },
  'haney-house': { manifest: lm_haney_houseManifest, osmWays: lm_haney_houseWays, create: lm_haney_houseCreate, views: lm_haney_houseViews },
  'heritage-plaza-houston': { manifest: lm_heritage_plaza_houstonManifest, osmWays: lm_heritage_plaza_houstonWays, create: lm_heritage_plaza_houstonCreate, views: lm_heritage_plaza_houstonViews },
  'hillsboro-inlet-lighthouse': { manifest: lm_hillsboro_inlet_lighthouseManifest, osmWays: lm_hillsboro_inlet_lighthouseWays, create: lm_hillsboro_inlet_lighthouseCreate, views: lm_hillsboro_inlet_lighthouseViews },
  'honda-center': { manifest: lm_honda_centerManifest, osmWays: lm_honda_centerWays, create: lm_honda_centerCreate, views: lm_honda_centerViews },
  'hotel-de-ville-grenoble': { manifest: lm_hotel_de_ville_grenobleManifest, osmWays: lm_hotel_de_ville_grenobleWays, create: lm_hotel_de_ville_grenobleCreate, views: lm_hotel_de_ville_grenobleViews },
  'hotel-okura-amsterdam': { manifest: lm_hotel_okura_amsterdamManifest, osmWays: lm_hotel_okura_amsterdamWays, create: lm_hotel_okura_amsterdamCreate, views: lm_hotel_okura_amsterdamViews },
  'houston-city-hall': { manifest: lm_houston_city_hallManifest, osmWays: lm_houston_city_hallWays, create: lm_houston_city_hallCreate, views: lm_houston_city_hallViews },
  'hypo-haus-munich': { manifest: lm_hypo_haus_munichManifest, osmWays: lm_hypo_haus_munichWays, create: lm_hypo_haus_munichCreate, views: lm_hypo_haus_munichViews },
  'iglesia-merced-san-jose': { manifest: lm_iglesia_merced_san_joseManifest, osmWays: lm_iglesia_merced_san_joseWays, create: lm_iglesia_merced_san_joseCreate, views: lm_iglesia_merced_san_joseViews },
  'inntel-zaandam': { manifest: lm_inntel_zaandamManifest, osmWays: lm_inntel_zaandamWays, create: lm_inntel_zaandamCreate, views: lm_inntel_zaandamViews },
  'intercontinental-bucharest': { manifest: lm_intercontinental_bucharestManifest, osmWays: lm_intercontinental_bucharestWays, create: lm_intercontinental_bucharestCreate, views: lm_intercontinental_bucharestViews },
  'ito-tower': { manifest: lm_ito_towerManifest, osmWays: lm_ito_towerWays, create: lm_ito_towerCreate, views: lm_ito_towerViews },
  'jerusalem-ymca': { manifest: lm_jerusalem_ymcaManifest, osmWays: lm_jerusalem_ymcaWays, create: lm_jerusalem_ymcaCreate, views: lm_jerusalem_ymcaViews },
  'jpmorgan-chase-tower-dallas': { manifest: lm_jpmorgan_chase_tower_dallasManifest, osmWays: lm_jpmorgan_chase_tower_dallasWays, create: lm_jpmorgan_chase_tower_dallasCreate, views: lm_jpmorgan_chase_tower_dallasViews },
  'kaknas-tower': { manifest: lm_kaknas_towerManifest, osmWays: lm_kaknas_towerWays, create: lm_kaknas_towerCreate, views: lm_kaknas_towerViews },
  'kansas-city-city-hall': { manifest: lm_kansas_city_city_hallManifest, osmWays: lm_kansas_city_city_hallWays, create: lm_kansas_city_city_hallCreate, views: lm_kansas_city_city_hallViews },
  'kauffman-center-kansas-city': { manifest: lm_kauffman_center_kansas_cityManifest, osmWays: lm_kauffman_center_kansas_cityWays, create: lm_kauffman_center_kansas_cityCreate, views: lm_kauffman_center_kansas_cityViews },
  'kista-science-tower': { manifest: lm_kista_science_towerManifest, osmWays: lm_kista_science_towerWays, create: lm_kista_science_towerCreate, views: lm_kista_science_towerViews },
  'koekelberg-basilica': { manifest: lm_koekelberg_basilicaManifest, osmWays: lm_koekelberg_basilicaWays, create: lm_koekelberg_basilicaCreate, views: lm_koekelberg_basilicaViews },
  'la-rosaleda': { manifest: lm_la_rosaledaManifest, osmWays: lm_la_rosaledaWays, create: lm_la_rosaledaCreate, views: lm_la_rosaledaViews },
  'library-of-birmingham': { manifest: lm_library_of_birminghamManifest, osmWays: lm_library_of_birminghamWays, create: lm_library_of_birminghamCreate, views: lm_library_of_birminghamViews },
  'liege-guillemins': { manifest: lm_liege_guilleminsManifest, osmWays: lm_liege_guilleminsWays, create: lm_liege_guilleminsCreate, views: lm_liege_guilleminsViews },
  'london-stadium': { manifest: lm_london_stadiumManifest, osmWays: lm_london_stadiumWays, create: lm_london_stadiumCreate, views: lm_london_stadiumViews },
  'lviv-town-hall': { manifest: lm_lviv_town_hallManifest, osmWays: lm_lviv_town_hallWays, create: lm_lviv_town_hallCreate, views: lm_lviv_town_hallViews },
  'maison-carree-nimes': { manifest: lm_maison_carree_nimesManifest, osmWays: lm_maison_carree_nimesWays, create: lm_maison_carree_nimesCreate, views: lm_maison_carree_nimesViews },
  'maison-de-la-radio': { manifest: lm_maison_de_la_radioManifest, osmWays: lm_maison_de_la_radioWays, create: lm_maison_de_la_radioCreate, views: lm_maison_de_la_radioViews },
  'malaga-cathedral': { manifest: lm_malaga_cathedralManifest, osmWays: lm_malaga_cathedralWays, create: lm_malaga_cathedralCreate, views: lm_malaga_cathedralViews },
  'markham-civic-centre': { manifest: lm_markham_civic_centreManifest, osmWays: lm_markham_civic_centreWays, create: lm_markham_civic_centreCreate, views: lm_markham_civic_centreViews },
  'mausoleum-carol-park': { manifest: lm_mausoleum_carol_parkManifest, osmWays: lm_mausoleum_carol_parkWays, create: lm_mausoleum_carol_parkCreate, views: lm_mausoleum_carol_parkViews },
  'meyerson-symphony-center': { manifest: lm_meyerson_symphony_centerManifest, osmWays: lm_meyerson_symphony_centerWays, create: lm_meyerson_symphony_centerCreate, views: lm_meyerson_symphony_centerViews },
  'mission-san-juan-capistrano': { manifest: lm_mission_san_juan_capistranoManifest, osmWays: lm_mission_san_juan_capistranoWays, create: lm_mission_san_juan_capistranoCreate, views: lm_mission_san_juan_capistranoViews },
  'mississauga-civic-centre': { manifest: lm_mississauga_civic_centreManifest, osmWays: lm_mississauga_civic_centreWays, create: lm_mississauga_civic_centreCreate, views: lm_mississauga_civic_centreViews },
  'mondriaan-tower': { manifest: lm_mondriaan_towerManifest, osmWays: lm_mondriaan_towerWays, create: lm_mondriaan_towerCreate, views: lm_mondriaan_towerViews },
  'moshe-aviv-tower': { manifest: lm_moshe_aviv_towerManifest, osmWays: lm_moshe_aviv_towerWays, create: lm_moshe_aviv_towerCreate, views: lm_moshe_aviv_towerViews },
  'moulin-neuf-terrebonne': { manifest: lm_moulin_neuf_terrebonneManifest, osmWays: lm_moulin_neuf_terrebonneWays, create: lm_moulin_neuf_terrebonneCreate, views: lm_moulin_neuf_terrebonneViews },
  'mt-bank-stadium-baltimore': { manifest: lm_mt_bank_stadium_baltimoreManifest, osmWays: lm_mt_bank_stadium_baltimoreWays, create: lm_mt_bank_stadium_baltimoreCreate, views: lm_mt_bank_stadium_baltimoreViews },
  'museo-arte-costarricense': { manifest: lm_museo_arte_costarricenseManifest, osmWays: lm_museo_arte_costarricenseWays, create: lm_museo_arte_costarricenseCreate, views: lm_museo_arte_costarricenseViews },
  'namur-saint-aubin': { manifest: lm_namur_saint_aubinManifest, osmWays: lm_namur_saint_aubinWays, create: lm_namur_saint_aubinCreate, views: lm_namur_saint_aubinViews },
  'national-library-romania': { manifest: lm_national_library_romaniaManifest, osmWays: lm_national_library_romaniaWays, create: lm_national_library_romaniaCreate, views: lm_national_library_romaniaViews },
  'national-space-centre': { manifest: lm_national_space_centreManifest, osmWays: lm_national_space_centreWays, create: lm_national_space_centreCreate, views: lm_national_space_centreViews },
  'national-theatre-bucharest': { manifest: lm_national_theatre_bucharestManifest, osmWays: lm_national_theatre_bucharestWays, create: lm_national_theatre_bucharestCreate, views: lm_national_theatre_bucharestViews },
  'national-theatre-london': { manifest: lm_national_theatre_londonManifest, osmWays: lm_national_theatre_londonWays, create: lm_national_theatre_londonCreate, views: lm_national_theatre_londonViews },
  'nhow-amsterdam-rai': { manifest: lm_nhow_amsterdam_raiManifest, osmWays: lm_nhow_amsterdam_raiWays, create: lm_nhow_amsterdam_raiCreate, views: lm_nhow_amsterdam_raiViews },
  'nottingham-council-house': { manifest: lm_nottingham_council_houseManifest, osmWays: lm_nottingham_council_houseWays, create: lm_nottingham_council_houseCreate, views: lm_nottingham_council_houseViews },
  'nrg-stadium': { manifest: lm_nrg_stadiumManifest, osmWays: lm_nrg_stadiumWays, create: lm_nrg_stadiumCreate, views: lm_nrg_stadiumViews },
  'ohio-stadium': { manifest: lm_ohio_stadiumManifest, osmWays: lm_ohio_stadiumWays, create: lm_ohio_stadiumCreate, views: lm_ohio_stadiumViews },
  'olympiaturm-munich': { manifest: lm_olympiaturm_munichManifest, osmWays: lm_olympiaturm_munichWays, create: lm_olympiaturm_munichCreate, views: lm_olympiaturm_munichViews },
  'olympic-stadium-amsterdam': { manifest: lm_olympic_stadium_amsterdamManifest, osmWays: lm_olympic_stadium_amsterdamWays, create: lm_olympic_stadium_amsterdamCreate, views: lm_olympic_stadium_amsterdamViews },
  'one-canada-square': { manifest: lm_one_canada_squareManifest, osmWays: lm_one_canada_squareWays, create: lm_one_canada_squareCreate, views: lm_one_canada_squareViews },
  'oriole-park-camden-yards': { manifest: lm_oriole_park_camden_yardsManifest, osmWays: lm_oriole_park_camden_yardsWays, create: lm_oriole_park_camden_yardsCreate, views: lm_oriole_park_camden_yardsViews },
  'padrao-descobrimentos': { manifest: lm_padrao_descobrimentosManifest, osmWays: lm_padrao_descobrimentosWays, create: lm_padrao_descobrimentosCreate, views: lm_padrao_descobrimentosViews },
  'palais-de-l-isle-annecy': { manifest: lm_palais_de_l_isle_annecyManifest, osmWays: lm_palais_de_l_isle_annecyWays, create: lm_palais_de_l_isle_annecyCreate, views: lm_palais_de_l_isle_annecyViews },
  'palais-de-la-porte-doree': { manifest: lm_palais_de_la_porte_doreeManifest, osmWays: lm_palais_de_la_porte_doreeWays, create: lm_palais_de_la_porte_doreeCreate, views: lm_palais_de_la_porte_doreeViews },
  'palais-des-congres-paris': { manifest: lm_palais_des_congres_parisManifest, osmWays: lm_palais_des_congres_parisWays, create: lm_palais_des_congres_parisCreate, views: lm_palais_des_congres_parisViews },
  'palais-des-papes-avignon': { manifest: lm_palais_des_papes_avignonManifest, osmWays: lm_palais_des_papes_avignonWays, create: lm_palais_des_papes_avignonCreate, views: lm_palais_des_papes_avignonViews },
  'palazzo-civilta-italiana': { manifest: lm_palazzo_civilta_italianaManifest, osmWays: lm_palazzo_civilta_italianaWays, create: lm_palazzo_civilta_italianaCreate, views: lm_palazzo_civilta_italianaViews },
  'parc-des-princes': { manifest: lm_parc_des_princesManifest, osmWays: lm_parc_des_princesWays, create: lm_parc_des_princesCreate, views: lm_parc_des_princesViews },
  'parlement-europeen-louise-weiss': { manifest: lm_parlement_europeen_louise_weissManifest, osmWays: lm_parlement_europeen_louise_weissWays, create: lm_parlement_europeen_louise_weissCreate, views: lm_parlement_europeen_louise_weissViews },
  'parus-business-centre': { manifest: lm_parus_business_centreManifest, osmWays: lm_parus_business_centreWays, create: lm_parus_business_centreCreate, views: lm_parus_business_centreViews },
  'perris-depot': { manifest: lm_perris_depotManifest, osmWays: lm_perris_depotWays, create: lm_perris_depotCreate, views: lm_perris_depotViews },
  'phare-de-verzenay': { manifest: lm_phare_de_verzenayManifest, osmWays: lm_phare_de_verzenayWays, create: lm_phare_de_verzenayCreate, views: lm_phare_de_verzenayViews },
  'philharmonie-luxembourg': { manifest: lm_philharmonie_luxembourgManifest, osmWays: lm_philharmonie_luxembourgWays, create: lm_philharmonie_luxembourgCreate, views: lm_philharmonie_luxembourgViews },
  'place-bell-laval': { manifest: lm_place_bell_lavalManifest, osmWays: lm_place_bell_lavalWays, create: lm_place_bell_lavalCreate, views: lm_place_bell_lavalViews },
  'pontsteiger': { manifest: lm_pontsteigerManifest, osmWays: lm_pontsteigerWays, create: lm_pontsteigerCreate, views: lm_pontsteigerViews },
  'port-coquitlam-city-hall': { manifest: lm_port_coquitlam_city_hallManifest, osmWays: lm_port_coquitlam_city_hallWays, create: lm_port_coquitlam_city_hallCreate, views: lm_port_coquitlam_city_hallViews },
  'porte-cailhau-bordeaux': { manifest: lm_porte_cailhau_bordeauxManifest, osmWays: lm_porte_cailhau_bordeauxWays, create: lm_porte_cailhau_bordeauxCreate, views: lm_porte_cailhau_bordeauxViews },
  'porte-de-la-craffe': { manifest: lm_porte_de_la_craffeManifest, osmWays: lm_porte_de_la_craffeWays, create: lm_porte_de_la_craffeCreate, views: lm_porte_de_la_craffeViews },
  'portland-union-station': { manifest: lm_portland_union_stationManifest, osmWays: lm_portland_union_stationWays, create: lm_portland_union_stationCreate, views: lm_portland_union_stationViews },
  'prime-tower-zurich': { manifest: lm_prime_tower_zurichManifest, osmWays: lm_prime_tower_zurichWays, create: lm_prime_tower_zurichCreate, views: lm_prime_tower_zurichViews },
  'pyramid-cestius': { manifest: lm_pyramid_cestiusManifest, osmWays: lm_pyramid_cestiusWays, create: lm_pyramid_cestiusCreate, views: lm_pyramid_cestiusViews },
  'rai-elicium': { manifest: lm_rai_eliciumManifest, osmWays: lm_rai_eliciumWays, create: lm_rai_eliciumCreate, views: lm_rai_eliciumViews },
  'red-brick-courthouse-rockville': { manifest: lm_red_brick_courthouse_rockvilleManifest, osmWays: lm_red_brick_courthouse_rockvilleWays, create: lm_red_brick_courthouse_rockvilleCreate, views: lm_red_brick_courthouse_rockvilleViews },
  'rembrandt-tower': { manifest: lm_rembrandt_towerManifest, osmWays: lm_rembrandt_towerWays, create: lm_rembrandt_towerCreate, views: lm_rembrandt_towerViews },
  'renaissance-tower-dallas': { manifest: lm_renaissance_tower_dallasManifest, osmWays: lm_renaissance_tower_dallasWays, create: lm_renaissance_tower_dallasCreate, views: lm_renaissance_tower_dallasViews },
  'rhodes-state-office-tower': { manifest: lm_rhodes_state_office_towerManifest, osmWays: lm_rhodes_state_office_towerWays, create: lm_rhodes_state_office_towerCreate, views: lm_rhodes_state_office_towerViews },
  'riverside-fox-theater': { manifest: lm_riverside_fox_theaterManifest, osmWays: lm_riverside_fox_theaterWays, create: lm_riverside_fox_theaterCreate, views: lm_riverside_fox_theaterViews },
  'sage-gateshead': { manifest: lm_sage_gatesheadManifest, osmWays: lm_sage_gatesheadWays, create: lm_sage_gatesheadCreate, views: lm_sage_gatesheadViews },
  'saint-paul-cathedral-liege': { manifest: lm_saint_paul_cathedral_liegeManifest, osmWays: lm_saint_paul_cathedral_liegeWays, create: lm_saint_paul_cathedral_liegeCreate, views: lm_saint_paul_cathedral_liegeViews },
  'san-bernardino-county-courthouse': { manifest: lm_san_bernardino_county_courthouseManifest, osmWays: lm_san_bernardino_county_courthouseWays, create: lm_san_bernardino_county_courthouseCreate, views: lm_san_bernardino_county_courthouseViews },
  'san-giovanni-laterano': { manifest: lm_san_giovanni_lateranoManifest, osmWays: lm_san_giovanni_lateranoWays, create: lm_san_giovanni_lateranoCreate, views: lm_san_giovanni_lateranoViews },
  'san-pedro-claver-cartagena': { manifest: lm_san_pedro_claver_cartagenaManifest, osmWays: lm_san_pedro_claver_cartagenaWays, create: lm_san_pedro_claver_cartagenaCreate, views: lm_san_pedro_claver_cartagenaViews },
  'sanford-stadium': { manifest: lm_sanford_stadiumManifest, osmWays: lm_sanford_stadiumWays, create: lm_sanford_stadiumCreate, views: lm_sanford_stadiumViews },
  'santa-justa-lift': { manifest: lm_santa_justa_liftManifest, osmWays: lm_santa_justa_liftWays, create: lm_santa_justa_liftCreate, views: lm_santa_justa_liftViews },
  'santa-maria-maggiore': { manifest: lm_santa_maria_maggioreManifest, osmWays: lm_santa_maria_maggioreWays, create: lm_santa_maria_maggioreCreate, views: lm_santa_maria_maggioreViews },
  'savage-mill': { manifest: lm_savage_millManifest, osmWays: lm_savage_millWays, create: lm_savage_millCreate, views: lm_savage_millViews },
  'seven-foot-knoll-lighthouse': { manifest: lm_seven_foot_knoll_lighthouseManifest, osmWays: lm_seven_foot_knoll_lighthouseWays, create: lm_seven_foot_knoll_lighthouseCreate, views: lm_seven_foot_knoll_lighthouseViews },
  'shrine-of-the-book': { manifest: lm_shrine_of_the_bookManifest, osmWays: lm_shrine_of_the_bookWays, create: lm_shrine_of_the_bookCreate, views: lm_shrine_of_the_bookViews },
  'siegestor-munich': { manifest: lm_siegestor_munichManifest, osmWays: lm_siegestor_munichWays, create: lm_siegestor_munichCreate, views: lm_siegestor_munichViews },
  'skytower-bucharest': { manifest: lm_skytower_bucharestManifest, osmWays: lm_skytower_bucharestWays, create: lm_skytower_bucharestCreate, views: lm_skytower_bucharestViews },
  'spire-of-dublin': { manifest: lm_spire_of_dublinManifest, osmWays: lm_spire_of_dublinWays, create: lm_spire_of_dublinCreate, views: lm_spire_of_dublinViews },
  'st-louis-union-station': { manifest: lm_st_louis_union_stationManifest, osmWays: lm_st_louis_union_stationWays, create: lm_st_louis_union_stationCreate, views: lm_st_louis_union_stationViews },
  'st-michaels-church-cluj': { manifest: lm_st_michaels_church_clujManifest, osmWays: lm_st_michaels_church_clujWays, create: lm_st_michaels_church_clujCreate, views: lm_st_michaels_church_clujViews },
  'stade-des-alpes': { manifest: lm_stade_des_alpesManifest, osmWays: lm_stade_des_alpesWays, create: lm_stade_des_alpesCreate, views: lm_stade_des_alpesViews },
  'stade-mayol-toulon': { manifest: lm_stade_mayol_toulonManifest, osmWays: lm_stade_mayol_toulonWays, create: lm_stade_mayol_toulonCreate, views: lm_stade_mayol_toulonViews },
  'stade-pierre-mauroy': { manifest: lm_stade_pierre_mauroyManifest, osmWays: lm_stade_pierre_mauroyWays, create: lm_stade_pierre_mauroyCreate, views: lm_stade_pierre_mauroyViews },
  'stockholm-city-hall': { manifest: lm_stockholm_city_hallManifest, osmWays: lm_stockholm_city_hallWays, create: lm_stockholm_city_hallCreate, views: lm_stockholm_city_hallViews },
  'stone-mountain-carillon': { manifest: lm_stone_mountain_carillonManifest, osmWays: lm_stone_mountain_carillonWays, create: lm_stone_mountain_carillonCreate, views: lm_stone_mountain_carillonViews },
  'strat-tower-las-vegas': { manifest: lm_strat_tower_las_vegasManifest, osmWays: lm_strat_tower_las_vegasWays, create: lm_strat_tower_las_vegasCreate, views: lm_strat_tower_las_vegasViews },
  'stuttgart-hauptbahnhof-tower': { manifest: lm_stuttgart_hauptbahnhof_towerManifest, osmWays: lm_stuttgart_hauptbahnhof_towerWays, create: lm_stuttgart_hauptbahnhof_towerCreate, views: lm_stuttgart_hauptbahnhof_towerViews },
  'surrey-city-hall': { manifest: lm_surrey_city_hallManifest, osmWays: lm_surrey_city_hallWays, create: lm_surrey_city_hallCreate, views: lm_surrey_city_hallViews },
  'tagblatt-turm-stuttgart': { manifest: lm_tagblatt_turm_stuttgartManifest, osmWays: lm_tagblatt_turm_stuttgartWays, create: lm_tagblatt_turm_stuttgartCreate, views: lm_tagblatt_turm_stuttgartViews },
  'tate-modern': { manifest: lm_tate_modernManifest, osmWays: lm_tate_modernWays, create: lm_tate_modernCreate, views: lm_tate_modernViews },
  'tbilisi-tv-tower': { manifest: lm_tbilisi_tv_towerManifest, osmWays: lm_tbilisi_tv_towerWays, create: lm_tbilisi_tv_towerCreate, views: lm_tbilisi_tv_towerViews },
  'temple-saint-martin-montbeliard': { manifest: lm_temple_saint_martin_montbeliardManifest, osmWays: lm_temple_saint_martin_montbeliardWays, create: lm_temple_saint_martin_montbeliardCreate, views: lm_temple_saint_martin_montbeliardViews },
  'texas-star-ferris-wheel': { manifest: lm_texas_star_ferris_wheelManifest, osmWays: lm_texas_star_ferris_wheelWays, create: lm_texas_star_ferris_wheelCreate, views: lm_texas_star_ferris_wheelViews },
  'the-o2-london': { manifest: lm_the_o2_londonManifest, osmWays: lm_the_o2_londonWays, create: lm_the_o2_londonCreate, views: lm_the_o2_londonViews },
  'the-rock-amsterdam': { manifest: lm_the_rock_amsterdamManifest, osmWays: lm_the_rock_amsterdamWays, create: lm_the_rock_amsterdamCreate, views: lm_the_rock_amsterdamViews },
  'toronto-ontario-temple-brampton': { manifest: lm_toronto_ontario_temple_bramptonManifest, osmWays: lm_toronto_ontario_temple_bramptonWays, create: lm_toronto_ontario_temple_bramptonCreate, views: lm_toronto_ontario_temple_bramptonViews },
  'torre-cali': { manifest: lm_torre_caliManifest, osmWays: lm_torre_caliWays, create: lm_torre_caliCreate, views: lm_torre_caliViews },
  'torre-reloj-cartagena': { manifest: lm_torre_reloj_cartagenaManifest, osmWays: lm_torre_reloj_cartagenaWays, create: lm_torre_reloj_cartagenaCreate, views: lm_torre_reloj_cartagenaViews },
  'torres-paseo-colon': { manifest: lm_torres_paseo_colonManifest, osmWays: lm_torres_paseo_colonWays, create: lm_torres_paseo_colonCreate, views: lm_torres_paseo_colonViews },
  'torrespana': { manifest: lm_torrespanaManifest, osmWays: lm_torrespanaWays, create: lm_torrespanaCreate, views: lm_torrespanaViews },
  'tour-alto': { manifest: lm_tour_altoManifest, osmWays: lm_tour_altoWays, create: lm_tour_altoCreate, views: lm_tour_altoViews },
  'tour-bretagne-nantes': { manifest: lm_tour_bretagne_nantesManifest, osmWays: lm_tour_bretagne_nantesWays, create: lm_tour_bretagne_nantesCreate, views: lm_tour_bretagne_nantesViews },
  'tour-carpe-diem': { manifest: lm_tour_carpe_diemManifest, osmWays: lm_tour_carpe_diemWays, create: lm_tour_carpe_diemCreate, views: lm_tour_carpe_diemViews },
  'tour-cma-cgm': { manifest: lm_tour_cma_cgmManifest, osmWays: lm_tour_cma_cgmWays, create: lm_tour_cma_cgmCreate, views: lm_tour_cma_cgmViews },
  'tour-d2': { manifest: lm_tour_d2Manifest, osmWays: lm_tour_d2Ways, create: lm_tour_d2Create, views: lm_tour_d2Views },
  'tour-de-la-miotte': { manifest: lm_tour_de_la_miotteManifest, osmWays: lm_tour_de_la_miotteWays, create: lm_tour_de_la_miotteCreate, views: lm_tour_de_la_miotteViews },
  'tour-de-leurope-mulhouse': { manifest: lm_tour_de_leurope_mulhouseManifest, osmWays: lm_tour_de_leurope_mulhouseWays, create: lm_tour_de_leurope_mulhouseCreate, views: lm_tour_de_leurope_mulhouseViews },
  'tour-de-lille': { manifest: lm_tour_de_lilleManifest, osmWays: lm_tour_de_lilleWays, create: lm_tour_de_lilleCreate, views: lm_tour_de_lilleViews },
  'tour-des-archives-rouen': { manifest: lm_tour_des_archives_rouenManifest, osmWays: lm_tour_des_archives_rouenWays, create: lm_tour_des_archives_rouenCreate, views: lm_tour_des_archives_rouenViews },
  'tour-du-midi': { manifest: lm_tour_du_midiManifest, osmWays: lm_tour_du_midiWays, create: lm_tour_du_midiCreate, views: lm_tour_du_midiViews },
  'tour-elithis-dijon': { manifest: lm_tour_elithis_dijonManifest, osmWays: lm_tour_elithis_dijonWays, create: lm_tour_elithis_dijonCreate, views: lm_tour_elithis_dijonViews },
  'tour-first': { manifest: lm_tour_firstManifest, osmWays: lm_tour_firstWays, create: lm_tour_firstCreate, views: lm_tour_firstViews },
  'tour-la-marseillaise': { manifest: lm_tour_la_marseillaiseManifest, osmWays: lm_tour_la_marseillaiseWays, create: lm_tour_la_marseillaiseCreate, views: lm_tour_la_marseillaiseViews },
  'tour-lanterne-rochelle': { manifest: lm_tour_lanterne_rochelleManifest, osmWays: lm_tour_lanterne_rochelleWays, create: lm_tour_lanterne_rochelleCreate, views: lm_tour_lanterne_rochelleViews },
  'tour-lu-nantes': { manifest: lm_tour_lu_nantesManifest, osmWays: lm_tour_lu_nantesWays, create: lm_tour_lu_nantesCreate, views: lm_tour_lu_nantesViews },
  'tour-metallique-fourviere': { manifest: lm_tour_metallique_fourviereManifest, osmWays: lm_tour_metallique_fourviereWays, create: lm_tour_metallique_fourviereCreate, views: lm_tour_metallique_fourviereViews },
  'tour-oxygene': { manifest: lm_tour_oxygeneManifest, osmWays: lm_tour_oxygeneWays, create: lm_tour_oxygeneCreate, views: lm_tour_oxygeneViews },
  'tour-paradis-liege': { manifest: lm_tour_paradis_liegeManifest, osmWays: lm_tour_paradis_liegeWays, create: lm_tour_paradis_liegeCreate, views: lm_tour_paradis_liegeViews },
  'tour-perret-grenoble': { manifest: lm_tour_perret_grenobleManifest, osmWays: lm_tour_perret_grenobleWays, create: lm_tour_perret_grenobleCreate, views: lm_tour_perret_grenobleViews },
  'tour-pey-berland': { manifest: lm_tour_pey_berlandManifest, osmWays: lm_tour_pey_berlandWays, create: lm_tour_pey_berlandCreate, views: lm_tour_pey_berlandViews },
  'tour-royale-toulon': { manifest: lm_tour_royale_toulonManifest, osmWays: lm_tour_royale_toulonWays, create: lm_tour_royale_toulonCreate, views: lm_tour_royale_toulonViews },
  'tour-saint-aubin-angers': { manifest: lm_tour_saint_aubin_angersManifest, osmWays: lm_tour_saint_aubin_angersWays, create: lm_tour_saint_aubin_angersCreate, views: lm_tour_saint_aubin_angersViews },
  'tour-saint-gobain': { manifest: lm_tour_saint_gobainManifest, osmWays: lm_tour_saint_gobainWays, create: lm_tour_saint_gobainCreate, views: lm_tour_saint_gobainViews },
  'tour-saint-nicolas-rochelle': { manifest: lm_tour_saint_nicolas_rochelleManifest, osmWays: lm_tour_saint_nicolas_rochelleWays, create: lm_tour_saint_nicolas_rochelleCreate, views: lm_tour_saint_nicolas_rochelleViews },
  'tour-t1': { manifest: lm_tour_t1Manifest, osmWays: lm_tour_t1Ways, create: lm_tour_t1Create, views: lm_tour_t1Views },
  'tour-total-coupole': { manifest: lm_tour_total_coupoleManifest, osmWays: lm_tour_total_coupoleWays, create: lm_tour_total_coupoleCreate, views: lm_tour_total_coupoleViews },
  'tour-trinity': { manifest: lm_tour_trinityManifest, osmWays: lm_tour_trinityWays, create: lm_tour_trinityCreate, views: lm_tour_trinityViews },
  'tovrea-castle': { manifest: lm_tovrea_castleManifest, osmWays: lm_tovrea_castleWays, create: lm_tovrea_castleCreate, views: lm_tovrea_castleViews },
  'trethewey-house': { manifest: lm_trethewey_houseManifest, osmWays: lm_trethewey_houseWays, create: lm_trethewey_houseCreate, views: lm_trethewey_houseViews },
  'tribunal-de-paris': { manifest: lm_tribunal_de_parisManifest, osmWays: lm_tribunal_de_parisWays, create: lm_tribunal_de_parisCreate, views: lm_tribunal_de_parisViews },
  'tustin-south-hangar': { manifest: lm_tustin_south_hangarManifest, osmWays: lm_tustin_south_hangarWays, create: lm_tustin_south_hangarCreate, views: lm_tustin_south_hangarViews },
  'ucr-bell-tower': { manifest: lm_ucr_bell_towerManifest, osmWays: lm_ucr_bell_towerWays, create: lm_ucr_bell_towerCreate, views: lm_ucr_bell_towerViews },
  'uga-arch': { manifest: lm_uga_archManifest, osmWays: lm_uga_archWays, create: lm_uga_archCreate, views: lm_uga_archViews },
  'vinoly-tower-amsterdam': { manifest: lm_vinoly_tower_amsterdamManifest, osmWays: lm_vinoly_tower_amsterdamWays, create: lm_vinoly_tower_amsterdamCreate, views: lm_vinoly_tower_amsterdamViews },
  'walter-reed-tower-bethesda': { manifest: lm_walter_reed_tower_bethesdaManifest, osmWays: lm_walter_reed_tower_bethesdaWays, create: lm_walter_reed_tower_bethesdaCreate, views: lm_walter_reed_tower_bethesdaViews },
  'walton-historic-courthouse': { manifest: lm_walton_historic_courthouseManifest, osmWays: lm_walton_historic_courthouseWays, create: lm_walton_historic_courthouseCreate, views: lm_walton_historic_courthouseViews },
  'will-rogers-memorial-center': { manifest: lm_will_rogers_memorial_centerManifest, osmWays: lm_will_rogers_memorial_centerWays, create: lm_will_rogers_memorial_centerCreate, views: lm_will_rogers_memorial_centerViews },
  'winspear-opera-house': { manifest: lm_winspear_opera_houseManifest, osmWays: lm_winspear_opera_houseWays, create: lm_winspear_opera_houseCreate, views: lm_winspear_opera_houseViews },
  'ziggo-dome': { manifest: lm_ziggo_domeManifest, osmWays: lm_ziggo_domeWays, create: lm_ziggo_domeCreate, views: lm_ziggo_domeViews },
  'ziggurat-west-sacramento': { manifest: lm_ziggurat_west_sacramentoManifest, osmWays: lm_ziggurat_west_sacramentoWays, create: lm_ziggurat_west_sacramentoCreate, views: lm_ziggurat_west_sacramentoViews },
};

export const TOP_CITIES_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const topCitiesLandmark = (id) => TOP_CITIES_LANDMARKS.find((l) => l.id === id) || null;
