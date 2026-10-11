import * as THREE from 'three';
// Original small surface kit: rings in horizontal u/v; wall surfaces face local +Z.
export function kit(b,near) {
  const n=near?6:4;
  const put=(g,m)=>{g.computeVertexNormals();b.put(g,m);};
  const area=r=>r.reduce((a,p,i)=>{const q=r[(i+1)%r.length];return a+p[0]*q[1]-q[0]*p[1];},0)/2;
  const ring=raw=>{let r=raw.slice();let changed=true;while(changed&&r.length>4){changed=false;for(let i=0;i<r.length;i++){let a=r[(i+r.length-1)%r.length],p=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],d=Math.abs(dx*(a[1]-p[1])-(a[0]-p[0])*dz)/Math.hypot(dx,dz);if(d<(near?.07:.22)){r.splice(i,1);changed=true;break;}}}return area(r)>0?r:r.reverse();};
  const face=(m,pts)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);put(g,m);};
  const cap=(m,r,y,down=false)=>{const sh=new THREE.Shape(r.map(([u,v])=>new THREE.Vector2(u,-v))),g=new THREE.ShapeGeometry(sh).rotateX(-Math.PI/2).translate(0,y,0);if(down){const ix=g.index.array;for(let i=0;i<ix.length;i+=3){const t=ix[i+1];ix[i+1]=ix[i+2];ix[i+2]=t;}}put(g,m);};
  function shell(m,r,y0,y1,omit=()=>false) {r=ring(r);for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length];if(omit(a,c))continue;face(m,[[a[0],y0,a[1]],[a[0],y1,a[1]],[c[0],y1,c[1]],[c[0],y0,c[1]]]);}cap(m,r,y1);}
  function loft(m,r,t,y0,y1) {if(area(r)<0){r=r.slice().reverse();t=t.slice().reverse();}for(let i=0;i<r.length;i++){let j=(i+1)%r.length;face(m,[[r[i][0],y0,r[i][1]],[t[i][0],y1,t[i][1]],[t[j][0],y1,t[j][1]],[r[j][0],y0,r[j][1]]]);}cap(m,t,y1);}
  const cylinder=(m,u,v,y0,y1,r,seg=near?12:6)=>put(new THREE.CylinderGeometry(r,r,y1-y0,seg).translate(u,(y0+y1)/2,v),m);
  const wall=(g,u,y,v,angle)=>g.rotateY(angle).translate(u,y,v);
  function arch(w,h,segments=n) {const r=w/2,sh=new THREE.Shape();sh.moveTo(-r,0);sh.lineTo(r,0);sh.lineTo(r,h-r);for(let i=1;i<=segments;i++){const a=i*Math.PI/segments;sh.lineTo(r*Math.cos(a),h-r+r*Math.sin(a));}sh.closePath();return sh;}
  function archRim(u,y,v,w,h,angle,t=.28,mat='trim') {const sh=arch(w+t*2,h+t);sh.holes.push(new THREE.Path(arch(w,h).getPoints()));put(wall(new THREE.ShapeGeometry(sh).translate(0,0,.22),u,y,v,angle),mat);}
  function window(u,y,v,w,h,angle,arched=true) {
    const sh=arched?arch(w,h,near?6:3):new THREE.Shape([[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]].map(p=>new THREE.Vector2(...p)));
    put(wall(new THREE.ShapeGeometry(sh).translate(0,0,.08),u,y,v,angle),'glass');
    if(near){
      if(arched)archRim(u,y,v,w,h,angle,.20);
      else {const border=new THREE.Shape([[-w/2-.18,-.18],[w/2+.18,-.18],[w/2+.18,h+.18],[-w/2-.18,h+.18]].map(p=>new THREE.Vector2(...p)));border.holes.push(new THREE.Path(sh.getPoints()));put(wall(new THREE.ShapeGeometry(border).translate(0,0,.23),u,y,v,angle),'trim');}
      put(wall(new THREE.PlaneGeometry(w+.42,.22).translate(0,-.12,.23),u,y,v,angle),'trim');
      put(wall(new THREE.PlaneGeometry(.09,h-.2).translate(0,h/2,.24),u,y,v,angle),'trim');
      if(h>2.5)put(wall(new THREE.PlaneGeometry(w,.1).translate(0,h*.42,.24),u,y,v,angle),'trim');
    }
  }
  function dome(u,v,base,r,h,main=false) {const seg=main?(near?24:16):(near?12:6);const steps=near?6:2;const pts=[new THREE.Vector2(r,0),new THREE.Vector2(r+.08,.22)];for(let i=1;i<=steps;i++){let a=i*Math.PI/2/steps;pts.push(new THREE.Vector2(Math.max(0,r*Math.cos(a)),.22+(h-.22)*Math.sin(a)));}pts.at(-1).x=0;const dg=new THREE.LatheGeometry(pts,seg);if(main){const p=dg.attributes.position;for(let i=0;i<p.count;i++){const a=Math.atan2(p.getX(i),p.getZ(i)),q=((a+Math.PI/8)%(Math.PI/4)+Math.PI/4)%(Math.PI/4)-Math.PI/8,f=Math.cos(Math.PI/8)/Math.cos(q);p.setX(i,p.getX(i)*f);p.setZ(i,p.getZ(i)*f);}}put(dg.translate(u,base,v),'copper');cylinder('trim',u,v,base-.24,base+.15,r+.12,seg);const ribs=main?8:0;for(let i=0;i<ribs;i++){const a=i*2*Math.PI/ribs;for(let j=0;j<(near?8:3);j++){let a0=j*Math.PI/2/(near?8:3),a1=(j+1)*Math.PI/2/(near?8:3);let p=t=>[u+(r*Math.cos(t)+.07)*Math.sin(a),base+.24+(h-.22)*Math.sin(t),v+(r*Math.cos(t)+.07)*Math.cos(a)];if(near)b.bar('copper',p(a0),p(a1),.12);if(main){const q=t=>{let v=p(t);v[0]+=.14*Math.sin(a);v[2]+=.14*Math.cos(a);v[1]+=.06;return v;};b.bar('light',q(a0),q(a1),near?.08:.12);}}}}
  function openingWall(u,v,width,top,angle,openings) {const sh=new THREE.Shape([[-width/2,0],[width/2,0],[width/2,top],[-width/2,top]].map(p=>new THREE.Vector2(...p)));for(const [x,y,w,h]of openings)sh.holes.push(new THREE.Path(arch(w,h).getPoints().map(p=>new THREE.Vector2(p.x+x,p.y+y))));put(wall(new THREE.ExtrudeGeometry(sh,{depth:.65,bevelEnabled:false,curveSegments:n}).translate(0,0,-.65),u,0,v,angle),'stone');for(const [x,y,w,h]of openings){const dx=Math.cos(angle)*x,dz=-Math.sin(angle)*x;archRim(u+dx,y,v+dz,w,h,angle,.38);}}
  return {put,area,ring,face,cap,shell,loft,cylinder,wall,arch,archRim,window,dome,openingWall};
}
