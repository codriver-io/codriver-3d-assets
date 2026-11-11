import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './markham-civic-centre-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const theta=Math.atan2(LOCAL_RINGS[0][1][1]-LOCAL_RINGS[0][0][1],LOCAL_RINGS[0][1][0]-LOCAL_RINGS[0][0][0]),rings=LOCAL_RINGS.map(r=>r.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)])),R=rings[1],entry=rings[2],canopy=rings[3];
function clip(r,axis,bound,greater){let out=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=greater?a[axis]>=bound:a[axis]<=bound,ic=greater?c[axis]>=bound:c[axis]<=bound;if(ia)out.push(a);if(ia!==ic){const t=(bound-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
const wing=clip(R,0,0,true),back=clip(R,0,0,false),uMax=rings[0][6][0],vMin=Math.min(...wing.map(p=>p[1])),vLine=vMin+.55,lower=clip(wing,1,vMin+4.8,true);
// The upper wing is supported over real open arcade space, with glazing recessed behind the posts.
solid(lower,0,5,'stone','stone',{bottom:.4,top:4.8,dy:4,h:3.9,pitch:near?3.6:6.3,ratio:.82});solid(wing,5,12.8,'cladding','roof',{bottom:5.8,top:10.9,dy:4,h:3.8,pitch:near?3.8:7,ratio:.85});
const count=26,first=2,last=uMax-2;for(let i=0;i<count;i++){const u=first+(last-first)*i/(count-1);box('column',[u,2.25,vLine],[.85,4.5,.85]);}
box('stone',[(first+last)/2,4.75,vLine],[last-first+.85,.5,1.05]);
// Roof-level concrete pilasters preserve the long stepped rhythm seen from the road.
function edgeV(u){const vs=[];for(let i=0;i<wing.length;i++){const a=wing[i],c=wing[(i+1)%wing.length];if(u>=Math.min(a[0],c[0])&&u<=Math.max(a[0],c[0])&&Math.abs(c[0]-a[0])>1e-8)vs.push(a[1]+(u-a[0])*(c[1]-a[1])/(c[0]-a[0]));}return Math.min(...vs);}
for(let i=0;i<14;i++){const u=first+(last-first)*i/13;solid(rect(u,edgeV(u)-.35,.9,.9),5,13.6,'stone');}
const office=clip(back,1,-4,true),atrium=clip(clip(back,1,-4,false),1,-28,true),drum=clip(back,1,-28,false);
solid(office,0,16.8,'cladding','roof',{bottom:1.1,top:16.4,dy:3.6,h:2.15,pitch:near?3.7:6.8,ratio:.35});
const oc=office.reduce((s,p)=>[s[0]+p[0]/office.length,s[1]+p[1]/office.length],[0,0]);let plant=office;for(const[k,v,g]of [[0,oc[0]-4,true],[0,oc[0]+4,false],[1,oc[1]-3,true],[1,oc[1]+3,false]])plant=clip(plant,k,v,g);solid(plant,16.8,18.8,'cladding','roof');
// Green framed atrium walls and roof grid are tiled, never glass quads laid over a solid roof.
solid(atrium,0,8,'copper','glass',{bottom:.4,top:7.8,dy:3.2,h:2.8,pitch:near?3.2:6,ratio:.88});
const au=atrium.map(p=>p[0]),av=atrium.map(p=>p[1]),u0=Math.min(...au),u1=Math.max(...au),v0=Math.min(...av),v1=Math.max(...av),vm=(v0+v1)/2,roofY=v=>8+8.5*(1-Math.abs(v-vm)/((v1-v0)/2));
function patch(r,mat){if(r.length<3)return;for(const t of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]))face(mat,t.map(i=>[r[i][0],roofY(r[i][1]),r[i][1]]),[0,1,0]);}
function cell(x0,x1,z0,z1,mat){let p=atrium;for(const[k,v,g]of [[0,x0,true],[0,x1,false],[1,z0,true],[1,z1,false]])p=clip(p,k,v,g);if(p.length>=3)patch(p,mat);}
const nx=near?8:4,nz=near?6:4,du=(u1-u0)/nx,dv=(v1-v0)/nz,m=near?.13:.22;for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const a=u0+i*du,c=a+du,d=v0+j*dv,e=d+dv;cell(a,a+m,d,e,'copper');cell(c-m,c,d,e,'copper');cell(a+m,c-m,d,d+m,'copper');cell(a+m,c-m,e-m,e,'copper');cell(a+m,c-m,d+m,e-m,'glass');}
const sign=Math.sign(atrium.reduce((s,p,i)=>s+p[0]*atrium[(i+1)%atrium.length][1]-atrium[(i+1)%atrium.length][0]*p[1],0));for(let i=0;i<atrium.length;i++){const a=atrium[i],c=atrium[(i+1)%atrium.length],q=[a];if((a[1]-vm)*(c[1]-vm)<0){const k=(vm-a[1])/(c[1]-a[1]);q.push([a[0]+k*(c[0]-a[0]),vm]);}q.push(c);for(let j=0;j<q.length-1;j++){const a=q[j],c=q[j+1];face('glass',[[a[0],8,a[1]],[c[0],8,c[1]],[c[0],roofY(c[1]),c[1]],[a[0],roofY(a[1]),a[1]]],[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])]);}}
solid(drum,0,10.4,'cladding','copper');const raw=LOCAL_RINGS[0].slice(23,41),cx=(Math.min(...raw.map(p=>p[0]))+Math.max(...raw.map(p=>p[0])))/2,cz=(Math.min(...raw.map(p=>p[1]))+Math.max(...raw.map(p=>p[1])))/2,dc=[cx*Math.cos(theta)+cz*Math.sin(theta),-cx*Math.sin(theta)+cz*Math.cos(theta)];loft([{x:dc[0],z:dc[1],y:10.4,r:14},{x:dc[0],z:dc[1],y:12.4,r:11.5},{x:dc[0],z:dc[1],y:13.2,r:1}],'copper',near?32:20);
function kernelCenter(r){const xs=r.map(p=>p[0]),zs=r.map(p=>p[1]);let p=rect((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...zs)+Math.max(...zs))/2,Math.max(...xs)-Math.min(...xs)+2,Math.max(...zs)-Math.min(...zs)+2),sign=Math.sign(r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0));for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length],f=q=>sign*((b[0]-a[0])*(q[1]-a[1])-(b[1]-a[1])*(q[0]-a[0])),out=[];for(let j=0;j<p.length;j++){const a=p[j],b=p[(j+1)%p.length],fa=f(a),fb=f(b),ia=fa>=-1e-8,ib=fb>=-1e-8;if(ia)out.push(a);if(ia!==ib){const t=Math.max(0,Math.min(1,fa/(fa-fb)));out.push(a.map((v,k)=>v+t*(b[k]-v)));}}p=out;if(!p.length)break;}if(p.length<3)throw Error('No visible roof apex in footprint');const n=p.length;return p.reduce((s,q)=>[s[0]+q[0]/n,s[1]+q[1]/n],[0,0]);}
function glazedTriangle(a,c,apex){const outer=[[a[0],a[1],a[2]],[c[0],c[1],c[2]],apex],inner=outer.map((p,i)=>p.map((v,k)=>v*.85+outer[(i+1)%3][k]*.075+outer[(i+2)%3][k]*.075));face('glass',inner,[0,1,0]);for(let j=0;j<3;j++)face('copper',[outer[j],outer[(j+1)%3],inner[(j+1)%3],inner[j]],[0,1,0]);}
// Low octagonal entrance and the opposing green glass canopy, each explicitly supported.
solid(entry,0,3.7,'cladding','glass');const ec=kernelCenter(entry);for(let i=0;i<entry.length;i++){const a=entry[i],c=entry[(i+1)%entry.length];glazedTriangle([a[0],3.7,a[1]],[c[0],3.7,c[1]],[ec[0],8.4,ec[1]]);}
const kc=kernelCenter(canopy);cap('glass',canopy,4.7,-1);for(let i=0;i<canopy.length;i++){const a=canopy[i],c=canopy[(i+1)%canopy.length];glazedTriangle([a[0],4.7,a[1]],[c[0],4.7,c[1]],[kc[0],6.5,kc[1]]);}
for(const i of [1,2,4,5]){const p=canopy[i],u=kc[0]+(p[0]-kc[0])*.92,v=kc[1]+(p[1]-kc[1])*.92;box('column',[u,2.35,v],[.34,4.7,.34]);}
return finish(-theta);

}
