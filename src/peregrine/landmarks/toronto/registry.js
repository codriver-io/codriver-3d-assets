// The Toronto landmark registry the RUNTIME reads: spec, palettes, footprints and
// (for a road-carrying bridge) its road layer. Geometry, inspector views and
// manifest text are authoring-time only and live in authoring.js, so none of it
// ships in peregrine.js. A landmark is added by filling in its folder, never by
// editing a shared switch. File contract: docs/3d-toronto-landmarks.md.
import { SPEC as artGalleryOfOntarioSpec, PALETTES as artGalleryOfOntarioPalettes } from './art-gallery-of-ontario/config.js';
import { FOOTPRINTS as artGalleryOfOntarioFootprints } from './art-gallery-of-ontario/footprint.js';
import { SPEC as casaLomaSpec, PALETTES as casaLomaPalettes } from './casa-loma/config.js';
import { FOOTPRINTS as casaLomaFootprints } from './casa-loma/footprint.js';
import { SPEC as cinesphereSpec, PALETTES as cinespherePalettes } from './cinesphere/config.js';
import { FOOTPRINTS as cinesphereFootprints } from './cinesphere/footprint.js';
import { SPEC as cnTowerSpec, PALETTES as cnTowerPalettes } from './cn-tower/config.js';
import { FOOTPRINTS as cnTowerFootprints } from './cn-tower/footprint.js';
import { SPEC as fairmontRoyalYorkSpec, PALETTES as fairmontRoyalYorkPalettes } from './fairmont-royal-york/config.js';
import { FOOTPRINTS as fairmontRoyalYorkFootprints } from './fairmont-royal-york/footprint.js';
import { SPEC as firstCanadianPlaceSpec, PALETTES as firstCanadianPlacePalettes } from './first-canadian-place/config.js';
import { FOOTPRINTS as firstCanadianPlaceFootprints } from './first-canadian-place/footprint.js';
import { SPEC as flatironBuildingSpec, PALETTES as flatironBuildingPalettes } from './flatiron-building/config.js';
import { FOOTPRINTS as flatironBuildingFootprints } from './flatiron-building/footprint.js';
import { SPEC as humberBayArchBridgeSpec, PALETTES as humberBayArchBridgePalettes } from './humber-bay-arch-bridge/config.js';
import { FOOTPRINTS as humberBayArchBridgeFootprints } from './humber-bay-arch-bridge/footprint.js';
import { SPEC as oldCityHallSpec, PALETTES as oldCityHallPalettes } from './old-city-hall/config.js';
import { FOOTPRINTS as oldCityHallFootprints } from './old-city-hall/footprint.js';
import { SPEC as ontarioLegislativeBuildingSpec, PALETTES as ontarioLegislativeBuildingPalettes } from './ontario-legislative-building/config.js';
import { FOOTPRINTS as ontarioLegislativeBuildingFootprints } from './ontario-legislative-building/footprint.js';
import { SPEC as princeEdwardViaductSpec, PALETTES as princeEdwardViaductPalettes } from './prince-edward-viaduct/config.js';
import { FOOTPRINTS as princeEdwardViaductFootprints } from './prince-edward-viaduct/footprint.js';
import { SPEC as rogersCentreSpec, PALETTES as rogersCentrePalettes } from './rogers-centre/config.js';
import { FOOTPRINTS as rogersCentreFootprints } from './rogers-centre/footprint.js';
import { SPEC as royalOntarioMuseumSpec, PALETTES as royalOntarioMuseumPalettes } from './royal-ontario-museum/config.js';
import { FOOTPRINTS as royalOntarioMuseumFootprints } from './royal-ontario-museum/footprint.js';
import { SPEC as scotiaPlazaSpec, PALETTES as scotiaPlazaPalettes } from './scotia-plaza/config.js';
import { FOOTPRINTS as scotiaPlazaFootprints } from './scotia-plaza/footprint.js';
import { SPEC as scotiabankArenaSpec, PALETTES as scotiabankArenaPalettes } from './scotiabank-arena/config.js';
import { FOOTPRINTS as scotiabankArenaFootprints } from './scotiabank-arena/footprint.js';
import { SPEC as sharpCentreForDesignSpec, PALETTES as sharpCentreForDesignPalettes } from './sharp-centre-for-design/config.js';
import { FOOTPRINTS as sharpCentreForDesignFootprints } from './sharp-centre-for-design/footprint.js';
import { SPEC as stLawrenceMarketSpec, PALETTES as stLawrenceMarketPalettes } from './st-lawrence-market/config.js';
import { FOOTPRINTS as stLawrenceMarketFootprints } from './st-lawrence-market/footprint.js';
import { SPEC as torontoCityHallSpec, PALETTES as torontoCityHallPalettes } from './toronto-city-hall/config.js';
import { FOOTPRINTS as torontoCityHallFootprints } from './toronto-city-hall/footprint.js';
import { SPEC as torontoDominionCentreSpec, PALETTES as torontoDominionCentrePalettes } from './toronto-dominion-centre/config.js';
import { FOOTPRINTS as torontoDominionCentreFootprints } from './toronto-dominion-centre/footprint.js';
import { SPEC as unionStationSpec, PALETTES as unionStationPalettes } from './union-station/config.js';
import { FOOTPRINTS as unionStationFootprints } from './union-station/footprint.js';
import { ROAD_LAYER as princeEdwardViaductRoad } from './prince-edward-viaduct/layer.js';

