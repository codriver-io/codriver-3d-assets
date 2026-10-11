import { BufferGeometry, Float32BufferAttribute } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p,LENGTH as L,STRUCTURE_START as A,STRUCTURE_END as C,PIER_S,MAIN_PIERS,BOX_CENTRES,halfWidth,girderDepth,CREST } from './viaduc-de-calix-profile.js';

export function create({ detail='near' }={}) {
  const near=detail==='near', b=bridgeBuilder(p,detail), h=p.deckHeight;
  const chunk=s=>near?Math.min(3,Math.floor(s/(L/4))):0;
  // Closed section lofts keep the bridge's two independent box soffits and broad slab.
  // Rings run clockwise looking along increasing station; end caps close every ribbon.
  function loft(mat,a,c,section,{ step=near?8:32,lift=1 }={}) {
    const cuts=[a,...(near?[L/4,L/2,3*L/4].filter(s=>s>a&&s<c):[]),c];
    for(let k=1;k<cuts.length;k++) {
      const u=cuts[k-1],v=cuts[k], samples=new Set([u,v]);
      for(let s=Math.ceil(u/step)*step;s<v;s+=step)samples.add(s);
      for(const s of [...p.ALIGNMENT.map(q=>q.s),...PIER_S,CREST,...PIER_S.slice(1).map((s,i)=>(s+PIER_S[i])/2)])if(s>u&&s<v)samples.add(s);
      const ss=[...samples].sort((a,c)=>a-c).filter((s,i,arr)=>!i||s-arr[i-1]>.001);
      const rows=ss.map(s=>section(s).map(([d,y])=>b.xyz(s,d,y))), pos=[],idx=[];
      function tri(a,c,d) {
        const q=c.map((v,i)=>v-a[i]),r=d.map((v,i)=>v-a[i]);
        if(Math.hypot(q[1]*r[2]-q[2]*r[1],q[2]*r[0]-q[0]*r[2],q[0]*r[1]-q[1]*r[0])<1e-8)return;
        const n=pos.length/3;pos.push(...a,...c,...d);idx.push(n,n+1,n+2);
      }
      const quad=(a,c,d,e)=>{
        if(a.every((x,i)=>Math.abs(x-e[i])<1e-8)||c.every((x,i)=>Math.abs(x-d[i])<1e-8)){tri(a,c,d);tri(a,d,e);return;}
        const n=pos.length/3;pos.push(...a,...c,...d,...e);idx.push(n,n+1,n+2,n,n+2,n+3);
      };
      const n=rows[0].length;
      for(let j=1;j<rows.length;j++)for(let i=0;i<n;i++) {const q=(i+1)%n;quad(rows[j-1][i],rows[j-1][q],rows[j][q],rows[j][i]);}
      for(let i=1;i<n-1;i++){tri(rows[0][0],rows[0][i+1],rows[0][i]);tri(rows.at(-1)[0],rows.at(-1)[i],rows.at(-1)[i+1]);}
      const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,chunk((u+v)/2),lift);
    }
  }
  const ribbon=(mat,a,c,left,right,top,bot,opt)=>loft(mat,a,c,s=>[[left(s),top(s)],[right(s),top(s)],[right(s),bot(s)],[left(s),bot(s)]],opt);
  const constant=x=>()=>x;
  const strip=(mat,a,c,left,right,off,depth)=>ribbon(mat,a,c,typeof left==='function'?left:constant(left),typeof right==='function'?right:constant(right),s=>Math.max(0,h(s)+off),s=>Math.max(0,h(s)+off-depth));
  strip('concrete',25,L-25,s=>-halfWidth(s),halfWidth,-.18,.38);
  strip('asphalt',0,L,s=>-halfWidth(s)+1.5,s=>halfWidth(s)-1.5,0,.16);
  for(const d of BOX_CENTRES) ribbon('concrete',A,C,constant(d-1.91),constant(d+1.91),s=>Math.max(0,h(s)-.54),s=>Math.max(0,h(s)-girderDepth(s)));
  // Flat-map retaining cheeks support the two road ramps outside the original structure.
  for(const [a,c] of [[15,A],[C,L-15]])for(const o of [-1,1]) ribbon('concrete',a,c,s=>o*(halfWidth(s)-.6)-.25,s=>o*(halfWidth(s)-.6)+.25,s=>Math.max(0,h(s)-.54),()=>0,{lift:y=>Math.max(0,Math.min(1,y/8))});
  // Structural furniture stops at the abutments. The ordinary embankment roads
  // beyond them merge/diverge; provider pavement/paint owns those approaches.
  for(const sign of [-1,1]) {
    strip('concrete',A,C,s=>sign<0?-halfWidth(s):halfWidth(s)-1.5,s=>sign<0?-halfWidth(s)+1.5:halfWidth(s),.18,.35);

  }
  loft('concrete',A,C,s=>{const y=h(s);return [[-.15,y+.82],[.15,y+.82],[.30,y+.25],[.30,y],[-.30,y],[-.30,y+.25]];});
  // 14 pairs of independent square/rectangular shafts with inverted-pyramid capitals.
  for(const s of PIER_S.slice(1,-1)) {
    const main=MAIN_PIERS.includes(s), y=h(s)-girderDepth(s), capH=main?1.9:1.2,shaftTop=y-capH;
    if(shaftTop<=0)continue;
    for(const d of BOX_CENTRES) {
      const ck=chunk(s),along=main?5.1:2.6;
      b.box('concrete',s,d,shaftTop/2,along,2.6,shaftTop,ck,yy=>Math.max(0,Math.min(1,yy/shaftTop)));
      // Capital loft is vertical, local stationary rectangle changing plan section.
      const pos=[],idx=[],bottom=shaftTop,top=y+.04;
      for(const [yy,len,w] of [[bottom,along,2.6],[top,main?7.1:4.6,4.6]])for(const [u,v] of [[-1,-1],[-1,1],[1,1],[1,-1]])pos.push(...b.xyz(s+u*len/2,d+v*w/2,yy));
      for(let i=0;i<4;i++){const j=(i+1)%4;idx.push(i,j,i+4,j,j+4,i+4);}
      idx.push(0,2,1,0,3,2,4,5,6,4,6,7);
      const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,'concrete',ck);
      if(main)b.box('concrete',s,d,.45,8,6,0.9,ck,0);
    }
  }
  // Segment joints: narrow, offset vertical strips on four outer box webs. No texture.
  if(near)for(let s=A+4;s<C-5;s+=3.5) {
    const top=h(s)-.58,bot=Math.max(0,h(s)-girderDepth(s)+.06);
    if(top-bot<.1)continue;
    for(const d of BOX_CENTRES)for(const o of [-1,1]){
      const ds=d+o*1.92,v=[b.xyz(s-.02,ds,top),b.xyz(s+.02,ds,top),b.xyz(s+.02,ds,bot),b.xyz(s-.02,ds,bot)];
      const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(v.flat(),3));g.setIndex(o<0?[0,1,2,0,2,3]:[0,2,1,0,3,2]);g.computeVertexNormals();b.put(g,'joint',chunk(s));
    }
  }
  // Rails, posts and lamp stems share the steel batch in each station chunk.
  // Rectangular beams already use 12 triangles; there are no radial subdivisions.
  for(const o of [-1,1]) {
    for(const y of [.52,.92,1.25]) strip('steel',A,C,s=>o*(halfWidth(s)-.15)-.045,s=>o*(halfWidth(s)-.15)+.045,y,.075);
    for(let s=A;s<=C;s+=near?7:21){const d=o*(halfWidth(s)-.15),y=h(s);b.beam('steel',[s,d,y+.18],[s,d,y+1.31],near?.085:.12,undefined,chunk(s));}
  }
  if(near) {
    for(const o of [-1,1]){
      strip('paint',0,L,s=>o*(halfWidth(s)-1.9)-.065,s=>o*(halfWidth(s)-1.9)+.065,.028,.009);
      for(let s=4;s<L-4;s+=12){const d=o*3.65;strip('paint',s,Math.min(s+3,L),d-.065,d+.065,.028,.009);}
    }
    // Third lane appears only where the mapped southern carriageways become 3 lanes.
    for(const o of [-1,1])for(let s=C-120;s<C-5;s+=12)strip('paint',s,s+3,o*7.0-.065,o*7.0+.065,.028,.009);
  }
  // Slender single-arm luminaires alternate along the two outside kerbs.
  for(let s=A+10,i=0;s<C-10;s+=35,i++) {
    const o=i%2?1:-1,d=o*(halfWidth(s)-.55),y=h(s),ck=chunk(s);
    b.beam('steel',[s,d,y+.18],[s,d,y+8.2],.13,undefined,ck);
    b.beam('steel',[s,d,y+8.2],[s,d-o*1.6,y+8.5],.10,undefined,ck);
    b.box(near?'lamp':'steel',s,d-o*1.6,y+8.44,.82,.30,.16,ck);
  }
  return b.finish();
}
