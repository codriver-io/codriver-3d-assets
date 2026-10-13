import * as THREE from 'three';
// OSM nave axis 20.17 degrees north of east; exported rotation applied once.
export const ANGLE=.352;
export const world=(x,y,z)=>[x*Math.cos(ANGLE)+z*Math.sin(ANGLE),y,-x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];
export function lancet(w,h,n){const a=[[-w/2,0],[w/2,0],[w/2,h-w*.85]];for(let i=1;i<=n;i++){const t=i/n;a.push([w/2*(1-t*t),h-w*.85+w*.85*t]);}for(let i=n-1;i>=0;i--){const t=i/n;a.push([-w/2*(1-t*t),h-w*.85+w*.85*t]);}return a;}
const shape=(p,T=THREE.Shape)=>new T(p.map(v=>new THREE.Vector2(...v)));
export function parts(b,near){
 const seg=near?4:1,ranges={},counts={};
 function put(g,mat='stone',name){g.computeVertexNormals();const count=g.index?g.index.count/3:g.attributes.position.count/3;if(name)ranges[name]={mat,start:counts[mat]||0,count};counts[mat]=(counts[mat]||0)+count;b.put(g,mat);}
 function box(mat,c,s,name){const g=new THREE.BoxGeometry(...s);g.translate(...c);put(g,mat,name);}
 function plane(g,f,a,y,d){if(f==='W')g.rotateY(-Math.PI/2);if(f==='E')g.rotateY(Math.PI/2);if(f==='N')g.rotateY(Math.PI);g.translate(...(f==='W'||f==='E'?[d,y,a]:[a,y,d]));return g;}
 const fp=(f,a,y,d)=>f==='W'||f==='E'?[d,y,a]:[a,y,d];
 function polygon(p,f,a,y,d,mat='stone',thick=.7,name){put(plane(new THREE.ExtrudeGeometry(shape(p),{depth:thick,bevelEnabled:false,curveSegments:1}),f,a,y,d),mat,name);}
 function wall(f,a,d,w,h,holes=[],y=0,name,pointed=false,material='stone'){
  const s=shape(pointed?lancet(w,h,seg):[[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]]),sign=f==='W'||f==='N'?-1:1;
  for(const o of holes){const n=near?24:8,p=o.circle?Array.from({length:n},(_,i)=>[Math.cos(i*Math.PI*2/n)*o.w/2,Math.sin(i*Math.PI*2/n)*o.w/2]):lancet(o.w,o.h,seg),pts=p.map(v=>[v[0]+(o.x||0),v[1]+o.y]);s.holes.push(shape(pts.slice().reverse(),THREE.Path));if(!o.open)put(plane(new THREE.ShapeGeometry(shape(pts)),f,a,y,d-sign*.6),o.mat||'glass');
   if(o.circle){
    // Closed petal/trefoil outlines, rather than a wheel of radial spokes.
    const r=o.w/2, petals=near?12:8, samples=near?18:8, verts=[];
    const tube=(points,radius)=>{
     for(let i=0;i<points.length;i++){
      const a=points[i],c=points[(i+1)%points.length],dx=c[0]-a[0],dy=c[1]-a[1],length=Math.hypot(dx,dy),nx=-dy/length*radius,ny=dx/length*radius;
      const q=[[a[0]+nx,a[1]+ny],[a[0]-nx,a[1]-ny],[c[0]-nx,c[1]-ny],[c[0]+nx,c[1]+ny]];
      // Tracery lies inside the actual aperture, so no facade overlay exists.
      for(const t of [[0,1,2],[0,2,3]])for(const j of t)verts.push(q[j][0],q[j][1],0);
     }
    };
    for(let j=0;j<petals;j++){
     const t=j*Math.PI*2/petals,points=[];
     for(let i=0;i<samples;i++){
      const a=i*Math.PI*2/samples,radial=r*(.60+.31*Math.cos(a)),tangent=r*.15*Math.sin(a)*(1+.23*Math.cos(3*a));
      points.push([radial*Math.cos(t)-tangent*Math.sin(t),radial*Math.sin(t)+tangent*Math.cos(t)]);
     }
     tube(points,near?.11:.16);
    }
    tube(Array.from({length:near?24:12},(_,i)=>{const t=i*Math.PI*2/(near?24:12),rad=r*(.20+.025*Math.cos(6*t));return [rad*Math.cos(t),rad*Math.sin(t)];}),near?.13:.17);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
    put(plane(g,f,a+(o.x||0),y+o.y,d-sign*.18));
   }
   else if(!o.open&&o.mat!=='recess'){const n=near&&o.w>3?3:1;for(let j=0;j<n;j++){const u=(j-(n-1)/2)*o.w/(n+1),top=o.h-o.w*.85*.24;box('stone',fp(f,a+(o.x||0)+u,y+o.y+top/2,d),f==='W'||f==='E'?[.35,top,.2]:[.2,top,.35]);}}
  }
  const g=new THREE.ExtrudeGeometry(s,{depth:.9,bevelEnabled:false,curveSegments:1});
  if(!near){
   // Rear caps face the enclosed interior. Retain every exterior face and
   // intrados, but avoid exporting invisible doubled walls in far detail.
   const n=g.attributes.normal,ix=[];
   for(let i=0;i<n.count;i+=3)if(n.getZ(i)>-.99)ix.push(i,i+1,i+2);
   g.setIndex(ix);
  }
  g.translate(0,0,-.9);put(plane(g,f,a,y,d),material,name);
 }
 function roof(x0,x1,z0,z1,e,r,across=false){const s=shape([[-z0,e],[-z1,e],[-(z0+z1)/2,r]]);const g=new THREE.ExtrudeGeometry(s,{depth:x1-x0,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(x0,0,0);if(across){g.rotateY(-Math.PI/2);g.scale(-1,1,1);const p=g.attributes.position;for(let i=0;i<p.count;i+=3){const a=[p.getX(i+1),p.getY(i+1),p.getZ(i+1)],c=[p.getX(i+2),p.getY(i+2),p.getZ(i+2)];p.setXYZ(i+1,...c);p.setXYZ(i+2,...a);}g.computeVertexNormals();}put(g,'roof');}
 function pin(x,z,base,tip,r=.6){if(!near){const g=new THREE.ConeGeometry(r,tip-base,4);g.rotateY(Math.PI/4);g.translate(x,(base+tip)/2,z);put(g);return;}box('stone',[x,base+(tip-base)*.25,z],[r*1.2,(tip-base)*.5,r*1.2]);const g=new THREE.ConeGeometry(r,(tip-base)*.5,4);g.rotateY(Math.PI/4);g.translate(x,base+(tip-base)*.75,z);put(g);if(near)for(let j=1;j<4;j++)for(const s of [-1,1])box('stone',[x+s*r*.5,base+(tip-base)*(.4+j*.13),z],[r*.45,.55,r*.45]);}
 return {put,box,plane,wall,roof,pin,polygon,fp,ranges};
}
