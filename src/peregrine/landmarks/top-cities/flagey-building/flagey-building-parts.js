import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
// Closed procedural solids and tiled facades. Windows replace wall cells: no stacked skins.
export function parts(detail='near'){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),acc={};
 function face(mat,pts,out){if(pts.length<3)return;const a=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])),c=new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])),n=a.cross(c);if(n.lengthSq()<1e-12)return;const v=acc[mat]??={p:[],i:[]},k=v.p.length/3;v.p.push(...pts.flat());const rev=out&&n.dot(new THREE.Vector3(...out))<0;for(let j=1;j<pts.length-1;j++)v.i.push(...(rev?[k,k+j+1,k+j]:[k,k+j,k+j+1]));}
 const rect=(x,z,w,d)=>[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
 const ellipse=(x,z,rx,rz,n=near?48:32)=>Array.from({length:n},(_,i)=>[x+rx*Math.cos(i*2*Math.PI/n),z+rz*Math.sin(i*2*Math.PI/n)]);
 function cap(mat,ring,y,up=1){for(const tri of THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]))face(mat,tri.map(i=>[ring[i][0],y,ring[i][1]]),[0,up,0]);}
 function facade(mat,a,c,y0,y1,{cols=0,rows=0,glass='glass',fraction=.68,sill=.28}={}){
  const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),out=[dz,0,-dx],pt=(t,y)=>[a[0]+dx*t,y,a[1]+dz*t];
  const patch=(m,s,t,lo,hi)=>{if(t-s>1e-8&&hi-lo>1e-8)face(m,[pt(s,lo),pt(t,lo),pt(t,hi),pt(s,hi)],out);};
  if(!cols||!rows){patch(mat,0,1,y0,y1);return;}
  const nx=cols,ny=near?rows:Math.max(1,Math.ceil(rows*.45)),dy=(y1-y0)/ny;
  for(let j=0;j<ny;j++){const lo=y0+j*dy,hi=lo+dy,bot=lo+dy*sill/2,top=hi-dy*sill/2;patch(mat,0,1,lo,bot);patch(mat,0,1,top,hi);
   for(let i=0;i<nx;i++){const s=i/nx,t=(i+1)/nx,pad=(1-fraction)/nx/2;patch(mat,s,s+pad,bot,top);patch(glass,s+pad,t-pad,bot,top);patch(mat,t-pad,t,bot,top);}
  }
 }
 function prism(mat,ring,y0,y1,opts={}){let area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);if(area<0)ring=[...ring].reverse();ring.forEach((a,i)=>{const c=ring[(i+1)%ring.length];facade(mat,a,c,y0,y1,{...opts,cols:opts.pitch?Math.max(1,Math.round(Math.hypot(c[0]-a[0],c[1]-a[1])/opts.pitch)):opts.cols});});cap(opts.roof||mat,ring,y1);cap(mat,ring,y0,-1);}
 function block(mat,x,z,w,d,y0,y1,opts={}){prism(mat,rect(x,z,w,d),y0,y1,opts);}
 function loft(mat,rings,ys){for(let j=0;j<rings.length-1;j++){const A=rings[j],C=rings[j+1];for(let i=0;i<A.length;i++){let k=(i+1)%A.length;const cx=A.reduce((s,p)=>s+p[0],0)/A.length,cz=A.reduce((s,p)=>s+p[1],0)/A.length,mid=[(A[i][0]+A[k][0])/2-cx,0,(A[i][1]+A[k][1])/2-cz];face(mat,[[...A[i].slice(0,1),ys[j],A[i][1]],[A[k][0],ys[j],A[k][1]],[C[k][0],ys[j+1],C[k][1]],[C[i][0],ys[j+1],C[i][1]]],mid);}}cap(mat,rings[0],ys[0],-1);cap(mat,rings.at(-1),ys.at(-1));}
 function cylinder(mat,x,z,r,y0,y1,n=near?16:12,rTop=r){const g=new THREE.CylinderGeometry(rTop,r,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);b.put(g,mat);}
 function dome(mat,x,z,rx,rz,y0,h,n=near?32:24,steps=near?10:7){const rings=[],ys=[];for(let j=0;j<=steps;j++){const a=j/steps*Math.PI/2;const r=Math.max(.001,Math.cos(a));rings.push(ellipse(x,z,rx*r,rz*r,n));ys.push(y0+h*Math.sin(a));}loft(mat,rings,ys);}
 function gable(mat,x,z,w,d,y0,y1){const a=rect(x,z,w,d);face(mat,[[a[0][0],y0,a[0][1]],[x,y1,z-d/2],[a[1][0],y0,a[1][1]]],[0,0,-1]);face(mat,[[a[3][0],y0,a[3][1]],[x,y1,z+d/2],[a[2][0],y0,a[2][1]]],[0,0,1]);face(mat,[[a[0][0],y0,a[0][1]],[a[3][0],y0,a[3][1]],[x,y1,z+d/2],[x,y1,z-d/2]],[-1,1,0]);face(mat,[[a[1][0],y0,a[1][1]],[a[2][0],y0,a[2][1]],[x,y1,z+d/2],[x,y1,z-d/2]],[1,1,0]);cap(mat,a,y0,-1);}
 function skin(mat,ring,lo,hi,opts={}){
  const low=Array.isArray(lo)?lo:ring.map(()=>lo),high=Array.isArray(hi)?hi:ring.map(()=>hi),rows=near?(opts.rows||10):Math.max(1,Math.ceil((opts.rows||10)*.5));
  for(let k=0;k<ring.length;k++){const kn=(k+1)%ring.length,a=ring[k],c=ring[kn],len=Math.hypot(c[0]-a[0],c[1]-a[1]),out=[c[1]-a[1],0,a[0]-c[0]],cols=Math.max(1,Math.ceil(len/(opts.pitch||3)*(near?1:.6)));
   const pt=(u,v)=>[a[0]+(c[0]-a[0])*u,(low[k]+(low[kn]-low[k])*u)*(1-v)+(high[k]+(high[kn]-high[k])*u)*v,a[1]+(c[1]-a[1])*u];
   const patch=(m,s,t,y,z)=>{if(t>s&&z>y)face(m,[pt(s,y),pt(t,y),pt(t,z),pt(s,z)],out);};
   for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const u=i/cols,v=(i+1)/cols,y=j/rows,z=(j+1)/rows,pad=(1-(opts.fraction||.82))/(cols*2),sill=(opts.sill||.18)/(rows*2);patch(mat,u,v,y,y+sill);patch(mat,u,v,z-sill,z);patch(mat,u,u+pad,y+sill,z-sill);patch(opts.glass||'glass',u+pad,v-pad,y+sill,z-sill);patch(mat,v-pad,v,y+sill,z-sill);}
  }
  for(const[ys,up,m]of [[low,-1,mat],[high,1,opts.roof||mat]]){const center=[ring.reduce((s,p)=>s+p[0],0)/ring.length,ys.reduce((s,y)=>s+y,0)/ys.length,ring.reduce((s,p)=>s+p[1],0)/ring.length];for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length;face(m,[[ring[i][0],ys[i],ring[i][1]],[ring[j][0],ys[j],ring[j][1]],center],[0,up,0]);}}
 }
 function finish(){for(const [mat,v]of Object.entries(acc)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v.p,3));g.setIndex(v.i);g.computeVertexNormals();b.put(g,mat);}const root=b.finish(),angle=SPEC.rotation||0;root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(angle);o.geometry.deleteAttribute('bridgeLift');}});return root;}
 return {near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box:b.box,bar:b.bar,put:b.put,finish};
}
