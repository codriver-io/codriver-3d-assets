// Current 1974 prestressed-concrete crossing; six lanes north, four south.
export const SPEC={id:'knight-street-bridge',name:'Knight Street Bridge',kind:'bridge',ready: true,
 origin:[-123.07752,49.20408],height:34.4,padM:1200,frontageBearing:180,
 rangeM:4500,nearM:1800,footprintless:true,terrainPolicy:'absolute-deck'};
export const PALETTES={
 light:{concrete:'#b9b7ab',girder:'#a7aa9e',asphalt:'#555d63',rail:'#87918b',paint:'#e5e6dc',lamp:'#f5e9c9'},
 dark:{concrete:'#73858a',girder:'#667b82',asphalt:'#303c47',rail:'#849ca3',paint:'#b9bdbe',lamp:'#ffe3ab'}
};
export const MANIFEST={
 elevationDatum:'Local y=0 is flat map grade/visual low-water datum; estimated south deck crown 25.5 m, girder crown clearance 23.3 m. No DEM or latitude scaling baked in; absolute-deck runtime fits approaches and support feet.',
 attribution:'Original procedural geometry. Alignment © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'1974 parallel prestressed-concrete cantilever structures, not steel box girders. Published north/south lengths 238/1198 m and 109.7 m main span. Estimated deck sections, pier stations/spacing, widths from mapped carriageway separation and aerial proportions, lamp fittings and water datum. Marine Drive overpass and detached interchange loops are not modeled. Near paint only; landing noses taper and fit provider width.'
};
