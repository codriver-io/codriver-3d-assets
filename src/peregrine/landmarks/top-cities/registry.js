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
]);

export const topCitiesLandmark = (id) => TOP_CITIES_LANDMARKS.find((l) => l.id === id) || null;
