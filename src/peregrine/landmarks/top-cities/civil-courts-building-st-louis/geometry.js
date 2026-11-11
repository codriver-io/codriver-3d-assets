import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './civil-courts-building-st-louis-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const q=LOCAL_RINGS[1],theta=Math.atan2(q[3][1]-q[0][1],q[3][0]-q[0][0]),R=LOCAL_RINGS.map(r=>r.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]));const crown=R[1],xs=crown.map(p=>p[0]),zs=crown.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cz=(Math.min(...zs)+Math.max(...zs))/2,w=Math.max(...xs)-Math.min(...xs),d=Math.max(...zs)-Math.min(...zs);
// Recessed ground entrances on the north and south fronts.
solid(R[0],0,14,'stone','stone',{solidOnly:true,skipEdges:[9,10,11,12,21,22,23]});const x0=R[0][9][0],x1=R[0][13][0];for(const[v,sgn]of[[23.265,1],[-18.44,-1]]){for(const[a,b]of[[x0,cx-8.2],[cx+8.2,x1]])face('stone',[[a,0,v],[b,0,v],[b,14,v],[a,14,v]],[0,0,sgn]);face('stone',[[cx-8.2,12.8,v],[cx+8.2,12.8,v],[cx+8.2,14,v],[cx-8.2,14,v]],[0,0,sgn]);const back=v-sgn*3.2;face('glass',[[cx-8.2,0,back],[cx+8.2,0,back],[cx+8.2,12.8,back],[cx-8.2,12.8,back]],[0,0,sgn]);for(const x of[cx-8.2,cx+8.2])face('stone',[[x,0,v],[x,0,back],[x,12.8,back],[x,12.8,v]],[x<cx?1:-1,0,0]);for(const x of[cx-3.1,cx+3.1])loft([{x,z:v-sgn*.7,y:0,r:.95},{x,z:v-sgn*.7,y:.7,r:.95},{x,z:v-sgn*.7,y:1,r:.72},{x,z:v-sgn*.7,y:12,r:.64},{x,z:v-sgn*.7,y:12.8,r:.95}],'baseColumn',near?16:10);}
solid(R[0],14,84,'stone','stone',{bottom:16,top:83,dy:6.4,h:3.1,pitch:near?4.7:6.3,width:3.1/2.2,ratio:.46});solid(R[0],84,88.5,'stone','stone',{bottom:85,top:87.5,dy:3,h:1.8,pitch:6,ratio:.25});
// 32 distinct upper columns, eight on each face, surrounding an inset library core.
solid(rect(cx,cz,w-8,d-8),88.5,101.3016,'stone','stone',{bottom:90,top:100.3,dy:4.3,h:2.8,pitch:4.2,ratio:.5});const columns=[];for(let j=0;j<8;j++){const t=j/7;for(const z of[cz-d/2+1.2,cz+d/2-1.2])columns.push([cx-w/2+3+t*(w-6),z]);for(const x of[cx-w/2+1.2,cx+w/2-1.2])columns.push([x,cz-d/2+3+t*(d-6)]);}for(const[x,z]of columns){loft([{x,z,y:88.5,r:1.02},{x,z,y:89.2,r:1.02},{x,z,y:89.5,r:.8382},{x,z,y:100.4,r:.7},{x,z,y:100.7,r:1.02},{x,z,y:101.3016,r:1.02}],'column',near?16:10);}solid(crown,101.3016,103.8,'stone');
// Sixteen concentric pyramid steps preserve a small summit platform for both figures.
for(let j=0;j<16;j++){const u=j/16,v=(j+1)/16,ww=(w-2)*(1-u)+7.5*u,dd=(d-2)*(1-u)+4.8*u;solid(rect(cx,cz,ww,dd),103.8+10.2*u,103.8+10.2*v,'roof');}
// Original low-poly reclining griffins, facing opposite directions on the common summit.
for(const side of[-1,1]){const z=cz+side*.95;for(const x of[cx-1.5,cx+1.5])for(const off of[-.4,.4])solid(rect(x,z+off,.6,.4),114,114.8,'metal');loft([{x:cx,z,y:114.5,rx:2.3,rz:.58},{x:cx,z,y:115.2,rx:2.5,rz:.68},{x:cx,z,y:115.7,rx:1.9,rz:.58}],'metal',near?12:8);loft([{x:cx+side*2,z,y:115.2,r:.4},{x:cx+side*2.5,z,y:116.8,r:.48},{x:cx+side*2.45,z,y:117.6528,r:.22}],'metal',8);for(const off of[-1,1]){const wing=[[cx-side*1.8,115.2,z+off*.35],[cx+side*.4,115.3,z+off*.35],[cx-side*.4,117.1,z+off*.85],[cx-side*2.0,116.2,z+off*.65]],inner=wing.map(p=>[p[0],p[1],p[2]-off*.15]);face('metal',wing,[0,0,off]);face('metal',inner,[0,0,-off]);for(let i=0;i<4;i++){const k=(i+1)%4;face('metal',[wing[i],wing[k],inner[k],inner[i]],[i===0?side:-side,i===0?-1:1,0]);}}}
return finish(-theta);

}
