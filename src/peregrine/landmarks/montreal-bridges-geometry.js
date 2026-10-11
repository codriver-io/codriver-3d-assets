import { VICTORIA, JACQUES } from './montreal-profiles.js';
import alignment from './montreal-alignments.js';
import { bridgeBuilder } from './asset-geometry.js';
import { addJacquesPavilion } from './jacques-pavilion-geometry.js';
import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Quaternion, Vector3 } from 'three';

// BoxGeometry face order; a solid keeps only the faces somebody can see.
const NY=3,PY=2;
function solid(w,h,d,skip=[]){
  const src=new BoxGeometry(w,h,d),pos=src.attributes.position,nor=src.attributes.normal,P=[],N=[],I=[];
  let n=0;
  for(let f=0;f<6;f++){
    if(skip.includes(f))continue;
    for(let v=f*4;v<f*4+4;v++){P.push(pos.getX(v),pos.getY(v),pos.getZ(v));N.push(nor.getX(v),nor.getY(v),nor.getZ(v));}
    for(let i=f*6;i<f*6+6;i++)I.push(src.index.getX(i)-f*4+n);
    n+=4;
  }
  const g=new BufferGeometry();
  g.setAttribute('position',new Float32BufferAttribute(P,3));g.setAttribute('normal',new Float32BufferAttribute(N,3));g.setIndex(I);
  src.dispose();return g;
}

// Hidden-face-free building blocks bound to one bridge builder.
function tools(b,p,detail){
  const far=detail==='far',h=p.deckHeight,up=new Vector3(0,1,0);
  // Deck-hugging ribbon with selectable faces (t top, b bottom, l/r sides): the samples of strip(), minus buried faces.
  function ribbon(mat,a,c,l,r,offset,thickness,faces,k=0){
    const step=p.meshStep||5,samples=new Set([a,c]);
    for(let s=Math.floor(a/step)*step+step;s<c;s+=step){
      const i=p.knots.findIndex(v=>v[0]>=s),from=p.knots[Math.max(0,i-1)],to=p.knots[Math.max(0,i)];
      if(from[1]!==to[1] || s%25===0)samples.add(s);
    }
    for(const v of p.ALIGNMENT)if(v.s>a&&v.s<c)samples.add(v.s);
    const stations=[...samples].sort((u,v)=>u-v),pos=[],idx=[];
    stations.forEach((s,i)=>{
      for(const [d,dy] of [[l,0],[r,0],[l,-thickness],[r,-thickness]])pos.push(...b.xyz(s,d,h(s)+offset+dy));
      if(!i)return;
      const x=(i-1)*4,y=i*4;
      if(faces.includes('t'))idx.push(x,x+1,y,x+1,y+1,y);
      if(faces.includes('b'))idx.push(x+2,y+2,x+3,x+3,y+2,y+3);
      if(faces.includes('l'))idx.push(x,y,x+2,x+2,y,y+2);
      if(faces.includes('r'))idx.push(x+1,x+3,y+1,x+3,y+3,y+1);
    });
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,k);
  }
  // Box in bridge coordinates without the faces listed in skip (usually the buried bottom).
  function block(mat,s,d,y,length,wide,tall,k=0,lift=1,skip=[]){
    const q=p.bridgePoint(s,d,y),g=solid(length,tall,wide,skip);
    g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);b.put(g,mat,k,lift);
  }
  // Truss member: an open prism (no end caps) when its ends meet other members, which is always the case in far.
  function member(mat,a,c,w,t=w,k=0,lift=1,open=far){
    if(!open)return b.beam(mat,a,c,w,t,k,lift);
    const av=new Vector3(...b.xyz(...a)),dir=new Vector3(...b.xyz(...c)).sub(av),len=dir.length();
    if(len<1e-5)return;
    const g=solid(w,len,t,[PY,NY]);
    g.applyQuaternion(new Quaternion().setFromUnitVectors(up,dir.normalize()));
    g.translate(...av.addScaledVector(dir,len/2).toArray());b.put(g,mat,k,lift);
  }
  // Tapered pier: its top is buried under the cap and its base under the ground, so neither is drawn.
  function pier(s,top,wide,depth,ice,k=0){
    if(top<1)return;
    const outline=ice?[[-depth/2,-wide/2],[depth/2,-wide/2],[depth/2,wide/2],[0,wide/2+8],[-depth/2,wide/2]]:[[-depth/2,-wide/2],[depth/2,-wide/2],[depth/2,wide/2],[-depth/2,wide/2]];
    const n=outline.length,pos=[],idx=[];
    for(const y of [-1,top])for(const [along,across] of outline){
      const f=y<0?1.12:1,d=ice && y>=0 && across>wide/2 ? wide/2 : across;pos.push(...b.xyz(s+along*f,d*f,y));
    }
    for(let i=0;i<n;i++){const j=(i+1)%n;idx.push(i,n+i,j,j,n+i,n+j);}
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    b.put(g,'stone',k,y=>Math.max(0,Math.min(1,(y+1)/(top+1))));
    block('concrete',s,0,top-0.3,depth+1,wide+1,0.6,k);
  }
  return {ribbon,block,member,pier};
}

