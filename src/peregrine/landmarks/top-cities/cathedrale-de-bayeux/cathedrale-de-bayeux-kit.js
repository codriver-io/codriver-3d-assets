import * as THREE from 'three';
export const THETA = -25.3 * Math.PI / 180;
export const toWorld = (u,y,v) => [u*Math.cos(THETA)+v*Math.sin(THETA), y, -u*Math.sin(THETA)+v*Math.cos(THETA)];
// Original facade profiles in XY, outward normal +Z, merged by material.
export function makeKit(b,near) {
 const seg=near?4:2;
 const put=(g,m)=>{g.computeVertexNormals();b.put(g,m);};
 const shape=p=>new THREE.Shape(p.map(v=>new THREE.Vector2(...v)));
 const place=(g,u,y,v,a)=>{g.rotateY(a);g.translate(u,y,v);return g;};
 function profile(w,h,round=false){
  const spring=h-(round?w/2:w*.866),p=[[-w/2,0],[w/2,0],[w/2,spring]];
  if(round)for(let i=1;i<=seg*2;i++){const a=i*Math.PI/(seg*2);p.push([Math.cos(a)*w/2,spring+Math.sin(a)*w/2]);}
  else {for(let i=1;i<=seg;i++){const a=Math.PI/3*i/seg;p.push([-w/2+w*Math.cos(a),spring+w*Math.sin(a)]);}for(let i=seg-1;i>=0;i--){const a=Math.PI/3*i/seg;p.push([w/2-w*Math.cos(a),spring+w*Math.sin(a)]);}}
  return p;
 }
 const k={near,
  box(m,u,y,v,w,h,d){
   const g=new THREE.BoxGeometry(w,h,d);
   if(y<.001){const p=g.attributes.position,ix=g.index,keep=[];for(let i=0;i<ix.count;i+=3){const a=ix.getX(i),c=ix.getX(i+1),e=ix.getX(i+2);if(p.getY(a)<-h/2+.001&&p.getY(c)<-h/2+.001&&p.getY(e)<-h/2+.001)continue;keep.push(a,c,e);}g.setIndex(keep);}
   g.translate(u,y+h/2,v);put(g,m);
  },
  bar(m,a,c,w,d=w){b.bar(m,a,c,w,d);},
  poly(m,pts,u,y,v,a=0,depth=0){const g=depth?new THREE.ExtrudeGeometry(shape(pts),{depth,bevelEnabled:false}):new THREE.ShapeGeometry(shape(pts));put(place(g,u,y,v,a),m);},
  ring(m,ri,ro,u,y,v,a=0){put(place(new THREE.RingGeometry(ri,ro,near?24:12),u,y,v,a),m);},
  disc(m,r,u,y,v,a=0){put(place(new THREE.CircleGeometry(r,near?24:12),u,y,v,a),m);},
  frame(w,h,t,u,y,v,a=0,round=false,deep=near&&w>4.6){const out=profile(w,h,round),ins=profile(w-2*t,h-t*.65,round).reverse();k.poly('trim',[...out,...ins],u,y,v,a,deep?.14:0);},
  window(w,h,u,y,v,a=0,{round=false,lit=false,rich=true}={}){
   k.poly(lit?'glow':'glass',profile(w,h,round),u,y,v,a);
   const n=new THREE.Vector3(Math.sin(a),0,Math.cos(a));
   k.frame(w+.42,h+.25,.25,u+n.x*.08,y-.05,v+n.z*.08,a,round);
   const p=(x,yy,o=.3)=>[u+Math.cos(a)*x+n.x*o,y+yy,v-Math.sin(a)*x+n.z*o];
   if(rich){for(const x of near?[-w*.24,0,w*.24]:[0])k.bar('trim',p(x,0),p(x,h-w*.8),.11,.12);
    if(near||w>7){k.bar('trim',p(-w*.43,h*.45),p(w*.43,h*.45),.1);for(const x of [-w*.22,w*.22])k.ring('trim',w*.1,w*.135,...p(x,h-w*.7,.32),a);k.ring('trim',w*.12,w*.155,...p(0,h-w*.37,.32),a);}
   }
  },
  loft(m,u,v,levels,n=8,phase=Math.PI/8){
   const p=[],idx=[];for(const [y,r] of levels)for(let i=0;i<n;i++){const a=phase+i*2*Math.PI/n;p.push(u+r*Math.cos(a),y,v+r*Math.sin(a));}
   for(let l=0;l<levels.length-1;l++)for(let i=0;i<n;i++){const j=(i+1)%n,a=l*n+i,c=l*n+j;idx.push(a,a+n,c,c,a+n,c+n);}
   for(let i=1;i<n-1;i++){idx.push(0,i,i+1);const t=(levels.length-1)*n;idx.push(t,t+i+1,t+i);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);put(g,m);
  },
  roof(u0,u1,v0,v1,eave,ridge){
   const g=new THREE.ExtrudeGeometry(shape([[-v0,eave],[-v1,eave],[-(v0+v1)/2,ridge]]),{depth:u1-u0,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(u0,0,0);put(g,'roof');
  },
  chapelRoof(cu,cv,a,r0,r1,w,eave,ridge){
   const g=new THREE.ExtrudeGeometry(shape([[w/2,eave],[-w/2,eave],[0,ridge]]),{depth:r1-r0,bevelEnabled:false});
   g.rotateY(Math.PI/2);g.translate(r0,0,0);g.rotateY(-a);g.translate(cu,0,cv);put(g,'roof');
  },
  flyer(a,c,width=.75){
   const dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz),n=near?8:4;
   const pts=[[0,a[1]+1.5],[L,c[1]+1.5]];
   for(let i=n;i>=0;i--){const t=i/n;pts.push([L*t,a[1]+(c[1]-a[1])*t+.9*Math.sin(Math.PI*t)]);}
   const g=new THREE.ExtrudeGeometry(shape(pts),{depth:width,bevelEnabled:false});
   g.rotateY(-Math.atan2(dz,dx));g.translate(a[0]+dz*width/(2*L),0,a[2]-dx*width/(2*L));put(g,'trim');
  },
  pinnacle(u,v,base,h=5,r=.52){k.loft('trim',u,v,[[base,r],[base+h*.45,r*.7],[base+h,.03]],near?6:4,Math.PI/4);},
 };
 return k;
}
