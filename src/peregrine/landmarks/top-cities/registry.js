// The top-cities landmark registry the RUNTIME reads: spec, palettes, footprints and (for a road-carrying
// bridge) its road layer. Geometry, views and manifest text are authoring-time only (authoring.js).
// File contract: docs/3d-top-cities-landmarks.md.
import { SPEC as lm_tower_bridgeSpec, PALETTES as lm_tower_bridgePalettes } from './tower-bridge/config.js';
import { FOOTPRINTS as lm_tower_bridgeFootprints } from './tower-bridge/footprint.js';
import { ROAD_LAYER as lm_tower_bridgeRoad } from './tower-bridge/layer.js';
import { SPEC as lm_palace_of_westminsterSpec, PALETTES as lm_palace_of_westminsterPalettes } from './palace-of-westminster/config.js';
import { FOOTPRINTS as lm_palace_of_westminsterFootprints } from './palace-of-westminster/footprint.js';
import { SPEC as lm_st_pauls_cathedralSpec, PALETTES as lm_st_pauls_cathedralPalettes } from './st-pauls-cathedral/config.js';
import { FOOTPRINTS as lm_st_pauls_cathedralFootprints } from './st-pauls-cathedral/footprint.js';
import { SPEC as lm_the_shardSpec, PALETTES as lm_the_shardPalettes } from './the-shard/config.js';
import { FOOTPRINTS as lm_the_shardFootprints } from './the-shard/footprint.js';
import { SPEC as lm_rijksmuseumSpec, PALETTES as lm_rijksmuseumPalettes } from './rijksmuseum/config.js';
import { FOOTPRINTS as lm_rijksmuseumFootprints } from './rijksmuseum/footprint.js';
import { SPEC as lm_amsterdam_centraalSpec, PALETTES as lm_amsterdam_centraalPalettes } from './amsterdam-centraal/config.js';
import { FOOTPRINTS as lm_amsterdam_centraalFootprints } from './amsterdam-centraal/footprint.js';
import { SPEC as lm_eye_filmmuseumSpec, PALETTES as lm_eye_filmmuseumPalettes } from './eye-filmmuseum/config.js';
import { FOOTPRINTS as lm_eye_filmmuseumFootprints } from './eye-filmmuseum/footprint.js';
import { SPEC as lm_palacio_real_de_madridSpec, PALETTES as lm_palacio_real_de_madridPalettes } from './palacio-real-de-madrid/config.js';
import { FOOTPRINTS as lm_palacio_real_de_madridFootprints } from './palacio-real-de-madrid/footprint.js';
import { SPEC as lm_puerta_de_alcalaSpec, PALETTES as lm_puerta_de_alcalaPalettes } from './puerta-de-alcala/config.js';
import { FOOTPRINTS as lm_puerta_de_alcalaFootprints } from './puerta-de-alcala/footprint.js';
import { SPEC as lm_puerta_de_europaSpec, PALETTES as lm_puerta_de_europaPalettes } from './puerta-de-europa/config.js';
import { FOOTPRINTS as lm_puerta_de_europaFootprints } from './puerta-de-europa/footprint.js';
import { SPEC as lm_reunion_towerSpec, PALETTES as lm_reunion_towerPalettes } from './reunion-tower/config.js';
import { FOOTPRINTS as lm_reunion_towerFootprints } from './reunion-tower/footprint.js';
import { SPEC as lm_bank_of_america_plaza_dallasSpec, PALETTES as lm_bank_of_america_plaza_dallasPalettes } from './bank-of-america-plaza-dallas/config.js';
import { FOOTPRINTS as lm_bank_of_america_plaza_dallasFootprints } from './bank-of-america-plaza-dallas/footprint.js';
import { SPEC as lm_margaret_hunt_hill_bridgeSpec, PALETTES as lm_margaret_hunt_hill_bridgePalettes } from './margaret-hunt-hill-bridge/config.js';
import { FOOTPRINTS as lm_margaret_hunt_hill_bridgeFootprints } from './margaret-hunt-hill-bridge/footprint.js';
import { ROAD_LAYER as lm_margaret_hunt_hill_bridgeRoad } from './margaret-hunt-hill-bridge/layer.js';
import { SPEC as lm_margaret_mcdermott_bridgeSpec, PALETTES as lm_margaret_mcdermott_bridgePalettes } from './margaret-mcdermott-bridge/config.js';
import { FOOTPRINTS as lm_margaret_mcdermott_bridgeFootprints } from './margaret-mcdermott-bridge/footprint.js';
import { ROAD_LAYER as lm_margaret_mcdermott_bridgeRoad } from './margaret-mcdermott-bridge/layer.js';
import { SPEC as lm_washington_monumentSpec, PALETTES as lm_washington_monumentPalettes } from './washington-monument/config.js';
import { FOOTPRINTS as lm_washington_monumentFootprints } from './washington-monument/footprint.js';
import { SPEC as lm_united_states_capitolSpec, PALETTES as lm_united_states_capitolPalettes } from './united-states-capitol/config.js';
import { FOOTPRINTS as lm_united_states_capitolFootprints } from './united-states-capitol/footprint.js';
import { SPEC as lm_lincoln_memorialSpec, PALETTES as lm_lincoln_memorialPalettes } from './lincoln-memorial/config.js';
import { FOOTPRINTS as lm_lincoln_memorialFootprints } from './lincoln-memorial/footprint.js';
import { SPEC as lm_arlington_memorial_bridgeSpec, PALETTES as lm_arlington_memorial_bridgePalettes } from './arlington-memorial-bridge/config.js';
import { FOOTPRINTS as lm_arlington_memorial_bridgeFootprints } from './arlington-memorial-bridge/footprint.js';
import { ROAD_LAYER as lm_arlington_memorial_bridgeRoad } from './arlington-memorial-bridge/layer.js';
import { SPEC as lm_edificio_coltejerSpec, PALETTES as lm_edificio_coltejerPalettes } from './edificio-coltejer/config.js';
import { FOOTPRINTS as lm_edificio_coltejerFootprints } from './edificio-coltejer/footprint.js';
import { SPEC as lm_catedral_metropolitana_de_medellinSpec, PALETTES as lm_catedral_metropolitana_de_medellinPalettes } from './catedral-metropolitana-de-medellin/config.js';
import { FOOTPRINTS as lm_catedral_metropolitana_de_medellinFootprints } from './catedral-metropolitana-de-medellin/footprint.js';
import { SPEC as lm_palacio_de_la_cultura_medellinSpec, PALETTES as lm_palacio_de_la_cultura_medellinPalettes } from './palacio-de-la-cultura-medellin/config.js';
import { FOOTPRINTS as lm_palacio_de_la_cultura_medellinFootprints } from './palacio-de-la-cultura-medellin/footprint.js';
import { SPEC as lm_old_orange_county_courthouseSpec, PALETTES as lm_old_orange_county_courthousePalettes } from './old-orange-county-courthouse/config.js';
import { FOOTPRINTS as lm_old_orange_county_courthouseFootprints } from './old-orange-county-courthouse/footprint.js';
import { SPEC as lm_christ_cathedralSpec, PALETTES as lm_christ_cathedralPalettes } from './christ-cathedral/config.js';
import { FOOTPRINTS as lm_christ_cathedralFootprints } from './christ-cathedral/footprint.js';
import { SPEC as lm_mission_innSpec, PALETTES as lm_mission_innPalettes } from './mission-inn/config.js';
import { FOOTPRINTS as lm_mission_innFootprints } from './mission-inn/footprint.js';
import { SPEC as lm_palace_of_the_parliamentSpec, PALETTES as lm_palace_of_the_parliamentPalettes } from './palace-of-the-parliament/config.js';
import { FOOTPRINTS as lm_palace_of_the_parliamentFootprints } from './palace-of-the-parliament/footprint.js';
import { SPEC as lm_arcul_de_triumfSpec, PALETTES as lm_arcul_de_triumfPalettes } from './arcul-de-triumf/config.js';
import { FOOTPRINTS as lm_arcul_de_triumfFootprints } from './arcul-de-triumf/footprint.js';
import { SPEC as lm_romanian_athenaeumSpec, PALETTES as lm_romanian_athenaeumPalettes } from './romanian-athenaeum/config.js';
import { FOOTPRINTS as lm_romanian_athenaeumFootprints } from './romanian-athenaeum/footprint.js';
import { SPEC as lm_colosseumSpec, PALETTES as lm_colosseumPalettes } from './colosseum/config.js';
import { FOOTPRINTS as lm_colosseumFootprints } from './colosseum/footprint.js';
import { SPEC as lm_altare_della_patriaSpec, PALETTES as lm_altare_della_patriaPalettes } from './altare-della-patria/config.js';
import { FOOTPRINTS as lm_altare_della_patriaFootprints } from './altare-della-patria/footprint.js';
import { SPEC as lm_st_peters_basilicaSpec, PALETTES as lm_st_peters_basilicaPalettes } from './st-peters-basilica/config.js';
import { FOOTPRINTS as lm_st_peters_basilicaFootprints } from './st-peters-basilica/footprint.js';
import { SPEC as lm_teatro_nacional_de_costa_ricaSpec, PALETTES as lm_teatro_nacional_de_costa_ricaPalettes } from './teatro-nacional-de-costa-rica/config.js';
import { FOOTPRINTS as lm_teatro_nacional_de_costa_ricaFootprints } from './teatro-nacional-de-costa-rica/footprint.js';
import { SPEC as lm_catedral_metropolitana_san_joseSpec, PALETTES as lm_catedral_metropolitana_san_josePalettes } from './catedral-metropolitana-san-jose/config.js';
import { FOOTPRINTS as lm_catedral_metropolitana_san_joseFootprints } from './catedral-metropolitana-san-jose/footprint.js';
import { SPEC as lm_basilique_de_fourviereSpec, PALETTES as lm_basilique_de_fourvierePalettes } from './basilique-de-fourviere/config.js';
import { FOOTPRINTS as lm_basilique_de_fourviereFootprints } from './basilique-de-fourviere/footprint.js';
import { SPEC as lm_tour_part_dieuSpec, PALETTES as lm_tour_part_dieuPalettes } from './tour-part-dieu/config.js';
import { FOOTPRINTS as lm_tour_part_dieuFootprints } from './tour-part-dieu/footprint.js';
import { SPEC as lm_musee_des_confluencesSpec, PALETTES as lm_musee_des_confluencesPalettes } from './musee-des-confluences/config.js';
import { FOOTPRINTS as lm_musee_des_confluencesFootprints } from './musee-des-confluences/footprint.js';
import { SPEC as lm_gratte_ciel_villeurbanneSpec, PALETTES as lm_gratte_ciel_villeurbannePalettes } from './gratte-ciel-villeurbanne/config.js';
import { FOOTPRINTS as lm_gratte_ciel_villeurbanneFootprints } from './gratte-ciel-villeurbanne/footprint.js';
import { SPEC as lm_torre_colpatriaSpec, PALETTES as lm_torre_colpatriaPalettes } from './torre-colpatria/config.js';
import { FOOTPRINTS as lm_torre_colpatriaFootprints } from './torre-colpatria/footprint.js';
import { SPEC as lm_catedral_primada_de_colombiaSpec, PALETTES as lm_catedral_primada_de_colombiaPalettes } from './catedral-primada-de-colombia/config.js';
import { FOOTPRINTS as lm_catedral_primada_de_colombiaFootprints } from './catedral-primada-de-colombia/footprint.js';
import { SPEC as lm_liberty_memorialSpec, PALETTES as lm_liberty_memorialPalettes } from './liberty-memorial/config.js';
import { FOOTPRINTS as lm_liberty_memorialFootprints } from './liberty-memorial/footprint.js';
import { SPEC as lm_christopher_s_bond_bridgeSpec, PALETTES as lm_christopher_s_bond_bridgePalettes } from './christopher-s-bond-bridge/config.js';
import { FOOTPRINTS as lm_christopher_s_bond_bridgeFootprints } from './christopher-s-bond-bridge/footprint.js';
import { ROAD_LAYER as lm_christopher_s_bond_bridgeRoad } from './christopher-s-bond-bridge/layer.js';
import { SPEC as lm_lions_gate_bridgeSpec, PALETTES as lm_lions_gate_bridgePalettes } from './lions-gate-bridge/config.js';
import { FOOTPRINTS as lm_lions_gate_bridgeFootprints } from './lions-gate-bridge/footprint.js';
import { ROAD_LAYER as lm_lions_gate_bridgeRoad } from './lions-gate-bridge/layer.js';
import { SPEC as lm_port_mann_bridgeSpec, PALETTES as lm_port_mann_bridgePalettes } from './port-mann-bridge/config.js';
import { FOOTPRINTS as lm_port_mann_bridgeFootprints } from './port-mann-bridge/footprint.js';
import { ROAD_LAYER as lm_port_mann_bridgeRoad } from './port-mann-bridge/layer.js';
import { SPEC as lm_burrard_street_bridgeSpec, PALETTES as lm_burrard_street_bridgePalettes } from './burrard-street-bridge/config.js';
import { FOOTPRINTS as lm_burrard_street_bridgeFootprints } from './burrard-street-bridge/footprint.js';
import { ROAD_LAYER as lm_burrard_street_bridgeRoad } from './burrard-street-bridge/layer.js';
import { SPEC as lm_canada_placeSpec, PALETTES as lm_canada_placePalettes } from './canada-place/config.js';
import { FOOTPRINTS as lm_canada_placeFootprints } from './canada-place/footprint.js';
import { SPEC as lm_science_world_vancouverSpec, PALETTES as lm_science_world_vancouverPalettes } from './science-world-vancouver/config.js';
import { FOOTPRINTS as lm_science_world_vancouverFootprints } from './science-world-vancouver/footprint.js';
import { SPEC as lm_bc_placeSpec, PALETTES as lm_bc_placePalettes } from './bc-place/config.js';
import { FOOTPRINTS as lm_bc_placeFootprints } from './bc-place/footprint.js';
import { SPEC as lm_harbour_centreSpec, PALETTES as lm_harbour_centrePalettes } from './harbour-centre/config.js';
import { FOOTPRINTS as lm_harbour_centreFootprints } from './harbour-centre/footprint.js';
import { SPEC as lm_vancouver_houseSpec, PALETTES as lm_vancouver_housePalettes } from './vancouver-house/config.js';
import { FOOTPRINTS as lm_vancouver_houseFootprints } from './vancouver-house/footprint.js';
import { SPEC as lm_bc_parliament_buildingsSpec, PALETTES as lm_bc_parliament_buildingsPalettes } from './bc-parliament-buildings/config.js';
import { FOOTPRINTS as lm_bc_parliament_buildingsFootprints } from './bc-parliament-buildings/footprint.js';
import { SPEC as lm_fairmont_empressSpec, PALETTES as lm_fairmont_empressPalettes } from './fairmont-empress/config.js';
import { FOOTPRINTS as lm_fairmont_empressFootprints } from './fairmont-empress/footprint.js';
import { SPEC as lm_alberta_legislature_buildingSpec, PALETTES as lm_alberta_legislature_buildingPalettes } from './alberta-legislature-building/config.js';
import { FOOTPRINTS as lm_alberta_legislature_buildingFootprints } from './alberta-legislature-building/footprint.js';
import { SPEC as lm_walterdale_bridgeSpec, PALETTES as lm_walterdale_bridgePalettes } from './walterdale-bridge/config.js';
import { FOOTPRINTS as lm_walterdale_bridgeFootprints } from './walterdale-bridge/footprint.js';
import { ROAD_LAYER as lm_walterdale_bridgeRoad } from './walterdale-bridge/layer.js';
import { SPEC as lm_fairmont_banff_springsSpec, PALETTES as lm_fairmont_banff_springsPalettes } from './fairmont-banff-springs/config.js';
import { FOOTPRINTS as lm_fairmont_banff_springsFootprints } from './fairmont-banff-springs/footprint.js';
import { SPEC as lm_canadian_museum_for_human_rightsSpec, PALETTES as lm_canadian_museum_for_human_rightsPalettes } from './canadian-museum-for-human-rights/config.js';
import { FOOTPRINTS as lm_canadian_museum_for_human_rightsFootprints } from './canadian-museum-for-human-rights/footprint.js';
import { SPEC as lm_storseisundet_bridgeSpec, PALETTES as lm_storseisundet_bridgePalettes } from './storseisundet-bridge/config.js';
import { FOOTPRINTS as lm_storseisundet_bridgeFootprints } from './storseisundet-bridge/footprint.js';
import { ROAD_LAYER as lm_storseisundet_bridgeRoad } from './storseisundet-bridge/layer.js';
import { SPEC as lm_halogaland_bridgeSpec, PALETTES as lm_halogaland_bridgePalettes } from './halogaland-bridge/config.js';
import { FOOTPRINTS as lm_halogaland_bridgeFootprints } from './halogaland-bridge/footprint.js';
import { ROAD_LAYER as lm_halogaland_bridgeRoad } from './halogaland-bridge/layer.js';
import { SPEC as lm_hardanger_bridgeSpec, PALETTES as lm_hardanger_bridgePalettes } from './hardanger-bridge/config.js';
import { FOOTPRINTS as lm_hardanger_bridgeFootprints } from './hardanger-bridge/footprint.js';
import { ROAD_LAYER as lm_hardanger_bridgeRoad } from './hardanger-bridge/layer.js';
import { SPEC as lm_tromso_bridgeSpec, PALETTES as lm_tromso_bridgePalettes } from './tromso-bridge/config.js';
import { FOOTPRINTS as lm_tromso_bridgeFootprints } from './tromso-bridge/footprint.js';
import { ROAD_LAYER as lm_tromso_bridgeRoad } from './tromso-bridge/layer.js';
import { SPEC as lm_helgeland_bridgeSpec, PALETTES as lm_helgeland_bridgePalettes } from './helgeland-bridge/config.js';
import { FOOTPRINTS as lm_helgeland_bridgeFootprints } from './helgeland-bridge/footprint.js';
import { ROAD_LAYER as lm_helgeland_bridgeRoad } from './helgeland-bridge/layer.js';
import { SPEC as lm_svinesund_bridgeSpec, PALETTES as lm_svinesund_bridgePalettes } from './svinesund-bridge/config.js';
import { FOOTPRINTS as lm_svinesund_bridgeFootprints } from './svinesund-bridge/footprint.js';
import { ROAD_LAYER as lm_svinesund_bridgeRoad } from './svinesund-bridge/layer.js';
import { SPEC as lm_oslo_opera_houseSpec, PALETTES as lm_oslo_opera_housePalettes } from './oslo-opera-house/config.js';
import { FOOTPRINTS as lm_oslo_opera_houseFootprints } from './oslo-opera-house/footprint.js';
import { SPEC as lm_oslo_city_hallSpec, PALETTES as lm_oslo_city_hallPalettes } from './oslo-city-hall/config.js';
import { FOOTPRINTS as lm_oslo_city_hallFootprints } from './oslo-city-hall/footprint.js';
import { SPEC as lm_royal_palace_osloSpec, PALETTES as lm_royal_palace_osloPalettes } from './royal-palace-oslo/config.js';
import { FOOTPRINTS as lm_royal_palace_osloFootprints } from './royal-palace-oslo/footprint.js';
import { SPEC as lm_holmenkollbakkenSpec, PALETTES as lm_holmenkollbakkenPalettes } from './holmenkollbakken/config.js';
import { FOOTPRINTS as lm_holmenkollbakkenFootprints } from './holmenkollbakken/footprint.js';
import { SPEC as lm_munch_museumSpec, PALETTES as lm_munch_museumPalettes } from './munch-museum/config.js';
import { FOOTPRINTS as lm_munch_museumFootprints } from './munch-museum/footprint.js';
import { SPEC as lm_akershus_fortressSpec, PALETTES as lm_akershus_fortressPalettes } from './akershus-fortress/config.js';
import { FOOTPRINTS as lm_akershus_fortressFootprints } from './akershus-fortress/footprint.js';
import { SPEC as lm_astrup_fearnley_museumSpec, PALETTES as lm_astrup_fearnley_museumPalettes } from './astrup-fearnley-museum/config.js';
import { FOOTPRINTS as lm_astrup_fearnley_museumFootprints } from './astrup-fearnley-museum/footprint.js';
import { SPEC as lm_bryggenSpec, PALETTES as lm_bryggenPalettes } from './bryggen/config.js';
import { FOOTPRINTS as lm_bryggenFootprints } from './bryggen/footprint.js';
import { SPEC as lm_nidaros_cathedralSpec, PALETTES as lm_nidaros_cathedralPalettes } from './nidaros-cathedral/config.js';
import { FOOTPRINTS as lm_nidaros_cathedralFootprints } from './nidaros-cathedral/footprint.js';
import { SPEC as lm_arctic_cathedralSpec, PALETTES as lm_arctic_cathedralPalettes } from './arctic-cathedral/config.js';
import { FOOTPRINTS as lm_arctic_cathedralFootprints } from './arctic-cathedral/footprint.js';
import { SPEC as lm_norwegian_petroleum_museumSpec, PALETTES as lm_norwegian_petroleum_museumPalettes } from './norwegian-petroleum-museum/config.js';
import { FOOTPRINTS as lm_norwegian_petroleum_museumFootprints } from './norwegian-petroleum-museum/footprint.js';
import { SPEC as lm_vikingskipetSpec, PALETTES as lm_vikingskipetPalettes } from './vikingskipet/config.js';
import { FOOTPRINTS as lm_vikingskipetFootprints } from './vikingskipet/footprint.js';
import { SPEC as lm_kilden_performing_arts_centreSpec, PALETTES as lm_kilden_performing_arts_centrePalettes } from './kilden-performing-arts-centre/config.js';
import { FOOTPRINTS as lm_kilden_performing_arts_centreFootprints } from './kilden-performing-arts-centre/footprint.js';
import { SPEC as lm_borgund_stave_churchSpec, PALETTES as lm_borgund_stave_churchPalettes } from './borgund-stave-church/config.js';
import { FOOTPRINTS as lm_borgund_stave_churchFootprints } from './borgund-stave-church/footprint.js';
import { SPEC as lm_farris_badSpec, PALETTES as lm_farris_badPalettes } from './farris-bad/config.js';
import { FOOTPRINTS as lm_farris_badFootprints } from './farris-bad/footprint.js';
import { SPEC as lm_pont_neuf_toulouseSpec, PALETTES as lm_pont_neuf_toulousePalettes } from './pont-neuf-toulouse/config.js';
import { FOOTPRINTS as lm_pont_neuf_toulouseFootprints } from './pont-neuf-toulouse/footprint.js';
import { ROAD_LAYER as lm_pont_neuf_toulouseRoad } from './pont-neuf-toulouse/layer.js';
import { SPEC as lm_pont_des_catalansSpec, PALETTES as lm_pont_des_catalansPalettes } from './pont-des-catalans/config.js';
import { FOOTPRINTS as lm_pont_des_catalansFootprints } from './pont-des-catalans/footprint.js';
import { ROAD_LAYER as lm_pont_des_catalansRoad } from './pont-des-catalans/layer.js';
import { SPEC as lm_viaduc_de_millauSpec, PALETTES as lm_viaduc_de_millauPalettes } from './viaduc-de-millau/config.js';
import { FOOTPRINTS as lm_viaduc_de_millauFootprints } from './viaduc-de-millau/footprint.js';
import { ROAD_LAYER as lm_viaduc_de_millauRoad } from './viaduc-de-millau/layer.js';
import { SPEC as lm_basilique_saint_serninSpec, PALETTES as lm_basilique_saint_serninPalettes } from './basilique-saint-sernin/config.js';
import { FOOTPRINTS as lm_basilique_saint_serninFootprints } from './basilique-saint-sernin/footprint.js';
import { SPEC as lm_capitole_de_toulouseSpec, PALETTES as lm_capitole_de_toulousePalettes } from './capitole-de-toulouse/config.js';
import { FOOTPRINTS as lm_capitole_de_toulouseFootprints } from './capitole-de-toulouse/footprint.js';
import { SPEC as lm_dome_de_la_graveSpec, PALETTES as lm_dome_de_la_gravePalettes } from './dome-de-la-grave/config.js';
import { FOOTPRINTS as lm_dome_de_la_graveFootprints } from './dome-de-la-grave/footprint.js';
import { SPEC as lm_cite_de_l_espaceSpec, PALETTES as lm_cite_de_l_espacePalettes } from './cite-de-l-espace/config.js';
import { FOOTPRINTS as lm_cite_de_l_espaceFootprints } from './cite-de-l-espace/footprint.js';
import { SPEC as lm_couvent_des_jacobinsSpec, PALETTES as lm_couvent_des_jacobinsPalettes } from './couvent-des-jacobins/config.js';
import { FOOTPRINTS as lm_couvent_des_jacobinsFootprints } from './couvent-des-jacobins/footprint.js';
import { SPEC as lm_cite_de_carcassonneSpec, PALETTES as lm_cite_de_carcassonnePalettes } from './cite-de-carcassonne/config.js';
import { FOOTPRINTS as lm_cite_de_carcassonneFootprints } from './cite-de-carcassonne/footprint.js';
import { SPEC as lm_cathedrale_sainte_cecile_albiSpec, PALETTES as lm_cathedrale_sainte_cecile_albiPalettes } from './cathedrale-sainte-cecile-albi/config.js';
import { FOOTPRINTS as lm_cathedrale_sainte_cecile_albiFootprints } from './cathedrale-sainte-cecile-albi/footprint.js';
import { SPEC as lm_pont_saint_pierreSpec, PALETTES as lm_pont_saint_pierrePalettes } from './pont-saint-pierre/config.js';
import { FOOTPRINTS as lm_pont_saint_pierreFootprints } from './pont-saint-pierre/footprint.js';
import { ROAD_LAYER as lm_pont_saint_pierreRoad } from './pont-saint-pierre/layer.js';
import { SPEC as lm_pont_saint_michelSpec, PALETTES as lm_pont_saint_michelPalettes } from './pont-saint-michel/config.js';
import { FOOTPRINTS as lm_pont_saint_michelFootprints } from './pont-saint-michel/footprint.js';
import { ROAD_LAYER as lm_pont_saint_michelRoad } from './pont-saint-michel/layer.js';
import { SPEC as lm_ponts_jumeauxSpec, PALETTES as lm_ponts_jumeauxPalettes } from './ponts-jumeaux/config.js';
import { FOOTPRINTS as lm_ponts_jumeauxFootprints } from './ponts-jumeaux/footprint.js';
import { ROAD_LAYER as lm_ponts_jumeauxRoad } from './ponts-jumeaux/layer.js';
import { SPEC as lm_viaduc_de_calixSpec, PALETTES as lm_viaduc_de_calixPalettes } from './viaduc-de-calix/config.js';
import { FOOTPRINTS as lm_viaduc_de_calixFootprints } from './viaduc-de-calix/footprint.js';
import { ROAD_LAYER as lm_viaduc_de_calixRoad } from './viaduc-de-calix/layer.js';
import { SPEC as lm_pegasus_bridgeSpec, PALETTES as lm_pegasus_bridgePalettes } from './pegasus-bridge/config.js';
import { FOOTPRINTS as lm_pegasus_bridgeFootprints } from './pegasus-bridge/footprint.js';
import { ROAD_LAYER as lm_pegasus_bridgeRoad } from './pegasus-bridge/layer.js';
import { SPEC as lm_pont_de_la_fonderieSpec, PALETTES as lm_pont_de_la_fonderiePalettes } from './pont-de-la-fonderie/config.js';
import { FOOTPRINTS as lm_pont_de_la_fonderieFootprints } from './pont-de-la-fonderie/footprint.js';
import { ROAD_LAYER as lm_pont_de_la_fonderieRoad } from './pont-de-la-fonderie/layer.js';
import { SPEC as lm_pont_de_normandieSpec, PALETTES as lm_pont_de_normandiePalettes } from './pont-de-normandie/config.js';
import { FOOTPRINTS as lm_pont_de_normandieFootprints } from './pont-de-normandie/footprint.js';
import { ROAD_LAYER as lm_pont_de_normandieRoad } from './pont-de-normandie/layer.js';
import { SPEC as lm_abbaye_aux_hommesSpec, PALETTES as lm_abbaye_aux_hommesPalettes } from './abbaye-aux-hommes/config.js';
import { FOOTPRINTS as lm_abbaye_aux_hommesFootprints } from './abbaye-aux-hommes/footprint.js';
import { SPEC as lm_chateau_de_caenSpec, PALETTES as lm_chateau_de_caenPalettes } from './chateau-de-caen/config.js';
import { FOOTPRINTS as lm_chateau_de_caenFootprints } from './chateau-de-caen/footprint.js';
import { SPEC as lm_eglise_saint_pierre_caenSpec, PALETTES as lm_eglise_saint_pierre_caenPalettes } from './eglise-saint-pierre-caen/config.js';
import { FOOTPRINTS as lm_eglise_saint_pierre_caenFootprints } from './eglise-saint-pierre-caen/footprint.js';
import { SPEC as lm_abbaye_aux_damesSpec, PALETTES as lm_abbaye_aux_damesPalettes } from './abbaye-aux-dames/config.js';
import { FOOTPRINTS as lm_abbaye_aux_damesFootprints } from './abbaye-aux-dames/footprint.js';
import { SPEC as lm_memorial_de_caenSpec, PALETTES as lm_memorial_de_caenPalettes } from './memorial-de-caen/config.js';
import { FOOTPRINTS as lm_memorial_de_caenFootprints } from './memorial-de-caen/footprint.js';
import { SPEC as lm_cathedrale_de_bayeuxSpec, PALETTES as lm_cathedrale_de_bayeuxPalettes } from './cathedrale-de-bayeux/config.js';
import { FOOTPRINTS as lm_cathedrale_de_bayeuxFootprints } from './cathedrale-de-bayeux/footprint.js';
import { SPEC as lm_georgia_state_capitolSpec, PALETTES as lm_georgia_state_capitolPalettes } from './georgia-state-capitol/config.js';
import { FOOTPRINTS as lm_georgia_state_capitolFootprints } from './georgia-state-capitol/footprint.js';
import { SPEC as lm_bank_of_america_plaza_atlantaSpec, PALETTES as lm_bank_of_america_plaza_atlantaPalettes } from './bank-of-america-plaza-atlanta/config.js';
import { FOOTPRINTS as lm_bank_of_america_plaza_atlantaFootprints } from './bank-of-america-plaza-atlanta/footprint.js';
import { SPEC as lm_sunshine_skyway_bridgeSpec, PALETTES as lm_sunshine_skyway_bridgePalettes } from './sunshine-skyway-bridge/config.js';
import { FOOTPRINTS as lm_sunshine_skyway_bridgeFootprints } from './sunshine-skyway-bridge/footprint.js';
import { ROAD_LAYER as lm_sunshine_skyway_bridgeRoad } from './sunshine-skyway-bridge/layer.js';
import { SPEC as lm_dallas_city_hallSpec, PALETTES as lm_dallas_city_hallPalettes } from './dallas-city-hall/config.js';
import { FOOTPRINTS as lm_dallas_city_hallFootprints } from './dallas-city-hall/footprint.js';
import { SPEC as lm_fox_theatre_atlantaSpec, PALETTES as lm_fox_theatre_atlantaPalettes } from './fox-theatre-atlanta/config.js';
import { FOOTPRINTS as lm_fox_theatre_atlantaFootprints } from './fox-theatre-atlanta/footprint.js';
import { SPEC as lm_lviv_national_operaSpec, PALETTES as lm_lviv_national_operaPalettes } from './lviv-national-opera/config.js';
import { FOOTPRINTS as lm_lviv_national_operaFootprints } from './lviv-national-opera/footprint.js';
import { SPEC as lm_jpmorgan_chase_tower_houstonSpec, PALETTES as lm_jpmorgan_chase_tower_houstonPalettes } from './jpmorgan-chase-tower-houston/config.js';
import { FOOTPRINTS as lm_jpmorgan_chase_tower_houstonFootprints } from './jpmorgan-chase-tower-houston/footprint.js';
import { SPEC as lm_willis_towerSpec, PALETTES as lm_willis_towerPalettes } from './willis-tower/config.js';
import { FOOTPRINTS as lm_willis_towerFootprints } from './willis-tower/footprint.js';
import { SPEC as lm_mercedes_benz_stadiumSpec, PALETTES as lm_mercedes_benz_stadiumPalettes } from './mercedes-benz-stadium/config.js';
import { FOOTPRINTS as lm_mercedes_benz_stadiumFootprints } from './mercedes-benz-stadium/footprint.js';
import { SPEC as lm_edificio_de_correos_costa_ricaSpec, PALETTES as lm_edificio_de_correos_costa_ricaPalettes } from './edificio-de-correos-costa-rica/config.js';
import { FOOTPRINTS as lm_edificio_de_correos_costa_ricaFootprints } from './edificio-de-correos-costa-rica/footprint.js';
import { SPEC as lm_helsinki_cathedralSpec, PALETTES as lm_helsinki_cathedralPalettes } from './helsinki-cathedral/config.js';
import { FOOTPRINTS as lm_helsinki_cathedralFootprints } from './helsinki-cathedral/footprint.js';
import { SPEC as lm_freedom_tower_miamiSpec, PALETTES as lm_freedom_tower_miamiPalettes } from './freedom-tower-miami/config.js';
import { FOOTPRINTS as lm_freedom_tower_miamiFootprints } from './freedom-tower-miami/footprint.js';
import { SPEC as lm_texas_state_capitolSpec, PALETTES as lm_texas_state_capitolPalettes } from './texas-state-capitol/config.js';
import { FOOTPRINTS as lm_texas_state_capitolFootprints } from './texas-state-capitol/footprint.js';
import { SPEC as lm_ohio_statehouseSpec, PALETTES as lm_ohio_statehousePalettes } from './ohio-statehouse/config.js';
import { FOOTPRINTS as lm_ohio_statehouseFootprints } from './ohio-statehouse/footprint.js';
import { SPEC as lm_royal_palace_amsterdamSpec, PALETTES as lm_royal_palace_amsterdamPalettes } from './royal-palace-amsterdam/config.js';
import { FOOTPRINTS as lm_royal_palace_amsterdamFootprints } from './royal-palace-amsterdam/footprint.js';
import { SPEC as lm_vulcan_statueSpec, PALETTES as lm_vulcan_statuePalettes } from './vulcan-statue/config.js';
import { FOOTPRINTS as lm_vulcan_statueFootprints } from './vulcan-statue/footprint.js';
import { SPEC as lm_griffith_observatorySpec, PALETTES as lm_griffith_observatoryPalettes } from './griffith-observatory/config.js';
import { FOOTPRINTS as lm_griffith_observatoryFootprints } from './griffith-observatory/footprint.js';
import { SPEC as lm_mercedes_benz_museumSpec, PALETTES as lm_mercedes_benz_museumPalettes } from './mercedes-benz-museum/config.js';
import { FOOTPRINTS as lm_mercedes_benz_museumFootprints } from './mercedes-benz-museum/footprint.js';
import { SPEC as lm_notre_dame_de_la_gardeSpec, PALETTES as lm_notre_dame_de_la_gardePalettes } from './notre-dame-de-la-garde/config.js';
import { FOOTPRINTS as lm_notre_dame_de_la_gardeFootprints } from './notre-dame-de-la-garde/footprint.js';
import { SPEC as lm_att_stadiumSpec, PALETTES as lm_att_stadiumPalettes } from './att-stadium/config.js';
import { FOOTPRINTS as lm_att_stadiumFootprints } from './att-stadium/footprint.js';
import { SPEC as lm_golden_ears_bridgeSpec, PALETTES as lm_golden_ears_bridgePalettes } from './golden-ears-bridge/config.js';
import { FOOTPRINTS as lm_golden_ears_bridgeFootprints } from './golden-ears-bridge/footprint.js';
import { ROAD_LAYER as lm_golden_ears_bridgeRoad } from './golden-ears-bridge/layer.js';
import { SPEC as lm_westin_peachtree_plazaSpec, PALETTES as lm_westin_peachtree_plazaPalettes } from './westin-peachtree-plaza/config.js';
import { FOOTPRINTS as lm_westin_peachtree_plazaFootprints } from './westin-peachtree-plaza/footprint.js';
import { SPEC as lm_ponte_25_de_abrilSpec, PALETTES as lm_ponte_25_de_abrilPalettes } from './ponte-25-de-abril/config.js';
import { FOOTPRINTS as lm_ponte_25_de_abrilFootprints } from './ponte-25-de-abril/footprint.js';
import { ROAD_LAYER as lm_ponte_25_de_abrilRoad } from './ponte-25-de-abril/layer.js';
import { SPEC as lm_white_houseSpec, PALETTES as lm_white_housePalettes } from './white-house/config.js';
import { FOOTPRINTS as lm_white_houseFootprints } from './white-house/footprint.js';
import { SPEC as lm_westerkerkSpec, PALETTES as lm_westerkerkPalettes } from './westerkerk/config.js';
import { FOOTPRINTS as lm_westerkerkFootprints } from './westerkerk/footprint.js';
import { SPEC as lm_cologne_cathedralSpec, PALETTES as lm_cologne_cathedralPalettes } from './cologne-cathedral/config.js';
import { FOOTPRINTS as lm_cologne_cathedralFootprints } from './cologne-cathedral/footprint.js';
import { SPEC as lm_london_eyeSpec, PALETTES as lm_london_eyePalettes } from './london-eye/config.js';
import { FOOTPRINTS as lm_london_eyeFootprints } from './london-eye/footprint.js';
import { SPEC as lm_fred_hartman_bridgeSpec, PALETTES as lm_fred_hartman_bridgePalettes } from './fred-hartman-bridge/config.js';
import { FOOTPRINTS as lm_fred_hartman_bridgeFootprints } from './fred-hartman-bridge/footprint.js';
import { ROAD_LAYER as lm_fred_hartman_bridgeRoad } from './fred-hartman-bridge/layer.js';
import { SPEC as lm_peoples_salvation_cathedralSpec, PALETTES as lm_peoples_salvation_cathedralPalettes } from './peoples-salvation-cathedral/config.js';
import { FOOTPRINTS as lm_peoples_salvation_cathedralFootprints } from './peoples-salvation-cathedral/footprint.js';
import { SPEC as lm_pitt_river_bridgeSpec, PALETTES as lm_pitt_river_bridgePalettes } from './pitt-river-bridge/config.js';
import { FOOTPRINTS as lm_pitt_river_bridgeFootprints } from './pitt-river-bridge/footprint.js';
import { ROAD_LAYER as lm_pitt_river_bridgeRoad } from './pitt-river-bridge/layer.js';
import { SPEC as lm_museo_nacional_de_costa_ricaSpec, PALETTES as lm_museo_nacional_de_costa_ricaPalettes } from './museo-nacional-de-costa-rica/config.js';
import { FOOTPRINTS as lm_museo_nacional_de_costa_ricaFootprints } from './museo-nacional-de-costa-rica/footprint.js';
import { SPEC as lm_los_angeles_city_hallSpec, PALETTES as lm_los_angeles_city_hallPalettes } from './los-angeles-city-hall/config.js';
import { FOOTPRINTS as lm_los_angeles_city_hallFootprints } from './los-angeles-city-hall/footprint.js';
import { SPEC as lm_palacio_de_cibelesSpec, PALETTES as lm_palacio_de_cibelesPalettes } from './palacio-de-cibeles/config.js';
import { FOOTPRINTS as lm_palacio_de_cibelesFootprints } from './palacio-de-cibeles/footprint.js';
import { SPEC as lm_alex_fraser_bridgeSpec, PALETTES as lm_alex_fraser_bridgePalettes } from './alex-fraser-bridge/config.js';
import { FOOTPRINTS as lm_alex_fraser_bridgeFootprints } from './alex-fraser-bridge/footprint.js';
import { ROAD_LAYER as lm_alex_fraser_bridgeRoad } from './alex-fraser-bridge/layer.js';
import { SPEC as lm_the_alamoSpec, PALETTES as lm_the_alamoPalettes } from './the-alamo/config.js';
import { FOOTPRINTS as lm_the_alamoFootprints } from './the-alamo/footprint.js';
import { SPEC as lm_skyview_atlantaSpec, PALETTES as lm_skyview_atlantaPalettes } from './skyview-atlanta/config.js';
import { FOOTPRINTS as lm_skyview_atlantaFootprints } from './skyview-atlanta/footprint.js';
import { SPEC as lm_frauenkirche_munichSpec, PALETTES as lm_frauenkirche_munichPalettes } from './frauenkirche-munich/config.js';
import { FOOTPRINTS as lm_frauenkirche_munichFootprints } from './frauenkirche-munich/footprint.js';
import { SPEC as lm_the_wheel_icon_parkSpec, PALETTES as lm_the_wheel_icon_parkPalettes } from './the-wheel-icon-park/config.js';
import { FOOTPRINTS as lm_the_wheel_icon_parkFootprints } from './the-wheel-icon-park/footprint.js';
import { SPEC as lm_washington_dc_templeSpec, PALETTES as lm_washington_dc_templePalettes } from './washington-dc-temple/config.js';
import { FOOTPRINTS as lm_washington_dc_templeFootprints } from './washington-dc-temple/footprint.js';
import { SPEC as lm_ironworkers_memorial_bridgeSpec, PALETTES as lm_ironworkers_memorial_bridgePalettes } from './ironworkers-memorial-bridge/config.js';
import { FOOTPRINTS as lm_ironworkers_memorial_bridgeFootprints } from './ironworkers-memorial-bridge/footprint.js';
import { ROAD_LAYER as lm_ironworkers_memorial_bridgeRoad } from './ironworkers-memorial-bridge/layer.js';
import { SPEC as lm_magere_brugSpec, PALETTES as lm_magere_brugPalettes } from './magere-brug/config.js';
import { FOOTPRINTS as lm_magere_brugFootprints } from './magere-brug/footprint.js';
import { SPEC as lm_tower_of_londonSpec, PALETTES as lm_tower_of_londonPalettes } from './tower-of-london/config.js';
import { FOOTPRINTS as lm_tower_of_londonFootprints } from './tower-of-london/footprint.js';
import { SPEC as lm_fountain_placeSpec, PALETTES as lm_fountain_placePalettes } from './fountain-place/config.js';
import { FOOTPRINTS as lm_fountain_placeFootprints } from './fountain-place/footprint.js';
import { SPEC as lm_motherland_monumentSpec, PALETTES as lm_motherland_monumentPalettes } from './motherland-monument/config.js';
import { FOOTPRINTS as lm_motherland_monumentFootprints } from './motherland-monument/footprint.js';
import { SPEC as lm_vincent_thomas_bridgeSpec, PALETTES as lm_vincent_thomas_bridgePalettes } from './vincent-thomas-bridge/config.js';
import { FOOTPRINTS as lm_vincent_thomas_bridgeFootprints } from './vincent-thomas-bridge/footprint.js';
import { ROAD_LAYER as lm_vincent_thomas_bridgeRoad } from './vincent-thomas-bridge/layer.js';
import { SPEC as lm_marine_buildingSpec, PALETTES as lm_marine_buildingPalettes } from './marine-building/config.js';
import { FOOTPRINTS as lm_marine_buildingFootprints } from './marine-building/footprint.js';
import { SPEC as lm_basilica_de_los_angeles_cartagoSpec, PALETTES as lm_basilica_de_los_angeles_cartagoPalettes } from './basilica-de-los-angeles-cartago/config.js';
import { FOOTPRINTS as lm_basilica_de_los_angeles_cartagoFootprints } from './basilica-de-los-angeles-cartago/footprint.js';
import { SPEC as lm_edificio_metropolisSpec, PALETTES as lm_edificio_metropolisPalettes } from './edificio-metropolis/config.js';
import { FOOTPRINTS as lm_edificio_metropolisFootprints } from './edificio-metropolis/footprint.js';
import { SPEC as lm_high_museum_of_artSpec, PALETTES as lm_high_museum_of_artPalettes } from './high-museum-of-art/config.js';
import { FOOTPRINTS as lm_high_museum_of_artFootprints } from './high-museum-of-art/footprint.js';
import { SPEC as lm_williams_towerSpec, PALETTES as lm_williams_towerPalettes } from './williams-tower/config.js';
import { FOOTPRINTS as lm_williams_towerFootprints } from './williams-tower/footprint.js';
import { SPEC as lm_basarab_overpassSpec, PALETTES as lm_basarab_overpassPalettes } from './basarab-overpass/config.js';
import { FOOTPRINTS as lm_basarab_overpassFootprints } from './basarab-overpass/footprint.js';
import { ROAD_LAYER as lm_basarab_overpassRoad } from './basarab-overpass/layer.js';
import { SPEC as lm_john_hancock_centerSpec, PALETTES as lm_john_hancock_centerPalettes } from './john-hancock-center/config.js';
import { FOOTPRINTS as lm_john_hancock_centerFootprints } from './john-hancock-center/footprint.js';
import { SPEC as lm_att_building_nashvilleSpec, PALETTES as lm_att_building_nashvillePalettes } from './att-building-nashville/config.js';
import { FOOTPRINTS as lm_att_building_nashvilleFootprints } from './att-building-nashville/footprint.js';
import { SPEC as lm_granville_street_bridgeSpec, PALETTES as lm_granville_street_bridgePalettes } from './granville-street-bridge/config.js';
import { FOOTPRINTS as lm_granville_street_bridgeFootprints } from './granville-street-bridge/footprint.js';
import { ROAD_LAYER as lm_granville_street_bridgeRoad } from './granville-street-bridge/layer.js';
import { SPEC as lm_jefferson_memorialSpec, PALETTES as lm_jefferson_memorialPalettes } from './jefferson-memorial/config.js';
import { FOOTPRINTS as lm_jefferson_memorialFootprints } from './jefferson-memorial/footprint.js';
import { SPEC as lm_adam_torenSpec, PALETTES as lm_adam_torenPalettes } from './adam-toren/config.js';
import { FOOTPRINTS as lm_adam_torenFootprints } from './adam-toren/footprint.js';
import { SPEC as lm_buckingham_palaceSpec, PALETTES as lm_buckingham_palacePalettes } from './buckingham-palace/config.js';
import { FOOTPRINTS as lm_buckingham_palaceFootprints } from './buckingham-palace/footprint.js';
import { SPEC as lm_samuel_beckett_bridgeSpec, PALETTES as lm_samuel_beckett_bridgePalettes } from './samuel-beckett-bridge/config.js';
import { FOOTPRINTS as lm_samuel_beckett_bridgeFootprints } from './samuel-beckett-bridge/footprint.js';
import { ROAD_LAYER as lm_samuel_beckett_bridgeRoad } from './samuel-beckett-bridge/layer.js';
import { SPEC as lm_fairmont_hotel_vancouverSpec, PALETTES as lm_fairmont_hotel_vancouverPalettes } from './fairmont-hotel-vancouver/config.js';
import { FOOTPRINTS as lm_fairmont_hotel_vancouverFootprints } from './fairmont-hotel-vancouver/footprint.js';
import { SPEC as lm_pennybacker_bridgeSpec, PALETTES as lm_pennybacker_bridgePalettes } from './pennybacker-bridge/config.js';
import { FOOTPRINTS as lm_pennybacker_bridgeFootprints } from './pennybacker-bridge/footprint.js';
import { ROAD_LAYER as lm_pennybacker_bridgeRoad } from './pennybacker-bridge/layer.js';
import { SPEC as lm_walt_disney_concert_hallSpec, PALETTES as lm_walt_disney_concert_hallPalettes } from './walt-disney-concert-hall/config.js';
import { FOOTPRINTS as lm_walt_disney_concert_hallFootprints } from './walt-disney-concert-hall/footprint.js';
import { SPEC as lm_one_atlantic_centerSpec, PALETTES as lm_one_atlantic_centerPalettes } from './one-atlantic-center/config.js';
import { FOOTPRINTS as lm_one_atlantic_centerFootprints } from './one-atlantic-center/footprint.js';
import { SPEC as lm_cambie_bridgeSpec, PALETTES as lm_cambie_bridgePalettes } from './cambie-bridge/config.js';
import { FOOTPRINTS as lm_cambie_bridgeFootprints } from './cambie-bridge/footprint.js';
import { ROAD_LAYER as lm_cambie_bridgeRoad } from './cambie-bridge/layer.js';
import { SPEC as lm_estadio_nacional_costa_ricaSpec, PALETTES as lm_estadio_nacional_costa_ricaPalettes } from './estadio-nacional-costa-rica/config.js';
import { FOOTPRINTS as lm_estadio_nacional_costa_ricaFootprints } from './estadio-nacional-costa-rica/footprint.js';
import { SPEC as lm_uspenski_cathedralSpec, PALETTES as lm_uspenski_cathedralPalettes } from './uspenski-cathedral/config.js';
import { FOOTPRINTS as lm_uspenski_cathedralFootprints } from './uspenski-cathedral/footprint.js';
import { SPEC as lm_atomiumSpec, PALETTES as lm_atomiumPalettes } from './atomium/config.js';
import { FOOTPRINTS as lm_atomiumFootprints } from './atomium/footprint.js';
import { SPEC as lm_chords_bridgeSpec, PALETTES as lm_chords_bridgePalettes } from './chords-bridge/config.js';
import { FOOTPRINTS as lm_chords_bridgeFootprints } from './chords-bridge/footprint.js';
import { SPEC as lm_bob_kerrey_pedestrian_bridgeSpec, PALETTES as lm_bob_kerrey_pedestrian_bridgePalettes } from './bob-kerrey-pedestrian-bridge/config.js';
import { FOOTPRINTS as lm_bob_kerrey_pedestrian_bridgeFootprints } from './bob-kerrey-pedestrian-bridge/footprint.js';
import { SPEC as lm_plant_hall_tampaSpec, PALETTES as lm_plant_hall_tampaPalettes } from './plant-hall-tampa/config.js';
import { FOOTPRINTS as lm_plant_hall_tampaFootprints } from './plant-hall-tampa/footprint.js';
import { SPEC as lm_catedral_de_la_almudenaSpec, PALETTES as lm_catedral_de_la_almudenaPalettes } from './catedral-de-la-almudena/config.js';
import { FOOTPRINTS as lm_catedral_de_la_almudenaFootprints } from './catedral-de-la-almudena/footprint.js';
import { SPEC as lm_tower_of_the_americasSpec, PALETTES as lm_tower_of_the_americasPalettes } from './tower-of-the-americas/config.js';
import { FOOTPRINTS as lm_tower_of_the_americasFootprints } from './tower-of-the-americas/footprint.js';
import { SPEC as lm_woodrow_wilson_bridgeSpec, PALETTES as lm_woodrow_wilson_bridgePalettes } from './woodrow-wilson-bridge/config.js';
import { FOOTPRINTS as lm_woodrow_wilson_bridgeFootprints } from './woodrow-wilson-bridge/footprint.js';
import { ROAD_LAYER as lm_woodrow_wilson_bridgeRoad } from './woodrow-wilson-bridge/layer.js';
import { SPEC as lm_leveque_towerSpec, PALETTES as lm_leveque_towerPalettes } from './leveque-tower/config.js';
import { FOOTPRINTS as lm_leveque_towerFootprints } from './leveque-tower/footprint.js';
import { SPEC as lm_nemo_science_museumSpec, PALETTES as lm_nemo_science_museumPalettes } from './nemo-science-museum/config.js';
import { FOOTPRINTS as lm_nemo_science_museumFootprints } from './nemo-science-museum/footprint.js';
import { SPEC as lm_vancouver_public_librarySpec, PALETTES as lm_vancouver_public_libraryPalettes } from './vancouver-public-library/config.js';
import { FOOTPRINTS as lm_vancouver_public_libraryFootprints } from './vancouver-public-library/footprint.js';
import { SPEC as lm_queen_elizabeth_ii_bridgeSpec, PALETTES as lm_queen_elizabeth_ii_bridgePalettes } from './queen-elizabeth-ii-bridge/config.js';
import { FOOTPRINTS as lm_queen_elizabeth_ii_bridgeFootprints } from './queen-elizabeth-ii-bridge/footprint.js';
import { ROAD_LAYER as lm_queen_elizabeth_ii_bridgeRoad } from './queen-elizabeth-ii-bridge/layer.js';
import { SPEC as lm_saturn_v_huntsvilleSpec, PALETTES as lm_saturn_v_huntsvillePalettes } from './saturn-v-huntsville/config.js';
import { FOOTPRINTS as lm_saturn_v_huntsvilleFootprints } from './saturn-v-huntsville/footprint.js';
import { SPEC as lm_charles_bridgeSpec, PALETTES as lm_charles_bridgePalettes } from './charles-bridge/config.js';
import { FOOTPRINTS as lm_charles_bridgeFootprints } from './charles-bridge/footprint.js';
import { SPEC as lm_grande_archeSpec, PALETTES as lm_grande_archePalettes } from './grande-arche/config.js';
import { FOOTPRINTS as lm_grande_archeFootprints } from './grande-arche/footprint.js';
import { SPEC as lm_sixth_street_viaductSpec, PALETTES as lm_sixth_street_viaductPalettes } from './sixth-street-viaduct/config.js';
import { FOOTPRINTS as lm_sixth_street_viaductFootprints } from './sixth-street-viaduct/footprint.js';
import { ROAD_LAYER as lm_sixth_street_viaductRoad } from './sixth-street-viaduct/layer.js';
import { SPEC as lm_perot_museumSpec, PALETTES as lm_perot_museumPalettes } from './perot-museum/config.js';
import { FOOTPRINTS as lm_perot_museumFootprints } from './perot-museum/footprint.js';
import { SPEC as lm_cec_palaceSpec, PALETTES as lm_cec_palacePalettes } from './cec-palace/config.js';
import { FOOTPRINTS as lm_cec_palaceFootprints } from './cec-palace/footprint.js';
import { SPEC as lm_jackson_street_bridge_atlantaSpec, PALETTES as lm_jackson_street_bridge_atlantaPalettes } from './jackson-street-bridge-atlanta/config.js';
import { FOOTPRINTS as lm_jackson_street_bridge_atlantaFootprints } from './jackson-street-bridge-atlanta/footprint.js';
import { ROAD_LAYER as lm_jackson_street_bridge_atlantaRoad } from './jackson-street-bridge-atlanta/layer.js';
import { SPEC as lm_knight_street_bridgeSpec, PALETTES as lm_knight_street_bridgePalettes } from './knight-street-bridge/config.js';
import { FOOTPRINTS as lm_knight_street_bridgeFootprints } from './knight-street-bridge/footprint.js';
import { ROAD_LAYER as lm_knight_street_bridgeRoad } from './knight-street-bridge/layer.js';
import { SPEC as lm_porsche_museumSpec, PALETTES as lm_porsche_museumPalettes } from './porsche-museum/config.js';
import { FOOTPRINTS as lm_porsche_museumFootprints } from './porsche-museum/footprint.js';
import { SPEC as lm_centre_pompidouSpec, PALETTES as lm_centre_pompidouPalettes } from './centre-pompidou/config.js';
import { FOOTPRINTS as lm_centre_pompidouFootprints } from './centre-pompidou/footprint.js';
import { SPEC as lm_washington_national_cathedralSpec, PALETTES as lm_washington_national_cathedralPalettes } from './washington-national-cathedral/config.js';
import { FOOTPRINTS as lm_washington_national_cathedralFootprints } from './washington-national-cathedral/footprint.js';
import { SPEC as lm_mucemSpec, PALETTES as lm_mucemPalettes } from './mucem/config.js';
import { FOOTPRINTS as lm_mucemFootprints } from './mucem/footprint.js';
import { SPEC as lm_oresund_bridgeSpec, PALETTES as lm_oresund_bridgePalettes } from './oresund-bridge/config.js';
import { FOOTPRINTS as lm_oresund_bridgeFootprints } from './oresund-bridge/footprint.js';
import { ROAD_LAYER as lm_oresund_bridgeRoad } from './oresund-bridge/layer.js';
import { SPEC as lm_yerevan_cascadeSpec, PALETTES as lm_yerevan_cascadePalettes } from './yerevan-cascade/config.js';
import { FOOTPRINTS as lm_yerevan_cascadeFootprints } from './yerevan-cascade/footprint.js';
import { SPEC as lm_rogers_arenaSpec, PALETTES as lm_rogers_arenaPalettes } from './rogers-arena/config.js';
import { FOOTPRINTS as lm_rogers_arenaFootprints } from './rogers-arena/footprint.js';
import { SPEC as lm_edificio_metalicoSpec, PALETTES as lm_edificio_metalicoPalettes } from './edificio-metalico/config.js';
import { FOOTPRINTS as lm_edificio_metalicoFootprints } from './edificio-metalico/footprint.js';
import { SPEC as lm_san_jacinto_monumentSpec, PALETTES as lm_san_jacinto_monumentPalettes } from './san-jacinto-monument/config.js';
import { FOOTPRINTS as lm_san_jacinto_monumentFootprints } from './san-jacinto-monument/footprint.js';
import { SPEC as lm_concertgebouwSpec, PALETTES as lm_concertgebouwPalettes } from './concertgebouw/config.js';
import { FOOTPRINTS as lm_concertgebouwFootprints } from './concertgebouw/footprint.js';
import { SPEC as lm_tour_montparnasseSpec, PALETTES as lm_tour_montparnassePalettes } from './tour-montparnasse/config.js';
import { FOOTPRINTS as lm_tour_montparnasseFootprints } from './tour-montparnasse/footprint.js';
import { SPEC as lm_westminster_abbeySpec, PALETTES as lm_westminster_abbeyPalettes } from './westminster-abbey/config.js';
import { FOOTPRINTS as lm_westminster_abbeyFootprints } from './westminster-abbey/footprint.js';
import { SPEC as lm_opera_de_lyonSpec, PALETTES as lm_opera_de_lyonPalettes } from './opera-de-lyon/config.js';
import { FOOTPRINTS as lm_opera_de_lyonFootprints } from './opera-de-lyon/footprint.js';
import { SPEC as lm_santiago_bernabeuSpec, PALETTES as lm_santiago_bernabeuPalettes } from './santiago-bernabeu/config.js';
import { FOOTPRINTS as lm_santiago_bernabeuFootprints } from './santiago-bernabeu/footprint.js';
import { SPEC as lm_saint_sophia_cathedral_kyivSpec, PALETTES as lm_saint_sophia_cathedral_kyivPalettes } from './saint-sophia-cathedral-kyiv/config.js';
import { FOOTPRINTS as lm_saint_sophia_cathedral_kyivFootprints } from './saint-sophia-cathedral-kyiv/footprint.js';
import { SPEC as lm_oak_street_bridgeSpec, PALETTES as lm_oak_street_bridgePalettes } from './oak-street-bridge/config.js';
import { FOOTPRINTS as lm_oak_street_bridgeFootprints } from './oak-street-bridge/footprint.js';
import { ROAD_LAYER as lm_oak_street_bridgeRoad } from './oak-street-bridge/layer.js';
import { SPEC as lm_riverside_county_courthouseSpec, PALETTES as lm_riverside_county_courthousePalettes } from './riverside-county-courthouse/config.js';
import { FOOTPRINTS as lm_riverside_county_courthouseFootprints } from './riverside-county-courthouse/footprint.js';
import { SPEC as lm_place_de_la_concorde_obeliskSpec, PALETTES as lm_place_de_la_concorde_obeliskPalettes } from './place-de-la-concorde-obelisk/config.js';
import { FOOTPRINTS as lm_place_de_la_concorde_obeliskFootprints } from './place-de-la-concorde-obelisk/footprint.js';
import { SPEC as lm_atlanta_city_hallSpec, PALETTES as lm_atlanta_city_hallPalettes } from './atlanta-city-hall/config.js';
import { FOOTPRINTS as lm_atlanta_city_hallFootprints } from './atlanta-city-hall/footprint.js';
import { SPEC as lm_ut_towerSpec, PALETTES as lm_ut_towerPalettes } from './ut-tower/config.js';
import { FOOTPRINTS as lm_ut_towerFootprints } from './ut-tower/footprint.js';
import { SPEC as lm_belem_towerSpec, PALETTES as lm_belem_towerPalettes } from './belem-tower/config.js';
import { FOOTPRINTS as lm_belem_towerFootprints } from './belem-tower/footprint.js';
import { SPEC as lm_parthenonSpec, PALETTES as lm_parthenonPalettes } from './parthenon/config.js';
import { FOOTPRINTS as lm_parthenonFootprints } from './parthenon/footprint.js';
import { SPEC as lm_bank_of_america_corporate_centerSpec, PALETTES as lm_bank_of_america_corporate_centerPalettes } from './bank-of-america-corporate-center/config.js';
import { FOOTPRINTS as lm_bank_of_america_corporate_centerFootprints } from './bank-of-america-corporate-center/footprint.js';
import { SPEC as lm_miami_towerSpec, PALETTES as lm_miami_towerPalettes } from './miami-tower/config.js';
import { FOOTPRINTS as lm_miami_towerFootprints } from './miami-tower/footprint.js';
import { SPEC as lm_vancouver_art_gallerySpec, PALETTES as lm_vancouver_art_galleryPalettes } from './vancouver-art-gallery/config.js';
import { FOOTPRINTS as lm_vancouver_art_galleryFootprints } from './vancouver-art-gallery/footprint.js';
import { SPEC as lm_pont_de_bercySpec, PALETTES as lm_pont_de_bercyPalettes } from './pont-de-bercy/config.js';
import { FOOTPRINTS as lm_pont_de_bercyFootprints } from './pont-de-bercy/footprint.js';
import { ROAD_LAYER as lm_pont_de_bercyRoad } from './pont-de-bercy/layer.js';

