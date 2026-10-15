import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Local authoring axes follow the two OSM wing edges; rotate once at finish.
export const TURRETS = [[-24.25,13.0],[-8.55,12.8],[10.2,12.65],[26.65,13.0],[-24.25,-17.25],[-8.5,-17.3],[10.4,-17.45],[26.8,-17.2]];
const shape = points => new THREE.Shape(points.map(p=>new THREE.Vector2(...p)));
function archPoints(x,y,w,h,n) {
  const r=w/2,sy=y+h-r,ps=[[x-r,y],[x+r,y],[x+r,sy]];
  for(let i=1;i<=n;i++){const a=i*Math.PI/n;ps.push([x+r*Math.cos(a),sy+r*Math.sin(a)]);}
  return ps;
}
// Strip buried end caps from wall shells and use real holes, not layered glass.
function strip(g,predicate) {
  const src=g.index?g.toNonIndexed():g,p=src.attributes.position,n=src.attributes.normal,a=[],b=[];
  for(let i=0;i<p.count;i+=3){if(predicate(n.getX(i),n.getY(i),n.getZ(i)))continue;for(let j=0;j<3;j++){a.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));b.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}}
  if(src!==g)src.dispose();g.dispose();const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(a,3));out.setAttribute('normal',new THREE.Float32BufferAttribute(b,3));return out;
}
export function create({detail='near'}={}) {
  const near=detail==='near',N=near?6:3,b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m='red')=>b.put(g,m);
  const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y+h/2,z],[w,h,d]);
  const cyl=(m,x,y,z,r,h,rt=r,n=near?16:12)=>put(new THREE.CylinderGeometry(rt,r,h,n).translate(x,y+h/2,z),m);
  const prism=(ps,depth,m,x=0,y=0,z=0)=>put(new THREE.ExtrudeGeometry(shape(ps),{depth,bevelEnabled:false,curveSegments:N}).translate(x,y,z),m);
  // Transform a local outward-facing wall (positive z) into the building frame.
  function facade(cx,cz,a,w,y0,y1,windows,m='red',depth=.55) {
    const M=new THREE.Matrix4().makeRotationY(a).setPosition(cx,0,cz);
    const at=(g,mat=m)=>{g.applyMatrix4(M);put(g,mat);};
    const fb=(mat,x,y,z,ww,hh,dd)=>at(new THREE.PlaneGeometry(ww,hh).translate(x,y+hh/2,z+dd/2),mat);
    const s=shape([[-w/2,y0],[w/2,y0],[w/2,y1],[-w/2,y1]]);
    for(const v of windows)s.holes.push(new THREE.Path(archPoints(v.x,v.y,v.w,v.h,N).map(p=>new THREE.Vector2(...p))));
    at(strip(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:N}).translate(0,0,-depth),(x,y,z)=>near?(z<-.9||Math.abs(y)>.9):z<.9));
    for(const v of windows) {
      const ps=archPoints(v.x,v.y,v.w,v.h,N);
      at(new THREE.ShapeGeometry(shape(ps)).translate(0,0,-depth-.08),'glass');
      // Stone archivolts are annular sectors that touch the opening reveal.
      if(v.trim!==false) {
        const r=v.w/2,t=near?.25:.22,sy=v.y+v.h-r,pts=[];
        for(let i=0;i<=N;i++){const q=i*Math.PI/N;pts.push([v.x+(r+t)*Math.cos(q),sy+(r+t)*Math.sin(q)]);}
        for(let i=N;i>=0;i--){const q=i*Math.PI/N;pts.push([v.x+r*Math.cos(q),sy+r*Math.sin(q)]);}
        at(new THREE.ShapeGeometry(shape(pts)).translate(0,0,.14),m==='granite'?'granite':'trim');
        if(near)fb(m==='granite'?'granite':'trim',v.x,v.y-.15,.02,v.w+.34,.15,.28);
      }
      if(near&&v.w>1.0){fb('roof',v.x,v.y+.08,-depth+.07,.07,v.h-v.w*.5-.12,.16);fb('roof',v.x,v.y+v.h*.47,-depth+.07,v.w-.10,.07,.16);}
    }
  }
  function rectRange(x0,x1,z0,z1,rows,top=22) {
    const wx=x1-x0,wz=z1-z0;
    // Facade bands meet at actual material boundaries; no superimposed slabs.
    for(const [lo,hi,mat] of [[0,5.2,'granite'],[5.2,6.15,'red'],[6.15,6.33,'granite'],[6.33,12,'red'],[12,12.35,'granite'],[12.35,13.55,'red'],[13.55,13.73,'granite'],[13.73,top,'red']]) {
      for(const [cx,cz,a,w,axis] of [[(x0+x1)/2,z1,0,wx,'x'],[(x0+x1)/2,z0,Math.PI,wx,'x'],[x1,(z0+z1)/2,Math.PI/2,wz,'z'],[x0,(z0+z1)/2,-Math.PI/2,wz,'z']]) {
        const wins=[];
        for(const row of rows)if(row.y>=lo&&row.y+row.h<hi+.01) {
          const pitch=row.pitch*(near?1:1.35),count=Math.floor((w-1)/pitch);
          for(let i=0;i<count;i++)wins.push({x:(i-(count-1)/2)*pitch,y:row.y,w:row.w,h:row.h,trim:row.trim});
        }
        facade(cx,cz,a,w,lo,hi,wins,mat);
      }
    }
    // Cornices are solid rings supported by the walls.
    for(const [y,h,d,mat] of [[21.35,.65,.20,'red']]) {
      box(mat,(x0+x1)/2,y,z1,wx,h,d*2);box(mat,(x0+x1)/2,y,z0,wx,h,d*2);
      box(mat,x0,y,(z0+z1)/2,d*2,h,wz);box(mat,x1,y,(z0+z1)/2,d*2,h,wz);
    }
    box('red',(x0+x1)/2,21.7,(z0+z1)/2,wx,.30,wz);
  }
  const rows=[{y:1.1,h:2.8,w:1.05,pitch:3.0,trim:false},{y:6.6,h:4.3,w:1.25,pitch:2.65},{y:14.0,h:6.1,w:1.45,pitch:2.45}];
  rectRange(-25.1,-7.85,-19.15,13.95,rows);
  rectRange(10.2,27.5,-19.15,14.05,rows);
  rectRange(-7.85,10.2,-13.5,8.6,rows);
  // Pedimented projections on the Houston/Record Street facades.
  for(const [x,a] of [[-26.8,-Math.PI/2],[29.4,Math.PI/2]]) {
    facade(x,-2.65,a,14.1,0,5.2,[-3.9,0,3.9].map(x=>({x,y:.4,w:2.75,h:4.45})), 'granite',1.4);
    facade(x,-2.65,a,14.1,5.2,22,[-4.6,-2.3,0,2.3,4.6].flatMap(x=>[{x,y:6.7,w:1.25,h:4.4},{x,y:14,w:1.45,h:6.1}]),'red',1.4);
  }
  // Slate hipped wing roofs, with clipped corners around the turret cylinders.
  function hip(x0,x1,z0,z1,y=22,h=8) {
    const mx=(x0+x1)/2,positions=[];
    // Six exact planar faces; subtract the octagonal turret wall envelopes.
    // This avoids the broken-looking grid facets of a sampled hip roof.
    const A=[x0,y,z0],B=[x1,y,z0],C=[x1,y,z1],D=[x0,y,z1],E=[mx,y+h,z0+6],F=[mx,y+h,z1-6];
    function split(poly,a,c) {
      const inside=[],outside=[],side=p=>(c[0]-a[0])*(p[2]-a[1])-(c[1]-a[1])*(p[0]-a[0]);
      for(let i=0;i<poly.length;i++) {
        const p=poly[i],q=poly[(i+1)%poly.length],sp=side(p),sq=side(q);
        (sp>=-1e-8?inside:outside).push(p);
        if((sp>0&&sq<0)||(sp<0&&sq>0)){const t=sp/(sp-sq),v=p.map((v,k)=>v+(q[k]-v)*t);inside.push(v);outside.push(v);}
      }
      return [inside,outside];
    }
    for(const triangle of [[A,E,B],[A,D,E],[D,F,E],[D,C,F],[B,F,C],[B,E,F]]) {
      let polygons=[triangle];
      for(const [tx,tz] of TURRETS) {
        const outline=Array.from({length:8},(_,i)=>[tx+3.02*Math.cos(i*Math.PI/4),tz+3.02*Math.sin(i*Math.PI/4)]),result=[];
        for(const poly of polygons) {
          let remainder=poly;
          for(let i=0;i<8&&remainder.length>=3;i++){const [inner,outer]=split(remainder,outline[i],outline[(i+1)%8]);if(outer.length>=3)result.push(outer);remainder=inner;}
        }
        polygons=result;
      }
      for(const poly of polygons)for(let i=1;i<poly.length-1;i++)positions.push(...poly[0],...poly[i],...poly[i+1]);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();put(g,'roof');
  }
  hip(-25.1,-7.85,-19.15,13.95);hip(10.2,27.5,-19.15,14.05);hip(-7.85,10.2,-13.5,8.6);
  // Wing front/back gables with five small attic lancets and attached finials.
  for(const [cx,z,a,half] of [...[-16.45,18.7].flatMap(x=>[[x,14.0,0,5],[x,-19.2,Math.PI,5]]),[-26.8,-2.65,-Math.PI/2,7.05],[29.4,-2.65,Math.PI/2,7.05]]) {
    const M=new THREE.Matrix4().makeRotationY(a).setPosition(cx,0,z);
    const s=shape([[-half,22],[half,22],[0,28.3]]);
    for(const x of [-2.5,-1.25,0,1.25,2.5])s.holes.push(new THREE.Path(archPoints(x,22.5,.63,1.65,N).map(p=>new THREE.Vector2(...p))));
    const g=new THREE.ExtrudeGeometry(s,{depth:.45,bevelEnabled:false}).translate(0,0,-.45).applyMatrix4(M);put(g);
    for(const x of [-2.5,-1.25,0,1.25,2.5])put(new THREE.ShapeGeometry(shape(archPoints(x,22.5,.63,1.65,N))).translate(0,0,-.55).applyMatrix4(M),'glass');
    for(const v of [-1,1])b.bar('trim',new THREE.Vector3(v*(half+.05),22.0,0).applyMatrix4(M).toArray(),new THREE.Vector3(0,28.4,0).applyMatrix4(M).toArray(),.22,.24);
    cyl('trim',cx,28.3,z,.16,.65,.05,6);
  }
  // The two pedimented side projections have closed returns and slate roofs
  // meeting the main wing ridge, rather than unsupported thin gable screens.
  for(const [outer,inner,ridge] of [[-26.8,-25.1,-16.475],[29.4,27.5,18.85]]) {
    for(const z of [-9.7,4.4]) {
      box('granite',(outer+inner)/2,0,z,Math.abs(inner-outer),5.2,.25);
      box('red',(outer+inner)/2,5.2,z,Math.abs(inner-outer),16.8,.25);
    }
    const vertices=[];
    for(const edge of [-9.7,4.4]) {
      const p=[[outer,22,edge],[outer,28.3,-2.65],[ridge,30,-2.65],[ridge,30,edge]];
      const order=(outer<inner)===(edge<0)?[0,1,2,0,2,3]:[0,2,1,0,3,2];
      for(const i of order)vertices.push(...p[i]);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();put(g,'roof');
  }
  // Eight polygonal rounded turrets, with windows cut in the tangent walls.
  for(const [x,z] of TURRETS) {
    const seg=near?16:8,r=3.15,ap=r*Math.cos(Math.PI/seg),faceW=2*r*Math.sin(Math.PI/seg);
    for(let i=0;i<seg;i++) {
      const a=(i+.5)*2*Math.PI/seg,cx=x+ap*Math.sin(a),cz=z+ap*Math.cos(a),visible=i%2===0;
      for(const [lo,hi,mat,wins] of [[0,5.2,'granite',visible?[{x:0,y:1.1,w:.65,h:2.5,trim:false}]:[]],[5.2,24.5,'red',visible?[{x:0,y:6.8,w:faceW*.72,h:4.2},{x:0,y:14,w:faceW*.72,h:6.2},{x:0,y:22,w:faceW*.64,h:1.7,trim:false}]:[]]])
        facade(cx,cz,a,faceW,lo,hi,wins,mat,.40);
    }
    // All horizontal collars share wall materials and touch the wall shell.
    cyl('granite',x,4.9,z,3.22,.3);cyl('granite',x,11.8,z,3.24,.4);cyl('red',x,20.7,z,3.27,.55);cyl('red',x,24.35,z,3.33,.45);
    cyl('tile',x,24.8,z,3.35,5.2,0);cyl('trim',x,30,z,.12,.75,.02,6);
    if(near)for(const y of [12.8,21.5])cyl('red',x,y,z,3.18,.09,3.18,16);
  }
  // Recessed central north/south entrance blocks, with three Romanesque portals.
  for(const [z,a] of [[13.35,0],[-17.95,Math.PI]]) {
    facade(1.1,z,a,17.6,0,5.2,[-5.5,0,5.5].map(x=>({x,y:.35,w:3.6,h:4.8})),'granite',1.0);
    box('granite',1.1,4.95,z,17.6,.25,1.3);
  }
  // Clock tower: square belfry shaft, corner pinnacles and chamfered clock drum.
  rectRange(-4.5,6.5,-8.25,2.25,[{y:25.3,h:8.7,w:1.45,pitch:2.8}],36);
  box('red',1,35.2,-3,11.7,.8,11.3);
  const towerSides=8,rad=5.3,apothem=rad*Math.cos(Math.PI/8);
  for(let i=0;i<towerSides;i++) {
    const a=i*Math.PI/4,cx=1+apothem*Math.sin(a),cz=-3+apothem*Math.cos(a),w=2*rad*Math.sin(Math.PI/8);
    facade(cx,cz,a,w,36,45,i%2===0?[-.95,.95].map(x=>({x,y:36.4,w:1.15,h:2.8})):[],'red',.7);
    if(i%2===0) {
      const M=new THREE.Matrix4().makeRotationY(a).setPosition(cx,0,cz);
      // Reconstructed four clock faces: light dial, dark ticks and hands, no textures.
      put(new THREE.CircleGeometry(1.20,near?32:16).translate(0,41.5,.20).applyMatrix4(M),'light');
      put(new THREE.RingGeometry(1.20,1.37,near?32:16).translate(0,41.5,.15).applyMatrix4(M),'trim');
      for(let k=0;k<12;k++) {
        const q=k*Math.PI/6;
        put(new THREE.BoxGeometry(.09,k%3===0?.23:.15,.06).rotateZ(-q).translate(Math.sin(q)*1.03,41.5+Math.cos(q)*1.03,.30).applyMatrix4(M),'roof');
      }
      for(const [q,len] of [[-.65,.73],[1.7,.92]])put(new THREE.BoxGeometry(.09,len,.08).translate(0,len/2,0).rotateZ(q).translate(0,41.5,.35).applyMatrix4(M),'roof');
    }
  }
  for(const x of [-4.15,6.15])for(const z of [-7.8,1.8]) {
    cyl('red',x,35.8,z,.64,3.6);cyl('roof',x,39.4,z,.82,2.2,0,8);cyl('trim',x,41.6,z,.11,.5,.03,5);
  }
  // Octagonal cornice, banded steep roof and a small open lantern.
  cyl('red',1,44.8,-3,5.60,.45,5.60,8);
  // Photo-calibrated concave bell profile: 8.75 m from cornice to lantern,
  // rather than the former squat 5.25 m. Adjacent slate courses share edges.
  const bands=[[45.25,5.55,46.65,4.65,'roof'],[46.65,4.65,47.3,4.3,'tile'],[47.3,4.3,48.65,3.65,'roof'],[48.65,3.65,49.3,3.38,'tile'],[49.3,3.38,50.65,2.85,'roof'],[50.65,2.85,51.3,2.62,'tile'],[51.3,2.62,52.65,1.95,'roof'],[52.65,1.95,53.2,1.62,'tile'],[53.2,1.62,54,1.2,'roof']];
  for(const [lo,rb,hi,rt,m] of bands)cyl(m,1,lo,-3,rb,hi-lo,rt,8);
  // Four small gabled dormers seated in the lower bell, kept in both LODs.
  for(let i=0;i<4;i++) {
    const a=i*Math.PI/2,M=new THREE.Matrix4().makeRotationY(a).setPosition(1,0,-3);
    put(new THREE.ShapeGeometry(shape([[-.65,45.25],[.65,45.25],[.65,46],[0,46.9],[-.65,46]])).translate(0,0,5.2).applyMatrix4(M),'red');
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-.72,46,5.25,0,47,5.25,0,47,4.15, -.72,46,5.25,0,47,4.15,-.72,46,4.15, 0,47,5.25,.72,46,5.25,.72,46,4.15,0,47,5.25,.72,46,4.15,0,47,4.15],3));g.computeVertexNormals();g.applyMatrix4(M);put(g,'roof');
  }
  cyl('trim',1,54,-3,1.25,.4,1.25,8);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;cyl('trim',1+.85*Math.sin(a),54.4,-3+.85*Math.cos(a),.10,1.45,.10,5);}
  cyl('roof',1,55.85,-3,1.2,1.05,0,8);cyl('trim',1,56.9,-3,.11,.6,0,6);
  // Rotation 14.5° from mapped wing edges (true bearings approximately 75.5/165.5°).
  const root=b.finish(),R=new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(SPEC.rotationDeg));
  root.traverse(o=>{if(o.isMesh){o.geometry.applyMatrix4(R);const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  return root;
}
