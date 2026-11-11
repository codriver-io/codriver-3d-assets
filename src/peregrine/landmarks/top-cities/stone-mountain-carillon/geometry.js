import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './stone-mountain-carillon-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{prism,flush}=t,ring=[[-5.831497539009319,-5.446829597876037],[-5.702456556847172,2.714969139432604],[-1.0796651069820222,9.442629165535767],[6.075259397123201,4.939021449366727],[9.211826953622017,-0.7477333334912919],[3.1569450320998125,-5.4525438085505264]];prism(ring,0,.15,'stone');
 const feet=[[-4.9,-4.9],[7.4,-.3],[-1,7.6]],top=feet.map(p=>p.map(v=>v*.78)),H=35.6616;
 for(let i=0;i<3;i++)b.bar('steel',[...feet[i].slice(0,1),.15,feet[i][1]],[top[i][0],H,top[i][1]],.85,.60);
 // Open triangular rings and X bracing connect each support; no central solid slab.
 for(const y of[6,22.5,26.5,30.5,34.9])for(let i=0;i<3;i++){const j=(i+1)%3,f=y/H,A=feet[i].map((v,k)=>v+(top[i][k]-v)*f),C=feet[j].map((v,k)=>v+(top[j][k]-v)*f);b.bar('dark',[A[0],y,A[1]],[C[0],y,C[1]],y===22.5?.35:.20);}
 for(let i=0;i<3;i++){const j=(i+1)%3,A=top[i],C=top[j],dx=C[0]-A[0],dz=C[1]-A[1],L=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx),n=20;
 // Individual planks preserve daylight gaps in both LODs, rather than a dark opaque proxy.
 for(let k=0;k<n;k++){const f=(k+.5)/n,x=A[0]+dx*f,z=A[1]+dz*f;b.box('wood',[x,(22.5+H)/2,z],[.17,H-22.5,.65],angle);
 const bottom=7+14*(i*n+k)/(3*n-1);b.box('wood',[x,(bottom+22.5)/2,z],[.17,22.5-bottom,.65],angle);}
 // The sloping girt follows the suspended bottom edge and meets the full-height corner posts.
 const y0=8.3+14*i/3,y1=8.3+14*(i+1)/3;b.bar('dark',[A[0],y0,A[1]],[C[0],y1,C[1]],.22);
 for(const y of[24,28,32]){const mid=[(A[0]+C[0])/2*.8,(A[1]+C[1])/2*.8];b.box('dark',[mid[0],y,mid[1]],[1,.55,.65],angle);}
 if(near){b.bar('dark',[A[0],22.5,A[1]],[C[0],30.5,C[1]],.10);b.bar('dark',[C[0],22.5,C[1]],[A[0],30.5,A[1]],.10);}}
 return flush(-0.3089232776029963);
}
