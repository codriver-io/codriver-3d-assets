import polygonClipping from 'polygon-clipping';
import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './st-michaels-church-cluj-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const cut=polygonClipping,strip=r=>r.slice(0,-1),tri=(mat,p,hs,F,out)=>{const a=p.map(v=>new THREE.Vector2(...v)),h=hs.map(r=>r.map(v=>new THREE.Vector2(...v))),all=[...a,...h.flat()];for(const t of THREE.ShapeUtils.triangulateShape(a,h))face(mat,t.map(j=>F(all[j].x,all[j].y)),out);};
const capPoly=(mat,p,y)=>tri(mat,strip(p[0]),p.slice(1).map(strip),(x,z)=>[x,y,z],[0,1,0]);
const pointed=(x,w,lo,spring,rise)=>[[x-w/2,lo],[x+w/2,lo],...Array.from({length:(near?20:12)+1},(_,j)=>{const u=1-j*2/(near?20:12);return[x+u*w/2,spring+rise*(1-Math.abs(u))**.6]})];
const circle=(x,y,r,n=near?24:16)=>Array.from({length:n},(_,j)=>[x+r*Math.cos(j*2*Math.PI/n),y+r*Math.sin(j*2*Math.PI/n)]);
const rounded=r=>r.map(v=>v.map(x=>Math.round(x*1e5)/1e5));
function facade(f,lo,hi,holes=[],open=false){const outer=[[0,lo],[f.l,lo],[f.l,hi],[0,hi]],solid=cut.difference([outer],...holes.map(h=>[h]));
 for(let y=lo,k=0;y<hi-.0001;y+=near?1.4:4,k++)for(let x=0,j=0;x<f.l-.0001;x+=near?3.5:7,j++){const cell=rect(x+(near?3.5:7)/2,y+(near?1.4:4)/2,near?3.5:7,near?1.4:4);for(const p of cut.intersection(solid,[cell]))tri((j*3+k*5)%11===0?'stone2':'stone',strip(p[0]),p.slice(1).map(strip),(u,v)=>f.p(u,v),f.out);}
 if(!open)for(const h of holes)tri('glass',h,[],(u,v)=>f.p(u,v),f.out);
}
const nave=[[-33.5,-9],[13,-12.2],[13,17.3],[-32.3,19.2]],choir=[[13,-2.75],[29.7,-3.29],[33.3,-1.22],[34,3.34],[31.8,7.64],[30.01,8.7],[13,9.7]],south=[[10.56,17.3],[13.36,15.73],[20.29,13.95],[22.01,10.84],[22.99,9.06],[13,9.7]],north=[[13,-8.56],[18.62,-9.07],[20.55,-5.1],[23.08,-2.72],[13,-2.75]],body=cut.union([nave],[choir],[south],[north]);
// Low mapped foundation includes the surveyed buttress feet; no square paving.
prism(LOCAL_RINGS[0],0,.65,'stone','stone');
for(const p of body){const r=strip(p[0]);r.forEach((a,i)=>{const f=frame(r,i),n=Math.max(1,Math.round(f.l/7.8)),step=f.l/n,hs=[];for(let j=0;j<n;j++){const x=(j+.5)*step;if(step>2.5)hs.push(pointed(x,Math.min(4.3,step*.65),6.4,16.2,4.1));}facade(f,.65,24.8,hs);for(const h of hs){const cx=(Math.min(...h.map(v=>v[0]))+Math.max(...h.map(v=>v[0])))/2,w=Math.max(...h.map(v=>v[0]))-Math.min(...h.map(v=>v[0]));for(const dx of [-w/6,w/6]){const u=cx+dx,bar=[[u-.065,6.4],[u+.065,6.4],[u+.065,17],[u-.065,17]];tri('stone',bar,[],(u,v)=>{const q=f.p(u,v);return q.map((c,k)=>c+f.out[k]*.04)},f.out);}if(near){const rr=.72,ro=circle(cx,18.3,rr),ri=circle(cx,18.3,rr-.13);tri('stone',ro,[ri],(u,v)=>{const q=f.p(u,v);return q.map((c,k)=>c+f.out[k]*.04)},f.out);}}});capPoly('roof',p,24.8);}
// Gable roof keeps mapped ends and a narrow crest; adjoining tile cells carry restrained colour rhythm.
const roofFace=(a,b,c,d)=>{const nx=near?28:12,ny=near?14:6,P=(u,v)=>a.map((x,k)=>(1-v)*((1-u)*x+u*b[k])+v*((1-u)*d[k]+u*c[k]));for(let j=0;j<nx;j++)for(let k=0;k<ny;k++)face((j*13+k*7)%17<3?'roof2':'roof',[P(j/nx,k/ny),P((j+1)/nx,k/ny),P((j+1)/nx,(k+1)/ny),P(j/nx,(k+1)/ny)],[0,1,0]);};
const west=[-32.9,37.3,5.1],east=[13,37.3,2.55];roofFace([-33.5,24.8,-9],[13,24.8,-12.2],east,west);roofFace([-32.3,24.8,19.2],[13,24.8,17.3],east,west);
face('stone',[[-33.5,24.8,-9],[-32.3,24.8,19.2],west],[-1,0,0]);face('stone',[[13,24.8,-12.2],east,[13,24.8,17.3]],[1,0,0]);
const choirRidgeA=[13,34.1,3.4],choirRidgeB=[29.6,34.1,2.9];roofFace([13,24.8,-2.75],[29.7,24.8,-3.29],choirRidgeB,choirRidgeA);roofFace([13,24.8,9.7],[30.01,24.8,8.7],choirRidgeB,choirRidgeA);for(let j=1;j<choir.length-1;j++){const a=choir[j],c=choir[(j+1)%choir.length];if(j===1||j===2||j===3||j===4)face('roof',[[a[0],24.8,a[1]],[c[0],24.8,c[1]],choirRidgeB],[0,1,0]);}
for(const [r,peak]of [[south,[16.5,31,12.3]],[north,[17,30.5,-5.5]]])r.forEach((a,i)=>{const c=r[(i+1)%r.length];face('roof',[[a[0],24.8,a[1]],[c[0],24.8,c[1]],peak],[0,1,0]);});
// Mapped buttress projections are tapered back to the nave wall, with three sloping weather caps.
const buttress=(cx,cz,dx,dz,w,depth,h)=>{const tx=-dz,tz=dx,P=(u,v,y)=>[cx+tx*u+dx*v,y,cz+tz*u+dz*v],half=w/2;for(const [lo,hi,d0,d1]of [[.65,8,depth,depth],[8,15,depth,depth*.75],[15,h,depth*.75,.25]]){const r=[[P(-half,0,lo),P(half,0,lo),P(half,d0,lo),P(-half,d0,lo)],[P(-half,0,hi),P(half,0,hi),P(half,d1,hi),P(-half,d1,hi)]];for(let j=0;j<4;j++){const k=(j+1)%4;face('stone',[r[0][j],r[0][k],r[1][k],r[1][j]],[j===0?-dx:j===2?dx:j===1?tx:-tx,0,j===0?-dz:j===2?dz:j===1?tz:-tz]);}face('stone',r[1],[0,1,0]);}};
for(const x of [-31.4,-20.2,-11.6,-3.5,5.2]){const z=19.2-(x+32.3)*1.9/45.3;buttress(x,z-.15,0,1,1.55,2,24.6);}for(const x of [-32.5,-24.2,-14.1]){const z=-9-(x+33.5)*3.2/46.5;buttress(x,z+.15,0,-1,1.5,1.9,24.6);}
for(const [x,z,dx,dz]of [[14.3,15.4,.2,1],[19.4,14.3,.4,1],[21.9,12.4,.9,.4],[26.3,8.9,0,1],[31,8.2,.6,1],[33.8,4.1,1,.1],[31.8,-2.5,.6,-1],[26,-3.2,0,-1],[20,-5.5,.8,-.7]])buttress(x,z,dx,dz,1.35,1.8,24.6);
// Small nave dormers and the modest chancel bell fleche remain separate from the tall tower.
for(const x of [-18,1]){const z=12.1,y=29.4;block(x,z,1.5,1.5,y,y+1.25,'stone','roof',[[y+.2,y+1]],1.5,'glass',.55);hip(x,z,1.7,1.7,y+1.25,y+2.2,'roof',.02);}
// Chancel fleche seated on the 34.1 m ridge.
block(25,3.04,1.9,1.9,32,37.1,'stone','slate',[[34.8,36.5]],1.9,'glass',.55);spin([[1.1,37.1],[1.2,37.5],[.4,38.5],[.1,39.2]],'slate',25,3.04,near?16:8);
// Neo-Gothic north tower, independent clock stage and 76 m octagonal spire.
const tx=-1, tz=-17.8,w=12.4,d=10.8,ch=.9,tower=[[tx-w/2+ch,tz-d/2],[tx+w/2-ch,tz-d/2],[tx+w/2,tz-d/2+ch],[tx+w/2,tz+d/2-ch],[tx+w/2-ch,tz+d/2],[tx-w/2+ch,tz+d/2],[tx-w/2,tz+d/2-ch],[tx-w/2,tz-d/2+ch]];
tower.forEach((a,i)=>{const f=frame(tower,i),flat=f.l>3;for(const [lo,hi,base,spring,rise]of [[.65,12,.8,6,2],[12,25,15,21,2.7],[25,38,27,33,2.7],[38,48,39.5,44.1,2.9]]){const hs=flat?[pointed(f.l/2,Math.min(3.8,f.l*.6),base,spring,rise)]:[];facade(f,lo,hi,hs,lo===38);} });
cap('stone',tower,38);cap('stone',tower,48);
for(const yy of [11.7,24.7,37.7,47.7]){const r=tower.map(([x,z])=>[tx+(x-tx)*1.025,tz+(z-tz)*1.025]);prism(r,yy,yy+.3,'stone','stone');}
// Clock octagon has real round partitions, with hour ticks and hands, no numerals.
const oct=Array.from({length:8},(_,j)=>[tx+6*Math.cos(Math.PI/8+j*Math.PI/4),tz+6*Math.sin(Math.PI/8+j*Math.PI/4)]);
oct.forEach((a,i)=>{const f=frame(oct,i),h=circle(f.l/2,54.2,1.72);tri('stone',[[0,48],[f.l,48],[f.l,58.9],[0,58.9]],[h],(u,v)=>f.p(u,v),f.out);tri('clock',h,[],(u,v)=>f.p(u,v),f.out);for(let j=0;j<12;j++){const a=j*Math.PI/6,u=f.l/2+1.43*Math.sin(a),v=54.2+1.43*Math.cos(a),r=.055;tri('frame',[[u-r,v-.1],[u+r,v-.1],[u+r,v+.1],[u-r,v+.1]],[],(u,v)=>{const p=f.p(u,v);return p.map((c,k)=>c+f.out[k]*.03)},f.out);}for(const [u,v]of [[.7,.5],[-.2,1.05]])tri('frame',[[f.l/2-.07,54.2],[f.l/2+.07,54.2],[f.l/2+u+.07,54.2+v],[f.l/2+u-.07,54.2+v]],[],(u,v)=>{const p=f.p(u,v);return p.map((c,k)=>c+f.out[k]*.04)},f.out);});cap('stone',oct,58.9);prism(oct,58.9,59.3,'stone','stone');
for(let j=0;j<8;j++){const a=oct[j],c=oct[(j+1)%8];face('slate',[[a[0],59.3,a[1]],[c[0],59.3,c[1]],[tx,76,tz]],[Math.cos((j+.5)*Math.PI/4+Math.PI/8),.2,Math.sin((j+.5)*Math.PI/4+Math.PI/8)]);}
// Slim stone corner pinnacles terminate the square tower below its clock octagon.
for(const [dx,dz]of [[-5.5,-4.6],[5.5,-4.6],[-5.5,4.6],[5.5,4.6]]){block(tx+dx,tz+dz,.7,.7,.65,43,'stone','stone');spin([[.6,43],[.3,45],[.05,46]],'stone',tx+dx,tz+dz,near?12:8);}
block(tx,tz,.16,.16,76,80,'frame','frame');block(tx,tz,1.8,.16,78.3,78.48,'frame','frame');

return finish();
}
