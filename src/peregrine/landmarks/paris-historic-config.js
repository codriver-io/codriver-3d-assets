// Geographic origins are approximate landmark centroids, checked against
// OpenStreetMap place/way locations. All dimensions are real metres.
// Coordinates are [longitude, latitude]; local +X east, +Y up, +Z south.
// Rotation turns authoring X/Z axes into the geographic frame.
export const PARIS_HISTORIC = [
  {
    id:'paris-pantheon',name:'Panthéon',origin:[2.34607,48.84619],
    rotation:Math.PI/2, width:82,length:122,height:82,pad:61,
    note:'Main cruciform mass and portico. Main body length 100 m, 22 columns (2 m diameter, 20 m tall), dome crown 82 m published by CMN; width, transept and roof tiers are estimates.'
  },
  {
    id:'paris-hotel-de-ville',name:'Hôtel de Ville de Paris',origin:[2.35253,48.85643],
    rotation:Math.PI/2, width:150,length:105,height:50,pad:85,
    note:'50 m campanile published by Ville de Paris; perimeter and wings are approximate map/photo interpretation. Open central courtyard and western square stay empty.'
  },
  {
    id:'paris-conciergerie',name:'Conciergerie',origin:[2.34582,48.85591],
    rotation:0, width:170,length:38,height:50,pad:90,
    note:'Four Seine towers and long hall; width/height and tower spacing are visual estimates. Palais de Justice and Sainte-Chapelle are outside this model.'
  },
  {
    id:'paris-madeleine',name:'Église de la Madeleine',origin:[2.32447,48.87003],
    rotation:Math.PI, width:43,length:108,height:30,pad:60,
    note:'108 × 43 × 30 m and 52 columns, each 20 m, published by Ville de Paris. Stylobate and cella setback are estimates.'
  },
  {
    id:'paris-institut-de-france',name:'Institut de France',origin:[2.33757,48.85720],
    rotation:0, width:170,length:75,height:44,pad:85,
    note:'44 m dome height published by Institut de France; half-moon frontage is documented. Wing curvature, lengths and openings are visual/map estimates.'
  },
];
export const PARIS_HISTORIC_BY_ID=Object.fromEntries(PARIS_HISTORIC.map(s=>[s.id,s]));
export const PARIS_HISTORIC_PALETTES={
  light:{stone:'#c4b9a4',shade:'#a69a87',roof:'#555f68',slate:'#69737c',glass:'#333c43',gold:'#b4995c',steps:'#b5aa96',clock:'#ddd4b8'},
  dark:{stone:'#89949b',shade:'#65747e',roof:'#394852',slate:'#465866',glass:'#263740',gold:'#c1a76f',steps:'#78868d',clock:'#c5c3ad'}
};
