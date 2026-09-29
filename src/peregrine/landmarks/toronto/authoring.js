// Authoring-time view of the Toronto registry: the runtime entries plus geometry,
// inspector views, manifest text and OSM ids. Read by the GLB build, the
// inspector, the screenshot harness and the tests; never by the app bundle.
import { TORONTO_LANDMARKS as RUNTIME } from './registry.js';
import { MANIFEST as artGalleryOfOntarioManifest } from './art-gallery-of-ontario/config.js';
import { OSM_WAYS as artGalleryOfOntarioWays } from './art-gallery-of-ontario/footprint.js';
import { create as artGalleryOfOntarioCreate } from './art-gallery-of-ontario/geometry.js';
import { VIEWS as artGalleryOfOntarioViews } from './art-gallery-of-ontario/views.js';
import { MANIFEST as casaLomaManifest } from './casa-loma/config.js';
import { OSM_WAYS as casaLomaWays } from './casa-loma/footprint.js';
import { create as casaLomaCreate } from './casa-loma/geometry.js';
import { VIEWS as casaLomaViews } from './casa-loma/views.js';
import { MANIFEST as cinesphereManifest } from './cinesphere/config.js';
import { OSM_WAYS as cinesphereWays } from './cinesphere/footprint.js';
import { create as cinesphereCreate } from './cinesphere/geometry.js';
import { VIEWS as cinesphereViews } from './cinesphere/views.js';
import { MANIFEST as cnTowerManifest } from './cn-tower/config.js';
import { OSM_WAYS as cnTowerWays } from './cn-tower/footprint.js';
import { create as cnTowerCreate } from './cn-tower/geometry.js';
import { VIEWS as cnTowerViews } from './cn-tower/views.js';
import { MANIFEST as fairmontRoyalYorkManifest } from './fairmont-royal-york/config.js';
import { OSM_WAYS as fairmontRoyalYorkWays } from './fairmont-royal-york/footprint.js';
import { create as fairmontRoyalYorkCreate } from './fairmont-royal-york/geometry.js';
import { VIEWS as fairmontRoyalYorkViews } from './fairmont-royal-york/views.js';
import { MANIFEST as firstCanadianPlaceManifest } from './first-canadian-place/config.js';
import { OSM_WAYS as firstCanadianPlaceWays } from './first-canadian-place/footprint.js';
import { create as firstCanadianPlaceCreate } from './first-canadian-place/geometry.js';
import { VIEWS as firstCanadianPlaceViews } from './first-canadian-place/views.js';
import { MANIFEST as flatironBuildingManifest } from './flatiron-building/config.js';
import { OSM_WAYS as flatironBuildingWays } from './flatiron-building/footprint.js';
import { create as flatironBuildingCreate } from './flatiron-building/geometry.js';
import { VIEWS as flatironBuildingViews } from './flatiron-building/views.js';
import { MANIFEST as humberBayArchBridgeManifest } from './humber-bay-arch-bridge/config.js';
import { OSM_WAYS as humberBayArchBridgeWays } from './humber-bay-arch-bridge/footprint.js';
import { create as humberBayArchBridgeCreate } from './humber-bay-arch-bridge/geometry.js';
import { VIEWS as humberBayArchBridgeViews } from './humber-bay-arch-bridge/views.js';
import { MANIFEST as oldCityHallManifest } from './old-city-hall/config.js';
import { OSM_WAYS as oldCityHallWays } from './old-city-hall/footprint.js';
import { create as oldCityHallCreate } from './old-city-hall/geometry.js';
import { VIEWS as oldCityHallViews } from './old-city-hall/views.js';
import { MANIFEST as ontarioLegislativeBuildingManifest } from './ontario-legislative-building/config.js';
import { OSM_WAYS as ontarioLegislativeBuildingWays } from './ontario-legislative-building/footprint.js';
import { create as ontarioLegislativeBuildingCreate } from './ontario-legislative-building/geometry.js';
import { VIEWS as ontarioLegislativeBuildingViews } from './ontario-legislative-building/views.js';
import { MANIFEST as princeEdwardViaductManifest } from './prince-edward-viaduct/config.js';
import { OSM_WAYS as princeEdwardViaductWays } from './prince-edward-viaduct/footprint.js';
import { create as princeEdwardViaductCreate } from './prince-edward-viaduct/geometry.js';
import { VIEWS as princeEdwardViaductViews } from './prince-edward-viaduct/views.js';
import { MANIFEST as rogersCentreManifest } from './rogers-centre/config.js';
import { OSM_WAYS as rogersCentreWays } from './rogers-centre/footprint.js';
import { create as rogersCentreCreate } from './rogers-centre/geometry.js';
import { VIEWS as rogersCentreViews } from './rogers-centre/views.js';
import { MANIFEST as royalOntarioMuseumManifest } from './royal-ontario-museum/config.js';
import { OSM_WAYS as royalOntarioMuseumWays } from './royal-ontario-museum/footprint.js';
import { create as royalOntarioMuseumCreate } from './royal-ontario-museum/geometry.js';
import { VIEWS as royalOntarioMuseumViews } from './royal-ontario-museum/views.js';
import { MANIFEST as scotiaPlazaManifest } from './scotia-plaza/config.js';
import { OSM_WAYS as scotiaPlazaWays } from './scotia-plaza/footprint.js';
import { create as scotiaPlazaCreate } from './scotia-plaza/geometry.js';
import { VIEWS as scotiaPlazaViews } from './scotia-plaza/views.js';
import { MANIFEST as scotiabankArenaManifest } from './scotiabank-arena/config.js';
import { OSM_WAYS as scotiabankArenaWays } from './scotiabank-arena/footprint.js';
import { create as scotiabankArenaCreate } from './scotiabank-arena/geometry.js';
import { VIEWS as scotiabankArenaViews } from './scotiabank-arena/views.js';
import { MANIFEST as sharpCentreForDesignManifest } from './sharp-centre-for-design/config.js';
import { OSM_WAYS as sharpCentreForDesignWays } from './sharp-centre-for-design/footprint.js';
import { create as sharpCentreForDesignCreate } from './sharp-centre-for-design/geometry.js';
import { VIEWS as sharpCentreForDesignViews } from './sharp-centre-for-design/views.js';
import { MANIFEST as stLawrenceMarketManifest } from './st-lawrence-market/config.js';
import { OSM_WAYS as stLawrenceMarketWays } from './st-lawrence-market/footprint.js';
import { create as stLawrenceMarketCreate } from './st-lawrence-market/geometry.js';
import { VIEWS as stLawrenceMarketViews } from './st-lawrence-market/views.js';
import { MANIFEST as torontoCityHallManifest } from './toronto-city-hall/config.js';
import { OSM_WAYS as torontoCityHallWays } from './toronto-city-hall/footprint.js';
import { create as torontoCityHallCreate } from './toronto-city-hall/geometry.js';
import { VIEWS as torontoCityHallViews } from './toronto-city-hall/views.js';
import { MANIFEST as torontoDominionCentreManifest } from './toronto-dominion-centre/config.js';
import { OSM_WAYS as torontoDominionCentreWays } from './toronto-dominion-centre/footprint.js';
import { create as torontoDominionCentreCreate } from './toronto-dominion-centre/geometry.js';
import { VIEWS as torontoDominionCentreViews } from './toronto-dominion-centre/views.js';
import { MANIFEST as unionStationManifest } from './union-station/config.js';
import { OSM_WAYS as unionStationWays } from './union-station/footprint.js';
import { create as unionStationCreate } from './union-station/geometry.js';
import { VIEWS as unionStationViews } from './union-station/views.js';

