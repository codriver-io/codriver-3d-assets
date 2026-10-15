import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
// Geographic frame is directly baked from the mapped cadastre, with no host rotation.
export const local=([lng,lat])=>[(lng-SPEC.origin[0])*111319.49*Math.cos(SPEC.origin[1]*Math.PI/180),(SPEC.origin[1]-lat)*111319.49];
export const DOME=[...local([7.25833,43.694538])];
const outline=FOOTPRINTS[0].slice(0,-1).map(local), court=FOOTPRINTS[2].slice(0,-1).map(local);

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const face=(mat,pts,n)=>{
    const p=pts.map(v=>new THREE.Vector3(...v));
    const cross=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0]));
    if(cross.dot(new THREE.Vector3(...n))<0)p.reverse();
    const g=new THREE.BufferGeometry().setFromPoints(p),idx=[];
    for(let i=1;i<p.length-1;i++)idx.push(0,i,i+1);
    g.setIndex(idx);g.computeVertexNormals();b.put(g,mat);
  };
  const panel=(mat,c,t,n,w,h,closed=false)=>{
    if(closed){
      // Eight shared vertices: closed wafer edges avoid exposed reverse faces,
      // while area-weighted normals and a 4 cm thickness keep the front flat.
      const q=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],nn=[-t[2],0,t[0]];
      const g=new THREE.BufferGeometry().setFromPoints(q.map(([u,v,d])=>new THREE.Vector3(c[0]+t[0]*u*w/2+nn[0]*d*.02,c[1]+v*h/2,c[2]+t[2]*u*w/2+nn[2]*d*.02)));
      g.setIndex([0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,0,4,7,0,7,3,1,2,6,1,6,5]);g.computeVertexNormals();b.put(g,mat);
    }
    else face(mat,[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([u,v])=>[c[0]+t[0]*u,c[1]+v,c[2]+t[2]*u]),n);
  };
  function ribbon(mat,a,c,y,h,offset=0){
    const dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),n=[dz/L,0,-dx/L];
    panel(mat,[(a[0]+c[0])/2+n[0]*offset,y,(a[1]+c[1])/2+n[2]*offset],[dx/L,0,dz/L],n,L,h,true);
  }
  const window=(x,z,y,t,n,w=1.3,h=2.45,index=0,balcony=true)=>{
    const pos=(dy,d)=>[x+n[0]*d,y+dy,z+n[2]*d];
    if(near)panel('shadow',pos(0,.12),t,n,w+.34,h+.28);
    panel(index%7===0?'glow':'glass',pos(0,.24),t,n,w,h);
    if(near){
      panel('iron',pos(0,.32),t,n,.10,h);
      panel('iron',pos(.1,.33),t,n,w,.09);
      if(balcony){
        const a=pos(-h/2-.18,.4);b.box('stone',a,[w+.65,.18,.8],Math.atan2(-t[2],t[0]));
        const A=pos(-h/2+.08,.83),C=pos(-h/2+.82,.83);
        panel('iron',C,t,n,w+.5,.08);panel('iron',A,t,n,w+.5,.08);
        for(let j=0;j<5;j++){const u=(j/4-.5)*(w+.45);panel('iron',[A[0]+u*t[0],(A[1]+C[1])/2,A[2]+u*t[2]],t,n,.055,.74);}
      }
    }else if(balcony)panel('iron',pos(-h/2+.45,.5),t,n,w+.4,.12);
  };
  // Shell follows the exact mapped outline. Continuous paired cornices bind the facade.
  for(const [ring,inner] of [[outline,false],[court,true]]){
    let area=0;ring.forEach((a,i)=>{const c=ring[(i+1)%ring.length];area+=a[0]*c[1]-a[1]*c[0];});
    for(let i=0;i<ring.length;i++){
      const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),sgn=(area>0?1:-1)*(inner?-1:1),n=[sgn*dz/L,0,-sgn*dx/L],t=[dx/L,0,dz/L];
      const h=inner?28.3:24;
      face('stone',[[a[0],0,a[1]],[c[0],0,c[1]],[c[0],h,c[1]],[a[0],h,a[1]]],n);
      for(const y of (near?[.5,6.4,19.6,23.65]:[19.6,23.65]))ribbon('stone',a,c,y,y===.5?1:.45,sgn*.3);
      if(L>2.8){
        const count=Math.max(1,Math.round(L/3.4));
        for(let j=0;j<count;j++){
          const s=(j+.5)/count,x=a[0]+dx*s,z=a[1]+dz*s;
          for(let f=0;f<5;f++)window(x,z,f===0?3.3:8+(f-1)*3.3,t,n,f===0?1.8:1.25,f===0?3.4:2.5,j+f,!inner&&f>0&&f<4);
          if(near&&!inner){
            const s2=j/count;panel('stone',[a[0]+dx*s2+n[0]*.22,12.6,a[1]+dz*s2+n[2]*.22],t,n,.4,12.7);
            panel('shadow',[x+n[0]*.16,21.5,z+n[2]*.16],t,n,2.3,2.8);
            panel('glass',[x+n[0]*.29,21.5,z+n[2]*.29],t,n,1.2,2.2);
          }
        }
      }
    }
  }
  // Continuous pink mansard. Top is a true ring with courtyard opening.
  const inset=outline.map(([x,z])=>[x*.91,z*.91]);
  for(let i=0;i<outline.length;i++){
    const a=outline[i],c=outline[(i+1)%outline.length],A=inset[i],C=inset[(i+1)%outline.length];
    face('pink',[[...a.slice(0,1),24,a[1]],[c[0],24,c[1]],[C[0],28.3,C[1]],[A[0],28.3,A[1]]],[(a[0]+c[0])/2,1,(a[1]+c[1])/2]);
    ribbon('copper',A,C,28.3,.35);
    const L=Math.hypot(c[0]-a[0],c[1]-a[1]);
    if(L>6){const n=[-(c[1]-a[1])/L,0,(c[0]-a[0])/L],t=[(c[0]-a[0])/L,0,(c[1]-a[1])/L];
      for(let j=0;j<Math.floor(L/3.8);j++){
        const s=(j+.5)/Math.floor(L/3.8),x=(a[0]+(c[0]-a[0])*s)*.97,z=(a[1]+(c[1]-a[1])*s)*.97;
        b.box('stone',[x,25.3,z],[1.95,2.4,1.5],Math.atan2(-t[2],t[0]));
        panel('glass',[x+n[0]*.86,25.4,z+n[2]*.86],t,n,1.05,1.65);
        if(near)b.box('stone',[x,26.6,z],[2.3,.25,1.75],Math.atan2(-t[2],t[0]));
      }
    }
  }
  const contour=inset.map(p=>new THREE.Vector2(...p)),hole=court.map(p=>new THREE.Vector2(...p));
  const all=[...inset,...court];for(const ids of THREE.ShapeUtils.triangulateShape(contour,[hole]))face('shadow',ids.map(i=>[all[i][0],28.3,all[i][1]]),[0,1,0]);
  // Royal Lounge: lower oval glazed dome in the internal courtyard.
  const hall=local([7.25802,43.694691]);
  const lathe=(mat,profile,x,z,segments=near?32:20,sx=1,sz=1)=>{const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),segments);g.scale(sx,1,sz);g.translate(x,0,z);b.put(g,mat);};
  lathe('glass',[[0,7.2],[9.5,7.2],[9.5,8],[9,9.2],[7,11.1],[4,12.2],[0,12.6]],...hall,near?32:16,1,1.25);
  // The iconic corner rotunda: white two-storey drum, pink bulging cap, verdigris lantern.
  const [cx,cz]=DOME;
  lathe('stone',[[0,0],[7.45,0],[7.45,19.2],[0,19.2]],cx,cz);
  for(const y of [6.4,19.6])lathe('stone',[[7.4,y-.25],[7.95,y-.25],[7.95,y+.2],[7.4,y+.35]],cx,cz);
  for(let i=0;i<12;i++){
    const a=i*Math.PI*2/12,n=[Math.sin(a),0,Math.cos(a)],t=[Math.cos(a),0,-Math.sin(a)];
    for(const y of [8,11.3,14.6,17.9])window(cx+n[0]*7.7,cz+n[2]*7.7,y,t,n,1.25,2.45,i,true);
    window(cx+n[0]*7.68,cz+n[2]*7.68,21.5,t,n,1.2,2.1,i,false);
    const p=(u,y)=>[cx+n[0]*7.8+t[0]*u,y,cz+n[2]*7.8+t[2]*u];
    const arch=[p(-1.25,0.5),p(1.25,.5),p(1.25,3.1)];
    for(let j=0;j<=8;j++){const q=j*Math.PI/8;arch.push(p(1.25*Math.cos(q),3.1+1.25*Math.sin(q)));}
    face('glass',arch,n);
    if(near){const a2=a+Math.PI/12;b.bar('stone',[cx+7.65*Math.sin(a2),6.6,cz+7.65*Math.cos(a2)],[cx+7.65*Math.sin(a2),18.9,cz+7.65*Math.cos(a2)],.42);}
  }
  lathe('stone',[[0,23.5],[6.45,23.5],[6.45,27.9],[0,27.9]],cx,cz);
  lathe('stone',[[6.4,23.6],[6.9,23.8],[6.9,24.2],[6.4,24.45]],cx,cz);
  lathe('pink',[[0,27.8],[6.35,27.8],[6.45,29],[6.15,31.4],[5.25,33.7],[3.75,35.4],[1.85,36.5],[0,36.6]],cx,cz);
  lathe('copper',[[0,36.3],[2,36.3],[2,36.65],[1.4,36.85],[1.25,37.35],[.9,37.6],[.8,38.2],[.35,38.5],[0,38.6]],cx,cz);
  for(let i=0;i<12;i++){
    const a=i*Math.PI*2/12,n=[Math.sin(a),0,Math.cos(a)],t=[Math.cos(a),0,-Math.sin(a)];
    window(cx+n[0]*6.5,cz+n[2]*6.5,25.9,t,n,1.12,2.2,i,false);
    if(near){const g=new THREE.TorusGeometry(.46,.12,5,12);g.rotateY(a);g.translate(cx+n[0]*5.88,30.1,cz+n[2]*5.88);b.put(g,'stone');}
  }
  // Geometric rooftop lettering, using only original line strokes (no external font).
  const glyph={L:[[0,1,0,0],[0,0,.6,0]],E:[[0,0,0,1],[0,1,.6,1],[0,.5,.5,.5],[0,0,.6,0]],N:[[0,0,0,1],[0,1,.6,0],[.6,0,.6,1]],G:[[.6,1,0,1],[0,1,0,0],[0,0,.6,0],[.6,0,.6,.5],[.6,.5,.3,.5]],R:[[0,0,0,1],[0,1,.6,1],[.6,1,.6,.5],[.6,.5,0,.5],[0,.5,.6,0]],S:[[.6,1,0,1],[0,1,0,.5],[0,.5,.6,.5],[.6,.5,.6,0],[.6,0,0,0]],C:[[.6,1,0,1],[0,1,0,0],[0,0,.6,0]],O:[[0,0,0,1],[0,1,.6,1],[.6,1,.6,0],[.6,0,0,0]]};
  for(const [i,ch] of [...'LE NEGRESCO'].entries()){
    if(!glyph[ch])continue;const a=-1.5+i*.3,n=[Math.sin(a),0,Math.cos(a)],t=[Math.cos(a),0,-Math.sin(a)];
    for(const [u,v,U,V] of glyph[ch]){
      const p=(s,y)=>[cx+n[0]*6.9+t[0]*(s-.3)*1.5,28+y*1.8,cz+n[2]*6.9+t[2]*(s-.3)*1.5];
      b.bar('sign',p(u,v),p(U,V),near?.095:.13);
    }
    b.bar('iron',[cx+n[0]*6.9,27.6,cz+n[2]*6.9],[cx+n[0]*6.9,27.9,cz+n[2]*6.9],.07);
  }
  // Flagpole rooted in the lantern; a tricolour flag, and three entrance flags.
  const flag=(x,z,y,h=2)=>{
    b.bar('iron',[x,y,z],[x,y+h,z],.065);
    for(let i=0;i<3;i++)panel(['glass','stone','pink'][i],[x+.18+i*.32,y+h-.4,z],[1,0,0],[0,0,1],.32,.65);
  };
  flag(cx,cz,38.45,2.15);
  // Rear entrance is on Rue de Rivoli, opposing the seafront.
  const entry=local([7.25761,43.69463]);
  b.box('iron',[entry[0]-.9,3.8,entry[1]],[2.5,.25,7]);
  for(const dz of [-2.4,0,2.4])flag(entry[0],entry[1]+dz,4,2.6);
  const root=b.finish();root.userData.landmarkFeatures=['pink corner dome','verdigris lantern','white Belle Époque facade','iron balconies','LE NEGRESCO letters','Royal Lounge courtyard dome'];return root;
}
