// Present steel arch bridge, opened in 1896; original procedural geometry.
export const SPEC = {
 id:'pont-mirabeau',name:'Pont Mirabeau',kind:'bridge',ready: true,
 origin:[2.2755771, 48.846658700000006],height:12.9,padM:45,frontageBearing:122.4,
 footprintless:true,rangeM:4000,
};
export const PALETTES={
 light:{steel:'#9fb04c',stone:'#bcb6a6',walkway:'#bcb6a6',asphalt:'#555d63',bronze:'#6fa394',gilt:'#c3ab62',lamp:'#e5dfc6'},
 dark:{steel:'#64753e',stone:'#757d80',walkway:'#757d80',asphalt:'#303c47',bronze:'#416a64',gilt:'#6e7253',lamp:'#ffdb9c'},
};
export const MANIFEST={
 elevationDatum:'Local flat-map grade y=0; Cityscape main road deck 8 m is a visual estimate. World uses one level datum from the higher of the two quay samples, landing tapers absorb bank differences, and feet independently follow river terrain. No surveyed absolute altitude baked in.',
 attribution:'Original procedural geometry; mapped alignment and envelope © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'173 m structure, 93 m central opening, two 32.4 m side openings, 20 m total width and 12 m carriageway. Steel sections, 5.8125 m central arch rise, pier boats, anatomy, ornament and vertical datum are photographic estimates; 160 m tapered approach ramps (7.5% maximum in Cityscape).',
};