// Slab, pavement and parapets. The slab top is cut to the strips that show (margins), the pavement is a closed 12 cm sheet
// standing on it and `bed` lists lateral ranges another surface covers: no concrete face lies hidden under a coplanar one.
function roadDeck(b,p,detail,t,bed=[]){
  const length=p.BRIDGE_LENGTH,half=p.halfWidth,h=p.deckHeight,far=detail==='far';
  const covered=[...p.ROAD_EDGES,...bed].sort((a,c)=>a[0]-c[0]),margins=[];
  let cursor=-half;
  for(const [l,r] of covered){if(l>cursor)margins.push([cursor,l]);cursor=Math.max(cursor,r);}
  if(cursor<half)margins.push([cursor,half]);
  for(let start=0;start<length;start+=500){
    const end=Math.min(length,start+500),chunk=detail==='near'?Math.floor(start/500):0;
    t.ribbon('concrete',start,end,-half,half,-0.12,0.9,'blr',chunk);
    for(const [l,r] of margins)b.strip('concrete',start,end,l,r,-0.12,0,chunk);
    for(const [left,right] of p.ROAD_EDGES){
      if(far)b.strip('asphalt',start,end,left,right,0,0,chunk);
      else t.ribbon('asphalt',start,end,left,right,0,0.12,'tlr',chunk);
      if(!far)for(const d of [left+0.25,right-0.25])b.strip('paint',start,end,d-0.065,d+0.065,0.025,0,chunk);
    }
    if(far)continue;
    for(const d of [-half+0.15,half-0.15])b.strip('rail',start,end,d-0.08,d+0.08,1.05,0.10,chunk);
    for(let s=start+4;s<end;s+=8)for(const d of [-half+0.15,half-0.15])t.block('rail',s,d,h(s)+0.55,0.1,0.1,1.1,chunk,1,[NY]);
  }
}

