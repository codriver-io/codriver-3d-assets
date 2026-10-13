import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p,L,N,S,STAYED_START as A,STAYED_END as Z,edge,roadEdgesAt,BRIDGE_START as BS,BRIDGE_END as BE } from './queen-elizabeth-ii-bridge-profile.js';
export const STAYS_PER_FAN=14,FAR_STAY_INDICES=[0,2,5,8,11,13];
export const PIER_STATIONS=[...Array.from({length:21},(_,i)=>BS+200+(A-BS-400)*i/20),...Array.from({length:18},(_,i)=>Z+50+(BE-Z-250)*i/17),N-118,N-62,S+62,S+118];
export function stayEndpoints(tower,direction,side,i){
  const u=i/(STAYS_PER_FAN-1),main=tower===N?direction===1:direction===-1;
  const s=tower+direction*(main?24+196*u:18+156*u);
  const y=76+59*u,half=(y<96?3.3-.4*(y-53)/43:2.9-.25*(y-96)/41)/2;
  return {top:[tower+direction*(half-.015),side*9.15,y],bottom:[s,side*9.65,p.deckHeight(s)+.16]};
}
export function create({detail='near'}={}){
  const near=detail==='near',b=bridgeBuilder(p,detail),xyz=b.xyz,h=p.deckHeight,contacts=[];
  const ck=s=>near?Math.min(2,Math.max(0,Math.floor(s/L*3))):0;
  function put(pos,idx,mat,chunk=0,lift=1){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,chunk,lift);}
  function samples(a,c){const s=new Set([a,c]);for(let v=Math.ceil(a/(near?4:18))*(near?4:18);v<c;v+=near?4:18)if(v>a)s.add(v);if(!near)for(let v=Math.ceil(a/4)*4;v<c;v+=4)if(v>a&&(Math.abs(v-BS)<100||Math.abs(v-BE)<100))s.add(v);for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)s.add(q.s);return [...s].sort((x,y)=>x-y);}
  // A closed ribbon with station-dependent width, so rails/kerbs follow the same taper.
  function ribbon(mat,a,c,left,right,offset,depth=0){
    for(let u=a;u<c-1e-6;){const v=Math.min(c,(Math.floor((u+1e-5)/(L/3))+1)*L/3),ss=samples(u,v),pos=[],idx=[],n=depth?4:2;
      for(const s of ss){const l=typeof left==='function'?left(s):left,r=typeof right==='function'?right(s):right,d=typeof depth==='function'?depth(s):depth;
        for(const [x,y] of n===4?[[l,offset],[r,offset],[l,offset-d],[r,offset-d]]:[[l,offset],[r,offset]])pos.push(...xyz(s,x,h(s)+y));}
      for(let j=1;j<ss.length;j++){const a=(j-1)*n,c=j*n;idx.push(a,a+1,c,a+1,c+1,c);if(n===4)idx.push(a+2,c+2,a+3,a+3,c+2,c+3,a,c,a+2,a+2,c,c+2,a+1,a+3,c+1,a+3,c+3,c+1);}
      if(n===4){const end=(ss.length-1)*n;idx.push(0,2,1,1,2,3,end,end+1,end+2,end+1,end+3,end+2);}
      put(pos,idx,mat,ck(u));u=v;
    }
  }
  function contact(name,point,support,material){contacts.push({name,point:xyz(...point),support,material});}
  function beam(mat,a,c,width,depth=width,supports=null,lift=1){b.beam(mat,a,c,width,depth,ck((a[0]+c[0])/2),lift);if(supports){contact(`${mat}-${contacts.length}-start`,a,...supports[0]);contact(`${mat}-${contacts.length}-end`,c,...supports[1]);}}
  function tube(mat,a,c,radius,supports){
    const av=new THREE.Vector3(...xyz(...a)),bv=new THREE.Vector3(...xyz(...c)),axis=bv.clone().sub(av);
    const g=new THREE.CylinderGeometry(radius,radius,axis.length(),near?6:4,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());b.put(g,mat,ck(a[0]));
    if(supports){contact(`stay-${contacts.length}-top`,a,...supports[0]);contact(`stay-${contacts.length}-anchor`,c,...supports[1]);}
  }
  // Composite slab; underside rises to zero thickness at grade instead of dipping below it.
  ribbon('concrete',BS+100,BE-100,s=>-edge(s),edge,-.15,.42);
  ribbon('asphalt',BS,BE,s=>roadEdgesAt(s,L)[0][0],s=>roadEdgesAt(s,L)[0][1],0);
  for(const side of [-1,1]){
    ribbon('kerb',BS,BE,s=>side<0?-edge(s):roadEdgesAt(s,L)[0][1],s=>side<0?roadEdgesAt(s,L)[0][0]:edge(s),.16,s=>Math.min(.3,h(s)+.16));
    ribbon('rail',BS,BE,s=>side*edge(s)-.15,s=>side*edge(s)+.15,.65,.32);
    // Guardrail terminals descend into the kerb at both grade ends.
    for(const s of [BS,BE])beam('rail',[s,side*(edge(s)-.15),h(s)+.16],[s,side*(edge(s)-.15),h(s)+.60],.3,.3,[[`landing-${s}`,'kerb'],['guardrail','rail']]);
    for(let s=BS+4;s<BE;s+=near?5:15)beam('rail',[s,side*(edge(s)-.15),h(s)+.16],[s,side*(edge(s)-.15),h(s)+.60],.12,.12,[[`kerb-${side}`,'kerb'],['guardrail','rail']]);
  }
  // Five continuous plate girders under viaducts; two deeper edge girders on the stayed span.
  for(const [a,c,depth,ds] of [[BS+200,A,2.6,[-8,-4,0,4,8]],[A,Z,2,[-9.65,9.65]],[Z,BE-200,2.6,[-8,-4,0,4,8]]]){
    for(const d of ds)ribbon('steel',a,c,d-.16,d+.16,-.57,depth-.57);
    for(let s=a+4;s<c;s+=near?15:40){beam('steel',[s,ds[0],h(s)-.65],[s,ds.at(-1),h(s)-.65],.28,.32,[[`girder-${ds[0]}`,'steel'],[`girder-${ds.at(-1)}`,'steel']]);}
  }
  for(const s of PIER_STATIONS){
    const depth=s>A&&s<Z?2:2.6,top=h(s)-depth,capBottom=top-1.5,foot=1.1;
    b.box('concrete',s,0,.55,8,9,1.1,ck(s),0);
    b.box('concrete',s,0,(foot+capBottom)/2,3.8,4.8,capBottom-foot,ck(s),y=>Math.max(0,Math.min(1,(y-foot)/(capBottom-foot))));
    b.box('concrete',s,0,top-.75,5.5,20,1.5,ck(s));
  }
  // Independent paired columns; open between them above and below roadway.
  for(const s of [N,S]){
    for(const side of [-1,1]){
      b.box('concrete',s,side*9.15,.8,12,8,1.6,ck(s),0);
      b.box('concrete',s,side*9.15,27.3,5.2,3.5,51.4,ck(s),y=>Math.max(0,Math.min(1,(y-1.6)/51.4)));
      // Steel box masts, modest transverse taper with flat plate faces.
      const pos=[],idx=[];
      for(const [y,w,len] of [[53,2.7,3.3],[96,2.25,2.9],[137,1.95,2.65]])for(const [u,d] of [[-len/2,-w/2],[len/2,-w/2],[len/2,w/2],[-len/2,w/2]])pos.push(...xyz(s+u,side*9.15+d,y));
      for(let j=1;j<3;j++)for(let i=0;i<4;i++){const a=(j-1)*4+i,c=(j-1)*4+(i+1)%4,e=j*4+i,f=j*4+(i+1)%4;idx.push(a,e,c,c,e,f);}
      idx.push(0,1,2,0,2,3,8,10,9,8,11,10);put(pos,idx,'pylon',ck(s));
      for(const direction of [-1,1])for(let i=0;i<STAYS_PER_FAN;i++){
        if(!near&&!FAR_STAY_INDICES.includes(i))continue;
        const {top,bottom}=stayEndpoints(s,direction,side,i);
        tube('cable',top,bottom,near?.085:.36,[[`pylon-${s}-${side}`,'pylon'],[`deck-anchor-${bottom[0]}-${side}`,'kerb']]);
        if(near){b.box('steel',bottom[0],bottom[1],h(bottom[0])+.28,.9,.7,.24,ck(bottom[0]));}
      }
    }
    b.box('concrete',s,0,50.5,6,20.8,1.4,ck(s));
    if(near)for(const side of [-1,1])for(let y=58;y<136;y+=8)b.box('steel',s+1.72,side*9.15,y,.12,1.8,.12,ck(s));
  }
  // Undivided four-lane fallback: three dashed lane dividers, two solid edges.
  if(near)for(const side of [-1,1])ribbon('paint',BS,BE,s=>side*(roadEdgesAt(s,L)[0][1]-.5)-.06,s=>side*(roadEdgesAt(s,L)[0][1]-.5)+.06,.12);
  if(near)for(const d of [-3.7,0,3.7])for(let s=BS+2;s<BE-3;s+=near?15:30)ribbon('paint',s,Math.min(s+6,BE-1),d-.06,d+.06,.12);
  for(let s=BS+55;s<BE-55;s+=near?45:90){const side=Math.floor(s/45)%2?1:-1,d=side*(roadEdgesAt(s,L)[0][1]+.35),y=h(s);
    beam('rail',[s,d,y+.16],[s,d,y+9],.13,.13,[[`kerb-${side}`,'kerb'],['light-arm','rail']]);
    beam('rail',[s,d,y+9],[s,d-side*1.5,y+9],.13);
    b.box('lamp',s,d-side*1.5,y+9,.9,.4,.22,ck(s));
  }
  const root=b.finish();Object.defineProperty(root,'terminalContacts',{value:contacts});return root;
}
