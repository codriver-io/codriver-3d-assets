import * as THREE from 'three';

// Independent primitives; +v faces the entrance before geographic rotation.
export function parts(b, near) {
  const n = near ? 10 : 4;
  function box(mat,u0,u1,y0,y1,v0,v1) {
    const g=new THREE.BoxGeometry(u1-u0,y1-y0,v1-v0);
    if(y0===0){const a=Array.from(g.index.array);a.splice(18,6);g.setIndex(a);}
    g.translate((u0+u1)/2,(y0+y1)/2,(v0+v1)/2);b.put(g,mat);
  }
  const cyl=(mat,u,y0,y1,v,r0,r1=r0,s=near?10:6)=>{
    const g=new THREE.CylinderGeometry(r1,r0,y1-y0,s);g.translate(u,(y0+y1)/2,v);b.put(g,mat);
  };
  const lathe=(mat,u,y,v,points,seg=near?12:6)=>{
    const g=new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),seg);g.translate(u,y,v);b.put(g,mat);
  };
  function shape(w,h,r=w/2) {
    const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h-r);
    s.absellipse(0,h-r,w/2,r,0,Math.PI,false);s.lineTo(-w/2,0);return s;
  }
  function onWall(g,u,y,v,a=0){g.rotateY(a);g.translate(u,y,v);return g;}
  function arch(mat,u,y,v,w,h,rim=.2,a=0) {
    const s=shape(w+2*rim,h+2*rim,w/2+rim);
    // The inner hole must not touch the outer polygon at the sill.
    const outer=new THREE.Shape(s.getPoints(n).map(p=>new THREE.Vector2(p.x,p.y-rim)));
    outer.holes.push(new THREE.Path(shape(w,h).getPoints(n)));
    const g=new THREE.ExtrudeGeometry(outer,{depth:near?.21:.14,bevelEnabled:false,curveSegments:n});
    b.put(onWall(g,u,y,v,a),mat);
  }
  function window(u,y,v,w,h,a=0,central=false) {
    b.put(onWall(new THREE.ShapeGeometry(shape(w,h),n),u,y,v,a),'glass');
    // Offset along the face normal, including side/rear walls.
    arch(central?'light':'trim',u+Math.sin(a)*.09,y,v+Math.cos(a)*.09,w,h,central?.22:.16,a);
    const local=(x,yy,z)=>[u+x*Math.cos(a)+z*Math.sin(a),y+yy,v-x*Math.sin(a)+z*Math.cos(a)];
    const bar=(mat,a0,a1,t)=>b.bar(mat,local(...a0),local(...a1),t,t);
    const spr=h-w/2;
    bar('trim',[-w/2,spr,.14],[w/2,spr,.14],.12);
    bar('trim',[0,.12,.14],[0,spr,.14],near?.09:.14);
    if(central){
      b.put(onWall(new THREE.PlaneGeometry(w-.5,spr-.3),...local(0,(spr-.3)/2+.12,.045),a),'iron');
      for(const dx of [-w/2+.22,w/2-.22])bar('trim',[dx,.1,.16],[dx,spr,.16],.18);
    }
    if(near){
      for(let i=1;i<7;i+=a===0?1:2){const t=i*Math.PI/7;bar('trim',[0,spr,.17],[Math.cos(t)*(w/2-.15),spr+Math.sin(t)*(w/2-.15),.17],.055);}
      if(a===0)for(let yy=.3;yy<spr-.15;yy+=.24)b.put(onWall(new THREE.PlaneGeometry(w-.24,.045),...local(0,yy,.11),a),'glass');
      bar('trim',[-w/2-.2,-.08,.26],[w/2+.2,-.08,.26],.22);
    }
  }
  function hip(mat,u0,u1,v0,v1,eave,peak,inset=5) {
    const ps=[[u0,eave,v0],[u1,eave,v0],[u1,eave,v1],[u0,eave,v1],[(u0+u1)/2,peak,v0+inset],[(u0+u1)/2,peak,v1-inset]];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps.flat(),3));
    g.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0]);g.computeVertexNormals();b.put(g,mat);
  }
  function statue(u,y,v,winged=false,s=1) {
    box('trim',u-.46*s,u+.46*s,y,y+.5*s,v-.38*s,v+.38*s);
    lathe('sculpture',u,y+.5*s,v,[[0,0],[.32*s,0],[.4*s,.15*s],[.22*s,1.2*s],[.3*s,1.7*s],[.14*s,2.0*s],[0,2.05*s]]);
    const g=new THREE.SphereGeometry(.2*s,near?10:6,near?7:4);g.translate(u,y+2.7*s,v);b.put(g,'sculpture');
    b.bar('sculpture',[u,y+2.2*s,v],[u+.6*s,y+(winged?3.15:2.45)*s,v],.12*s,.12*s);
    b.bar('sculpture',[u,y+2.18*s,v],[u-.5*s,y+1.5*s,v+.1*s],.13*s,.13*s);
    if(winged)for(const sign of [-1,1]){
      const sh=new THREE.Shape([[0,0],[sign*.82*s,.75*s],[sign*.58*s,1.7*s],[sign*.15*s,1.1*s]].map(p=>new THREE.Vector2(...p)));
      const g=new THREE.ExtrudeGeometry(sh,{depth:.14*s,bevelEnabled:false});g.translate(u,y+1.75*s,v-.2*s);b.put(g,'sculpture');
    }
  }
  return {box,cyl,lathe,shape,onWall,arch,window,hip,statue};
}
