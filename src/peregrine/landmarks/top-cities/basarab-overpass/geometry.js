import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PROFILE as p,T,A,C,L,DECK_H,halfWidth,roadEdgesAt,TAPER,landingBlend } from './basarab-overpass-profile.js';

// Original model; named index ranges retain contact evidence after batching.
export function create({detail="near"}={}) {
 const near=detail==="near",b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const counts=new Map(),supports={},contacts=[],chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 function put(g,mat,s,name,lift=1){const ck=chunk(s),key=`${ck}:${mat}`,start=counts.get(key)||0;
  if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));const count=g.index.count;
  counts.set(key,start+count);if(name)supports[name]={material:mat,chunk:ck,start,count};b.put(g,mat,ck,lift);}
 function box(name,mat,s,d,y,len,width,height,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,height,width);
  g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(g,mat,s,name,lift);return name;}
 function bar(name,mat,a,c,width,ends,round=false){const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),v=cv.clone().sub(av),len=v.length();
  const g=round?new THREE.CylinderGeometry(width,width,len,near?6:4,1,false):new THREE.BoxGeometry(width,len,width);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());
  put(g,mat,p.projectBridge(a[0],a[2]).s,name);if(ends)contacts.push({name,points:[a,c],supports:ends});return name;}
 const keep=s=>1-landingBlend(s), railY=s=>1.25*keep(s);
 function ribbon(name,mat,start,end,left,right,offset,thick,feather=false){
  const cuts=[start,end,...p.knots.map(v=>v[0]).filter(s=>s>start&&s<end),...p.ALIGNMENT.map(v=>v.s).filter(s=>s>start&&s<end)];for(let s=Math.ceil(start/(near?6:16))*(near?6:16);s<end;s+=near?6:16)cuts.push(s);
  for(let s=0;s<=TAPER;s+=4)for(const v of [s,L-s])if(v>start&&v<end)cuts.push(v);
  const ss=[...new Set(cuts)].sort((a,c)=>a-c);
  for(let ck=0;ck<(near?3:1);ck++){const pos=[],idx=[],quad=(a,c,d,e)=>idx.push(a,c,d,a,d,e);
   for(let i=1;i<ss.length;i++){const a=ss[i-1],c=ss[i];if(chunk((a+c)/2)!==ck)continue;const n=pos.length/3;
    for(const s of [a,c]){const fade=feather?keep(s):1,y=p.deckHeight(s)+(typeof offset==="function"?offset(s):offset*fade);for(const [d,h]of [[left(s),y],[right(s),y],[left(s),y-thick*fade],[right(s),y-thick*fade]])pos.push(...xyz(s,d,h));}
    quad(n,n+1,n+5,n+4);if(!thick)continue;quad(n+2,n+6,n+7,n+3);quad(n,n+4,n+6,n+2);quad(n+1,n+3,n+7,n+5);
    if(i===1)quad(n,n+2,n+3,n+1);if(i===ss.length-1)quad(n+4,n+5,n+7,n+6);}
   if(!pos.length)continue;for(let j=idx.length-3;j>=0;j-=3){const a=new THREE.Vector3().fromArray(pos,idx[j]*3),c=new THREE.Vector3().fromArray(pos,idx[j+1]*3),d=new THREE.Vector3().fromArray(pos,idx[j+2]*3);if(c.sub(a).cross(d.sub(a)).lengthSq()<1e-12)idx.splice(j,3);}
   const used=[...new Set(idx)],remap=new Map(used.map((v,i)=>[v,i]));const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(used.flatMap(i=>pos.slice(i*3,i*3+3)),3));g.setIndex(idx.map(i=>remap.get(i)));g.computeVertexNormals();put(g,mat,(ck+.5)*L/(near?3:1),`${name}-${ck}`);}}
 ribbon("slab","concrete",TAPER,L-TAPER,s=>-halfWidth(s),halfWidth,-.18,.35);
 // Separate carriageway noses release the separator back to provider ground.
 for(const [start,end]of [[0,TAPER],[L-TAPER,L]])for(let i=0;i<2;i++){
  const edge=(s,j)=>{const e=roadEdgesAt(s)[i],outer=i===0?0:1;return j===outer?e[j]+(i===0?-1:1)*(halfWidth(s)-Math.abs(e[j])):e[j]+(i===0?1:-1)*.8*keep(s);};
  ribbon(`landing-slab-${start}-${i}`,"concrete",start,end,s=>edge(s,0),s=>edge(s,1),()=>-.18,.35,true);
 }
 for(let i=0;i<2;i++)ribbon(`road-${i}`,"asphalt",0,L,s=>roadEdgesAt(s)[i][0],s=>roadEdgesAt(s)[i][1],0,0);
 ribbon("tram-bed","concrete",0,L,()=>-3.4,()=>3.4,-.18,.14);
 for(const side of [-1,1]){
  ribbon(`barrier-${side}`,"concrete",0,L,s=>side*halfWidth(s)-.3*keep(s),s=>side*halfWidth(s)+.3*keep(s),s=>.82*keep(s),1,true);
  for(const s of [0,L])box(`rail-end-${side}-${s}`,"rail",s,side*halfWidth(s),p.deckHeight(s)-.4,.7,.7,.5);
  ribbon(`outer-rail-${side}`,near?"rail":"concrete",0,L,s=>side*halfWidth(s)-.06*keep(s),s=>side*halfWidth(s)+.06*keep(s),railY,.12,true);
  for(const s of [0,L])contacts.push({name:`outer-rail-${side}-${chunk(s)}`,points:[xyz(s,side*halfWidth(s),p.deckHeight(s))],supports:[`rail-end-${side}-${s}`]});
  ribbon(`girder-${side}`,"steel",A-70,C+66,()=>side*9.6-.22,()=>side*9.6+.22,-.55,2.5);
  for(const [start,end]of [[0,A-70],[C+66,L]])ribbon(`approach-girder-${side}-${start}`,"steel",start,end,()=>side*6.5-.25,()=>side*6.5+.25,-.55,2);
 }
 for(const s of [0,L])box(`landing-${s}`,"rail",s,0,p.deckHeight(s)+(near?.08:-.07),1.2,7,.25);
 for(const d of [-2.5175,-1.0825,1.0825,2.5175]){ribbon(`track-${d}`,"rail",0,L,()=>d-.045,()=>d+.045,near?.2:-.04,near?.1:.06);
  for(const s of [0,L])contacts.push({name:`track-${d}-${chunk(s)}`,points:[xyz(s,d,p.deckHeight(s)+(near?.1:-.07))],supports:[`landing-${s}`]});}
 // Two vertical chamfered 6 x 4.6 m shafts, as specified by the designer.
 for(const side of [-1,1]){const d=side*8.1,ring=[[-3,-1.8],[-2.5,-2.3],[2.5,-2.3],[3,-1.8],[3,1.8],[2.5,2.3],[-2.5,2.3],[-3,1.8]],pos=[],idx=[];
  for(const y of [1,SPEC.height])for(const [s,x]of ring)pos.push(...xyz(T+s,d+x,y));
  for(let i=0;i<8;i++){const j=(i+1)%8;idx.push(i,j,i+8,j,j+8,i+8);}for(let i=1;i<7;i++)idx.push(0,i+1,i,8,8+i,9+i);
  for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,"tower",T,`pylon-${side}`,y=>Math.min(1,Math.max(0,(y-1)/(DECK_H-1.55))));
  box(`foundation-${side}`,"concrete",T,d,.5,8,6.6,1,0);
 }
 box("pylon-crossbeam","tower",T,0,DECK_H-3.15,5,16.3,1.5);
 contacts.push({name:"pylon-crossbeam",points:[xyz(T,-8.1,DECK_H-3.15),xyz(T,8.1,DECK_H-3.15)],supports:["pylon--1","pylon-1"]});
 for(const y of [DECK_H+58,DECK_H+66,DECK_H+73])bar(`upper-brace-${y}`,"tower",xyz(T,-8.1,y),xyz(T,8.1,y),1.25,["pylon--1","pylon-1"]);
 for(const side of [-1,1])for(const dir of [-1,1])for(let i=1;i<=15;i++){
  const s=T+dir*(dir===1?168:131.5)*i/15,y=DECK_H+42+i*2.35,d=side*9.6;
  const shoe=box(`stay-anchor-${side}-${dir}-${i}`,"steel",s,d,DECK_H+.2,1.1,.9,.7);
  bar(`stay-${side}-${dir}-${i}`,"cable",xyz(T+dir*2.8,side*8.1,y),xyz(s,d,DECK_H+.35),near?.10:.135,[`pylon-${side}`,shoe],true);
 }
 const piers=[A-70,A,T-75,C,C+36,C+66];for(let s=60;s<L-45;s+=44)if(s<A-20||s>C+95)piers.push(s);
 for(const s of piers){const h=p.deckHeight(s)-3.05;if(h<.8)continue;const cap=box(`cap-${s}`,"concrete",s,0,h+.25,3.5,22,.5),cols=[];
  for(const d of [-6.5,6.5]){const foot=box(`foot-${s}-${d}`,"concrete",s,d,.35,4,4,.7,0),col=box(`column-${s}-${d}`,"concrete",s,d,(h+.35)/2,2.3,2.3,h-.35,y=>Math.min(1,Math.max(0,(y-.7)/(h-.7))));cols.push(col);
   contacts.push({name:col,points:[xyz(s,d,.5),xyz(s,d,h)],supports:[foot,cap]});}
  contacts.push({name:cap,points:cols.map((_,i)=>xyz(s,[-6.5,6.5][i],h)),supports:cols});}
 for(let s=A;s<C+66;s+=near?5:20){const w=halfWidth(s)-.45,name=bar(`floor-beam-${s}`,"steel",xyz(s,-w,DECK_H-.805),xyz(s,w,DECK_H-.805),.55);
  contacts.push({name,points:[xyz(s,-w,DECK_H-.805),xyz(s,w,DECK_H-.805)],supports:[`slab-${chunk(s)}`,`slab-${chunk(s)}`]});}
 // Tram station platforms and an open-ended barrel canopy.
 const ca=T+38,ce=T+133,cy=DECK_H+2.25,r=8.4,n=near?16:10;
 for(const side of [-1,1])ribbon(`platform-${side}`,"concrete",ca,ce,()=>side<0?-8.4:3.8,()=>side<0?-3.8:8.4,.42,.59);
 const arc=i=>[r*Math.cos(i*Math.PI/n),cy+7.4*Math.sin(i*Math.PI/n)],pos=[],idx=[];
 const canopyStations=[ca,...Array.from({length:Math.floor((ce-ca)/5)},(_,i)=>ca+(i+1)*5).filter(s=>s<ce),ce];
 for(const s of canopyStations)for(let i=0;i<=n;i++){const [d,y]=arc(i);pos.push(...xyz(s,d,y),...xyz(s,d*.988,y-.14));}
 const stride=(n+1)*2;
 for(let k=1;k<canopyStations.length;k++)for(let i=0;i<n;i++){const a=(k-1)*stride+i*2,c=a+2,e=k*stride+i*2,f=e+2;idx.push(a,e,c,c,e,f,a+1,c+1,e+1,c+1,f+1,e+1);}
 for(const k of [0,canopyStations.length-1])for(let i=0;i<n;i++){const a=k*stride+i*2,c=a+2;idx.push(a,c,c+1,a,c+1,a+1);}
 for(let k=1;k<canopyStations.length;k++)for(const i of [0,n]){const a=(k-1)*stride+i*2,e=k*stride+i*2;idx.push(a,a+1,e,a+1,e+1,e);}
 const shell=new THREE.BufferGeometry();shell.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));shell.setIndex(idx);shell.computeVertexNormals();put(shell,"glass",(ca+ce)/2,"canopy");
 for(let s=ca;s<=ce+.01;s+=near?5:19){const feet=[];
  for(const side of [-1,1]){const foot=box(`canopy-foot-${s}-${side}`,"steel",s,side*r,DECK_H+1.3,.6,.6,1.9);feet.push(foot);contacts.push({name:foot,points:[xyz(s,side*r,DECK_H+.38)],supports:[`platform-${side}-${chunk(s)}`]});}
  for(let i=0;i<n;i++){const [d,y]=arc(i),[e,z]=arc(i+1);bar(`canopy-rib-${s}-${i}`,"rail",xyz(s,d,y),xyz(s,e,z),near?.13:.18,i===0?[feet[1],"canopy"]:i===n-1?["canopy",feet[0]]:["canopy","canopy"]);}}
 for(let i=0;i<=n;i+=2){const [d,y]=arc(i);bar(`canopy-long-${i}`,"rail",xyz(ca,d,y),xyz(ce,d,y),.11,["canopy","canopy"]);}
 if(near){
  for(let s=TAPER+5;s<L-TAPER-4;s+=12)for(let side=0;side<2;side++){const e=roadEdgesAt(s)[side];box(null,"paint",s,(e[0]+e[1])/2,p.deckHeight(s)+.11,3,.12,.016);}
  for(let s=TAPER;s<=L-TAPER;s+=4)for(const side of [-1,1]){const d=side*halfWidth(s),post=box(`rail-post-${s}-${side}`,"rail",s,d,p.deckHeight(s)+1.01,.1,.1,.4);contacts.push({name:post,points:[xyz(s,d,p.deckHeight(s)+.82),xyz(s,d,p.deckHeight(s)+1.19)],supports:[`barrier-${side}-${chunk(s)}`,`outer-rail-${side}-${chunk(s)}`]});}
  for(let s=TAPER+5;s<L-TAPER;s+=40)for(const side of [-1,1]){const d=side*(halfWidth(s)-.55),h=p.deckHeight(s),foot=box(`lamp-foot-${s}-${side}`,"steel",s,d,h+.35,.65,.65,1.1);
   bar(`lamp-mast-${s}-${side}`,"rail",xyz(s,d,h+.4),xyz(s,d,h+8),.16,[foot,`lamp-head-${s}-${side}`]);box(`lamp-head-${s}-${side}`,"lamp",s,d,h+8,.8,.5,.3);
   contacts.push({name:foot,points:[xyz(s,d,h-.2)],supports:[`slab-${chunk(s)}`]});}
  for(let s=A;s<C+66;s+=4)for(const side of [-1,1])box(null,"glow",s,side*(halfWidth(s)+.32),DECK_H-.32,2.7,.07,.22);
 }
 const root=b.finish();root.traverse(o=>{if(!o.isMesh||o.material.name!=="asphalt")return;const a=o.geometry.attributes.position,colors=[];
  for(let i=0;i<a.count;i++){const s=p.projectBridge(a.getX(i),a.getZ(i)).s,c=new THREE.Color(PALETTES.light.asphalt).lerp(new THREE.Color(0xf2f3f6),landingBlend(s));colors.push(c.r,c.g,c.b);}o.geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));o.material.color.setHex(0xffffff);o.material.vertexColors=true;});root.userData.supports=supports;root.userData.contacts=contacts;return root;
}
