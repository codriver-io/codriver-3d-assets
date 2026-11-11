import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './eglise-saint-joachim-pointe-claire-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const t=Math.atan2(LOCAL_RINGS[0][9][1]-LOCAL_RINGS[0][10][1],LOCAL_RINGS[0][9][0]-LOCAL_RINGS[0][10][0]);
const rings=LOCAL_RINGS.map(r=>r.map(([x,z])=>[x*Math.cos(t)+z*Math.sin(t),-x*Math.sin(t)+z*Math.cos(t)])),R=rings[0],S=rings[1],F=(R[0][0]+R[9][0])/2,V=(R[0][1]+R[9][1])/2;
const body=[];for(let i=0;i<R.length;i++){const a=R[i],c=R[(i+1)%R.length],ia=a[0]<=F,ic=c[0]<=F;if(ia)body.push(a);if(ia!==ic){const k=(F-a[0])/(c[0]-a[0]);body.push([F,a[1]+k*(c[1]-a[1])]);}}
solid(body,0,11.4,'stone','stone',{shape:'pointed',bottom:2,top:10.8,dy:7,h:6.4,pitch:near?5.2:8.4,ratio:.32});
// Measured 45.6m nave. Only the back roof end is capped; front gable is stone, not a coplanar roof triangle.
const roof=rect((F+rings[0][18][0])/2,V,18.9,F-rings[0][18][0],Math.PI/2),a=roof[0],c=roof[1],d=roof[2],e=roof[3],u=[(a[0]+c[0])/2,(a[1]+c[1])/2],v=[(d[0]+e[0])/2,(d[1]+e[1])/2];
face('roof',[[a[0],11.4,a[1]],[u[0],22.5,u[1]],[v[0],22.5,v[1]],[e[0],11.4,e[1]]],[0,1,0]);face('roof',[[c[0],11.4,c[1]],[d[0],11.4,d[1]],[v[0],22.5,v[1]],[u[0],22.5,u[1]]],[0,1,0]);face('stone',[[F,11.4,V-9.45],[F,11.4,V+9.45],[F,22.5,V]],[1,0,0]);face('roof',[[d[0],11.4,d[1]],[e[0],11.4,e[1]],[v[0],22.5,v[1]]],[-1,0,0]);
const rear=F-45.6,join=rings[0][18][0],vLo=rings[0][14][1],vHi=rings[0][17][1],vm=(vLo+vHi)/2,ridge=Math.max(rear+3,join-4);
const hip=[[[join,11.4,vLo],[join,22.5,V],[ridge,22.5,vm],[rear,11.4,vLo]],[[join,11.4,vHi],[rear,11.4,vHi],[ridge,22.5,vm],[join,22.5,V]],[[rear,11.4,vLo],[ridge,22.5,vm],[rear,11.4,vHi]]];for(const q of hip)face('roof',q,[0,1,0]);
for(const indices of [[18,19,20,21],[10,11,12,13]]){const r=indices.map(i=>rings[0][i]),c=r.reduce((s,p)=>[s[0]+p[0]/4,s[1]+p[1]/4],[0,0]);for(let i=0;i<4;i++){const a=r[i],b=r[(i+1)%4];face('roof',[[a[0],11.4,a[1]],[b[0],11.4,b[1]],[c[0],17,c[1]]],[0,1,0]);}}
solid(S,0,7.2,'stone','roof',{shape:'pointed',bottom:1,top:6.8,dy:5,h:4.4,pitch:near?3.8:6,ratio:.34});const su=S.map(p=>p[0]),sv=S.map(p=>p[1]);gable(rect((Math.min(...su)+Math.max(...su))/2,(Math.min(...sv)+Math.max(...sv))/2,Math.max(...sv)-Math.min(...sv),Math.max(...su)-Math.min(...su),Math.PI/2),7.2,10.8,'roof');
const TV=(R[1][1]+R[7][1])/2,U=R[7][0]-3.6,T=rect(U,TV,7.2,7.7);solid(T,0,26,'stone','stone',{skipEdges:[1],shape:'pointed',bottom:3,top:25.4,dy:9,h:6,pitch:near?3.1:6,ratio:.4});
function pointed(x,w,y,h){return [[x-w/2,y],[x+w/2,y],[x+w/2,y+h*.68],[x,y+h],[x-w/2,y+h*.68]];}
const outer=[[-3.85,0],[3.85,0],[3.85,26],[-3.85,26]],holes=[pointed(0,2.7,.1,6.5),pointed(0,1.7,11.8,7)],all=[...outer,...holes.flat()];for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p)))))face('stone',tri.map(i=>[U+3.6,all[i][1],TV+all[i][0]]),[1,0,0]);for(const [i,h]of holes.entries())face(i?'glass':'door',h.map(([v,y])=>[U+3.6,y,TV+v]),[1,0,0]);
// Eight-sided belfry: paired pointed voids in closed wall shells, with reveals and inward faces.
loft([{x:U,z:TV,y:26,r:4.3},{x:U,z:TV,y:26.4,r:4.3}],'trim',8);
const ring=Array.from({length:8},(_,i)=>[U+Math.cos(i*Math.PI/4)*4,TV+Math.sin(i*Math.PI/4)*4]);
for(let i=0;i<8;i++){const a=ring[i],c=ring[(i+1)%8],len=Math.hypot(c[0]-a[0],c[1]-a[1]),dx=(c[0]-a[0])/len,dz=(c[1]-a[1])/len,out=[(a[0]+c[0])/2-U,0,(a[1]+c[1])/2-TV],n=Math.hypot(out[0],out[2]);out[0]/=n;out[2]/=n;
 const xyz=(s,y,k=0)=>[a[0]+dx*s-out[0]*k,y,a[1]+dz*s-out[2]*k],outer=[[0,26.4],[len,26.4],[len,33],[0,33]],holes=[pointed(len*.28,.74,27,5.1),pointed(len*.72,.74,27,5.1)],all=[...outer,...holes.flat()];for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p))))){face('stone',tri.map(j=>xyz(...all[j])),out);face('stone',tri.map(j=>xyz(...all[j],.35)),out.map(v=>-v));}
 for(const h of holes)for(let k=0;k<h.length;k++){const p=h[k],q=h[(k+1)%h.length],cx=h.reduce((s,p)=>s+p[0]/h.length,0),cy=h.reduce((s,p)=>s+p[1]/h.length,0),s=(p[0]+q[0])/2,y=(p[1]+q[1])/2;face('stone',[xyz(...p),xyz(...q),xyz(...q,.35),xyz(...p,.35)],[dx*(cx-s),cy-y,dz*(cx-s)]);}
}
loft([{x:U,z:TV,y:33,r:4.3},{x:U,z:TV,y:33.3,r:4.3},{x:U,z:TV,y:54.5,r:.05}],'roof',8);box('metal',[U,55.15,TV],[.14,1.3,.14]);box('metal',[U,55.35,TV],[.9,.14,.14]);
// Grounded corner buttresses and four small turret pinnacles complete the facade silhouette.
for(const side of [-1,1]){solid(rect(F-1,V+side*8.8,1.6,1.6),0,17.5,'stone','trim');loft([{x:F-1,z:V+side*8.8,y:17.5,r:.9},{x:F-1,z:V+side*8.8,y:21,r:.03}],'roof',4);}
for(const q of [0,2,4,6]){const a=q*Math.PI/4;loft([{x:U+Math.cos(a)*3.9,z:TV+Math.sin(a)*3.9,y:30.5,r:.45},{x:U+Math.cos(a)*3.9,z:TV+Math.sin(a)*3.9,y:36,r:.03}],'roof',4);}
return finish(-t);

}
