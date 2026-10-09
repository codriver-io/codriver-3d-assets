import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id:'cite-de-carcassonne', name:'Cité de Carcassonne', kind:'building', ready:true,
  origin:[2.36405,43.20633], height:32.2, padM:290, frontageBearing:110,
  terrainPad:{rings:FOOTPRINTS, refs:FOOTPRINTS[0], datum:'median', featherM:6},
};
export const PALETTES = {
  light:{stone:'#b29a64',course:'#766347',trim:'#b6a073',slate:'#5c6571',tile:'#ab623e',wood:'#634b32',glass:'#252c30',glow:'#ac8e54'},
  dark:{stone:'#473e2f',course:'#493f32',trim:'#746349',slate:'#39434e',tile:'#623b29',wood:'#3b3025',glass:'#161d23',glow:'#9d7436'},
};
export const MANIFEST = {
 elevationDatum:'Rigid plateau grade y=0; walls and towers continue to y=-2.8 m as buried foundation skirts. No DEM or absolute elevation baked in.',
 attribution:'Original procedural mesh by Codriver. Geographic data © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Restored double enceinte, Château Comtal and Saint-Nazaire; mapped outlines with estimated curtain/eave heights. Narbonnaise towers 30 m per Centre des monuments nationaux. Nine low terracotta roof quarters approximate the inner city; terrain integration not tested.',
};
