import * as THREE from 'three';
// u follows Mission Inn Avenue (119°); v follows Main Street (209°).
export const ANGLE=-29*Math.PI/180;
export const sitePoint=(u,y,v)=>new THREE.Vector3(u*Math.cos(ANGLE)+v*Math.sin(ANGLE),y,-u*Math.sin(ANGLE)+v*Math.cos(ANGLE));
export function missionKit(b,near) {
  const put=(g,m)=>{g.rotateY(ANGLE);b.put(g,!near&&m==='wood'?'iron':m,0,0);};
  function box(m,u,y,v,w,h,d,a=0){const g=new THREE.BoxGeometry(w,h,d);g.rotateY(a);g.translate(u,y+h/2,v);put(g,m);}
  function cyl(m,u,v,y,h,r,rt=r,n=near?16:8){const g=new THREE.CylinderGeometry(rt,r,h,n);g.translate(u,y+h/2,v);put(g,m);}
  function lathe(m,u,v,profile,n=near?24:12){const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),n);g.translate(u,0,v);put(g,m);}
  function bar(m,a,c,w,d=w){const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dv=cv.clone().sub(av);if(dv.length()<1e-5)return;const g=new THREE.BoxGeometry(w,dv.length(),d);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dv.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,m);}
  function poly(m,ring,y,h,holes=[]){const s=new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v)));for(const hole of holes){const points=hole.map(([u,v])=>new THREE.Vector2(u,-v));if(THREE.ShapeUtils.isClockWise(points))points.reverse();s.holes.push(new THREE.Path(points));}const g=new THREE.ExtrudeGeometry(s,{depth:h,steps:1,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,m);}
  function shape(m,s,u,v,y,depth=.18,a=0,dropBottom=false){
    let g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:near?4:1});
    if(dropBottom){
      const p=g.attributes.position,n=g.attributes.normal,pos=[],nor=[];
      for(let i=0;i<p.count;i+=3){if([0,1,2].every(j=>Math.abs(p.getY(i+j))<1e-6))continue;for(let j=0;j<3;j++){pos.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));nor.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}}
      g.dispose();g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
    }
    g.translate(0,0,-depth);g.rotateY(a);g.translate(u,y,v);put(g,m);
  }
  function archShape(w,h){const r=w/2,s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return s;}
  function arch(m,u,v,y,w,h,t=.28,depth=.38,a=0,closed=false){const s=archShape(w+2*t,h+t);if(!closed)s.holes.push(new THREE.Path(archShape(w,h).getPoints(near?3:2)));shape(m,s,u,v,y,depth,a,!closed);}
  function mullion(u,v,y,w,h,a){
    const g=new THREE.PlaneGeometry(w,h);g.rotateY(a);g.translate(u,y+h/2,v);put(g,'wood');
  }
  function window(u,v,y,w,h,a=0,lit=false,surround=false){
    const nx=Math.sin(a),nz=Math.cos(a),tx=Math.cos(a),tz=-Math.sin(a);
    const pane=new THREE.ShapeGeometry(archShape(w,h),near?3:2);pane.rotateY(a);pane.translate(u+nx*.12,y,v+nz*.12);put(pane,lit?'glow':'glass');
    if(surround){
      const s=archShape(w+.75,h+.42);s.holes.push(new THREE.Path(archShape(w+.22,h+.12).getPoints(near?3:2)));
      const g=new THREE.ShapeGeometry(s,near?3:2);g.rotateY(a);g.translate(u+nx*.065,y-.18,v+nz*.065);put(g,'trim');
    }
    if(!near)return;
    const frame=archShape(w+.24,h+.12);frame.holes.push(new THREE.Path(archShape(w,h).getPoints(3)));const fg=new THREE.ShapeGeometry(frame,3);fg.rotateY(a);fg.translate(u+nx*.24,y-.06,v+nz*.24);put(fg,'wood');
    mullion(u+nx*.29,v+nz*.29,y,.075,h-.12,a);
    for(const yy of [y+h*.32,y+h*.65])mullion(u+nx*.29,v+nz*.29,yy,w,.07,a);
    box('trim',u,y-.17,v,w+.3,.15,.55,a);
  }
  function hip(u0,u1,v0,v1,y,rise,m='roof'){
    const a=[u0,y,v0],c=[u1,y,v0],d=[u1,y,v1],e=[u0,y,v1],w=u1-u0,len=v1-v0;
    const r0=w>len?[u0+len*.4,y+rise,(v0+v1)/2]:[(u0+u1)/2,y+rise,v0+w*.4],r1=w>len?[u1-len*.4,y+rise,(v0+v1)/2]:[(u0+u1)/2,y+rise,v1-w*.4];
    const tris=w>len?[[a,c,r1],[a,r1,r0],[e,r0,r1],[e,r1,d],[a,r0,e],[c,d,r1]]:[[a,r1,e],[a,r0,r1],[c,d,r1],[c,r1,r0],[a,c,r0],[e,r1,d]];
    // Seal the underside and all eaves; the open verandas expose this roof from below.
    const bottom=[a,c,d,e].map(p=>[p[0],p[1]-.12,p[2]]);
    tris.push([bottom[0],bottom[2],bottom[1]],[bottom[0],bottom[3],bottom[2]]);
    for(let i=0;i<4;i++){const j=(i+1)%4;tris.push([[a,c,d,e][i],bottom[i],bottom[j]],[[a,c,d,e][i],bottom[j],[a,c,d,e][j]]);}
    const p=[];for(let i=0;i<tris.length;i++){const [a,b,c]=tris[i],n=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));p.push(...a,...((i<6?n.y<0:true)?[c,b]:[b,c]).flat());}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();put(g,m);bar(m,r0,r1,.23);
  }
  function rail(u0,v0,u1,v1,y,m='iron',spacing=.85){
    bar(m,[u0,y+1,v0],[u1,y+1,v1],.09);if(!near)return;
    const n=Math.ceil(Math.hypot(u1-u0,v1-v0)/spacing);for(let i=0;i<=n;i++){const t=i/n;bar(m,[u0+(u1-u0)*t,y,v0+(v1-v0)*t],[u0+(u1-u0)*t,y+1,v0+(v1-v0)*t],.055);}
  }
  function pinnacle(u,v,y,h=2.7){box('trim',u,y,v,.65,h*.35,.65);cyl('trim',u,v,y+h*.35,h*.65,.48,0,4);}
  return {put,box,cyl,lathe,bar,poly,shape,arch,archShape,window,hip,rail,pinnacle,near};
}