export function createVictoria({detail='near'}={}){
  const p=VICTORIA,b=bridgeBuilder(p,detail),t=tools(b,p,detail),h=p.deckHeight,L=p.BRIDGE_LENGTH,far=detail==='far';
  roadDeck(b,p,detail,t,[[-5,5]]);
  const piers=alignment.victoria.piers.map(v=>{const q=p.bridgeLocal(...v.center);return p.projectBridge(q.x,q.z);})
    .filter(q=>Math.abs(q.lateral)<14 && q.s>100 && q.s<1850).map(q=>q.s).sort((a,c)=>a-c);
  // The mapped outlines include two extra close supports at the rail fork.
  // Preserve the river's large central opening and the actual pier rhythm.
  const stations=[0,76,...piers,L-170,L-90,L];
  const cuts=[...new Set(stations.map(s=>Math.round(s*10)/10))].sort((a,c)=>a-c);
  for(const s of cuts.slice(1,-1))t.pier(s,h(s)-1.1,18,5.8,true,detail==='near'?Math.floor(s/500):0);
  for(let i=1;i<cuts.length;i++){
    const a=cuts[i-1],c=cuts[i],span=c-a;if(span<15)continue;
    const chunk=detail==='near'?Math.floor((a+c)/1000):0,panels=detail==='near'?8:4;
    const rise=span>95?16:11;
    const top=u=>rise*(u===0||u===panels?0.58:1);
    for(const d of [-5.5,5.5])for(let j=0;j<panels;j++){
      const s=a+span*j/panels,u=a+span*(j+1)/panels,hs=h(s),hu=h(u);
      if(far){
        // Far: one chord per two panels, a post and one diagonal per panel, a strut across the top every other panel.
        t.member('iron',[s,d,hs+top(j)],[u,d,hu+top(j+1)],0.5,0.55);
        if(j%2===0){const w=a+span*Math.min(panels,j+2)/panels;t.member('iron',[s,d,hs+0.5],[w,d,h(w)+0.5],0.45,0.7);}
        t.member('iron',[s,d,hs+0.5],[s,d,hs+top(j)],0.3,0.4);
        t.member('iron',[s,d,hs+0.5],[u,d,hu+top(j+1)],0.23,0.3);
        if(d<0&&j%2===0)t.member('iron',[s,-5.5,hs+top(j)],[s,5.5,hs+top(j)],0.2,0.25);
        continue;
      }
      b.beam('iron',[s,d,hs+0.5],[u,d,hu+0.5],0.45,0.7,chunk);
      b.beam('iron',[s,d,hs+top(j)],[u,d,hu+top(j+1)],0.5,0.55,chunk);
      b.beam('iron',[s,d,hs+0.5],[s,d,hs+top(j)],0.3,0.4,chunk);
      b.beam('iron',[s,d,hs+0.5],[u,d,hu+top(j+1)],0.23,0.3,chunk);
      b.beam('iron',[s,d,hs+top(j)],[u,d,hu+0.5],0.12,0.15,chunk);
      if(d<0){
        b.beam('iron',[s,-5.5,hs+top(j)],[s,5.5,hs+top(j)],0.2,0.25,chunk);
        b.beam('iron',[s,-5.5,hs+top(j)],[u,5.5,hu+top(j+1)],0.15,0.15,chunk);
      }
    }
    for(const d of [-5.5,5.5])t.member('iron',[c,d,h(c)],[c,d,h(c)+top(panels)],0.3,0.4,chunk);
  }
  // Railway bed, flush with the slab margins: its top is the only face.
  b.strip('iron',0,L,-5,5,-0.12);
  if(!far){
    for(const d of [-2.7,-1.265,1.265,2.7])b.strip('rail',0,L,d-0.045,d+0.045,0.15,0.15);
    for(let s=2;s<L;s+=2.5)t.block('stone',s,0,h(s),0.24,8.3,0.16,Math.floor(s/500),1,[NY]);
  }
  // Vertical-lift lock crossing, shown lowered. Four narrow towers and caps.
  const lock=p.landmarks.lock;
  for(const s of [lock-21,lock+21])for(const d of [-6.2,6.2]){
    const top=h(s)+28;
    for(const ds of [-1.3,1.3])t.member('concrete',[s+ds,d,0],[s+ds,d,top],0.75,1.1,0,y=>Math.min(1,Math.max(0,y/(h(s)||1))),true);
    t.block('concrete',s,d,top,4.5,3.5,2.2);
    if(!far)for(let y=5;y<top-2;y+=5)b.beam('iron',[s-1.3,d,y],[s+1.3,d,y+4],0.17,0.2);
  }
  return b.finish();
}

