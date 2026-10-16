import * as THREE from 'three';
// Original surface toolkit. u along facade, v toward the lawn.
export function kit(b, near) {
  const put=(g,m)=>{g.computeVertexNormals();b.put(g,m);};
  const area=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);
  function ring(raw){let r=raw.map(p=>p.slice());if(r[0][0]===r.at(-1)[0]&&r[0][1]===r.at(-1)[1])r.pop();for(let i=r.length-1;i>=0&&r.length>4;i--){const a=r[(i+r.length-1)%r.length],p=r[i],c=r[(i+1)%r.length];if(Math.abs((c[0]-a[0])*(p[1]-a[1])-(c[1]-a[1])*(p[0]-a[0]))/Math.hypot(c[0]-a[0],c[1]-a[1])<.09)r.splice(i,1);}return area(r)>0?r:r.reverse();}
  const face=(m,p)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex([0,1,2,0,2,3]);put(g,m);};
  const cap=(m,r,y)=>put(new THREE.ShapeGeometry(new THREE.Shape(r.map(([u,v])=>new THREE.Vector2(u,-v)))).rotateX(-Math.PI/2).translate(0,y,0),m);
  function shell(m,raw,y0,y1,close=true){const r=ring(raw);for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length];face(m,[[a[0],y0,a[1]],[a[0],y1,a[1]],[c[0],y1,c[1]],[c[0],y0,c[1]]]);}if(close)cap(m,r,y1);}
  function loft(m,raw,top,y0,y1){let r=raw,t=top;if(area(r)<0){r=r.slice().reverse();t=t.slice().reverse();}for(let i=0;i<r.length;i++){const j=(i+1)%r.length;face(m,[[r[i][0],y0,r[i][1]],[t[i][0],y1,t[i][1]],[t[j][0],y1,t[j][1]],[r[j][0],y0,r[j][1]]]);}cap(m,t,y1);}
  const wall=(g,u,y,v,a=0)=>g.rotateY(a).translate(u,y,v);
  function arch(w,h){const r=w/2;return new THREE.Shape([[-r,0],[r,0],[r,h-w*.65],[r*.65,h-w*.25],[0,h],[-r*.65,h-w*.25],[-r,h-w*.65]].map(p=>new THREE.Vector2(...p)));}
  const shape=s=>new THREE.ShapeGeometry(s,near?5:2);
  function rim(u,y,v,w,h,a,t=.20){const s=arch(w+2*t,h+t);s.holes.push(new THREE.Path(arch(w,h).getPoints()));put(wall(shape(s).translate(0,0,.34),u,y,v,a),'trim');}
  function window(u,y,v,w,h,a=0,frame=near){put(wall(shape(arch(w,h)).translate(0,0,.20),u,y,v,a),'glass');if(frame){rim(u,y,v,w,h,a);put(wall(new THREE.PlaneGeometry(.10,h-.35).translate(0,h/2,.36),u,y,v,a),'trim');if(h>3.2)put(wall(new THREE.PlaneGeometry(w,.12).translate(0,h*.42,.36),u,y,v,a),'trim');}}
  const cylinder=(m,u,v,y0,y1,r,n=near?10:6)=>put(new THREE.CylinderGeometry(r,r,y1-y0,n).translate(u,(y0+y1)/2,v),m);
  function pinnacle(u,v,y0,h,r=.4,mat='trim'){cylinder(mat,u,v,y0,y0+h*.55,r,near?5:4);put(new THREE.ConeGeometry(r*1.18,h*.45,near?6:4).translate(u,y0+h*.775,v),mat);}
  function opening(u,v,w,top,a,ow,oh){const s=new THREE.Shape([[-w/2,0],[w/2,0],[w/2,top],[-w/2,top]].map(p=>new THREE.Vector2(...p)));s.holes.push(new THREE.Path(arch(ow,oh).getPoints(near?7:3).map(p=>new THREE.Vector2(p.x,p.y+1.5))));put(wall(new THREE.ExtrudeGeometry(s,{depth:.8,bevelEnabled:false,curveSegments:near?7:3}).translate(0,0,-.8),u,0,v,a),'stone');rim(u,1.5,v,ow,oh,a,.4);}
  return {put,ring,face,cap,shell,loft,wall,arch,shape,rim,window,cylinder,pinnacle,opening};
}
