import { assetBuilder, bridgeBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PROFILE, DECK_H as H, STRUCTURE_START as A, STRUCTURE_END as Z, HEEL as S, TOE, TOWER } from './pegasus-bridge-profile.js';
import { parts } from './pegasus-bridge-parts.js';

/** Original closed 1994 rolling-lift bridge. No photograph, texture or traced mesh. */
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const {box,beam,cylinder,disk,sector,put}=parts(b),deck=bridgeBuilder(PROFILE,detail);
 // Shared strips provide dense curve sampling and live road-fit attachment weights.
 deck.strip('concrete',0,PROFILE.BRIDGE_LENGTH,-7.8,7.8,-.28,.42);
 deck.strip('asphalt',0,PROFILE.BRIDGE_LENGTH,-3.7,3.7,-.025,.03);
 for(const side of [-1,1]) {
  const d=side*6;
  deck.strip('concrete',A,Z,side<0?-7.8:3.9,side<0?-3.9:7.8,.13,.24);
  // The exterior fascia reads the full closed crossing as a deep girder.
  deck.strip('edge',A,Z,side<0?-7.96:7.81,side<0?-7.81:7.96,-.28,1.2);
  // The movable plate girders, flanges and welded stiffeners.
  box('steel',(TOE+S)/2,H-.6,d,S-TOE,1.3,.38);
  for(const y of [H-1.22,H+.08])box('edge',(TOE+S)/2,y,d,S-TOE,.14,.65);
  for(let s=TOE+.5;s<S;s+=near?2.25:7.5)box('steel',s,H-.58,d,.13,1.12,.62);
  // Fixed heel platform, with outer columns and X bracing leaving open windows.
  box('edge',S+3,H+8.25,d,23,.55,2.2);
  box('steel',S+3,H+8.7,d,23,.25,2.45);
  beam('steel',[S-14,H,d],[S+1,H+20,d],.75,.72);
  beam('steel',[S+1,H+20,d],[S+14,H,d],.75,.72);
  beam('steel',[S+12,H,d],[S+12,H+8.35,d],.62,.65);
  beam('steel',[S-6,H,d],[S+5,H+8.35,d],.6,.56);
  beam('steel',[S+8,H,d],[S-3,H+8.35,d],.6,.56);
  box('steel',S+1,H+19.95,d,2.1,.6,1.05);
  // Two rolling quadrants, open quarter-circles, concentric rim and radial stiffeners.
  sector('edge',S-2,H+8.4,d,8.4,.78,1.25,near?32:12);
  sector('edge',S-2,H+8.4,d+side*.68,8.45,.16,.14,near?32:12);
  for(let i=0;i<=(near?10:4);i++) {
   const a=-Math.PI/2+i*Math.PI/(2*(near?10:4));
   beam('steel',[S-2+7.65*Math.cos(a),H+8.4+7.65*Math.sin(a),d],
    [S-2+8.38*Math.cos(a),H+8.4+8.38*Math.sin(a),d],.15,1.35);
  }
  // Long outer railing and closely spaced white balusters in near detail.
  const railD=side*7.55;
  for(const y of [.58,1.23])box('rail',(A+Z)/2,H+y,railD,Z-A,.07,.07);
  for(let s=A;s<=Z;s+=near?.65:4)box('rail',s,H+.66,railD,.06,1.28,.06);
  // Maintenance deck railing at the mechanism.
  for(const y of [H+9.28,H+9.95])box('rail',S+3,y,d+side*1.12,23,.06,.06);
  for(let s=S-8;s<=S+14;s+=near?1.5:5)box('rail',s,H+9.35,d+side*1.12,.07,1.3,.07);
  if(near) {
   // Flange seams, shoes and gussets on the portal, never separate mesh draws.
   for(const s of [S-14,S+14])box('edge',s,H+.15,d,1.7,.3,1.4);
   for(let q=1;q<6;q++) {
    const t=q/6;box('edge',S-14+15*t,H+20*t,d,.8,.22,.92);
   }
   for(let s=TOE+1;s<S;s+=2.25) {
    beam('edge',[s,H-1.03,-6],[s,H-1.03,6],.14,.22);
    for(const yy of [H-.93,H-.18])cylinder('edge',s,yy,d+side*.33,.075,.11,6);
   }
  }
 }
 // Tie the two side frames above the live carriageway (clear opening underneath).
 for(const s of [S-8,S+12])box('edge',s,H+8.1,0,.6,.55,12);
 box('steel',S+1,H+19.7,0,.72,.72,12);
 beam('steel',[S+1,H+19.9,-6],[S+12,H+8.7,6],.28,.3);
 beam('steel',[S+1,H+19.9,6],[S+12,H+8.7,-6],.28,.3);
 // The raised counterweight is a broad enclosed white block with folded reinforcement.
 box('steel',S+5,H+13.65,0,6.2,8.7,10.7);
 for(const d of [-5.42,5.42]) {
  beam('edge',[S+1.85,H+17.7,d],[S+8.1,H+13.4,d],.23,.18);
  beam('edge',[S+1.85,H+13.4,d],[S+8.1,H+17.7,d],.23,.18);
  beam('edge',[S+1.85,H+13.4,d],[S+8.1,H+9.35,d],.23,.18);
 }
 box('edge',S+5,H+13.4,0,6.45,.17,11);
 for(const s of [S+1.82,S+8.18]) {
  beam('edge',[s,H+17.82,-5.3],[s,H+13.48,5.3],.22,.18);
  beam('edge',[s,H+13.48,-5.3],[s,H+17.82,5.3],.22,.18);
  beam('edge',[s,H+13.25,-5.3],[s,H+9.4,5.3],.22,.18);
 }
 // Machinery/operator cabin sits in front of the housing on the maintenance level.
 box('steel',S-4,H+10.25,0,4.7,2.85,4.6);
 box('edge',S-4,H+11.75,0,5.05,.22,4.95);
 for(const d of [-2.35,2.35]) {
  box('glass',S-4,H+10.7,d,3.35,1.12,.12);
  if(near)for(const s of [S-5.7,S-4,S-2.3])box('steel',s,H+10.7,d+Math.sign(d)*.08,.08,1.2,.08);
 }
 box('glass',S-6.42,H+10.7,0,.12,1.12,3.1);
 // Fixed concrete abutments: feet remain at grade while caps fit to the deck.
 for(const s of [A+1,Z-1])box('concrete',s,-1.45,0,2,1.7,15.8,y=>Math.max(0,Math.min(1,(y+2.3)/1.7)));
 // Circular, cream control tower on its surveyed cadastre outline; dark green cantilever cab.
 const ts=TOWER.s,td=TOWER.lateral;
 cylinder('tower',ts,4.2,td,2.15,8.4,near?32:16,0);
 cylinder('roof',ts,8.5,td,3.25,2.1,near?32:16,0);
 cylinder('roof',ts,9.68,td,3.7,.26,near?32:16,0);
 // Deck-level catwalk reaches the tower's shaft from the portal's outer platform.
 // Both LODs retain the walkway and its handrails; feet stay planted when fitted.
 const c0=[S+12,H+.15,7.15],c1=[ts,H+.15,td-2.02];
 beam('edge',c0,c1,.9,.25);
 for(const offset of [-.43,.43]) {
  beam('rail',[c0[0],c0[1]+1.1,c0[2]+offset],[c1[0],c1[1]+1.1,c1[2]+offset],.075,.075);
  for(let i=0;i<=4;i++) {
   const t=i/4,ss=c0[0]+(c1[0]-c0[0])*t,dd=c0[2]+(c1[2]-c0[2])*t+offset;
   box('rail',ss,H+.7,dd,.07,1.2,.07);
  }
 }
 // Raised red/white barrier arms and round prohibition heads, outside both lanes.
 for(const s of [A+3,Z-3]) {
  box('edge',s,H+.45,-4.55,.32,.9,.32);
  box('red',s,H+2.5,-4.55,.14,5,.14);
  for(const y of (near?[1,1.8,2.6,3.4,4.2,4.8]:[1,2.6,4.2]))box('rail',s,H+y,-4.55,.18,.4,.18);
  disk('red',s,H+2.15,-4.55,.36,.08,near?20:8);
  for(const direction of [-1,1]) {
   disk('rail',s+direction*.07,H+2.15,-4.55,.28,.06,near?20:8);
   beam('red',[s+direction*.12,H+2.32,-4.72],[s+direction*.12,H+1.98,-4.38],.055,.045);
  }
 }
 // Cab glass separated from opaque curved band, with mullions.
 if(near) {
  for(let i=0;i<12;i++) {
   const a=i*2*Math.PI/12;
   box('glass',ts+3.17*Math.cos(a),8.7,td+3.17*Math.sin(a),.52,.88,.13,0);
  }
  // External red stair and landing wind around the concrete shaft.
  for(let i=0;i<32;i++) {
   const a=-Math.PI*.45+i*Math.PI*1.45/32,y=.2+i*7.2/32;
   box('red',ts+2.65*Math.cos(a),y,td+2.65*Math.sin(a),.65,.14,1.05,0);
   const a1=a+Math.PI*1.45/32;
   beam('red',[ts+3.13*Math.cos(a),y+1.05,td+3.13*Math.sin(a)],
    [ts+3.13*Math.cos(a1),y+1.275,td+3.13*Math.sin(a1)],.055,.055,0);
  }
  box('red',ts+2.3,7.5,td,2.3,.2,1.5,0);
  // Upper access stair descends to a horizontal catwalk into the tower cab.
  const landing=[S+20,7.55,td-2.3];
  beam('edge',[S+13,H+8.55,7.05],landing,.8,.28);
  beam('edge',landing,[ts,7.55,td-2.3],.9,.25);
  for(const o of [-.4,.4]) {
   beam('rail',[S+13,H+9.65,7.05+o],[landing[0],8.65,landing[2]+o],.075,.075);
   beam('rail',[landing[0],8.65,landing[2]+o],[ts,8.65,td-2.3+o],.075,.075);
  }
  // Freestanding trestle below the upper landing, fully outside the roadway.
  for(const o of [-.4,.4])box('edge',landing[0],3.74,landing[2]+o,.16,7.48,.16,y=>Math.max(0,Math.min(1,y/7.55)));
  for(let i=0;i<=12;i++) {
   const t=i/12,ss=S+13+7*t,dd=7.05+(landing[2]-7.05)*t,yy=H+8.55+(7.55-H-8.55)*t;
   box('edge',ss,yy+.05,dd,.9,.12,.75);
  }
  for(const s of [A+3,Z-3]) {
   box('edge',s,H+4.9,7.1,.12,9.5,.12);
   box('lamp',s,H+9.75,7.1,.24,.16,.22);
  }
 }
 // Keep highest thin apex fittings in both LODs.
 for(const d of [-6,6])box('edge',S+1,H+20.5,d,.11,1.1,.11);
 // Merge profile strips into the same material batches, with attributes intact.
 const g=deck.finish();g.children.forEach(m=>put(m.geometry.clone(),m.material.name,1,true));
 g.children.forEach(m=>{m.geometry.dispose();m.material.dispose();});
 return b.finish();
}
