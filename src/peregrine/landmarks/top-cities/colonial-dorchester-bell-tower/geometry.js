import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Original procedural ruin: four thick open walls, no roof or reconstructed nave.
export function create({ detail='near' }={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),W=SPEC.widthM;
  const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];
  const shape=r=>{const s=new THREE.Shape(r[0].map(p=>new THREE.Vector2(...p)));for(const h of r.slice(1))s.holes.push(new THREE.Path(h.map(p=>new THREE.Vector2(...p))));return s;};
  const arch=(x,y,w,h)=>{const r=w/2,p=[[x-r,y],[x+r,y],[x+r,y+h-r]],N=near?16:8;for(let i=1;i<=N;i++){const a=i*Math.PI/N;p.push([x+Math.cos(a)*r,y+h-r+Math.sin(a)*r]);}p.push([x-r,y]);return p;};
  const wall=(side)=>{
    const plain=side%2===1,ang=-side*Math.PI/2,A=[-W/2,-W/2];
    const local=(g,m)=>{g.translate(-W/2,0,-W/2);g.rotateY(ang);b.put(g,m);};
    // Top profiles follow the surviving raised centre and broken corner shoulders.
    const top=plain?[[W,10.7],[4.8,10.86],[4.15,11.02],[3.85,11.8],[3.55,12.12],[3.10,12.2],[2.30,12.14],[1.55,11.98],[1.1,11.35],[.65,11.0],[0,10.78]]:[[W,11.35],[4.7,11.45],[4.45,11.16],[3.9,11.55],[3.3,11.7],[2.8,11.58],[2.0,11.72],[1.35,11.48],[.75,11.30],[0,11.4]];
    const outline=[[0,0],[W,0],...top,[0,0]], holes=[];
    if(plain){holes.push(arch(W/2,0,1.85,3.5));holes.push(arch(W/2,5.15,.98,2.7));}
    else {holes.push(arch(W/2,4.7,1.65,3.85));holes.push(arch(W/2,.9,.82,2.6));}
    const polygon=[outline,...holes];
    // Extrusion supplies inner surfaces and aperture reveals. Its outside cap is
    // replaced by a tiled brick/mortar surface, with no coplanar backing faces.
    let g=new THREE.ExtrudeGeometry(shape(polygon),{depth:.78,bevelEnabled:false,curveSegments:near?16:8});
    const raw=g.index?g.toNonIndexed():g,p=raw.attributes.position,n=raw.attributes.normal,ps=[],ns=[];
    for(let i=0;i<p.count;i+=3){if(n.getZ(i)<-.99)continue;for(let j=0;j<3;j++){ps.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));ns.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}}
    g.dispose();raw.dispose();g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(ns,3));local(g,'brick');
    const tile=(mat,rings)=>{for(const r of rings){if(!r[0]||r[0].length<4)continue;const t=new THREE.ShapeGeometry(shape(r));t.rotateY(Math.PI);t.scale(-1,1,1); // retain original x and face outward -z
      const ix=t.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];t.computeVertexNormals();local(t,mat);}};
    // Continuous plain masonry behind pilasters/cornices, rather than hidden
    // different-material brick tiles. Exposed mosaic is clipped clear of trim.
    const plainZones=[rect(0,0,.85,12.3),rect(W-.85,0,W,12.3)];
    if(side%2===0)plainZones.push(rect(.20,9.25,1.50,10.1),rect(W-1.50,9.25,W-.20,10.1));
    const plainMask=polygonClipping.union(...plainZones.map(r=>[r]));
    tile('brick',polygonClipping.intersection(polygon,plainMask));
    const exposed=polygonClipping.difference(polygon,plainMask);
    const bh=near?.14:.38,bw=near?.38:.86,joint=near?.012:.023;
    for(let row=0;row*bh<12.2;row++)for(let col=-1;col*bw<W;col++){
      const y0=row*bh,y1=y0+bh,x0=col*bw+(row%2)*bw/2,x1=x0+bw,outer=rect(x0,y0,x1,y1),inner=rect(x0+joint/2,y0+joint/2,x1-joint/2,y1-joint/2);
      const brick=polygonClipping.intersection(exposed,[inner]);
      tile((col*11+row*7+side)%9===0?'brickShade':'brick',brick);
      const gaps=polygonClipping.difference([outer],[inner]);tile('mortar',polygonClipping.intersection(exposed,gaps));
    }
  };
  for(let i=0;i<4;i++)wall(i);
  const box=(m,p,d)=>b.box(m,p,d);
  // Broad corner pilasters terminate at surviving brick cornice returns.
  for(const x of [-W/2,W/2])for(const z of [-W/2,W/2]){
    box('brick',[x,4.7,z],[.6,9.4,.6]);
    for(const [y,w,h] of [[9.45,.78,.20],[9.72,.98,.22],[10.0,.87,.20]])box('brick',[x,y,z],[w,h,w]);
  }
  // Partial long-side cornice remnants; the plain arched elevations retain their
  // unbroken central wall instead of acquiring an invented full crown.
  for(const z of [-W/2,W/2])for(const x of [-1.8,1.8])for(const [y,d,h] of [[9.4,.30,.17],[9.65,.42,.18],[9.9,.33,.16]])box('brick',[x,y,z],[1.25,h,d]);
  return b.finish();
}
