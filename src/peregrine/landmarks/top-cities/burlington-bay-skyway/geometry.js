import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {PROFILE as p,L,MID,UNIT,MAIN,DECK_H,CROWN,CENTRES,WIDTHS,ROAD_EDGES,NEW_ENDS,TAPER,
 authoredLateral,landingBlend} from './burlington-bay-skyway-profile.js';
import {PALETTES} from './config.js';
export const PANELS=24,TRUSS_D=[CENTRES[1]-9.8,CENTRES[1]+9.8];
export const trussNodes=()=>Array.from({length:PANELS+1},(_,i)=>{
 const t=i/PANELS,s=UNIT[0]+(UNIT[1]-UNIT[0])*t,u=2*t-1;
 const top=p.deckHeight(s)+1.2+(CROWN-.5-DECK_H-1.2)*(1-u*u);
 return {s,top,low:top-(3.2+4.3*Math.sin(Math.PI*t))};
});
export function pierStations(side){const ends=side===0?NEW_ENDS:[60,L-60],out=[...MAIN,...UNIT];
 const step=side===0?48:31.5;
 for(let s=UNIT[0]-step;s>ends[0]+15;s-=step)out.push(s);
 for(let s=UNIT[1]+step;s<ends[1]-15;s+=step)out.push(s);
 return [...new Set(out)].filter(s=>p.deckHeight(s)>5).sort((a,b)=>a-b);
}
export const newGirderDepth=s=>{const dist=Math.min(...MAIN.map(t=>Math.abs(s-t)));return 2.5+4.0*Math.max(0,1-dist/76)**1.5;};
export function create({detail='near',audit=false}={}){
 const near=detail==='near',b=assetBuilder(p.CHAMPLAIN,detail),support={},members=[];
 const ck=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,authoredLateral(s,d),y);return [q.x,q.y,q.z];};
 const clamp=v=>Math.max(0,Math.min(1,v)),h=s=>p.deckHeight(s);
 function put(g,mat,s,name,lift=1){if(audit&&name)for(const n of [].concat(name))(support[n]??=[]).push(g.clone());b.put(g,mat,ck(s),lift);}
 function box(mat,s,d,y,len,w,ht,name,lift=1){const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(len,ht,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(g,mat,s,name,lift);}
 function bar(mat,a,c,w,depth=w,name,lift=1){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),v=cv.clone().sub(av),g=new THREE.BoxGeometry(w,v.length(),depth);
 g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,a[0],name,lift);}
 const contact=(name,a,c,sa,sc)=>{if(audit)members.push({name,a:xyz(...a),c:xyz(...c),sa,sc});};
 // Closed strips with separate face normals. All surfaces share station rows and lateral deck
 // columns, so the slab remains underneath the pavement on a bank-fitted landing crossfall.
 const specials=[...p.ALIGNMENT.map(v=>v.s),...UNIT,...MAIN,...NEW_ENDS,TAPER,L-TAPER,25,L-25];
 const stations=(a,c)=>[...new Set([a,c,...specials.filter(s=>s>a&&s<c),...Array.from({length:Math.ceil((c-a)/(near?10:50))},(_,i)=>a+i*(near?10:50))])].filter(s=>s<=c).sort((a,b)=>a-b);
 function strip(mat,a,c,cols,top,bottom,name,{fade=0,thin=false,ground=false,topMat}={}){
  const all=stations(a,c);
  for(let part=0;part<(near?3:1);part++){
   const lo=Math.max(a,near?L*part/3:0),hi=Math.min(c,near?L*(part+1)/3:L);if(hi<=lo)continue;
   const ss=[lo,...all.filter(s=>s>lo&&s<hi),hi],n=cols.length,pos=[],idx=[];
   const rows=ss.map(s=>{const f=fade?clamp(Math.min(s,L-s)/fade):1,t=typeof top==='function'?top(s):top,v=typeof bottom==='function'?bottom(s):bottom;
    return [...cols.map(d=>xyz(s,d,h(s)+t*f)),...cols.slice().reverse().map(d=>xyz(s,d,ground?0:Math.max(-.5,h(s)+v*f)))];});
   const faces=thin?cols.slice(1).map((_,i)=>[i,i+1]):Array.from({length:n*2},(_,i)=>[i,(i+1)%(n*2)]);
   const tops=[],topIdx=[];
   for(const [ia,ib] of faces){const isTop=topMat&&ia<n-1&&ib===ia+1,pp=isTop?tops:pos,ii=isTop?topIdx:idx,base=pp.length/3;for(const row of rows)pp.push(...row[ia],...row[ib]);
    for(let i=1;i<rows.length;i++){const u=base+(i-1)*2,v=base+i*2;ii.push(u,u+1,v,u+1,v+1,v);}}
   if(tops.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(tops,3));g.setIndex(topIdx);g.computeVertexNormals();put(g,topMat,lo,name);}
   if(!thin)for(const [k,on] of [[0,lo>a],[rows.length-1,hi<c]]){if(!on)continue;const r=rows[k];
    for(let j=0;j<n-1;j++){const z=pos.length/3;pos.push(...r[j],...r[j+1],...r[2*n-2-j],...r[2*n-1-j]);if(k===0)idx.push(z,z+3,z+1,z+1,z+3,z+2);else idx.push(z,z+1,z+3,z+1,z+2,z+3);}}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,lo,name,ground?y=>y>.001?1:0:1);
  }
 }
 // Independent ribbons: keep the air gap between the twins visible, including the far export.
 for(const [side,d] of CENTRES.entries()){
  const w=WIDTHS[side],left=d-w/2,right=d+w/2,[rl,rr]=ROAD_EDGES[side],cols=[left,rl,rr,right];
  const start=side===0?NEW_ENDS[0]:60,end=side===0?NEW_ENDS[1]:L-60;
  for(const [a,c] of [[left,rl],[rr,right]])strip('concrete',start,end,[a,c],-.18,-.8,`slab-${side}`);
  // Newer bridge: two steel approach box girders, concrete haunched main canal box.
  if(side===0){
   for(const g of [-5.3,5.3]){
    for(const [a,c] of [[start,UNIT[0]],[UNIT[1],end]])strip('steel',a,c,[d+g-1.35,d+g+1.35],-.8,-2.5,`girder-${side}`);
    strip('concrete',UNIT[0],UNIT[1],[d+g-1.7,d+g+1.7],-.8,s=>-newGirderDepth(s),`girder-${side}`);
   }
  }else{
   for(const g of [-9.5,9.5])strip('steel',start,end,[d+g-.5,d+g+.5],-.8,-2.5,`girder-${side}`);
   if(near)for(const g of [-3,3])strip('steel',start,end,[d+g-.18,d+g+.18],-.8,-1.8,`girder-${side}`);
  }
  // Shorter 1985 structure joins the same alignment as a low retaining approach. Original's
  // first/last 60 m use low abutment fill; no hovering square slab at the asset boundary.
  for(let [a,c] of [[8,start],[end,L-8]]){while(a<c&&h(a)<.85)a+=1;while(c>a&&h(c)<.85)c-=1;if(c>a)strip('concrete',a,c,cols,-.8,0,`fill-${side}`,{ground:true});}
  strip('concrete',0,L,[rl,rr],0,-.8,`pavement-${side}`,{topMat:'asphalt'});
  for(const [edge,sg] of [[left,-1],[right,1]]){
   const a=edge+(sg<0?0:-.52),c=edge+(sg<0?.52:0);
   strip('concrete',0,L,[a,c],1.05,-.18,`barrier-${side}-${sg}`,{fade:25});
  }
  if(near){
   // Fallback four-lane paint, held off the landing noses where live roads keep their own paint.
   for(const edge of [rl+.25,rr-.25])strip('paint',TAPER,L-TAPER,[edge-.075,edge+.075],.11,.11,undefined,{thin:true});
   for(let lane=1;lane<4;lane++){const dd=d+(lane-2)*3.55;for(let s=TAPER;s<L-TAPER-3;s+=12)strip('paint',s,s+3,[dd-.075,dd+.075],.11,.11,undefined,{thin:true});}
  }
  for(const s of pierStations(side)){
   const main=MAIN.some(t=>Math.abs(t-s)<.01),depth=side===0?newGirderDepth(s):2.5,capTop=h(s)-depth,n=`pier-${side}-${s.toFixed(2)}`,capH=main?3:1.8;
   // Two concrete shafts and a curved/haunched portal cap; shafts are grounded independently.
   for(const sg of [-1,1]){
    const dd=d+sg*(main?7.5:6.5),top=capTop-capH*.65,width=main?3.4:1.9,along=main?5.2:2.2;
    box('concrete',s,dd,top/2,along,width,top,n+'-shaft',y=>clamp(y/Math.max(1,top)));
    contact(n+'-shaft-'+sg,[s,dd,0],[s,dd,top],'ground',n+'-cap');
    if(near&&main)box('concrete',s,dd,.6,along+2,width+2,1.2,n+'-foot',0);
   }
   if(side===1&&main){
    // Pier portal from the 1957 construction photograph: solid crown, arched soffit
    // dipping over the legs and rising in the clear opening between them.
    const half=(w-1)/2,depth=5.2,shape=new THREE.Shape();
    shape.moveTo(-half,capTop);shape.lineTo(half,capTop);shape.lineTo(half,capTop-capH);
    shape.lineTo(7.5,capTop-capH);shape.quadraticCurveTo(0,capTop-.5,-7.5,capTop-capH);
    shape.lineTo(-half,capTop-capH);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?8:4});
    const q=p.bridgePoint(s,0,0),matrix=new THREE.Matrix4().makeBasis(new THREE.Vector3(-q.tz,0,q.tx),new THREE.Vector3(0,1,0),new THREE.Vector3(-q.tx,0,-q.tz));
    g.translate(d,0,-depth/2);g.applyMatrix4(matrix);g.translate(q.x,0,q.z);put(g,'concrete',s,n+'-cap');
   }else box('concrete',s,d,capTop-capH/2,main?5.2:2.4,w-1,capH,n+'-cap');
   contact(n+'-cap',[s,d-5.3,capTop],[s,d+5.3,capTop],side===0?'girder-0':'floor-'+s.toFixed(2),side===0?'girder-0':'floor-'+s.toFixed(2));
   if(side===1){box('steel',s,d,h(s)-1.7,main?2.2:1.2,w-1.4,1.6,'floor-'+s.toFixed(2));contact('floor-'+s,[s,d-9.5,h(s)-1.7],[s,d+9.5,h(s)-1.7],'girder-1','girder-1');}
  }
 }
 // 1958 continuous arched through-truss: two side planes, curved upper/lower chords,
 // repeated web diagonals, deck suspenders and overhead sway portals. Keep all main webs far.
 const nodes=trussNodes();
 for(const [sd,d] of TRUSS_D.entries()){
  for(const [i,n] of nodes.entries()){
   for(const level of ['top','low'])box('steel',n.s,d,n[level],1.0,.9,1.0,`node-${sd}-${i}-${level}`);
   // Deck hangers meet the lower arch chord above the roadway; in back spans a short
   // post connects the chord below deck to the floor edge instead.
   const foot=[n.s,d,h(n.s)-1],end=[n.s,d,n.low],supportEnd=`node-${sd}-${i}-low`;
   if(Math.abs(n.low-foot[2])>.5){bar('steel',foot,end,near?.25:.32,.32,`hanger-${sd}-${i}`);contact(`hanger-${sd}-${i}`,foot,end,'girder-1',supportEnd);}
   if(i===PANELS)continue;
   const next=nodes[i+1];
   for(const level of ['top','low']){bar('steel',[n.s,d,n[level]],[next.s,d,next[level]],level==='top'?.72:.6,.64);contact(`chord-${sd}-${i}-${level}`,[n.s,d,n[level]],[next.s,d,next[level]],`node-${sd}-${i}-${level}`,`node-${sd}-${i+1}-${level}`);}
   bar('steel',[n.s,d,n.low],[next.s,d,next.top],.32,.34);contact(`web-${sd}-${i}`,[n.s,d,n.low],[next.s,d,next.top],`node-${sd}-${i}-low`,`node-${sd}-${i+1}-top`);
   if(near){bar('steel',[n.s,d,n.top],[next.s,d,next.low],.2,.24);contact(`counterweb-${sd}-${i}`,[n.s,d,n.top],[next.s,d,next.low],`node-${sd}-${i}-top`,`node-${sd}-${i+1}-low`);}
   bar('steel',[n.s,d,n.low],[n.s,d,n.top],.27,.32);contact(`post-${sd}-${i}`,[n.s,d,n.low],[n.s,d,n.top],`node-${sd}-${i}-low`,`node-${sd}-${i}-top`);
  }
 }
 for(const [i,n] of nodes.entries()){
  if(n.low-h(n.s)<6)continue;const a=[n.s,TRUSS_D[0],n.top],c=[n.s,TRUSS_D[1],n.top];
  bar('steel',a,c,.38,.5);contact('portal-'+i,a,c,`node-0-${i}-top`,`node-1-${i}-top`);
  if(i<PANELS&&nodes[i+1].low-h(nodes[i+1].s)>6){const m=nodes[i+1];
   bar('steel',a,[m.s,TRUSS_D[1],m.top],near?.2:.24);contact('sway-'+i,a,[m.s,TRUSS_D[1],m.top],`node-0-${i}-top`,`node-1-${i+1}-top`);
   if(near){bar('steel',c,[m.s,TRUSS_D[0],m.top],.2);contact('swayx-'+i,c,[m.s,TRUSS_D[0],m.top],`node-1-${i}-top`,`node-0-${i+1}-top`);}
  }
 }
 // Paired high-mast standards: all poles on a parapet, no street furniture in a traffic lane.
 for(let s=100;s<L-80;s+=near?65:130)for(const [side,d] of CENTRES.entries()){
  const sg=side===0?-1:1,dd=d+sg*(WIDTHS[side]/2-.26),y=h(s),n=`lamp-${side}-${s}`;
  bar('rail',[s,dd,y+.8],[s,dd,y+9.8],.15,.15,n);
  box('lamp',s,dd,y+9.95,1.2,.5,.3,n+'-head');contact(n,[s,dd,y+.8],[s,dd,y+9.8],`barrier-${side}-${sg}`,n+'-head');
 }
 const root=b.finish();
 root.traverse(mesh=>{if(!mesh.isMesh||mesh.material.name!=='asphalt')return;const pos=mesh.geometry.attributes.position,col=[];
  for(let i=0;i<pos.count;i++){const s=p.projectBridge(pos.getX(i),pos.getZ(i)).s,c=new THREE.Color(PALETTES.light.asphalt).lerp(new THREE.Color(0xf2f3f6),landingBlend(s));col.push(c.r,c.g,c.b);}
  mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(col,3));mesh.material.color.setHex(0xffffff);mesh.material.vertexColors=true;
 });
 if(audit)root.userData.audit={support,members};return root;
}
