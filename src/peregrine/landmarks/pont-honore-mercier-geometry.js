import { Group } from 'three';
import { bridgeBuilder } from './asset-geometry.js';
import { MERCIER, MERCIER_PROFILES } from './pont-honore-mercier-profile.js';

// Original procedural interpretation of the current paired provincial bridges,
// broad Seaway through-truss and the branching federal concrete viaducts.
export function createMercierPart(profile,{detail='near'}={}) {
  const b=bridgeBuilder({...profile,meshStep:detail==='far'?10:5},detail), h=profile.deckHeight, L=profile.BRIDGE_LENGTH;
  const {part,width}=profile.CHAMPLAIN, half=width/2, ramp=part.startsWith('laprairie');
  const {main,channel,fork}=profile.landmarks;
  b.strip('concrete',0,L,-half,half,-0.13,0.65);
  b.strip('asphalt',0,L,-half+0.45,half-0.45,-0.02);
  // Barriers remain continuous; provider paint covers this fallback paint.
  for(const d of [-half+0.2,half-0.2]) {
    // Open the branch mouths instead of laying a barrier across turning lanes.
    const ranges=ramp?[[32,L]]:[[0,fork-30],[fork+38,L]];
    for(const [a,c] of ranges)b.strip('concrete',a,c,d-0.2,d+0.2,0.8,0.86);
  }
  for(const d of [-half+0.7,half-0.7])b.strip('paint',0,L,d-0.065,d+0.065,0.025);
  if(detail==='near' && !part.endsWith('_in'))for(let s=0;s<L;s+=12)b.strip('paint',s,Math.min(s+3,L),-0.055,0.055,0.025);
  const chunk=s=>detail==='near'?Math.floor(s/900):0;
  // Deep open deck trusses on the river; concrete approaches use plate girders.
  function truss(a,c,top,bottom,sides=[-half+0.5,half-0.5],panels=10,roof=false){
    if(detail==='far')panels=Math.max(4,panels/2);
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
      b.box('concrete',s,0,(top-1.2)/2,2.6,2.8,top+1.2,chunk(s),y=>Math.max(0,Math.min(1,(y+1.2)/(top+1.2))));
      b.box('concrete',s,0,top-0.5,3.2,width,1,chunk(s));
      b.box('concrete',s,0,-0.6,4.6,4.8,1.2,chunk(s),0);
    }else{
      b.pier(s,top,width-1.1,depth,false,chunk(s));
      b.box('concrete',s,0,-0.6,depth+2,width+1.3,1.2,chunk(s),0);
    }
  }
  if(!ramp){
    const archA=main-60.935,archB=main+60.935;
    for(let a=110;a<archA-1;){const c=Math.min(a+71.6,archA);truss(a,c,s=>h(s)-0.85,s=>h(s)-5.5,undefined,8);support(a);a=c;}
    // Paired steel arch silhouettes: a curved upper chord over the roadway,
    // with open posts/diagonals and overhead transverse bracing.
    const arch=s=>h(s)+2+17*Math.sin(Math.PI*(s-archA)/(archB-archA));
    truss(archA,archB,arch,s=>h(s)-1.1,undefined,16,true);
    support(archA,5.6,1.3);support(archB,5.6,1.3);
    // The Seaway has one broad through-truss, NOT another duplicated arch.
    // Each carriageway supplies only its outer side; portal bars meet at median.
    const ca=channel-46.05,cb=channel+46.05,outer=part==='upstream'?half-0.45:-half+0.45;
    const crown=s=>{const t=(s-ca)/(cb-ca);return h(s)+8+5*Math.min(1,t/0.25,(1-t)/0.25);};
    truss(ca,cb,crown,s=>h(s)-1.3,[outer],16);
    for(let i=1;i<16;i++){
      const s=ca+(cb-ca)*i/16;
      b.beam('steel',[s,outer,crown(s)],[s,-outer,crown(s)],0.34,0.42,chunk(s));
    }
    support(ca,5.2);support(cb,5.2);
    for(let s=archB+35;s<L-15;s+=35){if(s>ca-25&&s<cb+25)continue;support(s);}
    for(const [a,c] of [[0,110],[archB,ca],[cb,L]])for(const d of [-half+1.5,half-1.5])b.strip('steel',a,c,d-0.25,d+0.25,-0.8,1.3,chunk(a));
  }else{
    for(let s=28;s<L-18;s+=30)support(s);
    for(const d of [-half+1.3,half-1.3])b.strip('steel',0,L,d-0.24,d+0.24,-0.8,1.3);
  }
  if(detail==='near')for(let s=35;s<L-25;s+=48){
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
