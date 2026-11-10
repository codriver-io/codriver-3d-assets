import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {FOOTPRINTS} from './footprint.js';
const cos=Math.cos(SPEC.origin[1]*Math.PI/180);
const mapped=FOOTPRINTS[0].slice(0,-1).map(([x,z])=>[(x-SPEC.origin[0])*111320*cos,(SPEC.origin[1]-z)*111320]);
const bowl=[...mapped.slice(0,6),...mapped.slice(13,18),...mapped.slice(21,33)];
const annexes=[{ring:[...mapped.slice(17,22)],height:9.8},{ring:[...mapped.slice(32),mapped[0]],height:9.2},{ring:mapped.slice(5,14),height:8.5}];
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),acc={};
 function face(mat,pts,out){
  pts=pts.filter((p,i)=>p.some((v,j)=>Math.abs(v-pts[(i+pts.length-1)%pts.length][j])>1e-7));
  for(let repeat=0;repeat<3;repeat++)pts=pts.filter((p,i)=>{if(pts.length<4)return true;const a=new THREE.Vector3(...p).sub(new THREE.Vector3(...pts[(i+pts.length-1)%pts.length])),c=new THREE.Vector3(...pts[(i+1)%pts.length]).sub(new THREE.Vector3(...p));return a.cross(c).lengthSq()>1e-12;});
  if(pts.length<3)return;const f=acc[mat]??={p:[],i:[]},k=f.p.length/3;const n=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])).cross(new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])));if(n.lengthSq()<1e-12)return;f.p.push(...pts.flat());const rev=n.dot(new THREE.Vector3(...out))<0;for(let j=1;j<pts.length-1;j++)f.i.push(...(rev?[k,k+j+1,k+j]:[k,k+j,k+j+1]));}
 const signed=ring=>ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
 function wallFrame(a,c,ring){const len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,sign=Math.sign(signed(ring));return {a,c,len,ux,uz,out:[sign*uz,0,-sign*ux],point:(s,y)=>[a[0]+s*ux,y,a[1]+s*uz]};}
 function patch(mat,f,a,c,y,z){face(mat,[f.point(a,y),f.point(c,y),f.point(c,z),f.point(a,z)],f.out);}
 // Clip 2D tiles to an exact facade segment. All diamond and mortar faces adjoin in one plane.
 function clip(poly,axis,bound,greater){let out=[];for(let i=0;i<poly.length;i++){const A=poly[i],C=poly[(i+1)%poly.length],ia=greater?A[axis]>=bound:A[axis]<=bound,ic=greater?C[axis]>=bound:C[axis]<=bound;if(ia)out.push(A);if(ia!==ic){const t=(bound-A[axis])/(C[axis]-A[axis]);out.push([A[0]+t*(C[0]-A[0]),A[1]+t*(C[1]-A[1])]);}}return out;}
 function tile(mat,poly,f,y0,y1){for(const [axis,bound,g]of [[0,0,true],[0,f.len,false],[1,y0,true],[1,y1,false]]){poly=clip(poly,axis,bound,g);if(poly.length<3)return;}face(mat,poly.map(([s,y])=>f.point(s,y)),f.out);}
 let perimeter=0;
 bowl.forEach((a,i)=>{const c=bowl[(i+1)%bowl.length],f=wallFrame(a,c,bowl),attached=i===5||i===10||i===bowl.length-1;
  // Main bowl lower facade. Entrances retain separate small panes, not giant dark bands.
  if(!attached){const n=Math.max(1,Math.ceil(f.len/(near?5.5:8))),pitch=f.len/n;
   patch('stone',f,0,f.len,0,.7);
   for(let j=0;j<n;j++){const s=j*pitch,t=(j+1)*pitch,mid=(s+t)/2;
    const door=(i<5||i>15)&&j%3===1;
    if(door){patch('brick',f,s,s+.3,.7,5.5);patch('brick',f,t-.3,t,.7,5.5);patch('glass',f,s+.3,t-.3,.7,4.8);patch('stone',f,s+.3,t-.3,4.8,5.5);}else patch('brick',f,s,t,.7,5.5);
    patch('brick',f,s,t,5.5,7.2);
    const w=near?1.65:2.2;
    patch('brick',f,s,mid-w/2,7.2,9.4);patch('brick',f,mid+w/2,t,7.2,9.4);
    patch('mortar',f,mid-w/2,mid+w/2,7.2,7.38);patch('mortar',f,mid-w/2,mid+w/2,9.22,9.4);
    patch('mortar',f,mid-w/2,mid-w/2+.15,7.38,9.22);patch('mortar',f,mid+w/2-.15,mid+w/2,7.38,9.22);
    patch('glass',f,mid-w/2+.15,mid+w/2-.15,7.38,9.22);
   }
  }
  const y0=attached?(i===5?8.5:i===10?9.8:9.2):9.4,y1=25.6;
  // Recognizable diagonal masonry. Diamond tile centers alternate by a half pitch.
  const half=near?1.6:3.2,hy=near?1.45:2.9,inset=near?.065:.11;
  for(let row=-1;row<Math.ceil(26/hy)+1;row++){
   const cy=row*hy,shift=row%2?half:0;
   for(let col=Math.floor((perimeter-shift)/(2*half))-1;col<=Math.ceil((perimeter+f.len-shift)/(2*half))+1;col++){
    const cx=col*2*half+shift-perimeter,outer=[[cx-half,cy],[cx,cy-hy],[cx+half,cy],[cx,cy+hy]],inner=[[cx-half+inset,cy],[cx,cy-hy+inset],[cx+half-inset,cy],[cx,cy+hy-inset]];
    tile('brick',inner,f,y0,y1);
    for(let k=0;k<4;k++)tile('mortar',[outer[k],outer[(k+1)%4],inner[(k+1)%4],inner[k]],f,y0,y1);
   }
  }
  patch('stone',f,0,f.len,25.6,26);perimeter+=f.len;
 });
 // Main roof: shallow peaked metal membrane, not a flat black cap or a dome blob.
 const rim=[];for(let i=0;i<bowl.length;i++){const a=bowl[i],c=bowl[(i+1)%bowl.length],n=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/(near?3.2:6.4)));for(let j=0;j<n;j++)rim.push([a[0]+(c[0]-a[0])*j/n,a[1]+(c[1]-a[1])*j/n]);}
 const apex=[0,32.2,0];for(let i=0;i<rim.length;i++){const a=rim[i],c=rim[(i+1)%rim.length];face('roof',[[a[0],26,a[1]],[c[0],26,c[1]],apex],[0,1,0]);}
 // Entrance wings follow the current mapped additions exactly; roof heights estimated.
 annexes.forEach(({ring,height},n)=>{
  ring.forEach((a,j)=>{if(j===ring.length-1)return;const c=ring[(j+1)%ring.length],f=wallFrame(a,c,ring),count=Math.max(1,Math.ceil(f.len/(near?2.8:5.6))),pitch=f.len/count;
   for(let k=0;k<count;k++){const s=k*pitch,t=(k+1)*pitch,pad=near?.22:.35;
    patch('stone',f,s,t,0,.6);patch('stone',f,s,s+pad,.6,height-.5);patch('stone',f,t-pad,t,.6,height-.5);
    for(const [lo,hi]of [[.6,4.3],[4.6,height-.5]]){patch('frame',f,s+pad,t-pad,lo,lo+.1);patch('glass',f,s+pad,t-pad,lo+.1,hi-.1);patch('frame',f,s+pad,t-pad,hi-.1,hi);}
    patch('stone',f,s+pad,t-pad,4.3,4.6);patch('stone',f,s,t,height-.5,height);
   }
  });
  for(const tri of THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]))face('roof',tri.map(j=>[ring[j][0],height,ring[j][1]]),[0,1,0]);
 });
 // Small roof ventilation ridge equipment: seated on the actual slope, no floating objects.
 if(near)for(const x of [-5,0,5])b.box('seam',[x,32.25-Math.abs(x)*.09,0],[1.5,.55,1.1]);
 for(const [mat,f]of Object.entries(acc)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(f.p,3));g.setIndex(f.i);g.computeVertexNormals();b.put(g,mat);}
 const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return root;
}
