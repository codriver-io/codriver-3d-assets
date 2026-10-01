import { VICTORIA, JACQUES } from './montreal-profiles.js';
import alignment from './montreal-alignments.js';
import { bridgeBuilder } from './asset-geometry.js';
import { addJacquesPavilion } from './jacques-pavilion-geometry.js';

function roadDeck(b,p,detail){
  const length=p.BRIDGE_LENGTH,half=p.halfWidth,h=p.deckHeight;
  for(let start=0;start<length;start+=500){
    const end=Math.min(length,start+500),chunk=detail==='near'?Math.floor(start/500):0;
    b.strip('concrete',start,end,-half,half,-0.12,0.9,chunk);
    for(const [left,right] of p.ROAD_EDGES){
      b.strip('asphalt',start,end,left,right,0,0,chunk);
      if(detail==='near')for(const d of [left+0.25,right-0.25])b.strip('paint',start,end,d-0.065,d+0.065,0.025,0,chunk);
    }
    for(const d of [-half+0.15,half-0.15])b.strip('rail',start,end,d-0.08,d+0.08,1.05,0.10,chunk);
    if(detail==='near')for(let s=start+4;s<end;s+=8)for(const d of [-half+0.15,half-0.15])b.box('rail',s,d,h(s)+0.55,0.1,0.1,1.1,chunk);
  }
}

export function createVictoria({detail='near'}={}){
  const p=VICTORIA,b=bridgeBuilder(p,detail),h=p.deckHeight,L=p.BRIDGE_LENGTH;
  roadDeck(b,p,detail);
  const piers=alignment.victoria.piers.map(v=>{const q=p.bridgeLocal(...v.center);return p.projectBridge(q.x,q.z);})
    .filter(q=>Math.abs(q.lateral)<14 && q.s>100 && q.s<1850).map(q=>q.s).sort((a,c)=>a-c);
  // The mapped outlines include two extra close supports at the rail fork.
  // Preserve the river's large central opening and the actual pier rhythm.
  const stations=[0,76,...piers,L-170,L-90,L];
  const cuts=[...new Set(stations.map(s=>Math.round(s*10)/10))].sort((a,c)=>a-c);
  for(const s of cuts.slice(1,-1))b.pier(s,h(s)-1.1,18,5.8,true,detail==='near'?Math.floor(s/500):0);
  for(let i=1;i<cuts.length;i++){
    const a=cuts[i-1],c=cuts[i],span=c-a;if(span<15)continue;
    const chunk=detail==='near'?Math.floor((a+c)/1000):0,panels=detail==='near'?8:4;
    const rise=span>95?16:11;
    const top=t=>rise*(t===0||t===panels?0.58:1);
    for(const d of [-5.5,5.5])for(let j=0;j<panels;j++){
      const s=a+span*j/panels,t=a+span*(j+1)/panels,hs=h(s),ht=h(t);
      b.beam('iron',[s,d,hs+0.5],[t,d,ht+0.5],0.45,0.7,chunk);
      b.beam('iron',[s,d,hs+top(j)],[t,d,ht+top(j+1)],0.5,0.55,chunk);
      b.beam('iron',[s,d,hs+0.5],[s,d,hs+top(j)],0.3,0.4,chunk);
      b.beam('iron',[s,d,hs+0.5],[t,d,ht+top(j+1)],0.23,0.3,chunk);
      if(detail==='near')b.beam('iron',[s,d,hs+top(j)],[t,d,ht+0.5],0.12,0.15,chunk);
      if(d<0){
        b.beam('iron',[s,-5.5,hs+top(j)],[s,5.5,hs+top(j)],0.2,0.25,chunk);
        b.beam('iron',[s,-5.5,hs+top(j)],[t,5.5,ht+top(j+1)],0.15,0.15,chunk);
        b.beam('iron',[s,-10.5,hs-0.5],[s,10.5,hs-0.5],0.45,0.5,chunk);
      }
    }
    for(const d of [-5.5,5.5])b.beam('iron',[c,d,h(c)],[c,d,h(c)+top(panels)],0.3,0.4,chunk);
  }
  b.strip('iron',0,L,-5,5,-0.1,0.3);
  for(const d of [-2.7,-1.265,1.265,2.7])b.strip('rail',0,L,d-0.045,d+0.045,0.15,0.15);
  if(detail==='near')for(let s=2;s<L;s+=2.5)b.box('stone',s,0,h(s),0.24,8.3,0.16,Math.floor(s/500));
  // Vertical-lift lock crossing, shown lowered. Four narrow towers and caps.
  const lock=p.landmarks.lock;
  for(const s of [lock-21,lock+21])for(const d of [-6.2,6.2]){
    const top=h(s)+28;
    for(const ds of [-1.3,1.3])b.beam('concrete',[s+ds,d,0],[s+ds,d,top],0.75,1.1,0,y=>Math.min(1,Math.max(0,y/(h(s)||1))));
    b.box('concrete',s,d,top,4.5,3.5,2.2);
    for(let y=5;y<top-2;y+=5)b.beam('iron',[s-1.3,d,y],[s+1.3,d,y+4],0.17,0.2);
  }
  return b.finish();
}

