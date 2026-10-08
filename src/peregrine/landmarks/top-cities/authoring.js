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
};

export const TOP_CITIES_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const topCitiesLandmark = (id) => TOP_CITIES_LANDMARKS.find((l) => l.id === id) || null;
