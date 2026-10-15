// +u along the facade to north-east, +v towards the Eiffel Tower (bearing 135°).
// OSM pavilion-side controls: (2.2881413,48.8626872) ->
// (2.2885793,48.8624069), bearing approximately 134.2°; 135° is baked once.
export const C = Math.SQRT1_2;
export const world = (u, y, v) => [(u + v) * C, y, (v - u) * C];
export const local = (x, z) => [(x-z)*C,(x+z)*C];
export const geo = (u,v) => {const [x,,z]=world(u,0,v);return [2.28807+x/(111319.49079327358*Math.cos(48.86234*Math.PI/180)),48.86234-z/111319.49079327358];};
// Paired outer/back and inner/garden curves read from way/79742852 and way/79749386.
const MAPPED_CURVES = [
 { back:[[74,-8],[91,-7],[114,-4.3],[134,-.6],[153,5.8],[169,13.2],[182,21.2],[193,31.2],[202.5,45.5],[208,59],[210,71]],
   front:[[74,19.1],[91,20],[110,22],[126,25.4],[143,30.8],[156,36.8],[166,43.8],[174,53],[179,63],[182,76],[182,88]] },
 { back:[[-67,-6.3],[-80,-5.2],[-104,-1.9],[-125,2.6],[-146,10.5],[-163,19.3],[-176,28],[-186,38],[-194,50],[-199,63],[-201,70]],
   front:[[-67,20.8],[-78,21.6],[-104,25.2],[-121,29.3],[-139,37.2],[-154,45.2],[-164,54.5],[-170,65.5],[-173,74],[-174,88],[-174,96]] },
];
// Keep the modeled colonnade 1–1.5 m inside the surveyed inner edge; capitals stay owned.
export const CURVES = MAPPED_CURVES.map(c=>({...c,front:c.front.map((p,i)=>[p[0]+(c.back[i][0]-p[0])*.055,p[1]+(c.back[i][1]-p[1])*.055])}));
export const PAVILIONS = [
 {u0:32.2,u1:72.7,v0:-22.5,v1:20.1, top:42, center:true},
 {u0:-66.3,u1:-25.5,v0:-21.8,v1:21.0, top:42, center:true},
 {u0:191.5,u1:216,v0:75.6,v1:96,top:36,center:false},
 {u0:-206.5,u1:-183,v0:82.5,v1:102,top:36,center:false},
];
export const STATUES = [-46,-35,-24,-13,20,31,42,53].map(u=>[u,12,35]);
