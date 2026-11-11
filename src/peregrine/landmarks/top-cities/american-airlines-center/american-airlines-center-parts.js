import * as THREE from 'three';
export function tools(b,near){
 const acc={};
 const face=(mat,pts,out)=>{if(pts.length<3)return;const n=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])).cross(new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])));if(n.lengthSq()<1e-12)return;const f=acc[mat]??={p:[],i:[]},k=f.p.length/3;f.p.push(...pts.flat());const rev=n.dot(new THREE.Vector3(...out))<0;for(let j=1;j<pts.length-1;j++)f.i.push(...(rev?[k,k+j+1,k+j]:[k,k+j,k+j+1]));};
 const rect=(w,d,x=0,z=0)=>[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
 const ellipse=(rx,rz,n=near?64:32,x=0,z=0)=>Array.from({length:n},(_,i)=>[x+rx*Math.cos(i*2*Math.PI/n),z+rz*Math.sin(i*2*Math.PI/n)]);
 const cap=(ring,y,mat,up=true,holes=[])=>{const rr=ring.map(p=>new THREE.Vector2(...p)),hh=holes.map(r=>r.map(p=>new THREE.Vector2(...p))),all=[...ring,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(rr,hh))face(mat,t.map(i=>[all[i][0],y,all[i][1]]),[0,up?1:-1,0]);};
 const signed=r=>r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0);
 function wall(a,c,y0,y1,mat,{floors=0,bays=0,glass='glass',margin=.23,base=0,skip=false}={},sign=1){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),out=[sign*dz,0,-sign*dx],point=(t,y)=>[a[0]+dx*t,y,a[1]+dz*t];const patch=(m,l,r,lo,hi)=>{if(r-l<=1e-6||hi-lo<=1e-6)return;const cuts=m==='brick'?[lo,...[21.1,21.65].filter(y=>y>lo&&y<hi),hi]:[lo,hi];for(let j=0;j<cuts.length-1;j++){const a=cuts[j],c=cuts[j+1],mat=m==='brick'&&(a+c)/2>=21.1&&(a+c)/2<=21.65?'stone':m;face(mat,[point(l,a),point(r,a),point(r,c),point(l,c)],out);}};
  if(!floors||len<3||skip){patch(mat,0,1,y0,y1);return;}const rows=Math.max(1,near?floors:Math.ceil(floors/2)),cols=Math.max(1,near?(bays||Math.round(len/4.2)):Math.ceil((bays||Math.round(len/4.2))/2)),bottom=y0+base;patch(mat,0,1,y0,bottom);const pitch=(y1-bottom)/rows;
  for(let i=0;i<rows;i++){const lo=bottom+i*pitch,hi=lo+pitch;patch(mat,0,1,lo,lo+pitch*margin);patch(mat,0,1,hi-pitch*margin,hi);for(let j=0;j<cols;j++){const l=j/cols,r=(j+1)/cols,m=margin/cols;patch(mat,l,l+m,lo+pitch*margin,hi-pitch*margin);patch(glass,l+m,r-m,lo+pitch*margin,hi-pitch*margin);patch(mat,r-m,r,lo+pitch*margin,hi-pitch*margin);}}
 }
 function prism(ring,y0,y1,mat,opts={}){const sign=Math.sign(signed(ring));ring.forEach((a,i)=>wall(a,ring[(i+1)%ring.length],y0,y1,mat,opts,sign));if(opts.top!==false)cap(ring,y1,opts.roof||mat);if(opts.bottom!==false)cap(ring,y0,mat,false);}
 function loft(rings,ys,mat,{caps=true}={}){for(let j=0;j<rings.length-1;j++){const a=rings[j],c=rings[j+1],sign=Math.sign(signed(a));for(let i=0;i<a.length;i++){const k=(i+1)%a.length,out=[sign*(a[k][1]-a[i][1]),0,-sign*(a[k][0]-a[i][0])];face(mat,[[a[i][0],ys[j],a[i][1]],[a[k][0],ys[j],a[k][1]],[c[k][0],ys[j+1],c[k][1]],[c[i][0],ys[j+1],c[i][1]]],out);}}if(caps){cap(rings[0],ys[0],mat,false);cap(rings.at(-1),ys.at(-1),mat);}}
 function cyl(mat,x,z,r,y0,y1,rTop=r,n=near?24:12){const g=new THREE.CylinderGeometry(rTop,r,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);b.put(g,mat);}
 function sphere(mat,x,y,z,r,sx=1,sy=1,sz=1){const g=new THREE.SphereGeometry(r,near?24:12,near?12:6);g.scale(sx,sy,sz);g.translate(x,y,z);b.put(g,mat);}
 function flush(angle=0,offset=[0,0]){for(const[mat,f]of Object.entries(acc)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(f.p,3));g.setIndex(f.i);g.computeVertexNormals();b.put(g,mat);}const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(angle);o.geometry.translate(offset[0],0,offset[1]);o.geometry.deleteAttribute('bridgeLift');}});return root;}
 return {face,rect,ellipse,cap,wall,prism,loft,cyl,sphere,flush};
}
