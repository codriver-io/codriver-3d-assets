import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { SITE_PARTS } from './san-jacinto-monument-site.js';

function octagon(half, clip=0.28) {
  const q=half*(1-clip);
  return [[half,q],[q,half],[-q,half],[-half,q],[-half,-q],[-q,-half],[q,-half],[half,-q]];
}
// Recessed stone flutes; no dark stripes painted on top of a solid shaft.
function fluted(half,count) {
  const ring=octagon(half),out=[];out.recess=new Set();
  for(let i=0;i<8;i++) {
    const p=ring[i],q=ring[(i+1)%8],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz);
    const nx=-dz/len,nz=dx/len;
    out.push(p);
    const n=i%2?count:Math.max(1,count-1);
    for(let j=1;j<=n;j++) {
      const t=j/(n+1),w=0.20/half;
      for(const [s,d] of [[t-w,0],[t-w,0.3],[t+w,0.3],[t+w,0]]) {
        if(d===0.3&&s===t-w)out.recess.add(out.length);
        out.push([p[0]+dx*s+nx*d,p[1]+dz*s+nz*d]);
      }
    }
  }
  return out;
}
// Faceted outward winding, open bottom, Three's bundled triangulation for top caps.
function loft(b,levels,material='stone',rotate=true,opening=null) {
  const pos=[],idx=[],n=levels[0].ring.length;
  for(let k=0;k<levels.length-1;k++) {
    const a=levels[k],c=levels[k+1];
    for(let i=0;i<n;i++) {
      const j=(i+1)%n,s=pos.length/3;
      for(const [p,y] of [[a.ring[i],a.y],[c.ring[i],c.y],[a.ring[j],a.y],[c.ring[j],c.y]])pos.push(p[0],y,p[1]);
      if(opening && Math.hypot(a.ring[j][0]-a.ring[i][0],a.ring[j][1]-a.ring[i][1]) > (opening==='door'?20:5)) {
        pos.length=s*3;
        openingFace(b,a.ring[i],a.ring[j],a.y,c.y,opening,rotate);
      } else if(a.ring.recess?.has(i)) {
        // Recess shade belongs to the actual flute floor, with no overlaid shaft face.
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos.slice(s*3),3));g.setIndex([0,1,2,2,1,3]);g.computeVertexNormals();if(rotate)g.rotateY(SPEC.angle);b.put(g,'stone_recess');pos.length=s*3;
      } else idx.push(s,s+1,s+2,s+2,s+1,s+3);
    }
  }
  const top=levels.at(-1),s=pos.length/3;
  for(const p of top.ring)pos.push(p[0],top.y,p[1]);
  for(const [a,c,d] of THREE.ShapeUtils.triangulateShape(top.ring.map(p=>new THREE.Vector2(...p)),[]))idx.push(s+a,s+d,s+c);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  if(rotate)g.rotateY(SPEC.angle);
  b.put(g,material);
}
// A real punched facade: split the wall around each opening, then add a
// recessed panel and stone reveals. Near/far use identical negative space.
function openingFace(b,p,q,low,high,type,rotate) {
  const dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;
  const point=(s,y,d=0)=>[p[0]+dx*s/len+nx*d,y,p[1]+dz*s/len+nz*d];
  function quad(a,c,d,e,mat='stone') {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));g.setIndex([0,1,2,2,1,3]);g.computeVertexNormals();if(rotate)g.rotateY(SPEC.angle);b.put(g,mat);
  }
  const rect=(a,c,bottom,top,d=0,mat='stone')=>quad(point(a,bottom,d),point(a,top,d),point(c,bottom,d),point(c,top,d),mat);
  const offsets=type==='door'?[0]:[-1.1,0,1.1],w=type==='door'?2.8:0.48,bottom=type==='door'?3:151.7,top=type==='door'?7.2:152.9;
  rect(0,len,low,bottom);rect(0,len,top,high);
  let cursor=0;
  for(const off of offsets) {
    const a=len/2+off-w/2,c=a+w;
    rect(cursor,a,bottom,top);
    rect(a,c,bottom,top,0.3,type==='door'?'bronze':'glass');
    // Reveal normals face into the aperture: left/right, sill/head.
    quad(point(a,bottom),point(a,top),point(a,bottom,0.3),point(a,top,0.3));
    quad(point(c,bottom,0.3),point(c,top,0.3),point(c,bottom),point(c,top));
    quad(point(a,bottom,0.3),point(a,bottom),point(c,bottom,0.3),point(c,bottom));
    quad(point(a,top),point(a,top,0.3),point(c,top),point(c,top,0.3));
    cursor=c;
  }
  rect(cursor,len,bottom,top);
}
const solid=(b,ring,low,high,rotate=true)=>loft(b,[{ring,y:low},{ring,y:high}],'stone',rotate);

