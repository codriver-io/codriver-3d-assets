// Colorado Street Bridge (1913; restored 1993), Pasadena. Metric east/up/south.
export const SPEC={id:'colorado-street-bridge',name:'Colorado Street Bridge',kind:'bridge',ready: true,
 origin:[-118.16414,34.14486],height:50.993,padM:650,frontageBearing:174,rangeM:4000,nearM:1400,
 terrainPolicy:'bank-fit'};
export const PALETTES={
 light:{substructure:'#c3bca9',concrete:'#c3bca9',trim:'#d2cbb9',asphalt:'#b4b8bf',iron:'#858b89',lamp:'#fff3d5',stripe:'#cbb45a',fill:'#a39b87'},
 dark:{substructure:'#697579',concrete:'#697579',trim:'#89918c',asphalt:'#424b53',iron:'#818c91',lamp:'#ffe0a1',stripe:'#9f9158',fill:'#555e60'}};
export const MANIFEST={
 elevationDatum:'Reusable GLB y=0 is the arroyo-floor authoring datum; deck 45.2628 m. Runtime road datum is the live approach grade: +0.10 m in Cityscape, with every below-deck substructure mesh hidden; world uses bank-interpolated road datums (+0.12 m) and local DEM support feet. No ramps or earth walls are authored, and no terrain/altitude/stretch is baked.',
 attribution:'Original procedural geometry. Mapped alignment and bridge outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'447.294 m structure, 11.5824 m width, 8.5344 m road and 1.524 m walks, 45.2628 m deck height. Nine major parabolic arches and two pierced abutment groups follow the City of Pasadena 2019 report (six 113 ft, two 151.5 ft, one 223 ft spans), rather than the often quoted eleven arches / 233 ft main span. Pier spacing, rib depths, lamps, safety railing and alcoves are estimated. Cityscape hides all arches, piers and abutments beneath the at-grade deck.'};
