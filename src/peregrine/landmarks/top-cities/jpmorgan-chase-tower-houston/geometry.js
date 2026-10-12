import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, DESIGN } from './config.js';
import { PLAN, surfaceBuilder } from './jpmorgan-chase-tower-houston-parts.js';

// A closed tessellated facade: windows replace wall cells, never overlay a solid backing.
// The west cut face has narrow mullions and sill bands, unlike the granite grid on four sides.
const litPane=(row,col,face)=>{
  let h=Math.imul(row+1,374761393)^Math.imul(col+1,668265263)^Math.imul(face+1,1274126177);
  h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296<0.09;
};
export function create({ detail = 'near' } = {}) {
  const far=detail==='far', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const m=Object.fromEntries(Object.keys(PALETTES.light).map(k=>[k,surfaceBuilder()]));
  const pitch=(DESIGN.topFloor-DESIGN.lobby)/(DESIGN.rows-1);
  PLAN.forEach((p,i)=>{
    const q=PLAN[(i+1)%PLAN.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);
    const n=[dz/L,-dx/L], cut=i===5;
    const xyz=(u,y,inset=0)=>[p[0]+dx*u/L-n[0]*inset,y,p[1]+dz*u/L-n[1]*inset];
    const panel=(mat,u0,u1,y0,y1,inset=0)=>{
      if(u1<=u0 || y1<=y0)return;
      m[mat].quad(xyz(u0,y0,inset),xyz(u0,y1,inset),xyz(u1,y1,inset),xyz(u1,y0,inset));
    };
    // Three tiny mapped corner bevels remain granite, emphasizing the five main elevations.
    if(L<6){panel('granite',0,L,0,DESIGN.roof);return;}
    const cols=Math.max(2,Math.round(L/(far?5.8:2.95))), w=L/cols;
    const pier=cut?(far?0.16:0.10):(far?1.05:0.82);
    const window=(u0,u1,y0,y1,lit)=>{
      const inset=!far && y1<DESIGN.lobby ? 0.18 : 0;
      panel(lit?'glow':'glass',u0,u1,y0,y1,inset);
      if(!inset)return;
      // Reveal winding faces into each opening; contiguous to stone and inset glass.
      const A=xyz(u0,y0),B=xyz(u0,y1),C=xyz(u1,y1),D=xyz(u1,y0);
      const a=xyz(u0,y0,inset),bb=xyz(u0,y1,inset),c=xyz(u1,y1,inset),d=xyz(u1,y0,inset);
      m.granite.quad(A,a,bb,B);m.granite.quad(B,bb,c,C);
      m.granite.quad(C,c,d,D);m.granite.quad(D,d,a,A);
    };
    for(let col=0;col<cols;col++) {
      const u0=col*w+Math.max(pier/2,col===0?0.6:0),u1=(col+1)*w-Math.max(pier/2,col===cols-1?0.6:0);
      panel('granite',col*w,u0,0,DESIGN.roof);panel('granite',u1,(col+1)*w,0,DESIGN.roof);
      panel('granite',u0,u1,0,0.6);
      window(u0,u1,0.6,DESIGN.lobby-1.1,false);
      panel('granite',u0,u1,DESIGN.lobby-1.1,DESIGN.lobby+0.55);
      const step=far?2:1;
      for(let row=0;row<DESIGN.rows;row+=step) {
        const y0=DESIGN.lobby+row*pitch+0.55;
        const y1=Math.min(DESIGN.lobby+(row+step-1)*pitch+0.55+(cut?pitch-0.4:DESIGN.windowHeight),300.5);
        window(u0,u1,y0,y1,litPane(row,col,i));
        panel('granite',u0,u1,y1,row+step<DESIGN.rows?DESIGN.lobby+(row+step)*pitch+0.55:DESIGN.roof);
      }
    }
  });
  m.roof.cap(PLAN,DESIGN.roof); // flat cap: no invented crown or mast
  for(const [mat,s] of Object.entries(m)) if(s.count())b.put(s.geometry(),mat);
  return b.finish();
}
