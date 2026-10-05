import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PODIUM_RINGS } from './footprint.js';
import { PLAN, CENTER, taper, DECK, TIPS, facade, local, Surfaces, outward, hash } from './the-shard-parts.js';

export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), s=new Surfaces();
  // A closed, recessed occupied envelope shows through the narrow winter-garden fractures.
  const core=(i,y)=>[CENTER[0]+(PLAN[i][0]-CENTER[0])*taper(y)*.96,y,CENTER[1]+(PLAN[i][1]-CENTER[1])*taper(y)*.96];
  for(let i=0;i<8;i++)s.quad('seam',core(i,0),core((i+1)%8,0),core((i+1)%8,DECK),core(i,DECK),outward(i));
  s.face('roof',PLAN.map((_,i)=>core(i,DECK)),[0,1,0]);
  for(let i=0;i<8;i++) {
    const a=PLAN[i],c=PLAN[(i+1)%8], length=Math.hypot(c[0]-a[0],c[1]-a[1]);
    const normal=outward(i), inward=normal.map(v=>-v), gap=.48/length;
    const u0=gap, u1=1-gap, tip=u=>TIPS[i][0]+(TIPS[i][1]-TIPS[i][0])*(u-u0)/(u1-u0);
    const cols=Math.max(2,Math.round(length/(near?1.65:6.5))), pitch=near?3.35:10.05;
    // Disjoint glass cells: lighting replaces a pane rather than overlapping the glazing.
    for(let row=0,y=5.5;y<Math.max(...TIPS[i]);row++,y+=pitch) {
      for(let j=0;j<cols;j++) {
        const ua=u0+(u1-u0)*j/cols, ub=u0+(u1-u0)*(j+1)/cols;
        const ya=Math.min(y+pitch,tip(ua)), yb=Math.min(y+pitch,tip(ub));
        if(ya<=y&&yb<=y)continue;
        const lowa=Math.min(y,tip(ua)), lowb=Math.min(y,tip(ub));
        const h=hash(row+i*101,j+17), active=y<228&&(y<105||y>122);
        const mat=active&&h<.055?'glow':h>.86?'glassPale':h<.22?'glassCool':'glass';
        s.quad(mat,facade(i,ua,lowa),facade(i,ub,lowb),facade(i,ub,yb),facade(i,ua,ya),normal);
      }
    }
    // Blade backs and thickness are visible through the open crown, never an uncapped shell.
    const topa=tip(u0),topb=tip(u1);
    if(Math.min(topa,topb)>DECK)s.quad('glassCool',facade(i,u1,DECK,-.22),facade(i,u0,DECK,-.22),facade(i,u0,topa,-.22),facade(i,u1,topb,-.22),inward);
    for(const u of [u0,u1]) {
      const p=facade(i,u,140),v=[p[0]-facade(i,.5,140)[0],0,p[2]-facade(i,.5,140)[2]];
      s.quad('frame',facade(i,u,5.5,-.22),facade(i,u,5.5),facade(i,u,tip(u)),facade(i,u,tip(u),-.22),v);
      b.bar('frame',facade(i,u,5.5,-.04),facade(i,u,tip(u)-.16,-.04),.2,.35);
    }
    s.quad('frame',facade(i,u0,topa),facade(i,u1,topb),facade(i,u1,topb,-.22),facade(i,u0,topa,-.22),[0,1,0]);
    // A subtle horizontal grid; far keeps one line every second occupied floor.
    for(let y=5.5;y<Math.min(...TIPS[i])-1;y+=near?3.35:10.05) {
      b.bar('frame',facade(i,u0,y,.06),facade(i,u1,y,.06),near?.105:.14,.25);

    }
    for(const y of [270,282,294])if(y<Math.min(...TIPS[i])-2)
      b.bar('light',facade(i,u0+.05,y,-.08),facade(i,u1-.05,y,-.08),.12,.26);
    for(let j=1;j<cols;j++) {
      const u=u0+(u1-u0)*j/cols;
      b.bar('frame',facade(i,u,5.5,.03),facade(i,u,tip(u)-.3,.03),near?.065:.1,.18);
    }
    // Recessed street lobby, attached columns and a modest canopy beam, all within the outline.
    s.quad('glassCool',facade(i,u0,0,-.65),facade(i,u1,0,-.65),facade(i,u1,5.5,-.65),facade(i,u0,5.5,-.65),normal);
    b.bar('frame',facade(i,u0,5.35,-.35),facade(i,u1,5.35,-.35),.3,.9);
    for(let j=0;j<=Math.max(2,Math.round(length/4));j++){
      const u=u0+(u1-u0)*j/Math.max(2,Math.round(length/4));
      b.bar('frame',facade(i,u,.15,-.43),facade(i,u,5.3,-.43),.18,.45);
    }
  }
  // The two mapped 70/74 m backpack wings are part of this building, not surrounding context.
  PODIUM_RINGS.forEach((ring,k)=>{
    const p=ring.map(local),height=k?70:74, center=p.reduce((v,q)=>[v[0]+q[0]/p.length,v[1]+q[1]/p.length],[0,0]);
    const plan=p.map(q=>[q[0]+(center[0]-q[0])*.015,q[1]+(center[1]-q[1])*.015]);
    const area=plan.reduce((t,a,i)=>{const c=plan[(i+1)%plan.length];return t+a[0]*c[1]-c[0]*a[1];},0);
    for(let i=0;i<plan.length;i++) {
      const a=plan[i],c=plan[(i+1)%plan.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      const n=area>0?[c[1]-a[1],0,a[0]-c[0]]:[a[1]-c[1],0,c[0]-a[0]];
      const nx=n[0]/len,nz=n[2]/len, pt=(u,y,o=0)=>[a[0]+(c[0]-a[0])*u+nx*o,y,a[1]+(c[1]-a[1])*u+nz*o];
      const cols=Math.max(2,Math.round(len/(near?1.6:7.5))),step=near?3.7:11.1;
      for(let y=0,row=0;y<height;y+=step,row++)for(let j=0;j<cols;j++) {
        const mat=hash(row+51,j+i*11)<.04?'glow':i%2?'glass':'glassCool';
        s.quad(mat,pt(j/cols,y),pt((j+1)/cols,y),pt((j+1)/cols,Math.min(height,y+step)),pt(j/cols,Math.min(height,y+step)),n);
      }
      for(let y=3.7;y<height;y+=step)b.bar('frame',pt(.005,y,.03),pt(.995,y,.03),near?.1:.14,.19);
      for(let j=1;j<cols;j++)b.bar('frame',pt(j/cols,.15,.02),pt(j/cols,height-.15,.02),.08,.14);
    }
    s.face('roof',plan.map(([x,z])=>[x,height,z]),[0,1,0]);
  });
  s.flush(b);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');if(o.material.name.startsWith('glass')){o.material.roughness=.36;o.material.metalness=.16;}}});
  return root;
}
