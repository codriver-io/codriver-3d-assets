import { BoxGeometry, Shape, ExtrudeGeometry, CylinderGeometry, BufferGeometry, Float32BufferAttribute, Quaternion, Vector3 } from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { TOLL_RING } from './footprint.js';
import { PROFILE as p, TOWER_S, SIDE_S, ANCHOR_S, PIERS, DECK_H, DECK_HALF, RAMP_SOUTH, roadEdgesAt, NORTH_ANCHORS, landingBlend } from './ponte-25-de-abril-profile.js';

// Named triangle ranges are optional authoring-only evidence; exports keep just the mesh.
export function create({ detail = 'near', evidence = false } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...p.CHAMPLAIN, palette: PALETTES.light }, detail);
  const parts = {}, contacts = [], offsets = new Map(), L = p.BRIDGE_LENGTH;
  const chunk = s => near ? Math.min(3, Math.floor(s / L * 4)) : 0;
  const xyz = (s,d,y) => { const q=p.bridgePoint(s,d,y); return [q.x,y,q.z]; };
  function put(name,g,mat,s,lift=1) {
    const ck=chunk(s),key=`${ck}:${mat}`, count=g.index?.count ?? g.attributes.position.count;
    parts[name]={mesh:`${SPEC.id}-${ck}-${mat}`,start:offsets.get(key)||0,count};
    offsets.set(key,(offsets.get(key)||0)+count); b.put(g,mat,ck,lift);
  }
  function box(name,mat,s,d,y,along,across,up,lift=1) {
    const q=p.bridgePoint(s,d,y),g=new BoxGeometry(along,up,across);
    g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(name,g,mat,s,lift);
  }
  function beam(name,mat,a,c,w,t=w,lift=1,round=false,supports=null) {
    const A=new Vector3(...xyz(...a)),B=new Vector3(...xyz(...c)),v=B.clone().sub(A),len=v.length();
    const g=round?new CylinderGeometry(w,w,len,near?6:4,1,true):new BoxGeometry(w,len,t);
    g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),v.normalize()));g.translate(...A.clone().add(B).multiplyScalar(.5).toArray());
    put(name,g,mat,(a[0]+c[0])/2,lift);
    if(supports) contacts.push({name,ends:[A.toArray(),B.toArray()],supports,tolerance:2.9});
  }
  function ribbon(name,mat,a,c,dl,dr,off=0,thick=0) {
    const ss=new Set([a,c]);const step=near?10:25;for(let s=Math.ceil(a/step)*step;s<c;s+=step)if(s<SIDE_S[0]||s>SIDE_S[1])ss.add(s);
    for(const q of p.ALIGNMENT)if(q.s>a+.05&&q.s<c-.05)ss.add(q.s);
    const stations=[...ss].sort((a,b)=>a-b).filter((s,i,v)=>!i||s-v[i-1]>.001),pos=[],idx=[],stride=thick?4:2;
    stations.forEach((s,i)=>{
      const top=Math.max(.04,p.deckHeight(s)+(typeof off==='function'?off(s):off));
      for(const [d,dy] of thick?[[dl,0],[dr,0],[dl,-Math.min(thick,top)],[dr,-Math.min(thick,top)]]:[[dl,0],[dr,0]])pos.push(...xyz(s,typeof d==='function'?d(s):d,top+dy));
      if(!i)return;if(typeof off==='number'&&off<0&&Math.min(p.deckHeight(s),p.deckHeight(stations[i-1]))<3)return;const u=(i-1)*stride,v=i*stride;
      idx.push(u,u+1,v,u+1,v+1,v);
      if(thick){
        idx.push(u+2,v+2,u+3,u+3,v+2,v+3);
        // Transverse subdivision shares internal boundaries; buried interior
        // walls add no silhouette and needlessly double the far triangles.
        const approach=/^approach-/.test(name),strip=Number(name.split('-').at(-2));
        if(!approach||strip===0)idx.push(u,v,u+2,u+2,v,v+2);
        if(!approach||strip===11)idx.push(u+1,u+3,v+1,u+3,v+3,v+1);
      }
    });
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(name,g,mat,(a+c)/2);
  }
  const split=(name,mat,a,c,l,r,off,thick)=>{
    const cuts=near?[a,...[L/4,L/2,3*L/4].filter(s=>s>a&&s<c),c]:[a,c];
    for(let i=1;i<cuts.length;i++){
      const partName=`${name}-${i}`;ribbon(partName,mat,cuts[i-1],cuts[i],l,r,off,thick);
      if(name.startsWith('edge-')&&mat==='steel'){
        const side=name==='edge--1'?-1:1,dAt=s=>((typeof l==='function'?l(s):l)+(typeof r==='function'?r(s):r))/2;
        contacts.push({name:partName,ends:[xyz(cuts[i-1],dAt(cuts[i-1]),p.deckHeight(cuts[i-1])+(typeof off==='function'?off(cuts[i-1]):off)),xyz(cuts[i],dAt(cuts[i]),p.deckHeight(cuts[i])+(typeof off==='function'?off(cuts[i]):off))],supports:[i===1?`endpost-${side}-0`:`${name}-${i-1}`,i===cuts.length-1?`endpost-${side}-${L}`:`${name}-${i+1}`],tolerance:.9});
      }
    }
  };
  // Thin steel floor, six lanes and narrow maintenance edges. No pedestrian sidewalks.
  const left=s=>roadEdgesAt(s)[0][0], right=s=>roadEdgesAt(s)[1][1];
  // Transverse samples keep wide toll pavement above the terrain crest between
  // its outer edges. The central separation follows the mapped carriageways.
  for(const [name,side] of [['west',0],['east',1]])for(let i=0;i<12;i++){
    const edge=(s,u)=>{const [a,c]=roadEdgesAt(s)[side];return a+(c-a)*u;};
    split(`road-${name}-${i}`,'asphalt',0,L,s=>edge(s,i/12),s=>edge(s,(i+1)/12),0,0);
  }
  split('floor','steel',SIDE_S[0],SIDE_S[1],-DECK_HALF,DECK_HALF,-.4,.65);
  for(const side of [-1,1])split(`maintenance-${side*11.9}`,'steel',0,L,s=>(side<0?left(s):right(s))+side*.55-.3,s=>(side<0?left(s):right(s))+side*.55+.3,.16,.55);
  split('median','concrete',SIDE_S[0]-70,SIDE_S[1]+70,-.22,.22,.65,.6);
  for(const side of [-1,1]) {
    const d=side*12.1;
    split(`edge-${side}`,'steel',0,L,s=>(side<0?left(s):right(s))+side*.75-.13,s=>(side<0?left(s):right(s))+side*.75+.13,s=>.15+1.1*landingBlend(s),.12);
    for(const s of [0,L])box(`endpost-${side}-${s}`,'steel',s,(side<0?left(s):right(s))+side*.75,p.deckHeight(s)+.15,.5,.5,.3);
  }
  if(near) {
    for(const side of [0,1])for(const edge of [0,1])split(`edge-paint-${side}-${edge}`,'paint',0,L,s=>roadEdgesAt(s)[side][edge]+(edge?-.25:.25)-.06,s=>roadEdgesAt(s)[side][edge]+(edge?-.25:.25)+.06,.15,0);
    for(let s=6;s<L-4;s+=18)for(const side of [0,1])for(const lane of [1,2]){const dAt=s=>{const [a,c]=roadEdgesAt(s)[side];return a+(c-a)*lane/3;};ribbon(`dash-${side}-${lane}-${s}`,'paint',s,s+4,s=>dAt(s)-.065,s=>dAt(s)+.065,.16,0);}
  }
  // Long steel truss: railway inside its lower room, transverse floor beams and Warren web.
  const [A,C]=SIDE_S, panel=near?12.2:24.4, count=Math.round((C-A)/panel),step=(C-A)/count;
  for(const side of [-1,1])for(const off of [-1,-9.5]) {
    const d=side*12.05;
    ribbon(`chord-${side}-${off}`,'steel',A,C,d-.45,d+.45,off+.45,.9);
  }
  ribbon('railfloor','rail',A,C,-4.6,4.6,-8.7,.55);
  for(const d of [-2.934,-1.266,1.266,2.934])ribbon(`track-${d}`,'rail',A,C,d-.07,d+.07,-8.45,.25);
  for(let i=0;i<count;i++)for(const side of [-1,1]){
    const a=A+i*step,c=a+step,d=side*12.05,y0=DECK_H-9.5,y1=DECK_H-1;
    beam(`web-${side}-${i}`,'steel',[a,d,i%2?y1:y0],[c,d,i%2?y0:y1],.6,.55,1,false,[`chord-${side}-${i%2?-1:-9.5}`,`chord-${side}-${i%2?-9.5:-1}`]);
    if(near)beam(`vertical-${side}-${i}`,'steel',[a,d,y0],[a,d,y1],.5,.5,1,false,[`chord-${side}--9.5`,`chord-${side}--1`]);
  }
  for(let i=0;i<=count;i++){
    const s=A+i*step;
    beam(`floorbeam-${i}`,'steel',[s,-12.05,DECK_H-8.7],[s,12.05,DECK_H-8.7],.65,1.0,1,false,['chord--1--9.5','chord-1--9.5']);
    if(near)for(const d of [-2.1,2.1])box(`sleeper-${i}-${d}`,'rail',s,d,DECK_H-8.6,.24,2.5,.2);
  }
  // Tower legs and open transverse X panels, including the unmistakable crosses below the road.
  TOWER_S.forEach((s,t)=>{
    box(`foot-${t}`,'concrete',s,0,2,22,42,4,0);
    for(const side of [-1,1]) {
      const d=side*14.6,levels=[4,70,80,125,170,190.5];
      for(let i=1;i<levels.length;i++) {
        const lo=levels[i-1],hi=levels[i],width=i<3?3.7:3.05;
        box(`leg-${t}-${side}-${i}`,'steel',s,d,(lo+hi)/2,5.2,width,hi-lo,y=>Math.max(0,Math.min(1,(y-4)/(DECK_H-4))));
      }
      box(`saddle-${t}-${side}`,'steel',s,d,188.7,6,4.5,3.6,1);
    }
    for(const [k,lo,hi] of [[0,6,37],[1,38,69],[2,82,124],[3,126,168],[4,171,187]]){
      const legLow=k<2?1:k===2?3:k===3?4:5,legHigh=k<2?1:k===2?3:k===3?4:5;
      for(const side of [-1,1])beam(`X-${t}-${k}-${side}`,'steel',[s,-side*14.6,lo],[s,side*14.6,hi],1.05,1.1,y=>Math.min(1,y/DECK_H),false,[`leg-${t}-${-side}-${legLow}`,`leg-${t}-${side}-${legHigh}`]);
    }
    beam(`portal-${t}`,'steel',[s,-14.6,187.1],[s,14.6,187.1],2.0,2.1,1,false,[`leg-${t}--1-5`,`leg-${t}-1-5`]);
    beam(`bearing-${t}`,'steel',[s,-14.6,70],[s,14.6,70],1.3,1.8,1,false,[`leg-${t}--1-1`,`leg-${t}-1-1`]);
  });
  // Anchor houses hold all backstay ends. The north anchorages are the mapped split blocks.
  ANCHOR_S.forEach((s,k)=>{for(const side of [-1,1]){const target=k===1?NORTH_ANCHORS[side<0?0:1]:{s,d:side*15.1};box(`anchor-${k}-${side}`,'concrete',target.s,target.d,10,45,15.2,20,0);}});
  // Cable polylines use the same sample interpolation for suspenders, so endpoints truly contact.
  const spans=[[ANCHOR_S[0],TOWER_S[0],18,189,24],[TOWER_S[0],TOWER_S[1],189,189,104],[TOWER_S[1],ANCHOR_S[1],189,18,24]];
  for(const side of [-1,1])for(const auxiliary of [false,true])for(let k=0;k<3;k++) {
    const [a,c,ya,yc,sag]=spans[k],n=near?24:10,d=side*(auxiliary?15.2:14.35),radius=auxiliary?.1772:.293;
    const nodes=Array.from({length:n+1},(_,i)=>{const u=i/n,s=a+(c-a)*u,f=k===2?Math.max(0,(s-C)/(c-C)):0,target=NORTH_ANCHORS[side<0?0:1];return [s,d+(target.d-d)*f,ya+(yc-ya)*u-4*sag*u*(1-u)];});
    const name=i=>`cable-${side}-${auxiliary}-${k}-${i}`;
    for(let i=0;i<n;i++) {
      const first=k===0?`anchor-0-${side}`:`saddle-${k-1}-${side}`,last=k===2?`anchor-1-${side}`:`saddle-${k}-${side}`;
      beam(name(i),'steel',nodes[i],nodes[i+1],radius,radius,k===1?1:y=>Math.max(0,Math.min(1,(y-18)/171)),true,[i?name(i-1):first,i===n-1?last:name(i+1)]);
    }
    if(auxiliary)continue;
    // Suspenders only in the suspended deck, never through the ground at the anchor houses.
    const low=Math.max(a,A),high=Math.min(c,C),spacing=near?12.2:24.4;
    for(let s=Math.ceil(low/spacing)*spacing;s<high-1;s+=spacing) {
      const u=(s-a)/(c-a)*n,i=Math.min(n-1,Math.floor(u)),t=u-i,y=nodes[i][2]+(nodes[i+1][2]-nodes[i][2])*t;
      if(y<DECK_H+1)continue;
      // Paired hangers are seen as one thin tube at navigation scale.
      beam(`hanger-${side}-${k}-${s}`,'steel',[s,d,DECK_H-1],[s,nodes[i][1]+(nodes[i+1][1]-nodes[i][1])*t,y],near?.105:.14,.1,1,true,[`hanger-seat-${side}-${s}`,name(i)]);
      box(`hanger-seat-${side}-${s}`,'steel',s,side*13.2,DECK_H-1,1.0,3.0,1.0);
    }
  }
  // Approach viaduct bents placed at mapped supports; ends on fill once the ramp is low.
  const approaches=[[0,A],[C,L]];
  for(const [a,c]of approaches) {
    // The underside needs the identical transverse tessellation: otherwise its
    // wide diagonal bridges a DEM hollow and emerges above the fitted asphalt.
    for(const [name,side] of [['west',0],['east',1]])for(let i=0;i<12;i++){
      const edge=(s,u)=>{const [a,c]=roadEdgesAt(s)[side];return a+(c-a)*u;};
      split(`approach-${name}-${a}-${i}`,'concrete',a,c,s=>edge(s,i/12),s=>edge(s,(i+1)/12),-1.15,1.05);
    }
    const mapped=PIERS.filter(q=>q.s>a+8&&q.s<c-8).sort((a,b)=>a.s-b.s).filter((q,i,v)=>!i||q.s-v[i-1].s>8);
    const stations=mapped.slice();
    for(let s=a+65;s<c-30;s+=70)if(!mapped.some(q=>Math.abs(q.s-s)<35))stations.push({s});
    for(const q of stations) {
      const s=q.s,top=p.deckHeight(s)-2.2;
      if(top<1)continue;
      box(`cap-${s}`,'concrete',s,0,top,6.5,25,1.5);
      for(const d of [-8,8])box(`pier-${s}-${d}`,'concrete',s,d,Math.max(.1,(top-.75)/2),4.5,4.2,Math.max(.2,top-.75),y=>Math.max(0,Math.min(1,y/top)));
    }
  }
  // Replace the solid provider toll-plaza building with its actual open canopy.
  // Its surveyed OSM roof ring extends over the toll forecourt east of the A2.
  const canopyS=259, canopyBottom=p.deckHeight(canopyS)+6.6;
  const shape=new Shape(TOLL_RING.slice(0,-1).map(ll=>{const q=p.bridgeLocal(...ll);return new Vector3(q.x,-q.z,0);}));
  const roof=new ExtrudeGeometry(shape,{depth:.3,bevelEnabled:false});
  roof.rotateX(-Math.PI/2);roof.translate(0,canopyBottom,0);put('toll-canopy',roof,'rail',canopyS);
  for(const s of [250,267])for(const d of [-14,-6,48,67]){
    const name=`toll-post-${s}-${d}`;
    box(`toll-foot-${s}-${d}`,'concrete',s,d,.2,.8,.8,.4,0);
    box(name,'steel',s,d,(canopyBottom+.4)/2,.45,.45,canopyBottom-.4,y=>Math.max(0,(y-.4)/(canopyBottom-.4)));
    contacts.push({name,ends:[xyz(s,d,.4),xyz(s,d,canopyBottom)],supports:[`toll-foot-${s}-${d}`,'toll-canopy'],tolerance:.25});
  }
  SIDE_S.forEach((s,k)=>{
    box(`side-top-${k}`,'steel',s,0,DECK_H-1.05,7,29,1.4);
    box(`side-cap-${k}`,'concrete',s,0,DECK_H-9.6,7,29,1.4);
    for(const d of [-10,10])box(`side-shaft-${k}-${d}`,'concrete',s,d,(DECK_H-1.75)/2,5,5,DECK_H-1.75,y=>y/(DECK_H-1.75));
  });
  for(const [name,part] of Object.entries(parts))if(name.startsWith('chord-')||name.startsWith('track-')||name==='railfloor'){
    const d=name.startsWith('chord-')?(name.startsWith('chord--1')?-1:1)*12.05:name.startsWith('track-')?Number(name.slice(6)):0;
    const off=name.startsWith('chord-')?(name.endsWith('--1')?-1:-9.5):name==='railfloor'?-8.7:-8.45;
    contacts.push({name,ends:[xyz(A,d,DECK_H+off),xyz(C,d,DECK_H+off)],supports:name.endsWith('--1')?['side-top-0','side-top-1']:['side-cap-0','side-cap-1'],tolerance:2.0});
  }
  if(near)for(let s=A;s<C;s+=48.8)for(const side of [-1,1]) {
    beam(`lightpost-${side}-${s}`,'steel',[s,side*11.8,DECK_H],[s,side*11.8,DECK_H+5.5],.18,.18,1,false,[`maintenance-${side*11.9}-${1+Math.floor(s/L*4)}`,`head-${side}-${s}`]);
    box(`head-${side}-${s}`,'lamp',s,side*11.8,DECK_H+5.5,.8,.5,.3);
  }
  const root=b.finish();
  if(evidence)root.userData.evidence={parts,contacts};
  return root;
}
