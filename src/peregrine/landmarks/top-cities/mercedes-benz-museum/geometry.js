import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

const TAU = Math.PI * 2;
export const local = ([lng, lat]) => [(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180), (SPEC.origin[1]-lat)*111320];
const controls = FOOTPRINTS[0].slice(0,-1).map(local);
// Centripetal spline follows the three rounded leaves and shallow valleys of
// the mapped envelope, in geographic orientation. No source mesh is traced.
const outline = new THREE.CatmullRomCurve3(controls.map(([x,z])=>new THREE.Vector3(x,0,z)),true,'centripetal');
export function edge(t, y=0, scale=.989) {
  const p=outline.getPointAt(((t%1)+1)%1);
  return [p.x*scale,y,p.z*scale];
}
// Continuous rising/falling ribbons express the intertwined exhibition ramps.
// Three tall glazed zones preserve the exterior rhythm, not office-storey rows.
export const boundaries = [0, 5.7, 12.3, 21.3, 28.2, 37.8, 47.5];
export const bandY = (k,t) => k===0?0:k===6?47.5:boundaries[k]+3.1*Math.sin(TAU*t+.48+(k-1)*.18)+.65*Math.sin(2*TAU*t+.7);
export const GLAZED_BANDS = [[0,1],[2,3],[4,5]];
const v=p=>new THREE.Vector3(...p);

export function create({detail='near'}={}) {
  const near=detail==='near', n=near?192:64;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail), soups=new Map();
  const material=m=>!near&&m==='joint'?'aluminium':m;
  function tri(m,a,c,d,out) {
    const normal=v(c).sub(v(a)).cross(v(d).sub(v(a)));
    if(normal.lengthSq()<1e-12)return;
    if(normal.dot(v(out).sub(v(a)))<0)[c,d]=[d,c];
    m=material(m); if(!soups.has(m))soups.set(m,[]);
    soups.get(m).push(...a,...c,...d);
  }
  const quad=(m,a,c,d,e,out)=>{tri(m,a,c,d,out);tri(m,a,d,e,out);};
  const outward=t=>{const p=edge(t);return[p[0]*2,25,p[2]*2];};
  function strip(m,low,high,scale) {
    for(let i=0;i<n;i++) {
      const a=i/n,c=(i+1)/n;
      quad(m,edge(a,low(a),scale),edge(c,low(c),scale),edge(c,high(c),scale),edge(a,high(a),scale),outward((a+c)/2));
    }
  }
  // Ribbon edges have actual recessed soffits; glass and metal never stack.
  for(let k=0;k<6;k++) {
    const glazed=k%2===0,scale=glazed?.957:.989;
    if(!glazed) {
      if(near) {
        // Panel seams are partitions of the skin, never overlays.
        for(let i=0;i<n;i++) {
          const a=i/n,c=(i+1)/n,w=.035/n;
          const ps=t=>[edge(t,bandY(k,t),scale),edge(t,bandY(k+1,t),scale)];
          for(const [s0,s1,m] of [[a,a+w,'joint'],[a+w,c,'aluminium']]) {
            const p=ps(s0),q=ps(s1);quad(m,p[0],q[0],q[1],p[1],outward((s0+s1)/2));
          }
        }
      } else strip('aluminium',t=>bandY(k,t),t=>bandY(k+1,t),scale);
    } else {
      // Diagonal mullions replace narrow strips of each glazed bay. Their
      // terminal points share glass boundaries and aluminium soffit edges.
      const bays=near?72:36, rows=near?4:2;
      const point=(t,f)=>edge(t,bandY(k,t)+(bandY(k+1,t)-bandY(k,t))*f,scale);
      for(let i=0;i<bays;i++)for(let j=0;j<rows;j++) {
        const f0=j/rows,f1=(j+1)/rows,shift=q=>(q%2?-.43:.43)/bays;
        const a=i/bays+shift(i)*f0,c=(i+1)/bays+shift(i+1)*f0;
        const aa=i/bays+shift(i)*f1,cc=(i+1)/bays+shift(i+1)*f1;
        const w=near?.13:.10;
        quad('frame',point(a,f0),point(a+w/bays,f0),point(aa+w/bays,f1),point(aa,f1),outward(a));
        quad('glow',point(a+w/bays,f0),point(c,f0),point(cc,f1),point(aa+w/bays,f1),outward((a+c)/2));
      }
    }
    if(k>0)for(let i=0;i<n;i++) {
      const a=i/n,c=(i+1)/n,other=glazed?.989:.957;
      quad('frame',edge(a,bandY(k,a),scale),edge(c,bandY(k,c),scale),edge(c,bandY(k,c),other),edge(a,bandY(k,a),other),[0,glazed?100:-100,0]);
    }
  }
  function lid(ring,holes,m,y) {
    const all=[ring,...holes].flat(),indices=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(p[0],p[2])),holes.map(h=>h.map(p=>new THREE.Vector2(p[0],p[2]))));
    for(const ids of indices)tri(m,...ids.map(i=>all[i]),[0,y+100,0]);
  }
  const roof=Array.from({length:n},(_,i)=>edge(i/n,47.5));
  const atrium=FOOTPRINTS[1].slice(0,-1).map(local).map(([x,z])=>[x,47.5,z]);
  lid(roof,[atrium],'roof',47.5);
  // Triangular central atrium skylight with one metre recessed glass.
  const center=atrium.reduce((s,p)=>s.map((x,i)=>x+p[i]/atrium.length),[0,0,0]);
  const low=atrium.map(p=>[p[0],46.5,p[2]]);
  for(let i=0;i<atrium.length;i++) {
    const j=(i+1)%atrium.length;
    quad('frame',atrium[i],atrium[j],low[j],low[i],center);
    tri('glow',[center[0],46.5,center[2]],low[i],low[j],[0,100,0]);
  }
  // Secondary rooftop emblem; giant star in dossier photo 1 is the dealership.
  const sx=-12,sz=15,cy=50,rad=1.5,angle=.59;
  b.bar('frame',[sx,47.5,sz],[sx,48.6,sz],.22);
  const starPoint=a=>[sx+Math.cos(a)*rad*Math.cos(angle),cy+Math.sin(a)*rad,sz-Math.cos(a)*rad*Math.sin(angle)];
  const ring=new THREE.TorusGeometry(rad,.075,near?6:4,near?36:18);
  ring.rotateY(angle);ring.translate(sx,cy,sz);b.put(ring,'sign');
  for(let i=0;i<3;i++)b.bar('sign',[sx,cy,sz],starPoint(Math.PI/2+i*TAU/3),.1,.12);
  for(const [m,p] of soups) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();b.put(g,m);
  }
  return b.finish();
}
