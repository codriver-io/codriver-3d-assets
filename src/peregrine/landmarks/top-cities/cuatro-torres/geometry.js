import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { MAPPED } from './cuatro-torres-profiles.js';

// All authoring uses a mapped grid; this one transform bakes its bearing into exports.
const A = SPEC.gridDeg * Math.PI / 180, C = Math.cos(A), S = Math.sin(A);
const world = ([u, y, v]) => [u * C - v * S, y, u * S + v * C];
const area = (p) => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]; return a + q[0] * r[1] - r[0] * q[1]; }, 0);
const ccw = (p) => area(p) < 0 ? [...p].reverse() : p;
const rect = (x, z, w, d) => [[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
// Convex hull removes mapped service recesses smaller than a facade bay, retaining the three-lobed PwC outline.
function hull(points) {
  const p = [...points].sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  const cross = (o,a,b) => (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const half = (seq) => { const out=[]; for(const a of seq){while(out.length>1&&cross(out.at(-2),out.at(-1),a)<=0)out.pop();out.push(a);}return out.slice(0,-1); };
  return ccw([...half(p), ...half([...p].reverse())]);
}
function resample(p, count) {
  const lengths=p.map((q,i)=>Math.hypot(q[0]-p[(i+1)%p.length][0],q[1]-p[(i+1)%p.length][1]));
  const total=lengths.reduce((a,b)=>a+b,0), out=[];
  for(let k=0;k<count;k++){let d=k*total/count,i=0;while(d>lengths[i]&&i<lengths.length-1)d-=lengths[i++];const f=d/lengths[i],a=p[i],b=p[(i+1)%p.length];out.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);}return out;
}
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), batches=new Map();
  function poly(mat, points, normal) {
    let p=points.map(world); const a=new THREE.Vector3(...p[0]), n=new THREE.Vector3(...p[1]).sub(a).cross(new THREE.Vector3(...p[2]).sub(a));
    const nn=new THREE.Vector3(normal[0]*C-normal[2]*S,normal[1],normal[0]*S+normal[2]*C);
    if(n.dot(nn)<0)p=p.reverse();
    if(!batches.has(mat))batches.set(mat,[]);const out=batches.get(mat);
    for(let i=1;i<p.length-1;i++)out.push(...p[0],...p[i],...p[i+1]);
  }
  function cap(ring, ys, mat, up=true) {
    const faces=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
    for(const f of faces)poly(mat,f.map(i=>[ring[i][0],typeof ys==='number'?ys:ys[i],ring[i][1]]),[0,up?1:-1,0]);
  }
  // Tiled exposed faces, rather than pasted windows: bands and panes share edges with no buried facade.
  function tower(ring, low, high, floors, material, options={}) {
    ring=ccw(ring); const center=ring.reduce((a,p)=>[a[0]+p[0]/ring.length,a[1]+p[1]/ring.length],[0,0]);
    const point=(i,t,y)=>{const a=ring[i],d=ring[(i+1)%ring.length];let x=a[0]+(d[0]-a[0])*t,z=a[1]+(d[1]-a[1])*t;
      if(options.shape)[x,z]=options.shape(x,z,y);return [x,y,z];};
    const roof=ring.map(p=>typeof high==='function'?high(p[0],p[1]):high);
    const yAt=(i,t,f)=>low+(roof[i]+(roof[(i+1)%ring.length]-roof[i])*t-low)*f;
    for(let i=0;i<ring.length;i++){
      const a=ring[i],d=ring[(i+1)%ring.length],length=Math.hypot(d[0]-a[0],d[1]-a[1]);
      const cols=Math.max(1,Math.ceil(length/(near?10:26))), normal=[d[1]-a[1],0,a[0]-d[0]];
      for(let row=0;row<floors;row++)for(let col=0;col<cols;col++){
        const l=col/cols,r=(col+1)/cols,f0=row/floors,f1=(row+1)/floors;
        const band=(options.band??(near?.32:.48))/(Math.min(...roof)-low), mull=(near?.085:.13)/length;
        const face=(mat,l0,r0,bottom,top)=>poly(mat,[point(i,l0,yAt(i,l0,bottom)),point(i,r0,yAt(i,r0,bottom)),point(i,r0,yAt(i,r0,top)),point(i,l0,yAt(i,l0,top))],normal);
        face(options.seam??'seam',l,r,f0,Math.min(f0+band,f1));
        face(options.seam??'seam',l,Math.min(l+mull,r),f0+band,f1);
        let mat=material;
        if(options.green&&row>=floors-3)mat='crown';
        if(options.green&&i%Math.round(ring.length/3)===0)mat='metal';
        if(options.garden&&row>=floors-5&&i>=2&&i<=4)mat='crown';
        const lit=!options.unlit&&row>1&&row<floors-3&&((row*17+col*7+i*11)%53<3);
        const left=Math.min(l+mull,r), bottom=f0+band;
        if(lit){
          // One small occupied office within a coarse pane; far never turns lights into giant bars.
          const mid=(left+r)/2, half=Math.min((r-left)*.26,1.2/length), a=mid-half,c=mid+half;
          const midY=(bottom+f1)/2, dh=Math.min((f1-bottom)*.27,1.0/(Math.min(...roof)-low));
          face(mat,left,r,bottom,midY-dh);face(mat,left,r,midY+dh,f1);
          face(mat,left,a,midY-dh,midY+dh);face(mat,c,r,midY-dh,midY+dh);face('light',a,c,midY-dh,midY+dh);
        }else face(mat,left,r,bottom,f1);
      }
    }
    const top=ring.map((p,i)=>options.shape?options.shape(p[0],p[1],roof[i]):p);
    cap(top,roof,options.top??'roof');
    if(low>0)cap(ring.map(p=>options.shape?options.shape(p[0],p[1],low):p),low,options.seam??'roof',false);
  }
  // Foster: two full-height silver service cores form an open arch; three projecting office stacks.
  const cx=49.58,cz=224.36;
  for(const x of [-20,20])tower(rect(cx+x,cz,12.3,23.2),0,248.3,near?13:6,'metal',{seam:'seam',unlit:true,band:near?.12:.19,top:'metal'});
  tower(rect(cx,cz,27.2,22.0),0,220,near?44:16,'glassDark',{seam:'glass',band:near?.45:.65});
  for(const [lo,hi]of [[15.3,81.9],[92.1,153.5],[163.7,220]])for(const side of [-1,1]){
    tower(rect(cx,cz+side*15.8,32.0,9.9),lo,hi,near?Math.round((hi-lo)/4.6):Math.round((hi-lo)/10),'glass',{seam:'glassDark',band:near?.95:1.2});
  }
  // Crown lintel is an attached solid; the 20.4 m void below it stays genuinely empty.
  tower(rect(cx,cz,27.7,23.0),240.4,248.3,1,'metal',{seam:'metal',unlit:true,top:'metal'});
  // PwC: curved three-sided shaft, three vertical shadow slots and subdued green crown.
  const pc=[9.34,120.79];
  const pr=resample(hull(MAPPED.pwc),near?24:12).map(p=>[pc[0]+(p[0]-pc[0])*.982,pc[1]+(p[1]-pc[1])*.982]);
  tower(pr,0,236,near?52:20,'glassDark',{seam:'glass',green:true,band:near?.28:.48});
  // Cristal: faceted hexagonal shaft with a 29 m sloping crown and its planted winter garden.
  const cr=[[36.84,-51.28],[27.93,-67.59],[-1.74,-67.59],[-12.58,-51.28],[-1.74,-34.97],[28.38,-34.97]];
  tower(cr,0,(x)=>220+29*(x+12.58)/49.42,near?52:20,'glassBright',{seam:'seam',garden:true,top:'glassBright'});
  // Glass lobby wings follow the larger mapped envelope and remain low.
  const cb=ccw(MAPPED.cristalBase);
  tower(cb,0,4,1,'glass',{unlit:true,top:'roof',band:.15});
  // Emperador: square bottom evolves continuously into the mapped diagonal lozenge at its crown.
  const ec=[49.21,-160.83],er=resample(hull(MAPPED.emperadorTop),16);
  tower(er,0,230,near?56:20,'glassBright',{seam:'seam',shape:(x,z,y)=>{
    const dx=x-ec[0],dz=z-ec[1],m=Math.max(Math.abs(dx),Math.abs(dz)),scale=21.0/m;
    const f=.5-.5*Math.cos(Math.PI*Math.min(1,y/214));return [ec[0]+dx*(scale*(1-f)+f)*.985,ec[1]+dz*(scale*(1-f)+f)*.985];
  }});
  // Caleido: black thin central slab plus lower projecting side wings, on its retail podium.
  tower(ccw(MAPPED.caleidoBase),0,4,1,'roof',{seam:'roof',top:'roof',unlit:true,band:.1});
  for(const z of [-44.44,83.46])tower(rect(-107.9,z,22.1,70.1),4,15,3,'glassDark',{seam:'glass',top:'roof',unlit:true});
  tower(rect(-107.08,36.03,68.7,17.0),4,181,near?36:14,'glassDark',{seam:'glass',band:near?.18:.35});
  for(const z of [25.03,47.01])tower(rect(-106.83,z,51.4,5.2),40,150,near?22:8,'glassDark',{seam:'glass',band:near?.18:.35});
  // Ground entrances: original plain bronze/silver frames in contact with each lobby skin.
  for(const [x,z]of [[cx,cz+20.75],[pc[0]+8,pc[1]+21.7],[13,-32.35],[ec[0],ec[1]+20.8],[-107.08,44.24]]){
    const at=(u,y,v)=>world([u,y,v]);
    b.bar('metal',at(x-2.7,0,z),at(x-2.7,3.4,z),.18,.28);
    b.bar('metal',at(x+2.7,0,z),at(x+2.7,3.4,z),.18,.28);
    b.bar('metal',at(x-2.7,3.4,z),at(x+2.7,3.4,z),.24,.28);
  }
  for(const [mat,positions]of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(mergeVertices(g),mat);}
  const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return root;
}
