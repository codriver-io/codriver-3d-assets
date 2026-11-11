import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./beffroi-hotel-de-ville-lille-parts.js';
export const BASE=simplify(local(FOOTPRINTS[0],SPEC.origin),.1);const p=local(FOOTPRINTS[0],SPEC.origin),a=p[2],c=p[13],D=new THREE.Vector2(c[0]-a[0],c[1]-a[1]).normalize(),N=[-D.y,D.x],center=[1.1,1];export const xyz=(u,y,v)=>[center[0]+D.x*u+N[0]*v,y,center[1]+D.y*u+N[1]*v];const square=w=>[[-w/2,-w/2],[w/2,-w/2],[w/2,w/2],[-w/2,w/2]].map(([u,v])=>{const p=xyz(u,0,v);return[p[0],p[2]];});export const HEAD_POSTS=Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>{const u=-6.3+j*4.2,v=-6.3,t=i*Math.PI/2;return[u*Math.cos(t)-v*Math.sin(t),u*Math.sin(t)+v*Math.cos(t)];})).flat().filter((p,i,a)=>a.findIndex(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<.01)===i);
export function create({detail='near'}={}){const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),angle=-Math.atan2(D.y,D.x),box=(mat,u,y,v,w,h,d)=>b.box(mat,xyz(u,y,v),[w,h,d],angle);
 s.shell(BASE,17,{pitch:near?5.5:8.5,bay:3,band:3.2,mullion:.8,wall:'brick',glass:'glass'});
 // Long brick panels and pale reinforced-concrete verticals are adjoining
 // faces,not a colour decal over an opaque shaft.
 const sp=square(9.8),cuts=[0,.65,3,3.35,3.9,5.9,6.45,6.8,9.15,9.8],mats=['stone','brick','glass','stone','brick','stone','glass','brick','stone'];
 for(let i=0;i<4;i++){const a=sp[i],c=sp[(i+1)%4],at=(u,y)=>[a[0]+(c[0]-a[0])*u/9.8,y,a[1]+(c[1]-a[1])*u/9.8];for(let j=0;j<cuts.length-1;j++)s.quad(mats[j],at(cuts[j],17),at(cuts[j],68),at(cuts[j+1],68),at(cuts[j+1],17));}
 // Projecting bell head: freestanding piers and a recessed central service
 // core leave several metres of real air behind the observation bays.
 const shoulder=square(9.8),head=square(13.2);for(let i=0;i<4;i++)s.quad('stone',[shoulder[i][0],68,shoulder[i][1]],[head[i][0],70,head[i][1]],[head[(i+1)%4][0],70,head[(i+1)%4][1]],[shoulder[(i+1)%4][0],68,shoulder[(i+1)%4][1]]);s.cap(head,70,'stone');s.shell(square(5.2),84,{bottom:70,capTop:false,capBottom:false,windows:false,wall:'brick'});
 const secondary=Array.from({length:4},(_,i)=>[-4.2,0,4.2].map(u=>{const v=-6.3,t=i*Math.PI/2;return[u*Math.cos(t)-v*Math.sin(t),u*Math.sin(t)+v*Math.cos(t)];})).flat();for(const[u,v]of[...HEAD_POSTS,...secondary]){const g=new THREE.BoxGeometry(.6,13,.6),n=g.attributes.normal,ix=g.index.array,keep=[];for(let k=0;k<ix.length;k+=3)if(Math.abs(n.getY(ix[k]))<.5)keep.push(ix[k],ix[k+1],ix[k+2]);g.setIndex(keep);g.clearGroups();g.rotateY(angle);g.translate(...xyz(u,76.5,v));b.put(g,'pier');}
 for(const[y,h,w]of[[73,.45,13.2],[79,.5,13.2],[83.5,1,13.2]])box('stone',0,y,0,w,h,w);
 for(const[u,v]of[[-6.3,-6.3],[6.3,-6.3],[6.3,6.3],[-6.3,6.3]])box('stone',u,85.7,v,.65,3.4,.65);
 // Three narrowing lantern stages,with genuine open slots around a thin core.
 for(const[y,top,w]of[[84,90,2.5],[90,94,2.0],[94,97.3,1.5]])s.shell(square(w),top,{bottom:y,capTop:false,capBottom:false,windows:false,wall:'brick'});
 for(const[y,w,h]of[[84.4,6.0,.8],[90,5.6,.45],[94,4.8,.45],[97,3.4,.6]])box('stone',0,y,0,w,h,w);
 for(const[lo,hi,w]of[[84,90.2,4.8],[90,94.2,3.8],[94,97,2.4]])for(const[u,v]of[[-w/2,-w/2],[w/2,-w/2],[w/2,w/2],[-w/2,w/2]])box('stone',u,(lo+hi)/2,v,.4,hi-lo,.4);
 const top=square(3.4),apex=xyz(0,101.5,0);for(let i=0;i<4;i++)s.tri('roof',[top[i][0],97.3,top[i][1]],apex,[top[(i+1)%4][0],97.3,top[(i+1)%4][1]]);b.bar('metal',xyz(0,101.4,0),xyz(0,104,0),.13);
 const m=s.finish();m.userData.identity='red-brick Art Deco shaft,pale open bell head,staged lantern and104 m needle';return m;}
