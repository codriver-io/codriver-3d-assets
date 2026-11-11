import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
// Facades are adjoining partitions, never pasted panes on opaque walls.
export function builder(SPEC, PALETTES, detail) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), batches={};
 function face(mat,p,out){
  p=p.filter((v,i)=>v.some((x,j)=>Math.abs(x-p[(i+p.length-1)%p.length][j])>1e-6));if(p.length<3)return;
  const a=new THREE.Vector3(...p[1]).sub(new THREE.Vector3(...p[0])),c=new THREE.Vector3(...p[2]).sub(new THREE.Vector3(...p[0]));const n=a.cross(c);if(n.lengthSq()<1e-10)return;
  const rev=out&&n.dot(new THREE.Vector3(...out))<0, acc=batches[mat]??={p:[],i:[]},k=acc.p.length/3;acc.p.push(...p.flat());for(let j=1;j<p.length-1;j++)acc.i.push(...(rev?[k,k+j+1,k+j]:[k,k+j,k+j+1]));
 }
 const area=r=>r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0);
 function cap(mat,r,y,up=1){const p=r.map(v=>new THREE.Vector2(...v));for(const t of THREE.ShapeUtils.triangulateShape(p,[]))face(mat,t.map(j=>[r[j][0],y,r[j][1]]),[0,up,0]);}
 function frame(r,i){const a=r[i],c=r[(i+1)%r.length],l=Math.hypot(c[0]-a[0],c[1]-a[1]),dx=(c[0]-a[0])/l,dz=(c[1]-a[1])/l,s=Math.sign(area(r));return {l,p:(u,y)=>[a[0]+u*dx,y,a[1]+u*dz],out:[s*dz,0,-s*dx]};}
 function patch(mat,f,a,c,y,z){if(c-a<1e-6||z-y<1e-6)return;face(mat,[f.p(a,y),f.p(c,y),f.p(c,z),f.p(a,z)],f.out);}
 function walls(r,lo,hi,mat='stone',rows=[],pitch=4,pane='glass',fill=.68){r.forEach((a,i)=>{const f=frame(r,i),n=Math.max(1,Math.round(f.l/pitch)),step=f.l/n;let base=lo;for(const [low,high]of rows.filter(([l,h])=>l>=lo&&h<=hi)){patch(mat,f,0,f.l,base,low);for(let j=0;j<n;j++){const pad=step*(1-fill);patch(mat,f,j*step,j*step+pad,low,high);patch(pane,f,j*step+pad,(j+1)*step,low,high);}base=high;}patch(mat,f,0,f.l,base,hi);});}
 function prism(r,lo,hi,mat='stone',roof='roof',rows=[],pitch=4,pane='glass',fill=.68){walls(r,lo,hi,mat,rows,pitch,pane,fill);cap(roof,r,hi);if(lo>0)cap(mat,r,lo,-1);}
 const rect=(x,z,w,d)=>[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
 const block=(x,z,w,d,lo,hi,mat='stone',roof='roof',rows=[],pitch=4,pane='glass',fill=.68)=>prism(rect(x,z,w,d),lo,hi,mat,roof,rows,pitch,pane,fill);
 function spin(profile,mat='stone',x=0,z=0,n=near?32:20,segments){for(let k=0;k<profile.length-1;k++){const [ra,ya]=profile[k],[rc,yc]=profile[k+1];for(let j=0;j<n;j++){const a=j*Math.PI*2/n,c=(j+1)*Math.PI*2/n,m=segments?.(k,j)||mat;const p=[[x+ra*Math.cos(a),ya,z+ra*Math.sin(a)],[x+rc*Math.cos(a),yc,z+rc*Math.sin(a)],[x+rc*Math.cos(c),yc,z+rc*Math.sin(c)],[x+ra*Math.cos(c),ya,z+ra*Math.sin(c)]];face(m,p,[Math.cos((a+c)/2),Math.sign(rc-ra)*-0.2,Math.sin((a+c)/2)]);}}const [r0,y0]=profile[0],[r1,y1]=profile.at(-1);if(r0>0)cap(mat,Array.from({length:n},(_,j)=>[x+r0*Math.cos(j*2*Math.PI/n),z+r0*Math.sin(j*2*Math.PI/n)]),y0,-1);if(r1>0)cap(mat,Array.from({length:n},(_,j)=>[x+r1*Math.cos(j*2*Math.PI/n),z+r1*Math.sin(j*2*Math.PI/n)]),y1);}
 function cyl(x,z,r,lo,hi,mat='stone',n=near?24:16){spin([[r,lo],[r,hi]],mat,x,z,n);}
 function hip(x,z,w,d,lo,hi,mat='roof',ridge=.6){const r=rect(x,z,w,d),t=rect(x,z,w*ridge,.1);for(let i=0;i<4;i++)face(mat,[[...r[i].slice(0,1),lo,r[i][1]],[t[i][0],hi,t[i][1]],[t[(i+1)%4][0],hi,t[(i+1)%4][1]],[r[(i+1)%4][0],lo,r[(i+1)%4][1]]],[0,1,0]);if(lo>0)cap(mat,r,lo,-1);}
 const rows=(lo,hi,pitch,h)=>Array.from({length:Math.ceil((hi-lo)/pitch)},(_,i)=>[lo+i*pitch,Math.min(hi,lo+i*pitch+h)]);
 function finish(){for(const [mat,a]of Object.entries(batches)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setIndex(a.i);g.computeVertexNormals();b.put(g,mat);}const root=b.finish();for(const m of root.children){m.geometry.rotateY(SPEC.rotationY||0);m.geometry.deleteAttribute('bridgeLift');}return root;}
 return {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish};
}
