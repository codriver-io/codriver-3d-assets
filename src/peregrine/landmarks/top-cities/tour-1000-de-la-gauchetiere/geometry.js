import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// East/south coordinates from OSM control points along way 114875723:
// (-73.566195,45.4986211) -> (-73.5656153,45.4983443), bearing 125.1°.
const A = 35 * Math.PI / 180, C = Math.cos(A), S = Math.sin(A);
export const world = (x,y,z) => [C*x-S*z-3.5,y,S*x+C*z+1.3];
const local = ([lng,lat]) => {
  const x=(lng-SPEC.origin[0])*111319.49*Math.cos(SPEC.origin[1]*Math.PI/180)+3.5;
  const z=-(lat-SPEC.origin[1])*111319.49-1.3;
  return [C*x+S*z,-S*x+C*z];
};
const XS=[-22,-18,-15,-8,-2,3,9,16,19,23];
const ZS=[-33,-27,-23,-20,-13,-7,-6,6,7,13,20,23,27,33];
// A disjoint height-field shell removes all hidden walls between touching parts.
// The mapped tower has long 37 m crown ridges and recessed office corners.
function zone(x,z) {
  const az=Math.abs(z);
  if (x>=-18&&x<=19&&az<=23) return 'crown';
  if (az<=20) return az<=7 ? 138 : az<=13 ? 158 : 165;
  if (az<=27) return x>=-15&&x<=16 ? 165 : 58;
  return x>=-8&&x<=9 ? 32 : 40;
}
function height(q,x,z) {
  if(q!=='crown') return q;
  return Math.abs(z)<=6 ? 198 : 198-(Math.abs(z)-6)*28/17;
}
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), batches={};
  function quad(mat,pts,normal) {
    const p=pts.map(v=>world(...v));
    const u=new THREE.Vector3(...p[1]).sub(new THREE.Vector3(...p[0]));
    let v=new THREE.Vector3(...p[3]).sub(new THREE.Vector3(...p[0]));
    if(u.clone().cross(v).lengthSq()<1e-12)v=new THREE.Vector3(...p[2]).sub(new THREE.Vector3(...p[0]));
    const n=new THREE.Vector3(C*normal[0]-S*normal[2],normal[1],S*normal[0]+C*normal[2]);
    if(u.cross(v).dot(n)<0)p.reverse();
    const a=batches[mat] ||= [];
    for(const ids of [[0,1,2],[0,2,3]]) {
      const [v0,v1,v2]=ids.map(i=>new THREE.Vector3(...p[i]));
      if(v1.sub(v0).cross(v2.sub(v0)).lengthSq()>1e-12)for(const i of ids)a.push(...p[i]);
    }
  }
  const cap=(ring,y,holes=[])=>{
    const pts=ring.map(p=>new THREE.Vector2(...p)), hs=holes.map(r=>r.map(p=>new THREE.Vector2(...p)));
    const flat=[...ring,...holes.flat()];
    for(const t of THREE.ShapeUtils.triangulateShape(pts,hs)) {
      const q=t.map(i=>[flat[i][0],y,flat[i][1]]);
      quad('roof',[q[0],q[1],q[2],q[2]],[0,1,0]);
    }
  };
  // Tiled walls: stone and glass occupy disjoint pieces of the same plane.
  // Near keeps ~3 m office bays, far ~6 m bays with paired floor rows.
  function wall(p,q,lo0,lo1,hi0,hi1,n,seed=0) {
    const len=Math.hypot(q[0]-p[0],q[1]-p[1]);
    if(Math.max(hi0-lo0,hi1-lo1)<0.01)return;
    const bays=Math.max(1,Math.round(len/(near?3.0:6.2)));
    const min=Math.min(lo0,lo1),max=Math.max(hi0,hi1),pitch=near?3.7:7.4,band=near?0.85:1.6;
    const ys=[min,max];
    for(let y=Math.ceil(min/pitch)*pitch;y<max;y+=pitch)ys.push(y,y+band);
    ys.sort((a,b)=>a-b);
    for(let j=0;j<ys.length-1;j++) {
      const a=ys[j],c=ys[j+1]; if(c-a<0.01)continue;
      const mid=(a+c)/2;
      if(mid%pitch<=band&&mid<=170) {
        const at=(t,y)=>[p[0]+(q[0]-p[0])*t,Math.max(lo0+(lo1-lo0)*t,Math.min(hi0+(hi1-hi0)*t,y)),p[1]+(q[1]-p[1])*t];
        quad('stone',[at(0,a),at(1,a),at(1,c),at(0,c)],n);continue;
      }
      for(let i=0;i<bays;i++) {
        const bay0=i/bays,bay1=(i+1)/bays,w=near?0.12:0.10;
        const ts=[bay0,bay0+(bay1-bay0)*w,bay1-(bay1-bay0)*w,bay1];
        for(let k=0;k<3;k++) {
          const at=(t,y)=>[p[0]+(q[0]-p[0])*t,Math.max(lo0+(lo1-lo0)*t,Math.min(hi0+(hi1-hi0)*t,y)),p[1]+(q[1]-p[1])*t];
          const mid=(a+c)/2;
          let mat=k===1&&((mid%pitch)>band)&&mid>4 ? 'glass':'stone';
          if(mid>170)mat=k===1?'glass':'copper';
          if(mat==='glass'&&((i*13+j*7+seed*11)%19===0))mat='glow';
          if(mid<12&&mat==='glass')mat='lobby';
          quad(mat,[at(ts[k],a),at(ts[k+1],a),at(ts[k+1],c),at(ts[k],c)],n);
        }
      }
    }
  }
  // Broad low transportation podium and its atrium, within the exact OSM envelope.
  const outer=FOOTPRINTS[0].map(local);
  for(let i=0;i<outer.length;i++) {
    const p=outer[i],q=outer[(i+1)%outer.length];
    const n=[q[1]-p[1],0,p[0]-q[0]];
    // The mapped ring has negative area; use its outward (left) normal.
    wall(p,q,0,0,17,17,[-n[0],0,-n[2]],i);
  }
  const hole=[[-22,-33],[23,-33],[23,33],[-22,33],[-22,8],[-44.3,8],[-44.3,-8],[-22,-8]];
  cap(outer,17,[hole]);
  // Tower shell and the recessed corners at 32 / 40 / 58 / 138 / 158 / 165 m.
  const cells=[];
  for(let i=0;i<XS.length-1;i++)for(let j=0;j<ZS.length-1;j++) {
    const x0=XS[i],x1=XS[i+1],z0=ZS[j],z1=ZS[j+1];
    cells.push({i,j,x0,x1,z0,z1,q:zone((x0+x1)/2,(z0+z1)/2)});
  }
  for(const c of cells) {
    const {i,j,x0,x1,z0,z1,q}=c;
    const corners=[[x0,z0],[x1,z0],[x1,z1],[x0,z1]];
    const neighbors=[[i,j-1],[i+1,j],[i,j+1],[i-1,j]];
    for(let e=0;e<4;e++) {
      const p=corners[e],r=corners[(e+1)%4],nb=cells.find(v=>v.i===neighbors[e][0]&&v.j===neighbors[e][1]);
      const h0=height(q,...p),h1=height(q,...r);
      const low0=nb?height(nb.q,...p):17,low1=nb?height(nb.q,...r):17;
      wall(p,r,Math.min(h0,low0),Math.min(h1,low1),h0,h1,[r[1]-p[1],0,p[0]-r[0]],i*17+j);
    }
    // Sloped glass crown panels, with copper ribs cut into the surface.
    const subdivisions=q==='crown'&&Math.abs((z0+z1)/2)>6 ? Math.max(1,Math.round((x1-x0)/(near?2.8:5.5))):1;
    for(let k=0;k<subdivisions;k++) {
      const xa=x0+(x1-x0)*k/subdivisions,xb=x0+(x1-x0)*(k+1)/subdivisions;
      const cuts=q==='crown'?[xa,xa+Math.min(0.22,(xb-xa)/4),xb]:[xa,xb];
      for(let s=0;s<cuts.length-1;s++) {
        const a=cuts[s],d=cuts[s+1];
        const mat=q==='crown'?(Math.abs((z0+z1)/2)<=6?'copper':s===0?'copper':'glass'):'roof';
        quad(mat,[[a,height(q,a,z0),z0],[d,height(q,d,z0),z0],[d,height(q,d,z1),z1],[a,height(q,a,z1),z1]],[0,1,0]);
      }
    }
  }
  // Truncated pointed copper ridge: broad enough to read from the opposite facade.
  const low=[[-18,198,-6],[19,198,-6],[19,198,6],[-18,198,6]];
  const high=[[-15,205,-2.5],[16,205,-2.5],[16,205,2.5],[-15,205,2.5]];
  for(let e=0;e<4;e++)quad('copper',[low[e],low[(e+1)%4],high[(e+1)%4],high[e]],[0,1,0]);
  quad('copper',high,[0,1,0]);
  // Rink atrium: pitched glass roof and glazed end wall; enclosed rink is not exposed.
  const ax=-44.3,bx=-22,az=-7.6,bz=7.6;
  for(const z of [az,bz])quad('lobby',[[ax,17,z],[bx,17,z],[bx,21,z],[ax,21,z]],[0,0,z<0?-1:1]);
  for(const [z,n] of [[az,-1],[bz,1]]) {
    const count=near?10:5;
    for(let i=0;i<count;i++) {
      const a=ax+(bx-ax)*i/count,d=ax+(bx-ax)*(i+1)/count;
      quad(i%3===0?'trim':'glass',[[a,21,z],[d,21,z],[d,26,0],[a,26,0]],[0,1,n]);
    }
  }
  quad('lobby',[[ax,17,az],[ax,21,az],[ax,26,0],[ax,21,bz]],[ -1,0,0]);
  quad('lobby',[[ax,17,az],[ax,21,bz],[ax,17,bz],[ax,17,bz]],[-1,0,0]);
  // Four compact copper-capped rotunda entrances, a characteristic podium detail.
  for(const x of [-38,46])for(const z of [-31,32]) {
    const n=near?12:8;
    for(let i=0;i<n;i++) {
      const a=2*Math.PI*i/n,d=2*Math.PI*(i+1)/n;
      const p=[x+3.8*Math.cos(a),z+3.8*Math.sin(a)],r=[x+3.8*Math.cos(d),z+3.8*Math.sin(d)];
      quad(i%2?'stone':'lobby',[[p[0],0,p[1]],[r[0],0,r[1]],[r[0],17,r[1]],[p[0],17,p[1]]],[Math.cos((a+d)/2),0,Math.sin((a+d)/2)]);
      quad('copper',[[p[0],17,p[1]],[r[0],17,r[1]],[x,20,z],[x,20,z]],[0,1,0]);
    }
  }
  for(const [mat,positions] of Object.entries(batches)) {
    const pos=[],norm=[],idx=[],cache=new Map();
    for(let i=0;i<positions.length;i+=9) {
      const tri=[0,3,6].map(k=>new THREE.Vector3(...positions.slice(i+k,i+k+3)));
      const n=tri[1].clone().sub(tri[0]).cross(tri[2].clone().sub(tri[0])).normalize().toArray();
      for(const v of tri) { const p=v.toArray(),key=[...p,...n].map(v=>v.toFixed(5)).join(',');
        if(!cache.has(key)){cache.set(key,pos.length/3);pos.push(...p);norm.push(...n);}idx.push(cache.get(key)); }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));g.setIndex(idx);b.put(g,mat);
  }
  const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return root;
}
