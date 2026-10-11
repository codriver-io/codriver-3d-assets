import * as THREE from 'three';

// Saint-Sernin's round Romanesque arches and mitred upper belfry bays.
export function archOutline(w, h, n = 8, mitre = false) {
  const r=w/2, spring=h-r;
  const a=[[-r,0],[r,0],[r,spring]];
  if(mitre) a.push([0,h],[-r,spring]);
  else for(let i=1;i<=n;i++){const t=Math.PI*i/n;a.push([r*Math.cos(t),spring+r*Math.sin(t)]);}
  return a;
}
const path=pts=>new THREE.Shape(pts.map(p=>new THREE.Vector2(...p)));
export function makeKit(b, near) {
  const put=(g,m)=>{
    // Remove zero-area triangles from tiny mapped edge coincidences before export.
    const p=g.attributes.position,idx=g.index,n=idx?idx.count:p.count,keep=[];
    const a=new THREE.Vector3(),c=new THREE.Vector3(),d=new THREE.Vector3();
    for(let i=0;i<n;i+=3){
      const ids=idx?[idx.getX(i),idx.getX(i+1),idx.getX(i+2)]:[i,i+1,i+2];
      a.fromBufferAttribute(p,ids[0]);c.fromBufferAttribute(p,ids[1]).sub(a);d.fromBufferAttribute(p,ids[2]).sub(a);
      if(c.cross(d).lengthSq()>1e-12)keep.push(...ids);
    }
    if(keep.length!==n||new Set(keep).size!==p.count){
      const used=new Map(),points=[],indices=[];
      for(const id of keep){if(!used.has(id)){used.set(id,used.size);points.push(p.getX(id),p.getY(id),p.getZ(id));}indices.push(used.get(id));}
      g.dispose();g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex(indices);
    }
    g.computeVertexNormals();b.put(g,m);
  };
  const seg=near?8:3;
  // XY shapes face outward with +Z; arbitrary wall normal in the u/v plane.
  function place(g, u, v, y, nx, nz, plane=0){g.rotateY(Math.atan2(nx,nz));g.translate(u+nx*plane,y,v+nz*plane);return g;}
  function panel(m,pts,u,v,y,nx,nz,offset=.07){put(place(new THREE.ShapeGeometry(path(pts)),u,v,y,nx,nz,offset),m);}
  function arch(m,w,h,border,u,v,y,nx,nz,offset=.12,mitre=false){
    const sh=path(archOutline(w,h,seg,mitre));
    const hole=archOutline(w-border*2,h-border*1.4,seg,mitre).map(([x,y])=>[x,y+border*.45]);
    sh.holes.push(new THREE.Path(hole.map(p=>new THREE.Vector2(...p)).reverse()));
    const geometry=near?new THREE.ExtrudeGeometry(sh,{depth:.16,bevelEnabled:false}):new THREE.ShapeGeometry(sh);
    put(place(geometry,u,v,y,nx,nz,offset),m);
  }
  function window(u,v,y,nx,nz,w=1.2,h=2.9,mat='glass',mitre=false){
    panel(mat,archOutline(w,h,seg,mitre),u,v,y,nx,nz);
    arch('stone',w+.48,h+.28,.22,u,v,y-.1,nx,nz,.14,mitre);
    if(near){
      b.bar('iron',[u+nx*.1,y+.1,v+nz*.1],[u+nx*.1,y+h-.4,v+nz*.1],.07);
      for(let k=1;k<4;k++){
        const yy=y+h*k/4;
        b.bar('iron',[u-nz*w*.42+nx*.105,yy,v+nx*w*.42+nz*.105],[u+nz*w*.42+nx*.105,yy,v-nx*w*.42+nz*.105],.06);
      }
    }
  }
  function quad(m,a,c,d,e){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));g.setIndex([0,1,2,0,2,3]);put(g,m);}
  function roof(ring, height, cuts=[], m='roof'){
    // Triangulation must include ridge vertices: boundary-only triangulation flattens gables.
    let polygons=[ring];
    for(const [axis,value] of cuts){
      const next=[];
      for(const pts of polygons)for(const sign of [-1,1]){
        const out=[];
        for(let i=0;i<pts.length;i++){
          const a=pts[i],c=pts[(i+1)%pts.length],da=(a[axis]-value)*sign,dc=(c[axis]-value)*sign;
          if(da>=-1e-7)out.push(a);
          if((da>1e-7&&dc< -1e-7)||(da< -1e-7&&dc>1e-7)){
            const t=(value-a[axis])/(c[axis]-a[axis]);out.push([a[0]+t*(c[0]-a[0]),a[1]+t*(c[1]-a[1])]);
          }
        }
        if(out.length>2)next.push(out);
      }
      polygons=next;
    }
    for(const [piece,pts] of polygons.entries()){
      const g=new THREE.ShapeGeometry(path(pts.map(([u,v])=>[u,-v])));g.rotateX(-Math.PI/2);
      const pos=g.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,height(pos.getX(i),pos.getZ(i)));
      put(g,Array.isArray(m)?m[piece%m.length]:m);
    }
  }
  function shell(ring,y0,top,m='brick'){
    // Positive area in u/v: exterior is to the right of each directed edge.
    let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
    const pts=area>0?ring:[...ring].reverse();
    for(let i=0;i<pts.length;i++){
      const a=pts[i],c=pts[(i+1)%pts.length],ha=typeof top==='function'?top(...a):top,hc=typeof top==='function'?top(...c):top;
      quad(m,[a[0],y0,a[1]],[a[0],ha,a[1]],[c[0],hc,c[1]],[c[0],y0,c[1]]);
    }
  }
  function pyramid(ring,y0,y1,center,m='roof'){
    let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
    const pts=area>0?ring:[...ring].reverse(),positions=[];
    for(let i=0;i<pts.length;i++){const a=pts[i],c=pts[(i+1)%pts.length];positions.push(a[0],y0,a[1],center[0],y1,center[1],c[0],y0,c[1]);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));put(g,m);
  }
  function courses(ring,bands,m='stone'){
    let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
    const pts=area>0?ring:[...ring].reverse();
    for(let i=0;i<pts.length;i++){
      const a=pts[i],c=pts[(i+1)%pts.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      if(len<.01)continue;const nx=dz/len,nz=-dx/len;
      for(const [low,high] of bands)quad(m,[a[0]+nx*.065,low,a[1]+nz*.065],[a[0]+nx*.065,high,a[1]+nz*.065],[c[0]+nx*.065,high,c[1]+nz*.065],[c[0]+nx*.065,low,c[1]+nz*.065]);
    }
  }
  function cornice(ring,y,m='stone',width=.23){
    for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];b.bar(m,[a[0],y,a[1]],[c[0],y,c[1]],width);}
  }
  function drum(u,v,flat,y0,y1,m='brick'){
    const g=new THREE.CylinderGeometry(flat/Math.cos(Math.PI/8),flat/Math.cos(Math.PI/8),y1-y0,8,1,m==='brick'||m==='recess');g.rotateY(Math.PI/8);g.translate(u,(y0+y1)/2,v);put(g,m);
  }
  function disc(m,r,u,v,y,nx,nz,offset=.1){put(place(new THREE.CircleGeometry(r,near?32:16),u,v,y,nx,nz,offset),m);}
  function ring(m,ri,ro,u,v,y,nx,nz,offset=.16){put(place(new THREE.RingGeometry(ri,ro,near?32:16),u,v,y,nx,nz,offset),m);}
  return {put,place,panel,arch,window,quad,roof,shell,pyramid,courses,cornice,drum,disc,ring,seg,near,b};
}
