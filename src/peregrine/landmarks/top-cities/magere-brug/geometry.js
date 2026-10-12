import {BoxGeometry, CylinderGeometry, SphereGeometry, Shape, ExtrudeGeometry, Quaternion, Vector3} from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {START,END,DECK,HINGE,ANGLE,ARCHES,point} from './magere-brug-parts.js';

export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const ranges={},members=[],offsets={};
 // Named vertex ranges survive material batching, so tests measure actual support surfaces.
 function put(g,mat,name){
  g.rotateY(ANGLE);
  if(name)ranges[name]={material:mat,start:offsets[mat]||0,count:g.attributes.position.count};
  offsets[mat]=(offsets[mat]||0)+g.attributes.position.count;
  b.put(g,mat);
 }
 function box(name,mat,s,y,d,l,h,w){const g=new BoxGeometry(l,h,w);g.translate(s,y,d);put(g,mat,name);}
 function bar(name,mat,a,c,w,ends,depth=w){
  const av=new Vector3(...a),cv=new Vector3(...c),delta=cv.clone().sub(av);
  const g=new BoxGeometry(w,delta.length(),depth);
  g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),delta.normalize()));
  g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,name);
  if(ends)members.push({name,endpoints:[point(...a),point(...c)],supports:ends});
 }
 function prism(name,mat,shape,s,d,width,portal=false){
  const g=new ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,steps:1,curveSegments:near?16:8});
  g.translate(0,0,-width/2);
  if(portal){const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,s+p.getZ(i),p.getY(i),d+p.getX(i));g.computeVertexNormals();}
  else g.translate(s,0,d);
  put(g,mat,name);
 }
 function bulb(s,y,d,r=.085){const g=new SphereGeometry(r,near?6:4,near?4:2);g.translate(s,y,d);put(g,'lamp');}
 // White shallow arch approach spans, with genuine open waterways in both LODs.
 for(const [i,[a,c]] of ARCHES.entries()){
  const sh=new Shape();sh.moveTo(a,DECK-.26);sh.lineTo(c,DECK-.26);
  const n=near?16:8;
  for(let k=n;k>=0;k--){const x=a+(c-a)*k/n,y=.62+1.23*Math.sin(Math.PI*k/n);sh.lineTo(x,y);}sh.closePath();
  prism(`arch-${i}`,'timber',sh,0,0,9.55);
  for(const side of [-1,1]){
   if(near)for(let y=.85;y<2.22;y+=.22)for(let x=a+.2;x<c-.1;x+=.7){
    const arc=.62+1.23*Math.sin(Math.PI*(x-a)/(c-a));
    if(y>arc+.18)box(null,'timber',x,y,side*4.82,.68,.025,.11);
   }
   for(let k=0;k<=n;k++){const x=a+(c-a)*k/n;bulb(x,.62+1.23*Math.sin(Math.PI*k/n)+.09,side*4.82,near?.08:.10);}
  }
 }
 const gaps=[[START,ARCHES[0][0]],...ARCHES.slice(0,-1).map((v,i)=>[v[1],ARCHES[i+1][0]]).filter(([a,c])=>c-a<3),[ARCHES.at(-1)[1],END]];
 for(const [i,[a,c]] of gaps.entries()){
  box(`pier-${i}`,'timber',(a+c)/2,1.40,0,c-a,1.88,9.55);
  box(`pier-base-${i}`,'stone',(a+c)/2,.23,0,c-a,.46,9.55);
 }
 for(const [name,a,c] of [['west',START,-HINGE],['east',HINGE,END]]){
  box(`${name}-deck`,'deck',(a+c)/2,DECK-.10,0,c-a,.20,9.55);
  members.push({name:`${name}-deck`,endpoints:[point(a,DECK-.10,0),point(c,DECK-.10,0)],supports:name==='west'?['pier-0','hinge--1']:['hinge-1',`pier-${gaps.length-1}`]});
  for(const side of [-1,1]){
   const d=side*4.55,posts=[];
   const n=Math.ceil((c-a)/1.7);
   for(let k=0;k<=n;k++){
    const s=a+(c-a)*k/n,p=`${name}-${side}-post-${k}`;posts.push(p);
    box(p,'iron',s,DECK+.61,d,.095,1.22,.095);
    if(near)box(null,'timber',s,DECK-.40,side*4.79,.18,.43,.13);
   }
   for(let k=0;k<n;k++)for(const y of [DECK+.43,DECK+.83,DECK+1.2])bar(`${name}-${side}-rail-${k}-${y}`,'iron',[a+(c-a)*k/n,y,d],[a+(c-a)*(k+1)/n,y,d],near?.047:.065,[posts[k],posts[k+1]]);
   for(let s=a+.2;s<c;s+=near?.62:1.24)bulb(s,DECK-.30,side*4.82);
  }
 }
 // Two independent leaves meet at their central bearing, closed state.
 box('central-bearing','iron',0,DECK-.24,0,.15,.40,4.9);
 for(const side of [-1,1]){
  const s=side*HINGE;
  box(`hinge-pier-${side}`,'timber',s,1.17,0,1.03,2.34,9.55);
  box(`hinge-${side}`,'iron',s,DECK-.18,0,.30,.48,5.1);
  bar(`leaf-${side}`,'deck',[s,DECK-.10,0],[0,DECK-.10,0],.20,[`hinge-${side}`,'central-bearing'],5.0);
  for(const d of [-2.34,2.34]){
   const key=`${side}-${d}`,col=`gantry-${key}`;
   box(`foot-${key}`,'stone',s,DECK+.20,d,1.05,.40,.76);
   box(col,'timber',s,6.62,d,.66,7.24,.58);
   box(`pivot-${key}`,'iron',s,10.44,d,.96,.34,.83);
   // Outer inclined stabilisers make the photographed A-frame side elevation.
   box(`brace-anchor-${key}`,'iron',s+side*4.1,DECK+.07,d,.4,.26,.32);
   bar(`brace-${key}`,'iron',[s+side*4.1,DECK+.1,d],[s,7.85,d],.09,[`brace-anchor-${key}`,col]);
   const tip=[side*.65,11.16,d],tail=[s+side*7.2,9.43,d];
   box(`tip-${key}`,'timber',...tip,.62,.57,.58);
   box(`weight-${key}`,'timber',...tail,1.7,.70,.76);
   bar(`balance-${key}`,'timber',tail,tip,.43,[`weight-${key}`,`tip-${key}`],.40);
   box(`chain-anchor-${key}`,'iron',side*.65,DECK+.15,d,.34,.35,.3);
   bar(`chain-${key}`,'iron',[side*.65,DECK+.18,d],tip,near?.055:.08,[`chain-anchor-${key}`,`tip-${key}`]);
   if(near){
    for(let y=3.35;y<9.8;y+=1.25)box(null,'iron',s+.38,y,d,.11,.23,.24);
    }
   const lightSamples=near?12:6;
   for(let k=0;k<lightSamples;k++){const f=k/(lightSamples-1);bulb(tail[0]+(tip[0]-tail[0])*f,tail[1]+(tip[1]-tail[1])*f+.24,d);}
   for(let y=DECK+.5;y<10.2;y+=near?.55:1.1)for(const face of [-1,1])bulb(s+face*.39,y,d);
   // Portal-edge railing, white on the moving leaves.
   const inner=`leaf-post-${key}`;box(inner,'timber',side*.08,DECK+.60,d,.15,1.2,.14);
   for(const y of [DECK+.43,DECK+1.12])bar(`leaf-rail-${key}-${y}`,'timber',[s,y,d],[side*.08,y,d],.10,[col,inner]);
   // Tall protective mooring piles at the hinge, grounded and capped.
   const g=new CylinderGeometry(.16,.22,DECK+.12,near?8:5);g.translate(s,.5*(DECK+.12),d+Math.sign(d)*.72);put(g,'iron');
  }
  // Arched transverse headboard: 4.1 m open passage, spring 7.35, crown 8.70.
  const sh=new Shape();sh.moveTo(-2.35,10.13);sh.lineTo(2.35,10.13);sh.lineTo(2.35,7.35);
  const n=near?20:10;
  for(let k=n;k>=0;k--){const d=-2.06+4.12*k/n;sh.lineTo(d,7.35+1.35*Math.sqrt(Math.max(0,1-(d/2.06)**2)));}
  sh.lineTo(-2.35,7.35);sh.closePath();prism(`portal-${side}`,'timber',sh,s,0,.52,true);
  box(`headcap-${side}`,'timber',s,10.24,0,.88,.24,5.45);
  members.push({name:`headcap-${side}`,endpoints:[point(s,10.24,-2.725),point(s,10.24,2.725)],supports:[`pivot-${side}--2.34`,`pivot-${side}-2.34`]});
  // The two balance beams are joined by a supported transverse lifting yoke.
  bar(`yoke-${side}`,'timber',[side*.65,11.16,-2.34],[side*.65,11.16,2.34],.34,[`tip-${side}--2.34`,`tip-${side}-2.34`]);
  for(let d=-2.35;d<=2.35;d+=near?.4:.8)for(const face of [-1,1])bulb(s+face*.48,10.25,d);
  for(let k=0;k<=n;k++){const d=-2.06+4.12*k/n;for(const face of [-1,1])bulb(s+face*.32,7.35+1.35*Math.sqrt(Math.max(0,1-(d/2.06)**2))+.09,d);}
  // Traditional small lanterns flanking the portal, no unrelated street clutter.
  if(near)for(const d of [-1.83,1.83]){
   box(`lantern-bracket-${side}-${d}`,'iron',s,6.35,d,.35,.12,.67);
   box(null,'iron',s,6.60,d,.07,.48,.07);
   box(null,'lamp',s,6.97,d,.22,.32,.22);
   box(null,'iron',s,7.20,d,.31,.13,.31);
  }
 }
 // Paved walking surfaces are kept smooth; near detailing is in the gantries and lights.
 const model=b.finish();model.userData.partRanges=ranges;model.userData.contactMembers=members;
 return model;
}