const entry = (spec, palettes, footprints, roadLayer = null) => Object.freeze({
  id: spec.id, spec, palettes, footprints, roadLayer,
  dir: spec.kind === 'bridge' ? 'bridges' : 'buildings',
});

export const TOP_CITIES_LANDMARKS = Object.freeze([
  entry(lm_tower_bridgeSpec, lm_tower_bridgePalettes, lm_tower_bridgeFootprints, lm_tower_bridgeRoad),
  entry(lm_palace_of_westminsterSpec, lm_palace_of_westminsterPalettes, lm_palace_of_westminsterFootprints),
  entry(lm_st_pauls_cathedralSpec, lm_st_pauls_cathedralPalettes, lm_st_pauls_cathedralFootprints),
  entry(lm_the_shardSpec, lm_the_shardPalettes, lm_the_shardFootprints),
  entry(lm_rijksmuseumSpec, lm_rijksmuseumPalettes, lm_rijksmuseumFootprints),
  entry(lm_amsterdam_centraalSpec, lm_amsterdam_centraalPalettes, lm_amsterdam_centraalFootprints),
  entry(lm_eye_filmmuseumSpec, lm_eye_filmmuseumPalettes, lm_eye_filmmuseumFootprints),
  entry(lm_palacio_real_de_madridSpec, lm_palacio_real_de_madridPalettes, lm_palacio_real_de_madridFootprints),
  entry(lm_puerta_de_alcalaSpec, lm_puerta_de_alcalaPalettes, lm_puerta_de_alcalaFootprints),
  entry(lm_puerta_de_europaSpec, lm_puerta_de_europaPalettes, lm_puerta_de_europaFootprints),
  entry(lm_reunion_towerSpec, lm_reunion_towerPalettes, lm_reunion_towerFootprints),
  entry(lm_bank_of_america_plaza_dallasSpec, lm_bank_of_america_plaza_dallasPalettes, lm_bank_of_america_plaza_dallasFootprints),
  entry(lm_margaret_hunt_hill_bridgeSpec, lm_margaret_hunt_hill_bridgePalettes, lm_margaret_hunt_hill_bridgeFootprints, lm_margaret_hunt_hill_bridgeRoad),
  entry(lm_margaret_mcdermott_bridgeSpec, lm_margaret_mcdermott_bridgePalettes, lm_margaret_mcdermott_bridgeFootprints, lm_margaret_mcdermott_bridgeRoad),
  entry(lm_washington_monumentSpec, lm_washington_monumentPalettes, lm_washington_monumentFootprints),
  entry(lm_united_states_capitolSpec, lm_united_states_capitolPalettes, lm_united_states_capitolFootprints),
  entry(lm_lincoln_memorialSpec, lm_lincoln_memorialPalettes, lm_lincoln_memorialFootprints),
  entry(lm_arlington_memorial_bridgeSpec, lm_arlington_memorial_bridgePalettes, lm_arlington_memorial_bridgeFootprints, lm_arlington_memorial_bridgeRoad),
  entry(lm_edificio_coltejerSpec, lm_edificio_coltejerPalettes, lm_edificio_coltejerFootprints),
  entry(lm_catedral_metropolitana_de_medellinSpec, lm_catedral_metropolitana_de_medellinPalettes, lm_catedral_metropolitana_de_medellinFootprints),
  entry(lm_palacio_de_la_cultura_medellinSpec, lm_palacio_de_la_cultura_medellinPalettes, lm_palacio_de_la_cultura_medellinFootprints),
  entry(lm_old_orange_county_courthouseSpec, lm_old_orange_county_courthousePalettes, lm_old_orange_county_courthouseFootprints),
  entry(lm_christ_cathedralSpec, lm_christ_cathedralPalettes, lm_christ_cathedralFootprints),
  entry(lm_mission_innSpec, lm_mission_innPalettes, lm_mission_innFootprints),
  entry(lm_palace_of_the_parliamentSpec, lm_palace_of_the_parliamentPalettes, lm_palace_of_the_parliamentFootprints),
  entry(lm_arcul_de_triumfSpec, lm_arcul_de_triumfPalettes, lm_arcul_de_triumfFootprints),
  entry(lm_romanian_athenaeumSpec, lm_romanian_athenaeumPalettes, lm_romanian_athenaeumFootprints),
  entry(lm_colosseumSpec, lm_colosseumPalettes, lm_colosseumFootprints),
  entry(lm_altare_della_patriaSpec, lm_altare_della_patriaPalettes, lm_altare_della_patriaFootprints),
  entry(lm_st_peters_basilicaSpec, lm_st_peters_basilicaPalettes, lm_st_peters_basilicaFootprints),
  entry(lm_teatro_nacional_de_costa_ricaSpec, lm_teatro_nacional_de_costa_ricaPalettes, lm_teatro_nacional_de_costa_ricaFootprints),
  entry(lm_catedral_metropolitana_san_joseSpec, lm_catedral_metropolitana_san_josePalettes, lm_catedral_metropolitana_san_joseFootprints),
  entry(lm_basilique_de_fourviereSpec, lm_basilique_de_fourvierePalettes, lm_basilique_de_fourviereFootprints),
  entry(lm_tour_part_dieuSpec, lm_tour_part_dieuPalettes, lm_tour_part_dieuFootprints),
  entry(lm_musee_des_confluencesSpec, lm_musee_des_confluencesPalettes, lm_musee_des_confluencesFootprints),
  entry(lm_gratte_ciel_villeurbanneSpec, lm_gratte_ciel_villeurbannePalettes, lm_gratte_ciel_villeurbanneFootprints),
  entry(lm_torre_colpatriaSpec, lm_torre_colpatriaPalettes, lm_torre_colpatriaFootprints),
  entry(lm_catedral_primada_de_colombiaSpec, lm_catedral_primada_de_colombiaPalettes, lm_catedral_primada_de_colombiaFootprints),
  entry(lm_liberty_memorialSpec, lm_liberty_memorialPalettes, lm_liberty_memorialFootprints),
  entry(lm_christopher_s_bond_bridgeSpec, lm_christopher_s_bond_bridgePalettes, lm_christopher_s_bond_bridgeFootprints, lm_christopher_s_bond_bridgeRoad),
  entry(lm_lions_gate_bridgeSpec, lm_lions_gate_bridgePalettes, lm_lions_gate_bridgeFootprints, lm_lions_gate_bridgeRoad),
  entry(lm_port_mann_bridgeSpec, lm_port_mann_bridgePalettes, lm_port_mann_bridgeFootprints, lm_port_mann_bridgeRoad),
  entry(lm_burrard_street_bridgeSpec, lm_burrard_street_bridgePalettes, lm_burrard_street_bridgeFootprints, lm_burrard_street_bridgeRoad),
  entry(lm_canada_placeSpec, lm_canada_placePalettes, lm_canada_placeFootprints),
  entry(lm_science_world_vancouverSpec, lm_science_world_vancouverPalettes, lm_science_world_vancouverFootprints),
  entry(lm_bc_placeSpec, lm_bc_placePalettes, lm_bc_placeFootprints),
  entry(lm_harbour_centreSpec, lm_harbour_centrePalettes, lm_harbour_centreFootprints),
  entry(lm_vancouver_houseSpec, lm_vancouver_housePalettes, lm_vancouver_houseFootprints),
  entry(lm_bc_parliament_buildingsSpec, lm_bc_parliament_buildingsPalettes, lm_bc_parliament_buildingsFootprints),
  entry(lm_fairmont_empressSpec, lm_fairmont_empressPalettes, lm_fairmont_empressFootprints),
  entry(lm_alberta_legislature_buildingSpec, lm_alberta_legislature_buildingPalettes, lm_alberta_legislature_buildingFootprints),
  entry(lm_walterdale_bridgeSpec, lm_walterdale_bridgePalettes, lm_walterdale_bridgeFootprints, lm_walterdale_bridgeRoad),
  entry(lm_fairmont_banff_springsSpec, lm_fairmont_banff_springsPalettes, lm_fairmont_banff_springsFootprints),
  entry(lm_canadian_museum_for_human_rightsSpec, lm_canadian_museum_for_human_rightsPalettes, lm_canadian_museum_for_human_rightsFootprints),
  entry(lm_storseisundet_bridgeSpec, lm_storseisundet_bridgePalettes, lm_storseisundet_bridgeFootprints, lm_storseisundet_bridgeRoad),
  entry(lm_halogaland_bridgeSpec, lm_halogaland_bridgePalettes, lm_halogaland_bridgeFootprints, lm_halogaland_bridgeRoad),
  entry(lm_hardanger_bridgeSpec, lm_hardanger_bridgePalettes, lm_hardanger_bridgeFootprints, lm_hardanger_bridgeRoad),
  entry(lm_tromso_bridgeSpec, lm_tromso_bridgePalettes, lm_tromso_bridgeFootprints, lm_tromso_bridgeRoad),
  entry(lm_helgeland_bridgeSpec, lm_helgeland_bridgePalettes, lm_helgeland_bridgeFootprints, lm_helgeland_bridgeRoad),
  entry(lm_svinesund_bridgeSpec, lm_svinesund_bridgePalettes, lm_svinesund_bridgeFootprints, lm_svinesund_bridgeRoad),
  entry(lm_oslo_opera_houseSpec, lm_oslo_opera_housePalettes, lm_oslo_opera_houseFootprints),
  entry(lm_oslo_city_hallSpec, lm_oslo_city_hallPalettes, lm_oslo_city_hallFootprints),
  entry(lm_royal_palace_osloSpec, lm_royal_palace_osloPalettes, lm_royal_palace_osloFootprints),
  entry(lm_holmenkollbakkenSpec, lm_holmenkollbakkenPalettes, lm_holmenkollbakkenFootprints),
  entry(lm_munch_museumSpec, lm_munch_museumPalettes, lm_munch_museumFootprints),
  entry(lm_akershus_fortressSpec, lm_akershus_fortressPalettes, lm_akershus_fortressFootprints),
  entry(lm_astrup_fearnley_museumSpec, lm_astrup_fearnley_museumPalettes, lm_astrup_fearnley_museumFootprints),
  entry(lm_bryggenSpec, lm_bryggenPalettes, lm_bryggenFootprints),
  entry(lm_nidaros_cathedralSpec, lm_nidaros_cathedralPalettes, lm_nidaros_cathedralFootprints),
  entry(lm_arctic_cathedralSpec, lm_arctic_cathedralPalettes, lm_arctic_cathedralFootprints),
  entry(lm_norwegian_petroleum_museumSpec, lm_norwegian_petroleum_museumPalettes, lm_norwegian_petroleum_museumFootprints),
  entry(lm_vikingskipetSpec, lm_vikingskipetPalettes, lm_vikingskipetFootprints),
  entry(lm_kilden_performing_arts_centreSpec, lm_kilden_performing_arts_centrePalettes, lm_kilden_performing_arts_centreFootprints),
  entry(lm_borgund_stave_churchSpec, lm_borgund_stave_churchPalettes, lm_borgund_stave_churchFootprints),
  entry(lm_farris_badSpec, lm_farris_badPalettes, lm_farris_badFootprints),
  entry(lm_pont_neuf_toulouseSpec, lm_pont_neuf_toulousePalettes, lm_pont_neuf_toulouseFootprints, lm_pont_neuf_toulouseRoad),
  entry(lm_pont_des_catalansSpec, lm_pont_des_catalansPalettes, lm_pont_des_catalansFootprints, lm_pont_des_catalansRoad),
  entry(lm_viaduc_de_millauSpec, lm_viaduc_de_millauPalettes, lm_viaduc_de_millauFootprints, lm_viaduc_de_millauRoad),
  entry(lm_basilique_saint_serninSpec, lm_basilique_saint_serninPalettes, lm_basilique_saint_serninFootprints),
  entry(lm_capitole_de_toulouseSpec, lm_capitole_de_toulousePalettes, lm_capitole_de_toulouseFootprints),
  entry(lm_dome_de_la_graveSpec, lm_dome_de_la_gravePalettes, lm_dome_de_la_graveFootprints),
  entry(lm_cite_de_l_espaceSpec, lm_cite_de_l_espacePalettes, lm_cite_de_l_espaceFootprints),
  entry(lm_couvent_des_jacobinsSpec, lm_couvent_des_jacobinsPalettes, lm_couvent_des_jacobinsFootprints),
  entry(lm_cite_de_carcassonneSpec, lm_cite_de_carcassonnePalettes, lm_cite_de_carcassonneFootprints),
  entry(lm_cathedrale_sainte_cecile_albiSpec, lm_cathedrale_sainte_cecile_albiPalettes, lm_cathedrale_sainte_cecile_albiFootprints),
  entry(lm_pont_saint_pierreSpec, lm_pont_saint_pierrePalettes, lm_pont_saint_pierreFootprints, lm_pont_saint_pierreRoad),
  entry(lm_pont_saint_michelSpec, lm_pont_saint_michelPalettes, lm_pont_saint_michelFootprints, lm_pont_saint_michelRoad),
  entry(lm_ponts_jumeauxSpec, lm_ponts_jumeauxPalettes, lm_ponts_jumeauxFootprints, lm_ponts_jumeauxRoad),
  entry(lm_viaduc_de_calixSpec, lm_viaduc_de_calixPalettes, lm_viaduc_de_calixFootprints, lm_viaduc_de_calixRoad),
  entry(lm_pegasus_bridgeSpec, lm_pegasus_bridgePalettes, lm_pegasus_bridgeFootprints, lm_pegasus_bridgeRoad),
  entry(lm_pont_de_la_fonderieSpec, lm_pont_de_la_fonderiePalettes, lm_pont_de_la_fonderieFootprints, lm_pont_de_la_fonderieRoad),
  entry(lm_pont_de_normandieSpec, lm_pont_de_normandiePalettes, lm_pont_de_normandieFootprints, lm_pont_de_normandieRoad),
  entry(lm_abbaye_aux_hommesSpec, lm_abbaye_aux_hommesPalettes, lm_abbaye_aux_hommesFootprints),
  entry(lm_chateau_de_caenSpec, lm_chateau_de_caenPalettes, lm_chateau_de_caenFootprints),
  entry(lm_eglise_saint_pierre_caenSpec, lm_eglise_saint_pierre_caenPalettes, lm_eglise_saint_pierre_caenFootprints),
  entry(lm_abbaye_aux_damesSpec, lm_abbaye_aux_damesPalettes, lm_abbaye_aux_damesFootprints),
  entry(lm_memorial_de_caenSpec, lm_memorial_de_caenPalettes, lm_memorial_de_caenFootprints),
  entry(lm_cathedrale_de_bayeuxSpec, lm_cathedrale_de_bayeuxPalettes, lm_cathedrale_de_bayeuxFootprints),
  entry(lm_georgia_state_capitolSpec, lm_georgia_state_capitolPalettes, lm_georgia_state_capitolFootprints),
  entry(lm_bank_of_america_plaza_atlantaSpec, lm_bank_of_america_plaza_atlantaPalettes, lm_bank_of_america_plaza_atlantaFootprints),
  entry(lm_sunshine_skyway_bridgeSpec, lm_sunshine_skyway_bridgePalettes, lm_sunshine_skyway_bridgeFootprints, lm_sunshine_skyway_bridgeRoad),
  entry(lm_dallas_city_hallSpec, lm_dallas_city_hallPalettes, lm_dallas_city_hallFootprints),
  entry(lm_fox_theatre_atlantaSpec, lm_fox_theatre_atlantaPalettes, lm_fox_theatre_atlantaFootprints),
  entry(lm_lviv_national_operaSpec, lm_lviv_national_operaPalettes, lm_lviv_national_operaFootprints),
  entry(lm_jpmorgan_chase_tower_houstonSpec, lm_jpmorgan_chase_tower_houstonPalettes, lm_jpmorgan_chase_tower_houstonFootprints),
  entry(lm_willis_towerSpec, lm_willis_towerPalettes, lm_willis_towerFootprints),
  entry(lm_mercedes_benz_stadiumSpec, lm_mercedes_benz_stadiumPalettes, lm_mercedes_benz_stadiumFootprints),
  entry(lm_edificio_de_correos_costa_ricaSpec, lm_edificio_de_correos_costa_ricaPalettes, lm_edificio_de_correos_costa_ricaFootprints),
  entry(lm_helsinki_cathedralSpec, lm_helsinki_cathedralPalettes, lm_helsinki_cathedralFootprints),
  entry(lm_freedom_tower_miamiSpec, lm_freedom_tower_miamiPalettes, lm_freedom_tower_miamiFootprints),
  entry(lm_texas_state_capitolSpec, lm_texas_state_capitolPalettes, lm_texas_state_capitolFootprints),
  entry(lm_ohio_statehouseSpec, lm_ohio_statehousePalettes, lm_ohio_statehouseFootprints),
  entry(lm_royal_palace_amsterdamSpec, lm_royal_palace_amsterdamPalettes, lm_royal_palace_amsterdamFootprints),
  entry(lm_vulcan_statueSpec, lm_vulcan_statuePalettes, lm_vulcan_statueFootprints),
  entry(lm_griffith_observatorySpec, lm_griffith_observatoryPalettes, lm_griffith_observatoryFootprints),
  entry(lm_mercedes_benz_museumSpec, lm_mercedes_benz_museumPalettes, lm_mercedes_benz_museumFootprints),
  entry(lm_notre_dame_de_la_gardeSpec, lm_notre_dame_de_la_gardePalettes, lm_notre_dame_de_la_gardeFootprints),
  entry(lm_att_stadiumSpec, lm_att_stadiumPalettes, lm_att_stadiumFootprints),
  entry(lm_golden_ears_bridgeSpec, lm_golden_ears_bridgePalettes, lm_golden_ears_bridgeFootprints, lm_golden_ears_bridgeRoad),
  entry(lm_westin_peachtree_plazaSpec, lm_westin_peachtree_plazaPalettes, lm_westin_peachtree_plazaFootprints),
  entry(lm_ponte_25_de_abrilSpec, lm_ponte_25_de_abrilPalettes, lm_ponte_25_de_abrilFootprints, lm_ponte_25_de_abrilRoad),
  entry(lm_white_houseSpec, lm_white_housePalettes, lm_white_houseFootprints),
  entry(lm_westerkerkSpec, lm_westerkerkPalettes, lm_westerkerkFootprints),
  entry(lm_cologne_cathedralSpec, lm_cologne_cathedralPalettes, lm_cologne_cathedralFootprints),
  entry(lm_london_eyeSpec, lm_london_eyePalettes, lm_london_eyeFootprints),
  entry(lm_fred_hartman_bridgeSpec, lm_fred_hartman_bridgePalettes, lm_fred_hartman_bridgeFootprints, lm_fred_hartman_bridgeRoad),
  entry(lm_peoples_salvation_cathedralSpec, lm_peoples_salvation_cathedralPalettes, lm_peoples_salvation_cathedralFootprints),
  entry(lm_pitt_river_bridgeSpec, lm_pitt_river_bridgePalettes, lm_pitt_river_bridgeFootprints, lm_pitt_river_bridgeRoad),
  entry(lm_museo_nacional_de_costa_ricaSpec, lm_museo_nacional_de_costa_ricaPalettes, lm_museo_nacional_de_costa_ricaFootprints),
  entry(lm_los_angeles_city_hallSpec, lm_los_angeles_city_hallPalettes, lm_los_angeles_city_hallFootprints),
  entry(lm_palacio_de_cibelesSpec, lm_palacio_de_cibelesPalettes, lm_palacio_de_cibelesFootprints),
  entry(lm_alex_fraser_bridgeSpec, lm_alex_fraser_bridgePalettes, lm_alex_fraser_bridgeFootprints, lm_alex_fraser_bridgeRoad),
  entry(lm_the_alamoSpec, lm_the_alamoPalettes, lm_the_alamoFootprints),
  entry(lm_skyview_atlantaSpec, lm_skyview_atlantaPalettes, lm_skyview_atlantaFootprints),
  entry(lm_frauenkirche_munichSpec, lm_frauenkirche_munichPalettes, lm_frauenkirche_munichFootprints),
  entry(lm_the_wheel_icon_parkSpec, lm_the_wheel_icon_parkPalettes, lm_the_wheel_icon_parkFootprints),
  entry(lm_washington_dc_templeSpec, lm_washington_dc_templePalettes, lm_washington_dc_templeFootprints),
  entry(lm_ironworkers_memorial_bridgeSpec, lm_ironworkers_memorial_bridgePalettes, lm_ironworkers_memorial_bridgeFootprints, lm_ironworkers_memorial_bridgeRoad),
  entry(lm_magere_brugSpec, lm_magere_brugPalettes, lm_magere_brugFootprints),
  entry(lm_tower_of_londonSpec, lm_tower_of_londonPalettes, lm_tower_of_londonFootprints),
  entry(lm_fountain_placeSpec, lm_fountain_placePalettes, lm_fountain_placeFootprints),
  entry(lm_motherland_monumentSpec, lm_motherland_monumentPalettes, lm_motherland_monumentFootprints),
  entry(lm_vincent_thomas_bridgeSpec, lm_vincent_thomas_bridgePalettes, lm_vincent_thomas_bridgeFootprints, lm_vincent_thomas_bridgeRoad),
  entry(lm_marine_buildingSpec, lm_marine_buildingPalettes, lm_marine_buildingFootprints),
  entry(lm_basilica_de_los_angeles_cartagoSpec, lm_basilica_de_los_angeles_cartagoPalettes, lm_basilica_de_los_angeles_cartagoFootprints),
  entry(lm_edificio_metropolisSpec, lm_edificio_metropolisPalettes, lm_edificio_metropolisFootprints),
  entry(lm_high_museum_of_artSpec, lm_high_museum_of_artPalettes, lm_high_museum_of_artFootprints),
  entry(lm_williams_towerSpec, lm_williams_towerPalettes, lm_williams_towerFootprints),
  entry(lm_basarab_overpassSpec, lm_basarab_overpassPalettes, lm_basarab_overpassFootprints, lm_basarab_overpassRoad),
  entry(lm_john_hancock_centerSpec, lm_john_hancock_centerPalettes, lm_john_hancock_centerFootprints),
  entry(lm_att_building_nashvilleSpec, lm_att_building_nashvillePalettes, lm_att_building_nashvilleFootprints),
  entry(lm_granville_street_bridgeSpec, lm_granville_street_bridgePalettes, lm_granville_street_bridgeFootprints, lm_granville_street_bridgeRoad),
  entry(lm_jefferson_memorialSpec, lm_jefferson_memorialPalettes, lm_jefferson_memorialFootprints),
  entry(lm_adam_torenSpec, lm_adam_torenPalettes, lm_adam_torenFootprints),
  entry(lm_buckingham_palaceSpec, lm_buckingham_palacePalettes, lm_buckingham_palaceFootprints),
  entry(lm_samuel_beckett_bridgeSpec, lm_samuel_beckett_bridgePalettes, lm_samuel_beckett_bridgeFootprints, lm_samuel_beckett_bridgeRoad),
  entry(lm_fairmont_hotel_vancouverSpec, lm_fairmont_hotel_vancouverPalettes, lm_fairmont_hotel_vancouverFootprints),
  entry(lm_pennybacker_bridgeSpec, lm_pennybacker_bridgePalettes, lm_pennybacker_bridgeFootprints, lm_pennybacker_bridgeRoad),
  entry(lm_walt_disney_concert_hallSpec, lm_walt_disney_concert_hallPalettes, lm_walt_disney_concert_hallFootprints),
  entry(lm_one_atlantic_centerSpec, lm_one_atlantic_centerPalettes, lm_one_atlantic_centerFootprints),
  entry(lm_cambie_bridgeSpec, lm_cambie_bridgePalettes, lm_cambie_bridgeFootprints, lm_cambie_bridgeRoad),
  entry(lm_estadio_nacional_costa_ricaSpec, lm_estadio_nacional_costa_ricaPalettes, lm_estadio_nacional_costa_ricaFootprints),
  entry(lm_uspenski_cathedralSpec, lm_uspenski_cathedralPalettes, lm_uspenski_cathedralFootprints),
  entry(lm_atomiumSpec, lm_atomiumPalettes, lm_atomiumFootprints),
  entry(lm_chords_bridgeSpec, lm_chords_bridgePalettes, lm_chords_bridgeFootprints),
  entry(lm_bob_kerrey_pedestrian_bridgeSpec, lm_bob_kerrey_pedestrian_bridgePalettes, lm_bob_kerrey_pedestrian_bridgeFootprints),
  entry(lm_plant_hall_tampaSpec, lm_plant_hall_tampaPalettes, lm_plant_hall_tampaFootprints),
  entry(lm_catedral_de_la_almudenaSpec, lm_catedral_de_la_almudenaPalettes, lm_catedral_de_la_almudenaFootprints),
  entry(lm_tower_of_the_americasSpec, lm_tower_of_the_americasPalettes, lm_tower_of_the_americasFootprints),
  entry(lm_woodrow_wilson_bridgeSpec, lm_woodrow_wilson_bridgePalettes, lm_woodrow_wilson_bridgeFootprints, lm_woodrow_wilson_bridgeRoad),
  entry(lm_leveque_towerSpec, lm_leveque_towerPalettes, lm_leveque_towerFootprints),
  entry(lm_nemo_science_museumSpec, lm_nemo_science_museumPalettes, lm_nemo_science_museumFootprints),
  entry(lm_vancouver_public_librarySpec, lm_vancouver_public_libraryPalettes, lm_vancouver_public_libraryFootprints),
  entry(lm_queen_elizabeth_ii_bridgeSpec, lm_queen_elizabeth_ii_bridgePalettes, lm_queen_elizabeth_ii_bridgeFootprints, lm_queen_elizabeth_ii_bridgeRoad),
  entry(lm_saturn_v_huntsvilleSpec, lm_saturn_v_huntsvillePalettes, lm_saturn_v_huntsvilleFootprints),
  entry(lm_charles_bridgeSpec, lm_charles_bridgePalettes, lm_charles_bridgeFootprints),
  entry(lm_grande_archeSpec, lm_grande_archePalettes, lm_grande_archeFootprints),
  entry(lm_sixth_street_viaductSpec, lm_sixth_street_viaductPalettes, lm_sixth_street_viaductFootprints, lm_sixth_street_viaductRoad),
  entry(lm_perot_museumSpec, lm_perot_museumPalettes, lm_perot_museumFootprints),
  entry(lm_cec_palaceSpec, lm_cec_palacePalettes, lm_cec_palaceFootprints),
  entry(lm_jackson_street_bridge_atlantaSpec, lm_jackson_street_bridge_atlantaPalettes, lm_jackson_street_bridge_atlantaFootprints, lm_jackson_street_bridge_atlantaRoad),
  entry(lm_knight_street_bridgeSpec, lm_knight_street_bridgePalettes, lm_knight_street_bridgeFootprints, lm_knight_street_bridgeRoad),
  entry(lm_porsche_museumSpec, lm_porsche_museumPalettes, lm_porsche_museumFootprints),
  entry(lm_centre_pompidouSpec, lm_centre_pompidouPalettes, lm_centre_pompidouFootprints),
  entry(lm_washington_national_cathedralSpec, lm_washington_national_cathedralPalettes, lm_washington_national_cathedralFootprints),
  entry(lm_mucemSpec, lm_mucemPalettes, lm_mucemFootprints),
  entry(lm_oresund_bridgeSpec, lm_oresund_bridgePalettes, lm_oresund_bridgeFootprints, lm_oresund_bridgeRoad),
  entry(lm_yerevan_cascadeSpec, lm_yerevan_cascadePalettes, lm_yerevan_cascadeFootprints),
  entry(lm_rogers_arenaSpec, lm_rogers_arenaPalettes, lm_rogers_arenaFootprints),
  entry(lm_edificio_metalicoSpec, lm_edificio_metalicoPalettes, lm_edificio_metalicoFootprints),
  entry(lm_san_jacinto_monumentSpec, lm_san_jacinto_monumentPalettes, lm_san_jacinto_monumentFootprints),
  entry(lm_concertgebouwSpec, lm_concertgebouwPalettes, lm_concertgebouwFootprints),
  entry(lm_tour_montparnasseSpec, lm_tour_montparnassePalettes, lm_tour_montparnasseFootprints),
  entry(lm_westminster_abbeySpec, lm_westminster_abbeyPalettes, lm_westminster_abbeyFootprints),
  entry(lm_opera_de_lyonSpec, lm_opera_de_lyonPalettes, lm_opera_de_lyonFootprints),
  entry(lm_santiago_bernabeuSpec, lm_santiago_bernabeuPalettes, lm_santiago_bernabeuFootprints),
  entry(lm_saint_sophia_cathedral_kyivSpec, lm_saint_sophia_cathedral_kyivPalettes, lm_saint_sophia_cathedral_kyivFootprints),
  entry(lm_oak_street_bridgeSpec, lm_oak_street_bridgePalettes, lm_oak_street_bridgeFootprints, lm_oak_street_bridgeRoad),
  entry(lm_riverside_county_courthouseSpec, lm_riverside_county_courthousePalettes, lm_riverside_county_courthouseFootprints),
  entry(lm_place_de_la_concorde_obeliskSpec, lm_place_de_la_concorde_obeliskPalettes, lm_place_de_la_concorde_obeliskFootprints),
  entry(lm_atlanta_city_hallSpec, lm_atlanta_city_hallPalettes, lm_atlanta_city_hallFootprints),
  entry(lm_ut_towerSpec, lm_ut_towerPalettes, lm_ut_towerFootprints),
  entry(lm_belem_towerSpec, lm_belem_towerPalettes, lm_belem_towerFootprints),
  entry(lm_parthenonSpec, lm_parthenonPalettes, lm_parthenonFootprints),
  entry(lm_bank_of_america_corporate_centerSpec, lm_bank_of_america_corporate_centerPalettes, lm_bank_of_america_corporate_centerFootprints),
  entry(lm_miami_towerSpec, lm_miami_towerPalettes, lm_miami_towerFootprints),
  entry(lm_vancouver_art_gallerySpec, lm_vancouver_art_galleryPalettes, lm_vancouver_art_galleryFootprints),
  entry(lm_pont_de_bercySpec, lm_pont_de_bercyPalettes, lm_pont_de_bercyFootprints, lm_pont_de_bercyRoad),
]);

export const topCitiesLandmark = (id) => TOP_CITIES_LANDMARKS.find((l) => l.id === id) || null;
