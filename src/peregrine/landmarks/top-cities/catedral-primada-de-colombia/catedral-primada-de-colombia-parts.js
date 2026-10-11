import * as THREE from 'three';

// Original small construction kit. Each face is authored in its own outward
// XY frame. Shape holes cut real belfry apertures rather than dark decals.
export function kit(b, near) {
  const put=(g,m)=>b.put(g,m,0,0);
  const box=(m,x0,x1,y0,y1,z0,z1)=>b.box(m,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0],0,0,0);
  const arch=(x,y,w,h)=> {
    const r=w/2,s=y+h-r,p=[[x-r,y],[x+r,y],[x+r,s]];
    for(let i=1;i<= (near?12:3);i++){const t=i*Math.PI/(near?12:3);p.push([x+r*Math.cos(t),s+r*Math.sin(t)]);}
    return p;
  };
  const path=p=>new THREE.Path(p.map(q=>new THREE.Vector2(...q)));
  const shape=p=>new THREE.Shape(p.map(q=>new THREE.Vector2(...q)));
  const on=(g,cx,cz,angle)=>{g.rotateY(angle);g.translate(cx,0,cz);return g;};
  const panel=(m,p,cx,cz,angle)=>put(on(new THREE.ShapeGeometry(shape(p)),cx,cz,angle),m);
  const relief=(m,p,cx,cz,angle,depth=.25)=>put(on(new THREE.ExtrudeGeometry(shape(p),{depth,bevelEnabled:false}),cx,cz,angle),m);
  const window=(cx,cz,angle,y,w,h,mat='recess')=>{
    panel(mat,arch(0,y,w,h),cx,cz,angle);
    const s=shape(arch(0,y-.18,w+.7,h+.53));s.holes.push(path(arch(0,y,w,h)));
    put(on(near ? new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false}) : new THREE.ShapeGeometry(s),cx,cz,angle),'trim');
  };
  const cylinder=(m,x,z,y0,y1,r0,r1=r0,n=near?12:6)=>{const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n);g.translate(x,(y0+y1)/2,z);put(g,m);};
  const lathe=(m,x,z,profile,n=near?24:12)=>{const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),n);g.translate(x,0,z);put(g,m);};
  const shell=(x,z,w,y0,y1,openingY,openingW,openingH)=>{
    const h=w/2,t=.65;
    for(let k=0;k<4;k++){
      const a=k*Math.PI/2,s=shape([[-h,y0],[h,y0],[h,y1],[-h,y1]]);
      s.holes.push(path(arch(0,openingY,openingW,openingH)));
      const g=new THREE.ExtrudeGeometry(s,{depth:t,bevelEnabled:false});
      put(on(g,x+Math.sin(a)*(h-t),z+Math.cos(a)*(h-t),a),'stone');
      // Archivolt has its own cutout and stands off the wall.
      const tr=shape(arch(0,openingY-.2,openingW+.65,openingH+.53));tr.holes.push(path(arch(0,openingY,openingW,openingH)));
      put(on(new THREE.ExtrudeGeometry(tr,{depth:.18,bevelEnabled:false}),x+Math.sin(a)*(h+.07),z+Math.cos(a)*(h+.07),a),'trim');
    }
  };
  const gable=(m,x0,x1,z0,z1,y,top)=>{
    const mid=(z0+z1)/2,p=[[z0,y],[z1,y],[mid,top]];
    const g=new THREE.ExtrudeGeometry(shape(p),{depth:x1-x0,bevelEnabled:false});
    g.rotateY(-Math.PI/2);g.translate(x1,0,0);put(g,m);
  };
  return {put,box,arch,panel,relief,window,cylinder,lathe,shell,gable};
}
