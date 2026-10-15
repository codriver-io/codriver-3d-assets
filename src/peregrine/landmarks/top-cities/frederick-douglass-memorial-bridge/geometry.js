import { BufferGeometry, Float32BufferAttribute, Vector3, Mesh, MeshBasicMaterial, Raycaster, DoubleSide } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, LENGTH, START, END, PIERS, ARCHES, roadEdgesAt, outerAt, archAt } from './frederick-douglass-memorial-bridge-profile.js';

export function create({detail='near'}={}) {
  const near=detail==='near', b=bridgeBuilder(p,detail), contacts=[];
  const chunk=s=>near?Math.min(2,Math.max(0,Math.floor(s/LENGTH*3))):0;
  const at=(s,d,y)=>b.xyz(s,d,y), h=p.deckHeight;
  const terminal=(member,end,support,exclude=null)=>contacts.push({member,end:at(...end),support,exclude});
  const beam=(mat,a,c,w,depth=w,supports=null)=>{
    b.beam(mat,a,c,w,depth,chunk((a[0]+c[0])/2));
    if(supports) {const exclude={a:at(...a),c:at(...c),width:w,depth};terminal(mat,a,supports[0],exclude);terminal(mat,c,supports[1],exclude);}
  };
  // Closed variable-width station ribbons, including every mapped centreline break and overlook tip.
  function ribbon(mat,a,c,edges,offset,thick=0,ground=false) {
    const ss=new Set([a,c,...p.ALIGNMENT.map(q=>q.s).filter(s=>s>a&&s<c),...PIERS.flatMap(s=>[s-15,s,s+15]).filter(s=>s>a&&s<c)]);
    for(let s=a+(near?2.5:7.5);s<c;s+=near?2.5:7.5)ss.add(s);
    const stations=[...ss].sort((u,v)=>u-v),pos=[],idx=[],stride=thick?4:2;
    for(let i=0;i<stations.length;i++) {
      const s=stations[i],[l,r]=edges(s),y=h(s)+offset;
      for(const [d,yy] of thick?[[l,y],[r,y],[l,ground?0:Math.max(0,y-thick)],[r,ground?0:Math.max(0,y-thick)]]:[[l,y],[r,y]])pos.push(...at(s,d,yy));
      if(i){const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);
        if(thick)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
    }
    if(thick) {const u=(stations.length-1)*4;idx.push(0,2,1,1,2,3,u,u+1,u+2,u+1,u+3,u+2);}
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    b.put(g,mat,chunk((a+c)/2),ground?y=>Math.min(1,Math.max(0,y/Math.max(.1,h((a+c)/2)+offset))):1);
  }
  // Approach fill narrows into two separate ordinary roads; never a square full-width landing slab.
  for(const [a,c] of [[0,START],[END,LENGTH]])for(let side=0;side<2;side++)
    ribbon('asphalt',a,c,s=>roadEdgesAt(s)[side],0,0.05,true);
  for(let side=0;side<2;side++)ribbon('asphalt',START,END,s=>roadEdgesAt(s)[side],0);
  ribbon('concrete',START,END,s=>[outerAt(s,-1),outerAt(s,1)],-.20,1.0);
  // Central low concrete median is narrowed and returned to pavement at the street joins.
  ribbon('concrete',START,END,()=>[-.6,.6],.25,.45);
  for(const side of [-1,1]) {
    const walkEdges=s=>{
      const e=roadEdgesAt(s),inner=side<0?e[0][0]-.20:e[1][1]+.20,outer=outerAt(s,side);
      return side<0?[outer,inner]:[inner,outer];
    };
    ribbon('concrete',0,LENGTH,walkEdges,.20,.55);
    // Raised traffic barrier along road edge: height eases down into ordinary curb on the ovals.
    for(let s=0;s<LENGTH;s+=near?2.5:5){const c=Math.min(LENGTH,s+(near?2.5:5)),y=.20+.72*Math.min(1,s/12,(LENGTH-s)/12),e=roadEdgesAt(s),f=roadEdgesAt(c);
      const d=side<0?e[0][0]-.35:e[1][1]+.35,dd=side<0?f[0][0]-.35:f[1][1]+.35;
      beam('concrete',[s,d,h(s)+y/2],[c,dd,h(c)+y/2],.32,y);}
    // Perimeter rails follow the four overlook bulbs and return into the walk at real landings.
    const step=near?2.5:5,stations=[];for(let s=0;s<LENGTH;s+=step)stations.push(s);stations.push(LENGTH);
    const railY=s=>h(s)+.20+1.15*Math.min(1,s/5,(LENGTH-s)/5);
    for(let i=0;i<stations.length-1;i++){
      const s=stations[i],c=stations[i+1],d=outerAt(s,side)-side*.16,dd=outerAt(c,side)-side*.16;
      beam('rail',[s,d,railY(s)],[c,dd,railY(c)],.10,.10,[i===0?'concrete':'rail',i===stations.length-2?'concrete':'rail']);
      if(i% (near?1:2)===0 || i===stations.length-2){
        const q=[s,d,h(s)+.20],t=[s,d,railY(s)];beam('rail',q,t,.075,.075,['concrete','rail']);
      }
      if(near)for(const rise of [.48,.80])beam('rail',[s,d,h(s)+.20+rise*Math.min(1,s/5,(LENGTH-s)/5)],[c,dd,h(c)+.20+rise*Math.min(1,c/5,(LENGTH-c)/5)],.035,.035,[i===0?'concrete':'rail',i===stations.length-2?'concrete':'rail']);
    }
    for(let s=START+20;s<END-10;s+=25) {
      const d=side*13.3,y=h(s)+.20;
      beam('rail',[s,d,y],[s,d,y+7.2],.16,.16,['concrete','lamp']);
      b.box('lamp',s,d,y+7.2,1.2,.42,.18,chunk(s));
    }
  }
  // I-shaped edge girders, observable open floorbeam space beneath the deck.
  for(const d of [-15.3,15.3]) {
    ribbon('girder',START,END,()=>[d-.14,d+.14],near?-.30:-.42,near?1.45:1.33);
    for(const off of near?[-.30,-1.75]:[-1.75])ribbon('girder',START,END,()=>[d-.50,d+.50],off,.14);
  }
  for(let s=START+4;s<END-2;s+=near?6:18)beam('girder',[s,-15.3,h(s)-1.1],[s,15.3,h(s)-1.1],.35,1.1,['girder','girder']);
  // Two river supports: twin longitudinal concrete V limbs, joined by a submerged-looking low plinth.
  for(const s of PIERS) {
    b.box('concrete',s,0,1.05,9,32,2.1,chunk(s),0);
    for(const side of [-1,1])for(const sign of [-1,1]) {
      const q=ARCHES[sign<0?(s===PIERS[0]?0:1):(s===PIERS[0]?1:2)];
      const t=sign<0?1-17/(q.c-q.a):17/(q.c-q.a),tip=archAt(q,t,side);
      beam('concrete',[s,side*14.07,1.8],tip,3.4,2.6,['concrete','arch']);
    }
  }
  for(const s of [START,END]) {
    const y=Math.max(.1,h(s)-.2);
    b.box('concrete',s,0,y/2,5,37.338,y,chunk(s),v=>Math.max(0,v/y));
  }
  // Six independent white, variable hexagonal box ribs, without transverse bracing.
  for(const arch of ARCHES)for(const side of [-1,1]) {
    const n=near?96:40,pos=[],idx=[];
    for(let i=0;i<=n;i++) {
      const t=i/n,center=archAt(arch,t,side),q=new Vector3(...at(...center));
      const before=new Vector3(...at(...archAt(arch,Math.max(0,t-.001),side))),after=new Vector3(...at(...archAt(arch,Math.min(1,t+.001),side)));
      const tangent=after.sub(before).normalize(),normal=new Vector3(-p.bridgePoint(center[0]).tz,0,p.bridgePoint(center[0]).tx),up=new Vector3().crossVectors(normal,tangent).normalize();
      const central=arch===ARCHES[1],width=2.8956,crownDepth=central?2.1336:1.8288;
      const baseDepth=central?4.191:(t<.5?(arch.a===START?4.4196:4.1148):(arch.c===END?4.4196:4.1148));
      const depth=crownDepth+(baseDepth-crownDepth)*Math.abs(2*t-1);
      for(const [d,y] of [[-.5,0],[-.32,.5],[.32,.5],[.5,0],[.32,-.5],[-.32,-.5]])pos.push(...q.clone().addScaledVector(normal,d*width).addScaledVector(up,y*depth).toArray());
      if(i)for(let j=0;j<6;j++){const k=(j+1)%6,u=(i-1)*6,v=i*6;idx.push(u+j,v+j,u+k,u+k,v+j,v+k);}
    }
    for(let j=1;j<5;j++)idx.push(0,j,j+1,n*6,n*6+j+1,n*6+j);
    // This perimeter's normal points along the station tangent; reverse both
    // side faces and caps so exterior rays see outward normals.
    for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,'arch',chunk((arch.a+arch.c)/2));
    const supportMaterial=new MeshBasicMaterial({side:DoubleSide}),supportMesh=new Mesh(g,supportMaterial);supportMesh.updateMatrixWorld();
    terminal('arch',archAt(arch,0,side),'concrete');terminal('arch',archAt(arch,1,side),'concrete');
    // Every hanger embeds in its named arch and in a deck anchor, never at a cut boundary.
    const count=arch===ARCHES[1]?(near?16:8):(near?14:7);
    for(let k=0;k<count;k++) {
      const s=arch.a+(arch.c-arch.a)*(.12+.76*k/(count-1));
      const top=archAt(arch,(s-arch.a)/(arch.c-arch.a),side),bottom=[s,top[1],h(s)-.3];
      if(top[2]<h(s)+1.5)continue;
      const ray=new Raycaster(new Vector3(...at(s,top[1],h(s)+.5)),new Vector3(0,1,0));
      const hit=ray.intersectObject(supportMesh)[0];
      if(!hit)throw new Error('Hanger has no arch support at '+s);
      top[2]=hit.point.y+.03;
      beam('hanger',bottom,top,near?.065:.09,near?.065:.09,['concrete','arch']);
      // Anchor plates are buried in the composite slab; omit their hidden faces.
    }
    supportMaterial.dispose();
  }
  // Far keeps the lane rhythm; surface offsets are 12 cm so depth analysis can order them.
  for(let lane=0;lane<2;lane++)for(const fraction of [1/3,2/3])for(let s=3;s<LENGTH-3;s+=near?12:24)
    ribbon('paint',s,Math.min(s+3,LENGTH),q=>{const [a,c]=roadEdgesAt(q)[lane],d=a+(c-a)*fraction;return[d-.06,d+.06];},.12);
  const root=b.finish();
  // Ordinary curb returns are clipped exactly to flat grade at their two endpoints.
  for(const mesh of root.children){const pos=mesh.geometry.attributes.position;for(let i=0;i<pos.count;i++)if(pos.getY(i)<0)pos.setY(i,0);mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  Object.defineProperty(root.userData,'contacts',{value:contacts});return root;
}
