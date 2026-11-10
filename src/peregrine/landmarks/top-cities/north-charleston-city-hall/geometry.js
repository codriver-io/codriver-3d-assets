import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Authoring u is northeast along the entrance facade, v faces southeast.
// Exact mapped envelope, original photo-proportioned architecture and openings.
export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),theta=SPEC.rotationDeg*Math.PI/180;
  const put=(g,m)=>{g.rotateY(theta);b.put(g,m);};
  const box=(m,p,d)=>{let g=new THREE.BoxGeometry(...d);g.translate(...p);put(g,m);};
  const localRing=FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*111319.49079327358*Math.cos(SPEC.origin[1]*Math.PI/180),z=(SPEC.origin[1]-lat)*111319.49079327358;return [x*Math.cos(theta)-z*Math.sin(theta),x*Math.sin(theta)+z*Math.cos(theta)];});
  const rect=(x,y,w,h)=>[[x-w/2,y],[x+w/2,y],[x+w/2,y+h],[x-w/2,y+h],[x-w/2,y]];
  const shape=r=>{const s=new THREE.Shape(r[0].map(p=>new THREE.Vector2(...p)));for(const h of r.slice(1))s.holes.push(new THREE.Path(h.map(p=>new THREE.Vector2(...p))));return s;};
  const arch=(x,y,w,h,rise=w/2)=>{const r=w/2,p=[[x-r,y],[x+r,y],[x+r,y+h-rise]],N=near?12:6;for(let i=1;i<=N;i++){const a=i*Math.PI/N;p.push([x+r*Math.cos(a),y+h-rise+rise*Math.sin(a)]);}p.push([x-r,y]);return p;};
  function plane(g){const ix=g.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();return g;}
  function wall(A,B,height=19.7,{entry=false}={}){
    const dx=B[0]-A[0],dz=B[1]-A[1],L=Math.hypot(dx,dz),ang=-Math.atan2(dz,dx);
    const local=(g,m)=>{g.rotateY(ang);g.translate(A[0],0,A[1]);put(g,m);};
    const extrude=(rings,mat,z=0,thick=.9)=>{
      let g=new THREE.ExtrudeGeometry(shape(rings),{depth:thick,bevelEnabled:false});
      // Hidden inside caps and horizontal joins between storey materials are
      // omitted. Aperture sills/soffits remain, as do the exposed cornice tops.
      const p=g.attributes.position,n=g.attributes.normal,ps=[],ns=[];
      for(let i=0;i<p.count;i+=3){
        const y=p.getY(i),join=Math.abs(n.getY(i))>.99&&[0,9.4,height].some(v=>Math.abs(y-v)<1e-5);
        if(n.getZ(i)>.99||join)continue;
        for(let j=0;j<3;j++){ps.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));ns.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}
      }
      g.dispose();g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(ns,3));g.translate(0,0,z);local(g,mat);
    };
    const panel=(rings,mat,z=.84)=>{const g=plane(new THREE.ShapeGeometry(shape(rings)));g.translate(0,0,z);local(g,mat);};
    const openings=[],keys=[];
    if(entry){
      // Three arched upper windows behind the projecting pale entrance front.
      openings.push({r:arch(L/2,13.0,8.5,7.8,3.0),x:L/2,y:13,w:8.5,h:7.8});
      for(const x of [L*.15,L*.85])openings.push({r:arch(x,14.3,2.1,5.4,.8),x,y:14.3,w:2.1,h:5.4});
      // Lower atrium opening, behind the open stone portico.
      openings.push({r:rect(L/2,.2,10.8,12.0),x:L/2,y:.2,w:10.8,h:12.0});
      for(const x of [L*.1,L*.9]){openings.push({r:rect(x,.2,2.3,3.4),x,y:.2,w:2.3,h:3.4});openings.push({r:rect(x,5.5,2.3,3.6),x,y:5.5,w:2.3,h:3.6});}
    }else if(L>6){
      const cols=Math.max(1,Math.round(L/(near?3.35:5.5))),pitch=L/cols;
      for(let i=0;i<cols;i++){
        const x=(i+.5)*pitch,w=Math.min(near?1.72:2.15,pitch*.62);
        for(const [y,h,arched] of [[.7,2.65,false],[4.8,3.7,true],[10.6,2.75,false],[15.7,2.8,false]]){
          if(y+h>height-.4)continue;openings.push({r:arched?arch(x,y,w,h,.55):rect(x,y,w,h),x,y,w,h});
          if(y>10){const key=[[x-.18,y+h+.08],[x+.18,y+h+.08],[x+.27,y+h+.40],[x-.27,y+h+.40],[x-.18,y+h+.08]];keys.push(key);}
        }
      }
    }
    // Lower cream stone and upper red brick, cut to the true window boundaries.
    for(const [y0,y1,mat] of [[0,9.4,'stone'],[9.4,height,'brick']]){
      const polygon=[rect(L/2,y0,L,y1-y0)],cut=[...openings.map(o=>[o.r]),...keys.map(k=>[k])];
      const result=cut.length?polygonClipping.difference(polygon,...cut):[polygon];
      for(const r of result)extrude(r,mat);
    }
    for(const key of keys)panel([key],'stone',0);
    for(const o of openings){
      // Inlaid mullions: disjoint panes and frame occupy a single recessed plane.
      const cols=entry&&o.w>8?(near?6:3):(near?2:1),rows=o.h>8?4:2;
      for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
        const w=o.w/cols,h=o.h/rows,x=o.x-o.w/2+(col+.5)*w,y=o.y+row*h,gap=near?.055:.08;
        const outer=[rect(x,y,w,h)],inner=[rect(x,y+gap,w-2*gap,h-2*gap)];
        for(const r of polygonClipping.intersection([o.r],inner))panel(r,'glass');
        for(const r of polygonClipping.intersection([o.r],polygonClipping.difference(outer,inner)))panel(r,'frame');
      }
    }
    // Stepped stone cornice supplies a continuous, supported light roof edge.
    const cornice=rect(L/2,height,L,.72);extrude([cornice],'stone',-.18,1.08);
    return {local,L,extrude,panel};
  }
  // Ring runs clockwise in east/south; outward local wall normal is -z.
  // The API ring's winding places all wall extrusions inside the mapped edge.
  const ring=localRing;
  for(let i=0;i<ring.length;i++){
    const A=ring[i],B=ring[(i+1)%ring.length],v=(A[1]+B[1])/2,u=(A[0]+B[0])/2;
    const front=v>44,central=Math.abs(u)<10&&v>28;
    wall(A,B,central?21.68:19.88,{entry:front});
  }
  // Roof plates use the actual outline, with the taller front block cut out of
  // the main plate so it cannot close off the upper atrium windows.
  function inset(r,d){return r.map((q,i)=>{const p=r[(i+r.length-1)%r.length],s=r[(i+1)%r.length],a=[q[0]-p[0],q[1]-p[1]],c=[s[0]-q[0],s[1]-q[1]],al=Math.hypot(...a),cl=Math.hypot(...c);a[0]/=al;a[1]/=al;c[0]/=cl;c[1]/=cl;const den=1+a[0]*c[0]+a[1]*c[1];return [q[0]-d*(a[1]+c[1])/den,q[1]+d*(a[0]+c[0])/den];});}
  const roofShape=new THREE.Shape(inset(localRing,1.12).map(([u,v])=>new THREE.Vector2(u,-v)));
  const frontHole=[[-9.72,28.76],[9.11,28.76],[9.11,45.31],[-9.72,45.31]];
  roofShape.holes.push(new THREE.Path(frontHole.map(([u,v])=>new THREE.Vector2(u,-v))));
  let g=new THREE.ShapeGeometry(roofShape);g.rotateX(-Math.PI/2);g.translate(0,19.65,0);put(g,'roof');
  g=new THREE.PlaneGeometry(16.59,14.30);g.rotateX(-Math.PI/2);g.translate(-.305,22.0,37.03);put(g,'roof');
  g=new THREE.ShapeGeometry(new THREE.Shape(localRing.map(([u,v])=>new THREE.Vector2(u,-v))));g.rotateX(-Math.PI/2);g.translate(0,.02,0);put(g,'stone');
  // Monumental pale frontispiece: four grounded pilasters flank the glass. The
  // elliptical crown is original, with no city seal or inscription geometry.
  const V=45.30,C=-.305;
  for(const u of [C-6.6,C-5.65,C+5.65,C+6.6]){
    box('stone',[u,7.8,V+.22],[.50,15.6,.68]);
    box('stone',[u,.25,V+.25],[.76,.50,.85]);box('stone',[u,15.50,V+.25],[.83,.45,.85]);
  }
  // Curved crown occupies a band above the open atrium; no slab behind glazing.
  const crown=[[C-7.4,12.6],[C+7.4,12.6],[C+7.4,16.4]],N=near?32:16;
  for(let i=1;i<=N;i++){const a=i*Math.PI/N;crown.push([C+7.4*Math.cos(a),16.4+2.8*Math.sin(a)]);}crown.push([C-7.4,12.6]);
  g=new THREE.ExtrudeGeometry(shape([crown]),{depth:.70,bevelEnabled:false});g.rotateY(Math.PI);g.translate(2*C,0,V+.76);put(g,'stone');
  // Low front step is kept bounded to the entrance, meeting the stone bases.
  box('stone',[C,.12,V+.48],[15.7,.24,.96]);
  return b.finish();
}
