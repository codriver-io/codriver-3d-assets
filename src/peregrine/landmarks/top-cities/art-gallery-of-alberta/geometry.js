import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Mapped east-edge controls establish street grid, 96.2 degrees eastward.
// All geometry is rotated once into east/up/south metres.
const A=6.2*Math.PI/180,C=Math.cos(A),S=Math.sin(A),Q=Math.SQRT1_2;
export const toWorld=([x,y,z])=>[C*x-S*z,y,S*x+C*z];
export const toLocal=([x,y,z])=>[C*x+S*z,y,-S*x+C*z];
// a runs SE along the corner facade; d runs outward SW.
export const front=([a,y,d])=>[-4+Q*(a-d),y,-3+Q*(a+d)];
const outline=FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>toLocal([(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),0,(SPEC.origin[1]-lat)*111320]));

// Restrict slight sculptural overhangs to the mapped provider envelope.
function fit(p){
 let inside=false,best=Infinity,q;
 for(let i=0,j=outline.length-1;i<outline.length;j=i++){
  const a=outline[j],b=outline[i],dx=b[0]-a[0],dz=b[2]-a[2];
  if((a[2]>p[2])!==(b[2]>p[2])&&p[0]<(b[0]-a[0])*(p[2]-a[2])/(b[2]-a[2])+a[0])inside=!inside;
  const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[2]-a[2])*dz)/(dx*dx+dz*dz)));
  const v=[a[0]+t*dx,p[1],a[2]+t*dz],d=Math.hypot(v[0]-p[0],v[2]-p[2]);
  if(d<best){best=d;q=v;}
 }
 return inside?p:[q[0]+(8-q[0])*.002,p[1],q[2]+(-5-q[2])*.002];
}
const curve=ps=>new THREE.CatmullRomCurve3(ps.map(p=>new THREE.Vector3(...p)),false,'centripetal');
// Original editable rails; the real 190 m ribbon also continues indoors.
export const LOWER={
 low:[[-24,9,-4],[-18,10,2],[-7,14,10],[1,17.7,10],[7,15,10],[13,5,8],[18,2,5],[23,22,2]],
 high:[[-24,19,-4],[-18,18,2],[-7,19,10],[1,21,10],[7,20,10],[13,19,8],[18,20,5],[23,22.4,2]],
};
// Piecewise planar corner glazing: a pointed central entrance facet and
// canted side facets, with the exact same top rail used by roof and mullions.
export const atriumPoint=(u,v)=>{
 const peak=1-Math.abs(2*u-1),a=-19+38*u;
 return front([a,.35+(22+4*peak)*v,6+4*peak-(8+2*peak)*v]);
};
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 function surface(fn,nu,nv,mat,flip=false){
  const ps=[],ix=[];
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++)ps.push(...toWorld(fit(fn(i/nu,j/nv))));
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
   const a=j*(nu+1)+i,c=a+1,d=a+nu+2,e=a+nu+1;ix.push(...(flip?[a,d,c,a,e,d]:[a,c,d,a,d,e]));
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
 }
 const box=(mat,p,size)=>{
  const g=new THREE.BoxGeometry(...size);g.translate(...p);const q=g.attributes.position;
  for(let i=0;i<q.count;i++)q.setXYZ(i,...toWorld(fit([q.getX(i),q.getY(i),q.getZ(i)])));
  g.computeVertexNormals();b.put(g,mat);
 };
 const bar=(mat,a,c,w)=>b.bar(mat,toWorld(a),toWorld(c),w);
 function prism(ring,y0,y1,mat){
  const g=new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(p=>new THREE.Vector2(p[0],p[2]))),{depth:y1-y0,bevelEnabled:false});
  g.rotateX(Math.PI/2);g.translate(0,y1,0);g.rotateY(-A);b.put(g,mat);
 }
 prism(outline,0,.35,'stone');
 // North and east galleries are quiet patinated-zinc rectilinear volumes.
 box('zinc',[5,11,-17],[41,21.3,12]);
 box('zinc',[25,7,-3],[15,13.3,30]);
 box('zinc',[-16,15.5,-14],[11,13,16]);
 if(near){
  for(let y=3;y<22;y+=1.6)box('joint',[5,y,-23.15],[40,.035,.08]);
  for(let y=2;y<13;y+=1.6)box('joint',[32.55,y,-3],[.08,.035,29.5]);
  for(let y=10;y<22;y+=1.5)box('joint',[-21.55,y,-14],[.08,.035,15.5]);
 }
 // Glazed chamfered atrium: separate opaque panes in both LODs.
 const glassPoint=atriumPoint;
 const cols=near?12:8,rows=near?10:6;
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)surface((u,v)=>glassPoint((i+.06+u*.88)/cols,(j+.05+v*.9)/rows),1,1,(j<2&&i%3===0)?'glow':'glass');
 for(let i=0;i<=cols;i++)bar('frame',glassPoint(i/cols,0),glassPoint(i/cols,1),near?.15:.22);
 for(let j=0;j<=rows;j++)for(let i=0;i<cols;i++)bar('frame',glassPoint(i/cols,j/rows),glassPoint((i+1)/cols,j/rows),near?.16:.22);
 surface((u,v)=>{const p=glassPoint(u,1);return [p[0]+Q*14*v,p[1]-4*v,p[2]-Q*14*v];},near?24:12,2,'glass',false);
 for(const side of [-19,19])surface((u,v)=>front([side,.35+(18+4*u)*v,-16+u*(22-8*v)]),1,1,'glass',side>0);
 // Closed steel lofts include their exposed edges and underside.
 function shell(fn,nu,nv){
  const skin=(u,v,back=false)=>{
   const p=new THREE.Vector3(...front(fn(u,v)));
   if(back){
    const tangent=(axis)=>{const a=[u,v],c=[u,v];a[axis]=Math.max(0,a[axis]-.0001);c[axis]=Math.min(1,c[axis]+.0001);return new THREE.Vector3(...front(fn(...c))).sub(new THREE.Vector3(...front(fn(...a))));};
    // Thickness follows the actual sheet normal, including the folded roof.
    // A constant depth offset can expose the reverse skin on a rising fold.
    const normal=tangent(0).cross(tangent(1)).normalize();p.addScaledVector(normal,-.32);
   }
   return p.toArray();
  };
  surface((u,v)=>skin(u,v),nu,nv,'steel');
  surface((u,v)=>skin(u,v,true),nu,nv,'steelUnder',true);
  for(const v of [0,1])surface((u,t)=>{const a=skin(u,v),c=skin(u,v,true);return a.map((q,k)=>q+(c[k]-q)*t);},nu,1,'steel',v===0);
  for(const u of [0,1])surface((v,t)=>{const a=skin(u,v),c=skin(u,v,true);return a.map((q,k)=>q+(c[k]-q)*t);},nv,1,'steel',u===1);
 }
 const lo=curve(LOWER.low),hi=curve(LOWER.high);
 shell((u,v)=>{const a=lo.getPoint(u),c=hi.getPoint(u);return [THREE.MathUtils.lerp(a.x,c.x,v),THREE.MathUtils.lerp(a.y,c.y,v),a.z+.5*Math.sin(Math.PI*v)];},near?88:36,near?12:5);
 const upper=(u,v)=>{const t=(-.12+1.17*u)*Math.PI,rx=12.9+4.5*v,ry=3.7+3.3*v;return [-1-rx*Math.cos(t),22+ry*Math.sin(t),-3+5*Math.sin(t)+.7*Math.sin(Math.PI*v)];};
 const rear=(u,v)=>{const a=upper(u,1),crest=23+8*Math.pow(Math.sin(Math.PI*u),1.5);const base=22+2*Math.sin(Math.PI*u),y=v<.55?THREE.MathUtils.lerp(a[1],base,v/.55):THREE.MathUtils.lerp(base,crest,(v-.55)/.45);return [a[0],y,a[2]-12*v];};
 // One manifold shell through the common rail: no coincident end caps.
 shell((u,v)=>v<=.5?upper(u,v*2):rear(u,v*2-1),near?90:36,near?16:8);
 for(let n=0;n<5;n++){
  const p=front([0,(n+1)*.065,11.8-n*.48]);
  b.box('stone',toWorld(p),[10,(n+1)*.13,.52],-A-Math.PI/4);
 }
 for(const a of [-2.2,2.2])bar('frame',front([a,.35,7.9]),front([a,5,7.9]),.27);
 surface((u,v)=>front([-2.2+4.4*u,.35+4.65*v,7.9]),2,1,'glow');
 bar('frame',front([-2.2,5,7.9]),front([2.2,5,7.9]),.27);
 const model=b.finish();for(const mesh of model.children)if(mesh.material.name.startsWith('steel')){mesh.material.roughness=.32;mesh.material.metalness=.55;}model.userData.features=['lower-borealis','upper-oval-return','rear-crest','glazed-atrium','zinc-galleries'];return model;
}