export function createJacquesCartier({detail='near'}={}){
  const p=JACQUES,b=bridgeBuilder(p,detail),h=p.deckHeight,L=p.BRIDGE_LENGTH,main=p.landmarks.main;
  const left=main-167.2,right=main+167.2,start=left-128,end=right+128;
  roadDeck(b,p,detail);
  // Four joined cantilever/anchor arms, with a 110m suspended centre.
  const nodes=[[start,7],[left,49],[main-55,13],[main+55,13],[right,49],[end,7]];
  const top=s=>{let i=1;while(i<nodes.length-1 && nodes[i][0]<s)i++;const a=nodes[i-1],c=nodes[i];return a[1]+(c[1]-a[1])*(s-a[0])/(c[0]-a[0]);};
  for(let k=1;k<nodes.length;k++){
    const a=nodes[k-1][0],c=nodes[k][0],n=Math.max(3,Math.round((c-a)/(detail==='near'?14:28)));
    for(let j=0;j<n;j++){
      const s=a+(c-a)*j/n,t=a+(c-a)*(j+1)/n;
      for(const d of [-10.2,10.2]){
        b.beam('steel',[s,d,h(s)+1],[t,d,h(t)+1],0.7,0.9,1);
        b.beam('steel',[s,d,h(s)+top(s)],[t,d,h(t)+top(t)],0.75,0.9,1);
        b.beam('steel',[s,d,h(s)+1],[s,d,h(s)+top(s)],0.45,0.5,1);
        b.beam('steel',[s,d,h(s)+1],[t,d,h(t)+top(t)],0.37,0.4,1);
        if(detail==='near')b.beam('steel',[s,d,h(s)+top(s)],[t,d,h(t)+1],0.17,0.2,1);
      }
      b.beam('steel',[s,-10.2,h(s)+top(s)],[s,10.2,h(s)+top(s)],0.3,0.45,1);
      b.beam('steel',[s,-10.2,h(s)+top(s)],[t,10.2,h(t)+top(t)],0.2,0.25,1);
      b.beam('steel',[s,-11.5,h(s)-0.6],[s,11.5,h(s)-0.6],0.45,0.7,1);
    }
  }
  for(const s of [start,left,right,end])b.pier(s,h(s)-1.1,22,s===left||s===right?10:5,false,1);
  for(const s of [left,right]){
    b.beam('steel',[s,-10.2,h(s)+49],[s,10.2,h(s)+49],0.7,1,1);
    for(const d of [-10.2,10.2]){
      // The familiar four finials are 4.6m ornaments, not extra pylons.
      b.box('steel',s,d,h(s)+49.3,3,3,0.7,1);
      for(const ds of [-1.15,1.15])for(const dd of [-1.15,1.15])b.beam('steel',[s+ds,d+dd,h(s)+49.6],[s,d,h(s)+54.2],0.18,0.2,1);
      b.box('steel',s,d,h(s)+52,1.5,1.5,0.3,1);
    }
  }
  // Deck trusses on approach spans; north supports are braced steel towers.
  for(const [a,c] of [[0,start],[end,L]]){
    const n=Math.ceil((c-a)/75);
    for(let i=0;i<n;i++){
      const s=a+(c-a)*i/n,t=a+(c-a)*(i+1)/n,chunk=detail==='near'?(s<start?0:2+Math.floor((s-end)/500)):2;
      for(const d of [-9,9]){
        b.beam('steel',[s,d,h(s)-1.2],[t,d,h(t)-1.2],0.3,0.5,chunk);
        b.beam('steel',[s,d,h(s)-7],[t,d,h(t)-7],0.4,0.55,chunk);
        const panels=detail==='near'?6:3;
        for(let j=0;j<panels;j++){
          const u=s+(t-s)*j/panels,v=s+(t-s)*(j+1)/panels;
          b.beam('steel',[u,d,h(u)-1.2],[v,d,h(v)-7],0.3,0.35,chunk);
          b.beam('steel',[u,d,h(u)-7],[v,d,h(v)-1.2],0.26,0.3,chunk);
        }
      }
      if(i && s<start && h(s)>6){
        for(const d of [-8,8])for(const ds of [-3,3])b.beam('steel',[s+ds*1.5,d*1.15,0],[s+ds,d,h(s)-7],0.65,0.7,chunk,y=>Math.max(0,Math.min(1,y/(h(s)-7))));
        for(let y=0;y<h(s)-8;y+=8){
          const top=Math.min(h(s)-7,y+8);
          b.beam('steel',[s,-8,y],[s,8,top],0.35,0.4,chunk,y=>Math.max(0,Math.min(1,y/(h(s)-7))));
          b.beam('steel',[s,8,y],[s,-8,top],0.35,0.4,chunk,y=>Math.max(0,Math.min(1,y/(h(s)-7))));
        }
      }else if(i && Math.abs(s-p.landmarks.channel)>130 && Math.abs(s-p.landmarks.island)>65)b.pier(s,h(s)-7,20,5,false,chunk);
    }
  }
  // Raised Seaway Warren through-truss; no pier in the shipping channel.
  const channel=p.landmarks.channel;
  for(let i=0;i<8;i++){
    const s=channel-120+i*30,t=s+30;
    for(const d of [-10.2,10.2]){
      b.beam('steel',[s,d,h(s)+14],[t,d,h(t)+14],0.5,0.6,3);
      b.beam('steel',[s,d,h(s)+(i%2?14:0.8)],[t,d,h(t)+(i%2?0.8:14)],0.5,0.6,3);
    }
    b.beam('steel',[s,-10.2,h(s)+14],[s,10.2,h(s)+14],0.3,0.4,3);
  }
  for(const s of [channel-120,channel+120])b.pier(s,h(s)-1.1,22,6,false,3);
  addJacquesPavilion(b,p,detail);
  if(detail==='near')for(let s=0;s<L;s+=15)for(const d of [-5.49,-1.83,1.83,5.49])b.strip('paint',s,Math.min(s+6,L),d-0.07,d+0.07,0.025,0,Math.floor(s/500));
  return b.finish();
}
