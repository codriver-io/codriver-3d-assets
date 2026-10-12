import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Vector3, Quaternion } from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { PROFILE as p, DECK_HALF, TRUSS_D, TRUSS_START, ANCHOR_N, MAIN_N, TIP_N, TIP_S, MAIN_S, ANCHOR_S, MID, PIER_S, STRUCTURE_END, TAPER, landingBlend, authoredLateral } from './ironworkers-memorial-bridge-profile.js';
const clamp = (x) => Math.max(0,Math.min(1,x));
export function bottomY(s) {
  if(s<ANCHOR_N) return p.deckHeight(s)-8.2;
  if(s<=MAIN_N) { const t=(s-ANCHOR_N)/142; return 7+(p.deckHeight(ANCHOR_N)-8.2-7)*(1-t*t); }
  if(s<TIP_N) { const t=(s-MAIN_N)/116; return 7+(p.deckHeight(TIP_N)-7.3-7)*(2*t-t*t); }
  if(s<=TIP_S) return p.deckHeight(s)-7.3;
  if(s<MAIN_S) { const t=(MAIN_S-s)/116; return 7+(p.deckHeight(TIP_S)-7.3-7)*(2*t-t*t); }
  const t=(ANCHOR_S-s)/142;return 7+(p.deckHeight(ANCHOR_S)-8.2-7)*(1-t*t);
}
// Lower main-pier shoes stay on the caisson; the web stretches from those feet to the deck.
function liftAt(s,y){
  if(s<ANCHOR_N||s>ANCHOR_S)return 1;
  const nearest=Math.min(Math.abs(s-MAIN_N),Math.abs(s-MAIN_S));
  const w=clamp(nearest/116),lo=bottomY(s),hi=p.deckHeight(s)-1.3;
  return w+(1-w)*clamp((y-lo)/Math.max(1,hi-lo));
}
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder(p.CHAMPLAIN,detail),audit=[],counts=new Map();
  const chunk=(s)=>near?(s<ANCHOR_N?0:s<TIP_S?1:2):0;
  const xyz=(s,d,y)=>{const q=p.bridgePoint(s,authoredLateral(s,d),y);return [q.x,y,q.z];};
  function put(id,g,mat,ck=0,lift=1,ends=null,supports=null){
    const key=`${ck}:${mat}`,start=counts.get(key)||0;counts.set(key,start+g.index.count);
    b.put(g,mat,ck,lift);
    const last=audit.at(-1);
    if(id.startsWith('deck-')&&last?.id===id&&last.key===key&&last.start+last.count===start)last.count+=g.index.count;
    else audit.push({id,key,start,count:g.index.count,ends,supports});
  }
  function box(id,mat,s,d,y,along,across,up,ck=chunk(s),lift=1){
    const q=p.bridgePoint(s,d,y),g=new BoxGeometry(along,up,across);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);
    const pos=g.attributes.position;
    for(let i=0;i<pos.count;i++){
      const v=p.projectBridge(pos.getX(i),pos.getZ(i)),shift=authoredLateral(v.s,v.lateral)-v.lateral;
      pos.setX(i,pos.getX(i)-v.tz*shift);pos.setZ(i,pos.getZ(i)+v.tx*shift);
    }
    g.computeVertexNormals();put(id,g,mat,ck,lift);
  }
  function beam(id,mat,A,B,width,supports,ck=chunk((A[0]+B[0])/2),depth=width,lift=1){
    const a=new Vector3(...xyz(...A)),c=new Vector3(...xyz(...B)),v=c.clone().sub(a);
    const g=new BoxGeometry(width,v.length(),depth);g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),v.normalize()));g.translate(...a.clone().add(c).multiplyScalar(.5).toArray());
    if(lift==='web'){
      const aPos=g.attributes.position,weights=[];
      for(let i=0;i<aPos.count;i++){const q=p.projectBridge(aPos.getX(i),aPos.getZ(i));weights.push(liftAt(q.s,aPos.getY(i)));}
      put(id,g,mat,ck,1,[a.toArray(),c.toArray()],supports);
      g.attributes.bridgeLift.array.set(weights);
    }else put(id,g,mat,ck,lift,[a.toArray(),c.toArray()],supports);
  }
  function strip(id,mat,a,c,left,right,offset,thickness,ck){
    const step=near?12:30,ss=new Set([a,c]);for(let s=Math.ceil(a/step)*step;s<c;s+=step)ss.add(s);
    const bankStep=near?2:3;for(let s=Math.ceil(Math.max(a,ANCHOR_S-60)/bankStep)*bankStep;s<c;s+=bankStep)ss.add(s);
    for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)ss.add(q.s);
    for(const s of [TAPER,p.BRIDGE_LENGTH-TAPER,TRUSS_START,ANCHOR_N,MAIN_N,TIP_N,MID,TIP_S,MAIN_S,ANCHOR_S])if(s>a&&s<c)ss.add(s);
    const stations=[...ss].sort((x,y)=>x-y).filter((v,i,all)=>!i||i===all.length-1||v-all[i-1]>.5),pos=[],idx=[];
    for(let i=0;i<stations.length;i++){
      const s=stations[i],t=Math.max(.02,1-landingBlend(s));
      const trim=id.startsWith('walk-')||id.startsWith('barrier-')||id.startsWith('median-');
      const landing=landingBlend(s),deck=id.startsWith('deck-'),pavement=id.startsWith('pavement-');
      const h=p.deckHeight(s)+offset+(deck?.02*landing:0);
      const depth=deck?thickness*Math.max(.02,1-landing):thickness+(pavement?.02*landing:0);
      for(const [d,y] of [[left,h],[right,h],[left,h-depth],[right,h-depth]]){
        if(id.startsWith('median-')){const q=p.bridgePoint(s,d*t,y);pos.push(q.x,y,q.z);}else pos.push(...xyz(s,d,y));
      }
      if(!i)continue;const x=(i-1)*4,y=i*4;
      idx.push(x,x+1,y,x+1,y+1,y);
      if(!trim)idx.push(x+2,y+2,x+3,x+3,y+2,y+3);
      idx.push(x,y,x+2,x+2,y,y+2,x+1,x+3,y+1,x+3,y+3,y+1);
    }
    const n=(stations.length-1)*4;idx.push(0,2,1,1,2,3,n,n+1,n+2,n+1,n+3,n+2);
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    const walk=id.startsWith('walk-');
    const bottom=s=>p.deckHeight(s)+offset-thickness;
    put(id,g,mat,ck,1,walk?[xyz(a,(left+right)/2,bottom(a)),xyz(c,(left+right)/2,bottom(c))]:null,walk?[`deck-${ck}`,`deck-${ck}`]:null);
  }
  const L=p.BRIDGE_LENGTH,cuts=near?[0,ANCHOR_N,TIP_S,L]:[0,L];
  for(let k=1;k<cuts.length;k++){
    const a=cuts[k-1],c=cuts[k],ck=chunk((a+c)/2);
    const deckCuts=[...new Set([a,c,...[TAPER,L-TAPER].filter(s=>s>a&&s<c)])].sort((x,y)=>x-y);
    for(let j=1;j<deckCuts.length;j++){
      const start=deckCuts[j-1],end=deckCuts[j],landing=start<TAPER||end>L-TAPER;
      for(const [left,right] of landing?[[-DECK_HALF,-.22],[.22,DECK_HALF]]:[[-DECK_HALF,DECK_HALF]])
        strip(`deck-${ck}`,'concrete',start,end,left,right,-.22,1.08,ck);
    }
    for(const [side,l,r] of [[0,-11.15,-.22],[1,.22,11.15]]){
      const n=c>ANCHOR_S-60?3:1;for(let lane=0;lane<n;lane++)strip(`pavement-${ck}-${side}-${lane}`,'asphalt',a,c,l+(r-l)*lane/n,l+(r-l)*(lane+1)/n,-.10,.08,ck);
    }
    for(const d of [-1,1]){
      strip(`walk-${ck}-${d}`,'concrete',a,c,d<0?-13.6:11.75,d<0?-11.75:13.6,.10,.33,ck);
      // Supported edge parapets narrow with their connected paths.
      strip(`barrier-${ck}-${d}`,'barrier',a,c,d<0?-11.75:11.2,d<0?-11.2:11.75,1.0,1.1,ck);
    }
    const medianStart=Math.max(a,TAPER),medianEnd=Math.min(c,L-TAPER);
    if(medianEnd>medianStart)strip(`median-${ck}`,'barrier',medianStart,medianEnd,-.22,.22,.8,1.05,ck);
  }
  // Main and north approach deck trusses; the curved lower chords are fully open.
  const runs=[[TRUSS_START,TRUSS_START+85.9,near?8:4],[TRUSS_START+85.9,TRUSS_START+171.8,near?8:4],
    [TRUSS_START+171.8,TRUSS_START+257.7,near?8:4],[TRUSS_START+257.7,ANCHOR_N,near?8:4],
    [ANCHOR_N,MAIN_N,near?10:6],[MAIN_N,TIP_N,near?8:6],[TIP_N,TIP_S,near?8:4],[TIP_S,MAIN_S,near?8:6],[MAIN_S,ANCHOR_S,near?10:6]];
  const joints=new Set();
  for(const d of [-TRUSS_D,TRUSS_D])for(let r=0;r<runs.length;r++){
    const [a,c,n]=runs[r],nodes=[];
    for(let i=0;i<=n;i++){
      const s=a+(c-a)*i/n,top=p.deckHeight(s)-1.3,bot=bottomY(s),key=`${d}:${s.toFixed(3)}`;
      const t=`joint-top:${key}`,lo=`joint-bottom:${key}`;
      if(!joints.has(key)){joints.add(key);box(t,'steel',s,d,top,near?1.2:1.35,.95,1.1,chunk(s));
      box(lo,'steel',s,d,bot,near?1.25:1.4,1.05,1.05,chunk(s),liftAt(s,bot));
      beam(`vertical:${key}`,'steel',[s,d,bot],[s,d,top],near?.56:.68,[lo,t],chunk(s),.48,'web');
      if(near||i%2===0||i===n){
        // Cross-floor beams connect the two top chords beneath all six lanes.
        if(d>0)beam(`floor:${key}`,'steel',[s,-TRUSS_D,top],[s,TRUSS_D,top],.48,[`joint-top:${-TRUSS_D}:${s.toFixed(3)}`,t],chunk(s),.6);
      }
      }
      nodes.push({s,top,bot,t,lo});
      if(i){const q=nodes[i-1];
        beam(`top-chord:${key}`,'steel',[q.s,d,q.top],[s,d,top],near?.82:.94,[q.t,t],chunk((q.s+s)/2),.68);
        beam(`bottom-chord:${key}`,'steel',[q.s,d,q.bot],[s,d,bot],near?.95:1.06,[q.lo,lo],chunk((q.s+s)/2),.76,'web');
        const up=(r<5?i%2===0:i%2!==0);
        beam(`diagonal:${key}`,'steel',up?[q.s,d,q.bot]:[q.s,d,q.top],up?[s,d,top]:[s,d,bot],near?.53:.67,up?[q.lo,t]:[q.t,lo],chunk((q.s+s)/2),.48,'web');
        if(near&&d>0){
          // Bottom lateral bracing ties the opposing chord nodes, sharing their lift weights.
          beam(`lateral:${key}`,'steel',[q.s,-TRUSS_D,q.bot],[s,TRUSS_D,bot],.29,[`joint-bottom:${-TRUSS_D}:${q.s.toFixed(3)}`,lo],chunk((q.s+s)/2),.29,'web');
        }
      }
    }
  }
  // Four main/anchor caissons and four north truss piers. Main shoes rest on the low concrete pedestals.
  for(let i=0;i<PIER_S.length;i++){
    const s=PIER_S[i],main=i===5||i===6,top=bottomY(s)-.3,ck=chunk(s);
    box(`foot:${i}`,'concrete',s,0,.65,main?13:7.2,main?27:25,1.3,ck,0);
    for(const d of [-TRUSS_D,TRUSS_D]){
      box(`shaft:${i}:${d}`,'concrete',s,d,(1.1+top)/2,main?5.5:3.4,main?4.9:2.7,top-1.1,ck,main?0:y=>clamp((y-1.1)/(top-1.1)));
      box(`shoe:${i}:${d}`,'steel',s,d,top+.1,2.7,2.3,.5,ck,main?0:1);
    }
    if(!main)box(`cap:${i}`,'concrete',s,0,top-.6,4.1,23.4,1.4,ck);
  }
  // Nine concrete north approach spans. Twin columns and transverse caps, with the head on the girders.
  // Land-end fascia/girders finish inside the landing instead of exposing an
  // underground square cap across the connected provider roads.
  const girderRuns=[[25,TRUSS_START],[ANCHOR_S,L-25]];
  for(let r=0;r<girderRuns.length;r++){
    const [a,c]=girderRuns[r],n=r===0?9:Math.ceil((c-a)/35);
    for(let i=0;i<=n;i++){
      const s=a+(c-a)*i/n,top=p.deckHeight(s)-2.6,ck=chunk(s);
      if(top>2)for(const d of [-8.5,8.5])box(`approach-pier:${r}:${i}:${d}`,'concrete',s,d,top/2,2.7,2.7,top,ck,y=>clamp(y/top));
      box(`approach-cap:${r}:${i}`,'concrete',s,0,top+.1,3.7,22.5,1,ck);
    }
    for(const d of (near?[-9,-3,3,9]:[-9,9])){
      strip(`girder:${r}:${d}`,'concrete',a,c,d-.33,d+.33,-1.05,1.15,chunk((a+c)/2));
      const e=audit.at(-1);e.ends=[xyz(a,d,p.deckHeight(a)-2.2),xyz(c,d,p.deckHeight(c)-2.2)];e.supports=[`approach-cap:${r}:0`,`approach-cap:${r}:${n}`];
    }
  }
  // Safety fencing survives far as rails/posts; fine pickets, paint and curved lamp arms are near only.
  const railStep=near?10:40,rows=[];
  for(let s=0;s<L;s+=railStep)rows.push(s);rows.push(L);
  for(const d of [-13.65,13.65])for(let i=0;i<rows.length;i++){
    const s=rows[i],h=p.deckHeight(s),ck=chunk(s),post=`fence-post:${d}:${i}`;
    const scale=s=>Math.max(.02,1-landingBlend(s));
    box(post,'rail',s,d,h+.1+1.45*scale(s),.13,.13,2.9*scale(s),ck);
    if(i){const a=rows[i-1];for(const offset of near?[.3,3]:[3])beam(`fence-rail:${d}:${i}:${offset}`,'rail',[a,d,p.deckHeight(a)+.1+(offset-.1)*scale(a)],[s,d,h+.1+(offset-.1)*scale(s)],(near?.095:.16)*Math.max(.02,scale(s)),[`fence-post:${d}:${i-1}`,post],ck);}
    if(near&&i)for(let t=rows[i-1]+.5;t<s;t+=.5){
      const y=p.deckHeight(t)+.1,pts=[xyz(t-.028,d,y),xyz(t+.028,d,y),xyz(t-.028,d,y+2.9*scale(t)),xyz(t+.028,d,y+2.9*scale(t))],g=new BufferGeometry();
      g.setAttribute('position',new Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,1,3,2,2,1,0,2,3,1]);g.computeVertexNormals();put(`picket:${d}:${t}`,g,'rail',chunk(t));
    }
  }
  for(let s=20;s<L-10;s+=near?60:120)for(const d of [-12.7,12.7]){
    if(s<TAPER/2||s>L-TAPER/2)continue;
    const h=p.deckHeight(s),ck=chunk(s),id=`lamp:${s}:${d}`;
    box(`${id}-base`,'rail',s,d,h+.25,.42,.42,.5,ck);
    const headD=d-Math.sign(d)*3.4;
    box(`${id}-head`,near?'lamp':'rail',s,headD,h+7.5,1.2,.45,.25,ck);
    beam(`${id}-pole`,'rail',[s,d,h+.25],[s,d,h+7.15],.18,[`${id}-base`,`${id}-arm-joint`],ck);
    box(`${id}-arm-joint`,'rail',s,d,h+7.15,.25,.25,.3,ck);
    beam(`${id}-arm`,'rail',[s,d,h+7.15],[s,headD,h+7.5],.14,[`${id}-arm-joint`,`${id}-head`],ck);
    if(near)beam(`${id}-brace`,'rail',[s,d,h+5.8],[s,headD+Math.sign(d)*.6,h+7.4],.09,[`${id}-pole`,`${id}-arm`],ck);
  }
  if(near)for(const d of [-7.6,-4.1,4.1,7.6])for(let s=5;s<L-5;s+=12)strip(`dash:${s}:${d}`,'paint',s,s+4,d-.06,d+.06,.04,.025,chunk(s));
  const model=b.finish();
  // Non-exported geometric audit: named member/support triangle ranges in the actual merged meshes.
  Object.defineProperty(model,'contactAudit',{value:audit});
  return model;
}
