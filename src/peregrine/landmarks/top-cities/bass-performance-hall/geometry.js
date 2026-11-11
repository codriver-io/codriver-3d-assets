import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './bass-performance-hall-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,ellipse,prism,wall,cap,loft,cyl,sphere,face,flush}=t;
 const x0=-22.7,x1=22.7,zf=-30.6,zb=30.6;
 // Rear wings and fly tower; corner portals remain outside the central upper core.
 prism(rect(60.3,44,0,8.6),0,27.5,'stone',{floors:4,margin:.32,trim:'metal',bottom:false});prism(rect(32,28,0,16),27.5,31.5,'stone',{roof:'roof',bottom:false});
 const core=rect(45.4,61.2,0,0);for(let i=1;i<4;i++)wall(core[i],core[(i+1)%4],i===2?27.5:0,29.5,'stone',i===2?{}:{floors:4,margin:.32,trim:'metal'});cap(core,29.5,'roof');
 const a=[x0,zf],c=[x1,zf];wall(c,a,0,12,'stone',{floors:1,bays:9,margin:.27,base:.5},-1);
 const outline=[[x0,12],[x1,12],[x1,29.5],[x0,29.5]],arches=[];
 for(let k=0;k<5;k++){const cx=-13.2+k*6.6,r=1.8,poly=[[cx-r,13],[cx+r,13]];for(let i=0;i<=(near?16:8);i++){const a=Math.PI*i/(near?16:8);poly.push([cx+r*Math.cos(a),22.8+r*Math.sin(a)]);}arches.push(poly);}
 const all=[...outline,...arches.flat()];for(const ids of THREE.ShapeUtils.triangulateShape(outline.map(p=>new THREE.Vector2(...p)),arches.map(r=>r.map(p=>new THREE.Vector2(...p)))))face('stone',ids.map(i=>[all[i][0],all[i][1],zf]),[0,0,-1]);
 function clip(poly,axis,v,g){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ia=g?a[axis]>=v:a[axis]<=v,ic=g?c[axis]>=v:c[axis]<=v;if(ia)out.push(a);if(ia!==ic){const t=(v-a[axis])/(c[axis]-a[axis]);out.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t]);}}return out;}
 for(const poly of arches){const left=Math.min(...poly.map(p=>p[0])),cols=near?4:2,rows=near?8:4,dx=3.6/cols,dy=11.6/rows;
  const patch=(mat,l,r,b,t)=>{let p=poly;for(const[axis,v,g]of [[0,l,true],[0,r,false],[1,b,true],[1,t,false]])p=clip(p,axis,v,g);if(p.length>=3)face(mat,p.map(([x,y])=>[x,y,zf]),[0,0,-1]);};
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const l=left+i*dx,r=l+dx,b=13+j*dy,t=b+dy,m=.06;patch('metal',l,r,b,b+m);patch('metal',l,r,t-m,t);patch('metal',l,l+m,b+m,t-m);patch('metal',r-m,r,b+m,t-m);patch('glass',l+m,r-m,b+m,t-m);}
 }
 // Two layered corner entrance rotundas, kept low beneath the grand facade cornice.
 for(const x of[-25,25]){{const r=ellipse(6.2,6.2,near?32:16,x,-20.1);r.forEach((a,i)=>wall(a,r[(i+1)%r.length],0,18.6,'stone',(near?i%4<2:i%2===0)?{floors:2,bays:1,margin:.18,base:.5,trim:'metal'}:{}));}const rings=[],ys=[];for(let i=0;i<=6;i++){const a=i*Math.PI/12;rings.push(ellipse(Math.max(.1,6.2*Math.cos(a)),Math.max(.1,6.2*Math.cos(a)),near?32:16,x,-20.1));ys.push(18.6+3.4*Math.sin(a));}loft(rings,ys,'roof',{caps:false});prism(ellipse(2.7,2.7,near?24:12,x,-20.1),21.5,24.3,'stone',{floors:1,margin:.15,bottom:false});const rr=[],yy=[];for(let i=0;i<=5;i++){const a=i*Math.PI/10;rr.push(ellipse(Math.max(.06,2.7*Math.cos(a)),Math.max(.06,2.7*Math.cos(a)),near?24:12,x,-20.1));yy.push(24.3+1.8*Math.sin(a));}loft(rr,yy,'roof',{caps:false});}
 // Original low-relief anatomy: closed broad wings, continuous drapery and
 // tapered sleeves. The sculpture shares its pedestal and facade contacts.
 function wing(profile,z,thickness){
  const triangles=THREE.ShapeUtils.triangulateShape(profile.map(p=>new THREE.Vector2(...p)),[]);
  for(const sign of[-1,1])for(const ids of triangles)face('sculpture',ids.map(i=>[profile[i][0],profile[i][1],z+sign*thickness/2]),[0,0,sign]);
  profile.forEach((a,i)=>{const c=profile[(i+1)%profile.length],signed=profile.reduce((v,p,j)=>v+p[0]*profile[(j+1)%profile.length][1]-profile[(j+1)%profile.length][0]*p[1],0),k=Math.sign(signed);face('sculpture',[[a[0],a[1],z-thickness/2],[c[0],c[1],z-thickness/2],[c[0],c[1],z+thickness/2],[a[0],a[1],z+thickness/2]],[k*(c[1]-a[1]),k*(a[0]-c[0]),0]);});
 }
 function sleeve(a,c,r0,r1){const A=new THREE.Vector3(...a),C=new THREE.Vector3(...c),d=C.clone().sub(A),g=new THREE.CylinderGeometry(r1,r0,d.length(),near?14:8,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...A.add(C).multiplyScalar(.5).toArray());b.put(g,'sculpture');}
 const wingOutline=[[.2,15.4864],[1.15,16.2],[1.95,18.1],[2.45,20.4],[2.7432,23.1],[2.65,23.35],[2.4,22.8],[2.55,24],[2.37,24.15],[2.1,23.6],[2.15,24.6304],[1.9,24.58],[1.7,24.3],[1.5,24.15],[1.3,23.8],[.95,23],[.55,21.5],[.15,20.6]];
 for(const x of[-18.7,18.7]){
  b.box('sculpture',[x,9.6,zf-.7],[4.2,.8,2.6]);
  const ys=[10,10.5,12.2,14.4,16.3,18.2,19.2,20.6,21.55],widths=[1.65,1.95,1.4,1.2,1.05,.72,.85,1.12,.72],offset=[.12,-.12,.18,.4,.15,-.05,-.2,0,0],depth=[.65,.8,.75,.7,.72,.7,.78,.85,.6];
  const rings=ys.map((y,j)=>{const n=near?32:20;return Array.from({length:n},(_,i)=>{const a=i*2*Math.PI/n,fold=1+.105*Math.cos(8*a+j*.4);return[x+offset[j]+widths[j]*Math.cos(a)*fold,zf-1.8+depth[j]*Math.sin(a)*fold];});});loft(rings,ys,'sculpture');
  // Neck intersects the shoulder and head, with a forward face and swept hair.
  cyl('sculpture',x,zf-1.8,.42,21.3,22.4,.38,near?16:10);sphere('sculpture',x,22.95,zf-1.9,.73,.92,1.18,.91);sphere('sculpture',x,22.86,zf-2.52,.22,.75,1,1.1);
  for(const side of[-1,1]){
   wing(wingOutline.map(([u,y])=>[x+side*u,y]),zf-.55,1.2);
   // Broad overlapping flight feathers emerge from each solid wing, rather
   // than detached rods: pointed profiles and scalloped tips survive far.
   const feathers=near?8:5;
   for(let k=0;k<feathers;k++){const q=k/(feathers-1),A=[.35+q*.1,16.2+q*4.1],C=[2.5-q*.75,23.05+q*1.2],dx=C[0]-A[0],dy=C[1]-A[1],len=Math.hypot(dx,dy),poly=[],segments=near?8:5;
    for(const sign of[-1,1])for(let j=0;j<=segments;j++){const f=sign===1?j/segments:1-j/segments,w=Math.sin(Math.PI*f)*(.19+.07*q),u=A[0]+dx*f+sign*dy/len*w,y=A[1]+dy*f-sign*dx/len*w;poly.push([x+side*u,y]);}wing(poly,zf-1.1,.45);
   }
   const shoulder=[x+side*.8,21.15,zf-1.8],elbow=[x+side*1.15,21.45,zf-2.7],hand=[x+side*.22,22.75,zf-2.7];
   sphere('sculpture',...shoulder,.65);sleeve(shoulder,elbow,.64,.57);sphere('sculpture',...elbow,.56);sleeve(elbow,hand,.5,.23);sphere('sculpture',...hand,.29);
   // A hanging sleeve fold returns into the torso rather than ending in air.
   sleeve([x+side*.72,19.7,zf-1.8],elbow,.64,.44);
  }
  // Published 13 ft instrument enters the mouth and both supporting hands.
  b.bar('gold',[x,22.85,zf-1.9],[x,22.85,zf-5.3],.11,.11,0,true);
  const length=.5624,g=new THREE.CylinderGeometry(.55,.11,length,near?16:10,1,true);g.rotateX(-Math.PI/2);g.translate(x,22.85,zf-5.3-length/2);b.put(g,'gold');const inner=new THREE.CylinderGeometry(.46,.07,length,near?16:10,1,true);const idx=inner.index;for(let j=0;j<idx.count;j+=3){const v=idx.getX(j+1);idx.setX(j+1,idx.getX(j+2));idx.setX(j+2,v);}inner.computeVertexNormals();inner.rotateX(-Math.PI/2);inner.translate(x,22.85,zf-5.3-length/2);b.put(inner,'gold');
 }
 b.box('stone',[0,28.9,zf-.15],[46.4,1.2,.8]);
 return flush(0.5113814708343386);
}
