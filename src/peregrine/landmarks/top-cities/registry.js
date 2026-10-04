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
]);

export const topCitiesLandmark = (id) => TOP_CITIES_LANDMARKS.find((l) => l.id === id) || null;
