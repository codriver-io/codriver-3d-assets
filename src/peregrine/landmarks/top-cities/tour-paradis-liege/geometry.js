import * as THREE from 'three';
import pc from 'polygon-clipping';
import {parts} from './tour-paradis-liege-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box,bar,put}=p;

 const mapped=[[-17.626485590492962,-23.66743846688003],[13.763332822690021,-23.66743846688003],[14.225897874058406,-14.327632642919218],[14.042027835863228,-4.3165520043539924],[10.773067242301885,8.515220195795008],[5.181243975901289,18.38473808163491],[-3.0885007281888015,27.415152432283655],[-10.591006423271859,18.115912603850703],[-15.773699948575237,8.906049194844105],[-17.683346626717878,2.000087902510335],[-18.864376644547868,-4.924566104674055],[-18.54872913789591,-14.16759756184467]],annex=[[-32.68501490617904,10.155576022836119],[-23.846756280925742,8.194569016125554],[-24.29794875722085,3.637984424984416],[-17.683346626717878,2.000087902510335],[-18.864376644547868,-4.924566104674055],[-18.54872913789591,-14.16759756184467],[-26.0501120079632,-14.575245997217671],[-26.849225712305923,-20.697916433485425],[-8.665075158454124,-47.518205280711605],[-23.359261637210658,-66.5009875147873],[-27.183030071929164,-63.24121250290847],[-29.86389715550193,-61.081913460292334],[-47.35737118462842,-45.99342672837021]];
 const path=new THREE.CatmullRomCurve3([...mapped.slice(1),mapped[0]].map(([x,z])=>new THREE.Vector3(x,0,z)),false,'centripetal'),ring=path.getPoints(near?72:32).map(v=>[v.x,v.z]);
 const top=z=>{const q=Math.max(0,Math.min(1,(z+23.7)/51.1));return 96+22*(1-(1-q)**2);};
 const floor=pc.union([ring],[annex]);for(const poly of floor){const r=poly[0];r.forEach((a,i)=>facade('stone',a,r[(i+1)%r.length],0,12,{cols:Math.max(1,Math.round(Math.hypot(r[(i+1)%r.length][0]-a[0],r[(i+1)%r.length][1]-a[1])/2.2)),rows:3,fraction:.8,sill:.12}));cap('stone',r,0,-1);}
 for(const poly of pc.difference(floor,[ring]))cap('roof',poly[0],12);
 const patch=(mat,a,b,lo,ha,hb,out)=>face(mat,[[a[0],lo,a[1]],[b[0],lo,b[1]],[b[0],hb,b[1]],[a[0],ha,a[1]]],out);
 for(let k=0;k<ring.length;k++){const A=ring[k],B=ring[(k+1)%ring.length],len=Math.hypot(B[0]-A[0],B[1]-A[1]),out=[B[1]-A[1],0,A[0]-B[0]],cols=Math.max(1,Math.round(len/(near?1.5:5))),heightA=top(A[1])-4,heightB=top(B[1])-4;
  const pt=t=>[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t],H=t=>heightA+(heightB-heightA)*t;
  for(let row=0;row<27;row++){const lo=12+row*4,hi=lo+4;if(lo>=Math.max(heightA,heightB))continue;
   for(let col=0;col<cols;col++){let u=col/cols,v=(col+1)/cols;if(H(u)<=lo&&H(v)<=lo)continue;if(H(u)<=lo)u=(lo-heightA)/(heightB-heightA);if(H(v)<=lo)v=(lo-heightA)/(heightB-heightA);const p=pt(u),q=pt(v),h0=Math.min(hi,H(u)),h1=Math.min(hi,H(v)),m='glass',pad=Math.min(.08/Math.max(len,1e-3),(v-u)*.2),u1=u+pad,v1=v-pad;
    const sill=Math.min(h0,h1)>=lo+.16?lo+.16:lo;if(sill>lo)patch('metal',p,q,lo,sill,sill,out);
    patch('metal',p,pt(u1),sill,Math.min(hi,H(u)),Math.min(hi,H(u1)),out);patch(m,pt(u1),pt(v1),sill,Math.min(hi,H(u1)),Math.min(hi,H(v1)),out);patch('metal',pt(v1),q,sill,Math.min(hi,H(v1)),h1,out);
   }
  }
 }
 const heights=ring.map(p=>top(p[1])-4),center=[ring.reduce((s,p)=>s+p[0],0)/ring.length,heights.reduce((a,b)=>a+b,0)/heights.length,ring.reduce((s,p)=>s+p[1],0)/ring.length];for(let k=0;k<ring.length;k++){const j=(k+1)%ring.length;face('roof',[[ring[k][0],heights[k],ring[k][1]],[ring[j][0],heights[j],ring[j][1]],center],[0,1,0]);}
 const crownPosts=[];for(let i=0;i<ring.length;i+=near?3:2){const a=ring[i],lo=top(a[1])-4,hi=top(a[1]);bar('metal',[a[0],lo,a[1]],[a[0],hi,a[1]],.18,.18);crownPosts.push([a[0],lo,a[1]]);}
 for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];bar('metal',[a[0],top(a[1]),a[1]],[b[0],top(b[1]),b[1]],.22,.22);}
 // Transverse open rafters and crown lattice, with no opaque cap above the technical roof.
 for(let z=-18;z<=21;z+=near?6.5:9.75){const xs=[];for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];if((a[1]>z)!==(b[1]>z))xs.push(a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);if(xs.length>=2)bar('metal',[xs[0],top(z),z],[xs.at(-1),top(z),z],.16,.16);}
 const tip=mapped[6];cylinder('metal',tip[0],tip[1],.22,0,118,8);cylinder('metal',tip[0],tip[1],.13,118,136,6);

 const root=p.finish();root.userData.crownPosts=crownPosts;return root;
}
