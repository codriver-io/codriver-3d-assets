import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

const ANGLE = SPEC.bearing * Math.PI / 180;
export function world(u, y, v) { return [u * Math.cos(ANGLE) + v * Math.sin(ANGLE), y, -u * Math.sin(ANGLE) + v * Math.cos(ANGLE)]; }
const rect = (x0, x1, z0, z1) => [[x0,z0],[x1,z0],[x1,z1],[x0,z1]];
const oct = (r) => Array.from({length:8},(_,i)=>{const a=(22.5+i*45)*Math.PI/180;return [-8+r*Math.cos(a),4.6+r*Math.sin(a)];});

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m)=>{g.rotateY(ANGLE);b.put(g,m);};
  const box=(m,x,y,z,w,h,d,ang=0)=>{const g=new THREE.BoxGeometry(w,h,d);g.rotateY(ang);g.translate(x,y,z);put(g,m);};
  function quad(m,a,c,d,e) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));const pts=[a,c,d,e],idx=[];for(const t of [[0,1,2],[0,2,3]]) {const v=pts.map(p=>new THREE.Vector3(...p));if(v[t[1]].sub(v[t[0]]).cross(v[t[2]].sub(v[t[0]])).lengthSq()>1e-12)idx.push(...t);}g.setIndex(idx);g.computeVertexNormals();put(g,m);
  }
  const reveal=(m,a,c,d,e)=>quad(m,e,d,c,a);
  function cap(m,ring,y,up=true) {
    const ps=ring.map(p=>new THREE.Vector2(...p)),tris=THREE.ShapeUtils.triangulateShape(ps,[]);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ring.flatMap(([x,z])=>[x,y,z]),3));g.setIndex(tris.flatMap(t=>up?t.slice().reverse():t));g.computeVertexNormals();put(g,m);
  }
  function solid(m,ring,y0,y1) {
    ring.forEach((p,i)=>{const q=ring[(i+1)%ring.length];quad(m,[...p.slice(0,1),y0,p[1]],[p[0],y1,p[1]],[q[0],y1,q[1]],[q[0],y0,q[1]]);});cap(m,ring,y1);cap(m,ring,y0,false);
  }
  // Closed facade shell with actual recessed openings; no dark overlay on a solid wall.
  function facade(m,ring,y0,y1,pitch=3.18,windowWidth=1.22,windowH=2.15,arched=false,ribbed=false) {
    ring.forEach((p,i)=>{
      const q=ring[(i+1)%ring.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),tx=dx/len,tz=dz/len,nx=tz,nz=-tx;
      const at=(s,y,out=0)=>[p[0]+tx*s+nx*out,y,p[1]+tz*s+nz*out];
      const panel=(mat,s0,s1,a,z,out=0)=>quad(mat,at(s0,a,out),at(s0,z,out),at(s1,z,out),at(s1,a,out));
      const bays=Math.max(1,Math.round((len-1.8)/(windowWidth<1 ? 1.25 : near ? 3.75 : 5.8))),bp=(len-1.8)/bays;
      const rows=Math.max(1,Math.floor((y1-y0-1.3)/(near || windowWidth<1 ? pitch : pitch*2.5))), rp=(y1-y0-1.3)/rows;
      const pierOut=ribbed?.5:0,channelOut=ribbed?-.16:0;
      const channelMat=ribbed?'recess':m;
      panel(m,0,.9,y0,y1,pierOut);panel(m,len-.9,len,y0,y1,pierOut);
      for(let bay=0;bay<bays;bay++) {
        const s0=.9+bay*bp,sc=s0+bp/2,s1=s0+bp,ww=Math.min(windowWidth*(near || windowWidth<1 ? 1 : 1.5),bp*.63);
        const wl=sc-ww/2,wr=sc+ww/2,cl=sc-bp*.34,cr=sc+bp*.34;
        if(ribbed) {
          // Continuous terra-cotta piers bound recessed vertical channels, in both LODs.
          panel(m,s0,cl,y0,y1,pierOut);panel(m,cr,s1,y0,y1,pierOut);
          panel(channelMat,cl,wl,y0,y1,channelOut);panel(channelMat,wr,cr,y0,y1,channelOut);
          reveal(m,at(cl,y0,channelOut),at(cl,y1,channelOut),at(cl,y1,pierOut),at(cl,y0,pierOut));
          reveal(m,at(cr,y0,pierOut),at(cr,y1,pierOut),at(cr,y1,channelOut),at(cr,y0,channelOut));
          reveal(m,at(s0,y0,channelOut),at(s1,y0,channelOut),at(s1,y0,pierOut),at(s0,y0,pierOut));
          quad(m,at(s0,y1,channelOut),at(s1,y1,channelOut),at(s1,y1,pierOut),at(s0,y1,pierOut));
        }
        for(let row=0;row<rows;row++) {
          const lo=y0+row*rp,bot=lo+.52,top=Math.min(bot+windowH*(near || windowWidth<1 ? 1 : 1.5),lo+rp-.28),hi=lo+rp;
          panel(channelMat,ribbed?wl:s0,ribbed?wr:s1,lo,bot,channelOut);panel(channelMat,ribbed?wl:s0,ribbed?wr:s1,top,hi,channelOut);
          if(!ribbed) {panel(m,s0,wl,bot,top);panel(m,wr,s1,bot,top);}
          const inset=channelOut+(near?-.34:0);
          const glass=(bay+row+i)%9===0?'glow':'glass';
          if(arched) {
            const r=ww/2, spring=top-r;
            panel(glass,wl,wr,bot,spring,inset);
            const steps=near?8:4;
            for(let k=0;k<steps;k++) {
              const t0=Math.PI-k*Math.PI/steps,t1=Math.PI-(k+1)*Math.PI/steps;
              const a=sc+r*Math.cos(t0),z=sc+r*Math.cos(t1),ya=spring+r*Math.sin(t0),yb=spring+r*Math.sin(t1);
              quad(glass,at(a,spring,inset),at(a,ya,inset),at(z,yb,inset),at(z,spring,inset));
              quad(m,at(a,ya),at(a,top),at(z,top),at(z,yb));
              if(near) reveal(m,at(a,ya,inset),at(z,yb,inset),at(z,yb),at(a,ya));
            }
          } else panel(glass,wl,wr,bot,top,inset);
          if(near) {
          reveal(m,at(wl,bot,channelOut),at(wl,bot,inset),at(wl,top,inset),at(wl,top,channelOut));
          reveal(m,at(wr,bot,inset),at(wr,bot,channelOut),at(wr,top,channelOut),at(wr,top,inset));
          reveal(m,at(wl,bot,channelOut),at(wr,bot,channelOut),at(wr,bot,inset),at(wl,bot,inset));
          if(!arched) reveal(m,at(wl,top,inset),at(wr,top,inset),at(wr,top,channelOut),at(wl,top,channelOut));
          }
        }
        panel(channelMat,ribbed?wl:s0,ribbed?wr:s1,y0+rows*rp,y1,channelOut);
      }
    }); cap(m,ring,y1);cap(m,ring,y0,false);
  }
  // Mapped L-shaped tower/wings. Dimensions follow OSM rather than a generic 57 m square.
  const main=[[-19.65,-6.8],[-.4,-6.65],[3.05,-2.8],[3.05,15.05],[-19.65,15.05]];
  const west=rect(-19.65,-4.8,-40.05,-7.05),east=rect(3.4,35.45,-2.5,15.05);
  for(const ring of [main,west,east]) facade('stone',ring,0,7.2,7,1.9,5.6,true);
  facade('stone',main,7.2,112,3.45,1.22,2.15,false,true);facade('stone',main,112,128.6,17,1.55,13.8,true);
  facade('stone',west,7.2,74.8);facade('stone',east,7.2,74.8);
  for(const ring of [west,east]) {solid('stone',ring,74.8,77.2);solid('copper',ring,77.2,77.42);}
  // Upper square shoulder and gables, then four figure-bearing corner turrets.
  const shoulder=rect(-15.6,-.4,-2.9,12.1);
  solid('lamp',shoulder,128.6,133.2);facade('lamp',shoulder,133.2,147.5,10.5,1.25,7.8,true);
  for(const side of [0,1,2,3]) {
    const a=shoulder[side],c=shoulder[(side+1)%4],len=Math.hypot(c[0]-a[0],c[1]-a[1]),n=[(c[1]-a[1])/len,-(c[0]-a[0])/len];
    const A=[a[0]+n[0]*2.35,128.6,a[1]+n[1]*2.35],C=[c[0]+n[0]*2.35,128.6,c[1]+n[1]*2.35];
    const M=[(A[0]+C[0])/2,133.2,(A[2]+C[2])/2],back=p=>[p[0]-n[0]*2.35,p[1],p[2]-n[1]*2.35];
    // Gable prism meets the shaft roof and shoulder; its sloping edges are visible.
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...A,...M,...C],3));g.setIndex([0,1,2]);g.computeVertexNormals();put(g,'stone');
    quad('stone',A,back(A),back(M),M);quad('stone',M,back(M),back(C),C);
  }
  function cylinder(m,x,z,r,y0,y1,r1=r,n=8) {const g=new THREE.CylinderGeometry(r1,r,y1-y0,n);g.translate(x,(y0+y1)/2,z);put(g,m);}
  function figure(x,z,base,h,m='lamp') {
    // Grouped human silhouette: robed body, shoulders, paired arms and a head.
    cylinder(m,x,z,h*.1,base,base+h*.69,h*.17,near?6:4);
    box(m,x,base+h*.69,z,h*.45,h*.17,h*.2);
    for(const sign of [-1,1]) box(m,x+sign*h*.19,base+h*.5,z,h*.12,h*.35,h*.17);
    const g=new THREE.SphereGeometry(h*.105,near?8:5,near?5:3);g.translate(x,base+h*.9,z);put(g,m);
  }
  for(const [x,z] of [[-17.2,-4.5],[1.2,-4.5],[-17.2,13.7],[1.2,13.7]]) {
    cylinder('lamp',x,z,1.52,128.6,148.6);
    for(const [y,r,h] of [[128.6,1.85,.8],[140.8,1.75,.55],[145.2,1.8,.65],[147.7,1.95,.9]]) cylinder('lamp',x,z,r,y,y+h);
    cylinder('lamp',x,z,1.8,148.6,150.5,1.1);
    cylinder('lamp',x,z,1.65,149.4,150.1);
    const g=new THREE.SphereGeometry(1.1,8,near?6:3,0,Math.PI*2,0,Math.PI/2);g.translate(x,150.5,z);put(g,'lamp');
    figure(x,z+1.3,133.8,6.9,'stone');
  }
  // Octagonal bartizan: long narrow window triplets are retained in far.
  const crown=oct(7.55);solid('lamp',crown,147.5,150.1);
  solid('lamp',oct(7.95),147.5,148.1);solid('lamp',oct(8.1),149.4,150.1);
  facade('lamp',crown,150.1,162.2,11, .64,7.8,true);
  solid('lamp',oct(7.85),162.2,163.25);
  solid('lamp',oct(8.15),161.55,162.2);solid('lamp',oct(8.35),162.8,163.25);
  // Octagonal sloped dome, smaller decorated summit and shallow heraldic figures.
  const lower=oct(7.85),upper=oct(3.9);
  lower.forEach((p,i)=>{const j=(i+1)%8;quad('lamp',[p[0],163.25,p[1]],[upper[i][0],167.05,upper[i][1]],[upper[j][0],167.05,upper[j][1]],[lower[j][0],163.25,lower[j][1]]);});
  solid('lamp',upper,167.05,169.29);
  solid('lamp',oct(4.3),167.05,167.55);solid('lamp',oct(4.4),168.7,169.29);
  for(let i=0;i<8;i++) {const a=(i*45+22.5)*Math.PI/180;figure(-8+3.8*Math.cos(a),4.6+3.8*Math.sin(a),167.1,2.05);}
  // Lower giant reliefs lie against their named structural corner piers.
  for(const [x,z] of [[-19.0,-6],[2.4,14.4],[-19,14.4]]) figure(x,z,119.8,7.4,'stone');
  // Antenna equipment: a continuous anchored mast; repeated receivers merge by material.
  cylinder('metal',-8,4.6,.28,169.29,189.29,.12,near?6:4);
  cylinder('metal',-5.8,4.6,.16,169.29,184.5,.16,4);
  for(let y=172;y<183;y+=1.65) {
    box('metal',-6.9,y,4.6,2.2,.13,.13);
    cylinder('stone',-8.6,4.6,.42,y-.32,y+.32,.42,near?8:4);
  }
  // Theatre frontage belongs to tower's east wing; theatre auditorium remains unowned.
  box('stone',19.7,5.35,15.5,11.5,1.05,2.1);
  box('sign',19.7,5.35,16.58,10.3,.65,.08);
  {
    // Terra-cotta crown medallions and parapet teeth without applied photographic detail.
    for(let i=0;i<8;i++) {const a=i*Math.PI/4;box('lamp',-8+7.5*Math.cos(a),162.1,4.6+7.5*Math.sin(a),.65,.7,.6,a);}
  }
  return b.finish();
}
