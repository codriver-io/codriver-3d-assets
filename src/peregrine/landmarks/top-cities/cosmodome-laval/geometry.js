import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './cosmodome-laval-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
// Museum follows its mapped concave perimeter; every opening is a replacement wall tile.
solid(LOCAL_RINGS[0],0,11,'cladding','roof',{bottom:1.4,top:8.8,dy:3.4,h:2.1,pitch:near?7:12,ratio:.6});
// Barrel-shaped projecting gallery/entrance is read across the rear elevation.
// Horizontal cylindrical entrance gallery at the long mapped recess, not a roof dome.
const A=[16.1,-9],C=[48.4,-14.1],ux=(C[0]-A[0])/32.7,uz=(C[1]-A[1])/32.7,n=near?20:12;
const circle=(p,i)=>{const t=2*Math.PI*i/n;return [p[0]-uz*5.45*Math.cos(t),5.5+5.45*Math.sin(t),p[1]+ux*5.45*Math.cos(t)];};
for(let i=0;i<n;i++){const j=(i+1)%n;face('entry',[circle(A,i),circle(C,i),circle(C,j),circle(A,j)],[-uz*Math.cos((i+.5)*2*Math.PI/n),Math.sin((i+.5)*2*Math.PI/n),ux*Math.cos((i+.5)*2*Math.PI/n)]);}
face('glass',Array.from({length:n},(_,i)=>circle(A,i)),[-ux,0,-uz]);face('glass',Array.from({length:n},(_,i)=>circle(C,i)),[ux,0,uz]);
const x=(-73.7428167-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),z=(SPEC.origin[1]-45.56655)*111320;
// Continuous body profile, with the photo's slender red middle and broad white lower stage.
loft([{x,z,y:0,r:1.5,mat:'dark'},{x,z,y:1.3,r:1.5,mat:'white'},{x,z,y:16,r:1.5,mat:'white'},{x,z,y:20,r:.95,mat:'red'},{x,z,y:37.9,r:.95,mat:'white'},{x,z,y:39,r:1.22,mat:'white'},{x,z,y:44.8,r:1.22,mat:'white'},{x,z,y:46.4,r:.06}],'white',near?20:12);
for(let i=0;i<4;i++){const a=i*Math.PI/2,ux=Math.cos(a),uz=Math.sin(a),vx=-uz*.14,vz=ux*.14;const points=[[1.4,1],[4,1],[2.7,5.8],[1.4,7.1]];for(const side of [-1,1])face('white',points.map(([r,y])=>[x+ux*r+side*vx,y,z+uz*r+side*vz]),[side*-uz,0,side*ux]);for(let j=0;j<points.length;j++){const A=points[j],B=points[(j+1)%points.length];face('white',[[x+ux*A[0]-vx,A[1],z+uz*A[0]-vz],[x+ux*B[0]-vx,B[1],z+uz*B[0]-vz],[x+ux*B[0]+vx,B[1],z+uz*B[0]+vz],[x+ux*A[0]+vx,A[1],z+uz*A[0]+vz]],[ux,0,uz]);}}
return finish();

}