const entry = (spec, palettes, footprints, roadLayer = null) => Object.freeze({
  id: spec.id, spec, palettes, footprints,
  // A road-fitted bridge layer, { Layer, profile } from createBridgeLayer; null for everything else.
  roadLayer,
  // Bridges live in public/models/bridges, everything else in buildings.
  dir: spec.kind === 'bridge' ? 'bridges' : 'buildings',
});

export const TORONTO_LANDMARKS = Object.freeze([
  entry(artGalleryOfOntarioSpec, artGalleryOfOntarioPalettes, artGalleryOfOntarioFootprints),
  entry(casaLomaSpec, casaLomaPalettes, casaLomaFootprints),
  entry(cinesphereSpec, cinespherePalettes, cinesphereFootprints),
  entry(cnTowerSpec, cnTowerPalettes, cnTowerFootprints),
  entry(fairmontRoyalYorkSpec, fairmontRoyalYorkPalettes, fairmontRoyalYorkFootprints),
  entry(firstCanadianPlaceSpec, firstCanadianPlacePalettes, firstCanadianPlaceFootprints),
  entry(flatironBuildingSpec, flatironBuildingPalettes, flatironBuildingFootprints),
  entry(humberBayArchBridgeSpec, humberBayArchBridgePalettes, humberBayArchBridgeFootprints),
  entry(oldCityHallSpec, oldCityHallPalettes, oldCityHallFootprints),
  entry(ontarioLegislativeBuildingSpec, ontarioLegislativeBuildingPalettes, ontarioLegislativeBuildingFootprints),
  entry(princeEdwardViaductSpec, princeEdwardViaductPalettes, princeEdwardViaductFootprints, princeEdwardViaductRoad),
  entry(rogersCentreSpec, rogersCentrePalettes, rogersCentreFootprints),
  entry(royalOntarioMuseumSpec, royalOntarioMuseumPalettes, royalOntarioMuseumFootprints),
  entry(scotiaPlazaSpec, scotiaPlazaPalettes, scotiaPlazaFootprints),
  entry(scotiabankArenaSpec, scotiabankArenaPalettes, scotiabankArenaFootprints),
  entry(sharpCentreForDesignSpec, sharpCentreForDesignPalettes, sharpCentreForDesignFootprints),
  entry(stLawrenceMarketSpec, stLawrenceMarketPalettes, stLawrenceMarketFootprints),
  entry(torontoCityHallSpec, torontoCityHallPalettes, torontoCityHallFootprints),
  entry(torontoDominionCentreSpec, torontoDominionCentrePalettes, torontoDominionCentreFootprints),
  entry(unionStationSpec, unionStationPalettes, unionStationFootprints),
]);

export const torontoLandmark = (id) => TORONTO_LANDMARKS.find((l) => l.id === id) || null;
