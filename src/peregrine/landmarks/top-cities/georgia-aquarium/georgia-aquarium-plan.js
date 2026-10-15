// Photographic estimates in real local east/south metres; rotation is already baked.
// Two mapped controls of the eastern tank hall: [-84.3942317,33.7629506]
// and [-84.3942332,33.7638411], 99.1 m almost true north (bearing 359.92°).
// Outer arc follows the separately mapped roof; a 5.5 m band leaves the plaza open.
const ARC = [[31.4,42.7],[35,42.2],[53.3,41.9],[54.6,41.3],[55.3,40.6],[56.3,41.2],[60,35.7],[62.7,30.3],[64.4,24.5],[65.3,18.6],[65.2,12.2],[64.2,5.8],[62.1,-.2],[59.1,-5.9],[55.2,-11],[50.5,-15.4],[45.2,-19]];
const LENGTHS=ARC.slice(1).map((p,i)=>Math.hypot(p[0]-ARC[i][0],p[1]-ARC[i][1]));
const TOTAL=LENGTHS.reduce((a,b)=>a+b,0);
export function canopyPoint(t,inset=0) {
 let d=Math.max(0,Math.min(1,t))*TOTAL,i=0;
 while(i<LENGTHS.length-1&&d>LENGTHS[i])d-=LENGTHS[i++];
 const a=ARC[i],b=ARC[i+1],f=d/LENGTHS[i],x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;
 const l=Math.hypot(x-29,z-16);
 return [x-inset*(x-29)/l,z-inset*(z-16)/l];
}
export const CANOPY_SUPPORTS=Array.from({length:14},(_,i)=>canopyPoint((i+.5)/14,2.75));
export function bow(t,v) {
 const s=Math.sin(Math.PI*t);
 return [-15+49*t+22*s-13*(1-t)*v, v*(31-11*t+3*s), 27-95*t+9*s+9*(1-t)*v];
}
export function port(t,v) {
 const p=bow(t,v), s=Math.sin(Math.PI*t);
 return [p[0]-35*s,p[1],p[2]-16*s];
}
export const HALL = [[45,-70],[45,-118],[29,-152],[18,-152],[18,-168],[14.7,-168],[14.7,-166],[8,-166],[7,-148],[-77,-148],[-77,-77],[-115,-77],[-118,-66],[-118,-42],[-115,-32],[-72,19],[-52,18],[-44,18],[-46,-8],[-30,-45],[1,-83]];
export function hallHeight(x,z) {return 16+9*(.5+.5*Math.cos((z+145)*Math.PI/31))*(.8+.2*Math.cos((x+30)/100));}
