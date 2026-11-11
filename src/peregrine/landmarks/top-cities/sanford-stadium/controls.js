// Completed configuration: USDA NAIP 2025-10-15, raster 24637,
// m_3308306_nw_17_030_20251015, 0.30 m GSD. Public-domain US government
// orthophoto; comparison only, no pixels retained in the asset.
// https://apps.geo.fpac.usda.gov/geo-imagery/rest/services/naip/conus_naip/ImageServer
// Local X/Z controls are registered to the two mapped Dooley Field corners.
// Perimeter agreement is relative to these controls, not a survey assertion.
import {FOOTPRINTS} from './footprint.js';
import {SPEC} from './config.js';
import {lngToMercX,latToMercY,mercStretch} from '../../../facade/geo.js';
const angle=-25.8*Math.PI/180,k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=-latToMercY(SPEC.origin[1]);
const local=([lng,lat])=>{const X=(lngToMercX(lng)-ox)/k,Z=(-latToMercY(lat)-oz)/k;return[X*Math.cos(angle)-Z*Math.sin(angle),X*Math.sin(angle)+Z*Math.cos(angle)];};
const mapped=FOOTPRINTS[0].slice(0,-1).map(local);
// The aerial shows an open paved service concourse with three low roofed
// service units, rather than one tall building filling the whole projection.
export const SE_SERVICE=[...mapped.slice(29,39),[94,69],[105,42],[108,9.49]];
// Rounded southwest roof: retain the verified mapped outer steps. Inner roof
// corners are measured from the completed orthophoto, to the nearest metre.
export const PRESS_ROOF=[[-78.74,71.97],[-64,79.5],[-45,85],[-25.21,88.5],...mapped.slice(66,78)];
export const PRESS_CORE=PRESS_ROOF.map(([x,z])=>[-57+(x+57)*.93,89+(z-89)*.84]);
export const LIFT_CORE=[[-86.56,78.16],[-81.93,80],[-85.88,91.4],[-91.2,89.27]];
export const AERIAL_CONTROLS={
 date:'2025-10-15',rasterId:24637,gsdM:.30,relativeToleranceM:2,
 southeast:[[126,9],[130,18],[145,45],[149,52],[128,86],[105,91],[103,79]],
 pressBox:[[-79,72],[-64,80],[-45,85],[-25,89],[-25,108],[-38,106],[-50,103],[-66,100],[-87,94],[-91,89],[-87,78],[-82,80]],
 concourseTopM:8,serviceRoofTopM:11.4,pressRoofTopM:53.5,
 heightBasis:'Concourse follows the existing 7.8 m service wall plus a 0.20 m slab; low service roofs about 3.4 m above the deck from aerial roof/shadow proportions. Press-box two-level height from the completed 2024 exterior. All are estimates, not surveyed heights.'
};