export function createJacquesCartier({detail='near'}={}){
  const p=JACQUES,b=bridgeBuilder(p,detail),t=tools(b,p,detail),h=p.deckHeight,L=p.BRIDGE_LENGTH,main=p.landmarks.main,far=detail==='far';
  const left=main-167.2,right=main+167.2,start=left-128,end=right+128;
  // Approach trusses run under a deck that starts at ground level: never let them hang more than 1 m below the datum.
  const low=y=>Math.max(y,-1);
  roadDeck(b,p,detail,t);
  // Four joined cantilever/anchor arms, with a 110m suspended centre.
  const nodes=[[start,7],[left,49],[main-55,13],[main+55,13],[right,49],[end,7]];
  const top=s=>{let i=1;while(i<nodes.length-1 && nodes[i][0]<s)i++;const a=nodes[i-1],c=nodes[i];return a[1]+(c[1]-a[1])*(s-a[0])/(c[0]-a[0]);};
  for(let k=1;k<nodes.length;k++){
    const a=nodes[k-1][0],c=nodes[k][0],n=Math.max(3,Math.round((c-a)/(detail==='near'?14:28)));
    for(let j=0;j<n;j++){
      const s=a+(c-a)*j/n,u=a+(c-a)*(j+1)/n;
      for(const d of [-10.2,10.2]){
        t.member('steel',[s,d,h(s)+1],[u,d,h(u)+1],0.7,0.9,1);
        t.member('steel',[s,d,h(s)+top(s)],[u,d,h(u)+top(u)],0.75,0.9,1);
        t.member('steel',[s,d,h(s)+1],[s,d,h(s)+top(s)],0.45,0.5,1);
        t.member('steel',[s,d,h(s)+1],[u,d,h(u)+top(u)],0.37,0.4,1);
        if(!far)b.beam('steel',[s,d,h(s)+top(s)],[u,d,h(u)+1],0.17,0.2,1);
      }
      t.member('steel',[s,-10.2,h(s)+top(s)],[s,10.2,h(s)+top(s)],0.3,0.45,1);
      if(!far)b.beam('steel',[s,-10.2,h(s)+top(s)],[u,10.2,h(u)+top(u)],0.2,0.25,1);
    }
  }
  for(const s of [start,left,right,end])t.pier(s,h(s)-1.1,22,s===left||s===right?10:5,false,1);
  for(const s of [left,right]){
    t.member('steel',[s,-10.2,h(s)+49],[s,10.2,h(s)+49],0.7,1,1);
    for(const d of [-10.2,10.2]){
      // The familiar four finials are 4.6m ornaments, not extra pylons.
      t.block('steel',s,d,h(s)+49.3,3,3,0.7,1);
      for(const ds of [-1.15,1.15])for(const dd of [-1.15,1.15])b.beam('steel',[s+ds,d+dd,h(s)+49.6],[s,d,h(s)+54.2],0.18,0.2,1);
      t.block('steel',s,d,h(s)+52,1.5,1.5,0.3,1);
    }
  }
  // Deck trusses on approach spans; north supports are braced steel towers.
  for(const [a,c] of [[0,start],[end,L]]){
    const n=Math.ceil((c-a)/75);
    for(let i=0;i<n;i++){
      const s=a+(c-a)*i/n,u=a+(c-a)*(i+1)/n,chunk=detail==='near'?(s<start?0:2+Math.floor((s-end)/500)):2;
      for(const d of [-9,9]){
        t.member('steel',[s,d,low(h(s)-1.2)],[u,d,low(h(u)-1.2)],0.3,0.5,chunk);
        t.member('steel',[s,d,low(h(s)-7)],[u,d,low(h(u)-7)],0.4,0.55,chunk);
        const panels=far?3:6;
        for(let j=0;j<panels;j++){
          const x=s+(u-s)*j/panels,y=s+(u-s)*(j+1)/panels;
          if(far){
            // Far: a single Warren diagonal per panel.
            const up=j%2===0;
            t.member('steel',[x,d,low(h(x)-(up?7:1.2))],[y,d,low(h(y)-(up?1.2:7))],0.3,0.35,chunk);
            continue;
          }
          b.beam('steel',[x,d,low(h(x)-1.2)],[y,d,low(h(y)-7)],0.3,0.35,chunk);
          b.beam('steel',[x,d,low(h(x)-7)],[y,d,low(h(y)-1.2)],0.26,0.3,chunk);
        }
      }
      if(i && s<start && h(s)>6){
        const lift=y=>Math.max(0,Math.min(1,y/(h(s)-7)));
        for(const d of [-8,8])for(const ds of [-3,3])t.member('steel',[s+ds*1.5,d*1.15,0],[s+ds,d,h(s)-7],0.65,0.7,chunk,lift);
        if(!far)for(let y=0;y<h(s)-8;y+=8){
          const hi=Math.min(h(s)-7,y+8);
          b.beam('steel',[s,-8,y],[s,8,hi],0.35,0.4,chunk,lift);
          b.beam('steel',[s,8,y],[s,-8,hi],0.35,0.4,chunk,lift);
        }
      }else if(i && Math.abs(s-p.landmarks.channel)>130 && Math.abs(s-p.landmarks.island)>65)t.pier(s,h(s)-7,20,5,false,chunk);
    }
  }
  // Raised Seaway Warren through-truss; no pier in the shipping channel.
  const channel=p.landmarks.channel;
  for(let i=0;i<8;i++){
    const s=channel-120+i*30,u=s+30;
    for(const d of [-10.2,10.2]){
      t.member('steel',[s,d,h(s)+14],[u,d,h(u)+14],0.5,0.6,3);
      t.member('steel',[s,d,h(s)+(i%2?14:0.8)],[u,d,h(u)+(i%2?0.8:14)],0.5,0.6,3);
    }
    t.member('steel',[s,-10.2,h(s)+14],[s,10.2,h(s)+14],0.3,0.4,3);
  }
  for(const s of [channel-120,channel+120])t.pier(s,h(s)-1.1,22,6,false,3);
  addJacquesPavilion(b,p,detail);
  if(!far)for(let s=0;s<L;s+=15)for(const d of [-5.49,-1.83,1.83,5.49])b.strip('paint',s,Math.min(s+6,L),d-0.07,d+0.07,0.025,0,Math.floor(s/500));
  return b.finish();
}
