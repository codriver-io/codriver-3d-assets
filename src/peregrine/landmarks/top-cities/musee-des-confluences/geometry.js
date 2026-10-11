import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Original hand-authored folds in geographic east/up/south coordinates. The
// mapped envelope is the constraint, not a source mesh. No host rotation.
const lerp = (a,b,t) => a.map((v,i)=>v+(b[i]-v)*t);
const vec = p => new THREE.Vector3(...p);
const length = (a,b) => vec(a).distanceTo(vec(b));
const local = ([lng,lat]) => [(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),(SPEC.origin[1]-lat)*111320];
const mapped = FOOTPRINTS[0].map(local);
// Cloud begins at the north/crystal joint; the south notches are cantilever fingers.
const CLOUD = [[38.4,-34], ...mapped.slice(2,24), [2,-40]];
const inset = (p,k) => [-5+(p[0]+5)*k, 15+(p[1]-15)*k];
const upper = CLOUD.map(p=>{const q=inset(p,.87);return [q[0],31,q[1]];});
const waist = CLOUD.map((p,i)=>{const q=inset(p,.994);return [q[0],p[1]>48?28.4:20+(i%4===1?-2.5:i%4===2?6:1),q[1]];});
const lower = CLOUD.map((p,i)=>{const q=inset(p,.72);return [q[0],14+(i%5===0?3:0),q[1]];});

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), soups=new Map();
  const fold = m => !near && m==='glassPale'?'glass':!near && m==='seam'?'facet':!near && m==='soffit'?'facet':m;
  function tri(mat,a,c,d,out) {
    mat=fold(mat);const n=vec(c).sub(vec(a)).cross(vec(d).sub(vec(a)));
    if(n.lengthSq()<1e-10)return;
    if(n.dot(vec(out).sub(vec(a)))<0)[c,d]=[d,c];
    if(!soups.has(mat))soups.set(mat,[]); soups.get(mat).push(...a,...c,...d);
  }
  const quad=(m,a,c,d,e,out)=>{tri(m,a,c,d,out);tri(m,a,d,e,out);};
  const centroid = ps => ps[0].map((_,i)=>ps.reduce((s,p)=>s+p[i],0)/ps.length);
  // Joint backing and rectangular steel tiles on each ruled fold; facade bands
  // use whole-face tones, never random camouflage.
  function face(a,c,d,e,out,mat='metal',panels=true) {
    quad(near?'seam':mat,a,c,d,e,out);
    if(!near||!panels)return;
    const columns=Math.max(1,Math.ceil(Math.max(length(a,c),length(d,e))/1.8));
    const rows=Math.max(1,Math.ceil(Math.max(length(a,e),length(c,d))/1.25));
    const at=(s,t)=>lerp(lerp(a,c,s),lerp(e,d,s),t);
    for(let j=0;j<rows;j++)for(let i=0;i<columns;i++) {
      const s0=(i+.025)/columns,s1=(i+.975)/columns,t0=(j+.025)/rows,t1=(j+.975)/rows;
      const ps=[at(s0,t0),at(s1,t0),at(s1,t1),at(s0,t1)];
      let n=vec(ps[1]).sub(vec(ps[0])).cross(vec(ps[3]).sub(vec(ps[0]))).normalize();
      if(n.dot(vec(out).sub(vec(ps[0])))<0)n.negate();
      const p=ps.map(q=>vec(q).addScaledVector(n,.15).toArray());
      quad(mat,...p,out);
    }
  }
  // Every large cloud fold is planar: broad diagonals share a crease vertex.
  // Tile tessellation stays on that plane rather than smoothing the fold away.
  function foldedTriangle(mat,a,c,d,out) {
    tri(near?'seam':mat,a,c,d,out);
    if(!near)return;
    const n=Math.max(1,Math.ceil(Math.max(length(a,c),length(c,d),length(d,a))/3));
    let normal=vec(c).sub(vec(a)).cross(vec(d).sub(vec(a))).normalize();
    if(normal.dot(vec(out).sub(vec(a)))<0)normal.negate();
    const at=(i,j)=>a.map((v,k)=>v+(c[k]-v)*i/n+(d[k]-v)*j/n);
    const tile=ps=>{const m=centroid(ps);tri(mat,...ps.map(p=>vec(lerp(p,m,.025)).addScaledVector(normal,.15).toArray()),out);};
    for(let i=0;i<n;i++)for(let j=0;j<n-i;j++){
      tile([at(i,j),at(i+1,j),at(i,j+1)]);
      if(i+j<n-1)tile([at(i+1,j),at(i+1,j+1),at(i,j+1)]);
    }
  }
  for(let i=0;i<CLOUD.length;i++) {
    const j=(i+1)%CLOUD.length,dx=CLOUD[j][0]-CLOUD[i][0],dz=CLOUD[j][1]-CLOUD[i][1];
    const mid=centroid([waist[i],waist[j],upper[j],upper[i]]),out=[mid[0]+dz*4,mid[1],mid[2]-dx*4];
    // Strong unequal diagonals: one ridge rises almost to the roof, the next
    // falls to the soffit. The outer waist remains within the mapped outline.
    const crest=lerp(lerp(waist[i],waist[j],.57),lerp(upper[i],upper[j],.57),i%2?.72:.25);
    const panels=[[upper[i],upper[j],crest],[upper[j],waist[j],crest],[waist[j],waist[i],crest],[waist[i],upper[i],crest]];
    panels.forEach((p,k)=>foldedTriangle((i+k)%3===0?'facet':'metal',...p,out));
    const lo=centroid([lower[i],lower[j],waist[j],waist[i]]),underOut=[lo[0]+dz*5,lo[1]-20,lo[2]-dx*5];
    foldedTriangle(i%2?'soffit':'facet',lower[i],lower[j],waist[j],underOut);
    foldedTriangle(i%2?'facet':'soffit',lower[i],waist[j],waist[i],underOut);
  }
  // A recessed panoramic opening in a broad east fold, aligned to the sloped
  // surface and offset beyond the tile skin to avoid coplanar overlap.
  {
    const i=2,j=3,out=[80,26,-10];
    const at=(s,t)=>lerp(lerp(waist[i],waist[j],s),lerp(upper[i],upper[j],s),t);
    const ps=[at(.12,.48),at(.82,.48),at(.82,.85),at(.12,.85)].map(p=>[p[0]+.25,p[1],p[2]]);
    quad('glow',...ps,out);
    if(near)for(let k=1;k<8;k++)b.bar('frame',lerp(ps[0],ps[1],k/8),lerp(ps[3],ps[2],k/8),.12);
  }
  function lid(ring,holes,mat,dir=1) {
    const all=[ring,...holes], points=all.flat();
    const idx=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(p[0],p[2])),holes.map(h=>h.map(p=>new THREE.Vector2(p[0],p[2]))));
    for(const ids of idx) {
      const p=ids.map(i=>points[i]), c=centroid(p);
      tri(mat,...p,[c[0],c[1]+dir*20,c[2]]);
    }
  }
  lid(lower,[],'soffit',-1);
  // Broad asymmetrical shoulders blend into the roof before tightening into
  // leaning truncated necks. Near and far share all four silhouette rings.
  const funnels=[{x:9,z:3,w:33,l:42,y:41,leanX:5,leanZ:-6},{x:-26,z:38,w:22,l:24,y:37,leanX:4,leanZ:-4}];
  const holes=[],segments=near?24:16;
  for(const f of funnels) {
    const ring=(scale,y,lean)=>Array.from({length:segments},(_,i)=>{
      const a=i/segments*Math.PI*2,r=1+.035*Math.sin(a*3+.6);
      const rounded=v=>Math.sign(v)*Math.pow(Math.abs(v),.56);
      return [f.x+rounded(Math.cos(a))*f.w*.5*scale*r+f.leanX*lean,
        y-lean*.65*(1+Math.sin(a)),f.z+rounded(Math.sin(a))*f.l*.5*scale*r+f.leanZ*lean];
    });
    const h=f.y-31;
    const rings=[ring(1,31,0),ring(.84,31+h*.05,.05),ring(.65,31+h*.22,.25),ring(.47,31+h*.5,.55),ring(.34,31+h*.8,.9),ring(.30,f.y,1)];
    holes.push(rings[0]);
    for(let k=0;k<rings.length-1;k++)for(let i=0;i<segments;i++){
      const j=(i+1)%segments,ps=[rings[k][i],rings[k][j],rings[k+1][j],rings[k+1][i]],m=centroid(ps);
      const dx=ps[1][0]-ps[0][0],dz=ps[1][2]-ps[0][2];
      face(...ps,[m[0]+dz*10,m[1],m[2]-dx*10],i%7===0?'facet':'metal');
    }
    lid(rings.at(-1),[],'facet');
  }
  lid(upper,holes,'metal');
  // Plinth within the mapped footprint: low stepped service core, undercroft
  // remains open along both river frontages.
  b.box('concrete',[-1,1.6,14],[30,3.2,77],-.13);
  b.box('glass',[1,5.7,8],[22,5.1,73],-.13);
  b.box('concrete',[-1,10.8,7],[24,5.3,69],-.13);
  // Splayed columns + sculpted branching support: all toes at grade and heads
  // penetrate the soffit, no disconnected floating cloud.
  for(const [x,z,tx,tz] of [[24,46,17,40],[24,-13,17,-8],[-28,39,-18,34],[-9,56,-6,48],[-18,-11,-9,-4]]) {
    const toe=[x,0,z], neck=[x+1,8,z-1],head=[tx,16,tz];
    b.bar('concrete',[x,1.7,z],[x+1,8,z-1],3.4,4);
    const r=near?8:5; const rings=[[toe[0],0,toe[2],2.1],[neck[0],8,neck[2],2.2],[head[0],17,head[2],6.5]];
    const supportRing=k=>Array.from({length:r},(_,i)=>{const a=i/r*Math.PI*2,q=rings[k];return[q[0]+q[3]*Math.cos(a),q[1],q[2]+q[3]*Math.sin(a)];});
    lid(supportRing(2),[],'metal');lid(supportRing(0),[],'concrete',-1);
    for(let k=0;k<2;k++)for(let i=0;i<r;i++){const j=(i+1)%r;const p=(kk,ii)=>{const a=ii/r*Math.PI*2,q=rings[kk];return[q[0]+q[3]*Math.cos(a),q[1],q[2]+q[3]*Math.sin(a)];};const ps=[p(k,i),p(k,j),p(k+1,j),p(k+1,i)],c=centroid(ps);quad(i%3===0?'facet':'metal',...ps,[c[0]+(c[0]-rings[k][0])*4,c[1],c[2]+(c[2]-rings[k][2])*4]);}
  }
  // North crystal: a glass wedge whose ridge falls towards the street, with a
  // triangulated steel cage. Flat panels are opaque architectural stand-ins;
  // the intricate interior is deliberately omitted.
  const A=[-2,3.2,-35],B=[37.7,3.2,-34],C=[41.1,3.2,-73],D=[19.2,3.2,-82],
    E=[3,34,-38],F=[36.8,31,-37],G=[30,16,-76],H=[20,8,-80];
  function crystal(a,c,d,roof=false) {
    const mid=centroid([a,c,d]),out=roof?[mid[0],mid[1]+30,mid[2]]:[mid[0]+(mid[0]-23)*5,mid[1]+(mid[1]-12)*5,mid[2]+(mid[2]+54)*5];
    const n=near?12:8;
    const p=(i,j)=>a.map((v,k)=>v+(c[k]-v)*i/n+(d[k]-v)*j/n);
    const pane=(ps,i,j)=>{
      const m=centroid(ps); let norm=vec(ps[1]).sub(vec(ps[0])).cross(vec(ps[2]).sub(vec(ps[0]))).normalize();
      if(norm.dot(vec(out).sub(vec(ps[0])))<0)norm.negate();
      tri((i+j)%4===0?'glassPale':'glass',...ps.map(q=>vec(lerp(q,m,.035)).addScaledVector(norm,.07).toArray()),out);
    };
    // Backing glass closes the hairline joints; no transparent GLB dependency.
    tri('glass',a,c,d,out);
    for(let i=0;i<n;i++)for(let j=0;j<n-i;j++) {
      pane([p(i,j),p(i+1,j),p(i,j+1)],i,j);
      if(i+j<n-1)pane([p(i+1,j),p(i+1,j+1),p(i,j+1)],i+1,j);
    }
    for(let k=0;k<=n;k++) {
      b.bar('frame',p(k,0),p(k,n-k),near?.12:.19);
      b.bar('frame',p(0,k),p(n-k,k),near?.12:.19);
      if(near)b.bar('frame',p(k,0),p(0,k),.10);
    }
  }
  for(const ps of [[A,D,H],[A,H,E],[D,C,G],[D,G,H],[C,B,F],[C,F,G],[A,E,F],[A,F,B]])crystal(...ps);
  crystal(E,H,G,true);crystal(E,G,F,true);
  quad('concrete',A,B,C,D,[22,-10,-55]);
  // Slender blade canopy proud of the glass at the northern approach.
  b.bar('metal',[20,8,-80],[40,12,-69],1.2,2.5);
  // Two west-side wall-free cadastral projections are thin attached blades,
  // not neighbouring buildings; retain their geometry along with their masks.
  for(const [index,y] of [[1,23],[2,27]]) {
    const r=FOOTPRINTS[index].map(local).map(([x,z])=>[x,y,z]);
    const area=r.reduce((a,p,i)=>{const q=r[(i+1)%r.length];return a+p[0]*q[2]-q[0]*p[2];},0);
    lid(r,[],'metal');lid(r.map(p=>[p[0],p[1]-.6,p[2]]),[],'soffit',-1);
    for(let i=0;i<r.length;i++){const j=(i+1)%r.length,a=r[i],c=r[j],m=centroid([a,c]),k=area>0?1:-1;quad('metal',[a[0],y-.6,a[2]],[c[0],y-.6,c[2]],c,a,[m[0]+k*(c[2]-a[2])*4,y,m[2]-k*(c[0]-a[0])*4]);}
  }
  // South covered terrace projects over the mapped wall-free canopy ring.
  const terrace=FOOTPRINTS[3].map(local).map(([x,z])=>[x,4.4,z]);
  const terraceSign=Math.sign(terrace.reduce((a,p,i)=>{const q=terrace[(i+1)%terrace.length];return a+p[0]*q[2]-q[0]*p[2];},0));
  lid(terrace,[],'concrete');
  for(let i=0;i<terrace.length;i++){const j=(i+1)%terrace.length,a=terrace[i],c=terrace[j],m=centroid([a,c]);quad('concrete',[a[0],0,a[2]],[c[0],0,c[2]],c,a,[m[0]+terraceSign*(c[2]-a[2])*6,2,m[2]-terraceSign*(c[0]-a[0])*6]);}
  // Recessed entrance glow, landing and short stairs; all kept inside crystal.
  b.box('glow',[26,4.45,-76],[14,2.2,.3],-.12);
  if(near)for(let k=0;k<8;k++)b.box('concrete',[24, .2+k*.2,-79+k*.45],[11,.4,.4],-.12);
  for(const [mat,positions] of soups){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(g,mat);}
  return b.finish();
}