const authoring = {
  'art-gallery-of-ontario': { manifest: artGalleryOfOntarioManifest, osmWays: artGalleryOfOntarioWays, create: artGalleryOfOntarioCreate, views: artGalleryOfOntarioViews },
  'casa-loma': { manifest: casaLomaManifest, osmWays: casaLomaWays, create: casaLomaCreate, views: casaLomaViews },
  'cinesphere': { manifest: cinesphereManifest, osmWays: cinesphereWays, create: cinesphereCreate, views: cinesphereViews },
  'cn-tower': { manifest: cnTowerManifest, osmWays: cnTowerWays, create: cnTowerCreate, views: cnTowerViews },
  'fairmont-royal-york': { manifest: fairmontRoyalYorkManifest, osmWays: fairmontRoyalYorkWays, create: fairmontRoyalYorkCreate, views: fairmontRoyalYorkViews },
  'first-canadian-place': { manifest: firstCanadianPlaceManifest, osmWays: firstCanadianPlaceWays, create: firstCanadianPlaceCreate, views: firstCanadianPlaceViews },
  'flatiron-building': { manifest: flatironBuildingManifest, osmWays: flatironBuildingWays, create: flatironBuildingCreate, views: flatironBuildingViews },
  'humber-bay-arch-bridge': { manifest: humberBayArchBridgeManifest, osmWays: humberBayArchBridgeWays, create: humberBayArchBridgeCreate, views: humberBayArchBridgeViews },
  'old-city-hall': { manifest: oldCityHallManifest, osmWays: oldCityHallWays, create: oldCityHallCreate, views: oldCityHallViews },
  'ontario-legislative-building': { manifest: ontarioLegislativeBuildingManifest, osmWays: ontarioLegislativeBuildingWays, create: ontarioLegislativeBuildingCreate, views: ontarioLegislativeBuildingViews },
  'prince-edward-viaduct': { manifest: princeEdwardViaductManifest, osmWays: princeEdwardViaductWays, create: princeEdwardViaductCreate, views: princeEdwardViaductViews },
  'rogers-centre': { manifest: rogersCentreManifest, osmWays: rogersCentreWays, create: rogersCentreCreate, views: rogersCentreViews },
  'royal-ontario-museum': { manifest: royalOntarioMuseumManifest, osmWays: royalOntarioMuseumWays, create: royalOntarioMuseumCreate, views: royalOntarioMuseumViews },
  'scotia-plaza': { manifest: scotiaPlazaManifest, osmWays: scotiaPlazaWays, create: scotiaPlazaCreate, views: scotiaPlazaViews },
  'scotiabank-arena': { manifest: scotiabankArenaManifest, osmWays: scotiabankArenaWays, create: scotiabankArenaCreate, views: scotiabankArenaViews },
  'sharp-centre-for-design': { manifest: sharpCentreForDesignManifest, osmWays: sharpCentreForDesignWays, create: sharpCentreForDesignCreate, views: sharpCentreForDesignViews },
  'st-lawrence-market': { manifest: stLawrenceMarketManifest, osmWays: stLawrenceMarketWays, create: stLawrenceMarketCreate, views: stLawrenceMarketViews },
  'toronto-city-hall': { manifest: torontoCityHallManifest, osmWays: torontoCityHallWays, create: torontoCityHallCreate, views: torontoCityHallViews },
  'toronto-dominion-centre': { manifest: torontoDominionCentreManifest, osmWays: torontoDominionCentreWays, create: torontoDominionCentreCreate, views: torontoDominionCentreViews },
  'union-station': { manifest: unionStationManifest, osmWays: unionStationWays, create: unionStationCreate, views: unionStationViews },
};

export const TORONTO_LANDMARKS = Object.freeze(RUNTIME.map((l) => Object.freeze({ ...l, ...authoring[l.id] })));
export const torontoLandmark = (id) => TORONTO_LANDMARKS.find((l) => l.id === id) || null;
