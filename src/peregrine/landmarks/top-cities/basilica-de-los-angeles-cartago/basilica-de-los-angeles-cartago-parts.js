import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
const yaw = SPEC.rotationDeg * Math.PI / 180;
export const world = ([x,y,z]) => [x*Math.cos(yaw)+z*Math.sin(yaw),y,-x*Math.sin(yaw)+z*Math.cos(yaw)];
export function local([lng,lat]) {
  const k=mercStretch(SPEC.origin[1]);
  const x=(lngToMercX(lng)-lngToMercX(SPEC.origin[0]))/k;
  const z=-(latToMercY(lat)-latToMercY(SPEC.origin[1]))/k;
  return [x*Math.cos(yaw)-z*Math.sin(yaw),x*Math.sin(yaw)+z*Math.cos(yaw)];
}
export function parts(b,near) {
  const n=near?10:5;
  function put(g,mat,matrix) {
    if(matrix)g.applyMatrix4(matrix);g.rotateY(yaw);
    if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));
    const p=g.attributes.position,ix=g.index.array,keep=[],a=new THREE.Vector3(),c=new THREE.Vector3(),d=new THREE.Vector3();
    for(let i=0;i<ix.length;i+=3){a.fromBufferAttribute(p,ix[i]);c.fromBufferAttribute(p,ix[i+1]);d.fromBufferAttribute(p,ix[i+2]);if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)keep.push(ix[i],ix[i+1],ix[i+2]);}
    g.setIndex(keep);
    const used=[...new Set(keep)],map=new Map(used.map((v,i)=>[v,i])),compact=new THREE.BufferGeometry();
    for(const [name,attr] of Object.entries(g.attributes)){const data=[];for(const v of used)for(let j=0;j<attr.itemSize;j++)data.push(attr.array[v*attr.itemSize+j]);compact.setAttribute(name,new THREE.Float32BufferAttribute(data,attr.itemSize));}
    compact.setIndex(keep.map(v=>map.get(v)));g.dispose();b.put(compact,mat);
  }
  const box=(mat,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d).translate(x,y,z),ix=g.index.array;g.setIndex([...ix].filter((_,i)=>i<18||i>=24));put(g,mat);};
  const lathe=(mat,x,z,profile,segments=n)=>put(new THREE.LatheGeometry(profile.map(v=>new THREE.Vector2(...v)),segments).translate(x,0,z),mat);
  function bar(mat,a,c,w){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...c),v=end.clone().sub(start);const g=new THREE.BoxGeometry(w,v.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));put(g.translate(...start.add(end).multiplyScalar(.5).toArray()),mat);}
  function plan(mat,ring,y,h){put(new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))),{depth:h,bevelEnabled:false}).rotateX(-Math.PI/2).translate(0,y,0),mat);}
  function hip(x,z,w,d,eave,ridge){
    const p=[x-w/2,eave,z-d/2,x+w/2,eave,z-d/2,x+w/2,eave,z+d/2,x-w/2,eave,z+d/2];
    const half=Math.max(0,(d-w)/2);p.push(x,ridge,z-half,x,ridge,z+half);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0]);g.computeVertexNormals();put(g,'roof');
  }
  const archPoints=(x,y,w,h)=>{const r=w/2,s=y+h-r,p=[new THREE.Vector2(x-r,y),new THREE.Vector2(x+r,y),new THREE.Vector2(x+r,s)];for(let i=1;i<=n;i++){const a=i*Math.PI/n;p.push(new THREE.Vector2(x+r*Math.cos(a),s+r*Math.sin(a)));}return p;};
  function face(x,z,a=0){const m=new THREE.Matrix4().makeRotationY(a).setPosition(x,0,z);return {
    box(mat,x0,x1,y0,y1,d0=.12,d1=.32){put(new THREE.BoxGeometry(x1-x0,y1-y0,d1-d0).translate((x0+x1)/2,(y0+y1)/2,(d0+d1)/2),mat,m);},
    arch(mat,s,y,w,h,depth=.22){put(new THREE.ShapeGeometry(new THREE.Shape(archPoints(s,y,w,h))).translate(0,0,depth),mat,m);},
    trim(s,y,w,h,t=.2,depth=.3){const shape=new THREE.Shape(archPoints(s,y-t,w+2*t,h+2*t));shape.holes.push(new THREE.Path(archPoints(s,y,w,h)));put((near?new THREE.ExtrudeGeometry(shape,{depth:.1,bevelEnabled:false}):new THREE.ShapeGeometry(shape)).translate(0,0,depth),'trim',m);},
    wall(mat,w,y0,y1,holes,depth=.4,interiorMat=mat){const shape=new THREE.Shape([new THREE.Vector2(-w/2,y0),new THREE.Vector2(w/2,y0),new THREE.Vector2(w/2,y1),new THREE.Vector2(-w/2,y1)]);for(const [s,y,hw,hh]of holes)shape.holes.push(new THREE.Path(archPoints(s,y,hw,hh)));const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false}).translate(0,0,-depth);
      if(interiorMat===mat)put(g,mat,m);
      else {const front=[],inside=[],normal=g.attributes.normal;for(let i=0;i<normal.count;i+=3){const target=normal.getZ(i)>.5?front:inside;target.push(i,i+1,i+2);}for(const [name,index] of [[mat,front],[interiorMat,inside]]){const part=g.clone();part.setIndex(index);put(part,name,m);}g.dispose();}},
    circleWall(mat,w,y0,y1,cy,r,depth=.35){const shape=new THREE.Shape([new THREE.Vector2(-w/2,y0),new THREE.Vector2(w/2,y0),new THREE.Vector2(w/2,y1),new THREE.Vector2(-w/2,y1)]);const hole=new THREE.Path();hole.absarc(0,cy,r,0,Math.PI*2,true);shape.holes.push(hole);put(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?12:4}).translate(0,0,-depth),mat,m);},
    circle(mat,s,y,r,depth=.22){put(new THREE.CircleGeometry(r,near?24:8).translate(s,y,depth),mat,m);},
    ring(s,y,r,t=.12,depth=.32){put(new THREE.TorusGeometry(r,t,near?5:3,near?24:8).translate(s,y,depth),'trim',m);},
    bar(mat,a,c,w){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...c),v=end.clone().sub(start);const g=new THREE.BoxGeometry(w,v.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));put(g.translate(...start.add(end).multiplyScalar(.5).toArray()),mat,m);},
  };}
  function dome(x,z,r,y,rise){const p=[[r,y]],steps=near?7:3;for(let i=1;i<=steps;i++){let a=i*Math.PI/(2*steps);p.push([i===steps?0:r*Math.cos(a),y+rise*Math.sin(a)]);}lathe('dome',x,z,p,near?24:8);
    if(near)for(let i=0;i<12;i++){const a=i*Math.PI*2/12;for(let j=0;j<(near?8:4);j++){const c=q=>[x+(r+.06)*Math.cos(q)*Math.sin(a),y+(rise+.06)*Math.sin(q),z+(r+.06)*Math.cos(q)*Math.cos(a)];bar('shade',c(j*Math.PI/(near?16:8)),c((j+1)*Math.PI/(near?16:8)),near?.075:.09);}}
  }
  function column(x,z,y0,y1,r=.33){box('trim',x,y0+.2,z,r*2.7,.4,r*2.7);lathe('trim',x,z,[[r*1.3,y0+.4],[r,y0+.6],[r*.86,y1-.35],[r*1.4,y1-.2]],near?12:5);box('trim',x,y1-.1,z,r*2.9,.2,r*2.9);}
  function angel(x,z,y,h,winged=true){box('trim',x,y+.12,z,.65,.24,.65);lathe('trim',x,z,[[h*.16,y+.24],[h*.13,y+h*.55],[h*.1,y+h*.76]],near?10:5);put(new THREE.SphereGeometry(h*.11,near?10:5,near?5:3).translate(x,y+h*.87,z),'trim');bar('trim',[x,y+h*.7,z],[x+h*.35,y+h*.75,z],h*.07);bar('trim',[x,y+h*.67,z],[x-h*.28,y+h*.97,z],h*.07);
    if(winged)for(const s of [-1,1]){const shape=new THREE.Shape([new THREE.Vector2(x,y+h*.65),new THREE.Vector2(x+s*h*.65,y+h*.96),new THREE.Vector2(x+s*h*.47,y+h*.59),new THREE.Vector2(x+s*h*.1,y+h*.5)]);put(new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:false}).translate(0,0,z-.18),'trim');}}
  return {put,box,bar,plan,hip,lathe,face,dome,column,angel};
}
