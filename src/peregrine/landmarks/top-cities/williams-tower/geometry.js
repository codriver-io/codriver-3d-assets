import * as THREE from 'three';
import { Earcut } from 'three/src/extras/Earcut.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import polygonClipping from 'polygon-clipping';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, DESIGN } from './config.js';
import { unionAt, difference, LEVELS, localRing } from './williams-tower-parts.js';

// Shells are the union of the mapped parts at each height, with exposed terrace caps.
// Facades are tessellated into glass/spandrel/mullion cells: no backing under glass,
// no stacked planes, no hidden nested extrusions. Both LODs retain discrete bays/rows.
export function create({ detail = 'near' } = {}) {
  const far = detail === 'far', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const batches = new Map();
  const tri = (mat,a,c,d) => {
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push(...a,...c,...d);
  };
  const quad = (mat,a,c,d,e) => { tri(mat,a,c,d); tri(mat,a,d,e); };
  const poly = (mat, polygon, point, normal) => {
    const coords=[], holes=[];
    for (let i=0;i<polygon.length;i++) {
      const r=polygon[i].slice(0,-1);
      if(i) holes.push(coords.length/2);
      for(const p of r) coords.push(...p);
    }
    const indices=Earcut.triangulate(coords,holes,2);
    for(let i=0;i<indices.length;i+=3){
      const pts=indices.slice(i,i+3).map(j=>point(coords[j*2],coords[j*2+1]));
      const n=new THREE.Vector3().subVectors(new THREE.Vector3(...pts[1]),new THREE.Vector3(...pts[0])).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...pts[2]),new THREE.Vector3(...pts[0])));
      if(n.dot(new THREE.Vector3(...normal))<0) [pts[1],pts[2]]=[pts[2],pts[1]];
      tri(mat,...pts);
    }
  };
  const cap = (polys,y,up=true) => { for(const p of polys)poly('roof',p,(x,z)=>[x,y,z],[0,up?1:-1,0]); };
  const hash = (edge,r,c) => ((Math.imul(edge+11,73856093)^Math.imul(r+3,19349663)^Math.imul(c+1,83492791))>>>0)%100;
  let edge=0;
  const facade=(p,q,y0,y1) => {
    const dx=q[0]-p[0], dz=q[1]-p[1], len=Math.hypot(dx,dz);
    if(len<0.08||y1-y0<0.01)return;
    const n=[dz/len,-dx/len], point=(u,y)=>[p[0]+dx*u/len,y,p[1]+dz*u/len];
    const cell=(mat,u0,u1,a,c)=>{if(u1-u0>0.001&&c-a>0.001)quad(mat,point(u0,a),point(u0,c),point(u1,c),point(u1,a));};
    // Near: individual floor/window bays. Far: grouped floors and bays, still a grid.
    const cols=Math.max(1,Math.round(len/(far?6:2.4))), cw=len/cols;
    const pitch=DESIGN.floorPitch*(far?3:1), m=far?0.15:0.085, sill=far?0.24:0.14;
    const id=edge++;
    const start=Math.floor(y0/pitch);
    for(let r=start;r*pitch<y1-0.001;r++){
      const a=Math.max(y0,r*pitch), c=Math.min(y1,(r+1)*pitch), floor=Math.floor(r*(far?3:1));
      // Mechanical level around the stacked-building transfer, subdued dark glazing.
      for(let k=0;k<cols;k++){
        const u=k*cw,v=(k+1)*cw;
        cell('mullion',u,u+m,a,c);
        cell('mullion',u+m,v,a,Math.min(a+sill,c));
        const lit=(floor%7===3 && hash(id,Math.floor(floor/7),Math.floor(k/2))<65 || hash(id,floor,k)<3) && floor!==40;
        const bottom=Math.min(a+sill,c);
        if(far && lit && c-bottom>4 && v-u-m>2.5){
          // An occupied room stays room-sized inside a grouped far bay, no enormous lit slabs.
          const left=(u+m+v)/2-1.15,right=left+2.3,ya=(bottom+c)/2-1.9,yb=ya+3.8;
          cell('glass',u+m,v,bottom,ya);cell('glass',u+m,v,yb,c);
          cell('glass',u+m,left,ya,yb);cell('glass',right,v,ya,yb);cell('glow',left,right,ya,yb);
        }else cell(lit?'glow':'glass',u+m,v,bottom,c);
      }
    }
    return n;
  };
  // CCW x/z outlines have outward normals (dz, 0, -dx).
  const levels=LEVELS;
  for(let s=0;s<levels.length-1;s++){
    const lo=levels[s],hi=levels[s+1],shape=unionAt((lo+hi)/2);
    for(const polygon of shape)for(const ring0 of polygon){
      const ring=ring0.slice(0,-1);
      for(let i=0;i<ring.length;i++){
        const p=ring[i],q=ring[(i+1)%ring.length];
        // Main south-facing entrance occupies the centre of the 28 m podium face.
        if(lo<28 && p[1]>34 && q[1]>34 && Math.hypot(q[0]-p[0],q[1]-p[1])>30){
          const L=Math.hypot(q[0]-p[0],q[1]-p[1]), mid=L/2;
          const at=u=>[p[0]+(q[0]-p[0])*u/L,p[1]+(q[1]-p[1])*u/L];
          facade(p,at(mid-11),lo,hi); facade(at(mid+11),q,lo,hi);
          if(hi>DESIGN.portalHeight)facade(at(mid-11),at(mid+11),Math.max(lo,DESIGN.portalHeight),hi);
        } else facade(p,q,lo,hi);
      }
    }
    const next=s===levels.length-2?[[[...localRing(581354693),localRing(581354693)[0]]]]:unionAt(hi+0.01);
    cap(difference(shape,next),hi);
    if(lo===6.6)cap(difference(shape,unionAt(6.59)),lo,false); // linked west wing soffit
  }
  // Crown roof: low four-sided pyramid, not a needle. The beacon physically touches its apex.
  const crown=localRing(581354698), apex=[0,DESIGN.crownApex,0];
  for(let i=0;i<crown.length;i++){
    const p=crown[i],q=crown[(i+1)%crown.length];
    // Orient roof triangles upward regardless of mapped ring winding.
    const a=[p[0],DESIGN.crownBase,p[1]],c=[q[0],DESIGN.crownBase,q[1]];
    const n=new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...apex),new THREE.Vector3(...a)));
    if(n.y>0)tri('roof',a,c,apex);else tri('roof',c,a,apex);
  }
  // Five metre upper clerestory at the transition between central shaft and pyramid.
  const shaft=localRing(581354693);
  const ring=[...shaft];
  for(let i=0;i<ring.length;i++)facade(ring[i],ring[(i+1)%ring.length],261,266);
  cap(difference([[[...shaft,shaft[0]]]],[[[...crown,crown[0]]]]),266);
  b.box('roof',[0,274.28,0],[1.25,0.56,1.25]);
  b.box('light',[0,274.78,0],[0.9,0.44,0.9]);

  // Hines documents the 88-foot granite portal. Width, arch and reveal depth are estimates.
  const south=localRing(581354690), p=south[6],q=south[7];
  // Last mapped edge is the long exterior face, from east to west.
  const tx=(q[0]-p[0])/Math.hypot(q[0]-p[0],q[1]-p[1]),tz=(q[1]-p[1])/Math.hypot(q[0]-p[0],q[1]-p[1]);
  const nx=tz,nz=-tx, center=[(p[0]+q[0])/2,(p[1]+q[1])/2];
  const portalPoint=(u,y,d=0)=>[center[0]+tx*u+nx*d,y,center[1]+tz*u+nz*d];
  const arch=[[-7,0],[7,0],[7,12]];
  for(let i=1;i<=(far?12:24);i++){const a=i*Math.PI/(far?12:24);arch.push([7*Math.cos(a),12+7*Math.sin(a)]);}
  arch.push([-7,0]);
  const outer=[[-11,0],[11,0],[11,DESIGN.portalHeight],[-11,DESIGN.portalHeight],[-11,0]];
  const portal=polygonClipping.difference([outer],[arch]);
  for(const pl of portal){poly('stone',pl,(u,y)=>portalPoint(u,y),[nx,0,nz]);poly('stone',pl,(u,y)=>portalPoint(u,y,-1.8),[-nx,0,-nz]);}
  for(const path of [outer,arch])for(let i=0;i<path.length-1;i++){
    const a=path[i],c=path[i+1];
    // Reveal and outer return. Rect/arch winding is opposite at the opening.
    const pts=[portalPoint(a[0],a[1]),portalPoint(c[0],c[1]),portalPoint(c[0],c[1],-1.8),portalPoint(a[0],a[1],-1.8)];
    if(path===arch)pts.reverse();quad('stone',...pts);
  }
  // Recessed arch glazing, subdivided without overlay planes.
  const panes=[];
  const pitch=far?3.5:1.75;
  for(let x=-7;x<7;x+=pitch)for(let y=0;y<19;y+=pitch){
    const rect=[[x+0.08,y+0.08],[Math.min(x+pitch,7),y+0.08],[Math.min(x+pitch,7),y+pitch],[x+0.08,y+pitch],[x+0.08,y+0.08]];
    const clipped=polygonClipping.intersection([arch],[rect]);
    for(const pl of clipped)poly('glass',pl,(u,h)=>portalPoint(u,h,-1.8),[nx,0,nz]);
    if(clipped.length)panes.push(clipped);
  }
  const joints=polygonClipping.difference([arch],polygonClipping.union(...panes));
  for(const pl of joints)poly('mullion',pl,(u,y)=>portalPoint(u,y,-1.8),[nx,0,nz]);
  for(const [mat,positions] of batches){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(mergeVertices(g,1e-5),mat);
  }
  return b.finish();
}
