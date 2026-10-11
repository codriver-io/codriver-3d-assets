import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Group, Quaternion, Vector3 } from 'three';
import { bridgeBuilder } from './asset-geometry.js';
import { MERCIER, MERCIER_PROFILES } from './pont-honore-mercier-profile.js';

// BoxGeometry face order; a solid keeps only the faces somebody can see.
const PX=0,NX=1,PY=2,NY=3;
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

// Original procedural interpretation of the current paired provincial bridges,
// broad Seaway through-truss and the branching federal concrete viaducts.
export function createMercierPart(profile,{detail='near'}={}) {
  const far=detail==='far';
  // Far merges stone into concrete and drops paint, so a partition is 2-3 draws and the four runtime partitions stay at 10.
  const b=bridgeBuilder({...profile,meshStep:far?10:5},detail), h=profile.deckHeight, L=profile.BRIDGE_LENGTH;
  const {part,width}=profile.CHAMPLAIN, half=width/2, ramp=part.startsWith('laprairie');
  const {main,channel,fork}=profile.landmarks;
  const chunk=s=>detail==='near'?Math.floor(s/900):0;
  const stoneMat=far?'concrete':'stone',girderMat=far&&ramp?'concrete':'steel';
  // Deck-hugging ribbon with selectable faces (t top, b bottom, l/r sides): the same samples as strip(),
  // minus the faces that are buried or sit flush against another solid.
  function ribbon(mat,a,c,l,r,offset,thickness,faces,k=0){
    const step=far?10:5,samples=new Set([a,c]);
    for(let s=Math.floor(a/step)*step+step;s<c;s+=step){
      const i=profile.knots.findIndex(v=>v[0]>=s),from=profile.knots[Math.max(0,i-1)],to=profile.knots[Math.max(0,i)];
      if(from[1]!==to[1] || s%25===0)samples.add(s);
    }
    for(const v of profile.ALIGNMENT)if(v.s>a&&v.s<c)samples.add(v.s);
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
  // Box in bridge coordinates without its buried bottom (or any other skipped face).
  function block(mat,s,d,y,length,wide,tall,k=0,lift=1,skip=[]){
    const q=profile.bridgePoint(s,d,y),g=solid(length,tall,wide,skip);
    g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);b.put(g,mat,k,lift);
  }
  // Truss member: the far version is an open prism, because its ends always meet another member.
  const up=new Vector3(0,1,0);
  function member(mat,a,c,w,t=w,k=0){
    if(!far)return b.beam(mat,a,c,w,t,k);
    const av=new Vector3(...b.xyz(...a)),dir=new Vector3(...b.xyz(...c)).sub(av),len=dir.length();
    if(len<1e-5)return;
    const g=solid(w,len,t,[PY,NY]);
    g.applyQuaternion(new Quaternion().setFromUnitVectors(up,dir.normalize()));
    g.translate(...av.addScaledVector(dir,len/2).toArray());b.put(g,mat,0,1);
  }
  // Tapered pier: its top is buried under the cap and its base under the ground, so neither is drawn.
  function pier(s,top,wide,depth,k=0){
    if(top<1)return;
    const outline=[[-depth/2,-wide/2],[depth/2,-wide/2],[depth/2,wide/2],[-depth/2,wide/2]],pos=[],idx=[];
    for(const y of [-1,top])for(const [along,across] of outline){const f=y<0?1.12:1;pos.push(...b.xyz(s+along*f,across*f,y));}
    for(let i=0;i<4;i++){const j=(i+1)%4;idx.push(i,4+i,j,j,4+i,4+j);}
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    b.put(g,stoneMat,k,y=>Math.max(0,Math.min(1,(y+1)/(top+1))));
    block('concrete',s,0,top-0.3,depth+1,wide+1,0.6,k);
  }
  if(far){
    b.strip('concrete',0,L,-half,half,-0.13,0.65);
    b.strip('asphalt',0,L,-half+0.45,half-0.45,-0.02);
  }else{
    // Near: the slab top is only the two 0.45 m margins; the pavement is a closed 11 cm sheet standing on the slab,
    // so no concrete face lies hidden under (and coplanar with) the asphalt and its paint.
    ribbon('concrete',0,L,-half,half,-0.13,0.65,'blr');
    for(const [l,r] of [[-half,-half+0.45],[half-0.45,half]])b.strip('concrete',0,L,l,r,-0.13);
    ribbon('asphalt',0,L,-half+0.45,half-0.45,-0.02,0.11,'tlr');
  }
  // Barriers remain continuous; provider paint covers this fallback paint.
  // The base sits flush on the deck, so a barrier has no bottom face.
  for(const d of [-half+0.2,half-0.2]) {
    // Open the branch mouths instead of laying a barrier across turning lanes.
    const ranges=ramp?[[32,L]]:[[0,fork-30],[fork+38,L]];
    for(const [a,c] of ranges)ribbon('concrete',a,c,d-0.2,d+0.2,0.8,0.93,'tlr');
  }
  if(!far){
    for(const d of [-half+0.7,half-0.7])b.strip('paint',0,L,d-0.065,d+0.065,0.025);
    if(!part.endsWith('_in'))for(let s=0;s<L;s+=12)b.strip('paint',s,Math.min(s+3,L),-0.055,0.055,0.025);
  }
  // Deep open deck trusses on the river; concrete approaches use plate girders.
  // Far keeps the silhouette (chords, crown, rhythm of posts and diagonals) with half the members.
  function truss(a,c,top,bottom,sides=[-half+0.5,half-0.5],panels=10,roof=false,farPanels=Math.max(4,panels/2)){
    if(far){
      const n=farPanels,at=i=>a+(c-a)*i/n;
      for(const d of sides){
        for(let i=0;i<n;i++){
          const s=at(i),t=at(i+1);
          member('steel',[s,d,top(s)],[t,d,top(t)],0.46,0.52);
          if(i%2===0){const u=at(Math.min(n,i+2));member('steel',[s,d,bottom(s)],[u,d,bottom(u)],0.42,0.48);member('steel',[s,d,bottom(s)],[s,d,top(s)],0.28,0.32);}
          member('steel',[s,d,i%2?top(s):bottom(s)],[t,d,i%2?bottom(t):top(t)],0.3,0.32);
          if(roof && sides.length===2 && i%2===0)member('steel',[s,sides[0],top(s)],[s,sides[1],top(s)],0.3,0.32);
        }
        member('steel',[c,d,bottom(c)],[c,d,top(c)],0.28,0.32);
      }
      return;
    }
    for(const d of sides)for(let i=0;i<panels;i++){
      const s=a+(c-a)*i/panels,t=a+(c-a)*(i+1)/panels;
      b.beam('steel',[s,d,top(s)],[t,d,top(t)],0.46,0.52,chunk(s));
      b.beam('steel',[s,d,bottom(s)],[t,d,bottom(t)],0.42,0.48,chunk(s));
      b.beam('steel',[s,d,bottom(s)],[s,d,top(s)],0.28,0.32,chunk(s));
      b.beam('steel',[s,d,i%2?top(s):bottom(s)],[t,d,i%2?bottom(t):top(t)],0.3,0.32,chunk(s));
      if(roof && sides.length===2){
        b.beam('steel',[s,sides[0],top(s)],[s,sides[1],top(s)],0.3,0.32,chunk(s));
        b.beam('steel',[s,sides[0],top(s)],[t,sides[1],top(t)],0.17,0.18,chunk(s));
      }
    }
  }
  function support(s,depth=3.8,drop=null){
    const top=h(s)-(drop??(ramp||s>main+62?2.1:5.5));
    if(top<1.5)return;
    const at=profile.bridgePoint(s);
    // Keep shafts out of the lower ramp roadways at the two grade separations.
    if(MERCIER_PROFILES.some(other=>{if(other===profile)return false;const q=other.projectBridge(at.x,at.z);
      return !q.beyond && q.distance<other.CHAMPLAIN.width/2+5 && other.deckHeight(q.s)<top;
    }))return;
    if(ramp || s>main+62){
      // Slender concrete viaduct shafts with broad caps; keep the open spaces
      // seen beneath the current federal ramps instead of solid full-width walls.
      block('concrete',s,0,(top-1.2)/2,2.6,2.8,top+1.2,chunk(s),y=>Math.max(0,Math.min(1,(y+1.2)/(top+1.2))),[NY]);
      block('concrete',s,0,top-0.5,3.2,width,1,chunk(s));
      block('concrete',s,0,-0.6,4.6,4.8,1.2,chunk(s),0,[NY]);
    }else{
      pier(s,top,width-1.1,depth,chunk(s));
      block('concrete',s,0,-0.6,depth+2,width+1.3,1.2,chunk(s),0,[NY]);
    }
  }
  if(!ramp){
    const archA=main-60.935,archB=main+60.935;
    for(let a=110;a<archA-1;){const c=Math.min(a+71.6,archA);truss(a,c,s=>h(s)-0.85,s=>h(s)-5.5,undefined,8);support(a);a=c;}
    // Paired steel arch silhouettes: a curved upper chord over the roadway,
    // with open posts/diagonals and overhead transverse bracing.
    const arch=s=>h(s)+2+17*Math.sin(Math.PI*(s-archA)/(archB-archA));
    truss(archA,archB,arch,s=>h(s)-1.1,undefined,16,true,10);
    support(archA,5.6,1.3);support(archB,5.6,1.3);
    // The Seaway has one broad through-truss, NOT another duplicated arch.
    // Each carriageway supplies only its outer side; portal bars meet at median.
    const ca=channel-46.05,cb=channel+46.05,outer=part==='upstream'?half-0.45:-half+0.45;
    const crown=s=>{const t=(s-ca)/(cb-ca);return h(s)+8+5*Math.min(1,t/0.25,(1-t)/0.25);};
    truss(ca,cb,crown,s=>h(s)-1.3,[outer],16);
    for(let i=1;i<16;i+=far?2:1){
      const s=ca+(cb-ca)*i/16;
      member('steel',[s,outer,crown(s)],[s,-outer,crown(s)],0.34,0.42,chunk(s));
    }
    support(ca,5.2);support(cb,5.2);
    for(let s=archB+35;s<L-15;s+=35){if(s>ca-25&&s<cb+25)continue;support(s);}
    // Plate girders under the approach decks: the top is flush with the slab, so it is not drawn;
    // from the air only the outer web and the soffit read.
    for(const [a,c] of [[0,110],[archB,ca],[cb,L]])for(const d of [-half+1.5,half-1.5])ribbon('steel',a,c,d-0.25,d+0.25,-0.8,1.3,far?(d<0?'bl':'br'):'blr',chunk(a));
  }else{
    for(let s=28;s<L-18;s+=30)support(s);
    for(const d of [-half+1.3,half-1.3])ribbon(girderMat,0,L,d-0.24,d+0.24,-0.8,1.3,far?(d<0?'bl':'br'):'blr');
  }
  if(!far)for(let s=35;s<L-25;s+=48){
    const d=half-0.35;
    if(!ramp && ((Math.abs(s-main)<65)||(Math.abs(s-channel)<50)))continue;
    b.beam('rail',[s,d,h(s)+0.8],[s,d,h(s)+8.5],0.13,0.13,chunk(s));
    b.beam('rail',[s,d,h(s)+8.5],[s,d-2,h(s)+8.5],0.12,0.12,chunk(s));
    b.box('paint',s,d-2,h(s)+8.5,1,0.4,0.16,chunk(s));
  }
  const model=b.finish();model.name=profile.CHAMPLAIN.id;
  model.traverse(m=>{if(m.isMesh && m.material.name==='steel')m.material.color.set('#929e9c');});
  return model;
}
export function createMercier(options={}){
  const root=new Group();root.name=MERCIER.id;
  for(const p of MERCIER_PROFILES)root.add(createMercierPart(p,options));
  return root;
}
