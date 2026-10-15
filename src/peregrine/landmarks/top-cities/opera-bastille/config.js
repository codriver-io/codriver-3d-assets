// Opéra Bastille (Carlos Ott, 1989) and detached July Column, Paris.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
 id:'opera-bastille', name:'Opéra Bastille and Colonne de Juillet', kind:'building', ready: true,
 origin:[2.37056,48.85194], height:50.52, padM:65, frontageBearing:330,
 // Disconnected bounded supports: never flatten the roads between the two pieces.
 terrainPad:{rings:FOOTPRINTS.slice(0,2),refs:FOOTPRINTS.slice(0,2).flatMap(r=>r.filter((_,i)=>i%5===0)),datum:'median',featherM:2},
};
export const PALETTES = {
 light:{stone:'#e3e6e2',frame:'#f1f3ef',granite:'#8a9397',glass:'#a1b7c3',bronze:'#678575',base:'#c9c7b9',lamp:'#b59a4b'},
 dark:{stone:'#8a9ba3',frame:'#b4c0c5',granite:'#5d6e77',glass:'#708ea1',bronze:'#476e63',base:'#858b86',lamp:'#dac476'},
};
export const MANIFEST = {
 elevationDatum:'Rigid local grade y=0; no DEM, absolute altitude or Mercator stretch baked in.',
 attribution:'Original procedural mesh; mapped outlines © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
 note:'Carlos Ott opera, 1989: mapped part envelopes and OSM heights; estimated facade grids, porch and roof fittings. July Column assembled to 50.52 m, photo-proportioned capital and abstract winged Genius. No textures or external meshes. Both runtime modes await separate integration checks.',
};
