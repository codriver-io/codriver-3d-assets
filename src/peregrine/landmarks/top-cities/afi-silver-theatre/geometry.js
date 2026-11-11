import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './afi-silver-theatre-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const raw=LOCAL_RINGS[0],theta=Math.atan2(raw[1][1]-raw[0][1],raw[1][0]-raw[0][0]),R=raw.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]);
function clip(r,k,b,g){let q=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=g?a[k]>=b:a[k]<=b,ic=g?c[k]>=b:c[k]<=b;if(ia)q.push(a);if(ia!==ic){const t=(b-a[k])/(c[k]-a[k]);q.push(a.map((v,j)=>v+t*(c[j]-v)));}}return q;}
const modern=clip(R,1,-8.3,false),historic=clip(R,1,-8.3,true),front=clip(clip(historic,0,8.7,true),0,28.4,false),hall=clip(historic,0,28.4,true),marquee=clip(clip(clip(historic,1,5.7,true),1,15.8,false),0,9.0,false);
// Modern curtain-wall bays are adjoining tiles. The top slab and broad dark fascia retain the flat projecting profile.
solid(modern,0,12.2,'steel','steel',{bottom:.3,top:11.9,dy:3.8,h:3.55,pitch:near?3.2:5.8,ratio:.93});solid(modern,12.2,12.8,'steel');
solid(front,0,7.4,'stone','steel',{bottom:.45,top:4,dy:5,h:3.55,pitch:near?3.4:5.4,ratio:.78});solid(hall,0,13.1,'stone','steel',{bottom:11,top:13.1,dy:.7,h:.14,pitch:1000,ratio:.82});
// A rounded mapped marquee cantilevers into actual open entrance space.
solid(marquee,4.05,4.3,'chrome');solid(marquee,4.3,5.3,'screen','screen');solid(marquee,5.3,5.55,'chrome');
// Original blank blade, with narrow stainless bands replacing the white panels at each tier.
const u=6.4,v=10.7,half=1.1,depth=.4,y0=5.55,capY=19.5,levels=[7.3,9.4,11.5,13.6,15.7,17.8];
let cursor=y0;for(const y of levels){solid(rect(u,v,half*2,depth),cursor,y,'white');solid(rect(u,v,half*2,depth),y,y+.12,'chrome');cursor=y+.12;}solid(rect(u,v,half*2,depth),cursor,capY,'white');
const arc=Array.from({length:(near?16:10)+1},(_,i)=>{const a=i*Math.PI/(near?16:10);return[u+half*Math.cos(a),capY+half*Math.sin(a)];}),capOutline=[[u-half,capY],[u+half,capY],...arc.slice(1)];for(const z of[v-depth/2,v+depth/2])for(const t of THREE.ShapeUtils.triangulateShape(capOutline.map(p=>new THREE.Vector2(...p)),[]))face('white',t.map(i=>[capOutline[i][0],capOutline[i][1],z]),[0,0,z>v?1:-1]);for(let i=0;i<capOutline.length;i++){const a=capOutline[i],b=capOutline[(i+1)%capOutline.length];face('white',[[a[0],a[1],v-depth/2],[b[0],b[1],v-depth/2],[b[0],b[1],v+depth/2],[a[0],a[1],v+depth/2]],[b[1]-a[1],a[0]-b[0],0]);}
// The characteristic curved vertical fin is a closed thin solid meeting both blade and historic roof.
const fin=[[7.05,7.4],...Array.from({length:near?17:9},(_,i)=>{const a=(i/(near?16:8))*Math.PI/2;return[7.05+9.95*Math.cos(a),7.4+7.4*Math.sin(a)];})];for(const z of[v-.2,v+.2])for(const t of THREE.ShapeUtils.triangulateShape(fin.map(p=>new THREE.Vector2(...p)),[]))face('white',t.map(i=>[fin[i][0],fin[i][1],z]),[0,0,z>v?1:-1]);for(let i=0;i<fin.length;i++){const a=fin[i],c=fin[(i+1)%fin.length];face('white',[[a[0],a[1],v-.2],[c[0],c[1],v-.2],[c[0],c[1],v+.2],[a[0],a[1],v+.2]],[c[1]-a[1],a[0]-c[0],0]);}
return finish(-theta);

}