// Two perpendicular diamond-section stars: nine tips including their common zenith.
// The exact historical compound-star facets are approximated; both axial views read as a Lone Star.
function star(b) {
  const r=SPEC.starM/(1+Math.cos(Math.PI/5)),cy=SPEC.height-r;
  for(const angle of [SPEC.angle,SPEC.angle+Math.PI/2]) {
    const ring=Array.from({length:10},(_,i)=>{
      const a=i*Math.PI/5,radius=i%2?r*0.382:r;
      return [Math.sin(a)*radius,cy+Math.cos(a)*radius,0];
    });
    const points=[...ring,[0,cy,1.25],[0,cy,-1.25]],idx=[];
    for(let i=0;i<10;i++){const j=(i+1)%10;idx.push(10,j,i,11,i,j);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex(idx);
    const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();flat.rotateY(angle);b.put(flat,'stone');
  }
}

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  for(const part of SITE_PARTS) {
    let ring=part.ring;
    if(part.id===41290215) ring=ring.filter((p,i)=>{
      const a=ring[(i+ring.length-1)%ring.length],c=ring[(i+1)%ring.length];
      return Math.abs((p[0]-a[0])*(c[1]-a[1])-(p[1]-a[1])*(c[0]-a[0]))/Math.hypot(c[0]-a[0],c[1]-a[1])>0.18;
    });
    const signed=ring.reduce((a,p,i)=>{const q=ring[(i+1)%ring.length];return a+p[0]*q[1]-q[0]*p[1];},0);
    if(signed<0)ring=[...ring].reverse();
    if(!part.steps){loft(b,[{ring,y:0},{ring,y:part.height}],'stone',false,part.id===41290215?'door':null);continue;}
    // Progressive clipping toward the inner terrace creates continuous stair treads.
    const center=ring.reduce((a,p)=>[a[0]+p[0]/ring.length,a[1]+p[1]/ring.length],[0,0]);
    const dist=Math.hypot(...center),inward=[-center[0]/dist,-center[1]/dist];
    const pr=ring.map(p=>p[0]*inward[0]+p[1]*inward[1]),lo=Math.min(...pr),hi=Math.max(...pr),steps=near?10:5;
    for(let k=0;k<steps;k++) {
      const threshold=lo+(hi-lo)*k/steps,clipped=[];
      for(let i=0;i<ring.length;i++) {
        const p=ring[i],q=ring[(i+1)%ring.length],a=p[0]*inward[0]+p[1]*inward[1]-threshold,c=q[0]*inward[0]+q[1]*inward[1]-threshold;
        if(a>=-1e-8)clipped.push(p);
        if((a<0)!==(c<0)){const t=a/(a-c);clipped.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
      }
      if(clipped.length>=3)solid(b,clipped,part.height*k/steps,part.height*(k+1)/steps,false);
    }
  }
  solid(b,octagon(8),10,18.5);
  loft(b,[{ring:octagon(SPEC.shaftBaseM/2),y:18.5},{ring:octagon(7.21),y:21}]);
  loft(b,[{ring:fluted(7.21,near?3:2),y:21},{ring:fluted(SPEC.observationM/2,near?3:2),y:150.5}]);
  loft(b,[{ring:octagon(SPEC.observationM/2),y:150.5},{ring:octagon(SPEC.observationM/2),y:154.8}],'stone',true,'window');
  loft(b,[{ring:octagon(SPEC.observationM/2),y:154.8},{ring:octagon(3.9),y:156.8}]);
  solid(b,octagon(3.9),156.8,158);
  loft(b,[{ring:fluted(3.6,near?3:2),y:158},{ring:fluted(SPEC.starSupportM/2,near?3:2),y:SPEC.height-SPEC.starM}]);
  // The crown rises into the star's lower central notch; the finial never floats.
  solid(b,octagon(SPEC.starSupportM/2),SPEC.height-SPEC.starM,165.35);
  star(b);
  const point=(x,y,z,a=SPEC.angle)=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];
  for(let side=0;side<4;side++) {
    const a=SPEC.angle+side*Math.PI/2;


    if(near) {

      // Shallow grouped inscription rhythm, without inventing readable historic text.
      for(const x of [-12,-9,-6,6,9,12])for(let row=0;row<4;row++)b.box('stone',point(x,4.3+row*0.7,19.23,a),[2,0.12,0.14],a);
    }
  }
  if(near)for(let side=0;side<8;side++) {
    const a=SPEC.angle+side*Math.PI/4,radius=side%2?8*1.72/Math.SQRT2:8;
    for(const x of [-1.5,0,1.5]) {
      b.box('stone',point(x,14.7,radius+0.1,a),[0.8,1.8,0.3],a);
      const head=new THREE.SphereGeometry(0.35,6,4);head.translate(...point(x,15.9,radius+0.17,a));b.put(head,'stone');
    }
  }
  const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return model;
}
