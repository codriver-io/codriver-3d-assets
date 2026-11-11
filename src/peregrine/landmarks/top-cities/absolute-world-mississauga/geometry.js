import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './absolute-world-mississauga-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
function centroid(r){let area=0,x=0,z=0;for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],k=a[0]*c[1]-c[0]*a[1];area+=k;x+=(a[0]+c[0])*k;z+=(a[1]+c[1])*k;}return[x/(3*area),z/(3*area)];}
// Mapped retail strip is modelled because the twisting balconies overhang its frontage.
solid(LOCAL_RINGS[2],0,9.1,'stone','roof',{bottom:.6,top:8.8,dy:3.5,h:2.7,pitch:near?3.2:6,ratio:.74});
function tower(r,height,bodyHeight,floors,rx,rz,total,initial,variable){
 const [x,z]=centroid(r),n=near?32:16,step=near?1:2,weights=Array.from({length:floors},(_,i)=>variable?1+7*Math.exp(-Math.pow(((i+.5)/floors-.52)/.23,2)):1),sum=weights.reduce((a,b)=>a+b,0),angles=[initial];
 for(const w of weights)angles.push(angles.at(-1)+total*Math.PI/180*w/sum);
 function ring(y,k,setback=0){const a=angles[k],v=Array.from({length:n},(_,j)=>{const b=2*Math.PI*j/n,u=Math.cos(b)*(rx-setback),v=Math.sin(b)*(rz-setback);return[x+u*Math.cos(a)-v*Math.sin(a),y,z+u*Math.sin(a)+v*Math.cos(a)]});return v;}
 function surface(a,c,mat){for(let i=0;i<n;i++){const j=(i+1)%n,p=[a[i],a[j],c[j],c[i]],out=[p.reduce((s,p)=>s+p[0]/4,0)-x,0,p.reduce((s,p)=>s+p[2]/4,0)-z];face(mat,p,out);}}
 function end(r,mat,up){cap(mat,r.map(p=>[p[0],p[2]]),r[0][1],up);}
 const dy=bodyHeight/floors,core=[];for(let k=0;k<=floors;k+=step)core.push(ring(k*dy,k,1.6));if(core.at(-1)[0][1]<bodyHeight-.01)core.push(ring(bodyHeight,floors,1.6));
 for(let i=0;i<core.length-1;i++)surface(core[i],core[i+1],'glass');end(core[0],'glass',-1);end(core.at(-1),'roof',1);
 for(let k=0;k<floors;k+=step){const bottom=k*dy,top=bottom+(near?.38:.62),a=ring(bottom,k),c=ring(top,k);surface(a,c,'balcony');end(a,'balcony',-1);end(c,'balcony',1);}
 // Open roof crown, not a flat slab: slender posts meet two continuous annular rails.
 const nn=near?64:32,crownRing=(y,inset=0)=>Array.from({length:nn},(_,i)=>{const a=2*Math.PI*i/nn,q=angles.at(-1),u=Math.cos(a)*(rx-inset),v=Math.sin(a)*(rz-inset);return[x+u*Math.cos(q)-v*Math.sin(q),y,z+u*Math.sin(q)+v*Math.cos(q)];});
 function rail(y){const o=crownRing(y),O=crownRing(y+.16),a=crownRing(y,.22),A=crownRing(y+.16,.22);for(let i=0;i<nn;i++){const j=(i+1)%nn,out=[(o[i][0]+o[j][0])/2-x,0,(o[i][2]+o[j][2])/2-z];face('crown',[o[i],o[j],O[j],O[i]],out);face('crown',[a[i],A[i],A[j],a[j]],out.map(v=>-v));face('crown',[O[i],O[j],A[j],A[i]],[0,1,0]);face('crown',[o[i],a[i],a[j],o[j]],[0,-1,0]);}}
 rail(bodyHeight);rail(height-.16);
 const posts=crownRing(0,.11),bottom=bodyHeight+.16,top=height-.16;for(const p of posts)box('frame',[p[0],(bottom+top)/2,p[2]],[.1,top-bottom,.1]);

}
// Two independent control-point alignments from each mapped outline; rotation is baked here.
const s=LOCAL_RINGS[0],n=LOCAL_RINGS[1],south=-Math.atan2(s[0][0]-s[11][0],s[0][1]-s[11][1]),north=-Math.atan2(n[21][0]-n[9][0],n[21][1]-n[9][1]);
tower(s,179.5,175.6,56,15.1,20.7,209,south,true);tower(n,161.2,157.9,50,14.3,19.2,80,north,false);
return finish();

}
