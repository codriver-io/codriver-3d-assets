import * as THREE from 'three';
// Explicitly wound wall patches and real inset glazing cavities.
export function quad(b,mat,points,normal){
  const a=new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0]));
  const c=new THREE.Vector3(...points[2]).sub(new THREE.Vector3(...points[0]));
  const idx=a.cross(c).dot(new THREE.Vector3(...normal))>=0?[0,1,2,0,2,3]:[0,2,1,0,3,2];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat);
}
export function lid(b,ring,y,mat='concrete'){
  const g=new THREE.ShapeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))));g.rotateX(-Math.PI/2);g.translate(0,y,0);b.put(g,mat);
}
export function walls(b,ring,low,high,near,glazing,lidMat='concrete'){
  let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<.001)continue;
    const t=[(c[0]-a[0])/len,(c[1]-a[1])/len],sgn=area>0?1:-1,n=[t[1]*sgn,-t[0]*sgn];
    const p=(s,y,inset=0)=>[a[0]+t[0]*s-n[0]*inset,y,a[1]+t[1]*s-n[1]*inset];
    const wall=(s0,s1,y0,y1)=>quad(b,'concrete',[p(s0,y0),p(s1,y0),p(s1,y1),p(s0,y1)],[n[0],0,n[1]]);
    const request=glazing?.(a,c,len)||0,count=typeof request==='object'?request.count:request;
    if(!count){wall(0,len,low,high);continue;}
    const wy0=request.y0??(low+1.4),wy1=request.y1??Math.min(high-.9,low+5.6),pitch=len/count,w=request.width??Math.min(1.55,pitch*.55),recess=near?.32:.55;
    wall(0,len,low,wy0);wall(0,len,wy1,high);let prev=0;
    for(let k=0;k<count;k++){
      const s0=(k+.5)*pitch-w/2,s1=s0+w;wall(prev,s0,wy0,wy1);prev=s1;
      quad(b,'glow',[p(s0,wy0,recess),p(s1,wy0,recess),p(s1,wy1,recess),p(s0,wy1,recess)],[n[0],0,n[1]]);
      quad(b,'concrete',[p(s0,wy0),p(s0,wy0,recess),p(s0,wy1,recess),p(s0,wy1)],[t[0],0,t[1]]);
      quad(b,'concrete',[p(s1,wy0),p(s1,wy1),p(s1,wy1,recess),p(s1,wy0,recess)],[-t[0],0,-t[1]]);
      quad(b,'concrete',[p(s0,wy0),p(s1,wy0),p(s1,wy0,recess),p(s0,wy0,recess)],[0,1,0]);
      quad(b,'concrete',[p(s0,wy1),p(s0,wy1,recess),p(s1,wy1,recess),p(s1,wy1)],[0,-1,0]);
      if(near&&typeof request!=='object'){for(let j=1;j<4;j++)b.bar('bronze',p(s0,wy0+j*(wy1-wy0)/4,.12),p(s1,wy0+j*(wy1-wy0)/4,.12),.07,.07);b.bar('bronze',p((s0+s1)/2,wy0,.12),p((s0+s1)/2,wy1,.12),.07,.07);}
    }
    wall(prev,len,wy0,wy1);
  }
  lid(b,ring,high,lidMat);
}
export const circle=(x,z,r,n,phase=0)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(phase+i*2*Math.PI/n),z+r*Math.sin(phase+i*2*Math.PI/n)]);
export function cylinder(b,mat,x,z,r,y0,y1,n,topR=r){const g=new THREE.CylinderGeometry(topR,r,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);b.put(g,mat);}
export function dome(b,x,z,r,y,h,near,mat='copper'){
  const g=new THREE.SphereGeometry(r,near?40:20,near?16:8,0,Math.PI*2,0,Math.PI/2);g.scale(1,h/r,1);g.translate(x,y,z);b.put(g,mat);
  if(near)for(let k=0;k<20;k++){const theta=k*Math.PI/10;for(let j=1;j<=12;j++){const a=(j-1)*Math.PI/24,c=j*Math.PI/24;const p=t=>[x+(r+.035)*Math.sin(t)*Math.cos(theta),y+(h+.035)*Math.cos(t),z+(r+.035)*Math.sin(t)*Math.sin(theta)];b.bar(mat,p(a),p(c),.055,.055);}}
}
