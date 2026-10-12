import { TERRAIN_PAD } from './cite-de-carcassonne-terrain.js';
export const SPEC = {
  id:'cite-de-carcassonne', name:'Cité de Carcassonne', kind:'building', ready:true,
  origin:[2.36405,43.20633], height:32.2, padM:290, frontageBearing:110,
  terrainPad:TERRAIN_PAD,
};
export const PALETTES = {
  light:{stone:'#aca798',course:'#76756b',trim:'#c1b9a7',slate:'#5c6571',tile:'#976b54',tileDark:'#79584b',tilePale:'#aa8269',wood:'#634b32',glass:'#252c30',glow:'#a5a08f'},
  dark:{stone:'#473e2f',course:'#493f32',trim:'#746349',slate:'#39434e',tile:'#623b29',tileDark:'#47352e',tilePale:'#6a5040',wood:'#3b3025',glass:'#161d23',glow:'#9d7436'},
};
export const MANIFEST = {
 elevationDatum:'Flat Cityscape grade y=0; world mode uses compact rigid-part relative terrace offsets around the inner plateau datum, with -2.8 m foundation skirts. No absolute elevation or terrain mesh baked in.',
 attribution:'Original procedural mesh by Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Restored double enceinte, Château Comtal and Saint-Nazaire; mapped outlines with estimated curtain/eave heights. Narbonnaise towers 30 m per Centre des monuments nationaux. 253 individually mapped town buildings replace all invented quarters; levels-derived or estimated eaves, longest-axis pitched/compact hip roofs and three muted tile tones. Far retains all houses in 92 adjoining coarse blocks; per-ring relative world levels and slope-reaching footings preserve the hill. Tiny 2.8 m² way 56260413 stays provider-owned.',
};
